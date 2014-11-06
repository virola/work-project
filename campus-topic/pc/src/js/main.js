
define(function (require) {

    var exports = {};

    function initHeader() {
        require(['jquery'], function ($) {

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
    }

    var isVoted;

    function vote(index, data) {
        if (isVoted) {
            alert('今天已投票，请明天再来！')
            return false;
        }
        var pageBtn = $('.group .btn').eq(index);
        var layerBtn = $('.popup .btn').eq(index);

        var cnt = pageBtn.children('em');
        var number = parseInt(cnt.text(), 10) + 1;
        
        pageBtn.add(layerBtn).find('em').text(number);

        isVoted = 1;
    }

    function bindPageEvents() {
        require(['jquery'], function ($) {

            $('.group .btn').on('click', function () {
                var btn = $(this);
                var index = $('.group .btn').index(btn);
                
                vote(index);
                return false;
            });

            $('.popup .btn').on('click', function () {
                var btn = $(this);
                var index = $('.popup .btn').index(btn);

                vote(index);
                return false;
            });

            $('.photo').on('click', function () {
                var _me = $(this);
                var index = $('.photo').index(_me);
                showPopup(index);
                return false;
            });

            $('.mask').on('click', function () {
                $(this).hide();
                $('.popup').hide();
            });

            $('.popup-close').on('click', function () {
                $(this).closest('.popup').hide();
                $('.mask').hide();

                return false;
            });
        });
    }

    function showPopup(index) {
        require(['jquery'], function ($) {
            var popup = $('.popup-' + index);
            if (popup.size() > 0) {
                popup.show();
                var left = ($(window).width() - popup.width()) / 2;
                var top = Math.max($(window).scrollTop() + 100, 550);

                popup.css({
                    left: left + 'px',
                    top: top + 'px'
                });
            }

            $('.mask').show().height($(document.documentElement).height());
        });
    }

    exports.init = function () {
        initHeader();
        bindPageEvents();
    };

    return exports;
});