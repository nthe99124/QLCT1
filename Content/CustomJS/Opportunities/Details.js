var listTagOpp = [];
$(document).ready(function () {

    $('[data-toggle="popover"]').popover();

    var saleStageOrder = parseInt($("#saleStage-order").val());
    for (var i = 1; i < saleStageOrder; i++) {
        $("#slds-path__item_" + i + "").addClass("pass");
    }

    if ($(".progress-item-last").hasClass("pass")) {
        $(".slds-path__item").removeClass("active");
        $(".slds-path__item").addClass("pass");
    } else if ($(".progress-item-last").hasClass("fail")) {
        $(".slds-path__item").removeClass("active");
        $(".progress-item-last ").removeClass("pass");
        var preSaleStageOrder = parseInt($("#previousSaleStageOrder").val());
        for (var j = 1; j <= preSaleStageOrder; j++) {
            $("#slds-path__item_" + j + "").addClass("pass");
        }
        $(".progress-item-last ").addClass("fail");
    }

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

    $("#oppName").tooltip();

    if ($("#SalesDividingTab").length > 0) {
        ReloadSalesDividingInfor();
    }
    loadTagToOpp();
    $(document).click(function (e) {
        if (!e.target.classList.contains('is-not-close')) {
            $('.tags_container .box-add-tag').addClass('hidden');
        }
        
    });
});

$(document).on("click", ".edit-date", function () {
    var index = $(this).children()[1].value;
    $(".saleStage-input").addClass("hidden");
    $("#saleStage-input_" + index + "").removeClass("hidden");
    $("#saleStage-input_" + index + "").focus();
    $("#saleStage-date_" + index + "").addClass("hidden");
    $("#submit-date_" + index + "").removeClass("hidden");
    $("#close-date_" + index + "").removeClass("hidden");
    $(".edit-date").addClass("hidden");
});

$(".saleStage-input").on("change", function () {
    //$(this).addClass("hidden");
    //var index = $(this).parent().children()[2].value;
    //var saleStageDate = $("#saleStage-input_" + index + "").val();
    //$("#saleStage-date_" + index + "").html(saleStageDate);
    //$("#submit-date_" + index + "").addClass("hidden");

    //var url = $("#urlInsertSaleStageDate").val();
    //var oppId = $("#oppId").val();
    //var saleStageId = $("#saleStage-id_" + index + "").val();

    //$.ajax({
    //    "url": url,
    //    type: "Post",
    //    "dataType": "json",
    //    async: false,
    //    contentType: "application/json; charset=utf-8",
    //    data: {
    //        oppId: oppId,
    //        saleStageId: saleStageId,
    //        saleStageDate: data
    //    },
    //    success: function (dt) {

    //    }
    //});
});

function OverTag(e) {
    $(e).find('.icon-ac-remove-tag').removeClass('hidden');
}
function OutOverTag(e) {
    $(e).find('.icon-ac-remove-tag').addClass('hidden');
}

function addTagToOpp(e) {
    if (!!e) {
        var boxAddTag = $('.tags_container .box-add-tag');
        if (!boxAddTag.hasClass('hidden')) {
            boxAddTag.addClass('hidden');
        }
        var oppTextId = $('.tags_container .btn-add-tag').attr('data-opp-id');
        if (!!oppTextId) {
            var oppId = TryParseInt(oppTextId, 0);
            if (oppId != 0) {
                var lstTag = [];
                var listCurrenttag = $('.tags_container').attr('data-tag');
                if (!!listCurrenttag) {
                    lstTag = listCurrenttag.split(',');
                }
                var tagId = $(e).attr('data-id');
                if (!!tagId) {
                    lstTag.push(tagId);
                }
                var tagValue = lstTag.join(',');
                $('.tags_container').attr('data-tag-add', tagId);
                $('.tags_container').attr('data-tag', tagValue);
                $('.btn-add-tag').addClass('disable');
                var urlPost = $('#urlUpdateTagOpp').val();
                urlPost += `?oppId=${oppId}&tags=${tagValue}`;
                $.ajax({
                    "url": urlPost,
                    type: "Post",
                    "dataType": "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
                        $('.btn-add-tag').removeClass('disable');
                        if (res.ResultCode == 1) {
                            addTagToBox();
                        }
                    }
                });
            }
        }
    }
}

function RemoveTag(e) {
    if (!!e) {
        var objRemove = $(e);
        if (objRemove.length > 0) {
            var oppTextId = $('.tags_container .btn-add-tag').attr('data-opp-id');
            var oppId = TryParseInt(oppTextId, 0);
            var lstTag = [];
            var listCurrenttag = $('.tags_container').attr('data-tag');
            if (!!listCurrenttag) {
                lstTag = listCurrenttag.split(',');
            }
            var objTag = objRemove.parent();
            var tagId = objTag.attr('data-tag-id');
            if (!!tagId) {
                lstTag = RemoveItemInList(lstTag, tagId);
            }
            var tagValue = lstTag.join(',');
            $('.tags_container').attr('data-tag-remove', tagId);
            $('.tags_container').attr('data-tag', tagValue);
            $('.btn-add-tag').addClass('disable');
            var urlPost = $('#urlUpdateTagOpp').val();
            urlPost += `?oppId=${oppId}&tags=${tagValue}`;
            $.ajax({
                "url": urlPost,
                type: "Post",
                "dataType": "json",
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    $('.btn-add-tag').removeClass('disable');
                    if (res.ResultCode == 1) {
                        removeTagToBox();
                    }
                }
            });
        }
    }
}

function addTagToBox() {
    var boxTag = $('.tags_container');
    var tagAdd = boxTag.attr('data-tag-add');
    if (!!listTagOpp && listTagOpp.length > 0) {
        var listTagAdd = listTagOpp.filter(item => { return item.Value == tagAdd });
        if (listTagAdd.length > 0) {
            var itemTag = listTagAdd[0];
            var objTag = $(`<span class="tags" data-tag-id="${itemTag.Value}" onmouseover="OverTag(this)" onmouseout="OutOverTag(this)">#${itemTag.Text}<i class="fa fa-times icon-ac-remove-tag cursor-pointer hidden" onclick="RemoveTag(this)" aria-hidden="true"></i></span>`);
            var lengInsert = boxTag.children().length;
            boxTag.insertAtrToindex(lengInsert - 1, objTag);
            var objTag = $(`.box-list-tag .list-tag .tags[data-id="${tagAdd}"]`);
            if (objTag.length > 0) {
                objTag.addClass('disable');
                var objActive = $('<i class="fa fa-check margin-left-10 active" aria-hidden="true"></i>');
                objTag.append(objActive);
            }
        }
    }
}

function removeTagToBox() {
    var boxTag = $('.tags_container');
    var tagRemove = boxTag.attr('data-tag-remove');
    var objTag = $(`.tags_container .tags[data-tag-id="${tagRemove}"]`);
    if (objTag.length > 0) {
        objTag.remove();
    }
    var objTagInBox = $(`.box-list-tag .list-tag .tags[data-id="${tagRemove}"]`);
    if (objTagInBox.length > 0) {
        objTagInBox.removeClass('disable');
        var objActive = objTagInBox.find('.active')
        objActive.remove();;
    }
}


function loadTagToOpp() {
    $.ajax({
        "url": $('#urlGetListTagOpp').val(),
        type: "Get",
        "dataType": "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res.ResultCode == 1) {
                listTagOpp = res.Data;
                bindingListTag(res.Data);
            }
        }
    });
}
/**
 * build danh sách list tag
 * @param {any} data
 */
function bindingListTag(data) {
    var listTag = $('.tags_container .box-add-tag .list-tag');
    if (!!listTag) {
        listTag.children().remove();
    }
    if (!!data && Array.isArray(data)) {
        var currentTag = $('.tags_container').attr('data-tag');
        var listCurrenttag = [];
        if (!!currentTag) {
            listCurrenttag = currentTag.split(',');
        }
        data.forEach(item => {
            var disable = '';
            var elementActive = '';
            if (listCurrenttag.includes(item.Value)) {
                disable = 'disable';
                elementActive = '<i class="fa fa-check margin-left-10 active" aria-hidden="true"></i>';
            }
            var itemTag = $(`<span class="tags ${disable}" data-id="${item.Value}" onclick="addTagToOpp(this)">#${item.Text} ${elementActive}</span >`);
            listTag.append(itemTag);
        });
    }
}

function showTagPop() {
    var boxAddTag = $('.tags_container .box-add-tag');
    if (boxAddTag.hasClass('hidden')) {
        boxAddTag.removeClass('hidden');
    } else {
        boxAddTag.addClass('hidden');
    }
    $('#box-add-tag').unbind('click', function () {
        if (!boxAddTag.hasClass('hidden')) {
            boxAddTag.addClass('hidden');
        }
    });
}



$(".close-date").on("click", function () {
    var index = $(this).children()[1].value;
    $("#saleStage-input_" + index + "").addClass("hidden");
    $("#saleStage-date_" + index + "").removeClass("hidden");
    $("#submit-date_" + index + "").addClass("hidden");
    $("#close-date_" + index + "").addClass("hidden");
    $(".edit-date").removeClass("hidden");
});

$(".submit-date").on("click", function () {
    var index = $(this).children()[1].value;
    var saleStageDate = $("#saleStage-input_" + index + "").val();
    if (saleStageDate !== "") {

        //Check ngày sau ko đc nhỏ hơn ngày trc
        var currentDateValue = saleStageDate.split("/");
        var currentDate = new Date(+currentDateValue[2], currentDateValue[1] - 1, +currentDateValue[0]);
        for (var i = 0; i < index; i++) {
            var previousDateString = $("#saleStage-date_" + i + "").text();
            if (previousDateString !== "") {
                var previousDateValue = previousDateString.split("/");
                var previousDate = new Date(+previousDateValue[2], previousDateValue[1] - 1, +previousDateValue[0]);
                if (previousDate > currentDate) {
                    bootbox.alert({
                        title: "Thông báo",
                        message: "Ngày này phải sau ngày bước trước!"
                    });
                    return;
                }
            }
        }

        //Check ngày trước ko đc lớn hơn ngày sau
        var num = $(".saleStage-infor").length;
        for (var j = parseInt(index) + 1; j <= num; j++) {
            var nextDateString = $("#saleStage-date_" + j + "").text();
            if (nextDateString !== "") {
                var nextDateValue = nextDateString.split("/");
                var nextDate = new Date(+nextDateValue[2], nextDateValue[1] - 1, +nextDateValue[0]);
                if (nextDate < currentDate) {
                    bootbox.alert({
                        title: "Thông báo",
                        message: "Ngày này không được sau ngày bước tiếp theo!"
                    });
                    return;
                }
            }
        }

        //Check ở sale stage cuối cùng thì ngày ký ko đc lớn hơn ngày hiện tại
        if ($(".progress-item-last").hasClass("pass")) {
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại  !"
                });
                return;
            }
        }

        $("#saleStage-input_" + index + "").addClass("hidden");
        $("#saleStage-date_" + index + "").removeClass("hidden");
        $("#submit-date_" + index + "").addClass("hidden");
        $("#close-date_" + index + "").addClass("hidden");
        $(".edit-date").removeClass("hidden");
        $("#edit-date-expectedSignsDate").removeClass("hidden");
        $("#saleStage-date_" + index + "").html(saleStageDate);
        $("#submit-date_" + index + "").addClass("hidden");

        var url = $("#urlInsertSaleStageDate").val();
        var oppId = parseInt($("#oppId").val());
        var saleStageId = parseInt($("#saleStage-id_" + index + "").val());


        $.ajax({
            "url": url,
            method: "POST",
            //dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'oppId': oppId,
                'saleStageId': saleStageId,
                'saleStageDate': saleStageDate
            }),
            success: function (dt) {

            }
        });
    }
});

$(".saleStage-cf").on("click", function () {
    var obj = $(this);
    var oppId = parseInt($("#oppId").val());
    var saleStageName = obj.parent().children()[2].value;
    var signedDate = getSignedDate(oppId);
    var saleStageId = parseInt(obj.parent().children()[1].value);
    if (signedDate === "") {
        $("#signedDate-hidden").click();
        $("#nextSaleStage").val(saleStageId);
    } else {
        bootbox.confirm({
            title: "Thông báo",
            message: "Đồng ý chuyển trạng thái cơ hội đến bước <b> " + saleStageName + " </b>!",
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
                    var url = $("#urlUpdateSaleStage").val();
                    $.ajax({
                        "url": url,
                        method: "POST",
                        dataType: "json",
                        async: false,
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            'oppId': oppId,
                            'saleStageId': saleStageId
                        }),
                        success: function (data) {
                            $(".slds-path__item").removeClass("pass");
                            $(".slds-path__item").removeClass("active");
                            $(".progress-item-last ").removeClass("fail");
                            var saleStageOrder = parseInt(data);
                            $("#slds-path__item_" + saleStageOrder + "").addClass("active");
                            for (var i = 1; i < saleStageOrder; i++) {
                                $("#slds-path__item_" + i + "").addClass("pass");
                            }

                            $(".saleStage-finish").html("Kết thúc");
                            $("#lastsaleStage-infor").html("Ngày ký hợp đồng");
                            var index = $(".saleStage-infor").length - 1;
                            var contractSigningDate = $("#contractSigningDate").val();
                            $("#saleStage-date_" + index + "").html(contractSigningDate);

                            //Reload lại thông tin nhận doanh số khi đổi trạng thái
                            ReloadSalesDividingInfor();
                        }
                    });
                }
            }
        });
    }
});

$(".saleStage-finish").on("click", function () {
    $("#saleStage-hidden").click();
    var currEndSS = $("#saleStage-code option:selected").val();
    $("#modal_" + currEndSS + "").removeClass("hidden");
});

$("#saleStage-code").on("change", function () {
    $(".endPhase-date").addClass("hidden");
    if ($("#saleStage-code option:selected").val() !== "BidOpportunitiesPhase_6"
        && $("#saleStage-code option:selected").val() !== "NoBidOpportunitiesPhase_7") {
        $("#saleStage-reason").removeClass("hidden");
    } else {
        $("#saleStage-reason").addClass("hidden");
    }
    var currEndSS = $("#saleStage-code option:selected").val();
    $("#modal_" + currEndSS + "").removeClass("hidden");
});

$("#changeStatus").on("click", function () {
    var saleStageCode = $("#saleStage-code option:selected").val();
    var saleStageReason = $("#saleStage-text").val();
    var saleStageName = $("#saleStage-code option:selected").text();
    var oppId = parseInt($("#oppId").val());
    var url = $("#urlUpdateOppStatus").val();
    var saleStageDate = $("#modaldate_" + saleStageCode + "").val();
    var saleStageTitle = $("#modallabel_" + saleStageCode + "").text();

    var previousDay = $("#saleStage-date_3").html();
    if (saleStageDate === "") {
        bootbox.alert({
            title: "Thông báo",
            message: "" + saleStageTitle + " không được để trống!"
        });
        return;
    }
    else if ($("#saleStage-text").is(':visible') && $("#saleStage-text").val() === "") {
        bootbox.alert({
            title: "Thông báo",
            message: "Nguyên nhân không được để trống!"
        });
        return;
    }
    else if ((saleStageCode === "BidOpportunitiesPhase_6" || saleStageCode === "NoBidOpportunitiesPhase_7") && saleStageDate !== "") {
        var parts = saleStageDate.split('/');
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        var currentDate = new Date();
        var myPreviousDate = "";
        if (previousDay !== "" && previousDay !== undefined) {
            var previous = previousDay.trim().split('/');
            var myPreviousDate = new Date(previous[2], previous[1] - 1, previous[0]);
        }
        if (mydate > currentDate) {
            bootbox.alert({
                title: "Thông báo",
                message: "Ngày kí không được lớn hơn ngày hiện tại  !"
            });
            return;
        } else if (myPreviousDate !== "" && mydate < myPreviousDate) {
            bootbox.alert({
                title: "Thông báo",
                message: "Ngày này phải sau ngày bước trước!"
            });
            return;
        }
    }
    else if (previousDay !== "" && previousDay !== undefined && saleStageDate !== "") {
        var parts = saleStageDate.split('/');
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        var previous = previousDay.trim().split('/');
        var myPreviousDate = new Date(previous[2], previous[1] - 1, previous[0]);
        if (mydate < myPreviousDate) {
            bootbox.alert({
                title: "Thông báo",
                message: "Ngày này phải sau ngày bước trước!"
            });
            return;
        }
    }


    //var i = $(".saleStage-infor").length - 1;
    $.ajax({
        "url": url,
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'oppId': oppId,
            'saleStageCode': saleStageCode,
            'saleStageReason': saleStageReason,
            'saleStageDate': saleStageDate
        }),
        success: function (data) {
            $(".saleStage-finish").html(saleStageName);
            $("#lastsaleStage-infor").html(saleStageTitle);
            $(".lastsaleStage-date").html(saleStageDate);
            if ($("#saleStage-code option:selected").val() === "BidOpportunitiesPhase_6" ||
                $("#saleStage-code option:selected").val() === "NoBidOpportunitiesPhase_7") {
                $(".slds-path__item").removeClass("active");
                $(".slds-path__item").removeClass("fail");
                $(".slds-path__item").addClass("pass");
            } else {
                $(".slds-path__item").removeClass("active");
                $(".slds-path__item").removeClass("pass");
                var saleStageOrder = parseInt(data);
                for (var i = 1; i <= saleStageOrder; i++) {
                    $("#slds-path__item_" + i + "").addClass("pass");
                }
                $(".progress-item-last ").removeClass("pass");
                $(".progress-item-last ").addClass("fail");
            }
            $("#myModal").modal("hide");

            //Reload lại thông tin nhận doanh số khi đổi trạng thái
            ReloadSalesDividingInfor();
        }
    });
});

function addUser() {
    var arr = [];
    var roleArr = "";
    $.each($(".role-mem"), function (index, element) {
        var code = element.children[1].value;
        var role = "";
        var viewRole = $("#View_" + code + ":checked").val();
        var editRole = $("#Edit_" + code + ":checked").val();
        var nameRole = $("#Name_" + code + "").val();
        if (editRole === "2") {
            role = editRole;
        } else if (viewRole === "1" && editRole !== "2") {
            role = viewRole;
        }
        if (role !== "") {
            var obj = {
                code: nameRole,
                role: role
            };
            arr.push(obj);
            roleArr += "" + nameRole + ":" + role + "|";
        }
    });
    var oppId = $("#oppId").val();
    var url = $("#urlInsertMember").val();
    var member = $("#user_name").val();
    var owner = $("#opp-Owner").val();
    if (member.includes(owner)) {
        bootbox.alert({
            title: "Thông báo",
            message: "Không thể thêm người quản lý cơ hội vào khai thác!"
        });
    } else {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                oppId: oppId,
                member: member,
                roleMember: arr
            },
            success: function (result) {
                $("#addMember").modal("hide");
                if (result !== null) {
                    $.each(result, function (index, element) {
                        var statusDetails = "";
                        if (element.Status === false) {
                            statusDetails = "Bỏ duyệt";
                        }
                        else if (element.Status === true) {
                            statusDetails = "Đã duyệt";
                        }
                        if ($("#tr_" + element.UserId + "").is(":visible")) {
                            $("#tr_" + element.UserId + "").remove();
                        }
                        var str = "";
                        str += "<tr id='tr_" + element.UserId + "'>";
                        str += "<td>" + element.UserName + "";
                        str += "<input type='hidden' id='perArr_" + element.UserId + "' value='" + roleArr + "'/> </td>";
                        str += "<td>" + element.Permision.replace("Contact", "Liên hệ") + "</td>";
                        str += "<td class='text-center'>" + statusDetails + "</td>";
                        str += "<td class='text-center'><div class='btn-group role-btn' role='group'>";
                        str += "<button id='btnGroupDrop1' type='button' class='btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                        str += "<i class='fa fa-caret-down' aria-hidden='true'></i></button>";
                        str += "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='btnGroupDrop1'> <li>";
                        str += "<a onclick='editDataModal(" + element.UserId + ")' title='Sửa' class='padding-right-5' da='' data-toggle='modal' data-target='#addMember'>";
                        str += "<i class='fa fa-pencil padding-left-5 padding-right-10'></i>Cập nhật</a> <br>";
                        str += "<a class='' onclick='deleteRoleMember(" + element.UserId + ")' title='Xóa'>";
                        str += "<i class='fa fa-trash padding-left-5 padding-right-10'></i>Xóa";
                        str += "</a></div></li></div></td></tr>";
                        if ($("#oppUser_tbody").children().children().hasClass('nodata')) {
                            $("#oppUser_tbody").empty();
                        }
                        $("#oppUser_tbody").append(str);
                    });
                }
            },
            error: function () {
            }
        });
    }
}

function deleteRoleMember(userId) {
    var oppId = $("#oppId").val();
    bootbox.confirm({
        title: "Thông báo",
        message: "Đồng ý xóa người khai thác!",
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
                var url = $("#urlDeleteOppUser").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'oppId': oppId,
                        'userId': userId
                    }),
                    success: function (data) {
                        $("#tr_" + userId + "").remove();
                        if ($("#oppUser_tbody").children().length === 0) {
                            $("#oppUser_tbody").empty();
                            $("#oppUser_tbody").append("<tr><td class='nodata' colspan='4'>Không có dữ liệu</td></tr>");
                        }
                    }
                });
            }
        }
    });
}

function editDataModal(userId) {
    var userName = $("#tr_" + userId + "").children()[0].textContent.trim();
    if (userName !== "") {
        $("#user_name").empty();
        $(".role-check").prop("checked", false);
        var $newOption = $("<option></option>").val(userName).text(userName);
        $("#user_name").append($newOption).val(userName).trigger("change");
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
}

$("#add-member").on("click", function () {
    $("#user_name").empty();
    $(".role-check").prop("checked", false);
});

$(".slds-path__item").hover(function () {
    $(this).find(".tooltiptext").css("visibility", "visible");
}, function () {
    $(this).find(".tooltiptext").css("visibility", "hidden");

});

function getSignedDate(oppId) {
    var url = $("#urlGetContractSigningDate").val();
    var signedDate = "";
    $.ajax({
        "url": url,
        type: "GET",
        "dataType": "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: {
            'oppId': oppId
        },
        success: function (data) {
            signedDate = data;
        }
    });

    return signedDate;
}

$("#changeSignedDate").on("click", function () {
    var url = $("#urlInsertSaleStageDate").val();
    var signedSaleStageId = $("#signedSaleStageId").val();
    var oppId = parseInt($("#oppId").val());
    var signedDateValue = $("#signedDateValue").val();
    var currentDateValue = signedDateValue.split("/");
    var currentDate = new Date(+currentDateValue[2], currentDateValue[1] - 1, +currentDateValue[0]);
    var previousDate = $("#saleStage-date_3").text().trim();
    var previousDateSplit = previousDate.split("/");
    var previousDateValue = new Date(+previousDateSplit[2], previousDateSplit[1] - 1, +previousDateSplit[0]);
    if (currentDate < previousDateValue) {
        bootbox.alert({
            title: "Thông báo",
            message: "Ngày ký hợp đồng phải sau ngày bước trước!"
        });
        return;
    }
    $.ajax({
        "url": url,
        method: "POST",
        //dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'oppId': oppId,
            'saleStageId': signedSaleStageId,
            'saleStageDate': signedDateValue
        }),
        success: function (dt) {
            var urlUpdateSaleStage = $("#urlUpdateSaleStage").val();
            var saleStageId = $("#nextSaleStage").val();
            $.ajax({
                "url": urlUpdateSaleStage,
                method: "POST",
                dataType: "json",
                async: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    'oppId': oppId,
                    'saleStageId': saleStageId
                }),
                success: function (data) {
                    $(".slds-path__item").removeClass("pass");
                    $(".slds-path__item").removeClass("active");
                    $(".progress-item-last ").removeClass("fail");
                    var saleStageOrder = parseInt(data);
                    $("#slds-path__item_" + saleStageOrder + "").addClass("active");
                    for (var i = 1; i < saleStageOrder; i++) {
                        $("#slds-path__item_" + i + "").addClass("pass");
                    }
                    $("#signedDate").modal("hide");
                    $(".lastsaleStage-date").html(signedDateValue);
                    $(".saleStage-finish").html("Kết thúc");
                    $("#lastsaleStage-infor").html("Ngày ký hợp đồng");
                }
            });
        }
    });
});



// #region tab chia doanh số


function ReloadSalesDividingInfor() {
    var url = $("#urlGetSalesDividingInf").val();

    $.ajax({
        method: "GET",
        url: url,
        success: function (data) {
            if (data != null) {

                $("#salesdividing-sales-total").text(ReFormatInputNumber(data.Base.SaleTotal));
                $("#salesdividing-sales-hw").text(ReFormatInputNumber(data.Base.SaleHw));
                $("#salesdividing-sales-sw").text(ReFormatInputNumber(data.Base.SaleSw));
                $("#salesdividing-sales-srv").text(ReFormatInputNumber(data.Base.SaleSrv));

                $("#salesdividing-gp-total").text(ReFormatInputNumber(data.Base.GpTotal));
                $("#salesdividing-gp-hw").text(ReFormatInputNumber(data.Base.GpHw));
                $("#salesdividing-gp-sw").text(ReFormatInputNumber(data.Base.GpSw));
                $("#salesdividing-gp-srv").text(ReFormatInputNumber(data.Base.GpSrv));

                if (data.HavePermission) {
                    //đã ký
                    $(".hide-notsinged").show();
                    $(".show-notsinged").hide();
                } else {
                    //chưa ký
                    $(".hide-notsinged").hide();
                    $(".show-notsinged").show();
                }

                var divname = data.DivisionName;
                if (divname == undefined || divname == "") {
                    divname = "N/A";
                }
                $("#salesdividing-div").text(divname);

                var SignDate = data.SignDate;
                if (SignDate == undefined || SignDate == "") {
                    SignDate = "N/A";
                }
                $("#salesdividing-signdate").text(SignDate);

                //salesdividing-crnt-stagename
                var stagename = data.CurrentStageName;
                if (stagename == undefined || stagename == "") {
                    stagename = "N/A";
                }
                $("#salesdividing-crnt-stagename").text(stagename);


                //select đơn vị
                //salesdividing-div

                $("#salesdividing-sales-total-ip").val(ReFormatInputNumber(data.Base.SaleTotal));
                $("#salesdividing-sales-hw-ip").val(ReFormatInputNumber(data.Base.SaleHw));
                $("#salesdividing-sales-sw-ip").val(ReFormatInputNumber(data.Base.SaleSw));
                $("#salesdividing-sales-srv-ip").val(ReFormatInputNumber(data.Base.SaleSrv));

                $("#salesdividing-gp-total-ip").val(ReFormatInputNumber(data.Base.GpTotal));
                $("#salesdividing-gp-hw-ip").val(ReFormatInputNumber(data.Base.GpHw));
                $("#salesdividing-gp-sw-ip").val(ReFormatInputNumber(data.Base.GpSw));
                $("#salesdividing-gp-srv-ip").val(ReFormatInputNumber(data.Base.GpSrv));

                $("#salesdividing-div-ip").val(data.Base.DivisionId);

            } else {
                //clear
                $("#SalesDividingTab input").val("");
                $("#SalesDividingTab span").text("");
            }


        },
        error: function (e) {
            console.log("Có lỗi xảy ra khi load thông tin chia doanh số:", e);
            //bootbox.alert("Có lỗi xảy ra khi load thông tin chia doanh số, vui lòng thử lại", function () {

            //    //location.href = location.href;
            //})
        }
    });
}


function SaveSalesDividingInfor() {
    var url = $("#urlSaveSalesDividingInf").val();

    var dt = {};

    dt.DivisionId = $("#salesdividing-div-ip").val();
    dt.OppId = $("#oppId").val();

    dt.SaleHw = replaceAll(",", "", $("#salesdividing-sales-hw-ip").val() + "").trim();;
    dt.SaleSw = replaceAll(",", "", $("#salesdividing-sales-sw-ip").val() + "").trim();;
    dt.SaleSrv = replaceAll(",", "", $("#salesdividing-sales-srv-ip").val() + "").trim();;

    dt.GpHw = replaceAll(",", "", $("#salesdividing-gp-hw-ip").val() + "").trim();;
    dt.GpSw = replaceAll(",", "", $("#salesdividing-gp-sw-ip").val() + "").trim();;
    dt.GpSrv = replaceAll(",", "", $("#salesdividing-gp-srv-ip").val() + "").trim();;

    $.ajax({
        method: "POST",
        url: url,
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(dt),
        success: function (data) {
            if (data.ResultCode == 1) {
                //không cần thông báo gì cả, sau có thể  thêm notifi.js nếu cần

            } else {
                //clear
                bootbox.alert("Có lỗi xảy ra khi tạo thông tin chia doanh số, vui lòng tải lại trang và thử lại", function () {
                    //location.href = location.href;
                });

            }
        },
        error: function (e) {
            bootbox.alert("Có lỗi xảy ra khi tạo thông tin chia doanh số, vui lòng tải lại trang và thử lại", function () {
                //location.href = location.href;
            });
        }
    });
}


// #region Action button

function StartEditSalesDividingTab() {
    //SalesDividing-btn-edit
    //SalesDividing-btn-save
    //SalesDividing-btn-cancel
    ChangeSalesDividingEditMode(1);

}

var isSavingSale = 0;
//SaveSalesDividingTab
function SaveSalesDividingTab() {
    if (CheckSelectDiv()) {
        if (isSavingSale == 0) {
            isSavingSale = 1;
            //do save job

            try {
                ChangeSalesDividingEditMode(0);

                SaveSalesDividingInfor();
            } catch (e) {
                console.log(e);
            }

            isSavingSale = 0;
            ReloadSalesDividingInfor();
        }

    }
}


//CancelEditSalesDividingTab
function CancelEditSalesDividingTab() {
    if (isSavingSale == 0) {
        ChangeSalesDividingEditMode(0);
        //reload 
        ReloadSalesDividingInfor();
    }
}

//#endregion


function ChangeSalesDividingEditMode(stt) {
    if (stt == 1) {
        //hiện nút
        $("#SalesDividing-btn-edit").hide();
        $("#SalesDividing-btn-save").show();
        $("#SalesDividing-btn-cancel").show();

        //hiện ô edit
        $("#SalesDividingTab span").addClass("hidden");
        $("#SalesDividingTab input").removeClass("hidden");
        $("#SalesDividingTab #div-select-wraper").removeClass("hidden");
    } else {

        //ẩn nút
        $("#SalesDividing-btn-edit").show();
        $("#SalesDividing-btn-save").hide();
        $("#SalesDividing-btn-cancel").hide();

        //ẩn ô edit
        $("#SalesDividingTab input").addClass("hidden");
        $("#SalesDividingTab #div-select-wraper").addClass("hidden");
        $("#SalesDividingTab span").removeClass("hidden");
    }
}

function RecalculateTotalSalesDividing(type) {
    if (type == undefined || type == '') {
        return;
    }

    //TryParseInt(str, defaultValue)
    var hwstr = replaceAll(",", "", $("#salesdividing-" + type + "-hw-ip").val() + "").trim();
    var swstr = replaceAll(",", "", $("#salesdividing-" + type + "-sw-ip").val() + "").trim();
    var srvstr = replaceAll(",", "", $("#salesdividing-" + type + "-srv-ip").val() + "").trim();

    var hwvl = TryParseInt(hwstr, 0);
    var swvl = TryParseInt(swstr, 0);
    var srv = TryParseInt(srvstr, 0);
    var total = hwvl + swvl + srv;

    $("#salesdividing-" + type + "-total-ip").val(ReFormatInputNumber(total));
    $("#salesdividing-" + type + "-hw-ip").val(ReFormatInputNumber(hwvl));
    $("#salesdividing-" + type + "-sw-ip").val(ReFormatInputNumber(swvl));
    $("#salesdividing-" + type + "-srv-ip").val(ReFormatInputNumber(srv));
}

function OnkeypressOppSalesDividing(event) {
    console.log(event.charCode);
    return ((event.charCode < 31 || (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 45));
}

function CheckSelectDiv() {
    var rs = true;

    var div = $("#salesdividing-div-ip").val();
    if (div == null || div == "") {
        rs = false;
        $("#valid-selectdiv").show();
    } else {
        $("#valid-selectdiv").hide();
    }

    return rs;
}

//#endregion

