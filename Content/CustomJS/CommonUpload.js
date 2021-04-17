$(document).ready(function () {
    $("#btnUpdateData").click(function () {
        if ($(".fileBrowser").val() == "" || $(".fileBrowser").val() == null) {
            bootbox.alert($("#msgNotSelectFile").val());
            return false;
        } else {
            $("#btnSubmit").click();
        }
    });
});
function DownloadFileTemplate() {
    $("#cmdDownload").click();
}
function DownloadFileUploaded(filePath) {
    $("#filePath").val(filePath);
    $("#cmdDownload").click();
}
//Hàm xử lý chọn File
function fileBrowse(objThis) {
    if ($(objThis).val() != "") {
        var extend = "";
        var arr = $(objThis).val().split(".");
        if (arr.length > 0) {
            extend = arr[arr.length - 1];
        }
        if (extend.toLocaleLowerCase() === "xls" || extend.toLocaleLowerCase() === "xlsx") {
            $(objThis).parent().removeClass("btn-success");
            $(objThis).parent().addClass("btn-primary");
            var file = $('#FileExcel')[0].files[0];
            $(objThis).parent().find("span").html("[ " + file.name + " ]");
        }
        else {
            bootbox.alert($("#msgFileError").val());
            $(objThis).val("");
        }
    }
}