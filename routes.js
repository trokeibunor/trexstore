var express = require('express');
var vhost = require('vhost');
var product = require('./public/models/products');
const { $where } = require('./public/models/products');

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
app.get(/sports|male|female|children|mobile|gadgets|utilities|furniture/,function(req,res){
        var pathName = req.path;
        var required = pathName.split('').slice(1).join('');
        console.log(required);
        product.find({available: true} ,function(err,products){
            var content = {
                products: products.map(function(product){
                    console.log(product.category)
                    if(product.category.includes(required)){
                        return {
                            name:product.name,
                            sku: product.sku,
                            description:product.description,
                            price: product.price,
                            image: product.path,
                            tags: product.tags,
                        }
                    } else if(err){
                        console.log('category not found')
                    }
                })
            };
            res.render('productCategories',content)
        })
    });
    app.get('/product', (req,res)=>{
        product.find({available: true},function(err,products){
            var content = {
                products : products.map(function(product){
                    return{
                        name: product.name,
                        slug: product.slug,
                        description: product.description,
                        price: product.price,
                        color: product.color,
                        sku: product.sku,
                        size: product.size,
                        image: product.path,
                        tags : product.tags.toString(),
                    }
                })
            }
            res.render('product',content)
        })
    });
    app.get('/about', function(req,res){
        res.render('about',{
        pageTestScript :'/qa/test-about.js'
        })
    })
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
        product.find({available: true},function(err,products){
            var content = {
                products : products.map(function(product){
                    return{
                        name: product.name,
                        slug: product.slug,
                        description: product.description,
                        price: product.price,
                        color: product.color,
                        sku: product.sku,
                        size: product.size,
                        image: product.path,
                        tags : product.tags.toString(),
                    }
                })
            }
            res.render('admin/product',{layout: 'dashboard'},content);
        })
    });
    app.get('/add-product',function (req,res) {
        res.render('admin/add_product',{layout:'dashboard'})
    });
    admin.get('/sales',(req,res)=>{
        res.render('admin/view_sales',{layout:'dashboard'})
    })
};
