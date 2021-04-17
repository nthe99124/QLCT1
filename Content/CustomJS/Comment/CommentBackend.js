$(document).ready(function () {
    InitCommentOnReady();
});

function InitCommentOnReady(parentSelector) {
    if (parentSelector == undefined || parentSelector == null) {
        $(".comment-container").each(function (index, element) {
            GetCommentList(element);
        });
    } else {
        $(parentSelector).each(function (index, element) {
            GetCommentList(element);
        });
    }
    
}

function GetCommentList(element) {
    var url = $("#urlGetCommentList").val();
    
    var data_moduleId = $(element).attr('data-moduleId');
    var a = "#objectId_Comment-" + data_moduleId;
    var objectId = $(a).val();
    var moduleId = $("#moduleId_Comment-" + data_moduleId).val();
    $.ajax({
        type: "Get",
        url: url,
        data: { objectId: objectId, moduleId: moduleId},
        success: function (result) {
            if (result != null && result.data != null) {
                $(element).empty();
                $('#numOfComment-' + data_moduleId).text(result.recordsTotal);
                var htmlAppend = "";
                result.data.forEach(function (comment) {
                    htmlAppend += GenerateCommentHtml(comment, data_moduleId);
                });
                $(element).append(htmlAppend);
            } 
        },
        error: function () {
            alert("Có lỗi xảy ra khi lấy danh sách bình luận");
        }
    });

}

function CreateComment(strModuleId) {
    var objectId = $('#objectId_Comment-' + strModuleId).val();
    var moduleId = $('#moduleId_Comment-' + strModuleId).val();
    var commentContent = $('#comment_content-' + strModuleId).val();
   
    var urlAjaxCreateComment = $('#urlAjaxCreateComment').val();

    var msgCreateCommentError = $('#msgCreateCommentError').val();

    if (commentContent != null && commentContent != undefined && commentContent != "") {
        $.ajax({
            type: "POST",
            url: urlAjaxCreateComment,
            data: { objectId: objectId, moduleId: moduleId, commentContent: commentContent },
            success: function (result) {
                if (result != null) {
                    if (result.ResultCode == 1) {
                        $('#comment_content-' + strModuleId).val('');
                        $('#require_commentContent-' + strModuleId).addClass('hidden');
                        
                        var containerid = "#comment-list-" + strModuleId;
                        GetCommentList(containerid);
                    } else {
                        bootbox.alert(msgCreateCommentError);
                    }
                } else {
                    bootbox.alert(msgCreateCommentError);
                }

            },
            error: function () {
                alert("Có lỗi xảy ra khi tạo bình luận!");
            }
        });
    } else {
        $('#require_commentContent-' + strModuleId).removeClass('hidden');
    }
}

function DeleteComment(commentId, strModuleId) {
    var msgConfirmDeleteComment = $('#msgConfirmDeleteComment').val();
    var msgDeleteCommentError = $('#msgDeleteCommentError').val();
    bootbox.confirm(msgConfirmDeleteComment,
        function (result) {
            if (result) {
                $.ajax({
                    url: $("#urlDeleteComment").val(),
                    type: 'POST',
                    data: { commentId: commentId },
                    success: function (data) {
                        if (data.ResultCode == 1) {
                            var containerid = $("#comment-list-" + strModuleId);
                            GetCommentList(containerid);
                        } else {
                            bootbox.alert(msgDeleteCommentError);
                        }
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            }
        });
}




//$("#btn-create-comment").click(function () {
//    var objectId = $('#objectId_Comment').val();
//    var moduleId = $('#moduleId_Comment').val();
//    var commentContent = $('#comment_content').val();
//    var formData = new FormData();

//    formData.append("objectId", objectId);
//    formData.append("moduleId", moduleId);
//    var urlAjaxCreateComment = $('#urlAjaxCreateComment').val();

//    var msgCreateCommentError = $('#msgCreateCommentError').val();

//    if (commentContent != null && commentContent != undefined && commentContent != "") {
//        //commentContent = encodeURIComponent(commentContent);
//        formData.append("commentContent", commentContent);
//        console.log(commentContent);
//        $.ajax({
//            type: "POST",
//            url: urlAjaxCreateComment,
//            //dataType: 'json',
//            //data: formData,
//            data: { objectId: objectId, moduleId: moduleId, commentContent: commentContent },
//            success: function (result) {
//                if (result != null) {
//                    if (result.ResultCode == 1) {
//                        $('#comment_content').val('');
//                        $('#require_commentContent').addClass('hidden');
//                        // reload iframe
//                        GetCommentList();
//                    } else {
//                        bootbox.alert(msgCreateCommentError);
//                    }
//                } else {
//                    bootbox.alert(msgCreateCommentError);
//                }

//            },
//            error: function () {
//                alert("Có lỗi xảy ra khi tạo bình luận!");
//            }
//        });
//    } else {
//        $('#require_commentContent').removeClass('hidden');
//    }
//});



function GenerateCommentHtml(comment, strModuleId) {
    var srcImageAvatar = $('#imageAvatarSrc').attr('src');
    var lblCommentIsDeleted = $('#lblCommentIsDeleted').val();
    var lblAtTime = $('#lblAtTime').val();

    var obj = moment(comment.CreatedDate);
    var str = '';
    if (obj) {
        str = obj.format("HH:mm DD-MM-YYYY");
    }

    var commentContent = "";
    var deleteHtml = "";
    
    if (comment.IsDeleted == true) {
        commentContent = lblCommentIsDeleted;
    } else {
        if (comment.ContentComment != undefined && comment.ContentComment != null && comment.ContentComment != "") {
            commentContent = comment.ContentComment.replace('\r\n', '<br/>');
        }
        deleteHtml = GenerateDeleteComment(comment, strModuleId);
    }
   
    var html = "";
    html += "<div class='media'>";
    html += "  <a href='#' class='pull-left text-black'>";
    html += " <img src='" + srcImageAvatar+"' />";
    html += " </a>";      
    html += "  <div class='media-body'>";           
    html += " <h5 class='media-heading'><i>";
    html += comment.CreatedBy + "<span> " + lblAtTime + " " + str + "     " + deleteHtml+"</span>";
    html += "</i> </h5>";
    html += " <p>";
    html += "  </p><p>" + commentContent + "</p>";            
    html += " <p></p>";
    html += "  </div>";    
    html += "</div>";

    return html;
}

function GenerateDeleteComment(comment, strModuleId) {
    var str = "";
    var session_uid = $('#session_uid').val();
    if (comment != null && comment != undefined && comment.UserId != null && comment.UserId != undefined && comment.UserId == session_uid) {
        str += "<a class='delete-btn' onclick='DeleteComment(" + comment.Id + ",\"" + strModuleId + "\");' title='Xóa'>";
        str += "<i class='fa fa-trash'></i>";
        str += "</a>";
    }
    return str;
}

