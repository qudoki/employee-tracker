// Dependencies
const inquirer = require("inquirer");
var mysql = require("mysql");

// Database Connection
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "NoriskNoreward1",
    database: "company_db"
});

// On connection, start inquirer
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // createEmployee();
    userPrompt();
});

// (READ/GET) Functions 

// (CREATE/POST) Functions to add role, department or employee
function addType(x) {
    inquirer
        .prompt(
// Would you like to add a role, department or employee?
            {
                type: "list",
                message: "What type would you like to add?",
                name: "addType",
                choices: [
                    "Department",
                    "Role",
                    "Employee",
                    "Return"
                ],
                when: (answer) => x === "Add a department, role, or employee."
            }).then(function (answer) {
                switch (answer.addType) {
                    case "Department":
                        // addDepartment();
                        break;
                    case "Role":
                        // addRole();
                        break;
                    case "Employee":
                        // addEmployee();
                        break;
                    case "Return":
                        // userPrompt();
                        break;
                }
            });
        }

// addRole
// addDepartment
// function addEmployee() {
//     console.log("Creating a new employee...\n");
//     var query = connection.query(
//         "INSERT INTO employee SET ?"
//     )
// }

// (REMOVE/DELETE) Functions to delete role, department or employee
function deleteType(x) {
    inquirer
        .prompt(
// Would you like to delete a role, department or employee?
            {
                type: "list",
                message: "What type would you like to delete?",
                name: "deleteType",
                choices: [
                    "Department",
                    "Role",
                    "Employee",
                    "Return"
                ],
                when: (answer) => x === "Delete a department, role, or employee."
            }).then(function (answer) {
                switch (answer.deleteType) {
                    case "Department":
                        // deleteDepartment();
                        break;
                    case "Role":
                        // deleteRole();
                        break;
                    case "Employee":
                        // deleteEmployee();
                        break;
                    case "Return":
                        // userPrompt();
                        break;
                }
            });
        }

// deleteRole
// deleteDepartment
// deleteEmployee


function userPrompt() {
    inquirer
        .prompt(
            {
                type: "list",
                message: "What would you like to do?",
                name: "actionChoice",
                choices: [
                    // GET
                    "View all employees.",
                    "View employees by department.",
                    "View employees by role.",
                    "View employees by manager.",
                    "View the total utilized budget of a department.",
                    // POST
                    "Add a department, role, or employee.",
                    // DELETE
                    "Delete a department, role, or employee.",
                    // PUT OR MODIFY
                    "Change an employee's role.",
                    "Update an employee's manager.",
                    // EXIT
                    "Exit."
                ]
            }).then(function (answer) {
                switch (answer.actionChoice) {
                    case "View all employees.":
                        // viewAll();
                        break;
                    case "View employees by department.":
                        // viewByDepartment();
                        break;
                    case "View employees by role.":
                        // viewByRole();
                        break;
                    case "View employees by manager.":
                        // viewByManager();
                        break;
                    case "View the total utilized budget of a department.":
                        // viewBudget();
                        break;
                    case "Add a department, role, or employee.":
                        addType(answer.actionChoice);
                        break;
                    case "Delete a department, role, or employee.":
                        deleteType(answer.actionChoice);
                        break;
                    case "Change an employee's role.":
                        // changeRole();
                        break;
                    case "Update an employee's manager.":
                        // updateManager();
                        break;
                    case "Exit":
                        connection.end();
                };
            });
};



//     type: "list",
//     message: "What type would you like to delete?",
//     name: "deleteType",
//     choices: [
//         "Department",
//         "Role",
//         "Employee"
//     ],
//     when: (answer) => answer.actionChoice === "Delete a department, role, or employee."
// }, {
//     type: "input",
//     message: "What is the new department name?",
//     name: "newDepartment",
//     when: (answer) => answer.addType === "Department"