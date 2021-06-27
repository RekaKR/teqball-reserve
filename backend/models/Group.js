const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const groupSchema = Schema({

    name:{
        type: String,
        required: true,
    },

    members:[
        {
            googleId: String,
            name: String,
            groupRole: String,
            picture: String
        }
    ]

});


module.exports = Group = mongoose.model("Group", groupSchema);