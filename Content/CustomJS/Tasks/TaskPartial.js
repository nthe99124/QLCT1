
//#region initial
var formdataTaskFiles;
$(function () {
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            $('.modal-backdrop').find('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    //detail
    $("#modal-task-detail").on("shown.bs.modal", function () {

    });

    $("#modal-task-detail").on("hidden.bs.modal", function (event) {
        if (event.target == this) {
            // event was triggered on this modal
            ResetTaskDetailForm();
        }
    });

    //edit
    $("#modal-task-edit").on("shown.bs.modal", function (event) {
        if (event.target == this) {
            // event was triggered on this modal
            formdataTaskFiles = new FormData();
        }
    });

    $("#modal-task-edit").on("hidden.bs.modal", function (event) {
        if (event.target == this) {
            // event was triggered on this modal
            ResetTaskEditForm();
        }

    });
    $("#modal-task-assign").on("hidden.bs.modal", function (event) {
        if (event.target == this) {
            // event was triggered on this modal
            ResetAssignTaskForm();
        }
    });

    InitTaskEditSelect();

    $("#fileInputTask").on("change", function () {
        var filesExts = 'doc,docx,xls,xlsx,csv,txt,zip,zar,jpg,jpeg,png,bmp,gif';
        var fileInput = document.getElementById('fileInputTask');
        //Iterating through each files selected in fileInput  
        for (i = 0; i < fileInput.files.length; i++) {
            var validFile = true;
            var sfilename = fileInput.files[i].name;
            var ext = "";
            try {
                var arrext = sfilename.split('.');
                ext = (arrext[arrext.length - 1]).toLocaleLowerCase();
                if (filesExts.indexOf(ext) == -1) {
                    validFile = false;
                    bootbox.alert("File không hợp lệ: " + ext + " <br/> Các định dạng file hợp lệ: " + filesExts);
                }
            } catch (e) {

            }
            if (validFile) {
                let srandomid = Math.random().toString(36).substring(7);
                formdataTaskFiles.append(sfilename, fileInput.files[i]);
                var markup = "<tr id='" + srandomid + "'><td>" + sfilename + "</td><td><a href='#' onclick='DeleteFileInTask(\"" + srandomid + "\",\"" + sfilename +
                    "\")'><span class='glyphicon glyphicon-remove red'></span></a></td></tr>"; // Binding the file name  
                $("#FilesListTask tbody").append(markup);
            }
        }
        chkatchtblInTask();
        $('#fileInputTask').val('');
    });

    ShowTaskOnRefererLink();

    $(".tasks-index-object").each(function (index, ele) {
        var oid = $(ele).data("oid");
        var module = $(ele).data("module");

        if (oid != "" && module != "") {
            LoadIndexModuleTask(oid, module, ele);
        }

    });

});

function InitTaskEditSelect() {
    //init các ô search user (reporter, assignee, viewer)
    //sửa lỗi không dùng dc select2 dc trên popup
    $.fn.modal.Constructor.prototype._enforceFocus = function () { };
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };

    $("#editTask-Assignee").select2({
        minimumInputLength: 2,
        allowClear: true,
        placeholder: "",
        width: '100%',
        ajax: {
            url: $("#urlSearchUserForTask").val(),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = {
                    keySearch: params.term,
                    valueField: 'id'
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
    });

    $("#assignTask-UserId").select2({
        minimumInputLength: 2,
        allowClear: true,
        placeholder: "",
        width: '100%',
        ajax: {
            url: $("#urlSearchUserForTask").val(),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = {
                    keySearch: params.term,
                    valueField: 'id'
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
    });


    $("#editTask-Viewer").select2({
        minimumInputLength: 2,
        allowClear: true,
        width: '100%',
        placeholder: "",
        ajax: {
            url: $("#urlSearchUserForTask").val(),
            dataType: 'json',
            data: function (params) {
                var query = {
                    keySearch: params.term,
                    valueField: 'username'
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (results) {
            var rs = JSON.stringify(results);
            var json = JSON.parse(rs);
            return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
        },
        templateSelection: function (results) {
            return "<div>" + results.text + "</div>";
        }
    });

    $("#editTask-ObjectId").select2({
        minimumInputLength: 2,
        allowClear: true,
        width: '100%',
        placeholder: '',
        ajax: {
            url: $("#urlSearchObjectForTask").val(),
            dataType: 'json',
            method: "POST",
            delay: 250,
            data: function (params) {
                var searchdt = $.extend({}, params, {
                    "moduletype": $("#editTask-TaskModule").val()
                });
                return searchdt;
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (results) {
            var rs = JSON.stringify(results);
            var json = JSON.parse(rs);
            return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
        },
        templateSelection: function (results) {
            return "<div>" + results.text + "</div>";
        }
    });

    $('input[required]').change(function (ele) {
        setTimeout(function () {
            ValidateTaskForm(ele.target);
        }, 50);

    });
    $('select.hasselect2[required]').change(function (ele) {
        setTimeout(function () {
            ValidateTaskForm(ele.target);
        }, 50);
    });
}

//#endregion initial

//#region Action region

var loadding = false;
function ShowTaskDetail(id) {

    if (!loadding) {

        loadding = true;
        //ajax lấy thông tin
        $.ajax({
            url: $("#urlDetailTask").val() + "?id=" + id,
            method: 'POST',
            success: function (data) {
                loadding = false;
                $("#lblTask-Title").html(data.Data.Task.Title);
                $("#lblTask-Title-detail").html(data.Data.Task.Title);

                $("#lblTask-Account").text(data.Data.AccountName);
                $("#lblTask-Opp").text(data.Data.OppName);

                $("#lblTask-Title-Status").text(data.Data.StatusText);

                if (data.Data.OppId != 0) {
                    $(".lbl-Opp").show();
                } else {
                    $(".lbl-Opp").hide();
                }

                if (data.Data.AccId != 0) {
                    $(".lbl-Account").show();
                } else {
                    $(".lbl-Account").hide();
                }

                $("#lblTask-Reporter").text(data.Data.Reporter.Username);
                $("#lblTask-Assignee").text(data.Data.Assignee.Username);

                $("#lblTask-TaskType").val(data.Data.Task.TaskType);
                var viewer = data.Data.Task.Viewers;
                viewer = viewer == null ? "" : viewer;
                if (viewer != "") {
                    viewer = viewer.replace(/,/g, ", ");
                }

                $("#lblTask-Viewer").text(viewer);
                if (data.Data.Task.TaskType==1) {
                    $("#lblTask-Viewer").parent().hide();
                } else {
                    $("#lblTask-Viewer").parent().show();
                }
              

                $("#lblTask-Desc").text(data.Data.Task.Description);
                $("#lblTask-Priority").text(data.Data.PriorityText);

                var ddvalue = moment(data.Data.Task.DueDate).format('DD/MM/YYYY');
                $("#lblTask-DueDate").text(ddvalue);

                if (data.Data.IsEdit) {
                    $("#btnEditTask").show();

                    $("#btnEditTask").off("click");
                    $("#btnEditTask").click(function () {
                        ShowTaskEdit(id, "#modal-task-detail");
                    });

                } else {
                    $("#btnEditTask").hide();
                    $("#btnEditTask").off("click");
                }

                parentId = data.Data.Task.ParentId;
                if (parentId > 0) {
                    //show cái đéo gì đó ra
                    $("#lblTask-Title-ParentTask").text(data.Data.ParentName);
                    $(".lblTask-Title-ParentTask").show();

                    $("#btnCreateSub").hide();
                } else {
                    $(".lblTask-Title-ParentTask").hide();
                    $("#lblTask-Title-ParentTask").text("");
                    $("#btnCreateSub").show();
                    $("#btnCreateSub").off("click");
                    $("#btnCreateSub").one("click", function () {
                        setTimeout(function () {
                            var prname = $("#lblTask-Title-detail").text();
                            ShowTaskEdit(0, "#modal-task-detail", data.Data.Task.ObjectId, data.Data.Task.TaskModule, data.Data.Task);
                        }, 100);

                    });
                }

                if (data.Data.IsUnfollow) {
                    // $("#btnUnfollowTask").show();
                    $("#btnUnfollowTask a span").text("Bỏ theo dõi");
                    $("#btnUnfollowTask a i").removeClass("fa-eye");
                    $("#btnUnfollowTask a i").addClass("fa-eye-slash");
                    //slash
                    $("#btnUnfollowTask a").off("click");
                    $("#btnUnfollowTask a").click(function () {
                        //function bỏ theo dõi
                        FollowTask(id, 0);
                    });
                } else {
                    // $("#btnUnfollowTask").show();
                    $("#btnUnfollowTask a span").text("Theo dõi");
                    $("#btnUnfollowTask a i").removeClass("fa-eye-slash");
                    $("#btnUnfollowTask a i").addClass("fa-eye");
                    $("#btnUnfollowTask a").off("click");
                    $("#btnUnfollowTask a").click(function () {
                        //function theo dõi
                        FollowTask(id, 1);
                    });
                }

                if (data.Data.IsAssign) {
                    $("#btnAssignTask").show();
                    $("#btnAssignTask").off("click");

                    SetSelectedItemToSelect2Ajax("#assignTask-UserId", data.Data.Assignee, "FullName", "Id");
                    $("#assignTask-UserId-old").val(data.Data.Assignee.Id);
                    $("#btnAssignTask").click(function () {
                        //function assign
                        $("#assignTask-TaskId").val(id);
                        ShowModalAssignTask();
                    });
                } else {
                    $("#btnAssignTask").hide();
                    $("#btnAssignTask").off("click");
                    $("#assignTask-TaskId").val("");
                    SetSelectedItemToSelect2Ajax("#assignTask-UserId", null, "FullName", "Id");
                    $("#assignTask-UserId-old").val("");
                }

                //sub-task 
                if (data.Data.SubTasks != null && data.Data.SubTasks.length > 0) {
                    $("#tblTask-SubTasks tbody").empty();
                    $(".sub-tasks").show();
                    $.each(data.Data.SubTasks, function (index, value) {
                        var tr = "<tr>";
                        tr += "<td> <span style='text-decoration: underline; cursor: pointer;' onclick='ShowTaskDetail(" + value.Task.Id + ")' > " + value.Task.Title + " </span> </td>";
                        var statusString = $('.Task-Status[data-id="' + value.Task.Status + '"]').val()
                        tr += "<td> " + statusString + " </td>";

                        tr += "<td> " + value.Assignee.Username + " </td>";
                        var ddvalue = moment(value.Task.DueDate).format('DD/MM/YYYY');
                        tr += "<td> " + ddvalue + " </td>";
                        tr += "<td>";
                        tr += "<div class='btn-group' role='group'>";
                        tr += "<button id='' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
                        tr += "<i class='fa fa-caret-down' aria-hidden='true'></i> ";
                        tr += "</button> ";
                        tr += "<div class='dropdown-menu dropdown-menu-right' aria-labelledby=''>";
                        tr += "<li> <a onclick='ShowTaskDetail(" + value.Task.Id + ")' title='Chi tiết' class='padding-right-5'><i class='fa fa-eye padding-left-5 padding-right-10'></i>Chi tiết</a> </li>";
                        tr += "<li class='disabled' style='border-bottom: 1px solid black'></li>";

                        $.each(value.ListTransition, function (index2, value2) {
                            tr += "<li> <a onclick='ChangeTaskStatus(" + value2.ObjId + ", " + value2.TransValue + ", \"" + value2.Label + "\")' style='color: " + value2.Color + "'  title='' class='padding-right-5'><i class='fa fa-pencil padding-left-5 padding-right-10'></i> " + value2.Label + "</a> </li> ";
                        });

                        tr += "</div>";
                        tr += "</div>";
                        tr += "</td>";
                        tr += "</tr>";
                        $("#tblTask-SubTasks tbody").append(tr);
                    });
                } else {
                    $("#tblTask-SubTasks tbody").empty();
                    $(".sub-tasks").hide();
                }
                LoadCommentIndexForTask(id);
                LoadFilesIndexForTask(id);
                //trans
                $("#task-transitions").empty();
                if (data.Data.ListTransition.length < 1) {
                    $("#target-dropdown-container").hide();
                } else {
                    $("#target-dropdown-container").show();
                }
                $.each(data.Data.ListTransition, function (index, value) {
                    var btn = "<li class=' '> <a href='javascript:;' style='color: " + value.Color + "' onclick='ChangeTaskStatus(" + value.ObjId + ", " + value.TransValue + ", \"" + value.Label + "\")'> " + value.Label + " </a> </li> ";
                    $("#task-transitions").append(btn);

                });

                //chưa show thì ms show
                if (!($("#modal-task-detail").data('bs.modal') || {}).isShown) {
                    $("#modal-task-detail").modal("show");
                }

            },
            error: function () {
                loadding = false;
                bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                    window.location = window.location;
                });
            }
        });
    }
}

var loadding2 = false;
function ShowTaskEdit(id, dismissmodal, idobject, typeobject, parent) {//parentId, parentName, parentDuedate
    formdataTaskFiles = new FormData();
    if (dismissmodal != undefined && dismissmodal != '') {
        $(dismissmodal).modal("hide");
    }
    parent = parent == undefined ? {} : parent;
    if (id != 0) {
        if (!loadding2) {
            loadding2 = true;
            //ajax lấy thông tin
            $.ajax({
                url: $("#urlDetailTask").val() + "?id=" + id,
                method: 'POST',
                success: function (data) {
                    loadding2 = false;
                    if (data.Data.IsEdit) {
                        //edit thì clear form data
                        $(".Attachments").hide();

                        $("#editTask-Title").html(data.Data.Task.Title);

                        $("#editTask-Title-detail").val(htmlDecode(data.Data.Task.Title));
                        //$("#editTask-Title-detail").val((data.Data.Task.Title));

                        //$("#editTask-Account").val(data.Data.AccountName);
                        //$("#editTask-Opp").val(data.Data.OppName);

                        $("#editTask-Title-Status").val(data.Data.StatusText);

                        $("#editTask-Type").val(data.Data.Task.TaskType).trigger("change");
                        $("#editTask-Type").prop('disabled', true);
                        //đã tạo rồi thì phải cancel, không cho sửa account/ opp gắn với nó
                        //hoặc tạo object ở màn hình cơ hội/ khách hàng thì ko cho chọn module

                        //$("#editTask-TaskModule").val(data.Data.Task.TaskModule);
                        $(".editTask-TaskModule").hide();


                        //$("#editTask-TaskModule").val(data.Data.Task.TaskModule);
                        idobject = data.Data.Task.ObjectId;
                        typeobject = data.Data.Task.TaskModule;

                        if (data.Data.Task.ParentId > 0) {
                            //show cái đéo gì đó ra
                            $("#editTask-Title-ParentTask").html(data.Data.ParentName);
                            $("#editTask-DueDate-ParentTask").val(data.Data.Parent.DueDate);
                            $(".editTask-Title-ParentTask").show();

                        } else {
                            $("#editTask-Title-ParentTask").html('');
                            $(".editTask-Title-ParentTask").hide();
                        }

                        //$("#editTask-Assignee").val(data.Data.Assignee.Username);
                        SetSelectedItemToSelect2Ajax("#editTask-Assignee", data.Data.Assignee, "FullName", "Id");

                        SetSelectedItemToSelect2Ajax("#editTask-Viewer", data.Data.Viewer, "FullName", "Username");


                        $("#editTask-Desc").val(data.Data.Task.Description);
                        $("#editTask-Priority").val(data.Data.Task.Priority);

                        var ddvalue = moment(data.Data.Task.DueDate).format('DD/MM/YYYY');
                        $("#editTask-DueDate").val(ddvalue);
                        $("#modal-task-edit").modal("show");
                        $("#btn-save-task").off("click");
                        $("#btn-save-task").one("click", function () {
                            SaveTask(id, idobject, typeobject, data.Data.Task.ParentId);
                        });

                    } else {
                        bootbox.alert("Không thể sửa task, vui lòng thử lại sau!", function () {
                            window.location = window.location;
                        });
                    }
                },
                error: function () {
                    loadding2 = false;
                    bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                        window.location = window.location;
                    });
                }
            });
        }
    } else {
        $(".Attachments").show();

        $("#editTask-Type").val('0');
        $("#editTask-Type").trigger('change');


        if (parent.Id != undefined && parent.Id > 0) {
            $(".editTask-TaskModule").hide();
            //show cái đéo gì đó ra
            $("#editTask-Title-ParentTask").html(parent.Title);
            $("#editTask-DueDate-ParentTask").val(parent.DueDate);
            $(".editTask-Title-ParentTask").show();

            //lấy type của thằng cha
            console.log(parent);
            $("#editTask-Type").val(parent.TaskType).trigger("change");
            $("#editTask-Type").prop('disabled', true);
        } else {
            //ẩn parent title
            $("#editTask-Title-ParentTask").html('');
            $("#editTask-DueDate-ParentTask").val("");
            $(".editTask-Title-ParentTask").hide();
            $(".editTask-TaskModule").show();
        }

        //ẩn hiện các ô theo typeobject
        if (typeobject != '') {
            $(".editTask-TaskModule").hide();
            $("#editTask-TaskModule").val(typeobject);
            $("#editTask-TaskModule").trigger('change');
            SetSelectedItemToSelect2Ajax("#editTask-ObjectId", { Text: "", Id: idobject }, "Text", "Id");

        } else {
            $("#editTask-TaskModule").val('None');
            $("#editTask-TaskModule").trigger('change');
            $(".editTask-TaskModule").show();
        }





        $("#modal-task-edit").modal("show");
        $("#btn-save-task").off("click");
        $("#btn-save-task").one("click", function () {
            SaveTask(id, idobject, typeobject, parent.Id);
        });
    }
}

function CallBackTaskEdit() {

    $("input.FunctionNameCallbackEdit").each(function (id, ele) {
        var functionname = $(ele).val();
        if (functionname != null && functionname != undefined && functionname != null) {
            if (typeof window[functionname] === "function") {
                window[functionname]();
            }
        }
    });


}

function SaveTask(id, idobject, typeobject, parentId) {
    //id: id taskc
    //idobject: id cơ hội, KH nếu có, id task>0 thì ko cần
    //typeobject: type cơ hội, khách hàng
    //bỏ qua idobject và typeobject nếu id>0
    if (!ValidateTaskForm()) {
        console.log("init click");
        $("#btn-save-task").off("click");
        $("#btn-save-task").one("click", function () {
            SaveTask(id, idobject, typeobject, parentId);
        });
        return;
    }
    parentId = parentId == undefined ? 0 : parentId;
    ShowBlockTaskLayer("taskeditblock", true);
    //dùng form data để post cả file
    //formdataTaskFiles
    var title = htmlEncode($("#editTask-Title-detail").val());
    var taskType = $("#editTask-Type").val();

    var TaskModule = $("#editTask-TaskModule").val(); //==typeobject
    var ObjectId = $("#editTask-ObjectId").val();

    var Assignee = $("#editTask-Assignee").val();//ass là single select=> trả về là str, ko phải array

    var Viewer = $("#editTask-Viewer").val();//nullable 
    var Viewerstr = Viewer == null ? "" : Viewer.join();

    var TaskDesc = htmlEncode($("#editTask-Desc").val());
    var Priority = $("#editTask-Priority").val();
    var DueDate = $("#editTask-DueDate").val();

    formdataTaskFiles.delete("Id");
    formdataTaskFiles.append("Id", id);

    formdataTaskFiles.delete("TaskModule");
    formdataTaskFiles.delete("ObjectId");
    formdataTaskFiles.delete("ParentId");
    //tạo mới thì ms cho đổi object/ loại
    if (id == 0) {
        if (typeobject == '') {
            typeobject = TaskModule;
            idobject = ObjectId;
        }

        formdataTaskFiles.append("TaskModule", typeobject);
        formdataTaskFiles.append("ObjectId", idobject);
        formdataTaskFiles.append("ParentId", parentId);

    } else {
        //nếu id >0 thì ko quan tâm đến module và object id, parent id
    }

    formdataTaskFiles.delete("Assignee");
    formdataTaskFiles.append("Assignee", Assignee);

    formdataTaskFiles.delete("Viewers");
    formdataTaskFiles.append("Viewers", Viewerstr);

    formdataTaskFiles.delete("Description");
    formdataTaskFiles.append("Description", TaskDesc);

    formdataTaskFiles.delete("Priority");
    formdataTaskFiles.append("Priority", Priority);

    formdataTaskFiles.delete("DueDateText");
    formdataTaskFiles.append("DueDateText", DueDate);

    formdataTaskFiles.delete("Title");
    formdataTaskFiles.append("Title", title);

    formdataTaskFiles.delete("TaskType");
    formdataTaskFiles.append("TaskType", taskType);

    var urlCreate = $("#urlAjaxCreateTask").val();
    $.ajax({
        url: urlCreate,
        method: 'POST',
        processData: false,
        contentType: false,
        async: false,
        data: formdataTaskFiles,
        success: function (dt) {
            ShowBlockTaskLayer("taskeditblock", false);

            if (dt != undefined && dt != null) {
                bootbox.alert(dt.Message, function () {
                    if (dt.ResultCode == 1) {
                        //khi hide, tự clear data rồi
                        $("#modal-task-edit").modal("hide");
                        CallBackTaskEdit();
                    } else {
                        $("#btn-save-task").off("click");
                        $("#btn-save-task").one("click", function () {
                            SaveTask(id, idobject, typeobject, parentId);
                        });
                    }
                });

            } else {
                bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                    window.location = window.location;
                    $("#btn-save-task").off("click");
                    $("#btn-save-task").one("click", function () {
                        SaveTask(id, idobject, typeobject, parentId);
                    });
                });
            }
        },
        error: function (xhr) {
            ShowBlockTaskLayer("taskeditblock", false);
            bootbox.alert("Có lỗi xảy ra, vui lòng thử lại");
            $("#btn-save-task").off("click");
            $("#btn-save-task").one("click", function () {
                SaveTask(id, idobject, typeobject, parentId);
            });
        }
    });

}

function ValidateTaskForm(item) {

    var isValid = true;
    if (item == undefined) {
        //help-block
        $('input[required]:visible').each(function (index, value) {
            if ($(value).val() == '' || $(value).val() == null || $(value).val() == undefined) {
                $(value).parent().parent().addClass("has-error");
                $(value).parent().find(".help-block").show();
                isValid = false;
            } else {
                $(value).parent().parent().removeClass("has-error");
                $(value).parent().find(".help-block").hide();
            }
        });
        $('select.hasselect2[required]:visible').each(function (index, value) {
            if ($(value).val() == '' || $(value).val() == null || $(value).val() == undefined) {
                $(value).parent().parent().addClass("has-error");
                $(value).parent().find(".help-block").show();
                isValid = false;
            } else {
                $(value).parent().parent().removeClass("has-error");
                $(value).parent().find(".help-block").hide();
            }
        });
    } else {
        if ($(item).is(':visible')) {
            if ($(item).val() == '' || $(item).val() == null || $(item).val() == undefined) {
                $(item).parent().parent().addClass("has-error");
                $(item).parent().find(".help-block").show();
                isValid = false;
            } else {
                $(item).parent().parent().removeClass("has-error");
                $(item).parent().find(".help-block").hide();
            }
        } else {
            $(item).parent().parent().removeClass("has-error");
            $(item).parent().find(".help-block").hide();
        }

    }
    if (item == undefined || (item != undefined && $(item).hasClass("duedate"))) {
        if (isValid) {
            item = item == undefined ? "#editTask-DueDate" : item;
            var parentDue = $("#editTask-DueDate-ParentTask").val();

            if (parentDue != null && parentDue != '') {
                var prDate = moment(parentDue);//.format('DD/MM/YYYY');
                var thisValue = $(item).val();
                var thisDt = moment(thisValue, 'DD/MM/YYYY', true);

                var prDateStr = moment(parentDue).format('DD/MM/YYYY');
                if (thisDt > prDate) {
                    $(item).parent().parent().addClass("has-error");
                    $(item).parent().find(".help-block-date").show();

                    $(item).parent().find(".help-block-date").text("Ngày đến hạn của subtask phải <= ngày đến hạn task cha:" + prDateStr);
                    //
                    isValid = false;
                } else {
                    $(item).parent().find(".help-block-date").hide();
                    $(item).parent().parent().removeClass("has-error");
                    $(item).parent().find(".help-block-date").text("");
                }
            }

        }
    }
    //editTask-DueDate-ParentTask
    return isValid;
}

function ChangeTaskStatus(id, status, statusname) {
    bootbox.confirm("Bạn có chắc chắn muốn chuyển trạng thái sang <b>" + statusname + "</b>", function (chk) {
        if (chk) {
            var urlChangestatus = $("#urlAjaxChangeStatus").val();
            ShowBlockTaskLayer("taskdetailblock", false);
            $.ajax({
                url: urlChangestatus + "?id=" + id + "&status=" + status,
                method: 'POST',
                processData: false,
                contentType: false,
                async: false,
                success: function (dt) {
                    ShowBlockTaskLayer("taskdetailblock", false);
                    if (dt != undefined && dt != null && dt != "") {
                        bootbox.alert(dt.Message, function () {
                            ResetTaskDetailForm();
                            ShowTaskDetail(id);
                            CallBackTaskEdit();
                        });

                    } else {
                        bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                            window.location = window.location;
                        });
                    }
                },
                error: function (xhr) {
                    ShowBlockTaskLayer("taskdetailblock", false);
                    bootbox.alert("Có lỗi xảy ra, vui lòng thử lại");
                }
            });
        }
    });
}

function ShowModalAssignTask() {
    $("#modal-task-assign").modal("show");
}


function AssignTask() {
    var selected = $("#assignTask-UserId").val();
    var id = $("#assignTask-TaskId").val();

    if (selected == null || selected == "") {
        bootbox.alert("Bạn phải chọn người để chuyển giao!");
    } else {
        if (selected == $("#assignTask-UserId-old").val()) {
            $("#modal-task-assign").modal("hide");
            return;
        }

        bootbox.confirm("Bạn có chắc chắn muốn chuyển giao task này cho <b>" + $("#assignTask-UserId option:selected").text() + "</b>", function (chk) {
            if (chk) {
                var urlChangestatus = $("#urlAjaxAssignTask").val();
                ShowBlockTaskLayer("taskassignblock", false);
                $.ajax({
                    url: urlChangestatus + "?id=" + id + "&u=" + selected,
                    method: 'POST',
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (dt) {

                        ShowBlockTaskLayer("taskassignblock", false);
                        $("#modal-task-assign").modal("hide");
                        if (dt != undefined && dt != null && dt != "") {
                            bootbox.alert(dt.Message, function () {
                                ResetTaskDetailForm();
                                ShowTaskDetail(id);
                                CallBackTaskEdit();
                            });

                        } else {
                            bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                                window.location = window.location;
                            });
                        }
                    },
                    error: function (xhr) {
                        ShowBlockTaskLayer("taskassignblock", false);
                        $("#modal-task-assign").modal("hide");
                        bootbox.alert("Có lỗi xảy ra, vui lòng thử lại");
                    }
                });
            }
        });
    }
}

function FollowTask(id, isFollow) {

    bootbox.confirm("Bạn có chắc chắn muốn theo dõi task này?", function (chk) {
        if (chk) {
            var urlFollow = $("#urlAjaxUnfollow").val();
            ShowBlockTaskLayer("taskassignblock", false);
            $.ajax({
                url: urlFollow + "?id=" + id + "&follow=" + isFollow,
                method: 'POST',
                processData: false,
                contentType: false,
                async: false,
                success: function (dt) {
                    ShowBlockTaskLayer("taskassignblock", false);
                    $("#modal-task-assign").modal("hide");
                    if (dt != undefined && dt != null && dt != "") {
                        bootbox.alert(dt.Message, function () {
                            ResetTaskDetailForm();
                            ShowTaskDetail(id);
                            CallBackTaskEdit();
                        });

                    } else {
                        bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                            window.location = window.location;
                        });
                    }
                },
                error: function (xhr) {
                    ShowBlockTaskLayer("taskassignblock", false);
                    $("#modal-task-assign").modal("hide");
                    bootbox.alert("Có lỗi xảy ra, vui lòng thử lại");
                }
            });
        }
    });

}

//check task từ referer link
function ShowTaskOnRefererLink() {
    var url_string = location.href; //window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("task");
    if (c != null && c != undefined && c != "") {
        //show task detail
        setTimeout(function () {
            ShowTaskDetail(c);
        }, 10)

        //đổi url
        url.searchParams.delete("task");
        history.replaceState({}, document.title, url.toString());
    }

}

//#endregion

//#region event edit modal

function OnchangeTaskType() {
    //show/hide ô assignee
    var valueTasktype = $("#editTask-Type").val();
    if (valueTasktype == '1') {
        $("#editTask-Assignee").val(null).trigger("change");
        $(".editTask-Assignee").hide();
        $("#editTask-Viewer").parent().parent().hide();
    } else {
        $(".editTask-Assignee").show();
        $("#editTask-Viewer").parent().parent().show();

    }
}

function OnchangeTaskModule() {
    //init lại ô search
    var valueTaskModule = $("#editTask-TaskModule").val();
    $("#editTask-ObjectId").val(null).trigger("change");

    if (valueTaskModule == 'None') {
        $("#editTask-ObjectId").val(null).trigger("change");
        $(".editTask-ObjectId").hide();
    } else {
        //init select2 search
        $(".editTask-ObjectId").show();

        //select2 destroy
        try {
            //ko cần destroy
            //TryDestroySelec2("#editTask-ObjectId");
        } catch (e) {
            //ignore
        }
    }
}

function DeleteFileInTask(Fileid, FileName) {
    formdataTaskFiles.delete(FileName)
    $("#" + Fileid).remove();
    chkatchtblInTask();
}
function chkatchtblInTask() {
    if ($('#FilesListTask tr').length > 0) {
        $("#FilesListTask").css("visibility", "visible");
    } else {
        $("#FilesListTask").css("visibility", "hidden");
    }
}


function ResetTaskEditForm() {
    //clear edit modal
    $("#editTask-Title").html("");
    $("#editTask-Title-detail").val("");
    $("#editTask-Title-Status").text("");

    $("#editTask-Account").val("");
    $("#editTask-Opp").val("");

    $("#editTask-Reporter").val("");

    $("#editTask-Desc").val("");
    $("#editTask-DueDate").val("");

    $("#editTask-Type").val(0);

    $("#editTask-Priority").val(0);

    $("#editTask-Title-ParentTask").html("");
    $("editTask-Title-ParentTask").hide();
    $("#editTask-DueDate-ParentTask").val("");

    $("#editTask-Assignee").val(null).trigger("change");
    $("#editTask-Assignee").empty();
    $("#editTask-Viewer").val(null).trigger("change");
    $("#editTask-Viewer").empty();
    $("#editTask-ObjectId").val(null).trigger("change");
    $("#editTask-ObjectId").empty();

    $("#editTask-Type").prop('disabled', false);

    $("#FilesListTask tbody").empty();

    try {
        //ko cần destroy
        //TryDestroySelec2("#editTask-ObjectId");
    } catch (e) {
        //ignore
    }
    formdataTaskFiles = new FormData();
    $(".editTask-TaskModule").show();

    $("#btn-save-task").off("click");

}

function ResetTaskDetailForm() {
    //clear detail modal
    $("#lblTask-Title").html("");
    $("#lblTask-Title-detail").html("");
    $("#lblTask-Title-Status").text("");

    $("#lblTask-Account").text("");
    $("#lblTask-Opp").text("");

    $("#lblTask-Reporter").text("");
    $("#lblTask-Assignee").text("");

    $("#lblTask-Viewer").text("");
    $("#lblTask-Desc").text("");
    $("#lblTask-DueDate").text("");

    $("#lblTask-Title-ParentTask").text("");
    $("lblTask-Title-ParentTask").hide();

    $("#lblTask-Priority").text("");
    $("#btnUnfollowTask a").off("click");
    $("#btnUnfollowTask a i").removeClass("fa-eye-slash");
    $("#btnUnfollowTask a i").removeClass("fa-eye");
    $("#btnCreateSub").show();
    $("#btnCreateSub").off("click");

    $("#task-transitions").empty();
    $("#btnEditTask").off("click");
    $("#btnAssignTask")
    $("#tblTask-SubTasks tbody").empty();
    $(".sub-tasks").hide();

    $(".task-comment-wraper").html("");
    $(".task-file-wraper").html("");
}

function ResetAssignTaskForm() {
    $("#assignTask-UserId").val(null).trigger("change");
    $("#assignTask-UserId").empty();
    $("#assignTask-UserId-old").val("");
    $("#assignTask-TaskId").val("");


}
//#endregion


//#region Load index module(modue khách hàng, cơ hội)

function LoadCommentIndexForTask(id) {
    $(".task-comment-wraper").html("");
    $.ajax({
        url: $("#urlLoadCommentIndexForTask").val() + "?objectId=" + id + "&moduleId=Task",
        method: 'GET',
        success: function (data) {
            $(".task-comment-wraper").html(data);
            setTimeout(function () {
                try {
                    InitCommentOnReady(".task-comment-wraper .comment-container");
                } catch (e) {
                    console.log(e);
                }
            }, 50);
        },
        error: function () {
            bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                window.location = window.location;
            });
        }
    });
}

function LoadFilesIndexForTask(id) {
    $(".task-file-wraper").html("");
    $.ajax({
        url: $("#urlLoadFileIndexForTask").val() + "?objectId=" + id + "&moduleId=Task",
        method: 'GET',
        success: function (data) {
            $(".task-file-wraper").html(data);
            setTimeout(function () {
                try {
                    InitFilesOnReady(".task-file-wraper .fileUpload-container");
                } catch (e) {
                    console.log(e);
                }
            }, 50);
        },
        error: function () {
            bootbox.alert("Có lỗi xảy ra, vui lòng thử lại!", function () {
                window.location = window.location;
            });
        }
    });
}

//load trang danh sách cho module như khách hàng, cơ hội...
function LoadIndexModuleTask(oid, module, element) {
    //global variable
    //$["task-"+module+"-"+id]
    var moduelStr = module + "-" + oid;
    var url = $("#urlAjaxLoadIndexModule").val();

    var height = $(element).parent().height();
    console.log(height);
    $["task-" + moduelStr] = $("#table-task-" + moduelStr).DataTable({
        paging: true,
        sort: true,
        searching: false,
        orderCellsTop: false,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        "order": [[2, "desc"]],
        language: {
            emptyTable: "Không có dữ liệu",
            info: "Hiển thị: _TOTAL_ bản ghi",
            infoEmpty: "Hiển thị: 0 bản ghi",
            infoFiltered: "(đã lọc từ _MAX_ bản ghi)",
            lengthMenu: "Hiển thị _MENU_ mục",
            loadingRecords: "Loading...",
            processing: "Processing...",
            search: "",
            zeroRecords: "Không có bản ghi nào",
            searchPlaceholder: "Tìm kiếm",
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
        rowId: "staffId",
        scrollY: "300px",//"60vh",
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "lengthMenu": [10, 25, 50],
        "pageLength": 10,
        "ajax": {
            "url": url,
            type: "POST",
            cache: false,
            data: function (d) {

                //var isViewer = $("#isReporter").prop("checked");

                var searchdt = $.extend({}, d, {
                    //"isViewer": isViewer,
                    "advancedSearch": [],
                    objectModule: module,
                    objectId: oid
                });

                // objectSearch = searchdt;
                return searchdt;
            }
            ,
            error: defaultAjaxErrorHandle
        },
        'columnDefs': [
            {
                'targets': 0,
                'data': "Title",
                'title': 'Tên',
                'className': "",
                'render': function (data, type, full, meta) {
                    var ttEncode = htmlEncode(full.Title);
                    var str = "<p style='text-decoration: underline; cursor: pointer;' onclick='ShowTaskDetail(" + full.Id + ")'> <b>Tên</b>: " + ttEncode + " </p>";
                    str += "<p > <b>Người thực hiện</b>: " + full.AssigneeAcc + " </p>";
                    str += "<p > <b>Loại</b>: " + full.TaskTypeText + " </p>";
                   
                    return str;
                }
            },
            {
                'targets': 1,
                'title': "Trạng thái",
                'data': "StatusText",
                'className': "",
                //'render': function (data, type, full, meta) {
                //    return full.StatusText;
                //}
            },

            {
                'targets': 2,
                'className': "",
                'data': "DueDate",
                'title': "Ngày đến hạn",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.DueDate !== "") {
                        str += new Date(full.DueDate).toLocaleDateString();
                    }
                    return str;
                },
                'width': "70px"
            }

        ],
        "drawCallback": function (settings, json) {
            //$("td.opp-redirect").on("click", function () {
            //    var data = $(this).parent().find("input.opp-redirect-id").val();
            //    var hostAddress = $("#hostAddress").val();
            //    var link = hostAddress + "/Opportunities/Details?oppId=" + data + "";
            //    window.open(link, "_blank");
            //});
        },
        "info": true,
        "stateSave": false
    });

    var functionname = "CallbackEdit-" + moduelStr;
    window[functionname] = function () {
        $["task-" + moduelStr].draw();
    };

    $('#table-task-' + moduelStr + ' thead tr').clone(true).appendTo('#table-task-' + moduelStr + ' thead').addClass("search-header");

    // $("#table-task-" + moduelStr)

    $('#table-task-' + moduelStr + ' thead tr:eq(1)').off("click");
    $('#table-task-' + moduelStr + '  thead tr:eq(1) th').off("click");
    $('#table-task-' + moduelStr + '  thead tr:eq(1) th').off("keypress");
    $('#table-task-' + moduelStr + '  thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if ($["task-" + moduelStr].column(i).search() !== this.value) {
                $["task-" + moduelStr]
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                //if (tblPersonalTask.column(i).search() !== this.value) {
                if (true) {
                    $["task-" + moduelStr]
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });

}

//#endregion

//#region ultilies

function SetSelectedItemToSelect2Ajax(idselect, data, textfield, valuefield) {
    //Array.isArray();
    $(idselect).val(null).trigger('change');
    $(idselect).empty();
    var DataArr = null;
    textfield = textfield == undefined ? "text" : textfield;
    valuefield = valuefield == undefined ? "id" : valuefield;

    if (data != null && data != undefined) {
        DataArr = [];
        if (Array.isArray(data)) {
            if (data.length == 0) {
                DataArr = null;
            } else {
                $.each(data, function (index, value) {
                    var newoption = new Option(value[textfield], value[valuefield], true, true);
                    DataArr.push(value[valuefield]);
                    $(idselect).append(newoption);
                });
            }

        } else {
            var newoption = new Option(data[textfield], data[valuefield], true, true);
            DataArr.push(data[valuefield]);
            $(idselect).append(newoption);
        }
        $(idselect).trigger('change');
    }
    $(idselect).val(DataArr).trigger('change');
}

function ShowBlockTaskLayer(layerId, enable) {
    // $[layerId];

    if (enable) {

        if ($[layerId] != undefined && $[layerId] != null) {
            clearTimeout($[layerId]);
        }
        $[layerId] = setTimeout(function () { ShowBlockTaskLayer(layerId, false) }, 40000);
        var height = $("#" + layerId).parent().height();
        $("#" + layerId).height(height + "px");
        $("#" + layerId).show();

    } else {
        if ($[layerId] != undefined && $[layerId] != null) {
            clearTimeout($[layerId]);
        }
        $("#" + layerId).hide();
        $("#" + layerId).height("unset");
    }
}

//#endregion

