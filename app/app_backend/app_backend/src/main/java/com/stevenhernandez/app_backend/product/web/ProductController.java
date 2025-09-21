package com.stevenhernandez.app_backend.product.web;

import com.stevenhernandez.app_backend.product.domain.Product;
import com.stevenhernandez.app_backend.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService service;
  public ProductController(ProductService service) { this.service = service; }

  @GetMapping
  public List<Product> list() { return service.findAll(); }

  @GetMapping("/{id}")
  public ResponseEntity<Product> get(@PathVariable Integer id) {
    return service.findById(id).map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Product> create(@Valid @RequestBody Product p) {
    Product saved = service.save(p);
    return ResponseEntity.created(URI.create("/api/products/" + saved.getId())).body(saved);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Product> update(@PathVariable Integer id, @Valid @RequestBody Product p) {
    return service.findById(id)
      .map(existing -> {
        p.setId(id);
        return ResponseEntity.ok(service.save(p));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) {
    if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/inventory/summary")
  public Map<String, Object> inventorySummary() { return service.inventorySummary(); }

  @GetMapping("/combos")
  public List<List<Object>> combos(@RequestParam BigDecimal budget) {
    return service.combosUnderOrEqual(budget);
  }
}
