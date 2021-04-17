$(document).ready(function () {

    $(function () {
        $('.date-time-picker').datetimepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            clearBtn: true,
            //format: $("#dateFormat").val(),
            //ignoreReadonly: true,
            //showClear: true,
           // locale: 'en-US'
        });
    });

});

$('#btnSubmitSearch').click(function () { $('#btn_submitpaging').click(); });

function ExportReport() {
    $('#cmd_export').click();
}
