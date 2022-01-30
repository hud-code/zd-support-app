let TICKET_ID = ""
let USER_ID = ""

$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '450px' });

  client.get('ticket.id').then(
    function(data) {
      var ticket_id = String(data['ticket.id']);
      TICKET_ID = ticket_id;
      setID(TICKET_ID);
    }
  );

  client.get('currentUser.email').then(
    function(data) {
      var user_id = String(data['currentUser.email']);
      USER_ID = user_id;
      setEmail(USER_ID);
    }
  );

});

function setID(ticketID) {
    document.getElementById("ticket_id").innerHTML = ticketID;
};

function setEmail(userID) {
    document.getElementById("requester").innerHTML = userID;
};

function submitForm() {
    var s = document.getElementById("sentiment");
    var sValue = s.options[s.selectedIndex].text;

    var f = document.getElementById("feedback");
    var fValue = f.options[f.selectedIndex].text;

    if (s.selectedIndex > 0) {
        document.getElementById("sentiment_warning").style = "display: none;";

        if (f.selectedIndex > 0) {
            document.getElementById("feedback_warning").style = "display: none;";

            var link = "https://circleci.zendesk.com/agent/tickets/" + TICKET_ID;
            var comments = document.getElementById("comments").value;
            var email = USER_ID;

            post(link, comments, sValue, fValue, email);

        } else {
            document.getElementById("feedback_warning").style = "color: red";
        };

    } else {
        document.getElementById("sentiment_warning").style = "color: red";
        if (f.selectedIndex > 0) {
            document.getElementById("feedback_warning").style = "display: none;";
        } else {
            document.getElementById("feedback_warning").style = "color: red";
        };
    };

    if ((s.selectedIndex > 0) && (f.selectedIndex > 0)) {
        document.getElementById("all_warning").style = "display: none;";
    } else {
        document.getElementById("all_warning").style = "color: red";
    };
};

function post(ticketLink, comments, sentiment, feedback, email) {

    var url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSckbwu4KtEYp98G7aqweO7LxqIZjoeOSUYmiv5YmteyrYu_JA/formResponse";

    var settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "crossDomain": true,
      "data": {
        "entry.1080900119": ticketLink,
        "entry.1083035082": comments,
        "entry.1157763885": sentiment,
        "entry.1174320195": feedback,
        "emailAddress": email
      }
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });

    finish();
};

function finish(response) {
    document.getElementById("form").style = "display: none;";
    document.getElementById("success").style = "display: inline;";
}