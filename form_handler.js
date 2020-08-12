var express = require('express');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var upload = multer({ storage: storage })
var vhost = require('vhost');
var admin  = express.Router();

module.exports = function (app){
    app.use(vhost('admin.*',admin));
    admin.post('/include-product',upload.single('product_image'),(err,res,req,next)=>{
        req.session.flash = {
        type:'success',
        intro: 'Validation success',
        message: 'product uploaded to server',
        };
        res.redirect( 303,'/add-product');
        next()
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
