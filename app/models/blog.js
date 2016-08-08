// app/models/blog.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var BlogSchema    = new Schema({
    blog_article_header:           String,
    blog_article_paragraph:        [String],
    blog_article_paragraph_image:  [String],
    blog_toggle_image:             [Boolean],
    blog_image_left:               [Boolean],
    blog_image_fit:                [Boolean],
    blog_created_date:             Date,
    blog_edited_date:              Date,
    blog_created_by:               String,
    blog_edited_by:                String
});

module.exports = mongoose.model('Blog', BlogSchema);
