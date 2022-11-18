// for authentication of user
const isLogin = async(req, res, next) =>{
    try {
        // checking 
        if(req.session.user_id){}
        else{
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.log("error while authenticating 1", error.message);
    }
};

const isLogout = async(req, res, next) =>{
    try {
        if(req.session.user_id){
            return res.redirect('/home');
        }
        next();
    } catch (error) {
        console.log("error while authenticating 2", error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
}