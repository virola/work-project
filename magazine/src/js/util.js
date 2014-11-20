

var util = window.util || {};

/**
 * 对目标字符串进行格式化
 * @name util.format
 * @function
 * @grammar baidu.string.format(source, opts)
 * @param {string} source 目标字符串
 * @param {Object|string...} opts 提供相应数据的对象或多个字符串
 * @remark
 * 
    opts参数为“Object”时，替换目标字符串中的#{property name}部分。<br>
    opts为“string...”时，替换目标字符串中的#{0}、#{1}...部分。
        
 *             
 * @returns {string} 格式化后的字符串
 */
util.format = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
    if(data.length){
        data = data.length == 1 ? 
            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var replacer = data[key];
            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    return source;
};

/**
 * 微信分享代码
 * 
 * @param {Object} options 参数选项
 * @param {string} options.title 分享标题
 */
util.weixin = (function () {
    
    var _blankfn = function () {};

    if (typeof WeixinJSBridge == 'undefined') {
        return {
            init: _blankfn
        };
    }

    var exports = {};

    // 分享数据
    var shareData;

    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getNetworkType', {}, 
            function (e) {
                WeixinJSBridge.log(e.err_msg);
            }
        );

        WeixinJSBridge.on('menu:share:appmessage', function () {
            WeixinJSBridge.invoke('sendAppMessage', {
                img_url: shareData.icon,
                link: shareData.link,
                desc: shareData.content,
                title: shareData.title
            }, onShareComplete);
        });

        WeixinJSBridge.on('menu:share:timeline', function () {
            WeixinJSBridge.invoke('shareTimeline', {
                img_url: shareData.icon,
                img_width: 640,
                img_height: 640,
                link: shareData.link,
                desc: shareData.content,
                title: shareData.title
            }, onShareComplete);
        });
    }

    exports.init = function (options) {
        options = options || {};
        var docContent = document.querySelector('head>meta[name="description"]');
        shareData = {
            icon: options.icon || '/favicon.ico',
            title: options.title || document.title,
            link: options.link || window.location.href,
            content: options.content || (docContent ? docContent.content : document.title)
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

    return exports;
})();

if (typeof define === 'function' && define.amd) {
    define('util', [], function () {
        return util;
    });
}