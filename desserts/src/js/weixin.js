/**
 * @file 微信分享代码
 * @author virola
 */
define(function (require) {
    
    var _blankfn = function () {};

    if (typeof WeixinJSBridge == 'undefined') {
        return {
            init: _blankfn
        };
    }

    var weixin = {};

    // 分享数据
    var shareData;

    var networkType;

    function shareFriend() {
        WeixinJSBridge.invoke('sendAppMessage', {
            'appid': '',
            'img_url': shareData.icon,
            'img_width': shareData.width,
            'img_height': shareData.height,
            'link': shareData.link,
            'desc': shareData.content,
            'title': shareData.title
        }, onShareComplete);
    }

    function shareWeibo() {
        WeixinJSBridge.invoke('shareWeibo', {
            'url': shareData.link,
            'content': shareData.content
        }, onShareComplete);
    }

    function shareTimeline() {
        WeixinJSBridge.invoke('shareTimeline', {
            'img_url': shareData.icon,
            'img_width': shareData.width,
            'img_height': shareData.height,
            'link': shareData.link,
            'desc': shareData.content,
            'title': shareData.title
        }, onShareComplete);
    }

    function onBridgeReady() {

        WeixinJSBridge.on('menu:share:appmessage', function () {
            shareFriend();
        });

        WeixinJSBridge.on('menu:share:timeline', function () {
            shareTimeline()
        });

        WeixinJSBridge.on('menu:share:weibo', function () {
            shareWeibo();
        });

        WeixinJSBridge.invoke(
            'getNetworkType', {}, 
            function (e) {
                networkType = e['err_msg'];
            }
        );
    }

    function onShareComplete() {
        // ...
    }

    weixin.getNetworkType = function () {
        return networkType;
    };

    /**
     * main 
     * 
     * @param {Object} options 参数选项
     * 
     * @param {string} title 分享标题
     * @param {string} icon 分享图标
     * @param {number} width 图标宽度
     * @param {number} height 图标高度
     * @param {string} link 分享url
     * @param {string} content 分享内容
     */
    weixin.init = function (options) {
        options = options || {};
        shareData = {
            icon: options.icon,
            width: options.width || 120,
            height: options.height || 120,
            title: options.title || document.title,
            link: options.link || window.location.href,
            content: options.content || ''
        };

        if (typeof WeixinJSBridge == 'undefined') {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }
            else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }
        else {
            onBridgeReady();
        }
    };

    return weixin;

});
