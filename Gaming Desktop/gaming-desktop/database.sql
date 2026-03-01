-- ============================================
-- Gaming Desktop – MySQL Database Schema
-- Premium Gaming Accessories eCommerce Store
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS gaming_desktop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gaming_desktop;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  is_admin TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert default categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Keyboards', 'keyboards', 'fa-keyboard', 'Mechanical gaming keyboards with RGB lighting'),
  ('Gaming Mouse', 'mice', 'fa-computer-mouse', 'High-precision gaming mice for competitive play'),
  ('Headsets', 'headsets', 'fa-headset', 'Surround sound gaming headsets'),
  ('Gaming Chairs', 'chairs', 'fa-chair', 'Ergonomic chairs for marathon sessions'),
  ('Monitors', 'monitors', 'fa-desktop', 'High refresh rate gaming monitors'),
  ('Accessories', 'accessories', 'fa-gamepad', 'Mouse pads, microphones, fans, desks and more');

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2) DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  emoji VARCHAR(10) DEFAULT '🎮',
  badge VARCHAR(50) DEFAULT NULL,
  rating DECIMAL(2, 1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  stock INT DEFAULT 100,
  is_featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_featured (is_featured)
) ENGINE=InnoDB;

-- Insert sample products
INSERT INTO products (category_id, name, slug, description, price, old_price, emoji, badge, rating, review_count, is_featured) VALUES
  (1, 'Phantom Strike RGB Keyboard', 'phantom-strike-rgb', 'Cherry MX mechanical switches with per-key RGB lighting and aircraft-grade aluminum frame.', 149.99, NULL, '⌨️', 'Hot', 5.0, 328, 1),
  (1, 'ShadowType 65% Compact', 'shadowtype-65', 'Hot-swappable Gateron switches, PBT keycaps, detachable USB-C cable. Compact layout.', 109.99, NULL, '⌨️', NULL, 4.0, 203, 0),
  (2, 'Viper X Ultra-Light Mouse', 'viper-x-ultralight', '26K DPI optical sensor, 58g ultralight shell, Speedflex cable, PTFE feet.', 79.99, NULL, '🖱️', 'New', 5.0, 256, 1),
  (2, 'HexaGrip Wireless Pro', 'hexagrip-wireless', 'Dual-mode wireless/BT, 70hr battery, ergonomic right-hand design, 30K DPI.', 99.99, NULL, '🖱️', NULL, 4.0, 187, 0),
  (3, 'Nova Pro 7.1 Wireless', 'nova-pro-wireless', 'Hi-Res 40mm drivers, ANC, 38hr battery, dual audio stream mixing.', 199.99, NULL, '🎧', NULL, 5.0, 189, 1),
  (3, 'BassForce Wired Gaming', 'bassforce-wired', '50mm drivers, retractable noise-canceling mic, 250g ultralight.', 59.99, 69.99, '🎧', '-15%', 4.0, 312, 0),
  (4, 'Titan Evo Ergonomic Chair', 'titan-evo', '4D armrests, magnetic head pillow, integrated lumbar, cold-cure foam.', 399.99, 499.99, '🪑', '-20%', 5.0, 412, 1),
  (5, 'Apex 27" 240Hz QHD Monitor', 'apex-27-240hz', '1ms GTG, IPS panel, 95% DCI-P3, HDR600, height-adjustable stand.', 549.99, NULL, '🖥️', 'Best', 5.0, 298, 1),
  (6, 'HyperCast USB Microphone', 'hypercast-usb', 'Studio-grade cardioid condenser, RGB base, tap-to-mute, real-time monitoring.', 129.99, NULL, '🎙️', NULL, 4.0, 145, 0),
  (6, 'NeonEdge RGB Desk Mat', 'neonedge-mat', '900x400mm surface, 12 RGB zones, micro-textured cloth, anti-slip base.', 49.99, NULL, '🖥️', NULL, 4.0, 276, 0),
  (6, 'CycloneX RGB Fan Pack (3x)', 'cyclonex-fans', '3x 120mm ARGB fans, daisy-chain, PWM control, hydraulic bearings, 22dB.', 69.99, NULL, '🌀', 'RGB', 5.0, 167, 0),
  (6, 'ForgeStation Gaming Desk', 'forgestation-desk', '60" carbon fiber surface, cable management, RGB LED strip, cup holder.', 329.99, NULL, '🗄️', NULL, 4.0, 98, 0);

-- ============================================
-- Cart Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  session_id VARCHAR(255) DEFAULT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_session (session_id)
) ENGINE=InnoDB;

-- ============================================
-- Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_name VARCHAR(100),
  shipping_email VARCHAR(255),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_number (order_number),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- Order Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Contact Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_read (is_read)
) ENGINE=InnoDB;

-- ============================================
-- Newsletter Subscribers Table
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;
