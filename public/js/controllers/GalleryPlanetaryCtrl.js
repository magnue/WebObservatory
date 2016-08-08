// public/js/controllers/GalleryPlanetaryCtrl.js
angular.module('GalleryPlanetaryCtrl', []).controller('GalleryPlanetaryController', function($scope, GalleryPlanetary, Main) {

    $scope.item_planetary = [];
    $scope.planetary_range = [];
    $scope.planetary_paragraph_range = [];
    
    GalleryPlanetary.get().success(function(item)
    {
        $scope.item_planetary = item;
        for (var i = 0; i < $scope.item_planetary.length; i++) {
            $scope.planetary_range.push(i);
            $scope.planetary_paragraph_range[i] = [];
            for (var j = 0; j < $scope.item_planetary[i].image_planetary_article.length; j++) {
                $scope.planetary_paragraph_range[i].push(j);
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

        var item = $scope.item_planetary;
        $scope.item_planetary = null;
        $scope.item_planetary = item.slice().reverse();

        var planetary_paragraph_range = [];
        j = $scope.planetary_paragraph_range.length - 1;

        for (i = 0; i < $scope.planetary_paragraph_range.length; i++) {
            planetary_paragraph_range[i] = [];
            for (s = 0; s < $scope.planetary_paragraph_range[j].length; s++)
                planetary_paragraph_range[i].push(s);
            j--;
        }
        $scope.planetary_paragraph_range = planetary_paragraph_range;
    };

    $scope.undo_summary_planetary = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].planetary_summary_header = item[0].planetary_summary_header;
            $scope.item_main[0].planetary_summary_text = item[0].planetary_summary_text;
        })
        $scope.item_main[0].planetary_summary_header = '';
        $scope.item_main[0].planetary_summary_text = '';
    };

    $scope.save_summary_planetary = function() {
        var header = document.getElementById('planetary_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('planetary_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].planetary_summary_header = header;
        $scope.item_main[0].planetary_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_planetary = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].planetary_sentence = item[0].planetary_sentence;
        })
        $scope.item_main[0].planetary_sentence = '';
    };

    $scope.save_sentence_planetary = function() {
        var sentence = document.getElementById('planetary_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].planetary_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_planetary = function(i) {
        GalleryPlanetary.get().success(function(item) {
            $scope.item_planetary = null;
            $scope.item_planetary = item;

            var planetary_range = [];
            var planetary_paragraph_range = [];
            for (i = 0; i < item.length; i++)
            {
                planetary_range.push(i);
                planetary_paragraph_range[i] = [];
                for (j = 0; j < item[i].image_planetary_article.length; j++)
                    planetary_paragraph_range[i].push(j);
            }
            $scope.planetary_range = planetary_range;
            $scope.planetary_paragraph_range = planetary_paragraph_range;
        })
        $scope.item_planetary[i] = null;
    };

    $scope.add_paragraph = function(i, j) {
        $scope.item_planetary[i].image_planetary_article.push('New paragraph');
        $scope.planetary_paragraph_range[i].push(j + 1);
    };

    $scope.add_planetary = function(i) {
        var default_json = ({_id                    : null
                            , image_planetary_name        : 'The moon from Galileo'
                            , image_planetary_url         : 'images/default-gallery-planetary-article.jpg'
                            , image_planetary_preview_url : 'images/default-gallery-planetary-article-small.jpg'
                            , image_planetary_summary     : 'This is where you summarize your image'
                            , image_planetary_article     : ['Some info first.. With this responsive design, it would be good practice to keep all your preview images the same height and width. This preview is 505x505px, and will display nicely on all devices. If you use a CCD a 1x1 crop would work well, or you can use a 4:3 crop for DSLR on your previews.']});

        $scope.item_planetary.push(default_json);
        if (typeof i != 'undefined') {
            $scope.planetary_range.push(i + 1);
            $scope.planetary_paragraph_range[i + 1] = [];
            $scope.planetary_paragraph_range[i + 1].push(0);
        } else {
            $scope.planetary_range = [];
            $scope.planetary_paragraph_range = [];
            $scope.planetary_paragraph_range[0] = [];
            $scope.planetary_range.push(0);
            $scope.planetary_paragraph_range[0].push(0);
        }
    };

    $scope.save_planetary = function(i) {
        var planetary_name = document.getElementById('planetary_name_' + i).innerHTML;
        planetary_name = String(planetary_name).replace(/<[^>]+>/gm, '');
        var planetary_summary = document.getElementById('planetary_summary_' + i).innerHTML;
        planetary_summary = String(planetary_summary).replace(/<[^>]+>/gm, '');
        var planetary_url = $scope.item_planetary[i].image_planetary_url;
        var planetary_preview_url = $scope.item_planetary[i].image_planetary_preview_url;

        var planetary_paragraph = [];

        var s = 0;
        var j = 0;
        for (; j < $scope.item_planetary[i].image_planetary_article.length; j++) {
            var paragraph = document.getElementById('planetary_paragraph_' + i + '_' + j).innerHTML;
            paragraph = String(paragraph).replace(/<[^>]+>/gm, '');
            if (paragraph != '') {
                planetary_paragraph[s] = paragraph;
                s++;
            }
        }
        if (s != j) {
            var json = ({_id                          : $scope.item_planetary[i]._id
                        , image_planetary_name        : planetary_name
                        , image_planetary_url         : planetary_url
                        , image_planetary_preview_url : planetary_preview_url
                        , image_planetary_summary     : planetary_summary
                        , image_planetary_article     : planetary_paragraph});

            $scope.item_planetary[i] = null;
            var planetary_paragraph_range = [];
            for (r = 0; r < planetary_paragraph.length; r++)
                planetary_paragraph_range.push(r);
            $scope.planetary_paragraph_range[i] = planetary_paragraph_range;
            $scope.item_planetary[i] = json;
        }

        if ($scope.item_planetary[i]._id == null) {
            GalleryPlanetary.create($scope
                    , planetary_name
                    , planetary_url
                    , planetary_preview_url
                    , planetary_summary
                    , planetary_paragraph)
            .success(function(success) {
                $scope.undo_planetary(i);
            });
        } else {
            GalleryPlanetary.update($scope
                    , $scope.item_planetary[i]._id
                    , planetary_name
                    , planetary_url
                    , planetary_preview_url
                    , planetary_summary
                    , planetary_paragraph);
        }
    };

    $scope.delete_planetary = function(i) {
        GalleryPlanetary.delete($scope, $scope.item_planetary[i]._id)
        .success(function(success) {
            $scope.undo_planetary(i);
        })
    };

    $scope.$on('gallery-planetary-uploaded', function(event, args) {
        var i = $scope.article_modal_active;
        $scope.toggle_modal(-1);
        $scope.item_planetary[i].image_planetary_url = args.largefilepath == null ? $scope.item_planetary[i].image_planetary_url : args.largefilepath;
        $scope.item_planetary[i].image_planetary_preview_url = args.smallfilepath == null ? $scope.item_planetary[i].image_planetary_preview_url : args.smallfilepath;
    });

    $scope.toggle_modal = function(i) {
        $scope.article_modal_active = i;
        $scope.modal_active = $scope.modal_active ? false : true;
    };
});
