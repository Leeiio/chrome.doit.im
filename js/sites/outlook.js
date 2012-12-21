$(function () {
    if(window.top != window) return;
    var L = chrome.i18n.getMessage;
    function showMessage(message){
        alert(message);
    }

    function addToOutlook(){
        var $doitim = $('.addto-doitim:visible');
        if($doitim.length && !$doitim.parents('.c_cmore').length) return;
        var subject = $('.ReadMsgSubject:visible').text();
        var $toolbar = $('.c_cc');
        if(subject && $toolbar.length){
            $('.addto-doitim').remove();
            var $dom = $('<li class="addto-doitim"><a href="#" title="'+L("sites_button_add_to")+'">'+L("sites_button_add_to")+'</a></li>');
            $dom.insertBefore($toolbar.find('.c_cmore'));
        }
    }

    function postToDoit(){
        var BaseURL = "https://mail.qq.com";
        var subject = $('.ReadMsgSubject').text();
        var content = $.trim($('#mpf0_MsgContainer').text().split('\n').join(''));
        if(content.length > 250){
            content = content.substr(0,250) + '...';
        }
        var link = window.location.href;
        content = link + '\n\n' + content;
        var sender = $('#rmic1_senderName').text();
        var title = '[' + sender + '] ' + subject;
        title = title.length > 255 ? title.substr(0, 255) : title;
        var data = {
            type:'Outlook',
            title:title,
            content:content
        };
        console.log(JSON.stringify(data,null,4))
        chrome.extension.sendMessage(data,function(callback_data){
            if(callback_data.status === 'error'){
                showMessage(L("sites_signin_first_nolink"));
            }else{
                showMessage(callback_data.message);
            }
        });
    }

    function addToDoit(data){
        showMessage(L("sites_posting"));
        chrome.extension.sendMessage(data,function(callback_data){
            showMessage(callback_data.message,true);
        });
    }

    function initialize() {
        setInterval(function () {
            addToOutlook();
        }, 1000);
        $(document).on('click','.addto-doitim',function(){
            postToDoit();
        });
    }

    initialize();
});