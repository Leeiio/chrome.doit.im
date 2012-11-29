$(function () {
    if(window.top != window) return;

    var BaseURL = "https://mail.qq.com";

    function showMessage(message){
        alert(message);
    }

    function addToTwitterList(actionList) {
        $(actionList).addClass('doitim-action');
        $(actionList).find('.WB_handle:last').append('<i class="S_txt3">|</i><a href="javascript:void(0);" title="添加到Doit.im" class="doitim-btn">Doit.im</a>');
    }

    function addToTwitter(tweets) {
        $(tweets).each(function () {
            addToTwitterList(this);
        });
    }

    function addTweet(action){
        var $tweet = $(action).parents('div.WB_detail'),
            tweetURL = twitterBaseURL + $tweet.find('.WB_time:last').attr('href'),
            twitter_username = $tweet.children('.WB_info').find('.WB_name').text() || $('#pl_profile_hisInfo .name').text() || $('#pl_profile_myInfo .name').text(),
            tweetTEXT = $.trim($tweet.find('.WB_text:first').text());

        if(twitter_username){
            var title = twitter_username + ": " + tweetTEXT;
        }else{
            var title = tweetTEXT;
        }
        title = title.replace('\n\t\t\t\t','');
        if(title.length > 255){
            title = title.substr(0,252) + '...';
        }

        var data = {
            type: 'weibo',
            title:title,
            content:tweetURL + '\n\n' + title
        };
        chrome.extension.sendMessage(data,function(callback_data){
            showMessage(callback_data.message);
        });

        return false;
    }

    function getTweets() {
        return $('body div.WB_feed .WB_feed_type').not('.doitim-action');
    }

    function addToQmail(){
        var $iframe = $('#mainFrame').contents();
        var $doitim = $iframe.find('.addto-doitim');
        if($doitim.length) return;
        var subject = $iframe.find('#subject').text();
        var $toolbar = $iframe.find('.toolbgline');
        if(subject && $toolbar.length){
            var $dom = $('<a class="btn_gray btn_space left addto-doitim" style="margin-left:3px;" hidefocus="" href="javascript:;">添加到Doit.im</a>');
            $toolbar.find('.qm_left').append($dom);
//            $iframe.find('.addto-doitim').onclick = function(){
//                alert(1)
//            };
        }
    }

    function addToDoit(){
        var $iframe = $('#mainFrame').contents();
        var subject = $iframe.find('#subject').text();
        var content = $iframe.find('#mailContentContainer').text();
        var sender = $iframe.find('.settingtable .grn').text();
        var title = '[' + sender + '] ' + subject;
        title = title.length > 255 ? title.substr(0,255) : title;
        var data = {
            type:'qmail',
            title:title,
            content:content
        };
        console.log(JSON.stringify(data,null,4))
    }

    function initialize() {
        setInterval(function () {
            addToQmail();
        }, 1000);
        $('#mainFrame').on('click','.addto-doitim',function(){
            addToDoit();
            return false;
        });
    }

    initialize();
});