const User = require('../models/user.model');
var express=require('express');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
var bodyparser = require('body-parser');
var app=express();
var fs = require('fs');
app.use(bodyparser.json());

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send({"message":"salut"});
};
exports.user_create = function (req, res) {
    
   let user = new User({
       email:req.body.email,
       userName:req.body.userName,
       password:req.body.psw
   });
    MongoClient.connect(url,{ useNewUrlParser: false }, function(err, db) {
       if (err) throw err;
        var dbo = db.db("user_dev");
        dbo.collection("users").find({userName:user.userName}).toArray(function(err, result)  {
          if (err) throw err;
          console.log(result);
          if(result.length){
            res.send({"message":"this user name exist !"});
          } else {
            user.save(function (err) {
                if (err) {
                  throw err;
                };
                res.send([{"List_Patient":"/patients/list/"+user.userName},
            {"Add_Patient":"/patients/create"}]);
                console.log(user);
            });  
           };
          db.close();
        });
      });

   
};
exports.user_delete =function(req,res) {
    User.findOne({userName:req.params.userName})
    .deleteOne({},(err,removed)=>{
        if(err) throw new Error("error");
        
    });
    res.send({"message":"user deleted"});
       
};
exports.user_update = function(req,res){
    let user = new User({
        email:req.body.email,
        userName:req.body.userName,
        password:req.body.psw
    }); 
    User.findOne({userName:req.body.userName}).
    update(user,(err)=>{if (err) throw new Error("error")});
};
exports.user_details = function (req, res) {
    User.find({email:req.params.email,password:req.params.password}, function (err, user) {
        //if (err) return next(err);
        res.send({"state":req.params.state});
    })
};
exports.user_login=function (req, res){
    User.find({email:req.body.email,password:req.body.psw}, function (err, user) {
        if (err) throw err;
        if(user.length == 0){res.send({"state":"false"})}
        else {
            console.log(user[0].userName);
            //res.redirect("/patients/list/"+user[0].userName);
            res.send([{"List_Patient":"/patients/list/"+user[0].userName},
            {"Add_Patient":"/patients/create"}]);
        }
        
    })
};
exports.room= function (req, res) {
    res.render('room.html');
}
exports.upload_data=function (req,res){
    res.json({file: req.file});
    res.send(req.params.cin);
}


