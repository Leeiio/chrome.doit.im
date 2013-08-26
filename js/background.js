var L = chrome.i18n.getMessage;
function getSetting(key){
    var options = JSON.parse(localStorage.getItem('options'));
    if(options && options.social_list){
        var social_list = options.social_list;
        for(var i in social_list){
            var item = social_list[i];
            if(item === key){
                return true;
            }
        }
    }
    return false;
}
chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
    if (request.action === "localStorage") {
        sendResponse({
            "value": getSetting(request.key)
        });
        return false;
    }
    if(!localStorage.getItem('user_auth')){
        sendResponse({
            status:'error',
            message:L("sites_signin_first",chrome.extension.getURL("options.html"))
        });
    }else{
        //切换账户的时候设置仍然是上个用户的所以这里要重置一下
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
        var data_zone = localStorage.getItem('data_zone') || 'jp';
        API_URL = data_zone === 'jp' ? 'https://api4.doit.im/2/' : 'https://apicn.doitim.com/2/';
        TASKS_URL = API_URL + 'tasks';


        var task;
        if(request.type === 'cntv'){
            task = {
                uuid:makeUUID(),
                title : request.title,
                notes : '',
                start_at:request.start_at,
                completed : null,
                all_day : false,
                reminders : [{
                    mode:'popup',
                    sent:false,
                    time:request.reminder_time,
                    uuid:makeUUID(),
                    view:'absolute'
                }],
                attribute:'plan'
            }
        }else{
            task = {
                uuid:makeUUID(),
                title : request.title,
                notes : request.content,
                start_at : null,
                completed : null,
                all_day : true,
                attribute: 'inbox'
            }
        }

        switch(request.type){
            case 'gmail':
                if(request.tags){
                    task.tags = request.tags;
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
            case 'cntv':
                task.tags = ["CNTV"];
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
            sendResponse({
                status:'success',
                message:L("sites_added_successful")
            });
        });
        return true;
    }
})