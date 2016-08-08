var Login           = require('../models/login');
var LoggedInModel   = require('../models/loggedin');
var LoggedIn        = require('../modules/module_loggedin');
var Forge           = require('node-forge');
    
module.exports = function(app, express) {

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();  // get an instance of the express Router

    // routes that ends in login
    // =============================================================================
    router.route('/login')

    // create login entry (user signup)
    .post(function(req, res) {

        Login.findOne({login_user_email : req.body.login_user_email})
        .then(function(login) {
            if (login && typeof login.login_user_email != 'undefined') { // user exists
                console.log('SIGNUP: signup failed. user allready exists.\nemail = ' + login.login_user_email);
                res.json({result: false, message: 'User with email = ' + login.login_user_email + ' exists in db'});
                return;
            }
            var login = new Login();
            login.login_user_email = req.body.login_user_email;

            // hash email
            var sha256 = Forge.md.sha256.create(); 
            sha256.update(req.body.login_user_email);
            var sha256_email = sha256.digest().toHex();
            
            // hash salt
            sha256 = Forge.md.sha256.create();
            var buf = Forge.random.getBytesSync(256);
            sha256.update(buf);
            login.login_user_sha256_salt = sha256.digest().toHex();

            // hash salted email
            sha256 = Forge.md.sha256.create();
            sha256.update(sha256_email + login.login_user_sha256_salt);
            login.login_user_sha256_salted_email = sha256.digest().toHex();

            // hash salted password
            sha256 = Forge.md.sha256.create(); 
            sha256.update(req.body.login_user_sha256_password + login.login_user_sha256_salt);
            login.login_user_sha256_salted_password = sha256.digest().toHex();

            // save to db, and check for errors
            login.save(function(err) {
                if (err) {
                    console.log('SIGNUP: signup recieved err when saving to db');
                    res.json({ result: false, message: 'Error: ' + err });
                } else {
                    console.log('SIGNUP: signup success!');
                    res.json({ result: true, message: 'Info successfully added to login' });
                }
            });
        })
        .error(function(err) {
            console.log('SIGNUP: error when checking db if user exists\nlogin_user_email = ' + req.body.login_user_email);
            res.json({result: false, message: 'Error when checking db if user exists: ' + req.body.login_user_email});
        })
    })

    // get
    .get(function(req, res) {
        // use login model to get all users. Only for admins
        Login.findOne({ login_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function (login) {

            if(login == null || typeof login == 'undefined') {
                console.log('GET: could not find user');
                res.json(JSON.stringify({ result: false, message: 'Could not find user, not responding to get' }));
                return;
            }
            else if (!login.login_user_is_admin) {
                console.log('GET: user is not admin. Cannot send userlist.');
                res.json(JSON.stringify({ result: false,  message: 'Nothing generic to get here. You will have to log in to get anything of use' }));
                return;
            }
            LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
            .then(function(loggedin) {
                
                req_json = LoggedIn.decrypt(req.body.blob, loggedin);
                var json;
                // Get all the users
                Login.find({})
                .then(function(allLogin) {
                    console.log('GET: successfully found all users'); 
                    json = allLogin;
                })
                .catch(function(err) {
                    console.log('GET: error in finding users');
                    json = ({ message: 'Failed to find users' });
                })

                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
            })
        })
        .catch(function(err) {
            console.log('GET: did not find salted email = ' + req.body.login_user_sha256_salted_email);
            res.json(JSON.stringify({ result: false, message: 'Failed to find user to get users' }));
        })
    })

    // routes that ends in login/auth
    // =============================================================================
    router.route('/login/auth')
    
    .post(function(req, res) {
        // Get login approved for login_email
        console.log('LOGIN: body for\nlogin_user_sha256_salted_email = ' + req.body.login_user_sha256_salted_email 
            + '\nlogin_user_email = ' + req.body.login_user_email 
            + '\nencrypted_data = ' + req.body.blob); // TODO remove

        var promise = '';
        var init = true;
        if (typeof req.body.login_user_email != 'undefined')
            promise = Login.findOne({ login_user_email : req.body.login_user_email });
        else if (typeof req.body.login_user_sha256_salted_email != 'undefined') {
            promise = Login.findOne({ login_user_sha256_salted_email : req.body.login_user_sha256_salted_email });
            init = false;
        } else {
            console.log('LOGIN: login email undefined');
            res.json({ result: false, message: 'Error user login with email undefined' });
            return;
        }
            
        promise.then(function(login) {
            if (login == null || typeof login == 'undefined')
            {
                if (init) {
                    console.log('LOGIN: did not find user\nemail = ' + req.body.login_user_email);
                    res.json({ result: false, message: 'Login, user with email ' + req.body.login_user_email + ' does not exist' });
                } else {
                    console.log('LOGIN: did not find user\nsalted email = ' + req.body.login_user_sha256_salted_email);
                    res.json(JSON.stringify({ result: false, message: 'Login, user with salted email ' + req.bodu.login_user_sha256_salted_email + ' does not exist' }));
                }
                return;
            }
            else if (!login.login_user_approved) 
            {
                console.log('LOGIN: user is not approved by admin.\nlogin_user_email = ' + login.login_user_email);
                res.json({ result: false, message: 'User avaiting administrator approval' });
                return;
            }
            else if (init && typeof req.body.login_user_token == 'undefined') 
            {
                // User is attempting initial login, send salt and random salt, expect salted sha256 password return
                LoggedIn.init(res
                    , login.login_user_email
                    , login.login_user_sha256_salted_email
                    , login.login_user_sha256_salted_password
                    , login.login_user_sha256_salt);
                return;
            } 
            LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
            .then(function(loggedin) {
                if (!init && typeof req.body.blob != 'undefined') 
                {
                    var req_json = LoggedIn.decrypt(req.body.blob, loggedin);
                    if (req_json == null) {
                        console.log('LOGIN: Decrypt returned null, error in login for user = ' + req.body.login_user_sha256_salted_email);
                        LoggedInModel.remove({ loggedin_user_sha256_salted_email : loggedin.loggedin_user_sha256_salted_email
                            , loggedin_user_login_active : false}, function(err) { });
                        res.json(JSON.stringify({ result: false, message: 'Could not decrypt data from user' }));
                        return;
                    }
                    // User is authenticated, and wants to log out
                    if (typeof req_json.logout_user != 'undefined') {
                        if (loggedin == null || typeof loggedin.loggedin_user_login_active == 'undefined') {
                            console.log('LOGOUT: could not log out, no such session');
                            res.json(JSON.stringify({ result: false, message: 'Could not log out. No session for user' }));
                        }
                        LoggedIn.logout(res
                        , req_json.login_user_token
                        , loggedin);
                    } else {
                        // User has recieved salt(s), and replies with salted sha256 token. If auth response with new random salt
                        var json = ({message: 'User = ' + loggedin.loggedin_user_sha256_salted_email + ' logged in.'});
                        LoggedIn.auth(res
                        , req_json.login_user_token
                        , loggedin, json, null);
                    }
                } else {
                    console.log('LOGIN: unknown error for\nlogin_user_sha256_salted_email = ' + req.body.login_user_sha256_salted_email);
                    res.json(JSON.stringify({ result: false, message: 'Something unknown went wrong when logging in' }));
                }
            })
        });
        promise.catch(function(err) {
            console.log('LOGIN: db returned error\nerr = ' + JSON.stringify(err) 
                + '\nwhen finding user with\nlogin_user_sha256_salted_email = ' + req.body.login_user_sha256_salted_email);
            if (init)
                res.json({ result: false, message: 'Login failed to find user with email ' + req.body.login_user_email });
            else
                res.json(JSON.stringify({ result: false, message: 'Login failed to find user with salted email ' + req.bodu.login_user_sha256_salted_email }));
        });
    })

    .put(function(req, res) {
        // use login model to update requested login id's password
        Login.findOne({ login_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function (login) {

            LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
            .then(function(loggedin) {
                
                req_json = LoggedIn.decrypt(req.body.blob, loggedin);
                if (req_json != null)
                {
                    if (login.login_user_is_admin && typeof req_json.update_user_id != 'undefined')
                    {
                        Login.findOne({_id : req_json.update_user_id})
                        .then(function(update) {
                            // Update the login model, only update fields from req.body != null
                            if (typeof req_json.update_user_email != 'undefined') { 
                                update.login_user_email = req_json.update_user_email;

                                var sha256 = Forge.md.sha256.create();
                                sha256.update(req_json.update_user_email);
                                var sha256_email = sha256.digest().toHex();

                                sha256 = Forge.md.sha256.create();
                                sha256.update(sha256_email + update.login_user_sha256_salt);
                                update.login_user_sha256_salted_email = sha256.digest().toHex();
                            } else {
                                update.login_user_email = update.login_user_email;
                                update.login_user_sha256_salted_email = update.login_user_sha256_salted_email;
                            }
                            update.login_user_approved   = req_json.login_user_approved != null ? req_json.login_user_approved : update.login_user_approved;
                            update.login_user_is_admin   = req_json.login_user_is_admin != null ? req_json.login_user_is_admin : update.login_user_is_admin;
                            var json = ({ message: 'Login updated for user id = ' + req_json.update_user_id });
                            LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                            .then(function(auth) {
                                // Save to db
                                login.save()
                                .then(function(loggedin) {
                                    console.log('UPDATE: password changed for user = ' + req.body.login_user_sha256_salted_email);
                                })
                                .catch(function(err) {
                                    console.log('UPDATE: failed to save updated password to db for salted email = ' + req.body.login_user_sha256_salted_email);
                                })
                            })
                        })
                        .catch(function(err) {
                            console.log('UPDATE: could not find user id = ' + req_json.update_user_id);
                            res.json(JSON.stringify({ result: false, message: 'Could not update user with id = ' + req_json.update_user_id + ' could not find one' }));
                            return;
                        })
                    } else {
                        if (req_json.update_user_new_salted_password != null)
                            login.login_user_sha256_salted_password = req_json.update_user_new_salted_password;
                        else
                            login.login_user_sha256_salted_password = login.login_user_sha256_salted_password;
                        
                        var json = ({ message: 'Login updated' });
                        try {
                            LoggedIn.auth(res, req_json.login_user_token, loggedin, json, req_json.update_user_new_salted_password)
                            .then(function(auth) {
                                // Save to db
                                login.save()
                                .then(function(loggedin) {
                                    console.log('UPDATE: password changed for user = ' + req.body.login_user_sha256_salted_email);
                                })
                                .catch(function(err) {
                                    console.log('UPDATE: failed to save updated password to db for salted email = ' + req.body.login_user_sha256_salted_email);
                                })
                            })
                        } catch (err) {
                            console.log('UPDATE: Try auth failed, no promise returned. Likely session ended');
                        }
                    }
                }
            })
        })
        .catch(function(err) {
            console.log('UPDATE: did not find salted email = ' + req.body.login_user_sha256_salted_email + ' to update password');
            res.json({ result: false, message: 'Failed to find user to update password' });
        })
    })

    .delete(function(req, res) {
        var json = ({ result: true, message: 'Successfully deleted entry from login' });

        LoggedInModel.findOne({ loggedin_user_sha256_salted_email : req.body.login_user_sha256_salted_email })
        .then(function(loggedin) {
            req_json = LoggedIn.decrypt(req.body.blob, loggedin);
            if (req_json != null)
            {
                LoggedIn.auth(res, req_json.login_user_token, loggedin, json, null)
                .then(function(auth) {
                    var promise;
                    if (req_json.update_user_id != null && loggedin.loggedin_user_is_admin)
                        promise = Login.remove({
                            _id : req_json.update_user_id
                        });
                    else
                        promise = Login.remove({
                            login_user_sha256_salted_email: req.body.login_user_sha256_salted_email
                        })
                    promise.then(function(login) {
                        console.log('DELETE: Successfully deleted entry from login');
                    })
                    promise.catch(function(err) {
                        console.log('DELETE: failed to remove user with salted email = ' + req.body.login_user_sha256_salted_email);
                    })
                })
            } else {
                console.log('DELETE: unknown error for\nlogin_user_sha256_salted_email = ' + req.body.login_user_sha256_salted_email);
                res.json({ result: false, message: 'No blob in json when updating user' });
            }
        })
    });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /user
    app.use('/user', router);
};

