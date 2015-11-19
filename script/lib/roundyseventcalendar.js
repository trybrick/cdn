var appKey = "GP3FPDWNOTHBBLQ4OITN";
var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

function dateFromUTC(dateAsString) {
    var pattern = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z/;
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
			var start_date = dateFromUTC(evnts.events[i].start.utc, '-');
			var end_date = dateFromUTC(evnts.events[i].end.utc, '-');
			var calendarEvent = {
				title: evnts.events[i].name.text,
				start: start_date,
				end: end_date,
				allDay: false,
				url: evnts.events[i].url
			};
			calendarEvents.push(calendarEvent);
		}
    }

    return calendarEvents;
}


jQuery(document).ready(function ($) {

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

    $.ajax({
      url: "https://www.eventbriteapi.com/v3/events/search/?organizer.id=" + options.id + "&token=" + appKey + "&sort_by=date&expand=venue",
      type: 'GET',
      dataType: 'json',
      context: this,
      success: function(json) {
        $('#calendar').fullCalendar({
            theme: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: false,
            events: roundysGetEvents(json)
        })

        // stop spinner
        spinner.stop();
      }
    });
});
