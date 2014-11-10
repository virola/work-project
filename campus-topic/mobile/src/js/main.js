/**
 * @file 高校推广移动端JS逻辑
 */
var main = (function (require) {

    var exports = {};

    var isVoted;
    var VOTE_TEXT = '您今天已点过赞，请明天再来！';

    function bindVoteEvents() {
        $('.btn').on('click', function () {
            if (isVoted) {
                alert(VOTE_TEXT);
                return false;
            }

            var pageBtn = $(this);

            var cnt = pageBtn.children('em');
            var number = parseInt(cnt.text(), 10) + 1;
            
            pageBtn.find('em').text(number);

            isVoted = 1;

            return false;
        });
    }

    exports.init = function () {
        bindVoteEvents();
    };

    return exports;
})();

main.init();