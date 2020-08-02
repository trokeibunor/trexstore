var express = require('express');
var credentials = require('./public/lib/credentials.js');
var emailService = require('./public/lib/email.js')(credentials);
var app = express();
var mongoose = require('mongoose');
var products = require('./public/models/products')
var opts = {
    server: {
        socketOptions:{ keepAlive: 1 }
    }
}
app.set('port', process.env.PORT || 3000)

// HANDLEBARS SETUP
var handlebars = require('express-handlebars')
    .create({ defaultLayout:'main',
    helpers: {
        section: function( name, options){
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


//Logger
// switch (app.get('env')) {
//     case 'development':
//             app.use(require('morgan')('dev'))
//         break;
//     case 'production':
//             app.use(require('express-logger')({
//                 path: __dirname + '/log/request.log'
//             }))   
//         break;
// }
switch(app.get('env')){
    case 'development' : 
        mongoose.connect(credentials.mongo.development.connectionString,opts)
        break;
    case 'production' :
        mongoose.connect(credentials.mongo.producton.connectionString,opts)
        break;
    default :
        throw new Error('Unable to load enviroment: ' + app.get('env'));      
}
//MIDDLEWARES
// DOMAIN error handler
app.use(function(req,res,next){
    var domain = require('domain').create();
    domain.on('error',function(err){
        console.error('DOMAIN CAUGHT ERROR /n' ,err.stack)
        try {
            setTimeout(() => {
                console.error('failsafe shutdown')
                process.exit(1)
            }, 5000);
            var worker = require ('cluster').worker;
            if(worker){
                worker.disconnect()
            }
            server.close();
            try {
                next(err)
            } catch (err) {
                console.log('Express server mechanism /n' ,err.stack)
                res.statusCode = 500;
                res.setHeader = ('content-type','text-plain');
                res.end('Server error');
            }
        } catch (err) {
            console.error('Couldn\'t open 500 error', err.stack)
        }
    })
    domain.add(req);
    domain.add(res);
    domain.run(next);
})
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')())
app.use(require('cookie-parser')(credentials.cookiesecret))
app.use(require('express-session')())

//USING SESSIONS TO IMPLEMENT FLASH MESSAGES
// app.use(function(req,res,next){
//     res.locals.flash = res.sessions.flash
//     next()
// })
// CLUSTER checking
app.use(function(req,res,next){
    var cluster = require('cluster');
    if(cluster.isWorker){
        console.log('worker %d recieved request' + cluster.worker.id)
    }
    next();
})
// PAGE testing
app.use(function(req,res,next){
    res.locals.showTest = app.get('env') !== 'production' &&
     req.query.test === '1'
     next()
})

//testing error
app.get('/fail',function(req,res) {
    throw new Error('nope')
})
app.get('/epic-fail',function(req,res) {
    process.nextTick(function(){
        throw new Error('kaboom')
    })
})
//ROUTES
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

//CONTACT FORM HANDLER
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
function startServer(){
    app.listen(app.get('port'),function(){
        console.log ('server has started on PORT' + app.get('env') + 'in' +
        app.get('port')  +  ' ; press ctrl-c to stop server')
    })
}
if(require.main === module){
    startServer()
}else{
    module.exports = startServer()
}