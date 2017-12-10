function Product (id, name, price, stock_quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock_quantity = stock_quantity;
    this.showPrice = function () {
        var dollar = this.price/100;
        return "$" + dollar.toFixed(2);
    };
    this.calculatePrice = function(howMany) {
        var amount = this.price * howMany;
        var dollar = amount/100;
        return "$" + dollar.toFixed(2);
    }
}
Product.prototype.display = function () {
    console.log(this.name + " (" + this.showPrice() + ") -> " + this.id);
};
module.exports = Product;