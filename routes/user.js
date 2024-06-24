const { Router } = require('express');
const User = require('../models/user');
const router = Router();

const blog = require('../models/blog');

router.get('/signin', (req, res) => {
    return res.render('signin', { error: "" });
});

router.get('/signup', (req, res) => {
    return res.render('signup');
});
router.get('/signout', (req, res) => {
    return res.clearCookie('token').redirect('/');
});


router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password:', password);
    
    try {
        if (!email || !password) {
            return res.render('signin', { error: "Email and password are required" });
        }

        const token = await User.matchPasswordAndGeneratedToken(email, password);

        console.log('Generated Token:', token);

        return res.cookie('token', token).redirect('/');
    } catch (err) {
        console.error('Signin Error:', err);
        return res.render('signin', { error: "your input is not Correct !" });
    }required
});

router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    try{
    await User.create({ fullname, email, password });
    return res.redirect('/');
    }catch(err){
        return res.render('signup', { error: "Email is already registered!" });
    }
});
router.get('/profile/:id', async (req, res) => {
        const allBlogs = await blog.find({ createdBy: req.params.id }).sort({ 'createdAt': -1 }).populate('createdBy');
        // const allblogs = await Blog.find({ createdBy: req.params.id}).sort({'createdAt': -1});   
 res.render('profile',{
        user: req.user,
        allblogs: allBlogs

 });
});

module.exports = router;
