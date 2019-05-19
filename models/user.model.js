const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {type: String, required: true, max: 100},
    userName: {type: String, required: true, max: 100},
    password:{type: String, required: true, max: 100}
});


// Export the model
module.exports = mongoose.model('User', UserSchema);