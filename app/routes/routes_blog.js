var Blog           = require('../models/blog');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');

    module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in blog (create and get all)
    // =============================================================================
    router.route('/blog')

    // create blog entry
    .post(function(req, res) {
        var json = ({ message: 'Successfully created blog entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                                
                    var blog = new Blog();
                    blog.blog_article_header            = req_json.blog_article_header;
                    blog.blog_article_paragraph         = req_json.blog_article_paragraph;
                    blog.blog_article_paragraph_image   = req_json.blog_article_paragraph_image;
                    blog.blog_toggle_image              = req_json.blog_toggle_image;
                    blog.blog_image_left                = req_json.blog_image_left;
                    blog.blog_image_fit                 = false; // TODO: implement fit (span) in angular
                    blog.blog_created_date              = new Date();
                    blog.blog_edited_date               = null;
                    blog.blog_created_by                = loggedin.loggedin_user_email.split("@")[0]; 
                    blog.blog_edited_by                 = null;

                    // save to db, and check for errors
                    blog.save()
                    .then(function(success) {
                        console.log('CREATE: saved new blog item');
                    })
                    .catch(function(err) {
                        console.log('CREATE: failed to save new blog item');
                    })
                })
                .catch(function(err) {
                    console.log('CREATE: could not create blog item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('CREATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            res.json({ result: false, message: 'Could not find user when creating blog item. Are you logged in?'});
        })
    })

    .get(function(req, res) {
        Blog.find()
        .then(function(blog) {
            console.log('FIND: returning all blog items descending');
            res.json(blog);
        })
    })

    // routes that ends in blog/reverse (geta all reverse)
    // =============================================================================
    router.route('/blog/reverse')

    .get(function(req, res) {
        Blog.find().sort({_id : -1})
        .then(function(blog_reverse) {
            console.log('FIND: returning all blog items asending');
            res.json(blog_reverse);
        })
    })

    // routes that ends in blog/edit (update)
    // =============================================================================
    router.route('/blog/edit/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated blog entry' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // use blog model to update requested blog id
                    Blog.findById(req_json.blog_id)
                    .then(function(blog) {
                        // Update the blog model, only update fields from req_json != null
                        blog.blog_article_header          = req_json.blog_article_header          != null ? req_json.blog_article_header          : blog.blog_article_header;
                        blog.blog_article_paragraph       = req_json.blog_article_paragraph       != null ? req_json.blog_article_paragraph       : blog.blog_article_paragraph;
                        blog.blog_article_paragraph_image = req_json.blog_article_paragraph_image != null ? req_json.blog_article_paragraph_image : blog.blog_article_paragraph_image;
                        blog.blog_toggle_image            = req_json.blog_toggle_image            != null ? req_json.blog_toggle_image            : blog.blog_toggle_image;
                        blog.blog_image_left              = req_json.blog_image_left              != null ? req_json.blog_image_left              : blog.blog_image_left;
                        blog.blog_image_fit               = false; // TODO: implement fit (span) in angular
                        blog.blog_created_date            = blog.blog_created_date;
                        blog.blog_edited_date             = new Date();
                        blog.blog_created_by              = blog.blog_created_by;
                        blog.blog_edited_by               = loggedin.loggedin_user_email.split("@")[0];

                        // Save to db
                        blog.save()
                        .then(function(success) {
                            console.log('UPDATE: successfully updated blog item');
                        })
                        .catch(function(err) {
                            console.log('UPDATE: failed to save updated blog item');
                        })
                    })
                    .catch(function(err) {
                        console.log('UPDATE: could not update blog item. No id like = ' + req_json.blog_id);
                    })
                })
                .catch(function(err) {
                    console.log('UPDATE: could not update blog item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('UPDATE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when updating blog item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // routes that ends in blog/delete (delete)
    // =============================================================================
    router.route('/blog/delete/')

    .put(function(req, res) {
        var json = ({ message: 'Successfully updated blog entry' });
        console.log('DELETE: req.body = ' + req.body + '\nstringify = ' + JSON.stringify(req.body)); // TODO remove
        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    // user id to remove entry in blog
                    Blog.remove({_id: req_json.blog_id})
                    .then(function(blog) {
                        console.log('DELETE: successfully deleted blog item.');
                    })
                    .catch(function(err) {
                        console.log('DELETE: could not delete blog item. No id like = ' + req_json.blog_id);
                    })
                })
                .catch(function(err) {
                    console.log('DELETE: could not delete blog item. Auth failed for ' + req.body.login_user_sha256_salted_email);
                })
            }
        })
        .catch(function(err) {
            console.log('DELETE: could not find user = ' + req.body.login_user_sha256_salted_email);
            try {
                res.json({ result: false, message: 'Could not find user when deleting blog item. Are you logged in?'});
            } catch (err) {
                console.log('Headers allready sendt, likely session ended. err: ' + err);
            }
        })
    })

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

