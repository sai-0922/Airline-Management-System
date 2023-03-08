cmd : npm install mongoose
Setup mongoose using the 5 lines in config/mongoose.js
Used require('...mongoose.js') in server.js to access the database that is setup

cmd : npm install cookie-parser
In index.js require it and app.use(cookieParser());

Created a UserSchema.


For Authentication - 
See documentation of Passport.js. Passport.js is a middleware used for authentication. Since it is a middleware the operation done by it is,
before sending the req to controller it finds the user corresponding to the cookie/user_id. With passport.js we can use different strategies
for authentication. We can also use local passport strategy for local authentication like we did in manual authentication.

Now lets use passport for authentiacation. Lets start with local-authentication.
1. npm install passport //For installing passport
2. npm install passport-local //For installing strategy.

In manual authentication what we did is we checked for a user with a password and username and if he exists then we set the user_id to
cookie and returned it. Similar to this but passport js stores a session cookie(difference is it stores the session information and user_id
stored is encrypted).


3. npm install express-session

//Resolve the issue : currently the passport authentication is verifying only if password corresponding to the username is correct or not.
We should also check that only if the user found is airline memeber then we should navigate to /airline/manage otherwise return to login page.
Also try to show the errorMessages as done before. Also in airline login the passport should also verify User name i.e., name.