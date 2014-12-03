/**
 * @file 程序主入口
 * @author virola
 */

define(['jquery'], function ($) {

    'use strict';

    var _blankfn = function () {};

    var exports = {};

    // 全局控制区域
    var globalDom = $('#g-ctrl');

    // 页面区域DOM
    var mainDom = $('#slide-main');

    var WRAPPER_CLASS = 'slide-wrapper';
    var SLIDE_CLASS = 'slide';

    // swiper effects
    var EFFECTS = {
        scaleIn: {
            // adjustIndex: 1,
            effects: {
                onProgressChange: function (swiper) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        var slide = swiper.slides[i];
                        var progress = slide.progress;
                        var scale;
                        var translate
                        var opacity;

                        if (progress <= 0) {
                            opacity = 1 - Math.min(Math.abs(progress), 1);
                            scale = 1 - Math.min(Math.abs(progress / 2), 1);
                            translate = progress * swiper.width;  
                        }
                        else {
                            opacity = 1 - Math.min(Math.abs(progress / 2), 1);
                            scale = 1;
                            translate = 0; 
                        }
                        slide.style.opacity = opacity;
                        swiper.setTransform(slide, 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')');
                    }
                },
                onTouchStart: function (swiper) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.setTransition(swiper.slides[i], 0);
                    }
                },
                onSetWrapperTransition: function(swiper, speed) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.setTransition(swiper.slides[i], speed);
                    }
                }
            }
        },
        scaleOut: {
            // adjustIndex: 1,
            effects: {
                onProgressChange: function (swiper) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        var slide = swiper.slides[i];
                        var progress = slide.progress;
                        var scale;
                        var translate
                        var opacity;

                        if (progress >= 0) {
                            opacity = 1 - Math.min(Math.abs(progress), 1);
                            scale = 1 - Math.min(Math.abs(progress / 2), 1);
                            translate = progress * swiper.width;  
                        }
                        else {
                            opacity = 1 - Math.min(Math.abs(progress / 2), 1);
                            scale = 1;
                            translate = 0; 
                        }
                        slide.style.opacity = opacity;
                        swiper.setTransform(slide, 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')');
                    }
                },
                onTouchStart: function (swiper) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.setTransition(swiper.slides[i], 0);
                    }
                },
                onSetWrapperTransition: function(swiper, speed) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.setTransition(swiper.slides[i], speed);
                    }
                }
            }
        }
    };


    var allcount;
    var loaded = 0;

    /**
     * 储存swiper的选项参数
     */
    var cacheOptions;

    exports.init = function (options) {
        var effect = options.effect || 'scaleOut';
        cacheOptions = $.extend({
            wrapperClass: WRAPPER_CLASS,
            slideClass: SLIDE_CLASS,
            slideElement: 'section',
            mode: 'vertical',
            preventLinks: false
        }, options, EFFECTS[effect].effects);


        var bgs = [];
        $('.slide').each(function (i) {
            $(this).width($(window).width()).height($(window).height());

            var bgimg = $(this).css('background-image');
            if (bgimg == 'none') {
                return;
            }
            bgimg = bgimg.replace(/\'|\"/, '').replace('url(', '').replace(')', '')
            bgs[i] = bgimg;

            var img = new Image();
            img.src = bgimg;
            img.onload = function () {
                if (this.complete) {
                    loaded++;
                }
            };
        });

        allcount = bgs.length;

        // 启动超时监控
        startTime = new Date();
        start();

    };

    var startTime;

    function start() {
        var nowTime = new Date();
        var gap = nowTime - startTime;

        if (allcount <= loaded || gap > 3 * 1000) {
            
            $('.page-container').removeClass('hide');
            globalDom.removeClass('hide');
            $('.loading').addClass('hide');

            // 初始化幻灯片组件
            initSwiper();

            fisrtPage.start();
        }
        else {
            setTimeout(function () {
                start();
            }, 500);
        }
    }


    /**
     * @type {Object} swiper组件
     */
    var uiSlider;

    // init swiper
    function initSwiper() {
        require(['swiper', 'swiper-smooth-progress'], function (Swiper) {

            cacheOptions.noSwiping = 1;
            cacheOptions.noSwipingClass = 's-homepage';
            uiSlider = new Swiper('.page-container', cacheOptions);

            uiSlider.addCallback('SlideChangeEnd', handlerChange);

            // bug...
            handlerChange(uiSlider);

            initTab();
        });
    };

    // 切换slide之后重新触发页面中的一些动画技能
    function handlerChange(swiper) {
        $(swiper.slides).find('[data-style]').each(function () {
            var _me = $(this);
            var style = _me.attr('data-style');
            $(this).removeClass(style);
        });

        var current = swiper.activeSlide();

        $(current).find('[data-style]').each(function () {
            var _me = $(this);
            var style = _me.attr('data-style');
            $(this).addClass(style);
        });
    }

    var TAB_CONTENT_CLASS = 'left-in';

    function initTab() {
        $('.tab-nav').on('click', 'li', function () {
            var item = $(this);
            var tab = item.closest('.tab');
            var index = tab.find('.tab-nav>li').index(item);
            

            if (!item.hasClass('current')) {
                tab.find('.tab-nav>li').removeClass('current');
                item.addClass('current');

                setTabStyles(tab);
            }
        });

        $('.tab-content-item').on('webkitAnimationEnd', function () {
            $(this).css({
                opacity: 1
            });
        });

        setTabStyles($('.tab'));
    }

    function setTabStyles(tab) {
        var item = tab.find('.tab-nav li.current');
        var index = tab.find('.tab-nav>li').index(item);
        var currentStyle = item.attr('data-style');
        var contents = tab.find('.tab-content-item').css({opacity: 0});

        contents.removeClass(TAB_CONTENT_CLASS).eq(index).addClass(TAB_CONTENT_CLASS);
        tab.removeClass(tab.attr('data-style') || '').attr('data-style', currentStyle).addClass(currentStyle);
    }

    
    /**
     * 首页处理逻辑
     * 
     * @type {Object}
     */
    var fisrtPage = (function () {

        var homeImgSelector = '.s-homepage';

        function showFirstPage() {
            $(homeImgSelector).fadeOut();
            // $(homeImgSelector).eraser('clear');
        }

        return {
            init: function () {

                require(['jquery-eraser'], function ($) {
                    $(homeImgSelector).eraser({
                        completeRatio: .4,
                        completeFunction: showFirstPage
                    });
                });
            },
            start: showFirstPage
        };
    })();

    return exports;
});