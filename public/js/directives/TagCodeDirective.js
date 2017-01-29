// public/js/directives/TagCodeDirective.js
// http://stackoverflow.com/a/34701084
angular.module('TagCodeDirective', []).directive('tagCode', function($compile) {
    return {
        restrict: 'E',
        scope: {
            model: '=model'
        },
        link: function(scope, element, attr) {
            scope.$watch('model', function(value, oldValue) {

                var model = value || '';
                // Replace tags with Html
                model = angular.element('<div></div>').text(model).html();
                
                // Custom tags with templates
                model = model.replace(/\[tc:hyperlink/g, '<tc-hyperlink');
                model = model.replace(/\[\/tc:hyperlink\]/g, '</tc-hyperlink>');
                model = model.replace(/\[tc:youtube/g, '<tc-youtube');
                model = model.replace(/\[\/tc:youtube\]/g, '</tc-youtube>');
                
                // Straight tag -> html replace
                model = model.replace(/\[tc:span\]/g, '<tc-span>');
                model = model.replace(/\[\/tc:span\]/g, '</tc-span>');
                model = model.replace(/\[tc:pre\]/g, '<tc-pre>');
                model = model.replace(/\[\/tc:pre\]/g, '</tc-pre>');
                model = model.replace(/\[tc:code\]/g, '<tc-code>');
                model = model.replace(/\[\/tc:code\]/g, '</tc-code>');
                model = model.replace(/\[tc:bold\]/g, '<tc-bold>');
                model = model.replace(/\[\/tc:bold\]/g, '</tc-bold>');
                model = model.replace(/\[tc:italic\]/g, '<tc-italic>');
                model = model.replace(/\[\/tc:italic\]/g, '</tc-italic>');
                model = model.replace(/\[tc:highlight\]/g, '<tc-highlight>');
                model = model.replace(/\[\/tc:highlight\]/g, '</tc-highlight>');
                model = model.replace(/\[tc:sup\]/g, '<tc-sup>');
                model = model.replace(/\[\/tc:sup\]/g, '</tc-sup>');
                model = model.replace(/\[tc:sub\]/g, '<tc-sub>');
                model = model.replace(/\[\/tc:sub\]/g, '</tc-sub>');
                model = model.replace(/\[tc:u\]/g, '<tc-u>');
                model = model.replace(/\[\/tc:u\]/g, '</tc-u>');
                model = model.replace(/\[tc:del\]/g, '<tc-del>');
                model = model.replace(/\[\/tc:del\]/g, '</tc-del>');

                // Replace open start tags (hyperlink, youtube)
                model = model.replace(/\]/g, '>');

                var e = angular.element('<content></content>');
                e.html(model);
                element.empty();
                element.append(e);
                $compile(e)(scope);

            });
        }
    }
});
