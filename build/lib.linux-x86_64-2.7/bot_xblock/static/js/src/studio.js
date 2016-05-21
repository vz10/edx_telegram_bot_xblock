/**
 * Created by vZ on 5/17/16.
 */
function BotXBlockStudio(runtime, element) {

    function updateCount(result) {
       console.log(result);
    }

    var handlerUrl = runtime.handlerUrl(element, 'xblock_move');
    $(".reorderable-container").on("sortupdate", function(eventObject, ui) {
        var theoretical_part = $('#theoretical_part').children('li.studio-xblock-wrapper ').length; 
        var question_part = $('#question_part').children('li.studio-xblock-wrapper ').length;
        var positive_part = $('#positive_part').children('li.studio-xblock-wrapper ').length;
        var negative_part = $('#negative_part').children('li.studio-xblock-wrapper ').length;
        $(".component-placeholder").remove();
        console.log(theoretical_part);
        console.log(question_part);
        console.log(eventObject);
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"theoretical_part": theoretical_part, 
                                  "question_part": question_part,
                                  "positive_part": positive_part,
                                  "negative_part": negative_part}),
            async: false,
            success: updateCount
        });
    });

    $( ".reorderable-container" ).on( "sortstart", function( event, ui ) {
        $("ol:not(:has(li))").append('<li class="component-placeholder"><h3>Put something here</h3></li>')
    } );

   // $(".drag-handle").on("mouseover", function(){console.log('asdfsdf')});
    $(function ($) {

        console.log('studio js is here');
        /* Here's where you'd do things on page load. */
    });
}
