function upDateChatBoxSent(name, message) {
    $(".chat").append('<li class="right clearfix"><span class="chat-img pull-left"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">' + name + '</strong></div><p>' + message + '</p></div></li>');
    $('#btn-input').val('');
    var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
    $('.panel-body').scrollTop(newmsg_top - 100);
}

function upDateChatBoxGet(name, message) {
    $(".chat").append('<li class="left clearfix"><span class="chat-img pull-left"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">' + name + '</strong></div><p>' + message + '</p></div></li>');
    var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
    $('.panel-body').scrollTop(newmsg_top - 100);
}

function createJson(text) {
    var json_create = new Object();
    json_create.command = text;
    return JSON.stringify(json_create);
}

function createJsonGetName() {
    var json_create = new Object();
    json_create.command = "2";
    return JSON.stringify(json_create);
}

function getName(serverUrl) {
    $.ajax({
        url: serverUrl + "/chat",
        type: 'POST',
        data: createJsonGetName(),

        dataType: 'json',
        async: true,
        //contentType: 'application/json',

        success: function (event) {
            //var jsonGet = JSON.parse(event.data);
            $('#greeting').text("Hello " + event["answer"]);
        },
        error: function (xhr, status, error) {
            //alert("error");
        }
    });
}

$(document).ready(
    function () {
        //имя пользователя другим post запросом


        var serverHostName = window.location.hostname;

        var serverProtocolName = window.location.protocol;

        var portName = window.location.port;

        if (portName.length == 0){portName = "80"; }
        var serverPath = serverProtocolName + "//" + serverHostName + ":" + portName;

        if (serverHostName != "localhost")
        {
            serverPath += "/roulette"
        }

        //alert(serverPath);

        getName(serverPath);

        //alert(serverPath);

        var interlocutorName = "";

        $('#btn-input').val('');

        ws = new WebSocket("ws://" + serverHostName + ":" + portName + "/chatwork");

        //alert(serverHostName);

        ws.onopen = function (event) {};



        ws.onmessage = function (event) {

            var jsonGet = JSON.parse(event.data);

            var answer = jsonGet["answer"];

            if (answer == "not_free_users")
            {
                $("#main_container").css("visibility", "hidden");
                //$("#stop_chat").prop('disabled', true);
                //$("#start_chat").prop('disabled', false);
                //$("#find_new_interlocutor").prop('disabled', true);
                //alert("Free users not found");
            }

            if (answer == "connected")
            {
                //alert("connected");
                interlocutorName = jsonGet["interlocutor"];
                $("#connected_with").text(interlocutorName);
                $("#main_container").css("visibility", "visible");
            }


            //alert(answer);
            if (answer == "message")
            {
                var clientName = $('#greeting').text().replace("Hello ", "");
                upDateChatBoxGet(clientName, jsonGet["message"]);
            }

            if (answer == "disconnect")
            {
                //alert("111");
                $("#stop_chat").prop('disabled', true);
                $("#start_chat").prop('disabled', false);
                $("#find_new_interlocutor").prop('disabled', true);
            }

            //upDateChatBoxGet(event.data);
        };

        ws.onclose = function (event) {};

        var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
        $('.panel-body').scrollTop(newmsg_top - 100);

        $("#start_chat").prop('disabled', false);
        $("#stop_chat").prop('disabled', true);
        $("#find_new_interlocutor").prop('disabled', true);

        $('#start_chat').click(function () {
            var json_create = new Object();
            json_create.name = $('#greeting').text().replace("Hello ", "");
            json_create.command = "connect";
            var json = JSON.stringify(json_create);
            ws.send(json);

            $("#stop_chat").prop('disabled', false);
            $("#start_chat").prop('disabled', true);
            $("#find_new_interlocutor").prop('disabled', false);
        });

        $('#stop_chat').click(function () {

            var json_create = new Object();
            json_create.name = $('#greeting').text().replace("Hello ", "");
            json_create.command = "disconnect";
            var json = JSON.stringify(json_create);
            ws.send(json);

            $("#stop_chat").prop('disabled', true);
            $("#start_chat").prop('disabled', false);
            $("#find_new_interlocutor").prop('disabled', true);
        });

        $('#find_new_interlocutor').click(function () {
            $('#start_chat').click();
            var json_create = new Object();
            json_create.name = $('#greeting').text().replace("Hello ", "");
            json_create.command = "find_interlocutor";
            var json = JSON.stringify(json_create);
            ws.send(json);
        });

        $('#btn-chat').click(function () {
            var messageText = $('#text_input').val();

            var json_create = new Object();
            var clientName = $('#greeting').text().replace("Hello ", "");
            json_create.name = clientName;
            json_create.command = "sent_message";
            json_create.message = messageText;
            var json = JSON.stringify(json_create);
            ws.send(json);

            upDateChatBoxSent("You", messageText);
        });

    }
);








