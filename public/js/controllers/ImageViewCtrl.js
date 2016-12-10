// public/js/controllers/ImageViewCtrl.js
angular.module('ImageViewCtrl', []).controller('ImageViewController', function($scope, $window, $location) {
    
    $window.document.title = 'Image view - ' + localStorage.getItem('sitename');

    // Initiate the image name string
    $scope.image = '';

    try {
        ga('set', 'page', '/image-view');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    // Read the query string, and get image to view
    // Also remove all instances of http
    var queryString = $location.search();
    angular.forEach(queryString, function(key, item) {
        if(key) {
            var noExtern = item.replace(/http/g, '');
            $scope.image = noExtern;
        }
    });

    // Get the name of the image, ie. everything after (File-)
    var n = $scope.image.indexOf("File-");
    var imageName = $scope.image.substring(n+5);

    // Registrer anaytics view event on image
    try {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Images',
            eventAction: 'View',
            eventLabel: imageName,
        });
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    // For future download button, registrer analytics event download
    $scope.onDownload = function() {
        try {
            ga('send', {
                hitType: 'event',
                eventCategory: 'Images',
                eventAction: 'Download',
                eventLabel: imageName,
            });
        } catch (err) {
            ; // nothing to do here, simply means analytics.js is not in use
        }
    };

});
