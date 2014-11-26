/**
 * @file jquery相册预览插件
 */

(function (document, $, log) {


$.fn.albumpreview = function (options) {
    options = $.extend({}, $.fn.albumpreview.defaults, options);

    var loading = options.path + '/loading.gif';
    var max = options.path + '/zoomin.cur';
    var min = options.path + '/zoomout.cur';

    max = 'url(\'' + max + '\'), pointer';
    min = 'url(\'' + min + '\'), pointer';

    var template = [
        '<div class="ui-preview-toolbar" style="display:none">',
            '<span class="ui-preview-buttons" style="display:none">',
                '<a href="#" data-go="hide" class="ui-preview-hide"><span></span>',
                    options.hide,
                '</a>',
                '<a href="#" data-go="left" class="ui-preview-left"><span></span>',
                    options.left,
                '</a>',
                '<a href="#" data-go="right" class="ui-preview-right"><span></span>',
                    options.right,
                '</a>',
                options.source ? '<a href="#" data-go="source" class="ui-preview-source"><span></span>' : '',
                    options.source,
                '</a>',
                
            '</span>',
            '<span class="ui-preview-loading">',
                '<img data-live="stop" src="',
                    loading,
                    '" style="',
                    'display:inline-block;*zoom:1;*display:inline;vertical-align:middle;',
                    'width:16px;height:16px;"',
                ' />',
            '</span>',
        '</div>',
        '<div class="ui-preview-box" style="display:none"></div>'
    ].join('');

    var templateShowBox = [
        '<div class="ui-preview-photo">',
            '<div class="ui-preview-photo-wrap">',
                '<img data-name="thumb" data-go="hide" data-live="stop" src="',
                    loading,
                '">',
            '</div>',
            '<a class="ui-preview-photo-prev" href="#" data-go="prev"></a>',
            '<a class="ui-preview-photo-next" href="#" data-go="next"></a>',   
        '</div>'
    ].join('');

    $(this).each(function () {

        var $panel = $(this);

        var $albumpreview;

        // bind img events
        // ................
        // 内部元素处理
        // ................
        var selector = options.imgClass ? ('.' + options.imgClass) : 'img'; 

        $panel.bind('click', selector, function (e) {

            $albumpreview = $panel.data('albumpreview');
            if (!$albumpreview) {
                initShowBox();
            }

            // handle click events
            var img = e.target;
            if (img.nodeName !== 'IMG' || img.getAttribute('data-live') === 'stop') {
                return false;
            }

            var index = $panel.find(selector).index(img);
            showImage(index);

            return false;
        });

        // 当前显示的box和index
        var activeBox;
        var activeIndex;

        var imgLength = $panel.find(selector).length;

        // 显示一张大图
        function showImage(index) {
            if (index == activeIndex || index < 0 || index > imgLength - 1) {
                return;
            }

            var $box = $albumpreview.find('.ui-preview-box').show();

            // show box
            $albumpreview.show().find('.ui-preview-toolbar').slideDown(150, function () {
                // setTimeout(function () {
                    $albumpreview.get(0).scrollIntoView();
                // }, 1000);
            });

            

            var photos = $box.find('.ui-preview-photo').addClass('ui-preview-hidden');
            photos.eq(index).removeClass('ui-preview-hidden');

            activeBox = photos.eq(index);
            activeIndex = index;

            $panel.hide();
        }
        

        // size options
        var maxWidth = options.maxWidth || 'auto';
        var maxHeight = options.maxHeight || 99999;
        maxWidth = maxWidth - options.borderWidth * 2;

        // gen a showbox
        var initShowBox = function () {
            $albumpreview = $('<div>').addClass('ui-preview ui-preview-noLoad')
                .append(template).hide();
            
            if (options.appendTo) {
                $panel.closest(options.appendTo).append($albumpreview);
            }
            else {
                $panel.after($albumpreview);
            }

            var buttonClick = function (event) {
                var target = event.target;
                var go = target.getAttribute('data-go');
                var live = target.getAttribute('data-live');

                var degree = activeBox.data('preview-degree') || 0;
                var elem = activeBox.find('.ui-preview-show')[0];
                    
                if (live === 'stop') {
                    return false;
                }
                if (/img|canvas$/i.test(target.nodeName)) {
                    go = 'hide';
                }
                
                switch (go) {
                    case 'left':
                        degree -= 90;
                        degree = degree === -90 ? 270 : degree;
                        break;
                    case 'right':
                        degree += 90;
                        degree = degree === 360 ? 0 : degree;
                        break;
                    case 'source':
                        window.open(source || show || src);
                        break;
                    case 'hide':
                        disposePreview();
                        break;
                    case 'prev': 
                        showImage(activeIndex - 1);
                        break;
                    case 'next':
                        showImage(activeIndex + 1);
                        break;
                };
                
                if ((go === 'left' || go === 'right') && activeBox.data('preview-photo-load')) {
                    imgRotate(elem, degree, maxWidth, maxHeight);
                    activeBox.data('preview-degree', degree);
                };
                
                return false;
            };

            initLargePic();

            $albumpreview.bind('click', '[data-go]', buttonClick);
            $panel.data('albumpreview', $albumpreview);
        }

        var disposePreview = function () {
            $panel.show();
            $albumpreview.hide();
            $albumpreview.remove();
            activeIndex = -1;
            activeBox = null;

            $panel.data('albumpreview', null);
            $panel.get(0).scrollIntoView();
        };


        // 大图相册预览区域
        var initLargePic = function () {
            // cache inner elements
            var $box = $albumpreview.find('.ui-preview-box');

            $panel.find(selector).each(function (i) {
                var img = this;
                if (img.nodeName !== 'IMG') {
                    return false;
                }

                var $img = $(img);
                var $photo = $(templateShowBox).addClass('ui-preview-hidden').appendTo($box);

                var $thumb = $photo.find('[data-name=thumb]');
                var targetpic = $img.attr(options.showAttr);
                if (!options.showAttr || !targetpic) {
                    targetpic = img.src;
                }

                // 快速获取大图尺寸
                imgReady(targetpic, 
                    function () {
                        var width = this.width;
                        var height = this.height;
                        var maxWidth2 = Math.min(maxWidth, width);
                        
                        height = maxWidth2 / width * height;
                        width = maxWidth2;

                        // 插入大图并使用逐渐清晰加载的效果
                        $thumb.attr('src', img.src).css(options.blur ? {
                            width: width + 'px',
                            height: height + 'px'
                        } : {display: 'none'})

                        // 大图
                        $thumb.after([
                            '<img class="ui-preview-show" data-go="hide" title="',
                                img.title,
                                '" alt="',
                                img.alt,
                                '" src="',
                                targetpic,
                                '" style="width:',
                                width,
                                'px;height:',
                                height, // IE8 超长图片height属性失效BUG，改用CSS
                                'px;position:absolute;left:0;top:0;background:transparent"',
                            ' />'
                        ].join(''));
                        
                        $thumb.attr('class', 'ui-preview-show');
                        $albumpreview.addClass('ui-preview-ready');
                        $albumpreview.find('.ui-preview-buttons').show();
                        $photo.data('albumpreview-ready', true);
                        
                    // 大图完全加载完毕
                    }, function () {
                        var $show = $albumpreview.find('.ui-preview-show');
                        $thumb.removeAttr('class').removeAttr('data-live').hide();
                        $show.css({
                            position: 'static',
                            left: 'auto',
                            top: 'auto'
                        });
                        
                        $albumpreview.removeClass('ui-preview-noLoad');
                        $albumpreview.find('.ui-preview-loading').hide();
                        $photo.data('preview-photo-load', true);

                    // 图片加载错误
                    }, function () {
                        $albumpreview.addClass('ui-preview-error');
                        log('jQuery.fn.albumpreview: Load "' + targetpic + '" Error!');
                    }
                );
                
            });

            // adjust prev/next btn
            $box.find('.ui-preview-photo-prev:first').hide();
            $box.find('.ui-preview-photo-next:last').hide();
        };

        // 预加载指针形状图标
        $panel.find(selector).css({
            cursor: max 
        });
    });
    
    return this;
};

$.fn.albumpreview.defaults = {
    imgClass: '',
    showAttr: '',
    path: './images',
    left: '\u5de6\u65cb\u8f6c',
    right: '\u53f3\u65cb\u8f6c',
    source: '\u770b\u539f\u56fe',
    hide: '\xd7',
    blur: true,
    preload: true,
    maxWidth: null,
    maxHeight: null,
    borderWidth: 18,
    appendTo: ''
};


/**
 * 图片旋转
 * @version 2014.11.26
 * @author  virola
 * @param   {HTMLElement}   图片元素
 * @param   {Number}        旋转角度 (可用值: 0, 90, 180, 270)
 * @param   {Number}        最大宽度限制
 * @param   {Number}        最大高度限制
 */
var imgRotate = $.imgRotate = (function () {
    var ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;

    return function (elem, degree, maxWidth, maxHeight) {
        var width = elem.naturalWidth;
        var height = elem.naturalHeight;

        // 获取图像未应用样式的真实大小 (IE和Opera早期版本)
        if (!('naturalWidth' in elem)) {
            var run = elem.runtimeStyle, w = run.width, h = run.height;
            run.width  = run.height = 'auto';
            elem.naturalWidth = width = elem.width;
            elem.naturalHeight = height = elem.height;
            run.width  = w;
            run.height = h;
        };

        // scale
        var resize = 1;

        // 向上平移
        var translateY = 0;

        var size = function (isSwap) {

            // exchange 
            if (isSwap) {

                width = [height, height = width][0];

                if (width > maxHeight) {
                    resize = maxHeight / width;
                    height = resize * height;
                    width = maxHeight;
                }
                if (height > maxWidth) {
                    resize = resize * maxWidth / height;
                    width = maxWidth / height * width;
                    height = maxWidth;
                }

                translateY = - (width - height) / 2;
            }
            else {
                if (width > maxWidth) {
                    resize = maxWidth / width;
                    height = resize * height;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    resize = resize * maxHeight / height;
                    width = maxHeight / height * width;
                    height = maxHeight;
                }
            }

            // (isSwap ? height : width) / elem.naturalWidth;

        };

        var isSwap;

        switch (degree) {
            case 0:
            case 180:
                size();
                break;
            case 90:
            case 270:
                size(true);
                isSwap = 1;
                break;
        };

        


        if (ie && ie < 9) {
            var deg = degree > 180 ? (degree - 360) : (degree < -180 ? (360 + degree) : degree );
            var radian = deg * (2 * Math.PI / 360);

            console.log(deg);
            console.log(radian);

            var filter = [
                'progid:DXImagetransform.Microsoft.Matrix(',
                    'M11=' + Math.cos(radian) + ',M12=-' + Math.sin(radian) +',',
                    'M21=' + Math.sin(radian) +',M22=' + Math.cos(radian) + ',',
                    'SizingMethod=\'auto expand\'',
                ')'
            ].join('');

            filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + degree / 90 + ')';

            if (radian == 0) {
                filter = '';   
            }

            $(elem).css('filter', filter);
        }
        else {
            var transform = 'translate(0, ' + translateY + 'px) rotate(' + degree +'deg) scale(1,1)';
            $(elem).css({
                transform: transform
            });
        }

        if (isSwap) {
            $(elem).parent().height(height);
        }
        else {
            $(elem).parent().height('auto');
        }
        
    };
})();

/**
 * 图片头数据加载就绪事件 - 更快获取图片尺寸
 * @version 2011.05.27
 * @author  TangBin
 * @see     http://www.planeart.cn/?p=1121
 * @param   {String}    图片路径
 * @param   {Function}  尺寸就绪
 * @param   {Function}  加载完毕 (可选)
 * @param   {Function}  加载错误 (可选)
 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
        alert('size ready: width=' + this.width + '; height=' + this.height);
    });
 */
var imgReady = (function () {
    var list = [], intervalId = null,

    // 用来执行队列
    tick = function () {
        var i = 0;
        for (; i < list.length; i++) {
            list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
    },

    // 停止所有定时器队列
    stop = function () {
        clearInterval(intervalId);
        intervalId = null;
    };

    return function (url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
        
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        };
        
        width = img.width;
        height = img.height;
        
        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };
        
        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            ) {
                ready.call(img);
                onready.end = true;
            };
        };
        onready();
        
        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
        
            load && load.call(img);
            
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();

}(document, jQuery, function (msg) {window.console && console.log(msg)}));