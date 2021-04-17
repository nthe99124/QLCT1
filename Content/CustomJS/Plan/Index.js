$(".datetime").datepicker({
    format: "yyyy",
    viewMode: "years",
    minViewMode: "years",
    autoclose: true,
    showClear: true
});

var PersonalTable;
var DivisionTable;
$(function () {
    $("#PersonalSelect").trigger("change");
    $("#DivisionSelect").trigger("change");
});

$(".personal").on("change",
    function () {
        $("#loading").addClass("loading");

        if (this.id == "PersonalValueType") {
            $(this).parent().next().toggle();
            if (this.value == 3) {
                $('#PersonalOrderType option[value="1"]').text("A-Z");
                $('#PersonalOrderType option[value="2"]').text("Z-A");
            } else {
                $('#PersonalOrderType option[value="1"]').text("TĂNG DẦN");
                $('#PersonalOrderType option[value="2"]').text("GIẢM DẦN");
            }
            $("#PersonalOrderType").select2();
        }

        $.when(GetListPersonalPlan()).done(function (r1) {
            PersonalTable = $('#listPersonalPlan').DataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                "bFilter": false
            });
            $("input[type='checkbox']").trigger("change");
            $("#loading").removeClass("loading");
        });
    });

$(".division").on("change",
    function () {
        $("#loading").addClass("loading");

        if (this.id == "DivisionValueType") {
            $(this).parent().next().toggle();
            if (this.value == 3) {
                $('#DivisionOrderType option[value="1"]').text("A-Z");
                $('#DivisionOrderType option[value="2"]').text("Z-A");
            } else {
                $('#DivisionOrderType option[value="1"]').text("TĂNG DẦN");
                $('#DivisionOrderType option[value="2"]').text("GIẢM DẦN");
            }
            $("#DivisionOrderType").select2();
        }

        $.when(GetListDivisionPlan()).done(function (r1) {
            DivisionTable = $('#listDivisionPlan').DataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                "bFilter": false
            });
            $("input[type='checkbox']").trigger("change");
            $("#loading").removeClass("loading");
        });
    });

$("#PersonalSelect").on('change',
    function (e) {
        $("#loading").addClass("loading");
        $("#PersonalAM").html('');
        $.ajax({
                url: $("#urlAjaxGetDivisionAMs").val() + "?divisionId=" + $(this).val(),
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    $.each(res,
                        function(index, value) {
                            var option = new Option(value.Text, value.Value);
                            $("#PersonalAM").append(option);
                        });
                }
            }).then(function() {
                return GetListPersonalPlan();
            })
            .done(function(resp) {
                PersonalTable = $('#listPersonalPlan').DataTable({
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "bFilter": false 
                });
                $("input[type='checkbox']").trigger("change");
                $("#loading").removeClass("loading");
            });
    });

function GetListPersonalPlan() {
    var url = $("#urlAjaxSearchPlan").val() + "?type=1";
    url += "&divisionId=" + $("#PersonalSelect").val();
    url += "&childId=" + $("#PersonalAM").val();
    url += "&year=" + $("#PersonalYear").val();
    url += "&orderBy=" + $("#PersonalValueType").val();
    url += "&orderMonth=" + $("#PersonalMonth").val();
    url += "&orderType=" + $("#PersonalOrderType").val();
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function (res) {
            $("#PersonalContainer").html(res);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
        }
    });
}

$("#DivisionSelect").on('change',
    function (e) {
        $("#loading").addClass("loading");
        $("#ChildDivision").html('');
        $.ajax({
                url: $("#urlAjaxGetChildDivision").val() + "?divisionId=" + $(this).val(),
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    $.each(res,
                        function(index, value) {
                            var option = new Option(value.Text, value.Value);
                            $("#ChildDivision").append(option);
                        });
                }
            }).then(function() {
                return GetListDivisionPlan();
            })
            .done(function(resp) {
                DivisionTable = $('#listDivisionPlan').DataTable({
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "bFilter": false
                });
                $("input[type='checkbox']").trigger("change");
                $("#loading").removeClass("loading");
            });
    });

function GetListDivisionPlan() {
    var url = $("#urlAjaxSearchPlan").val() + "?type=2";
    url += "&divisionId=" + $("#DivisionSelect").val();
    url += "&childId=" + $("#ChildDivision").val();
    url += "&year=" + $("#DivisionYear").val();
    url += "&orderBy=" + $("#DivisionValueType").val();
    url += "&orderMonth=" + $("#DivisionMonth").val();
    url += "&orderType=" + $("#DivisionOrderType").val();
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function(res) {
            $("#DivisionContainer").html(res);

        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr);
        }
    });
}

// hoặc xài cách này
//$(document).on('click',
//    '.approve-btn',
//    function (e) {
//        console.log("clicked");
//    });

//function ApprovePlan(planId) {
//    console.log(planId);
//}

function UpdatePlan(planId, actionType) {
    if ($("#loading").hasClass("loading") == false) {
        $("#loading").addClass("loading");
    }
    $.ajax({
        url: $("#urlAjaxUpdatePlanStatus").val(),
        type: "post",
        dataType: "json",
        data: {
            Plan: { Id: planId }, Action: actionType
        },
        success: function (result) {
            if ($("#loading").hasClass("loading")) {
                $("#loading").removeClass("loading");
            }
            if (result.ResultCode === 1) {
                bootbox.alert("Thành công");
                // nếu là yêu cầu thay đổi
                if (actionType === 4) {
                    $("#row-plan-" + planId).attr('style', 'background-color: #ff9e51 !important');
                    $("#row-plan-" + planId).next().attr('style', 'background-color: #ff9e51 !important');
                }
            } else {
                bootbox.alert("Thất bại");
            }
        }
    });
}

$("input[type='checkbox']").change(function() {
    var table = $(this).data("table");
    var checkboxes = $("input[data-table='" + table + "']");
    var countUnchecked = $.grep(checkboxes,
        function(checkbox) {
            return !checkbox.checked;
        }).length;
    if (countUnchecked === 2) {
        $("#" + table + " > tbody > tr").show();
    } else {
        $("#" + table + " > tbody").find("tr[class*='highlight-0']").hide();
        checkboxes.each(function(index, checkbox) {
            var highlight;
            if (checkbox.checked) {
                highlight = $(checkbox).data("highlight");
                $("#" + table + " > tbody").find("tr[class*='highlight-" + highlight + "']").show();
            } else {
                highlight = $(checkbox).data("highlight");
                $("#" + table + " > tbody").find("tr[class*='highlight-" + highlight + "']").hide();
            }
        });
    }
});

function RemindConfirm(type) {
    var tableId = type == 1 ? "listPersonalPlan" : "listDivisionPlan";
    var list = $("#" + tableId + " .not-created-yet");
    var listAm = $.map(list,
        function (val, i) {
            var am = val.getAttribute("data-am");
            return am;
        });
    if (listAm.length > 0) {
        var msg;
        if (type == 1) {
            msg = "Hệ thống sẽ gửi email yêu cầu tạo kế hoạch mới cho các AM: " + listAm.join(", ");
        } else {
            msg = "Hệ thống sẽ gửi email yêu cầu tạo kế hoạch mới cho manager các đơn vị: " + listAm.join(", ");
        }
        bootbox.confirm({
            title: "Yêu cầu tạo kế hoạch",
            message: msg,
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function (result) {
                if (result) {
                    $("#remind").click();
                }
            }
        });
    }
}

function RemindAm(type) {
    var tableId = type == 1 ? "listPersonalPlan" : "listDivisionPlan";
    var list = $("#" + tableId + " .not-created-yet");
    var listAm = $.map(list,
        function(val, i) {
            var am = val.getAttribute("data-am");
            var division = val.getAttribute("data-division");
            return am + "|" + division;
        });
    $("#loading").addClass("loading");
    $.ajax({
        url: $("#urlAjaxRemindAm").val(),
        type: "post",
        dataType: "json",
        data: {
            type: type,
            ams: listAm
        },
        success: function(result) {
            $("#loading").removeClass("loading");
            bootbox.alert(result.Message);
        }
    });
}


function ShowModalReplan() {
    $("#reason").val('');
    $("#rejectReason").modal('show');
    if ($("#errorReject").hasClass("hidden") == false) {
        $("#errorReject").addClass("hidden");
    }
}

function Replan() {
    if ($("#errorReject").hasClass("hidden") == false) {
        $("#errorReject").addClass("hidden");
    }
    var reason = $("#reason").val();
    if (reason != null && reason != "") {
        if ($('#rejectReason').hasClass('in')) {
            $('#rejectReason').modal('hide');
        }
        $("#loading").addClass("loading");
        var objectId = $('#btnReplan').data("planid");
        var moduleId = "Plan";
        var commentContent = $('#reason').val();
        var urlAjaxCreateComment = $('#urlAjaxCreateComment').val();
        $.ajax({
            type: "POST",
            url: urlAjaxCreateComment,
            data: { objectId: objectId, moduleId: moduleId, commentContent: commentContent },
            success: function (result) {
                if (result != null && result.ResultCode == 1) {
                    $("#btnReplan").click();
                } else {
                    console.log("Cant create comment");
                    $("#loading").removeClass("loading");
                    bootbox.alert("Thất bại");
                }
            },
            error: function () {
                console.log("Cant create comment");
                $("#loading").removeClass("loading");
                bootbox.alert("Thất bại");
            }
        });
    } else {
        $("#errorReject").removeClass("hidden");
    }
}