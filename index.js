var express = require('express');
var indexController = require('./controllers/indexController');

var app = express();

var mysql = require('mysql');


// to set up template engine

app.set('view engine', 'ejs');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded(
    { extended: true, limit: '50mb' }
))



// for static files

app.use(express.static('./public'));
// app.use(express.static(__dirname + '/public'));
app.use(express.static('public/assets/Images'));



// controller

indexController(app);

// var obj = JSON.parse('names.json');
//   console.log(obj);

// to listen to port

app.listen(8080); 