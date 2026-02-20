package com.zixo.product_service.service;

import com.zixo.product_service.dto.CreateProductRequest;
import com.zixo.product_service.dto.StockRequest;
import com.zixo.product_service.dto.UpdateProductRequest;
import com.zixo.product_service.feign.InventoryClient;
import com.zixo.product_service.model.Product;
import com.zixo.product_service.repo.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepo repo;
    private final InventoryClient inventoryClient;

    public Product createProduct(String username, CreateProductRequest request) {

        if (request.getInitialStock() == null || request.getInitialStock() <= 0) {
            throw new IllegalArgumentException("Initial stock must be > 0");
        }
        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setProductDescription(request.getProductDescription());
        product.setPrice(request.getPrice());
        product.setSellerUsername(username);

        Product saved = repo.save(product);
        try {
            inventoryClient.initStock(new StockRequest(saved.getProductId(), request.getInitialStock()));
        } catch (Exception ex) {
            repo.deleteById(saved.getProductId());
            System.out.println("Inventory error: " + ex.getMessage());
            ex.printStackTrace();

            throw new RuntimeException("Inventory init failed: " + ex.getMessage());
        }
        return saved;
    }

    public ResponseEntity<List<Product>> getProducts() {
        List<Product> products = repo.findAll();
        return ResponseEntity.ok(products);
    }

    public ResponseEntity<Product> getProduct(Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound()
                        .build());
    }

    public ResponseEntity<Product> updateProduct(String username, Long id, UpdateProductRequest request) {

        Optional<Product> existingProduct = repo.findById(id);

        if (existingProduct.isEmpty()) {
            return ResponseEntity.notFound()
                    .build();
        }

        Product product = existingProduct.get();
        if (!product.getSellerUsername()
                .equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        product.setProductName(request.getProductName());
        product.setPrice(request.getPrice());
        product.setProductDescription(request.getProductDescription());

        Product updated = repo.save(product);

        if (request.getAdditionalStock() != null && request.getAdditionalStock() > 0) {
            inventoryClient.addStock(new StockRequest(id, request.getAdditionalStock()));
        }

        return ResponseEntity.ok(updated);
    }

    public ResponseEntity<Void> deleteProductById(Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound()
                    .build();
        }
        repo.deleteById(id);
        inventoryClient.deleteStock(id);
        return ResponseEntity.noContent()
                .build();
    }

    public List<Product> getBySeller(String username) {
        return repo.findBySellerUsername(username);
    }
}
