var express = require('express');
var vhost = require('vhost');

module.exports = function(app){
    var admin  = express.Router();
    app.use(vhost('admin.*',admin));
    //ROUTES
    app.get ('/', function(req,res){
        res.render('home');
    });
    app.get('/categories', function(req,res){
        res.render('categories')
    });
    app.get('/contact',function(req,res){
        res.render('contact', { csrf: 'csrf value goes here'})
    });
    // routes for different categories
    app.get(/sports|men_fashion|women_fashion|mobile|gadgets/,function(req,res){
        var pathName = req.path;
        product.find({category:pathName},function(err,products){
            var content = {
                products: products.map(function(product){
                    return {
                        name:product.name,
                        sku: product.sku,
                        description:product.description,
                        price: product.getDisplayPrice(),
                        tags: product.tags,
                    }
                })
            };
            res.render('productCategories',content)
        })
    });
    app.get('/about', function(req,res){
        res.render('about',{
        pageTestScript :'/qa/test-about.js'
        })
    })
    // routes for product page
    app.get('/products',function(req,res){
        product.find({available:true},function(err,products){
            var context = {
                products: products.map(function(product){
                return {
                    sku: product.sku,
                    name: product.name,
                    description: product.description,
                    price: product.getDisplayPrice(),
                    available: product.available,
                }
            })
        };
        res.render('test_products',context)
        })
    });
    app.get('/thankyou',function(req,res){
        res.status('303');
        res.render('thankyou')
    });
    app.get('/error',function(req,res){
        res.status('303');
        res.render('error')
        });
    
    //DASHBOARD ROUTES
    admin.get('/login',function(req,res){
        res.render('admin/login')
        });
    admin.get('/',function(req,res){
    res.render('admin/home_admin', {layout: 'dashboard'})
    });
    admin.get('/product',function (req,res) {
        res.render('admin/product',{layout: 'dashboard'});
    });
    app.get('/add-product',function (req,res) {
        res.render('admin/add_product',{layout:'dashboard'})
    });
    admin.get('/sales',(req,res)=>{
        res.render('admin/view_sales',{layout:'dashboard'})
    })
};
