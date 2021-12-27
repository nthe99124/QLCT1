const { error } = require("console");
const { func } = require("prop-types");

$('#btnthem').click(function () {
    var ddlLead = 0;
    if ($("#ddlLead").val() != "Chọn nhân viên") {
        ddlLead = $("#ddlLead").val()
    }
    $.ajax({
        url: $("#hiddenUrlInsert").val(),
        type: 'POST',
        dataType: "json",
        data: {
            Name: $("#NameDevi").val(),
            Header: ddlLead
        },
        success: function (data, textStatus) {
            alert("Thêm thành công Đơn vị ");
        },
        error: function () {
            alert("Thêm không thành công Đơn vị ");
        }
    });
    location.reload();
})
$('.buttonSua').click(function () {
    var ddlLead = 0;
    if ($("#ddlLead").val() != "Chọn nhân viên") {
        ddlLead = $("#ddlLead").val()
    }
    $.ajax({
        url: $("#hiddenUrlInsert").val(),
        type: 'POST',
        dataType: "json",
        data: {
            Name: $("#NameDevi").val(),
            Header: ddlLead
        },
        success: function (data, textStatus) {
            alert("Sửa thành công Đơn vị ");
        }
    });
    location.reload();
})