// app/models/about.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var AboutSchema    = new Schema({
    about_article_header:           String,
    about_article_paragraph:        [String],
    about_article_paragraph_image:  [String],
    about_toggle_image:             [Boolean],
    about_image_left:               [Boolean],
    about_image_fit:                [Boolean],
    about_created_date:             Date,
    about_edited_date:              Date,
    about_created_by:               String,
    about_edited_by:                String
});

module.exports = mongoose.model('About', AboutSchema);
