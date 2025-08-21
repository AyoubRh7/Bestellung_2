<?php

// Crate a Database class that manages the connection to the MySQL Database
class Database {

    // declare the database params as private to keep them safe
    private $host = "localhost";
    private $dbname = "bestellung";
    private $username = "root";
    private $password = "";
    public $conn;

    // Function that wil establish a connection to the database
    public function getConnection(){

        // reset the variable to null before attempting to create a new connection
        $this->conn = null;
        try {
            // create a new connection to the database using PHP Data Object (PDO)
            $this->conn = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->username, $this->password);
            // set errors mode to exceptions mode. Which yill made debugging easier
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch(PDOException $e){
            // return the error message if something went wrong
            echo "Connection failed: " . $e->getMessage();
        }
        return $this->conn;
    }
}