var GallerySpecial      = require('../models/gallery-special');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in galleryspecial (create and get all)
    // =============================================================================
    router.route('/galleryspecial')

    // create galleryspecial entry
    .post(function(req, res) {
        var json = ({ message: 'Successfully created galleryspecial entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                                
                    var galleryspecial = new GallerySpecial();
                    galleryspecial.image_special_name         = req_json.image_special_name;
                    galleryspecial.image_special_url          = req_json.image_special_url;
                    galleryspecial.image_special_preview_url  = req_json.image_special_preview_url;
                    galleryspecial.image_special_summary      = req_json.image_special_summary;
                    galleryspecial.image_special_article      = req_json.image_special_article;
                    galleryspecial.image_special_created_date = new Date();
                    galleryspecial.image_special_edited_date  = null;
                    galleryspecial.image_special_created_by   = loggedin.loggedin_user_email.split("@")[0]; 
                    galleryspecial.image_special_edited_by    = null;

                    // save to db, and check for errors
                    galleryspecial.save()
                    .then(function(success) {
                        console.log('CREATE: saved new galleryspecial item');
                    })
                    .catch(function(err) {
                        console.log('CREATE: failed to save new galleryspecial item');
                    })
                })
                .catch(function(err) {
                    console.log('CREATE: could not create galleryspecial item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('CREATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when creating galleryspecial item. Are you logged in?'});
        })
    })

    .get(function(req, res) {
        GallerySpecial.find()
        .then(function(galleryspecial) {
            console.log('FIND: returning all galleryspecial items descending');
            res.json(galleryspecial);
        })
    })

    // routes that ends in galleryspecial/reverse (geta all reverse)
    // =============================================================================
    router.route('/galleryspecial/reverse')

    .get(function(req, res) {
        GallerySpecial.find().sort({_id : -1})
        .then(function(galleryspecial_reverse) {
            console.log('FIND: returning all galleryspecial items asending');
            res.json(galleryspecial_reverse);
        })
    })

    // routes that ends in galleryspecial/edit (update)
    // =============================================================================
    router.route('/galleryspecial/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated galleryspecial entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use galleryspecial model to update requested galleryspecial id
                    GallerySpecial.findById(req_json.galleryspecial_id)
                    .then(function(galleryspecial) {
                        // Update the galleryspecial model, only update fields from req_json != null
                        galleryspecial.image_special_name        = req_json.image_special_name        != null ? req_json.image_special_name : galleryspecial.image_special_name;
                        galleryspecial.image_special_url         = req_json.image_special_url         != null ? req_json.image_special_url : galleryspecial.image_special_url;
                        galleryspecial.image_special_preview_url = req_json.image_special_preview_url != null ? req_json.image_special_preview_url : galleryspecial.image_special_preview_url;
                        galleryspecial.image_special_summary     = req_json.image_special_summary     != null ? req_json.image_special_summary : galleryspecial.image_special_summary;
                        galleryspecial.image_special_article     = req_json.image_special_article     != null ? req_json.image_special_article : galleryspecial.image_special_article;
                        galleryspecial.image_special_created_date= galleryspecial.image_special_created_date;
                        galleryspecial.image_special_edited_date = new Date();
                        galleryspecial.image_special_created_by  = galleryspecial.image_special_created_by;
                        galleryspecial.image_special_edited_by   = loggedin.loggedin_user_email.split("@")[0];

                        // Save to db
                        galleryspecial.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated galleryspecial item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated galleryspecial item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update galleryspecial item. No id like = ' + req_json.galleryspecial_id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update galleryspecial item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating galleryspecial item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // routes that ends in galleryspecial/delete (delete)
    // =============================================================================
    router.route('/galleryspecial/delete/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated galleryspecial entry' });
        console.log('DELETE: req.body = ' + req.body + '\nstringify = ' + JSON.stringify(req.body)); // TODO remove
        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // user id to remove entry in galleryspecial
                    GallerySpecial.remove({_id: req_json.galleryspecial_id})
                    .then(function(galleryspecial) {
                        console.log('DELETE: successfully deleted galleryspecial item.');
                    })
                    .catch(function(err) {
                        console.log('DELETE: could not delete galleryspecial item. No id like = ' + req_json.galleryspecial_id);
                    })
                })
                .catch(function(err) {
                    console.log('DELETE: could not delete galleryspecial item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('DELETE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when deleting galleryspecial item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

