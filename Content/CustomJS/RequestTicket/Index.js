var table;
var table1;
var roleSMO = false;

$(document).ready(function () {
    if ($('#sessionRole').val() != null && $('#sessionRole').val() != "") {
        arrUser = $('#sessionRole').val().split(";");
        for (var i = 0; i < arrUser.length; i++) {
            if (arrUser[i] == "DataManager") {
                roleSMO = true;
            }
        }
    }
    GetListRequestTicket();
    $('#acc-table_info').hide();
    $("#reasontext").change(function () {
        var dataReason = $('#reasontext').val();
        if (dataReason === "" || dataReason === null) {
            $(".Reason").closest('.form-group').addClass('has-error');
            $("#reason-error").show();
        }
        else {
            $("#reason-error").hide();
            $(".Reason").removeClass("has-error");
        }

    });

    var accName = $("#accName").val();
    if (accName !== "") {
        $("#input0").val(accName).trigger("blur");
    }

    var createdBy = $("#createdBy").val();
    if (createdBy !== "") {
        $("#input4").val(createdBy).trigger("blur");
    }
});

function GetListRequestTicket() {
    var url = $("#urlLoadLisRequestTicket").val();
    table = $('#acc-table').DataTable({
        paging: true,
        sort: true,
        searching: true,
        orderCellsTop: true,
        fixedHeader: true,
        fixedFooter: true,
        "bInfo": true,
        "bLengthChange": false,
        scrollCollapse: true,
        order: [[5, "desc"]],
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
        rowId: 'staffId',
        "processing": true,
        "serverSide": true,
        "bServerSide": true,
        "pageLength": 50,
        "ajax": {
            "url": url,
            type: "POST",
            data: function (d) {
                return $.extend({}, d, {
                    "isViewOwner": $("#isViewOwner1").prop("checked"),
                    "isViewDivision": $("#isViewDivision1").prop("checked"),
                    "isViewDivisonOwner": $("#isViewDivisonOwner1").prop("checked"),
                });
            }
        },
        'columnDefs': [
            {
                'targets': -1,
                "data": null,
                'searchable': false,
                'orderable': false,
                'className': "text-center",
                'colspan': "3",
                'render': function (data, type, full, meta) {
                    var str = "";
                    str += "<div class='btn-group' role='group'>";
                    str += "<button   onclick='detailTicket(" + full.id + ")' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    str += "<i class='fa fa-caret-down' aria-hidden='true' ></i> </button>";
                    str += "</div>";
                    return str;
                }
            },
            {
                'data': "accountName",
                'targets': 0,
                'title': "Tên khách hàng",
                'className': "",
                'render': function (data, type, full, meta) {
                    var dataAccountName = htmlEncode(full.accountName);
                    return dataAccountName;
                }
            },

            {
                'targets': 1,
                'className': "",
                'data': "titlePendingText",
                'title': "Loại Ticket",
            },
            {
                'targets': 2,
                'className': "",
                'data': "statusText",
                'title': "Trạng thái",
            },
            //{
            //    'targets': 3,
            //    'className': "",
            //    'data': "updatedBy",
            //    'title': "Người duyệt",
            //    'render': function (data, type, full, meta) {
            //        var str = "";
            //        if (full.status == 0) {
            //            if (full.titlePending == 0 || full.titlePending == 2) {
            //                str = "SMO";
            //            }
            //            else {
            //                str = full.usernameOwnerAcc;
            //            }
            //        }
            //        else {
            //            str = full.updatedBy;
            //        }

            //        return str;
            //    }
            //},
            {
                'targets': 3,
                'className': "",
                'data': "approverText",
                'title': "Người duyệt",
            },
            {
                'targets': 4,
                'className': "",
                'data': "createdBy",
                'title': "Người tạo"

            },
            {
                'targets': 5,
                'className': "",
                'title': "Ngày tạo",
                'data': "createdDate",
                'render': function (data, type, full, meta) {
                    var str = "";
                    if (full.createdDate !== "") {
                        str += new Date(full.createdDate).toLocaleDateString("en-GB");
                    }
                    return str;
                }
            },
            {
                'targets': 6,
                'className': "",
                'title': "Người chuyển giao",
                'data': "assignee"
            },
            {
                'targets': 7,
                'className': "",
                'title': ""
            }

        ],
        "info": true,
        "stateSave": false
    });
    $("#acc-table_filter input").unbind();

    $("#acc-table_filter input").bind("keypress", function (e) {
        if (e.keyCode === 13) {
            table.search(this.value).draw();
        }
    });

    $("#acc-table_filter input").on("blur", function () {
        if (true) {
            table.search(this.value).draw();
        }
    });

    $('#acc-table thead tr').clone(true).appendTo('#acc-table thead').addClass("search-header");

    $('#acc-table thead tr:eq(1)').off("click");
    $('#acc-table thead tr:eq(1) th').off("click");
    $('#acc-table thead tr:eq(1) th').off("keypress");

    var id = 0;
    $('#acc-table thead tr:eq(1) th').each(function (i) {
        //var title = $(this).text().toLowerCase();
        $(this).html('<input type="text" id=input' + id + ' class="" placeholder="&#xF002;" style="font-family:Arial, FontAwesome" />');

        $("input", this).on('blur', function () {
            if (table.column(i).search() !== this.value) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
        $("input", this).on('keypress', function (e) {
            if (e.keyCode === 13) {
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            }
        });

        id++;
    });

    $("#acc-table thead tr:eq(1) > th:last-child()").html("");
    $("#acc-table tbody tr > td:last-child()").off("click");

}
function viewAccDetail(AccountId) {
    var urlHostEditAddress = $("#urlHostAddress").val();
    var link = urlHostEditAddress + AccountId + "";
    window.open(link, "_blank");
}
function actionTicket(ticketId, action, titlePending, IdOwnerOld) {
    var obj = $(this);
    messageTicket = "";
    if ($('#statusRejected').val() == action) {
        messageTicket = "Từ chối ticket !";
    }
    else if ($('#statusApproved').val() == action) {
        messageTicket = "Đồng ý duyệt ticket !";
    }
    else if ($('#statusCancel').val() == action) {
        messageTicket = "Hủy ticket !";
    }

    alertTicket = "";
    if ($('#statusRejected').val() == action) {
        alertTicket = "Từ chối ticket thành công !";
    }
    else if ($('#statusApproved').val() == action) {
        alertTicket = "Duyệt ticket thành công !";
    }
    else if ($('#statusCancel').val() == action) {
        alertTicket = "Hủy ticket thành công !";
    }
    $("#detailTicket-modal").modal("hide");

    bootbox.confirm({
        title: "Thông báo",
        message: messageTicket,
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
                var url = $("#urlActionTicket").val();
                $.ajax({
                    "url": url,
                    method: "POST",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        'ticketId': ticketId,
                        'action': action,
                        'titlePending': titlePending,
                        'reasonReject': null,
                        'idOwnerOld': IdOwnerOld,
                    }),
                    success: function (data) {
                        bootbox.alert(alertTicket, function () {
                            table.draw('page');
                        });

                    }
                });
            }
            else {
                table.draw('page');
            }
        }
    });
}

function detailTicket(ticketId) {
    $.ajax({
        "url": $("#urlDetailTicket").val(),
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            'ticketId': ticketId
        }),
        success: function (dt) {
            if (dt.ResultCode === 1) {
                var statusCancel = $('#statusCancel').val();
                var statusApproved = $('#statusApproved').val();
                var statusRejected = $('#statusRejected').val();
                //xóa các thẻ div cũ
                var elem = document.getElementById("div_append");
                if (elem != null) {
                    elem.parentNode.removeChild(elem);
                }
                html = '';
                html += '<div class="row margin-left-5" id ="div_append">';
                var hostAddress = $("#hostAddress").val();
                //Đường dẫn đến khách hàng và tên khách hàng
                var linkAccount = hostAddress + "/Accounts/Details?AccountId=" + dt.Data.IdAccounts + "";
                if (dt.Data.AccPermission === true) {
                    html += '<div class="row" style="margin-top:5px">';
                    html += '<span class="control-label  col-md-3">Tên Khách Hàng: </span>';
                    html += '<a  class=" col-md-9" href="' + linkAccount + '">' + dt.Data.AccountName + '</a>';
                    html += '</div>';
                } else {
                    html += '<div class="row" style="margin-top:5px">';
                    html += '<span class="control-label  col-md-3">Tên Khách Hàng: </span>';
                    html += '<div class=" col-md-9">' + dt.Data.AccountName + '</div>';
                    html += '</div>';
                }
                //Mã  code khách hàng
                if (dt.Data.CodeAccounts != null && dt.Data.CodeAccounts != "") {
                    html += '<div class="row" style="margin-top:10px">';
                    html += '<span class="control-label  col-md-3">Mã khách hàng: </span>';
                    html += '<div class=" col-md-9">' + dt.Data.CodeAccounts + '</div>';
                    html += '</div>';
                }

                //Trạng thái khách hàng
                html += '<div class="row" style="margin-top:10px">';
                html += '<span class="control-label  col-md-3">Trạng thái: </span>';

                if (dt.Data.Status == "0") {
                    html += '<div class=" col-md-9">Chờ xử lý</div>';
                }
                else if (dt.Data.Status == "1") {
                    html += '<div class=" col-md-9">Duyệt</div>';
                }
                else if (dt.Data.Status == "2") {
                    html += '<div class=" col-md-9">Từ chối</div>';
                }
                else {
                    html += '<div class=" col-md-9"></div>';
                }
                html += '</div>';
                //Đường dẫn đến cơ hội và tên cơ hội
                if (dt.Data.OppName != null && dt.Data.OppName != "") {
                    var linkOpp = hostAddress + "/Opportunities/Details?oppId=" + dt.Data.IdOpp + "";
                    html += '<div class="row" style="margin-top:5px">';
                    html += '<span class="control-label  col-md-3">Tên cơ hội:</span>';
                    html += '<a  class=" col-md-9" href="' + linkOpp + '">' + dt.Data.OppName + '</a>';
                    html += '</div>';
                    html += '<div class="row" style="margin-top:10px">';
                    html += '<span class="control-label  col-md-3">Mã khách hàng:</span>';
                    html += '<div class=" col-md-9">' + dt.Data.CodeOpp + '</div>';
                    html += '</div>';
                }
                html += '<div class="row" style="margin-top:10px">';
                //Loại ticket
                html += '<span class="control-label  col-md-3">Loại ticket : </span>';
                if (dt.Data.TitlePending == 0) {
                    html += '<div class=" col-md-9">Đăng ký khách hàng mới</div>';
                }
                else if (dt.Data.TitlePending == 1) {
                    html += '<div class=" col-md-9">Đăng ký làm người khai thác</div>';
                }
                else if (dt.Data.TitlePending == 2) {
                    html += '<div class=" col-md-9">Đăng ký làm owner</div>';
                }
                else {
                    html += '<div class=" col-md-9"></div>';
                }
                html += '</div>';
                //Lý do xin làm owner

                if (dt.Data.TitlePending == 2) {
                    //html += '<div class="row" style="margin-top:10px">';
                    //html += '<span class="control-label  col-md-3"> Lý do đăng ký : </span>';
                    //html += '<div class=" col-md-9">' + dt.Data.Reason + '</div>';
                    //html += '</div>';
                    html += '<div class="row" style="margin-top:10px">';
                    html += '<span class="control-label  col-md-3"> Lý do đăng ký : </span>';
                    html += '<div class=" col-md-9">' + dt.Data.ReasonText + '</div>';
                    html += '</div>';
                }

                // Ngày tạo
                html += '<div class="row" style="margin-top:10px">';
                html += '<span class="control-label  col-md-3">Người tạo: </span>';
                html += '<div class=" col-md-9">' + dt.Data.CreatedBy + '</div>';
                html += '</div>';
                // Người tạo
                html += '<div class="row " style="margin-top:10px">';
                html += '<span class="control-label  col-md-3">Ngày tạo: </span>';
                var CreatedDate = new Date(dt.Data.CreatedDate).toLocaleDateString();
                html += '<div class=" col-md-9">' + CreatedDate + '</div>';
                html += '</div>';
                // Ngày và người cập nhật
                if (dt.Data.UpdatedBy != null && dt.Data.UpdatedBy != "") {
                    var UpdatedDate = new Date(dt.Data.UpdatedDate).toLocaleDateString();
                    html += '<div class="row" style="margin-top:10px">';
                    html += '<span class="control-label  col-md-3">Người cập nhật:</span>';
                    html += '<div class=" col-md-9">' + dt.Data.UpdatedBy + '</div>';
                    html += '</div>';

                    html += '<div class="row" style="margin-top:10px">';
                    html += '<span class="control-label  col-md-3">Ngày cập nhật:</span>';
                    html += '<div class=" col-md-9">' + UpdatedDate + '</div>';
                    html += '</div>';
                }
                if (dt.Data.ReasonReject != null && dt.Data.ReasonReject != "") {
                    html += '<div class="row" style="margin-top:10px">';
                    html += '<span class="control-label  col-md-3">Lý do từ chối:</span>';
                    html += '<div class=" col-md-9">' + dt.Data.ReasonReject + '</div>';
                    html += '</div>';
                }
                var sessionUserName = $("#sessionUserName").val();
                var sessionUserId = $("#sessionUserId").val();
                if (dt.Data.Status == "0" && (roleSMO == true || dt.Data.Assignee == sessionUserName) && dt.Data.TitlePending == 2) {
                    html += '<div class="row" id="assigneeArea" style="margin-top: 10px">';
                    html += '<span class="control-label  col-md-3">Người được chuyển giao:</span>';
                    html += '<div class=" col-md-8"><select class="form-control" id="ticketAssignee" required="" tabindex="-1" aria-hidden="true"></select></div>';
                }

                if (dt.Data.LstLogging.length > 0 && dt.Data.TitlePending == 2) {
                    html += "<div class='col-md-12' style='margin-top: 10px; margin-bottom: 20px; padding-right: 30px;'><table class='table table-bordered'><thead><tr><th>Nội dung</th><th>Người thực hiện</th><th>Thời gian</th></tr></thead><tbody>";
                    for (var i = 0; i < dt.Data.LstLogging.length; i++) {
                        html += "<tr>";
                        html += "<td>" + dt.Data.LstLogging[i].ItemValues + "</td>";
                        html += "<td>" + dt.Data.LstLogging[i].UserName + "</td>";
                        var milli = dt.Data.LstLogging[i].CreateDate.replace(/\/Date\((-?\d+)\)\//, '$1');
                        var date = new Date(parseInt(milli)).toLocaleDateString("en-GB");
                        html += "<td>" + date + "</td>";
                        html += "</tr>";
                    }
                    html += "</tbody></table></div>";
                }
                html += '</div>';


                // Action                
                if (roleSMO == true || (dt.Data.IdOwnerAcc == sessionUserId && dt.Data.TitlePending == "1") || (dt.Data.IdCreatedBy == sessionUserId) || (dt.Data.Assignee == sessionUserName)) {

                    html += '<div class="modal-footer" style="margin-top:10px">';
                    if (dt.Data.Status == "0" && (roleSMO == true || (dt.Data.IdCreatedBy == sessionUserId))) {
                        html += '<button onclick="actionTicket(' + dt.Data.IdTicket + ',\'' + statusCancel + '\',' + dt.Data.TitlePending + ',' + dt.Data.IdOwnerAcc + ')"  class="btn btn-default  margin-left-10">';
                        html += '<i></i> Hủy';
                        html += '</button>';
                    }
                    if (dt.Data.Status == "0" && (roleSMO == true || (dt.Data.IdOwnerAcc == sessionUserId && dt.Data.TitlePending == "1") || (dt.Data.Assignee == sessionUserName))) {
                        if (dt.Data.TitlePending == 2) {
                            html += '<button class="btn btn-default  margin-left-10" id="assign">';
                            html += '<i></i> Chuyển giao';
                            html += '<input type="hidden" id="assignTicketId" value=' + dt.Data.IdTicket + " />";
                            html += '</button>';
                            if (dt.Data.Assignee !== "" && dt.Data.Assignee == sessionUserName) {
                                html += '<button class="btn btn-default  margin-left-10" id="assignSMO">';
                                html += '<i></i> Chuyển giao lại SMO';
                                html += '</button>';
                            }
                        }
                        html += '<button onclick="actionTicket(' + dt.Data.IdTicket + ',\'' + statusApproved + '\',' + dt.Data.TitlePending + ',' + dt.Data.IdOwnerAcc + ')"  class="btn btn-default  margin-left-10">';
                        html += '<i></i> Duyệt';
                        html += '</button>';
                        html += '<button onclick="openModalReject(' + dt.Data.IdTicket + ',\'' + statusRejected + '\',' + dt.Data.TitlePending + ',' + dt.Data.IdOwnerAcc + ')"  class="btn btn-default  margin-left-5">';
                        html += '<i></i> Từ Chối';
                        html += '</button>';
                    }

                    html += '<button type="button" class="btn btn-default margin-left-5" data-dismiss="modal">Đóng</button>';
                    html += '</div>';

                }
                else {
                    html += '<div class="modal-footer">';
                    html += '<button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>';
                    html += ' </div>';
                }


                html += '</div>';
                $('#apppend_data').empty().append(html);

                $("#ticketAssignee").select2({
                    allowClear: true,
                    placeholder: '',
                    ajax: {
                        url: $("#urlSearchUserInSso").val(),
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keySearch: params.term // search term
                            };
                        },
                        processResults: function (data) {
                            return { results: data };
                        },
                        cache: true
                    },
                    escapeMarkup: function (markup) { return markup; },
                    minimumInputLength: 1,
                    templateResult: function (results) {
                        var rs = JSON.stringify(results);
                        var json = JSON.parse(rs);
                        return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
                    },
                    templateSelection: function (results) {
                        return "<div>" + results.text + "</div>";
                    }
                });

                //$("#ticketAssignee").data("select2").on("results:message", function () {
                //    this.dropdown._positionDropdown();
                //});

                //$("#ticketassignee").on('select2:select', function (e) {
                //    $(e.currenttarget).valid();
                //});
                $("#detailTicket-modal").modal();
            }

        }
    });
}

function openModalReject(ticketId, action, titlePending, IdOwnerOld) {
    $('#detailTicket-modal').modal('hide');
    bootbox.confirm({
        title: "Thông báo",
        message: "Từ chối ticket !",
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
                $('#reasontext').val("");
                $("#ticketId").val(ticketId);
                $("#actionticket").val(action);
                $("#idOwnerOld").val(IdOwnerOld);
                $("#titleticket").val(titlePending);
                $("#Reject-modal").modal();
                table.draw('page');
            }
            else {
                setTimeout(function () {

                }, 500);
                table.draw('page');
            }
        }
    });
}
function reasonReject() {
    var dataReason = $('#reasontext').val();
    if (dataReason === "" || dataReason === null) {
        $(".Reason").closest('.form-group').addClass('has-error');
        $("#reason-error").show();
        table.draw('page');
    }
    else {
        $("#Reject-modal").modal('hide');
        var ticketId = $("#ticketId").val();
        var action = $("#actionticket").val();
        var titlePending = $("#titleticket").val();
        var idOwnerOld = $("#idOwnerOld").val();
        var url = $("#urlActionTicket").val();
        $.ajax({
            "url": url,
            method: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'ticketId': ticketId,
                'action': action,
                'titlePending': titlePending,
                'reasonReject': dataReason,
                'idOwnerOld': idOwnerOld
            }),
            success: function (data) {
                setTimeout(function () {
                    bootbox.alert("Từ chối ticket thành công !", function () {
                    });
                    table.draw('page');
                }, 500);

            }
        });
    }
}

function closeReasonReject() {
    $('#reasontext').val("");
    $("#ticketId").val("");
    $("#actionticket").val("");
    $("#titleticket").val("");
    $("#Reject-modal").modal('hide');
    table.draw('page');
}

$(document).on("click", "#assign", function () {
    //$("#assigneeArea").removeClass("hidden");
    var assignee = $("#ticketAssignee").val();
    if (assignee === null || assignee === "") {
        bootbox.alert("Không được để trống người chuyển giao!");
        return;
    } else {
        var ticketId = $("#assignTicketId").val();
        var url = $("#urlAsignTicket").val();
        $.ajax({
            "url": url,
            method: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'ticketId': ticketId,
                'assignee': assignee,
                'assignSMO': false
            }),
            success: function (data) {
                setTimeout(function () {
                    bootbox.alert("Chuyển giao ticket thành công !", function () {
                    });
                    table.draw('page');
                    $("#detailTicket-modal").modal("hide");
                }, 500);
            }
        });
    }
});

$(document).on("click", "#assignSMO", function () {
    //$("#assigneeArea").removeClass("hidden");
    var assignee = "SMO";
    var ticketId = $("#assignTicketId").val();
    var url = $("#urlAsignTicket").val();
    $.ajax({
        "url": url,
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'ticketId': ticketId,
            'assignee': assignee,
            'assignSMO': true
        }),
        success: function (data) {
            setTimeout(function () {
                bootbox.alert("Chuyển giao ticket thành công !", function () {
                });
                table.draw('page');
                $("#detailTicket-modal").modal("hide");
            }, 500);
        }
    });
});


