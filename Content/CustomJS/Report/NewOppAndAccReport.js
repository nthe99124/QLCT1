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
    $("#reportType").select2();

    if ($("#divisionIdHidden").val()) {
        $("#divisionId").val($("#divisionIdHidden").val().split(";")).trigger("change");
    }

    UITree.init();    

    if ($("#NewOppTbl").length > 0) {
        $("#NewOppTbl").DataTable({
            paging: false,
            sort: true,
            searching: false,
            orderCellsTop: false,
            fixedHeader: true,
            language: {
                emptyTable: "Không có dữ liệu",
                zeroRecords: "Không có bản ghi nào"
            },
            fixedFooter: false,
            columnDefs: [
                { type: 'custom-date', targets: 8 },
                { type: 'formatted-num', targets: 9 },
                { type: 'formatted-num', targets: 10 },
                { type: 'formatted-num', targets: 11 }
            ],
            render: $.fn.dataTable.render.text(),
            "drawCallback": function (settings) {
                $('#tr-total').insertBefore('table > tbody > tr:first');
            }
        });   
    }

    if ($("#NewAccTbl").length > 0) {
        $("#NewAccTbl").DataTable({
            paging: false,
            sort: true,
            searching: false,
            orderCellsTop: false,
            fixedHeader: true,
            language: {
                emptyTable: "Không có dữ liệu",
                zeroRecords: "Không có bản ghi nào"
            },
            fixedFooter: false
            ,
            columnDefs: [
                { type: 'custom-date', targets: 6 }
            ],
        }); 
    }      

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "formatted-num-pre": function (a) {
            a = (a === "-" || a === "") ? 0 : a.replace(/[^\d\-\.]/g, "");
            return parseFloat(a);
        },

        "formatted-num-asc": function (a, b) {
            return a - b;
        },

        "formatted-num-desc": function (a, b) {
            return b - a;
        }
    });

    setTimeout(function () {
        var lstDiv = $("#lstIdStr").val();
        if (lstDiv != null) {
            var divArr = lstDiv.split(",");
            $('#newRepTree').jstree("deselect_all");
            $("#newRepTree").jstree(true).select_node(divArr);
        }
    }, 300);

    if ($("#reportType").val() !== "Opp") {
        $("#checkBoxArea").addClass("hidden");
        $("#listTagAcc").removeClass("hidden");
        $("#listTagOpp").addClass("hidden");
    } else {
        $("#listTagOpp").removeClass("hidden");
        $("#listTagAcc").addClass("hidden"); 
    }
});
function SelectedTagsAccChanged() {
    var strVl = "";
    var dataTags = $('#select_report_TagsAcc').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}

function SelectedTagsOppChanged() {
    var strVl = "";
    var dataTags = $('#select_report_TagsOpp').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}

$('#btnSubmitSearch').click(function () {
    var lstDiv = ConvertListIdString($('#newRepTree').jstree('get_selected'));
    $("#lstIdStr").val(lstDiv);
    $('#btn_submitpaging').click();
});

function ExportReport() {
    $('#cmd_export').click();
}

var UITree = function () {
    var contextualMenu = function () {
        //render cây division
        $("#newRepTree").jstree({
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

        $("#newRepTree").bind("changed.jstree",
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

//$("#newRepTree").on("select_node.jstree", function (node, selected) {
//    $("#oppTree").jstree('open_all');
//    var siblingNodes = $("#newRepTree").jstree(true).get_children_dom(selected.node.id);
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
//                $("#newRepTree").jstree(true).select_node(this);
//            });
//            $("#newRepTree").jstree(true).select_node(selected.node.id);
//        }
//    }
//});

//$("#newRepTree").on("deselect_node.jstree", function (node, deselected) {
//    $("#oppTree").jstree('open_all');
//    var siblingNodes = $("#newRepTree").jstree(true).get_children_dom(deselected.node.id);
//    var allChecked = false;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if ($(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = true;
//            }
//        });
//        if (allChecked) {
//            $(siblingNodes).each(function () {
//                $("#newRepTree").jstree(true).deselect_node(this);
//            });
//            $("#newRepTree").jstree(true).deselect_node(deselected.node.id);
//        }
//    }
//});

$("#newRepTree").on("select_node.jstree", function (node, selected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(selected.node.id);
    var siblingNodes = $("#newRepTree").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#newRepTree").jstree(true).select_node(vl);
        });
    }
});

$("#newRepTree").on("deselect_node.jstree", function (node, deselected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(deselected.node.id);

    var siblingNodes = $("#newRepTree").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#newRepTree").jstree(true).deselect_node(vl);
        });
    }
});

$("#dropdown-report").click(function (e) {
    e.stopPropagation();
});

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

$(document).on("change",
    "#reportType",
    function () {
        if ($("#reportType").val() === "Opp") {
            $("#checkBoxArea").removeClass("hidden");
        } else {
            $("#checkBoxArea").addClass("hidden");
        }

        if ($("#reportType").val() === "Opp") {
            $("#listTagOpp").removeClass("hidden");
            $("#listTagAcc").addClass("hidden");
        } else {
            $("#listTagOpp").addClass("hidden");
            $("#listTagAcc").removeClass("hidden");
        }
    });

$(document).on("change",
    "#checkDetails",
    function () {
        var check = null;
        var vari = 0;
        check = $('#checkDetails:checked').val();
        if (check === "on") {
            $(".tdDetail").removeClass("hidden");
        }
        else {
            $(".tdDetail").addClass("hidden");
        }
    });