// # Ref https://www.geeksforgeeks.org/how-to-send-data-from-client-side-to-node-js-server-using-ajax-without-page-reloading/

$(document).ready(function () {
   $("#submit").click(function (event) {
      event.preventDefault();
      $.post("/feedbackform",
         {
            fullnameInput : $('#fullnameInput').val() || " ",
            countryInput : $('#countryInput').val()|| " ",
            messageInput : $('#messageInput').val()|| " "
         },
         function (err, data, status) {
            console.log("data", err);
            if (err?.success) 
               alert("Thank you for your valuable feedback");
      
            else if (err?.error_msg) 
            
               alert(err?.error_msg);
            }
     )});
   });