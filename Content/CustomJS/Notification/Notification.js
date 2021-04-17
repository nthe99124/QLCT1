$(document).ready(function () {

    $("#btnSubmitSearch").on("click", function () {
        $("#PaginationInfo_CurrentPageIndex").val("1");
        $("#btn_submitpaging").click();
    });

    BindEventShowNoti();
    //span-count-noti
    ReloadNoti();
    $("#mark-all-as-read").click(function () {
        var urlNo =  $("#hostAddress").val() + "/Notification/MarkAsRead";
        var list = [];

        var data = {
            list: list
        };
        $.ajax({
            url: urlNo,
            type: "POST",
            data: data,
            success: function (dataReturn) {
                ReloadNoti();
               
            },
            error: function (e) {
                console.log(e.message);
            }
        });
    });

    //change to redirect
    $(".notification-menu a").click(function () {
        $(this).removeClass("unread");
    });

});

var doneLoad = 1;
function ReloadNoti() {
    doneLoad = 0;
    var url = $("#hostAddress").val() + "/Notification/GetListNotification";
    $("#noti-containner ul > li.noti-items").html("");
    $("#span-count-noti").text("");
    $("#noti-containner ul > li.header").text("Thông báo mới: 0/0");
    $.ajax({
        url: url,
        type: "get",
        //dataType: "json",
        //traditional: true,
        success: function (data) {

            if (data == null) {
                console.log("Error load notification");
            } else {
                //span-count-noti
                var total = data.TotalRecord == undefined ? 0 : data.TotalRecord ;
                var totalUnread = data.TotalUnread;
                var record = data.NotificationList;
                if (totalUnread != undefined && totalUnread > 0) {

                    $("#noti-containner ul > li.header").text("" + " Thông báo mới: " + totalUnread + "/" + total);

                    if (totalUnread > 99) {
                        totalUnread = "99+";
                    } else {
                        totalUnread = "" + totalUnread;
                    }
                } else {
                    totalUnread = "";
                }
                $("#span-count-noti").text(totalUnread);

                var tempUri = $("#hostAddress").val() + "/Notification/RedirrectAction?Id=";
                var html = "";
                if (record != undefined && record.length > 0) {
                    $.each(record, function (index, value) {
                        var isread = value.IsRead == 1 ? "" : "unread"
                        var date1 = moment(value.CreatedDate).format('HH:mm MM/DD/YYYY');
                        var row = "<ul class='menu " + isread + "' >";
                        row += "<li class='notification-menu'>";
                        var encodedVl = htmlEncode(value.Content);
                        row += "<a href='" + (tempUri + value.Id) + "' title='" + encodedVl + "'>";
                        row += "<i class='fa fa-envelope-o text-success'></i> " + encodedVl + " <br/>" + " <small>" + date1 + "</small>";
                     
                        row += "</a>";
                        row += "</li>";
                        row += "</ul> ";
                        html += row;

                    });
                }
                $("#noti-containner ul > li.noti-items").html(html);
                doneLoad = 1;
            }
        },
        error: function (e) {
            doneLoad = 1;
            //called when there is an error
            console.log(e.message);
        }
    });

}

function BindEventShowNoti() {
    $('#noti-containner').on('show.bs.dropdown', function () {
        if (doneLoad == 1) {
            ReloadNoti();
        }
    });
}

function DeleteItems(id) {
    var msgConfirmDelete = $("#msgConfirmDelete").val();
    $("#ListId").val(id);
    bootbox.confirm("" + msgConfirmDelete, function (result) {
        if (result == true) {
            $("#cmd_deletemulti").click();
        }
    });
}