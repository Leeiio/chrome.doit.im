$(function () {
    if(window.top != window) return;

    function showMessage(message,elem){
        var $node = $(elem).find('.doitim-btn');
        var origText = $node.text();
        $node.fadeOut(function(){
            $(this).text(message).fadeIn();
        });
    }

    function addToPinboardList(actionList) {
        $(actionList).addClass('doitim-action');
        $(actionList).find('.edit_links').append('<div style="display: inline;margin-left: 10px;"><a style="color: #00ADFF" href="javascript:void(0);" title="添加到Doit.im" class="doitim-btn">Add to Doit.im</a></div>');
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
            showMessage(callback_data.message,$pin);
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

    initialize();
});