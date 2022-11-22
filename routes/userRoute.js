// defining the routes user

const express = require('express');
const user_route = express();
const path = require('path');
const session = require('express-session');
const config = require('../config/config');

user_route.use(session({secret:config.sessionSecret}));

// authenticating for using the pages
const auth = require('../middleware/auth');


user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const bodyParser = require('body-parser');
user_route.set(bodyParser.json());
user_route.set(bodyParser.urlencoded({extended: true}));

user_route.use(express.static('public'));

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
const user_controller = require("../controllers/userController"); // load register is available here
user_route.get('/register', auth.isLogout, user_controller.loadRegister);

// getting the user data from form
user_route.post('/register', upload.single('image'), user_controller.insertUser);

// for loading more resources
user_route.get('/moreResources',  user_controller.loadMoreResources);

// setting route for verified mail
user_route.get('/verify', user_controller.verifyMail);

// setting route for login form
user_route.get('/login', auth.isLogout, user_controller.loginLoad);
// user_route.get('/', auth.isLogout, user_controller.loginLoad);

// getting the user data from form
user_route.post('/login',upload.single('image'), user_controller.verifyLogin);

// setting route for home
user_route.get('/home', auth.isLogin, user_controller.loadHome);

// logout for user
user_route.get('/logout', auth.isLogin, user_controller.userLogout);

// for using forgetting password
user_route.get('/forget', auth.isLogout, user_controller.forgetLoad);

user_route.post('/forget',upload.single('image'), user_controller.verifyForget);

// for resetting password
user_route.get('/forget-password', auth.isLogout, user_controller.forgetPasswordLoad);

// for setting the new password
user_route.post('/forget-password', upload.single('image'), user_controller.resetPassword);

// if page not found
user_route.get('/404', user_controller.notFound);

// adding blogs
user_route.get('/subject', user_controller.displaySubject);

user_route.get('/postBlog', user_controller.loadBlog);

user_route.post('/postBlog', upload.single('image'), user_controller.takeBlog);



// to use this route we need to export it
module.exports = user_route;
