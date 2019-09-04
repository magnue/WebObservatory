// public/js/services/WeatherService.js
angular.module('WeatherService', []).factory('Weather', function($http, Login) {

    return {
        // call to get all weather items
        get : function() {
            var asc = localStorage.getItem('asc');
            if (asc != null && asc != 'false' && asc)
                return $http.get('/api/weather/reverse').then(function(response) {
                    return response.data;
                });
            else
                return $http.get('/api/weather').then(function(response) {
                    return response.data;
                });
        },

        // call to POST and create a new weather item
        create : function(scope
                    , weather_article_header
                    , weather_article_paragraph
                    , weather_article_paragraph_image
                    , weather_toggle_image
                    , weather_image_left) {
            var json = ({ weather_article_header          : weather_article_header
                        , weather_article_paragraph       : weather_article_paragraph
                        , weather_article_paragraph_image : weather_article_paragraph_image
                        , weather_toggle_image            : weather_toggle_image
                        , weather_image_left              : weather_image_left });
            return Login.create(scope, json, '/api/weather')
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

        // call to PUT and update a weather item
        update : function(scope
                    , id
                    , weather_article_header
                    , weather_article_paragraph
                    , weather_article_paragraph_image
                    , weather_toggle_image
                    , weather_image_left) {
            var json = ({ weather_id                      : id
                        , weather_article_header          : weather_article_header
                        , weather_article_paragraph       : weather_article_paragraph
                        , weather_article_paragraph_image : weather_article_paragraph_image
                        , weather_toggle_image            : weather_toggle_image
                        , weather_image_left              : weather_image_left });

            return Login.update(scope, json, '/api/weather/edit')
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

        // call to DELETE a weather item
        delete : function(scope, id) {
            var json = ({ weather_id : id });
            return Login.delete(scope, json, '/api/weather/delete')
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
