<?php
/**
 * Authentication Middleware
 * This file handles checking if users are logged in and have valid tokens
 */
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\{JWT, Key};

/**
 * Check if the user is logged in by validating their JWT token
 * This function is called at the start of protected API endpoints
 * 
 * @return object The user data from the token (id, username, email, role)
 * @throws 401 error if no token or invalid token
 */
function authenticate() {
    // Different web servers store headers differently, so we need to handle multiple ways
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers(); // Apache server
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders(); // Some other servers
    } else {
        // Fallback: manually extract headers from $_SERVER
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (strpos($name, 'HTTP_') === 0) {
                $key = str_replace('_', '-', strtolower(substr($name, 5)));
                $headers[$key] = $value;
            }
        }
    }

    // Headers can have different letter cases (Authorization vs authorization)
    // So we normalize them all to lowercase
    $normalized = [];
    foreach ($headers as $k => $v) {
        $normalized[strtolower($k)] = $v;
    }

    // Look for the Authorization header that contains the token
    $authHeader = $normalized['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? null);
    if (!$authHeader) {
        http_response_code(401);
        echo json_encode([
            "message" => "Authorization header is missing",
        ]);
        exit();
    }

    // Extract the actual token from "Bearer <token>"
    // Some clients send "Bearer <token>", others just send "<token>"
    if (stripos($authHeader, 'Bearer ') === 0) {
        $token = trim(substr($authHeader, 7)); // Remove "Bearer " prefix
    } else {
        $token = trim($authHeader); // Use as-is
    }

    $secretKey = "This is my secret key"; // Same key used to create the token

    try {
        // Decode and verify the token using our secret key
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        
        // The token contains user data in the 'data' field
        // Return this so controllers can access user info (id, username, role, etc.)
        return $decoded->data;
    } catch (Exception $e) {
        // Token is invalid, expired, or tampered with
        http_response_code(401);
        echo json_encode([
            "message" => "Invalid token: " . $e->getMessage(),
        ]);
        exit();
    }
}

