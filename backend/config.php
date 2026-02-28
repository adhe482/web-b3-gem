<?php
// Konfigurasi Database
$db_host = 'localhost';
$db_name = 'cookies_store';
$db_user = 'root'; // Ganti dengan username database Anda
$db_pass = '';     // Ganti dengan password database Anda

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}

// Nomor WhatsApp untuk konfirmasi pesanan (ganti dengan nomor Anda)
$wa_number = '6281234567890'; // Format: kode negara + nomor (tanpa +)
?>
