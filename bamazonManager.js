var keys = require("./connectKeys");
var mysql = require("mysql");
var inquirer = require("inquirer");
var Product = require("./Product");
var PRODSFORSALE = "View Products for Sale";
var LOWINVENTORY = "View Low Inventory";
var ADDINVENTORY = "Add to Inventory";
var ADDNEWPROD = "Add New Product";
var QUIT = "Quit...";

var LOWINVENTORY_THRESHOLD = 25;

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
            choices: [PRODSFORSALE, LOWINVENTORY, ADDINVENTORY, ADDNEWPROD, QUIT]
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
        } else if (choice === QUIT) {
            quit();
        }
    });
}

function connectToDB() {
    connection.connect(function (err) {
        if (err) throw err;
    });
}

function showProducts() {
    if (connection.state === 'disconnected') {
        connectToDB();
    }
    loadInventory(true);
}

function showLowInventory() {
    if (connection.state === 'disconnected') {
        connectToDB();
    }
    loadLowInventory();
}

function addInventory() {
    if (connection.state === 'disconnected') {
        connectToDB();
    }
    loadInventory(false);
}

function promptWhichToIncrease() {
    var promptMsg = "Enter id of product ... ";
    inquirer.prompt([
        {
            name: "prodid",
            message: promptMsg
        }
    ]).then(function (answer) {
        var input = answer.prodid;
        var aprodid = parseInt(input);
        product = getProduct(aprodid);
        if (product == null) {
            console.log("Invalid product id.  Try again.");
            promptWhichToIncrease();
        } else {
            promptHowMuch(product);
        }
    });
}

function promptHowMuch(product) {
    var promptMsg = "How much do you want to increase?";
    inquirer.prompt([
        {
            name: "howMany",
            message: promptMsg
        }
    ]).then(function (answer) {
        var qty = parseInt(answer.howMany);
        updateProduct(product, qty);

    });
}

function updateProduct(product, qtyToAdd) {
    var newStock = product.stock_quantity + qtyToAdd;
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
            console.log("You added " + qtyToAdd + " to " + product.name + ".  It's quantity is now " + newStock);
            console.log(" ");
            setTimeout(prompt, 3000);
        }
    );
}

function addNewProduct() {
    if (connection.state === 'disconnected') {
        connectToDB();
    }
    var questions = [
        {
            message: "What is the product name?",
            type: "input",
            name: "productName"
        },
        {
            message: "What is the product price?",
            type: "input",
            name: "productPrice"
        },
        {
            message: "How much quantity for this product?",
            type: "input",
            name: "productQuantity"
        },
        {
            message: "Enter Department ID: ",
            type: "input",
            name: "departmentID"
        }
        ];
    inquirer.prompt(questions).then(function (answers) {
        var prodName = answers.productName;
        var prodPrice = parseFloat(answers.productPrice);
        var prodQty = parseInt(answers.productQuantity);
        var deptID = parseInt(answers.departmentID);

        var realPrice = parseInt(prodPrice*100);

        console.log("New product: " + prodName + ", Price: " + realPrice + ", Qty: " + prodQty);
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: prodName,
                price: realPrice,
                stock_quantity: prodQty,
                department_id: deptID
            },
            function (err) {
                if (err) throw err;
                console.log("Your product was created successfully!");
                setTimeout(prompt, 3000);
            }
        );
    });
}

function loadInventory(mainPrompt) {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        inventory = [];
        for (var i = 0; i < res.length; i++) {
            var id = parseInt(res[i].id);
            var price = parseInt(res[i].price);
            var stock_quantity = parseInt(res[i].stock_quantity);
            var product = new Product(id, res[i].product_name, price, stock_quantity);
            inventory.push(product);
        }

        printInventory();
        if (mainPrompt) {
            prompt();
        } else {
            promptWhichToIncrease();
        }
    });
}

function loadLowInventory() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        inventory = [];
        for (var i = 0; i < res.length; i++) {
            var id = parseInt(res[i].id);
            var price = parseInt(res[i].price);
            var stock_quantity = parseInt(res[i].stock_quantity);
            if (stock_quantity < LOWINVENTORY_THRESHOLD) {
                var product = new Product(id, res[i].product_name, price, stock_quantity);
                inventory.push(product);
            }
        }

        printInventory();
        prompt();
    });
}

function printInventory() {
    console.log("| ID |             Name                     |   Price   |  Qty  |");
    console.log("|----|--------------------------------------|-----------|-------|");
    for (var i = 0; i < inventory.length; i++) {
        var product = inventory[i];
        product.display();
    }
    console.log(" ");
}

function quit() {
    connection.end();
}

prompt();

function getProduct(id) {
    for (var i = 0; i < inventory.length; i++) {
        var product = inventory[i];
        if (product.id === id) {
            return product;
        }
    }
    return null;  // didn't find it
}