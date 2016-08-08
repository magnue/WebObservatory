// app/models/weather.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var WeatherSchema    = new Schema({
    weather_article_header:           String,
    weather_article_paragraph:        [String],
    weather_article_paragraph_image:  [String],
    weather_toggle_image:             [Boolean],
    weather_image_left:               [Boolean],
    weather_image_fit:                [Boolean],
    weather_created_date:             Date,
    weather_edited_date:              Date,
    weather_created_by:               String,
    weather_edited_by:                String
});

module.exports = mongoose.model('Weather', WeatherSchema);
