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
    $("#saleStageType").select2();

    var sSType = $("#saleStageType").val();
    if (sSType !== "") {
        if (sSType === "BidOpportunitiesPhase_2") {
            $("#dateTh").html("Ngày mua thầu");
        }
        else if (sSType === "BidOpportunitiesPhase_3") {
            $("#dateTh").html("Ngày nộp thầu");
        }
        else if (sSType === "BidOpportunitiesPhase_4") {
            $("#dateTh").html("Ngày thắng thầu");
        }
    }

    if ($("#divisionIdHidden").val()) {
        $("#divisionId").val($("#divisionIdHidden").val().split(";")).trigger("change"); 
    }

    UITree.init();    
    //var table = $("#BiddingOpportunites").DataTable({
    //    paging: false,
    //    sort: true,
    //    searching: false,
    //    orderCellsTop: false,
    //    fixedHeader: true,
    //    language: {
    //        emptyTable: "Không có dữ liệu",           
    //        zeroRecords: "Không có bản ghi nào"
    //    },
    //    fixedFooter: false
    //});

    $('#BiddingOpportunites').dataTable({
        paging: false,
        "bInfo": false,
        "searching": false,
        "fixedHeader": {
            header: true,
        },       
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
        columnDefs: [
            { type: "custom-date", targets: 7 },
            { type: 'formatted-num', targets: 8 },
            { type: 'formatted-num', targets: 9 },
            { type: 'formatted-num', targets: 10 }
        ],
        render: $.fn.dataTable.render.text(),        
        "drawCallback": function (settings) {
            $('#tr-total').insertBefore('table > tbody > tr:first');
        }
    });    

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
            $('#bidOppTree').jstree("deselect_all");
            $("#bidOppTree").jstree(true).select_node(divArr);
        }
    }, 300);
});

$('#btnSubmitSearch').click(function () {
    var lstDiv = ConvertListIdString($('#bidOppTree').jstree('get_selected'));
    $("#lstIdStr").val(lstDiv);    
    $('#btn_submitpaging').click();
});

function ExportReport() {
    $('#cmd_export').click();
}

var UITree = function () {
    var contextualMenu = function () {
        //render cây division
        $("#bidOppTree").jstree({
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

        $("#bidOppTree").bind("changed.jstree",
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

//$("#bidOppTree").on("select_node.jstree", function (node, selected) {
//    $("#bidOppTree").jstree('open_all');
//    var siblingNodes = $("#bidOppTree").jstree(true).get_children_dom(selected.node.id);
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
//                $("#bidOppTree").jstree(true).select_node(this);
//            });
//            $("#bidOppTree").jstree(true).select_node(selected.node.id);
//        }
//    }
//});

//$("#bidOppTree").on("deselect_node.jstree", function (node, deselected) {
//    $("#bidOppTree").jstree('open_all');
//    var siblingNodes = $("#bidOppTree").jstree(true).get_children_dom(deselected.node.id);
//    var allChecked = false;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if ($(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = true;
//            }
//        });
//        if (allChecked) {
//            $(siblingNodes).each(function () {
//                $("#bidOppTree").jstree(true).deselect_node(this);
//            });
//            $("#bidOppTree").jstree(true).deselect_node(deselected.node.id);
//        }
//    }
//});

$("#bidOppTree").on("select_node.jstree", function (node, selected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(selected.node.id);
    var siblingNodes = $("#bidOppTree").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#bidOppTree").jstree(true).select_node(vl);
        });
    }
});

$("#bidOppTree").on("deselect_node.jstree", function (node, deselected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(deselected.node.id);

    var siblingNodes = $("#bidOppTree").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#bidOppTree").jstree(true).deselect_node(vl);
        });
    }
});

$("#dropdown-report").click(function(e) {
    e.stopPropagation();
});  

function SelectedTagsChanged() {
    var strVl = "";
    var dataTags = $('#select_report_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}

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
    "#checkDetails",
    function() {
        var check = null;
        var vari = 0;
        check = $('#checkDetails:checked').val();
        if (check === "on") {
            $(".tdDetail").removeClass("hidden");
        }
        else
        {
            $(".tdDetail").addClass("hidden");
        }
    });