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
            .success(function(res) {
                console.log('UPLOAD: json return: ' + JSON.stringify(res));

                var json = ({ pub_path: image_path
                            , largefilename: res.largefilename
                            , smallfilename: res.smallfilename });
                
                if (!res.result) {
                    window.alert(res.message);
                    return;
                }

                Login.update(scope, json, '/api/upload/')
                .success(function(encrypted_item) {
                    var auth_item;
                    var parsed = JSON.parse(encrypted_item);
                    if (typeof parsed.blob != 'undefined')
                        auth_item = Login.decrypt(encrypted_item);
                    else if (typeof parsed.blob == 'undefined') {
                        window.alert('Upload failed, not logged in?');
                        return;
                    }
                    if (typeof auth_item.result != 'undefined' && auth_item.result) {
                        window.alert('New image was successfully uploaded, remember to save article to keep changes');
                        var largefilepath = res.largefilename == null ? null : 'images/' + image_path + '/' + res.largefilename;
                        var smallfilepath = res.smallfilename == null ? null : 'images/' + image_path + '/small/' + res.smallfilename;
                        $scope.$emit(image_path + '-uploaded', { largefilepath: largefilepath
                                                , smallfilepath: smallfilepath });
                    } else 
                        window.alert('Could not save, something went wrong');
                })
            })
            .error(function(err) {
                console.log('UPLOAD: http post failed with err = ' + err);
            })
        }
    }
});
