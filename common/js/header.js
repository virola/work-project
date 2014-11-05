/**
 * @file 公用头部导航条模块
 */
$(function () {

    // 给登录和注册链接自动加上返回当前页的URL
    $('a.add-redirect').each(function (i, item) {
        var link = $(item).attr('href');
        var url = window.location.href;

        link += (link.indexOf('?') > -1 ? '&' : '?') + 'redict_url=' + encodeURIComponent(url);

        $(item).attr('href', link);
    });

    // 微信浮层的弹出
    $('.weixin').on('mouseover', function () {
        $(this).children('div').show();
    }).on('mouseout', function () {
        $(this).children('div').hide();
    });
});