<?php
require_once __DIR__.'/../models/Deadline.php';

/**
 * Deadline Controller
 * Handles order deadline operations (view and set)
 */
class DeadlineController {

    /**
     * Get the current deadline
     * Public endpoint - no login required
     * Used by employees to see when they need to place orders
     */
    public function getDeadline(){
        $deadlineModel = new Deadline();
        $deadline = $deadlineModel->getDeadline();

        if($deadline){
            http_response_code(200);
            echo json_encode(["deadline" => $deadline]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Not deadline found"]);
        }
    }

    /**
     * Set or update the deadline - ADMIN ONLY
     * Requires admin login to prevent unauthorized deadline changes
     * Used by admin to set when employees must place orders
     */
    public function setDeadline(){
        include_once __DIR__.'/../middleware/auth.php';
        
        // Check if user is logged in and is admin
        $authUser = authenticate();
        if (!isset($authUser->role) || $authUser->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Not allowed"]);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->deadline)){
            $deadlineModel = new Deadline();
            if($deadlineModel->setDeadline($data->deadline)){
             http_response_code(200);
             echo json_encode(["message" => "Deadline Updated"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Unable to update deadline"]);
            }
        }else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid input"]);
        }
    }
}
