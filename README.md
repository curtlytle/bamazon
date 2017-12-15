"# bamazon" 
# Bamazon Customer and Manager

#### Node app that connects to MySQL database

### Products Table Structure
ID    | Product Name  |  Department ID  |    Price       |  Stock Quantity
------|---------------|-----------------|----------------|------------------
INT | CHAR(100) | INT Key to Dept Table | INT - In pennies |  INT
     
### Departments Table Structure
ID    | Department Name  |  Overhead Costs 
------|------------------|-----------------
INT | CHAR(100) |  INT - In pennies
     
bamazonCustomer.js selects an id from a list that is printed out, 
but is coming from the MySQL database.
* Enters id of the product or q to quit out of the app.
* Asks how many they want.
* Prints out their order and their total price.
* Removes the quantity from the database.
* If they order more than what is in stock, it gives them a 
message that they can't make that order.

![Image1](/images/Customer1.png)
![Image2](/images/Customer2.png)
![Image3](/images/Customer3.png)


bamazonManager.js has four options to select from - list from inquirer.js.
* List all the products
* View low inventory products - quantity less than 5
* Update the quantity of a specific product
* Add a new product.  Which prompts for Name, price, quantity and dept id.

![Image4](/images/Manager1.png)
![Image5](/images/Manager2.png)
![Image6](/images/Manager3.png)
![Image7](/images/Manager4.png)
![Image8](/images/Manager5.png)
![Image9](/images/Manager6.png)
