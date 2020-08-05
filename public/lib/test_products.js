var product = require('.././models/products');

product.find(function(err,products){
    if(product.length){
        return;
    }else{
        console.log(err)
    }
    new products({
        name: 'sneakers',
        slug: 'nike',
        categories:['fashion','best deals'],
        sku: 'nike sneakers',
        description: 'nike airforce',
        priceInCents: 1300,
        tags:['sneakers','shoe','fashion'],
        available: true,
    }).save();
    new products({
        name: 'brogues',
        slug: 'nike',
        categories:['fashion','best deals'],
        sku: 'malefootware',
        description: 'Nice london brogues',
        priceInCents: 1300,
        tags:['classic','shoe','fashion'],
        available: true,
    }).save();
    new products({
        name: 'monk straps',
        slug: 'shoe',
        categories:['fashion','best deals'],
        sku: 'malefootware',
        description: 'Nice Uk monkstraps',
        priceInCents: 1300,
        tags:['classic','shoe','fashion'],
        available: false,
    }).save();
})
