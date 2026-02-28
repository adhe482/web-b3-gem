<?php
// API untuk mengambil data produk
header('Content-Type: application/json');
include 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $products
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil data produk: ' . $e->getMessage()
    ]);
}
?>
