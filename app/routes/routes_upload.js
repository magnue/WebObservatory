var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');
var fs              = require('fs');

    module.exports = function(app, express, upload, tmp_folder, img_folder) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in upload (create and get all)
    // =============================================================================
    router.route('/upload')

    // create upload entry
    .post(function(req, res) {
        upload(req, res, function(err) {
            var largename = typeof req.files['largeFile'] == 'undefined' ? null : req.files['largeFile'][0].filename;
            var smallname = typeof req.files['smallFile'] == 'undefined' ? null : req.files['smallFile'][0].filename;
            if (!err)
                res.json({result: true
                        , message: 'successfully uploaded image to tmp'
                        , largefilename: largename
                        , smallfilename: smallname});
            else
                res.json({result: false
                        , message: 'error when uploading image to tmp'
                            + JSON.stringify(err).search('EACCES') != -1
                            ? ': directory access error'
                            : ': unknown error'});
        })
    })

    .put(function(req, res) {
        var json = ({ message: 'Successfully moved image(s) to public folder' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null && typeof req_json.largefilename != 'undefined' && typeof req_json.pub_path != 'undefined')
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use fs to move file to correct public subfolder.
                    // moving largeFile

                    var img_path = img_folder + req_json.pub_path + '/';
                    fs.rename(tmp_folder + req_json.largefilename, img_path + req_json.largefilename, function(err) {
                        if (err)
                            console.log('UPLOAD: could not move file to public, file = ' + req_json.largefilename);
                        else
                            console.log('UPLOAD: successfully moved ' + req_json.largefilename + ' to ' + img_path);
                    })
                    if (req_json.smallfilename != null) {
                        // moving smallFile
                        fs.rename(tmp_folder + req_json.smallfilename, img_path + 'small/' + req_json.smallfilename, function(err) {
                            if (err)
                                console.log('UPLOAD: could not move file to public, file = ' + req_json.smallfilename);
                            else
                                console.log('UPLOAD: successfully moved ' + req_json.smallfilename + ' to ' + img_path + 'small/');
                        })
                    }
                })
                .catch(function(err) {
                    console.log('UPLOAD: could not move file. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            } else {
                res.json(JSON.stringify({ result: 'false', message: 'wrong parameters' }));
                console.log('UPLOAD: move failed, req_json null or expected parameters undefined: ' + req_json);
            }
        })
        .catch(function(err) {
            console.log('UPLOAD: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when movinf file to public. Are you logged in?'});
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

