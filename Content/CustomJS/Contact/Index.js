$(document).ready(function () {
    if ($(".contact-tr").length > 0) {
        var table = $('#contact-tbl').DataTable({
            paging: true,
            sort: false,
            searching: true,
            orderCellsTop: false,
            fixedHeader: false,
            fixedFooter: false,
            "bInfo": false,
            "bLengthChange": false,
            scrollCollapse: false
        });

        $('#contact-tbl thead tr').clone(true).appendTo('#contact-tbl thead');
        $('#contact-tbl thead tr:eq(1) th').each(function (i) {
            var title = $(this).text();
            $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

            $("#contact-tbl thead tr:eq(1) > th:last-child()").html("");

            $('input', this).on('keyup change', function () {
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        });

        $("#contact-tbl_filter").addClass("hidden");
    }
       
});

$("#currContact-tab").on("click", function () {
    $("#typeAdd").val(true);
});

$("#newContact-tab").on("click", function () {
    $("#typeAdd").val(false);
});

$("#checkboxAll").on("click", function () {
    if ($("#checkboxAll").prop("checked")) {
        $(".chekboxContact").prop("checked", true);
    } else {
        $(".chekboxContact").prop("checked", false);
    }
});

function addContact() {
    var typeAdd = $("#typeAdd").val();
    var url;
    var objectId = $("#objectId").val();
    var module = $("#module").val();
    var userId = $("#userId").val();
    var permission = $("#permission").val();
    var fullPer = $("#fullPer").val();
    var model;
    if (typeAdd === "false") {
        url = $("#urlInsertNewContact").val();
        var fullName = $("#contact-name").val();
        var company = $("#contact-company").val();
        var phoneNumber = $("#contact-phone").val();
        var email = $("#contact-email").val();
        var address = $("#contact-address").val();
        var description = $("#contact-description").val();

        model = {
            FullName: fullName,
            Company: company,
            PhoneNumber: phoneNumber,
            Email: email,
            Address: address,
            Description: description
        };

        $.ajax({
            "url": url,
            method: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'model': model,
                'objectId': objectId,
                'module': module
            }),
            success: function (data) {
            }
        });
    }
    else if (typeAdd === "true") {
        url = $("#urlInsertMultiContactObject").val();
        var lstContactId = "";
        var index = $(".chekboxContact").length;
        for (var i = 0; i < index; i++) {
            if ($("#chekboxContact_" + i + "").prop("checked")) {
                lstContactId += "" + $("#chekboxContact_" + i + "").val() + ";";
            }
        }

        model = {
            LstContactId: lstContactId,
            ObjectId: objectId,
            Module: module
        };

        $.ajax({
            "url": url,
            method: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'model': model
            }),
            success: function (data) {
                //$("#addContact").modal("hide");
                //refreshContact(objectId, module, userId, permission);
            }
        });
    }
    refreshContact(objectId, module, userId, permission,fullPer);
}

function deleteContact(contactId) {
    bootbox.confirm({
        title: "Thông báo",
        message: "Xác nhận xóa liên hệ này",
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
                var url = $("#urlDeleteContact").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'contactId': contactId
                    }),
                    success: function (data) {
                        if (data === 1) {
                            bootbox.alert({
                                title: "Thông báo",
                                message: "Xóa liên hệ thành công!"
                            });
                            $("#contact-tr_" + contactId + "").remove();
                            if ($(".contact-tr").length === 0) {
                                $("#contact-tbody").empty();
                                $("#contact-tbody").append("<tr><td class='nodata' colspan='6'>Không có dữ liệu</td></tr>");
                            }
                        }
                    }
                });
            }
        }
    });
}

function updateContact(contactId) {
    $("#updateContact-modal").modal();
    var index = $("#contact-tr_" + contactId + "").find(".checkboxIndex").val();
    var name = $("#contact-tr_" + contactId + "").children()[1].textContent.trim();
    var company = $("#contact-tr_" + contactId + "").children()[2].textContent.trim();
    var phone = $("#contact-tr_" + contactId + "").children()[3].textContent.trim();
    var email = $("#contact-tr_" + contactId + "").children()[4].textContent.trim();
    var address = $("#contact-tr_" + contactId + "").children()[5].textContent.trim();
    var description = $("#contact-tr_" + contactId + "").children()[6].textContent.trim();

    $("#updateContact-Id").val(contactId); 
    $("#checkboxIndexModal").val(index);
    $("#updateContact-Name").val(name);
    $("#updateContact-Company").val(company);
    $("#updateContact-PhoneNumber").val(phone);
    $("#updateContact-Email").val(email);
    $("#updateContact-Address").val(address);
    $("#updateContact-Description").val(description);
}

$("#updateContact-Btn").on("click", function () {
    var objectId = $("#objectId").val();
    var module = $("#module").val();
    var url = $("#urlInsertNewContact").val();
    var name = $("#updateContact-Name").val();
    var company = $("#updateContact-Company").val();
    var phone = $("#updateContact-PhoneNumber").val();
    var email = $("#updateContact-Email").val();
    var contactId = $("#updateContact-Id").val();
    var address = $("#updateContact-Address").val();
    var description = $("#updateContact-Description").val();
    var index = $("#checkboxIndexModal").val();
    var model = {
        Id: contactId,
        FullName: name,
        Company: company,
        PhoneNumber: phone,
        Email: email,
        Address: address,
        Description: description
    };

    $.ajax({
        "url": url,
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'model': model,
            'objectId': objectId,
            'module': module
        }),
        success: function (data) {
            $("#updateContact-modal").modal("hide");
            $("#contact-tr_" + contactId + "").empty();
            var str = "";
            str += "<td class='text-center'>";
            if ($("#contact-tr_1").find(".chekboxContact_checked").length > 0) {
                str += "<input type='checkbox' class='chekboxContact_checked' disabled='disabled' checked='checked' value='" + contactId + "'> </td>";
            } else {
                str += "<input type='checkbox' class='chekboxContact' id='chekboxContact_" + index + "' value='" + contactId + "'>";
                str += "<input type='hidden' class='checkboxIndex' value='@i'/> </td>";
            }
            str += "<td>" + name + "</td>";
            str += "<td> " + company + "</td>";
            str += "<td> " + phone + "</td>";
            str += "<td> " + email + "</td>";
            str += "<td> " + address + "</td>";
            str += "<td> " + description + "</td>";
            str += "<td class=' text-center'>";
            str += "<div class='btn-group' role='group'>";
            str += "<button id='btnGroupDrop1' type='button' class='btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
            str += "<i class='fa fa-caret-down' aria-hidden='true'></i> </button>";
            str += "<div class='dropdown-menu dropdown-menu-left' aria-labelledby='btnGroupDrop1'>";
            str += "<a onclick='updateContact(" + contactId + ")' title='Sửa' class='padding-right-5'>";
            str += "<i class='fa fa-pencil padding-left-5 padding-right-10'></i>Cập nhật</a>";
            str += "<br><a class='' onclick='deleteContact(" + contactId + ")' title='Xóa'>";
            str += "<i class='fa fa-trash padding-left-5 padding-right-10'></i>Xóa</a></div>";
            str += "</div><input type='hidden' class='opp-redirect-id' value='33396'></td>";
            $("#contact-tr_" + contactId + "").append(str);
        }
    });
});

function deleteContactObject(contactId) {
    bootbox.confirm({
        title: "Thông báo",
        message: "Xác nhận xóa liên hệ này",
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
                var url = $("#urlDeleteContactObject").val();
                var objectId = $("#objectId").val();
                var userId = $("#userId").val();
                var module = $("#module").val();
                var permission = $("#permission").val();
                var fullPer = $("#fullPer").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'contactId': contactId,
                        'objectId': parseInt(objectId)
                    }),
                    success: function (data) {
                        if (data === 1) {
                            bootbox.alert({
                                title: "Thông báo",
                                message: "Xóa liên hệ thành công!"
                            });
                            refreshContact(objectId, module, userId, permission, fullPer);
                        }
                    }
                });
            }
        }
    });
}

function refreshContact(objectId, module, userId, permission, fullPer) {
    $(".modal-backdrop").remove();
    var url = $("#urlGetContactObject").val();
    $("#contact").empty();
    $.ajax({
        "url": url,
        method: "POST",
        dataType: "html",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'objectId': parseInt(objectId),
            'module': module,
            'userId': userId,
            'permission': permission,
            'fullPer': fullPer
        }),
        success: function (data) {            
            if (data !== "") {
                $("#contact").append(data);
            }
        }
    });
}   