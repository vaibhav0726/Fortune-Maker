const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Subjects = require('../models/subjectModel');
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

            Subjects.find({}, function(err, data){
                if(err){
                    console.log('error while loading data', err);
                    return;
                }
                else{
                    return res.render('adminDashboard', {subject_list: data});
                }
            });

            // return res.redirect('/admin/adminDashboard', {});
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

// post method for adding jobs
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

//get method for adding jobs
const loadAddJobs = async(req, res) => {
    try {
        const userData = await User.findById({_id: req.session.user_id});
        if(userData.is_admin === 0){
            return res.redirect('/admin');
        }
        else{
            return res.render('addJobs');
        }
    } catch (error) {
        console.log("error while loading dashboard", error.message);
    }
};

// for accepting the subjects
const addSubject = async(req, res) => {
    try {
        const updatedInfo =  await Subjects.updateOne({
            _id: req.query.id,
        },
        {
            $set: {
                is_verified: 1
            },
        });
        return res.redirect('back');
    } catch (error) {
        console.log('error while adding subject', error.message);
    }
};

// rejectSubject
const rejectSubject = async(req, res) => {
    try {
        let id = req.query.id;
        Subjects.findByIdAndDelete(id, function(err){
            if(err){
                console.log('error in rejecting the subject', err);
                return;
            }
            return res.redirect('back');
        });
    } catch (error) {
        console.log('error while rejecting subject', error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    adminLogout,
    forgetLoad,
    addJobs,
    loadAddJobs,
    addSubject,
    rejectSubject
}