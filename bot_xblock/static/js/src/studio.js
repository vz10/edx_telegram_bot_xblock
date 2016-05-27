

function check_xblocks_type() {
    $('section').removeClass('wrong_xblock');
    $('#negative_part section.wrapper-xblock:not(:has(header.xblock-header-html))').addClass('wrong_xblock');
    $('#positive_part section.wrapper-xblock:not(:has(header.xblock-header-html))').addClass('wrong_xblock');
    $('#question_part section.wrapper-xblock:not(:has(header.xblock-header-problem))').addClass('wrong_xblock');
    $('#theoretical_part section.wrapper-xblock:not(:has(header.xblock-header-html))').not(':has(header.xblock-header-video)').addClass('wrong_xblock');


}

/**
 * Created by vZ on 5/17/16.
 */
function BotXBlockStudio(runtime, element) {

    function consoleResult(result) {
       console.log(result);
    }

    var handlerUrl = runtime.handlerUrl(element, 'xblock_move');

    $(".reorderable-container").on("sortupdate", function(eventObject, ui) {
        check_xblocks_type();
        var theoretical_part = $('#theoretical_part').children('li.studio-xblock-wrapper ').length;
        var question_part = $('#question_part').children('li.studio-xblock-wrapper ').length;
        var positive_part = $('#positive_part').children('li.studio-xblock-wrapper ').length;
        var negative_part = $('#negative_part').children('li.studio-xblock-wrapper ').length;
        $(".component-placeholder").remove();
        $.ajax({
            type: "POST",
            url: handlerUrl.replace("preview/",''),
            data: JSON.stringify({"theoretical_part": theoretical_part,
                                  "question_part": question_part,
                                  "positive_part": positive_part,
                                  "negative_part": negative_part}),
            async: false,
            success: consoleResult
        });
    });

    $( ".reorderable-container").on( "sortstart", function( event, ui ) {
        $("ol:not(:has(li))").append('<li class="component-placeholder"><h3>Put something here</h3></li>')
    });

    $( ".reorderable-container" ).on("sort", function( event, ui ) {console.log('delete');} );

    $('#negative_part').on('DOMNodeInserted', '.studio-xblock-wrapper', function () {
        check_xblocks_type();
    });

   // $(".drag-handle").on("mouseover", function(){console.log('asdfsdf')});
    $(function ($) {
        /* Here's where you'd do things on page load. */
        check_xblocks_type();

    });
}
