const { error } = require("jquery");

function ajaxDebt(debt) {
    $.ajax({
        url: $('#chkdebthidden').val(),
        type: 'GET',
        dataType: 'json',
        data: {
            debt: debt
        },
        success: function (data) {
            alert(data);
            var html = "";
            for (var i = 0; i < data.length; i++) {
                var url = '@Url.Action("Update", "Bill", new {id = ' + data[i].IdBill + ' })';
                html += '<tr class="odd gradeX trdataDebtNgan" id="trdataDebtNgan" align="center">';
                html += '<td>' + data[i].IdBill + '</td>';
                html += '<td><a href="@Url.Action("DetailsBill", "Bill", new {id = ' + data[i].IdBill + ' })">' + data[i].NameBill + '</td>';
                html += '<td>' + data[i].NameUser + ' (' + data[i].IdUser + ')</td>';
                html += '<td>' + data[i].NameCus + '</td>';
                html += '<td><a href="@Url.Action("ShowBill", "Bill", new {id = ' + data[i].IdBill + ' })">' + data[i].FileHD + '</a></td>';
                html += '<td>' + data[i].Date + '.ToString("dd/MM/yyyy")</td>';
                html += '<td>';
                html += '<a href=' + url + '><i class="fa fa-pencil" aria-hidden="true"></i></a>';
                html += '<button onclick="isDelete()" style="margin-left: 10px"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
                html += '<input type="hidden" name="" id="idin" value="' + data[i].IdBill + '" size="30" />';
                html += '</td>';
                html += '</tr>';
            };
            $('.tbody').append(html);
        },
    });
}
debugger;
$('#chknongan').click(function () {
    if ($('#chknongan').is(':checked')) {
        ajaxDebt(0);
    }
    else {
        $('.tbody').remove("#trdataDebtNgan");
    }
})