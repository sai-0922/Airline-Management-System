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