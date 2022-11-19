// controller connects views and models 
require('dotenv').config();
const User = require('../models/userModel');
const Job = require('../models/jobModel');


// using bcrypt to encrypt password
const bcrypt = require('bcrypt');

// for sending the emails
const nodemailer = require('nodemailer');

const randomString = require('randomstring');

// const regexp = require('regexp');

// encrypting password using bcrypt
const securePassword = async(password) => {
    try {
        // the Blowfish encryption algorithm
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log("error while encrypting your message:- ", error.message);
    }
}

// for sending mail
const sendVerifyMail = async(name, email, user_id) => {
    try {
        // providing the host
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // providing which mail will send the mail
        const mailOptions = {
             from: process.env.EMAIL,
             to: email,
             subject: "for verification mail",
             html: '<p>Hii ' +name+ ' please click here to <a href="http://localhost:3000/verify?id='+ user_id +'">Verify</a> Your mail.</p>'
        };

        transporter.sendMail(mailOptions, function(err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("Email has been sent successfully", info.response);
            }
        });

    } catch (error) {
        console.log("error while sending mail", error.message);
    }
};

// methods which take data from the form and sent them to models and then to mongodb
// rendering the page and using it in the userRoutes
const loadRegister = async(req, res) =>{
    try {
        res.render('registration');
    } catch (error) {
        console.log("error while loading page",error.message);
    }
};

// inserting user to the db ans using it in the userRoutes
const insertUser = async(req, res) =>{
    try {
        const spassword = await securePassword(req.body.password);
        let regex = /[a-z0-9]+@gla.ac.in/;
        if(regex.test(req.body.email)){
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                uniRoll: req.body.uniRoll,
                password: spassword,
                is_admin: 0,
            });
    
            // using await because it returns a promise
            const userData = await user.save();
    
            // if userData saved successfully
            if(userData){
    
                sendVerifyMail(req.body.name, req.body.email, userData._id);
    
                res.render('registration', {message: 'Your registration has been successfully completed, Please verify your mail'});
            }
            else{
                res.render('registration', {message: 'User registration failed'});
            }
        }
        else{
            res.render('registration', {message: 'Use gla email id'});
        }
    } catch (error) {
        console.log("error while registering:- ",error.message);
    }
}

const verifyMail = async(req, res) => {
    try {
        const updatedInfo =  await User.updateOne({
            _id: req.query.id,
        },
        {
            $set: {
                is_verified: 1
            },
        });

        console.log(updatedInfo);
        res.render("email-verified");

    } catch (error) {
        console.log("error while verifying mail: ",error.message);
    }
};

//  for user login user methods 
const loginLoad = async(req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log("error while loading login: ",error.message);
    }
};

const verifyLogin = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // checking if user exists and verified or not
        const userData = await User.findOne({email: email});

        if(userData){
            // decrypting and verifying password
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                // checking is email verified or not
                if(userData.is_verified === 0){
                    res.render('login', {message: 'Your Email is not verified'});
                }
                else{
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            }
            else{
                res.render('login', {message: 'Your Password is incorrect'});
            }
        }
        else{
            res.render('login', {message: 'Your Email or password is incorrect'});
        }

    } catch (error) {
        console.log("error while verifying login: ", error.message);
    }
};

const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({_id: req.session.user_id});
        Job.find({}, function (err, jobs) {
            if(err){
                console.log('error in fetching jobs', err);
                return;
            }
            return res.render('home', {
                job_list: jobs, // array
                user: userData,
            });
        });
        // res.render('home', {user: userData, });

    } catch (error) {
        console.log("error while loading home page: ", error.message);
    }
};

const userLogout = async(req, res) => {
    try {
        req.session.destroy();
        return res.redirect('/login');
    } catch (error) {
        console.log("error while logging out: ", error.message);
    }
}; 

// forget password code start
const forgetLoad = async(req, res) => {
    try {
        return res.render('forget');
    } catch (error) {
        console.log("error while rendering forget password page: ", error.message);
    }
};

const verifyForget = async(req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({email: email});
        // if user registered 
        if(userData){
            // is verify or not
            if(userData.is_verified === 0){
                res.render('forget', {message: "Your Email is not verified"});
            }
            else{
                const randomStr = randomString.generate();
                const updatedData = await User.updateOne({email: email}, {$set:{token: randomStr}});
                sendResetPasswordMail(userData.name, userData.email, randomStr);
                res.render('forget', {message: "Please check your mail to reset your password"});

            }
        }
        else{
            res.render('forget', {message: "Your Email is not registered"});
        }
        
    } catch (error) {
        console.log("error while verifying forget", error.message);
    }
};

// for reset password send mail
const sendResetPasswordMail = async(name, email, token) => {
    try {
        // providing the host
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // providing which mail will send the mail
        const mailOptions = {
             from: process.env.EMAIL,
             to: email,
             subject: "for Reset Password",
             html: '<p>Hii ' +name+ ' please click here to <a href="http://localhost:3000/forget-password?token='+ token +'">Reset</a> Your Password.</p>'
        };

        transporter.sendMail(mailOptions, function(err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("Email has been sent successfully", info.response);
            }
        });

    } catch (error) {
        console.log("error while sending mail", error.message);
    }
};

const forgetPasswordLoad = async(req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({token: token});
        // if the same token found in the db
        if(tokenData){
            return res.render('forget-password', {user_id: tokenData._id});
        }
        else{
            res.render('404', {message: 'Token not found'});
        }

    } catch (error) {
        console.log("error while resetting password", error.message);
    }
};

// setting new password
const resetPassword = async(req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({_id: user_id}, {$set: {password: secure_password, token: ''}});
        
        return res.render('login');

    } catch (error) {
        console.log("error while registering new password", error.message);
    }
};

const loadMoreResources = async(req, res) => {
    try {
        return res.render('moreResources');
    } catch (error) {
        console.log("error while loading more resources", error.message);
    }
};

// exporting because anyone can use the register form from anywhere
module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    verifyForget,
    forgetPasswordLoad,
    resetPassword,
    loadMoreResources
}
