// controller connects views and models 
require('dotenv').config();
const User = require('../models/userModel');

// using bcrypt to encrypt password
const bcrypt = require('bcrypt');

// for sending the emails
const nodemailer = require('nodemailer');

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
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
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

// exporting because anyone can use the register form from anywhere
module.exports = {
    loadRegister,
    insertUser,
    verifyMail
}
