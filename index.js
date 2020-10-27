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