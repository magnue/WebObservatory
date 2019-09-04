// public/js/services/GallerySpecialService.js
angular.module('GallerySpecialService', []).factory('GallerySpecial', function($http, Login) {

    return {
        // call to get all galleryspecial items
        get : function() {
            var asc = localStorage.getItem('asc');
            if (asc != null && asc != 'false' && asc)
                return $http.get('/api/galleryspecial/reverse').then(function(response) {
                    return response.data;
                });
            else
                return $http.get('/api/galleryspecial').then(function(response) {
                    return response.data;
                });
        },

        // call to POST and create a new galleryspecial item
        create : function(scope
                    , image_special_name
                    , image_special_url
                    , image_special_preview_url
                    , image_special_summary
                    , image_special_article) {
            var json = ({ image_special_name        : image_special_name
                        , image_special_url         : image_special_url
                        , image_special_preview_url : image_special_preview_url
                        , image_special_summary     : image_special_summary
                        , image_special_article     : image_special_article });

            return Login.create(scope, json, '/api/galleryspecial')
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

        // call to PUT and update a galleryspecial item
        update : function(scope
                    , id
                    , image_special_name
                    , image_special_url
                    , image_special_preview_url
                    , image_special_summary
                    , image_special_article) {
            var json = ({ galleryspecial_id         : id
                        , image_special_name        : image_special_name
                        , image_special_url         : image_special_url
                        , image_special_preview_url : image_special_preview_url
                        , image_special_summary     : image_special_summary
                        , image_special_article     : image_special_article });

            return Login.update(scope, json, '/api/galleryspecial/edit')
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

        // call to DELETE a galleryspecial item
        delete : function(scope, id) {
            var json = ({ galleryspecial_id : id });
            return Login.delete(scope, json, '/api/galleryspecial/delete')
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
