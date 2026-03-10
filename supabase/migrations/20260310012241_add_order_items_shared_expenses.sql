/*
  # Add Order Items and Shared Expenses

  1. New Tables
    - `order_items`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, foreign key) - Reference to participants
      - `item_name` (text) - Name of the ordered item
      - `item_price` (numeric) - Price of the item
      - `created_at` (timestamptz)
      
    - `shared_expenses`
      - `id` (uuid, primary key)
      - `bill_id` (uuid, foreign key) - Reference to bills
      - `expense_name` (text) - Name of shared expense (parking, service charge, etc)
      - `expense_amount` (numeric) - Total amount of shared expense
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both new tables
    - Allow public read/write access
*/

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  item_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shared_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  expense_name text NOT NULL,
  expense_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view shared expenses"
  ON shared_expenses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create shared expenses"
  ON shared_expenses FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS order_items_participant_id_idx ON order_items(participant_id);
CREATE INDEX IF NOT EXISTS shared_expenses_bill_id_idx ON shared_expenses(bill_id);