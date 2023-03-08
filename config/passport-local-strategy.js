//Configuring passport for local authentication
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');//We require the collection we want to check the credentials for.


//authentication using passport : checking the database and establishing the identity.
//We are telling passport to use the local authentication strategy.
passport.use(new LocalStrategy({
        usernameField : 'email'
    },
    function(email, password, done){
        //find a user and establish the identity. The arguments of function are the login details entered by user.
        User.findOne({email : email}).then((user) => {
            if(!user || user.password != password){
                console.log('Invalid username/password!');
                return done(null, false);
            }
            return done(null, user);
        })
        .catch((err) => {
            console.log('Error in finding user via passport ', err);
            return done(err);
        })
    }
))

//serializing the user that means to decide which key should be encrypted and stored in the key(here user_id)
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//desrealizing i.e., if the user request contains a cookie we should check if the cookie(user_id) is present in database.
passport.deserializeUser(function(id, done){
    User.findById(id).then((user) => {
        done(null, user);
    })
    .catch((err) => {
        console.log('Error in finding the user corr to cookie ', err);
    })
})

module.exports = passport;