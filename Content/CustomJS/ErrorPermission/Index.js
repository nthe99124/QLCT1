var timeleft = 30;
var home = $("#home_err").val();
var load = setInterval(function(){
    document.getElementById("progressBar").value = 30 - --timeleft;
    if (timeleft <= 0)
       window.location.href=home;
},1000);