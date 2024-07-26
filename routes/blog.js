const Router = require('express');
const router = Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/upload/`))
    },
    filename: function (req, file, cb) {
     const fileName = `${Date.now()}-${file.originalname}`;
     cb(null, fileName)
    }
  })
  const upload = multer({ storage: storage });

const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');


router.get('/addBlog', (req, res) => {
    // res.send('Users:'+ req.user);
    try{
        return res.render('addBlog', { user: req.user});
    }catch(err){
        return res.render('addBlog', { 
            error: "you are not logged in!",
            user: ""});
    }
});
router.post('/addBlog', upload.single('coverImage'), async (req, res) => {
    const {title,content} = req.body;
    // console.log(req.body);
    // console.log(req.file);
    // console.log('Title:', title, 'Cover Image:', coverImageURL, 'Content:', content);
   const blog = await  Blog.create({
    title,
    coverImageURL: `/upload/${req.file.filename}`,
    content,
    createdBy: req.user._id
    });
console.log('Blog:', blog);
    return res.redirect(`/`);
});

router.post('/comments/:blogId', async (req, res) => {
const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    commentBy: req.user._id
});
console.log('Comment : ', comment);
console.log('BlogId:', req.params.blogId);

return res.redirect(`/blog/${req.params.blogId}`);
});
  
router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comment = await Comment.find({blogId: req.params.id}).sort({'createdAt': -1}).populate('commentBy');
  console.log('user :' , req.user);
  res.render('blog', {
    user: req.user,
    blog: blog,
    comment : comment,
  }); 
});
//search blog
router.get('/search/:search', async (req, res) => {
  const {searchName} = req.params.search;
  const allBlogs = await blog.find({title:{$regex: `^${searchName}`, $options:`i`}}).sort({ 'createdAt': -1 }).populate('createdBy');
  // const allblogs = await Blog.find({ createdBy: req.params.id}).sort({'createdAt': -1});   
res.render('home',{
  // user: req.user,
  allblogs: allBlogs
});
});


// router.get('/edit/:id', async (req, res) => {
//     const blog = await Blog.findById(req.params.id);
//     console.log('Blog:', blog);
//     res.render('editBlog', {
//         blog: blog
//     });
// });



module.exports = router;