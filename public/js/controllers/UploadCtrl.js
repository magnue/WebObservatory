// public/js/controllers/UploadCtrl.js
angular.module('UploadCtrl', [])
.controller('UploadController', function($scope, Upload) {
    $scope.largeFile = null;
    $scope.smallFile = null;

    $scope.$on('largeFileSelected', function(event, args) {
        $scope.$apply(function() {
            $scope.largeFile = args.largeFile;
        });
    });
    
    $scope.$on('smallFileSelected', function(event, args) {
        $scope.$apply(function() {
            $scope.smallFile = args.smallFile;
        });
    });

    $scope.save_files = function(image_path) {
        console.log('UPLOAD: largeFile = ' + $scope.largeFile + ', smallFile = ' + $scope.smallFile);
        Upload.upload($scope, image_path, $scope.largeFile, $scope.smallFile, $scope);
    };
})

.directive('largeFileUpload', function() {
    return {
        scope: true,
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                scope.$emit('largeFileSelected', { largeFile: event.target.files[0] });
            });
        }
    };
})

.directive('smallFileUpload', function() {
    return {
        scope: true,
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                scope.$emit('smallFileSelected', { smallFile: event.target.files[0] });
            });
        }
    };
});
