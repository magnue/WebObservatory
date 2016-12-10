// public/js/controllers/WeatherCtrl.js
angular.module('WeatherCtrl', []).controller('WeatherController', function($scope, $sce, $window, Weather, Main) {

    $window.document.title = 'Weather - ' + $scope.item_main[0].name;

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    try {
        ga('set', 'page', '/weather');
        ga('send', 'pageview');
    } catch (err) {
        ; // nothing to do here, simply means analytics.js is not in use
    }

    $scope.item_weather = [];
    $scope.asc = localStorage.getItem('asc');

    Weather.get().success(function(item)
    {
        $scope.item_weather = item;

        var article_range = [];
        var article_paragraph_range = [];

        for (var i = 0; i < item.length; i++)
        {
            article_range.push(i);
            article_paragraph_range[i] = [];
            for (var j = 0; j < item[i].weather_toggle_image.length; j++)
                article_paragraph_range[i].push(j);
        }
        $scope.weather_article_range = article_range;
        $scope.weather_article_paragraph_range = article_paragraph_range;
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

        var item = $scope.item_weather;
        $scope.item_weather = null;
        $scope.item_weather = item.slice().reverse();

        var article_paragraph_range = [];
        j = $scope.weather_article_paragraph_range.length - 1;

        for (i = 0; i < $scope.weather_article_paragraph_range.length; i++) {
            article_paragraph_range[i] = [];
            for (s = 0; s < $scope.weather_article_paragraph_range[j].length; s++)
                article_paragraph_range[i].push(s);
            j--;
        }
        $scope.weather_article_paragraph_range = article_paragraph_range;
    };

    $scope.undo_summary_weather = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].weather_summary_header = item[0].weather_summary_header;
            $scope.item_main[0].weather_summary_text = item[0].weather_summary_text;
        })
        $scope.item_main[0].weather_summary_header = '';
        $scope.item_main[0].weather_summary_text = '';
    };

    $scope.save_summary_weather = function() {
        var header = document.getElementById('weather_summary_header').innerHTML;
        header = String(header).replace(/<[^>]+>/gm, '');

        var text = document.getElementById('weather_summary_text').innerHTML;
        text = String(text).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].weather_summary_header = header;
        $scope.item_main[0].weather_summary_text = text;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_sentence_weather = function() {
        Main.get().success(function(item) {
            $scope.item_main[0].weather_sentence = item[0].weather_sentence;
        })
        $scope.item_main[0].weather_sentence = '';
    };

    $scope.save_sentence_weather = function() {
        var sentence = document.getElementById('weather_sentence').innerHTML;
        sentence = String(sentence).replace(/<[^>]+>/gm, '');
        $scope.item_main[0].weather_sentence = sentence;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.undo_article = function(i) {
        Weather.get().success(function(item) {
            $scope.item_weather = null;
            $scope.item_weather = item;

            var article_range = [];
            var article_paragraph_range = [];
            for (i = 0; i < item.length; i++)
            {
                article_range.push(i);
                article_paragraph_range[i] = [];
                for (j = 0; j < item[i].weather_toggle_image.length; j++)
                    article_paragraph_range[i].push(j);
            }
            $scope.weather_article_range = article_range;
            $scope.weather_article_paragraph_range = article_paragraph_range;
        })
        $scope.item_weather[i] = null;
    };

    $scope.add_paragraph = function(i, j) {
        $scope.item_weather[i].weather_article_paragraph.push('New paragraph');
        $scope.item_weather[i].weather_article_paragraph_image.push('null');
        $scope.item_weather[i].weather_toggle_image.push(false);
        $scope.item_weather[i].weather_image_left.push(true);
        $scope.weather_article_paragraph_range[i].push(j + 1);
    }

    $scope.add_article = function(i) {
        var default_json = ({_id                          : null
                        , weather_article_header          : 'New article'
                        , weather_article_paragraph       : ['New paragraph']
                        , weather_article_paragraph_image : ['null']
                        , weather_toggle_image            : [false]
                        , weather_image_left              : [true]});

        $scope.item_weather.push(default_json);
        if (typeof i != 'undefined') {
            $scope.weather_article_range.push(i + 1);
            $scope.weather_article_paragraph_range[i + 1] = [];
            $scope.weather_article_paragraph_range[i + 1].push(0);
        } else {
            $scope.weather_article_range = [];
            $scope.weather_article_paragraph_range = [];
            $scope.weather_article_paragraph_range[0] = [];
            $scope.weather_article_range.push(0);
            $scope.weather_article_paragraph_range[0].push(0);
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
        for (; j < $scope.item_weather[i].weather_article_paragraph.length; j++) {
            var paragraph = document.getElementById('article_paragraph_' + i + '_' + j).innerHTML;
            paragraph = String(paragraph).replace(/<[^>]+>/gm, '');
            if (paragraph != '') {
                article_paragraph[s] = paragraph;
                article_paragraph_image[s] = $scope.item_weather[i].weather_article_paragraph_image[j];
                article_toggle_image[s] = $scope.item_weather[i].weather_toggle_image[j];
                article_toggle_left[s] = $scope.item_weather[i].weather_image_left[j];
                s++;
            }
        }
        if (s != j) {
            var json = ({_id                          : $scope.item_weather[i]._id
                    , weather_article_header          : article_header
                    , weather_article_paragraph       : article_paragraph
                    , weather_article_paragraph_image : article_paragraph_image
                    , weather_toggle_image            : article_toggle_image
                    , weather_image_left              : article_toggle_left});

            $scope.item_weather[i] = null;
            var article_paragraph_range = [];
            for (r = 0; r < article_toggle_image.length; r++)
                article_paragraph_range.push(r);
            $scope.weather_article_paragraph_range[i] = article_paragraph_range;
            $scope.item_weather[i] = json;
        }

        if ($scope.item_weather[i]._id == null) {
            Weather.create($scope
                    , article_header
                    , article_paragraph
                    , article_paragraph_image
                    , article_toggle_image
                    , article_toggle_left)
            .success(function(success) {
                $scope.undo_article(i);
            });            
        } else {
            Weather.update($scope
                    , $scope.item_weather[i]._id
                    , article_header
                    , article_paragraph
                    , article_paragraph_image
                    , article_toggle_image
                    , article_toggle_left);
        }
    }

    $scope.delete_article = function(i) {
        Weather.delete($scope, $scope.item_weather[i]._id)
        .success(function(success) {
            $scope.undo_article(i);
        })
    }

    $scope.$on('article-weather-uploaded', function(event, args) {
        var i = $scope.article_modal_active;
        var j = $scope.paragraph_modal_active;
        $scope.toggle_modal(-1, -1);
        $scope.item_weather[i].weather_article_paragraph_image[j] = args.largefilepath;
    });

    $scope.toggle_modal = function(i, j) {
        $scope.article_modal_active = i;
        $scope.paragraph_modal_active = j;
        $scope.modal_active = $scope.modal_active ? false : true;
    };

    $scope.toggle_image = function(i,j) {
        $scope.item_weather[i].weather_toggle_image[j] = $scope.item_weather[i].weather_toggle_image[j] ? false : true;
    }

    $scope.image_toggle_left = function(i,j) {
        $scope.item_weather[i].weather_image_left[j] = $scope.item_weather[i].weather_image_left[j] ? false : true;
    }

    $scope.save_clearoutside = function() {
        var lati = $scope.item_main[0].lati;
        lati = String(lati).replace(/<[^>]+>/gm, '');

        var longi = $scope.item_main[0].longd;
        longi = String(longi).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].lati = lati;
        $scope.item_main[0].longd = longi;
        Main.update($scope, $scope.item_main[0]);
    };

    $scope.save_yr = function() {
        var yr = $scope.item_main[0].yr_place;
        yr = String(yr).replace(/<[^>]+>/gm, '');

        $scope.item_main[0].yr_place = yr;

        $scope.yr_place_name = $scope.item_main[0].yr_place.replace(/^.*[\\\/]/, '');
        $scope.yr_html_url = {src:"http://www.yr.no/place/" + $scope.item_main[0].yr_place + "/external_box_hour_by_hour.html"};

        Main.update($scope, $scope.item_main[0]);
    };
});
