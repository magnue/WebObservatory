// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })

        // gallery-dso page
        .when('/gallery-dso', {
            templateUrl: 'views/gallery-dso.html',
            controller: 'GalleryDSOController'
        })

        // gallery-planetary page
        .when('/gallery-planetary', {
            templateUrl: 'views/gallery-planetary.html',
            controller: 'GalleryPlanetaryController'
        })

        // gallery-special page
        .when('/gallery-special', {
            templateUrl: 'views/gallery-special.html',
            controller: 'GallerySpecialController'
        })

        // about page
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        })

        // weather page
        .when('/weather', {
            templateUrl: 'views/weather.html',
            controller: 'WeatherController'
        })

        // blog page
        .when('/blog', {
            templateUrl: 'views/blog.html',
            controller: 'BlogController'
        })

        // login page
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        });

    $locationProvider.html5Mode(true);

}]);
