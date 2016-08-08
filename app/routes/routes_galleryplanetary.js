var GalleryPlanetary      = require('../models/gallery-planetary');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in galleryplanetary (create and get all)
    // =============================================================================
    router.route('/galleryplanetary')

    // create galleryplanetary entry
    .post(function(req, res) {
        var json = ({ message: 'Successfully created galleryplanetary entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                                
                    var galleryplanetary = new GalleryPlanetary();
                    galleryplanetary.image_planetary_name         = req_json.image_planetary_name;
                    galleryplanetary.image_planetary_url          = req_json.image_planetary_url;
                    galleryplanetary.image_planetary_preview_url  = req_json.image_planetary_preview_url;
                    galleryplanetary.image_planetary_summary      = req_json.image_planetary_summary;
                    galleryplanetary.image_planetary_article      = req_json.image_planetary_article;
                    galleryplanetary.image_planetary_created_date = new Date();
                    galleryplanetary.image_planetary_edited_date  = null;
                    galleryplanetary.image_planetary_created_by   = loggedin.loggedin_user_email.split("@")[0]; 
                    galleryplanetary.image_planetary_edited_by    = null;

                    // save to db, and check for errors
                    galleryplanetary.save()
                    .then(function(success) {
                        console.log('CREATE: saved new galleryplanetary item');
                    })
                    .catch(function(err) {
                        console.log('CREATE: failed to save new galleryplanetary item');
                    })
                })
                .catch(function(err) {
                    console.log('CREATE: could not create galleryplanetary item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('CREATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when creating galleryplanetary item. Are you logged in?'});
        })
    })

    .get(function(req, res) {
        GalleryPlanetary.find()
        .then(function(galleryplanetary) {
            console.log('FIND: returning all galleryplanetary items descending');
            res.json(galleryplanetary);
        })
    })

    // routes that ends in galleryplanetary/reverse (geta all reverse)
    // =============================================================================
    router.route('/galleryplanetary/reverse')

    .get(function(req, res) {
        GalleryPlanetary.find().sort({_id : -1})
        .then(function(galleryplanetary_reverse) {
            console.log('FIND: returning all galleryplanetary items asending');
            res.json(galleryplanetary_reverse);
        })
    })

    // routes that ends in galleryplanetary/edit (update)
    // =============================================================================
    router.route('/galleryplanetary/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated galleryplanetary entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use galleryplanetary model to update requested galleryplanetary id
                    GalleryPlanetary.findById(req_json.galleryplanetary_id)
                    .then(function(galleryplanetary) {
                        // Update the galleryplanetary model, only update fields from req_json != null
                        galleryplanetary.image_planetary_name        = req_json.image_planetary_name        != null ? req_json.image_planetary_name : galleryplanetary.image_planetary_name;
                        galleryplanetary.image_planetary_url         = req_json.image_planetary_url         != null ? req_json.image_planetary_url : galleryplanetary.image_planetary_url;
                        galleryplanetary.image_planetary_preview_url = req_json.image_planetary_preview_url != null ? req_json.image_planetary_preview_url : galleryplanetary.image_planetary_preview_url;
                        galleryplanetary.image_planetary_summary     = req_json.image_planetary_summary     != null ? req_json.image_planetary_summary : galleryplanetary.image_planetary_summary;
                        galleryplanetary.image_planetary_article     = req_json.image_planetary_article     != null ? req_json.image_planetary_article : galleryplanetary.image_planetary_article;
                        galleryplanetary.image_planetary_created_date= galleryplanetary.image_planetary_created_date;
                        galleryplanetary.image_planetary_edited_date = new Date();
                        galleryplanetary.image_planetary_created_by  = galleryplanetary.image_planetary_created_by;
                        galleryplanetary.image_planetary_edited_by   = loggedin.loggedin_user_email.split("@")[0];

                        // Save to db
                        galleryplanetary.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated galleryplanetary item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated galleryplanetary item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update galleryplanetary item. No id like = ' + req_json.galleryplanetary_id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update galleryplanetary item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating galleryplanetary item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // routes that ends in galleryplanetary/delete (delete)
    // =============================================================================
    router.route('/galleryplanetary/delete/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated galleryplanetary entry' });
        console.log('DELETE: req.body = ' + req.body + '\nstringify = ' + JSON.stringify(req.body)); // TODO remove
        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // user id to remove entry in galleryplanetary
                    GalleryPlanetary.remove({_id: req_json.galleryplanetary_id})
                    .then(function(galleryplanetary) {
                        console.log('DELETE: successfully deleted galleryplanetary item.');
                    })
                    .catch(function(err) {
                        console.log('DELETE: could not delete galleryplanetary item. No id like = ' + req_json.galleryplanetary_id);
                    })
                })
                .catch(function(err) {
                    console.log('DELETE: could not delete galleryplanetary item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('DELETE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when deleting galleryplanetary item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

