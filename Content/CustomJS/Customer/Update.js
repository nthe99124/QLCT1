
$(document).ready(function () {
    
    var StartDate = $('#StartDateHidden').val();
    var EndDate = $('#EndDateHidden').val();
    var TypeOfDebt = $('#TypeOfDebtHidden').val();
    $('#StartDate').val(convertDate(StartDate));
    $('#EndDate').val(convertDate(EndDate));
});
$('#StartDate').change(function () {
    var StartDate = $('#StartDate').val().split("/");
    //var datestart = new Date(StartDate[2], StartDate[1], StartDate[0]);
    var datestart = new Date(2021, 5, 8);
    //var datestart = new Date();
    var datestartm = datestart.getDate()  ;
    var datestart1 = datestart.getMonth() + 1  ;
    var datestart2 = datestart.getFullYear();
    var datestart = new Date($('#StartDate').val());
    if ($('#TypeOfDebtHidden').val("1")) {
        $('#EndDate').val( new Date(datestart.setMonth(datestart.getMonth() + 7)));
    }
    else $('#EndDate').val(convertDate(datestart.setMonth(datestart.getMonth() + 13)));
})
$('#StartDate').datepicker({
    format: "dd/mm/yyyy",
    viewMode: "",
    minViewMode: "date"
});
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? "0" + s : s; }

    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}
debugger;
$(document).on("click", "#btn-edit", function () {

    if ($('#debt1').is(':checked')) {
        $('#TypeOfDebtHidden').val("1")
    }
    else $('#TypeOfDebtHidden').val("2")
});