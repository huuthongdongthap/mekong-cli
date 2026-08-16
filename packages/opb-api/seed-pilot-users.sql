-- Pilot users (3 test + 2 placeholder for real signups)
INSERT INTO users (zalo_id, name, phone, email, company_name, business_type, tier, credits, created_at) VALUES
('zalo_pilot_001', 'Nguyễn Văn An', '0909123456', 'an.nguyen@example.com', 'An Design Studio', 'freelancer', 'trial', 50, datetime('now', '-14 days')),
('zalo_pilot_002', 'Trần Thị Bình', '0909234567', 'binh.tran@example.com', 'Bình Shop Online', 'shop_owner', 'trial', 50, datetime('now', '-10 days')),
('zalo_pilot_003', 'Lê Văn Chính', '0909345678', 'chinh.le@example.com', 'Chinh Consulting', 'service', 'trial', 50, datetime('now', '-7 days'));

-- Sample invoices for pilot 1
INSERT INTO invoices (user_id, invoice_no, customer_name, customer_email, customer_phone, subtotal, tax_amount, grand_total, status, issued_at) VALUES
(1, '2026/01/0001/0001', 'Công ty TNHH ABC', 'abc@example.com', '0281234567', 5000000, 500000, 5500000, 'issued', datetime('now', '-5 days')),
(1, '2026/02/0001/0002', 'Chi nhánh XYZ', 'xyz@example.com', '0287654321', 3000000, 0, 3000000, 'paid', datetime('now', '-3 days'));

-- Invoice items
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, line_total, tax_amount) VALUES
(1, 'Thiết kế logo + bộ nhận diện', 1, 5000000, 10, 5000000, 500000),
(2, 'Dịch vụ tư vấn marketing', 10, 300000, 0, 3000000, 0);

-- Tax calculations
INSERT INTO tax_calculations (user_id, type, input_data, result, period, created_at) VALUES
(1, 'TNCN', '{"income": 25000000, "dependents": 1, "region": "I"}', '{"taxable_income": 17800000, "tax_due": 1370000, "effective_rate": 5.48}', 'monthly', datetime('now', '-6 days')),
(2, 'GTGT', '{"revenue": 500000000, "cost": 300000000}', '{"taxable_revenue": 500000000, "tax_due": 50000000, "method": "khấu trừ"}', 'quarterly', datetime('now', '-4 days'));

-- CRM contacts
INSERT INTO crm_contacts (user_id, name, phone, email, zalo_id, company, source, status) VALUES
(1, 'Nguyễn Văn Khách', '0909111222', 'khach@example.com', 'zalo_khach_01', 'Khách Corp', 'zalo_oa', 'active'),
(2, 'Phạm Thị Mua', '0909222333', 'mua@example.com', 'zalo_khach_02', 'Mua Ltd', 'zalo_oa', 'active');

-- Leads from Zalo
INSERT INTO leads (zalo_id, name, source, pain_point, business_type, stage, trial_kit, created_at) VALUES
('zalo_lead_001', 'Hoàng Văn Dũng', 'zalo_oa', 'quản lý khách hàng', 'freelancer', 'aware', 'freelance', datetime('now', '-3 days')),
('zalo_lead_002', 'Nguyễn Thị Hoa', 'zalo_oa', 'tự động hóa Zalo', 'shop_owner', 'aware', 'automate', datetime('now', '-2 days')),
('zalo_lead_003', 'Vũ Văn Minh', 'tiktok', 'kế khai thuế', 'freelancer', 'aware', 'tax', datetime('now', '-1 day'));

-- Usage events
INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at) VALUES
(1, 'invoice.create', -5, '{"invoice_no": "2026/01/0001/0001"}', datetime('now', '-5 days')),
(1, 'tax.calculate', -2, '{"type": "TNCN"}', datetime('now', '-6 days')),
(2, 'invoice.create', -5, '{"invoice_no": "2026/02/0001/0002"}', datetime('now', '-3 days'));

-- KV: Referral codes for pilot users
INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at) VALUES
(1, 'referral.generate', 0, '{"code": "MEK001AN", "user_id": 1}', datetime('now', '-7 days')),
(2, 'referral.generate', 0, '{"code": "MEK002BI", "user_id": 2}', datetime('now', '-5 days'));

-- Nurture templates in KV
INSERT INTO usage_events (user_id, command, credits_deducted, metadata, created_at) VALUES
(1, 'nurture.template', 0, '{"template": "day0_freelance", "user_id": 1}', datetime('now', '-14 days')),
(1, 'nurture.template', 0, '{"template": "day3_checkin", "user_id": 1}', datetime('now', '-11 days')),
(2, 'nurture.template', 0, '{"template": "day0_shop", "user_id": 2}', datetime('now', '-10 days'));

