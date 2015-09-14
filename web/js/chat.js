function chatSendMessage(message) {

    var json_create = new Object();
    json_create.name = $('#greeting').text().replace("Hello ", "");
    json_create.message = message;
    var json = JSON.stringify(json_create);

    ws.send(json);
    $(".chat").append('<li class="right clearfix"><span class="chat-img pull-left"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">You</strong></div><p>' + message + '</p></div></li>');
    $('#btn-input').val('');
    var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
    $('.panel-body').scrollTop(newmsg_top - 100);
}

function chatGetMessage(message) {
    $(".chat").append('<li class="left clearfix"><span class="chat-img pull-left"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">Interlocutor</strong></div><p>' + message + '</p></div></li>');
    var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
    $('.panel-body').scrollTop(newmsg_top - 100);
}

function createJson(text) {
    var json_create = new Object();
    json_create.command = text;
    return JSON.stringify(json_create);
}

function senderFunc(jsonData) {
    $.ajax({
        url: "http://localhost:8080/auto",
        type: 'POST',
        data: jsonData,

        dataType: 'json',
        async: true,
        //contentType: 'application/json',

        success: function (data) {
            alert("success");
        },
        error: function (xhr, status, error) {
            alert("error");
        }
    });
}

function createJsonGetName() {
    var json_create = new Object();
    json_create.command = "2";
    return JSON.stringify(json_create);
}

function getName() {
    $.ajax({
        url: "http://localhost:8080/chat",
        type: 'POST',
        data: createJsonGetName(),

        dataType: 'json',
        async: true,
        //contentType: 'application/json',

        success: function (data) {
            //alert(data['answer']);
            $('#greeting').text("Hello " + data["answer"]);
            //window.location.href = "http://localhost:8080/chat";
            //alert("success");
        },
        error: function (xhr, status, error) {
            //alert("error");
        }
    });
}

$(document).ready(
    function () {
        getName();
        serverUrl = "localhost:8080";
        ws = new WebSocket("ws://" + serverUrl + "/chat");

        ws.onopen = function (event) {};

        ws.onmessage = function (event) {
            try {

                var jsonGet = JSON.parse(event.data);

                //alert(event.data);
                var interlocutor = jsonGet["interlocutor"];
                if (interlocutor == "")
                {
                    alert("Free users not found");
                }
                else
                {
                    alert(interlocutor);
                }
            } catch(e) {}

            //chatGetMessage(event.data);
        };

        ws.onclose = function (event) {};

        var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
        $('.panel-body').scrollTop(newmsg_top - 100);

        $("#stop_chat").prop('disabled', true);
        $("#find_new_interlocutor").prop('disabled', true);


        var randomKey = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
        $("#keyNumber").val(randomKey);
        $('#btn-chat').click(function () {

            var message = $('#text_input').val();
            chatSendMessage(message);
        });

        $('#start_chat').click(function () {
            var json_create = new Object();
            json_create.name = $('#greeting').text().replace("Hello ", "");
            json_create.connect = "1";
            var json = JSON.stringify(json_create);
            ws.send(json);
            //alert("111");
        });




            //var commandJson = createJson("startchat");
            //var serverUrlAutorization = "http://" + serverUrl + "/";

            //senderFunc(commandJson);

            //$("#stop_chat").prop('disabled', false);
            //$("#start_chat").prop('disabled', true);
            //$("#find_new_interlocutor").prop('disabled', false);


    }
);








