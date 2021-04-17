$(function () {
    $.ajax({
        url: $("#urlAjaxGetPlanDetails").val() + "?planId=" + $("#Id").val(),
        type: 'GET',
        dataType: 'html',
        success: function (res) {
            $("#Container").html(res);
            InitCommentOnReady();
            InitDatePicker();
            SignedContractAbilityChart();
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
});

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

function ShowModal() {
    $("#reason").val('');
    $("#rejectReason").modal('show');
    if ($("#errorReject").hasClass("hidden") == false) {
        $("#errorReject").addClass("hidden");
    }
}

function RejectPlan() {
    if ($("#errorReject").hasClass("hidden") == false) {
        $("#errorReject").addClass("hidden");
    }
    var reason = $("#reason").val();
    if (reason != null && reason != "") {
        if ($('#rejectReason').hasClass('in')) {
            $('#rejectReason').modal('hide');
        }
        $("#loading").addClass("loading");
        var objectId = $('#Id').val();
        var moduleId = "Plan";
        var commentContent = $('#reason').val();
        var urlAjaxCreateComment = $('#urlAjaxCreateComment').val();
        $.ajax({
            type: "POST",
            url: urlAjaxCreateComment,
            data: { objectId: objectId, moduleId: moduleId, commentContent: commentContent },
            success: function(result) {
                if (result != null && result.ResultCode == 1) {
                    $("#btnReject").click();
                } else {
                    console.log("Cant create comment");
                    $("#loading").removeClass("loading");
                    bootbox.alert("Thất bại");
                }
            },
            error: function() {
                console.log("Cant create comment");
                $("#loading").removeClass("loading");
                bootbox.alert("Thất bại");
            }
        });
    } else {
        $("#errorReject").removeClass("hidden");
    }
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
                    var container = params.type == 1 ? "chartPersonal" : "chartDivision";
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

                    //// TODO: chưa làm đc indexlabel nên tạm bỏ
                    //for (var k = 0; k < chart.options.data.length; k++) {
                    //    chart.options.data[k].indexLabel = "";
                    //}
                    chart.render();
                    UpdateIndexLabelPosition(chart);
                }, 100);
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
    var type = $("#planType").val();
    var month = 0;
    var year = 0;
    var selectedDate = $(".datetime-month").datepicker("getDate");
    if (selectedDate != null) {
        month = selectedDate.getMonth() + 1;
        year = selectedDate.getFullYear();
    }
    var planId = $("#Id").val();
    var divisionId = $("#DivisionId").val();
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