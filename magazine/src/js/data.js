
define(['jquery', 'util'], function ($, util) {

    var exports = {};

    var IMG_BASE = 'mock/bg/';

    var shareData = {};

    exports.render = function (options, callback) {
        var url = options.url;

        $.getJSON(url).done(function (json) {
            $('#content').html(getHtml(json.pages));

            document.title = shareData.title = json.name;

            var desc = document.querySelector('head>meta[name="description"]');
            var keywords = document.querySelector('head>meta[name="keywords"]');

            if (keywords) {
                keywords.content = json.keywords;
            }

            if (desc) {
                desc.content = shareData.content = json.description;
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

    var firstImg;

    function getImg() {
        var index = Math.ceil(Math.random() * 10);
        if (imgMap[index]) {
            return getImg();
        }

        imgMap[index] = 1;

        return IMG_BASE + index + '.jpg'
    }

    exports.getShareData = function () {
        shareData.icon = getFirstImg();
        shareData.link = window.location.href;

        return shareData;
    };

    function getPage(item) {
        item.bgurl = getImg();
        if (!firstImg) {
            firstImg = item.bgurl;
        }
        return util.format(tpl, item);
    }

    exports.getFirstImg = function () {
        var url = window.location.href;
        var baseIndex = url.lastIndexOf('/');
        return url.substr(0, baseIndex) + '/' + firstImg;
    };

    return exports;
});