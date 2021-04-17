$(function () {
    $('.data-content .nav li a').click(function (e) {
        $('.nav li.active').removeClass('active');
        var $parent = $(this).parent().parent();
        $parent.addClass('active');
        SignedContractAbilityChart();
    });

    $.when(GetPersonalPlanDetails(), GetDivisionPlanDetails()).done(function (r1, r2) {
        InitDatePicker();
        SignedContractAbilityChart();
        var msg = $("#Message").val();
        if (msg != null && msg != "") {
            bootbox.alert(msg);
        }


    }); 
});

$("#PersonalSelect").on("change",
    function () {
        $.when(GetPersonalPlanDetails()).done(function (r1, r2) {
            InitDatePicker();
            SignedContractAbilityChart();
        }); 
    });

function GetPersonalPlanDetails() {
    if ($("#PersonalSelect").length == 1 && $("#PersonalSelect").find("option").length > 0) {
        return $.ajax({
            url: $("#urlAjaxGetPlanDetails").val() + "?type=1&divisionId=" + $("#PersonalSelect").val(),
            type: 'GET',
            dataType: 'html',
            success: function (res) {
                $("#PersonalContainer").html(res);
                InitCommentOnReady();
                $('.history-action').on('click',
                    function () {
                        var input = $(this).find('input');
                        HistoryAction($(input).val());
                    });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
            }
        });
    }
}

$("#DivisionSelect").on("change",
    function () {
        $.when(GetDivisionPlanDetails()).done(function (r1, r2) {
            InitDatePicker();
            SignedContractAbilityChart();
        }); 
    });

function GetDivisionPlanDetails() {
    if ($("#DivisionSelect").length == 1 && $("#DivisionSelect").find("option").length > 0) {
        return $.ajax({
            url: $("#urlAjaxGetPlanDetails").val() + "?type=2&divisionId=" + $("#DivisionSelect").val(),
            type: 'GET',
            dataType: 'html',
            success: function (res) {
                $("#DivisionContainer").html(res);
                InitCommentOnReady();
                $('.history-action').on('click',
                    function () {
                        var input = $(this).find('input');
                        HistoryAction($(input).val());
                    });
            }
        });
    }
}

function EditPlan(planId) {
    console.log("Edit plan " + planId);
    var tabId = $($("li.active").find("a")[0]).attr('href');
    var division = $($(tabId).find("select")[0]).val();
    var url = $("#hostAddress").val();
    if (tabId === "#personalPlan") {
        url += "Plan/Edit?";
    } else if (tabId ==="#divisionPlan") {
        url += "Plan/EditDivisionPlan?";
    }
    url += "division=" + division;
    window.location.href = url;
}

function CancelPlan() {
    if ($("#errorReject").hasClass("hidden") == false) {
        $("#errorReject").addClass("hidden");
    }
    var reason = $("#reason").val();
    if (reason != null && reason != "") {
        if ($('#rejectReason').hasClass('in')) {
            $('#rejectReason').modal('hide');
        }
        $("#loading").addClass("loading");
        var objectId = $('#btnCancel').data("planid");
        var moduleId = "Plan";
        var commentContent = $('#reason').val();
        var urlAjaxCreateComment = $('#urlAjaxCreateComment').val();
        $.ajax({
            type: "POST",
            url: urlAjaxCreateComment,
            data: { objectId: objectId, moduleId: moduleId, commentContent: commentContent },
            success: function (result) {
                if (result != null && result.ResultCode == 1) {
                    $("#btnCancel").click();
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
                bootbox.alert("Thành công", function () {
                    window.location.href = window.location.href;
                });
            } else {
                bootbox.alert("Thất bại");
            }
        }
    });
}

function InitDatePicker() {
    $(".datetime-month").datepicker({
        format: "mm/yyyy",
        viewMode: "months",
        minViewMode: "months",
        autoclose: true,
        showClear: true
    }).on("change", function () {
        SignedContractAbilityChart();
    });
}

function SignedContractAbilityChart() {
    var params = GetParameters();
    if (params != null &&
        params.type > 0 &&
        params.planId != null &&
        params.divisionId > 0 &&
        params.month > 0 &&
        params.year > 0) {
        GetSignedContractAbility(params, function (response) {
            var data = response.Data.SuccessRateSummary;
            var planMonths = response.Data.Plan.PlanMonths;
            var planMonthsDataPoints = $.map(planMonths, function (i) {
                var x = new Date(i.Year, i.Month - 1, 15);
                var y = i.ValueInBillion;
                return { x: x, y: y };
            });
            ////////////////
            var dtp = [];
            var stackedColumns = $.grep(data, function (v) {
                return v.type === "stackedColumn";
            });
            ///////////////
            if (data !== "" && typeof (data) !== "undefined") {
                var indexLabels = $.map(data, function () {
                    return 0;
                });
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].dataPoints.length; j++) {
                        if (data[i].dataPoints[j] != null) {
                            var year = data[i].dataPoints[j].x.split("/")[1];
                            var month = parseInt(data[i].dataPoints[j].x.split("/")[0]);
                            data[i].dataPoints[j].x = new Date(year, month - 1, 1);
                            indexLabels[i] = indexLabels[i] + data[i].dataPoints[j].y;
                        }
                    }
                    //////////////
                    if (data[i].type === "stackedColumn") {
                        var sum = 0;
                        stackedColumns.forEach(function (num) {
                            if (num.type === "stackedColumn") {
                                sum += parseFloat(num.dataPoints[i].y) || 0;
                            }
                        });
                        var yValue = sum / 5;
                        dtp.push({
                            y: yValue,
                            label: "",
                            x: data[i].dataPoints[i].x,
                            indexLabelFontWeight: "bold",
                            indexLabelBackgroundColor: "transparent",
                            indexLabelPlacement: "inside"
                        });
                    }
                    //////////////////////
                }
                for (var g = 0; g < data.length; g++) {
                    if (indexLabels[g] > 0) {
                        data[g].indexLabel = "{y}B";
                    }
                }
                data.push({
                    type: "column",
                    legendText: "Kế hoạch",
                    showInLegend: true,
                    color: "#ff9e51",
                    indexLabel: "{y}B",
                    dataPoints: planMonthsDataPoints
                });

                data.push({
                    type: "stackedColumn",
                    showInLegend: false,
                    color: "transparent",
                    indexLabel: "{y}B",
                    dataPoints: dtp,
                    indexLabelBackgroundColor: "transparent",
                    indexLabelPlacement: "inside"
                });

                // IMPORTANT: k đc bỏ timeout
                setTimeout(function () {
                    var container = params.type === 1 ? "chartPersonal" : "chartDivision";
                    var chart = new CanvasJS.Chart(container, {
                        animationEnabled: true,
                        height: 300,
                        dataPointWidth: 45,
                        axisX: {
                            valueFormatString: "MM",
                            interval: 1,
                            intervalType: "month",
                            prefix: "Tháng "
                        },
                        axisY: {
                            gridThickness: 0,
                            suffix: "B",
                            stripLines: [{
                                color: "black",
                                value: 0,
                                thickness: 1
                            }]
                        },
                        toolTip: {
                            contentFormatter: function (e) {
                                var content = "";
                                // 1 là column kế hoạch
                                if (e.entries.length === 1) {
                                    content = "<b>Kế hoạch</b>:" + e.entries[0].dataPoint.y + "B";
                                } 
                                // stacked column
                                // có 1 data tổng giả nên trừ 1
                                else {
                                    for (var i = 0; i < e.entries.length - 1; i++) {
                                        var entry = e.entries[i];
                                        content += "<b>" + entry.dataSeries.legendText + "</b>: " + entry.dataPoint.y + "B </br>";
                                        if (i === 2) {
                                            content += "<b>Tổng (nhân tỷ lệ): </b>" + entry.dataPoint.total + "B";
                                        }
                                    }
                                }

                                return content;
                            },
                            shared: true
                        },
                        legend: {
                            cursor: "pointer",
                            horizontalAlign: "right",
                            verticalAlign: "center",
                            fontSize: 12,
                            fontFamily: "sans-serif",
                            itemWidth: 140
                        },
                        data: data
                    });
                    chart.render();
                    UpdateIndexLabelPosition(chart);
                }, 300);
            }
        });
    }
}

function GetSignedContractAbility(params, callback) {
    var url = $("#urlAjaxGetChart").val();
    //var loader = $("#loaderDashboard").html();
    var value;
    $.ajax({
        type: "GET",
        url: url,
        data: params,
        success: function (data) {
            value = data;
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return value;
}

function GetParameters() {
    var tabId = $($("li.active").find("a")[0]).attr('href');
    var divisionId = $($(tabId).find("select")[0]).val();
    var type = 0;
    if (tabId === "#personalPlan") {
        type = 1;
    } else if (tabId === "#divisionPlan") {
        type = 2;
    }

    var month = 0;
    var year = 0;
    if ($(tabId + " .datetime-month").length > 0) {
        var selectedDate = $(tabId + " .datetime-month").datepicker("getDate");
        if (selectedDate != null) {
            month = selectedDate.getMonth() + 1;
            year = selectedDate.getFullYear();
        }
    }

    var planId = $(tabId + " #CurrentPlanId").val();
    return { divisionId: divisionId, type: type, month: month, year: year, planId: planId };
}

function UpdateIndexLabelPosition(chart) {
    for (var j = 0; j < chart.data.length; j++) {
        chart.options.data[j].indexLabel = null;
        var maxValue = chart.axisY[0].get("maximum");
        var fixedRatio = 0.08;
        for (var i = 0; i < chart.options.data[j].dataPoints.length; i++) {
            chart.options.data[j].dataPoints[i].indexLabelFontWeight = "bold";
            if (j == 4) {
                chart.options.data[j].dataPoints[i].indexLabel =
                    Number(parseFloat(chart.options.data[j].dataPoints[i].y * 5).toFixed(1)) + "B";
            } else {
                if (chart.options.data[j].dataPoints[i].y / maxValue >= fixedRatio) {
                    chart.options.data[j].dataPoints[i].indexLabel = "{y}B";
                    chart.options.data[j].dataPoints[i].indexLabelPlacement = "inside";
                    chart.options.data[j].dataPoints[i].indexLabelFontColor = "white";
                } else {
                    if (chart.options.data[j].indexLabelBackgroundColor != "transparent") {
                        chart.options.data[j].dataPoints[i].indexLabel = null;
                    }
                }
            }
        }
    }
    
    chart.render();
}

function HistoryAction(planId) {
    $("#loading").addClass("loading");
    $('#historyActionContainer').html('');
    var url = $("#urlAjaxHistoryAction").val() + "?planId=" + planId;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#historyActionContainer').html(data);
            $("#HistoryActionTable").DataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                "bFilter": false
            });
            $("#loading").removeClass("loading");
            $("#historyActionModal").modal('show');
        },
        error: function (res) {
            console.log(res);
            $("#loading").removeClass("loading");
            bootbox.alert("Có lỗi xảy ra. Vui lòng tải lại trang");
        }
    });
}

function ShowModalCancel() {
    $("#reason").val('');
    $("#rejectReason").modal('show');
    if ($("#errorReject").hasClass("hidden") == false) {
        $("#errorReject").addClass("hidden");
    }
}