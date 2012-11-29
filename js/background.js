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
            attribute: 'inbox'
        }
        if(a.type === 'gmail'){
            task.tags = ["Gmail"];
        }else if(a.type === 'twitter'){
            task.tags = ["Twitter"];
        }else if(a.type === 'weibo'){
            task.tags = ["Weibo","Read Later"];
        }
        postTask(task,function(t){
            c({
                status:'success',
                message:'Added to Doit.im Inbox successfully :)'
            });
        });
        return true;
    }
})