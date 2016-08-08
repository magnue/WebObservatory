var GalleryDSO      = require('../models/gallery-dso');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in gallerydso (create and get all)
    // =============================================================================
    router.route('/gallerydso')

    // create gallerydso entry
    .post(function(req, res) {
        var json = ({ message: 'Successfully created gallerydso entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                                
                    var gallerydso = new GalleryDSO();
                    gallerydso.image_dso_name         = req_json.image_dso_name;
                    gallerydso.image_dso_url          = req_json.image_dso_url;
                    gallerydso.image_dso_preview_url  = req_json.image_dso_preview_url;
                    gallerydso.image_dso_summary      = req_json.image_dso_summary;
                    gallerydso.image_dso_article      = req_json.image_dso_article;
                    gallerydso.image_dso_created_date = new Date();
                    gallerydso.image_dso_edited_date  = null;
                    gallerydso.image_dso_created_by   = loggedin.loggedin_user_email.split("@")[0]; 
                    gallerydso.image_dso_edited_by    = null;

                    // save to db, and check for errors
                    gallerydso.save()
                    .then(function(success) {
                        console.log('CREATE: saved new gallerydso item');
                    })
                    .catch(function(err) {
                        console.log('CREATE: failed to save new gallerydso item');
                    })
                })
                .catch(function(err) {
                    console.log('CREATE: could not create gallerydso item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('CREATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when creating gallerydso item. Are you logged in?'});
        })
    })

    .get(function(req, res) {
        GalleryDSO.find()
        .then(function(gallerydso) {
            console.log('FIND: returning all gallerydso items descending');
            res.json(gallerydso);
        })
    })

    // routes that ends in gallerydso/reverse (geta all reverse)
    // =============================================================================
    router.route('/gallerydso/reverse')

    .get(function(req, res) {
        GalleryDSO.find().sort({_id : -1})
        .then(function(gallerydso_reverse) {
            console.log('FIND: returning all gallerydso items asending');
            res.json(gallerydso_reverse);
        })
    })

    // routes that ends in gallerydso/edit (update)
    // =============================================================================
    router.route('/gallerydso/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated gallerydso entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use gallerydso model to update requested gallerydso id
                    GalleryDSO.findById(req_json.gallerydso_id)
                    .then(function(gallerydso) {
                        // Update the gallerydso model, only update fields from req_json != null
                        gallerydso.image_dso_name        = req_json.image_dso_name        != null ? req_json.image_dso_name : gallerydso.image_dso_name;
                        gallerydso.image_dso_url         = req_json.image_dso_url         != null ? req_json.image_dso_url : gallerydso.image_dso_url;
                        gallerydso.image_dso_preview_url = req_json.image_dso_preview_url != null ? req_json.image_dso_preview_url : gallerydso.image_dso_preview_url;
                        gallerydso.image_dso_summary     = req_json.image_dso_summary     != null ? req_json.image_dso_summary : gallerydso.image_dso_summary;
                        gallerydso.image_dso_article     = req_json.image_dso_article     != null ? req_json.image_dso_article : gallerydso.image_dso_article;
                        gallerydso.image_dso_created_date= gallerydso.image_dso_created_date;
                        gallerydso.image_dso_edited_date = new Date();
                        gallerydso.image_dso_created_by  = gallerydso.image_dso_created_by;
                        gallerydso.image_dso_edited_by   = loggedin.loggedin_user_email.split("@")[0];

                        // Save to db
                        gallerydso.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated gallerydso item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated gallerydso item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update gallerydso item. No id like = ' + req_json.gallerydso_id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update gallerydso item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating gallerydso item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // routes that ends in gallerydso/delete (delete)
    // =============================================================================
    router.route('/gallerydso/delete/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated gallerydso entry' });
        console.log('DELETE: req.body = ' + req.body + '\nstringify = ' + JSON.stringify(req.body)); // TODO remove
        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // user id to remove entry in gallerydso
                    GalleryDSO.remove({_id: req_json.gallerydso_id})
                    .then(function(gallerydso) {
                        console.log('DELETE: successfully deleted gallerydso item.');
                    })
                    .catch(function(err) {
                        console.log('DELETE: could not delete gallerydso item. No id like = ' + req_json.gallerydso_id);
                    })
                })
                .catch(function(err) {
                    console.log('DELETE: could not delete gallerydso item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('DELETE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when deleting gallerydso item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

