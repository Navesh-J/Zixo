package com.zixo.order_service.service;

import com.zixo.order_service.dto.ProductResponse;
import com.zixo.order_service.feign.ProductClient;
import com.zixo.order_service.model.Order;
import com.zixo.order_service.model.OrderItem;
import com.zixo.order_service.repo.OrderRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductClient productClient;

    public ResponseEntity<List<Order>> getAlLOrders() {
        return ResponseEntity.ok(orderRepo.findAll());
    }

    public ResponseEntity<Order> getOrder(Long id) {
        return orderRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound()
                        .build());
    }

    public ResponseEntity<Order> placeOrder(List<OrderItem> orderItems) {
        double total = 0;
        for (OrderItem orderItem : orderItems) {
            ProductResponse product = productClient.getProductById(orderItem.getProductId());
            orderItem.setPrice(product.getPrice());
            total = product.getPrice() * orderItem.getQuantity();
        }
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus("CREATED");
        order.setItems(orderItems);
        order.setTotalAmount(total);
        return ResponseEntity.ok(orderRepo.save(order));
    }
}
