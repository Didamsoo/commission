-- Stocks and stock transfers tables
-- Run this in the Supabase SQL Editor

-- ============================================
-- STOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  variant TEXT,
  vin TEXT UNIQUE NOT NULL,
  concession_id UUID REFERENCES concessions(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('VN', 'VO', 'VU')),
  price NUMERIC(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'in_transit', 'sold')),
  arrival_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Computed days_in_stock is done at query time: CURRENT_DATE - arrival_date

-- ============================================
-- STOCK TRANSFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID REFERENCES stocks(id) ON DELETE SET NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_vin TEXT NOT NULL,
  from_concession_id UUID REFERENCES concessions(id),
  to_concession_id UUID REFERENCES concessions(id),
  requested_by UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_transit', 'completed', 'rejected')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;

-- Stocks: dir_concession can see their own concession, dir_marque+ can see all in their marque
CREATE POLICY "stocks_read" ON stocks FOR SELECT USING (
  concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON (
      p.id = auth.uid()
      AND (
        p.concession_id = c.id
        OR p.marque_id = c.marque_id
        OR p.level >= 5
      )
    )
  )
);

CREATE POLICY "stocks_insert" ON stocks FOR INSERT WITH CHECK (
  concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
);

CREATE POLICY "stocks_update" ON stocks FOR UPDATE USING (
  concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
);

-- Stock transfers: similar policy
CREATE POLICY "stock_transfers_read" ON stock_transfers FOR SELECT USING (
  from_concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
  OR to_concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
);

CREATE POLICY "stock_transfers_insert" ON stock_transfers FOR INSERT WITH CHECK (
  from_concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
);

CREATE POLICY "stock_transfers_update" ON stock_transfers FOR UPDATE USING (
  from_concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
  OR to_concession_id IN (
    SELECT c.id FROM concessions c
    JOIN profiles p ON p.id = auth.uid() AND (p.concession_id = c.id OR p.marque_id = c.marque_id OR p.level >= 5)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stocks_concession ON stocks(concession_id);
CREATE INDEX IF NOT EXISTS idx_stocks_category ON stocks(category);
CREATE INDEX IF NOT EXISTS idx_stocks_status ON stocks(status);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_status ON stock_transfers(status);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_from ON stock_transfers(from_concession_id);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_to ON stock_transfers(to_concession_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON stocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_transfers_updated_at BEFORE UPDATE ON stock_transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
