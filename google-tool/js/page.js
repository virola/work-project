$(function() {

    $('.reveal').on('click', function(e) {
        var target = e.target;

        console.log(target.tagName);
    });


    console.info('document ready.');

});
