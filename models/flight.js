const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    number : {
        type : String,
        required : true
    },
    startTime : {
        type : String,
        required : true
    },
    reachTime : {
        type : String,
        required : true
    },
    startLocation : {
        type : String,
        required : true
    },
    destination : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    Bclass : {
        //We store the 1st index as seats available and 2nd index as the total seats and 3rd is the price of ticket.
        type : Array,
        required : true
    },
    Fclass : {
        type : Array,
        required : true
    },
    Eclass : {
        type : Array,
        required : true
    }
},  {
        timestamps : true
    }
);

const flights = mongoose.model('flights', flightSchema);

module.exports = flights;
