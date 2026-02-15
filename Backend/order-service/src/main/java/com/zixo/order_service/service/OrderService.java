package com.zixo.order_service.service;

import com.zixo.order_service.dto.ProductResponse;
import com.zixo.order_service.dto.StockRequest;
import com.zixo.order_service.exception.InvalidOrderStateException;
import com.zixo.order_service.exception.OrderNotFoundException;
import com.zixo.order_service.exception.ValidationException;
import com.zixo.order_service.feign.InventoryClient;
import com.zixo.order_service.feign.ProductClient;
import com.zixo.order_service.model.Order;
import com.zixo.order_service.model.OrderItem;
import com.zixo.order_service.model.OrderStatus;
import com.zixo.order_service.repo.OrderRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductClient productClient;
    private final InventoryClient inventoryClient;

    public List<Order> getAlLOrders() {
        return orderRepo.findAll();
    }

    public Order getOrder(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    private void reserveStock(OrderItem item) {
        StockRequest request = new StockRequest();
        request.setProductId(item.getProductId());
        request.setQuantity(item.getQuantity());
        inventoryClient.reserveStock(request);
    }

    private void releaseReservedStock(List<OrderItem> items) {
        for (OrderItem item : items) {
            try {
                StockRequest request = new StockRequest();
                request.setProductId(item.getProductId());
                request.setQuantity(item.getQuantity());
                inventoryClient.releaseStock(request);
            } catch (Exception ignored) {
            }
        }
    }

    private void confirmStock(OrderItem item) {
        StockRequest request = new StockRequest();
        request.setProductId(item.getProductId());
        request.setQuantity(item.getQuantity());
        inventoryClient.confirmStock(request);
    }

    private void validateOrder(String username, List<OrderItem> orderItems) {
        if (username == null || username.isBlank()) {
            throw new ValidationException("Username is required");
        }
        if (orderItems == null || orderItems.isEmpty()) {
            throw new ValidationException("Order items cannot be empty");
        }
        for (OrderItem item : orderItems) {
            if (item.getProductId() == null) {
                throw new ValidationException("Product ID required");
            }
            if (item.getQuantity() <= 0) {
                throw new ValidationException("Invalid quantity");
            }
        }
    }


    @Transactional
    public Order placeOrder(String username, List<OrderItem> orderItems) {
        validateOrder(username, orderItems);
        double total = 0;
        List<OrderItem> processedItems  = new ArrayList<>();
        try {
            for (OrderItem item : orderItems) {
                ProductResponse product = productClient.getProductById(item.getProductId());
                item.setPrice(product.getPrice());
                item.setProductName(product.getProductName());
                total += product.getPrice() * item.getQuantity();
                reserveStock(item);
                processedItems.add(item);
            }

            Order order = new Order();
            order.setUsername(username);
            order.setOrderDate(LocalDateTime.now());
            order.setOrderStatus(OrderStatus.INVENTORY_RESERVED);
            order.setItems(orderItems);
            order.setTotalAmount(total);

            order = orderRepo.save(order);

            for (OrderItem item : processedItems) {
                confirmStock(item);
            }
            order.setOrderStatus(OrderStatus.COMPLETED);

            return order;

        } catch (Exception ex) {
            releaseReservedStock(processedItems);
            throw ex;
        }
    }

    @Transactional
    public Order cancelOrder(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (order.getOrderStatus() != OrderStatus.COMPLETED) {
            throw new InvalidOrderStateException("Only completed orders can be cancelled");
        }

        for (OrderItem item : order.getItems()) {
            StockRequest request = new StockRequest();
            request.setProductId(item.getProductId());
            request.setQuantity(item.getQuantity());
            inventoryClient.releaseStock(request);
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        return order;
    }

}
