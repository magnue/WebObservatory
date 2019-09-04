// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', function($scope, Main, Login) {

    $scope.loggedin = localStorage.getItem('loggedin');
    $scope.email = localStorage.getItem('email');
    $scope.user = localStorage.getItem('user');
    $scope.head = localStorage.getItem('head');

    $scope.item_main = [];
    Main.get().then(function(item)
    {
        $scope.item_main = item;
        $scope.alternate();
        $scope.about_header = 'About ' + item[0].name;
        $scope.weather_header = 'Weather @ ' + item[0].name;
        $scope.blog_header = item[0].name + '\'s Blog';
        $scope.login_header = 'Login and sign up on ' + item[0].name;
        $scope.sitename = item[0].name;
        localStorage.setItem('sitename', item[0].name);

        $scope.yr_place_name = item[0].yr_place.replace(/^.*[\\\/]/, '');
        $scope.yr_html_url = {src:"http://www.yr.no/place/" + item[0].yr_place + "/external_box_hour_by_hour.html"};

        // Fixes google indexing toggled off pages that are hidden in menu using ng-show
        $scope.gallerydso_url = item[0].toggle[0] ? '/gallery-dso' : '/404.html';
        $scope.galleryplanetary_url = item[0].toggle[1] ? '/gallery-planetary' : '/404.html';
        $scope.galleryspecial_url = item[0].toggle[2] ? '/gallery-special' : '/404.html';
        $scope.about_url = item[0].toggle[3] ? '/about' : '/404.html';
        $scope.weather_url = item[0].toggle[4] ? '/weather' : '/404.html';
        $scope.blog_url = item[0].toggle[5] ? '/blog' : '/404.html';

    });

    $scope.undo_footer_msg = function() {
        Main.get().then(function(item) {
            $scope.item_main[0].footer_header = item[0].footer_header;
            $scope.item_main[0].footer_text = item[0].footer_text;
        })
        $scope.item_main[0].footer_header = '';
        $scope.item_main[0].footer_text = '';
    };

    $scope.save_footer_msg = function() {
        var header = document.getElementById('footer_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('footer_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].footer_header = header;
        $scope.item_main[0].footer_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_footer = function() {
        Main.get().then(function(item) {
            $scope.item_main[0].footer_yourname      = item[0].footer_yourname;
            $scope.item_main[0].footer_youradress    = item[0].footer_youradress;
            $scope.item_main[0].footer_yourzip       = item[0].footer_yourzip;
            $scope.item_main[0].footer_yourstate     = item[0].footer_yourstate;
            $scope.item_main[0].footer_yourcountry   = item[0].footer_yourcountry;
            $scope.item_main[0].footer_yourphonearea = item[0].footer_yourphonearea;
            $scope.item_main[0].footer_yourphone     = item[0].footer_yourphone;
            $scope.item_main[0].footer_youremail     = item[0].footer_youremail;
            $scope.item_main[0].footer_yourfb        = item[0].footer_yourfb;
            $scope.item_main[0].footer_yourtwitter   = item[0].footer_yourtwitter;
            $scope.item_main[0].footer_yourinstagram = item[0].footer_yourinstagram;
            $scope.item_main[0].footer_yourflickr    = item[0].footer_yourflickr;
            $scope.item_main[0].footer_yourgithub    = item[0].footer_yourgithub;
        })
    };

    $scope.save_footer = function() {
        var yourname      = document.getElementById('yourname').innerHTML;
        var youradress    = document.getElementById('youradress').innerHTML;
        var yourzip       = document.getElementById('yourzip').innerHTML;
        var yourstate     = document.getElementById('yourstate').innerHTML;
        var yourcountry   = document.getElementById('yourcountry').innerHTML;
        var yourphonearea = document.getElementById('yourphonearea').innerHTML;
        var yourphone     = document.getElementById('yourphone').innerHTML;
        var youremail     = document.getElementById('youremail').innerHTML;
        var yourfb        = document.getElementById('yourfb').innerHTML;
        var yourtwitter   = document.getElementById('yourtwitter').innerHTML;
        var yourinstagram = document.getElementById('yourinstagram').innerHTML;
        var yourflickr    = document.getElementById('yourflickr').innerHTML;
        var yourgithub    = document.getElementById('yourgithub').innerHTML;

        yourname      = String(yourname).replace(/<[^>]+>/gm, '');
        youradress    = String(youradress).replace(/<[^>]+>/gm, '');
        yourzip       = String(yourzip).replace(/<[^>]+>/gm, '');
        yourstate     = String(yourstate).replace(/<[^>]+>/gm, '');
        yourcountry   = String(yourcountry).replace(/<[^>]+>/gm, '');
        yourphonearea = String(yourphonearea).replace(/<[^>]+>/gm, '');
        yourphone     = String(yourphone).replace(/<[^>]+>/gm, '');
        youremail     = String(youremail).replace(/<[^>]+>/gm, '');
        yourfb        = String(yourfb).replace(/<[^>]+>/gm, '');
        yourtwitter   = String(yourtwitter).replace(/<[^>]+>/gm, '');
        yourinstagram = String(yourinstagram).replace(/<[^>]+>/gm, '');
        yourflickr    = String(yourflickr).replace(/<[^>]+>/gm, '');
        yourgithub    = String(yourgithub).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].footer_yourname      = yourname;
        $scope.item_main[0].footer_youradress    = youradress;
        $scope.item_main[0].footer_yourzip       = yourzip;
        $scope.item_main[0].footer_yourstate     = yourstate;
        $scope.item_main[0].footer_yourcountry   = yourcountry;
        $scope.item_main[0].footer_yourphonearea = yourphonearea;
        $scope.item_main[0].footer_yourphone     = yourphone;
        $scope.item_main[0].footer_youremail     = youremail;
        $scope.item_main[0].footer_yourfb        = yourfb;
        $scope.item_main[0].footer_yourtwitter   = yourtwitter;
        $scope.item_main[0].footer_yourinstagram = yourinstagram;
        $scope.item_main[0].footer_yourflickr    = yourflickr;
        $scope.item_main[0].footer_yourgithub    = yourgithub;

        Main.update($scope, $scope.item_main[0]);
    };

    $scope.toggle_menu = function() {
        $scope.menu_active = $scope.menu_active ? false : true;
    };

    $scope.alternate = function() {
        var alt_bool = [];
        $scope.alt = [];
        if ($scope.alt.length == 0) {
            for (n = 0; n < 5; n++)
                if (n % 2 == 0)
                   alt_bool[n] = true;
                else alt_bool[n] = false;

            if (!$scope.loggedin) {
                for (i = 0; i < 6; i++) {
                    if ($scope.item_main[0].toggle[i] == false)
                        for (j = i; j < 5; j++)
                            alt_bool[j] = alt_bool[j] ? false : true;
                }
            }

            for (r = 0; r < 5; r++)
                $scope.alt[r] = 'wrapper ' + (alt_bool[r] ? 'alt ' : '') + 'spotlight style' + (r+2);
        }
    };

    $scope.reload_head = function(add_user) {
        if (add_user) {
            $scope.loggedin = localStorage.getItem('loggedin');
            $scope.user = localStorage.getItem('user');
            $scope.sitename = localStorage.getItem('sitename');
            $scope.head = $scope.user + ' @ ' + $scope.sitename;
            localStorage.setItem('head', $scope.head);
        } else {
            $scope.loggedin = localStorage.getItem('loggedin');
            $scope.head = $scope.sitename;
            localStorage.setItem('head', $scope.head);
        }
    };

    $scope.send_contact = function() {
        console.log('LOGGING FORM DATA', $scope.name, $scope.email, $scope.message);
        var mail_regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var has_space_regex = /\s/g;

        if (!has_space_regex.test($scope.name))
            window.alert('Not a valid name, need atleast First and Last name.\nPlease review input.');
        else if (!mail_regex.test($scope.email))
            window.alert('Email adress not valid.\nPlease review input.');
        else if (typeof $scope.message === "undefined" || $scope.message.length < 2)
            window.alert('Message to short.\nPlese review input.');
        else if (!(typeof $scope.mail_sent == "undefined"))
            window.alert('Hold on! You just sent a message');
        else
        {
            var name = String($scope.name).replace(/<[^>]+>/gm, '');
            var message = String($scope.message).replace(/<[^>]+>/gm, '');
            var contact_data = JSON.stringify({name: name, email: $scope.email, message: message});
            Main.send_contact(contact_data).then(function()
            {
                $scope.mail_sent = "Message sent";
            });
        }
    };

})
