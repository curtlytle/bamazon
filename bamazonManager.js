var keys = require("./connectKeys");
var mysql = require("mysql");
var inquirer = require("inquirer");
var Product = require("./Product");
var PRODSFORSALE = "View Products for Sale";
var LOWINVENTORY = "View Low Inventory";
var ADDINVENTORY = "Add to Inventory";
var ADDNEWPROD = "Add New Product";

var inventory = [];

var connection = mysql.createConnection({
    host: keys.host,
    port: keys.port,
    user: keys.userName,
    password: keys.password,
    database: keys.database
});

function prompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            name: "userChoice",
            choices: [PRODSFORSALE, LOWINVENTORY, ADDINVENTORY, ADDNEWPROD]
        }
    ]).then(function (answer) {
        var choice = answer.userChoice;
        console.log("User Choice: " + choice);
        if (choice === PRODSFORSALE) {
            showProducts();
        } else if (choice === LOWINVENTORY) {
            showLowInventory();
        } else if (choice === ADDINVENTORY) {
            addInventory();
        } else if (choice === ADDNEWPROD) {
            addNewProduct();
        }
    });
}

function showProducts() {
    connection.connect(function (err) {
        if (err) throw err;
        loadInventory();
    });
}

function showLowInventory() {

}

function addInventory() {

}

function addNewProduct() {

}

function loadInventory() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var id = parseInt(res[i].id);
            var price = parseInt(res[i].price);
            var stock_quantity = parseInt(res[i].stock_quantity);
            var product = new Product(id, res[i].product_name, price, stock_quantity);
            inventory.push(product);
        }

        printInventory();
        connection.end();
    });
}

function printInventory() {
    for (var i = 0; i < inventory.length; i++) {
        var product = inventory[i];
        product.display();
    }
}

prompt();