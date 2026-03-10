/*
  # SplitKuy Database Schema

  1. New Tables
    - `bills`
      - `id` (uuid, primary key) - Unique identifier for each bill
      - `event_name` (text) - Name of the event or bill
      - `total_amount` (numeric) - Total amount to be split
      - `participant_count` (integer) - Number of participants
      - `amount_per_person` (numeric) - Calculated amount per person
      - `created_at` (timestamptz) - When the bill was created
      
    - `participants`
      - `id` (uuid, primary key) - Unique identifier for each participant
      - `bill_id` (uuid, foreign key) - Reference to bills table
      - `name` (text) - Name of the participant
      - `amount` (numeric) - Amount this participant needs to pay
      - `created_at` (timestamptz) - When the participant was added
  
  2. Security
    - Enable RLS on both tables
    - Allow public read access (for viewing bills)
    - Allow public insert access (for creating new bills)
*/

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  participant_count integer NOT NULL DEFAULT 0,
  amount_per_person numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policies for bills table
CREATE POLICY "Anyone can view bills"
  ON bills FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create bills"
  ON bills FOR INSERT
  WITH CHECK (true);

-- Create policies for participants table
CREATE POLICY "Anyone can view participants"
  ON participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create participants"
  ON participants FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS participants_bill_id_idx ON participants(bill_id);