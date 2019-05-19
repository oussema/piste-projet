const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto=require('crypto');
const mongoose=require('mongoose');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');
const path=require('path');
const JSON = require('circular-json');
var app=express();
var csv = require("csvtojson");
var fs = require('fs');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
 //Mongo URL
 const mongoURI='mongodb://localhost:27017/user_dev';

 //Create mongo connnection
 const conn =mongoose.createConnection(mongoURI);
 
 //Init gfs
 let gfs;
 conn.once('open',  ()=> {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
   });
   //Create storage engine
 const storage = new GridFsStorage({
     url: mongoURI,
     file: (req, file) => {
       return new Promise((resolve, reject) => {
         crypto.randomBytes(16, (err, buf) => {
           if (err) {
             return reject(err);
           }
           const filename = buf.toString('hex') + path.extname(file.originalname);
           const fileInfo = {
             filename: filename,
             //patientCIN:patientCIN,
             bucketName: 'uploads'
           };
           resolve(fileInfo);
         });
       });
     }
   });
   const upload = multer({ storage });

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/user.controller');

router.post('/delete/:userName',user_controller.user_delete);
router.post('/update',user_controller.user_update);
router.post('/create', user_controller.user_create);
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', user_controller.test);//just to test
router.get('/email/:email/password/:password/state/:state', user_controller.user_details);//get user information
router.post('/login', user_controller.user_login);
router.get('/room',user_controller.room);
router.post('/upload',upload.single('file'),user_controller.upload_data);//upload data for patient
router.get('/json/:filename',(req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err,file)=>{
      //check file exist
      if(!file || file.length===0){
          return res.status(404).json({
              err: 'No file exist'
          });
      }
      //files exist 
      //if(file.contentType ==='text/csv'){
          //read output to browser 
          var readstream = gfs.createReadStream(file.filename);
          csv()
.fromStream(readstream)
.then((jsonObj)=>{
    res.send(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
})
          //readstream.pipe(res);
         /* var csvStream = csv.fromStream(readstream, {headers : true})
    .on("data", function(data){
         d+=JSON.stringify(data)+',';
         console.log(data);
        
    })
    .on("end", function(){
         res.send(d+']');
         console.log("done");
    });*/
   
         //let tx= readstream.pipe(csvStream);
         
         
                /*let buffer='';
                readstream.on("data",function (chunk) {
                  buffer += chunk;
                });
              readstream.on("end", function(){res.send(buffer)});*/
     // } else{
         // res.status(404).json({
           //   err :'Not a pdf'
         // });
      //}
  })
});
module.exports = router;

