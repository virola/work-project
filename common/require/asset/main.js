
define(function (require) {

    function init() {
        $('#test').text((new Date()).toLocaleString());
    }

    return {
        init: init
    };
});