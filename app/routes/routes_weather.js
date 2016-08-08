var Weather           = require('../models/weather');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in weather (create and get all)
    // =============================================================================
    router.route('/weather')

    // create weather entry
    .post(function(req, res) {
        var json = ({ message: 'Successfully created weather entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                                
                    var weather = new Weather();
                    weather.weather_article_header            = req_json.weather_article_header;
                    weather.weather_article_paragraph         = req_json.weather_article_paragraph;
                    weather.weather_article_paragraph_image   = req_json.weather_article_paragraph_image;
                    weather.weather_toggle_image              = req_json.weather_toggle_image;
                    weather.weather_image_left                = req_json.weather_image_left;
                    weather.weather_image_fit                 = false; // TODO: implement fit (span) in angular
                    weather.weather_created_date              = new Date();
                    weather.weather_edited_date               = null;
                    weather.weather_created_by                = loggedin.loggedin_user_email.split("@")[0]; 
                    weather.weather_edited_by                 = null;

                    // save to db, and check for errors
                    weather.save()
                    .then(function(success) {
                        console.log('CREATE: saved new weather item');
                    })
                    .catch(function(err) {
                        console.log('CREATE: failed to save new weather item');
                    })
                })
                .catch(function(err) {
                    console.log('CREATE: could not create weather item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('CREATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when creating weather item. Are you logged in?'});
        })
    })

    .get(function(req, res) {
        Weather.find()
        .then(function(weather) {
            console.log('FIND: returning all weather items descending');
            res.json(weather);
        })
    })

    // routes that ends in weather/reverse (geta all reverse)
    // =============================================================================
    router.route('/weather/reverse')

    .get(function(req, res) {
        Weather.find().sort({_id : -1})
        .then(function(weather_reverse) {
            console.log('FIND: returning all weather items asending');
            res.json(weather_reverse);
        })
    })

    // routes that ends in weather/edit (update)
    // =============================================================================
    router.route('/weather/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated weather entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use weather model to update requested weather id
                    Weather.findById(req_json.weather_id)
                    .then(function(weather) {
                        // Update the weather model, only update fields from req_json != null
                        weather.weather_article_header          = req_json.weather_article_header          != null ? req_json.weather_article_header          : weather.weather_article_header;
                        weather.weather_article_paragraph       = req_json.weather_article_paragraph       != null ? req_json.weather_article_paragraph       : weather.weather_article_paragraph;
                        weather.weather_article_paragraph_image = req_json.weather_article_paragraph_image != null ? req_json.weather_article_paragraph_image : weather.weather_article_paragraph_image;
                        weather.weather_toggle_image            = req_json.weather_toggle_image            != null ? req_json.weather_toggle_image            : weather.weather_toggle_image;
                        weather.weather_image_left              = req_json.weather_image_left              != null ? req_json.weather_image_left              : weather.weather_image_left;
                        weather.weather_image_fit               = false; // TODO: implement fit (span) in angular
                        weather.weather_created_date            = weather.weather_created_date;
                        weather.weather_edited_date             = new Date();
                        weather.weather_created_by              = weather.weather_created_by;
                        weather.weather_edited_by               = loggedin.loggedin_user_email.split("@")[0];

                        // Save to db
                        weather.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated weather item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated weather item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update weather item. No id like = ' + req_json.weather_id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update weather item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating weather item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // routes that ends in weather/delete (delete)
    // =============================================================================
    router.route('/weather/delete/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated weather entry' });
        console.log('DELETE: req.body = ' + req.body + '\nstringify = ' + JSON.stringify(req.body)); // TODO remove
        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // user id to remove entry in weather
                    Weather.remove({_id: req_json.weather_id})
                    .then(function(weather) {
                        console.log('DELETE: successfully deleted weather item.');
                    })
                    .catch(function(err) {
                        console.log('DELETE: could not delete weather item. No id like = ' + req_json.weather_id);
                    })
                })
                .catch(function(err) {
                    console.log('DELETE: could not delete weather item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('DELETE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when deleting weather item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

