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

    exports.init = function (options) {

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

        if (allcount <= loaded || gap > 10 * 1000) {
            
            globalDom.removeClass('hide');
            $('.loading').fadeOut(function () {
                $(this).remove();
            });

            // play music
            music.init();

            // 第一页动作
            firstPage.start();
            // firstPage.init();

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

            uiSlider.addCallback('SlideChangeEnd', handlerSlideChange);

            initTab();

            initFoodsHeight();
        });
    };

    // 更新食材页列表高度
    function initFoodsHeight() {
        $('.s-page-foods').each(function () {
            var pageh = $(this).find('article').height();
            var winh = $(window).height();
            if (pageh > winh) {
                var picWrap = $(this).find('.pic-album');
                var mh = picWrap.outerHeight();
                var scale = (winh - $(this).find('.title').outerHeight())/ picWrap.outerHeight();

                var offsetY = mh * (scale - 1) * scale;
                picWrap.css('transform', 'scale(' + scale + ', ' + scale + ') translateY(' + offsetY + 'px)');
            }
        });
    }

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

            audio[0].play();
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
            var index = tab.find('.tab-nav>li').index(item);

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
        var index = tab.find('.tab-nav>li').index(item);
        // var currentStyle = item.attr('data-style');
        var contents = tab.find('.tab-content-item').css({opacity: 0});

        contents.removeClass(TAB_CONTENT_CLASS).eq(index).addClass(TAB_CONTENT_CLASS);
        // tab.removeClass(tab.attr('data-style') || '').attr('data-style', currentStyle).addClass(currentStyle);
    }

    function handlerSlideChange(swiper) {
        var slide = $(swiper.activeSlide());

        if (slide.find('.video').size() > 0) {
            youkuPlayer.init();
        }

        slide.find('.video').each(function () {
            youkuPlayer.load($(this).data('video-id'));
        });
    }

    
    /**
     * 首页处理逻辑
     * 
     * @type {Object}
     */
    var firstPage = (function () {

        var RATIO = 0.1;

        var homeImgSelector = '.s-homepage';

        function showFirstPage() {
            $(homeImgSelector).fadeOut();
        }

        return {
            init: function () {

                require(['jquery-eraser'], function ($) {
                    $(homeImgSelector).eraser({
                        size: $(window).width() / 10,
                        completeRatio: RATIO,
                        progressFunction: function (percent) {
                            // $('#debug').text(percent);
                        },
                        completeFunction: showFirstPage
                    });

                    // 设定homepage居中
                    var homepage = $('.s-homepage');
                    // 不同步的问题
                    // homepage.css('top', ($(window).height() - homepage.height()) / 2 + 'px' );
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

            // youku init
            // youkuPlayer.init();

            $('.video').on('click', function () {
                var videoId = $(this).data('video-id');
                youkuPlayer.play(videoId);
            });
        }

        return {
            init: initVideo
        };
    })();

    var youkuPlayer = (function () {

        var jsapi = 'http://player.youku.com/jsapi';
        var isApiReady;

        var frames = {};

        var winHeight = $(window).height();
        var winWidth = $(window).width();

        function getFrameId(id) {
            if (frames[id]) {
                return frames[id].id;
            }
            else {
                var frame = $('<div/>').addClass('video-player').attr('id', 'videoframe-' + id);
                var close = $('<span>x</span>').addClass('video-player-close')
                    .on('click', function () {
                        stop(id);
                    })
                    .appendTo(frame);
                var wrap = $('<div/>').addClass('video-wrap').attr('id', 'videosrc-' + id).appendTo(frame);
                
                wrap.css({
                    width: winWidth + 'px',
                    height: winHeight * 0.8 + 'px',
                    top: winHeight * 0.1 + 'px'
                });
                frame.appendTo($(document.body));

                frames[id] = {
                    id: wrap[0].id,
                    container: frame[0]
                };
                return frames[id].id;
            }
        }

        function loadPlayer(videoId) {

            // wait for api ready
            if (!isApiReady) {
                setTimeout(function () {
                    loadPlayer(videoId);
                }, 500);
                return false;
            }

            var videoPlayer = frames[videoId] && frames[videoId].player;

            if (!videoPlayer) {
                videoPlayer = new YKU.Player(getFrameId(videoId),{
                    styleid: '4',  // default '0'
                    client_id: '--',
                    vid: videoId,
                    autoplay: false,
                    events: {
                        onPlayEnd: function () {
                            frames[videoId].container.style.zIndex = -1;
                        }
                    }
                });

                frames[videoId].player = videoPlayer;
            }
        }

        function startPlay(videoId) {
            if (!frames[videoId]) {
                return false;
            }

            var container = frames[videoId].container;
            var player = $(container).find('.x-video-player')[0];
            if (player && player.src) {
                // android 下player.src是空的
                player.play();
                player.webkitRequestFullScreen();
                music.off();
            }
            else if (frames[videoId].player) {
                music.off();
                $(container).css('zIndex', 9999);
                frames[videoId].player.playVideo();
            }
            else {
                var tips = $('<span/>').addClass('err-msg').text('用户过多，请稍后再试!').appendTo($(document.body));
                tips.css({
                    marginLeft: -tips.outerWidth() / 2 + 'px'
                }).delay(3000).fadeOut(function () {
                    $(this).remove();
                });
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

        var isInited;

        return {
            play: startPlay,
            load: loadPlayer,
            stop: stop,
            init: function () {
                if (isInited) {
                    return false;
                }
                isInited = 1;

                $.ajax({
                    url: jsapi,
                    dataType: 'script',
                    cache: true,
                    success: function (data) {
                        isApiReady = 1;
                    }
                });
            }
        };
    })();

    return exports;
});