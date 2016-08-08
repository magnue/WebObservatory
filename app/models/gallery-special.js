// app/models/gallery-special.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var GallerySpecialSchema    = new Schema({
    image_special_name:         String,
    image_special_url:          String,
    image_special_preview_url:  String,
    image_special_summary:      String,
    image_special_article:      [String],
    image_special_created_date: Date, 
    image_special_created_by:   String,
    image_special_edited_date:  Date,
    image_special_edited_by:    String
});

module.exports = mongoose.model('GallerySpecial', GallerySpecialSchema);
