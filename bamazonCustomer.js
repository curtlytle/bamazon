var keys = require("./connectKeys");
var mysql = require("mysql");
var inquirer = require("inquirer");
var Product = require("./Product");

var inventory = [];

var connection = mysql.createConnection({
    host: keys.host,
    port: keys.port,
    user: keys.userName,
    password: keys.password,
    database: keys.database
});

function start() {
    connection.connect(function (err) {
        if (err) throw err;
        loadInventory();
    });
}

function prompt() {
    var promptMsg = "Enter id of product to buy... ";
    inquirer.prompt([
        {
            name: "prodid",
            message: promptMsg
        }
    ]).then(function (answer) {
        var aprodid = parseInt(answer.prodid);
        product = getProduct(aprodid);
        if (product == null) {
            console.log("No product of that id exists!  Sorry!");
            connection.end();
        } else {
            promptHowMany(product);
        }

    });
}
function promptHowMany(product) {
    var promptMsg = "How many do you want?";
    inquirer.prompt([
        {
            name: "howMany",
            message: promptMsg
        }
    ]).then(function (answer) {
        var quantityToBuy = parseInt(answer.howMany);
        if (quantityToBuy > product.stock_quantity) {
            console.log("Insufficient quantity!  Sorry, can't place this order.");
        } else {
            updateProduct(product, quantityToBuy);
        }

    });
}

function updateProduct(product, quantReduce) {
    var newStock = product.stock_quantity - quantReduce;
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            },
            {
                id: product.id
            }
        ],
        function (err) {
            if (err) throw err;
            console.log("Thank you, your order has been placed.");
            console.log(quantReduce + " " + product.name + " for the total price of " + product.calculatePrice(quantReduce));
            connection.end();
        }
    );
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
        prompt();
    });
}

function printInventory() {
    for (var i = 0; i < inventory.length; i++) {
        var product = inventory[i];
        product.display();
    }
}

function getProduct(id) {
    for (var i = 0; i < inventory.length; i++) {
        var product = inventory[i];
        if (product.id === id) {
            return product;
        }
    }
    return null;  // didn't find it
}

start();
