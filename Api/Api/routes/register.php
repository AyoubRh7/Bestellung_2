<?php
 require_once __DIR__.'/../controllers/UserController.php';

header('Access-Control-Allow-Origin: *');
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Headers: Authorization');

$controller = new UserController();

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $controller->register();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
