package com.stevenhernandez.app_backend.product.repository;

import com.stevenhernandez.app_backend.product.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {}
