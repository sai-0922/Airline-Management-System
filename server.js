const express = require('express');
const path = require('path');
const port = 8000;

const app = express();

//Setting up mongoose
const db = require('./config/mongoose');
const UserList = require('./models/user');

//Setting up cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

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
var count = 1;
var errorMessage = "";


//Routes and functions
app.get('/', function(req, res){
    console.log(__dirname);
    return res.render('home', {usertype : count, errorMessage : errorMessage});
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

app.get('/explore', function(req, res){
    return res.send('<h1>Welcome passenger</h1>');
})

app.get('/manage', function(req, res){
    return res.send('<h1>Manage airlines</h1>');
})

//Post requests
app.post('/registerUser', function(req, res){
    if(req.body.password != req.body.repeat){
        count = 1;
        errorMessage = "Password didn't match";
        return res.redirect('back');
    }

    UserList.findOne({email : req.body.email})
    .then((newUser) => {
        if(!newUser){
            UserList.create({
                name : req.body.name,
                password : req.body.password,
                email : req.body.email,
                usertype : req.body.usertype
            }).then((newUser) => {
                if(newUser.usertype === "Airline"){
                    return res.redirect('/airline');
                }
                else{
                    return res.redirect('/login');
                }
                
            })
            .catch((error) => {
                console.log("Error in creating entry ", error);
                return res.send("404 Bad request");
            });
        }
        else{
            errorMessage = "Email already registered!";
            return res.redirect('back');
        }
    })
    .catch((error) => {
        console.log(error);
        return res.send('404! Bad request');
    })

})

app.post('/loginUser', function(req, res){
    UserList.findOne({email : req.body.email, usertype : 'Passenger'})
    .then((foundUser) => {
        if(!foundUser){
            errorMessage = "User not found";
            return res.redirect('back');
        }
        else{
            if(req.body.password === foundUser.password){
                return res.redirect('/explore');
            }
            else{
                errorMessage = 'Wrong password!';
                return res.redirect('back');
            }
        }
    })
})

app.post('/airlineUser', function(req, res){
    UserList.findOne({email : req.body.email, usertype : 'Airline'})
    .then((foundUser) => {
        if(!foundUser){
            errorMessage = "User not found";
            return res.redirect('back');
        }
        else{
            if(req.body.password == foundUser.password){
                return res.redirect('/manage');
            }
            else{
                errorMessage = 'Wrong password!';
                return res.redirect('back');
            }
        }
    })
})

app.listen(port, function(err){
    if(err){
        console.error('Error in starting the server ', err);
    }
    console.log('Server is up and running on port ', port);
});