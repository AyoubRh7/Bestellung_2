<?php

require_once __DIR__ . '/../config/database.php';

class OrderItem {
    private $conn;
    private $table = 'order_item';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getByOrder($order_id) {
        $query = "SELECT * FROM {$this->table} WHERE order_id = :order_id";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':order_id', $order_id);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrderItemsByOrderId($orderId) {
        $query = "SELECT * FROM " . $this->table . " WHERE order_id = :order_id";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':order_id', $orderId);
        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC); // Return all items for this order
    }

    public function createOrderItem($order_id, $menu_id, $quantity) {
        $query = "INSERT INTO " . $this->table . " (order_id, menu_id, quantity) VALUES (:order_id, :menu_id, :quantity)";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':order_id', $order_id);
        $statement->bindParam(':menu_id', $menu_id);
        $statement->bindParam(':quantity', $quantity);
        return $statement->execute();
    }
}