<?php

require_once __DIR__ . '/../controllers/RestaurantController.php';

// Avoid cors problems
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

$controller = new RestaurantController();
$method = $_SERVER['REQUEST_METHOD'];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$restaurant_id = null;

// Check if there's a restaurant ID in the URI (for GET, PUT, DELETE)
if (preg_match('/^\/api\/restaurants\/(\d+)$/', $uri, $matches)) {
    $restaurant_id = $matches[1];
}

// Check if there's an 'id' query parameter
if (isset($_GET['id'])) {
    $restaurant_id = $_GET['id'];
}

if ($method === 'GET') {
    if ($restaurant_id) {
        $controller->getRestaurant($restaurant_id);  // Fetch a specific restaurant
    } else {
        $controller->getRestaurants();  // Fetch all restaurants
    }
} elseif ($method === 'POST') {
    $controller->addRestaurant();  // Add a new restaurant
} elseif ($method === 'PUT' && $restaurant_id) {
    $controller->updateRestaurant($restaurant_id);  // Update a specific restaurant
} elseif ($method === 'DELETE' && $restaurant_id) {
    $controller->deleteRestaurant($restaurant_id);  // Delete a specific restaurant
} else {
    echo json_encode(["message" => "Invalid API Route"]);
}
