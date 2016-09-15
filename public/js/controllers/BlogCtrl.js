// public/js/controllers/BlogCtrl.js
angular.module('BlogCtrl', []).controller('BlogController', function($scope, Blog, Main) {

    $scope.item_blog = [];
    $scope.asc = localStorage.getItem('asc');

    try {
        ga('set', 'page', '/blog');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    Blog.get().success(function(item)
    {
        $scope.item_blog = item;

        var article_range = [];
        var article_paragraph_range = [];

        for (var i = 0; i < item.length; i++)
        {
            article_range.push(i);
            article_paragraph_range[i] = [];
            for (var j = 0; j < item[i].blog_toggle_image.length; j++)
                article_paragraph_range[i].push(j);
        }
        $scope.blog_article_range = article_range;
        $scope.blog_article_paragraph_range = article_paragraph_range;
    });

    $scope.toggle_asc = function() {
        $scope.asc = localStorage.getItem('asc');
        if ($scope.asc != null && $scope.asc != 'false' && $scope.asc) {
            $scope.asc = false;
            localStorage.setItem('asc', false);
        } else {
            $scope.asc = true;
            localStorage.setItem('asc', true);
        }

        var item = $scope.item_blog;
        $scope.item_blog = null;
        $scope.item_blog = item.slice().reverse();

        var article_paragraph_range = [];
        j = $scope.blog_article_paragraph_range.length - 1;

        for (i = 0; i < $scope.blog_article_paragraph_range.length; i++) {
            article_paragraph_range[i] = [];
            for (s = 0; s < $scope.blog_article_paragraph_range[j].length; s++)
                article_paragraph_range[i].push(s);
            j--;
        }
        $scope.blog_article_paragraph_range = article_paragraph_range;
    };

    $scope.undo_summary_blog = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].blog_summary_header = item[0].blog_summary_header;
            $scope.item_main[0].blog_summary_text = item[0].blog_summary_text;
        })
        $scope.item_main[0].blog_summary_header = '';
        $scope.item_main[0].blog_summary_text = '';
    };

    $scope.save_summary_blog = function() {
        var header = document.getElementById('blog_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('blog_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].blog_summary_header = header;
        $scope.item_main[0].blog_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_blog = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].blog_sentence = item[0].blog_sentence;
        })
        $scope.item_main[0].blog_sentence = '';
    };

    $scope.save_sentence_blog = function() {
        var sentence = document.getElementById('blog_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].blog_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_article = function(i) {
        Blog.get().success(function(item) {
            $scope.item_blog = null;
            $scope.item_blog = item;

            var article_range = [];
            var article_paragraph_range = [];
            for (i = 0; i < item.length; i++)
            {
                article_range.push(i);
                article_paragraph_range[i] = [];
                for (j = 0; j < item[i].blog_toggle_image.length; j++)
                    article_paragraph_range[i].push(j);
            }
            $scope.blog_article_range = article_range;
            $scope.blog_article_paragraph_range = article_paragraph_range;
        })
        $scope.item_blog[i] = null;
    };

    $scope.add_paragraph = function(i, j) {
        $scope.item_blog[i].blog_article_paragraph.push('New paragraph');
        $scope.item_blog[i].blog_article_paragraph_image.push('null');
        $scope.item_blog[i].blog_toggle_image.push(false);
        $scope.item_blog[i].blog_image_left.push(true);
        $scope.blog_article_paragraph_range[i].push(j + 1);
    }

    $scope.add_article = function(i) {
        var default_json = ({_id                       : null
                        , blog_article_header          : 'New article'
                        , blog_article_paragraph       : ['New paragraph']
                        , blog_article_paragraph_image : ['null']
                        , blog_toggle_image            : [false]
                        , blog_image_left              : [true]});

        $scope.item_blog.push(default_json);
        if (typeof i != 'undefined') {
            $scope.blog_article_range.push(i + 1);
            $scope.blog_article_paragraph_range[i + 1] = [];
            $scope.blog_article_paragraph_range[i + 1].push(0);
        } else {
            $scope.blog_article_range = [];
            $scope.blog_article_paragraph_range = [];
            $scope.blog_article_paragraph_range[0] = [];
            $scope.blog_article_range.push(0);
            $scope.blog_article_paragraph_range[0].push(0);
        }
    }

    $scope.save_article = function(i) {
        var article_header = document.getElementById('article_header_' + i).innerHTML;
        article_header = String(article_header).replace(/<[^>]+>/gm, '');
        var article_paragraph = [];
        var article_paragraph_image = [];
        var article_toggle_image = [];
        var article_toggle_left = [];

        var s = 0;
        var j = 0;
        for (; j < $scope.item_blog[i].blog_article_paragraph.length; j++) {
            var paragraph = document.getElementById('article_paragraph_' + i + '_' + j).innerHTML;
            paragraph = String(paragraph).replace(/<[^>]+>/gm, '');
            if (paragraph != '') {
                article_paragraph[s] = paragraph;
                article_paragraph_image[s] = $scope.item_blog[i].blog_article_paragraph_image[j];
                article_toggle_image[s] = $scope.item_blog[i].blog_toggle_image[j];
                article_toggle_left[s] = $scope.item_blog[i].blog_image_left[j];
                s++;
            }
        }
        if (s != j) {
            var json = ({_id                       : $scope.item_blog[i]._id
                    , blog_article_header          : article_header
                    , blog_article_paragraph       : article_paragraph
                    , blog_article_paragraph_image : article_paragraph_image
                    , blog_toggle_image            : article_toggle_image
                    , blog_image_left              : article_toggle_left});

            $scope.item_blog[i] = null;
            var article_paragraph_range = [];
            for (r = 0; r < article_toggle_image.length; r++)
                article_paragraph_range.push(r);
            $scope.blog_article_paragraph_range[i] = article_paragraph_range;
            $scope.item_blog[i] = json;
        }

        if ($scope.item_blog[i]._id == null) {
            Blog.create($scope
                    , article_header
                    , article_paragraph
                    , article_paragraph_image
                    , article_toggle_image
                    , article_toggle_left)
            .success(function(success) {
                $scope.undo_article(i);
            });
        } else {
            Blog.update($scope
                    , $scope.item_blog[i]._id
                    , article_header
                    , article_paragraph
                    , article_paragraph_image
                    , article_toggle_image
                    , article_toggle_left);
        }
    }

    $scope.delete_article = function(i) {
        Blog.delete($scope, $scope.item_blog[i]._id)
        .success(function(success) {
            $scope.undo_article(i);
        })
    }

    $scope.$on('article-blog-uploaded', function(event, args) {
        var i = $scope.article_modal_active;
        var j = $scope.paragraph_modal_active;
        $scope.toggle_modal(-1, -1);
        $scope.item_blog[i].blog_article_paragraph_image[j] = args.largefilepath;
    });

    $scope.toggle_modal = function(i, j) {
        $scope.article_modal_active = i;
        $scope.paragraph_modal_active = j;
        $scope.modal_active = $scope.modal_active ? false : true;
    };

    $scope.toggle_image = function(i,j) {
        $scope.item_blog[i].blog_toggle_image[j] = $scope.item_blog[i].blog_toggle_image[j] ? false : true;
    }

    $scope.image_toggle_left = function(i,j) {
        $scope.item_blog[i].blog_image_left[j] = $scope.item_blog[i].blog_image_left[j] ? false : true;
    }
});
