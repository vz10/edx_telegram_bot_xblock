/* Javascript for StudioEditableXBlockMixin. */
function BotContainerStudio(runtime, element) {
    "use strict";
    console.log(runtime);
    console.log(element);

    $('.save-button', element).bind('click', function(e) {
        console.log('PasswordContainerStudio: save')
        e.preventDefault();
    };

    $(element).find('.cancel-button').bind('click', function(e) {
        console.log('PasswordContainerStudio: cancel')

        e.preventDefault();
        runtime.notify('cancel', {});
    });
}