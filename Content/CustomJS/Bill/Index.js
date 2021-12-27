function ajaxDebt(debt,status) {
    $.ajax({
        url: $('#chkdebthidden').val(),
        type: 'GET',
        dataType: 'json',
        data: {
            debt: debt,
            status: status
        },
        success: function (data) {
            
            var html = "";
            
            for (var i = 0; i < data.length; i++) {
                var d = new Date(parseInt(data[i].Date.substr(6)));
                var date = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
                var url = '/Bill/Update/' + data[i].IdBill + '';
                var urlShow = '/Bill/ShowBill/' + data[i].IdBill + '';
                var urlShow = '/Bill/ShowBill/' + data[i].IdBill + '';
                html += '<tr class="odd gradeX trdataDebt' + debt + '' + status + '" align="center">';
                html += '<td>' + data[i].IdBill + '</td>';
                html += '<td><a href="' + url + '">'  + data[i].NameBill + '</td>';
                html += '<td>' + data[i].NameUser + ' (' + data[i].IdUser + ')</td>';
                html += '<td>' + data[i].NameCus + '</td>';
                if (data[i].FileHD != null) {
                    html += '<td><a href=" ' + urlShow + '">' + data[i].FileHD + '</a></td>';
                }
                else {
                    html += '<td></td>';
                }
                html += '<td>' + date + '</td>';
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
$('#chknodai').click(function () {
    var classDebt = '.trdataDebt2' + $('#selectStatusOld').val();
    $(classDebt).remove();
    var classDebt = '.trdataDebt2' + $('#selectStatusNew').val();
    $(classDebt).remove();
    if ($('#chknodai').is(':checked')) {
        ajaxDebt(1, parseInt($('#selectStatusNew').val()));
        var classStatus = '.trdataDebt1' + $('#selectStatusOld').val();
        $(classStatus).remove();
        $('.trdataDebt27').remove();
    }
    else {
        var classDebt = '.trdataDebt1' + $('#selectStatusNew').val();
        $(classDebt).remove();
        if (!$('#chknongan').is(':checked')) {
            ajaxDebt(2, parseInt($('#selectStatusNew').val()));
        }
    }
})
$('#chknongan').click(function () {
    var classDebt = '.trdataDebt2' + $('#selectStatusOld').val();
    $(classDebt).remove();
    var classDebt = '.trdataDebt2' + $('#selectStatusNew').val();
    $(classDebt).remove();
    if ($('#chknongan').is(':checked')) {
        ajaxDebt(0, parseInt($('#selectStatusNew').val()));
        var classStatus = '.trdataDebt0' + $('#selectStatusOld').val();
        $(classStatus).remove();
        $('.trdataDebt27').remove();
    }
    else {
        var classDebt = '.trdataDebt0' + $('#selectStatusNew').val();
        $(classDebt).remove();
        if (!$('#chknodai').is(':checked')) {
            ajaxDebt(2, parseInt($('#selectStatusNew').val()));
        }
    }
})
$('#statusBill').change(function () {
    $('#selectStatusOld').val($('#selectStatusNew').val())
    $('#selectStatusNew').val($('#statusBill').val());
    var classDebt = '.trdataDebt2' + $('#selectStatusOld').val();
    $(classDebt).remove();
    if ($('#chknongan').is(':checked')) {
        var classDebt = '.trdataDebt0' + $('#selectStatusOld').val();
        $(classDebt).remove();
        ajaxDebt(0, $('#selectStatusNew').val());
    }
    else {
        var classDebt = '.trdataDebt0' + $('#selectStatusNew').val();
        $(classDebt).remove();
        if ($('#chknodai').is(':checked')) {
            var classDebt = '.trdataDebt1' + $('#selectStatusOld').val();
            $(classDebt).remove();
            ajaxDebt(1, $('#selectStatusNew').val());
        }
        else {
            var classDebt = '.trdataDebt1' + $('#selectStatusNew').val();
            $(classDebt).remove();
            ajaxDebt(2, $('#selectStatusNew').val());
        }
    }
    
})
$(document).ready(function () {
    ajaxDebt(2, parseInt($('#selectStatusOld').val()));
    $("#chknongan").checked(false);
    $("#chknodai").checked(false);
})