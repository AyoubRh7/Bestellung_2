<?php

require_once __DIR__ . '/../controllers/MenuController.php';

header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

$controller = new MenuController();
$method = $_SERVER['REQUEST_METHOD'];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$menu_id = null;
$restaurant_id = isset($_GET['restaurant_id']) ? $_GET['restaurant_id'] : null;

// Check if there's a menu ID in the URI (for GET, PUT, DELETE)
if (preg_match('/^\/api\/menu\/(\d+)$/', $uri, $matches)) {
    $menu_id = $matches[1];
}

if ($method === 'GET') {
    if ($restaurant_id) {
        $controller->getMenusByRestaurant($restaurant_id);  // Fetch menus for a specific restaurant
    } else {
        $controller->getMenus();  // Fetch all menus (without restaurant filter)
    }
} elseif ($method === 'POST' && $restaurant_id) {
    $controller->addMenuToRestaurant($restaurant_id);  // Add a new menu item to a restaurant
} elseif ($method === 'PUT' && $menu_id) {
    $controller->updateMenu($menu_id);  // Update a specific menu item
} elseif ($method === 'DELETE' && $menu_id) {
    $controller->deleteMenu($menu_id);  // Delete a specific menu item
} else {
    echo json_encode(["message" => "Invalid API Route"]);
}
?>
