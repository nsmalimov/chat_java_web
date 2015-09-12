function login(jsonData){
    $.ajax({
        url: "http://localhost:8080/chat",
        type: 'POST',
        data: jsonData,

        dataType: 'json',
        async: true,
        //contentType: 'application/json',
 
        success: function (data) {
            alert("success");
        },
        error: function(xhr, status, error){
          alert("error");
        }
    });
}

function createJson() {
         var randomKey = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
         var json_create = new Object();
         json_create.name = $("#NameInput").val();
         json_create.keygen = $("#KeyInput").val();
         json_create.command = "1";
         json_create.randomKey = randomKey.toString();
         return JSON.stringify(json_create);
}

$(document).ready(
  function () {
     $("#NameInput").val("Ruslan");
     $("#KeyInput").val("29125-4L52L");

     $('#button_sent').click(function() {
         var jsonData = createJson();
         login(jsonData);

         var someKey = "11127585";
         alert(someKey);
         //window.location.href  = "http://localhost:8080/chat/" + someKey;
     });
  }
);
