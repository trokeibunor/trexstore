var mongoose = require ('mongoose');

var productschema = mongoose.Schema({
    name: String,
    slug: String,
    category: [String],
    sku: String,
    color: String,
    size: Number,
    description: String,
    price: Number,
    tags: [String],
    available: Boolean,
    notes: String,
    packagesSold: Number,
    path: String,
});

var product = mongoose.model('product',productschema);

module.exports = product;