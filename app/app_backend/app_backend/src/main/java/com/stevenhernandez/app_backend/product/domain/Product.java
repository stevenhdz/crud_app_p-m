package com.stevenhernandez.app_backend.product.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NotBlank
  @Size(max = 150)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @NotNull
  @DecimalMin("0.00")
  @Digits(integer = 12, fraction = 2)
  private BigDecimal price;

  @NotNull
  @Min(0)
  private Integer countInStock;

  public Integer getId() { return id; }
  public void setId(Integer id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }

  public Integer getCountInStock() { return countInStock; }
  public void setCountInStock(Integer countInStock) { this.countInStock = countInStock; }
}
