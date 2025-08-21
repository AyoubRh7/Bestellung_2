<?php

// include database configuration file
require_once __DIR__ . '/../config/database.php';

class User {

    // variable that will store the database connection object
    private $connection;
    private $table = 'users';

    // initialize the database connection from the construct method
    public function __construct() {
        $db = new Database();
        $this->connection = $db->getConnection();
    }

    public  function register($username, $email, $password, $role) {
        $query = "SELECT id FROM " . $this->table . " WHERE email = :email ";
        $statement = $this->connection->prepare($query);
        $statement->bindValue(':email', $email);
        $statement->execute();

        if($statement->rowCount() > 0) {
            // Email already taken
            return false;
        }

        //Hashing the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert into the database
        $query = "INSERT INTO " . $this->table . "(username, email, password, role) VALUES(:username, :email, :password, :role)";
        $statement = $this->connection->prepare($query);
        $statement->bindValue(':username', $username);
        $statement->bindValue(':email', $email);
        $statement->bindValue(':password', $hashedPassword);
        $statement->bindValue(':role', $role);

        if($statement->execute()) {
            return $this->connection->lastInsertId();
        }
        return false;
    }
    // Method login that verifies the login credentials and return teh user if they are correct
    public function login($username, $password) {
        $query = "SELECT * FROM ". $this->table ." WHERE username = :username";
        $statement = $this->connection->prepare($query);
        $statement->bindValue(':username', $username);
        $statement->execute();

        if ($statement->rowCount() > 0) {
            $user = $statement->fetch(PDO::FETCH_ASSOC);
            if ( password_verify($password, $user['password']) ){
                return $user;
            }
        }
        return false;
    }

    // Fetch a user by their ID
    public function getUserById($userId) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :user_id";
        $statement = $this->connection->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->execute();

        return $statement->fetch(PDO::FETCH_ASSOC); // Returns the user data or false if not found
    }
}