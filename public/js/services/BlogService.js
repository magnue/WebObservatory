// public/js/services/BlogService.js
angular.module('BlogService', []).factory('Blog', function($http, Login) {

    return {
        // call to get all blog items
        get : function() {
            var asc = localStorage.getItem('asc');
            if (asc != null && asc != 'false' && asc)
                return $http.get('/api/blog/reverse').then(function(response) {
                    return response.data;
                });
            else
                return $http.get('/api/blog').then(function(response) {
                    return response.data;
                });
        },

        // call to POST and create a new blog item
        create : function(scope
                    , blog_article_header
                    , blog_article_paragraph
                    , blog_article_paragraph_image
                    , blog_toggle_image
                    , blog_image_left) {
            var json = ({ blog_article_header          : blog_article_header
                        , blog_article_paragraph       : blog_article_paragraph
                        , blog_article_paragraph_image : blog_article_paragraph_image
                        , blog_toggle_image            : blog_toggle_image
                        , blog_image_left              : blog_image_left });
            return Login.create(scope, json, '/api/blog')
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

        // call to PUT and update a blog item
        update : function(scope
                    , id
                    , blog_article_header
                    , blog_article_paragraph
                    , blog_article_paragraph_image
                    , blog_toggle_image
                    , blog_image_left) {
            var json = ({ blog_id                      : id
                        , blog_article_header          : blog_article_header
                        , blog_article_paragraph       : blog_article_paragraph
                        , blog_article_paragraph_image : blog_article_paragraph_image
                        , blog_toggle_image            : blog_toggle_image
                        , blog_image_left              : blog_image_left });

            return Login.update(scope, json, '/api/blog/edit')
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

        // call to DELETE a blog item
        delete : function(scope, id) {
            var json = ({ blog_id : id });
            return Login.delete(scope, json, '/api/blog/delete')
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
