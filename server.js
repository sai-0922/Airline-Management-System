const express = require('express');
const path = require('path');
const port = 8000;

const app = express();

//Setting up mongoose
const db = require('./config/mongoose');
const UserList = require('./models/user');
const flightList = require('./models/flight')

const moment = require("moment");

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

//Middleware for moment
app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });

//For session-cookie
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('./config/passport-local-strategy');


//Middleware to encrypt the session-cookie
app.use(session({
    name : 'mycookie1',//name of the cookie
    //TODO : change the secret before launch
    secret : 'randomKey',//This is the key used for encrypting
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (100*60*1000)//This is the age of the cookie i.e., how long it should exist. After that the cookie expires. In millisec.
    }
}));

app.use(passport.initialize());
app.use(passport.session());

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

    if(req.isAuthenticated()){
        return res.redirect('/user/explore');
    }

    console.log("Changed to login!")
    count = 2;
    return res.redirect('back');
});

app.get('/airline', function(req, res){

    //If the user is already authenticated then the sign in page shouldn't be visible unless logged out.
    if(req.isAuthenticated()){
        return res.redirect('/airline/manage');
    }

    console.log("Changed to airline!")
    count = 3;
    return res.redirect('back');
});

app.get('/user/explore', function(req, res){
    if(req.cookies.user_id){
        UserList.findById(req.cookies.user_id)
        .then((user) => {
            if(user){
                //This if-else block prevents if a airlineUser tries to login as passenger.
                if(user.usertype == 'Passenger'){
                    return res.render('user_page');
                }
                else{
                    return res.redirect('/airline');
                }
            }
            else{
                return res.redirect('/login');
            }
        })
        .catch((error) => {
            if(error){console.log('Error in finding cookie\'s user_id ', error)};
        })
    }
    else{
        return res.redirect('/login');
    }
})

app.get('/airline/manage', function(req, res){
    if(req.cookies.user_id){
        UserList.findById(req.cookies.user_id)
        .then((user) => {
            if(user){
                //This if-else block prevents if a Passenger tries to login as AirlineUser.
                if(user.usertype == 'Airline'){
                    flightList.find({})
                    .then((flightList) => {
                        UserList.find({})
                        .then((userList) => {
                            return res.render('manage_airline', {flight_list : flightList, user_list : userList});
                        })
                        .catch((error) => {
                            console.log('Error while fetching user list ', error);
                            return
                        })
                    })
                    .catch((error) => {
                        console.log("Error in displaying the flightList ", error)
                        return;
                    })
                }
                else{
                    return res.redirect('/login');
                }
            }
            else{
                return res.redirect('/airline');
            }
        })
        .catch((error) => {
            if(error){console.log('Error in finding cookie\'s user_id ', error)};
        })
    }
    else{
        return res.redirect('/airline');
    }
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
                usertype : req.body.usertype,
                recentbooking : "None",
                bookings : 0
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

app.post('/loginUser', passport.authenticate(
    'local',
    {failureRedirect : '/login'}
), function(req, res){
    res.cookie('user_id', req.user.id);
    return res.redirect('/user/explore');
})

//Using passport.js
app.post('/airlineUser', passport.authenticate(
    'local',
    {failureRedirect : '/airline'}
), function(req, res){
    //Once authenticated the user data is available in locals.
    res.cookie('user_id', req.user.id);
    return res.redirect('/airline/manage');
})

app.listen(port, function(err){
    if(err){
        console.error('Error in starting the server ', err);
    }
    console.log('Server is up and running on port ', port);
});



//Post request for adding new plane
app.post('/airline/manage/addNewFlight', function(req, res){
    flightList.create({
        number : req.body.flightnumber,
        startLocation : req.body.startlocation,
        destination : req.body.destination,
        date : req.body.starttime.split('T')[0],
        startTime : req.body.starttime.split('T')[1],
        reachTime : req.body.reachtime.split('T')[1],
        Fclass : [parseInt(req.body.FCseats), parseInt(req.body.FCseats), req.body.priceFC],
        Bclass : [parseInt(req.body.BCseats), parseInt(req.body.BCseats), req.body.priceBC],
        Eclass : [parseInt(req.body.ECseats), parseInt(req.body.ECseats), req.body.priceEC]
    }).then((newflight) => {
        return res.redirect('back');
    })
    .catch((err) => {
        console.log("Error in creating entry ", error);
        return res.send("404 Bad request");
    })
})


//Post request to cancel a flight
app.post('/airline/manage/cancel_flight', function(req, res){
    flightList.findOneAndDelete({
        number:req.body.flightnumber,
        date:req.body.departuredate
    }).then(() => {
        return res.redirect('back');
    }).catch((err) => {
        console.log('Error in deleting contact', err);
    })
})