// app/models/gallery-planetary.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var GalleryPlanetarySchema    = new Schema({
    image_planetary_name:         String,
    image_planetary_url:          String,
    image_planetary_preview_url:  String,
    image_planetary_summary:      String,
    image_planetary_article:      [String],
    image_planetary_created_date: Date, 
    image_planetary_created_by:   String,
    image_planetary_edited_date:  Date,
    image_planetary_edited_by:    String
});

module.exports = mongoose.model('GalleryPlanetary', GalleryPlanetarySchema);
