var express = require('express');
var app = express();

module.export = function(app){
        app.get ('/', function(req,res){
            res.render('home');
        })
        app.get('/categories', function(req,res){
            res.render('categories')
        })
        app.get('/contact',function(req,res){
            res.render('contact', { csrf: 'csrf value goes here'})
        })
        app.get('/about', function(req,res){
            res.render('about',{
            pageTestScript :'/qa/test-about.js'
            })
        })
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
            }
            res.render('test_products',context)
        })   
    })
    app.get('/thankyou',function(req,res){
        res.status('303')
        res.render('thankyou')
    })
    //DASHBOARD ROUTES
    app.get('/admin',function(req,res){
        res.render('admin_dashboard')
    })
    app.get('/login',function(req,res){
        res.render('admin_login')
    })
}