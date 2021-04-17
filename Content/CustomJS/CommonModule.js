$(function () {

    //do somethig common

    if (jQuery.fn.dataTableExt != undefined) {

        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "custom-num-pre": function (a) {
                var value = "";
                if (String(a).indexOf("<p") > -1) {

                    value = $("<div>" + a + "</div>").find("p").text().trim();
                }
                else {
                    value = ("" + a).trim();
                }
                var x = String(value).replace(/,/gi, "");
                if (x.trim() == '-') {
                    return 0;
                }

                return parseFloat(x);
            },

            "custom-num-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },

            "custom-num-desc": function (a, b) {

                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            },

            "custom-date-pre": function (a) {
                var value = "";
                if (String(a).indexOf("<p") > -1) {

                    value = $("<div>" + a + "</div>").find("p").text().trim();
                }
                else {
                    value = ("" + a).trim();
                }
                var x = String(value);
                if (x.trim() == '-' || x.trim() == '') {
                    return moment("01/01/0000", "DD/MM/YYYY");
                }
                //console.log(x);
                return moment(x, "DD/MM/YYYY");
            },

            "custom-date-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },

            "custom-date-desc": function (a, b) {

                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            },

        });
    }
});


