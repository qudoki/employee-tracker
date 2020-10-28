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
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES ("John", "Smith", 1, null, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES ("Jane", "Doe", 4, null, 8);

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


-- Testing below

SELECT * FROM company_db.role;
SELECT * FROM company_db.department;
SELECT * FROM company_db.employee;
SELECT * FROM company_db.employee JOIN company_db.role ON company_db.employee.role_id=company_db.role.id; 
SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.department_id, role.salary FROM company_db.employee JOIN company_db.role ON company_db.employee.role_id=company_db.role.id; 


SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.department_id, role.salary, department.name
FROM company_db.employee 
JOIN company_db.role
ON company_db.employee.role_id=company_db.role.id
JOIN company_db.department 
ON company_db.department.id=company_db.role.department_id
ORDER BY department_id, first_name  ASC
;

UPDATE company_db.employee SET role_id = 5 
WHERE id = 2;