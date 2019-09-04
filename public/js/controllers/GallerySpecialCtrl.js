// public/js/controllers/GallerySpecialCtrl.js
angular.module('GallerySpecialCtrl', []).controller('GallerySpecialController', function($scope, $window, GallerySpecial, Main) {

    $window.document.title = 'Gallery Special - ' + $scope.item_main[0].name;

    $scope.item_special = [];
    $scope.special_range = [];
    $scope.special_paragraph_range = [];

    try {
        ga('set', 'page', '/gallery-special');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    GallerySpecial.get().then(function(item)
    {
        $scope.item_special = item;
        for (var i = 0; i < $scope.item_special.length; i++) {
            $scope.special_range.push(i);
            $scope.special_paragraph_range[i] = [];
            for (var j = 0; j < $scope.item_special[i].image_special_article.length; j++) {
                $scope.special_paragraph_range[i].push(j);
            }
        }
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

        var item = $scope.item_special;
        $scope.item_special = null;
        $scope.item_special = item.slice().reverse();

        var special_paragraph_range = [];
        j = $scope.special_paragraph_range.length - 1;

        for (i = 0; i < $scope.special_paragraph_range.length; i++) {
            special_paragraph_range[i] = [];
            for (s = 0; s < $scope.special_paragraph_range[j].length; s++)
                special_paragraph_range[i].push(s);
            j--;
        }
        $scope.special_paragraph_range = special_paragraph_range;
    };

    $scope.undo_summary_special = function() {
        Main.get().then(function(item) {
            $scope.item_main[0].special_summary_header = item[0].special_summary_header;
            $scope.item_main[0].special_summary_text = item[0].special_summary_text;
        })
        $scope.item_main[0].special_summary_header = '';
        $scope.item_main[0].special_summary_text = '';
    };

    $scope.save_summary_special = function() {
        var header = document.getElementById('special_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('special_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].special_summary_header = header;
        $scope.item_main[0].special_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_special = function() {
        Main.get().then(function(item) {
            $scope.item_main[0].special_sentence = item[0].special_sentence;
        })
        $scope.item_main[0].special_sentence = '';
    };

    $scope.save_sentence_special = function() {
        var sentence = document.getElementById('special_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].special_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_special = function(i) {
        GallerySpecial.get().then(function(item) {
            $scope.item_special = null;
            $scope.item_special = item;

            var special_range = [];
            var special_paragraph_range = [];
            for (i = 0; i < item.length; i++)
            {
                special_range.push(i);
                special_paragraph_range[i] = [];
                for (j = 0; j < item[i].image_special_article.length; j++)
                    special_paragraph_range[i].push(j);
            }
            $scope.special_range = special_range;
            $scope.special_paragraph_range = special_paragraph_range;
        })
        $scope.item_special[i] = null;
    };

    $scope.add_paragraph = function(i, j) {
        $scope.item_special[i].image_special_article.push('New paragraph');
        $scope.special_paragraph_range[i].push(j + 1);
    };

    $scope.add_special = function(i) {
        var default_json = ({_id                    : null
                            , image_special_name        : 'Comet C/2012 F6 (Lemmon)'
                            , image_special_url         : 'images/largeFile-default-gallery-special-article.jpg'
                            , image_special_preview_url : 'images/smallFile-default-gallery-special-article-small.jpg'
                            , image_special_summary     : 'This is where you summarize your image'
                            , image_special_article     : ['Some info first.. With this responsive design, it would be good practice to keep all your preview images the same height and width. This preview is 505x505px, and will display nicely on all devices. If you use a CCD a 1x1 crop would work well, or you can use a 4:3 crop for DSLR on your previews.']});

        $scope.item_special.push(default_json);
        if (typeof i != 'undefined') {
            $scope.special_range.push(i + 1);
            $scope.special_paragraph_range[i + 1] = [];
            $scope.special_paragraph_range[i + 1].push(0);
        } else {
            $scope.special_range = [];
            $scope.special_paragraph_range = [];
            $scope.special_paragraph_range[0] = [];
            $scope.special_range.push(0);
            $scope.special_paragraph_range[0].push(0);
        }
    };

    $scope.save_special = function(i) {
        var special_name = document.getElementById('special_name_' + i).innerHTML;
        special_name = String(special_name).replace(/<[^>]+>/gm, '');
        var special_summary = document.getElementById('special_summary_' + i).innerHTML;
        special_summary = String(special_summary).replace(/<[^>]+>/gm, '');
        var special_url = $scope.item_special[i].image_special_url;
        var special_preview_url = $scope.item_special[i].image_special_preview_url;

        var special_paragraph = [];

        var s = 0;
        var j = 0;
        for (; j < $scope.item_special[i].image_special_article.length; j++) {
            var paragraph = document.getElementById('special_paragraph_' + i + '_' + j).innerHTML;
            paragraph = String(paragraph).replace(/<[^>]+>/gm, '');
            if (paragraph != '') {
                special_paragraph[s] = paragraph;
                s++;
            }
        }
        if (s != j) {
            var json = ({_id                        : $scope.item_special[i]._id
                        , image_special_name        : special_name
                        , image_special_url         : special_url
                        , image_special_preview_url : special_preview_url
                        , image_special_summary     : special_summary
                        , image_special_article     : special_paragraph});

            $scope.item_special[i] = null;
            var special_paragraph_range = [];
            for (r = 0; r < special_paragraph.length; r++)
                special_paragraph_range.push(r);
            $scope.special_paragraph_range[i] = special_paragraph_range;
            $scope.item_special[i] = json;
        }

        if ($scope.item_special[i]._id == null) {
            GallerySpecial.create($scope
                    , special_name
                    , special_url
                    , special_preview_url
                    , special_summary
                    , special_paragraph)
            .then(function(success) {
                $scope.undo_special(i);
            });
        } else {
            GallerySpecial.update($scope
                    , $scope.item_special[i]._id
                    , special_name
                    , special_url
                    , special_preview_url
                    , special_summary
                    , special_paragraph);
        }
    };

    $scope.delete_special = function(i) {
        GallerySpecial.delete($scope, $scope.item_special[i]._id)
        .then(function(success) {
            $scope.undo_special(i);
        })
    };

    $scope.$on('gallery-special-uploaded', function(event, args) {
        var i = $scope.article_modal_active;
        $scope.toggle_modal(-1);
        $scope.item_special[i].image_special_url = args.largefilepath == null ? $scope.item_special[i].image_special_url : args.largefilepath;
        $scope.item_special[i].image_special_preview_url = args.smallfilepath == null ? $scope.item_special[i].image_special_preview_url : args.smallfilepath;
    });

    $scope.toggle_modal = function(i) {
        $scope.article_modal_active = i;
        $scope.modal_active = $scope.modal_active ? false : true;
    };
});
