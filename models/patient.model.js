const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PatientSchema = new Schema({
    name: {type: String, required: true, max: 100},
    cin: {type: String, required: false},
    address:{type: String, required: true},
    stateOfHealth:{type: String, required: true, max: 100},
    chartsLink:{type: String, required: true},
    videoLink:{type: String, required: true},
    nameDoctor:{type:String,required:true}
});


// Export the model
module.exports = mongoose.model('Patient', PatientSchema);