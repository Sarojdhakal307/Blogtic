const { Schema, model} = require('mongoose');

const { randomBytes,createHmac } = require('crypto');
const { copyFileSync, cp } = require('fs');
const { createTokenForUser } = require('../services/auth');
const secrets = 'saroj';
const userSchema = new Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    salt:{
        type: String,

    },
    password:{
        type: String,
        required: true
    },
    profileImageURL:{
        type: String,
        default: '/pic/defult.jpg'
    },
    role:{
        type:String,
        enum: ["USER","ADMIN"],
        default: "USER",
    }
    },{timestamps: true});

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256',salt)
                            .update(user.password)
                            .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGeneratedToken', async function(email ,password){
    console.log('email', email);
    const user = await this.findOne({ email});
    // console.log('user :', user);
    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHase = createHmac('sha256',salt)
                            .update(password)
                            .digest('hex');

    if(hashedPassword !== userProvidedHase) throw new Error('Password is Not correct !');

    // return {...user._doc,password: undefined, salt: undefined}
    // console.log(user)
    const token = createTokenForUser(user)
    return token;
    // return user;
});
    
const User = model('User', userSchema);

module.exports = User;