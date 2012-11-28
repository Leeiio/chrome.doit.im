var _L = chrome.i18n.getMessage;
chrome.extension.onMessage.addListener(function(a,b,c){
    if(!localStorage.getItem('user_auth')){
        c({
            status:'error',
            message:'You must sign in to Doit.im first :('
        });
    }else{
        var addBasicAuth = function(){
            var auth = localStorage.getItem('user_auth');
            return 'Basic ' + auth;
        };
        $.ajaxSetup({
            dataType: 'json',
            beforeSend: function(req){
                req.setRequestHeader('Authorization', addBasicAuth())
            },
            contentType: "application/json; charset=utf-8"
        });
        var task = {
            uuid:makeUUID(),
            title : a.title,
            notes : a.content,
            start_at : null,
            completed : null,
            all_day : true,
            tags:["Gmail"],
            attribute: 'inbox'
        }
        postTask(task,function(t){

        });
        c({
            status:'success',
            message:_L('Success')
        });
    }
})