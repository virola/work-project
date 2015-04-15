
define(function (require) {

    var exports = {};

    function initMusic() {
        var onBtn = document.getElementById('music-switch-on');
        var offBtn = document.getElementById('music-switch-off');

        offBtn.style.display = 'none';

        onBtn.addEventListener('click', function () {
            offBtn.style.display = 'block';
            onBtn.style.display = 'none';
        }, false);

        offBtn.addEventListener('click', function () {
            onBtn.style.display = 'block';
            offBtn.style.display = 'none';
        }, false);
    }

    function adjustSize() {
        $('#slide').width($(window).width()).height($(window).height());
    }

    exports.start = function (options) {
        adjustSize();

        var opts = $.extend({
            pagination: '.pagination',
            paginationClickable: true,
            mode: 'vertical'
        }, options);

        require(['swiper', 'swiper-smooth-progress'], function (Swiper) {
            var slider = new Swiper('.swiper-container', opts);
            initMusic();
        });

        
    };

    return exports;
});