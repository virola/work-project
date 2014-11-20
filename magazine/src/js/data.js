
define(['jquery', 'util'], function ($, util) {

    var exports = {};

    var IMG_BASE = 'mock/bg/';

    exports.render = function (options, callback) {
        var url = options.url;

        $.getJSON(url).done(function (json) {
            $('#content').html(getHtml(json.pages));

            document.title = json.name;

            var desc = document.querySelector('head>meta[name="description"]');
            var keywords = document.querySelector('head>meta[name="keywords"]');

            if (keywords) {
                keywords.content = json.keywords;
            }

            if (desc) {
                desc.content = json.description;
            }

            if (callback) {
                callback();
            }
        });
    };

    function getHtml(data) {

        var html = [];

        $.each(data, function (i, item) {
            html[i] = getPage(item);
        });

        return html.join('');
    }

    var tpl = ''
        + '<section style="background-image: url(#{bgurl})">'
        + '<div class="page">'
        +     '<h2>#{title}</h2>'
        +     '<p>#{content}</p>'
        + '</div>'
        + '</section>';

    var imgMap = {};

    function getImg() {
        var index = Math.ceil(Math.random() * 10);
        if (imgMap[index]) {
            return getImg();
        }

        imgMap[index] = 1;

        return IMG_BASE + index + '.jpg'
    }

    function getPage(item) {
        item.bgurl = getImg();
        return util.format(tpl, item);
    }

    return exports;
});