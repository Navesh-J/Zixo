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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepo repo;
    private final InventoryClient inventoryClient;

    private static final String UPLOAD_DIR = "uploads/";

    public Product createProductWithUrl(String username, CreateProductRequest request) {

        if (request.getImageUrl() == null || request.getImageUrl().isBlank()) {
            throw new RuntimeException("Image URL required");
        }

        Product product = buildProduct(username, request.getProductName(),
                request.getProductDescription(),
                request.getPrice(),
                request.getImageUrl());

        Product saved = repo.save(product);
        try {
            inventoryClient.initStock(new StockRequest(saved.getProductId(), request.getInitialStock()));
        } catch (Exception ex) {
            rollbackProduct(saved.getProductId());
            System.out.println("Inventory error: " + ex.getMessage());
//            ex.printStackTrace();

            throw new RuntimeException("Inventory init failed: " + ex.getMessage());
        }
        return saved;
    }

    public Product createProductWithImage(String username,
                                           String productName,
                                           String description,
                                           Double price,
                                           Integer stock,
                                           MultipartFile image) {
        validateImage(image);
        if (stock == null || stock <= 0) {
            throw new IllegalArgumentException("Initial stock must be > 0");
        }

        String imageUrl = storeImage(image);

        Product product = buildProduct(username, productName, description, price, imageUrl);

        Product saved = repo.save(product);

        try {
            inventoryClient.initStock(new StockRequest(saved.getProductId(), stock));
        } catch (Exception ex) {
            rollbackProduct(saved.getProductId());
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
        if (request.getProductName() != null)
            product.setProductName(request.getProductName());

        if (request.getProductDescription() != null)
            product.setProductDescription(request.getProductDescription());

        if (request.getPrice() != null)
            product.setPrice(request.getPrice());

        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            product.setImageUrl(request.getImageUrl());
        }

        Product updated = repo.save(product);

        if (request.getAdditionalStock() != null && request.getAdditionalStock() > 0) {
            inventoryClient.addStock(new StockRequest(id, request.getAdditionalStock()));
        }

        return ResponseEntity.ok(updated);
    }

    public Product updateProductWithImage(String username,
                                          Long id,
                                          String productName,
                                          String description,
                                          Double price,
                                          MultipartFile image) throws IOException {

        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSellerUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        validateImage(image);

        String oldImageUrl = product.getImageUrl();

        if (oldImageUrl != null && oldImageUrl.startsWith("/products/image/")) {
            String oldFilename = oldImageUrl.replace("/products/image/", "");
            Files.deleteIfExists(Paths.get(UPLOAD_DIR).resolve(oldFilename));
        }

        String imageUrl = storeImage(image);

        product.setProductName(productName);
        product.setProductDescription(description);
        product.setPrice(price);
        product.setImageUrl(imageUrl);

        return repo.save(product);
    }

    public ResponseEntity<Void> deleteProductById(Long id) {
        Product product = repo.findById(id)
                .orElse(null);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        // 🔥 Delete image file if exists
        String imageUrl = product.getImageUrl();

        if (imageUrl != null && imageUrl.startsWith("/products/image/")) {
            String filename = imageUrl.replace("/products/image/", "");

            try {
                Files.deleteIfExists(Paths.get(UPLOAD_DIR).resolve(filename));
            } catch (IOException e) {
                System.out.println("Failed to delete image file: " + e.getMessage());
            }
        }
        try {
            inventoryClient.deleteStock(id);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete inventory");
        }
        repo.deleteById(id);
        return ResponseEntity.noContent()
                .build();
    }

    public List<Product> getBySeller(String username) {
        return repo.findBySellerUsername(username);
    }

    private Product buildProduct(String username,
                                 String name,
                                 String description,
                                 Double price,
                                 String imageUrl) {

        Product product = new Product();
        product.setProductName(name);
        product.setProductDescription(description);
        product.setPrice(price);
        product.setSellerUsername(username);
        product.setImageUrl(imageUrl);

        return product;
    }

    private void rollbackProduct(Long id) {
        repo.deleteById(id);
    }

    private void validateImage(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Image required");
        }

        String contentType = image.getContentType();

        if (contentType == null ||
                (!contentType.equals("image/jpeg") &&
                        !contentType.equals("image/png") &&
                        !contentType.equals("image/webp"))) {

            throw new RuntimeException("Only JPG, PNG, WEBP allowed");
        }
    }

    private String storeImage(MultipartFile image) {

        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String original = image.getOriginalFilename();
            if (original == null) {
                throw new RuntimeException("Invalid file name");
            }
            String cleanName = StringUtils.cleanPath(original);
            String fileName = UUID.randomUUID() + "_" + cleanName;

            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/products/image/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }
}
