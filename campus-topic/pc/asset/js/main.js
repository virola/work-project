define(function(){function t(){$("a.add-redirect").each(function(t,n){var o=$(n).attr("href");o+=(o.indexOf("?")>-1?"&":"?")+"redict_url="+encodeURIComponent(c),$(n).attr("href",o)}),$(".weixin").on("mouseover",function(){$(this).children("div").show()}).on("mouseout",function(){$(this).children("div").hide()})}function n(t,n){if(i)return alert("您已投票，请明天再来！"),!1;var o=$(".group .btn").eq(t),e=$(".popup .btn").eq(t),n=$.extend({},pageParams.postData,{option_id:o.attr("option")});$.post(pageParams.urlVote,n,function(t){if("ok"==t.status){var n=o.children("em"),r=parseInt(n.text(),10)+1;t.vote_count&&(r=t.vote_count),o.add(e).find("em").text(r),i=1,alert(t.msg)}else alert(t.msg),-1==t.login&&(window.location.href=u)},"json")}function o(){$(".group .btn").on("click",function(){var t=$(this),o=$(".group .btn").index(t);return n(o),!1}),$(".popup .btn").on("click",function(){var t=$(this),o=$(".popup .btn").index(t);return n(o),!1}),$(".photo").on("click",function(){var t=$(this),n=$(".photo").index(t);return e(n),!1}),$(".mask").on("click",function(){$(this).hide(),$(".popup").hide()}),$(".popup-close").on("click",function(){return $(this).closest(".popup").hide(),$(".mask").hide(),!1})}function e(t){var n=$(".popup-"+t);if(n.size()>0){n.show();var o=($(window).width()-n.width())/2,e=Math.max($(window).scrollTop()+100,550);n.css({left:o+"px",top:e+"px"})}$(".mask").show().height($(document.documentElement).height())}var i,r={},c=window.location.href,u="http://my."+pageParams.siteDomain+"/userCenter/login.html?redict_url="+encodeURIComponent(c);return r.init=function(){t(),o()},r});