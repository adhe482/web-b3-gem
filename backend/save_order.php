<?php
// API untuk menyimpan pesanan
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method tidak diperbolehkan']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

$customer_name = isset($input['customer_name']) ? trim($input['customer_name']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$address = isset($input['address']) ? trim($input['address']) : '';
$order_details = isset($input['order_details']) ? $input['order_details'] : '';
$total_amount = isset($input['total_amount']) ? floatval($input['total_amount']) : 0;

// Validasi input
if (empty($customer_name) || empty($phone) || empty($order_details)) {
    echo json_encode([
        'success' => false,
        'message' => 'Data tidak lengkap. Mohon isi nama, nomor HP, dan pesanan.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO orders (customer_name, phone, address, total_amount, order_details, status) VALUES (?, ?, ?, ?, ?, 'pending')");
    $stmt->execute([$customer_name, $phone, $address, $total_amount, $order_details]);
    
    $order_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Pesanan berhasil disimpan',
        'order_id' => $order_id
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menyimpan pesanan: ' . $e->getMessage()
    ]);
}
?>
