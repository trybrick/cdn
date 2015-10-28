var appKey = "DSVLEK3VPRIJFXRLEG";
var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

function dateFromUTC(dateAsString, ymdDelimiter) {
    var pattern = new RegExp("(\\d{4})" + ymdDelimiter + "(\\d{2})" + ymdDelimiter + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})");
    var parts = dateAsString.match(pattern);

    return new Date(
              parseInt(parts[1])
            , parseInt(parts[2], 10) - 1
            , parseInt(parts[3], 10)
            , parseInt(parts[4], 10)
            , parseInt(parts[5], 10)
            , parseInt(parts[6], 10)
            , 0
          );
}



function roundysGetEvents(evnts) {
    var calendarEvents = new Array();
    if (evnts.events !== undefined) {
        var len = evnts.events.length;
        for (var i = 0; i < len; i++) {
            if (evnts.events[i].event !== undefined) {
                var start_date = dateFromUTC(evnts.events[i].event.start_date, '-');
                var end_date = dateFromUTC(evnts.events[i].event.end_date, '-');
                var calendarEvent = {
                    title: evnts.events[i].event.title,
                    start: start_date,
                    end: end_date,
                    allDay: false,
                    url: evnts.events[i].event.url

                };
                calendarEvents.push(calendarEvent);
            }
        }
    }

    return calendarEvents;
}

jQuery.noConflict();

jQuery(document).ready(function ($) {

    Eventbrite({ 'app_key': appKey }, function (eb) {

        // spinner options
        var spinnerOptions = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '40', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };


        // start spinner
        var target = document.getElementById('calendar');
        var spinner = new Spinner(spinnerOptions).spin(target);

        // define a few parameters to pass to the API
        // Options are listed here: http://developer.eventbrite.com/doc/organizers/organizer_list_events/
        var options = {
            'id': organizerId
           , 'status': "live,started"
           , 'app_key': appKey
        };

        $.getJSON('https://www.eventbrite.com/json/organizer_list_events?callback=?', options, function (response) {
            $('#calendar').fullCalendar({
                theme: true,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: false,
                events: roundysGetEvents(response)
            })

            // stop spinner
            spinner.stop();
        });
    });
});
