var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3000)
var handlebars = require('express-handlebars')
    .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//routes
app.get ('/', function(req,res){
    res.render('home');
})
app.get('/categories', function(req,res){
    res.render('categories')
})
app.get('/about', function(req,res){
    res.render('about')
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
    console.log ('server has started on PORT' +
    app.get('port') + '; press ctrl-c to stop server')
})