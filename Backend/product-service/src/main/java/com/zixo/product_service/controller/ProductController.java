package com.zixo.product_service.controller;

import com.zixo.product_service.dto.CreateProductRequest;
import com.zixo.product_service.dto.UpdateProductRequest;
import com.zixo.product_service.model.Product;
import com.zixo.product_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping("/add")
    public ResponseEntity<Product> create(@RequestHeader("X-User-Name") String username, @Valid @RequestBody CreateProductRequest product) {
        return ResponseEntity.ok(service.createProduct(username, product));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return service.getProducts();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Product>> getMyProducts(@RequestHeader("X-User-Name") String username) {
        System.out.println("USERNAME: " + username);
        return ResponseEntity.ok(service.getBySeller(username));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@RequestHeader("X-User-Name") String username, @PathVariable Long id, @RequestBody UpdateProductRequest product) {
        return service.updateProduct(username, id, product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return service.deleteProductById(id);
    }
}
