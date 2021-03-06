const mongoose = require("mongoose"),
      passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    email:{type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin:{type:Boolean, default:false}
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;