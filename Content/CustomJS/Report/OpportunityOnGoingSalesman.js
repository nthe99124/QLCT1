$(document).ready(function () {

    $(function () {
        $('.date-time-picker').datetimepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            clearBtn: true,
            
        });
    });

    $("#divisionId").select2();

    if ($("#divisionIdHidden").val()) {
        $("#divisionId").val($("#divisionIdHidden").val().split(";")).trigger("change");
    }
    UITree.init();
    $('#OpportunityOnGoingSalesman').dataTable({
        paging: false,
        "searching": false,
        "bInfo": false,
        "fixedHeader": {
            header: true,
        },
        language: {
            emptyTable: "Không có dữ liệu",
            info: "Hiển thị: _TOTAL_ bản ghi",
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

    setTimeout(function () {
        var lstDiv = $("#lstIdStr").val();
        if (lstDiv != null) {
            var divArr = lstDiv.split(",");
            $("#bidTreeOppOngoingSalesman").jstree("deselect_all");
            $("#bidTreeOppOngoingSalesman").jstree(true).select_node(divArr);
        }
    }, 300);
});

$('#btnSubmitSearch').click(function () {
    var lstDiv = ConvertListIdString($('#bidTreeOppOngoingSalesman').jstree('get_selected'));
    $("#lstIdStr").val(lstDiv);
    $('#btn_submitpaging').click();
});


function ExportReport() {
    $('#cmd_export').click();
}

var UITree = function () {
    var contextualMenu = function () {
        //render cây division
        $("#bidTreeOppOngoingSalesman").jstree({
            "core": {
                "themes": {
                    "responsive": true
                },
                "check_callback": true,
                "data": {
                    'url': $('#divisionLoad').val(),
                    'type': 'Get',
                    'success': function (node) {
                        return { 'id': node.id };
                    }
                }
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            "checkbox": {
                "three_state": false
            },
            contextmenu: {
            },
            "state": { "key": "demo2" },
            "plugins": ["contextmenu", "html_data", "search", "crrm", "ui", "state", "types", "checkbox"],
        });

        $("#bidTreeOppOngoingSalesman").bind("changed.jstree",
            function (e, data) {
            });
    }
    return {
        //main function to initiate the module
        init: function () {
            contextualMenu();
        }
    };
}();

//$("#bidTreeOppOngoingSalesman").on("select_node.jstree", function (node, selected) {
//    $("#bidTreeOppOngoingSalesman").jstree('open_all');
//    var siblingNodes = $("#bidTreeOppOngoingSalesman").jstree(true).get_children_dom(selected.node.id);
//    var allChecked = true;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if (!$(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = false;
//            }
//        });
//        if (!allChecked) {
//            $(siblingNodes).each(function () {
//                //$("#tree").jstree(true).deselect_node(this);
//                $("#bidTreeOppOngoingSalesman").jstree(true).select_node(this);
//            });
//            $("#bidTreeOppOngoingSalesman").jstree(true).select_node(selected.node.id);
//        }
//    }
//});

//$("#bidTreeOppOngoingSalesman").on("deselect_node.jstree", function (node, deselected) {
//    $("#bidTreeOppOngoingSalesman").jstree('open_all');
//    var siblingNodes = $("#bidTreeOppOngoingSalesman").jstree(true).get_children_dom(deselected.node.id);
//    var allChecked = false;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if ($(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = true;
//            }
//        });
//        if (allChecked) {
//            $(siblingNodes).each(function () {
//                $("#bidTreeOppOngoingSalesman").jstree(true).deselect_node(this);
//            });
//            $("#bidTreeOppOngoingSalesman").jstree(true).deselect_node(deselected.node.id);
//        }
//    }
//});
function ConvertListIdString(arrId) {
    var lstId = "";
    if (arrId !== null && typeof (arrId) != "undefined") {
        if (arrId !== "" && arrId.length > 0) {
            for (var j = 0; j < arrId.length; j++) {
                if (parseInt(arrId[j]) > 0) {
                    lstId += arrId[j] + ",";
                }
            }
        }
    }
    if (lstId !== "") {
        lstId = lstId.slice(0, -1);
    }

    return lstId;
}
$("#dropdown-report").click(function (e) {
    e.stopPropagation();
});  
$("#bidTreeOppOngoingSalesman").on("select_node.jstree", function (node, selected) {
    var siblingNodes = $("#bidTreeOppOngoingSalesman").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#bidTreeOppOngoingSalesman").jstree(true).select_node(vl);
        });
    }
    if ($("#boolClearTree").val() == "True") {
        var listChildren = [];
        var $tree = $('#bidTreeOppOngoingSalesman');
        $($tree.jstree().get_json($tree, { flat: true })).each(function (index, value) {
            var node = $tree.jstree().get_node(this.id);
            var lvl = node.parents.length;
            var idx = index;
            if (node.state.disabled == false) {
                listChildren.push(node);
            }
        });
        $.each(listChildren, function (index, value) {
            var obj = $(value)[0];
                setTimeout(function () { $('#bidTreeOppOngoingSalesman').jstree(true).deselect_node(obj.id); }, 5);
        });
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
$("#bidTreeOppOngoingSalesman").on("deselect_node.jstree", function (node, deselected) {

    var siblingNodes = $("#bidTreeOppOngoingSalesman").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#bidTreeOppOngoingSalesman").jstree(true).deselect_node(vl);
        });
    }
    if ($("#boolClearTree").val() == "True") {
        var listChildren = [];
        var $tree = $('#bidTreeOppOngoingSalesman');
        $($tree.jstree().get_json($tree, { flat: true })).each(function (index, value) {
            var node = $tree.jstree().get_node(this.id);
            var lvl = node.parents.length;
            var idx = index;
            if (node.state.disabled == false) {
                listChildren.push(node);
            }
        });
        $.each(listChildren, function (index, value) {
            var obj = $(value)[0];
                setTimeout(function () { $('#bidTreeOppOngoingSalesman').jstree(true).deselect_node(obj.id); }, 5);
        });
        $("#boolClearTree").val("False");
    }
});

