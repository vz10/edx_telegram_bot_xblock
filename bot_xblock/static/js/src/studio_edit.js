function BotContainerStudio(runtime, element) {
    "use strict";

    console.log('PasswordContainerStudio: init')

    var getExistingGroupUrl = runtime.handlerUrl(element, 'get_existing_group');
    var $group_id = $(element).find('#id_group_id');
    $group_id.after($('<span>').addClass('count-instance'));
    $group_id.bind('keyup', function(e){
        var $span = $(this).siblings('span.count-instance').html('');
        var group_id = $(this).val();  // we'd like to display here the count of other instances of the same group, but we do not know how to count them for now
        console.log(group_id)
        if (group_id !== '') {
            var data = {'group_id': group_id}
            $.ajax({
                type: "POST",
                url: getExistingGroupUrl,
                data: JSON.stringify(data),
                success: function(response) {
                    console.log(response);
                    if (response !== {}) {
                        $(element).find('#passing_grade').val(response.passing_grade);
                    }
                }
            });
        }
    });
    // $group_id.trigger('keyup');

    var studio_submit = function(data) {
        console.log('PasswordContainerStudio: submiting')

        var handlerUrl = runtime.handlerUrl(element, 'submit_studio_edits');
        runtime.notify('save', {state: 'start', message: gettext("Saving")});
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify(data),
            dataType: "json",
            global: false,  // Disable Studio's error handling that conflicts with studio's notify('save') and notify('cancel') :-/
            success: function(response) {
                runtime.notify('save', {state: 'end'});
            }
        }).fail(function(jqXHR) {
            var message = gettext("This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.");
            if (jqXHR.responseText) { // Is there a more specific error message we can show?
                try {
                    message = JSON.parse(jqXHR.responseText).error;
                    if (typeof message === "object" && message.messages) {
                        // e.g. {"error": {"messages": [{"text": "Unknown user 'bob'!", "type": "error"}, ...]}} etc.
                        message = $.map(message.messages, function(msg) { return msg.text; }).join(", ");
                    }
                } catch (error) { message = jqXHR.responseText.substr(0, 300); }
            }
            runtime.notify('error', {title: gettext("Unable to update settings"), message: message});
        });
    };

    $('.save-button', element).bind('click', function(e) {
        console.log('PasswordContainerStudio: save')
        e.preventDefault();
        var fields = ['passing_grade']
        var values = {};
        values['passing_grade'] = $(element).find('[name="passing_grade"]').val();
        studio_submit({values: values});
    });

    $(element).find('.cancel-button').bind('click', function(e) {
        console.log('PasswordContainerStudio: cancel')

        e.preventDefault();
        runtime.notify('cancel', {});
    });
}

