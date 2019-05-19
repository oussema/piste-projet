const Patient = require('../models/patient.model');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

exports.test =function(req,res){
 res.send('hello this me')
};

exports.add_patient =function(req,res){

    let patient = new Patient(
        { 
            name:req.body.name,
            cin:req.body.cin,
            address:req.body.address,
            stateOfHealth:req.body.stateOfHealth,
            chartsLink:req.body.chartsLink,
            videoLink:req.body.videoLink,
            nameDoctor:req.body.nameDoctor
        }
    );
    

    patient.save(function (err) {
        console.log(err);
       res.send(req.body);
    })
};
exports.patient_delete = function (req,res) {
    Patient.findOne({userName:req.params.userName})
    .deleteOne({},(err,removed)=>{
        if(err) throw new Error("error");
        
    });
    res.send({"message":"patient deleted"});
}
exports.patient_update = function(req,res){
    let patient= new Patient({

    });
    Patient.findOne({userName:req.body.userName})
    .update(patient, (err)=>{if (err) throw new Error('error')});
}
exports.render_patients=function (req, res) {
    var nameDoctor=req.params.nameDoctor;
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("user_dev");
        dbo.collection("patients").find({nameDoctor:nameDoctor}).toArray(function(err, result)  {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });
};
