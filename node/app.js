var express = require('express');
var wagner = require('wagner-core');
var nunjucks  = require('nunjucks');
var _  = require('underscore');

require('./models')(wagner);

var app = express();

nunjucks.configure('views', {
    autoescape : true,
    express : app,
    watch: true
});

app.get('/register', function(req, res) {
    res.render('register.html');
});

//wagner.invoke(require('./auth'), { app: app });

app.use('/api/v1', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
