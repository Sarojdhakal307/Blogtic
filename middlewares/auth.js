const {verifyToken} = require('../services/auth');

function checkforauthCookies(){
    return function(req, res, next){
        if (req.cookies) {
            // console.log(req.cookies.token);
            const tokenCookieValue = req.cookies.token;
            if(!tokenCookieValue){
               return  next();
            }
            try{
                const userPayload = verifyToken(tokenCookieValue);
            //    console.log(userPayload);
                req.user = userPayload;
                // console.log('user in middleware : ' +JSON.stringify(req.user));
                }catch(err){
                }
                next();
        }
      
    }
}

module.exports = {checkforauthCookies };