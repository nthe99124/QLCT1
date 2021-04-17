var imageSub = "<img title='Sub-Task' src='" + $("#hostAddress").val() + "Content/Image/subtask_alternate.png' />";
$(document).ready(function () {
    CheckAdvanceSearch();
    var href = window.location.href;    
    InitListPersonalTask();
    InitListDivisonTask();    
    $('.data-content a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        OnChangeTab(1);
    });


    $('.task-index-dashboard a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var tid = $(e.currentTarget).data("tabid");
        LoadTaskDashboard(tid);
    });


    $("#advanced-search").click(function () {
        advancePersonal = true;
        arrAdvance = GenerateAdvanceSearch();
        OnChangeTab();

        $("#advancedsearch-modal").modal("hide");
    });

    $(".checkbox-area input").on('change', function () {
        tblPersonalTask.draw();
    });

    $('#advancedsearch-modal').on('hidden.bs.modal', function (e) {
        RefillAdvanceSearchValue();
    });

    //gọi để tránh trường hợp trình duyệt tự lưu trạng thái
    RefillAdvanceSearchValue();

    $('.custom-datetime').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true,
        showClear: true
    });
    LoadTaskDashboard(0);
    if (href.includes("divisionTask")) {
        $("#divisionTaskTab").click();
        $("#divisionDashboardTab").click();
        $("html, body").animate({ scrollTop: 0 }, "fast");
    }


    //ReporterAcc-advanceSearch
    //AssigneeAcc-advanceSearch
    $("#ReporterAcc-advanceSearch").select2({
        minimumInputLength: 2,
        allowClear: true,
        width: '100%',
        placeholder: "",
        ajax: {
            url: $("#urlSearchUserForTaskSearch").val(),
            dataType: 'json',
            data: function (params) {
                var query = {
                    keySearch: params.term,
                    valueField: 'username'
                }
                return query;
            },
            processResults: function (data) {
                var data2 = data.map(function (ele) {
                    ele.text = ele.id;
                    return ele;
                });
                return {
                    results: data
                };
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (results) {
            var rs = JSON.stringify(results);
            var json = JSON.parse(rs);
            return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
        },
        templateSelection: function (results) {
            return "<div>" + results.text + "</div>";
        }
    });

    $("#AssigneeAcc-advanceSearch").select2({
        minimumInputLength: 2,
        allowClear: true,
        width: '100%',
        placeholder: "",
        ajax: {
            url: $("#urlSearchUserForTaskSearch").val(),
            dataType: 'json',
            data: function (params) {
                var query = {
                    keySearch: params.term,
                    valueField: 'username'
                }
                return query;
            },
            processResults: function (data) {
                var data2 = data.map(function (ele) {
                    ele.text = ele.id;
                    return ele;
                });
                return {
                    results: data
                };
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (results) {
            var rs = JSON.stringify(results);
            var json = JSON.parse(rs);
            return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
        },
        templateSelection: function (results) {
            return "<div>" + results.text + "</div>";
        }
    });



});

var tblPersonalTask;
var objectSearch;
var advancePersonal = false;
var arrAdvance = [];
function InitListPersonalTask() {
    var url = $("#urlLoadListPersonalTask").val();

    tblPersonalTask = $('#personal-task-table').DataTable({
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        "order": [[9, "desc"]],
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
        rowId: "staffId",
        //scrollY: "60vh",
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "lengthMenu": [10, 25, 50],
        "pageLength": 50,
        "ajax": {
            "url": url,
            type: "POST",
            cache: false,
            data: function (d) {

                var isReporter = $("#isReporter").prop("checked");
                var isAssignee = $("#isAssignee").prop("checked");
                var isViewer = $("#isViewer").prop("checked");



                var searchdt = $.extend({}, d, {
                    "isReporter": isReporter,
                    "isAssignee": isAssignee,
                    "isViewer": isViewer,
                    "advancedSearch": arrAdvance
                });

                objectSearch = searchdt;
                return searchdt;
            },
            error: defaultAjaxErrorHandle
        },
        'columnDefs': [
            {
                'targets': -1,
                "data": "Id",
                'searchable': false,
                'orderable': false,
                'className': "text-center",
                'render': function (data, type, full, meta) {
                    var str = "";
                    str += "<div class='btn-group' role='group'>";
                    str += "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";

                    str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1'>";

                    str += "<li> <a onclick='ShowTaskDetail(" + full.Id + ")' title='Chi tiết' class='padding-right-5'>";
                    str += "<i class='fa fa-eye padding-left-5 padding-right-10'></i>";
                    str += "Chi tiết";
                    str += "</a> </li>";

                    if (full.IsEdit == 1) {
                        str += "<li> <a onclick='ShowTaskEdit(" + full.Id + ")' title='Cập nhật' class='padding-right-5'>";
                        str += "<i class='fa fa-pencil padding-left-5 padding-right-10'></i>";
                        str += "Cập nhật";
                        str += "</a> </li>";
                    }

                    str += " </div></div>";
                    str += "<input type='hidden' class='opp-redirect-id' value='" + full.id + "' />";
                    return str;
                }
            },
            {
                'targets': 0,
                'data': "TaskModuleText",
                'title': "Chức năng",
                'className': "",
                'width': "100px"
            },
            {
                'targets': 1,
                'data': "ObjectTitle",
                'title': "Khách hàng/ cơ hội",
                'className': "",
                width: "130px"
            },
            {
                'targets': 2,
                'data': "Title",
                'title': 'Tên',
                'className': "",
                'render': function (data, type, full, meta) {
                    var ttEncode = htmlEncode(full.Title);
                    var sub = "";
                    if (full.ParentId > 0) {
                        sub = imageSub;
                    }
                    var str = "<span style='text-decoration: underline; cursor: pointer;' onclick='ShowTaskDetail(" + full.Id + ")'>" + sub + " " + ttEncode + " </span>";
                    return str;
                }
            },
            //{
            //    'targets': 3,
            //    'data': "Description",
            //    'title': "Mô tả",
            //    'className': "",
            //    'render': function (data, type, full, meta) {
            //        var ttEncode = htmlEncode(full.Description);
            //        var str = "<span style='text-decoration: underline; cursor: pointer;' onclick='ShowTaskDetail(" + full.Id + ")'> " + ttEncode + " </span>";
            //        return str;
            //    },
            //    "visible": false
            //},

            {
                'targets': 3,
                'title': "Người giao",
                'data': "ReporterAcc",
                'className': "",
                'width': "130px"
            },
            {
                'targets': 4,
                'title': "Người thực hiện",
                'data': "AssigneeAcc",
                'className': "",
                'width': "130px"
            },
            {
                'targets': 5,
                'title': "Loại",
                'data': "TaskTypeText",
                'className': "",
                width: "50px",
                //'render': function (data, type, full, meta) {
                //    return full.TaskTypeText;
                //}
            },
            {
                'targets': 6,
                'title': "Ưu tiên",
                'data': "PriorityText",
                'className': "",
                width: "70px",
                //'render': function (data, type, full, meta) {
                //    return full.PriorityText;
                //}
            },
            {
                'targets': 7,
                'title': "Trạng thái",
                'data': "StatusText",
                'className': "",
                width: "80px",
                //'render': function (data, type, full, meta) {
                //    return full.StatusText;
                //}
            },
            {
                'targets': 8,
                'className': "",
                'data': "UpdatedDateText",
                'title': "Ngày cập nhật",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.UpdatedDateText !== "") {
                        str += full.UpdatedDateText;//moment(full.UpdatedDateText, "DD/MM/YYYY").toString("DD/MM/YYYY"); //new Date(full.UpdatedDateText).toLocaleDateString();
                    }
                    return str;
                },
                'width': "100px"
            },
            {
                'targets': 9,
                'className': "",
                'data': "DueDateText",
                'title': "Ngày đến hạn",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.DueDate !== "") {
                        str += full.DueDateText;//new Date(full.DueDate).toLocaleDateString();
                    }
                    return str;
                },
                'width': "100px"
            },
            {
                'targets': 10,
                'title': "",
                'data': "",
                'className': "",
                'width': "20px"
            },

        ],
        "drawCallback": function (settings, json) {
            //$("td.opp-redirect").on("click", function () {
            //    var data = $(this).parent().find("input.opp-redirect-id").val();
            //    var hostAddress = $("#hostAddress").val();
            //    var link = hostAddress + "/Opportunities/Details?oppId=" + data + "";
            //    window.open(link, "_blank");
            //});
        },
        "info": true,
        "stateSave": false
    });

    $('#personal-task-table thead tr').clone(true).appendTo("#personal-task-table thead").addClass("search-header");

    $('#personal-task-table thead tr:eq(1)').off("click");
    $('#personal-task-table thead tr:eq(1) th').off("click");
    $('#personal-task-table thead tr:eq(1) th').off("keypress");


    $('#personal-task-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (tblPersonalTask.column(i).search() !== this.value) {
                tblPersonalTask
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                //if (tblPersonalTask.column(i).search() !== this.value) {
                if (true) {
                    tblPersonalTask
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });
    $("#personal-task-table thead tr:eq(1) > th:last-child()").html("");


    $("#personal-task-table tbody tr > td:last-child()").off("click");

    $('#personal-task-table_filter input').unbind();
    $('#personal-task-table_filter input').bind('keyup blur', function (e) {
        if (e.keyCode == 13 || e.keyCode==undefined) {
            tblPersonalTask.search(this.value).draw();
        }
    });

    //personal-task-table_filter
    var htmlAdvance = "<label>";
    htmlAdvance += " <button type='button' id='' class='btn btn-primary advancesearch' data-toggle='modal' data-target='#advancedsearch-modal'>"
    htmlAdvance += "<i class='fa fa-filter' aria-hidden='true'></i>"
    htmlAdvance += "</button>";
    htmlAdvance += "</label>";
    $("#personal-task-table_filter").prepend(htmlAdvance);
}

var tblDivisonTask;
var objectSearchDivision;
function InitListDivisonTask() {
    var urldiv = $("#urlLoadListDivisionTask").val();

    tblDivisonTask = $('#division-task-table').DataTable({
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        "order": [[9, "desc"]],
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
        rowId: "staffId",
        //scrollY: "60vh",
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "lengthMenu": [10, 25, 50],
        "pageLength": 50,
        "ajax": {
            "url": urldiv,
            type: "POST",
            cache: false,
            data: function (d) {

                var searchdt = $.extend({}, d, {
                    "advancedSearch": arrAdvance
                });
                objectSearchDivision = searchdt;
                return searchdt;
            }
            ,
            error: defaultAjaxErrorHandle
        },
        'columnDefs': [
            {
                'targets': -1,
                "data": "Id",
                'searchable': false,
                'orderable': false,
                'className': "text-center",
                'render': function (data, type, full, meta) {
                    var str = "";
                    str += "<div class='btn-group' role='group'>";
                    str += "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";

                    str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1'>";

                    str += "<li> <a onclick='ShowTaskDetail(" + full.Id + ")' title='Chi tiết' class='padding-right-5'>";
                    str += "<i class='fa fa-eye padding-left-5 padding-right-10'></i>";
                    str += "Chi tiết";
                    str += "</a> </li>";

                    if (full.IsEdit == 1) {
                        str += "<li> <a onclick='ShowTaskEdit(" + full.Id + ")' title='Cập nhật' class='padding-right-5'>";
                        str += "<i class='fa fa-pencil padding-left-5 padding-right-10'></i>";
                        str += "Cập nhật";
                        str += "</a> </li>";
                    }

                    str += " </div></div>";
                    str += "<input type='hidden' class='opp-redirect-id' value='" + full.id + "' />";
                    return str;
                }
            },
            {
                'targets': 0,
                'data': "TaskModuleText",
                'title': "Chức năng",
                'className': "",
                'width': "100px"
            },
            {
                'targets': 1,
                'data': "ObjectTitle",
                'title': "Khách hàng/ cơ hội",
                'className': "",
                width: "130px"
            },
            {
                'targets': 2,
                'data': "Title",
                'title': 'Tên',
                'className': "",
                'render': function (data, type, full, meta) {
                    var ttEncode = htmlEncode(full.Title);
                    var sub = "";
                    if (full.ParentId > 0) {
                        sub = imageSub;
                    }
                    var str = "<span style='text-decoration: underline; cursor: pointer;' onclick='ShowTaskDetail(" + full.Id + ")'>" + sub + " " + ttEncode + " </span>";
                    return str;
                }
            },
            //{
            //    'targets': 3,
            //    'data': "Description",
            //    'title': "Mô tả",
            //    'className': "",
            //    'render': function (data, type, full, meta) {
            //        var str = "<span style='text-decoration: underline; cursor: pointer;' onclick='ShowTaskDetail(" + full.Id + ")'> " + full.Description + " </span>";
            //        return str;
            //    },
            //    "visible": false
            //},

            {
                'targets': 3,
                'title': "Người giao",
                'data': "ReporterAcc",
                'className': "",
                //'width': "170px"
            },
            {
                'targets': 4,
                'title': "Người thực hiện",
                'data': "AssigneeAcc",
                'className': "",
                //'width': "170px"
            },
            {
                'targets': 5,
                'title': "Loại",
                'data': "TaskTypeText",
                'className': "",
                width: "50px",
                //'render': function (data, type, full, meta) {
                //    return full.TaskTypeText;
                //}
            },
            {
                'targets': 6,
                'title': "Ưu tiên",
                'data': "PriorityText",
                'className': "",
                width: "70px",
                //'render': function (data, type, full, meta) {
                //    return full.PriorityText;
                //}
            },
            {
                'targets': 7,
                'title': "Trạng thái",
                'data': "StatusText",
                'className': "",
                width: "80px",
                //'render': function (data, type, full, meta) {
                //    return full.StatusText;
                //}
            },
            {
                'targets': 8,
                'className': "",
                'data': "UpdatedDateText",
                'title': "Ngày cập nhật",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.UpdatedDateText !== "") {
                        str += full.UpdatedDateText; //new Date(full.UpdatedDateText).toLocaleDateString();
                    }
                    return str;
                },
                'width': "100px"
            },
            {
                'targets': 9,
                'className': "",
                'data': "DueDate",
                'title': "Ngày đến hạn",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.DueDate !== "") {
                        str += full.DueDateText;
                        //str += new Date(full.DueDate).toLocaleDateString();
                    }
                    return str;
                },
                'width': "100px"
            },
            {
                'targets': 10,
                'title': "",
                'data': "",
                'className': "",
                'width': "20px"
            },

        ],
        "drawCallback": function (settings, json) {
            //$("td.opp-redirect").on("click", function () {
            //    var data = $(this).parent().find("input.opp-redirect-id").val();
            //    var hostAddress = $("#hostAddress").val();
            //    var link = hostAddress + "/Opportunities/Details?oppId=" + data + "";
            //    window.open(link, "_blank");
            //});
        },
        "info": true,
        "stateSave": false
    });

    $('#division-task-table thead tr').clone(true).appendTo("#division-task-table thead").addClass("search-header");

    $('#division-task-table thead tr:eq(1)').off("click");
    $('#division-task-table thead tr:eq(1) th').off("click");
    $('#division-task-table thead tr:eq(1) th').off("keypress");


    $('#division-task-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (tblDivisonTask.column(i).search() !== this.value) {
                tblDivisonTask
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                if (tblDivisonTask.column(i).search() !== this.value) {
                    tblDivisonTask
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });
    $("#division-task-table thead tr:eq(1) > th:last-child()").html("");

    $("#division-task-table tbody tr > td:last-child()").off("click");

    $('#division-task-table_filter input').unbind();
    $('#division-task-table_filter input').bind('keyup blur', function (e) {
        if (e.keyCode == 13 || e.keyCode == undefined) {
            tblDivisonTask.search(this.value).draw();
        }
    });

    //personal-task-table_filter
    var htmlAdvance = "<label>";
    htmlAdvance += " <button type='button' id='' class='btn btn-primary advancesearch' data-toggle='modal' data-target='#advancedsearch-modal'>"
    htmlAdvance += "<i class='fa fa-filter' aria-hidden='true'></i>"
    htmlAdvance += "</button>";
    htmlAdvance += "</label>";
    $("#division-task-table_filter").prepend(htmlAdvance);
}

function OnChangeTab(clearAdvance) {
    if (clearAdvance == 1) {
        ClearAdvanceSearch();
    }
    if ($("#divisionTasks").hasClass("active")) {
        tblDivisonTask.draw();
    } else {
        tblPersonalTask.draw();
    }

}

function ClearAdvanceSearch() {
    $(".advancesearch-item").each(function (index, item) {
        $(item).val("").trigger("change");
    });

    $("button.advancesearch i").css("color", "");
    arrAdvance = [];
    advancePersonal = false;
}

function RefillAdvanceSearchValue() {
    //đỏ ngược lại dữ liệu
    if (advancePersonal) {
        //không cần làm gì
    } else {
        //đỏ ngược lại dữ liệu
        if (arrAdvance == undefined || arrAdvance == null || arrAdvance.length == 0) {
            $(".advancesearch-item").each(function (index, item) {
                $(item).val(null).trigger("change");
            });
        } else {
            $.each(arrAdvance, function (index, value) {
                var split = $(".advancesearch-item[data-code='" + value.PropertyCode + "'][data-operator='" + value.Operator + "']").data("select2split");

                if (split == undefined || split == null || split == "") {
                    //input/ select single
                    $(".advancesearch-item[data-code='" + value.PropertyCode + "'][data-operator='" + value.Operator + "']").val(value.Value);
                } else {
                    var wraper = $(".advancesearch-item[data-code='" + value.PropertyCode + "'][data-operator='" + value.Operator + "']").data("itemwraper");
                    //select2 multi
                    var arr = value.Value.split(wraper).join("").split(split);
                    //ko cần đoạn này, do data search phải có item này rồi thì mới
                    //var newar = [];
                    //$.each(arr, function (ind, vl) {
                    //    //vl = vl.split("'").join("");
                    //    var nop = new Option(vl, vl, true, true);
                    //    newar.push(nop);
                    //});

                    $(".advancesearch-item[data-code='" + value.PropertyCode + "'][data-operator='" + value.Operator + "']").val(arr).trigger('change');;
                }
               
                //.Task-Status[data-id=
            });
        }
    }
    CheckAdvanceSearch();
}

function CheckAdvanceSearch() {

    var check = false;
    $(".advancesearch-item").each(function (index, item) {
        if ($(item).val() != "" && $(item).val() != null && $(item).val() != undefined) {
            check = true;
        }
    });
    if (check) {
        $("button.advancesearch i").css("color", "orange");
    } else {
        $("button.advancesearch i").css("color", "");
    }
}

function GenerateAdvanceSearch() {
    var arr = [];

    $(".advancesearch-item").each(function (index, value) {
        if ($(value).val() != "" && $(value).val() != null && $(value).val() != undefined) {
            var wraper = $(value).data("itemwraper");
            wraper = wraper == null || wraper == undefined ? "" : wraper;
            var newoObj = {
                PropertyCode: $(value).data("code"),
                Operator: $(value).data("operator"),
                Value: GetStringValue($(value).val(), wraper)
            };
            arr.push(newoObj);
        }
    });
    return arr;
}

function ChangeAdvanceSearch() {
    advancePersonal = false;
}

function CallbackEdit() {
    tblPersonalTask.draw();
    tblDivisonTask.draw();

    if ($("#tabmenu-division").hasClass("active")) {
        LoadTaskDashboard(1);
    } else {
        LoadTaskDashboard(0);
    }
}

var tskDashoard = {};
function LoadTaskDashboard(tab) {
    try {
        //ajax lấy data
        var urlDb = $("#urlLoadTaskDashboard").val();

        //tab =0:
        //tskDashoard.DB1 : DataBeingAssignedTask
        //tskDashoard.DB2 : DataReportedTask

        //tab =1
        //tskDashoard.DB3 : 
        var fdt = new FormData();
        var dateFrom = "";
        var dateTo = "";
        var divSearch = "";
        if (tab == 0 || tab == -1) {
            dateFrom = $("#dashboardSearchFrom").val();
            dateTo = $("#dashboardSearchTo").val();
            divSearch = "0";
        } else {
            dateFrom = $("#dashboardDivSearchFrom").val();
            dateTo = $("#dashboardDivSearchTo").val();
            divSearch = $("#DivisionSelect").val();
        }
        if (dateFrom == "" || dateTo == "" || divSearch == "") {
            return;
        }
        ShowBlockTaskLayer("task-dashboard-block", true);
        fdt.append("tab", tab);
        fdt.append("fromDate", dateFrom);
        fdt.append("toDate", dateTo);
        fdt.append("divId", divSearch);
        $.ajax({
            url: urlDb,
            method: "POST",
            data: fdt,
            processData: false,
            contentType: false,
            async: false,
            success: function (dt) {
                ShowBlockTaskLayer("task-dashboard-block", false);

                if (dt.IsHaveDivisionDashboard) {
                    $("#tabmenu-division").show();
                }
                if (tab == 0) {
                    //fill txt vào today's task
                    $("#BeingAssignedTaskExpireToday").text(dt.BeingAssignedTaskExpireToday);
                    $("#ReportedTaskExpireToday").text(dt.ReportedTaskExpireToday);
                    $("#WaitingReviewTask").text(dt.WaitingReviewTask);
                    $("#NeedReviewTask").text(dt.NeedReviewTask);

                    if (tskDashoard.DB1 == undefined || tskDashoard.DB1 == null) {
                        //init mới chart
                        tskDashoard.DB1 = new CanvasJS.Chart("task-dashboard-DataBeingAssignedTask", {
                            animationEnabled: true,
                            title: {
                                text: "Số lượng task được giao",
                                fontFamily: "sans-serif"
                            },
                            axisY: {
                                labelFormatter: function (e) {
                                    if (e.value % 1 != 0) {
                                        return "";
                                    }
                                    return e.value;
                                }
                            },
                            dataPointWidth: 20,

                            legend: {
                                cursor: "pointer",
                                itemclick: toggleDataSeries,
                                fontSize: 12,
                                fontFamily: "sans-serif",
                                itemWidth: 100
                            },
                            toolTip: {
                                shared: true,
                                content: toolTipFormatter
                            },
                            data: dt.DataBeingAssignedTask
                        });
                        tskDashoard.DB1.render();
                    } else {
                        //load lại data cho chart
                        tskDashoard.DB1.options.data = dt.DataBeingAssignedTask;
                        tskDashoard.DB1.render();
                    }

                    if (tskDashoard.DB2 == undefined || tskDashoard.DB2 == null) {
                        //init mới chart
                        tskDashoard.DB2 = new CanvasJS.Chart("task-dashboard-DataReportedTask", {
                            animationEnabled: true,
                            axisY: {
                                labelFormatter: function (e) {
                                    if (e.value % 1 != 0) {
                                        return "";
                                    }
                                    return e.value;
                                }
                            },
                            title: {
                                text: "Số lượng task đã giao",
                                fontFamily: "sans-serif",
                            },
                            legend: {
                                cursor: "pointer",
                                itemclick: toggleDataSeries,
                                fontSize: 12,
                                fontFamily: "sans-serif",
                                itemWidth: 100
                            },
                            toolTip: {
                                shared: true,
                                content: toolTipFormatter
                            },
                            dataPointWidth: 20,
                            data: dt.DataReportedTask
                        });
                        tskDashoard.DB2.render();
                    } else {
                        //load lại data cho chart
                        tskDashoard.DB2.options.data = dt.DataReportedTask;
                        tskDashoard.DB2.render();
                    }
                }

                if (tab == 1) {
                    //if (tskDashoard.DB3 == undefined || tskDashoard.DB3 == null) {
                    //    //init mới chart
                    //    tskDashoard.DB3 = new CanvasJS.Chart("task-dashboard-DivisionData", {
                    //        animationEnabled: true,
                    //        title: {
                    //            text: "Task cá nhân",
                    //            fontFamily: "sans-serif"
                    //        },
                    //        axisY: {
                    //            labelFormatter: function (e) {
                    //                if (e.value % 1 != 0) {
                    //                    return "";
                    //                }
                    //                return e.value;
                    //            }
                    //        },
                    //        legend: {
                    //            cursor: "pointer",
                    //            itemclick: toggleDataSeries,
                    //            fontSize: 12,
                    //            fontFamily: " sans-serif",
                    //            itemWidth: 100
                    //        },
                    //        toolTip: {
                    //            shared: true,
                    //            content: toolTipFormatter
                    //        },
                    //        dataPointWidth: 20,

                    //        data: dt.DivisionData
                    //    });
                    //    tskDashoard.DB3.render();
                    //} else {
                    //    //load lại data cho chart
                    //    tskDashoard.DB3.options.data = dt.DivisionData;
                    //    tskDashoard.DB3.render();
                    //}
                    var divId = $("#DivisionSelect").val();
                    InitSaleManDoneTaskInfor(divId);
                    InitSaleManOnGoingTaskInfor(divId);
                }
            },
            error: function () {
                //reload or
                ShowBlockTaskLayer("task-dashboard-block", false);
            }
        });

    } catch (e) {
        console.log("Init task dashboard error: ", e);
    }
}

function toolTipFormatter(e) {
    var str = "";
    var total = 0;
    var str3 = "";
    var str2;
    for (var i = 0; i < e.entries.length; i++) {
        var str1 = "<span style= \"color:" + e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>" + e.entries[i].dataPoint.y + "</strong> <br/>";
        total = e.entries[i].dataPoint.y + total;
        str = str.concat(str1);
    }
    str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
    //str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</strong><br/>";
    return (str2.concat(str)).concat(str3);
}


function GetStringValue(element, wraper) {
    var str = element;
    if (Array.isArray(element)) {
        str = element.map(function (vl) {
            return wraper + vl + wraper;
                 }
                ).join();
    }

    return str;
}

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    }
    else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

function InitSaleManDoneTaskInfor(divId) {    
    GetSaleManDoneTaskChart(divId, function (data) {       
        DrawSaleManDoneTaskChart(data);
    });
}

function DrawSaleManDoneTaskChart(data) {
    var chart = new CanvasJS.Chart("chartDoneTask", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Task đã hoàn thành",
            horizontalAlign: "center",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        axisY: {
            interval: 1,
            intervalType: "number",
            gridThickness: 1,           
            labelFontColor: "white"
        }, 
        axisX: {            
            gridThickness: 1            
        }, 
        toolTip: {
            shared: true
        },
        data: data
    });
    setTimeout(function () {
        chart.render();
    }, 300);
}

function GetSaleManDoneTaskChart(divId, callback) {
    var fromDate = $("#dashboardDivSearchFrom").val();
    var toDate = $("#dashboardDivSearchTo").val();    
    var url = $("#urlLoadTopDoneTask").val();
    var value;
    $.ajax({
        type: "GET",
        url: url,
        //async: false,        
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {            
            value = data;
            if (callback != undefined && typeof callback == 'function') {
                callback(data);
            }
        }
    });
    return value;
}

//$(document).on("changeDate", "#SaleManTaskFrom,#SaleManTaskTo", function () {
//    if ($("#SaleManTaskFrom").val() !== "" && $("#SaleManTaskTo").val() !== "") {
//        var divId = parseInt($("#lstDivId").val());
//        InitSaleManTaskInfor(divId);
//    }
//});

function InitSaleManOnGoingTaskInfor(divId) {
    GetSaleManOnGoingTaskChart(divId, function (data) {
        DrawSaleManOnGoingTaskChart(data);
    });
}

function DrawSaleManOnGoingTaskChart(data) {
    var chart = new CanvasJS.Chart("chartOngoingTask", {
        animationEnabled: true,
        theme: "light2",
        toolTip: {
            shared: true
        },
        title: {
            text: "Task đang thực hiện",
            horizontalAlign: "center",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        axisY: {
            interval :1,
            intervalType: "number",
            gridThickness: 1,
            labelFontColor: "white"
        }, 
        data: data
    });
    setTimeout(function () {
        chart.render();
    }, 300);
}

function GetSaleManOnGoingTaskChart(divId, callback) {    
    var url = $("#urlLoadTopOnGoingTask").val();
    var value;

    $.ajax({
        type: "GET",
        url: url,
        //async: false,        
        data: {
            'divId': divId            
        },
        success: function (data) {
            value = data;
            if (callback != undefined && typeof callback == 'function') {
                callback(data);
            }
        }
    });

    return value;
}

function LoadDoneTask() {
    var divId = $("#DivisionSelect").val();
    InitSaleManDoneTaskInfor(divId);
}

function LoadOngoingTask() {
    var divId = $("#DivisionSelect2").val();    
    InitSaleManOnGoingTaskInfor(divId);
}

function Export() {
    if ($("#divisionTasks").hasClass("active")) {
        $.ajax({
            "url": $("#urlExportDivisionTasktoExcel").val(),
            method: "POST",
            //async: false,
            data: objectSearchDivision,
            beforeSend: function () {
                $("#loading").addClass("loading");
            },
            success: function (data) {
                if (data != "" && data != null) {
                    $("#loading").removeClass("loading");
                    saveAsExcel(data);
                }
            }
        });
    }
    else {
        $.ajax({
            "url": $("#urlExportPersonalTasktoExcel").val(),
            method: "POST",
            //async: false,
            data: objectSearch,
            beforeSend: function () {
                $("#loading").addClass("loading");
            },
            success: function (data) {
                if (data != "" && data != null) {
                    $("#loading").removeClass("loading");
                    saveAsExcel(data);
                }
            }
        });
    }
}

var MIME_TYPE = 'data:application/vnd.ms-excel;charset=utf-8';

function saveAsExcel(data) {
    var bb = new Blob([data], { type: MIME_TYPE });

    //với IE:
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
        window.navigator.msSaveBlob(bb, "Danh sách tasks.xls");
    else {
        var a = document.createElement('a');
        a.download = "Danh sách tasks.xls";
        a.href = window.URL.createObjectURL(bb);
        a.textContent = ' ';
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        $("body").append(a);
        a.click();
    }
}
