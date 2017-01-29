// public/js/directives/TagCodeTemplatesDirective.js
// http://stackoverflow.com/a/34701084
angular.module('TagCodeTemplatesDirective', [])
    .directive('tcHyperlink', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: { ref:'@' },
            template: '<a ng-href="{{ ref }}" target="_blanc" ng-transclude></a>'
        }
    })
    .directive('tcYoutube', function() {
        return {
            restrict: 'E',
            transclude: false,
            scope: { youid:'@' },
            template: '<iframe class="image fit" style="margin:10px 0 10px 0;" height="450"' 
                            + 'src="{{youid | trustAsResourceUrl}}"'
                            + 'frameborder="0" allowfullscreen>Loading youtube...</iframe>'
        }
    })
    .directive('tcPre', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<pre ng-transclude></pre>'
        }
    })
    .directive('tcCode', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<code ng-transclude></code>'
        }
    })
    .directive('tcBold', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<b ng-transclude></b>'
        }
    })      
    .directive('tcItalic', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<i ng-transclude></i>'
        }
    })      
    .directive('tcHighlight', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<span style="background-color:rgb(136,136,136); padding-left:8px; padding-right:8px;"'
                        + 'ng-transclude></span>'
        }
    })
    .directive('tcSup', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<sup ng-transclude></sup>'
        }
    })      
    .directive('tcSub', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<sub ng-transclude></sub>'
        }
    })      
    .directive('tcU', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<u ng-transclude></u>'
        }
    })      
    .directive('tcDel', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<del ng-transclude></del>'
        }
    })
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + val);
        };
    }])
