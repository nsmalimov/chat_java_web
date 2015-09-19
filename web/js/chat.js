
var startButton = $('#startButton');
var callButton = $('#callButton');
var hangupButton = $('#hangupButton');

var startTime;
var localVideo = $('#localVideo');
//alert(localVideo);
var remoteVideo = $('#remoteVideo');
//alert(remoteVideo);

var localStream;
var pc1;
var pc2;
var offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
}

function gotStream(stream) {
    trace('Received local stream');
    // Call the polyfill wrapper to attach the media stream to this element.
    attachMediaStream(localVideo, stream);
    localStream = stream;
    $("#callButton").prop('disabled', false);
}

function start() {
    trace('Requesting local stream');
    $("#startButton").prop('disabled', true);
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then(gotStream)
        .catch(function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
}

function call() {
    $("#callButton").prop('disabled', true);
    $("#hangupButton").prop('disabled', false);

    trace('Starting call');

    var servers = null;

    pc1 = new RTCPeerConnection(servers);
    trace('Created local peer connection object pc1');
    pc1.onicecandidate = function(e) {
        onIceCandidate(pc1, e);
    };

    pc2 = new RTCPeerConnection(servers);
    trace('Created remote peer connection object pc2');
    pc2.onicecandidate = function(e) {
        onIceCandidate(pc2, e);
    };

    pc1.oniceconnectionstatechange = function(e) {
        onIceStateChange(pc1, e);
    };
    pc2.oniceconnectionstatechange = function(e) {
        onIceStateChange(pc2, e);
    };

    pc2.onaddstream = gotRemoteStream;

    pc1.addStream(localStream);

    //alert(localStream);
    trace('Added local stream to pc1');

    trace('pc1 createOffer start');
    pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError,
        offerOptions);
}

function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
}

function onCreateOfferSuccess(desc) {
    trace('Offer from pc1\n' + desc.sdp);
    trace('pc1 setLocalDescription start');
    pc1.setLocalDescription(desc, function() {
        onSetLocalSuccess(pc1);
    }, onSetSessionDescriptionError);
    trace('pc2 setRemoteDescription start');
    pc2.setRemoteDescription(desc, function() {
        onSetRemoteSuccess(pc2);
    }, onSetSessionDescriptionError);
    trace('pc2 createAnswer start');
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
}

function onSetLocalSuccess(pc) {
    trace(getName(pc) + ' setLocalDescription complete');
}

function onSetRemoteSuccess(pc) {
    trace(getName(pc) + ' setRemoteDescription complete');
}

function onSetSessionDescriptionError(error) {
    trace('Failed to set session description: ' + error.toString());
}

function gotRemoteStream(e) {
    // Call the polyfill wrapper to attach the media stream to this element.
    attachMediaStream(remoteVideo, e.stream);
    trace('pc2 received remote stream');
}

function onCreateAnswerSuccess(desc) {
    trace('Answer from pc2:\n' + desc.sdp);
    trace('pc2 setLocalDescription start');
    pc2.setLocalDescription(desc, function() {
        onSetLocalSuccess(pc2);
    }, onSetSessionDescriptionError);
    trace('pc1 setRemoteDescription start');
    pc1.setRemoteDescription(desc, function() {
        onSetRemoteSuccess(pc1);
    }, onSetSessionDescriptionError);
}

function onIceCandidate(pc, event) {
    if (event.candidate) {
        getOtherPc(pc).addIceCandidate(new RTCIceCandidate(event.candidate),
            function() {
                onAddIceCandidateSuccess(pc);
            },
            function(err) {
                onAddIceCandidateError(pc, err);
            }
        );
        trace(getName(pc) + ' ICE candidate: \n' + event.candidate.candidate);
    }
}

function onAddIceCandidateSuccess(pc) {
    trace(getName(pc) + ' addIceCandidate success');
}

function onAddIceCandidateError(pc, error) {
    trace(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
}

function onIceStateChange(pc, event) {
    if (pc) {
        trace(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
        console.log('ICE state change event: ', event);
    }
}

function hangup() {
    trace('Ending call');
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;

    $("#hangupButton").prop('disabled', true);
    $("#callButton").prop('disabled', false);
}

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

function getNameServer(serverUrl) {
    $.ajax({
        url: serverUrl + "/chat",
        type: 'POST',
        data: createJsonGetName(),

        dataType: 'json',
        async: true,
        //contentType: 'application/json',

        success: function (event) {
            //var jsonGet = JSON.parse(event.data);
            $('#your_name').text("Hello " + event["answer"]);
        },
        error: function (xhr, status, error) {
        }
    });
}

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

function getNameServer(serverUrl) {
    $.ajax({
        url: serverUrl + "/chat",
        type: 'POST',
        data: createJsonGetName(),

        dataType: 'json',
        async: true,
        //contentType: 'application/json',

        success: function (event) {
            //var jsonGet = JSON.parse(event.data);
            $('#your_name').text("Hello " + event["answer"]);
        },
        error: function (xhr, status, error) {
        }
    });
}

$(document).ready(
    function () {
        $("#startButton").prop('disabled', false);
        $("#callButton").prop('disabled', true);
        $("#hangupButton").prop('disabled', true);

        //$("#startButton").click();
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

        getNameServer(serverPath);

        //$("head").append('<script type="text/javascript" src="' + "js/main.js" + '"></script>');

        var interlocutorName = "";

        $('#btn-input').val('');
        $('#text_input').val('');

        var ws = new WebSocket("ws://" + serverHostName + ":" + portName + "/chatwork");

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
                interlocutorName = jsonGet["interlocutor"];
                $("#interlocutor_name").text("You connected with: " + interlocutorName);
                $("#main_container").css("visibility", "visible");
            }

            if (answer == "message")
            {
                var clientName = $('#your_name').text().replace("Hello ", "");
                upDateChatBoxGet(clientName, jsonGet["message"]);
            }

            if (answer == "disconnect")
            {
                $("#stop_chat").prop('disabled', true);
                $("#start_chat").prop('disabled', false);
                $("#find_new_interlocutor").prop('disabled', true);
            }

        };

        ws.onclose = function (event) {};

        var newmsg_top = parseInt($('.panel-body')[0].scrollHeight);
        $('.panel-body').scrollTop(newmsg_top - 100);

        $("#start_chat").prop('disabled', false);
        $("#stop_chat").prop('disabled', true);
        $("#find_new_interlocutor").prop('disabled', true);

        $('#startButton').click(function () {
            start();
        });

        $('#callButton').click(function () {
            call();
            //alert("222");
        });

        //alert("333");

        $('#hangupButton').click(function () {
            hangup();
        });

        $('#start_chat').click(function () {
            var json_create = new Object();
            json_create.name = $('#your_name').text().replace("Hello ", "");
            json_create.command = "connect";
            var json = JSON.stringify(json_create);
            ws.send(json);

            $("#stop_chat").prop('disabled', false);
            $("#start_chat").prop('disabled', true);
            $("#find_new_interlocutor").prop('disabled', false);
        });

        $('#stop_chat').click(function () {

            var json_create = new Object();
            json_create.name = $('#your_name').text().replace("Hello ", "");
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
            json_create.name = $('#your_name').text().replace("Hello ", "");
            json_create.command = "find_interlocutor";
            var json = JSON.stringify(json_create);
            ws.send(json);
        });

        $('#btn-chat').click(function () {
            var messageText = $('#text_input').val();
            var json_create = new Object();
            var clientName = $('#your_name').text().replace("Hello ", "");
            json_create.name = clientName;
            json_create.command = "sent_message";
            json_create.message = messageText;
            var json = JSON.stringify(json_create);
            ws.send(json);

            upDateChatBoxSent("You", messageText);
        });

    }
);








