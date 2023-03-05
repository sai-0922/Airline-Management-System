const express = require('express');
const path = require('path');
const port = 8000;

const app = express();

//Setting up the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

//Including bootrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//For accessing static files
app.use(express.static('assets'));

//Variables and arrays
var count = 3;



//Routes and functions
app.get('/', function(req, res){
    console.log(__dirname);
    return res.render('home', {usertype : count});
});

app.get('/register', function(req, res){
    console.log("Changed to register!")
    count = 1;
    return res.redirect('back');
});

app.get('/login', function(req, res){
    console.log("Changed to login!")
    count = 2;
    return res.redirect('back');
});

app.get('/airline', function(req, res){
    console.log("Changed to airline!")
    count = 3;
    return res.redirect('back');
});

app.listen(port, function(err){
    if(err){
        console.error('Error in starting the server ', err);
    }
    console.log('Server is up and running on port ', port);
});