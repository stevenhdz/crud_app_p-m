CREATE DATABASE IF NOT EXISTS crud_app
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE crud_app;

CREATE TABLE IF NOT EXISTS products (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(150) NOT NULL,
	description TEXT,
	price DECIMAL(14,2) NOT NULL,
	count_in_stock INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX (name)
);

INSERT INTO products (name, description, price, count_in_stock) VALUES
("A", "Ejemplo A", 2.00, 10),
("B", "Ejemplo B", 4.00, 5),
("C", "Ejemplo C", 6.00, 7),
("D", "Ejemplo D", 8.00, 3);