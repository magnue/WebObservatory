// public/js/services/GalleryPlanetaryService.js
angular.module('GalleryPlanetaryService', []).factory('GalleryPlanetary', function($http, Login) {

    return {
        // call to get all galleryplanetary items
        get : function() {
            var asc = localStorage.getItem('asc');
            if (asc != null && asc != 'false' && asc)
                return $http.get('/api/galleryplanetary/reverse');
            else
                return $http.get('/api/galleryplanetary');
        },

        // call to POST and create a new galleryplanetary item
        create : function(scope
                    , image_planetary_name
                    , image_planetary_url
                    , image_planetary_preview_url
                    , image_planetary_summary
                    , image_planetary_article) {
            var json = ({ image_planetary_name        : image_planetary_name
                        , image_planetary_url         : image_planetary_url
                        , image_planetary_preview_url : image_planetary_preview_url
                        , image_planetary_summary     : image_planetary_summary
                        , image_planetary_article     : image_planetary_article });

            return Login.create(scope, json, '/api/galleryplanetary')
            .success(function(encrypted_item) {
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

        // call to PUT and update a galleryplanetary item
        update : function(scope
                    , id
                    , image_planetary_name
                    , image_planetary_url
                    , image_planetary_preview_url
                    , image_planetary_summary
                    , image_planetary_article) {
            var json = ({ galleryplanetary_id         : id
                        , image_planetary_name        : image_planetary_name
                        , image_planetary_url         : image_planetary_url
                        , image_planetary_preview_url : image_planetary_preview_url
                        , image_planetary_summary     : image_planetary_summary
                        , image_planetary_article     : image_planetary_article });
            
            return Login.update(scope, json, '/api/galleryplanetary/edit')
            .success(function(encrypted_item) {
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

        // call to DELETE a galleryplanetary item
        delete : function(scope, id) {
            var json = ({ galleryplanetary_id : id });
            return Login.delete(scope, json, '/api/galleryplanetary/delete')
            .success(function(encrypted_item) {
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
