
define(['jquery'], function ($) {

    $.fn.waveBtn = function (options) {    
        var options = $.extend({}, $.fn.waveBtn.defaults, options);
        options.framecnt = options.duration / 60;

        var _this = $(this);

        _this.each(function () {
            var btn = $(this);

            // _this.on('mousedown', press).on('touchstart', press);
            var width = Math.round(btn.outerWidth());
            var height = Math.round(btn.outerHeight());

            // unique canvas
            var canvas = btn.canvas = $('<canvas>');
            canvas
                .on('mousedown', press).on('touchstart', press)
                .css({
                    width: '100%',
                    height: '100%'
                })
                .attr({'width': width, 'height': height})
                .appendTo(btn);

            // canvas绘制用，cache一下
            var _context = btn.canvas.get(0).getContext('2d');

            function press(events) {
                var type = events.type;

                var color = btn.data('color');
                if (!color) {
                    color = btn.css('color');
                }

                _context.clearRect(0, 0, width, height);

                draw({
                    startX: event.offsetX,
                    startY: event.offsetY,
                    radius: 0,
                    color: color,
                    opacity: options.initOpacity
                });
            }

            var opacityStep = (options.endOpacity - options.initOpacity) / options.framecnt;

            function draw(opts) {
                _context.beginPath();
                _context.arc(opts.startX, opts.startY, opts.radius, 0, 2 * Math.PI, false);
                _context.fillStyle = opts.color;
                _context.globalAlpha = opts.opacity;
                _context.fill();

                if (opts.radius < width * 1.2) {
                    requestAnimFrame(function () {
                        draw({
                            startX: opts.startX,
                            startY: opts.startY,
                            radius: opts.radius + options.step,
                            color: opts.color,
                            opacity: Math.max(0, (opts.opacity + opacityStep))
                        });
                    });
                }
                else {
                    _context.clearRect(0, 0, width, height);
                }
            }

        });


        /**
         * 动画渲染间隔，保证动画渲染的性能
         * 
         * @type {Function}
         */
        var requestAnimFrame = (function () {
            return (
                window.requestAnimationFrame       || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function (callback) {
                  window.setTimeout(callback, options.framecnt);
                }
            );
        })();

    };   

    $.fn.waveBtn.defaults = {
        classname: '',
        step: 9,
        duration: 1000,
        initOpacity: 0.25,
        endOpacity: 0.8
    };

    return $;

});

