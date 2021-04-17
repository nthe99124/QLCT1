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

    $("#lstAmId").val($("#FilterOptions_AmId").val()).trigger("change");

    $('#recordlist').dataTable({
        paging: false,
        "searching": false,
        "bInfo": false,
        //"scrollX": true,
        "fixedHeader": {
            header: true,
        },
        columnDefs: [
            {
                'targets': 5,
                'type': "custom-date"
            }
        ],
        language: {
            emptyTable: "Không có dữ liệu",
            //info: "hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
            info: "Hiển thị: _TOTAL_ bản ghi",
            //infoEmpty: "Showing 0 to 0 of 0 entries",
            infoEmpty: "Hiển thị: 0 bản ghi",
            infoFiltered: "(đã lọc từ _MAX_ bản ghi)",
            lengthMenu: "Hiển thị _MENU_ mục",
            loadingRecords: "Loading...",
            processing: "Processing...",
            search: "Tìm kiếm:",
            zeroRecords: "Không có bản ghi nào",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            },
            aria: {
                sortAscending: ": activate to sort column ascending",
                sortDescending: ": activate to sort column descending"
            }
        },
        render: $.fn.dataTable.render.text(),
        "drawCallback": function (settings) {
            $('#tr-total').insertBefore('table > tbody > tr:first');
        },

    });

    if ($("#isOwner").val().toLowerCase() === "true") {
        $("#isOwnerCheckbox").prop('checked', true);
    } else {
        $("#isOwnerCheckbox").prop('checked', false);
    }


    if ($("#isInternal").val().toLowerCase()  === "true") {
        $("#isInternalCheckbox").prop('checked', true);
    } else {
        $("#isInternalCheckbox").prop('checked', false);
    }
       
});

$('#btnSubmitSearch').click(function () { $('#btn_submitpaging').click(); });

function ExportReport() {
    $('#cmd_export').click();
}

$(document).on("change", "#lstAmId", function () {
    $("#FilterOptions_AmId").val($("#lstAmId").val());
});

$(document).on("change", "#isOwnerCheckbox", function() {
    if ($("#isOwnerCheckbox").is(':checked')) {
        $("#isOwner").val(true);
    } else {
        $("#isOwner").val(false);
    }
});

$(document).on("change", "#isInternalCheckbox", function () {
    if ($("#isInternalCheckbox").is(':checked')) {
        $("#isInternal").val(true);
    } else {
        $("#isInternal").val(false);
    }
});

function SelectedTagsChanged() {
    var strVl = "";
    var dataTags = $('#select_report_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}