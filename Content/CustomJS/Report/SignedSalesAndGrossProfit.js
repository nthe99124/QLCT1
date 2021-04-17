$(document).ready(function () {

    $(function () {
        $('.date-time-picker').datetimepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            clearBtn: true,
            //format: $("#dateFormat").val(),
            //ignoreReadonly: true,
            //showClear: true,
           // locale: 'en-US'
        });
    });

    UITree.init();

    //$('#recordlist').dataTable({
    //    paging: false,
    //    "bInfo": false,
    //    "searching": false,
    //    "fixedHeader": {
    //        header: true,
    //    },
    //    language: {
    //        emptyTable: "Không có dữ liệu",
    //        //info: "hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
    //        info: "Hiển thị: _TOTAL_ bản ghi",
    //        //infoEmpty: "Showing 0 to 0 of 0 entries",
    //        infoEmpty: "Hiển thị: 0 bản ghi",
    //        infoFiltered: "(đã lọc từ _MAX_ bản ghi)",
    //        lengthMenu: "Hiển thị _MENU_ mục",
    //        loadingRecords: "Loading...",
    //        processing: "Processing...",
    //        search: "Tìm kiếm:",
    //        zeroRecords: "Không có bản ghi nào",
    //        paginate: {
    //            first: "First",
    //            last: "Last",
    //            next: "Next",
    //            previous: "Previous"
    //        },
    //        aria: {
    //            sortAscending: ": activate to sort column ascending",
    //            sortDescending: ": activate to sort column descending"
    //        }
    //    },
    //    render: $.fn.dataTable.render.text(),
    //    "drawCallback": function (settings) {
    //        $('#tr-total').insertBefore('table > tbody > tr:first');
    //    },

    //});    

    $("#recordlist").DataTable({
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
            { type: 'custom-date', targets: 6 }
        ],
        render: $.fn.dataTable.render.text(),
        "drawCallback": function (settings) {
            $('#tr-total').insertBefore('table > tbody > tr:first');
        }
    });   

    setTimeout(function () {
        var lstDiv = $("#lstIdStr-signedSalesAndGP").val();
        if (lstDiv != null) {
            var divArr = lstDiv.split(",");
            $('#oppTree-signedSalesAndGP').jstree("deselect_all");
            $("#oppTree-signedSalesAndGP").jstree(true).select_node(divArr);
        } 
    }, 300);
});

$('#btnSubmitSearch').click(function () {
    var lstDiv = ConvertListIdString($('#oppTree-signedSalesAndGP').jstree('get_selected'));
    $("#lstIdStr-signedSalesAndGP").val(lstDiv); 
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
        $("#oppTree-signedSalesAndGP").jstree({
            "core": {
                "themes": {
                    "responsive": true
                },
                "check_callback": true,
                "data": {
                    'url': $('#urlGetDivisionList').val(),
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

        $("#oppTree-signedSalesAndGP").bind("changed.jstree",
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

$("#oppTree-signedSalesAndGP").on("select_node.jstree", function (node, selected) {
    $("#oppTree-signedSalesAndGP").jstree('open_all');
    var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(selected.node.id);
    var allChecked = true;
    if (siblingNodes.length > 0) {
        $(siblingNodes).each(function () {
            if (!$(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
                allChecked = false;
            }
        });
        if (!allChecked) {
            $(siblingNodes).each(function () {
                //$("#tree").jstree(true).deselect_node(this);
                $("#oppTree-signedSalesAndGP").jstree(true).select_node(this);
            });
            $("#oppTree-signedSalesAndGP").jstree(true).select_node(selected.node.id);
        }
    }
});

$("#oppTree-signedSalesAndGP").on("deselect_node.jstree", function (node, deselected) {
    $("#oppTree-signedSalesAndGP").jstree('open_all');
    var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(deselected.node.id);
    var allChecked = false;
    if (siblingNodes.length > 0) {
        $(siblingNodes).each(function () {
            if ($(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
                allChecked = true;
            }
        });
        if (allChecked) {
            $(siblingNodes).each(function () {
                $("#oppTree-signedSalesAndGP").jstree(true).deselect_node(this);
            });
            $("#oppTree-signedSalesAndGP").jstree(true).deselect_node(deselected.node.id);
        }
    }
});

$("#dropdown-report-signedSalesAndGP").click(function (e) {
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
