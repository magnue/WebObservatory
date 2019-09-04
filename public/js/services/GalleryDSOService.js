// public/js/services/GalleryDSOService.js
angular.module('GalleryDSOService', []).factory('GalleryDSO', function($http, Login) {

    return {
        // call to get all gallerydso items
        get : function() {
            var asc = localStorage.getItem('asc');
            if (asc != null && asc != 'false' && asc)
                return $http.get('/api/gallerydso/reverse').then(function(response) {
                    return response.data;
                });
            else
                return $http.get('/api/gallerydso').then(function(response) {
                    return response.data;
                });
        },

        // call to POST and create a new gallerydso item
        create : function(scope
                    , image_dso_name
                    , image_dso_url
                    , image_dso_preview_url
                    , image_dso_summary
                    , image_dso_article) {
            var json = ({ image_dso_name        : image_dso_name
                        , image_dso_url         : image_dso_url
                        , image_dso_preview_url : image_dso_preview_url
                        , image_dso_summary     : image_dso_summary
                        , image_dso_article     : image_dso_article });

            return Login.create(scope, json, '/api/gallerydso')
            .then(function(encrypted_item) {
                var auth_item;
                var parsed = JSON.parse(encrypted_item);
                if (typeof parsed.blob != 'undefined')
                    auth_item = Login.decrypt(encrypted_item);
                else if (typeof parsed.blob == 'undefined') {
                    window.alert('Save failed, session ended?');
                    return;
                }
                if (typeof auth_item.result != 'undefined' && auth_item.result) {
                    window.alert('New article successfully saved');
                } else
                    window.alert('Could not save, something went wrong');
            })
        },

        // call to PUT and update a gallerydso item
        update : function(scope
                    , id
                    , image_dso_name
                    , image_dso_url
                    , image_dso_preview_url
                    , image_dso_summary
                    , image_dso_article) {
            var json = ({ gallerydso_id         : id
                        , image_dso_name        : image_dso_name
                        , image_dso_url         : image_dso_url
                        , image_dso_preview_url : image_dso_preview_url
                        , image_dso_summary     : image_dso_summary
                        , image_dso_article     : image_dso_article });

            return Login.update(scope, json, '/api/gallerydso/edit')
            .then(function(encrypted_item) {
                var auth_item;
                var parsed = JSON.parse(encrypted_item);
                if (typeof parsed.blob != 'undefined')
                    auth_item = Login.decrypt(encrypted_item);
                else if (typeof parsed.blob == 'undefined') {
                    window.alert('Save failed, session ended?');
                    return;
                }
                if (typeof auth_item.result != 'undefined' && auth_item.result) {
                    window.alert('Update successfully saved');
                } else
                    window.alert('Could not save, something went wrong');
            })
        },

        // call to DELETE a gallerydso item
        delete : function(scope, id) {
            var json = ({ gallerydso_id : id });
            return Login.delete(scope, json, '/api/gallerydso/delete')
            .then(function(encrypted_item) {
                var auth_item;
                var parsed = JSON.parse(encrypted_item);
                if (typeof parsed.blob != 'undefined')
                    auth_item = Login.decrypt(encrypted_item);
                else if (typeof parsed.blob == 'undefined') {
                    window.alert('Delete failed, session ended?');
                    return;
                }
                if (typeof auth_item.result != 'undefined' && auth_item.result) {
                    window.alert('Article successfully deleted');
                } else
                    window.alert('Could not delete, something went wrong');
            })
        }
    }

});
