var express = require('express')
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }  
});
var upload = multer({ storage: storage });
var vhost = require('vhost');

function sort(val){
    if (val != undefined)
    return val;
}

module.exports = function (app){
    var admin  = express.Router();
    app.use(vhost('admin.*',admin));
    // Forms
    admin.post('/process-product',upload.single('product_image'),function(req,res,next){
        if(req.file){
            console.log('image uploaded')
        }else(console.log ('error parsing image'))
        var product_price = req.body.size + '.00' + '' +'USD';
        var categories_array = [req.body.c_male,req.body.c_women,req.body.c_children,req.body.c_furniture,req.body.c_sports,req.body.c_utilities,req.body.c_gadgets,req.body.c_mobile].filter(sort); 
        var tags_array = [req.body.t_male,req.body.t_women,req.body.t_children,req.body.t_furniture,req.body.t_sports,req.body.t_utilities,req.body.t_gadgets,req.body.t_mobile].filter(sort);
        var UIproduct = new Object({
            name: req.body.name,
            slug: req.body.slug,
            size: req.body.size,
            sku:  req.body.sku,
            price: product_price,
            categories: categories_array,
            tags: tags_array,
            description: req.body.description
        });
        console.log(req.body.color)
        console.log(UIproduct);
        req.session.flash = {
            type:'success',
            intro: 'Validation success',
            message: 'Product Added',
        };
        res.redirect(303,'/add-product');
    });
   
    app.post('/process',function(req,res){
        console.log('form(from querystring) '+ req.query.form);
        console.log('from hiddenfield ' + req.body._csrf);
        console.log('Name from name field ' + req.body.contactName);
        console.log('Email from form ' + req.body.contactEmail);
        console.log('Subject ' + req.body.contactSubject);
        console.log('Context ' + req.body.contentContext);
        req.session.flash = {
            type:'success',
            intro: 'Validation success',
            message: 'you\'ll receive a message from us shortly',
        };
        res.redirect( 303,'/thankyou')
    })
};
