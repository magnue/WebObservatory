var About           = require('../models/about');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in about (create and get all)
    // =============================================================================
    router.route('/about')

    // create about entry
    .post(function(req, res) {
        var json = ({ message: 'Successfully created about entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                                
                    var about = new About();
                    about.about_article_header            = req_json.about_article_header;
                    about.about_article_paragraph         = req_json.about_article_paragraph;
                    about.about_article_paragraph_image   = req_json.about_article_paragraph_image;
                    about.about_toggle_image              = req_json.about_toggle_image;
                    about.about_image_left                = req_json.about_image_left;
                    about.about_image_fit                 = false; // TODO: implement fit (span) in angular
                    about.about_created_date              = new Date();
                    about.about_edited_date               = null;
                    about.about_created_by                = loggedin.loggedin_user_email.split("@")[0]; 
                    about.about_edited_by                 = null;

                    // save to db, and check for errors
                    about.save()
                    .then(function(success) {
                        console.log('CREATE: saved new about item');
                    })
                    .catch(function(err) {
                        console.log('CREATE: failed to save new about item');
                    })
                })
                .catch(function(err) {
                    console.log('CREATE: could not create about item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('CREATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when creating about item. Are you logged in?'});
        })
    })

    .get(function(req, res) {
        About.find()
        .then(function(about) {
            console.log('FIND: returning all about items descending');
            res.json(about);
        })
    })

    // routes that ends in about/reverse (geta all reverse)
    // =============================================================================
    router.route('/about/reverse')

    .get(function(req, res) {
        About.find().sort({_id : -1})
        .then(function(about_reverse) {
            console.log('FIND: returning all about items asending');
            res.json(about_reverse);
        })
    })

    // routes that ends in about/edit (update)
    // =============================================================================
    router.route('/about/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated about entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use about model to update requested about id
                    About.findById(req_json.about_id)
                    .then(function(about) {
                        // Update the about model, only update fields from req_json != null
                        about.about_article_header          = req_json.about_article_header          != null ? req_json.about_article_header          : about.about_article_header;
                        about.about_article_paragraph       = req_json.about_article_paragraph       != null ? req_json.about_article_paragraph       : about.about_article_paragraph;
                        about.about_article_paragraph_image = req_json.about_article_paragraph_image != null ? req_json.about_article_paragraph_image : about.about_article_paragraph_image;
                        about.about_toggle_image            = req_json.about_toggle_image            != null ? req_json.about_toggle_image            : about.about_toggle_image;
                        about.about_image_left              = req_json.about_image_left              != null ? req_json.about_image_left              : about.about_image_left;
                        about.about_image_fit               = false; // TODO: implement fit (span) in angular
                        about.about_created_date            = about.about_created_date;
                        about.about_edited_date             = new Date();
                        about.about_created_by              = about.about_created_by;
                        about.about_edited_by               = loggedin.loggedin_user_email.split("@")[0];

                        // Save to db
                        about.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated about item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated about item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update about item. No id like = ' + req_json.about_id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update about item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating about item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // routes that ends in about/delete (delete)
    // =============================================================================
    router.route('/about/delete/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated about entry' });
        console.log('DELETE: req.body = ' + req.body + '\nstringify = ' + JSON.stringify(req.body)); // TODO remove
        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // user id to remove entry in about
                    About.remove({_id: req_json.about_id})
                    .then(function(about) {
                        console.log('DELETE: successfully deleted about item.');
                    })
                    .catch(function(err) {
                        console.log('DELETE: could not delete about item. No id like = ' + req_json.about_id);
                    })
                })
                .catch(function(err) {
                    console.log('DELETE: could not delete about item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('DELETE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when deleting about item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

