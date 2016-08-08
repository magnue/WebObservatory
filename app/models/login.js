// app/models/login.js
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var Forge           = require('node-forge');

var sha256  = Forge.md.sha256.create();
var bytes     = Forge.random.getBytesSync(128);
sha256.update(Forge.util.bytesToHex(bytes));

var LoginSchema    = new Schema({
    login_user_email:                   String,
    login_user_sha256_salted_email:     String,
    login_user_sha256_salted_password:  String,
    login_user_sha256_salt:             { type: String, default: sha256.digest().toHex() },
    login_user_approved:                { type: Boolean, default: false },
    login_user_is_admin:                { type: Boolean, default: false }
});

module.exports = mongoose.model('Login', LoginSchema);
