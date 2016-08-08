var Main           = require('../models/main');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in main (create and get all)
    // =============================================================================
    router.route('/main')

    .get(function(req, res) {
        Main.find()
        .then(function(main) {
            console.log('FIND: returning all main items descending');
            res.json(main);
        })
    })

    // routes that ends in main/edit (update)
    // =============================================================================
    router.route('/main/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated main entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    var request = req_json.item;
                    // use main model to update requested main id
                    Main.findById(request._id)
                    .then(function(main) {
                        // Update the main model, only update fields from req_json != null
                        main.name                   = request.name                     != null ? request.name                     : main.name;
                        main.header                 = request.header                   != null ? request.header                   : main.header;
                        main.tagline                = request.tagline                  != null ? request.tagline                  : main.tagline;
                        main.footer_header          = request.footer_header            != null ? request.footer_header            : main.footer_header;
                        main.footer_text            = request.footer_text              != null ? request.footer_text              : main.footer_text;
                        main.footer_yourname        = request.footer_yourname          != null ? request.footer_yourname          : main.footer_yourname;
                        main.footer_youradress      = request.footer_youradress        != null ? request.footer_youradress        : main.footer_youradress;
                        main.footer_yourzip         = request.footer_yourzip           != null ? request.footer_yourzip           : main.footer_yourzip;
                        main.footer_yourstate       = request.footer_yourstate         != null ? request.footer_yourstate         : main.footer_yourstate;
                        main.footer_yourcountry     = request.footer_yourcountry       != null ? request.footer_yourcountry       : main.footer_yourcountry;
                        main.footer_yourphonearea   = request.footer_yourphonearea     != null ? request.footer_yourphonearea     : main.footer_yourphonearea;
                        main.footer_yourphone       = request.footer_yourphone         != null ? request.footer_yourphone         : main.footer_yourphone;
                        main.footer_youremail       = request.footer_youremail         != null ? request.footer_youremail         : main.footer_youremail;
                        main.footer_yourfb          = request.footer_yourfb            != null ? request.footer_yourfb            : main.footer_yourfb;
                        main.footer_yourtwitter     = request.footer_yourtwitter       != null ? request.footer_yourtwitter       : main.footer_yourtwitter;
                        main.footer_yourinstagram   = request.footer_yourinstagram     != null ? request.footer_yourinstagram     : main.footer_yourinstagram;
                        main.footer_yourflickr      = request.footer_yourflickr        != null ? request.footer_yourflickr        : main.footer_yourflickr;
                        main.footer_yourgithub      = request.footer_yourgithub        != null ? request.footer_yourgithub        : main.footer_yourgithub;

                        main.toggle                 = request.toggle                   != null ? request.toggle                   : main.toggle;

                        main.gallery_dso_img        = request.gallery_dso_img          != null ? request.gallery_dso_img          : main.gallery_dso_img;
                        main.gallery_planetary_img  = request.gallery_planetary_img    != null ? request.gallery_planetary_img    : main.gallery_planetary_img;
                        main.gallery_special_img    = request.gallery_special_img      != null ? request.gallery_special_img      : main.gallery_special_img;
                        main.about_img              = request.about_img                != null ? request.about_img                : main.about_img;
                        main.weather_img            = request.weather_img              != null ? request.weather_img              : main.weather_img;
                        main.blog_img               = request.blog_img                 != null ? request.blog_img                 : main.blog_img;

                        main.gallery_dso_text       = request.gallery_dso_text         != null ? request.gallery_dso_text         : main.gallery_dso_text;
                        main.gallery_planetary_text = request.gallery_planetary_text   != null ? request.gallery_planetary_text   : main.gallery_planetary_text;
                        main.gallery_special_text   = request.gallery_special_text     != null ? request.gallery_special_text     : main.gallery_special_text;
                        main.about_text             = request.about_text               != null ? request.about_text               : main.about_text;
                        main.weather_text           = request.weather_text             != null ? request.weather_text             : main.weather_text;
                        main.blog_text              = request.blog_text                != null ? request.blog_text                : main.blog_text;

                        main.dso_sentence           = request.dso_sentence             != null ? request.dso_sentence             : main.dso_sentence;
                        main.planetary_sentence     = request.planetary_sentence       != null ? request.planetary_sentence       : main.planetary_sentence;
                        main.special_sentence       = request.special_sentence         != null ? request.special_sentence         : main.special_sentence;
                        main.about_sentence         = request.about_sentence           != null ? request.about_sentence           : main.about_sentence;
                        main.weather_sentence       = request.weather_sentence         != null ? request.weather_sentence         : main.weather_sentence;
                        main.blog_sentence          = request.blog_sentence            != null ? request.blog_sentence            : main.blog_sentence;
                        main.login_sentence         = request.login_sentence           != null ? request.login_sentence           : main.login_sentence;

                        main.dso_summary_header     = request.dso_summary_header       != null ? request.dso_summary_header       : main.dso_summary_header;
                        main.planetary_summary_header = request.planetary_summary_header != null ? request.planetary_summary_header : main.planetary_summary_header;
                        main.special_summary_header = request.special_summary_header   != null ? request.special_summary_header   : main.special_summary_header;
                        main.about_summary_header   = request.about_summary_header     != null ? request.about_summary_header     : main.about_summary_header;
                        main.weather_summary_header = request.weather_summary_header   != null ? request.weather_summary_header   : main.weather_summary_header;
                        main.blog_summary_header    = request.blog_summary_header      != null ? request.blog_summary_header      : main.blog_summary_header;
                        main.login_summary_header   = request.login_summary_header     != null ? request.login_summary_header     : main.login_summary_header;

                        main.dso_summary_text       = request.dso_summary_text         != null ? request.dso_summary_text         : main.dso_summary_text;
                        main.planetary_summary_text = request.planetary_summary_text   != null ? request.planetary_summary_text   : main.planetary_summary_text;
                        main.special_summary_text   = request.special_summary_text     != null ? request.special_summary_text     : main.special_summary_text;
                        main.about_summary_text     = request.about_summary_text       != null ? request.about_summary_text       : main.about_summary_text;
                        main.weather_summary_text   = request.weather_summary_text     != null ? request.weather_summary_text     : main.weather_summary_text;
                        main.blog_summary_text      = request.blog_summary_text        != null ? request.blog_summary_text        : main.blog_summary_text;
                        main.login_summary_text     = request.login_summary_text       != null ? request.login_summary_text       : main.login_summary_text;

                        main.lati                   = request.lati                     != null ? request.lati                     : main.lati;
                        main.longd                  = request.longd                    != null ? request.longd                    : main.longd;
                        main.yr_place               = request.yr_place                 != null ? request.yr_place                 : main.yr_place;

                        // Save to db
                        main.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated main item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated main item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update main item. No id like = ' + request._id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update main item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating main item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

