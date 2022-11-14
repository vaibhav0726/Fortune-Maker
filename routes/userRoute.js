// defining the routes

const express = require('express');
const user_route = express();
const path = require('path');

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const bodyParser = require('body-parser');
user_route.set(bodyParser.json());
user_route.set(bodyParser.urlencoded({extended: true}));

// to send the png file to the public/userImages
const multer = require('multer');
const storage = multer.diskStorage({
    // file uploading destination
    destination: function(req, file, cb){
        // call back function
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function(req, file, cb){
        const name = Date.now() + '-' + file.originalname; 
        cb(null, name);
    }
});

const upload = multer({storage: storage});

// controller should be defined to use the methods
const controller = require("../controllers/userController"); // load register is available here
user_route.get('/register', controller.loadRegister);

// getting the user data from form
user_route.post('/register', upload.single('image'), controller.insertUser);

// setting route for verified mail
user_route.get('/verify', controller.verifyMail);

// to use this route we need to export it
module.exports = user_route;
