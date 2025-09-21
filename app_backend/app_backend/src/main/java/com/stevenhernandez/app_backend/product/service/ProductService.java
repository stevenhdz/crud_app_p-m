package com.stevenhernandez.app_backend.product.service;

import com.stevenhernandez.app_backend.product.domain.Product;
import com.stevenhernandez.app_backend.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {
  private final ProductRepository repo;
  public ProductService(ProductRepository repo) { this.repo = repo; }

  public List<Product> findAll() { return repo.findAll(); }
  public Optional<Product> findById(Integer id) { return repo.findById(id); }
  public Product save(Product p) { return repo.save(p); }
  public void delete(Integer id) { repo.deleteById(id); }

  public Map<String, Object> inventorySummary() {
    List<Product> products = repo.findAll();

    BigDecimal total = products.stream()
      .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getCountInStock())))
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    Product top = products.stream()
      .max(Comparator.comparing(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getCountInStock()))))
      .orElse(null);

    Map<String, Object> res = new HashMap<>();
    res.put("totalInventoryValue", total);
    res.put("topInventoryProduct", top);
    return res;
  }

  /** Devuelve combinaciones de 2 o 3 productos [nombres..., suma] <= budget, orden desc por suma, máx 5 */
  public List<List<Object>> combosUnderOrEqual(BigDecimal budget) {
    List<Product> list = repo.findAll();
    int n = list.size();
    List<List<Object>> combos = new ArrayList<>();

    // 2-product combos
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        BigDecimal sum = list.get(i).getPrice().add(list.get(j).getPrice());
        if (sum.compareTo(budget) <= 0) {
          combos.add(Arrays.asList(list.get(i).getName(), list.get(j).getName(), sum));
        }
      }
    }
    // 3-product combos
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        for (int k = j + 1; k < n; k++) {
          BigDecimal sum = list.get(i).getPrice().add(list.get(j).getPrice()).add(list.get(k).getPrice());
          if (sum.compareTo(budget) <= 0) {
            combos.add(Arrays.asList(
              list.get(i).getName(), list.get(j).getName(), list.get(k).getName(), sum
            ));
          }
        }
      }
    }

    return combos.stream()
      .sorted((a,b) -> ((BigDecimal)b.get(b.size()-1)).compareTo((BigDecimal)a.get(a.size()-1)))
      .limit(5)
      .collect(Collectors.toList());
  }
}
