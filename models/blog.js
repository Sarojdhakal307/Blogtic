const { Schema, model} = require('mongoose');

const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    coverImageURL:{
        type: String,
        default: '/pic/defult.jpg'
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},{timestamps: true});


const Blog = model('blog', blogSchema);

module.exports = Blog;  // Exporting the model Blog