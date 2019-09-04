// public/js/services/UploadService.js
angular.module('UploadService', []).factory('Upload', function($http, Login) {

    return {
        // Upload
        upload: function(scope, image_path, file_large, file_small, $scope) {
            $http({
                method: 'POST',
                url: '/api/upload/',
                headers: { 'Content-Type': undefined },
                transformRequest: function(data) {
                    var formData = new FormData();
                    data.largeFile = typeof data.largeFile == undefined ? null : data.largeFile;
                    data.smallFile = typeof data.largeFile == undefined ? null : data.smallFile;
                    formData.append('largeFile', data.largeFile);
                    formData.append('smallFile', data.smallFile);
                    return formData;
                },
                data: { largeFile: file_large, smallFile: file_small }
            })
            .then(function(res) {
                var data = res.data;
                console.log('UPLOAD: json return: ' + JSON.stringify(data));

                var json = ({ pub_path: image_path
                            , largefilename: data.largefilename
                            , smallfilename: data.smallfilename });

                if (!data.result) {
                    window.alert(data.message);
                    return;
                }

                Login.update(scope, json, '/api/upload/')
                .then(function(encrypted_item) {
                    var auth_item;
                    var parsed = JSON.parse(encrypted_item);
                    if (typeof parsed.blob != 'undefined')
                        var auth_item = Login.decrypt(encrypted_item);
                    else if (typeof parsed.blob == 'undefined') {
                        window.alert('Upload failed, not logged in?');
                        return;
                    }
                    if (typeof auth_item.result != 'undefined' && auth_item.result) {
                        window.alert('New image was successfully uploaded, remember to save article to keep changes');
                        var largefilepath = data.largefilename == null ? null : 'images/' + image_path + '/' + data.largefilename;
                        var smallfilepath = data.smallfilename == null ? null : 'images/' + image_path + '/small/' + data.smallfilename;
                        $scope.$emit(image_path + '-uploaded', { largefilepath: largefilepath
                                                , smallfilepath: smallfilepath });
                    } else
                        window.alert('Could not save, something went wrong');
                })
            },
            function(err) {
                console.log('UPLOAD: http post failed with err = ' + err);
            })
        }
    }
});
