/**
 * @file 高校推广移动端JS逻辑
 * @author  virola
 */

define(function (require) {

    var exports = {};

    var isVoted;
    var VOTE_TEXT = '您今天已点过赞，请明天再来！';

    function bindVoteEvents() {
        var url = window.location.href;
        var loginUrl = 'http://m.my.' + pageParams.siteDomain 
            + '/userCenter/login.html?redict_url=' + encodeURIComponent(url);

        $('.btn').on('click', function () {
            if (isVoted) {
                alert(VOTE_TEXT);
                return false;
            }

            var pageBtn = $(this);

            var data = $.extend({}, pageParams.postData, {
                'option_id': pageBtn.attr('option')
            });
            
            $.post(pageParams.urlVote, data, function( ret ) {
                if (ret.status == 'ok') {

                    var cnt = pageBtn.children('em');
                    var number = parseInt(cnt.text(), 10) + 1;

                    if (ret['vote_count']) {
                        number = ret['vote_count'];
                    }
                    
                    pageBtn.find('em').text(number);

                    isVoted = 1;
                    alert(ret.msg);
                } 
                else {
                    alert(ret.msg);
                    if (ret.login == -1) {
                        window.location.href = loginUrl;
                    }
                }
            }, 'json');

            return false;
        });
    }

    exports.init = function () {
        bindVoteEvents();
    };

    return exports;
});
