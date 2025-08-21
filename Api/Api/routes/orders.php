<?php

require_once __DIR__.'/../controllers/OrderController.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$controller = new OrderController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route for fetching all orders
if($method === 'GET' && $uri == '/api/orders') {
    $controller->getOrders();
}

// Route for creating an order
elseif($method === 'POST' && $uri == '/api/orders') {
    $controller->createOrder();
}

// Route for fetching orders by date
elseif($method === 'GET' && preg_match('/^\/api\/orders\/\d{4}-\d{2}-\d{2}$/', $uri)) {
    // Extract the date from the URL
    $date = substr($uri, strrpos($uri, '/') + 1); // Gets the date after "/api/orders/"
    $controller->getOrdersByDate($date);


}

// Admin summary endpoint
elseif($method === 'GET' && $uri == '/api/orders/summary') {
    $controller->getOrdersSummary();
}

// Add this route for CSV export

elseif ($method === 'GET' && $uri == '/api/orders/export') {
    $controller->exportOrdersToCSV();
}


?>
