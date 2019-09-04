// public/js/services/MainService.js
angular.module('MainService', []).factory('Main', function($http, Login) {

    return {
        // call to get all main items
        get : function() {
            return $http.get('/api/main').then(function(response) {
                return response.data;
            });
        },

        // call to PUT and update a main item
        update : function(scope, item_main) {
            var json = ({ item : item_main });

            return Login.update(scope, json, '/api/main/edit')
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

        // send contact form POST
        send_contact : function(contact_data) {
            return $http.post('/mail/contact', contact_data).then(function() {
                return;
            });
        }
    }
});
