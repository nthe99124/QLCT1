$(document).ready(function () {
    $("#divisionId").select2();
    $("#overdueType").select2();

    var overdueType = $("#overdueType").val();
    $(".bidCode").removeClass("hidden");
    if (overdueType !== "") {
        if (overdueType === "OverdueBidding") {
            $("#dateTh").html("Ngày mua thầu dự kiến");
        }
        else if (overdueType === "OverdueSubmissionBid") {
            $("#dateTh").html("Ngày nộp thầu dự kiến");
        }
        else if (overdueType === "OverdueWinningBid") {
            $("#dateTh").html("Ngày thắng thầu dự kiến");
        }
        else if (overdueType === "OverdueSignedBid") {
            $("#dateTh").html("Ngày ký dự kiến");
            $("#saleStageType").removeClass("hidden");
            var saleStageType = $("#saleStageTypeVal").val();
            if (saleStageType === "All") {
                $("#bid").prop("checked", true);
                $("#noBid").prop("checked", true);
            } else if (saleStageType === "NoBidOpportunitiesPhase") {
                $("#noBid").prop("checked", true);
            }
            else if (saleStageType === "BidOpportunitiesPhase") {
                $("#bid").prop("checked", true);
            }

            $(".bidCode").addClass("hidden");
        }
    }

    if ($("#divisionIdHidden").val()) {
        $("#divisionId").val($("#divisionIdHidden").val().split(";")).trigger("change"); 
    }

    UITree.init();    

    $("#OverdueOpportunites").dataTable({
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
            { type: 'custom-date', targets: 9 },
            { type: 'formatted-num', targets: 10 },
            { type: 'formatted-num', targets: 11 },
            { type: 'formatted-num', targets: 12 }
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
            $('#overdueOppTree').jstree("deselect_all");
            $("#overdueOppTree").jstree(true).select_node(divArr);
        }
    }, 300);    
});

$('#btnSubmitSearch').click(function () {
    var lstDiv = ConvertListIdString($('#overdueOppTree').jstree('get_selected'));
    $("#lstIdStr").val(lstDiv);    
    $('#btn_submitpaging').click();
});

function ExportReport() {
    $('#cmd_export').click();
}
function SelectedTagsChanged() {
    var strVl = "";
    var dataTags = $('#select_report_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}
var UITree = function () {
    var contextualMenu = function () {
        //render cây division
        $("#overdueOppTree").jstree({
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

        $("#overdueOppTree").bind("changed.jstree",
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

$("#overdueOppTree").on("select_node.jstree", function (node, selected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(selected.node.id);
    var siblingNodes = $("#overdueOppTree").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#overdueOppTree").jstree(true).select_node(vl);
        });
    }
});

$("#overdueOppTree").on("deselect_node.jstree", function (node, deselected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(deselected.node.id);

    var siblingNodes = $("#overdueOppTree").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#overdueOppTree").jstree(true).deselect_node(vl);
        });
    }
});

$("#dropdown-report").click(function(e) {
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

$(document).on("change","#checkDetails",function() {
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

$(document).on("change", "#overdueType", function () {
    var overdueType = $("#overdueType").val();
    if (overdueType === "OverdueSignedBid") {
        $("#saleStageType").removeClass("hidden");
        $("#bid").prop("checked", true);
        $("#noBid").prop("checked", true);
        $("#saleStageTypeVal").val("All");
    } else {
        $("#saleStageType").addClass("hidden");
    }
});

$("#bid").change(function () {
    if (this.checked) {
        if ($("#noBid").is(":checked")) {
            $("#saleStageTypeVal").val("All");
        } else {
            $("#saleStageTypeVal").val("BidOpportunitiesPhase");       
        }        
    } else {
        if ($("#noBid").is(":checked")) {
            $("#saleStageTypeVal").val("NoBidOpportunitiesPhase");
        } else {
            $("#saleStageTypeVal").val("");
        }         
    }
});

$("#noBid").change(function () {
    if (this.checked) {
        if ($("#bid").is(":checked")) {
            $("#saleStageTypeVal").val("All");
        } else {
            $("#saleStageTypeVal").val("NoBidOpportunitiesPhase");
        }
    } else {
        if ($("#bid").is(":checked")) {
            $("#saleStageTypeVal").val("BidOpportunitiesPhase");
        } else {
            $("#saleStageTypeVal").val("");
        } 
    }
});