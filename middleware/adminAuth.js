// for authentication of admin

const isLogin = async(req, res, next) =>{
    try {
        if(req.session.user_id){}
        else{
            return res.redirect('/admin');
        }
        next();
    } catch (error) {
        console.log("error while authenticating 1", error.message);
    }
};

const isLogout = async(req, res, next) =>{
    try {
        if(req.session.user_id){
            return res.redirect('/admin/home');
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