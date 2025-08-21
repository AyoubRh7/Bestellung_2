<?php

require_once __DIR__.'/../config/autoload.php';
require_once __DIR__.'/../models/User.php';
require_once __DIR__.'/../src/JWT.php';

use Firebase\JWT\JWT;

/**
 * User Controller
 * Handles user registration and login
 */
class UserController {

    /**
     * Register a new user (admin or employee)
     * This endpoint is public - no login required
     */
    public function register() {
        $data = json_decode(file_get_contents("php://input"));

        // Check if all required fields are provided
        if(!empty($data->username) && !empty($data->email) && !empty($data->password) && !empty($data->role)) {

            // Validate the role - only admin or employee allowed
            $allowedRoles = ['admin', 'employee'];
            if(!in_array($data->role, $allowedRoles)) {
                http_response_code(400);
                echo json_encode([
                    "message" => "Invalid role. Allowed roles are Admin or Employee"
                ]);
                return;
            }

            // Create new user in database
            $userModel = new User();
            $user_id = $userModel->register($data->username, $data->email, $data->password, $data->role);

            if($user_id) {
                http_response_code(201);
                echo json_encode([
                    "message" => "User created successfully",
                    "user_id" => $user_id
                ]);
            } else {
                // Email already taken
                http_response_code(400);
                echo json_encode([
                    "message" => "Email might be already in use"
                ]);
            }

        } else {
            http_response_code(400);
            echo json_encode([
                "message" => "Invalid data"
            ]);
        }
    }

    /**
     * Login user and create JWT token
     * This endpoint is public - no login required
     */
    public function login()
    {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->username) && !empty($data->password)) {

            // Check username and password against database
            $userModel = new User();
            $user = $userModel->login($data->username, $data->password);
            $role = $user['role'];
            
            if ($user) {
                $secret_key = "This is my secret key";
                $now = time();
                $expiresAt = $now + (60 * 60 * 8); // Token expires in 8 hours
                
                // Only include non-sensitive fields in the token
                // Don't include password hash or other private info
                $userClaims = [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ];
                
                // Create JWT token with user info and expiration
                $payload = array(
                    'iat' => $now,        // Issued at (when token was created)
                    'exp' => $expiresAt,  // Expires at (when token becomes invalid)
                    'data' => (object)$userClaims  // User information
                );
                $jwt = JWT::encode($payload, $secret_key, 'HS256');

                // Return success with token and role
                echo json_encode(array(
                    "status" => "success",
                    "message" => "Login success",
                    "token" => $jwt,
                    "role" => $user['role']
                ));
            } else {
                http_response_code(401);
                echo json_encode(array(
                    "status" => "error",
                    "message" => "Login failed : invalid username or password"
                ));
            }
        } else {
            http_response_code(400);
            echo json_encode(array(
                "status" => "error",
                "message" => "Login failed : Missing username or password"
            ));
        }
    }
}

?>