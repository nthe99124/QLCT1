
$("document").ready(function () {
    
    var firstDate = $('#hidden1').val();
    var f1 = convertDate(firstDate);
    var f2 = $("#StartDate1").val();
    
    debugger;
    $('#StartDate').val(convertDate(firstDate))
});
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? "0" + s : s; }

    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}