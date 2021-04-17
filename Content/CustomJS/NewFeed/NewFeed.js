var isLoadingInterval = false;
var IsShowPopNewFeed = true;
var isLoadScroll = false;

var ssss_lst_newc_feedc = [];

$(document).ready(function () {
    var containerHeight = $(window).height();
    var containerWidth = $(window).width();
    ssss_lst_newc_feedc = [];
    var objPopFeed = $('.container-new-feed .pop-new-feed');
    var heightPop = containerHeight - 250;
    var widthPop = containerWidth - 50;
    objPopFeed.height(heightPop);
    objPopFeed.width(widthPop);
    loadNewFeed();
    IsShowPopNewFeed = true;
    var sessionIsShowFeed = localStorage.getItem('IsShowPopNewFeed');
    if (!!sessionIsShowFeed) {
        IsShowPopNewFeed = JSON.parse(sessionIsShowFeed);
    }
    if (IsShowPopNewFeed) {
        var objBtn = $('.container-new-feed .btn-show-pop-new-feed');
        objBtn.addClass('show-feed');
        objBtn.find('.icon-new-feed').removeClass('fa-arrow-up');
        objBtn.find('.icon-new-feed').addClass('fa-arrow-down');
        objBtn.find('.text-noti-new-feed').text('News feed');
        $('.container-new-feed .pop-new-feed').removeClass('non-visible');
        $('.container-new-feed .pop-new-feed').removeClass("non-visible-new-feed");
        $('.container-new-feed .pop-new-feed').addClass("visible-new-feed");

    }
    $(".container-new-feed .pop-new-feed .box-new-feed .list-scroll").on('scroll', function (e) {
        var objList = $(e.target);
        if (objList.hasClass('list-new-feed')) {
            ScrollLoadNewFeed(e);
        }
    });

    objPopFeed.find('.box-new-feed .box-Search .search-new').keypress(function (e) {
        if (e.keyCode == 13)
            $(e.target).parents('.box-Search').find('.btn-search-new-f').click();
    });


    $(window).on('resize', function () {
        ResizeBoxNewFeed();
    });

    setInterval(function () {
        if (!isLoadingInterval) {
            CheckGetNewsFeed();
        }
    }, 10000);
});

function ResizeBoxNewFeed() {
    var containerHeight = $(window).height();
    var containerWidth = $(window).width();
    var objPopFeed = $('.container-new-feed .pop-new-feed');
    var heightPop = containerHeight - 250;
    var widthPop = containerWidth - 50;
    objPopFeed.height(heightPop);
    objPopFeed.width(widthPop);
}


function ScrollLoadNewFeed(e) {
    var objListScroll = $(e.target);
    if (objListScroll.length > 0 && !!objListScroll.children() && objListScroll.children().length > 0) {
        var heightScroll = objListScroll.prop('scrollHeight');
        var heightScrPoint = objListScroll.scrollTop();
        var heightContainer = objListScroll.height();
        var viewportRatio = heightContainer / heightScroll;
        if (viewportRatio < 1) {
            var scrollbarHandle = Math.max(
                50,
                Math.floor(heightScroll * viewportRatio)
            );
            var pointScroll = scrollbarHandle + heightScrPoint;
            var lengthChil = objListScroll.children().length;
            if (lengthChil > 1) {
                var objChildenEnd = $(objListScroll.children()[lengthChil - 1]);
                if ((heightScroll - pointScroll) < objChildenEnd.height()) {
                    loadMoreNewFeed(e.target);
                }
            }
        }

    }
}

function ShowBoxNewFeed(e) {
    var objBtn = $(e);
    if (objBtn.hasClass('show-feed')) {
        $('.container-new-feed .pop-new-feed').removeClass("visible-new-feed");
        $('.container-new-feed .pop-new-feed').addClass("non-visible-new-feed");
        objBtn.removeClass('show-feed');
        objBtn.find('.text-noti-new-feed').text('News feed');
        objBtn.find('.icon-new-feed').removeClass('fa-arrow-down');
        objBtn.find('.icon-new-feed').addClass('fa-arrow-up');
        $('.container-new-feed .pop-new-feed').addClass("non-visible");
        localStorage.setItem("IsShowPopNewFeed", false);
    } else {

        objBtn.addClass('show-feed');
        objBtn.find('.text-noti-new-feed').text('News feed');
        objBtn.find('.icon-new-feed').removeClass('fa-arrow-up');
        objBtn.find('.icon-new-feed').addClass('fa-arrow-down');
        $('.container-new-feed .pop-new-feed').removeClass('non-visible');
        $('.container-new-feed .pop-new-feed').removeClass("non-visible-new-feed");
        $('.container-new-feed .pop-new-feed').addClass("visible-new-feed");
        localStorage.setItem("IsShowPopNewFeed", true);
    }
}

function SeachNewFeed(e) {
    var objInput = $(e).parents('.box-Search').find('.search-new');
    var objList = $('.box-new-feed .box-list-new .list-new-feed');
    var searchValue = objInput.val();
    var searchValold = objInput.attr('data-value-old');
    if (searchValue != searchValold) {
        var pageIndex = objList.attr('data-page');
        pageIndex = TryParseInt(pageIndex, 0);
        var totalCount = objList.attr('data-total');
        totalCount = TryParseInt(totalCount, 0);
        var urlCall = $('#urlGetNewFeed').val();
        var data = {
            SearchValue: searchValue,
            PageIndex: pageIndex,
            PageSize: 10
        };
        isLoadScroll = true;
        objInput.attr('data-value-old', searchValue);
        $.ajax({
            url: urlCall,
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.ResultCode == 1) {
                    $('.box-new-feed .box-list-new .list-new-feed').attr('data-total', res.TotalRecords);
                    BindingNewFeed(res.Records);
                    isLoadScroll = false;
                }
            },
            error: function () {
            }
        });

    }
}

function hiddenBoxNewFeed() {
    $('.container-new-feed .pop-new-feed').removeClass("visible-new-feed");
    $('.container-new-feed .pop-new-feed').addClass("non-visible-new-feed");
    var objBtn = $('.container-new-feed .btn-show-pop-new-feed');
    objBtn.removeClass('show-feed');
    objBtn.find('.text-noti-new-feed').text('News feed');
    objBtn.find('.icon-new-feed').removeClass('fa-arrow-down');
    objBtn.find('.icon-new-feed').addClass('fa-arrow-up');
    $('.container-new-feed .pop-new-feed').addClass("non-visible");
    localStorage.setItem("IsShowPopNewFeed", false);
}


function CheckGetNewsFeed() {
    var urlCall = $('#urlCheckGetNewFeed').val();
    $.ajax({
        url: urlCall,
        type: 'GET',
        success: function (res) {
            if (res.ResultCode == 1) {
                GenerateGetSuccessNewFeed(res.Data);
            }
        },
        error: function () {
        }
    });
}
/**
 * hàm check xem có new feed mới không ?
 * 
 * @param {any} data
 */
function GenerateGetSuccessNewFeed(data){
    if (!!data && data.length > 0) {
        var isShow = false;
        var countFeed = '1';
        if (!!ssss_lst_newc_feedc && ssss_lst_newc_feedc.length > 0) {
            var itemFirstOld = ssss_lst_newc_feedc[0];
            //var listTopfeed = ssss_lst_newc_feedc.splice(0, 10);
            //var listTopIdold = [];
            //Object(listTopfeed).map(function (result, key) {
            //    listTopIdold.push(result.Id);
            //});
            //var listTopIdNew = [];
            //Object(data).map(function (result, key) {
            //    listTopIdNew.push(result.Id);
            //});
            var idFirst = itemFirstOld.Id;
            var indexChangeFirst = data.findIndex(item => item.Id == idFirst);
            if (indexChangeFirst != 0 && indexChangeFirst != -1) {
                isShow = true;
                if (indexChangeFirst > 9) {
                    countFeed = '+10';
                } else {
                    countFeed = `${indexChangeFirst}`;
                }
            } else if (indexChangeFirst == -1) {
                isShow = true;
                if (data.length > 10) {
                    countFeed = '+10';
                } else {
                    countFeed = `${data.length}`;
                }
            }
        } else {
            isShow = true;
            if (data.length > 10) {
                countFeed = '+10';
            } else {
                countFeed = `${data.length}`;
            }
        }
        BindingBoxNotiCheckFeed(isShow, countFeed);
    }
}

function BindingBoxNotiCheckFeed(isShow, CountFeed) {
    if (!!isShow) {
        var objPopFeed = $('.pop-new-feed');
        if (objPopFeed.hasClass('visible-new-feed')) {
            $('.pop-new-feed .box-new-feed .box-notifi-check-feed').removeClass("visible-box-noti");
            var objBoxNoti = $('.pop-new-feed .box-new-feed .box-notifi-check-feed');
            if (objBoxNoti.length > 0) {
                objBoxNoti.find('.content-notify-feed .count-feed-notive').text(CountFeed);
                if (!objBoxNoti.hasClass('visible-box-noti')) {
                    objBoxNoti.animate({ top: '10px' }, { queue: false, duration: 500 }).addClass("visible-box-noti");
                }
            }
        } else {
            $('.container-new-feed .btn-show-pop-new-feed .dot-notify-news-feed').removeClass('hidden');
            $('.container-new-feed .btn-show-pop-new-feed .text-noti-new-feed').text(`${CountFeed} News feed mới`);
        }
       
    }
    
}

/**
 * load newfeed*/
function loadNewFeed() {
    isLoadingInterval = true;
    var urlCall = $('#urlGetNewFeed').val();
    var data = {};
    $('.box-new-feed .box-list-new .list-new-feed').addClass('hidden');
    $('.box-new-feed .box-list-new .list-load-feed').removeClass('hidden');
    $('.pop-new-feed .box-new-feed .box-notifi-check-feed').removeClass("visible-box-noti");
    $('.container-new-feed .btn-show-pop-new-feed .dot-notify-news-feed').addClass('hidden');
    $.ajax({
        url: urlCall,
        type: 'POST',
        data: data,
        success: function (res) {
            if (res.ResultCode == 1) {
                isLoadingInterval = false;
                $('.box-new-feed .box-list-new .list-new-feed').attr('data-total', res.TotalRecords);
                $('.box-new-feed .box-list-new .list-new-feed').attr('data-page', 1);
                ssss_lst_newc_feedc = res.Records;
                BindingNewFeed();
                $('.box-new-feed .box-list-new .list-new-feed').removeClass('hidden');
                $('.box-new-feed .box-list-new .list-load-feed').addClass('hidden');
            }
        },
        error: function () {
        }
    });
}
/**
 * ham load them new feed
 * @param {any} e
 */
function loadMoreNewFeed(e) {
    var objList = $(e);
    if (objList.length > 0) {
        var pageIndex = objList.attr('data-page');
        pageIndex = !!pageIndex ? pageIndex : 0;
        pageIndex = TryParseInt(pageIndex, 0);
        var totalCount = objList.attr('data-total');
        totalCount = !!totalCount ? totalCount : 0;
        totalCount = TryParseInt(totalCount, 0);
        var pageSize = (pageIndex * 10);
        if (pageSize < totalCount && !isLoadScroll && pageSize < 51 ) {
            pageIndex += 1;
            $('.box-new-feed .box-list-new .list-new-feed').attr('data-page', pageIndex);
            AddNewFeedToList(pageIndex);
            isLoadScroll = false;
            //var urlCall = $('#urlGetNewFeed').val();
            //pageIndex += 1;
            //var data = {
            //    PageIndex: pageIndex,
            //    PageSize: 10
            //};
            //isLoadScroll = true;
            //$.ajax({
            //    url: urlCall,
            //    type: 'POST',
            //    data: data,
            //    success: function (res) {
            //        if (res.ResultCode == 1) {
            //            $('.box-new-feed .box-list-new .list-new-feed').attr('data-total', res.TotalRecords);
            //            var pageIndex = objList.attr('data-page');
            //            pageIndex = TryParseInt(pageIndex, 0) + 1;
            //            $('.box-new-feed .box-list-new .list-new-feed').attr('data-page', pageIndex);
            //            AddNewFeedToList(res.Records);
            //            isLoadScroll = false;
            //        }
            //    },
            //    error: function () {
            //    }
            //});
        }
    }

}
function AddNewFeedToList(pageIndex) {
    var objList = $('.box-new-feed .box-list-new .list-new-feed');
    // load teamplate
    var t = document.querySelector('#teamplateNewFeed');
    if (ssss_lst_newc_feedc && ssss_lst_newc_feedc.length > 0) {
        var data = [];
        var pageSize = pageIndex * 10;
        for (var i = pageIndex; i < pageSize; i++) {
            var itemData = ssss_lst_newc_feedc[i];
            if (!!itemData) {
                data.push(itemData);
            }
        }
        data.forEach(item => {
            //clone teamplate cái này cần
            var clone = document.importNode(t.content, true);
            var objTeamplate = $(clone);
            objTeamplate.find('.item-new-feed').attr('data-feed-id', item.Id);
            objTeamplate.find('.item-new-feed').attr('data-feed-parrent', item.ParentId);
            var classIcon = 'icon-new-feed-default';
            switch (item.Module) {
                case 'Opportunity':
                    classIcon = 'icon-new-feed-opportunities';
                    break;
                case 'Account':
                    classIcon = 'icon-new-feed-custommer';
                    break;
                case 'Task':
                    classIcon = 'icon-new-feed-task';
                    break;
            };

            objTeamplate.find('.item-new-feed .image-feed .icon-news-feed').addClass(classIcon);
            objTeamplate.find('#txtContent').html(item.Message);
            objTeamplate.find('#txtCountComment').text(item.CountComment);
            //objTeamplate.find('#txtCountView').text(item.CountView);
            objTeamplate.find('.btn-show-comment').attr('data-feed-parrent', item.ParentId);

            objTeamplate.find('.box-comment .input-insert-comment-new-feed').keypress(function (e) {
                if (e.keyCode == 13)
                    $(e.target).parents('.box-insert-comment').find('.btn-insert-comment').click();
            });
            objList.append(objTeamplate);
        });
    }
}

function BindingNewFeed() {
    var objList = $('.box-new-feed .box-list-new .list-new-feed');
    // load teamplate
    var t = document.querySelector('#teamplateNewFeed');
    objList.children().remove();
    if (ssss_lst_newc_feedc && ssss_lst_newc_feedc.length > 0) {
        var data = [];
        for (var i = 0; i < 10; i++) {
            var itemData = ssss_lst_newc_feedc[i];
            if (!!itemData) {
                data.push(itemData);
            }
            
        }
        data.forEach(item => {
            //clone teamplate cái này cần
            var clone = document.importNode(t.content, true);
            var objTeamplate = $(clone);
            objTeamplate.find('.item-new-feed').attr('data-feed-id', item.Id);
            objTeamplate.find('.item-new-feed').attr('data-feed-parrent', item.ParentId);
            var classIcon = 'icon-new-feed-default';
            switch (item.Module) {
                case 'Opportunity':
                    classIcon = 'icon-new-feed-opportunities';
                    break;
                case 'Account':
                    classIcon = 'icon-new-feed-custommer';
                    break;
                case 'Task':
                    classIcon = 'icon-new-feed-task';
                    break;
            };

            objTeamplate.find('.item-new-feed .image-feed .icon-news-feed').addClass(classIcon);
            objTeamplate.find('#txtContent').html(item.Message);
            objTeamplate.find('#txtCountComment').text(item.CountComment);
            //objTeamplate.find('#txtCountView').text(item.CountView);
            objTeamplate.find('.btn-show-comment').attr('data-feed-parrent', item.ParentId);

            objTeamplate.find('.box-comment .input-insert-comment-new-feed').keypress(function (e) {
                if (e.keyCode == 13)
                    $(e.target).parents('.box-insert-comment').find('.btn-insert-comment').click();
            });
            objList.append(objTeamplate);
        });
    }
}
/**
 * show danh sách commnet
 * @param {any} e
 * congvb3
 */
function ShowListComment(e) {
    if (!!e) {
        var objBtnShow = $(e);
        var dataFeedId = objBtnShow.attr('data-feed-parrent');
        $('.box-new-feed .list-new-feed').attr('data-sel-comment', dataFeedId);
        var url = $('#urlGetListComment').val();
        url += `?feedId=${dataFeedId}`;
        $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
                BindingCommnetInfeed(data);
            },
            error: function () {
            }
        });
    }
}

/**
 * an comment
 * @param {any} e
 */
function hiddenListComment(e) {
    var objBtnShow = $(e).parents('.box-comment').find('.btn-show-comment');
    var objBoxComment = $(e).parents('.box-comment').find('.box-comment-item');
    objBtnShow.removeClass('hidden');
    objBoxComment.addClass('hidden');
}

function BindingCommnetInfeed(data) {
    // load teamplate
    var t = document.querySelector('#teamplateCommentFeed');
    var objListFeed = $('.box-new-feed .list-new-feed');
    var idSelectShow = objListFeed.attr('data-sel-comment');
    if (!!idSelectShow) {
        objListFeed.find('.item-new-feed .box-comment-item').addClass('hidden');
        objListFeed.find('.item-new-feed .box-comment .btn-show-comment').removeClass('hidden');
        var objFeed = objListFeed.find(`.item-new-feed[data-feed-parrent="${idSelectShow}"]`);
        if (objFeed.length > 0) {
            var objListComment = objFeed.find('.box-comment-item .list-comment');
            objListComment.children().remove();
            objFeed.find('.box-comment-item').removeClass('hidden');
            objFeed.find('.btn-show-comment').addClass('hidden');
            if (objListComment.length > 0) {
                data.forEach(item => {
                    //clone teamplate cái này cần
                    var clone = document.importNode(t.content, true);
                    var objTeamplate = $(clone);
                    objTeamplate.find('.item-comment').attr('data-comment-id', item.Id);
                    objTeamplate.find('#txtCommentUser').text(item.CreatedBy);
                    objTeamplate.find('#txtComment').text(item.ContentComment);
                    objListComment.append(objTeamplate);
                });
            }
        }
    }
}

function AddCommentToNewFeed(e) {
    var objBtn = $(e);
    var objInput = objBtn.parents('.box-insert-comment').find('.input-insert-comment-new-feed');
    if (objInput.length > 0) {
        var comment = objInput.val();
        var commentContent = comment.trim();
        if (!!commentContent) {
            var objBtnShow = objBtn.parents('.box-comment').find('.btn-show-comment');
            var dataFeedId = objBtnShow.attr('data-feed-parrent');
            var objUrl = $('#urlCreateComment');
            if (objUrl.length > 0) {
                var url = `${objUrl.val()}?objectId=${dataFeedId}&moduleId=NewFeed&commentContent=${commentContent}`;
                $.ajax({
                    url: url,
                    type: 'POST',
                    success: function (data) {
                        AddCommentToBox(data.Data);
                    },
                    error: function () {
                    }
                });
            }
        }
    }
}
/**
 * theem comment
 * @param {any} data
 */
function AddCommentToBox(data) {
    if (!!data) {
        var t = document.querySelector('#teamplateCommentFeed');
        var objListFeed = $('.box-new-feed .list-new-feed');
        var idSelectShow = objListFeed.attr('data-sel-comment');
        if (!!idSelectShow) {
            var objFeed = objListFeed.find(`.item-new-feed[data-feed-parrent="${idSelectShow}"]`);
            if (objFeed.length > 0) {
                objFeed.find('.box-comment .box-insert-comment .input-insert-comment-new-feed').val('');
                var objListComment = objFeed.find('.box-comment-item .list-comment');
                if (objListComment.length > 0) {
                    //clone teamplate cái này cần
                    var clone = document.importNode(t.content, true);
                    var objTeamplate = $(clone);
                    objTeamplate.find('.item-comment').attr('data-comment-id', data.Id);
                    objTeamplate.find('#txtCommentUser').text(data.CreatedBy);
                    objTeamplate.find('#txtComment').text(data.ContentComment);
                    objListComment.append(objTeamplate);
                    var objComment = objFeed.find('.item-info .count-comment .count');
                    if (objComment.length > 0) {
                        var count = $(objComment[0]).text();
                        count = TryParseInt(count, 0) + 1;
                        objFeed.find('.item-info .count-comment .count').text(count);
                    }

                }
            }
        }
    }
}