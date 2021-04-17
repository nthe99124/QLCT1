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



    UITree.init(function () {

        setTimeout(function () {
            if (currentTree != undefined) {
                var selecttedDiv = $("#lstIdStr-signedSalesAndGP").val();
                $.jstree.reference(currentTree).deselect_all();
                if (selecttedDiv != undefined && selecttedDiv != '') {
                    if (selecttedDiv == '-1') {
                        $.jstree.reference(currentTree)
                            .check_all();

                        $('#btnSubmitSearchReport').click();

                    } else {
                        $.jstree.reference(currentTree)
                            .select_node(selecttedDiv);
                        $('#btnSubmitSearchReport').click();
                    }
                }

            }
        }, 300);

    });

    InitDivisionSelectList();

    //$('#btnSubmitSearchReport').click();
});


$('#btnSubmitSearchReport').click(function () {
    //search báo cáo
    SearchBaselineReport(
        function () {
            if (tblBaselineDetail != null && $.fn.DataTable.isDataTable('#tbl-detail-baseline')) {
                tblBaselineDetail.clear().draw();
            }
            ShowBlockTaskLayer("report-blocker", true);
        },
        function () {
            InitDetailReport(function () { ShowBlockTaskLayer("report-blocker", false); });
        });
});


function SearchBaselineReport(beforeCall, callback) {
    var url = $("#urlGetReport").val();

    var divid = [];
    if (currentTree != undefined) {
        divid = $.jstree.reference(currentTree)
            .get_selected();
    }
    var fromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();

    $.tblDetailData = [];
    var Tags = $("#data_report_Tags").val();
    var msgError = "";

    if (divid.length < 1) {
        msgError = "Bạn phải chọn ít nhất một đơn vị!";
    }

    if (msgError != "") {
        bootbox.alert(msgError);
        return;
    }

    var formdt = new FormData();
    formdt.append("Division", divid);
    formdt.append("FromDate", fromDate);
    formdt.append("ToDate", ToDate);
    formdt.append("Tags", Tags);

    if (beforeCall != undefined && typeof beforeCall === "function") {
        beforeCall();
    }

    $.ajax({
        url: url,
        data: formdt,
        method: "POST",
        processData: false,
        contentType: false,
        success: function (dt) {
            $.tblDetailData = dt.ReportData;
            if (callback != undefined && typeof callback === "function") {
                callback();
            }
        },
        error: function () {

        }
    });
}



var tblBaselineDetail = null;
function InitDetailReport(callback) {
    // $.tblDetailData
    if (tblBaselineDetail != null && $.fn.DataTable.isDataTable('#tbl-detail-baseline')) {
        tblBaselineDetail.clear().draw();
        tblBaselineDetail.rows.add($.tblDetailData).draw();
        MoveDetailTotalRowToHeader();
    } else {
        var hostadd = $("#hostAddress").val();
        tblBaselineDetail = $('#tbl-detail-baseline').DataTable({
            paging: false,
            sort: true,
            orderCellsTop: true,
            fixedHeader: true,
            fixedFooter: false,
            "bInfo": true,
            "bLengthChange": false,
            scrollCollapse: true,
            scrollX: '90%',
            scrollY: '75vh',
            "order": [[0, "desc"]],
            data: $.tblDetailData,
            "info": true,
            "stateSave": false,
            autoWidth: false,
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
            //scrollY: "60vh",
            //"lengthMenu": [10, 25, 50],
            //"pageLength": 50,
            'columnDefs': [
                {
                    'targets': 0,
                    'data': "OppCode",
                    'title': "Mã",
                    'className': "",
                    'width': "70px",//http://10.15.168.163:7990/crm/Opportunities/Details?oppId=143768
                    'render': function (data, type, full, meta) {
                        var str = "<a href='" + hostadd + "Opportunities/Details?oppId=" + full.Id + "'>" + full.OppCode + " </a>";
                        return str;
                    }
                },
                {
                    'targets': 1,
                    'data': "OppName",
                    'title': "Cơ hội",
                    'className': "",
                    'width': "140px",
                    'render': function (data, type, full, meta) {
                        var beforeEc = TrimText(full.OppName);

                        var ttEncode = htmlEncode(beforeEc);
                        var fullec = htmlEncode(full.OppName);
                        var str = "<span data-idopp='" + full.Id + "' title='" + fullec + "'>" + ttEncode + " </span>";
                        return str;
                    }
                },
                {
                    'targets': 2,
                    'data': "AccountName",
                    'title': 'Khách hàng',
                    'className': "",
                    'width': "140px",
                    'render': function (data, type, full, meta) {
                        var beforeEc = TrimText(full.AccountName);

                        var ttEncode = htmlEncode(beforeEc);
                        var fullec = htmlEncode(full.AccountName);

                        //var ttEncode = htmlEncode(full.AccountName);
                        var str = "<span title='" + fullec + "' >" + ttEncode + " </span>";
                        return str;
                    }
                },
                {
                    'targets': 3,
                    'title': "Owner",
                    'data': "OwnerName",
                    'className': "",
                    'width': "70px"
                },
                {
                    'targets': 4,
                    'title': "Đơn vị",
                    'data': "DivisionName",
                    'className': "",
                    'width': "80px"
                },
                {
                    'targets': 5,//doanh số HW
                    'data': "Rev.Hw.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Rev.Hw, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 6, //doanh số sw
                    'data': "Rev.Sw.Current",
                    'className': "",
                    'type': "custom-num",
                    'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Rev.Sw, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 7, //doanh số srv
                    'data': "Rev.Srv.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Rev.Srv, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 8,//doanh số total
                    'data': "Rev.Total.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Rev.Total, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 9, //LG hiện tại
                    'data': "Gp.Hw.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Gp.Hw, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 10, //LG hiện tại
                    'data': "Gp.Sw.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Gp.Sw, "Display_Cr", "text-right")
                        return rs;
                    }
                }, {
                    'targets': 11,//LG hiện tại
                    'data': "Gp.Srv.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Gp.Srv, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 12,//LG hiện tại
                    'data': "Gp.Total.Current",
                    'className': "",
                    'type': "custom-num",
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Gp.Total, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 13,
                    'className': "",//saleStage hiện tại
                    'type': "custom-num",
                    'data': "SaleStage.Current",
                    'render': function (data, type, full, meta) {
                        var str = RenderDatatableCellDataOther(full.SaleStage, "Raw_Current", 1);
                        return str;
                    },
                    'width': "100px"
                },
                {
                    'targets': 14,
                    'className': "",
                    'type': "custom-date",
                    'data': "SignDate.Current",//ngày dự kiến ký hiện tại
                    'render': function (data, type, full, meta) {
                        if (full.SignDate == null) {
                            return "";
                        }
                        var str = full.SignDate.Display_Cr;
                        return str;
                    },
                    'width': "100px"
                },
                {
                    'targets': 15,
                    'className': "",
                    'data': "SuccessRate.Current",//khả năng thành công HT
                    'render': function (data, type, full, meta) {
                        var str = RenderDatatableCellDataOther(full.SuccessRate, "Display_Cr", 1);
                        return str;
                    },
                    'width': "100px"
                },
                {
                    'targets': 16,
                    'className': "",//tổng nhân tỷ lệ
                    'type': "custom-num",
                    'data': "",
                    'render': function (data, type, full, meta) {
                        var totalByRate = full.Rev.Total.Current * full.SuccessRate.Current / (1000000 * 100);
                        var str = "";
                        var cssClass = "text-right";
                        var cssInline = "";
                        var totalStr = totalByRate.toLocaleString(undefined, { minimumFractionDigits: 1 });
                        str += "<p class=' " + cssClass + " ' style=' " + cssInline + " '>" + totalStr + "</p>";
                        $("#totalRate").append("<input class='TotalByRate' type='hidden' value=" + totalByRate + ">");
                        return str;

                    },
                    'width': "100px"
                }
            ],
            "drawCallback": function (settings, json) {
            },
            initComplete: function (settings, json) {
            },

        });

        //inline search
        $('.dataTables_scrollHeadInner thead tr.search-header th input').each(function (id, vl) {
            //var title = $(this).text().toLowerCase();
            // $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');
            var colid = $(vl).data('colid');
            $(vl).on('blur', function () {
                if (tblBaselineDetail.column(colid).search() !== vl.value) {
                    tblBaselineDetail
                        .column(colid)
                        .search(vl.value)
                        .draw();
                }
            });
            $(vl).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    //if (tblPersonalTask.column(i).search() !== this.value) {
                    if (true) {
                        tblBaselineDetail
                            .column(colid)
                            .search(vl.value)
                            .draw();
                    }
                }
            });
        });

        MoveDetailTotalRowToHeader();

        setTimeout(function () {
            var uname = $("#uname-linkdashboard").val();
            uname = uname == null || uname == undefined ? "" : uname;
            console.log(uname);
            if (uname != "") {
                try {
                    $('.dataTables_scrollHeadInner thead tr.search-header th input').eq(3).val(uname).trigger("blur");
                } catch (e) {

                }
            }
        }, 50);

    }

    if (callback != undefined && typeof callback === "function") {
        callback();
    }
}


var currentTree;
var UITree = function () {
    var contextualMenu = function (callback) {

        $("#oppTree-signedSalesAndGP")
            .bind('before.jstree', function (e, data) {
                // invoked before jstree starts loading
                console.log("before.jstree");

            })
            .bind('loaded.jstree', function (e, data) {
                console.log("loaded.jstree");
                // invoked after jstree has loaded
                if (callback != undefined && typeof (callback) == 'function') {
                    callback();
                } else {
                    console.log("loaded.jstree: callback is undefined");
                }
            })

        //render cây division
        currentTree = $("#oppTree-signedSalesAndGP").jstree({
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
        init: function (callback) {
            contextualMenu(callback);
        }
    };
}();

$("#oppTree-signedSalesAndGP").on("select_node.jstree", function (node, selected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(selected.node.id);
    var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#oppTree-signedSalesAndGP").jstree(true).select_node(vl);
        });
    }
});

$("#oppTree-signedSalesAndGP").on("deselect_node.jstree", function (node, deselected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(deselected.node.id);

    var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#oppTree-signedSalesAndGP").jstree(true).deselect_node(vl);
        });
    }
});

$("#dropdown-report-signedSalesAndGP").click(function (e) {
    e.stopPropagation();
});

function TrimText(str, length) {
    if (length == undefined || length < 1) {
        length = 40;
    }
    str = str == null ? "" : str;
    var rs = str.length > length ? str.substring(0, length) + " ..." : str;

    return rs;
}

function MoveDetailTotalRowToHeader() {
    //tblBaselineDetail
    // Get the index of matching row.  Assumes only one match
    //var indexes = tblBaselineDetail.rows().eq(0).filter(function (rowIdx) {    //check column 0 of each row for tradeMsg.message.coin
    //    return tblBaselineDetail.cell(rowIdx, 0).data() == null ? true : false;
    //});
    //// grab the data from the row
    //var data = tblBaselineDetail.row(indexes[0]).data();

    var data = tblBaselineDetail.row(0).data();
    var totalRate = 0;
    $(".TotalByRate").each(function () {
        totalRate += parseInt(this.value);
    });
    $('#tbl-detail-baseline .totalRow').find('td').eq(1).html("<b style='color: #1b5297'>Tổng</b>");

    $('#tbl-detail-baseline .totalRow').find('td').eq(5).html("<b>" + data.Rev.Hw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(6).html("<b>" + data.Rev.Sw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(7).html("<b>" + data.Rev.Srv.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(8).html("<b>" + data.Rev.Total.Display_Cr + "</b>");

    $('#tbl-detail-baseline .totalRow').find('td').eq(9).html("<b>" + data.Gp.Hw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(10).html("<b>" + data.Gp.Sw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(11).html("<b>" + data.Gp.Srv.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(12).html("<b>" + data.Gp.Total.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(16).html("<b>" + totalRate.toLocaleString(undefined, { minimumFractionDigits: 1 }) + "</b>");


    //dataTables_scrollHeadInner
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(1).html("<b style='color: #1b5297'>Tổng</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(5).html("<b>" + data.Rev.Hw.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(6).html("<b>" + data.Rev.Sw.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(7).html("<b>" + data.Rev.Srv.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(8).html("<b>" + data.Rev.Total.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(9).html("<b>" + data.Gp.Hw.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(10).html("<b>" + data.Gp.Sw.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(11).html("<b>" + data.Gp.Srv.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(12).html("<b>" + data.Gp.Total.Display_Cr + "</b>");
    $('.dataTables_scrollHeadInner table .totalRow').find('td').eq(16).html("<b>" + totalRate.toLocaleString(undefined, { minimumFractionDigits: 1 }) + "</b>");

    // remove the row from the table
    tblBaselineDetail.row(0).remove().draw(false);

}

function ClearHeader() {
    for (var i = 0; i < 13; i++) {
        $('#tbl-detail-baseline .totalRow').find('td').eq(i).html("");
    }
}


var MIME_TYPE = 'application/vnd.ms-excel';
function ExportReport() {

    var tblContent = RenderDataExcelDetailReport();

    var bb = new Blob([tblContent], { type: MIME_TYPE });

    //với IE:
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
        window.navigator.msSaveBlob(bb, "ExportPlaningContractSignValue.xls");
    else {
        var a = document.createElement('a');
        a.download = "ExportPlaningContractSignValue.xls";
        a.href = window.URL.createObjectURL(bb);
        a.textContent = ' ';
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        $("body").append(a);
        a.click();
    }
}
function RenderDataExcelDetailReport() {
    var strBuilder = "";

    strBuilder += "<table border='1' cellspacing='0'>";
    strBuilder += "<thead>";

    strBuilder += "<tr>";
    strBuilder += "<th rowspan='2'>" + "Mã cơ hội" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Tên cơ hội" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Mã thầu" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Khách hàng" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Owner" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Đơn vị" + "</th>";

    strBuilder += "<th colspan='4'>" + "Doanh số" + "</th>";
    strBuilder += "<th colspan='4'>" + "Lãi gộp" + "</th>";

    strBuilder += "<th rowspan='2'>" + "Tình trạng" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Ngày dự kiến ký" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Khả năng thành công" + "</th>";
    strBuilder += "<th rowspan='2'>" + "Tags" + "</th>";
    strBuilder += "</tr>";

    strBuilder += "<tr>";

    strBuilder += "<th >" + "Hw" + "</th>";
    strBuilder += "<th >" + "Sw" + "</th>";
    strBuilder += "<th >" + "Srv" + "</th>";
    strBuilder += "<th >" + "Total" + "</th>";

    strBuilder += "<th >" + "Hw" + "</th>";
    strBuilder += "<th >" + "Sw" + "</th>";
    strBuilder += "<th >" + "Srv" + "</th>";
    strBuilder += "<th >" + "Total" + "</th>";
    strBuilder += "</tr>";

    strBuilder += "</thead>";

    strBuilder += "<tbody>";
    $.each($.tblDetailData, function (index, vl) {
        var style = "";


        var row = "<tr>";

        row += "<td> " + vl.OppCode + " </td>";

        var oppname = htmlEncode(vl.OppName);
        if (index == 0) {
            style = "font-weight: bold;";
            row += "<td style='font-weight:bold; color:#1b5297'> " + oppname + " </td>";
        } else {
            row += "<td> " + oppname + " </td>";
        }
        if (vl.OppBidCode !== "" && vl.OppBidCode !== null) {
            if (vl.OppBidCode.startsWith("0")) {
                row += "<td> '" + vl.OppBidCode + "' </td>";
            } else {
                row += "<td> " + vl.OppBidCode + " </td>";
            }
        } else {
            row += "<td> </td>";
        }
        row += "<td> " + htmlEncode(vl.AccountName) + " </td>";
        row += "<td> " + vl.OwnerName + " </td>";
        row += "<td> " + vl.DivisionName + " </td>";

        //rev
        row += RenderExcelCelMember(vl.Rev.Hw, undefined, style);
        row += RenderExcelCelMember(vl.Rev.Sw, undefined, style);
        row += RenderExcelCelMember(vl.Rev.Srv, undefined, style);
        row += RenderExcelCelMember(vl.Rev.Total, undefined, style);

        row += RenderExcelCelMember(vl.Gp.Hw, undefined, style);
        row += RenderExcelCelMember(vl.Gp.Sw, undefined, style);
        row += RenderExcelCelMember(vl.Gp.Srv, undefined, style);
        row += RenderExcelCelMember(vl.Gp.Total, undefined, style);
        //Gp

        //row += RenderExcelCelMember(vl.SaleStage);
        row += "<td> " + vl.SaleStage.Display_Cr + " </td>";

        //row += RenderExcelCelMember(vl.SignDate);
        row += "<td> " + vl.SignDate.Display_Cr + " </td>";
        //row += RenderExcelCelMember(vl.SuccessRate);
        row += "<td> " + vl.SuccessRate.Display_Cr + " </td>";

        row += "<td> " + vl.Tags + " </td>";

        row += "</tr>";

        strBuilder += row;
    });
    strBuilder += "</tbody>";

    strBuilder += "</table>";

    return strBuilder;
}
function RenderExcelCelMember(cell, isRaw, css) {
    var str = "";
    var styleCrnt = css == undefined ? "" : css;

    if (isRaw != undefined) {
        str += "<td style=' " + styleCrnt + "' >";
        str += "<p>" + GetTxt(cell.Current) + "</p>";
        str += "</td>";

    } else {
        str += "<td style=' " + styleCrnt + "' >";
        str += "<p>" + GetTxt(cell.Display_Cr) + "</p>";
        str += "</td>";
    }
    return str;
}



//function ShowBlockTaskLayer(layerId, enable) {
//    // $[layerId];
//    if (enable) {

//        if ($[layerId] != undefined && $[layerId] != null) {
//            clearTimeout($[layerId]);
//        }
//        $[layerId] = setTimeout(function () { ShowBlockTaskLayer(layerId, false) }, 40000);
//        var height = $("#" + layerId).parent().height();
//        $("#" + layerId).height(height + "px");
//        $("#" + layerId).show();

//    } else {
//        if ($[layerId] != undefined && $[layerId] != null) {
//            clearTimeout($[layerId]);
//        }
//        $("#" + layerId).hide();
//        $("#" + layerId).height("unset");
//    }
//}

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



function RenderDatatableCellDataOther(Cell, field, cssClass, cssInline) {

    if (Cell == null) {
        return "";
    }
    var str = "";
    var cssClass = cssClass == undefined ? "" : cssClass;
    var cssInline = cssInline == cssInline ? "" : cssInline;

    str += "<p class=' " + cssClass + " ' style=' " + cssInline + " '>" + GetTxt(Cell[field]) + "</p>";
    return str;
}

function GetTxt(vl) {
    return vl == null ? " " : vl;
}



//#region CreateBaseline

function InitDivisionSelectList() {
    var url = $("#urlGetDivisionSelectList").val();
    //select-divisionlist
    $.ajax({
        url: url,
        method: "GET",
        processData: false,
        contentType: false,
        success: function (dt) {
            if (dt.length > 0) {
                var newArr = [];
                $.each(dt, function (id, vl) {
                    var newObj = {
                        id: vl.Value,
                        text: vl.Text
                    };
                    newArr.push(newObj);
                });

                $("#select-divisionlist").select2({
                    placeholder: "",
                    width: '100%',
                    data: newArr
                });
            }
        },
        error: function () {

        }
    });
}

function ShowCreateBaselineModal() {
    $("#modal-create-baseline").modal({ backdrop: 'static', keyboard: false });
}

var loaddingcreatebl = false;
function CreateBaseline() {
    if (!loaddingcreatebl) {

        var url = $("#urlCreateBaseline").val();
        var divid = $("#select-divisionlist").val();

        if (divid == undefined || divid == null || divid == "") {
            bootbox.alert("Bạn phải chọn một đơn vị!");
        }
        //popup-blocker
        ShowBlockTaskLayer("popup-blocker", true);
        loaddingcreatebl = true;
        //baseline-note
        var fdt = new FormData();
        fdt.append("chk", divid);
        fdt.append("note", $("#baseline-note").val());

        $.ajax({
            url: url + "",
            method: "POST",
            processData: false,
            contentType: false,
            data: fdt,
            success: function (dt) {
                ShowBlockTaskLayer("popup-blocker", false);
                //baseline-note
                bootbox.alert(dt.Message, function () {
                    $("#modal-create-baseline").modal("hide");
                });
                loaddingcreatebl = false;
            },
            error: function () {
                loaddingcreatebl = false;
                bootbox.alert("Có lỗi xảy ra, vui lòng thử lại sau!", function () {

                });
                ShowBlockTaskLayer("popup-blocker", false);
            }
        });
    }

}

function SelectedTagsChanged() {
    var strVl = "";
    var dataTags = $('#select_report_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}


//#endregion