-- Mekong OPB — Initial D1 Schema

-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zalo_id TEXT UNIQUE,
  zalo_access_token TEXT,
  zalo_refresh_token TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company_name TEXT,
  company_tax_id TEXT,
  business_type TEXT DEFAULT 'freelancer',
  tier TEXT DEFAULT 'trial',
  credits INTEGER DEFAULT 50,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Invoices table (TT78 compliant)
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  invoice_no TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_tax_id TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  subtotal REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  grand_total REAL NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'issued',
  issued_at TEXT,
  voided_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_no ON invoices(invoice_no);

-- Invoice items
CREATE TABLE invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  tax_rate REAL DEFAULT 0,
  line_total REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Tax calculations history
CREATE TABLE tax_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  input_data TEXT,
  result TEXT,
  period TEXT DEFAULT 'monthly',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CRM contacts
CREATE TABLE crm_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  zalo_id TEXT,
  company TEXT,
  source TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Deals / opportunities
CREATE TABLE deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  contact_id INTEGER,
  title TEXT NOT NULL,
  value REAL,
  stage TEXT DEFAULT 'new',
  probability INTEGER DEFAULT 10,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (contact_id) REFERENCES crm_contacts(id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tier TEXT NOT NULL,
  price_vnd INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  provider TEXT DEFAULT 'momo',
  provider_ref TEXT,
  started_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  canceled_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Zalo messages log
CREATE TABLE zalo_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zalo_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  content TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Leads (from Zalo OA)
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zalo_id TEXT UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'zalo_oa',
  pain_point TEXT,
  business_type TEXT,
  stage TEXT DEFAULT 'aware',
  trial_kit TEXT,
  converted_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Usage meter (credits tracking)
CREATE TABLE usage_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  command TEXT NOT NULL,
  credits_deducted INTEGER DEFAULT 0,
  metadata TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
