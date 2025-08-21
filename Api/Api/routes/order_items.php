<?php
require_once __DIR__.'/../controllers/OrderItemController.php';

header('Content-type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if(isset($_GET['order_id'])) {
    $controller = new OrderItemController();
    $controller->getOrderItems($_GET['order_id']);
} else {
    http_response_code(400);
    echo json_encode(["message" => "Missing order id."]);
}