<?php

require_once __DIR__.'/../models/OrderItem.php';
require_once __DIR__.'/../middleware/auth.php';

class OrderItemController {
    public function getOrderItems($order_id) {
        authenticate();
        $orderItemModel = new OrderItem();
        echo json_encode($orderItemModel->getByOrder($order_id));
    }
}