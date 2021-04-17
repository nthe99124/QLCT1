

$(document).ready(function () {


});
function ExportAccountPropertyValueToExcel() {
    
    $.ajax({
        "url": $("#urlExportAccountInformationToExcel").val(),
        type: "POST",
        data: {},
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            
            $("#loading").addClass("loading");
        },
        
        success: function (data) {
            //console.log(data)
            
            if (data != "" && data != null && data.data.length > 0) {
                //saveAsExcel(data);
                $("#loading").removeClass("loading");
                
                AccountInformationExcelReport(data);
            }
        },
        error: function (error) {
            $("#loading").removeClass("loading");
            alert("error");
        }
    });
    
}
function checknull(data) {
    str = htmlEncode(data) == null ? "" : htmlEncode(data)
    return str;
}
var MIME_TYPE = 'data:application/vnd.ms-excel;charset=utf-8';
function AccountInformationExcelReport(tab) {
    var htmls = "";
    var htmls = "<table border='2px'>";
    htmls += '<tr style="height:30pt; font-weight: bold; font-size:22px; text-align: center">';
    htmls += '<td style="width:auto">Id</td>';
    htmls += '<td style="width:auto">AccountName</td>';
    htmls += '<td style="width:auto">UserName</td>';
    htmls += '<td style="width:auto">Address</td>';
    htmls += '<td style="width:auto">cateCode</td>';
    htmls += '<td style="width:auto">cateName</td>';
    htmls += '<td style="width:auto">DivisionId</td>';
    htmls += '<td style="width:auto">Owner</td>';
    htmls += '<td style="width:auto"">Code</td>';
    htmls += '<td style="width:auto">IsDeleted</td>';
    htmls += '<td style="width:auto">CreatedBy</td>';
    htmls += '<td style="width:auto">CreatedDate</td>';
    htmls += '<td style="width:auto">UpdatedDate</td>';
    htmls += '<td style="width:auto"">UpdatedBy</td>';
    htmls += '<td style="width:auto">ActiveDate</td>';
    htmls += '<td style="width:auto">Status</td>';
    htmls += '<td style="width:auto">Text</td>';
    htmls += '</tr>';
    for (j = 0; j < tab.data.length; j++) {
        var str = "";
        htmls += '</tr>';
        if (tab.data[j].createdDate !== "") {
            str += new Date(tab.data[j].createdDate).toLocaleDateString();
        }
        var StatusDescription = "";
        switch (tab.data[j].status) {
            case 0:
                StatusDescription = "Chờ xử lý";
                break;
            case 1:
                StatusDescription = "Duyệt";
                break;
            case 2:
                StatusDescription = "Hủy";
            case 3:
                StatusDescription = "Cancel"
            default:
                break;
        }

        htmls += '<tr style="height:30pt; font-size:14px; text-align: center">';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].id) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].accountName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].username) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].address) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].cateCode) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].cateName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].divisionId) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].owner) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].code) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].isDeleted) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].createdBy) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].createdDate) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].updatedDate) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].updatedBy) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].activeDate) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].status) + '</td>';
        htmls += '<td style="width:auto">' + StatusDescription + '</td>';
        htmls += '</tr>';
    }
    htmls += "</table>";
    var filename = 'Danh sách khách Hàng.xls';
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

function ExportUserInformationToExcel() {

    $.ajax({
        "url": $("#urlExportUserInformationToExcel").val(),
        type: "POST",
        data: {},
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {

            $("#loading").addClass("loading");
        },

        success: function (data) {
            //console.log(data)

            if (data != "" && data != null && data.data.length > 0) {
                //saveAsExcel(data);
                $("#loading").removeClass("loading");

                UserInformationExcelReport(data);
            }
        },
        error: function (error) {
            $("#loading").removeClass("loading");
            alert("error");
        }
    });

}
function UserInformationExcelReport(tab) {
    var htmls = "";
    var htmls = "<table border='2px'>";
    htmls += '<tr style="height:30pt; font-weight: bold; font-size:22px; text-align: center">';
    htmls += '<td style="width:auto">Id</td>';
    htmls += '<td style="width:auto">UserName</td>';
    htmls += '<td style="width:auto">FullName</td>';
    htmls += '<td style="width:auto">UserRole</td>';
    htmls += '<td style="width:auto">CategoryId</td>';
    htmls += '<td style="width:auto">CateCode</td>';
    htmls += '<td style="width:auto">CateName</td>';
    htmls += '</tr>';
    for (j = 0; j < tab.data.length; j++) {
        var str = "";
        htmls += '</tr>';
        if (tab.data[j].createdDate !== "") {
            str += new Date(tab.data[j].createdDate).toLocaleDateString();
        }
        var StatusDescription = "";
        switch (tab.data[j].status) {
            case 0:
                StatusDescription = "Chờ xử lý";
                break;
            case 1:
                StatusDescription = "Duyệt";
                break;
            case 2:
                StatusDescription = "Hủy";
            case 3:
                StatusDescription = "Cancel"
            default:
                break;
        }

        htmls += '<tr style="height:30pt; font-size:14px; text-align: center">';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].id) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].userName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].fullName) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].userRole) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].categoryId) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].cateCode) + '</td>';
        htmls += '<td style="width:auto">' + checknull(tab.data[j].cateName) + '</td>';
        htmls += '<td style="width:auto">' + StatusDescription + '</td>';
        htmls += '</tr>';
    }
    htmls += "</table>";
    var filename = 'Danh sách User.xls';
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