var msgRequired = $("#msgRequired").val();
var urlCheckName = $("#urlCheckName").val();
var i = 0;
var y = 0;
var tbl;
$(document).ready(function () {
    //TH có lỗi xảy ra
    var error = $("#Error").val();
    if (error != null && error != "") {
        alert(error);
    }
    $(".date-picker").datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "auto",
        clearBtn: true
    });
    $("#Acc_Owner").select2({
        minimumInputLength: 1,
        ajax: {
            url: $("#urlSearchUserInSso").val(),
            dataType: 'json',
            type: "GET",
            data: function (params) {
                return {
                    keySearch: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        }
    });
    addAccounts.init();
    if ($("#AccountId").val() == 0 && ($('#Acc_Owner').val() == null || $('#Acc_Owner').val() == "")) {
        var currentuser = $('#currentuser').val();
        var option = new Option(currentuser, currentuser, true, true);
        $('#Acc_Owner').append(option).trigger('change');
    }
    if ($("#valueTextAcc").val() != "" && $("#valueTextValue").val() != "") {
        var datatext = $("#valueTextAcc").val();
        var datatextvalue = $("#valueTextValue").val();
        var option = new Option(datatext, datatextvalue, true, true);
        $('#Acc_Owner').append(option).trigger('change');
    }
    
    $(this).find('input:text').each(function () {
        $(this).val($.trim($(this).val()));
    });
    var url = $("#urlCheckCoincident").val();
    var accountId = $("#AccountId").val();
    var isEdit = false;
    var isConvert = false;
    var dataAccountId = 0;
    if (accountId != null && accountId != "" && accountId > 0)
    {
        isEdit = true;
        dataAccountId = accountId;
    }
    if ($("#boolConvert").val() == "true" || $("#boolConvert").val() == "True")
    {
        isConvert = true
    }
    tbl=  $('#Coincident_table').DataTable({
        searching: false,
        orderCellsTop: false,
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "scrollX": true,
        "bInfo": false,
        "ajax": {
            "url": url,
            data: function (d) {
                return $.extend({}, d, {
                    "AccName": htmlDecode($('#Acc_AccountName').val()),
                    "TaxCode": $('#AccBasicTaxCode').val(),
                    "ShortName": $('#AccBasicShortName').val(),
                    "isAccountId": dataAccountId,//Id Account hiện tại nếu là Edit
                    "isExport": isEdit,//kiểm tra xem là Edit hay ko 
                    "isConvert": isConvert,//kiểm tra xem có phải là từ tiềm năng chuyển thành cơ hội 
                });
            },
            type: 'POST',
            //"dataType": "json",
            //contentType: 'application/json; charset=utf-8',
           
        },
        fixedColumns: true,
        "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
        "info": true,
        "stateSave": true,
        'columnDefs': [
           
            {
                'targets': 0,
                'data': "AccountsName",
                'className': "",
                "orderable": false,
                'render': function (data, type, full, meta) {
                    var str = "";
                    str += "<div style='margin-left:15px !important;'>";
                    str = "<p>Tên khách hàng: " + htmlEncode(full.AccountsName) + "</p>";
                    str += "<p>Tên viết tắt: " + htmlEncode(full.ShortName) + "</p>";
                    str += "<p>Mã số thuế: " + htmlEncode(full.TaxCode) + "</p>";
                    str += "<p>Địa chỉ: " + htmlEncode(full.AccBasicAddress) + "</p>";
                    str += "<p>Người quản lý: " + htmlEncode(full.Owner) + "</p>";
                    str += "</div>";
                    str += "<div  style='margin-left:0px !important;margin-top:5px'>";
                    str += '<button class="btn btn-primary margin-left-5"   onclick="addOwner(' + full.Id + ', \'' + full.AccountsName + '\')"type="button">Đăng kí Owner</button>';
                    if (full.isMembers == false) {
                        str += '<button class="btn btn-primary margin-left-10"  onclick="addMembers(' + full.Id + ', \'' + full.AccountsName + '\')"type="button">Xin khai thác</button>';
                    }
                    str += "</div>";
                    return str;
                }
            }
        ]
    });
});

function SelectedTagsAccChanged() {
    var strVl = "";
    var dataTags = $('#Acc_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        //$("#data_Acc_Tags").val(dataTags);
        strVl = dataTags.join(',');
    }
    $("#data_Acc_Tags").val(strVl);
}

function search() {
    if ($('#AccBasicTaxCode').val().length > 8 || $('#AccBasicShortName').val().length >= 3
        || ($('#Acc_AccountName').val() != null && $('#Acc_AccountName').val() != "")) {
        tbl.draw();
    }
    else {
        $('#Coincident_table').DataTable().ajax.reload();
    }
}

$("#Acc_Owner").change(function () {
    $('#Acc_Owner').valid();
    var dataOwner = $("#Acc_Owner").val();
    if (dataOwner!= null){
        $("#dataAcc_Owner").val(dataOwner);
    }
});
$("#AccBasicTaxCode").change(function () {
    $('#AccBasicTaxCode').valid();
});
$("#AccBasicAddress").change(function () {
    $('#AccBasicAddress').valid();
});


$(document).on("click", "#SaveLead", function () {
    var request = $("#form-request").valid();
    if (request === true) {
        document.getElementById("DataSaveLead").value  = true;
        $("#form-request").submit();
    }
});
var addAccounts = function () {
    var handleMain = function () {
        $('#form-request').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input
            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('#form-request')).show();
                
            },
            highlight: function (element) { // hightlight error inputs                
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
               
              
            },
            success: function (label, element) {
                if ($(element).data('select2')) {
                    $(element).closest('.form-group').find(".select2-selection--single")
                        .removeClass('border-color-red');
                }
              
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                if (element.data('select2')) {
                    element.closest('div').append(error);
                    element.parent().children().children().find(".select2-selection--single").addClass('border-color-red');
                } else {
                    error.insertAfter(element.closest('.input-icon'));
                }
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
        $("#Acc_AccountName").rules("add",
            {
                required: true,
                messages: {
                    required: msgRequired,
                }
            }); 
        $("#Acc_DivisionId").rules("add",
            {
                required: true,
                messages: {
                    required: msgRequired,
                }
            }); 
       
        $("#Acc_Owner").rules("add",
            {
                required: true,
                messages: {
                    required: msgRequired,
                }
            }); 
      
        $("#AccBasicTaxCode").rules("add",
            {
                required: true,
                messages: {
                    required: msgRequired,
                }
            });
        $("#AccBasicAddress").rules("add",
            {
                required: true,
                messages: {
                    required: msgRequired,
                }
            });
       
    };
    return {
        //main function to initiate the module
        init: function () {
            handleMain();
        }
    };
}();
function addOwner(idAccount, accountsName) {

    //bootbox.confirm({
    //    title: "Thông báo",
    //    message: "Đăng ký Owner " + accountsName,
    //    buttons: {
    //        cancel: {
    //            label: '<i class="fa fa-times"></i> Hủy'
    //        },
    //        confirm: {
    //            label: '<i class="fa fa-check"></i> Đồng ý'
    //        }
    //    },
    //    callback: function (result) {
    //        if (result) {
    //            var hostAddress = $("#hostAddress").val();
    //            var linkOpp = hostAddress + "/Opportunities/Edit?accId=" + idAccount + "&ticket=true";
    //            window.location.replace(linkOpp);
    //        }
    //    }
    //});

    $("#ownerRegister").modal("toggle");
    $("#registerAccName").html(accountsName);
    $("#idAccount").val(idAccount);
}
function addMembers(idAccount, accountsName) {
    
    bootbox.confirm({
        title: "Thông báo",
        message: "Xin làm khai thác " + accountsName,
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
                var url = $("#urlAddMembers").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'idAccount': idAccount,
                        'accountsName': accountsName
                    }),
                    success: function (data) {
                        window.location.replace($("#urlHostAddressRequestTicket").val());
                    }
                });
            }
        }
    });
}

$(document).on("click", "#registerOwnerReasonSubmit", function () {
    //var reason = $("#registerOwnerReason").val();
    var reasonText = $("#registerOwnerReasonText").val();
    if (reasonText === "") {
        bootbox.alert("Nguyên nhân không được để trống!");
        return;
    }
    var url = $("#urlAddRegisterReasonToSesion").val();
    $.ajax({
        "url": url,
        method: "POST",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'reason': 0,
            'reasonText': reasonText
        }),
        success: function () {
            var idAccount = $("#idAccount").val();
            var hostAddress = $("#hostAddress").val();
            var linkOpp = hostAddress + "/Opportunities/Edit?accId=" + idAccount + "&ticket=true";
            window.location.replace(linkOpp);
        }
    });    
});