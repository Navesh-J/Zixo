package com.zixo.order_service.controller;

import com.zixo.order_service.model.Order;
import com.zixo.order_service.model.OrderItem;
import com.zixo.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return orderService.getAlLOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody List<OrderItem> orderItems) {
        return orderService.placeOrder(orderItems);
    }
}
