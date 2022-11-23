// defining the routes for admin

const express = require('express');
const admin_route = express();
const session = require('express-session');
const config = require('../config/config');
const path = require('path');


admin_route.use(session({secret:config.sessionSecret}));

const bodyParser = require('body-parser');
admin_route.set(bodyParser.json());
admin_route.set(bodyParser.urlencoded({extended: true}));


admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const admin_controller = require('../controllers/adminController');
const auth = require('../middleware/adminAuth');


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

admin_route.get('/', admin_controller.loadLogin);
// for any other url
admin_route.post('/', auth.isLogout, upload.single('image'), admin_controller.verifyLogin);

admin_route.get('/home', auth.isLogin, admin_controller.loadDashboard);

// admin_route.post('/home', auth.isLogin,upload.single('image'), admin_controller.addJobs);

admin_route.get('/logout', auth.isLogin, admin_controller.adminLogout);

admin_route.get('/forget', auth.isLogout, admin_controller.forgetLoad);

admin_route.get('/addJobs', auth.isLogin, admin_controller.loadAddJobs);

admin_route.post('/addJobs', auth.isLogin, upload.single('image'), admin_controller.addJobs);

admin_route.get('/addSubject', auth.isLogin, admin_controller.addSubject);

admin_route.get('/rejectSubject', auth.isLogin, upload.single('image') ,admin_controller.rejectSubject);

admin_route.get('/jobs', function(req, res){
    req.session.destroy();
    return res.render('/');
});

admin_route.get('*', function (req, res) {
    return res.redirect('/admin');
});

module.exports = admin_route;