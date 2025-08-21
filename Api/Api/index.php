<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle API routes
if ($uri == "/api/register") {
    include "routes/register.php";
} elseif ($uri == "/api/users") {
    include "routes/users.php";
} elseif (preg_match('/^\/api\/menu/', $uri)) {
    include "routes/menu.php";
} elseif ($uri == "/api/restaurants" || preg_match('/^\/api\/restaurants\/\d+$/', $uri)) {
    include "routes/restaurants.php";
} elseif ($uri == "/api/orders") {
    include "routes/orders.php";  // Handles general orders and creation
} elseif (preg_match('/^\/api\/orders\/\d{4}-\d{2}-\d{2}$/', $uri)) {
    // This route handles getting orders by date
    include "routes/orders.php";
} elseif ($uri == "/api/orders/summary") {
    include "routes/orders.php";
} elseif ($uri == "/api/restaurant/order_items") {
    include "routes/order_items.php";
} elseif ($uri == "/api/restaurant/orders") {
    include "routes/orders.php";
}
elseif ($uri == "/api/orders/export") {
    include "routes/orders.php";
}
elseif ($uri == "/api/deadline") {
    include "routes/deadline.php";
} else {
    echo json_encode(["message" => "Invalid API Route"]);
}
?>
