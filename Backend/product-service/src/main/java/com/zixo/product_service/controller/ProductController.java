package com.zixo.product_service.controller;

import com.zixo.product_service.dto.CreateProductRequest;
import com.zixo.product_service.dto.UpdateProductRequest;
import com.zixo.product_service.model.Product;
import com.zixo.product_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping("/add")
    public ResponseEntity<Product> createWithUrl(@RequestHeader("X-User-Name") String username,
                                                 @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(service.createProductWithUrl(username, request));
    }

    @PostMapping(value = "/add-with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createWithImage(@RequestHeader("X-User-Name") String username,
                                                   @RequestParam("productName") String productName,
                                                   @RequestParam("price") Double price,
                                                   @RequestParam("initialStock") Integer stock,
                                                   @RequestParam(value = "productDescription", required = false) String description,
                                                   @RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(service.createProductWithImage(username, productName, description, price, stock, image));
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

    @PutMapping(value = "/{id}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateWithImage(
            @RequestHeader("X-User-Name") String username,
            @PathVariable Long id,
            @RequestParam("productName") String productName,
            @RequestParam("price") Double price,
            @RequestParam(value = "productDescription", required = false) String description,
            @RequestParam("image") MultipartFile image) throws IOException {

        return ResponseEntity.ok(
                service.updateProductWithImage(username, id, productName, description, price, image)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return service.deleteProductById(id);
    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {

        Path path = Paths.get("uploads")
                .resolve(filename)
                .normalize();
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound()
                    .build();
        }

        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}