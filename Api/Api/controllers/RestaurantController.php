<?php

require_once __DIR__ . "/../models/Restaurant.php";
require_once __DIR__ . "/../middleware/auth.php";

class RestaurantController {
    // Get all restaurants
    public function getRestaurants() {
        // authenticate(); // Uncomment if authentication is needed
        $restaurantModel = new Restaurant();
        $restaurants = $restaurantModel->getAll();
        echo json_encode(array("data" => $restaurants));
    }

    // Get a restaurant by ID
    public function getRestaurant($id) {
        //authenticate();
        $restaurantModel = new Restaurant();
        $restaurant = $restaurantModel->getById($id);

        if ($restaurant) {
            echo json_encode(['data' => $restaurant]); // Return only the specific restaurant
        } else {
            echo json_encode(['message' => 'Restaurant not found']);
        }
    }

    // Add a new restaurant
    public function addRestaurant() {
        //authenticate();
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->name)) {
            $restaurantModel = new Restaurant();
            if($restaurantModel->create($data->name, $data->address, $data->contact_info)) {
                http_response_code(200);
                echo json_encode(array("status" => "success", "message" => "Restaurant created."));
            }
            else {
                http_response_code(500);
                echo json_encode(array("status" => "error", "message" => "Unable to create restaurant."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Invalid input."));
        }
    }

    // Update a restaurant
    public function updateRestaurant($id) {
        //authenticate();
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->name) && !empty($data->address) && !empty($data->contact_info)) {
            $restaurantModel = new Restaurant();
            if($restaurantModel->update($id, $data->name, $data->address, $data->contact_info)) {
                http_response_code(200);
                echo json_encode(array("status" => "success", "message" => "Restaurant updated."));
            }
            else {
                http_response_code(500);
                echo json_encode(array("status" => "error", "message" => "Unable to update restaurant."));
            }
        } else {
            http_response_code(400);
            echo json_epncode(array("status" => "error", "message" => "Invalid input."));
        }
    }

    // Delete a restaurant
    public function deleteRestaurant($id) {
        //authenticate();
        $restaurantModel = new Restaurant();
        if($restaurantModel->delete($id)) {
            http_response_code(200);
            echo json_encode(array("status" => "success", "message" => "Restaurant deleted."));
        } else {
            http_response_code(500);
            echo json_encode(array("status" => "error", "message" => "Unable to delete restaurant."));
        }
    }
}
