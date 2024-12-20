-- Insert into Accounts table
INSERT INTO "Accounts" (account_id, email, password, is_active, created_at)
VALUES
  (gen_random_uuid(), 'staff@gmail.com', '123456', true, NOW()),
  (gen_random_uuid(), 'staff1@gmail.com', '123456', true, NOW()),
  (gen_random_uuid(), 'staff2@gmail.com', '123456', true, NOW()),
  (gen_random_uuid(), 'staff3@gmail.com', '123456', true, NOW()),
  (gen_random_uuid(), 'staff4@gmail.com', '123456', true, NOW())
ON CONFLICT (account_id) DO NOTHING;

-- Insert into Staff table
INSERT INTO "Staff" (staff_id, account_id, role_id, full_name, phone_number, male, birth_date, image, employee_status, hire_date)
VALUES
  (gen_random_uuid(), (SELECT account_id FROM "Accounts" WHERE email = 'staff@gmail.com'), NULL, 'Pham Tuan', '999999999', true, '2000-01-01', NULL, 'ACTIVE', '2023-06-01'),
  (gen_random_uuid(), (SELECT account_id FROM "Accounts" WHERE email = 'staff1@gmail.com'), NULL, 'John Doe', '1234567890', true, '1990-01-01', NULL, 'ACTIVE', '2023-06-01'),
  (gen_random_uuid(), (SELECT account_id FROM "Accounts" WHERE email = 'staff2@gmail.com'), NULL, 'Jane Smith', '0987654321', false, '1985-05-15', NULL, 'ACTIVE', '2021-09-15'),
  (gen_random_uuid(), (SELECT account_id FROM "Accounts" WHERE email = 'staff3@gmail.com'), NULL, 'Bob Johnson', '5555555555', true, '1992-03-10', NULL, 'SUSPENDED', '2023-01-10'),
  (gen_random_uuid(), (SELECT account_id FROM "Accounts" WHERE email = 'staff4@gmail.com'), NULL, 'Alice Williams', '4444444444', false, '1988-07-25', NULL, 'INACTIVE', '2020-11-20')
ON CONFLICT (staff_id) DO NOTHING;
