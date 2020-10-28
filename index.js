//----- Dependencies
const inquirer = require("inquirer");
var mysql = require("mysql");

//----- Database Connection
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

//----- On connection, start inquirer
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    userPrompt();
});

//----- (READ/GET) Functions 
function viewAll(data) {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.department_id, department.name, role.salary
                    FROM company_db.employee
                    JOIN company_db.role
                    ON company_db.employee.role_id=company_db.role.id
                    JOIN company_db.department
                    ON company_db.role.department_id=company_db.department.id`, data, function (err, results) {
        if (err) throw err;
        console.table(results);
    })
};

// WORKING - MINIMUM
function viewByDepartment(data) {
    let choices = [];
    connection.query("SELECT department.name FROM company_db.department", data, function (err, results) {
        if (err) throw err;
        choices = results;
        inquirer
            .prompt([{
                type: "list",
                message: "Which department?",
                choices: choices,
                name: "departmentView",
            }]).then(function (answer) {
                connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.department_id, department.name, role.salary
                        FROM company_db.employee 
                        JOIN company_db.role
                        ON company_db.employee.role_id=company_db.role.id
                        JOIN company_db.department
                        ON company_db.role.department_id=company_db.department.id
                        WHERE company_db.department.name = ?
                        ORDER BY department_id, first_name ASC
                        `, answer.departmentView, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                })
            })
    })
};

// WORKING - MINIMUM
function viewByRole(data) {
    connection.query("SELECT role.title FROM company_db.role", data, function (err, results) {
        if (err) throw err;
        // getting role - title and id
        let choiceText = new Map(results.map(n => ([n.title, n.id])));
        inquirer
            .prompt([{
                type: "list",
                message: "Which role?",
                choices: Array.from(choiceText.keys()),
                name: "roleView",
            }]).then(function (answer) {
                connection.query(`SELECT *
                        FROM company_db.employee 
                        JOIN company_db.role
                        ON company_db.employee.role_id=company_db.role.id
                        JOIN company_db.department 
                        ON company_db.department.id=company_db.role.department_id
                        WHERE company_db.role.title = ?
                        ORDER BY employee.id, first_name ASC
                        `, answer.roleView, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                })
            })
    })
};

//----- (CREATE/POST) Functions to add role, department or employee
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
                        addDepartment();
                        break;
                    case "Role":
                        addRole();
                        break;
                    case "Employee":
                        addEmployee();
                        break;
                    case "Return":
                        userPrompt();
                        break;
                }
            });
}

// addRole - WORKING - MINIMUM
function addRole() {
    inquirer
        .prompt([{
            type: "input",
            message: "What role would you like to add?",
            name: "roleName",
        }, {
            type: "input",
            message: "What is the salary of this position?",
            name: "roleSalary",
        }, {
            type: "input",
            message: "To what department should this role be assigned?",
            name: "roleDepartment",
        }]).then(function (answer) {
            console.log(answer.roleName);
            console.log(answer.roleSalary);
            console.log(answer.roleDepartment);
            var query = connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.roleName,
                    salary: answer.roleSalary,
                    department_id: answer.roleDepartment
                },
                function (err, res) {
                    if (err) throw err;
                }
            );
            // returns back to initial
            userPrompt();
        })
};
// addDepartment - WORKING - MINIMUM
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            message: "What department would you like to add?",
            name: "departmentName",
        }).then(function (answer) {
            var query = connection.query(
                "INSERT INTO department SET ?",
                { name: answer.departmentName }
            );
            // returns back to initial
            userPrompt();
        })
};

// // addEmployee - WORKING - MINIMUM - TRY 2
function addEmployee() {
    var roleChoice = [];
    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            var roleList = result[i].title;
            roleChoice.push(roleList);
        };
        var deptChoice = [];
        connection.query("SELECT * FROM department", function (err, data) {
            if (err) throw err;
            for (var i = 0; i < data.length; i++) {
                var deptList = data[i].name;
                deptChoice.push(deptList);
            }
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the new employee's first name?",
                        name: "employeeFirstName"
                    }, {
                        type: "input",
                        message: "What is the new employee's last name?",
                        name: "employeeLastName"
                    },
                    {
                        name: "role_id",
                        type: "list",
                        message: "Select employee role:",
                        choices: roleChoice
                    },
                    {
                        name: "department_id",
                        type: "list",
                        message: "Select employee's department:",
                        choices: deptChoice
                    },
                ]).then(function (answer) {
                    var chosenRole;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answer.role_id) {
                            chosenRole = result[i];
                        }
                    };
                    var chosenDept;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name === answer.department_id) {
                            chosenDept = data[i];
                        }
                    };
                    //connection to insert response into database  
                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answer.employeeFirstName,
                            last_name: answer.employeeLastName,
                            role_id: chosenRole.id,
                            department_id: chosenDept.id
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Employee " + answer.employeeFirstName + " " + answer.employeeLastName + " successfully added!");
                            userPrompt();
                        }
                    );
                })
        });
    })
};

//----- (REMOVE/DELETE) Functions to delete role, department or employee
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
                        deleteDepartment();
                        break;
                    case "Role":
                        deleteRole();
                        break;
                    case "Employee":
                        deleteEmployee();
                        break;
                    case "Return":
                        userPrompt();
                        break;
                }
            });
}

// deleteEmployee - WORKING - NTH
function deleteEmployee() {
    var empChoice = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function (err, resEmp) {
        if (err) throw err;
        for (var i = 0; i < resEmp.length; i++) {
            var empList = resEmp[i].name;
            empChoice.push(empList);
        };

        inquirer
            .prompt([
                {
                    name: "employee_id",
                    type: "list",
                    message: "Select the employee you would like to remove:",
                    choices: empChoice
                },
            ])
            .then(function (answer) {

                var chosenEmp;
                for (var i = 0; i < resEmp.length; i++) {
                    if (resEmp[i].name === answer.employee_id) {
                        chosenEmp = resEmp[i];
                    }
                };

                connection.query(
                    "DELETE FROM employee WHERE id=?",
                    [chosenEmp.id],

                    function (err) {
                        if (err) throw err;
                        console.log("Employee successfully removed!");
                        userPrompt();
                    }
                );
            });
    })
};

//----- (CHANGE/MODIFY) Functions to mod

// WORKING - MINIMUM
function changeRole() {
    connection.query(
        "SELECT employee.first_name, employee.id FROM company_db.employee",
        null,
        function (err, results) {
            if (err) throw err;
            // for every result row, maps first name to id
            //eg: Map { 'John' => 1, 'Jane' => 2, 'Joey' => 3 }
            let whochoices = new Map(results.map(q => ([q.first_name, q.id])));

            connection.query(
                "SELECT role.title, role.id FROM company_db.role",
                null,
                function (err, results2) {
                    if (err) throw err;

                    // role - title, id
                    let newroles = new Map(results2.map(x => ([x.title, x.id])));
                    inquirer
                        .prompt([{
                            type: "list",
                            message: "Whose role would you like to change?",
                            choices: Array.from(whochoices.keys()),
                            name: "whoseRole",
                        }, {
                            type: "list",
                            message: "What is the new role?",
                            choices: Array.from(newroles.keys()),
                            name: "whichRole",
                        }]).then(function (answer) {
                            var query = connection.query(
                                "UPDATE company_db.employee SET role_id = ? WHERE id = ?",
                                [newroles.get(answer.whichRole), whochoices.get(answer.whoseRole)],
                                function (err, res) {
                                    if (err) throw err;
                                }
                            );
                            // returns back to initial
                            userPrompt();
                        }
                        )
                }
            );
        })
};

//----- Function to run starting inquirer
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
                        viewAll();
                        break;
                    case "View employees by department.":
                        viewByDepartment();
                        break;
                    case "View employees by role.":
                        viewByRole();
                        break;
                    case "View employees by manager.":
                        viewByManager();
                        break;
                    case "View the total utilized budget of a department.":
                        viewBudget();
                        break;
                    case "Add a department, role, or employee.":
                        addType(answer.actionChoice);
                        break;
                    case "Delete a department, role, or employee.":
                        deleteType(answer.actionChoice);
                        break;
                    case "Change an employee's role.":
                        changeRole();
                        break;
                    case "Update an employee's manager.":
                        updateManager();
                        break;
                    case "Exit":
                        connection.end();
                };
            });
};




// ===== NON-WORKING BONUS FUNCTIONS BELOW

// // addEmployee - NOT WORKING - MINIMUM - TRY 1
// function addEmployee() {
//     connection.query(
//         "SELECT role.title, role.id FROM company_db.role", null, function (err, results) {
//             if (err) throw err;
//             let rolechoice = new Map(results.map(y => ([y.title, y.id])));

//             inquirer
//                 .prompt([{
//                     type: "input",
//                     message: "What is the new employee's first name?",
//                     name: "employeeFirstName"
//                 }, {
//                     type: "input",
//                     message: "What is the new employee's last name?",
//                     name: "employeeLastName"
//                 }, {
//                     type: "list",
//                     message: "What is the new employee's role?",
//                     choices: Array.from(rolechoice.keys()),
//                     name: "chooseRole",
//                 }]).then(function (answer) {
//                     var query = connection.query(
//                         "INSERT INTO employee SET ?",
//                         {
//                             first_name: answer.employeeFirstName,
//                             last_name: answer.employeeLastName,
//                             // role_id: 
//                             // title: rolechoice.get(answer.chooseRole)
//                         },
//                         function (err, res) {
//                             if (err) throw err;
//                         }
//                     );
//                     //returns back to initial
//                     userPrompt();
//                 })
//         }
//     )
// }

// NOT WORKING - NTH
function updateManager() {

};

// deleteRole - NOT WORKING - NTH
function deleteRole() {

};
// deleteDepartment - NOT WORKING - NTH
function deleteDepartment() {

};

// NOT WORKING - NTH
function viewByManager() {

};

// NOT WORKING - NTH
function viewBudget() {

};