// public/js/services/LoginService.js
angular.module('LoginService', []).factory('Login', ['$http', function($http) {

    var user_email = localStorage.getItem('email');
    var salted_email = localStorage.getItem('salted_email');
    var salted_password = localStorage.getItem('salted_password');
    var salt = localStorage.getItem('salt');
    var random_salt = localStorage.getItem('random');;

    return {
        // call to POST and create a new login item
        signup : function(login_email, login_password) {

            var md = forge.md.sha256.create();
            md.update(login_password);
            var login_sha256_password = md.digest().toHex();
            var signup_data = JSON.stringify({
                login_user_email: login_email
                , login_user_sha256_password: login_sha256_password
                });
            return $http.post('/user/login', signup_data).then(function(response) {
                return response.data;
            });
        },

        // initialize auth.
        init : function(scope, login_email, login_password) {
            user_email = login_email;
            var json = JSON.stringify({
                login_user_email:login_email
                });
            return $http.post('/user/login/auth', json)
            .then(function(result) {
                var auth_item = result.data;
                if (typeof auth_item.result != 'undefined' && auth_item.result) {
                    // Hash password
                    var md = forge.md.sha256.create();
                    md.update(login_password);
                    var login_sha256_password = md.digest().toHex();

                    // Salt password
                    var md = forge.md.sha256.create();
                    md.update(login_sha256_password + auth_item.loggedin_user_sha256_salt);
                    salted_password = md.digest().toHex();
                    localStorage.setItem('salted_password', salted_password);

                    // Hash email
                    var md = forge.md.sha256.create();
                    md.update(login_email);
                    var login_sha256_email = md.digest().toHex();

                    // Salt email
                    var md = forge.md.sha256.create();
                    md.update(login_sha256_email + auth_item.loggedin_user_sha256_salt);
                    salted_email = md.digest().toHex();
                    localStorage.setItem('salted_email',salted_email);

                    random_salt = auth_item.loggedin_user_random_sha256_salt;
                    localStorage.setItem('random',random_salt);

                    salt = auth_item.loggedin_user_sha256_salt;
                    localStorage.setItem('salt',salt);
                    return auth_item;
                } else {
                    cleanup(scope);
                    console.log('INIT: auth_item.result != true. auth_item = ' + JSON.stringify(auth_item));
                }
            },
            function(err) {
                cleanup(scope);
                console.log('INIT: http post failed with err = ' + JSON.stringify(err));
            })
        },

        // export AUTH use by all controllers to post, put, and delete
        auth : function(scope, json, route, type) {
            return auth(scope, json, route, type, false);
        },

        // call to POST a auth item
        create : function(scope, json, route) {
            return auth(scope, json, route, 'post', false);
        },

        // call to PUT a auth item
        update : function(scope, json, route) {
            return auth(scope, json, route, 'put', false);
        },

        // call to DELETE a auth item
        delete : function(scope, json, route) {
            return auth(scope, json, route, 'put', false);
        },

        logout : function(scope) {
            var json = ({ logout_user: true });

            return auth(null, json, null, 'post', true)
            .then(function(logout_item) {
                var item = JSON.parse(logout_item.data);
                if (typeof item.result != 'undefined' && item.result) {
                    user_email = null;
                    localStorage.removeItem('email');
                    cleanup(scope);
                } else {
                    console.log('LOGOUT: logout failed, json = ' + JSON.stringify(item));
                    cleanup(scope);
                }
            },
            function(err) {
                console.log('LOGOUT: logout failed, json = ' + JSON.stringify(err));
                cleanup(scope);
            });
        },

        // call to PUT and update a login password
        update_password : function(scope, login_new_password, current_password) {
            // Create new salted password from form
            var md = forge.md.sha256.create();
            md.update(login_new_password);
            var hashed_password = md.digest().toHex();
            var md = forge.md.sha256.create();
            md.update(hashed_password + localStorage.getItem('salt'));
            var salted_hash = md.digest().toHex();

            // Create current salted password from form
            var md = forge.md.sha256.create();
            md.update(current_password);
            var current_hashed_password = md.digest().toHex();
            var md = forge.md.sha256.create();
            md.update(current_hashed_password + localStorage.getItem('salt'));
            current_salted_password = md.digest().toHex();

            localStorage.setItem('salted_password', current_salted_password);

            var res_json = ({
                update_user_new_salted_password: salted_hash
            });

            return auth(null, res_json, null, 'put', true)
            .then(function(result) {
                encrypted_item = result.data;
                var auth_item;
                var parsed = JSON.parse(encrypted_item);
                if (typeof parsed.blob != 'undefined') {
                    salted_password = salted_hash;
                    localStorage.setItem('salted_password', salted_password);
                    auth_item = decrypt(encrypted_item);
                } else {
                    cleanup(scope);
                    console.log('AUTH: returned no blob when changing password. returned_item = ' + JSON.stringify(encrypted_item));
                    return;
                }
                if (auth_item != null && typeof auth_item.result != 'undefined' && auth_item.result) {
                    random_salt = auth_item.loggedin_user_random_sha256_salt;
                    localStorage.setItem('random',random_salt);
                    return encrypted_item;
                }
            },
            function(err) {
                console.log('AUTH: failed when changing password');
                cleanup(scope);
            });
        },

        // Export cleanup
        cleanup : function() {
            cleanup(null);
        },

        // Export json_merge
        json_merge : function(json1, json2) {
            return json_merge(json1, json2);
        },

        // Export decrypt
        decrypt : function(encrypted) {
            return decrypt(encrypted);
        },

        // Export encrypt
        encrypt : function(json) {
            return encrypt(json);
        },

        // http://stackoverflow.com/a/7844412
        checkPwd : function(str) {
            if (str == null) {
                window.alert('No password');
                return false;
            } if (str.length < 6) {
                window.alert('Password too short');
                return false;
            } else if (str.length > 255) {
                window.alert('Password too long');
                return false;
            } else if (str.search(/\d/) == -1) {
                window.alert('Password must contain a minimum of one number');
                return false;
            } else if (str.search(/[A-Z]/) == -1) {
                window.alert('Password must contain a minimum of one upper case letter');
                return false;
            } else if (str.search(/[a-z]/) == -1) {
                window.alert('Password must contain a minimum of one lower case letter');
                return false;
            } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\"]/) != -1) {
                window.alert('Password can only contain:\nupper / lower case letters\nnumbers\nand !@#$%^&*\\_+]/');
                return false;
            }
            return true;
        },

        // http://stackoverflow.com/a/46181
        checkMail : function(str) {
            if (str == null) {
                window.alert('No email');
                return false;
            }
            var mail_regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!mail_regex.test(str)) {
                window.alert('Email adress does not have a valid format');
                return false;
            }
            return true;
        }
    };

    // authenticate
    function auth(scope, json, route, type, no_action) {
        var md = forge.md.sha256.create();
        md.update(localStorage.getItem('salted_password') + random_salt);
        var res_json = ({
            login_user_sha256_salted_email: salted_email
            , login_user_token: md.digest().toHex()
        });
        var merged_json = res_json;
        if (json != null)
            merged_json = json_merge(json, res_json);
        var encrypted_json = encrypt(merged_json);

        if (route == null)
            route = '/user/login/auth';

        var promise;
        if (type == 'post')
            promise = $http.post(route, encrypted_json);
        else if (type == 'put')
            promise = $http.put(route, encrypted_json);

        if (no_action)
            return promise;
        else {
            return promise
            .then(function(result) {
                var encrypted_item = result.data;
                var auth_item;
                var parsed = JSON.parse(encrypted_item);
                if (typeof parsed.blob != 'undefined')
                    auth_item = decrypt(encrypted_item);
                else {
                    cleanup(scope);
                    console.log('AUTH: returned no blob. returned_item = ' + JSON.stringify(encrypted_item));
                    return;
                }

                if (auth_item != null && typeof auth_item.result != 'undefined' && auth_item.result) {
                    random_salt = auth_item.loggedin_user_random_sha256_salt;
                    localStorage.setItem('random',random_salt);
                    localStorage.setItem('loggedin', true);
                    localStorage.setItem('email',user_email);
                    localStorage.setItem('user',user_email.split("@")[0]);
                } else {
                    cleanup(scope);
                    console.log('AUTH: returned result undefined or false, or failed to decrypt. auth_item = ' + auth_item);
                }
                return encrypted_item;
            },
            function(err) {
                cleanup(scope);
                console.log('AUTH: http post failed with err = ' + err);
            })
        }
    }

    function cleanup(scope) {
        salted_email = null;
        localStorage.removeItem('salted_email');
        salted_password = null;
        localStorage.removeItem('salted_password');
        salt = null;
        localStorage.removeItem('salt');
        random_salt = null;
        localStorage.removeItem('random');
        localStorage.removeItem('loggedin');
        localStorage.removeItem('user');
        localStorage.removeItem('head');

        if (scope) {
            scope.password = null;
            scope.user = null;
            scope.head = null;
            scope.loggedin = null;
            scope.logged_in = 'Log in';
            scope.reload_head(false);
            scope.alternate();
        }
    }

    // Return a combined json object
    function json_merge(json1, json2) {
        var merged = merge(json1, json2);
        return merged;
    }

    function encrypt(json) {
        // creating a random Initialization Vector. NOT A KEY, will be sendt publicy
        // Read about IV an KEY http://crypto.stackexchange.com/questions/3965/what-is-the-main-difference-between-a-key-an-iv-and-a-nonce
        var sha256 = forge.md.sha256.create();
        sha256.update(salted_email + random_salt);
        var iv = forge.util.hexToBytes(sha256.digest().toHex());
        // Key is 32 bytes, AES-256 will be used. Salted password is NEVER sendt on network
        var key = forge.util.hexToBytes(salted_password);

        var str = JSON.stringify(json);

        // Encrypt (json), gathered from forge https://github.com/digitalbazaar/forge/#cipher
        var cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(str));
        cipher.finish();

        var encrypted = cipher.output;
        var iv_out = forge.util.bytesToHex(iv);
        var blob_out = forge.util.bytesToHex(encrypted);
        var encrypted_json = {
            login_user_sha256_salted_email: salted_email
            , blob: blob_out};

        return JSON.stringify(encrypted_json);
    }

    function decrypt(encrypted) {
        // Key is 32 bytes, AES-256 will be used. Salted password is NEVER sendt on network
        var key = forge.util.hexToBytes(salted_password);

        var obj = JSON.parse(encrypted);
        var data = forge.util.createBuffer();
        var iv = forge.util.createBuffer();

        data.putBytes(forge.util.hexToBytes(obj.blob));
        iv.putBytes(forge.util.hexToBytes(obj.ivector));

        // Decrypt (encrypted), gathered from forge https://github.com/digitalbazaar/forge/#cipher
        var decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: iv});
        decipher.update(data);
        decipher.finish();
        var decrypted = decipher.output;
        var json;
        try {
            json = JSON.parse(decrypted);
        } catch (err) {
            json = null;
        }

        return json;
    }
}]);
