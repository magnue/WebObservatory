// public/js/controllers/HomeCtrl.js
angular.module('HomeCtrl', []).controller('HomeController', function($scope, Main) {

    try {
        ga('set', 'page', '/');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    $scope.undo_tagline = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].header = item[0].header;
            $scope.item_main[0].tagline = item[0].tagline;
            $scope.item_main[0].name = item[0].name;
        })
        $scope.item_main[0].header = '';
        $scope.item_main[0].tagline = '';
        $scope.item_main[0].name = '';
    };

    $scope.save_tagline = function() {
        var header = document.getElementById('main_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var tagline = document.getElementById('main_tagline').innerHTML;
        tagline = String(tagline).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].header = header;
        $scope.item_main[0].tagline = tagline;

        var name = $scope.item_main[0].name;
        tagline = String(tagline).replace(/<[^>]+>/gm, '');

        $scope.about_header = 'About ' + name;
        $scope.weather_header = 'Weather @' + name;
        $scope.blog_header = name + '\'s Blog'; 
        $scope.login_header = 'Login and sign up on ' + name;
        $scope.sitename = name;
        localStorage.setItem('sitename', name);

        $scope.reload_head(true);

        Main.update($scope, $scope.item_main[0]);
    };

    $scope.toggle_modal = function() {
        $scope.modal_active = $scope.modal_active ? false : true;
    };

    $scope.$on('user-images-uploaded', function(event, args) {
        var i = $scope.page_edit_active;
        $scope.toggle_modal();
        switch (i) {
            case 0:
                $scope.item_main[0].gallery_dso_img = args.largefilepath;
                break;
            case 1:
                $scope.item_main[0].gallery_planetary_img = args.largefilepath;
                break;
            case 2:
                $scope.item_main[0].gallery_special_img = args.largefilepath;
                break;
            case 3:
                $scope.item_main[0].about_img = args.largefilepath;
                break;
            case 4:
                $scope.item_main[0].weather_img = args.largefilepath;
                break;
            case 5:
                $scope.item_main[0].blog_img = args.largefilepath;
                break;
        }
    });

    $scope.save_pages_img = function(i) {
        $scope.page_edit_active = i;
        $scope.toggle_modal();
    };

    $scope.save_pages = function(i) {
        var text = document.getElementById('pages_text_' + i).innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        switch (i) {
            case 0:
                $scope.item_main[0].gallery_dso_text = text;
                break;
            case 1:
                $scope.item_main[0].gallery_planetary_text = text;
                break;
            case 2:
                $scope.item_main[0].gallery_special_text = text;
                break;
            case 3:
                $scope.item_main[0].about_text = text;
                break;
            case 4:
                $scope.item_main[0].weather_text = text;
                break;
            case 5:
                $scope.item_main[0].blog_text = text;
                break;
        }

        Main.update($scope, $scope.item_main[0]);
    };
    
    $scope.toggle = function(i) {
        $scope.item_main[0].toggle[i] = $scope.item_main[0].toggle[i] ? false : true;
    };

})
