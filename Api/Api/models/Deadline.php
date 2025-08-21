<?php

require_once __DIR__ . '/../config/database.php';

header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

class Deadline {
    private $conn;
    private $table = "settings";

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // Get the latest dedaline
    public function getDeadline() {
        $query = "SELECT deadline FROM {$this->table} ORDER BY deadline DESC LIMIT 1";
        $statement = $this->conn->prepare($query);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['deadline'] : '11:00';
    }

    // Set or update the daily order deadline
    public function setDeadline($deadline_time) {
        //Only one deadline should exists in the table
        $delete_query = "DELETE FROM {$this->table}";
        $this->conn->prepare($delete_query)->execute();

        //Insert new deadline
        $query = "INSERT INTO {$this->table} (deadline) VALUES (:deadline_time)";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':deadline_time', $deadline_time);
        return $statement->execute();
    }
}