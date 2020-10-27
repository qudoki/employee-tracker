DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(6,0) NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, null);

-- Various Roles --
INSERT INTO role (title, salary, department_id)
VALUES ("Carpenter", 50000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Electrician", 75000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Architect", 70000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Contractor", 50000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Project Manager", 90000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 80000, 5);
INSERT INTO role (title, salary, department_id)
VALUES ("HR Officer", 50000, 6);

-- Various Departments --
INSERT INTO department (name)
VALUES ("Trade");
INSERT INTO department (name)
VALUES ("Design");
INSERT INTO department (name)
VALUES ("Project Management");
INSERT INTO department (name)
VALUES ("Construction");
INSERT INTO department (name)
VALUES ("Accounting");
INSERT INTO department (name)
VALUES ("Human Relations");