<?php
require_once __DIR__ . '/../config/database.php';
class Menu {
    private $db;
    private $conn;
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getByRestaurantId($restaurant_id) {
        $query = "SELECT * FROM menu WHERE restaurant_id = :restaurant_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':restaurant_id', $restaurant_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($restaurant_id, $item_name, $description, $price) {
        $query = "INSERT INTO menu (restaurant_id, item_name, description, price) VALUES (:restaurant_id, :item_name, :description, :price)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':restaurant_id', $restaurant_id);
        $stmt->bindParam(':item_name', $item_name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':price', $price);
        return $stmt->execute();
    }

    public function update($menu_id, $item_name, $description, $price) {
        $query = "UPDATE menu SET item_name = :item_name, description = :description, price = :price WHERE id = :menu_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':menu_id', $menu_id);
        $stmt->bindParam(':item_name', $item_name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':price', $price);
        return $stmt->execute();
    }

    public function delete($menu_id) {
        $query = "DELETE FROM menu WHERE id = :menu_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':menu_id', $menu_id);
        return $stmt->execute();
    }
}
?>
