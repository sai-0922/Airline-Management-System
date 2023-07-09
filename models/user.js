const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    usertype : {
        type : String,
        required : true
    },
    recentbooking : {
        type : String
    },
    bookings : {
        type : Number,
        required : true
    }
},  {
        timestamps : true
    }
);

const User = mongoose.model('User', userSchema);
//This line creates a collection with name User (1st arg) and the schema used for that collection is 2nd argument. The return value is
// a mongoose object with the help of which we can access entries in that collection.

module.exports = User;
//Now the question is in which db the collection is stored. Remember that while setting up mongoose we linked it to a database passenger_list_db.
//Always link mongoose to a database before creating collections in it.

//Note that it is confusing to place different parts of code in different files but we do it for the program to be scalable. Instead we 
//can place the code of all .js files in a single server.js file and the results are same. For scalability we use different files and export them
// and import them to server.js.