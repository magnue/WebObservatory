// public/js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginController', function($scope, Login, Main) {

    $scope.test = $scope.user + ' Logged in';
    $scope.user = localStorage.getItem('user');

    try {
        ga('set', 'page', '/login');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    $scope.send_signup = function() {
        if (!Login.checkPwd($scope.password) || !Login.checkMail($scope.email))
            return;

        Login.signup($scope.email, $scope.password)
        .success(function(auth_item) {
            if (typeof auth_item.result != 'undefined' && auth_item.result)
                $scope.signed_up = $scope.email + ' signed up';
            else
                $scope.signed_up = 'Signup failed';
        })
        .error(function(err) {
            $cope.signed_up = 'Signup failed';
        });
    },

    $scope.send_login = function() {
        if (!Login.checkPwd($scope.password) || !Login.checkMail($scope.email))
            return;

        var promise = Login.init($scope, $scope.email, $scope.password);
        promise.success(function(auth_item) {
            if (typeof auth_item.result != 'undefined' && auth_item.result)
                $scope.auth();
            else if (typeof auth_item.result != 'undefined' && !auth_item.result) {
                $scope.logged_in = 'Login failed';
                window.alert('Login failed: ' + auth_item.message);
            } else {
                $scope.logged_in = 'Login failed';
            }
        });
        promise.error(function(err) {
            $scope.logged_in = 'Login failed';
        });
    },

    $scope.send_logout = function() {
        Login.logout($scope).success(function(logout_item) {
            item = JSON.parse(logout_item);
            if (typeof item.result != 'undefined' && item.result) {
                $scope.email = null;
                $scope.logged_in = 'Log in';
            }
        })
    },

    $scope.send_change_password = function() {
        if ($scope.loggedin && !$scope.change_password) {
            $scope.change_password = true;
        } else if ($scope.loggedin && $scope.change_password && $scope.new_password != null && $scope.password != null) {
            
            Login.update_password($scope, $scope.new_password, $scope.password)
            .success(function(encrypted_item) {
                var auth_item;
                var parsed = JSON.parse(encrypted_item);
                if (typeof parsed.blob != 'undefined')
                    auth_item = Login.decrypt(encrypted_item);
                else if (typeof parsed.blob == 'undefined' || auth_item == null) {
                    window.alert('Could not change password. Session ended?');
                    $scope.test = 'Not logged in';
                    return;
                }

                if (typeof auth_item.result != 'undefined' && auth_item.result) {
                    window.alert('Password, successfully changed');
                } else {
                    window.alert('Could not change password, something went wrong');
                }
                $scope.change_password = null;
                $scope.new_password = null;
            })
        } else
            window.alert('You must be logged in, enter new and current password, to change password');
    },

    $scope.send_test = function() {
        var promise = Login.auth($scope, null, null, 'post');
        promise.success(function(encrypted_item) {
            var auth_item;
            var parsed = JSON.parse(encrypted_item);
            if (typeof parsed.blob != 'undefined')
                auth_item = Login.decrypt(encrypted_item);
            else if (typeof parsed.blob == 'undefined' || auth_item == null) {
                window.alert('Could not authenticate. Session Ended?');
                $scope.test = 'Not logged in';
                return;
            }
            if (typeof auth_item.result != 'undefined' && auth_item.result)
                $scope.test = $scope.user + ' Logged in';
            else {
                $scope.test = 'Not logged in';
            }
        });
        promise.error(function(err) {
            $scope.test = 'Not logged in';
        });
    },

    $scope.auth = function() {
        var promise = Login.auth($scope, null, null, 'post');
        promise.success(function(encrypted_item) {
            var auth_item;
            var parsed = JSON.parse(encrypted_item);
            if (typeof parsed.blob != 'undefined')
                auth_item = Login.decrypt(encrypted_item);
            else if (typeof parsed.blob == 'undefined' || auth_item == null) {
                $scope.logged_in = 'Login failed';
                return;
            }

            if (typeof auth_item.result != 'undefined' && auth_item.result) {
                $scope.logged_in = 'Logged inn';
                $scope.user = localStorage.getItem('user');
                $scope.test = $scope.user + ' Logged in';
                $scope.loggedin = true;
                localStorage.setItem('loggedin', true);
                $scope.reload_head(true);
                $scope.alternate();
                $scope.password = null;
            } else {
                $scope.logged_in = 'Loggin failed';
            }
        });
        promise.error(function(err) {
            $scope.logged_in = 'Login failed';
        });
    }

    $scope.undo_summary_login = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].login_summary_header = item[0].login_summary_header;
            $scope.item_main[0].login_summary_text = item[0].login_summary_text;
        })
        $scope.item_main[0].login_summary_header = '';
        $scope.item_main[0].login_summary_text = '';
    };

    $scope.save_summary_login = function() {
        var header = document.getElementById('login_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('login_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].login_summary_header = header;
        $scope.item_main[0].login_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_login = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].login_sentence = item[0].login_sentence;
        })
        $scope.item_main[0].login_sentence = '';
    };

    $scope.save_sentence_login = function() {
        var sentence = document.getElementById('login_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].login_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };
});
