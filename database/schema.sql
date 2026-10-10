CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT customers_name_length_chk
    CHECK (CHAR_LENGTH(TRIM(name)) BETWEEN 2 AND 120)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(32) NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  fulfillment_method VARCHAR(16) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  ordered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY orders_order_number_uq (order_number),
  KEY orders_customer_id_idx (customer_id),
  KEY orders_ordered_at_idx (ordered_at),
  CONSTRAINT orders_customer_fk
    FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT orders_fulfillment_method_chk
    CHECK (fulfillment_method IN ('pickup', 'delivery')),
  CONSTRAINT orders_subtotal_chk CHECK (subtotal >= 0),
  CONSTRAINT orders_delivery_fee_chk CHECK (delivery_fee >= 0),
  CONSTRAINT orders_total_chk CHECK (total >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id VARCHAR(120) NOT NULL,
  item_name VARCHAR(160) NOT NULL,
  option_name VARCHAR(120) NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id),
  KEY order_items_order_id_idx (order_id),
  CONSTRAINT order_items_order_fk
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_quantity_chk CHECK (quantity > 0),
  CONSTRAINT order_items_unit_price_chk CHECK (unit_price >= 0),
  CONSTRAINT order_items_line_total_chk CHECK (line_total >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  method VARCHAR(16) NOT NULL,
  status VARCHAR(24) NOT NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY payments_order_id_uq (order_id),
  CONSTRAINT payments_order_fk
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT payments_method_chk
    CHECK (method IN ('gcash', 'maya', 'cashier')),
  CONSTRAINT payments_status_chk
    CHECK (status IN ('paid', 'pay_at_cashier', 'failed', 'refunded'))
) ENGINE=InnoDB;

-- Convenient read model for an admin/customer-order page.
CREATE OR REPLACE VIEW customer_order_summary AS
SELECT
  o.id AS order_id,
  o.order_number,
  c.name AS customer_name,
  o.fulfillment_method,
  o.total,
  p.method AS payment_method,
  p.status AS payment_status,
  o.ordered_at
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
LEFT JOIN payments AS p ON p.order_id = o.id;
