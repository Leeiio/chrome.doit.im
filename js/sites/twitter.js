$(function () {
    if(window.top != window) return;
    var L = chrome.i18n.getMessage;
    var twitterBaseURL = "http://twitter.com";

    function showMessage(message){
        $('body').removeClass('pushing-state');
        var $message = $('#message-drawer');
        $message.find('.message-text').html(message);
        $message.find('.dismiss').hide();
        $message.fadeIn(function(){
            $message.removeClass('hidden');
        });
        setTimeout(function(){
            $message.fadeOut(function(){
                $message.addClass('hidden');
            });
        },8E3);
    }

    function addToTwitterList(actionList) {
        $(actionList).append('<li class="action-addto-doitim"><a href="#" class="doitim-action new" data-tweet-id="" title="'+L("sites_button_add_to")+'"><span><i></i><b>Doit.im</b></span></a></li>');
    }

    function addToTwitter(tweets) {
        $(tweets).each(function () {
            addToTwitterList(this);
        });
    }

    function addTweet(action){
        var $tweet = $(action).parents('div.tweet'),
            tweetURL = twitterBaseURL + $tweet.find('.js-permalink').attr('href'),
            twitter_username = $tweet.attr('data-screen-name'),
            tweetTEXT = $.trim($tweet.find('p.js-tweet-text').text());

        var title = twitter_username + ": " + tweetTEXT;

        var data = {
            type: 'twitter',
            title:title,
            content:tweetURL + '\n\n' + title
        };
        $('body').addClass('pushing-state');
        chrome.extension.sendMessage(data,function(callback_data){
            showMessage(callback_data.message);
        });

        return false;
    }

    function getTweets() {
        return $('body div.tweet ul.tweet-actions:not(:has(.action-addto-doitim))');
    }

    function initialize() {
        setInterval(function () {
            addToTwitter(getTweets());
        }, 1000);
        $(document).on('click','.doitim-action',function(){
            addTweet(this);
            return false;
        });
    }

    initialize();
});