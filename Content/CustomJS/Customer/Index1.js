
$("document").ready(function () {

    var StartDate = $('#StartDateHidden').val();
    var EndDate = $('#EndDateHidden').val();
    var TypeOfDebt = $('#TypeOfDebtHidden').val();
    $('#StartDate').val(convertDate(StartDate));
    $('#EndDate').val(convertDate(EndDate));
});
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? "0" + s : s; }

    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}
