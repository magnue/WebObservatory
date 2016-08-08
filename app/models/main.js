// app/models/main.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var MainSchema    = new Schema({
    name:                   String,
    header:                 String,
    tagline:                String,
    footer_header:          String,
    footer_text:            String,
    footer_yourname:        String,
    footer_youradress:      String,
    footer_yourzip:         String,
    footer_yourstate:       String,
    footer_yourcountry:     String,
    footer_yourphonearea:   String,
    footer_yourphone:       String,
    footer_youremail:       String,
    footer_yourfb:          String,
    footer_yourtwitter:     String,
    footer_yourinstagram:   String,
    footer_yourflickr:      String,
    footer_yourgithub:      String,

    toggle:                 [Boolean],

    gallery_dso_img:        String,
    gallery_planetary_img:  String,
    gallery_special_img:    String,
    about_img:              String,
    weather_img:            String,
    blog_img:               String,

    gallery_dso_text:       String,
    gallery_planetary_text: String,
    gallery_special_text:   String,
    about_text:             String,
    weather_text:           String,
    blog_text:              String,

    dso_sentence:           String,
    planetary_sentence:     String,
    special_sentence:       String,
    about_sentence:         String,
    weather_sentence:       String,
    blog_sentence:          String,
    login_sentence:         String,

    dso_summary_header:         String,
    planetary_summary_header:   String,
    special_summary_header:     String,
    about_summary_header:       String,
    weather_summary_header:     String,
    blog_summary_header:        String,
    login_summary_header:       String,

    dso_summary_text:       String,
    planetary_summary_text: String,
    special_summary_text:   String,
    about_summary_text:     String,
    weather_summary_text:   String,
    blog_summary_text:      String,
    login_summary_text:     String,

    lati:                   String,
    longd:                  String,
    yr_place:               String,
});

module.exports = mongoose.model('Main', MainSchema);
