var msgRequired = $("#msgRequired").val();
$(document).ready(function () {
    $("#user_name").select2({
        minimumInputLength: 1,
        multiple: true,
        allowClear: true,
        width: '100%',
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
    
});

$("#user_name").change(function () {
    if ($("#user_name").val() != null) {
        $("#user_name").closest('.form-group').removeClass('has-error');
        $("#user_name_error").hide();
    }
});
$("#CloseModal").click(function () {
    $("#user_name").empty();
    $(".role-check").prop("checked", false);
    $('.select2_user_name').show();
    $("#IdEditModalMember").empty();
});
$(".close").click(function () {
    $("#IdEditModalMember").empty();
    $("#user_name").empty();
    $(".role-check").prop("checked", false);
    $('.select2_user_name').show();
});

function DeleteAccountUser(IdAccountUser) {
    var obj = $(this);
    bootbox.confirm({
        title: "Thông báo",
        message: "Đồng ý xóa thành viên khách hàng !",
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
                var url = $("#urlDeleteAccountUser").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'IdAccountUser': IdAccountUser
                    }),
                    success: function (data) {
                        bootbox.alert("Xóa thành viên khách hàng thành công!", function () {
                            $("#tr_" + IdAccountUser + "").remove();
                            if ($("#accUser_tbody").children().length === 0) {
                                $("#accUser_table").remove();
                            }
                            
                        });

                    }
                });
            }
        }
    });
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



function addUser() {
    var member = $("#user_name").val();
    var userId = $("#IdEditModalMember").val();
    var idAccountsUser = 0;
    if (userId != null && userId != '' && userId > 0) {
        idAccountsUser = $("#IdAccountsUser_" + userId + "").val();
    }
    if ((member == null || member == "" )&& idAccountsUser == 0) {
        $("#user_name").closest('.form-group').addClass('has-error');
        $("#user_name_error").text(msgRequired);
        $("#user_name_error").show();
    }
    else {
        var arr = [];
        var roleArr = "";
        $.each($(".role-mem"), function (index, element) {
            var code = element.children[1].value;
            var role = "";
            var roleview = "";
            var roleedit = "";
            var viewRole = $("#View_" + code + ":checked").val();
            var editRole = $("#Edit_" + code + ":checked").val();
            var nameRole = $("#Name_" + code + "").val();

            if (viewRole === "1") {
                roleview = viewRole;
                if (roleview !== "") {
                    var obj = {
                        code: nameRole,
                        role: roleview
                    };
                    arr.push(obj);
                    roleArr += "" + nameRole + ":" + roleview + "|";
                }
            }

            if (editRole === "2") {
                roleedit = editRole;
                if (roleedit !== "") {
                    var obj = {
                        code: nameRole,
                        role: roleedit
                    };
                    arr.push(obj);
                    roleArr += "" + nameRole + ":" + roleedit + "|";
                }
            }


        });
        var accId = $("#AccountId").val();
        var url = $("#urlInsertMember").val();
        var owner = $("#acc-Owner").val();
        var checkEdit = false
        if ((member == null || member == "") && idAccountsUser > 0) {
            checkEdit = true;
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                accId: accId,
                member: member,
                roleMember: arr,
                idAccountsUser: idAccountsUser,
                checkEdit: checkEdit
            },
            success: function (result) {
                $("#addMember").modal("hide");
                location.reload();
            },
            error: function () {
            }
        });

    }
   
}

function editDataModal(userId) {
    $('.select2_user_name').hide();
    $('#IdEditModalMember').val(userId);
        var permissionArr = $("#perArr_" + userId + "").val();
        if (permissionArr != "") {
            var lstPer = permissionArr.split("|");
            if (lstPer != null) {
                $.each(lstPer,
                    function (index, element) {
                        var roleCode = element.split(":")[0];
                        var role = element.split(":")[1];
                        if (role === "1") {
                            $("#View_" + roleCode + "").prop("checked", true);
                        } else if (role === "2") {
                            $("#Edit_" + roleCode + "").prop("checked", true);
                        }
                    });
            }
        }
    
}

$("#add-member").on("click", function () {
    $("#user_name").empty();
    $("#IdEditModalMember").empty();
    $(".role-check").prop("checked", false);
});

