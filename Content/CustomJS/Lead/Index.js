var table;
var table1;
var roleSMO = false;
$(document).ready(function () {
    GetListAcc();
    if ($('#sessionRole').val() != null && $('#sessionRole').val() != "") {
        arrUser = $('#sessionRole').val().split(";");
        for (var i = 0; i < arrUser.length; i++) {
            if (arrUser[i] == "DataManager") {
                roleSMO = true;
            }
        }
    }
    $('#acc-table_info').hide();
    var dataSearch = "";
});

$(document).on("click", "#advanced-search", function () {
    ReloadTable(1,true);
    $("#advancedsearch-modal").modal("hide");
});

function GetListAcc(advancedSearch) {
    var url = $("#urlLoadListAcc").val();
    var arr;
    if (advancedSearch === true) {
        arr = [];

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
        arr.push(createdDateFrom, createdDateTo);
    }
    table = $('#acc-table').DataTable({
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        order: [[6, "desc"]],
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
                    "advancedSearch": arr
                });
                return $.extend({}, d, {
                    "isViewOwner": $("#isViewOwner1").prop("checked"),
                    "isViewDivision": $("#isViewDivision1").prop("checked"),
                    "isViewDivisonOwner": $("#isViewDivisonOwner1").prop("checked"),
                    "advancedSearch": arr
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
                    str += "<div class='btn-group' role='group'>";
                    str += "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";
                    str += " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1'>";
                    str += "<li><a onclick='viewAccDetail(" + full.id + ")' title='Sửa' class='' >";
                    str += "<i class='fa fa-pencil '></i>";
                    str += "Cập nhật";
                    str += "</a></li>";
                    if ($('#sessionIsAdmin').val() == "True" || roleSMO == true)
                    {
                        str += "<li><a class='delete-btn' onclick='deleteAcc(" + full.id + ")' title='Xóa'>";
                        str += "<i class='fa fa-trash '></i>";
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
                'className': "acc-redirect",
                'render': function (data, type, full, meta) {
                    var dataAccountName = htmlEncode(full.accountName);
                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Lead/Details?AccountId=" + full.id + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + dataAccountName + "</a>";
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
                'targets': 7,
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
                        bootbox.alert("Xóa khách hàng thành công!", function () {
                            ReloadTable();
                        });

                    }
                });
            }
        }
    });
}
function ReloadTable(tb,bool) {
    if (tb == 1 || tb==undefined || tb == null){
        try {
            table.draw(bool);
        } catch (e) {
            console.log(e);
        }
    }
}


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
        url: $("#urlAjaxImportLead").val(),
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
                if (response.ResultCode == 3){
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
    var msgImportErrors = "";
    msgImportErrors += ('<div class="alert alert-danger alert-dismissible">');
    msgImportErrors += ('   <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
    msgImportErrors += ('   <span>');
    msgImportErrors += ('       <p class="margin-top-15 bold color-red">List row import error</p>');
    for (var i = 0; i < response.Data.Results.length; i++) {
        var item = response.Data.Results[i];
        msgImportErrors += ('<p>Row : <span class="bold">'
            + item.Result.Stt
            + '</span>&nbsp;&nbsp;&nbsp;Exception:<span class="bold">'
            + item.Result.Exception
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
       // async: false,
        data: dataSearch,
        success: function (data) {
            if (data != "" && data != null && data.data.length > 0)
            {
                fnExcelReport(data);
            }
        }
    });
}

function fnExcelReport(tab) {    var htmls = "";    var htmls = "<table border='2px'>";    htmls += '<tr style="height:30pt; font-weight: bold; font-size:22px; text-align: center">';    htmls += '<td style="width:auto">Tên khách hàng</td>';    htmls += '<td style="width:auto">Tên tiếng anh</td>';    htmls += '<td style="width:auto">Tên viết tắt</td>';    htmls += '<td style="width:auto"">OrgChart</td>';    htmls += '<td style="width:auto">Điện thoại VP</td>';    htmls += '<td style="width:auto">Email</td>';    htmls += '<td style="width:auto">Địa chỉ khách hàng</td>';    htmls += '<td style="width:auto">Số Fax</td>';    htmls += '<td style="width:auto">Mã số thuế</td>';    htmls += '<td style="width:auto">Người quản lý</td>';    htmls += '<td style="width:auto">Ngày tạo</td>';    htmls += '</tr>';    for (j = 0; j < tab.data.length; j++) {        var str = "";        htmls += '</tr>';        if (tab.data[j].createdDate !== "") {            str += new Date(tab.data[j].createdDate).toLocaleDateString();        }        htmls += '<tr style="height:30pt; font-size:14px; text-align: center">';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accountName) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicEnglishName) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicShortName) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].orgChart) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicPhone) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicEmail) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicAddress) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicTaxNumber) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].accBasicTaxCode) + '</td>';        htmls += '<td style="width:auto">' + checknull(tab.data[j].owner) + '</td>';        htmls += '<td style="width:auto">' + str + '</td>';        htmls += '</tr>';    }    htmls += "</table>";    var filename = 'Danh sách khách hàng tiềm năng.xls';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(htmls));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element)}