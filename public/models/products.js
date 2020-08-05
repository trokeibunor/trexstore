var mongoose = require ('mongoose');

var productschema = mongoose.Schema({
    name: String,
    slug: String,
    category: [String],
    sku: String,
    description: String,
    priceInCents: Number,
    tags: [String],
    available: Boolean,
    notes: String,
    packagesSold: Number,
});
productschema.methods.getDisplayPrice = function(){
    return '$' + (this.priceInCents/100).toFixed(2)
}
var product = mongoose.model('product',productschema);

module.exports = product;