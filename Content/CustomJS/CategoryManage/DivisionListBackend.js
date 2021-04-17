var txtAF = $("#txtAF").val();
var txtCOO = $("#txtCOO").val();
var txtDL = $("#txtDL").val();
var txtQaLead = $("#txtQaLead").val();
var txtManager = $("#txtManager").val();
var txtAM = $("#txtAM").val();

var DivisionValidate = function () {
    var handleMain = function () {
        $('#renameDivisionForm').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input

            invalidHandler: function () { //display error alert on form submit   
                $('.alert-danger', $('#renameDivisionForm')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            }

            //,submitHandler: function (form) {
            //    //form.submit();
            //    return true;
            //}
        });

        $('#addDivisionForm').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input

            invalidHandler: function () { //display error alert on form submit   
                $('.alert-danger', $('#addDivisionForm')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            }

            //,submitHandler: function (form) {
            //    //form.submit();
            //    return true;
            //}
        });

        $("#cateName").rules("add", {
            required: true,
            maxlength: 50,
            messages: {
                required: $('#requiredMessage').val()
                , maxlength: $('#maxLengthMessage').val()
            }
        });

        $("#nameForCreate").rules("add", {
            required: true,
            maxlength: 50,
            messages: {
                required: $('#requiredMessage').val()
                , maxlength: $('#maxLengthMessage').val()
            }
        });

        $("#codeForCreate").rules("add", {
            required: true,
            maxlength: 50,
            messages: {
                required: $('#requiredMessageCode').val()
                , maxlength: $('#maxLengthMessage').val()
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            handleMain();
        }
    };
}();

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}  

$(function () {
    var msgInputTooShort = $("#msgInputTooShort").val();
    var msgInputTooLong = $("#msgInputTooLong").val();
    var msgAjaxError = $("#msgAjaxError").val();
    var msgSearching = "<span><i class='fa fa-spin fa-spinner'></i> " + $("#msgSearching").val() + "</span>";
    var msgNoMatches = $("#msgNoMatches").val();
    var msgLoadMore = $("#msgLoadMore").val();
    //Select 2

    //$("#SearchUserInLdapForStaff").select2({
    //    tags: true,
    //    minimumInputLength: 2,
    //    allowClear: true,
    //    multiple: true,
    //    formatInputTooShort: function (term, minLength) { return msgInputTooShort; },
    //    formatInputTooLong: function (term, maxLength) { return msgInputTooLong; },
    //    formatAjaxError: function (jqXHR, textStatus, errorThrown) { return msgAjaxError; },
    //    formatSearching: function () { return msgSearching; },
    //    formatNoMatches: function (term) { return msgNoMatches; },
    //    formatLoadMore: function (pageNumber) { return msgLoadMore; },
    //    ajax: {
    //        url: $("#urlSearchUser").val(),
    //        dataType: 'json',
    //        type: "GET",
    //        data: function (term, page) {
    //            return {
    //                keySearch: term,
    //                default: $("#SearchUserInLdapForStaff").attr('ct-user')
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


    $("#SearchUserInLdapForStaff").select2({
        minimumInputLength: 2,
        allowClear: true,
        width: '100%',
        multiple: true,
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

    UITree.init();
    DivisionValidate.init();
});

function loadStaff(data) {
    var urlLoadStaff = $('#urlLoadStaff').val();

    $.ajax({
        url: urlLoadStaff,
        type: 'POST',
        data: { divisionId: data.node.id },
        success: function (result) {
            var html = '';
            //if (result.ListCOO && result.ListCOO.length > 0) {
            //    html = '<div class="text-bold">' + txtCOO + ':</div>';
            //    for (var i = 0; i < result.ListCOO.length; i++) {
            //        var item = result.ListCOO[i];
            //        html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'COO\', ' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
            //    }
            //}
            ////html += '</ul>';
            //if (result.ListAF && result.ListAF.length > 0) {
            //    html += '<div class="text-bold">'+txtAF+':</div>';
            //    for (var i = 0; i < result.ListAF.length; i++) {
            //        var item = result.ListAF[i];
            //        html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'AF\',' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
            //    }
            //}
            //if (result.ListDL && result.ListDL.length > 0) {
            //    html += '<div class="text-bold">' + txtDL + ':</div>';
            //    for (var i = 0; i < result.ListDL.length; i++) {
            //        var item = result.ListDL[i];
            //        html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'DL\',' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
            //    }
            //}

            //if (result.ListQALead && result.ListQALead.length > 0) {
            //    html += '<div class="text-bold">' + txtQaLead + ':</div>';
            //    for (var i = 0; i < result.ListQALead.length; i++) {
            //        var item = result.ListQALead[i];
            //        html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'QaLead\',' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
            //    }
            //}
            if (result.ListManager && result.ListManager.length > 0) {
                html += '<div class="text-bold">' + txtManager + ':</div>';
                for (var i = 0; i < result.ListManager.length; i++) {
                    var item = result.ListManager[i];
                    html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'Manager\',' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
                }
            }
            if (result.ListAM && result.ListAM.length > 0) {
                html += '<div class="text-bold">' + txtAM + ':</div>';
                for (var i = 0; i < result.ListAM.length; i++) {
                    var item = result.ListAM[i];
                    html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'AM\',' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
                }
            }
            if (result.ListAF && result.ListAF.length > 0) {
                html += '<div class="text-bold">' + txtAF + ':</div>';
                for (var i = 0; i < result.ListAF.length; i++) {
                    var item = result.ListAF[i];
                    html += '<div>- ' + item.FullName + ' (' + item.Username + ') <a href="javascript:deleteStaff(\'AF\',' + data.node.id + ',' + item.Id + ')"><i class="fa fa-times"/></a></div>';
                }
            }

            if (html != '') {
                $('#listStaff').append(html);
            }
        },
        error: function () {
        }
    });
}

function deleteStaff(type, divisionId, userId) {
    var url = $('#deleteStaffUrl').val();
    var msg = '';
    msg = $('#confirmDeletemember').val();
    bootbox.confirm(msg,
        function (result) {
            if (result) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: { type: type, divisionId: divisionId, userId: userId },
                    success: function (result) {
                        switch (result.ResultCode) {
                            case 1:
                                {
                                    //location.reload(true);
                                    //getData();
                                    $('#Divisiontree').jstree(true).refresh();
                                    break;
                                }
                            case 0:
                                {
                                    bootbox.alert(result.Message);
                                    break;
                                }
                            default:
                                break;
                        }
                    },
                    error: function () {
                    }
                });
            }
        });
}

function SuccessMessage(result) {
    
    switch (result.ResultCode) {
        case 1:
            {
                $("#SearchUserInLdapForStaff").val(null).trigger("change");
                $('#AddStaff').modal('toggle');
                $('#Divisiontree').jstree(true).refresh();
                break;
            }
        case 0:
            {
                bootbox.alert(result.Message);
                break;
            }
        default:
            $('#AddStaff').modal('toggle');
            break;
    }
}

function SuccessAddDivision(result) {
    switch (result.ResultCode) {
        case 1:
            {
                $('#AddDivision').modal('toggle');
                $('#Divisiontree').jstree(true).refresh();
                break;
            }
        case 0:
            {
                bootbox.alert(result.Message);
                break;
            }
        case 2:
            {
                //catecode bị trùng.
                //bootbox.alert(result.Message);
                $("#valiadateCateCode").text(result.Message);
                $("#valiadateCateCode").show();
                break;
            }
        case 3:
            {
                bootbox.alert(result.Message);
                break;
            }
        default:
            break;
    }
}

function FailMessage(obj) {
    //$("#SearchUserInLdapForStaff").val("");
    //$("#SearchUserInLdapForStaff").select2("val", "");
    $("#SearchUserInLdapForStaff").val(null).trigger("change");
}

function FailMessageDivision(obj) {

}

function ValidateUserName() {
    if ($.trim($('#SearchUserInLdapForStaff').val()) == '') {
        bootbox.alert($('#informSelectAnUser').val());
        return false;
    }
    return true;
}

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
    //$("#SearchUserInLdapForStaff").val("");
    //$("#SearchUserInLdapForStaff").select2("val", "");
    $("#SearchUserInLdapForStaff").val(null).trigger("change");
}

var UITree = function () {
    var assignRequesterText = $('#assignMember').val();
    var addDivisionText = $('#addDivision').val();
    var deleteDivisionText = $('#deleteDivision').val();
    var renameDivisionText = $('#renameDivision').val();
    var contextualMenu = function () {
        //render cây division
        $("#Divisiontree").jstree({
            "core": {
                "themes": {
                    "responsive": true
                },
                "check_callback": true,
                "data": {
                    'url': $('#divisionLoad').val(),
                    'type':'POST',
                    'success': function (node) {
                        return { 'id': node.id };
                    }
                }
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            },
            contextmenu: {
                items: function ($node) {
                    if ($node.parent == '#') {
                        return {
                            addDivision: {
                                "separator_before": false,
                                "icon": "fa fa-plus-square-o",
                                "separator_after": false,
                                "_disabled": false,
                                "label": addDivisionText,
                                "action": function (obj) {
                                    addDivision(obj);
                                }
                            }
                        };
                    } else {
                        return {
                            assignRequester: {
                                "separator_before": false,
                                "icon": "fa fa-user",
                                "separator_after": false,
                                "_disabled": false,
                                "label": assignRequesterText,
                                "action": function (obj) {
                                    assignRequester($node, obj);
                                }
                            },
                            addDivision: {
                                "separator_before": true,
                                "icon": "fa fa-plus-square-o",
                                "separator_after": false,
                                "_disabled": false,
                                "label": addDivisionText,
                                "action": function (obj) {
                                    addDivision($node, obj);
                                }
                            },
                            deleteDivision: {
                                "separator_before": false,
                                "icon": "fa fa-minus-square-o",
                                "separator_after": false,
                                "_disabled": false,
                                "label": deleteDivisionText,
                                "action": function (obj) {
                                    deleteDivision(obj);
                                }
                            },
                            renameDivision: {
                                "separator_before": false,
                                "icon": "fa fa-pencil",
                                "separator_after": false,
                                "_disabled": false,
                                "label": renameDivisionText,
                                "action": function (obj) {
                                    renameDivision(obj);
                                }
                            }
                        };
                    }
                }
            },
            "state": { "key": "demo2" },
            "plugins": ["contextmenu", "html_data", "search", "crrm", "ui", "state", "types"]
        }).bind(
            "select_node.jstree", function (evt, data) {
                $('#listStaff').empty();
                //selected node object: data.inst.get_json()[0];
                //selected node text: data.inst.get_json()[0].data
                if (data.node.parent != '#') {
                    loadStaff(data);
                }
            }
        );
    }
    return {
        //main function to initiate the module
        init: function () {
            contextualMenu();
        }
    };
}();

function assignRequester(node, obj) {
    $('#AddStaff .modal-title').text($('#assignRequester').val());
    $('#divisionId').val(node.id);
    $('#AddStaff').modal('toggle');
}

//function assignManager(node, obj) {
//    $('#AddStaff .modal-title').text($('#assignManager').val());
//    $('#actionSave').val(1);
//    $('#divisionId').val(node.id);
//    $('#AddStaff').modal('toggle');
//}

function addDivision(node,obj) {
    $('#nameForCreate').val('');
    
    var guid = createGuid();
    $('#codeForCreate').val(guid);
    //lay parentId
    var parentId = node.id;
    if (isNaN(parentId)) {
        parentId = "0";
    }
    $('#parentId').val(parentId);

    $("#valiadateCateCode").text("");
    $("#valiadateCateCode").hide();

    $('#AddDivision').modal('toggle');
}

function deleteDivision(data) {
    var urlDeleteDivision = $('#urlDeleteDivision').val();
    var messageConfirmDeleteDivision = $('#confirmDeleteDivision').val();
    bootbox.confirm("" + messageConfirmDeleteDivision, function (result) {
        if (result) {
            var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
            //obj.id
            $.ajax({
                url: urlDeleteDivision,
                type: 'POST',
                data: { id: obj.id },
                success: function (result) {
                    bootbox.alert(result.Message);
                    if (result.ResultCode == 1) {
                        $('#Divisiontree').jstree(true).refresh();
                    }
                },
                error: function () {
                }
            });
        }
    });
}

function renameDivision(data) {
    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference);
    
    var truetext = $("<div/>").html(obj.text).text();

    $('#cateName').val(truetext);
    $('#divisionIdFoRename').val(obj.id);
    $('#RenameDivision').modal('toggle');
}

function SuccessRenameDivision(obj) {
    $('#RenameDivision').modal('toggle');
    $('#Divisiontree').jstree(true).refresh();
    //switch (obj.ResultCode) {
    //    case 1:
    //        {
    //            $('#RenameDivision').modal('toggle');
    //            $('#Divisiontree').jstree(true).refresh();
    //            break;
    //        }
    //    case 0:
    //        {
    //            bootbox.alert(obj.Message);
    //            break;
    //        }
    //    case 2:
    //        {
    //            bootbox.alert(obj.Message);
    //            break;
    //        }
    //    default:
    //        break;
    //}
}


function onchangeCateCodeCreateDivision() {
    $("#valiadateCateCode").text("");
    $("#valiadateCateCode").hide();
    return true;
}