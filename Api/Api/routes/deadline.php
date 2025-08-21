<?php
require_once __DIR__.'/../controllers/DeadlineController.php';

header("Access-Control-Allow-Origin: *"); // Allows requests from any origin (for development purposes)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$controller = new DeadlineController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'OPTIONS') {
    // Send a 200 OK response with the appropriate CORS headers for preflight
    http_response_code(200);
    exit;  // Exit after sending the response to avoid further processing
}


if ($method == 'GET') {
    $controller->getDeadline();
} elseif ($method == 'POST') {
    $controller->setDeadline();
} else {
    http_response_code(405);
    echo json_encode(["Message" => "Method Not Allowed"]);
}
