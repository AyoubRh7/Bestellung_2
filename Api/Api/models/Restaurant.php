<?php
require_once __DIR__ . '/../config/database.php';

class Restaurant {
    private $conn;
    private $table = 'restaurant';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getAll() {
        $query = "SELECT * FROM ". $this->table;
        $statement = $this->conn->prepare($query);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM ". $this->table ." WHERE restaurant_id = :id";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':id', $id);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }

    public function create($name, $address, $contact_info) {
        $query = "INSERT INTO " . $this->table . " (name, address, contact_info) VALUES (:name, :address, :contact_info)";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':name', $name);
        $statement->bindParam(':address', $address);
        $statement->bindParam(':contact_info', $contact_info);
        return $statement->execute();
    }

    public function update($id, $name, $address, $contact_info) {
        $query = "UPDATE " . $this->table . " SET name = :name, address = :address, contact_info = :contact_info WHERE restaurant_id = :id";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':id', $id);
        $statement->bindParam(':name', $name);
        $statement->bindParam(':address', $address);
        $statement->bindParam(':contact_info', $contact_info);
        return $statement->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE restaurant_id = :id";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':id', $id);
        return $statement->execute();
    }
}
