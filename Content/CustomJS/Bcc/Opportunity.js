var table;
var tableBcc;
var roleSMO = false;
var arradvancedSearch = [];
var isOngoing = "";
var isHistory = "";
var createdDateFrom = "";
var createdDateTo = "";
var AccIndustry = "";
var lstDivisionId = "";
var lstOwnerId = "";
var arradvancedSearchcheck = [];
var dataSearch = "";
$(document).ready(function () {
    GetListAcc();
});

function GetListAcc(advancedSearch) {
    var url = $("#urlLoadListOpp").val();

    table = $('#acc-table').DataTable({
        "autoWidth": false,
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        //order: [[7, "desc"]],
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
        rowId: 'staffId',
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "pageLength": 50,
        "ajax": {
            "url": url,
            type: "POST",
            data: function (d) {
                dataSearch = $.extend({},
                    d,
                    {
                        "isViewOwner": $("#isViewOwner1").prop("checked"),
                        "isViewDivision": $("#isViewDivision1").prop("checked"),
                        "isViewDivisonOwner": $("#isViewDivisonOwner1").prop("checked"),
                        "advancedSearch": arradvancedSearch,
                        "isOngoingIndex": isOngoing,
                        "isHistoryIndex": isHistory,
                    });
                return dataSearch;
            },
            error: defaultAjaxErrorHandle
        },
        "columns": GetListAccProperty(),
        'columnDefs': [
            {
                'targets': -1,
                "data": null,
                'searchable': false,
                'orderable': false,
                "width": "auto",
                'className': "text-center",
                'render': function(data, type, full, meta) {
                    var str = "";
                    str += "<div class='btn-group' role='group'>";
                    str +=
                        "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";
                    str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1' >";

                    //if (full.Code == null) {
                    //    str += " <li><a onclick='CreateBccOpportunity(" +
                    //        full.Id + "," + full.BCCId +
                    //        ")' title='Tạo cơ hội BCC' class=' popoverclass'>";
                    //    str += "Tạo cơ hội BCC";
                    //    str += "</a></li>";
                    //} else {
                        
                    //}

                    if (full.BCCCode == null) {
                        str += " <li><a onclick='OpenModal(" +
                            full.Id +
                            ")' title='Map cơ hội BCC' class=' popoverclass'>";
                        str += "Map cơ hội BCC";
                        str += "</a></li>";
                            str += " <li><a onclick='CreateBccOpportunity(" +
                                full.Id + "," + full.BCCId +
                                ")' title='Tạo cơ hội BCC' class=' popoverclass'>";
                            str += "Tạo cơ hội BCC";
                            str += "</a></li>";
                    } else {
                        if (full.Code != null && full.Code != '') {
                            str += " <li><a onclick='UnMap(" +
                                full.Id + "," + full.BCCId +
                                ")' title='Hủy map cơ hội BCC' class=' popoverclass'>";
                            str += "Hủy map cơ hội BCC";
                            str += "</a></li>";
                        }
                    }

                    str += " </div></div>";
                    str += "<input type='hidden' class='acc-redirect-id' value='" + full.Id + "' />";
                    return str;
                }
            },
            {
                'targets': 0,
                "width": "auto",
                'className': "acc-redirect",
                'render': function(data, type, full, meta) {
                    var dataAccountCode = htmlEncode(full.Code);
                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Opportunities/Details?oppId=" + full.Id + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + dataAccountCode + "</a>";
                    return str;
                }

            },
            {
                'targets': 1,
                'className': "",
                "width": "auto",
                'render': function(data, type, full, meta) {
                    var str = htmlEncode(full.Name);
                    return str;
                }

            },
            {
                'targets': 2,
                "width": "auto",
                'className': ""
            },
            {
                'targets': 3,
                "width": "auto",
                'className': ""
            },
            {
                'targets': 4,
                "width": "auto",
                'className': ""
            }
        ],
        "drawCallback": function(settings, json) {
            //$("td.acc-redirect").on("click", function () {
            //    var data = $(this).parent().find("input.acc-redirect-id").val();
            //    var urlHostAddress = $("#urlHostAddress").val();
            //    var link = urlHostAddress + data + "";
            //    window.open(link, "_blank");
            //});
        },
        //"lengthMenu": [[50, 100], [50, 100]],
        "info": true,
        "stateSave": false
    });

    $('#acc-table thead tr').clone(true).appendTo('#acc-table thead').addClass("search-header");

    $('#acc-table thead tr:eq(1)').off("click");
    $('#acc-table thead tr:eq(1) th').off("click");
    $('#acc-table thead tr:eq(1) th').off("keypress");

    $('#acc-table thead tr:eq(1) th').each(function(i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur',
            function () {
                console.log('blur');
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        $("input", this).on('keypress',
            function(e) {
                if (e.keyCode === 13) {
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                }
            });
    });

    $("#acc-table thead tr:eq(1) > th:last-child()").html("");
}

function GetListAccProperty() {
    var url = $("#urlLoadListAccProperty").val();
    var lstAccProperty = "";
    var arr = [];
    //$.ajax({
    //    "url": url,
    //    type: "GET",
    //    "dataType": "json",
    //    async: false,
    //    contentType: 'application/json; charset=utf-8',
    //    success: function (dt) {
    //        lstAccProperty = dt;
    //    }
    //});
    lstAccProperty = [
        { "PropertyCode": "Code", "PropertyDisplayName": "Mã cơ hội" },
        { "PropertyCode": "Name", "PropertyDisplayName": "Tên cơ hội" },
        { "PropertyCode": "BCCCode", "PropertyDisplayName": "Mã cơ hội BCC" },
        { "PropertyCode": "BCCName", "PropertyDisplayName": "Tên cơ hội BCC" },
    ];
    $.each(lstAccProperty, function (index, element) {
        var obj = {
            data: element.PropertyCode,
            orderable: true,
            title: element.PropertyDisplayName
        };
        arr.push(obj);
    });
    return arr;
}
function OpenModal(FISOppId) {
    $("#current-fis-id").val(FISOppId);
    if ($.fn.DataTable.isDataTable('#bcc-table')) {
        tableBcc.destroy();
        $("#bcc-table").html('');
    }
    var url = $("#urlGetBccOpportunity").val();
    tableBcc = $('#bcc-table').DataTable({
        "destroy": true,
        "autoWidth": false,
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
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
        rowId: 'staffId',
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "pageLength": 10,
        "ajax": {
            "url": url,
            type: "POST",
            data: function (d) {
                dataSearch = $.extend({},
                    d,
                    {
                        "isViewOwner": $("#isViewOwner1").prop("checked"),
                        "isViewDivision": $("#isViewDivision1").prop("checked"),
                        "isViewDivisonOwner": $("#isViewDivisonOwner1").prop("checked"),
                        "advancedSearch": arradvancedSearch,
                        "isOngoingIndex": isOngoing,
                        "isHistoryIndex": isHistory,
                    });
                return dataSearch;
            },
            error: defaultAjaxErrorHandle
        },
        "columns": GetListOppProperty(),
        'columnDefs': [
            {
                'targets': 3,
                "data": null,
                'searchable': false,
                'orderable': false,
                "width": "auto",
                'className': "text-center",
                'render': function (data, type, full, meta) {
                    var str = "";
                    str += "<button type='button' class='btn btn-sm btn-primary' onclick='Map(" + FISOppId + ", " + full.BCCId + ", \"" + full.Code + "\", \"" + full.Name + "\")' >Map</button>";
                    return str;
                }
            },
            {
                'targets': 0,
                "width": "auto",
                'className': "acc-redirect",
                'render': function (data, type, full, meta) {
                    var str = full.Code;
                    return str;
                }

            },
            {
                'targets': 1,
                'className': "",
                "width": "auto",
                'render': function (data, type, full, meta) {
                    var str = htmlEncode(full.Name);
                    return str;
                }

            },
            {
                'targets': 2,
                "width": "auto",
                'className': "",
            }
        ],
        "drawCallback": function (settings, json) {
            //$("td.acc-redirect").on("click", function () {
            //    var data = $(this).parent().find("input.acc-redirect-id").val();
            //    var urlHostAddress = $("#urlHostAddress").val();
            //    var link = urlHostAddress + data + "";
            //    window.open(link, "_blank");
            //});
        },
        //"lengthMenu": [[50, 100], [50, 100]],
        "info": true,
        "stateSave": false
    });

    $('#bcc-table thead tr').clone(true).appendTo('#bcc-table thead').addClass("search-header");

    $('#bcc-table thead tr:eq(1)').off("click");
    $('#bcc-table thead tr:eq(1) th').off("click");
    $('#bcc-table thead tr:eq(1) th').off("keypress");

    $('#bcc-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur',
            function () {
                console.log('blur');
                if (tableBcc.column(i).search() !== this.value) {
                    tableBcc
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        $("input", this).on('keypress',
            function (e) {
                if (e.keyCode === 13) {
                    if (tableBcc.column(i).search() !== this.value) {
                        tableBcc
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                }
            });
    });

    $("#bcc-table thead tr:eq(1) > th:last-child()").html("");

    $("#exampleModal").modal('show');
}

function Map(FISId, BccId, BccCode, BccName) {
    $.ajax({
        url: $("#urlMap").val(),
        type: "post",
        dataType: "json",
        data: {
            FISId: FISId, BCCId: BccId, BCCCode: BccCode, BCCName: BccName
        },
        success: function (result) {
            if (result == 1) {
                $("#exampleModal").modal('hide');
                table.draw();
            }
        }
    });
}

function UnMap(FISId, BccId) {
    $.ajax({
        url: $("#urlUnMap").val(),
        type: "post",
        dataType: "json",
        data: {
            FISId: FISId, BCCId: BccId
        },
        success: function (result) {
            if (result == 1) {
                $("#exampleModal").modal('hide');
                table.draw();
            }
        }
    });
}

function CreateBccOpportunity(FISId, BccId) {
    var url = $("#urlCreateBccOpportunity").val();
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: {
            FISId: FISId, BCCId: BccId
        },
        success: function (result) {
            if (result == 1) {
                table.draw();
            } else {
                bootbox.alert("Không thể tạo cơ hội");
            }
        }
    });
}

function GetListOppProperty() {
    var lstAccProperty = "";
    var arr = [];
    lstAccProperty = [
        { "PropertyCode": "Code", "PropertyDisplayName": "Mã cơ hội" },
        { "PropertyCode": "Name", "PropertyDisplayName": "Tên cơ hội" },
        { "PropertyCode": "AccountingCode", "PropertyDisplayName": "Mã kế toán" }
    ];
    $.each(lstAccProperty, function (index, element) {
        var obj = {
            data: element.PropertyCode,
            orderable: true,
            title: element.PropertyDisplayName
        };
        arr.push(obj);
    });
    return arr;
}