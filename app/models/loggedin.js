// app/models/loggedin.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var Forge           = require('node-forge');

var sha256  = Forge.md.sha256.create();
var buf     = Forge.random.getBytesSync(256);
sha256.update(buf);

var LoggedInSchema    = new Schema({
    loggedin_user_expires:                  Date,
    loggedin_user_login_active:             { type: Boolean, default: false },
    loggedin_user_is_admin:                 { type: Boolean, default: false },
    loggedin_user_email:                    String,
    loggedin_user_sha256_salted_email:      String,
    loggedin_user_sha256_salted_password:   String,
    loggedin_user_sha256_salt:              String,
    loggedin_user_random_sha256_salt:       { type: String, default: sha256.digest().toHex() }
});

module.exports = mongoose.model('LoggedIn', LoggedInSchema);
