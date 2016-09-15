// public/js/controllers/AboutCtrl.js
angular.module('AboutCtrl', []).controller('AboutController', function($scope, About, Main) {

    $scope.item_about = [];
    $scope.asc = localStorage.getItem('asc');

    try {
        ga('set', 'page', '/about');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }
    
    About.get().success(function(item)
    {
        $scope.item_about = item;

        var article_range = [];
        var article_paragraph_range = [];

        for (var i = 0; i < item.length; i++)
        {
            article_range.push(i);
            article_paragraph_range[i] = [];
            for (var j = 0; j < item[i].about_toggle_image.length; j++)
                article_paragraph_range[i].push(j);
        }
        $scope.about_article_range = article_range;
        $scope.about_article_paragraph_range = article_paragraph_range;
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

        var item = $scope.item_about;
        $scope.item_about = null;
        $scope.item_about = item.slice().reverse();

        var article_paragraph_range = [];
        j = $scope.about_article_paragraph_range.length - 1;

        for (i = 0; i < $scope.about_article_paragraph_range.length; i++) {
            article_paragraph_range[i] = [];
            for (s = 0; s < $scope.about_article_paragraph_range[j].length; s++)
                article_paragraph_range[i].push(s);
            j--;
        }
        $scope.about_article_paragraph_range = article_paragraph_range;
    };

    $scope.undo_summary_about = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].about_summary_header = item[0].about_summary_header;
            $scope.item_main[0].about_summary_text = item[0].about_summary_text;
        })
        $scope.item_main[0].about_summary_header = '';
        $scope.item_main[0].about_summary_text = '';
    };

    $scope.save_summary_about = function() {
        var header = document.getElementById('about_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('about_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].about_summary_header = header;
        $scope.item_main[0].about_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_about = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].about_sentence = item[0].about_sentence;
        })
        $scope.item_main[0].about_sentence = '';
    };

    $scope.save_sentence_about = function() {
        var sentence = document.getElementById('about_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].about_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_article = function(i) {
        About.get().success(function(item) {
            $scope.item_about = null;
            $scope.item_about = item;

            var article_range = [];
            var article_paragraph_range = [];
            for (i = 0; i < item.length; i++)
            {
                article_range.push(i);
                article_paragraph_range[i] = [];
                for (j = 0; j < item[i].about_toggle_image.length; j++)
                    article_paragraph_range[i].push(j);
            }
            $scope.about_article_range = article_range;
            $scope.about_article_paragraph_range = article_paragraph_range;
        })
        $scope.item_about[i] = null;
    };

    $scope.add_paragraph = function(i, j) {
        $scope.item_about[i].about_article_paragraph.push('New paragraph');
        $scope.item_about[i].about_article_paragraph_image.push('null');
        $scope.item_about[i].about_toggle_image.push(false);
        $scope.item_about[i].about_image_left.push(true);
        $scope.about_article_paragraph_range[i].push(j + 1);
    };

    $scope.add_article = function(i) {
        var default_json = ({_id                        : null
                        , about_article_header          : 'New article'
                        , about_article_paragraph       : ['New paragraph']
                        , about_article_paragraph_image : ['null']
                        , about_toggle_image            : [false]
                        , about_image_left              : [true]});

        $scope.item_about.push(default_json);
        if (typeof i != 'undefined') {
            $scope.about_article_range.push(i + 1);
            $scope.about_article_paragraph_range[i + 1] = [];
            $scope.about_article_paragraph_range[i + 1].push(0);
        } else {
            $scope.about_article_range = [];
            $scope.about_article_paragraph_range = [];
            $scope.about_article_paragraph_range[0] = [];
            $scope.about_article_range.push(0);
            $scope.about_article_paragraph_range[0].push(0);
        }
    };

    $scope.save_article = function(i) {
        var article_header = document.getElementById('article_header_' + i).innerHTML;
        article_header = String(article_header).replace(/<[^>]+>/gm, '');
        var article_paragraph = [];
        var article_paragraph_image = [];
        var article_toggle_image = [];
        var article_toggle_left = [];

        var s = 0;
        var j = 0;
        for (; j < $scope.item_about[i].about_article_paragraph.length; j++) {
            var paragraph = document.getElementById('article_paragraph_' + i + '_' + j).innerHTML;
            paragraph = String(paragraph).replace(/<[^>]+>/gm, '');
            if (paragraph != '') {
                article_paragraph[s] = paragraph;
                article_paragraph_image[s] = $scope.item_about[i].about_article_paragraph_image[j];
                article_toggle_image[s] = $scope.item_about[i].about_toggle_image[j];
                article_toggle_left[s] = $scope.item_about[i].about_image_left[j];
                s++;
            }
        }
        if (s != j) {
            var json = ({_id                        : $scope.item_about[i]._id
                    , about_article_header          : article_header
                    , about_article_paragraph       : article_paragraph
                    , about_article_paragraph_image : article_paragraph_image
                    , about_toggle_image            : article_toggle_image
                    , about_image_left              : article_toggle_left});

            $scope.item_about[i] = null;
            var article_paragraph_range = [];
            for (r = 0; r < article_toggle_image.length; r++)
                article_paragraph_range.push(r);
            $scope.about_article_paragraph_range[i] = article_paragraph_range;
            $scope.item_about[i] = json;
        }

        if ($scope.item_about[i]._id == null) {
            About.create($scope
                    , article_header
                    , article_paragraph
                    , article_paragraph_image
                    , article_toggle_image
                    , article_toggle_left)
            .success(function(success) {
                $scope.undo_article(i);
            });
        } else {
            About.update($scope
                    , $scope.item_about[i]._id
                    , article_header
                    , article_paragraph
                    , article_paragraph_image
                    , article_toggle_image
                    , article_toggle_left);
        }
    };

    $scope.delete_article = function(i) {
        About.delete($scope, $scope.item_about[i]._id)
        .success(function(success) {
            $scope.undo_article(i);
        })
    };

    $scope.$on('article-about-uploaded', function(event, args) {
        var i = $scope.article_modal_active;
        var j = $scope.paragraph_modal_active;
        $scope.toggle_modal(-1, -1);
        $scope.item_about[i].about_article_paragraph_image[j] = args.largefilepath;
    });

    $scope.toggle_modal = function(i, j) {
        $scope.article_modal_active = i;
        $scope.paragraph_modal_active = j;
        $scope.modal_active = $scope.modal_active ? false : true;
    };

    $scope.toggle_image = function(i,j) {
        $scope.item_about[i].about_toggle_image[j] = $scope.item_about[i].about_toggle_image[j] ? false : true;
    };

    $scope.image_toggle_left = function(i,j) {
        $scope.item_about[i].about_image_left[j] = $scope.item_about[i].about_image_left[j] ? false : true;
    };
});
