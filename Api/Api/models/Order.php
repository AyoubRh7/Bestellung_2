<?php

require_once __DIR__ . '/../config/database.php';

/**
 * Order Model
 * Handles all database operations related to orders
 */
class Order {
    private $conn;
    private $table = 'orders';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Get all orders with user and order item details
     * Used by admin to see all orders from all users
     */
    public function getOrders() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY order_date DESC";
        $statement = $this->conn->prepare($query);
        $statement->execute();
        $orders = $statement->fetchAll(PDO::FETCH_ASSOC);

        // Add user names and order items to each order
        foreach ($orders as &$order) {
            // Get user info
            $userModel = new User();
            $user = $userModel->getUserById($order['user_id']);
            $order['user'] = $user ? $user['username'] : 'Unknown';

            // Get order items
            $orderItemModel = new OrderItem();
            $order['order_items'] = $orderItemModel->getOrderItemsByOrderId($order['order_id']);

            // Set the total number of items in the order
            $order['total_items'] = count($order['order_items']);
        }

        return $orders;
    }

    /**
     * Get orders for a specific user (employee)
     * Used by employees to see only their own orders
     */
    public function getOrdersByUserId($userId) {
        $query = "SELECT * FROM " . $this->table . " WHERE user_id = :user_id ORDER BY order_date DESC";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->execute();
        $orders = $statement->fetchAll(PDO::FETCH_ASSOC);

        // Add user names and order items to each order
        foreach ($orders as &$order) {
            $userModel = new User();
            $user = $userModel->getUserById($order['user_id']);
            $order['user'] = $user ? $user['username'] : 'Unknown';

            $orderItemModel = new OrderItem();
            $order['order_items'] = $orderItemModel->getOrderItemsByOrderId($order['order_id']);
            $order['total_items'] = count($order['order_items']);
        }

        return $orders;
    }

    /**
     * Get order details for a specific date
     * Used by admin to see what was ordered on a particular day
     */
    public function getOrderDetailsByDate($date) {
        $query = "
        SELECT o.order_id, o.order_date, r.name AS restaurant_name, u.username AS user_name, oi.menu_id, m.item_name AS ordered_item_name
        FROM " . $this->table . " o
        LEFT JOIN restaurant r ON o.restaurant_id = r.restaurant_id
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN order_item oi ON o.order_id = oi.order_id
        LEFT JOIN menu m ON oi.menu_id = m.menu_id
        WHERE DATE(o.order_date) = :date
        ORDER BY o.order_date DESC
    ";

        $statement = $this->conn->prepare($query);
        $statement->bindParam(':date', $date);
        $statement->execute();

        $orders = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $orders;
    }

    /**
     * Create a new order in the database
     * Returns the new order ID if successful, false if failed
     */
    public function createOrder($restaurant_id, $user_id) {
        $query = "INSERT INTO " . $this->table . " (restaurant_id, user_id) VALUES (:restaurant_id, :user_id)";
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':restaurant_id', $restaurant_id);
        $statement->bindParam(':user_id', $user_id);
        if ($statement->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Get orders grouped by date for export
     * Used by the Excel export feature
     */
    public function getOrdersGroupedByDate() {
        $query = "
    SELECT o.order_date, r.name AS restaurant_name, u.username AS user_name, oi.menu_id, m.item_name AS ordered_item_name
    FROM orders AS o
    LEFT JOIN restaurant r ON o.restaurant_id = r.restaurant_id
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_item oi ON o.order_id = oi.order_id
    LEFT JOIN menu m ON oi.menu_id = m.menu_id
    ORDER BY o.order_date DESC
    ";

        $statement = $this->conn->prepare($query);
        $statement->execute();

        $orders = $statement->fetchAll(PDO::FETCH_ASSOC);

        // Group orders by date and structure the data
        $groupedOrders = [];
        foreach ($orders as $order) {
            $date = $order['order_date'];
            if (!isset($groupedOrders[$date])) {
                $groupedOrders[$date] = [
                    'order_date' => $date,
                    'restaurant_name' => $order['restaurant_name'],
                    'user_name' => $order['user_name'],
                    'order_items' => []
                ];
            }
            $groupedOrders[$date]['order_items'][] = [
                'ordered_item_name' => $order['ordered_item_name']
            ];
        }

        return $groupedOrders;
    }

    /**
     * Fetch a flattened summary of all order items with pricing and per-line totals
     * Optionally filter by a specific date (YYYY-MM-DD) based on order_date.
     * Returns an array of rows with: order_id, order_date, restaurant_name, user_name,
     * menu_id, item_name, price (unit), quantity, line_total.
     * Used by admin to see financial summary with totals
     */
    public function getOrdersSummary($date = null) {
        $whereClause = '';
        if ($date !== null) {
            $whereClause = ' WHERE DATE(o.order_date) = :summary_date ';
        }

        $query = "
            SELECT 
                o.order_id,
                o.order_date,
                r.name AS restaurant_name,
                u.username AS user_name,
                oi.menu_id,
                oi.quantity,
                m.item_name,
                m.price,
                (oi.quantity * m.price) AS line_total
            FROM orders AS o
            LEFT JOIN restaurant r ON o.restaurant_id = r.restaurant_id
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_item oi ON o.order_id = oi.order_id
            LEFT JOIN menu m ON oi.menu_id = m.menu_id
            " . $whereClause . "
            ORDER BY o.order_date DESC, o.order_id DESC
        ";

        $statement = $this->conn->prepare($query);
        if ($date !== null) {
            $statement->bindParam(':summary_date', $date);
        }
        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

}
