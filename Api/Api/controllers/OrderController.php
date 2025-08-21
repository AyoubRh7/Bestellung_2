<?php
require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/OrderItem.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/auth.php';



use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$spreadsheet = new Spreadsheet();

/**
 * Order Controller
 * Handles all order-related operations (create, view, export)
 */
class OrderController {

    /**
     * Get orders - different behavior for admin vs employee
     * Admin: sees all orders from all users
     * Employee: sees only their own orders
     */
    public function getOrders() {
        try {
            // Check if user is logged in and get their info
            $authUser = authenticate();
            $orderModel = new Order();
            
            // Admin sees all orders; employees see only their own
            if (isset($authUser->role) && $authUser->role === 'admin') {
                $orders = $orderModel->getOrders(); // All orders
            } else {
                $orders = $orderModel->getOrdersByUserId($authUser->id); // Only user's orders
            }

            if ($orders) {
                header("Content-Type: application/json");
                echo json_encode($orders);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "No orders found."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to fetch orders.", "error" => $e->getMessage()]);
        }
    }

    /**
     * Get orders for a specific date - ADMIN ONLY
     * Used by admin to see what was ordered on a particular day
     */
    public function getOrdersByDate($date) {
        try {
            // Check if user is logged in and is admin
            $authUser = authenticate();
            if (!isset($authUser->role) || $authUser->role !== 'admin') {
                http_response_code(403);
                echo json_encode(["message" => "Not allowed"]);
                return;
            }
            
            $orderModel = new Order();
            $orders = $orderModel->getOrderDetailsByDate($date);

            if ($orders) {
                header("Content-Type: application/json");
                echo json_encode($orders);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "No orders found for the given date."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to fetch orders.", "error" => $e->getMessage()]);
        }
    }

    /**
     * Export all orders to Excel file - ADMIN ONLY
     * Creates a downloadable spreadsheet with order details
     */
    public function exportOrdersToCSV() {
        try {
            // Check if user is logged in and is admin
            $authUser = authenticate();
            if (!isset($authUser->role) || $authUser->role !== 'admin') {
                http_response_code(403);
                echo json_encode(["message" => "Not allowed"]);
                return;
            }
            
            // Start output buffering to prevent any unwanted HTML output
            ob_start();

            // Fetch all orders from the database
            $orderModel = new Order();
            $orders = $orderModel->getOrdersGroupedByDate();

            // Check if we have any orders to export
            if (empty($orders)) {
                echo "No orders found.";
                return;
            }

            // Create a new Excel spreadsheet
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Set the column headers
            $headers = ['Order Date', 'Restaurant Name', 'User Name', 'Ordered Item Name'];
            $sheet->fromArray($headers, null, 'A1');

            // Style the header row (yellow background, bold text)
            $headerStyle = [
                'font' => [
                    'bold' => true,
                    'size' => 12
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'FFFF00'  // Yellow background
                    ]
                ]
            ];
            $sheet->getStyle('A1:D1')->applyFromArray($headerStyle);

            // Loop through each order and write the details to the spreadsheet
            $row = 2; // Start writing data from the second row
            foreach ($orders as $order) {
                if (isset($order['order_date'], $order['restaurant_name'], $order['user_name'], $order['order_items'])) {
                    foreach ($order['order_items'] as $item) {
                        // Format the date to ensure Excel recognizes it properly
                        $formattedDate = date('Y-m-d', strtotime($order['order_date']));

                        // Write each row to the spreadsheet
                        $sheet->setCellValue('A' . $row, $formattedDate);        // Order Date
                        $sheet->setCellValue('B' . $row, $order['restaurant_name']); // Restaurant Name
                        $sheet->setCellValue('C' . $row, $order['user_name']);      // User Name
                        $sheet->setCellValue('D' . $row, $item['ordered_item_name']); // Ordered Item Name

                        $row++; // Move to the next row
                    }
                }
            }

            // Auto-size columns to fit content
            foreach (range('A', 'D') as $column) {
                $sheet->getColumnDimension($column)->setAutoSize(true);
            }

            // Set headers to tell browser this is a downloadable Excel file
            $fileName = 'orders_export_' . date('Ymd_His') . '.xlsx';
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $fileName . '"');
            header('Cache-Control: max-age=0');

            // Output the file to the browser
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');

            exit(); // Stop execution after sending file

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to export orders.", "error" => $e->getMessage()]);
        }
    }

    /**
     * Get summary of all orders with prices and totals - ADMIN ONLY
     * Shows each ordered item with its price, quantity, and line total
     * Also calculates the grand total for all orders
     */
    public function getOrdersSummary() {
        try {
            // Check if user is logged in and is admin
            $authUser = authenticate();
            if (!isset($authUser->role) || $authUser->role !== 'admin') {
                http_response_code(403);
                echo json_encode(["message" => "Not allowed"]);
                return;
            }

            // Optional date filter
            $date = isset($_GET['date']) ? $_GET['date'] : null;
            $orderModel = new Order();
            $rows = $orderModel->getOrdersSummary($date);

            // Calculate grand total from all line totals
            $grandTotal = 0;
            foreach ($rows as $row) {
                $grandTotal += (float)$row['line_total'];
            }

            header('Content-Type: application/json');
            echo json_encode([
                'data' => $rows,
                'grand_total' => $grandTotal
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to fetch summary.", "error" => $e->getMessage()]);
        }
    }

    /**
     * Create a new order - requires login
     * Uses the logged-in user's ID (not client-provided user_id for security)
     * Accepts flexible item formats from different frontend implementations
     */
    public function createOrder()
    {
        // Check if user is logged in and get their info
        $authUser = authenticate();
        $data = json_decode(file_get_contents("php://input"));

        // Normalize incoming order items payload to a common shape
        // Frontend might send 'order_items' or 'items'
        $items = [];
        if (isset($data->order_items) && is_array($data->order_items)) {
            $items = $data->order_items;
        } elseif (isset($data->items) && is_array($data->items)) {
            $items = $data->items;
        }

        // Validate input data (restaurant_id required; user_id taken from token for security)
        if (!empty($data->restaurant_id) && !empty($items)) {
            $orderModel = new Order();
            // Use the authenticated user's ID, not client-provided user_id
            $order_id = $orderModel->createOrder($data->restaurant_id, $authUser->id);

            if ($order_id) {
                require_once __DIR__ . '/../models/OrderItem.php';
                $orderItemModel = new OrderItem();

                // Add each item to the order
                foreach ($items as $item) {
                    // Handle different field names for menu item ID
                    $menuId = null;
                    if (!empty($item->menu_id)) { 
                        $menuId = $item->menu_id; 
                    } elseif (!empty($item->product_id)) { 
                        $menuId = $item->product_id; 
                    } elseif (!empty($item->id)) { 
                        $menuId = $item->id; 
                    }
                    
                    $quantity = isset($item->quantity) ? (int)$item->quantity : 1;
                    
                    if (!empty($menuId) && $quantity > 0) {
                        $orderItemModel->createOrderItem($order_id, $menuId, $quantity);
                    }
                }

                echo json_encode(["Message" => "Order created successfully.", "OrderId" => $order_id]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to create order."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid input. 'restaurant_id' and items are required."]);
        }
    }
}
