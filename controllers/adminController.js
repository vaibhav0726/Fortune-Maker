const User = require('../models/userModel');
const Job = require('../models/jobModel');
const bcrypt = require('bcrypt');

const loadLogin = async(req, res) => {
    try {
        return res.render('login');
    } catch (error) {
        console.log("error while loading login page", error.message);
    }
};

const verifyLogin = async(req, res) => {
    try {
        // req.session.destroy();
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email});
        if(userData){
            const matchPassword = await bcrypt.compare(password, userData.password);
            
            if(matchPassword){

                if(userData.is_admin === 0){
                    return res.render('login', {message: "Email or Password is incorrect"});
                }
                else{
                    req.session.user_id = userData._id;
                    return res.redirect('/admin/home');
                }

            }
            else{
                return res.render('login', {message: "Password mismatch"});
            }

        }
        else{
            return res.render('login', {message: "Email or Password is incorrect"});
        }

    } catch (error) {
        console.log("error while verifying login page", error.message);
    }
};

const loadDashboard = async(req, res) => {
    try {
        const userData = await User.findById({_id: req.session.user_id});
        if(userData.is_admin === 0){
            return res.redirect('/admin');
        }
        else{
            return res.render('home');
        }
    } catch (error) {
        console.log("error while loading dashboard", error.message);
    }
};

const adminLogout = async(req, res) => {
    try {
        req.session.destroy();
        return res.redirect('/admin');
    } catch (error) {
        console.log("error while logging out", error.message);
    }
};

const forgetLoad = async(req, res) => {
    try {
        
    } catch (error) {
        console.log("error while resetting password", error.message);
    }
};

const addJobs = async(req, res) => {
    try {
        const job = new Job({
            name: req.body.name,
            role: req.body.role,
            description: req.body.description,
            skill1: req.body.skill1,
            skill2: req.body.skill2,
            image: req.file.filename
        });

        const jobData = await job.save();
        if(jobData){
            return res.redirect('/login');
        }
        else{
            console.log("error while saving job", error.message);
        }
    } catch (error) {
        console.log("error while adding jobs", error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    adminLogout,
    forgetLoad,
    addJobs,

}