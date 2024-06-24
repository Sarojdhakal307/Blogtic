const {verifyToken} = require('./auth');
 function checkauth(req){
    // console.log(req.cookies.token)
 if(req.cookies.token){
    try{ console.log('token is present');
     const user = verifyToken(req.cookies.token)
    //  console.log(user);
    req.user = user;
    return req;
    }catch(err){
        console.log(err);
    }
 }else{
     console.log('token is not present');
 }
}
module.exports = {checkauth};