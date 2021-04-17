$(document).on("keydown", ":input:not(textarea)", function (event) {
    return event.key != "Enter";
});

$(function () {
    if ($("#Division").find("option").length > 0) {
        $("#Division").trigger("change");
        InitCommentOnReady();
    }
});

function ShowTurnoverInput(month) {
    if ($("#input_turnover_" + month).is(":visible")) {
        return;
    } else {
        var turnover = $("#span_turnover_" + month).text().split(",").join("");
        $("#input_turnover_" + month).val(turnover);
        ToggleTurnover(month);
        $("#input_turnover_" + month).focus();
    }
}

function SaveTurnover(month) {
    var text = $("#input_turnover_" + month).val();
    var value = text === "" ? "" : new Intl.NumberFormat('en-US').format(text);
    $("#span_turnover_" + month).text(value);
    var currentTurnover;
    var inputTurnover = BigInt($("#input_turnover_" + month).val());
    if ($("#current_turnover_" + month).text() == "") {
        currentTurnover = 0;
    } else {
        currentTurnover = BigInt($("#current_turnover_" + month).text().split(",").join(""));
    }
    if (inputTurnover > currentTurnover) {
        $("#span_turnover_" + month).removeClass("text-danger").addClass("text-green");
    } else if (inputTurnover < currentTurnover) {
        $("#span_turnover_" + month).removeClass("text-green").addClass("text-danger");
    }
    ToggleTurnover(month);
    $("#input_turnover_" + month).trigger('focusout');
}

function ToggleTurnover(month) {
    $("#span_turnover_" + month).toggle();
    $("#input_turnover_" + month).toggle();
}

function ShowGrossProfitInput(month) {
    if ($("#input_grossprofit_" + month).is(":visible")) {
        return;
    } else {
        var grossprofit = $("#span_grossprofit_" + month).text().split(",").join("");
        $("#input_grossprofit_" + month).val(grossprofit);
        ToggleGrossProfit(month);
        $("#input_grossprofit_" + month).focus();
    }
}

function SaveGrossProfit(month) {
    var text = $("#input_grossprofit_" + month).val();
    var value = text === "" ? "" : new Intl.NumberFormat('en-US').format(text);
    $("#span_grossprofit_" + month).text(value);
    var currentgrossprofit;
    var inputgrossprofit = BigInt($("#input_grossprofit_" + month).val());
    if ($("#current_grossprofit_" + month).text() == "") {
        currentgrossprofit = 0;
    } else {
        currentgrossprofit = BigInt($("#current_grossprofit_" + month).text().split(",").join(""));
    }
    if (inputgrossprofit > currentgrossprofit) {
        $("#span_grossprofit_" + month).removeClass("text-danger").addClass("text-green");
    } else if (inputgrossprofit < currentgrossprofit) {
        $("#span_grossprofit_" + month).removeClass("text-green").addClass("text-danger");
    }
    ToggleGrossProfit(month);
    $("#input_grossprofit_" + month).trigger('focusout');
}

function ToggleGrossProfit(month) {
    $("#span_grossprofit_" + month).toggle();
    $("#input_grossprofit_" + month).toggle();
}

function Submit() {
    // require người duyệt
    if ($("#Approver").val() == 0) {
        bootbox.alert("Chưa chọn người duyệt");
        return false;
    }

    // require 3 tháng
    var currentMonth = new Date().getMonth();
    for (var month = currentMonth + 1; month <= currentMonth + 3; month++) {
        if ($("#span_turnover_" + month).text().trim() == "" || $("#span_grossprofit_" + month).text().trim() == "") {
            bootbox.alert("Hãy nhập kế hoạch cho tháng hiện tại và 2 tháng tiếp theo");
            return false;
        }
    }

    $("#submit").click();
}

$("#Division").on('change',
    function (e) {
        $("#loading").addClass("loading");
        var divisionId = $(this).val();
        $("#Approver").html('');
        var getManagers =
            $.ajax({
                url: $("#urlAjaxGetDivisionManagers").val() + "?divisionId=" + divisionId,
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    $.each(res,
                        function (index, value) {
                            var option = new Option(value.Text, value.Value);
                            $("#Approver").append(option);
                        });
                }
            });
        var getEditing =
            $.ajax({
                url: $("#urlAjaxGetEditingPlanDetails").val() + "?type=" + $("#type").val() + "&divisionId=" + divisionId,
                type: 'GET',
                dataType: 'html',
                success: function (res) {
                    if ($("#editingPlanDetail #actionGroupDiv").length == 1) {
                        var element = $("#editingPlanDetail #actionGroupDiv").detach();
                        element.insertBefore($("#currentPlanDetail"));
                    }
                    $("#editingPlanDetail").html(res);
                    // move các nút ra chỗ khác =]]
                    if ($("#editingPlanDetail").children().length == 2) {
                        var elementToPrepend = $("#editingPlanDetail").children().last();
                        $("#actionGroupDiv").detach().prependTo(elementToPrepend);
                    }
                }
            });
        var getDetails =
            $.ajax({
                url: $("#urlAjaxGetCurrrentPlanDetails").val() + "?type=" + $("#type").val()+ "&divisionId=" + divisionId,
                type: 'GET',
                dataType: 'html',
                success: function(res) {
                    $("#currentPlanDetail").html(res);
                }
            });
        $.when(getManagers, getEditing, getDetails).done(function (r1, r2, r3) {
            $("#loading").removeClass("loading");
            InitCommentOnReady();
            var approver = 0;
            if ($("#approverPartial").val() != "") {
                approver = $("#approverPartial").val();
            }
            if (approver != 0) {
                $("#Approver").val(approver).trigger('change');
            }
            var editingId = $("#Plan_Id").val();
            if (editingId == "" || editingId == 0) {
                $("#btnCancel").addClass("hidden");
            } else {
                $("#btnCancel").removeClass("hidden");
            }
        });
    });

function UpdatePlan(planId, actionType) {
    $("#loading").addClass("loading");
    $.ajax({
        url: $("#urlAjaxUpdatePlanStatus").val(),
        type: "post",
        dataType: "json",
        data: {
            Plan: { Id: planId }, Action: actionType
        },
        success: function (result) {
            $("#loading").removeClass("loading");
            if (result.ResultCode === 1) {
                bootbox.alert("Thành công", function () {
                    var myPlanUrl = $("#hostAddress").val() + "/Plan/MyPlan";
                    window.location.href = myPlanUrl;
                });
            } else {
                bootbox.alert("Thất bại");
            }
        }
    });
}

function CancelPlan(actionType) {
    var planId = $("#Plan_Id").val();
    if (planId === 0) {
        return;
    } else {
        UpdatePlan(planId, actionType);
    }
}