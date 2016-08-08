// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var nodemailer     = require("nodemailer");
var multer         = require('multer');
var compression    = require('compression');
// configuration ===========================================
    
// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080; 

// enable compression
app.use(compression());

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url); 

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

// mailroute
require('./app/routes/routes_contact')(app, express, nodemailer);    // pull in routes from /app/routes/routes_contact.js

// set multer file settings
var tmp_folder = __dirname + '/tmp/';
var img_folder = __dirname + '/public/images/';
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, tmp_folder)
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname)
        }
});
var upload = multer({ storage: storage }).fields([{ name: 'largeFile', maxCount: 1 }
                    , { name: 'smallFile', maxCount: 1 }]);

// REGISTER OUR ROUTES -------------------------------
var router = express.Router();

// routes ===============================================
require('./app/routes/routes_all')(app, router);    // pull in routes from /app/routes/routes_all.js
require('./app/routes/routes_login')(app, express);    // pull in routes from /app/routes/routes_login.js
require('./app/routes/routes_main')(app, express);    // pull in routes from /app/routes/routes_main.js
require('./app/routes/routes_gallerydso')(app, express); // pull in routes from /app/routes/routes_gallerydso.js
require('./app/routes/routes_galleryplanetary')(app, express); // pull in routes from /app/routes/routes_galleryplanetary.js
require('./app/routes/routes_galleryspecial')(app, express); // pull in routes from /app/routes/routes_galleryplanetary.js
require('./app/routes/routes_about')(app, express);    // pull in routes from /app/routes/routes_about.js
require('./app/routes/routes_blog')(app, express);    // pull in routes from /app/routes/routes_blog.js
require('./app/routes/routes_weather')(app, express);    // pull in routes from /app/routes/routes_weather.js
require('./app/routes/routes_upload')(app, express, upload, tmp_folder, img_folder);    // pull in routes from /app/routes/routes_upload.js

// frontend routes (for all angular requests)
// ============================================================================= 
app.get('/gallery-dso', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gallery-planetary', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/gallery-special', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/about', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/weather', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/blog', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/404.html');
});

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('WebObservatory started on port: ' + port);

// expose app           
exports = module.exports = app; 
