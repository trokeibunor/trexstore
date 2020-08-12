var express = require('express');
var credentials = require('./public/lib/credentials.js');
var emailService = require('./public/lib/email.js')(credentials);
var app = express();
var mongoose = require('mongoose');

var product = require('./public/models/products.js');
var opts = {
    server: {
        socketOptions:{ keepAlive: 1 }
    },
    useNewUrlParser:true,
    useUnifiedTopology:true,
};
app.set('port', process.env.PORT || 3000);

// HANDLEBARS SETUP
var handlebars = require('express-handlebars')
    .create({ defaultLayout:'main',
    helpers: {
        section: function( name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
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
            .then(()=>console.log('mongodb connected in development mode'))
            .catch((err)=>console.log(err));
        break;
    case 'production' :
        mongoose.connect(credentials.mongo.producton.connectionString,opts)
        .then(()=>console.log('mongodb connected in production mode'))
        .catch((err)=>console.log(err));
        break; 
    default :
        throw new Error('Unable to load enviroment: ' + app.get('env'));      
}
//MIDDLEWARES
// DOMAIN error handler
app.use(function(req,res,next){
    var domain = require('domain').create();
    domain.on('error',function(err){
        console.error('DOMAIN CAUGHT ERROR /n' ,err.stack);
        try {
            setTimeout(() => {
                console.error('failsafe shutdown');
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
                console.log('Express server mechanism /n' ,err.stack);
                res.statusCode = 500;
                res.setHeader = ('content-type','text-plain');
                res.end('Server error');
            }
        } catch (err) {
            console.error('Couldn\'t open 500 error', err.stack)
        }
    });
    domain.add(req);
    domain.add(res);
    domain.run(next);
});

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
app.use(require('cookie-parser')(credentials.cookiesecret));
app.use(require('express-session')());
// CLUSTER checking
app.use(function(req,res,next){
    var cluster = require('cluster');
    if(cluster.isWorker){
        console.log('worker %d recieved request' + cluster.worker.id)
    }
    next();
});
// PAGE testing
app.use(function(req,res,next){
    res.locals.showTest = app.get('env') !== 'production' &&
    req.query.test === '1';
    next()
});
//test Products to be removed for production
product.find(function(err,products){
    if(products.length){
        return;
    }else{
        console.log(err)
    }
    new product({
        name: 'sneakers',
        slug: 'nike',
        categories:['fashion','best deals'],
        sku: 'nike sneakers',
        description: 'nike airforce',
        priceInCents: 1300,
        tags:['sneakers','shoe','fashion'],
        available: true,
    }).save();
    new product({
        name: 'brogues',
        slug: 'nike',
        categories:['fashion','best deals'],
        sku: 'malefootware',
        description: 'Nice london brogues',
        priceInCents: 1300,
        tags:['classic','shoe','fashion'],
        available: true,
    }).save();
    new product({
        name: 'monk straps',
        slug: 'shoe',
        categories:['fashion','best deals'],
        sku: 'malefootware',
        description: 'Nice Uk monkstraps',
        priceInCents: 1300,
        tags:['classic','shoe','fashion'],
        available: false,
    }).save();
});

//testing error to be removed for production
app.get('/fail',function(req,res) {
    throw new Error('nope')
});
app.get('/epic-fail',function(req,res) {
    process.nextTick(function(){
        throw new Error('kaboom')
    })
});
//USING SESSIONS TO IMPLEMENT FLASH MESSAGES
app.use(function(req,res,next){
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next()
});
//ROUTES
require('./routes.js')(app);
// Form Handlers
require('./form_handler')(app);
// Catch-all errors
//404 error
app.use(function(req,res){
    res.status('404');
    res.render('404')
});
//500 error
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status('500');
    res.render('500')
});
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