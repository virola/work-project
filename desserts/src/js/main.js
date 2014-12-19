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
            effects: {
                onProgressChange: function (swiper) {
                    var currentIndex = swiper.activeIndex;
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

    var YOUKU_ID;
    var YOUKU_JSAPI;

    exports.init = function (options, youkuId, youkuApi) {

        var effect = options.effect || 'scaleOut';
        cacheOptions = $.extend({
            wrapperClass: WRAPPER_CLASS,
            slideClass: SLIDE_CLASS,
            slideElement: 'section',
            mode: 'vertical',
            preventLinks: false
        }, options, EFFECTS[effect].effects);

        YOUKU_ID = youkuId || '';
        YOUKU_JSAPI = youkuApi || '';

        cacheOptions.updateOnImagesReady = 1;
        cacheOptions.onImagesReady = function (swiper) {
            start();
            youkuPlayer.init();
        };

        // 判断背景图片的加载
        var bgs = [];
        var bgMap = {};
        $('.slide').each(function (i) {
            $(this).width($(window).width()).height($(window).height());

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

        if (allcount <= loaded && gap > 2 * 1000 && youkuPlayer.isLoaded()) {
            
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
            cacheOptions.noSwipingClass = 'swipe-stop';
            uiSlider = new Swiper('.page-container', cacheOptions);

            // uiSlider.addCallback('SlideChangeStart', handlerSlideChangeStart);
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
            var winh = $(window).height();
            if (pageh > winh) {
                var picWrap = $(this).find('.pic-album');
                var mh = picWrap.height();
                var scale = (winh - $(this).find('.title').outerHeight())/ mh;

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
                $(this).delay(400 * index).fadeIn(800);
            });
        }

        function slideShow(index) {
            pages.eq(index).children().each(function (index) {
                $(this).delay(400 * index).slideDown(800);
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
     * music object
     * 
     * @type {Object}
     */
    var music = (function () {

        var btn = $('.player-btn');
        var audio = $('.bg-music');

        // init music control
        function initMusic() {
            
            btn.on('click', function () {
                if (btn.hasClass('player-btn-stop')) {
                    music.on();
                }
                else {
                    music.off();
                }
            });

            audio.attr('autoplay', true);
            music.on();
        }

        return {
            init: initMusic,
            off: function () {
                btn.addClass('player-btn-stop');
                audio[0].pause();
            },
            on: function () {
                btn.removeClass('player-btn-stop');
                audio[0].play();
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
        // var slide = $(swiper.activeSlide());
        // console.log(slide);
    }

    function handlerSlideChangeEnd(swiper) {

        // init video
        var slide = $(swiper.activeSlide());
        
        slide.find('.foods-list').addClass('swipe-stop');

        // init animations
        animation.start(swiper.activeIndex);
    }

    
    /**
     * 首页处理逻辑
     * 
     * @type {Object}
     */
    var firstPage = (function () {

        var RATIO = 0.3;

        // var homeImgSelector = '.home-mask';

        function showFirstPage() {
            $('.homepage').fadeOut(1500);

            // play music
            music.init();
        }

        var homeMask = $('.home-mask');

        var originPoint = {};

        var TOUCH_GAP = 10;

        return {
            init: function () {

                var winWidth = $(window).width();

                var imgs = homeMask.find('img');

                homeMask.find('img[data-animation]').each(function () {
                    $(this).addClass($(this).data('animation'));
                });

                homeMask.on('touchstart', 'img[data-animation]', function (e) {
                    var changes = e.originalEvent.changedTouches[0];
                    originPoint.x = changes.pageX;
                    originPoint.y = changes.pageY;
                });

                homeMask.on('touchmove', 'img[data-animation]', function (e) {

                    e.preventDefault();

                    var direction;
                    var changes = e.originalEvent.changedTouches[0];

                    console.log(changes.pageX, originPoint.x);

                    if (changes.pageX < originPoint.x - TOUCH_GAP) {
                        // to left
                        direction = 'left';
                    }
                    else if (changes.pageX > originPoint.x + TOUCH_GAP) {
                        // to right
                        direction = 'right';
                    }

                    if (direction) {
                        imgs.addClass('jumpout');
                        var gap = changes.pageY - originPoint.y;
                        gap = gap * 10;

                        if (direction == 'left') {
                            imgs.css({
                                left: -winWidth + 'px',
                                top: gap + 'px'
                            });
                        }

                        if (direction == 'right') {
                            imgs.css({
                                left: winWidth * 1.5 + 'px',
                                top: gap + 'px'
                            });
                        }

                        showFirstPage();
                        
                    }
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
                me.width(me.width()).height(me.height());
            });

            $('.video').on('click', function () {
                var videoId = $(this).data('video-id');
                youkuPlayer.load(videoId, $(this));
            });
        }

        return {
            init: initVideo
        };
    })();

    var youkuPlayer = (function () {

        
        var isApiReady;

        var frames = {};

        var wrapHeight = $('.page-container').height();
        var wrapWidth = $('.page-container').width();

        function getFrameId(id, container) {
            var contId = 'videoframe-' + id;
            if (frames[id]) {
                return frames[id].id;
            }
            else {
                $(container).attr('id', contId);

                frames[id] = {
                    id: contId,
                    container: $(container)[0]
                };

                return frames[id].id;
            }
        }

        function loadPlayer(videoId, container) {

            // wait for api ready
            if (!isApiReady) {
                setTimeout(function () {
                    loadPlayer(videoId);
                }, 500);
                return false;
            }

            var videoPlayer = frames[videoId] && frames[videoId].player;

            if (!videoPlayer) {
                videoPlayer = new YKU.Player(getFrameId(videoId, container),{
                    styleid: '4',  // default '0'
                    client_id: YOUKU_ID,
                    vid: videoId,
                    autoplay: true,
                    events: {
                        onPlayStart: function () {
                            music.off();
                        }
                    }
                });

                frames[videoId].player = videoPlayer;
            }
        }

        function stop(videoId) {
            if (!frames[videoId]) {
                return false;
            }
            
            var container = frames[videoId].container;
            if (frames[videoId] && frames[videoId].player) {
                $(container).css('zIndex', -1);
                frames[videoId].player.pauseVideo();
            }
        }

        return {
            load: loadPlayer,
            stop: stop,
            init: function () {
                if (isApiReady) {
                    return false;
                }

                var jsapi = YOUKU_JSAPI;

                $.ajax({
                    url: jsapi,
                    dataType: 'script',
                    timeout: 15 * 1000,
                    cache: true,
                    success: function (data) {
                        isApiReady = 1;
                    },
                    error: function () {
                        youkuPlayer.init();
                    }
                });
            },
            isLoaded: function () {
                return isApiReady;
            }
        };
    })();

    return exports;
});