package com.zixo.order_service.controller;

import com.zixo.order_service.model.Order;
import com.zixo.order_service.model.OrderItem;
import com.zixo.order_service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@RequestHeader("X-User-Name") String username, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(username, id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(@RequestHeader("X-User-Name") String username) {
        return ResponseEntity.ok(orderService.getOrdersByUsername(username));
    }

    @GetMapping("/seller/orders")
    public ResponseEntity<List<Order>> getSellerOrders(@RequestHeader("X-User-Name") String username) {

        return ResponseEntity.ok(orderService.getSellerOrders(username));
    }

    @GetMapping("/seller/analytics")
    public ResponseEntity<?> getSellerAnalytics(@RequestHeader("X-User-Name") String username) {

        return ResponseEntity.ok(orderService.getSellerAnalytics(username));
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestHeader("X-User-Name") String username, @RequestBody List<@Valid OrderItem> orderItems) {
        Order order = orderService.placeOrder(username, orderItems);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@RequestHeader("X-User-Name") String username, @PathVariable Long id, @RequestBody Map<String, String> payload) {

        return ResponseEntity.ok(orderService.cancelOrder(id, username, payload.get("reason")));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Order> payOrder(@RequestHeader("X-User-Name") String username, @PathVariable Long id) {

        return ResponseEntity.ok(orderService.payOrder(id, username));
    }
}
