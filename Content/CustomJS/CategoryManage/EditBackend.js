
$(document).ready(function() {
    CategoryManageEdit.init();
});

var CategoryManageEdit = function () {
    
    var notCateCode = $("#notCateCode").val();
    var notCateName = $("#notCateName").val();
    var maxlengthCateName = $("#maxlengthCateName").val();
    var maxlengthCateCode = $("#maxlengthCateCode").val();
    var handleMain = function () {
        var idCate = $('#boxInfoCate').attr('data-id');
        if (!idCate || idCate == '0') {
            $('#btn-add-new-cat').addClass('hidden');
        }
        $('#category-validate-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input

            invalidHandler: function () { //display error alert on form submit   
                $('.alert-danger', $('#category-validate-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                form.submit();
            }
        });
        $("#EditCategoryManage_CateName").rules("add", {
            required: true,
            maxlength: 200,
            messages: {
                required: notCateName,
                maxlength: maxlengthCateName
            }
        });
        $("#EditCategoryManage_CateCode").rules("add", {
            required: true,
            maxlength: 50,
            messages: {
                required: notCateCode,
                maxlength: maxlengthCateCode
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            handleMain();
        }
    };
}();