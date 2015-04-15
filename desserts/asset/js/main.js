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
        scaleOut: {
            effects: {
                onProgressChange: function (swiper) {
                    var active = swiper.activeIndex;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        var slide = swiper.slides[i];
                        var progress = slide.progress;
                        var scale;
                        var translate
                        var opacity;

                        if (progress > 0) {
                            opacity = 1 - Math.min(Math.abs(progress), 1);
                            scale = 1 - Math.min(Math.abs(progress / 2), 1);
                            translate = progress * swiper.width;  
                        }
                        else {
                            opacity = 1;
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

    var WIN_WIDTH = $(window).width();
    var WIN_HEIGHT = $(window).height();

    exports.init = function (options) {

        // adjust body size
        $('.body').width(WIN_WIDTH).height(WIN_HEIGHT);;

        var effect = options.effect || 'scaleOut';
        cacheOptions = $.extend({
            wrapperClass: WRAPPER_CLASS,
            slideClass: SLIDE_CLASS,
            slideElement: 'section',
            mode: 'vertical',
            preventLinks: false
        }, options, EFFECTS[effect].effects);

        cacheOptions.updateOnImagesReady = 1;
        cacheOptions.onImagesReady = function (swiper) {
            start();
        };

        // 判断背景图片的加载
        var bgs = [];
        var bgMap = {};
        $('.slide').each(function (i) {
            $(this).width(WIN_WIDTH).height(WIN_HEIGHT);

            var bgimg = $(this).css('background-image');
            if (bgimg == 'none' || bgMap[bgimg]) {
                return;
            }
            bgMap[bgimg] = 1;

            bgimg = bgimg.replace(/\'|\"/, '').replace('url(', '').replace(')', '')
            bgs.push(bgimg);

            var img = new Image();
            img.src = bgimg;
            img.onload = function () {
                if (this.complete) {
                    // console.log(1);
                    loaded++;
                }
            };
        });

        allcount = bgs.length;


        // 启动超时监控
        startTime = new Date();

        // 初始化幻灯片组件
        initSwiper();
    };

    // 启动时间记录
    var startTime;

    function start() {
        var nowTime = new Date();
        var gap = nowTime - startTime;

        if (allcount <= loaded && gap > 2 * 1000) {
            
            globalDom.removeClass('hide');
            $('.loading').fadeOut(function () {
                $(this).remove();
            });

            // 第一页动作
            // firstPage.start();
            firstPage.init();

            // 视频页动作
            videoPage.init();
        }
        else {
            setTimeout(function () {
                start();
            }, 200);
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
            cacheOptions.noSwipingClass = 'swipe-stop';
            uiSlider = new Swiper('.page-container', cacheOptions);

            uiSlider.addCallback('SlideChangeStart', handlerSlideChangeStart);
            uiSlider.addCallback('SlideChangeEnd', handlerSlideChangeEnd);

            initTab();

            initFoods();

            // 动画的初始化
            animation.init();
            animation.start(0);

        });
    };

    // 更新食材页列表高度
    function initFoods() {
        $('.s-page-foods').each(function () {
            var pageh = $(this).find('article').height();
            if (pageh > WIN_HEIGHT) {
                var picWrap = $(this).find('.pic-album');
                var mh = picWrap.height();
                var scale = (WIN_HEIGHT - $(this).find('.title').outerHeight())/ mh;

                var offsetY = mh * (scale - 1) * scale;
                picWrap.css('transform', 'scale(' + scale + ', ' + scale + ') translateY(' + offsetY + 'px)');
            }

            var foods = $(this);
            var list = foods.find('.foods-list').children();
            var ingresH = list.outerHeight() * list.size() - 15;
            var oriY = 0;

            foods.find('.foods-list').on('scroll', function (e) {
                var me = $(this);
                var scrollTop = me.scrollTop();

                if (scrollTop > oriY) {
                    // scroll down
                    if (scrollTop >= ingresH) {
                        me.removeClass('swipe-stop');
                    }
                }
                else {
                    if (scrollTop == 0) {
                        me.removeClass('swipe-stop');
                    }
                }

                oriY = scrollTop;
            });
        });

    }

    var animation = (function () {

        var pages = $('article');

        function start(index) {
            if (index == null) {
                return;
            }
            pages.eq(index).children().each(function (index) {
                $(this).delay(200 * index).fadeIn(400);
            });
        }

        function slideShow(index) {
            pages.eq(index).children().each(function (index) {
                $(this).delay(200 * index).slideDown(400);
            });
        }

        return {
            init: function () {
                pages.children().hide();
            },
            start: start
        };
    })();

    /**
     * pageMusic object
     * 
     * @type {Object}
     */
    var pageMusic = (function () {

        var playBtn = $('.player-btn');
        var bgMusic = $('.bg-music');

        // init music control
        function initMusic() {

            playBtn.on('click', function () {
                if (playBtn.hasClass('player-btn-stop')) {
                    pageMusic.on();
                }
                else {
                    pageMusic.off();
                }
            });

        }

        return {
            init: initMusic,
            off: function () {
                playBtn.addClass('player-btn-stop');
                bgMusic[0].pause();
            },
            on: function () {
                playBtn.removeClass('player-btn-stop');
                bgMusic[0].play();
            }
        };
    })();


    var TAB_CONTENT_CLASS = 'left-in';

    function initTab() {
        $('.tab-nav li').on('touchstart', function () {
            var item = $(this);
            var tab = item.closest('.tab');

            if (!item.hasClass('current')) {
                tab.find('.tab-nav>li').removeClass('current');
                item.addClass('current');

                setTabStyles(tab);
            }

            return false;
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
        var name = item.data('target');
        var contents = tab.find('.tab-content-item').css({opacity: 0}).removeClass(TAB_CONTENT_CLASS);
        var contentTarget = contents.filter('[data-target="' + name + '"]');
        contentTarget.addClass(TAB_CONTENT_CLASS);
    }

    function handlerSlideChangeStart(swiper) {
        // $('.video').hide();
    }

    function handlerSlideChangeEnd(swiper) {

        // init video
        var slide = $(swiper.activeSlide());
        
        slide.find('.foods-list').addClass('swipe-stop');

        // init animations
        animation.init();
        animation.start(swiper.activeIndex);
    }

    
    /**
     * 首页处理逻辑
     * 
     * @type {Object}
     */
    var firstPage = (function () {

        var RATIO = 0.3;
        var homeMask = $('.home-mask');
        var originPoint = {};
        var TOUCH_GAP = 5;

        var isFaded;

        function showFirstPage() {

            if (isFaded) {
                return false;
            }

            isFaded = 1;
            homeMask.fadeOut(1500, function () {
                homeMask.remove();
            });

            // play music
            pageMusic.init();
        }


        return {
            init: function () {

                homeMask.width(WIN_WIDTH).height(WIN_HEIGHT);

                homeMask.find('img[data-animation]').each(function () {
                    $(this).addClass($(this).data('animation'));
                });

                homeMask.on('touchstart', 'img[data-animation]', function (e) {
                    var changes = e.originalEvent.changedTouches[0];
                    originPoint.x = changes.pageX;
                    originPoint.y = changes.pageY;
                });

                var imgs = homeMask.find('img');

                homeMask.on('touchmove', 'img[data-animation]', function (e) {

                    e.preventDefault();

                    var direction;
                    var changes = e.originalEvent.changedTouches[0];

                    if (changes.pageX < originPoint.x - TOUCH_GAP) {
                        // to left
                        direction = 'left';
                    }
                    else if (changes.pageX > originPoint.x + TOUCH_GAP) {
                        // to right
                        direction = 'right';
                    }

                    if (direction) {
                        // imgs.addClass('jumpout');
                        var gap = changes.pageY - originPoint.y;
                        gap = gap * 5;

                        if (direction == 'left') {
                            imgs.animate({
                                left: -WIN_WIDTH + 'px',
                                top: gap + 'px'
                            }, 1500);
                        }

                        if (direction == 'right') {
                            imgs.animate({
                                left: WIN_WIDTH * 1.5 + 'px',
                                top: gap + 'px'
                            }, 1500);
                        }

                        setTimeout(function () {
                            showFirstPage();
                        }, 500);
                        
                    }
                });


                homeMask.on('touchmove', function () {
                    return false;
                });

                $(document).one('touchstart', function () {
                    pageMusic.on();
                });
            },
            start: showFirstPage
        };
    })();


    /**
     * 视频页处理逻辑
     */
    var videoPage = (function () {

        function initVideo() {

            $('.video').each(function () {
                var me = $(this);
                me.width(me.outerWidth()).height(me.height());
            });

            $('.video').on('touchstart', function () {
                youkuPlayer.load($(this));
            });
        }

        return {
            init: initVideo
        };
    })();

    /**
     * 优酷播放器对象
     * 
     * @type {Object}
     */
    var youkuPlayer = (function () {
        var isWebkit = /webkit/i.test(navigator.userAgent);
        var isFirefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;

        function startPlay(container) {
            container = $(container);
            pageMusic.off();

            if (container.data('video-loaded')) {
                var video = container.find('video').get(0);

                if (video.requestFullscreen) {
                    video.requestFullscreen();
                }
                else {
                    if (isFirefox) {
                        // Mozilla
                        video.mozRequestFullScreen();   
                    }
                    
                    if (isWebkit) {
                        // Webkit for video elements only
                        video.webkitRequestFullscreen();
                    }
                }

                video.play();
            }
            else {
                var vsrc = container.data('video-src');
                var poster = container.find('img:first').attr('src');
                var jVideo = $('<video></video>').attr({
                    'preload': true,
                    'controls': true,
                    'autoplay': true,
                    'src': vsrc,
                    'poster': poster
                });
                jVideo.on('play', function () {
                    if (this.requestFullscreen) {
                        this.requestFullscreen();
                    }
                    else {
                        if (isFirefox) {
                            this.mozRequestFullScreen();   
                        }
                        if (isWebkit) {
                            this.webkitRequestFullscreen();
                        }
                    }
                });
                container.children().hide();
                container.append(jVideo);

                container.data('video-loaded', jVideo)
            }
            
        }

        return {
            load: startPlay
        };
    })();

    return exports;
});