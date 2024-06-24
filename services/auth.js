const JWT = require('jsonwebtoken');

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

module.exports = {  createTokenForUser, verifyToken };  // Exporting the functions createTokenForUser and verifyToken