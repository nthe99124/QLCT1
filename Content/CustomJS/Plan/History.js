$(function () {
    var table = $('#historyTable').DataTable({
        "paging": false,
        "ordering": false,
        "info": false,
        "bFilter": false
    });

    $('#historyTable tbody').on('click',
        'td.details-control',
        function () {
            var tr = $(this).closest('tr').next().next();
            tr.toggle();
            $(this).toggleClass("open-detail close-detail");
        });

    $('#historyTable tbody').on('click',
        'td.history-action',
        function () {
            var input = $(this).find('input');
            HistoryAction($(input).val());
        });
});

function HistoryAction(planId) {
    $("#loading").addClass("loading");
    $('#historyActionContainer').html('');
    var url = $("#urlAjaxHistoryAction").val() + "?planId=" + planId;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#historyActionContainer').html(data);
            $("#HistoryActionTable").DataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                "bFilter": false
            });
            $("#loading").removeClass("loading");
            $("#historyActionModal").modal('show');
        },
        error: function (res) {
            console.log(res);
            $("#loading").removeClass("loading");
            bootbox.alert("Có lỗi xảy ra. Vui lòng tải lại trang");
        }
    });
}