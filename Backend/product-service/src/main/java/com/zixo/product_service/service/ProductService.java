package com.zixo.product_service.service;

import com.zixo.product_service.model.Product;
import com.zixo.product_service.repo.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepo repo;

    public ResponseEntity<Product> createProduct(Product product) {
        Product saved = repo.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
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

    public ResponseEntity<Product> updateProduct(Long id, Product product) {
        Optional<Product> existingProduct = repo.findById(id);
        if (existingProduct.isPresent()) {
            Product savedProduct = existingProduct.get();
            savedProduct.setName(product.getName());
            savedProduct.setPrice(product.getPrice());
            savedProduct.setDescription(product.getDescription());
            savedProduct.setStock(product.getStock());
            Product updatedProduct = repo.save(savedProduct);
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> deleteProductById(Long id) {
        if(!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.notFound().build();
    }
}
