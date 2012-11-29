(function($){
//    $(window).on("hashchange", function () {
//        alert(window.location.href);
//    });
    var $d = $(document);
    setInterval(function(){
        //button wrapper
        var $b_wrapper = $('.iH[gh=mtb]');
        if($b_wrapper.length && !$('#doitim_button').length){
            var $button = $('<div class="G-Ni J-J5-Ji"><div id="doitim_button" data-tooltip="Add to Doit.im" class="T-I J-J5-Ji ar7 nf T-I-ax7 L3" role="button" tabindex="0" style="-webkit-user-select: none;border-color: rgba(0, 0, 0, 0.15) !important;"><img style="height: 16px;width: 16px;vertical-align: -4px;margin-right: 5px" src="' + chrome.extension.getURL("imgs/icon16.png") + '"/ ><span class="Ykrj7b">Add To Doit.im</span><div class="G-asx T-I-J3 J-J5-Ji">&nbsp;</div></div></div>');
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
    $d.on("click", ".doitim-menu", function (e) {
        e.stopPropagation();
    });
    $d.on("click", function () {
        $('#doitim_button').removeClass('T-I-j0').removeClass('T-I-Kq').next('.doitim-menu').hide();
    });
    $d.on('click', '#doitim_add', function(e){
        $('#doitim_button').removeClass('T-I-j0').removeClass('T-I-Kq').next('.doitim-menu').hide();
        var $node = $(this).parents('.doitim-menu');
        var tags = $node.find('.doitim-input-tags').val().split(',');
        var newTags = [];
        tags.forEach(function(i){newTags.push(i.trim())});
        var data = {};
        data.content = $node.find('.doitim-input-notes').val();
        data.title = $node.find('.doitim-input-title').val();
        data.tags  = newTags;
        data.type = 'gmail';
        sentMessage('Processing adding task to Doit.im...');
        chrome.extension.sendMessage(data,function(callback_data){
            if(callback_data.status === 'success'){
                sentMessage(callback_data.message);
            }else if(callback_data.status === 'error'){
                sentMessage(callback_data.message);
            }
        });
    });
    $d.on('click', '#doitim_button', function(e){
        e.stopPropagation();
        $(this).toggleClass('T-I-j0');
        $(this).toggleClass('T-I-Kq');

        if(!$('.doitim-menu').length){
            var $popupmenu = $('<div class="J-M jQjAxd doitim-menu" style="-webkit-user-select: none;top: 29px;min-width: 280px; display: none;" role="menu" aria-haspopup="true" aria-activedescendant=""><div class="SK AX" style="-webkit-user-select: none; min-width: 64px;"><div class="J-N doitim-item" role="menuitem" data-id="0" style="-webkit-user-select: none; "><label style="-webkit-user-select: none;">Title:</label><input class="doitim-input-title" /></div><div class="J-N doitim-item" role="menuitem" data-id="0" style="-webkit-user-select: none; "><label style="-webkit-user-select: none;">Description:</label><textarea rows="5" class="doitim-input-notes"></textarea></div><div class="J-N doitim-item" role="menuitem" data-id="0" style="-webkit-user-select: none; "><label style="-webkit-user-select: none;">Tags(Separate with ","):</label><input class="doitim-input-tags" /></div><div class="J-N doitim-item doitim-foot" role="menuitem" data-id="0" style="-webkit-user-select: none; "><div id="doitim_add" class="T-I J-J5-Ji aoO T-I-atl L3" role="button" tabindex="1" style="-webkit-user-select: none;">Add</div></div></div></div>');
            $(this).parent().append($popupmenu);
        }else{
            var $popupmenu = $('.doitim-menu');
        }
        $popupmenu.toggle();
        var url = document.location.href;
        var mail_content = $.trim($('.ii').eq(0).text().split('\n').join(''));
        if(mail_content.length > 250){
            mail_content = mail_content.substr(0,250) + '...';
        }
        mail_content = url + '\n\n' + mail_content;
        var mail_title = $('.hP').text();
        mail_title = mail_title.length > 255 ? mail_title.substr(0,255) : mail_title;
        var mail_sender = $('.gD').attr('name');
        mail_title = '[' + mail_sender + '] ' + mail_title;
        $popupmenu.find('.doitim-input-title').val(mail_title);
        $popupmenu.find('.doitim-input-notes').val(mail_content);
        $popupmenu.find('.doitim-input-tags').val('Gmail');
    });
    //list
    $d.on('click', '.nf', function(){
        setTimeout(function(){
            var $popup = $('.jQjAxd:visible');
            if($('.x7:visible').length){
                if(!$popup.hasClass('added-doitim')){
                    $popup.addClass('added-doitim');
                    var $node = $('<div class="J-N addto-doitim-item" role="menuitem" style="-webkit-user-select: none;" id=":ss"><div class="J-N-Jz" style="-webkit-user-select: none;">Add to Doit.im</div></div>');
                    $popup.find('.SK').append($node);
                }else{
                    $('.addto-doitim-item').show();
                }
            }else{
                if($popup.hasClass('added-doitim')){
                    $('.addto-doitim-item').hide();
                }
            }
        },100);
    });
    $d.on('hover', '.addto-doitim-item', function(){
        $(this).toggleClass("J-N-JT");
    });
    $d.on('click', '.addto-doitim-item', function(){
        var $x7 = $('.x7:visible');
        if(!$x7.length) return;
        $x7.each(function(i){
           var title = $(this).find('.y6').children('span').first().text();
           alert(title)
        });
    });
})(jQuery);