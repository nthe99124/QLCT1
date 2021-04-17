function DownLoadFile(path) {
    if (path != null && path != "") {
        $("#filePath").val(path);
        $("#cmdDownload").click();
    }
}

$(function () {
    var msg = $("#ErrorMessage").val();
    if (msg != "" && msg != null && msg != undefined) {
        bootbox.alert(msg);
    }
});

