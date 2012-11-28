$(function () {
    if(window.top != window) return;

    var twitterBaseURL = "http://weibo.com";

    function showMessage(message){
//        $('body').removeClass('pushing-state');
//        var $message = $('#message-drawer');
//        $message.find('.message-text').text(message);
//        $message.find('.dismiss').hide();
//        $message.fadeIn(function(){
//            $message.removeClass('hidden');
//        });
//        setTimeout(function(){
//            $message.fadeOut(function(){
//                $message.addClass('hidden');
//            });
//        },8E3);
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
            tweetURL = twitterBaseURL + $tweet.children('.WB_func').find('.WB_time').attr('href'),
            twitter_username = $tweet.children('.WB_info').find('.WB_name').text(),
            tweetTEXT = $.trim($tweet.children('.WB_text').text());

        var title = twitter_username + ": " + tweetTEXT;
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

    function initialize() {
        setInterval(function () {
            addToTwitter(getTweets());
        }, 1000);
        $(document).on('click','.doitim-btn',function(){
            addTweet(this);
            return false;
        });
    }

    initialize();
});