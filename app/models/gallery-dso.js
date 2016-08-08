// app/models/gallery-dso.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var GalleryDSOSchema    = new Schema({
    image_dso_name:         String,
    image_dso_url:          String,
    image_dso_preview_url:  String,
    image_dso_summary:      String,
    image_dso_article:      [String],
    image_dso_created_date: Date, 
    image_dso_created_by:   String,
    image_dso_edited_date:  Date,
    image_dso_edited_by:    String
});

module.exports = mongoose.model('GalleryDSO', GalleryDSOSchema);
