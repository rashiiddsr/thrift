-- Schema untuk ThriftKos (MySQL / XAMPP)
-- Gunakan satu tabel users dengan kolom role untuk membedakan admin/superadmin/customer.

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(30) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password_hash, phone, address, role)
VALUES (
  'Admin',
  'admin@sar.ac.id',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  '085174388234',
  'Pekanbaru',
  'superadmin'
);
