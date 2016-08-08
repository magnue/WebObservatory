var LoggedInModel   = require('../models/loggedin');
var Forge           = require('node-forge');
var Merge           = require('merge');

module.exports = {

    // LOGIC  FOR OUR LOGGED IN USERS
    // =============================================================================
    
    // Initialize authentication. Create LoggedIn model and send salt + random modifier
    init: function(res, login_user_email, login_user_sha256_salted_email, login_user_sha256_salted_password, login_user_sha256_salt) {
        LoggedInModel.findOne({ loggedin_user_email : login_user_email })
        .then(function(loggedin) {
            if ( loggedin != null && typeof loggedin.loggedin_user_sha256_salted_email != 'undefined' ) {
                if (loggedin.loggedin_user_expires.getTime() < new Date().getTime()) {
                    console.log('INIT: user session exists, but has expired.\nRemoving session on date =' + new Date());
                    LoggedInModel.remove({ loggedin_user_sha256_salted_email : login_user_sha256_salted_email }, function(err) { });
                } else if (loggedin.loggedin_user_login_active == true) {
                    console.log('INIT: Session for\n' + login_user_email + '\nexists, init failed');
                    res.json({ result: false, message: 'Session for user exists on server. Log out, before logging in'});
                    return;
                }
            }
            var loggedin = new LoggedInModel();
            loggedin.loggedin_user_email = login_user_email;
            loggedin.loggedin_user_sha256_salted_email = login_user_sha256_salted_email;
            loggedin.loggedin_user_expires = addHours(1);
            loggedin.loggedin_user_sha256_salted_password = login_user_sha256_salted_password;
            loggedin.loggedin_user_sha256_salt = login_user_sha256_salt;
            
            // create random salt
            var sha256  = Forge.md.sha256.create();
            var buf     = Forge.random.getBytesSync(256);
            sha256.update(buf);
            loggedin.loggedin_user_random_sha256_salt = sha256.digest().toHex();
            
            loggedin.save()
            .then(function(loggedin) {
                res_json = ({
                    result: true,
                    message: 'User with salted email = ' + login_user_sha256_salted_email + ' init auth ok',
                    loggedin_user_sha256_salt: loggedin.loggedin_user_sha256_salt
                    , loggedin_user_random_sha256_salt: loggedin.loggedin_user_random_sha256_salt 
                    });
                console.log('INIT: initial login for user\nlogin_user_sha256_salted_email = ' 
                    + login_user_sha256_salted_email + '\nres_json = ' + JSON.stringify(res_json));
                res.json(res_json);
                return;
            })
            .catch(function(err) {
                console.log('INIT: Recieved initial auth, but got err from loggedin.save to db. loggedin json =\n' + JSON.stringify(loggedin)
                    + ' res = ' + res + ' req = ' + req);
                res.json({ result: false, message: 'Session for ' + login_user_email + ' could not be saved'});
            }); 
        });
    },
    
    // Authentication. Compare recieved salted + modifed pasword, and those of LoggedIn model
    auth: function(res, login_user_token, loggedin, json, update_user_new_sha256_salted_password) {
        if (typeof loggedin == 'undefined' || loggedin == null) {
            console.log('AUTH: did not findOne.\nsalted email = ' + loggedin.loggedin_user_sha256_salted_email);
            
            res.json(JSON.stringify({ result: false
                                    , message: 'Did not find loggedin session for: ' + loggedin.loggedin_user_sha256_salted_email }));
            return;
        } else if (loggedin.loggedin_user_expires.getTime() < new Date().getTime()) {
            console.log('AUTH: user session expired\nms = ' + loggedin.loggedin_user_expires.getTime() 
                    + ' Date = ' + loggedin.loggedin_user_expires 
                    + ' .\nTime now is ms = ' + new Date().getTime() + ' Date = ' + new Date());

            res.json(JSON.stringify({ result: false
                                    , message: 'Loggedin session expired ms = ' 
                                    + loggedin.loggedin_user_expires.getTime() 
                                    + ' Date = ' + loggedin.loggedin_user_expires 
                + ' Time now is ms = ' + new Date().getTime() + ' Date = ' + new Date() + ' for user: ' + loggedin.loggedin_user_sha256_salted_email }));
            LoggedInModel.remove({ loggedin_user_sha256_salted_email : loggedin.loggedin_user_sha256_salted_email }, function(err) { });
            return;
        }

        var sha256 = Forge.md.sha256.create(); 
        sha256.update(loggedin.loggedin_user_sha256_salted_password + loggedin.loggedin_user_random_sha256_salt);
        console.log('AUTH:\nsalty = ' + loggedin.loggedin_user_sha256_salted_password + '\nrand = ' + loggedin.loggedin_user_random_sha256_salt); // TODO remove
        var salted_check = sha256.digest().toHex();
        if (login_user_token == salted_check) {
            console.log('AUTH: success with sha256 = ' + salted_check);
            
            sha256 = Forge.md.sha256.create(); 
            var bytes = Forge.random.getBytesSync(128);
            sha256.update(Forge.util.bytesToHex(bytes));

            loggedin.loggedin_user_random_sha256_salt       = sha256.digest().toHex();
            loggedin.loggedin_user_sha256_salt              = loggedin.loggedin_user_sha256_salt;
            if (typeof update_user_new_sha256_salted_password == 'undefined' || update_user_new_sha256_salted_password == null)
                loggedin.loggedin_user_sha256_salted_password   = loggedin.loggedin_user_sha256_salted_password;
            else
                loggedin.loggedin_user_sha256_salted_password   = update_user_new_sha256_salted_password;
            loggedin.loggedin_user_sha256_salted_email      = loggedin.loggedin_user_sha256_salted_email;
            loggedin.loggedin_user_login_active             = true;
            loggedin.loggedin_user_expires                  = addHours(1);

            return loggedin.save()
            .then(function(success) {
                res_json = ({ 
                    result: true, 
                    loggedin_user_random_sha256_salt: success.loggedin_user_random_sha256_salt });

                var merged_json = res_json;
                if (json != null)
                    merged_json = json_merge(json, res_json);
                
                console.log('AUTH: successfully saved new random salt. Authentication completed\nAUTH: Sending return = ' + JSON.stringify(merged_json));
                encrypt(res, merged_json, loggedin);
            })
            .catch(function(err) {
                console.log('AUTH: despite successfull auth, saving new random salt failed. Must decline auth on error = ' + JSON.stringify(err));
                LoggedInModel.remove({ loggedin_user_sha256_salted_email : loggedin.loggedin_user_sha256_salted_email }, function(err) { });
                res.json(JSON.stringify({ 
                    result: false, 
                    message: 'Login failed for user: ' + loggedin.loggedin_user_sha256_salted_email + ', despite correct token. Could not save new random salt to session.' }));
            })
        } else {
            LoggedInModel.remove({ loggedin_user_sha256_salted_email : loggedin.loggedin_user_sha256_salted_email }, function(err) { });
            console.log('AUTH: salty check did not match?\nlogin_user_token = ' + login_user_token + '\nsalted_check = ' + salted_check);
            res.json(JSON.stringify({ result: false, message: 'User: ' + loggedin.loggedin_user_sha256_salted_email + ' login failed. Unknown token: ' + login_user_token }));
        }
    },

    // Logout. Compare recieved salted + modifed pasword, and those of LoggedIn model, and only log out authenticate user session
    logout: function(res, login_user_token, loggedin) {
        if (typeof loggedin == 'undefined' || loggedin == null) {
            console.log('LOGOUT: did not findOne.\nsalted email = ' + loggedin.loggedin_user_sha256_salted_email);
            res.json(JSON.stringify({ result: false, message: 'Did not find loggedin session for: ' + loggedin.loggedin_user_sha256_salted_email }));
            return;
        }

        var sha256 = Forge.md.sha256.create(); 
        sha256.update(loggedin.loggedin_user_sha256_salted_password + loggedin.loggedin_user_random_sha256_salt);
        var salted_check = sha256.digest().toHex();
        if (login_user_token == salted_check) {
            LoggedInModel.remove({ loggedin_user_sha256_salted_email : loggedin.loggedin_user_sha256_salted_email })
            .then(function(logout) {
                console.log('LOGOUT: user with email ' + loggedin.loggedin_user_email + ' was logged out');
                res.json(JSON.stringify({ result: true, message: 'You were logged out' }));
            })
            .catch(function(err) {
                console.log('LOGOUT: failed with err = ' + JSON.stringify(err));
                res.json(JSON.stringify({ result: false, message: 'Could not log out.. err = ' + JSON.stringify(err) }));
            })
        } else {
            console.log('LOGOUT: auth failed, cannot log out user = ' + loggedin.loggedin_user_email 
                + '\nToken = ' + login_user_token + '\nSalty check = ' + salted_check);
            res.json(JSON.stringify({ result: false, message: 'Could not log out. This is not your session. Log out where you are logged in' }));
        }
    },

    // Expose function decrypt
    decrypt : function(encrypted, loggedin) {
        return decrypt(encrypted, loggedin);
    },
};

// http://stackoverflow.com/a/1051641
function addHours(h) {
    var date = new Date();
    date.setHours(date.getHours() + h);
    return date;
}

// Return a combined json objects
function json_merge(json1, json2) {
    console.log('\nJSON 1: ' + JSON.stringify(json1));
    console.log('\nJSON 2: ' + JSON.stringify(json2));
    var merged = Merge(json1, json2);
    console.log('\nJSON M: ' + JSON.stringify(merged));
    return merged;
}

// Must be called after AUTH success, or we will lookup old random salt
function encrypt(res, inn, loggedin) {
    // creating a random Initialization Vector. NOT A KEY, will be sendt publicy
    // Read about IV an KEY http://crypto.stackexchange.com/questions/3965/what-is-the-main-difference-between-a-key-an-iv-and-a-nonce
    var sha256 = Forge.md.sha256.create();
    sha256.update(loggedin.loggedin_user_sha256_salted_email + loggedin.loggedin_user_random_sha256_salt);
    var iv = Forge.util.hexToBytes(sha256.digest().toHex());
    // Key is 32 bytes, AES-256 will be used. Salted password is NEVER sendt on network
    var key = Forge.util.hexToBytes(loggedin.loggedin_user_sha256_salted_password);

    var str = JSON.stringify(inn);

    // Encrypt (inn), gathered from forge https://github.com/digitalbazaar/forge/#cipher
    var cipher = Forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(Forge.util.createBuffer(str));
    cipher.finish();
    
    var encrypted = cipher.output;
    var iv_out = Forge.util.bytesToHex(iv);
    var blob_out = Forge.util.bytesToHex(encrypted);
    var encrypted_json = {
        ivector: iv_out
        , blob: blob_out
        };
    
    console.log('\nENCRYPT: sending data = ' + JSON.stringify(encrypted_json));
    
    res.json(JSON.stringify(encrypted_json));
}

// Must be called before AUTH success, or we will lookup new random salt
function decrypt(encrypted, loggedin) {
    // recreating a random Initialization Vector, same as sendt to client in encrypt. NOT A KEY.
    var sha256 = Forge.md.sha256.create();
    sha256.update(loggedin.loggedin_user_sha256_salted_email + loggedin.loggedin_user_random_sha256_salt);
    var iv = Forge.util.hexToBytes(sha256.digest().toHex());
    // Key is 32 bytes, AES-256 will be used. Salted password is NEVER sendt on network
    var key = Forge.util.hexToBytes(loggedin.loggedin_user_sha256_salted_password);

    var data = Forge.util.createBuffer();
    data.putBytes(Forge.util.hexToBytes(encrypted));

    // Decrypt (encrypted), gathered from forge https://github.com/digitalbazaar/forge/#cipher
    var decipher = Forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(data);
    decipher.finish();
    var decrypted = decipher.output;
    var json;
    try {
        json = JSON.parse(decrypted);
        console.log('\nDECRYPT: ' + JSON.stringify(json, null, 4));
    } catch (err) {
        console.log('\nDECRYPT: err = ' + err);
        json = null;
    }

    return json;
}


