function login(jsonData){
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
        error: function(xhr, status, error){
          alert("error");
        }
    });
}

function createJson() { 
         var json_create = new Object();
         json_create.name = $("#NameInput").val();
         json_create.key = $("#KeyInput").val();
         json_create.command = "0";
         return JSON.stringify(json_create);
}

$(document).ready(
  function () {
     $("#NameInput").val("Руслан");
     $("#KeyInput").val("29125-4L52L");

     $('#button_sent').click(function() {
         var jsonData = createJson();
         login(jsonData);

         var someKey = "11127585";
         window.location.href  = "http://localhost:8080/hello/" + someKey;
     });
  }
);
