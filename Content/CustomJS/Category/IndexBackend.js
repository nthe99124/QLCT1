function DeleteItems(id) {
    var msgConfirmDelete = $("#msgConfirmDelete").val();
    $("#ListId").val(id);
    bootbox.confirm("" + msgConfirmDelete, function (result) {
        if (result == true) {
            $("#cmd_deletemulti").click();
        }
    });
}
function Approve(id) {
    $("#ListId").val(id);
    $("#cmdApprove").click();
}
function Reject(id) {
    $("#ListId").val(id);
    $("#cmdReject").click();
}


function SearchCate() {
    var pgr = $("#PaginationInfo_CurrentPageIndex");
    if ($("#PaginationInfo_CurrentPageIndex").length == 0) {
        pgr = $("#Pagging_CurrentPageIndex");
    }
    pgr.val(1);
    $("#cmd_submit_search").click();
}