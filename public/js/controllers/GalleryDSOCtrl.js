// public/js/controllers/GalleryDSOCtrl.js
angular.module('GalleryDSOCtrl', []).controller('GalleryDSOController', function($scope, $window, GalleryDSO, Main) {

    $window.document.title = 'Gallery DSO - ' + $scope.item_main[0].name;

    $scope.item_dso = [];
    $scope.dso_range = [];
    $scope.dso_paragraph_range = [];
    
    try {
        ga('set', 'page', '/gallery-dso');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    GalleryDSO.get().success(function(item)
    {
        $scope.item_dso = item;
        for (var i = 0; i < $scope.item_dso.length; i++) {
            $scope.dso_range.push(i);
            $scope.dso_paragraph_range[i] = [];
            for (var j = 0; j < $scope.item_dso[i].image_dso_article.length; j++) {
                $scope.dso_paragraph_range[i].push(j);
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

        var item = $scope.item_dso;
        $scope.item_dso = null;
        $scope.item_dso = item.slice().reverse();

        var dso_paragraph_range = [];
        j = $scope.dso_paragraph_range.length - 1;

        for (i = 0; i < $scope.dso_paragraph_range.length; i++) {
            dso_paragraph_range[i] = [];
            for (s = 0; s < $scope.dso_paragraph_range[j].length; s++)
                dso_paragraph_range[i].push(s);
            j--;
        }
        $scope.dso_paragraph_range = dso_paragraph_range;
    };

    $scope.undo_summary_dso = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].dso_summary_header = item[0].dso_summary_header;
            $scope.item_main[0].dso_summary_text = item[0].dso_summary_text;
        })
        $scope.item_main[0].dso_summary_header = '';
        $scope.item_main[0].dso_summary_text = '';
    };

    $scope.save_summary_dso = function() {
        var header = document.getElementById('dso_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('dso_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].dso_summary_header = header;
        $scope.item_main[0].dso_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_dso = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].dso_sentence = item[0].dso_sentence;
        })
        $scope.item_main[0].dso_sentence = '';
    };

    $scope.save_sentence_dso = function() {
        var sentence = document.getElementById('dso_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].dso_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_dso = function(i) {
        GalleryDSO.get().success(function(item) {
            $scope.item_dso = null;
            $scope.item_dso = item;

            var dso_range = [];
            var dso_paragraph_range = [];
            for (i = 0; i < item.length; i++)
            {
                dso_range.push(i);
                dso_paragraph_range[i] = [];
                for (j = 0; j < item[i].image_dso_article.length; j++)
                    dso_paragraph_range[i].push(j);
            }
            $scope.dso_range = dso_range;
            $scope.dso_paragraph_range = dso_paragraph_range;
        })
        $scope.item_dso[i] = null;
    };

    $scope.add_paragraph = function(i, j) {
        $scope.item_dso[i].image_dso_article.push('New paragraph');
        $scope.dso_paragraph_range[i].push(j + 1);
    };

    $scope.add_dso = function(i) {
        var default_json = ({_id                    : null
                            , image_dso_name        : 'Orion Nebula'
                            , image_dso_url         : 'images/largeFile-default-gallery-dso-article.jpg'
                            , image_dso_preview_url : 'images/smallFile-default-gallery-dso-article-small.jpg'
                            , image_dso_summary     : 'This is where you summarize your image'
                            , image_dso_article     : ['Some info first.. With this responsive design, it would be good practice to keep all your preview images the same height and width. This preview is 505x505px, and will display nicely on all devices. If you use a CCD a 1x1 crop would work well, or you can use a 4:3 crop for DSLR on your previews.']});

        $scope.item_dso.push(default_json);
        if (typeof i != 'undefined') {
            $scope.dso_range.push(i + 1);
            $scope.dso_paragraph_range[i + 1] = [];
            $scope.dso_paragraph_range[i + 1].push(0);
        } else {
            $scope.dso_range = [];
            $scope.dso_paragraph_range = [];
            $scope.dso_paragraph_range[0] = [];
            $scope.dso_range.push(0);
            $scope.dso_paragraph_range[0].push(0);
        }
    };

    $scope.save_dso = function(i) {
        var dso_name = document.getElementById('dso_name_' + i).innerHTML;
        dso_name = String(dso_name).replace(/<[^>]+>/gm, '');
        var dso_summary = document.getElementById('dso_summary_' + i).innerHTML;
        dso_summary = String(dso_summary).replace(/<[^>]+>/gm, '');
        var dso_url = $scope.item_dso[i].image_dso_url;
        var dso_preview_url = $scope.item_dso[i].image_dso_preview_url;

        var dso_paragraph = [];

        var s = 0;
        var j = 0;
        for (; j < $scope.item_dso[i].image_dso_article.length; j++) {
            var paragraph = document.getElementById('dso_paragraph_' + i + '_' + j).innerHTML;
            paragraph = String(paragraph).replace(/<[^>]+>/gm, '');
            if (paragraph != '') {
                dso_paragraph[s] = paragraph;
                s++;
            }
        }
        if (s != j) {
            var json = ({_id                    : $scope.item_dso[i]._id
                        , image_dso_name        : dso_name
                        , image_dso_url         : dso_url
                        , image_dso_preview_url : dso_preview_url
                        , image_dso_summary     : dso_summary
                        , image_dso_article     : dso_paragraph});

            $scope.item_dso[i] = null;
            var dso_paragraph_range = [];
            for (r = 0; r < dso_paragraph.length; r++)
                dso_paragraph_range.push(r);
            $scope.dso_paragraph_range[i] = dso_paragraph_range;
            $scope.item_dso[i] = json;
        }

        if ($scope.item_dso[i]._id == null) {
            GalleryDSO.create($scope
                    , dso_name
                    , dso_url
                    , dso_preview_url
                    , dso_summary
                    , dso_paragraph)
            .success(function(success) {
                $scope.undo_dso(i);
            });
        } else {
            GalleryDSO.update($scope
                    , $scope.item_dso[i]._id
                    , dso_name
                    , dso_url
                    , dso_preview_url
                    , dso_summary
                    , dso_paragraph);
        }
    };

    $scope.delete_dso = function(i) {
        GalleryDSO.delete($scope, $scope.item_dso[i]._id)
        .success(function(success) {
            $scope.undo_dso(i);
        })
    };

    $scope.$on('gallery-dso-uploaded', function(event, args) {
        var i = $scope.article_modal_active;
        $scope.toggle_modal(-1);
        $scope.item_dso[i].image_dso_url = args.largefilepath == null ? $scope.item_dso[i].image_dso_url : args.largefilepath;
        $scope.item_dso[i].image_dso_preview_url = args.smallfilepath == null ? $scope.item_dso[i].image_dso_preview_url : args.smallfilepath;
        console.log('DSO: on emit, article_modal_active = ' + $scope.article_modal_active 
                    + ', largefilepath = ' + args.largefilepath 
                    + ', smallfilepath = ' + args.smallfilepath);
    });

    $scope.toggle_modal = function(i) {
        $scope.article_modal_active = i;
        $scope.modal_active = $scope.modal_active ? false : true;
    };
});
