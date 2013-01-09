$(function () {
    if(window.top != window) return;
    var L = chrome.i18n.getMessage;
    function showMessage(data,elem){
        var $node = $(elem).find('.doitim-btn').parent();
        var origHTML = $node.html();
        $node.fadeOut(function(){
            $(this).html(data.message).fadeIn();
            if(data.status == 'error'){
                setTimeout(function(){
                    $node.html(origHTML);
                },5e3);
            }
        });
    }

    function addToPinboardList(actionList) {
        $(actionList).addClass('doitim-action');
        $(actionList).find('.edit_links').append('<div style="display: inline;margin-left: 10px;color: #aaa;"><a style="color: #00ADFF" href="javascript:void(0);" title="'+L("sites_button_add_to")+'" class="doitim-btn">'+L("sites_button_add_to")+'</a></div>');
    }

    function addToPinboard(pins) {
        $(pins).each(function () {
            addToPinboardList(this);
        });
    }

    function addPinboard(action){
        var $pin = $(action).parents('.bookmark'),
            title = $.trim($pin.find('.bookmark_title').text()),
            link = $pin.find('.bookmark_title').attr('href');

        if(title.length > 255){
            title = title.substr(0,252) + '...';
        }

        var data = {
            type: 'pinboard',
            title:title,
            content:link
        };
        chrome.extension.sendMessage(data,function(callback_data){
            showMessage(callback_data,$pin);
        });

        return false;
    }

    function getPins() {
        return $('#bookmarks .bookmark').not('.doitim-action');
    }

    function initialize() {
        setInterval(function () {
            addToPinboard(getPins());
        }, 1000);
        $(document).on('click','.doitim-btn',function(){
            addPinboard(this);
            return false;
        });
    }

    chrome.extension.sendMessage({
        action: "localStorage",
        key: "pinboard"
    }, function (response) {
        if (response.value) {
            initialize();
        }
    });
});