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


});

function search() {
    if ($('#AccBasicTaxCode').val().length > 8 || $('#AccBasicShortName').val().length >= 3
        || ($('#Lead_AccountName').val() != null && $('#Lead_AccountName').val() != "")) {
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
                if ($('#AccBasicTaxCode').val() == null || $('#AccBasicTaxCode').val() == "") {
                    var html = '';
                    html += '<span id="AccBasicTaxCode-error" class="help-block">' + msgRequired + '</span>';
                    if (i == 0) {
                        i++;
                        $('#AccBasicTaxCode').after(html);
                    }     
                }
                if ($('#AccBasicAddress').val() == null || $('#AccBasicAddress').val() == "") {
                    var html = '';
                    html += '<span id="AccBasicAddress-error" class="help-block">' + msgRequired + '</span>';
                    if (y == 0) {
                        y++;
                        $('#AccBasicAddress').after(html);
                    }
                }
              
            },
            success: function (label, element) {
                if ($(element).data('select2')) {
                    $(element).closest('.form-group').find(".select2-selection--single")
                        .removeClass('border-color-red');
                }
                if ($('#AccBasicTaxCode').val() != null && $('#AccBasicTaxCode').val() != "") {
                    i = 0;
                }
                if ($('#AccBasicAddress').val() != null && $('#AccBasicAddress').val() != "") { 
                    y = 0;
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
        $("#Lead_AccountName").rules("add",
            {
                required: true,
                messages: {
                    required: msgRequired,
                }
            }); 
        $("#Lead_DivisionId").rules("add",
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
        $("#Acc_Owner").rules("add",
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