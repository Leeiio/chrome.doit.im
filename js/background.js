var L = chrome.i18n.getMessage;
chrome.extension.onMessage.addListener(function(a,b,c){
    if(!localStorage.getItem('user_auth')){
        c({
            status:'error',
            message:L("sites_signin_first",chrome.extension.getURL("options.html"))
        });
    }else{
        var addBasicAuth = function(){
            var auth = localStorage.getItem('user_auth');
            return 'Basic ' + auth;
        };
        $.ajaxSetup({
            dataType: 'json',
            cache:false,
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
        switch(a.type){
            case 'gmail':
                if(a.tags){
                    task.tags = a.tags;
                }else{
                    task.tags = ["Gmail"];
                }
                break;
            case 'twitter':
                task.tags = ["Twitter"];
                break;
            case 'weibo':
                task.tags = ["微博"];
                break;
            case 'qmail':
                task.tags = ["QQ Mail"];
                break;
            case 'outlook':
                task.tags = ["Outlook"];
                break;
            case 'pinboard':
                task.tags = ["Pinboard"];
                break;
            default :
        }
        postTask(task,function(t){
            c({
                status:'success',
                message:L("sites_added_successful")
            });
        });
        return true;
    }
})