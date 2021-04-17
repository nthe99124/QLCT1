$(document).ready(function () {
    $(".fileUpload-container").each(function (index, element) {
        $.fn.dataTable.ext.errMode = 'throw';
        var strModuleId = $(element).attr('data-strModuleId');
        CheckPermissionForFileUpload(strModuleId);
        GetListUploadHistory(strModuleId);
    });
});

function InitFilesOnReady(parentSelector) {
    if (parentSelector == undefined || parentSelector == null) {
        $(".fileUpload-container").each(function (index, element) {
            var strModuleId = $(element).attr('data-strModuleId');
            CheckPermissionForFileUpload(strModuleId);
            GetListUploadHistory(strModuleId);

            //height:auto;
            if ($(element).parent().hasClass("task-file-wraper")) {
                $(element).css("height","auto");
            }
        });

    } else {
        $(parentSelector).each(function (index, element) {
            var strModuleId = $(element).attr('data-strModuleId');
            CheckPermissionForFileUpload(strModuleId);
            GetListUploadHistory(strModuleId);

            //height:auto;
            if ($(element).parent().hasClass("task-file-wraper")) {
                $(element).css("height", "auto");
            }
        });
    }
   
}

function CheckPermissionForFileUpload(strModuleId) {
    var objectId = $("#objectId_File-" + strModuleId).val();
    var moduleId = $("#moduleId_File-" + strModuleId).val();

    $.ajax({
        url: $("#urlAjaxGetPermissionForFile").val(),
        type: 'GET',
        data: { objectId: objectId, moduleId: moduleId },
        success: function (data) {
            if (data != null) {
                $('#checkPermissionFileUpload-' + strModuleId).val(data.Data);

                if (data.ResultCode == 1) {
                    $('#wrapper-table-file-upload-' + strModuleId).removeClass("hidden");
                   
                    $('#fileUpload_table-' + strModuleId).DataTable().ajax.reload();
                    $.fn.dataTable.ext.errMode = 'throw';
                } else {
                    if (!$('#wrapper-table-file-upload-' + strModuleId).hasClass("hidden")) {
                        $('#wrapper-table-file-upload-' + strModuleId).addClass("hidden");
                    }
                }
            }
        },
        error: function () {
            console.log("error");
        }
    });
}

function GetListUploadHistory(strModuleId) {
    var url = $("#urlGetFileUploadList").val();
    var urlDownloadDocumentFileUpload = $('#urlDownloadDocumentFileUpload').val();
    var session_username = $('#session_username').val();

    var isNoPermissionFileUpload = $('#isNoPermissionFileUpload').val();
    var isViewFileUpload = $('#isViewFileUpload').val();
    var isEditFileUpload = $('#isEditFileUpload').val();
    var isFullPermissionFileUpload = $('#isFullPermissionFileUpload').val();

    var table = $('#fileUpload_table-' + strModuleId).DataTable({
        paging: false,
        "scrollY": "200px",
        "scrollCollapse": true,
        "ordering": false,
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
            search: "Search:",
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
        },
        "processing": false,
        "serverSide": true,
        "ajax": {
            "url": url,
            type: 'GET',
            "dataType": "json",
            contentType: 'application/json; charset=utf-8',
            data: function (dt) {
                delete dt.columns;
                dt.objectId = $("#objectId_File-" + strModuleId).val();
                dt.moduleId = $("#moduleId_File-" + strModuleId).val();
            }
        },
        "columns": [
            //{ "data": "DisplayName", "orderable": false, "width": "120px", "className": "sorting_disabled" },
            { "data": "DisplayName", "orderable": false, "className": "sorting_disabled" },
            {
                "data": null,
                "orderable": false,
                "defaultContent": '',
                'className': 'text-center'
                
            }
        ],
        "lengthMenu": [[5, 10, 25, 50, 100, 200], [5, 10, 25, 50, 100, 200]],
        "info": true,
        "stateSave": true,
        'columnDefs': [
            {
                'targets': 0,
                'render': function (data, type, full, meta) {
                    // Lấy string để hiển thị
                    var str = '';
                    // thẻ a để download file
                    if (data !== null && data !== undefined && data.length > 1 && full["DisplayName"] !== null && full["DisplayName"] !== undefined && full["DisplayName"].length > 1) {
                        str += "<a href='" + urlDownloadDocumentFileUpload + "?fileUploadId=" + full["Id"] + "' target='_blank'  onclick=\"\">" + full["DisplayName"] + "</a>";

                        var createdBy = full["CreatedBy"];
                        var createdDate = "";
                        var objDate = moment(full["CreatedDate"]);
                        if (objDate) {
                            createdDate = objDate.format("HH:mm DD-MM-YYYY");
                        }
                        str += "<p><i>" + createdBy + "(" + createdDate +")"+"</i></p>";
                    }
                    return str;
                }
            },
            {
                'targets': -1,
                "data": null,
                'searchable': false,
                'orderable': false,
                'className': 'text-center',
                'render': function (data, type, full, meta) {
                    var str = "";
                    var checkPermissionFileUpload = $('#checkPermissionFileUpload-' + strModuleId).val();
                    
                    if (checkPermissionFileUpload == isFullPermissionFileUpload || checkPermissionFileUpload == isEditFileUpload) {
                        str += "<a class='delete-btn' onclick='DeleteFileUpload(" + data["Id"] + ",\"" + strModuleId + "\");' title='Xóa'>";
                        str += "<i class='fa fa-trash'></i>";
                        str += "</a>";
                    } else if (checkPermissionFileUpload == isViewFileUpload || checkPermissionFileUpload == isNoPermissionFileUpload) {
                        if (data["CreatedBy"] == session_username) {
                            str += "<a class='delete-btn' onclick='DeleteFileUpload(" + data["Id"] + ");' title='Xóa'>";
                            str += "<i class='fa fa-trash'></i>";
                            str += "</a>";
                        }
                    }
                    return str;
                }
            }
           
        ],
        "createdRow": function (row, data, dataIndex) {
            if (dataIndex % 2 !== 0) {
                $(row).addClass("row-gray");
            }

        }
    });

    $("#fileUpload_table-"+ strModuleId +"_filter").hide();
}

function DeleteFileUpload(fileId, strModuleId) {
    bootbox.confirm("Bạn chắc chắn muốn xóa file này?",
        function (result) {
            if (result) {
                $.ajax({
                    url: $("#urlDeleteFileUpload").val(),
                    type: 'POST',
                    data: { fileId: fileId },
                    success: function (data) {
                        if (data.ResultCode == 1) {
                            bootbox.alert('Xóa bản ghi thành công.');
                            // reload iframe
                            $('#fileUpload_table-' + strModuleId).DataTable().ajax.reload();
                            $.fn.dataTable.ext.errMode = 'throw';
                        } else if (data.ResultCode == -1) {
                            bootbox.alert('Bạn không có quyền xóa bản ghi này.');
                        } else {
                            bootbox.alert('Xóa bản ghi không thành công, vui lòng tải lại trang.');
                        }
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            }
        });
}

function FileBrowseFileUpload(objThis, strModuleId) {
    if ($(objThis).val() !== "") {
        var extend = "";
        var arr = $(objThis).val().split(".");
        if (arr.length > 0) {
            extend = arr[arr.length - 1];
        }
        if (extend.toLocaleLowerCase() === "exe") {
            bootbox.alert($("#msgFileUploadError").val());
            $(objThis).val("");
        } else {
            $(objThis).parent().removeClass("btn-success");
            $(objThis).parent().addClass("btn-primary");
            var file = $('#FileExcelFileUpload-' + strModuleId)[0].files[0];
            $(objThis).parent().find("span").html("[ " + file.name + " ]");
            if (extend.toLocaleLowerCase() == "png" || extend.toLocaleLowerCase() == "gif" || extend.toLocaleLowerCase() == "tiff"
                || extend.toLocaleLowerCase() == "jpg") {

                var sizeImg = objThis.files[0].size / 1024 / 1024;
                sizeImg = sizeImg.toFixed(2);
                if (sizeImg > 5) {
                    bootbox.alert('Kích thước ảnh không được quá 5MB!');
                    $(objThis).val("");
                } else {
                    if (objThis.files && objThis.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $('#divImageFileUpload-' + strModuleId).removeClass('hidden');
                            $('#ShowImageFileUpload-' + strModuleId)
                                .attr('src', e.target.result);
                        };

                        reader.readAsDataURL(objThis.files[0]);
                    }
                }
               
            }
          
        }
    }
}

$('#AddFileUpload').on('hidden.bs.modal', function () {
    $('#divImageFileUpload').addClass('hidden');
    $('#FileExcelFileUpload').val('');
    $('#FileExcelFileUpload').parent().find("span").html(" Chọn file ");
});

function CancelUploadFileUpload(objThis, strModuleId) {
    //$('#AddFileUpload-' + strModuleId).modal('hide');
    ClearDataFileUpload(strModuleId);
}

function ShowModalCreateFileUpload(strModuleId) {
    ClearDataFileUpload(strModuleId);
    $('#AddFileUpload-' + strModuleId).modal('show');
}

function UploadAndCreateFileUpload(strModuleId) {
    var objectId = $('#objectId_File-' + strModuleId).val();
    var moduleId = $('#moduleId_File-' + strModuleId).val();

    var selectedFile = $("#FileExcelFileUpload-" + strModuleId).get(0).files;
    var formData = new FormData();
    formData.append("file", selectedFile[0]);
    formData.append("objectId", objectId);
    formData.append("moduleId", moduleId);

    var urlAjaxUploadFileAndCreateFileUpload = $("#urlAjaxUploadFileAndCreateFileUpload").val();

    if ($('#FileExcelFileUpload-' + strModuleId).val() != "") {
        $.ajax({
            type: "POST",
            url: urlAjaxUploadFileAndCreateFileUpload,
            processData: false,
            contentType: false,
            data: formData,
            success: function (result) {
                if (result != null) {
                    if (result.ResultCode == 1) {
                        bootbox.alert('Upload file thành công.');
                        ClearDataFileUpload(strModuleId);
                        $('#AddFileUpload-' + strModuleId).modal('hide');
                        $('#fileUpload_table-' + strModuleId).DataTable().ajax.reload();
                    } else if (result.ResultCode == -1) {
                        ClearDataFileUpload(strModuleId);
                        $('#AddFileUpload-' + strModuleId).modal('hide');
                        bootbox.alert('Bạn không có quyền upload file.');
                    } else {
                        bootbox.alert(result.Message);
                    }
                } else {
                    bootbox.alert('Upload file không thành công. Vui lòng tải lại trang.');
                }
            },
            error: function () {
                alert("There was error uploading files!");
            }
        });
    } else {
        alert('Bạn phải chọn file cần upload');
    }
}

function ClearDataFileUpload(strModuleId) {
    $('#divImageFileUpload-' + strModuleId).addClass('hidden');
    $('#FileExcelFileUpload-' + strModuleId).val('');
    $('#FileExcelFileUpload-' + strModuleId).parent().find("span").html(" Chọn file ");
}

function CloseModalAddFileUpload(strModuleId){
    $('#AddFileUpload-' + strModuleId).modal('hide');
    ClearDataFileUpload(strModuleId);
}