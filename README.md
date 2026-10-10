# Cozy Corner

Cozy Corner is a warm, welcoming food ordering website where visitors can explore a fresh menu, save favorite dishes, customize selections, and place pickup or delivery orders with ease.

# Supabase setup

1. In the Supabase SQL Editor, run `database/supabase_schema.sql`.
2. Run `database/seed_data.sql` to copy the menu from `src/data/menuData.js` into the `menu_items` table.
3. In Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables, then redeploy.

The app reads the seeded menu from Supabase. If the table is empty or temporarily unavailable, it falls back to `menuData.js` so the menu remains visible. Completed checkout records are written through the `create_order` database function into `customers`, `orders`, `order_items`, and `payments`.

The payment screen currently records the customer's selected payment method and submitted status. It does not independently verify GCash or Maya payments; verification should be added through a payment provider webhook before treating a digital payment as confirmed.

# Next Project
- Add Security
- Add Database For Customer order and Payment Receipt 
- Add Server
- Add DNS, Cloudflare
- Domain name
