package com.zixo.order_service.service;

import com.zixo.order_service.dto.ProductResponse;
import com.zixo.order_service.dto.ProductStats;
import com.zixo.order_service.dto.SellerAnalyticsResponse;
import com.zixo.order_service.dto.StockRequest;
import com.zixo.order_service.exception.InvalidOrderStateException;
import com.zixo.order_service.exception.OrderNotFoundException;
import com.zixo.order_service.exception.UnauthorizedAccessException;
import com.zixo.order_service.exception.ValidationException;
import com.zixo.order_service.feign.InventoryClient;
import com.zixo.order_service.feign.ProductClient;
import com.zixo.order_service.model.Order;
import com.zixo.order_service.model.OrderItem;
import com.zixo.order_service.model.OrderStatus;
import com.zixo.order_service.repo.OrderRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductClient productClient;
    private final InventoryClient inventoryClient;

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order getOrder(String username, Long id) {

        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        if (!order.getUsername()
                .equals(username)) {
            throw new UnauthorizedAccessException("Unauthorized access");
        }

        return order;
    }

    public List<Order> getOrdersByUsername(String username) {
        return orderRepo.findByUsername(username);
    }

    public List<Order> getSellerOrders(String username) {
        return orderRepo.findOrdersBySeller(username);
    }

    public SellerAnalyticsResponse getSellerAnalytics(String username) {

        List<Order> orders = orderRepo.findOrdersBySeller(username);

        int totalOrders = 0;
        double totalRevenue = 0;
        int totalItemsSold = 0;

        Map<Long, ProductStats> productStatsMap = new HashMap<>();

        for (Order order : orders) {

            boolean sellerInOrder = false;

            for (OrderItem item : order.getItems()) {

                if (!username.equals(item.getSellerUsername())) continue;

                sellerInOrder = true;

                double itemRevenue = item.getPrice() * item.getQuantity();

                totalRevenue += itemRevenue;
                totalItemsSold += item.getQuantity();

                ProductStats stats = productStatsMap.computeIfAbsent(
                        item.getProductId(),
                        id -> new ProductStats(id, item.getProductName(), 0, 0.0)
                );

                stats.setQuantitySold(stats.getQuantitySold() + item.getQuantity());
                stats.setRevenue(stats.getRevenue() + itemRevenue);
            }

            if (sellerInOrder) {
                totalOrders++;
            }
        }

        // 🔥 Top 5 products by revenue
        List<ProductStats> topProducts = productStatsMap.values()
                .stream()
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .limit(5)
                .toList();

        return new SellerAnalyticsResponse(
                totalOrders,
                totalRevenue,
                totalItemsSold,
                topProducts
        );
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
            } catch (Exception e) {
                log.error("Failed to release stock for product {}", item.getProductId(), e);
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
        List<OrderItem> processedItems = new ArrayList<>();
        try {
            for (OrderItem item : orderItems) {
                ProductResponse product = productClient.getProductById(item.getProductId());
                item.setPrice(product.getPrice());
                item.setProductName(product.getProductName());
                item.setSellerUsername(product.getSellerUsername());
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

//            for (OrderItem item : processedItems) {
//                confirmStock(item);
//            }
//            order.setOrderStatus(OrderStatus.COMPLETED);

            return order;

        } catch (Exception ex) {
            releaseReservedStock(processedItems);
            throw ex;
        }
    }

    @Transactional
    public Order cancelOrder(Long orderId, String username, String reason) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (!order.getUsername()
                .equals(username)) {
            throw new UnauthorizedAccessException("Unauthorized");
        }

        if (reason == null || reason.isBlank()) {
            throw new ValidationException("Cancellation reason required");
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED || order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOrderStateException("Current Order cannot be cancelled");
        }

        for (OrderItem item : order.getItems()) {
            StockRequest request = new StockRequest();
            request.setProductId(item.getProductId());
            request.setQuantity(item.getQuantity());
            inventoryClient.releaseStock(request);
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason);

        return orderRepo.save(order);
    }

    // 🔥 DUMMY PAYMENT
    @Transactional
    public Order payOrder(Long orderId, String username) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        // 🔐 ownership
        if (!order.getUsername()
                .equals(username)) {
            throw new UnauthorizedAccessException("Unauthorized");
        }

        // only reserved orders can be paid
        if (order.getOrderStatus() != OrderStatus.INVENTORY_RESERVED) {
            throw new InvalidOrderStateException("Invalid order state for payment");
        }

        // 🔥 confirm stock
        for (OrderItem item : order.getItems()) {
            confirmStock(item);
        }

        order.setOrderStatus(OrderStatus.COMPLETED);

        return orderRepo.save(order);
    }
}
