const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const { createHmac } = require('crypto');


const User = require("../models/user");
// const Blog = require("./models/blog");
const secret = '$blog$';

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        fullname: user.fullname,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = JWT.sign(payload, secret);
    return token;
}


function verifyToken(token){
    return JWT.verify(token, secret);
}

// async function hashpassword(password ,req){
//     // console.log('password : '+ password + 'ID : ' +userId + 'type of :' + typeof userId );
//     // const user = await User.findById( _id);
//     // const user = await User.findById({userId});
//     // const objectId = mongoose.Types.ObjectId(userId);
//     // const user = await User.findOne({ email});
//     // console.log('type of :' + typeof objectId )
//     const user = await User.findOne({_id: req.user._id});
//     // console.log('user :', user);
//     // if(!user) throw new Error('User not found');
//     console.log(User);
//     // const salt = user.salt;
//     // const hashedPassword = user.password;

//     // console.log(salt);

//     // const hashedPassword = createHmac('sha256',salt)
//     //                         .update(password)
//     //                         .digest('hex');
//     return 0;

//     // return hashedPassword;
// };
async function comparePasswordWithHashed(password,req){
    console.log('password : '+ password);
    try{
    // const user = await User.findOne({ _id});
    if(hashpassword(password,req) == user.password){
        console.log("currect Old password")
        return true;
    }
}catch(e){
    // res.status(400).json({msg: 'user invalide'})
    console.log(e);
    return false;
}

}


module.exports = {  
    createTokenForUser,
    verifyToken,
    // hashpassword,
    comparePasswordWithHashed
 };  // Exporting the functions createTokenForUser and verifyToken