package com.zixo.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SellerAnalyticsResponse {

    private int totalOrders;
    private double totalRevenue;
    private int totalItemsSold;
    private List<ProductStats> topProducts;
}