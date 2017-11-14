var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');

var Article = require('./models/articles.js');
var Comment = require('./models/');

var app= express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout}))