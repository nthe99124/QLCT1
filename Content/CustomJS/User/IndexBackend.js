$(document).ready(function () {

    $("#btnSubmitSearch").on("click", function () {
        $("#PaginationInfo_CurrentPageIndex").val("1");
        $("#btn_submitpaging").click();
    });

    $("#FilterOptions_Username").on("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $("#PaginationInfo_CurrentPageIndex").val("1");
            $("#btn_submitpaging").click();
        }
    });

    //Permission
    $(".set-role-user").click(function () {

        var object = $(this)[0];
        var perType = $(this).attr("ct-type");
        var user = $(this).attr("ct-user");
        var urlPer = $("#urlPermission").val();
        var lock = $(object).hasClass("lock-status");
        var unLock = $(object).hasClass("unlock-status");
        //console.log(lock);
        var data = {
            userId: user,
            perType: perType
        };
        $.ajax({
            url: urlPer,
            type: 'POST',
            data: data,
            success: function (dataReturn) {

                if (dataReturn === "Ok") {
                    //Unlock
                    if (lock === true) {
                        $(object).removeClass("lock-status");
                        $(object).addClass("unlock-status");
                        $(object).find("i").removeClass("fa-lock");
                        $(object).find("i").addClass("fa-unlock");
                    }
                    //Lock
                    if (unLock === true) {
                        $(object).removeClass("unlock-status");
                        $(object).addClass("lock-status");
                        $(object).find("i").removeClass("fa-unlock");
                        $(object).find("i").addClass("fa-lock");
                    }
                    //Remove permission recer and inputer when pertype=recman
                    if (perType === "recman") {
                        var objectRecer = $("#recer_" + user)[0];
                        var objectInputer = $("#inputer_" + user)[0];
                        var unlockRecer = $(objectRecer).hasClass("unlock-status");
                        var unlockInputer = $(objectInputer).hasClass("unlock-status");
                        if (unlockRecer === true) {
                            $(objectRecer).removeClass("unlock-status");
                            $(objectRecer).addClass("lock-status");
                            $(objectRecer).find("i").removeClass("fa-unlock");
                            $(objectRecer).find("i").addClass("fa-lock");
                        }
                        if (unlockInputer === true) {
                            $(objectInputer).removeClass("unlock-status");
                            $(objectInputer).addClass("lock-status");
                            $(objectInputer).find("i").removeClass("fa-unlock");
                            $(objectInputer).find("i").addClass("fa-lock");
                        }
                    }
                    //Remove permission recman  when pertype=inputer or recer
                    if (perType === "inputer" || perType === "recer") {
                        var objectRecman = $("#recman_" + user)[0];
                        var unlockRecman = $(objectRecman).hasClass("unlock-status");
                        if (unlockRecman === true) {
                            $(objectRecman).removeClass("unlock-status");
                            $(objectRecman).addClass("lock-status");
                            $(objectRecman).find("i").removeClass("fa-unlock");
                            $(objectRecman).find("i").addClass("fa-lock");
                        }
                    }
                }
                if (dataReturn == "Error") {
                    bootbox.alert("Error set permission");
                }
            },
            error: function (e) {
                //called when there is an error
                //console.log(e.message);
            }
        });
    });

    var msgInputTooShort = $("#msgInputTooShort").val();
    var msgInputTooLong = $("#msgInputTooLong").val();
    var msgAjaxError = $("#msgAjaxError").val();
    var msgSearching = "<span><i class='fa fa-spin fa-spinner'></i> " + $("#msgSearching").val() + "</span>";
    var msgNoMatches = $("#msgNoMatches").val();
    var msgLoadMore = $("#msgLoadMore").val();
    //Select 2 - 3.5
    //$("#SearchUserInLdap").select2({
    //    tags: true,
    //    minimumInputLength: 2,

    //    formatInputTooShort: function (term, minLength) { return msgInputTooShort; },
    //    formatInputTooLong: function (term, maxLength) { return msgInputTooLong; },
    //    formatAjaxError: function (jqXHR, textStatus, errorThrown) { return msgAjaxError; },
    //    formatSearching: function () { return msgSearching; },
    //    formatNoMatches: function (term) { return msgNoMatches; },
    //    formatLoadMore: function (pageNumber) { return msgLoadMore; },
    //    allowClear: true,
    //    multiple: true,
    //    ajax: {
    //        url: $("#urlSearchUser").val(),
    //        dataType: 'json',
    //        type: "POST",
    //        data: function (term, page) {
    //            return {
    //                keySearch: term,
    //                default: $("#SearchUserInLdap").attr('ct-user')
    //            };
    //        },
    //        results: function (data, page) {
    //            return {
    //                results: data
    //            };
    //        }
    //    }, initSelection: function (element, callback) {
    //        var elementText = $(element).attr('data-init-text');
    //        var eleArr = elementText != undefined ? elementText.split(',') : '';
    //        var data = [];
    //        for (var i = 0; i < eleArr.length; i++) {
    //            data[i] = { "text": eleArr[i], "id": eleArr[i] }
    //        }
    //        callback(data);
    //    }
    //});

    //select2 - 4.0 trở lên
    $("#SearchUserInLdap").select2({
        minimumInputLength: 2,
        allowClear: true,
        width: '100%',
        placeholder: "",
        ajax: {
            url: $("#urlSearchUser").val(),
            dataType: 'json',
            data: function (params) {
                var query = {
                    keySearch: params.term,
                    valueField: 'username'
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (results) {
            var rs = JSON.stringify(results);
            var json = JSON.parse(rs);
            return "<div title='" + json["id"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
        },
        templateSelection: function (results) {
            return "<div>" + results.text + "</div>";
        }
    });


    $(function () {
        var msg = $("#messageError").val();
        if (msg != null && msg != "") {
            bootbox.alert(msg);
            $("#messageError").val("");
        }
    });
});
function DeleteItem(id) {
    bootbox.confirm($("#msgConfirmDelete").val(),
        function (result) {
            if (result) {
                $("#ListId").val(id);
                $("#cmd_deletemulti").click();
            }
        });
}
function DeleteListUser() {
    //$("#SearchUserInLdap").val("");
    //$("#SearchUserInLdap").select2("val", "");
    $("#SearchUserInLdap").val(null).trigger("change");
}
function btnSend() {
    //    $("#btnSend").prop("disabled", true);
    $("#loading").show();

    $.ajax({
        type: "GET",
        url: $("#urlSendLog").val(),
        success: function (result) {
            RUNNING = 0;

        },
        error: function (result) {
            console.log(result);
        }
    });
}

var totalLog = $("#totalLog").text();
var RUNNING = 1;
$(function () {
    setInterval(function () {
        if (RUNNING == 0) {
            $("#loading").removeClass("hide");
            $.ajax({
                type: "GET",
                url: $("#urlCheckSendLog").val(),
                success: function (result) {
                    $("#logSent").text(result.TotalRecords);
                    var notSent = totalLog - result.TotalRecords;
                    $("#totalLog").text(notSent);
                    if (result.Message == "False") {
                        RUNNING = 1;
                        $("#div_Send").hide();
                        //tat ca log chua dc gui di thi van show button
                        if (totalLog > result.TotalRecords) {
                            $("#div_Send").show();
                            $("#btnSend").prop("disabled", false);
                        }
                        $("#div_LogStatus").hide();
                        bootbox.alert(result.TotalRecords + " log đã được gửi");
                    }
                    else {
                        RUNNING = 0;
                    }
                },
                error: function (result) {
                    RUNNING = 0;
                    console.log(result);
                }
            });
        }
        else
            $("#loading").addClass("hide");
    }, 800);
});

function btnSendMail() {
    //    $("#btnSend").prop("disabled", true);
    $("#loading").show();

    $.ajax({
        type: "GET",
        url: $("#urlSendMail").val(),
        success: function (result) {
            if (result == "OK") {
                bootbox.alert($("#msSendMailSuccess").val());
            }
            else if (result == "Err") {
                bootbox.alert($("#msSendMailErr").val());
            }
        },
        error: function (result) {
            console.log(result);
        }
    });

}

function ChangeMailsetting() {
    var crnttxt = $("#mailchangesetting").text().trim();
    //mailstatus

    bootbox.confirm("Bạn có chắc chắn muốn <b>" + crnttxt + "</b> gửi mail?", function (dt) {
        if (dt) {
            $.ajax({
                type: "GET",
                url: $("#urlChangeMailSetting").val(),
                success: function (result) {
                    console.log(result);
                    if (result == null || result.Message == undefined) {
                        bootbox.alert("Không thành công, vui lòng load lại trang và thử lại!");
                    }
                    else {
                        bootbox.alert("Thành công!");
                        var newLbltxt = result.Message == "1" ? "Bật" : "Tắt";
                        var newBtTxt = result.Message == "1" ? "Tắt" : "Bật";
                        $("#mailchangesetting").text(newBtTxt);
                        $("#mailstatus").text(newLbltxt);
                    }
                },
                error: function (result) {
                    bootbox.alert("Không thành công, vui lòng load lại trang và thử lại!");
                }
            });
        }
    });


}