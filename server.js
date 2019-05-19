const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto=require('crypto');
const mongoose=require('mongoose');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');

const user = require('./routes/user.route'); // Imports routes for users
const patient = require('./routes/patient.route');//Tmports routes for patients
const app = express();

process.setMaxListeners(0);//to limit listener
// Set up mongoose connection

let dev_db_url = 'mongodb://127.0.0.1:27017/user_dev';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//mongoose
//let access to all users
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
  }
//this to render views in html
app.use(cors(corsOptions));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//to make folder to resources

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

 
//files to render
app.get('/',function (req, res) {
    res.render('login.html');
});
app.post('/helmi',function (req, res) {
    console.log(req.body);
    res.send({"message":"success"});
});
app.get('/upload',function (req, res) {
    res.render('upload.html');
});
app.get('/register',function (req, res) {
    res.render('register.html');
});
app.get('/addPatient',function (req, res) {
    res.render('addPatient.html',{state:"true"});
        
});
app.use('/patients', patient);
app.use('/users', user);


let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});