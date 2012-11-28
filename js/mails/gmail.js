(function($){
//    $(window).on("hashchange", function () {
//        alert(window.location.href);
//    });
    var $d = $(document);
    setInterval(function(){
        //button wrapper
        var $b_wrapper = $('.iH[gh=mtb]');
        if($b_wrapper.length && !$('#doitim_button').length){
            var $button = $('<div class="G-Ni J-J5-Ji"><div id="doitim_button" data-tooltip="Add to Doit.im" class="T-I J-J5-Ji ar7 nf T-I-ax7 L3" role="button" tabindex="0" aria-expanded="false" style="-webkit-user-select: none;" aria-haspopup="true" aria-activedescendant=""><img style="height: 16px;width: 16px;vertical-align: -4px;margin-right: 5px" src="' + chrome.extension.getURL("imgs/icon16.png") + '"/ ><span class="Ykrj7b">Add To Doit.im</span><div class="G-asx T-I-J3 J-J5-Ji" style="display: none">&nbsp;</div></div></div>');
            $b_wrapper.children('div').append($button);
        }
    }, 300);
    $d.on("hover", "#doitim_button", function () {
        $(this).toggleClass("T-I-JW");
    });
    function sentMessage(text){
        $(".b8.UC .vh").html(text);
        $(".b8.UC").css("visibility", "visible");
        setTimeout(function(){
            $(".b8.UC").css("visibility", "hidden");
        },10E3);
    }
    $d.on('click', '#doitim_button', function(){
        var url = document.location.href;
        var mail_content = $.trim($('.ii').eq(0).text().split('\n').join(''));
        if(mail_content.length > 250){
            mail_content = mail_content.substr(0,250) + '...';
        }
        mail_content = url + '\n\n' + mail_content;
        var mail_title = $('.hP').text();
        mail_title = mail_title.length > 255 ? mail_title.substr(0,255) : mail_title;
        var mail_sender = $('.gD').attr('name');
        var data = {};
        data.content = mail_content;
        data.title = '[' + mail_sender + '] ' + mail_title;
        data.type = 'gmail';
        sentMessage('Processing adding task to Doit.im...');
        chrome.extension.sendMessage(data,function(callback_data){
            if(callback_data.status === 'success'){
                sentMessage(callback_data.message);
            }else if(callback_data.status === 'error'){
                sentMessage(callback_data.message);
            }
        });
        $(this).blur();
    });
})(jQuery);