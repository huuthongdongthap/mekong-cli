-- Seed: Demo data for Zalo Auto Sales
-- App credentials (mock — replace with real values from Zalo Developer Console)
INSERT OR REPLACE INTO tokens (
  id, oa_id, app_id, app_secret,
  access_token, refresh_token,
  access_token_expires_at, refresh_token_expires_at,
  oa_secret_key, updated_at
) VALUES (
  'default',
  '4641078080797498289',
  '3964321234567890',
  'demo_app_secret_replace_me',
  'demo_access_token_replace_me',
  'demo_refresh_token_replace_me',
  datetime('now', '+1 hour'),
  datetime('now', '+30 days'),
  'demo_oa_secret_key_replace_me',
  datetime('now')
);

-- Sequences mẫu
INSERT OR IGNORE INTO sequences (id, name, description, trigger_event, trigger_keyword, is_active) VALUES
  ('seq_follow_001', 'Chào mừng follower mới', 'Chuỗi tự động gửi khi user follow OA', 'follow', NULL, 1),
  ('seq_kw_muahang', 'Tư vấn mua hàng', 'Trigger khi user nhắn từ khoá "mua hàng"', 'keyword', 'mua hàng', 1),
  ('seq_kw_giaca',   'Báo giá tự động',  'Trigger khi user nhắn "giá" hoặc "báo giá"', 'keyword', 'báo giá', 1),
  ('seq_manual_001', 'Upsell VIP',        'Enroll thủ công cho khách VIP', 'manual', NULL, 0);

-- Steps: Chuỗi chào mừng (3 bước)
INSERT OR IGNORE INTO sequence_steps (id, sequence_id, step_order, delay_minutes, message_type, message_content) VALUES
  ('step_f1', 'seq_follow_001', 1,   0, 'text', 'Chào bạn! Cảm ơn đã quan tâm tới shop chúng mình 🎉 Bạn muốn tìm hiểu sản phẩm gì hôm nay?'),
  ('step_f2', 'seq_follow_001', 2,  60, 'text', 'Bạn ơi, shop đang có chương trình ưu đãi đặc biệt trong hôm nay. Nhắn "xem ưu đãi" để nhận thông tin chi tiết nhé!'),
  ('step_f3', 'seq_follow_001', 3, 1440,'text', 'Hôm qua bạn có ghé thăm shop mình. Nếu cần tư vấn thêm, đội ngũ mình luôn sẵn sàng hỗ trợ bạn 24/7 nhé 😊');

-- Steps: Chuỗi tư vấn mua hàng (2 bước)
INSERT OR IGNORE INTO sequence_steps (id, sequence_id, step_order, delay_minutes, message_type, message_content) VALUES
  ('step_k1', 'seq_kw_muahang', 1,  0, 'text', 'Bạn muốn mua hàng à? Tuyệt vời! Vui lòng cho shop biết bạn đang tìm kiếm sản phẩm gì để mình tư vấn tốt nhất nhé 🛍'),
  ('step_k2', 'seq_kw_muahang', 2, 30, 'text', 'Shop gửi bạn danh mục sản phẩm đang hot nhất tháng này. Bấm vào để xem chi tiết và đặt hàng ngay!');

-- Steps: Báo giá (1 bước)
INSERT OR IGNORE INTO sequence_steps (id, sequence_id, step_order, delay_minutes, message_type, message_content) VALUES
  ('step_g1', 'seq_kw_giaca', 1, 0, 'text', 'Bảng giá sản phẩm của shop:\n• Sản phẩm A: 299.000đ\n• Sản phẩm B: 499.000đ\n• Sản phẩm C: 799.000đ\nNhắn tên sản phẩm để đặt hàng hoặc liên hệ tư vấn!');

-- Contacts mẫu (mock Zalo user IDs)
INSERT OR IGNORE INTO contacts (id, zalo_user_id, display_name, phone, is_following, followed_at, last_interaction_at, source) VALUES
  ('c_001', '9999000000001', 'Nguyễn Văn An',  '0901234567', 1, datetime('now', '-5 days'),  datetime('now', '-1 hour'),   'follow'),
  ('c_002', '9999000000002', 'Trần Thị Bình',  '0912345678', 1, datetime('now', '-3 days'),  datetime('now', '-2 days'),   'follow'),
  ('c_003', '9999000000003', 'Lê Minh Châu',   '0923456789', 1, datetime('now', '-7 days'),  datetime('now', '-30 minutes'),'keyword'),
  ('c_004', '9999000000004', 'Phạm Quỳnh Dung', NULL,        0, datetime('now', '-10 days'), datetime('now', '-5 days'),   'follow'),
  ('c_005', '9999000000005', 'Hoàng Đức Em',   '0945678901', 1, datetime('now', '-1 day'),   datetime('now', '-3 hours'),  'follow');

-- Enrollments mẫu
INSERT OR IGNORE INTO sequence_enrollments (id, contact_id, sequence_id, current_step, status, enrolled_at, next_send_at) VALUES
  ('enr_001', 'c_001', 'seq_follow_001',  1, 'active',    datetime('now', '-5 days'), datetime('now', '+30 minutes')),
  ('enr_002', 'c_002', 'seq_follow_001',  2, 'active',    datetime('now', '-3 days'), datetime('now', '+2 hours')),
  ('enr_003', 'c_003', 'seq_kw_muahang',  1, 'active',    datetime('now', '-1 day'),  datetime('now', '+10 minutes')),
  ('enr_004', 'c_004', 'seq_follow_001',  3, 'completed', datetime('now', '-10 days'),NULL),
  ('enr_005', 'c_005', 'seq_follow_001',  0, 'active',    datetime('now', '-1 day'),  datetime('now', '+5 minutes'));
