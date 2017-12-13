function Product (id, name, price, stock_quantity) {
    this.id = id;
    this.name = name;
    this.nameLength = name.length;
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
    var spaces = 40 - this.nameLength;
    var spaceStr = "";
    for (var i = 0; i < spaces; i++) {
        spaceStr += " ";
    }
    var idSpaceStr = " ";
    if (this.id < 10) {
        idSpaceStr += " ";
    }
    console.log(idSpaceStr + this.id + "    " + this.name + spaceStr + this.showPrice() + "     " + this.stock_quantity);
};
module.exports = Product;