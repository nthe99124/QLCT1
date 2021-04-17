var firstTime = true;
var hostAddress = $("#hostAddress").val();

$(document).ready(function () {
    if ($("#includeInternal").val().toLowerCase() === "true") {
        $("#SignedSalesIncludeInternal").prop("checked", true);
        $("#GrossProfitIncludeInternal").prop("checked", true);
        $("#TopOppIncludeInternal").prop("checked", true);
    }

    var firstDate = new Date(new Date().getFullYear(), 0, 1);
    var currDate = new Date();
    var date = new Date();
    var beforeDate = date.setDate(date.getDate() - 30);
    var beforeMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    $("#SignedSalesFrom").val(convertDate(firstDate));
    $("#SignedSalesTo").val(convertDate(currDate));
    $("#GrossProfitSignedFrom").val(convertDate(firstDate));
    $("#GrossProfitSignedTo").val(convertDate(currDate));
    $("#TopOppFrom").val(convertDate(firstDate));
    $("#TopOppTo").val(convertDate(currDate));
    $("#TopAccFrom").val(convertDate(firstDate));
    $("#TopAccTo").val(convertDate(currDate));
    $("#OtherFrom").val(convertDate(firstDate));
    $("#OtherTo").val(convertDate(currDate));
    $("#ContactAbilityDate").val(convertMonth(currDate));
    $("#SignedSalesDivisionFrom").val(convertDate(firstDate));
    $("#SignedSalesDivisionTo").val(convertDate(currDate));
    $("#SignedSalesAndGrossProfitChildFrom").val(convertDate(firstDate));
    $("#SignedSalesAndGrossProfitChildTo").val(convertDate(currDate));
    $("#SignedSalesAndGrossProfitSaleManFrom").val(convertDate(firstDate));
    $("#SignedSalesAndGrossProfitSaleManTo").val(convertDate(currDate));
    $("#div-salestageFrom").val(convertDate(firstDate));
    $("#div-salestageTo").val(convertDate(currDate));
    $("#ContactAbilityForDivDate").val(convertMonth(currDate));
    $("#TopOppForDivFrom").val(convertDate(firstDate));
    $("#TopOppForDivTo").val(convertDate(currDate));
    $("#TopAccForDivFrom").val(convertDate(firstDate));
    $("#TopAccForDivTo").val(convertDate(currDate));
    $("#newInforDateFrom").val(convertDate(beforeDate));
    $("#newInforDateTo").val(convertDate(currDate));
    $("#SaleManTaskFrom").val(convertDate(beforeMonth));
    $("#SaleManTaskTo").val(convertDate(currDate));
    $("#OtherForDivFrom").val(convertDate(firstDate));
    $("#OtherForDivTo").val(convertDate(currDate));


    //var report_salesmanId = $('#report_salesmanId').val();
    //if (report_salesmanId > 0) {
    //    $('#lstAmId').val(report_salesmanId);
    //    $('#lstAmId').trigger('change');
    //}

    $(".datetime-month").datepicker({
        format: "mm/yyyy",
        viewMode: "months",
        minViewMode: "months",
        autoclose: true,
        showClear: true
    });

    $('.datetime-full').datepicker({
        format: "dd/mm/yyyy",
        viewMode: "",
        minViewMode: "",
        autoclose: true,
        showClear: true
    });



    var isManager = $("#isManager").val();
    var report_salesmanId = $('#report_salesmanId').val();
    if (isManager != undefined && isManager != null && isManager !== "" && isManager === 'True' && report_salesmanId <= 0) {
        $('#divisionDashboardArea').click();
        //LoadDivisionDashboard(divId);
    } else {
        if (report_salesmanId > 0) {
            $('#lstAmId').val(report_salesmanId);
            $('#lstAmId').trigger('change');
        } else {
            LoadPersonalDashboard(firstDate, currDate);
        }
    }
    firstTime = false;
    $("[data-toggle='tooltip']").tooltip();


});
function SelectedTagsChanged(e) {
    var objSelect = $(e);
    if (objSelect) {
        var value = objSelect.val();
        var valueTags = '';
        if (!!value) {
            valueTags = value.join(',');
        }
        $('#data_dashboard_Tags').val(valueTags);
        var objTabDivision = $('#divisionDashboard');
        var timee = new Timeout(function () {
            var divId = parseInt($("#lstDivId").val());
            LoadDivisionDashboard(divId);
        }, 2000);
        if (!!window.time) {
            window.time.clear();
        }
        window.time = timee;

    }
}

function SelectedTagsPerChanged(e) {
    var objSelect = $(e);
    if (objSelect) {
        var value = objSelect.val();
        var valueTags = !!value ? value.join(',') : '';
        $('#data_dashboard_per_Tags').val(valueTags);
        var objTabpersion = $('#personalDashboard');
        if (objTabpersion.hasClass('active')) {
            var timee = new Timeout(function () {
                var uid = $("#lstAmId").val();
                LoadPersonalDashboard(uid);
            }, 2000);
            if (!!window.time) {
                window.time.clear();
            }
            window.time = timee;
        }

    }
}

$(document).on("click", "#divisionDashboardArea", function () {
    var divId = parseInt($("#lstDivId").val());
    LoadDivisionDashboard(divId);
});

$(document).on("click", "#personalDashboardArea", function () {
    LoadPersonalDashboard();
});

function LoadPersonalDashboard(uid) {
    var tagValue = $('#data_dashboard_Tags').val();
    if (!!tagValue) {
        if (!$('.data-content .tab-pane.active .box-hidden-for-select-tag').hasClass('hidden')) {
            $('.data-content .tab-pane.active .box-hidden-for-select-tag').addClass('hidden');
        }
    } else {
        $('.data-content .tab-pane.active .box-hidden-for-select-tag').removeClass('hidden');
    }
    uid = uid == undefined ? 0 : uid;
    GetSignedSalesInfor(uid);
    GetGrossProfitInfor(uid);
    SignedContractAbility(uid);
    InitSaleStageClassifyArea(uid);
    GetTopOpp(uid);
    GetTopAcc(uid);
    GetOtherInfor(uid);
}

function LoadDivisionDashboard(divId) {
    var tagValue = $('#data_dashboard_Tags').val();
    if (!!tagValue) {
        if (!$('.data-content .tab-pane.active .box-hidden-for-select-tag').hasClass('hidden')) {
            $('.data-content .tab-pane.active .box-hidden-for-select-tag').addClass('hidden');
            $('.data-content .tab-pane.active .box-custome-height-select-tag').addClass('height-400');
        }
    } else {
        $('.data-content .tab-pane.active .box-hidden-for-select-tag').removeClass('hidden');
        $('.data-content .tab-pane.active .box-custome-height-select-tag').removeClass('height-400');
    }
    GetSignedSalesAndGrossProfitInfor(divId);
    var viewMode = $("#viewMode").val();
    if (viewMode === "chart") {
        InitSignedSaleAndGrossProfitByChild(divId);
    } else if (viewMode === "table") {
        $("#chartArea").addClass("hidden");
        $("#ViewasTable").addClass("hidden");
        var url = $("#urlViewAsTable").val();
        //var divId = parseInt($("#lstDivId").val());
        var fromDate = $("#SignedSalesAndGrossProfitChildFrom").val();
        var toDate = $("#SignedSalesAndGrossProfitChildTo").val();
        var loader = $("#loaderDashboard").html();
        $("#tableArea").removeClass("hidden");
        $("#ViewasChart").removeClass("hidden");
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                //$("#tableArea").empty().append(loader);
                $("#SignedSalesAndGrossProfitChild-Form").addClass("hidden");
                $("#SignedSalesAndGrossProfitChild-Area").append(loader);
                $("#lstDivId").attr("disabled", true);
            },
            data: {
                'divId': divId,
                'fromDate': fromDate,
                'toDate': toDate
            },
            success: function (data) {
                $("#viewMode").val("table");
                $("#SignedSalesAndGrossProfitChild-Area").children()[1].remove();
                $("#SignedSalesAndGrossProfitChild-Form").removeClass("hidden");
                $("#lstDivId").attr("disabled", false);
                $("#tableArea").empty().append(data);
                $("#viewastable").DataTable({
                    scrollY: "240px",
                    scrollCollapse: true,
                    scrollX: true,
                    fixedColumns: {
                        leftColumns: 1
                    },
                    paging: false,
                    "searching": false,
                    "ordering": false,
                    "info": false
                });
            }
        });
    }
    InitSignedSaleAndGrossProfitBySaleMan(divId);
    InitSaleStageClassifyForDiv(divId);
    var viewMode2 = $("#viewMode2").val();
    if (viewMode2 === "chart") {
        SignedContractAbilityForDiv(divId);
    } else if (viewMode2 === "table") {
        $("#chartArea2").addClass("hidden");
        $("#ViewasTable2").addClass("hidden");
        $("#tableArea2").removeClass("hidden");
        $("#ViewasChart2").removeClass("hidden");
        var url = $("#urlViewAsTable2").val();
        var divId = parseInt($("#lstDivId").val());
        var month = $("#ContactAbilityForDivDate").val();
        var loader = $("#loaderDashboard").html();
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                //$("#tableArea").empty().append(loader);
                $("#ContactAbilityForDiv-Form").addClass("hidden");
                $("#ContactAbilityForDiv-Area").append(loader);
                $("#lstDivId").attr("disabled", true);
            },
            data: {
                'divId': divId,
                'month': month
            },
            success: function (data) {
                $("#viewMode2").val("table");
                $("#ContactAbilityForDiv-Area").children()[1].remove();
                $("#ContactAbilityForDiv-Form").removeClass("hidden");
                $("#lstDivId").attr("disabled", false);
                $("#tableArea2").empty().append(data);
                $("#viewastable2").DataTable({
                    scrollY: "200px",
                    scrollCollapse: true,
                    scrollX: true,
                    fixedColumns: {
                        leftColumns: 1
                    },
                    paging: false,
                    "searching": false,
                    "ordering": false,
                    "info": false
                });

                var currentMonthSignedSale = $("#CurrentMonthSignedSale").val();
                if (currentMonthSignedSale > 0) {
                    $(".contactability-sale").removeClass("hidden");
                    $("#currentMonth").html(month);
                    $(".currentSignedSale").html(currentMonthSignedSale + "B");
                } else {
                    $(".contactability-sale").addClass("hidden");
                }
            }
        });
    }
    InitNewInfor(divId);
    InitSaleManTaskInfor(divId);
    GetTopOppForDiv(divId);
    GetTopAccForDiv(divId);
    GetOtherInforForDiv(divId);
}

$(document).on("change", "#lstAmId", function () {
    var uid = $("#lstAmId").val();
    LoadPersonalDashboard(uid);
});

//Load personal dashboard
function GetSignedSalesInfor(uid) {
    var url = $("#urlGetSignedSalesInfor").val();
    var tags = $('#data_dashboard_per_Tags').val();
    var signedSalesFrom = $("#SignedSalesFrom").val();
    var signedSalesTo = $("#SignedSalesTo").val();

    var loader = $("#loaderDashboard").html();
    var includeInternal = false;
    if ($("#SignedSalesIncludeInternal").is(':checked')) {
        includeInternal = true;

    }

    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SignedSales-Form").addClass("hidden");
            $("#SignedSales-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        data: {
            'signedSalesFrom': signedSalesFrom,
            'signedSalesTo': signedSalesTo,
            'includeInternal': includeInternal,
            'uid': uid,
            'tags': tags
        },
        success: function (data) {
            $("#SignedSales-Area").children()[1].remove();
            $("#SignedSales-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            $("#SignedSalesTotal").html(data.Total.toFixed(1));
            $("#SignedSalesHw").html(data.Hw.toFixed(1));
            $("#SignedSalesSw").html(data.Sw.toFixed(1));
            $("#SignedSalesSrv").html(data.Srv.toFixed(1));
            $("#SignedSalesGrowthRate").html(data.GrowthRate.toFixed(1) + "%");
            if (data.GrowthRate >= 0) {
                $("#SignedSalesGrowthRate").css("color", "#70ad47");
            } else {
                $("#SignedSalesGrowthRate").css("color", "#ff0000");
            }

            $("#SignedSalesPlan").html(data.Plan.toFixed(1) + " B");

            if (data.Plan > 0) {
                $("#SignedSalesPlanPercent").html("(" + data.PlanPercent.toFixed(1) + "%)");
                if (data.PlanPercent > 0) {
                    $("#SignedSalesPlanPercent").css("color", "#70ad47");
                } else {
                    $("#SignedSalesPlanPercent").css("color", "#ff0000");
                }
            }

            if ($("#SignedSalesIncludeInternal").is(':checked')) {
                $("#SignedSalesPlanArea").addClass("hidden");
            } else {
                $("#SignedSalesPlanArea").removeClass("hidden");
            }
        }
    });
}

$(document).on("changeDate", "#SignedSalesFrom,#SignedSalesTo", function () {
    if (!firstTime) {
        if ($("#SignedSalesFrom").val() !== "" && $("#SignedSalesTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetSignedSalesInfor(uid);
        }
    }
});

$(document).on("change", "#SignedSalesIncludeInternal", function () {
    if (!firstTime) {
        if ($("#SignedSalesFrom").val() !== "" && $("#SignedSalesTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetSignedSalesInfor(uid);
        }


    }
});

function GetGrossProfitInfor(uid) {
    var url = $("#urlGetGrossProfitInfor").val();
    var tags = $('#data_dashboard_per_Tags').val();
    var grossProfitFrom = $("#GrossProfitSignedFrom").val();
    var grossProfitTo = $("#GrossProfitSignedTo").val();
    var loader = $("#loaderDashboard").html();
    var includeInternal = false;

    if ($("#GrossProfitIncludeInternal").is(":checked")) {
        includeInternal = true;
    }

    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#GrossProfitSigned-Form").addClass("hidden");
            $("#GrossProfitSigned-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        data: {
            'grossProfitFrom': grossProfitFrom,
            'grossProfitTo': grossProfitTo,
            'includeInternal': includeInternal,
            'uid': uid,
            'tags': tags
        },
        success: function (data) {
            $("#GrossProfitSigned-Area").children()[1].remove();
            $("#GrossProfitSigned-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            $("#GrossProfitTotal").html(data.Total.toFixed(1));
            $("#GrossProfitHw").html(data.Hw.toFixed(1));
            $("#GrossProfitSw").html(data.Sw.toFixed(1));
            $("#GrossProfitSrv").html(data.Srv.toFixed(1));
            $("#GrossProfitGrowthRate").html(data.GrowthRate.toFixed(1) + "%");
            if (data.GrowthRate >= 0) {
                $("#GrossProfitGrowthRate").css("color", "#70ad47");
            } else {
                $("#GrossProfitGrowthRate").css("color", "#ff0000");
            }

            $("#GrossProfitPlan").html(data.Plan.toFixed(1) + " B");
            if (data.Plan > 0) {
                $("#GrossProfitPlanPercent").html("(" + data.PlanPercent.toFixed(1) + "%)");
                if (data.PlanPercent >= 0) {
                    $("#GrossProfitPlanPercent").css("color", "#70ad47");
                } else {
                    $("#GrossProfitPlanPercent").css("color", "#ff0000");
                }
            }

            if ($("#GrossProfitIncludeInternal").is(':checked')) {
                $("#GrossProfitPlanArea").addClass("hidden");
            } else {
                $("#GrossProfitPlanArea").removeClass("hidden");
            }
        }
    });
}

$(document).on("changeDate", "#GrossProfitSignedFrom,#GrossProfitSignedTo", function () {
    if (!firstTime) {
        if ($("#GrossProfitSignedFrom").val() !== "" && $("#GrossProfitSignedTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetGrossProfitInfor(uid);
        }
    }
});

$(document).on("change", "#GrossProfitIncludeInternal", function () {
    if (!firstTime) {
        if ($("#GrossProfitSignedFrom").val() !== "" && $("#GrossProfitSignedTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetGrossProfitInfor(uid);
        }
    }
});

function SignedContractAbility(uid) {
    var month = $("#ContactAbilityDate").val();
    var tags = $('#data_dashboard_per_Tags').val();
    //var data = GetSignedContractAbility(month, uid);
    GetSignedContractAbility(month, uid, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].dataPoints.length; j++) {
                    if (data[i].dataPoints[j] != null) {
                        data[i].dataPoints[j].x = new Date(data[i].dataPoints[j].x.split("/")[1],
                            parseInt(data[i].dataPoints[j].x.split("/")[0]) - 1, 1);
                        if (data[i].dataPoints[j].total > 0) {
                            total = data[i].dataPoints[j].total;
                        }
                    }
                }
            }

            if (total > 0) {
                $(".contactability-sale-personal").removeClass("hidden");
                $("#currentMonth-personal").html(month);
                $(".currentSignedSale-personal").html(total + "B");
            } else {
                $(".contactability-sale-personal").addClass("hidden");
            }

            var chart = new CanvasJS.Chart("chartSignedContractAbility",
                {
                    animationEnabled: true,
                    axisX: {
                        valueFormatString: "MM",
                        interval: 1,
                        intervalType: "month",
                        prefix: "Tháng ",
                        reversed: true
                    },
                    axisY: {
                        gridThickness: 0,
                        suffix: "B",
                        stripLines: [{
                            color: "black",
                            value: 0,
                            thickness: 1
                            //lineDashType: "longDashDot"
                        }]
                    },
                    toolTip: {
                        //enabled: false,   
                        content: "<b>{legendText}</b>: {y} B",
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
            for (var k = 0; k < chart.options.data[0].dataPoints.length; k++) {
                if (chart.options.data[0].dataPoints[k].y === 0)
                    chart.options.data[0].dataPoints[k].indexLabel = "";
            }

            setTimeout(function () {
                chart.render();
            },
                300);
        }
    });
}

function GetSignedContractAbility(month, uid, callback) {
    var url = $("#urlGetSignedContractAbility").val();
    var loader = $("#loaderDashboard").html();
    var value;
    var tags = $('#data_dashboard_per_Tags').val();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#ContactAbility-Form").addClass("hidden");
            $("#ContactAbility-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        data: {
            'month': month,
            'uid': uid,
            'tags': tags
        },
        success: function (data) {
            value = data;
            $("#ContactAbility-Area").children()[1].remove();
            $("#ContactAbility-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return value;
}

$(document).on("changeDate", "#ContactAbilityDate", function () {
    if (!firstTime) {
        if ($("#ContactAbilityDate").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            SignedContractAbility(uid);
        }
    }
});

function InitSaleStageClassifyArea(uid) {
    //var data = GetSaleStageClassify(uid);
    GetSaleStageClassify(uid, function (data) {
        //if (data !== "" && typeof (data) !== "undefined") {
        //    if (data.ListBidSaleStageInfor !== null && data.ListBidSaleStageInfor.length > 0) {
        //        var check = false;
        //        for (var i = 0; i < data.ListBidSaleStageInfor.length; i++) {
        //            if (data.ListBidSaleStageInfor[i].y > 0) {
        //                check = true;
        //            }
        //        }
        //        if (check) {

        //        }
        //    }
        //    if (data.ListNoBidSaleStageInfor !== null && data.ListNoBidSaleStageInfor.length > 0) {
        //        var check = false;
        //        for (var i = 0; i < data.ListNoBidSaleStageInfor.length; i++) {
        //            if (data.ListNoBidSaleStageInfor[i].y > 0) {
        //                check = true;
        //            }
        //        }
        //        if (check) {

        //        }
        //    }
        //} else {
        //    $("#chartBidOpp").empty();
        //    $("#chartNoBidOpp").empty();
        //}

        BidOpp(data.ListBidSaleStageInfor);
        NoBidOpp(data.ListNoBidSaleStageInfor);
    });
}

function GetSaleStageClassify(uid, callback) {
    var url = $("#urlGetSaleStageClassify").val();
    var value;
    var loader = $("#loaderDashboard").html();
    var tags = $('#data_dashboard_per_Tags').val();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SaleStageClassify-Form").addClass("hidden");
            $("#SaleStageClassify-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        data: {
            'uid': uid,
            'tags': tags
        },
        success: function (data) {
            value = data;
            $("#SaleStageClassify-Area").children()[1].remove();
            $("#SaleStageClassify-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return value;
}

function BidOpp(data) {
    var chart = new CanvasJS.Chart("chartBidOpp", {
        //theme: "dark2",
        //exportFileName: "Doughnut Chart",
        //exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Cơ hội có đấu thầu",
            horizontalAlign: "left",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        legend: {
            cursor: "pointer",
            horizontalAlign: "right",
            verticalAlign: "center",
            fontSize: 12,
            fontFamily: "'Open Sans', sans-serif"
        },
        data: [{
            type: "doughnut",
            innerRadius: 45,
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: {y} (#percent%)",
            indexLabel: "",
            indexLabelFontSize: 11,
            dataPoints: data
        }]
    });

    for (var i = 0; i < chart.options.data[0].dataPoints.length; i++) {
        if (chart.options.data[0].dataPoints[i].y > 0)
            chart.options.data[0].dataPoints[i].indexLabel = "{y} B";
    }
    setTimeout(function () {
        chart.render();
    }, 300);
}

function NoBidOpp(data) {
    var chart = new CanvasJS.Chart("chartNoBidOpp", {
        //theme: "dark2",
        //exportFileName: "Doughnut Chart",
        //exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Cơ hội không đấu thầu",
            horizontalAlign: "left",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        legend: {
            cursor: "pointer",
            horizontalAlign: "right",
            verticalAlign: "center",
            fontSize: 12,
            fontFamily: "'Open Sans', sans-serif",
            itemWidth: 150
            //itemclick: explodePie
        },
        data: [{
            type: "doughnut",
            innerRadius: 45,
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: {y} (#percent%)",
            indexLabel: "",
            indexLabelFontSize: 11,
            dataPoints: data
        }]
    });

    for (var i = 0; i < chart.options.data[0].dataPoints.length; i++) {
        if (chart.options.data[0].dataPoints[i].y > 0)
            chart.options.data[0].dataPoints[i].indexLabel = "{y} B";
    }

    setTimeout(function () {
        chart.render();
    }, 300);
}

function GetTopOpp(uid) {
    var url = $("#urlGetTopOpp").val();

    var fromDate = $("#TopOppFrom").val();
    var toDate = $("#TopOppTo").val();
    var loader = $("#loaderDashboard").html();
    var includeInternal = false;
    var tags = $('#data_dashboard_per_Tags').val();
    if ($("#TopOppIncludeInternal").is(':checked')) {
        includeInternal = true;
    }
    var tags = $('#data_dashboard_per_Tags').val();

    $.ajax({
        type: "GET",
        //async: false,
        beforeSend: function () {
            $("#TopOpp-Form").addClass("hidden");
            $("#TopOpp-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        url: url,
        data: {
            'fromDate': fromDate,
            'toDate': toDate,
            'includeInternal': includeInternal,
            'uid': uid,
            'tags': tags
        },
        success: function (data) {
            $("#TopOpp-Area").children()[1].remove();
            $("#TopOpp-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            var str = "";
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    str += "<tr>";
                    str += "<td> <a target='_blank' href='" + hostAddress + "/Opportunities/Details?oppId=" + data[i].OppId + "'> " + data[i].Name + "</a> </td>";
                    str += "<td> " + data[i].AccName + "</td>";
                    str += "<td class='text-right'> " + data[i].DisplayValue + "</td>";
                    str += "</tr>";
                }

            }
            else {
                str += "<tr>";
                str += "<td colspan='3'>Không có dữ liệu</td>";
                str += "</tr>";
            }
            $("#TopOpp-tr").empty().append(str);

        }
    });
}

$(document).on("changeDate", "#TopOppFrom,#TopOppTo", function () {
    if (!firstTime) {
        if ($("#TopOppFrom").val() !== "" && $("#TopOppTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetTopOpp(uid);
        }
    }
});

$(document).on("change", "#TopOppIncludeInternal", function () {
    if (!firstTime) {
        if ($("#TopOppFrom").val() !== "" && $("#TopOppTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetTopOpp(uid);
        }
    }
});

function GetTopAcc(uid) {
    var url = $("#urlGetTopAcc").val();
    var loader = $("#loaderDashboard").html();
    var fromDate = $("#TopAccFrom").val();
    var toDate = $("#TopAccTo").val();
    $.ajax({
        type: "GET",
        //async: false,
        beforeSend: function () {
            $("#TopAcc-Form").addClass("hidden");
            $("#TopAcc-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        url: url,
        data: {
            'fromDate': fromDate,
            'toDate': toDate,
            'uid': uid
        },
        success: function (data) {
            $("#TopAcc-Area").children()[1].remove();
            $("#TopAcc-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            var str = "";
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    str += "<tr>";
                    str += "<td> <a target='_blank' href='" + hostAddress + "/Accounts/Details?AccountId=" + data[i].AccId + "'> " + data[i].AccName + "</a> </td>";
                    str += "<td class='text-right'> " + data[i].SuccessContract + "</td>";
                    str += "<td class='text-right'> " + data[i].DisplayValue + "</td>";
                    str += "</tr>";
                }

            }
            else {
                str += "<tr>";
                str += "<td colspan='3'>Không có dữ liệu</td>";
                str += "</tr>";
            }
            $("#TopAcc-tr").empty().append(str);

        }
    });
}

$(document).on("changeDate", "#TopAccFrom,#TopAccTo", function () {
    if (!firstTime) {
        if ($("#TopAccFrom").val() !== "" && $("#TopAccTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetTopAcc(uid);
        }
    }
});

function GetOtherInfor(uid) {
    var url = $("#urlGetOtherInfor").val();

    var fromDate = $("#OtherFrom").val();
    var toDate = $("#OtherTo").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#Other-Form").addClass("hidden");
            $("#Other-Area").append(loader);
            $("#lstAmId").attr("disabled", true);
        },
        data: {
            'fromDate': fromDate,
            'toDate': toDate,
            'uid': uid
        },
        success: function (data) {
            $("#Other-Area").children()[1].remove();
            $("#Other-Form").removeClass("hidden");
            $("#lstAmId").attr("disabled", false);
            if (data !== "") {
                $("#AccQuatity").html(data.AccQuatity);
                $("#SuccessContractRate").html(data.SuccessContractRate);
                $("#SuccessOppQuatity").html(data.SuccessOppQuatity);
                $("#AverageValue").html(data.AverageValue);
                $("#AverageTime").html(data.AverageTime);
            }
        }
    });
}

$(document).on("changeDate", "#OtherFrom,#OtherTo", function () {
    if (!firstTime) {
        if ($("#OtherFrom").val() !== "" && $("#OtherTo").val() !== "") {
            var uid = 0;
            if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
                uid = $("#lstAmId").val();
            }
            GetOtherInfor(uid);
        }
    }
});

//Load division dashboard
function GetSignedSalesAndGrossProfitInfor(divId) {
    var url = $("#urlGetSignedSalesAndGrossProfit").val();
    var tags = $('#data_dashboard_Tags').val();
    var fromDate = $("#SignedSalesDivisionFrom").val();
    var toDate = $("#SignedSalesDivisionTo").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SignedSalesDivision-Form").addClass("hidden");
            $("#SignedSalesDivision-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate,
            'tags': tags
        },
        success: function (data) {
            $("#SignedSalesDivision-Area").children()[1].remove();
            $("#SignedSalesDivision-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            if (data !== "") {
                if (data.SignedSales !== null) {
                    $("#div-signedsales").html(data.SignedSales.Total.toFixed(1));
                    $("#div-signedsales-hw").html(data.SignedSales.Hw.toFixed(1));
                    $("#div-signedsales-sw").html(data.SignedSales.Sw.toFixed(1));
                    $("#div-signedsales-srv").html(data.SignedSales.Srv.toFixed(1));
                    if (data.SignedSales.GrowthRate >= 0) {
                        $("#increase-signedsales").removeClass("hidden");
                        $("#reduction-signedsales").addClass("hidden");
                        $("#increase-signedsales-val").html(data.SignedSales.GrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-signedsales").removeClass("hidden");
                        $("#increase-signedsales").addClass("hidden");
                        $("#reduction-signedsales-val").html(data.SignedSales.GrowthRate.toFixed(1) + "%");
                    }
                    if (data.SignedSales.HwGrowthRate >= 0) {
                        $("#increase-signedsales-hw").removeClass("hidden");
                        $("#reduction-signedsales-hw").addClass("hidden");
                        $("#increase-signedsales-hw-val").html(data.SignedSales.HwGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-signedsales-hw").removeClass("hidden");
                        $("#increase-signedsales-hw").addClass("hidden");
                        $("#reduction-signedsales-hw-val").html(data.SignedSales.HwGrowthRate.toFixed(1) + "%");
                    }
                    if (data.SignedSales.SwGrowthRate >= 0) {
                        $("#increase-signedsales-sw").removeClass("hidden");
                        $("#reduction-signedsales-sw").addClass("hidden");
                        $("#increase-signedsales-sw-val").html(data.SignedSales.SwGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-signedsales-sw").removeClass("hidden");
                        $("#increase-signedsales-sw").addClass("hidden");
                        $("#reduction-signedsales-sw-val").html(data.SignedSales.SwGrowthRate.toFixed(1) + "%");
                    }
                    if (data.SignedSales.SrvGrowthRate >= 0) {
                        $("#increase-signedsales-srv").removeClass("hidden");
                        $("#reduction-signedsales-srv").addClass("hidden");
                        $("#increase-signedsales-srv-val").html(data.SignedSales.SrvGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-signedsales-srv").removeClass("hidden");
                        $("#increase-signedsales-srv").addClass("hidden");
                        $("#reduction-signedsales-srv-val").html(data.SignedSales.SrvGrowthRate.toFixed(1) + "%");
                    }
                } else {
                    $("#div-signedsales").html(0);
                    $("#div-signedsales-hw").html(0);
                    $("#div-signedsales-sw").html(0);
                    $("#div-signedsales-srv").html(0);
                    $("#increase-signedsales").removeClass("hidden");
                    $("#reduction-signedsales").addClass("hidden");
                    $("#increase-signedsales-val").html("0%");
                    $("#increase-signedsales-hw").removeClass("hidden");
                    $("#reduction-signedsales-hw").addClass("hidden");
                    $("#increase-signedsales-hw-val").html("0%");
                    $("#increase-signedsales-sw").removeClass("hidden");
                    $("#reduction-signedsales-sw").addClass("hidden");
                    $("#increase-signedsales-sw-val").html("0%");
                    $("#increase-signedsales-srv").removeClass("hidden");
                    $("#reduction-signedsales-srv").addClass("hidden");
                    $("#increase-signedsales-srv-val").html("0%");
                }

                if (data.GrossProfit !== null) {
                    $("#div-grossprofit").html(data.GrossProfit.Total.toFixed(1));
                    $("#div-grossprofit-hw").html(data.GrossProfit.Hw.toFixed(1));
                    $("#div-grossprofit-sw").html(data.GrossProfit.Sw.toFixed(1));
                    $("#div-grossprofit-srv").html(data.GrossProfit.Srv.toFixed(1));
                    if (data.GrossProfit.GrowthRate >= 0) {
                        $("#increase-grossprofit").removeClass("hidden");
                        $("#reduction-grossprofit").addClass("hidden");
                        $("#increase-grossprofit-val").html(data.GrossProfit.GrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-grossprofit").removeClass("hidden");
                        $("#increase-grossprofit").addClass("hidden");
                        $("#reduction-grossprofit-val").html(data.GrossProfit.GrowthRate.toFixed(1) + "%");
                    }
                    if (data.GrossProfit.HwGrowthRate >= 0) {
                        $("#increase-grossprofit-hw").removeClass("hidden");
                        $("#reduction-grossprofit-hw").addClass("hidden");
                        $("#increase-grossprofit-hw-val").html(data.GrossProfit.HwGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-grossprofit-hw").removeClass("hidden");
                        $("#increase-grossprofit-hw").addClass("hidden");
                        $("#reduction-grossprofit-hw-val").html(data.GrossProfit.HwGrowthRate.toFixed(1) + "%");
                    }
                    if (data.GrossProfit.SwGrowthRate >= 0) {
                        $("#increase-grossprofit-sw").removeClass("hidden");
                        $("#reduction-grossprofit-sw").addClass("hidden");
                        $("#increase-grossprofit-sw-val").html(data.GrossProfit.SwGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-grossprofit-sw").removeClass("hidden");
                        $("#increase-grossprofit-sw").addClass("hidden");
                        $("#reduction-grossprofit-sw-val").html(data.GrossProfit.SwGrowthRate.toFixed(1) + "%");
                    }
                    if (data.GrossProfit.SrvGrowthRate >= 0) {
                        $("#increase-grossprofit-srv").removeClass("hidden");
                        $("#reduction-grossprofit-srv").addClass("hidden");
                        $("#increase-grossprofit-srv-val").html(data.GrossProfit.SrvGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-grossprofit-srv").removeClass("hidden");
                        $("#increase-grossprofit-srv").addClass("hidden");
                        $("#reduction-grossprofit-srv-val").html(data.GrossProfit.SrvGrowthRate.toFixed(1) + "%");
                    }
                } else {
                    $("#div-grossprofit").html(0);
                    $("#div-grossprofit-hw").html(0);
                    $("#div-grossprofit-sw").html(0);
                    $("#div-grossprofit-srv").html(0);
                    $("#increase-grossprofit").removeClass("hidden");
                    $("#reduction-grossprofit").addClass("hidden");
                    $("#increase-grossprofit-val").html("0%");
                    $("#increase-grossprofit-hw").removeClass("hidden");
                    $("#reduction-grossprofit-hw").addClass("hidden");
                    $("#increase-grossprofit-hw-val").html("0%");
                    $("#increase-grossprofit-sw").removeClass("hidden");
                    $("#reduction-grossprofit-sw").addClass("hidden");
                    $("#increase-grossprofit-sw-val").html("0%");
                    $("#increase-grossprofit-srv").removeClass("hidden");
                    $("#reduction-grossprofit-srv").addClass("hidden");
                    $("#increase-grossprofit-srv-val").html("0%");
                }


                if (data.Margin !== null) {
                    $("#div-margin").html(data.Margin.Total.toFixed(1));
                    $("#div-margin-hw").html(data.Margin.Hw.toFixed(1) + "%");
                    $("#div-margin-sw").html(data.Margin.Sw.toFixed(1) + "%");
                    $("#div-margin-srv").html(data.Margin.Srv.toFixed(1) + "%");
                    if (data.Margin.GrowthRate >= 0) {
                        $("#increase-margin").removeClass("hidden");
                        $("#reduction-margin").addClass("hidden");
                        $("#increase-margin-val").html(data.Margin.GrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-margin").removeClass("hidden");
                        $("#increase-margin").addClass("hidden");
                        $("#reduction-margin-val").html(data.Margin.GrowthRate.toFixed(1) + "%");
                    }
                    if (data.Margin.HwGrowthRate >= 0) {
                        $("#increase-margin-hw").removeClass("hidden");
                        $("#reduction-margin-hw").addClass("hidden");
                        $("#increase-margin-hw-val").html(data.Margin.HwGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-margin-hw").removeClass("hidden");
                        $("#increase-margin-hw").addClass("hidden");
                        $("#reduction-margin-hw-val").html(data.Margin.HwGrowthRate.toFixed(1) + "%");
                    }
                    if (data.Margin.SwGrowthRate >= 0) {
                        $("#increase-margin-sw").removeClass("hidden");
                        $("#reduction-margin-sw").addClass("hidden");
                        $("#increase-margin-sw-val").html(data.Margin.SwGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-margin-sw").removeClass("hidden");
                        $("#increase-margin-sw").addClass("hidden");
                        $("#reduction-margin-sw-val").html(data.Margin.SwGrowthRate.toFixed(1) + "%");
                    }
                    if (data.Margin.SrvGrowthRate >= 0) {
                        $("#increase-margin-srv").removeClass("hidden");
                        $("#reduction-margin-srv").addClass("hidden");
                        $("#increase-margin-srv-val").html(data.Margin.SrvGrowthRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-margin-srv").removeClass("hidden");
                        $("#increase-margin-srv").addClass("hidden");
                        $("#reduction-margin-srv-val").html(data.Margin.SrvGrowthRate.toFixed(1) + "%");
                    }
                } else {
                    $("#div-margin").html(0);
                    $("#div-margin-hw").html(0 + "%");
                    $("#div-margin-sw").html(0 + "%");
                    $("#div-margin-srv").html(0 + "%");
                    $("#increase-margin").removeClass("hidden");
                    $("#reduction-margin").addClass("hidden");
                    $("#increase-margin-val").html("0%");
                    $("#increase-margin-hw").removeClass("hidden");
                    $("#reduction-margin-hw").addClass("hidden");
                    $("#increase-margin-hw-val").html("0%");
                    $("#increase-margin-sw").removeClass("hidden");
                    $("#reduction-margin-sw").addClass("hidden");
                    $("#increase-margin-sw-val").html("0%");
                    $("#increase-margin-srv").removeClass("hidden");
                    $("#reduction-margin-srv").addClass("hidden");
                    $("#increase-margin-srv-val").html("0%");
                }

                if (data.Plan !== null) {
                    $("#plan-ss-val").html(data.Plan.PlanSignedSales.toFixed(1) + " B");
                    $("#plan-gp-val").html(data.Plan.PlanGrossProfit.toFixed(1) + " B");
                    if (data.Plan.PlanSignedSalesRate > 0) {
                        $("#increase-plan-ss").removeClass("hidden");
                        $("#reduction-plan-ss").addClass("hidden");
                        $("#increase-plan-ss-val").html(data.Plan.PlanSignedSalesRate.toFixed(1) + "%");
                    } else if (data.Plan.PlanSignedSalesRate < 0) {
                        $("#reduction-plan-ss").removeClass("hidden");
                        $("#increase-plan-ss").addClass("hidden");
                        $("#reduction-plan-ss-val").html(data.Plan.PlanSignedSalesRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-plan-ss").addClass("hidden");
                        $("#increase-plan-ss").addClass("hidden");
                    }
                    if (data.Plan.PlanGrossProfitRate > 0) {
                        $("#increase-plan-gp").removeClass("hidden");
                        $("#reduction-plan-gp").addClass("hidden");
                        $("#increase-plan-gp-val").html(data.Plan.PlanGrossProfitRate.toFixed(1) + "%");
                    } else if (data.Plan.PlanGrossProfitRate < 0) {
                        $("#reduction-plan-gp").removeClass("hidden");
                        $("#increase-plan-gp").addClass("hidden");
                        $("#reduction-plan-gp-val").html(data.Plan.PlanGrossProfitRate.toFixed(1) + "%");
                    } else {
                        $("#reduction-plan-gp").addClass("hidden");
                        $("#increase-plan-gp").addClass("hidden");
                    }
                } else {
                    $("#plan-ss-val").html(0 + "B");
                    $("#plan-gp-val").html(0 + "B");
                    $("#increase-plan-ss").addClass("hidden");
                    $("#reduction-plan-ss").addClass("hidden");
                    $("#increase-plan-ss-val").html("0%");
                    $("#increase-plan-gp").addClass("hidden");
                    $("#reduction-plan-gp").addClass("hidden");
                    $("#increase-plan-gp-val").html("0%");
                }
            }
        }
    });
}

$(document).on("changeDate", "#SignedSalesDivisionFrom,#SignedSalesDivisionTo", function () {
    if (!firstTime) {
        if ($("#SignedSalesDivisionFrom").val() !== "" && $("#SignedSalesDivisionTo").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            GetSignedSalesAndGrossProfitInfor(divId);
        }
    }
});

function InitSignedSaleAndGrossProfitByChild(divId) {
    LoadSignedSalesAndGrossProfitChild(divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            if (data.SignedSalesByChild !== null && data.SignedSalesByChild.length > 0) {
                var check = false;
                for (var i = 0; i < data.SignedSalesByChild.length; i++) {
                    for (var j = 0; j < data.SignedSalesByChild[i].dataPoints.length; j++) {
                        if (data.SignedSalesByChild[i].dataPoints[j].y > 0) {
                            check = true;
                        }
                    }
                };
                if (check) {
                    LoadChartDivSignedSalesByChild(data.SignedSalesByChild);
                } else {
                    $("#chartDivSignedSalesByChild").empty();
                }
            }
            if (data.GrossProfitByChild !== null && data.GrossProfitByChild.length > 0) {
                var check = false;
                for (var i = 0; i < data.GrossProfitByChild.length; i++) {
                    for (var j = 0; j < data.GrossProfitByChild[i].dataPoints.length; j++) {
                        if (data.GrossProfitByChild[i].dataPoints[j].y > 0) {
                            check = true;
                        }
                    }
                };
                if (check) {
                    LoadChartDivGrossProfitByChild(data.GrossProfitByChild);
                } else {
                    $("#chartDivGrossProfitByChild").empty();
                }
            }
        }
    });
}

function LoadChartDivSignedSalesByChild(data) {
    var chart = new CanvasJS.Chart("chartDivSignedSalesByChild", {
        animationEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"        
        title: {
            text: "Doanh số ký",
            horizontalAlign: "left",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        height: 300,
        toolTip: {
            //contentFormatter: function (e) {

            //    var content = "";
            //    for (var i = 0; i < e.entries.length; i++) {                    
            //        var entry = e.entries[i];
            //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
            //    }

            //    return content;
            //},
            shared: true
        },
        axisY: {
            gridThickness: 0,
            lineThickness: 1,
            suffix: "B",
            stripLines: [{
                color: "black",
                value: 0,
                thickness: 1
                //lineDashType: "longDashDot"
            }]
        },
        axisX: {
            interval: 1
        },
        data: data
    });
    chart.render();

    setMinValue(chart);
}

function LoadChartDivGrossProfitByChild(data) {
    var chart = new CanvasJS.Chart("chartDivGrossProfitByChild", {
        animationEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"
        title: {
            text: "Lãi gộp ký",
            horizontalAlign: "left",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        height: 300,
        axisX: {
            interval: 1
        },
        axisY: {
            gridThickness: 0,
            lineThickness: 1,
            suffix: "B",
            stripLines: [{
                color: "black",
                value: 0,
                thickness: 1
                //lineDashType: "longDashDot"
            }]
        },
        toolTip: {
            //contentFormatter: function (e) {

            //    var content = "<b>Lãi gộp ký:</b>";
            //    for (var i = 0; i < e.entries.length; i++) {
            //        var entry = e.entries[i];
            //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
            //    }

            //    return content;
            //},
            shared: true
        },
        data: data
    });
    chart.render();
    setMinValue(chart);
}

function LoadSignedSalesAndGrossProfitChild(divId, callback) {
    var url = $("#urlGetSignedSalesAndGrossProfitChild").val();
    var result = "";
    var fromDate = $("#SignedSalesAndGrossProfitChildFrom").val();
    var toDate = $("#SignedSalesAndGrossProfitChildTo").val();
    var loader = $("#loaderDashboard").html();
    var tags = $('#data_dashboard_Tags').val();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SignedSalesAndGrossProfitChild-Form").addClass("hidden");
            $("#SignedSalesAndGrossProfitChild-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate,
            'tags': tags
        },
        success: function (data) {
            $("#SignedSalesAndGrossProfitChild-Area").children()[1].remove();
            $("#SignedSalesAndGrossProfitChild-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            result = data;
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return result;
}

$(document).on("changeDate", "#SignedSalesAndGrossProfitChildFrom,#SignedSalesAndGrossProfitChildTo", function () {
    if (!firstTime) {
        if ($("#SignedSalesAndGrossProfitChildFrom").val() !== "" && $("#SignedSalesAndGrossProfitChildTo").val() !== "") {
            var viewMode = $("#viewMode").val();
            if (viewMode === "chart") {
                var divId = parseInt($("#lstDivId").val());
                InitSignedSaleAndGrossProfitByChild(divId);
            } else if (viewMode === "table") {
                $("#chartArea").addClass("hidden");
                $("#ViewasTable").addClass("hidden");
                var url = $("#urlViewAsTable").val();
                var divId = parseInt($("#lstDivId").val());
                var fromDate = $("#SignedSalesAndGrossProfitChildFrom").val();
                var toDate = $("#SignedSalesAndGrossProfitChildTo").val();
                var loader = $("#loaderDashboard").html();
                $("#tableArea").removeClass("hidden");
                $("#ViewasChart").removeClass("hidden");
                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "html",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
                        //$("#tableArea").empty().append(loader);
                        $("#SignedSalesAndGrossProfitChild-Form").addClass("hidden");
                        $("#SignedSalesAndGrossProfitChild-Area").append(loader);
                        $("#lstDivId").attr("disabled", true);
                    },
                    data: {
                        'divId': divId,
                        'fromDate': fromDate,
                        'toDate': toDate
                    },
                    success: function (data) {
                        $("#viewMode").val("table");
                        $("#SignedSalesAndGrossProfitChild-Area").children()[1].remove();
                        $("#SignedSalesAndGrossProfitChild-Form").removeClass("hidden");
                        $("#lstDivId").attr("disabled", false);
                        $("#tableArea").empty().append(data);
                        $("#viewastable").DataTable({
                            scrollY: "240px",
                            scrollCollapse: true,
                            scrollX: true,
                            fixedColumns: {
                                leftColumns: 1
                            },
                            paging: false,
                            "searching": false,
                            "ordering": false,
                            "info": false
                        });
                    }
                });
            }
        }
    }
});

function InitSignedSaleAndGrossProfitBySaleMan(divId) {
    //var data = LoadSignedSalesAndGrossProfitSaleMan(divId);
    LoadSignedSalesAndGrossProfitSaleMan(divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            DrawSignedSalesAndGrossProfitSaleMan(data);
        };
    });
}

function DrawSignedSalesAndGrossProfitSaleMan(data) {
    var chart = new CanvasJS.Chart("chartDivBySaleMan", {
        animationEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"                
        toolTip: {
            contentFormatter: function (e) {

                var content = "<b>Doanh số ký:</b>";

                for (var i = 0; i < e.entries.length; i++) {
                    if (i === 3) {
                        content += "</br><b>Lãi gộp ký:</b>";
                    }
                    var entry = e.entries[i];
                    content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                }

                return content;
            },
            shared: true
        },
        height: 300,
        //dataPointWidth: 10,
        axisY: {
            gridThickness: 0,
            labelAngle: 0,
            lineThickness: 1,
            suffix: "B",
            stripLines: [{
                color: "black",
                value: 0,
                thickness: 1
                //lineDashType: "longDashDot"
            }]
        },
        data: data
    });

    //var borderWidth = 2;
    chart.render();
    setMinValue2(chart);
    //addBorderToDataPoint(chart, borderWidth);
    var interval = chart.axisY[0].get("interval");
    chart.axisY[0].set("interval", interval * 2);
}

function LoadSignedSalesAndGrossProfitSaleMan(divId, callback) {
    var url = $("#urlGetSignedSalesAndGrossProfitBySaleMan").val();
    var result = "";
    var fromDate = $("#SignedSalesAndGrossProfitSaleManFrom").val();
    var toDate = $("#SignedSalesAndGrossProfitSaleManTo").val();
    var loader = $("#loaderDashboard").html();
    var tags = $('#data_dashboard_Tags').val();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SignedSalesAndGrossProfitSaleMan-Form").addClass("hidden");
            $("#SignedSalesAndGrossProfitSaleMan-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate,
            'tags': tags
        },
        success: function (data) {
            $("#SignedSalesAndGrossProfitSaleMan-Area").children()[1].remove();
            $("#SignedSalesAndGrossProfitSaleMan-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            result = data;
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return result;
}

function addBorderToDataPoint(chart, borderWidth) {

    var ctx = chart.ctx;
    ctx.save();
    var plotArea = chart.plotArea;
    ctx.beginPath();
    ctx.rect(plotArea.x1, plotArea.y1, plotArea.x2 - plotArea.x1, plotArea.y2 - plotArea.y1);
    ctx.clip();
    ctx.lineWidth = borderWidth || 2;

    for (var i = 0; i < chart.data.length; i++) {
        if (chart.data[i].type === "stackedBar") {
            for (var j = 0; j < chart.data[i].dataPointIds.length; j++) {
                var dataPointInfo = chart._eventManager.objectMap[chart.data[i].dataPointIds[j]];
                ctx.beginPath();
                ctx.rect(dataPointInfo.x1, dataPointInfo.y1, dataPointInfo.x2 - dataPointInfo.x1, dataPointInfo.y2 - dataPointInfo.y1);
                ctx.stroke();
            }
        }
    }
    ctx.restore();
}

$(document).on("changeDate", "#SignedSalesAndGrossProfitSaleManFrom,#SignedSalesAndGrossProfitSaleManTo", function () {
    if (!firstTime) {
        if ($("#SignedSalesAndGrossProfitSaleManFrom").val() !== "" && $("#SignedSalesAndGrossProfitSaleManTo").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            InitSignedSaleAndGrossProfitBySaleMan(divId);
        }
    }
});

function InitSaleStageClassifyForDiv(divId) {
    //var data = GetSaleStageClassifyForDiv(divId);
    GetSaleStageClassifyForDiv(divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            NoBidOppForDiv(data.ListNoBidSaleStageInfor);
            BidOppForDiv(data.ListBidSaleStageInfor);
        }
    });
}

function GetSaleStageClassifyForDiv(divId, callback) {
    var url = $("#urlGetSaleStageClassifyForDiv").val();
    var value;
    var loader = $("#loaderDashboard").html();
    var tags = $('#data_dashboard_Tags').val();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SignedContractAbilityForDiv-Form").addClass("hidden");
            $("#SignedContractAbilityForDiv-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'tags': tags
        },
        success: function (data) {
            $("#SignedContractAbilityForDiv-Area").children()[1].remove();
            $("#SignedContractAbilityForDiv-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            value = data;
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return value;
}

function BidOppForDiv(data) {
    var chart = new CanvasJS.Chart("chartBidOppForDiv", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "Cơ hội có đấu thầu",
            horizontalAlign: "left",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        subtitles: [{
            verticalAlign: "center",
            fontWeight: "bolder"
        }
        ],
        legend: {
            cursor: "pointer",
            horizontalAlign: "right",
            verticalAlign: "center",
            fontSize: 12,
            fontFamily: "sans-serif"
        },
        data: [{
            type: "doughnut",
            innerRadius: 45,
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: {y}",
            indexLabelFontSize: 11,
            indexLabel: "",
            dataPoints: data
        }]
    });
    var total = 0;
    for (var i = 0; i < chart.options.data[0].dataPoints.length; i++) {
        total += chart.options.data[0].dataPoints[i].y;
        if (chart.options.data[0].dataPoints[i].y > 0)
            chart.options.data[0].dataPoints[i].indexLabel = "{y}B";
    }

    setTimeout(function () {
        chart.render();
        chart.subtitles[0].set("fontSize", 18);
        chart.subtitles[0].set("padding", { top: 30, right: 90 });
        chart.subtitles[0].set("text", total.toFixed(1) + "B");
    }, 300);
}

function NoBidOppForDiv(data) {
    var chart = new CanvasJS.Chart("chartNoBidOppForDiv", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "Cơ hội không đấu thầu",
            horizontalAlign: "left",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "bolder"
        },
        subtitles: [{
            verticalAlign: "center",
            fontWeight: "bolder"
        }
        ],
        legend: {
            cursor: "pointer",
            horizontalAlign: "right",
            verticalAlign: "center",
            itemWidth: 100,
            fontSize: 12,
            fontFamily: "sans-serif"
        },
        data: [{
            type: "doughnut",
            innerRadius: 45,
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: {y}",
            indexLabelFontSize: 11,
            indexLabel: "",
            dataPoints: data
        }]
    });

    var total = 0;
    for (var i = 0; i < chart.options.data[0].dataPoints.length; i++) {
        total += chart.options.data[0].dataPoints[i].y;
        if (chart.options.data[0].dataPoints[i].y > 0)
            chart.options.data[0].dataPoints[i].indexLabel = "{y}B";
    }

    setTimeout(function () {
        chart.render();
        chart.subtitles[0].set("fontSize", 18);
        chart.subtitles[0].set("padding", { top: 30, right: 100 });
        chart.subtitles[0].set("text", total.toFixed(1) + "B");
    }, 300);

    setTimeout(function () {
        chart.render();
    }, 300);
}

function SignedContractAbilityForDiv(divId) {
    var month = $("#ContactAbilityForDivDate").val();
    //var data = GetSignedContractAbilityForDiv(month, divId);
    GetSignedContractAbilityForDiv(month, divId, function (data) {
        var check = false;
        if (data !== "" && typeof (data) !== "undefined") {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].dataPoints.length; j++) {
                    if (data[i].dataPoints[j] != null) {
                        data[i].dataPoints[j].x = new Date(data[i].dataPoints[j].x.split("/")[1], parseInt(data[i].dataPoints[j].x.split("/")[0]) - 1, 1);
                        check = true;
                    }
                }
            }

            if (data[0].currentMonthSignedSale > 0) {
                $(".contactability-sale").removeClass("hidden");
                $("#currentMonth").html(month);
                $(".currentSignedSale").html(data[0].currentMonthSignedSale + "B");
            } else {
                $(".contactability-sale").addClass("hidden");
            }
            if (check) {
                var chart = new CanvasJS.Chart("chartSignedContractForDivAbility", {
                    animationEnabled: true,
                    height: 250,
                    axisX: {
                        valueFormatString: "MM",
                        interval: 1,
                        intervalType: "month",
                        prefix: "Tháng ",
                        reversed: true
                    },
                    axisY: {
                        gridThickness: 0,
                        suffix: "B",
                        stripLines: [{
                            color: "black",
                            value: 0,
                            thickness: 1
                            //lineDashType: "longDashDot"
                        }]
                    },
                    toolTip: {
                        //enabled: false,   
                        //content: "<b>{legendText}</b>: {y} B",
                        contentFormatter: function (e) {

                            var content = "";
                            for (var i = 0; i < e.entries.length; i++) {
                                var entry = e.entries[i];
                                content += "<b>" + entry.dataSeries.legendText + "</b>: " + entry.dataPoint.y + "B </br>";
                                if (i === 2) {
                                    content += "<b>Tổng (nhân tỷ lệ): </b>" + entry.dataPoint.total + "B";
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
                addIndexLabelsWithoutTotal(chart, 0);
            }
        }
    });
}

function GetSignedContractAbilityForDiv(month, divId, callback) {
    var url = $("#urlGetSignedContractAbilityForDivision").val();
    var loader = $("#loaderDashboard").html();
    var tags = $('#data_dashboard_Tags').val();
    var value;
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#ContactAbilityForDiv-Form").addClass("hidden");
            $("#ContactAbilityForDiv-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'month': month,
            'divId': divId,
            'tags': tags
        },
        success: function (data) {
            $("#ContactAbilityForDiv-Area").children()[1].remove();
            $("#ContactAbilityForDiv-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            value = data;
            if (callback != undefined && typeof callback == "function") {
                callback(data);
            }
        }
    });
    return value;
}

$(document).on("changeDate", "#ContactAbilityForDivDate", function () {
    if (!firstTime) {
        if ($("#ContactAbilityForDivDate").val() !== "") {
            var viewMode = $("#viewMode2").val();
            var divId = parseInt($("#lstDivId").val());
            if (viewMode === "chart") {
                SignedContractAbilityForDiv(divId);
            }
            else if (viewMode === "table") {
                $("#chartArea2").addClass("hidden");
                $("#ViewasTable2").addClass("hidden");
                $("#tableArea2").removeClass("hidden");
                $("#ViewasChart2").removeClass("hidden");
                var url = $("#urlViewAsTable2").val();
                var month = $("#ContactAbilityForDivDate").val();
                var loader = $("#loaderDashboard").html();
                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "html",
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
                        //$("#tableArea").empty().append(loader);
                        $("#ContactAbilityForDiv-Form").addClass("hidden");
                        $("#ContactAbilityForDiv-Area").append(loader);
                        $("#lstDivId").attr("disabled", true);
                    },
                    data: {
                        'divId': divId,
                        'month': month
                    },
                    success: function (data) {
                        $("#viewMode2").val("table");
                        $("#ContactAbilityForDiv-Area").children()[1].remove();
                        $("#ContactAbilityForDiv-Form").removeClass("hidden");
                        $("#lstDivId").attr("disabled", false);
                        $("#tableArea2").empty().append(data);
                        $("#viewastable2").DataTable({
                            scrollY: "200px",
                            scrollCollapse: true,
                            scrollX: true,
                            fixedColumns: {
                                leftColumns: 1
                            },
                            paging: false,
                            "searching": false,
                            "ordering": false,
                            "info": false
                        });

                        var currentMonthSignedSale = $("#CurrentMonthSignedSale").val();
                        if (currentMonthSignedSale > 0) {
                            $(".contactability-sale").removeClass("hidden");
                            $("#currentMonth").html(month);
                            $(".currentSignedSale").html(currentMonthSignedSale + "B");
                        } else {
                            $(".contactability-sale").addClass("hidden");
                        }
                    }
                });
            }
        }
    }
});

function GetTopOppForDiv(divId) {
    var url = $("#urlGetTopOppForDiv").val();

    var fromDate = $("#TopOppForDivFrom").val();
    var toDate = $("#TopOppForDivTo").val();
    var loader = $("#loaderDashboard").html();
    var tags = $('#data_dashboard_Tags').val();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#TopOppForDiv-Form").addClass("hidden");
            $("#TopOppForDiv-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate,
            'tags': tags
        },
        success: function (data) {
            $("#TopOppForDiv-Area").children()[1].remove();
            $("#TopOppForDiv-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            var str = "";
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    str += "<tr>";
                    str += "<td> <a target='_blank' href='" + hostAddress + "/Opportunities/Details?oppId=" + data[i].OppId + "'> " + data[i].Name + "</a> </td>";
                    str += "<td> " + data[i].AccName + "</td>";
                    str += "<td class='text-right'> " + data[i].DisplayValue + "</td>";
                    str += "</tr>";
                }

            }
            else {
                str += "<tr>";
                str += "<td colspan='3'>Không có dữ liệu</td>";
                str += "</tr>";
            }
            $("#TopOppForDiv-tr").empty().append(str);

        }
    });
}

$(document).on("changeDate", "#TopOppForDivFrom,#TopOppForDivTo", function () {
    if (!firstTime) {
        if ($("#TopOppForDivFrom").val() !== "" && $("#TopOppForDivTo").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            GetTopOppForDiv(divId);
        }
    }
});

function GetTopAccForDiv(divId) {
    var url = $("#urlGetTopAccForDiv").val();

    var fromDate = $("#TopAccForDivFrom").val();
    var toDate = $("#TopAccForDivTo").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#TopAccForDiv-Form").addClass("hidden");
            $("#TopAccForDiv-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {
            $("#TopAccForDiv-Area").children()[1].remove();
            $("#TopAccForDiv-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            var str = "";
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    str += "<tr>";
                    str += "<td> <a target='_blank' href='" + hostAddress + "/Accounts/Details?AccountId=" + data[i].AccId + "'> " + data[i].AccName + "</a> </td>";
                    str += "<td class='text-right'> " + data[i].SuccessContract + "</td>";
                    str += "<td class='text-right'> " + data[i].DisplayValue + "</td>";
                    str += "</tr>";
                }

            }
            else {
                str += "<tr>";
                str += "<td colspan='3'>Không có dữ liệu</td>";
                str += "</tr>";
            }
            $("#TopAccForDiv-tr").empty().append(str);

        }
    });
}

$(document).on("changeDate", "#TopAccForDivFrom,#TopAccForDivTo", function () {
    if (!firstTime) {
        if ($("#TopAccForDivFrom").val() !== "" && $("#TopAccForDivTo").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            GetTopAccForDiv(divId);
        }
    }
});

function InitNewInfor(divId) {
    //var data = GetNewInforForDiv(divId);
    GetNewInforForDiv(divId, function (data) {
        DrawNewInforChart(data);
    });
}

function DrawNewInforChart(data) {
    var chart = new CanvasJS.Chart("chartNewInfor", {
        animationEnabled: true,
        theme: "light1",
        height: 250,
        axisX: {
            valueFormatString: ""
        },
        axisY: {
            //interval :1,
            intervalType: "number",
            gridThickness: 0
        },
        toolTip: {
            shared: true,
            contentFormatter: function (e) {

                var content = "";
                for (var i = 0; i < e.entries.length; i++) {
                    var entry = e.entries[i];
                    content += "<b>" + entry.dataSeries.name + ": </b>" + entry.dataPoint.y + "</br>";
                }

                return content;
            }
        },
        data: data
    });
    setTimeout(function () {
        chart.render();
    }, 300);
}

function GetNewInforForDiv(divId, callback) {
    var fromDate = $("#newInforDateFrom").val();
    var toDate = $("#newInforDateTo").val();
    var url = $("#urlGetNewInforForDiv").val();
    var loader = $("#loaderDashboard").html();
    var value;
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#newInfor-Form").addClass("hidden");
            $("#newInfor-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {
            $("#newInfor-Area").children()[1].remove();
            $("#newInfor-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            value = data;
            if (callback != undefined && typeof callback == 'function') {
                callback(data);
            }
        }
    });
    return value;
}

$(document).on("changeDate", "#newInforDateFrom, #newInforDateTo", function () {
    if (!firstTime) {
        if ($("#newInforDateTo").val() !== "" && $("#newInforDateFrom").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            InitNewInfor(divId);
        }
    }
});

function InitSaleManTaskInfor(divId) {
    //var data = GetSaleManTaskChart(divId);
    GetSaleManTaskChart(divId, function (data) {
        //var check = false;
        //if (data !== "" && typeof (data) !== "undefined") {
        //    for (var i = 0; i < data.length; i++) {
        //        if (data[i].dataPoints.length > 0) {
        //            check = true;
        //        }
        //    }
        //    if (check) {

        //    }
        //}; 
        DrawSaleManTaskChart(data);
    });
}

function DrawSaleManTaskChart(data) {
    var chart = new CanvasJS.Chart("chartSaleManTask", {
        animationEnabled: true,
        theme: "light2",
        toolTip: {
            shared: true
        },
        axisX: {
            interval: 1
        },
        axisY: {
            gridThickness: 0,
            lineThickness: 1,
            interval: 1,
            intervalType: "number"
        },
        data: data
    });
    setTimeout(function () {
        chart.render();
    }, 300);
}

function GetSaleManTaskChart(divId, callback) {
    var fromDate = $("#SaleManTaskFrom").val();
    var toDate = $("#SaleManTaskTo").val();
    var loader = $("#loaderDashboard").html();
    var url = $("#urlGetSaleManTaskForDiv").val();
    var value;
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#SaleManTask-Form").addClass("hidden");
            $("#SaleManTask-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {
            $("#SaleManTask-Area").children()[1].remove();
            $("#SaleManTask-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            value = data;

            if (callback != undefined && typeof callback == 'function') {
                callback(data);
            }
        }
    });
    return value;
}

$(document).on("changeDate", "#SaleManTaskFrom,#SaleManTaskTo", function () {
    if (!firstTime) {
        if ($("#SaleManTaskFrom").val() !== "" && $("#SaleManTaskTo").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            InitSaleManTaskInfor(divId);
        }
    }
});

function GetOtherInforForDiv(divId) {
    var url = $("#urlGetOtherInforForDiv").val();

    var fromDate = $("#OtherForDivFrom").val();
    var toDate = $("#OtherForDivTo").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        //async: false,
        beforeSend: function () {
            $("#OtherForDiv-Form").addClass("hidden");
            $("#OtherForDiv-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {
            $("#OtherForDiv-Area").children()[1].remove();
            $("#OtherForDiv-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            if (data !== "") {
                $("#AccQuatityForDiv").html(data.AccQuatity);
                $("#SuccessContractRateForDiv").html(data.SuccessContractRate);
                $("#SuccessOppQuatityForDiv").html(data.SuccessOppQuatity);
                $("#AverageValueForDiv").html(data.AverageValue);
                $("#AverageTimeForDiv").html(data.AverageTime);
                //$("#SaleManOppForDiv").html(data.SaleManOppQuatity);
                $("#OnGoingOpp").html(data.OnGoingOpp);
            }
        }
    });
}

$(document).on("changeDate", "#OtherForDivFrom,#OtherForDivTo", function () {
    if (!firstTime) {
        if ($("#OtherForDivFrom").val() !== "" && $("#OtherForDivTo").val() !== "") {
            var divId = parseInt($("#lstDivId").val());
            GetOtherInforForDiv(divId);
        }
    }
});

$(document).on("change", "#lstDivId", function () {
    var divId = parseInt($("#lstDivId").val());
    LoadDivisionDashboard(divId);
});

$(document).on("click", "#SignedSalesAndGrossProfitInd", function () {
    $("#FromDate").val($("#SignedSalesFrom").val());
    $("#ToDate").val($("#SignedSalesTo").val());
    $("#ReportName").val("SignedSalesAndGrossProfitInd");
    var amId = $("#lstAmId").val();
    if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
        $("#AmId").val(parseInt(amId));
    } else {
        $("#AmId").val(0);
    }
    var tags = $('#data_dashboard_per_Tags').val();
    $('#Tags').val(tags);
    var includeInternal = false;
    if ($("#SignedSalesIncludeInternal").is(':checked')) {
        includeInternal = true;
    }
  
    $("#IncludeInternal").val(includeInternal);
    //if ($("#lstDivId").length > 0) {
    //    var lstDiv = $.map($("#lstDivId option"), function (a) {return a.value;}).join(",");
    //    $("#LstDivIdStr").val(lstDiv);
    //}
    $("#submitBtn").click();
});

$(document).on("click", "#PersonalPlaningContractSignValue", function () {
    $("#FromDate").val($("#ContactAbilityDate").val());
    $("#ReportName").val("PersonalPlaningContractSignValue");
    var amId = $("#lstAmId").val();
    if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
        $("#AmId").val(parseInt(amId));
    } else {
        $("#AmId").val(0);
    }
    var tags = $('#data_dashboard_per_Tags').val();
    $('#Tags').val(tags);
    //if ($("#lstDivId").length > 0) {
    //    $("#DivId").val(parseInt($("#lstDivId").val()));  
    //}
    $("#submitBtn").click();
});

$(document).on("click", "#SignedSalesAndGrossProfitInd2", function () {
    $("#FromDate").val($("#GrossProfitSignedFrom").val());
    $("#ToDate").val($("#GrossProfitSignedTo").val());
    $("#ReportName").val("SignedSalesAndGrossProfitInd");
    var amId = $("#lstAmId").val();
    if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
        $("#AmId").val(parseInt(amId));
    } else {
        $("#AmId").val(0);
    }
    var tags = $('#data_dashboard_per_Tags').val();
    $('#Tags').val(tags);
    var includeInternal = false;
    if ($("#GrossProfitIncludeInternal").is(':checked')) {
        includeInternal = true;
    }   
    $("#IncludeInternal").val(includeInternal);
    //if ($("#lstDivId").length > 0) {
    //    var lstDiv = $.map($("#lstDivId option"), function (a) { return a.value; }).join(",");
    //    $("#LstDivIdStr").val(lstDiv);
    //}
    $("#submitBtn").click();
});

$(document).on("click", "#OpportunityOngoingInd", function () {
    //$("#FromDate").val($("#SignedSalesFrom").val());
    //$("#ToDate").val($("#SignedSalesTo").val());
    $("#ReportName").val("OpportunityOngoingInd");
    var amId = $("#lstAmId").val();
    if ($("#lstAmId").val() !== "" && typeof ($("#lstAmId").val()) !== "undefined") {
        $("#AmId").val(parseInt(amId));
    } else {
        $("#AmId").val(0);
    }
    var tags = $('#data_dashboard_per_Tags').val();
    $('#Tags').val(tags);
    //if ($("#lstDivId").length > 0) {
    //    var lstDiv = $.map($("#lstDivId option"), function (a) { return a.value; }).join(",");
    //    $("#LstDivIdStr").val(lstDiv);
    //}
    $("#submitBtn").click();
});

$(document).on("click", "#SignedSalesAndGrossProfiForChild", function () {
    $("#DivId").val(parseInt($("#lstDivId").val()));
    $("#FromDate").val($("#SignedSalesAndGrossProfitChildFrom").val());
    $("#ToDate").val($("#SignedSalesAndGrossProfitChildTo").val());
    $("#Tags").val($("#data_dashboard_Tags").val());
    $("#ReportName").val("SignedSalesAndGrossProfit");
    $("#submitBtn").click();
    
});

$(document).on("click", "#SignedSalesAndGrossProfit", function () {
    $("#DivId").val(parseInt($("#lstDivId").val()));
    $("#FromDate").val($("#SignedSalesDivisionFrom").val());
    $("#ToDate").val($("#SignedSalesDivisionTo").val());
    $("#Tags").val($("#data_dashboard_Tags").val());
    $("#ReportName").val("SignedSalesAndGrossProfit");
    $("#submitBtn").click();
});

$(document).on("click", "#SignedRevAndGPForSalesman", function () {
    $("#DivId").val(parseInt($("#lstDivId").val()));
    $("#FromDate").val($("#SignedSalesAndGrossProfitSaleManFrom").val());
    $("#ToDate").val($("#SignedSalesAndGrossProfitSaleManTo").val());
    $("#Tags").val($("#data_dashboard_Tags").val());
    $("#ReportName").val("SignedRevAndGPForSalesman");
    $("#submitBtn").click();
});

$(document).on("click", "#OpportunityOngoingPartTime", function () {
    $("#DivId").val(parseInt($("#lstDivId").val()));
    $("#ReportName").val("OpportunityOngoingPartTime");
    $("#Tags").val($("#data_dashboard_Tags").val());
    $("#submitBtn").click();
});

$(document).on("click", "#PlaningContractSignValue", function () {
    $("#DivId").val(parseInt($("#lstDivId").val()));
    var dateString = $("#ContactAbilityForDivDate").val();
    var dateParts = dateString.split("/");
    var dateObject = new Date(+dateParts[1], dateParts[0] - 1, 1);
    var toDateObject = new Date(+dateParts[1], dateParts[0] - 1 + 3, 1);
    var fromDate = moment(dateObject).format('DD/MM/YYYY');
    var toDate = moment(toDateObject).add(-1, "d").format('DD/MM/YYYY');
    $("#Tags").val($("#data_dashboard_Tags").val());
    $("#FromDate").val(fromDate);
    $("#ToDate").val(toDate);
    $("#ReportName").val("PlaningContractSignValue");
    $("#submitBtn").click();
});

$(document).on("click", "#NewOppAndAccReport", function () {
    $("#DivId").val(parseInt($("#lstDivId").val()));
    $("#FromDate").val($("#newInforDateFrom").val());
    $("#ToDate").val($("#newInforDateTo").val());
    $("#ReportName").val("NewOppAndAccReport");
    $("#submitBtn").click();
});

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? "0" + s : s; }

    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

function convertMonth(inputFormat) {
    function pad(s) { return (s < 10) ? "0" + s : s; }

    var d = new Date(inputFormat);
    return [pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

$(document).on("click", ".open-modal", function () {
    var html = $(this).parent().parent().parent().find(".modal-val").html();
    $("#modal-data").empty().append(html);
});

$('#SignedSalesAndGrossProfitChildModal').on("shown.bs.modal", function () {
    var divId = parseInt($("#lstDivId").val());
    var viewMode = $("#viewMode").val();
    if (viewMode === "chart") {
        $("#chartAreaModal").removeClass("hidden");
        $("#ViewasTableModal").removeClass("hidden");
        $("#tableAreaModal").addClass("hidden");
        $("#ViewasChartModal").addClass("hidden");
        LoadSignedSalesAndGrossProfitChild(divId, function (data) {
            if (data !== "" && typeof (data) !== "undefined") {
                if (data.SignedSalesByChild !== null && data.SignedSalesByChild.length > 0) {
                    var chart1 = new CanvasJS.Chart("chartDivSignedSalesByChild-Modal", {
                        animationEnabled: true,
                        theme: "light2", //"light1", "dark1", "dark2"        
                        title: {
                            text: "Doanh số ký",
                            horizontalAlign: "left",
                            fontSize: 22,
                            fontFamily: "sans-serif",
                            fontWeight: "bolder"
                        },
                        toolTip: {
                            //contentFormatter: function (e) {

                            //    var content = "";
                            //    for (var i = 0; i < e.entries.length; i++) {                    
                            //        var entry = e.entries[i];
                            //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                            //    }

                            //    return content;
                            //},
                            fontSize: 22,
                            shared: true
                        },
                        axisY: {
                            gridThickness: 0,
                            lineThickness: 1,
                            suffix: "B",
                            labelAngle: 0,
                            labelFontSize: 15,
                            stripLines: [{
                                color: "black",
                                value: 0,
                                thickness: 1
                                //lineDashType: "longDashDot"
                            }]
                        },
                        axisX: {
                            interval: 1,
                            stripLines: []
                        },
                        data: data.SignedSalesByChild
                    });
                    chart1.render();
                    setMinValue(chart1);
                    addIndexLabelsWithTotal(chart1, 0);
                }
                if (data.GrossProfitByChild !== null && data.GrossProfitByChild.length > 0) {
                    var chart2 = new CanvasJS.Chart("chartDivGrossProfitByChild-Modal", {
                        animationEnabled: true,
                        theme: "light2", //"light1", "dark1", "dark2"
                        title: {
                            text: "Lãi gộp ký",
                            horizontalAlign: "left",
                            fontSize: 22,
                            fontFamily: "sans-serif",
                            fontWeight: "bolder"
                        },
                        axisX: {
                            interval: 1,
                            stripLines: []
                        },
                        axisY: {
                            gridThickness: 0,
                            lineThickness: 1,
                            suffix: "B",
                            labelAngle: 0,
                            labelFontSize: 15,
                            stripLines: [{
                                color: "black",
                                value: 0,
                                thickness: 1
                                //lineDashType: "longDashDot"
                            }]
                        },
                        toolTip: {
                            //contentFormatter: function (e) {

                            //    var content = "<b>Lãi gộp ký:</b>";
                            //    for (var i = 0; i < e.entries.length; i++) {
                            //        var entry = e.entries[i];
                            //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                            //    }

                            //    return content;
                            //},
                            fontSize: 22,
                            shared: true
                        },
                        data: data.GrossProfitByChild
                    });
                    chart2.render();
                    setMinValue(chart2);
                    addIndexLabelsWithTotal(chart2, 0);
                }
            }
        });
    } else if (viewMode === "table") {
        $("#chartAreaModal").addClass("hidden");
        $("#ViewasTableModal").addClass("hidden");
        var url = $("#urlViewAsTable").val();
        var divId = parseInt($("#lstDivId").val());
        var fromDate = $("#SignedSalesAndGrossProfitChildFrom").val();
        var toDate = $("#SignedSalesAndGrossProfitChildTo").val();
        var loader = $("#loaderDashboard").html();
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                //$("#tableArea").empty().append(loader);            
                $("#SignedSalesAndGrossProfitChildModal-body").append(loader);
            },
            data: {
                'divId': divId,
                'fromDate': fromDate,
                'toDate': toDate
            },
            success: function (data) {
                $("#SignedSalesAndGrossProfitChildModal-body").children()[2].remove();
                $("#tableAreaModal").removeClass("hidden");
                $("#ViewasChartModal").removeClass("hidden");
                $("#tableAreaModal").empty().append(data);
            }
        });
    }
});

$('#SignedSalesAndGrossProfitSaleManModal').on("shown.bs.modal", function () {
    var divId = parseInt($("#lstDivId").val());
    LoadSignedSalesAndGrossProfitSaleMan(divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            var chart = new CanvasJS.Chart("chartDivBySaleMan-Modal", {
                animationEnabled: true,
                theme: "light2", //"light1", "dark1", "dark2"                
                //toolTip: {
                //    contentFormatter: function (e) {

                //        var content = "<b>Doanh số ký:</b>";

                //        for (var i = 0; i < e.entries.length; i++) {
                //            if (i === 3) {
                //                content += "</br><b>Lãi gộp ký:</b>";
                //            }
                //            var entry = e.entries[i];
                //            content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                //        }

                //        return content;
                //    },
                //    shared: true
                //},                
                //axisY: {
                //    gridThickness: 0,
                //    lineThickness: 1,
                //    suffix: "B",
                //    labelAngle: 0,
                //    labelFontSize: 15,
                //    stripLines: [{
                //        color: "black",
                //        value: 0,
                //        thickness: 1
                //        //lineDashType: "longDashDot"
                //    }]
                //},
                toolTip: {
                    //contentFormatter: function (e) {

                    //    var content = "";
                    //    for (var i = 0; i < e.entries.length; i++) {                    
                    //        var entry = e.entries[i];
                    //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                    //    }

                    //    return content;
                    //},
                    fontSize: 22,
                    shared: true
                },
                axisY: {
                    gridThickness: 0,
                    lineThickness: 1,
                    suffix: "B",
                    labelAngle: 0,
                    labelFontSize: 15,
                    stripLines: [{
                        color: "black",
                        value: 0,
                        thickness: 1
                        //lineDashType: "longDashDot"
                    }]
                },
                data: data
            });

            chart.render();
            var interval = chart.axisY[0].get("interval");
            chart.axisY[0].set("interval", interval * 2);
            setMinValue2(chart);

            var lstY = [];
            for (var z = 0; z < chart.options.data.length; z++) {
                if (chart.options.data[z].dataPoints.length > 0) {
                    for (var k = 0; k < chart.options.data[z].dataPoints.length; k++) {
                        lstY.push((Math.abs(chart.options.data[z].dataPoints[k].y)));
                    }
                }
            }

            var avg = lstY.max() / 5;
            var value = chart.axisY[0].maximum + avg;
            chart.axisY[0].set("maximum", value);
            var indexLabels = [];
            var indexLabelsTotal = [];
            addIndexLabels(chart);

            function addIndexLabels(chart) {
                var index = 0;
                var index2 = 0;
                //for (var j = 0; j < chart.options.data.length; j++) {

                //}     
                var length = 0;
                if (chart.data[0].dataPoints.length <= 4) {
                    length = chart.data[0].dataPoints.length + 2;
                } else if (chart.data[0].dataPoints.length === 5) {
                    length = chart.data[0].dataPoints.length + 1;
                }
                //var totalArray = [];
                //var dtp1 = [];
                //var dtp2 = [];
                for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
                    var total = 0;
                    var total2 = 0;
                    var totalPlace = 0;
                    var totalPlace2 = 0;
                    for (var j = 0; j <= 5; j++) {
                        indexLabels.push(document.createElement("p"));
                        indexLabels[index].setAttribute("class", "indexlabel");
                        indexLabels[index].innerHTML = chart.data[j].dataPoints[i].y + "B";
                        //var width = 0;
                        if (j <= 2) {
                            total += chart.data[j].dataPoints[i].y;
                            if (chart.data[j].dataPoints[i].y > 0) {
                                totalPlace += chart.data[j].dataPoints[i].y;
                            }
                            //for (var k = 0; k <= j; k++) {
                            //    width += indexLabels[k].clientWidth;
                            //}
                            if (j === 0) {
                                indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(chart.data[j].dataPoints[i].y - (chart.data[j].dataPoints[i].y / 2)) + "px";
                            } else {
                                indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(totalPlace - (chart.data[j].dataPoints[i].y / 2)) + "px";
                            }
                            indexLabels[index].style.top = chart.axisX[0].convertValueToPixel(chart.data[j].dataPoints[i].x + (0.06 * length)) + "px";
                            //if (j === 2) {
                            //    dtp1.push({
                            //        y: avg,
                            //        label: chart.options.data[j].dataPoints[i].label,
                            //        x: chart.options.data[j].dataPoints[i].x                                    
                            //    });
                            //}
                            //if (j === 2) {
                            //    var test = Object.assign(total);
                            //    totalArray.push(test);
                            //}
                            if (j === 2 && totalPlace !== 0) {
                                //index++;
                                indexLabelsTotal.push(document.createElement("p"));
                                indexLabelsTotal[index2].setAttribute("class", "indexlabel total-chart");
                                indexLabelsTotal[index2].innerHTML = total.toFixed(1) + "B";
                                indexLabelsTotal[index2].style.top = chart.axisX[0].convertValueToPixel(chart.data[j].dataPoints[i].x + (0.06 * length)) + "px";
                                //if (length === 6) {
                                //    indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(total + 20) + "px";
                                //} else {
                                //    indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(total + 5) + "px";   
                                //}                                
                                indexLabelsTotal[index2].style.left = chart.axisY[0].convertValueToPixel(totalPlace) + 20 + "px";
                                document.getElementById("chartDivBySaleMan-Modal").appendChild(indexLabelsTotal[index2]);
                                index2++;
                            }

                        }
                        else {
                            total2 += chart.data[j].dataPoints[i].y;
                            if (chart.data[j].dataPoints[i].y > 0) {
                                totalPlace2 += chart.data[j].dataPoints[i].y;
                            }
                            if (j === 3) {
                                indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(chart.data[j].dataPoints[i].y - (chart.data[j].dataPoints[i].y / 2)) + "px";
                            } else {
                                indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(totalPlace2 - (chart.data[j].dataPoints[i].y / 2)) + "px";
                            }
                            if (length === 6) {
                                indexLabels[index].style.top = chart.axisX[0].convertValueToPixel(chart.data[j].dataPoints[i].x - (0.015 * length)) + "px";
                            } else {
                                indexLabels[index].style.top = chart.axisX[0].convertValueToPixel(chart.data[j].dataPoints[i].x - (0.025 * length)) + "px";
                            }
                            //if (j === 5) {
                            //    dtp1.push({
                            //        y: avg,
                            //        label: chart.options.data[j].dataPoints[i].label,
                            //        x: chart.options.data[j].dataPoints[i].x
                            //    });
                            //}
                            //if (j === 5) {
                            //    var test2 = Object.assign(total2);
                            //    totalArray.push(test2);
                            //}
                            if (j === 5 && totalPlace2 !== 0) {
                                //index++;
                                indexLabelsTotal.push(document.createElement("p"));
                                indexLabelsTotal[index2].setAttribute("class", "indexlabel total-chart");
                                indexLabelsTotal[index2].innerHTML = total2.toFixed(1) + "B";
                                if (length === 6) {
                                    indexLabelsTotal[index2].style.top = chart.axisX[0].convertValueToPixel(chart.data[j].dataPoints[i].x - (0.015 * length)) + "px";
                                } else {
                                    indexLabelsTotal[index2].style.top = chart.axisX[0].convertValueToPixel(chart.data[j].dataPoints[i].x - (0.025 * length)) + "px";
                                }
                                //if (length === 6) {
                                //    indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(total2 + 20) + "px";
                                //} else {
                                //    indexLabels[index].style.left = chart.axisY[0].convertValueToPixel(total2 + 5) + "px";
                                //}
                                indexLabelsTotal[index2].style.left = chart.axisY[0].convertValueToPixel(totalPlace2) + 20 + "px";
                                document.getElementById("chartDivBySaleMan-Modal").appendChild(indexLabelsTotal[index2]);
                                index2++;
                            }
                        }
                        document.getElementById("chartDivBySaleMan-Modal").appendChild(indexLabels[index]);
                        if (Math.abs(chart.data[j].dataPoints[i].y) < avg) {
                            indexLabels[index].style.display = "none";
                        }
                        index++;
                    }
                }

                //console.log(totalArray); 
                //var biggestTotal = totalArray.max();
                //var value = chart.axisY[0].maximum + avg;                
                //chart.axisY[0].set("maximum", value);
                //chart.options.data.push({
                //    type: "stackedBar",
                //    toolTipContent: null,
                //    showInLegend: false,
                //    indexLabel: "",
                //    indexLabelFontColor: "black",
                //    axisYIndex : 1,
                //    color: "transparent",
                //    name: "Total",
                //    dataPoints: dtp1,
                //    indexLabelBackgroundColor: "transparent", 
                //    indexLabelPlacement: "inside"
                //});

                //chart.options.data.push({
                //    type: "stackedBar",
                //    toolTipContent: null,
                //    showInLegend: false,
                //    indexLabel: "",
                //    indexLabelFontColor: "black",
                //    axisYIndex: 2,
                //    color: "transparent",
                //    name: "Total",
                //    dataPoints: dtp2,
                //    indexLabelBackgroundColor: "transparent",
                //    indexLabelPlacement: "inside"
                //});

                //chart.render();
            }
        };
    });
});

$('#SignedContractAbilityForDivModal').on("shown.bs.modal", function () {
    var divId = parseInt($("#lstDivId").val());
    GetSaleStageClassifyForDiv(divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            var chartBid = new CanvasJS.Chart("chartBidOppForDiv-Modal", {
                theme: "light2",
                animationEnabled: true,
                title: {
                    text: "Cơ hội có đấu thầu",
                    horizontalAlign: "left",
                    fontSize: 20,
                    fontFamily: "sans-serif",
                    fontWeight: "bolder"
                },
                subtitles: [{
                    verticalAlign: "center",
                    fontWeight: "bolder"
                }
                ],
                toolTip: {
                    fontSize: 22
                },
                legend: {
                    cursor: "pointer",
                    horizontalAlign: "right",
                    verticalAlign: "center",
                    fontSize: 16,
                    fontFamily: "sans-serif"
                },
                data: [{
                    type: "doughnut",
                    innerRadius: 90,
                    showInLegend: true,
                    toolTipContent: "<b>{name}</b>: {y}",
                    indexLabelFontSize: 16,
                    indexLabel: "",
                    dataPoints: data.ListBidSaleStageInfor
                }]
            });

            var totalBid = 0;
            for (var i = 0; i < chartBid.options.data[0].dataPoints.length; i++) {
                totalBid += chartBid.options.data[0].dataPoints[i].y;
                if (chartBid.options.data[0].dataPoints[i].y > 0)
                    chartBid.options.data[0].dataPoints[i].indexLabel = "{y}B";
            }

            chartBid.render();
            chartBid.subtitles[0].set("fontSize", 35);
            chartBid.subtitles[0].set("padding", { top: 40, right: 130 });
            chartBid.subtitles[0].set("text", totalBid.toFixed(1) + "B");

            var chartNoBid = new CanvasJS.Chart("chartNoBidOppForDiv-Modal", {
                theme: "light2",
                animationEnabled: true,
                title: {
                    text: "Cơ hội không đấu thầu",
                    horizontalAlign: "left",
                    fontSize: 20,
                    fontFamily: "sans-serif",
                    fontWeight: "bolder"
                },
                subtitles: [{
                    verticalAlign: "center",
                    fontWeight: "bolder"
                }
                ],
                toolTip: {
                    fontSize: 22
                },
                legend: {
                    cursor: "pointer",
                    horizontalAlign: "right",
                    verticalAlign: "center",
                    itemWidth: 180,
                    fontSize: 16,
                    fontFamily: "sans-serif"
                },
                data: [{
                    type: "doughnut",
                    innerRadius: 90,
                    showInLegend: true,
                    toolTipContent: "<b>{name}</b>: {y}",
                    indexLabelFontSize: 16,
                    indexLabel: "",
                    dataPoints: data.ListNoBidSaleStageInfor
                }]
            });

            var totalNoBid = 0;
            for (var j = 0; j < chartNoBid.options.data[0].dataPoints.length; j++) {
                totalNoBid += chartNoBid.options.data[0].dataPoints[j].y;
                if (chartNoBid.options.data[0].dataPoints[j].y > 0)
                    chartNoBid.options.data[0].dataPoints[j].indexLabel = "{y}B";
            }

            chartNoBid.render();
            chartNoBid.subtitles[0].set("fontSize", 35);
            chartNoBid.subtitles[0].set("padding", { top: 40, right: 170 });
            chartNoBid.subtitles[0].set("text", totalNoBid.toFixed(1) + "B");
        }
    });
});

$('#ContactAbilityForDivModal').on("shown.bs.modal", function () {
    var divId = parseInt($("#lstDivId").val());
    var month = $("#ContactAbilityForDivDate").val();
    var viewMode = $("#viewMode2").val();
    var check = false;
    if (viewMode === "chart") {
        $("#chartAreaModal2").removeClass("hidden");
        $("#ViewasTableModal2").removeClass("hidden");
        $("#tableAreaModal2").addClass("hidden");
        $("#ViewasChartModal2").addClass("hidden");
        GetSignedContractAbilityForDiv(month, divId, function (data) {
            if (data !== "" && typeof (data) !== "undefined") {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].dataPoints.length; j++) {
                        if (data[i].dataPoints[j] != null) {
                            data[i].dataPoints[j].x = new Date(data[i].dataPoints[j].x.split("/")[1], parseInt(data[i].dataPoints[j].x.split("/")[0]) - 1, 1);
                            check = true;
                        }
                    }
                }
                if (check) {
                    var chart = new CanvasJS.Chart("chartSignedContractForDivAbility-Modal", {
                        animationEnabled: true,
                        axisX: {
                            valueFormatString: "MM",
                            interval: 1,
                            intervalType: "month",
                            prefix: "Tháng ",
                            reversed: true
                        },
                        axisY: {
                            gridThickness: 0,
                            suffix: "B",
                            labelAngle: 0,
                            stripLines: [{
                                color: "black",
                                value: 0
                                //lineDashType: "longDashDot"
                            }]
                        },
                        toolTip: {
                            //enabled: false,   
                            content: "<b>{legendText}</b>: {y} B",
                            shared: true,
                            fontSize: 22
                        },
                        legend: {
                            cursor: "pointer",
                            horizontalAlign: "right",
                            verticalAlign: "center",
                            fontSize: 16,
                            fontFamily: "sans-serif",
                            itemWidth: 140
                        },
                        data: data
                    });
                    chart.render();
                    addIndexLabelsWithTotal(chart, 0);
                    var interval = chart.axisY[0].get("interval");
                    chart.axisY[0].set("interval", interval * 2);
                }
            }
        });
    } else if (viewMode === "table") {
        $("#chartAreaModal2").addClass("hidden");
        $("#ViewasTableModal2").addClass("hidden");
        var url = $("#urlViewAsTable2").val();
        var loader = $("#loaderDashboard").html();
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $("#ContactAbilityForDivModal-body").append(loader);
            },
            data: {
                'divId': divId,
                'month': month
            },
            success: function (data) {
                $("#ContactAbilityForDivModal-body").children()[2].remove();
                $("#tableAreaModal2").removeClass("hidden");
                $("#ViewasChartModal2").removeClass("hidden");
                $("#tableAreaModal2").empty().append(data);
            }
        });
    }
});

$('#newInforModal').on("shown.bs.modal", function () {
    var divId = parseInt($("#lstDivId").val());
    GetNewInforForDiv(divId, function (data) {
        var chart = new CanvasJS.Chart("chartNewInfor-Modal", {
            animationEnabled: true,
            theme: "light1",
            //height: 250,
            axisX: {
                valueFormatString: ""
            },
            axisY: {
                //interval :1,
                intervalType: "number",
                gridThickness: 0
            },
            toolTip: {
                shared: true,
                fontSize: 22,
                contentFormatter: function (e) {

                    var content = "";
                    for (var i = 0; i < e.entries.length; i++) {
                        var entry = e.entries[i];
                        if (entry.dataSeries.name !== "Total") {
                            content += "<b>" + entry.dataSeries.name + ": </b>" + entry.dataPoint.y + "</br>";
                        }
                    }

                    return content;
                }
            },
            legend: {
                fontSize: 16
            },
            data: data
        });
        chart.render();
        addIndexLabelsWithTotal(chart, 1);
    });
});

$('#SaleManTaskModal').on("shown.bs.modal", function () {
    var divId = parseInt($("#lstDivId").val());
    GetSaleManTaskChart(divId, function (data) {
        var chart = new CanvasJS.Chart("chartSaleManTask-Modal", {
            animationEnabled: true,
            theme: "light2",
            toolTip: {
                shared: true,
                fontSize: 22
            },
            axisX: {
                interval: 1
            },
            axisY: {
                gridThickness: 0,
                lineThickness: 1,
                interval: 1,
                intervalType: "number"
            },
            data: data
        });
        chart.render();
        addIndexLabelsWithoutTotal(chart, 1);
    });
});

function setMinValue(chart) {
    var range = chart.axisY[0].maximum - chart.axisY[0].minimum;
    var minValue = range * 0.01;
    for (var i = 0; i < chart.data.length; i++)
        for (var j = 0; j < chart.data[i].dataPoints.length; j++)
            if (chart.data[0].dataPoints[j].y === 0 && chart.data[1].dataPoints[j].y === 0 && chart.data[2].dataPoints[j].y === 0) {
                chart.options.data[i].dataPoints[j].toolTipContent =
                    "<b>" + chart.data[i].name + "</b>: " + chart.data[i].dataPoints[j].y + "B";
                chart.options.data[i].dataPoints[j].y = chart.options.data[i].dataPoints[j].y + minValue;
                //chart.options.data[i].dataPoints[j].color = "red";
            } else {
                chart.options.data[i].dataPoints[j].toolTipContent =
                    "<b>" + chart.data[i].name + "</b>: " + chart.data[i].dataPoints[j].y + "B";
            }

    chart.render();
}

function setMinValue2(chart) {
    var range = chart.axisY[0].maximum - chart.axisY[0].minimum;
    var minValue = range * 0.01;
    for (var i = 0; i < chart.data.length; i++) {
        for (var j = 0; j < chart.data[i].dataPoints.length; j++) {
            if (chart.data[0].dataPoints[j].y === 0 && chart.data[1].dataPoints[j].y === 0 && chart.data[2].dataPoints[j].y === 0
                && chart.data[3].dataPoints[j].y === 0 && chart.data[4].dataPoints[j].y === 0 && chart.data[5].dataPoints[j].y === 0) {
                chart.options.data[i].dataPoints[j].y = chart.options.data[i].dataPoints[j].y + minValue;
            }

            if (i === 0) {
                chart.options.data[i].dataPoints[j].toolTipContent = "<b>Doanh số ký</b></br>" + "<b>" + chart.data[i].name + "</b>: " + chart.data[i].dataPoints[j].y + "B";
            } else if (i === 3) {
                chart.options.data[i].dataPoints[j].toolTipContent = "<b>Lãi gộp ký</b></br>" + "<b>" + chart.data[i].name + "</b>: " + chart.data[i].dataPoints[j].y + "B";
            } else {
                chart.options.data[i].dataPoints[j].toolTipContent = "<b>" + chart.data[i].name + "</b>: " + chart.data[i].dataPoints[j].y + "B";
            }
        }
    }

    chart.render();
}

function addIndexLabelsWithoutTotal(chart, type) {

    //var lstY = [];
    //var total = 0;
    //for (var z = 0; z < chart.options.data.length; z++) {
    //    if (chart.options.data[z].dataPoints.length > 0) {
    //        for (var k = 0; k < chart.options.data[z].dataPoints.length; k++) {
    //            //lstY.push((Math.abs(chart.options.data[z].dataPoints[k].y)));
    //            total += Math.abs(chart.options.data[z].dataPoints[k].y);
    //        }
    //    }
    //}    
    var maxVal = chart.axisY[0].get("maximum");
    //var avg = lstY.max() / 5;
    var avg = maxVal / 10;
    for (var j = 0; j < chart.options.data.length; j++) {
        for (var i = 0; i < chart.options.data[j].dataPoints.length; i++) {
            if (chart.options.data[j].dataPoints[i].y > avg) {
                if (type === 0) {
                    chart.options.data[j].dataPoints[i].indexLabel = "{y}B";
                } else {
                    chart.options.data[j].dataPoints[i].indexLabel = "{y}";
                }
                chart.options.data[j].dataPoints[i].indexLabelFontColor = "#fff";
            }
        }
    }

    //chart.options.data[lastVisibleDsIndex].indexLabel = "#total";
    chart.render();
}

function addIndexLabelsWithTotal(chart, type) {

    var lstY = [];
    //var obj = chart.axisX[0].stripLines[0];
    //chart.axisX[0].stripLines = [];
    var oppTotal = 0;
    var accTotal = 0;
    for (var z = 0; z < chart.options.data.length; z++) {
        if (chart.options.data[z].dataPoints.length > 0) {
            for (var k = 0; k < chart.options.data[z].dataPoints.length; k++) {
                lstY.push((Math.abs(chart.options.data[z].dataPoints[k].y)));
                if (type === 1 && typeof (chart.options.data[z].dataPoints[k].y) !== "undefined") {
                    if (chart.options.data[z].dataPoints[k].label === "Cơ hội") {
                        oppTotal += chart.options.data[z].dataPoints[k].y;
                    } else if (chart.options.data[z].dataPoints[k].label === "Khách hàng") {
                        accTotal += chart.options.data[z].dataPoints[k].y;
                    }
                }
            }
        }
    }
    var oppCheck = true;
    var accCheck = true;
    var avg = lstY.max() / 5;
    var maxVal = chart.axisY[0].get("maximum");
    var range = maxVal / 10;
    var dtp = [];
    for (var j = 0; j < chart.options.data.length; j++) {
        chart.options.data[j].indexLabelFontColor = "black";
        chart.options.data[j].indexLabelBackgroundColor = "LightBlue";
        chart.options.data[j].indexLabelPlacement = "outsie";
        //var total = 0;

        for (var i = 0; i < chart.options.data[j].dataPoints.length; i++) {
            if (Math.abs(chart.options.data[j].dataPoints[i].y) > range) {
                if (type === 1) {
                    chart.options.data[j].dataPoints[i].indexLabel = "{y}";
                } else {
                    chart.options.data[j].dataPoints[i].indexLabel = "{y}B";
                }
                chart.options.data[j].dataPoints[i].indexLabelFontColor = "#fff";
                chart.options.data[j].dataPoints[i].indexLabelBackgroundColor = "transparent";
                chart.options.data[j].dataPoints[i].indexLabelPlacement = "inside";
            } else {
                chart.options.data[j].dataPoints[i].indexLabel = null;
            }
            var total = 0;
            if (type === 0) {
                total = chart.options.data[0].dataPoints[i].y +
                    chart.options.data[1].dataPoints[i].y +
                    chart.options.data[2].dataPoints[i].y;
            }
            // else {
            //    total = chart.options.data[0].dataPoints[i].y +
            //        chart.options.data[1].dataPoints[i].y;
            //}
            //if (type === 0) {
            //    chart.options.data[j].dataPoints[i].label = chart.options.data[j].dataPoints[i].label + " : " + total.toFixed(1) + "B";
            //} else if (type === 1) {
            //    var month = chart.options.data[j].dataPoints[i].x.getMonth() + 1;
            //    if (month < 10) {
            //        chart.options.data[j].dataPoints[i].label = "Tháng 0" + month + " : " + total.toFixed(1) + "B";
            //    } else {
            //        chart.options.data[j].dataPoints[i].label = "Tháng " + month + " : " + total.toFixed(1) + "B";
            //    }
            //}            
            //chart.options.data[j].indexLabel = "#totalB";  

            //if (j === 0) {
            //var temp = {}; //JSON.parse(JSON.stringify(obj));}
            ////temp = Object.assign({}, obj);
            //temp = $.extend(true, {}, obj);
            //temp.options.value = chart.options.data[0].dataPoints[i].x;
            //temp.options.label = "Tổng: " + total + "B";

            //chart.axisX[0].stripLines.push(temp);
            //    chart.options.axisX.stripLines.push({
            //        value: chart.options.data[0].dataPoints[i].x,
            //        label: "" + total.toFixed(1) + " B",
            //        color: "transparent",
            //        thickness: 1,
            //        labelFontSize: 25,
            //        labelFontColor: "black",
            //        //labelBackgroundColor: "red",
            //        showOnTop: true
            //    });
            //}

            if (type === 0 && j === chart.options.data.length - 1) {
                dtp.push({
                    y: avg,
                    label: chart.options.data[j].dataPoints[i].label,
                    x: chart.options.data[j].dataPoints[i].x,
                    indexLabel: "" + total.toFixed(1) + "B",
                    indexLabelFontSize: 30,
                    indexLabelFontWeight: "bold",
                    indexLabelFontColor: "black",
                    indexLabelBackgroundColor: "transparent",
                    indexLabelPlacement: "inside"
                });
            }
            else if (type === 1) {
                if (chart.options.data[j].dataPoints[i].label === "Cơ hội" && oppCheck) {
                    dtp.push({
                        y: avg,
                        label: chart.options.data[j].dataPoints[i].label,
                        x: 0,
                        indexLabel: "" + oppTotal + "",
                        indexLabelFontSize: 30,
                        indexLabelFontWeight: "bold",
                        indexLabelFontColor: "black",
                        indexLabelBackgroundColor: "transparent",
                        indexLabelPlacement: "inside"
                    });
                    oppCheck = false;
                } else if (chart.options.data[j].dataPoints[i].label === "Khách hàng" && accCheck) {
                    dtp.push({
                        y: avg,
                        label: chart.options.data[j].dataPoints[i].label,
                        x: 1,
                        indexLabel: "" + accTotal + "",
                        indexLabelFontSize: 30,
                        indexLabelFontWeight: "bold",
                        indexLabelFontColor: "black",
                        indexLabelBackgroundColor: "transparent",
                        indexLabelPlacement: "inside"
                    });
                    accCheck = false;
                }
            }
        }

    }

    chart.options.data.push({
        type: "stackedBar",
        toolTipContent: null,
        showInLegend: false,
        indexLabel: "",
        indexLabelFontColor: "black",
        color: "transparent",
        name: "Total",
        dataPoints: dtp,
        indexLabelBackgroundColor: "transparent",
        indexLabelPlacement: "inside"
    });

    //chart.options.data[lastVisibleDsIndex].indexLabel = "#total";
    chart.render();
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

$(document).on("click", "#ViewasTable", function () {
    $("#chartArea").addClass("hidden");
    $("#ViewasTable").addClass("hidden");
    var url = $("#urlViewAsTable").val();
    var divId = parseInt($("#lstDivId").val());
    var fromDate = $("#SignedSalesAndGrossProfitChildFrom").val();
    var toDate = $("#SignedSalesAndGrossProfitChildTo").val();
    var loader = $("#loaderDashboard").html();
    $("#tableArea").removeClass("hidden");
    $("#ViewasChart").removeClass("hidden");
    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            //$("#tableArea").empty().append(loader);
            $("#SignedSalesAndGrossProfitChild-Form").addClass("hidden");
            $("#SignedSalesAndGrossProfitChild-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {
            $("#viewMode").val("table");
            $("#SignedSalesAndGrossProfitChild-Area").children()[1].remove();
            $("#SignedSalesAndGrossProfitChild-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            $("#tableArea").empty().append(data);
            $("#viewastable").DataTable({
                scrollY: "240px",
                scrollCollapse: true,
                scrollX: true,
                columnDefs: [
                    { width: 400, targets: 5 },
                    { width: 400, targets: 7 },
                    { width: 400, targets: 9 }
                ],
                fixedColumns: {
                    leftColumns: 1
                },
                paging: false,
                "searching": false,
                "ordering": false,
                "info": false
            });
        }
    });
});

$(document).on("click", "#ViewasChart", function () {
    $("#chartArea").removeClass("hidden");
    $("#viewMode").val("chart");
    $("#ViewasTable").removeClass("hidden");
    $("#tableArea").addClass("hidden");
    $("#ViewasChart").addClass("hidden");
    var divId = parseInt($("#lstDivId").val());
    InitSignedSaleAndGrossProfitByChild(divId);
});

$(document).on("click", "#ViewasTableModal", function () {
    $("#chartAreaModal").addClass("hidden");
    $("#ViewasTableModal").addClass("hidden");
    var url = $("#urlViewAsTable").val();
    var divId = parseInt($("#lstDivId").val());
    var fromDate = $("#SignedSalesAndGrossProfitChildFrom").val();
    var toDate = $("#SignedSalesAndGrossProfitChildTo").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            //$("#tableArea").empty().append(loader);            
            $("#SignedSalesAndGrossProfitChildModal-body").append(loader);
        },
        data: {
            'divId': divId,
            'fromDate': fromDate,
            'toDate': toDate
        },
        success: function (data) {
            $("#SignedSalesAndGrossProfitChildModal-body").children()[2].remove();
            $("#tableAreaModal").removeClass("hidden");
            $("#ViewasChartModal").removeClass("hidden");
            $("#tableAreaModal").empty().append(data);
        }
    });
});

$(document).on("click", "#ViewasChartModal", function () {
    $("#chartAreaModal").removeClass("hidden");
    $("#ViewasTableModal").removeClass("hidden");
    $("#tableAreaModal").addClass("hidden");
    $("#ViewasChartModal").addClass("hidden");
    var divId = parseInt($("#lstDivId").val());
    LoadSignedSalesAndGrossProfitChild(divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            if (data.SignedSalesByChild !== null && data.SignedSalesByChild.length > 0) {
                var chart1 = new CanvasJS.Chart("chartDivSignedSalesByChild-Modal", {
                    animationEnabled: true,
                    theme: "light2", //"light1", "dark1", "dark2"        
                    title: {
                        text: "Doanh số ký",
                        horizontalAlign: "left",
                        fontSize: 22,
                        fontFamily: "sans-serif",
                        fontWeight: "bolder"
                    },
                    toolTip: {
                        //contentFormatter: function (e) {

                        //    var content = "";
                        //    for (var i = 0; i < e.entries.length; i++) {                    
                        //        var entry = e.entries[i];
                        //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                        //    }

                        //    return content;
                        //},
                        fontSize: 22,
                        shared: true
                    },
                    axisY: {
                        gridThickness: 0,
                        lineThickness: 1,
                        suffix: "B",
                        labelAngle: 0,
                        labelFontSize: 15,
                        stripLines: [{
                            color: "black",
                            value: 0,
                            thickness: 1
                            //lineDashType: "longDashDot"
                        }]
                    },
                    axisX: {
                        interval: 1,
                        stripLines: []
                    },
                    data: data.SignedSalesByChild
                });
                chart1.render();
                setMinValue(chart1);
                addIndexLabelsWithTotal(chart1, 0);
            }
            if (data.GrossProfitByChild !== null && data.GrossProfitByChild.length > 0) {
                var chart2 = new CanvasJS.Chart("chartDivGrossProfitByChild-Modal", {
                    animationEnabled: true,
                    theme: "light2", //"light1", "dark1", "dark2"
                    title: {
                        text: "Lãi gộp ký",
                        horizontalAlign: "left",
                        fontSize: 22,
                        fontFamily: "sans-serif",
                        fontWeight: "bolder"
                    },
                    axisX: {
                        interval: 1,
                        stripLines: []
                    },
                    axisY: {
                        gridThickness: 0,
                        lineThickness: 1,
                        suffix: "B",
                        labelAngle: 0,
                        labelFontSize: 15,
                        stripLines: [{
                            color: "black",
                            value: 0,
                            thickness: 1
                            //lineDashType: "longDashDot"
                        }]
                    },
                    toolTip: {
                        //contentFormatter: function (e) {

                        //    var content = "<b>Lãi gộp ký:</b>";
                        //    for (var i = 0; i < e.entries.length; i++) {
                        //        var entry = e.entries[i];
                        //        content += "</br>" + entry.dataSeries.name + ": " + entry.dataPoint.y + "B";
                        //    }

                        //    return content;
                        //},
                        fontSize: 22,
                        shared: true
                    },
                    data: data.GrossProfitByChild
                });
                chart2.render();
                setMinValue(chart2);
                addIndexLabelsWithTotal(chart2, 0);
            }
        }
    });
});

$(document).on("click", "#ViewasTable2", function () {
    $("#chartArea2").addClass("hidden");
    $("#ViewasTable2").addClass("hidden");
    $("#tableArea2").removeClass("hidden");
    $("#ViewasChart2").removeClass("hidden");
    var url = $("#urlViewAsTable2").val();
    var divId = parseInt($("#lstDivId").val());
    var month = $("#ContactAbilityForDivDate").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            //$("#tableArea").empty().append(loader);
            $("#ContactAbilityForDiv-Form").addClass("hidden");
            $("#ContactAbilityForDiv-Area").append(loader);
            $("#lstDivId").attr("disabled", true);
        },
        data: {
            'divId': divId,
            'month': month
        },
        success: function (data) {
            $("#viewMode2").val("table");
            $("#ContactAbilityForDiv-Area").children()[1].remove();
            $("#ContactAbilityForDiv-Form").removeClass("hidden");
            $("#lstDivId").attr("disabled", false);
            $("#tableArea2").empty().append(data);
            $("#viewastable2").DataTable({
                scrollY: "200px",
                scrollCollapse: true,
                paging: false,
                fixedColumns: {
                    leftColumns: 1
                },
                scrollX: true,
                "searching": false,
                "ordering": false,
                "info": false
            });
        }
    });
});

$(document).on("click", "#ViewasChart2", function () {
    $("#chartArea2").removeClass("hidden");
    $("#viewMode2").val("chart");
    $("#ViewasTable2").removeClass("hidden");
    $("#tableArea2").addClass("hidden");
    $("#ViewasChart2").addClass("hidden");
    var divId = parseInt($("#lstDivId").val());
    SignedContractAbilityForDiv(divId);
});

$(document).on("click", "#ViewasTableModal2", function () {
    $("#chartAreaModal2").addClass("hidden");
    $("#ViewasTableModal2").addClass("hidden");
    var url = $("#urlViewAsTable2").val();
    var divId = parseInt($("#lstDivId").val());
    var month = $("#ContactAbilityForDivDate").val();
    var loader = $("#loaderDashboard").html();
    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $("#ContactAbilityForDivModal-body").append(loader);
        },
        data: {
            'divId': divId,
            'month': month
        },
        success: function (data) {
            $("#ContactAbilityForDivModal-body").children()[2].remove();
            $("#tableAreaModal2").removeClass("hidden");
            $("#ViewasChartModal2").removeClass("hidden");
            $("#tableAreaModal2").empty().append(data);
        }
    });
});

$(document).on("click", "#ViewasChartModal2", function () {
    var divId = parseInt($("#lstDivId").val());
    var month = $("#ContactAbilityForDivDate").val();
    var check = false;
    $("#chartAreaModal2").removeClass("hidden");
    $("#ViewasTableModal2").removeClass("hidden");
    $("#tableAreaModal2").addClass("hidden");
    $("#ViewasChartModal2").addClass("hidden");
    GetSignedContractAbilityForDiv(month, divId, function (data) {
        if (data !== "" && typeof (data) !== "undefined") {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].dataPoints.length; j++) {
                    if (data[i].dataPoints[j] != null) {
                        data[i].dataPoints[j].x = new Date(data[i].dataPoints[j].x.split("/")[1], parseInt(data[i].dataPoints[j].x.split("/")[0]) - 1, 1);
                        check = true;
                    }
                }
            }
            if (check) {
                var chart = new CanvasJS.Chart("chartSignedContractForDivAbility-Modal", {
                    animationEnabled: true,
                    axisX: {
                        valueFormatString: "MM",
                        interval: 1,
                        intervalType: "month",
                        prefix: "Tháng ",
                        reversed: true
                    },
                    axisY: {
                        gridThickness: 0,
                        suffix: "B",
                        labelAngle: 0,
                        stripLines: [{
                            color: "black",
                            value: 0
                            //lineDashType: "longDashDot"
                        }]
                    },
                    toolTip: {
                        //enabled: false,   
                        content: "<b>{legendText}</b>: {y} B",
                        shared: true,
                        fontSize: 22
                    },
                    legend: {
                        cursor: "pointer",
                        horizontalAlign: "right",
                        verticalAlign: "center",
                        fontSize: 16,
                        fontFamily: "sans-serif",
                        itemWidth: 140
                    },
                    data: data
                });
                chart.render();
                addIndexLabelsWithTotal(chart, 0);
                var interval = chart.axisY[0].get("interval");
                chart.axisY[0].set("interval", interval * 2);
            }
        }
    });
});