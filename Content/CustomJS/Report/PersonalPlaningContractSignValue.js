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
    $("#lstAmId").val($("#AmId").val()).trigger("change");
    $('#btnSubmitSearchReport').click();

    //$('#btnSubmitSearchReport').click();
});
function SelectedTagsChanged() {
    var strVl = "";
    var dataTags = $('#select_report_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        strVl = dataTags.join(',');
    }
    $("#data_report_Tags").val(strVl);
}

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

    var fromDate = $("#FromDate").val();
    var ToDate = $("#ToDate").val();
    var AmId = 0

    if ($("#lstAmId").length > 0) {
        var AmId = $("#lstAmId").val();
    }

    $.tblDetailData = [];
    var Tags = $("#data_report_Tags").val();

    var msgError = "";
    //validate bằng error msg
    //

    if (msgError != "") {
        bootbox.alert(msgError);
        return;
    }

    var formdt = new FormData();
    formdt.append("FromDate", fromDate);
    formdt.append("ToDate", ToDate);
    formdt.append("AmId", AmId);
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
            autoWidth:false,
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
                        var str = "<span data-idopp='" + full.Id + "' title='" + fullec+"'>" + ttEncode + " </span>";
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
                        var str = "<span title='" + fullec+"' >" + ttEncode + " </span>";
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
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Gp.Sw, "Display_Cr", "text-right")
                        return rs;
                    }
                }, {
                    'targets': 11,//LG hiện tại
                    'data': "Gp.Srv.Current",
                    'className': "",
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
                    //'width': "75px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataOther(full.Gp.Total, "Display_Cr", "text-right")
                        return rs;
                    }
                },
                {
                    'targets': 13,
                    'className': "",//saleStage hiện tại
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
            ],
            "drawCallback": function (settings, json) {
            },
            initComplete: function (settings, json) {
            },
           
        });

        //inline search
        $('#tbl-detail-baseline thead tr.search-header th input').each(function (id, vl) {
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
    }

    if (callback != undefined && typeof callback === "function") {
        callback();
    }
}



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
    $('#tbl-detail-baseline .totalRow').find('td').eq(1).html("<b style='color: #1b5297'>Tổng</b>");

    $('#tbl-detail-baseline .totalRow').find('td').eq(5).html("<b>" + data.Rev.Hw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(6).html("<b>" + data.Rev.Sw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(7).html("<b>" + data.Rev.Srv.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(8).html("<b>" + data.Rev.Total.Display_Cr + "</b>");

    $('#tbl-detail-baseline .totalRow').find('td').eq(9).html("<b>" + data.Gp.Hw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(10).html("<b>" + data.Gp.Sw.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(11).html("<b>" + data.Gp.Srv.Display_Cr + "</b>");
    $('#tbl-detail-baseline .totalRow').find('td').eq(12).html("<b>" + data.Gp.Total.Display_Cr + "</b>");


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

    // remove the row from the table
    tblBaselineDetail.row(0).remove().draw(false);

}

function ClearHeader() {
    for (var i = 0; i < 13; i++) {
        $('#tbl-detail-baseline .totalRow').find('td').eq(i).html("");
    }
}


var MIME_TYPE = 'application/vnd.ms-excel';
c vvbbvcbvcbvcvbn {

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
        if (!!vl.Tags) {
            row += "<td> " + vl.Tags + " </td>";
        } else {
            row += "<td></td>";
        }
       

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


//#endregion