var table;
var advancedSearchCheck;
var dataTableModel;
var arrOpp = [];
var dataSearch = "";

$(document).ready(function () {
    GetListOpportunities();
    $("#AdvSearch-Owner").select2({
        allowClear: true,
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

    $("#AdvSearch-Owner").data("select2").on("results:message", function () {
        this.dropdown._positionDropdown();
    });

    var saleStageGroups = [];
    var url = $("#urlGetSaleStageType").val();
    $.ajax({
        "url": url,
        type: "GET",
        "dataType": "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (dt) {
            saleStageGroups = dt;
        }
    });

    $("#AdvSearch-SaleStageType").select2({
        multiple: true,
        data: saleStageGroups,
        allowClear: true
    }).on('select2-selecting', function (e) {
        var $select = $(this);
        if (e.val == '') {
            e.preventDefault();
            $select.select2('data', $select.select2('data').concat(e.choice.children));
            $select.select2('close');
        }
    });

    UITree.init();
    
    $("#saleStage-choosen").val("ongoing").trigger("change");    
});

$(document).on("change", "#isViewOwner,#isViewDivision,#isViewDivisonOwner", function () {
    ReloadTable();
});

$(document).on("change", "#isViewExploited,#isViewDivisonExploited", function () {
    ReloadTable();
});

$("#myOpportunities").on("click", function () {
    if ($("#myOpportunities").parent().parent().hasClass("active") === false) {
        $("#exploitedOpp-table").DataTable().clear().destroy();
        $("#exploitedOpp-table").empty();
        GetListOpportunities();
    }
});

$("#exploitedOpportunities").on("click", function () {
    if ($("#exploitedOpportunities").parent().parent().hasClass("active") === false) {
        $("#opp-table").DataTable().clear().destroy();
        $("#opp-table").empty();
        GetListExploitedOpportunities();
    }
});

$(document).on("click", "#advanced-search", function () {
    if ($("#myOpportunities").parent().parent().hasClass("active")) {
        //$("#opp-table").DataTable().clear().destroy();
        //$("#opp-table").empty();        
        //GetListOpportunities(true);
        advancedSearchCheck = true;
        ReloadTable();
    }

    $("#advancedsearch-modal").modal("hide");
});

function GetListOpportunities() {
    var url = $("#urlLoadListOpportunities").val();    

    table = $('#opp-table').DataTable({
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        "order": [[7, "desc"]],
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
                if (advancedSearchCheck === true) {
                    arrOpp = GenAdvancedSearchValue();
                }

                var isViewOwner = $("#isViewOwner").prop("checked");
                var isViewDivision = $("#isViewDivision").prop("checked");
                var isViewDivisonOwner = $("#isViewDivisonOwner").prop("checked");
                var isExportExcel = $("#exportCheck").val();
                dataSearch = $.extend({}, d, {
                    "isViewOwner": isViewOwner,
                    "isViewDivision": isViewDivision,
                    "isViewDivisonOwner": isViewDivisonOwner,
                    "isExportExcel": isExportExcel,
                    "advancedSearch": arrOpp
                });
                return dataSearch;
            },
            error: defaultAjaxErrorHandle
        },
        "columns": GetListOpportunitiesProperty(1),
        'columnDefs': [
            {
                'targets': -1,
                "data": null,
                'searchable': false,
                'orderable': false,
                'className': "text-center",
                'render': function (data, type, full, meta) {
                    var isAdminOrDataManager = $("#isAdminOrDataManager").val();
                    var str = "";
                    str += "<div class='btn-group' role='group'>";
                    str += "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";
                    str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1'>";
                    str += "<li> <a onclick='viewOppDetail(" + full.id + ")' title='Sửa' class='cursor-pointer padding-right-5'>";
                    str += "<i class='fa fa-pencil padding-left-5 padding-right-10'></i>";
                    str += "Cập nhật";
                    str += "</a>";
                    if (isAdminOrDataManager === "True") {
                        str += "<a class='delete-btn cursor-pointer' onclick='deleteOpp(" + full.id + ")' title='Xóa'>";
                        str += "<i class='fa fa-trash padding-left-5 padding-right-10'></i>";
                        str += "Xóa";
                        str += "</a> </li>";
                    } else {
                        str += "</li>";
                    }
                    str += " </div></div>";
                    str += "<input type='hidden' class='opp-redirect-id' value='" + full.id + "' />";
                    return str;
                }
            },
            {
                'targets': 0,
                'className': "opp-redirect",
                'render': function (data, type, full, meta) {
                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Opportunities/Details?oppId=" + full.id + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + full.oppCode + "</a>";
                    return str;
                }
            },
            {
                'targets': 1,
                'className': "",
                "width": "20%"
            },
            {
                'targets': 2,
                'className': ""                
            },
            {
                'targets': 3,
                'className': "",
                "width": "20%"
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
                        str += new Date(full.createdDate).toLocaleDateString("en-GB");
                    }
                    return str;
                }
            },
            {
                'targets': 8,
                'className': ""
            },
            {
                'targets': 9,
                'className': "text-right",
                'render': function (data, type, full, meta) {
                    var str = '';
                    if (data !== "" && data != null) {
                        str = newAddCommasPM(parseFloat(data).toFixed(3));
                    }
                    return str;
                }
            }
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

    $("#opp-table_filter input").unbind();
    
    $("#opp-table_filter input").bind("keypress", function (e) {
        if (e.keyCode === 13) {
            table.search(this.value).draw();
        }
    });     

    $("#opp-table_filter input").on("blur", function () {
        if (true) {
            table.search(this.value).draw();
        }
    });

    $('#opp-table thead tr').clone(true).appendTo("#opp-table thead").addClass("search-header");

    $('#opp-table thead tr:eq(1)').off("click");
    $('#opp-table thead tr:eq(1) th').off("click");
    $('#opp-table thead tr:eq(1) th').off("keypress");


    $('#opp-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on("blur", function () {
            if (true) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on("keypress", function (e) {
            if (e.keyCode === 13) {
                if (true) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });
    $("#opp-table thead tr:eq(1) > th:last-child()").html("");

    $("#opp-table tbody tr").on("click", ".opp-ref", function () {
        var data = table.row(this).data();
        var hostAddress = $("#hostAddress").val();
        var link = hostAddress + "/Opportunities/Details?oppId=" + data.id + "";
        window.open(link, "_blank");
    });

    $("#opp-table tbody tr > td:last-child()").off("click");   

    //var htmlAdvance = "<label>";
    var htmlAdvance = "<div class='advancesearch-area'>";
    //htmlAdvance += "<a id='' class='btn btn-primary hidden'>";
    //htmlAdvance += "<i class='fa fa-file-excel-o' aria-hidden='true'></i>";
    //htmlAdvance += "</a>";
    htmlAdvance += "<button type='button' id='' class='btn btn-primary advancesearch' data-toggle='modal' data-target='#advancedsearch-modal'>";
    htmlAdvance += "<i class='fa fa-filter' aria-hidden='true'></i>";
    htmlAdvance += "</button>";
    htmlAdvance += "<a id='refreshAdv' onclick='RefreshAdvancedModal()' class='hidden'>";
    htmlAdvance += "<i class='fa fa-times' aria-hidden='true' style='color: #ffffff'></i>";
    htmlAdvance += "</a></div>";
    //htmlAdvance += "</label>";
    $("#opp-table_filter").prepend(htmlAdvance);
}

function GetListExploitedOpportunities() {
    var url = $("#urlLoadListExploitedOpportunities").val();    

    var tableExpOpp = $('#exploitedOpp-table').DataTable({
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
        rowId: "staffId",
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "lengthMenu": [10, 25, 50],
        "pageLength": 50,
        "ajax": {
            "url": url,
            type: "POST",
            data: function (d) {
                var isViewExploited = $("#isViewExploited").prop("checked");
                var isViewDivisonExploited = $("#isViewDivisonExploited").prop("checked");                
                return $.extend({}, d, {
                    "isViewExploited": isViewExploited,
                    "isViewDivisonExploited": isViewDivisonExploited                    
                });
            },
            error: defaultAjaxErrorHandle
        },
        "columns": GetListOpportunitiesProperty(0),
        'columnDefs': [            
            {
                'targets': 0,
                'className': "opp-redirect",
                'render': function (data, type, full, meta) {
                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Opportunities/Details?oppId=" + full.id + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + full.oppCode + "</a>";
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
                'render': function (data, type, full, meta) {
                    var str = "";                    
                    if (full.createdDate !== "") {
                        str += new Date(full.createdDate).toLocaleDateString("en-GB");
                    }
                    return str;
                },
                'className': ""
                
            }
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

    $("#exploitedOpp-table thead tr").clone(true).appendTo("#exploitedOpp-table thead").addClass("search-header");

    $("#exploitedOpp-table thead tr:eq(1)").off("click");
    $("#exploitedOpp-table thead tr:eq(1) th").off("click");
    $("#exploitedOpp-table thead tr:eq(1) th").off("keypress");


    $("#exploitedOpp-table thead tr:eq(1) th").each(function (i) {
        //var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (tableExpOpp.column(i).search() !== this.value) {
                tableExpOpp
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                if (tableExpOpp.column(i).search() !== this.value) {
                    tableExpOpp
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });
    //$("#exploitedOpp-table thead tr:eq(1) > th:last-child()").html("");

    $("#exploitedOpp-table tbody tr").on("click", ".opp-ref", function () {
        var data = tableExpOpp.row(this).data();
        var hostAddress = $("#hostAddress").val();
        var link = hostAddress + "/Opportunities/Details?oppId=" + data.id + "";
        window.open(link, "_blank");
    });

    $("#exploitedOpp-table tbody tr > td:last-child()").off("click");
}

function GetListOpportunitiesProperty(type) {
    var url = $("#urlLoadListOpportunitiesProperty").val();
    var lstOppProperty = "";
    var arr = [];
    $.ajax({
        "url": url,
        type: "GET",
        "dataType": "json",
        data: {
            type: type
        },
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (dt) {
            lstOppProperty = dt;
        }
    });

    $.each(lstOppProperty, function (index, element) {

        if (index === lstOppProperty.length - 1) {
            var lastObj = {
                data: element.PropertyCode,
                orderable: false,
                title: element.PropertyDisplayName
            };
            arr.push(lastObj);
        } else {
            var obj = {
                data: element.PropertyCode,
                orderable: true,
                title: element.PropertyDisplayName
            };
            arr.push(obj);
        }
    });

    return arr;
}

function addCommasPM(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function newAddCommasPM(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}

function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}

function deleteOpp(oppId) {
    var obj = $(this);
    bootbox.confirm({
        title: "Thông báo",
        message: "Đồng ý xóa cơ hội !",
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
                var url = $("#urlDeleteOpp").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'oppId': oppId
                    }),
                    success: function (data) {
                        bootbox.alert("Xóa cơ hội thành công!", function () {
                            $('#opp-table').DataTable().clear().destroy();
                            $('#opp-table').empty();
                            GetListOpportunities();
                        });

                    }
                });
            }
        }
    });
}

function viewOppDetail(oppId) {
    var hostAddress = $("#hostAddress").val();
    var link = hostAddress + "/Opportunities/Edit?oppId=" + oppId + "";
    window.open(link, "_blank");
}

var UITree = function () {
    var contextualMenu = function () {
        //render cây division
        $("#oppTree").jstree({
            "core": {
                "themes": {
                    "responsive": true
                },
                "check_callback": true,
                'cache': false,  
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

        $("#oppTree").bind("changed.jstree",
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

function GenAdvancedSearchValue() {
    var arr = [];
    var budgetFrom = {
        PropertyCode: "OppProjectBudget",
        Operator: "Gte",
        Value: $("#BudgetFrom").val().replace(/,/g, "")
    };

    var budgetTo = {
        PropertyCode: "OppProjectBudget",
        Operator: "Lte",
        Value: $("#BudgetTo").val().replace(/,/g, "")
    };

    var successRateFrom = {
        PropertyCode: "OppSuccessRate",
        Operator: "Gte",
        Value: $("#SuccessRateFrom").val()
    };

    var successRateTo = {
        PropertyCode: "OppSuccessRate",
        Operator: "Lte",
        Value: $("#SuccessRateTo").val()
    };

    var estimatedSalesFrom = {
        PropertyCode: "OppEstimatedSales",
        Operator: "Gte",
        Value: $("#EstimatedSalesFrom").val().replace(/,/g, "")
    };

    var estimatedSalesTo = {
        PropertyCode: "OppEstimatedSales",
        Operator: "Lte",
        Value: $("#EstimatedSalesTo").val().replace(/,/g, "")
    };

    var expectedGrossProfitFrom = {
        PropertyCode: "OppExpectedGrossProfit",
        Operator: "Gte",
        Value: $("#ExpectedGrossProfitFrom").val().replace(/,/g, "")
    };

    var expectedGrossProfitTo = {
        PropertyCode: "OppExpectedGrossProfit",
        Operator: "Lte",
        Value: $("#ExpectedGrossProfitTo").val().replace(/,/g, "")
    };

    var estimatedSalesHwFrom = {
        PropertyCode: "OppEstimatedSales_HW",
        Operator: "Gte",
        Value: $("#EstimatedSales_HWFrom").val().replace(/,/g, "")
    };

    var estimatedSalesHwTo = {
        PropertyCode: "OppEstimatedSales_HW",
        Operator: "Lte",
        Value: $("#EstimatedSales_HWTo").val().replace(/,/g, "")
    };

    var estimatedSalesSwFrom = {
        PropertyCode: "OppEstimatedSales_SW",
        Operator: "Gte",
        Value: $("#EstimatedSales_SWFrom").val().replace(/,/g, "")
    };

    var estimatedSalesSwTo = {
        PropertyCode: "OppEstimatedSales_SW",
        Operator: "Lte",
        Value: $("#EstimatedSales_SWTo").val().replace(/,/g, "")
    };

    var estimatedSalesSrvFrom = {
        PropertyCode: "OppEstimatedSales_SRV",
        Operator: "Gte",
        Value: $("#EstimatedSales_SRVFrom").val().replace(/,/g, "")
    };

    var estimatedSalesSrvTo = {
        PropertyCode: "OppEstimatedSales_SRV",
        Operator: "Lte",
        Value: $("#EstimatedSales_SRVTo").val().replace(/,/g, "")
    };

    var expectedGrossProfitHwFrom = {
        PropertyCode: "OppExpectedGrossProfit_HW",
        Operator: "Gte",
        Value: $("#ExpectedGrossProfit_HWFrom").val().replace(/,/g, "")
    };

    var expectedGrossProfitHwTo = {
        PropertyCode: "OppExpectedGrossProfit_HW",
        Operator: "Lte",
        Value: $("#ExpectedGrossProfit_HWTo").val().replace(/,/g, "")
    };

    var expectedGrossProfitSwFrom = {
        PropertyCode: "OppExpectedGrossProfit_SW",
        Operator: "Gte",
        Value: $("#ExpectedGrossProfit_SWFrom").val().replace(/,/g, "")
    };

    var expectedGrossProfitSwTo = {
        PropertyCode: "OppExpectedGrossProfit_SW",
        Operator: "Lte",
        Value: $("#ExpectedGrossProfit_SWTo").val().replace(/,/g, "")
    };

    var expectedGrossProfitSrvFrom = {
        PropertyCode: "OppExpectedGrossProfit_SRV",
        Operator: "Gte",
        Value: $("#ExpectedGrossProfit_SRVFrom").val().replace(/,/g, "")
    };

    var expectedGrossProfitSrvTo = {
        PropertyCode: "OppExpectedGrossProfit_SRV",
        Operator: "Lte",
        Value: $("#ExpectedGrossProfit_SRVTo").val().replace(/,/g, "")
    };

    var createdDateFrom = {
        PropertyCode: "CreatedDate",
        Operator: "Gte",
        Value: $("#CreatedDateFrom").val()
    };

    var createdDateTo = {
        PropertyCode: "CreatedDate",
        Operator: "Lte",
        Value: $("#CreatedDateTo").val()
    };

    var lstDivisionId = {
        PropertyCode: "Division",
        Operator: "In",
        Value: ConvertListIdString($('#oppTree').jstree('get_selected'))
    };

    var lstAccountId = {
        PropertyCode: "AccountId",
        Operator: "In",
        Value: ConvertListIdString($("#AdvSearch-Acc").val())
    };

    var lstOwnerId = {
        PropertyCode: "OwnerId",
        Operator: "In",
        Value: ConvertListIdString($("#AdvSearch-Owner").val())
    };

    var lstSaleStageId = {
        PropertyCode: "SaleStageId",
        Operator: "In",
        Value: ConvertListIdString($("#AdvSearch-SaleStageType").val())
    };

    arr.push(budgetFrom, budgetTo,
        successRateFrom, successRateTo,
        estimatedSalesFrom, estimatedSalesTo,
        expectedGrossProfitFrom, expectedGrossProfitTo,
        estimatedSalesHwFrom, estimatedSalesHwTo,
        estimatedSalesSwFrom, estimatedSalesSwTo,
        estimatedSalesSrvFrom, estimatedSalesSrvTo,
        expectedGrossProfitHwFrom, expectedGrossProfitHwTo,
        expectedGrossProfitSwFrom, expectedGrossProfitSwTo,
        expectedGrossProfitSrvFrom, expectedGrossProfitSrvTo,
        createdDateFrom, createdDateTo,
        lstDivisionId, lstAccountId,
        lstOwnerId, lstSaleStageId);
    var length = arr.length;
    for (var i = length-1; i >= 0; i--) {
        if (arr[i].Value === "") {
            arr.splice(i, 1);
        }
    }

    return arr;
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

$("#oppTree").on("select_node.jstree", function (node, selected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(selected.node.id);
    var siblingNodes = $("#oppTree").jstree(true).get_node(selected.node.id).children_d;

    //chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#oppTree").jstree(true).select_node(vl);
        });
    }
});

$("#oppTree").on("deselect_node.jstree", function (node, deselected) {
    //var siblingNodes = $("#oppTree-signedSalesAndGP").jstree(true).get_children_dom(deselected.node.id);

    var siblingNodes = $("#oppTree").jstree(true).get_node(deselected.node.id).children_d;

    //bỏ chọn hết các con 
    if (siblingNodes.length > 0) {
        $.each(siblingNodes, function (id, vl) {
            $("#oppTree").jstree(true).deselect_node(vl);
        });
    }
});

$(".format-number").on("paste", function (event) {
    if (event.originalEvent.clipboardData.getData("Text").match(/[^\d]/)) {
        event.preventDefault();
    }
});

function ReloadTable() {
    $("#loading").addClass("loading"); 
    table.draw();
    $("#loading").removeClass("loading");  
}

$("#advancedsearch-modal").on("hidden.bs.modal", function () {
    if (arrOpp.length > 0) {
        $(".advancesearch").find("i").css("color", "orange");
        $("#refreshAdv").removeClass("hidden");
        if (!advancedSearchCheck) {
            GenValueInputAS(arrOpp);
        } else {

        }
    } else {
        $(".advancesearch").find("i").css("color", "#ffffff");
        $("#refreshAdv").addClass("hidden");
    }
});

$(document).on("change", ".modal input, #AdvSearch-Acc, #AdvSearch-Owner, #AdvSearch-SaleStageType", function () {
    advancedSearchCheck = false;
});

$("#oppTree").on("changed.jstree", function (e, data) {
    advancedSearchCheck = false;
});    

function GenValueInputAS(arr) {
    if (arr.length > 0) {
        for (var j = 0; j < arr.length; j++) {
            if (arr[j].PropertyCode === "OppProjectBudget" && arr[j].Operator === "Gte" ) {
                $("#BudgetFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppProjectBudget" && arr[j].Operator === "Lte") {
                $("#BudgetTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppSuccessRate" && arr[j].Operator === "Gte") {
                $("#SuccessRateFrom").val(arr[j].Value);
            }           
            else if (arr[j].PropertyCode === "OppSuccessRate" && arr[j].Operator === "Lte") {
                $("#SuccessRateTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppEstimatedSales" && arr[j].Operator === "Gte") {
                $("#EstimatedSalesFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppEstimatedSales" && arr[j].Operator === "Lte") {
                $("#EstimatedSalesTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit" && arr[j].Operator === "Gte") {
                $("#ExpectedGrossProfitFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit" && arr[j].Operator === "Lte") {
                $("#ExpectedGrossProfitTo").val(arr[j].Value);
            }                
            else if (arr[j].PropertyCode === "OppEstimatedSales_HW" && arr[j].Operator === "Gte") {
                $("#EstimatedSales_HWFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppEstimatedSales_HW" && arr[j].Operator === "Lte") {
                $("#EstimatedSales_HWTo").val(arr[j].Value);
            }                
            else if (arr[j].PropertyCode === "OppEstimatedSales_SW" && arr[j].Operator === "Gte") {
                $("#EstimatedSales_SWFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppEstimatedSales_SW" && arr[j].Operator === "Lte") {
                $("#EstimatedSales_SWTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppEstimatedSales_SRV" && arr[j].Operator === "Gte") {
                $("#EstimatedSales_SRVFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppEstimatedSales_SRV" && arr[j].Operator === "Lte") {
                $("#EstimatedSales_SRVTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit_HW" && arr[j].Operator === "Gte") {
                $("#ExpectedGrossProfit_HWFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit_HW" && arr[j].Operator === "Lte") {
                $("#ExpectedGrossProfit_HWTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit_SW" && arr[j].Operator === "Gte") {
                $("#ExpectedGrossProfit_SWFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit_SW" && arr[j].Operator === "Lte") {
                $("#ExpectedGrossProfit_SWTo").val(arr[j].Value);
            }            
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit_SRV" && arr[j].Operator === "Gte") {
                $("#ExpectedGrossProfit_SRVFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "OppExpectedGrossProfit_SRV" && arr[j].Operator === "Lte") {
                $("#ExpectedGrossProfit_SRVTo").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "CreatedDate" && arr[j].Operator === "Gte") {
                $("#CreatedDateFrom").val(arr[j].Value);
            }
            else if (arr[j].PropertyCode === "CreatedDate" && arr[j].Operator === "Lte") {
                $("#CreatedDateTo").val(arr[j].Value);
            } 
            else if (arr[j].PropertyCode === "Division" && arr[j].Operator === "In") {
                var lstTreeId = arr[j].Value.split(",");
                if (lstTreeId !== "") {
                    $("#oppTree").jstree("deselect_all");
                    for (var i = 0; i < lstTreeId.length; i++) {
                        $("#oppTree").jstree(true).select_node((lstTreeId[i]));
                    }                    
                }                
            }
            
            else if (arr[j].PropertyCode === "AccountId" && arr[j].Operator === "In") {
                $("#AdvSearch-Acc").val(arr[j].Value.split(",")).trigger("change");                
            }
            //Còn acc chưa làm
            //else if (arr[j].PropertyCode === "OwnerId" && arr[j].Operator === "In") {
                //$("#CreatedDateFrom").val(arr[j].Value);
                //    Value: ConvertListIdString($("#AdvSearch-Owner").val())
            //}
            else if (arr[j].PropertyCode === "SaleStageId" && arr[j].Operator === "In") {
                $("#AdvSearch-SaleStageType").val(arr[j].Value.split(",")).trigger("change");                
            }
        }

        $(".modal input").trigger("blur");
    }
    return ;
}

function RefreshAdvancedModal() {
    $(".modal input").val("");
    $("#AdvSearch-Acc, #AdvSearch-Owner, #AdvSearch-Owner, #AdvSearch-SaleStageType").val("").trigger("change");
    $("#oppTree").jstree("deselect_all");
    $(".advancesearch").find("i").css("color", "#ffffff");
    $("#refreshAdv").addClass("hidden");
    //$("#saleStage-choosen").val("ongoing").trigger("change");     
    arrOpp = [];    
    ReloadTable();
}   

$(document).on("click", "#exportExcel", function () {
    $("#exportCheck").val(true);
    ReloadTable();
});

function Export() {
    $.ajax({
        "url": $("#urlExporttoExcel").val(),
        method: "POST",
        //async: false,
        data: dataSearch,
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

var MIME_TYPE = 'data:application/vnd.ms-excel;charset=utf-8';

function saveAsExcel(data) {
    var bb = new Blob([data], { type: MIME_TYPE });

    //với IE:
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
        window.navigator.msSaveBlob(bb, "Danh sách cơ hội.xls");
    else {
        var a = document.createElement('a');
        a.download = "Danh sách cơ hội.xls";
        a.href = window.URL.createObjectURL(bb);
        a.textContent = ' ';
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        $("body").append(a);
        a.click();
    }
}

$(document).on("change", "#saleStage-choosen", function () {
    var value = $("#saleStage-choosen").val();              
    if (!$("#refreshAdv").is(":visible")) {
        $('#oppTree').jstree("deselect_all");
    }
    if (value === "all") {
        $("#AdvSearch-SaleStageType").select2('destroy').find('option').prop('selected', 'selected').end().select2();                
    } else if (value === "ongoing") {
        $("#AdvSearch-SaleStageType").val($("#onGoingSsId").val().split(",")).trigger("change");        
    } else if (value === "finish") {
        $("#AdvSearch-SaleStageType").val($("#finishSsId").val().split(",")).trigger("change");        
    } else if (value === "-1") {
        $("#AdvSearch-SaleStageType").select2('destroy').find('option').prop('selected', false).end().select2();
    }   

    $("#advanced-search").click();
});


$(document).on("change", "#AdvSearch-SaleStageType", function () {
    if ($("#advancedsearch-modal").is(":visible")) {
        $("#saleStage-choosen").val("-1");   
    }    
});

$('#oppTree').on('after_close.jstree', function (e, data) {
    var tree = $('#oppTree').jstree(true);
    tree.delete_node(data.node.children);
    tree._model.data[data.node.id].state.loaded = false;
});