var UITree = function () {
    var createChildCate = $("#CreateChildCate").val();
    var renameCate = $("#RenameCate").val();
    var getCodeCategory = $("#GetCodeCategory").val();
    var updateCate = $("#UpdateCate").val();
    var deleteCate = $("#DeleteCate").val();
    var approveCate = $("#ApproveCate").val();
    var notApproveCate = $("#NotApproveCate").val();

    var contextualMenu = function () {
        //render cây danh mục
        $("#Categorytree").jstree({
            "core": {
                "themes": {
                    "responsive": true
                },
                "check_callback": true
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            contextmenu: {
                items: function () {
                    return {
                        createItem: {
                            "separator_before": false,
                            "icon": false,
                            "separator_after": false,
                            "_disabled": false,
                            "label": createChildCate,
                            "action": function (obj) {
                                createNode(obj);
                            }
                        },
                        renameItem: {
                            "separator_before": false,
                            "icon": false,
                            "separator_after": false,
                            "_disabled": false,
                            "label": renameCate,
                            "action": function (obj) { renameNode(obj); }
                        },
                        getCode: {
                            "label": getCodeCategory,
                            "action": function (obj) { getCodeNode(obj); }
                        },
                        editItem: {
                            "label": updateCate,
                            "action": function (obj) { editNode(obj); }
                        },
                        deleteItem: {
                            "separator_before": false,
                            "icon": false,
                            "separator_after": false,
                            "_disabled": false,
                            "label": deleteCate,
                            "action": function (obj) { deleteNode(obj); }
                        },
                        ApproveItem: {
                            "label": approveCate,
                            "action": function (obj) { Approve(obj); }
                        },
                        ApproveNotItem: {
                            "label": notApproveCate,
                            "action": function (obj) { ApproveNot(obj); }
                        }
                    };
                }
            },
            "state": { "key": "demo2" },
            "plugins": ["contextmenu", "html_data", "search", "crrm", "ui", "state", "types"]
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            contextualMenu();
        }
    };

}();

//Hàm bắt sự kiện thay đổi trên dropdownlist
function onchangeCateType() {
    $("#cmd_submit_search").click();
}

//Hàm lấy mã danh mục
function getCodeNode(data) {
    
    var urlGetCode = $("#urlGetCode").val();
    var errorGetCode = $("#ErrorGetCode").val();
    var codeCategory = $("#CodeCategory").val();
   
    var inst = $.jstree.reference(data.reference),
         obj = inst.get_node(data.reference);
    var url = urlGetCode + "?cateId=" + parseInt(obj.id);
    
    $.ajax({
        type: "Post",
        url: url,
        success: function (data) {
            if (data === "Error") {
                bootbox.alert("" + errorGetCode);
            } else {
                var temp = codeCategory + " : " + data;
                bootbox.alert(temp);
            }
        },
        error: function () {

        }
    });
}

//Hàm bắt sự kiện đổi tên danh mục
//Tham số truyền vào là id của danh mục
function renameCategory(id) {
    $(".jstree-rename-input").blur(function () {
        // ReSharper disable once AssignedValueIsNeverUsed
        var val = "";
        val = this.value;
        var checkLength = val.length;
        var urlRenameCategory = $("#UrlRenameCategory").val();
        var errorRenameCate = $("#ErrorRenameCate").val();
        var errorNotNameCate = $("#ErrorNotNameCate").val();
        var maxlengthCateName = $("#MaxlengthCateName").val();
        var data = {
            "id": id,
            "cateName": val
        };
        if (val.trim() !== "") {
            if (checkLength <= 200) {
                $.ajax({
                    url: urlRenameCategory,
                    type: 'POST',
                    data: data,
                    success: function (dataOutput) {
                        if (dataOutput === "ok") {
                            $("#cmd_submit_search").click();
                        }
                        if (dataOutput === "Error") {
                            bootbox.alert(errorRenameCate);
                        }
                    },
                    error: function () {
                    }
                });
            } else {
                bootbox.alert(maxlengthCateName, function () {
                    $("#cmd_submit_search").click();
                });
            }
        } else {
            bootbox.alert(errorNotNameCate, function () { });
        }

    });
}

//Hàm bắt sự kiện tạo mới danh mục con từ một danh mục cha có trước
//Tham số id danh mục cha,Id input
function createChildCategory(idParent, idInput) {
    var cateName = "child_" + idParent;
    var urlCreateChild = $("#urlCreateChild").val();
    var errorCreateChildCate = $("#ErrorCreateChildCate").val();
    var errorNotNameCate = $("#errorNotNameCate").val();
    var messagePerCreateCate = $("#MessagePerCreateCate").val();
    var maxlengthCateName = $("#MaxlengthCateName").val();

    $("#" + idInput).find("input").attr("id", "" + cateName);
    $("#" + cateName).blur(function () {
        // ReSharper disable once AssignedValueIsNeverUsed
        var val = "";
        var checkCreate = $("#createCate").val();
        val = this.value;
        var checkLength = val.length;
        var data = {
            "idParent": idParent,
            "cateNameChild": val
        };
        if (checkCreate === "True") {
            if (checkLength <= 200) {
                if (val.trim() !== "") {
                    $.ajax({
                        url: urlCreateChild,
                        type: 'POST',
                        data: data,
                        success: function (data) {
                            if (data === "ok") {
                                $("#cmd_submit_search").click();
                            }
                            if (data === "Error") {
                                bootbox.alert("" + errorCreateChildCate);
                                $("#cmd_submit_search").click();
                            }
                        },
                        error: function () {
                        }
                    });
                } else {
                    bootbox.confirm("" + errorNotNameCate, function () {
                        $("#cmd_submit_search").click();
                    });
                }
            } else {
                bootbox.alert(maxlengthCateName, function () {
                    $("#cmd_submit_search").click();
                });
            }
        } else {
            bootbox.alert(messagePerCreateCate);
        }
    });
}

//Hàm duyệt danh mục
//Tham số truyền vào là một đối tượng
function Approve(data) {
    // ReSharper disable once AssignedValueIsNeverUsed
    var checkParentApproved = "";
    var inst = $.jstree.reference(data.reference),
           obj = inst.get_node(data.reference);
    var listId = obj.id;
    var listChild = "#" + listId + " .jstree-node";
    var checkLevel = $("#" + listId).attr("check-level");
    var check = $("#" + listId).attr("check-approved");
    if (check === "false") {
        if (checkLevel === "1") {
            $(listChild).each(function () {
                listId += ";" + this.id;
            });

            $("#ListId").val(listId);
            $("#cmdDuyetMutil").click();

        } else {
            checkParentApproved = $("#" + listId).parent("ul").parent("li").find("a").attr("class").replace("jstree-anchor", "").trim();
            if (checkParentApproved === "" || checkParentApproved === "jstree-clicked") {
                $(listChild).each(function () {
                    listId += ";" + this.id;
                });

                $("#ListId").val(listId);
                $("#cmdDuyetMutil").click();

            } else {
                bootbox.alert($("#ParentNotApprove").val());
            }
        }
    } else {
        bootbox.alert($("#CategoryApproved").val());
    }

}

//Hàm bỏ duyệt danh mục
//Tham số truyền vào là một đối tượng
function ApproveNot(data) {
    var inst = $.jstree.reference(data.reference),
           obj = inst.get_node(data.reference);
    var listId = obj.id;
    var check = $("#" + listId).attr("check-approved");
    if (check === "true") {
        var listChild = "#" + listId + " .jstree-node";
        $(listChild).each(function () {
            listId += ";" + this.id;
        });
        $("#ListId").val(listId);
        $("#cmdBoDuyetMutil").click();

    } else {
        bootbox.alert($("#CategoryNotApprove").val());
    }

}

//Hàm đổi tên trên cây danh mục
function renameNode(data) {
    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference);
    inst.edit(obj);
    renameCategory(obj.id);
}

//Hàm xóa danh mục
//Tham số truyền vào là đối tượng cần xóa
function deleteNode(data) {

    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference);
    var messageConfirmDeleteCate = $("#MessageConfirmDeleteCate").val();
    var messageErorrDeleteCate = $("#MessageErorrDeleteCate").val();

    $("#ListId").val(obj.id);
    var urlCheckCate = $("#urlCheckCate").val();

    bootbox.confirm("" + messageConfirmDeleteCate, function (result) {
        if (result) {
            //Kiểm tra CateId này đã có câu hỏi hay chưa.
            var cateType = $("#idCateType option:selected").val();
            var url = urlCheckCate + "?id=" + obj.id + "&cateType=" + cateType;

            $.get(url, null, function (data) {
                if (data === "ok") {
                    if (inst.is_selected(obj)) {
                        inst.delete_node(inst.get_selected());
                    } else {

                        inst.delete_node(obj);
                    }
                    $("#cmd_submit_search").click();
                } else {
                    bootbox.alert(messageErorrDeleteCate);
                }
            });
        }
    });

}

//Hàm tạo node trên cây danh mục
function createNode(data) {
    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference);
    inst.create_node(obj, {}, "last", function (newNode) {
        setTimeout(function () {
            inst.edit(newNode);
            createChildCategory(obj.id, newNode.id);
        }, 0);
    });
}

//Hàm sửa danh mục
//Tham số truyền vào là Id cẩu danh mục cần sửa
function editNode(data) {
    var urlEdit = $("#urlEdit").val();
    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference);
    var id = obj.id;
    var url = urlEdit + "?id=" + id;
    window.location = url;
}

//Hàm tìm kiếm trên cây danh mục
function SearchTree() {
    var cateNameSearch = $("#EditCategoryManage_CateName").val();
    if (cateNameSearch !== "") {
        $("#Categorytree").jstree(true).search(cateNameSearch);
    }
}


$(document).ready(function () {
    UITree.init();
});

function ExportExcel() {
    $('#btn_ExportExcel').click();
}
function AddNewCategory() {
    var cateType = $("#idCateType  option:selected").val();
    window.location.href = $("#urlHostAddress").val()+"/CategoryManage/Edit?cateType=" + cateType;
}