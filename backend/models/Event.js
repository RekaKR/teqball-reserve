const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const eventSchema = Schema({

    title:{
        type: String,
        required: true,
    },

    description:{
        type: String,
    },

    date:{
        type: Date,
        required: true,
    },

    venue:{
        type: String,
        required: true,
    },

    groupId: {
        type: String,
        required: true,
    },

    members: [
        {
            googleId: String,
            name: String,
            email: String,
            picture: String,
            participation: String
        }
    ],

});


module.exports = Event = mongoose.model("Event", eventSchema);