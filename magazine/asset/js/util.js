var util=window.util||{};util.format=function(e,n){e=String(e);var i=Array.prototype.slice.call(arguments,1),t=Object.prototype.toString;return i.length?(i=1==i.length&&null!==n&&/\[object Array\]|\[object Object\]/.test(t.call(n))?n:i,e.replace(/#\{(.+?)\}/g,function(e,n){var o=i[n];return"[object Function]"==t.call(o)&&(o=o(n)),"undefined"==typeof o?"":o})):e},util.weixin=function(){function e(){WeixinJSBridge.invoke("getNetworkType",{},function(e){WeixinJSBridge.log(e.err_msg)}),WeixinJSBridge.on("menu:share:appmessage",function(){WeixinJSBridge.invoke("sendAppMessage",{img_url:i.icon,link:i.link,desc:i.content,title:i.title},onShareComplete)}),WeixinJSBridge.on("menu:share:timeline",function(){WeixinJSBridge.invoke("shareTimeline",{img_url:i.icon,img_width:640,img_height:900,link:i.link,desc:i.content,title:i.title},onShareComplete)})}var n=function(){};if("undefined"==typeof WeixinJSBridge)return{init:n};var i,t={};return t.init=function(n){n=n||{};var t=document.querySelector('head>meta[name="description"]');i={icon:n.icon||"/favicon.ico",title:n.title||document.title,link:n.link||window.location.href,content:n.content||(t?t.content:document.title)},"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",e,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",e),document.attachEvent("onWeixinJSBridgeReady",e)):e()},t}(),"function"==typeof define&&define.amd&&define("util",[],function(){return util});