function urlExists(url, callback) {
    $.ajax({
        url: url,
        success: function () {
            callback(true);
        },
        error: function () {
            callback(false);
        }
    });
}

function RenderPager(datapage, ajax) {
    var html = "";
    var fisrtItem = datapage.FirstItemIndex;
    var lastItem = datapage.LastItemIndex;
    var totalitem = datapage.TotalItemCount;
    var pagesize = datapage.PageSize;

    html += '<div class="col-md-5"><span>Hiển thị ' + fisrtItem + ' - ' + lastItem + ' / ' + totalitem + ' bản ghi</span></div>';

    html += '<div class="col-md-7"><div style="text-align: right;" id="sample_1_paginate" class="dataTables_paginate paging_bootstrap_full_number"><ul style="visibility: visible;" class="pagination">';

    if (datapage.Pages.length >= 2) {

        var index = datapage.CurrentPage;
        if (index > 1 && datapage.Pages.length > 0) {
            html += '<li class="prev"><a title=\'First\' onclick="' + ajax + '(1)"><i class=\'fa fa-angle-double-left\'></i></a></li>';
        }

        if (datapage.HasPrevPage) {
            html += '<li class=\'prev\'><a title=\'Prev\'  onclick="' + ajax + '(' + (index - 1) + ')"><i class=\'fa fa-angle-left\'></i></a></li>';
        }
        for (var i = 0; i < datapage.Pages.length; i++) {
            if (pagesize >= totalitem) {
                continue;
            }
            var x = datapage.Pages[i];
            if (x == datapage.CurrentPage) {
                html += '<li class=\'active\'><a>' + (datapage.Pages[i]) + '</a></li>';
            }
            else {
                html += '<li><a onclick="' + ajax + '(' + x + ')">' + datapage.Pages[i] + '</a></li>';
            }
        }
        if (datapage.HasNextPage) {
            html += '<li class=\'next\'><a title=\'Next\' onclick="' + ajax + '(' + (index + 1) + ')"><i class=\'fa fa-angle-right\'></i></a></li>';
            //last page
            html += '<li class=\'next\'><a title=\'Last\' onclick="' + ajax + '(' + (datapage.LastPage) + ')"><i class=\'fa fa-angle-double-right\'></i></a></li>';

        }
    }
    $('#pagination').html(html);
}

function xValidate(arrId) {
    var mess = "";
    for (var i = 0; i < arrId.length; i++) {
        var item = arrId[i];

        var a = $('#' + item.Id).val();
        if (a == '') {
            mess += "* Bạn cần nhập nội dung cho " + item.Name + "<br />";
        }

        if (item.Type != undefined && a != '') {

            if (item.Type == 'int') {
                var x = replaceAll('.', '', replaceAll(',', '', a));
                if (!isDigit(x)) {
                    mess += "* " + item.Name + " Phải là kiểu số <br />";
                }
            }
        }
    }
    if (mess != "") {
        Site.Alert(mess);
        return false;
    }
    return true;
}

function DisplayDateJson(datejson, full) {
    var date = new Date(parseInt(datejson.substr(6)));
    var s = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    if (full) {
        s += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
    return s;
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}

function isDigit(c) {
    return ((c >= 0) && (c <= 9));
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function ReplaceNoNumber(str) {
    if (str == undefined)
        return '0';
    var number = '0,1,2,3,4,5,6,7,8,9';
    var chars = str.split('');
    var nb = number.split(',');
    var ret = '';
    for (var i = 0; i < chars.length; i++) {
        for (var j = 0; j < nb.length; j++) {
            if (nb[j] == chars[i]) {
                ret += nb[j];
                break;
            }
        }
    }
    if (ret == '') {
        ret = '0';
    }
    return ret;
}

function isValidDate(day, month, year) {
    var x = year += '';
    if (x.length != 4) {
        return false;
    }

    if (month < 1 || month > 12) { // check month range
        return false;
    }
    if (day < 1 || day > 31) {
        return false;
    }
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        return false;
    }
    if (month == 2) { // check for february 29th
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            return false;
        }
    }
    return true;
}

//fllow minute

function get_cookie(cookie_name) {
    var cookieValue = document.cookie;
    var cookieRexp = new RegExp("\\b" + cookie_name + "=([^;]*)");
    cookieValue = cookieRexp.exec(cookieValue);
    if (cookieValue != null) {
        cookieValue = cookieValue[1];
    }
    else {
        cookieValue = 0;
    }
    return cookieValue;
}

function set_cookie(cookie_name, value, expire) {
    var expire_date = new Date();

    var futdate = new Date();
    var expdate = futdate.getTime();
    expdate += expire * 1000;
    futdate.setTime(expdate);

    document.cookie = (cookie_name + "=" + escape(value) + ((expire == null) ? "" : ";expires=" + futdate.toGMTString()));
    return true;
}
function parseJsonDate(jsonDateString) {
    var date = new Date(parseInt(jsonDateString.substr(6)));
    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}


//so sánh file upload extension giữa sys setting và setting của từng mang hình
//VD: màn hình upload tài liệu chỉ cho file doc và docx, nhưng sys setting chỉ cho up file docx => dùng hàm này để đồng bộ
//extensionArray= Compare_Extension_Setting("#sysSettingHiddenId", extensionArray);
function Compare_Extension_Setting(sysSettingHiddenId, extensionArray) {
    var sysSettingValue = ";" + $(sysSettingHiddenId).val().toLocaleLowerCase() + ";";
    //var sysSettingArr = sysSettingValue.split(";");
    var newArray = [];
    $.each(extensionArray, function (index, value) {
        var newval = value.replace(".", "").toLocaleLowerCase();
        if (sysSettingValue.indexOf(";" + newval + ";") != -1 || (newval == sysSettingValue)) {
            newArray.push(value);
        }
    });
    return newArray;
}


//$.fn.ResetForm = function () {
//    $(this).each(function () {
//        $(this).trigger('reset.unobtrusiveValidation');
//    });
//};
/*-------------------------------End Manu Cookie JS-----------------------------------*/

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}
//Check all table
$(document).ready(function () {
    $('#sample_1 input:first:checkbox').click(function () {
        if ($(this).is(':checked')) {
            $('#sample_1  input.selected:checkbox').each(function () {
                $(this).attr("checked", true);
            });
        } else {
            $('#sample_1 input.selected:checkbox').each(function () {
                $(this).attr("checked", false);
            });
        }
    });
});
$('#sample_1 tr td').find('input[type=checkbox]').click(function () {
    if ($(this).prop('checked') == false) {
        $('#sample_1 input:first:checkbox').attr("checked", false);
    }
    var count = 0;
    var cbo = $('#sample_1 tr td').find('.checkboxes').length;
    $('#sample_1 tr td').find('input[type=checkbox]').each(function () {
        if ($(this).prop('checked')) {
            count++;
            if (count == cbo) {
                $('#sample_1 input:first:checkbox').attr("checked", true);
            }
        }
    });
});
//Active phân trang begin
function PagerClick(value) {
    var pgr = $("#PaginationInfo_CurrentPageIndex");
    if ($("#PaginationInfo_CurrentPageIndex").length == 0) {
        pgr = $("#Pagging_CurrentPageIndex");
    }
    pgr.val(value);
    $("#btn_submitpaging").click();

};

$(function () {

    var pgr = $("#PaginationInfo_CurrentPageIndex");
    if ($("#PaginationInfo_CurrentPageIndex").length == 0) {
        pgr = $("#Pagging_CurrentPageIndex");
    }

    var page = pgr.val();
    if (page == 0) {
        $(".pagination li").eq(0).addClass("active");
    }
    else if (page > 0) {
        $(".pagination li a").each(function (index) {
            if ($(this).text() == page) {
                $(this).parent(".pagination li").addClass("active");
            }
        });
    }
});

function DetectMobile(byWidth) {
    if (byWidth != undefined && byWidth != false && byWidth != 0) {
        if (window.innerWidth <= 800) {
            return true;
        } else {
            return false;
        }
    } else {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        }
        else {
            return false;
        }
    }

}

function ReFormatInputNumber(value) {
    //value có dạng xxxx.xxxxx
    //format thành x,xxx.xxxxx
    value = value + "";
    if (value == undefined || value == "") {
        return "0";
    }
    var idd = value.split(".");
    if (idd.length > 1) {
        value = idd[0];
        idd = idd[1];
    } else {
        idd = false;
    }
    while (/(\d+)(\d{3})/.test(value)) {
        value = value.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    //ở đây phải dùng !==
    if (idd !== false) {
        value = value + "." + idd;
    }
    return value;
}


function isHiddenDOM(el) {
    if (typeof (el) != "undefined") {
        var style = window.getComputedStyle(el);
        return (style.display === 'none');
    }
    return false;
}


function ChangeInputNumberValue(item) {
    var value = ReFormatInputNumber($(item.target).val(), true);
    if (value != undefined && value != "NaN" && value != "Infinity") {
        $(item.target).val(value);
    } else {
        $(item.target).val("");
    }
}

///hàm dùng chung, phải vứt vào common js
function GetFormData() {
    try {
        var form = new FormData();
        var fields = $("#field-define").val();

        var fieldArray = fields.split(',');

        $.each(fieldArray, function (index, value) {
            var inputvalue = $("#" + value).val();
            form.append(value, inputvalue);
            console.log(value, inputvalue);
        });
        return form;

    } catch (e) {
        console.log("Utility.js - GetFormData: ", e);
        return null;
    }
}

//doccument ready
$(function () {
    $("input.format-number").on("blur", ChangeInputNumberValue);

    try {
        if ($.fn.dataTable != undefined) {
            $.fn.dataTable.ext.errMode = function (e, f, g) {

                console.log("Lỗi fn.dataTable: ");
                console.log(e);
                console.log(f);
                console.log(g);
                console.log("End lỗi fn.dataTable: ");
                bootbox.confirm("Không thể tải dữ liệu, vui lòng tải lại trang!", function (chk)
                {
                    if (chk) {
                        window.location.href = window.location.href;
                    }
                }

                    )
            };
        }
    } catch (e) {
        console.log(e);
    }
});

function defaultAjaxErrorHandle(xhr, error, code) {
    console.log("Utility.js: datatable error: ");
    console.log("datatable error xhr: ", xhr);
    console.log("datatable error: ", error);
    console.log("datatable error code: ", code);
    bootbox.confirm("Không thể tải dữ liệu, vui lòng tải lại trang!", function (chk) {
        if (chk) {
            window.location.href = window.location.href;
        }
    });
}

function TryDestroySelec2(id) {
    try {

        if ($(id).hasClass("select2-hidden-accessible")) {
            $(id).select2("destroy");
        }
    } catch (e) {

    }
}


$(document).on("change", "input.format-number", function () {
    debugger;
    var number = $(this).val().trim().replace(/[^0-9-]/g, "");
    $(this).val(TryParseInt(number, 0));
});

/**
 * hàm try parse in
 * @param {any} str
 * @param {any} defaultValue
 * congvb3
 */
function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
        if (str.length > 0) {
            if (!isNaN(Math.sign(str))) {
                retValue = parseInt(str);
            }            
        }
    }
    return retValue;
}
/**
 * thêm đối tượng element custom jquery vào vị trí
 * @param {any} index
 * @param {any} element
 * congvb3
 */
jQuery.fn.insertAtrToindex = function (index, element) {
    var lastIndex = this.children().size();
    if (index < 0) {
        index = Math.max(0, lastIndex + 1 + index);
    }
    this.append(element);
    if (index < lastIndex) {
        this.children().eq(index).before(this.children().last());
    }
    return this;
}
/**
 * hàm xóa 1 item trong 1 list
 * @param {any} data
 * @param {any} item
 */
function RemoveItemInList(data, item) {
    if (!!data && data.length > 0) {
        var ind = data.findIndex(i => i == item);
        data.splice(ind, 1);
        return data;
    }
}

/**
 * hamf settime out cos clead
 * @param {any} fn
 * @param {any} interval
 */
function Timeout(fn, interval) {
    var id = setTimeout(fn, interval);
    this.cleared = false;
    this.clear = function () {
        this.cleared = true;
        clearTimeout(id);
    };
}

