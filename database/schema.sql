-- Database Schema untuk Webstore Cookies

-- Membuat database
CREATE DATABASE IF NOT EXISTS cookies_store;
USE cookies_store;

-- Tabel produk cookies
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel pesanan
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    order_details TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample produk cookies
INSERT INTO products (name, description, price, image, category) VALUES
('Choco Chip Cookies', 'Klasik chocolate chip cookies dengan taburan choco chips', 25000, 'choco-chip.jpg', 'Classic'),
('Butter Cookies', 'Buttery cookies lembut dengan aroma butter asli', 22000, 'butter.jpg', 'Classic'),
('Oatmeal Raisins', 'Oatmeal cookies dengan kismis pilihan', 28000, 'oatmeal.jpg', 'Healthy'),
('Almond Cookies', 'Cookies dengan taburan almond renyah', 30000, 'almond.jpg', 'Premium'),
('Red Velvet Cookies', 'Red velvet cookies dengan cream cheese', 35000, 'red-velvet.jpg', 'Premium'),
('Matcha Cookies', 'Japanese style matcha cookies', 32000, 'matcha.jpg', 'Special'),
('Strawberry Cheesecake', 'Cookies dengan rasa strawberry cheesecake', 38000, 'strawberry.jpg', 'Special'),
('Double Choco', 'Cookies ganda cokelat dengan dark & milk chocolate', 30000, 'double-choco.jpg', 'Classic');
