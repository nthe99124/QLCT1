$("#btnthem").click(function () {
    $.ajax({
        url: $("#hiddenUrlInsert").val(),
        type: 'POST',
        dataType: "json",
        data: {
            Name: $("#NameDevi").val()
        },
        success: function (data, textStatus) {
            alert("Thêm thành công Đơn vị ");
        }
    });
})
$(document).ready(function () {

    $('.buttonThem').click(function () {
        location.reload();
    })
})