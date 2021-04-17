var listTagAcc = [];
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

    ///Convert số show lên màn hình top
    /// số liệu màn hình Dashboard
    document.getElementById("totalOpportunityWithAccounts").textContent = 0;
    document.getElementById("totalOpportunityWithAccountsNoSignAndSign").textContent = 0;
    document.getElementById("totalOpportunityWithAccountsSign").textContent = 0;
    if ($("#OpportunityWithAccounts").val() != null && $("#OpportunityWithAccounts").val() != "") {
        document.getElementById("totalOpportunityWithAccounts").textContent = $("#OpportunityWithAccounts").val();
    }

    if ($("#OpportunityWithAccountsNoSignAndSign").val() != null && $("#OpportunityWithAccountsNoSignAndSign").val() != "" && $("#OpportunityWithAccountsNoSignAndSign").val() > 0) {
        var number = abbrNum($("#OpportunityWithAccountsNoSignAndSign").val(), 2);
        document.getElementById("totalOpportunityWithAccountsNoSignAndSign").textContent = number;
    }
    else {
        document.getElementById("totalOpportunityWithAccountsNoSignAndSign").textContent = 0;

    }
    if ($("#OpportunityWithAccountsSign").val() != null && $("#OpportunityWithAccountsSign").val() != "" && $("#OpportunityWithAccountsSign").val() > 0) {
        var number = abbrNum($("#OpportunityWithAccountsSign").val(), 2);
        document.getElementById("totalOpportunityWithAccountsSign").textContent = number;
    }
    else {
        document.getElementById("totalOpportunityWithAccountsSign").textContent = 0;
    }
    ///convert số trả về số cách nhau bằng dấu , dấu chấm
    ///Màn hình thống kê
    if ($('#IdEditAccReport').val() == "True" || $('#IdCheckRole').val() == "True") {
        if ($("#OpportunityWithAccountsNoSignAndSignAccReport").val() != null && $("#OpportunityWithAccountsNoSignAndSignAccReport").val() != "" && $("#OpportunityWithAccountsNoSignAndSignAccReport").val() > 0) {
            var number = formatNumber($("#OpportunityWithAccountsNoSignAndSignAccReport").val());
            document.getElementById("dataiReport").textContent = number;
        }
        else {
            document.getElementById("dataiReport").textContent = 0;

        }
        if ($("#OpportunityWithAccountsSignAccReport").val() != null && $("#OpportunityWithAccountsSignAccReport").val() != "" && $("#OpportunityWithAccountsSignAccReport").val() > 0) {
            var number = formatNumber($("#OpportunityWithAccountsSignAccReport").val());
            document.getElementById("datayReport").textContent = number;
        }
        else {
            document.getElementById("datayReport").textContent = 0;
        }
    }

    OpportunityWithAccountsDetail();
    loadTagToAcc();
    $(document).click(function (e) {
        if (!e.target.classList.contains('is-not-close')) {
            $('.tags_container .box-add-tag').addClass('hidden');
        }

    });
});

function OverTag(e) {
    $(e).find('.icon-ac-remove-tag').removeClass('hidden');
}
function OutOverTag(e) {
    $(e).find('.icon-ac-remove-tag').addClass('hidden');
}

function addTagToAcc(e) {
    if (!!e) {
        var boxAddTag = $('.tags_container .box-add-tag');
        if (!boxAddTag.hasClass('hidden')) {
            boxAddTag.addClass('hidden');
        }
        var accTextId = $('.tags_container .btn-add-tag').attr('data-acc-id');
        if (!!accTextId) {
            var accId = TryParseInt(accTextId, 0);
            if (accId != 0) {
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
                var urlPost = $('#urlUpdateTagAcc').val();
                urlPost += `?accId=${accId}&tags=${tagValue}`;
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
            var accTextId = $('.tags_container .btn-add-tag').attr('data-acc-id');
            var accId = TryParseInt(accTextId, 0);
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
            var urlPost = $('#urlUpdateTagAcc').val();
            urlPost += `?accId=${accId}&tags=${tagValue}`;
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
    if (!!listTagAcc && listTagAcc.length > 0) {
        var listTagAdd = listTagAcc.filter(item => { return item.Value == tagAdd });
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

function loadTagToAcc() {
    $.ajax({
        "url": $('#urlGetListTagAcc').val(),
        type: "Get",
        "dataType": "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res.ResultCode == 1) {
                listTagAcc = res.Data;
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
            var itemTag = $(`<span class="tags ${disable}" data-id="${item.Value}" onclick="addTagToAcc(this)">#${item.Text} ${elementActive}</span >`);
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

//Xóa khách hàng này
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


///Thêm ,sửa, xóa thành viên khai thác
function addUser() {
    var member = $("#user_name").val();
    var userId = $("#IdEditModalMember").val();
    var idAccountsUser = 0;
    if (userId != null && userId != '' && userId > 0) {
        idAccountsUser = $("#IdAccountsUser_" + userId + "").val();
    }
    if ((member == null || member == "") && idAccountsUser == 0) {
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
                var hostAddress = $("#urlHostAddress").val();
                var idAccount = $("#idAccount").val();
                var linkDetails = hostAddress + idAccount + "&boolEditAccountUser=true";
                window.location.replace(linkDetails);
            },
            error: function () {
            }
        });

    }

}
function editDataModal(userId) {
    //$('.select2_user_name').hide();
    $('#IdEditModalMember').val(userId);
    var permissionArr = $("#perArr_" + userId + "").val();
    $('#user_name').val(null).trigger('change');
    if (permissionArr != "") {
        var userName = $("#IdAccountsUserName_" + userId + "").val().trim();
        var $newOption = $("<option></option>").val(userName).text(userName);
        $("#user_name").append($newOption).val(userName).trigger("change");
        $("#user_name").prop('disabled', true);
        $(".select2-search--inline").hide();
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
    $("#user_name").prop("disabled", false);
    $(".select2-search--inline").show();
    $(".role-check").prop("checked", false);
});
$("#user_name").change(function () {
    if ($("#user_name").val() != null) {
        $("#user_name").closest('.form-group').removeClass('has-error');
        $("#user_name_error").hide();
    }
});
$("#CloseModal1").click(function () {
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

                        setTimeout(function () {
                            bootbox.alert("Xóa thành viên khách hàng thành công!", function () {
                                $("#tr_" + IdAccountUser + "").remove();
                                if ($("#accUser_tbody").children().length === 0) {
                                    $("#accUser_table").remove();
                                }

                            });
                        }, 500);

                    }
                });
            }
        }
    });
}


///Vùng convert số show lên giao diện
function abbrNum(number, decPlaces) {
    var orig = number;
    var dec = decPlaces;
    decPlaces = Math.pow(10, decPlaces);
    var abbrev = ["K", "M", "B", "T"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            var number = Math.round(number * decPlaces / size) / decPlaces;
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }
            number += abbrev[i];
            break;
        }
    }
    // console.log(number);
    return number;
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//Danh sách cơ hội
$(document).on("change", "#isOngoing,#isClose,#isSignContract", function () {
    tblOpportunityWithAccountsDetail.draw();
});
var tblOpportunityWithAccountsDetail;
var objectSearch;
function OpportunityWithAccountsDetail() {
    var url = $("#urlGetOpportunityWithAccountsDetail").val();
    tblOpportunityWithAccountsDetail = $('#detailopp-table').DataTable({
        "autoWidth": false,
        sort: true,
        searching: true,
        //orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": false,
        "bLengthChange": false,
        scrollCollapse: true,
        "paging": false,
        order: [[1, "desc"]],
        language: {
            emptyTable: "Không có dữ liệu",
            info: "Hiển thị: _TOTAL_ bản ghi",
            infoEmpty: "Hiển thị: 0 bản ghi",
            infoFiltered: "(đã lọc từ _MAX_ bản ghi)",
            lengthMenu: "Hiển thị _MENU_ mục",
            loadingRecords: "Loading...",
            processing: "Processing...",
            search: "",
            zeroRecords: "Không có bản ghi nào",
            searchPlaceholder: "Tìm kiếm",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            },
            aria: {
                sortAscending: ": activate to sort column ascending",
                sortDescending: ": activate to sort column descending"
            }
        },
        rowId: "staffId",
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "ajax": {
            "url": url,
            type: "POST",
            cache: false,
            data: function (d) {
                var isOngoing = $("#isOngoing").prop("checked");
                var isClose = $("#isClose").prop("checked");
                var isSignContract = $("#isSignContract").prop("checked");
                var isAccountId = $("#AccountId").val();
                var searchdt = $.extend({}, d, {
                    "isOngoing": isOngoing,
                    "isClose": isClose,
                    "isSignContract": isSignContract,
                    "isAccountId": isAccountId,
                });
                objectSearch = searchdt;
                return searchdt;
            }
        },
        'columnDefs': [

            {
                'targets': 0,
                'data': "Code",
                'title': "Mã cơ hội",
                'className': "",
                "width": "auto",
                'render': function (data, type, full, meta) {

                    var hostAddress = $("#hostAddress").val();
                    var link = hostAddress + "/Opportunities/Details?oppId=" + full.IdOpportunity + "";
                    var str = "";
                    str += "<a href='" + link + "'>" + full.Code + "</a>";
                    return str;
                    console.log(full);
                }
            },
            {
                'targets': 1,
                'data': "NameOpportunity",
                'title': "Tên cơ hội",
                'className': "",
                "width": "auto"
            },
            {
                'targets': 2,
                'data': "NameOwner",
                'title': 'Người quản lý',
                'className': "",
                "width": "auto"
            },
            {
                'targets': 3,
                'data': "OrgChart",
                'title': "OrgChart",
                'className': "",
                "width": "auto"
            },
        ],
        "info": true,
        "stateSave": false
    });

    $('#detailopp-table thead tr').clone(true).appendTo("#detailopp-table thead").addClass("search-header");
    $('#detailopp-table thead tr:eq(1)').off("click");
    $('#detailopp-table thead tr:eq(1) th').off("click");
    $('#detailopp-table thead tr:eq(1) th').off("keypress");
    $('#detailopp-table thead tr:eq(1) th').each(function (i) {
        var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (tblOpportunityWithAccountsDetail.column(i).search() !== this.value) {
                tblOpportunityWithAccountsDetail
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                if (tblOpportunityWithAccountsDetail.column(i).search() !== this.value) {
                    tblOpportunityWithAccountsDetail
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });
    });
    $("#detailopp-table tbody tr > td:last-child()").off("click");
}

