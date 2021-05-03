$("#btnthem").click(function () {
    debugger;
    $.ajax({
        url: $("#hiddenUrlInsert").val(),
        type : 'POST',
        dataType: "json",
        data: {
            Name: $("#NameDevi").val()
        },
        success: function (data, textStatus) {
            alert("Thêm thành công Đơn vị ");
        }
    });

})