$(function () {
    if(window.top != window) return;

    var BaseURL = "https://mail.qq.com";

    function showMessage(message,hide){
        if($('#msgBoxDIV').length){
            var $msgBox = $('#msgBoxDIV');
        }else{
            $msgBox = $('<div id="msgBoxDIV" style="position: absolute; width: 100%; padding-top: 2px; height: 24px; top: 43px; text-align: center;"><span class="msg"></span></div>');
            $('body').prepend($msgBox);
        }
        $msgBox.show().find('.msg').html(message);
        if(hide){
            setTimeout(function(){
                $msgBox.hide();
            },5e3);
        }
    }

    function addToQmail(){
        var $iframe = $('#mainFrame').contents();
        var $doitim = $iframe.find('.addto-doitim');
        if($doitim.length) return;
        var subject = $iframe.find('#subject').text();
        var $toolbar = $iframe.find('.toolbgline');
        if(subject && $toolbar.length){
            var $dom = $('<a class="btn_gray btn_space left addto-doitim" style="margin-left:3px;" hidefocus="" href="javascript:window.parent.Doitim.postMessage();">添加到Doit.im</a>');
            $toolbar.find('.qm_left').append($dom);
        }
    }

    function addToDoit(data){
        showMessage('正在添加邮件到Doit.im收集箱...');
        chrome.extension.sendMessage(data,function(callback_data){
            showMessage(callback_data.message,true);
        });
    }

    function initialize() {
        setInterval(function () {
            addToQmail();
        }, 1000);
        window.addEventListener("message", function(event) {
            // We only accept messages from ourselves
            if (event.source != window)
                return;
            if (event.data.type && (event.data.type == "FROM_PAGE")) {
                console.log("Content script received: " + event.data.text);
                console.log(JSON.stringify(event.data.object));
                addToDoit(event.data.object);
            }
        }, false);
        $('body').append('<script src="' + chrome.extension.getURL("js/sites/qmail_message.js") + '"></script><script src="' + chrome.extension.getURL("js/libs/jquery.min.js") + '"></script>');
    }

    initialize();
});