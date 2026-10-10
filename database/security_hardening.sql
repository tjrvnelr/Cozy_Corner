-- Run this once in the Supabase SQL Editor after supabase_schema.sql.
-- It is safe to rerun.

-- Every foreign-key column used by order_items has a supporting index.
CREATE INDEX IF NOT EXISTS order_items_menu_item_id_idx
  ON public.order_items (menu_item_id);

-- A view should use the permissions and RLS policies of the querying role.
CREATE OR REPLACE VIEW public.customer_order_summary
WITH (security_invoker = true)
AS
SELECT
  o.id AS order_id,
  o.order_number,
  c.name AS customer_name,
  o.fulfillment_method,
  o.total,
  p.method AS payment_method,
  p.status AS payment_status,
  o.ordered_at
FROM public.orders AS o
JOIN public.customers AS c ON c.id = o.customer_id
LEFT JOIN public.payments AS p ON p.order_id = o.id;

-- RLS is insert-only for checkout. There are deliberately no SELECT,
-- UPDATE, or DELETE policies for order data.
DROP POLICY IF EXISTS "Visitors can create customers" ON public.customers;
CREATE POLICY "Visitors can create customers"
  ON public.customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (CHAR_LENGTH(TRIM(name)) BETWEEN 2 AND 120);

DROP POLICY IF EXISTS "Visitors can create orders" ON public.orders;
CREATE POLICY "Visitors can create orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    fulfillment_method IN ('pickup', 'delivery')
    AND subtotal >= 0
    AND delivery_fee >= 0
    AND total >= 0
  );

DROP POLICY IF EXISTS "Visitors can create order items" ON public.order_items;
CREATE POLICY "Visitors can create order items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    quantity > 0
    AND unit_price >= 0
    AND line_total >= 0
  );

DROP POLICY IF EXISTS "Visitors can create payments" ON public.payments;
CREATE POLICY "Visitors can create payments"
  ON public.payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    method IN ('gcash', 'maya', 'cashier')
    AND status IN ('paid', 'pay_at_cashier', 'failed', 'refunded')
  );

-- Run the RPC as the caller. Its writes are now constrained by the policies
-- above instead of bypassing RLS as the function owner.
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_name TEXT,
  p_order_number TEXT,
  p_fulfillment_method TEXT,
  p_subtotal NUMERIC,
  p_delivery_fee NUMERIC,
  p_total NUMERIC,
  p_payment_method TEXT,
  p_payment_status TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_customer_id BIGINT;
  v_order_id BIGINT;
  v_item JSONB;
BEGIN
  IF CHAR_LENGTH(TRIM(p_customer_name)) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'Customer name must be between 2 and 120 characters';
  END IF;

  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'An order must contain at least one item';
  END IF;

  INSERT INTO public.customers (name)
  VALUES (TRIM(p_customer_name));

  SELECT currval('public.customers_id_seq'::regclass)
  INTO v_customer_id;

  INSERT INTO public.orders (
    order_number,
    customer_id,
    fulfillment_method,
    subtotal,
    delivery_fee,
    total
  )
  VALUES (
    p_order_number,
    v_customer_id,
    p_fulfillment_method,
    p_subtotal,
    p_delivery_fee,
    p_total
  );

  SELECT currval('public.orders_id_seq'::regclass)
  INTO v_order_id;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      menu_item_id,
      item_name,
      option_name,
      quantity,
      unit_price,
      line_total
    )
    VALUES (
      v_order_id,
      v_item->>'id',
      v_item->>'name',
      NULLIF(v_item->>'option', ''),
      (v_item->>'quantity')::INT,
      (v_item->>'unitPrice')::NUMERIC,
      (v_item->>'lineTotal')::NUMERIC
    );
  END LOOP;

  INSERT INTO public.payments (order_id, method, status, paid_at)
  VALUES (
    v_order_id,
    p_payment_method,
    p_payment_status,
    CASE WHEN p_payment_status = 'paid' THEN CURRENT_TIMESTAMP ELSE NULL END
  );

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', p_order_number
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_order(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, NUMERIC, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, NUMERIC, TEXT, TEXT, JSONB) TO anon, authenticated;
GRANT INSERT ON public.customers, public.orders, public.order_items, public.payments TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE
  public.customers_id_seq,
  public.orders_id_seq,
  public.order_items_id_seq,
  public.payments_id_seq
  TO anon, authenticated;

-- order_items_order_id_idx is intentionally retained: it supports joins and
-- efficient ON DELETE CASCADE checks even if it has not been used yet.
