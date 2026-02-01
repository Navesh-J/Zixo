package com.zixo.product_service.controller;

import com.zixo.product_service.model.Product;
import com.zixo.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        return service.createProduct(product);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return service.getProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @PutMapping("/{id}")
    public  ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return service.updateProduct(id,product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return service.deleteProductById(id);
    }
}
