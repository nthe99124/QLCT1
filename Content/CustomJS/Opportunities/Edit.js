var validate;
$(document).ready(function () {
    //$(".select2").select2();

    $("#OppSuccessAbility,#OppEstimatedSales,#OppExpectedGrossProfit").attr("readonly", "");
    $("#OppProjectBudget,#OppEstimatedSales,#OppEstimatedSales_HW,#OppEstimatedSales_SW,#OppExpectedGrossProfit_SRV," +
        "#OppExpectedGrossProfit_SW,#OppExpectedGrossProfit_HW,#OppExpectedGrossProfit,#OppEstimatedSales_SRV").addClass("format-number");

    $("input.format-number").on("blur", ChangeInputNumberValue);
    $('[data-toggle="popover"]').popover();

    $("#OppProjectBudget,#OppEstimatedSales,#OppEstimatedSales_HW,#OppEstimatedSales_SW,#OppExpectedGrossProfit_SRV," +
        "#OppExpectedGrossProfit_SW,#OppExpectedGrossProfit_HW,#OppExpectedGrossProfit,#OppEstimatedSales_SRV").trigger("blur");

    if ($("#OppAcc").is(":visible")) {
        $("#OppAcc").select2();
        $('#OppAcc').on(':select', function (e) {
            $(e.currentTarget).valid();
        });
    }

    if ($("#OppOrgChart").is(":visible")) {
        $("#OppOrgChart").select2();
        $('#OppOrgChart').on('select2:select', function (e) {
            $(e.currentTarget).valid();
        });
    }

    if ($("#OpportunitiesType").is(":visible")) {
        $("#OpportunitiesType").select2();
        $('#OpportunitiesType').on('select2:select', function (e) {
            $(e.currentTarget).valid();
        });

        $("#BidOpportunitiesPhase").select2();
        $("#BidOpportunitiesPhase").on('select2:select', function (e) {
            $(e.currentTarget).valid();
        });
        $("#NoBidOpportunitiesPhase").select2();
        $("#NoBidOpportunitiesPhase").on('select2:select', function (e) {
            $(e.currentTarget).valid();
        });
    }

    if ($("#OppOwner").is(":visible")) {
        $("#OppOwner").select2({
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

        $("#OppOwner").data("select2").on("results:message", function () {
            this.dropdown._positionDropdown();
        });

        $('#OppOwner').on('select2:select', function (e) {
            $(e.currentTarget).valid();
        });
    }

    var userName = $("#Owner_Name").val();
    //var userId = $("#Request_UserId").val();
    if (userName !== "") {
        var $newOption1 = $("<option></option>").val(userName).text(userName);
        $("#OppOwner").append($newOption1).val(userName).trigger("change");
    } else {
        var currentUser = $("#current-user").val();
        if (currentUser !== "") {
            var $newOption2 = $("<option></option>").val(currentUser).text(currentUser);
            $("#OppOwner").append($newOption2).val(currentUser).trigger("change");
        }
    }

    var oppId = $("#OppId").val();
    if (oppId > 0) {
        if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_Bid") {
            $("#saleStage-area").removeClass("hidden");
            $("#bidOpportunitiesPhase-item").removeClass("hidden");
            $("#noBidOpportunitiesPhase-item").addClass("hidden");
            //$("#saleStage").val($("#BidOpportunitiesPhase").val());
            $("#bidOpportunitiesPhase").removeClass("hidden");
            $("#noBidOpportunitiesPhase").addClass("hidden");
            $("#expectedSignsDate-area").removeClass("hidden");
        } else if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_NoBid") {
            $("#saleStage-area").removeClass("hidden");
            $("#noBidOpportunitiesPhase-item").removeClass("hidden");
            $("#bidOpportunitiesPhase-item").addClass("hidden");
            //$("#saleStage").val($("#NoBidOpportunitiesPhase").val());
            $("#noBidOpportunitiesPhase").removeClass("hidden");
            $("#bidOpportunitiesPhase").addClass("hidden");
            $("#expectedSignsDate-area").removeClass("hidden");
        }

        var saleStage = $("#saleStage").val();
        if (saleStage !== "") {
            if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_Bid") {
                $("#BidOpportunitiesPhase").val(saleStage).trigger("change");
                for (var j = 0; j < $(".bidOpp-phase").length; j++) {
                    var dateVal = $("#bidOpp-val_" + j + "").val();
                    if (dateVal !== "") {
                        //var dateValConvert = new Date(dateVal).toLocaleDateString();
                        $("#bidOpp-phase_" + j + "").val(dateVal);
                    }
                }
            } else if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_NoBid") {
                $("#NoBidOpportunitiesPhase").val(saleStage).trigger("change");
                for (var i = 0; i < $(".noBidOpp-phase").length; i++) {
                    var dateValNoBid = $("#noBidOpp-val_" + i + "").val();
                    if (dateValNoBid !== "") {
                        //var dateValNoBidConver = new Date(dateValNoBid).toLocaleDateString();
                        $("#noBidOpp-phase_" + i + "").val(dateValNoBid);
                    }
                }
            }

        }
    } else {
        $("#OppEstimatedSales").val(0);
    }
    jQuery.validator.addMethod("greaterThan",
        function (value, element, params) {
            var index = parseInt(params);
            if (index >= 0 && value !== "") {
                var valueTo = value.split("/");
                var dateTo = new Date(+valueTo[2], valueTo[1] - 1, +valueTo[0]);
                var check = true;
                if (index < 3) {
                    for (var k = 0; k <= index; k++) {
                        var valueFrom = $("#bidOpp-phase_" + k + "").val().split("/");
                        var dateFrom = new Date(+valueFrom[2], valueFrom[1] - 1, +valueFrom[0]);
                        if (new Date(dateTo) < new Date(dateFrom)) {
                            check = false;
                        }
                    }
                }
                else if (index >= 3) {
                    for (var h = 0; h <= 3; h++) {
                        var valueFrom2 = $("#bidOpp-phase_" + h + "").val().split("/");
                        var dateFrom2 = new Date(+valueFrom2[2], valueFrom2[1] - 1, +valueFrom2[0]);
                        if (new Date(dateTo) < new Date(dateFrom2)) {
                            check = false;
                        }
                    }
                }

                if (check) {
                    return true;
                }
            }
            return false;
        }, "Ngày này phải sau ngày của bước trước!");

    OppValidate.init();
});

function SelectedTagsChanged() {
    var strVl = "";
    var dataTags = $('#select_Opp_Tags').val();
    if (dataTags != null && dataTags != undefined && dataTags.length > 0) {
        //$("#data_Acc_Tags").val(dataTags);
        strVl = dataTags.join(',');
    }
    $("#data_Opp_Tags").val(strVl);
}

function SelectedDivisionChanged(e) {
    if (!!e) {
        var objDivi = $(e);
        var divisionID = objDivi.val();
        $('#OppDivisionID').val(divisionID);
    }
}

$(document).on("change", "#OppEstimatedSales_HW,#OppEstimatedSales_SW,#OppEstimatedSales_SRV", function () {
    var oppEstimatedSalesTotal = 0;

    if ($("#OppEstimatedSales_HW").val() !== "") {
        oppEstimatedSalesTotal += parseInt($("#OppEstimatedSales_HW").val().replace(/,/g, ""));
    }
    if ($("#OppEstimatedSales_SW").val() !== "") {
        oppEstimatedSalesTotal += parseInt($("#OppEstimatedSales_SW").val().replace(/,/g, ""));
    }
    if ($("#OppEstimatedSales_SRV").val() !== "") {
        oppEstimatedSalesTotal += parseInt($("#OppEstimatedSales_SRV").val().replace(/,/g, ""));
    }

    $("#OppEstimatedSales").val(ReFormatInputNumber(oppEstimatedSalesTotal.toString()));
});

$(document).on("change", "#OppExpectedGrossProfit_HW,#OppExpectedGrossProfit_SW,#OppExpectedGrossProfit_SRV", function () {
    var oppExpectedGrossProfit = 0;
    if ($("#OppExpectedGrossProfit_HW").val() !== "") {
        oppExpectedGrossProfit += parseInt($("#OppExpectedGrossProfit_HW").val().replace(/,/g, ""));
    }
    if ($("#OppExpectedGrossProfit_SW").val() !== "") {
        oppExpectedGrossProfit += parseInt($("#OppExpectedGrossProfit_SW").val().replace(/,/g, ""));
    }
    if ($("#OppExpectedGrossProfit_SRV").val() !== "") {
        oppExpectedGrossProfit += parseInt($("#OppExpectedGrossProfit_SRV").val().replace(/,/g, ""));
    }

    $("#OppExpectedGrossProfit").val(ReFormatInputNumber(oppExpectedGrossProfit.toString()));
});

$(document).on("change", "#OppSuccessRate", function () {
    var oppSuccessRate = parseInt($("#OppSuccessRate").val());
    if (oppSuccessRate < 30) {
        $("#OppSuccessAbility").val("Khả năng thấp");
    }
    else if (oppSuccessRate >= 30 && oppSuccessRate < 80) {
        $("#OppSuccessAbility").val("Khả năng trung bình");
    }
    else if (oppSuccessRate >= 80) {
        $("#OppSuccessAbility").val("Khả năng cao");
    }
});

$(document).on("change", "#OpportunitiesType ", function () {
    if ($("#OpportunitiesType option:selected").text() === "Chọn loại cơ hội") {
        $("#saleStage-area").addClass("hidden");
        $("#noBidOpportunitiesPhase").addClass("hidden");
        $("#bidOpportunitiesPhase").addClass("hidden");
        $("#expectedSignsDate-area").addClass("hidden");
    }
    else if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_Bid") {
        $("#saleStage-area").removeClass("hidden");
        $("#bidOpportunitiesPhase-item").removeClass("hidden");
        $("#noBidOpportunitiesPhase-item").addClass("hidden");
        $("#saleStage").val($("#BidOpportunitiesPhase").val());
        $("#bidOpportunitiesPhase").removeClass("hidden");
        $("#noBidOpportunitiesPhase").addClass("hidden");
        $("#expectedSignsDate-area").removeClass("hidden");
    }
    else if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_NoBid") {
        $("#saleStage-area").removeClass("hidden");
        $("#noBidOpportunitiesPhase-item").removeClass("hidden");
        $("#bidOpportunitiesPhase-item").addClass("hidden");
        $("#saleStage").val($("#NoBidOpportunitiesPhase").val());
        $("#noBidOpportunitiesPhase").removeClass("hidden");
        $("#bidOpportunitiesPhase").addClass("hidden");
        $("#expectedSignsDate-area").removeClass("hidden");
    }
});

$(document).on("change", "#bidOpportunitiesPhase-item ", function () {
    if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_Bid") {
        $("#saleStage").val($("#BidOpportunitiesPhase").val());
    }

    var saleStageCode = $("#bidOpportunitiesPhase-item option:selected").val();
    if (saleStageCode !== "") {
        if (saleStageCode.split("_")[1] >= 6) {
            var currentEndPhase = $("#current-endPhaseBid").val();
            $("#" + currentEndPhase + "").addClass("hidden");
            $("#current-endPhaseBid").val(saleStageCode);
            $("#" + saleStageCode + "").removeClass("hidden");
        }
        if (saleStageCode.split("_")[1] > 6) {
            $("#reasonItem").removeClass("hidden");
        } else {
            $("#reasonItem").addClass("hidden");
        }
    }
});

$(document).on("change", "#noBidOpportunitiesPhase-item ", function () {
    if ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_NoBid") {
        $("#saleStage").val($("#NoBidOpportunitiesPhase").val());
    }
    var saleStageCode = $("#noBidOpportunitiesPhase-item option:selected").val();
    if (saleStageCode !== "") {
        if (saleStageCode.split("_")[1] >= 7) {
            var currentEndPhase = $("#current-endPhaseNoBid").val();
            $("#" + currentEndPhase + "").addClass("hidden");
            $("#current-endPhaseNoBid").val(saleStageCode);
            $("#" + saleStageCode + "").removeClass("hidden");
        } else {
            $("#current-endPhaseNoBid").val("NoBidOpportunitiesPhase_7");
            $("#NoBidOpportunitiesPhase_7").removeClass("hidden");
            $("#NoBidOpportunitiesPhase_8").addClass("hidden");
            $("#NoBidOpportunitiesPhase_9").addClass("hidden");
            $("#NoBidOpportunitiesPhase_10").addClass("hidden");
        }
        if (saleStageCode.split("_")[1] > 7) {
            $("#reasonItem").removeClass("hidden");
        } else {
            $("#reasonItem").addClass("hidden");
        }
    }
});

var OppValidate = function () {
    var handleMain = function () {
        $('#mainForm').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input
            invalidHandler: function (event, validator) { //display error alert on form submit
                //$('.alert-danger', $('#mainForm')).show();
                var errors = validator.numberOfInvalids();
                if (errors) {
                    var message = '';
                    for (var i in validator.invalid) {
                        if ($('[name="' + i + '"]').attr('datatitle')) {
                            message += '<b>- ' + $('[name="' + i + '"]').attr('datatitle') + '</b><br/>';
                        } else {
                            message += '<b>- ' + i + '</b><br/>';
                        }
                    }
                    $("#validationError").html(message);
                    $('#validationSummaryModal').modal('show');
                } else {
                    $('#validationSummaryModal').modal('hide');
                }
            },
            highlight: function (element) { // hightlight error inputs                
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label, element) {
                if ($(element).data('select2')) {
                    $(element).closest('.form-group').find(".select2-selection--single")
                        .removeClass('border-color-red');
                }
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                if (element.data('select2')) {
                    element.closest('div').append(error);
                    element.parent().children().children().find(".select2-selection--single").addClass('border-color-red');
                } else {
                    error.insertAfter(element.closest('.input-icon'));
                }
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
        if ($("#Opportunities_Name").is(":visible")) {
            $("#Opportunities_Name").rules("add", {
                required: true,
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }

        $.validator.addMethod('CheckDivision',
            function (value, element, requiredValue) {
                var result = !!value;
                if (!result) {
                    var valueLoad = $('#OppDivisionID').val();
                    result = !!valueLoad;
                }
            return result;
            },
            'Trường bắt buộc'
        );
        if ($("#OppOrgChart").is(":visible")) {
            $("#OppOrgChart").rules("add", {
                CheckDivision: true,
            });
        }
        
        if ($("#OppOwner").is(":visible")) {
            $("#OppOwner").rules("add", {
                required: true,
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }

        if ($("#OppSuccessRate  ").is(":visible")) {
            $("#OppSuccessRate").rules("add", {
                required: true,
                digits: true,
                min: 0,
                max: 100,
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }

        if ($("#OpportunitiesType").is(":visible")) {
            $("#OpportunitiesType").rules("add", {
                required: true,
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }

        if ($("#OppAcc").is(":visible")) {
            $("#OppAcc").rules("add", {
                required: true,
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }


        if ($("#OppBidCode").is(":visible")) {
            $("#OppBidCode").rules("add", {
                required: {
                    depends: function (element) {
                        return ($("#OpportunitiesType option:selected").val() === "OpportunitiesType_Bid" && $("#BidOpportunitiesPhase option:selected").val() !== "BidOpportunitiesPhase_1");
                    }
                },
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }

        if ($("#OpportunitiesType").is(":visible")) {
            $("#Opportunities_Reason").rules("add", {
                required: {
                    depends: function (element) {
                        return ($("#Opportunities_Reason").is(":visible"));
                    }
                },
                messages: {
                    required: "Trường bắt buộc"
                }
            });
        }

        //$("#ExpectedSignsDate").rules("add", {            
        //    required: true,
        //    messages: {
        //        required: "Trường bắt buộc"
        //    }
        //});

        if ($("#OpportunitiesType").is(":visible")) {
            for (var j = 0; j < $(".bidOpp-phase").length; j++) {
                if (j > 0 && j < 5) {
                    var index = j - 1;
                    //if ($("#bidOpp-phase_" + j + "").is(":visible")) {
                    for (var k = 0; k <= index; k++) {
                        $("#bidOpp-phase_" + j + "").rules("add",
                            {
                                required: true,
                                greaterThan: k,
                                messages: {
                                    required: "Trường bắt buộc"
                                }
                            });
                    }
                    //}                
                } else {
                    //if ($("#bidOpp-phase_" + j + "").is(":visible")) {
                    $("#bidOpp-phase_" + j + "").rules("add",
                        {
                            required: true,
                            messages: {
                                required: "Trường bắt buộc"
                            }
                        });
                    //}                
                }
            }

            //for (var i = 0; i < $(".noBidOpp-phase").length; i++) {
            //if ($("#OppOrgChart").is(":visible")) {
            //$("#noBidOpp-phase_5").rules("add", {
            //    required: true,
            //    messages: {
            //        required: "Trường bắt buộc"
            //    }
            //});
            //}
            //}
            for (var i = 5; i < $(".noBidOpp-phase").length; i++) {
                $("#noBidOpp-phase_" + i + "").rules("add",
                    {
                        required: true,
                        messages: {
                            required: "Trường bắt buộc"
                        }
                    });
            }
        }
    };
    return {
        init: function () {
            handleMain();
        }
    };
}();

$(document).on("click", "#addBtn", function () {
    if ($("#mainForm").valid()) {
      
        if ($("#BidOpportunitiesPhase").val() === "BidOpportunitiesPhase_6") {
            var saleStageDate = $("#bidOpp-phase_4").val();
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại!"
                });
                return;
            }
        } else if ($("#NoBidOpportunitiesPhase").val() === "NoBidOpportunitiesPhase_7") {
            var saleStageDate = $("#noBidOpp-phase_5").val();
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại!"
                });
                return;
            }
        }


        var div = CheckCurrentDivision($("#OppDivisionID").val());
        if (!div) {
            bootbox.alert({
                title: "Thông báo",
                message: "Đơn vị hiện tại chưa có mã bộ phận hoặc ký hiệu đơn vị !!"
            });
            return;
        }


        bootbox.confirm({
            title: "<i class='fa fa-exclamation-triangle' aria-hidden='true'></i> &nbsp; Lưu ý",
            message: "Cơ hội sau khi tạo sẽ không thể xóa </br> Bạn có chắc chắn muốn tạo cơ hội này không?",
            buttons: {
                confirm: {
                    label: 'Có',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Không',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result === true) {
                    $("#mainForm").submit();
                }
            }
        });
    }
});

$(document).on("changeDate", "#bidOpp-phase_4", function () {
    if ($("#BidOpportunitiesPhase").val() === "BidOpportunitiesPhase_6") {
        var saleStageDate = $("#bidOpp-phase_4").val();
        if (saleStageDate !== "") {
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại!"
                });
                return;
            }
        }
    }
});

$(document).on("change", "#BidOpportunitiesPhase", function () {
    if ($("#BidOpportunitiesPhase").val() === "BidOpportunitiesPhase_6") {
        var saleStageDate = $("#bidOpp-phase_4").val();
        if (saleStageDate !== "") {
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại!"
                });
                return;
            }
        }
    }
});


$(document).on("changeDate", "#noBidOpp-phase_5", function () {
    if ($("#NoBidOpportunitiesPhase").val() === "NoBidOpportunitiesPhase_7") {
        var saleStageDate = $("#noBidOpp-phase_5").val();
        if (saleStageDate !== "") {
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại!"
                });
                return;
            }
        }
    }
});

$(document).on("change", "#NoBidOpportunitiesPhase", function () {
    if ($("#NoBidOpportunitiesPhase").val() === "NoBidOpportunitiesPhase_7") {
        var saleStageDate = $("#noBidOpp-phase_5").val();
        if (saleStageDate !== "") {
            var parts = saleStageDate.split('/');
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            var currentDate = new Date();
            if (mydate > currentDate) {
                bootbox.alert({
                    title: "Thông báo",
                    message: "Ngày kí không được lớn hơn ngày hiện tại!"
                });
                return;
            }
        }
    }
});

$(document).on("click", "#updateBtn", function () {
    if ($("#BidOpportunitiesPhase").val() === "BidOpportunitiesPhase_6") {
        var saleStageDate = $("#bidOpp-phase_4").val();
        var parts = saleStageDate.split('/');
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        var currentDate = new Date();
        if (mydate > currentDate) {
            bootbox.alert({
                title: "Thông báo",
                message: "Ngày kí không được lớn hơn ngày hiện tại!"
            });
            return;
        }

    } else if ($("#NoBidOpportunitiesPhase").val() === "NoBidOpportunitiesPhase_7") {
        var saleStageDate = $("#noBidOpp-phase_5").val();
        var parts = saleStageDate.split('/');
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        var currentDate = new Date();
        if (mydate > currentDate) {
            bootbox.alert({
                title: "Thông báo",
                message: "Ngày kí không được lớn hơn ngày hiện tại!"
            });
            return;
        }
    }
    if ($("#OppDivisionID").val() != $("#CurrentDivisionID").val()) {
        var div = CheckCurrentDivision($("#OppDivisionID").val());
        if (!div) {
            bootbox.alert({
                title: "Thông báo",
                message: "Đơn vị hiện tại chưa có mã bộ phận hoặc ký hiệu đơn vị !!"
            });
            return;
        }
    }
    
    $("#mainForm").submit();
});

function CheckCurrentDivision(divId) {
    var url = $("#checkDiv").val();
    var isCheck = true;
    $.ajax({
        "url": url,
        type: "GET",
        "dataType": "json",
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: {
            divId: divId
        },
        success: function (dt) {
            isCheck = dt.Data;
        }
    });
    return isCheck;
}