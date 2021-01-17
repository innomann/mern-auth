const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        reuired: true
    },
    email:{
        type: String,
        reuired: true
    },
    password: {
        type: String,
        reuired: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model("Users",UserSchema)