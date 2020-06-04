var express = require('express');
var credentials = require('./public/vendor/credentials');
// var nodemailer = require('nodemailer')
var app = express();
app.set('port', process.env.PORT || 3000)
var handlebars = require('express-handlebars')
    .create({ defaultLayout:'trEXstores',
    helpers: {
        section: function( name, options){
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null;
        }
    }
});
// var mailTransport = nodemailer.createTransport('SMTP',{
//     service :'Gmail',
//     auth : {
//         user : credentials.gmail.user,
//         pass : credentials.gmail.password
//     }
// })
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')())
app.use(require('cookie-parser')(credentials.cookiesecret))
// app.use(require('express-session'))
app.use(function(req,res,next){
    res.locals.flash = res.sessions.flash
    next()
})

//routes
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
    res.render('about')
})
app.get('/thankyou',function(req,res){
    res.status('303')
    res.render('thankyou')
})
//contact form handler
app.post('/process',function(req,res){
    console.log('form(from querystring) '+ req.query.form);
    console.log('from hiddenfield ' + req.body._csrf);
    console.log('Name from name field ' + req.body.contactName);
    console.log('Email from form ' + req.body.contactEmail);
    console.log('Subject ' + req.body.contactSubject);
    console.log('Context ' + req.body.contentContext);
    res.redirect( 303,'/thankyou')
})
//404 error
app.use(function(req,res){
    res.status('404')
    res.render('404')
})
//500 error
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status('500');
    res.render('500')
})
app.listen(app.get('port'),function(){
    console.log ('server has started on PORT' + app.get('env') +'in'+
    app.get('port') + '; press ctrl-c to stop server')
})