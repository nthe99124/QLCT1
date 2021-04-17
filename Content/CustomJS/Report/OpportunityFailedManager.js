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
    $('#OpportunityFailedManager').dataTable({
        paging: false,
        "searching": false,
        "bInfo": false,
        "fixedHeader": {
            header: true,
        },
        columnDefs: [
            { type: 'custom-date', targets: 8 }
        ],
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
    
});
$(document).on("change", "#checkDetails", function () {
    var check = null;
    var vari = 0;
    check = $('#checkDetails:checked').val();
    if (check === "on") {
        vari = $("#valuei").val();
        if (vari > 0) {
            for (j = 1; j <= vari; j++) {
                var datahw = $("#hw_"+j).val();
                var datasw = $("#sw_"+j).val();
                var datasrv = $("#srv_"+j).val();

                var datahwgp = $("#hw_gp_"+j).val();
                var dataswgp = $("#sw_gp_"+j).val();
                var datasrvgp = $("#srv_gp_"+j).val();

                html3 = "";
                html3 += "<table class=\"table no-padding no-margin\" id = 'table_" + j + "'>";
                html3 += "<tr class=\"txt-hw\"> <td><b>HW: </b></td> <td>" + datahw + "</td></tr>";
                html3 += "<tr class=\"txt-sw\"> <td><b>SW: </b></td> <td>" + datasw + "</td></tr>";
                html3 += "<tr class=\"txt-srv\"> <td><b>SRV: </b></td> <td>" + datasrv + "</td></tr>";
                html3 + "</table>";
                $('#row_' + j).after(html3);
                html4 = "";
                html4 += "<table class=\"table no-padding no-margin\" id = 'table_row" + j + "'>";
                html4 += "<tr class=\"txt-hw\"> <td><b>HW: </b></td> <td>" + datahwgp + "</td></tr>";
                html4 += "<tr class=\"txt-sw\"> <td><b>SW: </b></td> <td>" + dataswgp + "</td></tr>";
                html4 += "<tr class=\"txt-srv\"> <td><b>SRV: </b></td> <td>" + datasrvgp + "</td></tr>";
                html4 + "</table>";
                $('#row2_' + j).after(html4);
            }
        }

        var datatotal_hw_gp1 = $("#total_hw_gp1").val();
        var datatotal_sw_gp1 = $("#total_sw_gp1").val();
        var datatotal_srv_gp1 = $("#total_srv_gp1").val();
        html1 = "";
        html1 += "<table class=\"table no-padding no-margin\" id = 'tabletotalESS'>";
        html1 += "<tr class=\"txt-hw\"> <td><b>HW: </b></td> <td>" + datatotal_hw_gp1 + "</td></tr>";
        html1 += "<tr class=\"txt-sw\"> <td><b>SW: </b></td> <td>" + datatotal_sw_gp1 + "</td></tr>";
        html1 += "<tr class=\"txt-srv\"> <td><b>SRV: </b></td> <td>" + datatotal_srv_gp1 + "</td></tr>";
        html1 + "</table>";
        $('#totalESS').after(html1);

        var datatotal_hw_gp2 = $("#total_hw_gp2").val();
        var datatotal_sw_gp2 = $("#total_sw_gp2").val();
        var datatotal_srv_gp2 = $("#total_srv_gp2").val();
        html2 = "";
        html2 += "<table class=\"table no-padding no-margin\" id = 'tabletotalEGPS'>";
        html2 += "<tr class=\"txt-hw\"> <td><b>HW: </b></td> <td>" + datatotal_hw_gp2 + "</td></tr>";
        html2 += "<tr class=\"txt-sw\"> <td><b>SW: </b></td> <td>" + datatotal_sw_gp2 + "</td></tr>";
        html2 += "<tr class=\"txt-srv\"> <td><b>SRV: </b></td> <td>" + datatotal_srv_gp2 + "</td></tr>";
        html2 + "</table>";
        $('#totalEGPS').after(html2);
    }
    else {
        vari = $("#valuei").val();
        if (vari > 0) {
            document.getElementById("tabletotalESS").remove();
            document.getElementById("tabletotalEGPS").remove();
            for (j = 1; j <= vari; j++) {
                document.getElementById("table_" + j + "").remove();
                document.getElementById("table_row" + j + "").remove();
            }
        }

    }
});

$('#btnSubmitSearch').click(function () {
    var lstDiv = ConvertListIdString($('#bidTreeOppOngoingFailedManager').jstree('get_selected'));
    $("#lstIdStr").val(lstDiv);
    $('#btn_submitpaging').click();
});
function ExportReport() {
    $('#cmd_export').click();
}
var UITree = function () {
    var contextualMenu = function () {
        //render cây division
        $("#bidTreeOppOngoingFailedManager").jstree({
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

        $("#bidTreeOppOngoingFailedManager").bind("changed.jstree",
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

//$("#bidTreeOppOngoingFailedManager").on("select_node.jstree", function (node, selected) {
//    $("#bidTreeOppOngoingFailedManager").jstree('open_all');
//    var siblingNodes = $("#bidTreeOppOngoingFailedManager").jstree(true).get_children_dom(selected.node.id);
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
//                $("#bidTreeOppOngoingFailedManager").jstree(true).select_node(this);
//            });
//            $("#bidTreeOppOngoingFailedManager").jstree(true).select_node(selected.node.id);
//        }
//    }
//});

//$("#bidTreeOppOngoingFailedManager").on("deselect_node.jstree", function (node, deselected) {
//    $("#bidTreeOppOngoingFailedManager").jstree('open_all');
//    var siblingNodes = $("#bidTreeOppOngoingFailedManager").jstree(true).get_children_dom(deselected.node.id);
//    var allChecked = false;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if ($(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = true;
//            }
//        });
//        if (allChecked) {
//            $(siblingNodes).each(function () {
//                $("#bidTreeOppOngoingFailedManager").jstree(true).deselect_node(this);
//            });
//            $("#bidTreeOppOngoingFailedManager").jstree(true).deselect_node(deselected.node.id);
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
$("#bidTreeOppOngoingFailedManager").on("select_node.jstree", function (node, selected) {
    var siblingNodes = $("#bidTreeOppOngoingFailedManager").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#bidTreeOppOngoingFailedManager").jstree(true).select_node(vl);
        });
    }
    if ($("#boolClearTree").val() == "True") {
        var listChildren = [];
        var $tree = $('#bidTreeOppOngoingFailedManager');
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
                setTimeout(function () { $('#bidTreeOppOngoingFailedManager').jstree(true).deselect_node(obj.id); }, 5);
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

$("#bidTreeOppOngoingFailedManager").on("deselect_node.jstree", function (node, deselected) {

    var siblingNodes = $("#bidTreeOppOngoingFailedManager").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#bidTreeOppOngoingFailedManager").jstree(true).deselect_node(vl);
        });
    }
    if ($("#boolClearTree").val() == "True") {
        var listChildren = [];
        var $tree = $('#bidTreeOppOngoingFailedManager');
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
                setTimeout(function () { $('#bidTreeOppOngoingFailedManager').jstree(true).deselect_node(obj.id); }, 5);
        });
        $("#boolClearTree").val("False");
    }
});