-- Mekong OPB Pilot Seed Data
-- Run: wrangler d1 execute mekong-opb --remote --file=seed.sql

-- 3 pilot users
INSERT INTO users (zalo_id, name, phone, email, company_name, business_type, tier, credits, created_at) VALUES
('zalo_pilot_001', 'Nguyễn Văn An', '+84909123456', 'an.nguyen@example.com', 'An Creative Studio', 'freelancer', 'trial', 50, '2026-06-01 08:00:00'),
('zalo_pilot_002', 'Trần Thị Bích', '+84987654321', 'bich.tran@example.com', 'Bích Shop Online', 'shop_online', 'trial', 50, '2026-06-02 10:30:00'),
('zalo_pilot_003', 'Lê Hoàng Cường', '+84912345678', 'cuong.le@example.com', 'Cường IT Services', 'services', 'trial', 50, '2026-06-03 14:00:00');

-- 2 invoices for user 1
INSERT INTO invoices (user_id, invoice_no, customer_name, customer_phone, customer_email, customer_address, subtotal, tax_amount, grand_total, status, issued_at, created_at) VALUES
(1, '2026/06/0001/0001', 'Công ty TNHH Minh Quang', '+84911111111', 'contact@minhquang.vn', 'Hà Nội', 5000000, 500000, 5500000, 'issued', '2026-06-03', '2026-06-03'),
(1, '2026/06/0001/0002', 'Hoàng Thị Dung', '+84922222222', 'dung.hoang@gmail.com', 'TP.HCM', 2000000, 0, 2000000, 'paid', '2026-06-04', '2026-06-04');

-- Invoice items for invoice 1
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, line_total, tax_amount) VALUES
(1, 'Thiết kế logo + bộ nhận diện', 1, 5000000, 10, 5000000, 500000);

-- Invoice items for invoice 2
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, line_total, tax_amount) VALUES
(2, 'Dịch vụ content writing — 10 bài', 10, 200000, 0, 2000000, 0);

-- 2 tax calculations for user 1
INSERT INTO tax_calculations (user_id, type, input_data, result, period, created_at) VALUES
(1, 'TNCN', '{"income": 25000000, "dependents": 1, "insurance": 1000000}', '{"taxable": 21000000, "tax": 1750000, "effective_rate": 7.0}', 'monthly', '2026-06-05'),
(1, 'TNDN', '{"revenue": 120000000, "costs": 80000000}', '{"taxable": 84000000, "tax": 16800000, "effective_rate": 14.0}', 'quarterly', '2026-06-05');

-- 2 CRM contacts for user 1
INSERT INTO crm_contacts (user_id, name, phone, email, company, source, status, created_at) VALUES
(1, 'Phạm Minh Tuấn', '+84933333333', 'tuan.pham@vendor.vn', 'Vendor Co.', 'manual', 'active', '2026-06-01'),
(1, 'Ngô Thị Hương', '+84944444444', 'huong.ngo@client.vn', 'Client Ltd.', 'zalo', 'active', '2026-06-02');

-- 2 deals for user 1
INSERT INTO deals (user_id, contact_id, title, value, stage, probability, notes, created_at, updated_at) VALUES
(1, 1, 'Hợp đồng thiết kế Q3/2026', 15000000, 'negotiation', 70, 'Đang đàm phán giá', '2026-06-02', '2026-06-05'),
(1, 2, 'Dịch vụ content tháng 7', 5000000, 'new', 20, 'Lead mới từ Zalo', '2026-06-05', '2026-06-05');

-- 1 subscription for user 2 (freelancer trial → paid upgrade)
INSERT INTO subscriptions (user_id, tier, price_vnd, status, provider, started_at) VALUES
(2, 'freelancer', 99000, 'active', 'momo', '2026-06-04');

-- 3 leads from Zalo OA
INSERT INTO leads (zalo_id, name, source, pain_point, business_type, stage, trial_kit, created_at) VALUES
('zalo_lead_001', 'Vũ Thị Mai', 'zalo_oa', 'ke_toan_phuc_tap', 'freelancer', 'trial', 'freelance', '2026-06-05'),
('zalo_lead_002', 'Đặng Văn Hùng', 'zalo_oa', 'khach_hang_roi', 'shop_online', 'aware', 'shop', '2026-06-05'),
('zalo_lead_003', 'Bùi Thị Lan', 'zalo_oa', 'marketing_tu_dong', 'services', 'interested', 'content', '2026-06-06');

-- 5 usage events
INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at) VALUES
(1, 'invoice.create', 5, '{"invoice_no": "2026/06/0001/0001"}', '2026-06-03 08:15:00'),
(1, 'tax.calculate', 2, '{"type": "TNCN"}', '2026-06-05 09:00:00'),
(1, 'crm.contact.add', 0, '{}', '2026-06-01 10:00:00'),
(2, 'invoice.create', 5, '{"invoice_no": "2026/06/0001/0003"}', '2026-06-04 14:00:00'),
(3, 'tax.calculate', 2, '{"type": "TNDN"}', '2026-06-06 11:00:00');
