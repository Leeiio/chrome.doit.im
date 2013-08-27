$(function () {
    if(window.top != window) return;
    var L = chrome.i18n.getMessage;

    function showMessage(message){
        alert(message);
    }

    function addToCNTV(){
        var $list = $('.main_schedule_list .upcoming');
        if($list.length){
            $list.each(function(){
                var $this = $(this);
                $this.addClass('doitim-action');
                $this.find('.v_line').before('<div title="添加到Doit.im" class="item doitim-btn">Doit.im</div>');
                if($this.find('.playbtn').length) $this.find('.doitim-btn').addClass('right');
            });
        }
    }

    function addReminder(action){
        var $item = $(action).parent();
        var league = $.trim($item.find('.league').text());
        var game = $.trim($item.find('.game').text());
        var date = $.trim($item.find('.date').text());
        var time = $.trim($item.find('.time').text());
        var start_at = date + ' ' + time;
        start_at = new Date(start_at.replace(/\-/g,'/'));
        var minutes = start_at.getMinutes();
        var reminder_time = new Date(start_at).setMinutes(minutes - 10);
        var title = '【'+league+'】【'+game+'】即将开始，请到 5+VIP网站 http://vip.sports.cntv.cn/ 观看比赛直播。';
        if(title.length > 255){
            title = title.substr(0,252) + '...';
        }

        var data = {
            type: 'cntv',
            title:title,
            start_at:start_at.getTime(),
            reminder_time:reminder_time
        };
        chrome.extension.sendMessage(data,function(callback_data){
            $(action).removeClass('loading');
            if(callback_data.status === 'error'){
                showMessage(L("sites_signin_first_nolink"));
            }else{
                showMessage(callback_data.message);
            }
        });

        return false;
    }

    function initialize() {
        addToCNTV();
        $('.main_schedule_list .doitim-btn').bind('click',function(){
            if($(this).hasClass('loading')) return false;
            $(this).addClass('loading');
            addReminder(this);
            return false;
        });
    }

    chrome.extension.sendMessage({
        action: "localStorage",
        key: "cntv"
    }, function (response) {
        if (response.value) {
            initialize();
        }
    });
});