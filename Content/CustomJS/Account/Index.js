var table;
var table1;
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
    document.getElementById("totalNoAction").textContent = 0;
    GetListExploitedAccounts();
    UITree.init();
    $.ajax({
        "url": $("#urlGetIndustry").val(),
        type: "GET",
        "dataType": "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (dt) {
            if (dt != null && dt != "") {
                for (var i = 0; i < dt.length; i++){
                    var option = new Option(dt[i].text,dt[i].id,  true, true);
                    $('#IndustrySelect').append(option).trigger('change');
                }
            }
        }
    });
    $.ajax({
        url: $("#urltest").val(),
        type: 'POST',
        data: {

        },
        success: function (result) {
            if (result != null ) {
                ReloadDataDashboard(result)
                if (result.TotalNoAction != null && result.TotalNoAction != ""){
                    document.getElementById("totalNoAction").textContent = result.TotalNoAction;
                }
            }
        },
        error: function () {
            console.log('error');
        }
    });
    if ($('#sessionRole').val() != null && $('#sessionRole').val() != "") {
        arrUser = $('#sessionRole').val().split(";");
        for (var i = 0; i < arrUser.length; i++) {
            if (arrUser[i] == "DataManager") {
                roleSMO = true;
            }
        }
    }
    $('#acc-table_info').hide();
    $('#exploitedAcc-table_info').hide();
    $("#Acc_Owner").select2({
        allowClear: true,
        width: '100%',
        ajax: {
            url: $("#urlSearchUserInSso").val(),
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    keySearch: params.term // search term
                };
            },
            processResults: function (data) {
                return { results: data };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 1,
        templateResult: function (results) {
            var rs = JSON.stringify(results);
            var json = JSON.parse(rs);
            return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
        },
        templateSelection: function (results) {
            return "<div>" + results.text + "</div>";
        }
    });
    $("#IndustrySelect").select2({ width: '100%' });  
    $("#comBoBoxOngoing").select2({ width: '100%' });  
    $("#comBoBoxHistory").select2({ width: '100%' }); 
   
});

$(document).on("click", "#advanced-search", function () {
    ReloadTable(1,true);
    $("#advancedsearch-modal").modal("hide");
});

function replaceEditAcc() {
    var hostAddress = $("#hostAddress").val();
    var linkOpp = hostAddress + "/Accounts/Edit?";
    window.location.replace(linkOpp);
}
function GetListAcc(advancedSearch) {
    var url = $("#urlLoadListAcc").val();
  
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
        order: [[7, "desc"]],
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
               
                
                dataSearch = $.extend({}, d, {
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
                'render': function (data, type, full, meta) {
                    var str = "";
                    str += "<div class='btn-group' role='group'>";
                    str += "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";
                    str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1' >";
                    str += " <li><a onclick='viewAccDetail(" + full.id + ")' title='Sửa' class=' popoverclass'>";
                    str += "<i class='fa fa-pencil'></i>";
                    str += "Cập nhật";
                    str += "</a></li>";
                    if ($('#sessionIsAdmin').val() == "True" || roleSMO == true)
                    {
                        str += "<li><a class=' delete-btn popoverw'  onclick='deleteAcc(" + full.id + ")' title='Xóa' >";
                        str += "<i class=' fa fa-trash'></i>";
                        str += "Xóa";
                        str += "</a></li>";
                    }
                 
                   
                    str += " </div></div>";
                    str += "<input type='hidden' class='acc-redirect-id' value='" + full.id + "' />";
                    return str;
                }
            },
            {
                'targets': 0,
                "width": "auto",
                'className': "acc-redirect",
                'render': function (data, type, full, meta) {
                    var dataAccountCode = htmlEncode(full.accountCode);
                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Accounts/Details?AccountId=" + full.id + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + dataAccountCode + "</a>";
                    return str;
                }
               
            },
            {
                'targets': 1,
                'className': "",
                "width": "auto",
                'render': function (data, type, full, meta) {
                    var str = htmlEncode(full.accountName);
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
            },
            {
                'targets': 5,
                "width": "auto",
                'className': ""
            },
            {
                'targets': 6,
                "width": "auto",
                'className': ""
            },
            {
                'targets': 7,
                "width": "auto",
                'className': "",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.createdDate !== "") {
                        str += new Date(full.createdDate).toLocaleDateString("en-GB");
                    }
                    return str;
                }
            },
            {
                'targets': 8,
                "width": "auto",
                'className': ""
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

    $("#acc-table_filter input").unbind();

    $("#acc-table_filter input").bind("keypress", function (e) {
        if (e.keyCode === 13) {
            table.search(this.value).draw();
        }
    });

    $("#acc-table_filter input").on("blur", function () {
        if (true) {
            table.search(this.value).draw();
        }
    });
    $('#acc-table thead tr').clone(true).appendTo('#acc-table thead').addClass("search-header");

    $('#acc-table thead tr:eq(1)').off("click");
    $('#acc-table thead tr:eq(1) th').off("click");
    $('#acc-table thead tr:eq(1) th').off("keypress");

    $('#acc-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (table.column(i).search() !== this.value) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
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


    //$("#acc-table tbody tr").on("click", ".acc-ref", function () {
    //    var data = table.row(this).data();
    //    var urlHostAddress = $("#urlHostAddress").val();
    //    var link = urlHostAddress + data + "";
    //    window.open(link, "_blank");
    //});
    $("#acc-table tbody tr > td:last-child()").off("click");
    var htmlAdvance = "<label>";
    htmlAdvance += " <button type='button' class='btn btn-primary advancesearch' data-toggle='modal' data-target='#advancedsearch-modal'>"
    htmlAdvance += "<i class='fa fa-filter' aria-hidden='true'></i>"
    htmlAdvance += "</button>";
    htmlAdvance += "<a id='refreshAdv' onclick='RefreshAdvancedModal()' class='hidden'>";
    htmlAdvance += "<i class='fa fa - times' aria-hidden='true' style='color: #ffffff'></i>";
    htmlAdvance += "</a>";
    htmlAdvance += "</label>";
    $("#acc-table_filter").prepend(htmlAdvance);

}
function GetListAccProperty() {
    var url = $("#urlLoadListAccProperty").val();
    var lstAccProperty = "";
    var arr = [];
    $.ajax({
        "url": url,
        type: "GET",
        "dataType": "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (dt) {
            lstAccProperty = dt;
        }
    });

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
function viewAccDetail(AccountId) {
    var urlHostEditAddress = $("#urlHostEditAddress").val();
    var link = urlHostEditAddress + AccountId + "";
    window.open(link, "_blank");
}
function deleteAcc(AccountId) {
    var obj = $(this);
    bootbox.confirm({
        title: "Thông báo",
        message: "Đồng ý xóa khách hàng !",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Hủy'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Đồng ý'
            }
        },
        callback: function (result) {
            if (result) {
                var url = $("#urlDeleteAcc").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'AccountId': AccountId
                    }),
                    success: function (data) {
                        setTimeout(function () {
                            bootbox.alert("Xóa khách hàng thành công!", function () {
                                ReloadTable();
                            });
                        }, 500);
                        

                    }
                });
            }
        }
    });
}
function ReloadTable(tb,bool) {
    if (tb == 1 || tb == undefined || tb == null) {
        
        if (bool === true) {
            
                arradvancedSearch = [];
                createdDateFrom = {
                    PropertyCode: "CreatedDate",
                    Operator: "Gte",
                    Value: $("#CreatedDateFrom").val()
                };
                createdDateTo = {
                    PropertyCode: "CreatedDate",
                    Operator: "Lte",
                    Value: $("#CreatedDateTo").val()
                };
               
                AccIndustry = {
                    PropertyCode: "AccIndustry",
                    Operator: "In",
                    Value: $("#IndustrySelect").val()
                };

                lstDivisionId = {
                    PropertyCode: "DivisionId",
                    Operator: "In",
                    Value: ConvertListIdString($('#Acctree').jstree('get_selected'))
                };
                lstOwnerId = {
                    PropertyCode: "OwnerId",
                    Operator: "In",
                    Value: ConvertListIdString($("#Acc_Owner").val())
                };
                arradvancedSearch.push(createdDateFrom, createdDateTo, lstDivisionId, lstOwnerId, AccIndustry);
                isOngoing = $("#comBoBoxOngoing").val();
                isHistory = $("#comBoBoxHistory").val();
                if (arradvancedSearch.length > 0) {
                    arradvancedSearchcheck = arradvancedSearch;
                    var length = arradvancedSearchcheck.length;
                    for (var i = length - 1; i >= 0; i--) {
                        if (arradvancedSearchcheck[i].Value === "") {
                            arradvancedSearchcheck.splice(i, 1);
                            
                        }
                    }
                    if (arradvancedSearchcheck.length === 0 && isOngoing == "" && isHistory == "") {
                        arradvancedSearch = [];
                    }
                }
        }
        $("#loading").addClass("loading"); 
        table.draw();
        $("#loading").removeClass("loading");  
    }
    if (tb == 2 || tb == undefined || tb == null) {
        $("#loading").addClass("loading"); 
        table1.draw();
        $("#loading").removeClass("loading");  
    }
}
$(document).on("change", "#isViewOwner1,#isViewDivision1,#isViewDivisonOwner1", function () {
    ReloadTable();
});

/*exploited*/
$(document).on("change", "#isViewExploited,#isViewDivisonExploited", function () {
    ReloadTable();
});
$("#myAccounts").on("click", function () {
    ReloadTable(1,"");
});
$("#exploitedAccounts").on("click", function () {
    ReloadTable(2,"");
});
function GetListExploitedAccounts() {
    var url = $("#urlLoadListExploitedAccounts").val();
    var isViewExploited = $("#isViewExploited").prop("checked");
    var isViewDivisonExploited = $("#isViewDivisonExploited").prop("checked");

    table1 = $('#exploitedAcc-table').DataTable({
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
            search: "Tìm kiếm:",
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
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "pageLength": 50,
        "ajax": {
            "url": url,
            type: "POST",
            data: function (d) {
                return $.extend({}, d, {
                    "isViewExploited": isViewExploited,
                    "isViewDivisonExploited": isViewDivisonExploited
                });
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
                'className': "text-center",
                'render': function (data, type, full, meta) {
                    var str = "";
                    //str += "<div class='btn-group' role='group'>";
                    //str += "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    //str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";
                    //str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1'>";
                    //str += "<a onclick='viewAccDetail(" + full.id + ")' title='Sửa' class='padding-right-5'>";
                    //str += "<i class=' padding-left-5 padding-right-10'></i>";
                    //str += "Cập nhật";
                    //str += "</a> </br>";
                    //str += "<a class='delete-btn' onclick='deleteAcc(" + full.id + ")' title='Xóa'>";
                    //str += "<i class=' padding-left-5 padding-right-10'></i>";
                    //str += "Xóa";
                    //str += "</a>";
                    //str += " </div></div>";
                    //str += "<input type='hidden' class='acc-redirect-id' value='" + full.id + "' />";
                    //return str;
                    var str = "";
                    
                    str += "<input type='hidden' class='acc-redirect-id' value='" + full.id + "' />";
                    return str;
                }
            },
            {
                'targets': 0,
                'className': "acc-redirect",
                'render': function (data, type, full, meta) {
                    var dataAccountCode = htmlEncode(full.accountCode);
                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Accounts/Details?AccountId=" + full.id + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + dataAccountCode + "</a>";
                    return str;
                }
            },
            {
                'targets': 1,
                'className': ""
            },
            {
                'targets': 2,
                'className': ""
            },
            {
                'targets': 3,
                'className': ""
            },
            {
                'targets': 4,
                'className': ""
            },
            {
                'targets': 5,
                'className': ""
            },
            {
                'targets': 6,
                'className': ""
            },
            {
                'targets': 7,
                'className': "",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.createdDate !== "") {
                        str += new Date(full.createdDate).toLocaleDateString();
                    }
                    return str;
                }
            },
            {
                'targets': 8,
                'className': ""
            },
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
        "stateSave": true
    });

    $('#exploitedAcc-table thead tr').clone(true).appendTo('#exploitedAcc-table thead').addClass("search-header");
    $('#exploitedAcc-table thead tr:eq(1)').off("click");
    $('#exploitedAcc-table thead tr:eq(1) th').off("click");
    $('#exploitedAcc-table thead tr:eq(1) th').off("keypress");
    $('#exploitedAcc-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (table1.column(i).search() !== this.value) {
                table1
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                if (table1.column(i).search() !== this.value) {
                    table1
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });
    $("#exploitedAcc-table thead tr:eq(1) > th:last-child()").html("");
    $("#exploitedAcc-table tbody tr > td:last-child()").off("click");
}
function ReloadDataDashboard(dataResult) {
    if ((dataResult.TotalNoOppWithAccounts != null && dataResult.TotalNoOppWithAccounts != "") || (dataResult.TotalOppWithAccounts != null && dataResult.TotalOppWithAccounts != "") ){
        var ctx = $("#myChart");
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [dataResult.TotalNoOppWithAccounts, dataResult.TotalOppWithAccounts],
                    backgroundColor: ['#FC701B', '#51DE03']
                     //backgroundColor: ['#3B64AD', '#8FA2D4']
                }],
                labels: ['Khách hàng chưa có cơ hội', 'Khách hàng có cơ hội']

            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 70,
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 20,
                        fontColor: '#F8F8FF',
                        padding: 50
                    }
                },
                pieceLabel: {
                    render: function (x) {
                        return x.value;
                    },
                    fontColor: '#000',
                    position: 'insize',
                    fontSize: 11,
                },
                tooltips: {
                    enabled: true
                }
                
            }
        });
    }
   
}

var UITree = function () {
    var contextualMenu = function () {
        $("#Acctree").jstree({
            "core": {
                "themes": {
                    "responsive": true
                },
                "check_callback": true,
                "data": {
                    'cache': false,
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

        $("#Acctree").bind("changed.jstree",
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
//$("#Acctree").on("select_node.jstree", function (node, selected) {
//    var siblingNodes = $("#Acctree").jstree(true).get_children_dom(selected.node.id);
//    var allChecked = true;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if (!$(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = false;
//            }
//        });
//        if (!allChecked) {
//            $(siblingNodes).each(function () {
//                $("#Acctree").jstree(true).select_node(this);
//            });
//            $("#Acctree").jstree(true).select_node(selected.node.id);
//        }
//    }
//});

//$("#Acctree").on("deselect_node.jstree", function (node, deselected) {
//    var siblingNodes = $("#Acctree").jstree(true).get_children_dom(deselected.node.id);
//    var allChecked = false;
//    if (siblingNodes.length > 0) {
//        $(siblingNodes).each(function () {
//            if ($(this).children(".jstree-anchor").hasClass("jstree-clicked")) {
//                allChecked = true;
//            }
//        });
//        if (allChecked) {
//            $(siblingNodes).each(function () {
//                $("#Acctree").jstree(true).deselect_node(this);
//            });
//            $("#Acctree").jstree(true).deselect_node(deselected.node.id);
//        }
//    }
//});
$("#Acctree").on("select_node.jstree", function (node, selected) {
    var siblingNodes = $("#Acctree").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#Acctree").jstree(true).select_node(vl);
        });
    }
});
$("#Acctree").on("deselect_node.jstree", function (node, deselected) {
    var siblingNodes = $("#Acctree").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#Acctree").jstree(true).deselect_node(vl);
        });
    }
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
function RefreshAdvancedModal() {
    $(".modal input").val("");
    $("#Acc_Owner,#IndustrySelect,#comBoBoxOngoing,#comBoBoxHistory").val("").trigger("change");
    $("#Acctree").jstree("deselect_all");
    $(".advancesearch").find("i").css("color", "#ffffff");
    $("#refreshAdv").addClass("hidden");
    isOngoing = "";
    isHistory = "";
    $("#IndustrySelect").val("");
    arradvancedSearch = [];
    table.draw();
}  
$("#advancedsearch-modal").on("hidden.bs.modal", function () {
    if (arradvancedSearch.length > 0) {
        $(".advancesearch").find("i").css("color", "orange");
        $("#refreshAdv").removeClass("hidden");
       
    } else {
        $(".advancesearch").find("i").css("color", "#ffffff");
        $("#refreshAdv").addClass("hidden");
    }
});

function btnImportStaffInfo() {
    if ($('#fileStaffInfoData').val() != '') {
        var str = $('#fileStaffInfoData').val().replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
        var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$");
        if (!regex.test(str.toLowerCase())) {
            bootbox.alert("File import phải là file excel.");
            return false;
        } else {
            ImportStaffInfo();
        }
    } else {
        bootbox.alert("Chọn file để import dữ liệu.");
        return false;
    }
}
$('#fileStaffInfoData').change(function (e) {
    var path = $(this).val().replace(/.*(\/|\\)/, '');
    if (path != '') {
        $('#file_StaffInfoName').text(path);
        
    }
});

function ImportStaffInfo() {
    var formData = new FormData();
    var file = document.getElementById("fileStaffInfoData").files[0];
    var divImportMsg = $("#divImportMsg");
    formData.append("frm", file);
    $.ajax({
        url: $("#urlAjaxImportAcc").val(),
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        beforeSend: function () {
        },
        success: function (response) {
            divImportMsg.empty();
            if (response.ResultCode > 1) {
                var msgImportErrors = "";
                msgImportErrors += ('<div class="alert alert-danger alert-dismissible">');
                msgImportErrors += ('   <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
                msgImportErrors += ('   <span>');
                if (response.ResultCode == 3) {
                    msgImportErrors += ('Số cột dữ liệu trong file không đúng với template ');
                } else {
                    msgImportErrors += ('Lỗi file');
                }

                msgImportErrors += ('   </span>');
                msgImportErrors += ('</div>');
                divImportMsg.append(msgImportErrors);
                table.draw();
            }
            else {
                var msgImportSuccess = "";
                var msgImportErrors = "";
                var totalSuccess = response.Data.TotalSuccess;
                var totalRow = response.Data.TotalRowImport;

                //sucess region (Import thanh cong)
                msgImportSuccess = getMsgImportSucc(totalSuccess, totalRow, response.Data.PathExcel);
                divImportMsg.append(msgImportSuccess);
                console.log(totalSuccess);
                console.log(totalRow);
                //Error region
                if (totalSuccess < totalRow) {
                    //get the data import Error
                    msgImportErrors = getMsgImportErr(response);
                    divImportMsg.append(msgImportErrors);
                }
                table.draw();
            }
        },
        error: function (error) {
            var msgImportErrors = "";
            msgImportErrors += ('<div class="alert alert-danger alert-dismissible">');
            msgImportErrors += ('   <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
            msgImportErrors += ('   <span>');
            msgImportErrors += (error);
            msgImportErrors += ('   </span>');
            msgImportErrors += ('</div>');
            divImportMsg.append(msgImportErrors);
        }
    });
}
///Import toàn bộ data
function getMsgImportSucc(totalSuccess, totalRow, pathExcel) {
    var msgImportSuccess = "";
    msgImportSuccess += ('<div class="alert alert-success alert-dismissible" >');
    msgImportSuccess += ('   <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
    msgImportSuccess += ('   <span>');
    msgImportSuccess += ('      <p class="margin-top-15">File Excel: <span class="bold">' + pathExcel + '</span></p>');
    msgImportSuccess += ('      <p>UpdateSuccess : <span class="bold">' + totalSuccess + ' /' + totalRow + '</span>&nbsp;rows</p>');
    msgImportSuccess += ('   </span>');
    msgImportSuccess += ('</div>');
    return msgImportSuccess;
}
///Import lỗi
function getMsgImportErr(response) {
    console.log(response);
    var msgImportErrors = "";
    msgImportErrors += ('<div class="alert alert-danger alert-dismissible">');
    msgImportErrors += ('   <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
    msgImportErrors += ('   <span>');
    msgImportErrors += ('       <p class="margin-top-15 bold color-red">List row import error</p>');
    for (var i = 0; i < response.Data.Results.length; i++) {
        var item = response.Data.Results[i];
        msgImportErrors += ('<p>Row : <span class="bold">'
            + item.Stt
            + '</span>&nbsp;&nbsp;&nbsp;Exception:<span class="bold">'
            + item.Exception
            + '</span</p>');
    }
    msgImportErrors += ('   </span>');
    msgImportErrors += ('</div>');
    return msgImportErrors;
}
function OpenModalImport() {
    $("#divImportMsg").empty()
    $("#file_StaffInfoName").empty()
    $("#fileStaffInfoData").val('');
    $("#import_model").modal("show");
}
function checknull(data) {
    str = htmlEncode(data) == null ? "" : htmlEncode(data)
    return str;
}
function Export() {
    $.ajax({
        "url": $("#urlExporttoExcel").val(),
        method: "POST",
        ///async: false,
        data: dataSearch,
        beforeSend: function () {
            $("#loading").addClass("loading");
        },
        success: function (data) {
            if (data != "" && data != null && data.data.length > 0) {
                //saveAsExcel(data);
                $("#loading").removeClass("loading");   
                fnExcelReport(data);
            }
        }
    });
}
var MIME_TYPE = 'data:application/vnd.ms-excel;charset=utf-8';

function fnExcelReport(tab) {
    var htmls = "";
    var htmls = "<table border='2px'>";
    htmls += '<tr style="height:30pt; font-weight: bold; font-size:22px; text-align: center">';
    htmls += '<td style="width:auto">Tên khách hàng</td>';
    htmls += '<td style="width:auto">Tên tiếng anh</td>';
    htmls += '<td style="width:auto">Tên viết tắt</td>';
    htmls += '<td style="width:auto">Mã khách hàng</td>';
    htmls += '<td style="width:auto"">OrgChart</td>';
    htmls += '<td style="width:auto">Điện thoại VP</td>';
    htmls += '<td style="width:auto">Email</td>';
    htmls += '<td style="width:auto"">Địa chỉ khách hàng</td>';
    htmls += '<td style="width:auto">Số Fax</td>';
    htmls += '<td style="width:auto">Mã số thuế</td>';
    htmls += '<td style="width:auto">Người quản lý</td>';
    htmls += '<td style="width:auto">Ngày tạo</td>';
    htmls += '<td style="width:auto">Tags</td>';
    htmls += '</tr>';
    for (j = 0; j < tab.data.length; j++) {
        var str = "";
        htmls += '</tr>';
        if (tab.data[j].createdDate !== "") {
            str += new Date(tab.data[j].createdDate).toLocaleDateString();
        }

        htmls += '<tr style="height:30pt; font-size:14px; text-align: center">';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accountName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicEnglishName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicShortName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accountCode) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].orgChart) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicPhone) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicEmail) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicAddress) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicTaxNumber) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicTaxCode) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].owner) + '</td>';
        htmls += '<td style="width:auto">' + str + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].tags) + '</td>';
        htmls += '</tr>';
    }
    htmls += "</table>";
    var filename = 'Danh sách khách hàng hiện hữu.xls';
    var element = document.createElement('a');

    var bb = new Blob([htmls], { type: MIME_TYPE });

    if (navigator.appVersion.toString().indexOf('.NET') > 0)
        window.navigator.msSaveBlob(bb, filename);
    else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(bb);
        a.textContent = ' ';
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        $("body").append(a);
        a.click();
    }
}



