// public/js/services/AboutService.js
angular.module('AboutService', []).factory('About', function($http, Login) {

    return {
        // call to get all about items
        get : function() {
            var asc = localStorage.getItem('asc');
            if (asc != null && asc != 'false' && asc)
                return $http.get('/api/about/reverse').then(function(response) {
                    return response.data;
                });
            else
                return $http.get('/api/about').then(function(response) {
                    return response.data;
                 });
        },

        // call to POST and create a new about item
        create : function(scope
                    , about_article_header
                    , about_article_paragraph
                    , about_article_paragraph_image
                    , about_toggle_image
                    , about_image_left) {
            var json = ({ about_article_header          : about_article_header
                        , about_article_paragraph       : about_article_paragraph
                        , about_article_paragraph_image : about_article_paragraph_image
                        , about_toggle_image            : about_toggle_image
                        , about_image_left              : about_image_left });
            return Login.create(scope, json, '/api/about')
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

        // call to PUT and update a about item
        update : function(scope
                    , id
                    , about_article_header
                    , about_article_paragraph
                    , about_article_paragraph_image
                    , about_toggle_image
                    , about_image_left) {
            var json = ({ about_id                      : id
                        , about_article_header          : about_article_header
                        , about_article_paragraph       : about_article_paragraph
                        , about_article_paragraph_image : about_article_paragraph_image
                        , about_toggle_image            : about_toggle_image
                        , about_image_left              : about_image_left });

            return Login.update(scope, json, '/api/about/edit')
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

        // call to DELETE a about item
        delete : function(scope, id) {
            var json = ({ about_id : id });
            return Login.delete(scope, json, '/api/about/delete')
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
