<?php

require_once __DIR__ . '/../models/Menu.php';
require_once __DIR__ . '/../middleware/auth.php';

/**
 * Menu Controller
 * Handles menu item operations (view, create, update, delete)
 */
class MenuController {
    private $menu;

    public function __construct() {
        $this->menu = new Menu();
    }

    /**
     * Get all menu items
     * Public endpoint - no login required
     */
    public function getMenus() {
        $menus = $this->menu->getAll();
        echo json_encode(['data' => $menus]);
    }

    /**
     * Get menu items for a specific restaurant
     * Public endpoint - no login required
     */
    public function getMenusByRestaurant($restaurant_id) {
        $menus = $this->menu->getByRestaurantId($restaurant_id);
        echo json_encode(['data' => $menus]);
    }

    /**
     * Add a new menu item to a restaurant - ADMIN ONLY
     * Requires admin login to prevent unauthorized menu changes
     */
    public function addMenuToRestaurant($restaurant_id) {
        // Check if user is logged in and is admin
        $authUser = authenticate();
        if (!isset($authUser->role) || $authUser->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Not allowed"]);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);

        $item_name = $data['item_name'];
        $description = $data['description'] ?? '';
        $price = $data['price'];

        if ($this->menu->create($restaurant_id, $item_name, $description, $price)) {
            echo json_encode(["message" => "Menu item created successfully"]);
        } else {
            echo json_encode(["message" => "Failed to create menu item"]);
        }
    }

    /**
     * Update an existing menu item - ADMIN ONLY
     * Requires admin login to prevent unauthorized menu changes
     */
    public function updateMenu($menu_id) {
        // Check if user is logged in and is admin
        $authUser = authenticate();
        if (!isset($authUser->role) || $authUser->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Not allowed"]);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);

        $item_name = $data['item_name'];
        $description = $data['description'] ?? '';
        $price = $data['price'];

        if ($this->menu->update($menu_id, $item_name, $description, $price)) {
            echo json_encode(["message" => "Menu item updated successfully"]);
        } else {
            echo json_encode(["message" => "Failed to update menu item"]);
        }
    }

    /**
     * Delete a menu item - ADMIN ONLY
     * Requires admin login to prevent unauthorized menu changes
     */
    public function deleteMenu($menu_id) {
        // Check if user is logged in and is admin
        $authUser = authenticate();
        if (!isset($authUser->role) || $authUser->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Not allowed"]);
            return;
        }
        
        if ($this->menu->delete($menu_id)) {
            echo json_encode(["message" => "Menu item deleted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to delete menu item"]);
        }
    }
}
?>
