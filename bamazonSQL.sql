Drop database IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
   id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   product_name VARCHAR(100) NOT NULL,
   department_id INT(11),
   price INT(15),
   stock_quantity INT(11)
);

CREATE TABLE departments (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    overhead_costs INT(15)
);