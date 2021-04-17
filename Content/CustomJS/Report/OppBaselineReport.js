

$(function () {
    $("#monthSelect").datepicker({
        format: "mm/yyyy",
        viewMode: "months",
        minViewMode: "months",
        autoclose: true,
        showClear: true
    });
    $("#monthSelect").val(moment().format('MM/YYYY'));


    LoadListBaseline(function () {
        ShowBlockTaskLayer("report-blocker", true);
    }, function () {
        SearchBaselineReport(undefined, function () {
            ShowBlockTaskLayer("report-blocker", false);
        });
    });

    $(document).on("change", "#CheckboxShowDetail", function () {
        OnchangeDetail();
    });
});

//#region user action 

function LoadListBaseline(callfirst, callback) {
    //onchange division select
    //urlLoadListBaseline
    if (callfirst != undefined && typeof callfirst === "function") {
        callfirst();
    }
    var url = $("#urlLoadListBaseline").val();
    var divid = $("#selectDivision").val();
    if (divid == '' || divid == null) {
        $("#selectBaseline").val(null).trigger("change").empty();
        return;
    } else {
        $("#selectBaseline").val(null).trigger("change").empty();

        $.ajax({
            method: "GET",
            url: url + divid,
            success: function (dt) {
                if (dt != null && dt.Data != null && dt.Data.length > 0) {
                    $.each(dt.Data, function (index, value) {
                        var htmlop = "<option value='" + value.Id + "'>";
                        htmlop += htmlEncode( value.Name);
                        htmlop += "</option>";

                        $("#selectBaseline").append(htmlop);
                    });
                }
                if (callback != undefined && typeof callback === "function") {
                    callback();
                }
            },
            error: function (a, b, c) {
                bootbox.confirm("Không thể lấy baseline, vui lòng tải lại trang!", function (r) {
                    if (r) {
                        location.href = location.href;
                    }
                });
            }

        });
    }
}

function OnclickSearchBaseline() {

    SearchBaselineReport(function () {
        ShowBlockTaskLayer("report-blocker", true);
    }, function () {
        ShowBlockTaskLayer("report-blocker", false);
    });
}

function SearchBaselineReport(callfirst, callback) {
    var url = $("#urlLoadReport").val();
    var divid = $("#selectDivision").val();
    var blId = $("#selectBaseline").val();

    var dateSearch = $("#monthSelect").val();

    document.getElementById('tblDivisionReport').getElementsByTagName('tbody')[0].innerHTML = "";
    $.tblDetailData = [];

    var msgError = "";

    if (blId == null || blId == "") {
        msgError = "Không có bản baseline nào!";
    }

    if (dateSearch == null || dateSearch == "") {
        msgError = "Bạn phải chọn tháng để xem báo cáo!";
    }
    if (msgError != "") {
        bootbox.alert(msgError);
        if (callback != undefined && typeof callback === "function") {
            callback();
        }
        return;
    }

    var formdt = new FormData();
    formdt.append("divId", divid);
    formdt.append("baselineId", blId);
    formdt.append("dateSearch", "01/" + dateSearch);


    if (callfirst != undefined && typeof callfirst === "function") {
        callfirst();
    }

    $.ajax({
        url: url,
        data: formdt,
        method: "POST",
        processData: false,
        contentType: false,
        success: function (dt) {
            InitDivReport(dt.DivisionReport);
            $.tblDetailData = dt.DetailReport;
            $.tblDivData = dt.DivisionReport;
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
    //clear search header

    //tbl-detail-baseline
    $.each($("#tbl-detail-baseline_wrapper .search-header input"), function (ix, vl) {

        $(vl).val("");
    });
 
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
            "order": [[0, "desc"]],
            data: $.tblDetailData,
            scrollY: '60vh',
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
                    'width': "100px",
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
                    width: "130px",
                    'render': function (data, type, full, meta) {
                        var ttEncode = htmlEncode(full.OppName);
                        var str = "<span data-idopp='" + full.Id + "'>" + ttEncode + " </span>";
                        return str;
                    }
                },
                {
                    'targets': 2,
                    'data': "AccountName",
                    'title': 'Khách hàng',
                    'className': "",
                    'render': function (data, type, full, meta) {
                        var ttEncode = htmlEncode(full.AccountName);
                        var str = "<span >" + ttEncode + " </span>";
                        return str;
                    }
                },
                {
                    'targets': 3,
                    'title': "Owner",
                    'data': "OwnerName",
                    'className': "",
                    //'width': "70px"
                },
                {
                    'targets': 4,
                    'title': "Đơn vị",
                    'data': "DivisionName",
                    'className': "",
                    //'width': "130px"
                },
                {
                    'targets': 5,
                    'title': "Hiện tại", //doanh số ký hiện tại
                    'data': "Rev.Total.Current",
                    'type': "custom-num",
                    'className': "tdDetail ",
                    //width: "50px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataNumber(full.Rev, "Display_Cr", 1, 1)
                        return rs;
                    }
                },
                {
                    'targets': 6,
                    'title': "Baseline", //doanh số ký bl
                    'data': "Rev.Total.Baseline",
                    'className': "tdDetail ",
                    'type': "custom-num",
                    //width: "70px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataNumber(full.Rev, "Display_Bl")
                        return rs;
                    }
                },
                {
                    'targets': 7,
                    'targets': 7,
                    'title': "Hiện tại", //LG hiện tại
                    'data': "Gp.Total.Current",
                    'className': "tdDetail ",
                    'type': "custom-num",
                    //width: "50px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataNumber(full.Gp, "Display_Cr", undefined, 1)
                        return rs;
                    }
                },
                {
                    'targets': 8,
                    'title': "Baseline", //LG Bl
                    'data': "Gp.Total.Baseline",
                    'className': "tdDetail ",
                    'type': "custom-num",
                    //width: "70px",
                    'render': function (data, type, full, meta) {
                        var rs = RenderDatatableCellDataNumber(full.Gp, "Display_Bl")
                        return rs;
                    }
                },
                {
                    'targets': 9,
                    'className': "",
                    'data': "SaleStage.Current",//saleStage hiện tại
                    'title': "Hiện tại",
                    'render': function (data, type, full, meta) {
                        var str = RenderDatatableCellDataOther(full.SaleStage, "Raw_Current", 1);
                        return str;
                    },
                    //'width': "100px"
                },
                {
                    'targets': 10,
                    'className': "",
                    'data': "SaleStage.Baseline",//saleStage BL
                    'title': "Baseline",
                    'render': function (data, type, full, meta) {
                        var str = RenderDatatableCellDataOther(full.SaleStage, "Raw_Baseline");
                        return str;
                    },
                    //'width': "100px"
                },
                {
                    'targets': 11,
                    'className': "",
                    'data': "SignDate.Current",//ngày dự kiến ký hiện tại
                    'title': "Hiện tại",
                    'type': "custom-date",
                    'render': function (data, type, full, meta) {
                        //var str = full.SignDate.Display_Cr;
                        var str = RenderDatatableCellDataOther(full.SignDate, "Display_Cr",1);
                        return str;
                    },
                    //'width': "100px"
                },
                {
                    'targets': 12,
                    'className': "",
                    'data': "SignDate.Baseline",//ngày dự kiến ký BL
                    'title': "Baseline",
                    'type': "custom-date",
                    'render': function (data, type, full, meta) {
                        //var str = full.SignDate.Display_Bl;
                        var str = RenderDatatableCellDataOther(full.SignDate, "Display_Bl");
                        return str;
                    },
                    //'width': "100px"
                },
                {
                    'targets': 13,
                    'className': "",
                    'data': "SuccessRate.Current",//khả năng thành công HT
                    'title': "Hiện tại",
                    'render': function (data, type, full, meta) {
                        var str = RenderDatatableCellDataOther(full.SuccessRate, "Display_Cr", 1);
                        return str;
                    },
                    //'width': "100px"
                },
                {
                    'targets': 14,
                    'className': "",
                    'data': "SuccessRate.Baseline",//khả năng thành công BL
                    'title': "Baseline",
                    'render': function (data, type, full, meta) {
                        var str = RenderDatatableCellDataOther(full.SuccessRate, "Display_Bl");
                        return str;
                    },
                    //'width': "100px"
                },

            ],
            "drawCallback": function (settings, json) {
                //// Get the index of matching row.  Assumes only one match
                //var indexes = table.rows().eq(0).filter(function (rowIdx) {    //check column 0 of each row for tradeMsg.message.coin
                //    return table.cell(rowIdx, 0).data() === 'Ashton Cox' ? true : false;
                //});

                //// grab the data from the row
                //var data = table.row(indexes).data();

                //// populate the .second header with the data
                //for (i = 0; i < data.length; i++) {
                //    $('.second').find('th').eq(i).html(data[i]);
                //}

                //// remove the row from the table
                //table.row(indexes).remove().draw(false);

            },
            initComplete: function (settings, json) {

            },
            "info": true,
            "stateSave": false
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

        var btnExport = "<button class='btn btn-default' onclick='ExportDetailReport() '> Export </button>";
        $("#tbl-detail-baseline_filter").prepend(btnExport);
        var checkbtn =
            '<label>' +
            '<input onchange="OnchangeDetailReportDetail()" id="detailReportCheckDetail" style="height: auto;" type="checkbox" />' +
            '<span>Hiện chi tiết</span>' +
            '</label> ';
        $("#tbl-detail-baseline_filter").prepend(checkbtn);
        MoveDetailTotalRowToHeader();

        if (callback != undefined && typeof callback === "function") {
            callback();
        }
    }
}
//keypress hoặc blur
function OnKeypresColumnBaselineDetail(e) {
    var colid = -1;
    var searchVl ="";
    if (e.type == "keypress") {
        if (e.charCode == 13) {
            //enter mới tính
            var cid = $(e.target).data("colid");
            searchVl = $(e.target).val();

            colid = parseInt(cid);
        } else {
            //ignore
        }
    }

    if (e.type == "blur") {
        var cid = $(e.target).data("colid");
        colid = parseInt(cid);
        searchVl = $(e.target).val();
    }
 
    if (colid >= 0) {
        //search
        tblBaselineDetail.columns(colid)
            .search(searchVl)
            .draw();
    }
}

function MoveDetailTotalRowToHeader() {
    //tblBaselineDetail
    // Get the index of matching row.  Assumes only one match
    //var indexes = tblBaselineDetail.rows().eq(0).filter(function (rowIdx) {    //check column 0 of each row for tradeMsg.message.coin
    //    return tblBaselineDetail.cell(rowIdx, 0).data() == null ? true : false;
    //});

    // grab the data from the row
    var data = tblBaselineDetail.row(0).data();

    data = data == undefined ? {} : data;
    //console.log(data);

    $('#tbl-detail-baseline .totalRow').find('td').eq(2).html(data.OppName);
    $('#tbl-detail-baseline .totalRow').find('td').eq(5).html(data.Rev.Total.Display_Cr);
    $('#tbl-detail-baseline .totalRow').find('td').eq(6).html(data.Rev.Total.Display_Bl);

    $('.dataTables_scrollHeadInner .totalRow').find('td').eq(2).html(data.OppName);
    $('.dataTables_scrollHeadInner .totalRow').find('td').eq(5).html(data.Rev.Total.Display_Cr);
    $('.dataTables_scrollHeadInner .totalRow').find('td').eq(6).html(data.Rev.Total.Display_Bl);


    if (data.Rev.Total.Comparer != 0) {
        var classCrnt = "";
        if (data.Rev.Total.Comparer == 1) {
            classCrnt = "data-good";
        }
        if (data.Rev.Total.Comparer == 2) {
            classCrnt = "data-bad";
        }
        $('#tbl-detail-baseline .totalRow').find('td').eq(5).addClass(classCrnt);
        $('.dataTables_scrollHeadInner .totalRow').find('td').eq(5).addClass(classCrnt);
    } else {
        $('#tbl-detail-baseline .totalRow').find('td').eq(5).removeClass("data-bad");
        $('#tbl-detail-baseline .totalRow').find('td').eq(5).removeClass("data-good");

        $('.dataTables_scrollHeadInner .totalRow').find('td').eq(5).removeClass("data-bad");
        $('.dataTables_scrollHeadInner .totalRow').find('td').eq(5).removeClass("data-good");
    }

    $('#tbl-detail-baseline .totalRow').find('td').eq(7).html(data.Gp.Total.Display_Cr);
    $('#tbl-detail-baseline .totalRow').find('td').eq(8).html(data.Gp.Total.Display_Bl);

    $('.dataTables_scrollHeadInner .totalRow').find('td').eq(7).html(data.Gp.Total.Display_Cr);
    $('.dataTables_scrollHeadInner .totalRow').find('td').eq(8).html(data.Gp.Total.Display_Bl);

    if (data.Gp.Total.Comparer != 0) {
        var classCrnt = "";
        if (data.Gp.Total.Comparer == 1) {
            classCrnt = "data-good";
        }
        if (data.Gp.Total.Comparer == 2) {
            classCrnt = "data-bad";
        }
        $('#tbl-detail-baseline .totalRow').find('td').eq(7).addClass(classCrnt);
        $('.dataTables_scrollHeadInner .totalRow').find('td').eq(7).addClass(classCrnt);
    } else {
        $('#tbl-detail-baseline .totalRow').find('td').eq(7).removeClass("data-bad");
        $('#tbl-detail-baseline .totalRow').find('td').eq(7).removeClass("data-good");

        $('.dataTables_scrollHeadInner .totalRow').find('td').eq(7).removeClass("data-bad");
        $('.dataTables_scrollHeadInner .totalRow').find('td').eq(7).removeClass("data-good");
    }
    // remove the row from the table
    tblBaselineDetail.row(0).remove().draw();

    //settimeout để tránh trường hợp modal chưa kịp show lên đã init bảng => bị lỗi giao diện
    setTimeout(function () {
        tblBaselineDetail.draw();
    }, 100);
   

}

function InitDivReport(data) {
    // $("#tblDivisionReport tbody").empty();
    if (data != undefined && data.length > 0) {
        var html = "";
        $.each(data, function (index, value) {

            var trs = "";

            //value
            if (index == 0) {
                trs = "<tr style='font-weight: bold'>";
                trs += "<td style='color: #1b5297'> " + value.Name + " </td>";
            } else {
                trs = "<tr>";
                trs += "<td> " + value.Name + " </td>";
            }
            //

            //doanh số
            trs += RenderRevCells(value.Rev_High, 1, "text-right");
            trs += RenderRevCells(value.Rev_Med, undefined, "text-right");
            trs += RenderRevCells(value.Rev_Low, undefined, "text-right");

            //ds kế hoạch
            trs += "<td> <p class='text-right'> " + GetTxt(value.Rev_Plan.Total.Display_Cr)+ "</p> </td>";

            //lãi gộp
            trs += RenderRevCells(value.Gp_High, undefined, "text-right");
            trs += RenderRevCells(value.Gp_Med, undefined, "text-right");
            trs += RenderRevCells(value.Gp_Low, undefined, "text-right");

            //lg kế hoạch
            trs += "<td> <p class='text-right'> " + GetTxt(value.Gp_Plan.Total.Display_Cr) + "</p> </td>";

            trs += "</tr>";
            //$("#tblDivisionReport tbody").append(trs);

            html += trs;
        });

        document.getElementById('tblDivisionReport').getElementsByTagName('tbody')[0].innerHTML = html;
        OnchangeDetail();
        $("#show-detail-btn").show();
    } else {
        $("#show-detail-btn").hide();
    }
}


//ExportDetailReport
//ExportDivisionReport



var MIME_TYPE = 'application/vnd.ms-excel';
function ExportDivisionReport() {
    LoadListBaseline(function () {
        ShowBlockTaskLayer("report-blocker", true);
    }, function () {
        SearchBaselineReport(undefined, function () {
            SaveDivisionReport();
            ShowBlockTaskLayer("report-blocker", false);
        });
    });
}
function ExportDetailReport() {
    SaveDetailReport();
}


function SaveDivisionReport() {
    var tblContent = RenderDataExcelDivision();

    var bb = new Blob([tblContent], { type: MIME_TYPE });

    //với IE:
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
        window.navigator.msSaveBlob(bb, "ExportBaselineDivisionReport.xls");
    else {
        var a = document.createElement('a');
        a.download = "ExportBaselineDivisionReport.xls";
        a.href = window.URL.createObjectURL(bb);
        a.textContent = ' ';
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        $("body").append(a);
        a.click();
    }
}


function SaveDetailReport() {

    var tblContent = RenderDataExcelDetailReport();

    var bb = new Blob([tblContent], { type: MIME_TYPE });

    //với IE:
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
        window.navigator.msSaveBlob(bb, "ExportBaselineDetailReport.xls");
    else {
        var a = document.createElement('a');
        a.download = "ExportBaselineDetailReport.xls";
        a.href = window.URL.createObjectURL(bb);
        a.textContent = ' ';
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        $("body").append(a);
        a.click();
    }

}
//#endregion


function OnchangeDetail() {
    if ($("#CheckboxShowDetail").prop("checked")) {
        $("#tblDivisionReport td table.tbl-detail").show();
    } else {
        $("#tblDivisionReport td table.tbl-detail").hide();
    }
}


function OnchangeDetailReportDetail() {
    if ($("#detailReportCheckDetail").prop("checked")) {
        $("#tbl-detail-baseline td table.tbl-detail").show();
    } else {
        $("#tbl-detail-baseline td table.tbl-detail").hide();
    }
}

function GetTxt(vl) {
    return vl == null
        ? "0"
        : (vl == '-'? "0":vl);
}


//#region render table

/// <summary>
/// 0: current == baseline <para/>
/// 1: Current > baseline <para/>
/// 2: baseline > current <para/>
/// render 3 cell: hiện tại, baseline, lệch
/// </summary>
function RenderRevCells(Cell, addtitle, css) {
    //Cell.Hw
    //Cell.Sw
    //Cell.Srv
    //Cell.Total
    css = css == undefined ? "" : css;
    var str = "";

    //#region current

    var classCrnt = "";
    if (Cell.Total.Comparer == 1) {
        classCrnt = "data-good";
    }
    if (Cell.Total.Comparer == 2) {
        classCrnt = "data-bad";
    }
    str += "<td class='tdDetail " + classCrnt + "' >";
    str += "<p class='" + css + "'> " + GetTxt(Cell.Total.Display_Cr) + "</p>";
    var tblDetail = RenderCellDetailTable(Cell, "Display_Cr", addtitle);

    str += tblDetail;
    str += "</td>";

    //#endregion

    //#region baseline

    str += "<td class='tdDetail' >";
    str += "<p class='" + css + "'> " + GetTxt(Cell.Total.Display_Bl) + "</p>";
    var tblDetail2 = RenderCellDetailTable(Cell, "Display_Bl");
    str += tblDetail2;
    str += "</td>";

    //#endregion


    //#region diff

    str += "<td class='tdDetail' >";
    str += "<p  class='" + css + "'>" + GetTxt(Cell.Total.Display_Diff) + "</p>";
    var tblDetail3 = RenderCellDetailTable(Cell, "Display_Diff");
    str += tblDetail3;

    str += "</td>";

    //#endregion

    return str;
}

function RenderCellDetailTable(Cell, field, addtitle) {

    var tblDetail = "<table class='table tbl-detail' style='display:none'>";
    tblDetail += "<tr class='txt-hw text-right'> " + (addtitle == 1 ? "<td class='text-left'> <b> HW: </b> </td>" : "") + "<td>" + GetTxt(Cell.Hw[field]) + "</td>" + " </tr>";
    tblDetail += "<tr class='txt-sw text-right'> " + (addtitle == 1 ? "<td class='text-left'> <b> SW: </b> </td>" : "") + "<td>" + GetTxt(Cell.Sw[field]) + "</td>" + " </tr>";
    tblDetail += "<tr class='txt-srv text-right'> " + (addtitle == 1 ? "<td class='text-left'> <b> Srv: </b> </td>" : "") + "<td>" + GetTxt(Cell.Srv[field]) + "</td>" + " </tr>";
    tblDetail += "</table>";
    return tblDetail;
}

//Cell là object number, chứa 4 compare baseline: hw, sw, srv, total
function RenderDatatableCellDataNumber(Cell, field, addtitle, renderCompare) {
    var str = "";
    var classCrnt = "";

    if (renderCompare == 1) {
        if (Cell.Total.Comparer == 1) {
            classCrnt = "data-good";
        }
        if (Cell.Total.Comparer == 2) {
            classCrnt = "data-bad";
        }
    }
    str += "<p class='" + classCrnt + " text-right'>" + GetTxt(Cell.Total[field]) + "</p>";
    var tblDetail3 = RenderCellDetailTable(Cell, field, addtitle);
    str += tblDetail3;

    return str;
}

//Cell là object compare baseline
function RenderDatatableCellDataOther(Cell, field, renderCompare) {
    var str = "";
    var classCrnt = "";
    if (renderCompare == 1) {
        if (Cell.Comparer == 1) {
            classCrnt = "data-good";
        }
        if (Cell.Comparer == 2) {
            classCrnt = "data-bad";
        }
    }
    str += "<p class='" + classCrnt + "'>" + GetTxt(Cell[field]) + "</p>";
    return str;
}

function ShowDetailReport() {
    //
    var dateSearch = $("#monthSelect").val();
    $("#editTask-Title").text("Chi tiết baseline cơ hội có khả năng ký tháng " + dateSearch);
    $("#modal-baseline-detail").modal("show");
    setTimeout(function () {
        InitDetailReport();
    }, 100)
    
}



//#endregion


//#region render excel

function RenderDataExcelDivision() {
    var strBuilder = "";

    strBuilder += "<table border='1' cellspacing='0'>";
    strBuilder += "<thead>";

    strBuilder += "<tr>";
    strBuilder += "<th rowspan='4'>" + "Đơn vị" + "</th>";
    strBuilder += "<th colspan='24'>" + "Doanh số" + "</th>";
    strBuilder += "<th colspan='24'>" + "Lãi gộp" + "</th>";
    strBuilder += "</tr>";

    strBuilder += "<tr>";
    strBuilder += "<th colspan='8'>" + "Khả năng cao" + "</th>";
    strBuilder += "<th colspan='8'>" + "Khả năng trung bình" + "</th>";
    strBuilder += "<th colspan='8'>" + "Khả năng thấp" + "</th>";
    strBuilder += "<th colspan='8'>" + "Khả năng cao" + "</th>";
    strBuilder += "<th colspan='8'>" + "Khả năng trung bình" + "</th>";
    strBuilder += "<th colspan='8'>" + "Khả năng thấp" + "</th>";
    strBuilder += "</tr>";

    strBuilder += "<tr>";
    for (var i = 0; i < 6; i++) {
        strBuilder += "<th colspan='2'>" + "Hw" + "</th>";
        strBuilder += "<th colspan='2'>" + "Sw" + "</th>";
        strBuilder += "<th colspan='2'>" + "Srv" + "</th>";
        strBuilder += "<th colspan='2'>" + "Total" + "</th>";
    }
    strBuilder += "</tr>";



    strBuilder += "<tr>";
    for (var i = 0; i < 12; i++) {
        strBuilder += "<th colspan='2'>" + "Hiện tại" + "</th>";
        strBuilder += "<th colspan='2'>" + "Baseline" + "</th>";
    }
    strBuilder += "</tr>";

    strBuilder += "</thead>";

    strBuilder += "<tbody>";
    $.each($.tblDivData, function (index, vl) {
        var row = "<tr>";

        if (index == 0) {
            row = "<tr style='font-weight: bold'>";
            row += "<td style='color: #1b5297'> " + vl.Name + " </td>";
        } else {
            row = "<tr>";
            row += "<td> " + vl.Name + " </td>";
        }

        //rev
        row += RenderExcelCellGroup(vl.Rev_High);
        row += RenderExcelCellGroup(vl.Rev_Med);
        row += RenderExcelCellGroup(vl.Rev_Low);

        //Gp
        row += RenderExcelCellGroup(vl.Gp_High);
        row += RenderExcelCellGroup(vl.Gp_Med);
        row += RenderExcelCellGroup(vl.Gp_Low);

        row += "</tr>";

        strBuilder += row;
    });
    strBuilder += "</tbody>";

    strBuilder += "</table>";

    return strBuilder;
}

//#|   HW    |   Sw    |   Srv   |  total  |
// | Ht | BL | Ht | BL | Ht | BL | Ht | BL |
//
function RenderExcelCellGroup(cells, isRaw) {
    var str = "";
    str += RenderExcelCelMember(cells.Hw, isRaw, "text-align: right;");
    str += RenderExcelCelMember(cells.Sw, isRaw, "text-align: right;");
    str += RenderExcelCelMember(cells.Srv, isRaw, "text-align: right;");
    str += RenderExcelCelMember(cells.Total, isRaw, "text-align: right;");
    return str;
}

//
// | Ht | BL | 
//
function RenderExcelCelMember(cell, isRaw, css) {
    var str = "";
    var styleCrnt = css == undefined ? "" : css;
    if (cell.Comparer == 1) {
        styleCrnt += "color: green;";
    }
    if (cell.Comparer == 2) {
        styleCrnt += "color: #ff6a00;";
    }
    if (isRaw != undefined) {
        str += "<td style=' " + styleCrnt + "' >";
        str += "<p>" + GetTxt(cell.Current) + "</p>";
        str += "</td>";

        str += "<td style='' >";
        str += "<p>" + GetTxt(cell.Baseline) + "</p>";
        str += "</td>";
    } else {
        str += "<td style=' " + styleCrnt + "' >";
        str += "<p>" + GetTxt(cell.Display_Cr) + "</p>";
        str += "</td>";

        str += "<td style='' >";
        str += "<p>" + GetTxt(cell.Display_Bl) + "</p>";
        str += "</td>";
    }
    return str;
}


function RenderDataExcelDetailReport() {
    var strBuilder = "";

    strBuilder += "<table border='1' cellspacing='0'>";
    strBuilder += "<thead>";

    strBuilder += "<tr>";
    strBuilder += "<th rowspan='3'>" + "Mã cơ hội" + "</th>";
    strBuilder += "<th rowspan='3'>" + "Tên cơ hội" + "</th>";
    strBuilder += "<th rowspan='3'>" + "Khách hàng" + "</th>";
    strBuilder += "<th rowspan='3'>" + "Owner" + "</th>";
    strBuilder += "<th rowspan='3'>" + "Đơn vị" + "</th>";

    strBuilder += "<th colspan='8'>" + "Doanh số" + "</th>";
    strBuilder += "<th colspan='8'>" + "Lãi gộp" + "</th>";

    strBuilder += "<th rowspan='2' colspan='2'>" + "Tình trạng" + "</th>";
    strBuilder += "<th rowspan='2' colspan='2'>" + "Ngày dự kiến ký" + "</th>";
    strBuilder += "<th rowspan='2' colspan='2'>" + "Khả năng thành công" + "</th>";
    strBuilder += "</tr>";

    strBuilder += "<tr>";

    strBuilder += "<th colspan='2'>" + "Hw" + "</th>";
    strBuilder += "<th colspan='2'>" + "Sw" + "</th>";
    strBuilder += "<th colspan='2'>" + "Srv" + "</th>";
    strBuilder += "<th colspan='2'>" + "Total" + "</th>";

    strBuilder += "<th colspan='2'>" + "Hw" + "</th>";
    strBuilder += "<th colspan='2'>" + "Sw" + "</th>";
    strBuilder += "<th colspan='2'>" + "Srv" + "</th>";
    strBuilder += "<th colspan='2'>" + "Total" + "</th>";
    strBuilder += "</tr>";

    strBuilder += "<tr>";
    for (var i = 0; i < 11; i++) {
        strBuilder += "<th>" + "Hiện tại" + "</th>";
        strBuilder += "<th>" + "Baseline" + "</th>";
    }
    strBuilder += "</tr>";

    strBuilder += "</thead>";

    strBuilder += "<tbody>";
    $.each($.tblDetailData, function (index, vl) {
        var row = "<tr>";

        row += "<td> " + vl.OppCode + " </td>";
        row += "<td> " + vl.OppName + " </td>";
        row += "<td> " + vl.AccountName + " </td>";
        row += "<td> " + vl.OwnerName + " </td>";
        row += "<td> " + vl.DivisionName + " </td>";

        //rev
        row += RenderExcelCellGroup(vl.Rev);

        //Gp
        row += RenderExcelCellGroup(vl.Gp);

        row += RenderExcelCelMember(vl.SaleStage);
        row += RenderExcelCelMember(vl.SignDate);
        row += RenderExcelCelMember(vl.SuccessRate);

        row += "</tr>";

        strBuilder += row;
    });
    strBuilder += "</tbody>";

    strBuilder += "</table>";

    return strBuilder;
}

//#endregion
