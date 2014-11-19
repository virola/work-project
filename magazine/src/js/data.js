
define(['jquery', 'util'], function ($) {

    var exports = {};

    var IMG_BASE = 'mock/bg/';

    exports.render = function (options, callback) {
        var url = options.url;

        $.getJSON(url).done(function (json) {
            console.log(json);

            $('#content').html(getHtml(json.pages));

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