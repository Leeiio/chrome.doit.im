/*====================
        加载完成
====================*/
$(document).ready(function() {
    //i18n
    var L = chrome.i18n.getMessage;
    //set lang
    $('[message]').each(function(){
        var lang = this.getAttribute('message');
        lang = L(lang);
        $(this).html(lang);
    });
    $('#register_jp').text(L('option_sign_up_a_new_account_in_Doitim')+L('option_sign_up_data_zone_jp'));
    $('#register_cn').text(L('option_sign_up_a_new_account_in_Doitim')+L('option_sign_up_data_zone_cn'));
    $('#signin_username').attr('placeholder', L('signin_username'));
    $('#signin_password').attr('placeholder', L('signin_password'));

    $('#task_add_help span').popover({
        title:L('smart_add_shortcuts'),
        html:true,
        trigger:"hover",
        content:'# ' + L('Project') + ' ^ ' + L('Date')
    });

    setTimeout(function(){
        $('#signin_username').trigger('focus');
    },678);

    //show data zone chooser
    var ls_datazone = localStorage.getItem('data_zone');
    if(ls_datazone && ls_datazone === 'cn'){
        $('#register_jp').hide();
        $('#register_cn').show();
        $('.data-zone .data-zone-us').show();
        $('.data-zone .data-zone-cn').hide();
    }

    //change data zone
    $('.data-zone div').bind('click',function(){
        if($(this).hasClass('data-zone-us')){
            $(this).hide();
            $('#register_cn').hide();
            $('#register_jp').show();
            $('.data-zone .data-zone-cn').show();
            setAPI('jp');
        }else{
            $(this).hide();
            $('#register_jp').hide();
            $('#register_cn').show();
            $('.data-zone .data-zone-us').show();
            setAPI('cn');
        }
    });

    //sign in
    $('.signin-form').bind('submit',function(){
        var username = $('#signin_username').val();
        var password = $('#signin_password').val();
        if(!username && !password){
            $(this).find('input').parent().addClass('error');
            return false;
        }
        $(this).find('.submit-loading').show();
        var auth = Base64.encode(username + ':' + password);
        $.ajax({
            url: PROFILE_URL,
            dataType: 'json',
            beforeSend: function(req){
                req.setRequestHeader('Authorization', 'Basic ' + auth)
            },
            contentType: "application/json; charset=utf-8",
            complete: function(resp) {
                var status = resp.status;
                if(status == 401) {
                    $('.signin-form input').parent().addClass('error');
                    $('.submit-loading').hide();
                    $('#signin_error').html(L('signin_error_401')).show();
                    return false;
                }else if(status == 200){
                    var data = JSON.parse(resp.responseText);
                    localStorage.setItem('account',JSON.stringify(data));
                    localStorage.setItem('user_auth',auth);
                    localStorage.setItem('options','{"social_list":["twitter","gmail","outlook","weibo","pinboard","cntv"]}');
                    location.reload();
                }else if(status == 301){
                    $('.signin-form input').parent().addClass('error');
                    $('.submit-loading').hide();
                    $('#signin_error').html(L('signin_error_401')).show();
                    return false;
                }
            }
        });        
        return false;
    });
    $('.signin-form').find('input').bind('keyup keydown',function(){
        if($(this).val()){
            $(this).parent().removeClass('error');
        }
    });

    var _tmpFlag = checkToken();
    //show the tasks from localStorage
    var ts = JSON.parse(localStorage.getItem('all_tasks'));
    if(ts){
        //check "projects" localStorage
        if(!localStorage.getItem('projects')){
            localStorage.removeItem('user_auth');
            localStorage.removeItem('account');
            localStorage.removeItem('all_tasks');
            location.reload();
        }
        for(var i = 0; i<ts.length; i++) {
            addTaskAuto(ts[i],'no');
        }
    }
    function everything_init(){
        setTimeout(function(){
            if( _tmpFlag ){
                setHeader(function(){
                    getProjects(function(projects){
                        PROJECTS = projects;
                        localStorage.removeItem('projects');
                        localStorage.setItem('projects',JSON.stringify(PROJECTS));
                        getProfile(function(profile){
                            var user_timezone = profile.user_timezone.split('T')[1].split(')')[0].toString().replace(':','');//+0800
                            var username = profile.username;
                            //localStorage.setItem('user_timezone',user_timezone);
                            //localStorage.setItem('username',username);
                            PROFILE.USER_TIMEZONE = user_timezone;
                            PROFILE.USERNAME = username;
                            getAllTasks(function(tasks){
                                //localStorage.removeItem('all_tasks');
                                //localStorage.setItem('all_tasks',JSON.stringify(tasks));
                                TASKS = tasks;
                                getUnfinishedTasks(tasks);
                                $('.tab-unfinished').bind('click',function() {
                                    getAllTasks(function(tasks){
                                        TASKS = tasks;
                                        getUnfinishedTasks(tasks);
                                    });
                                });
                                $('.tab-finished').bind('click',function() {
                                    getAllTasks(function(tasks){
                                        TASKS = tasks;
                                        getFinishedTasks(tasks);
                                    });
                                });
                            });
                        });
                        var projects_smart = [];
                        $.each(projects,function(i,item){
                            if(!item.trashed && !item.completed){
                                projects_smart.push(unescapeHTML(item.name));
                            }
                        });
    
                        var $input = $('#task_add_input_wrap input');
                        $.smartAdd.setRules({flag:'^',list:[L('Today'),L('Next'),L('Tomorrow'),L('Someday'),'mm-dd','yy-mm-dd'],repeat:false,hr:4,className:['','','']},{flag:'#',list:projects_smart,repeat:false,hr:-1});
                        $input.smartAdd();
                        $input.bind('keydown', function(e){
                            if(e.which == 13 && $('#smart_add_list').css('visibility') == 'hidden'){
                                readyToPostTask(this.value);
                            }
                        });
                        $('#task_add_button_wrap button').click(function(){
                            var v = $(this).parent().prev().find('input').val();
                            readyToPostTask(v);
                        });
                    });
                });
            }else{
                return false;
            }
            
            $('#tasks_list').delegate('.task-title','focus',function(){
                // document.designMode = 'on';
                var data = $(this).parents('.task-wrap').data('task');
            }).delegate('.task-title','blur',function(){
                // document.designMode = 'off';
                var data = $(this).parents('.task-wrap').data('task');
                var oldtitle = unescapeHTML(data.title);
                var title = $(this).text();
                if(oldtitle !== title){
                    var newdata = cloneJSON(data);
                    newdata.title = title;
                    updateTask(newdata,data,function(){
                        console.log('Done!');
                    });
                }
            });

            $('#tasks_list').bind('click', function(e) {
                var $t = $(e.target);
                if($t.parents('#unfinished_tasks').length){
                    if($t.parents('.complete-button').length != 0 || $t.hasClass('complete-button')){
                        var task = $t.parents('.task-wrap').data('task');
                        finishTask(task,function(task){
                            //删掉那个dom的task
                            var id = task.uuid;
                            var repeat_no = task.repeat_no;
                            slideUpTask(id,repeat_no);
                        });
                    }else if($t.parents('.delete-button-wrap').length || $t.hasClass('delete-button-wrap')){//删除
                        msg({title:L('Warning'),content:L('ARE_YOU_SURE_TO_DELETE_THE_TASK'),ok:function(){
                            var task = $t.parents('.task-wrap').data('task');
                            deleteTask(task,function(task){
                                //删掉那个dom的task
                                var id = task.uuid;
                                var repeat_no = task.repeat_no;
                                slideUpTask(id,repeat_no);
                            });
                        },cancel:function(){
                        }});
                    }
                }else if($t.parents('#finished_tasks').length){
                    if($t.parents('.complete-button').length != 0 || $t.hasClass('complete-button')){
                        var task = $t.parents('.task-wrap').data('task');
                        unfinishTask(task,function(task){
                            //删掉那个dom的task
                            var id = task.uuid;
                            var repeat_no = task.repeat_no;
                            slideUpTask(id,repeat_no);
                        });
                    }else if($t.parents('.delete-button-wrap').length != 0 || $t.hasClass('delete-button-wrap')){//删除
                        msg({title:L('Warning'),content:L('ARE_YOU_SURE_TO_DELETE_THE_TASK'),ok:function(){
                            var task = $t.parents('.task-wrap').data('task');
                            deleteTask(task,function(task){
                                //删掉那个dom的task
                                var id = task.uuid;
                                var repeat_no = task.repeat_no;
                                slideUpTask(id,repeat_no);
                            });
                        },cancel:function(){
                        }});
                    }
                }
                return false;
            });
            makeTab();
            $('.task-type-wrap').click(function(){
                var $this = $(this);
                if($this.hasClass('type-open')){
                    $this.addClass('type-close').removeClass('type-open');
                }else if($this.hasClass('type-close')){
                    $this.addClass('type-open').removeClass('type-close');
                }
            });
            $('#go_to_option').click(function(){
                open_option();
                return false;
            });
            
            showCount();
            function readyToPostTask(smartAddString){
                {
                    var taskString = smartAddString;
                    var ary = taskString.split(' ');
                    var title = '';
                    var project = '';
                    var time = '';
                    for(var i = 0; i< ary.length; i++){
                        // if(/^.*(\s\#\S.*)/.test(ary[i])){
                        //     project = ary[i].substring(1,ary[i].length);
                        // }else 
                        if(/^\^/.test(ary[i])){
                            time = ary[i].substring(1,ary[i].length);
                        }else{
                            title += ' '+ary[i];
                        }
                    }
                    var projects_smart = [];
                    $.each(PROJECTS,function(i,item){
                        if(!item.trashed && !item.completed){
                            projects_smart.push(unescapeHTML(item.name));    
                        }
                    });
                    var project_reg = /^.*(\s\#\S.*)/;
                    var project_str = project_reg.exec(' '+smartAddString);
                    project_str = !project_str ? null : $.trim(project_str[1]).replace('#','');
                    if(project_str != null){
                        while($.inArray(project_str,projects_smart) == -1){
                            if(project_str.split(' ').length == 1) break;
                            project_str = project_str.split(' ');
                            project_str = project_str.slice(0,project_str.length-1);
                            project_str = project_str.join(' ');
                        }
                        smartAddString = (' '+smartAddString+' ').replace(' #'+project_str,'');
                    }
                    var project_id = findUUIDByName(PROJECTS,escapeHTML(project_str));
                    var title_str = (' '+smartAddString).replace(' ^'+time,'');
                    var task = {
                        uuid:makeUUID(),
                        title : $.trim(title_str),
                        notes : '',
                        project_id : project_id,
                        project_name : project_str,
                        start_at : null,//要拼凑
                        completed : null,
                        all_day : true,
                        attribute: 'inbox'
                    };
                    //task验证
                    if(task.title == '') {
                        M(L('TASK_VALI_TITLE_REQUIRED'));
                        return false;
                    } else if(task.title.length > 225) {
                        M(L('TASK_VALI_TITLE_TOO_LONG'));
                        return false;
                    } else if (project_str && project_str.length > 30){
                        M(L('TASK_VALI_PROJECT_TOO_LONG'));
                        return false;
                    }
                    //time处理
                    var start_at_tmp = null;
                    if($.trim(time)==''){
                        start_at_tmp = null;
                        task.attribute = 'inbox';
                    }else if(new RegExp(L('Tomorrow'),'i').test(time)){
                        start_at_tmp = Date.today().add(1).days().getTime();
                        task.attribute = 'plan';
                        //U.log('tomorrow');
                    }else if(new RegExp(L('Someday'),'i').test(time)){
                        start_at_tmp = null;
                        task.attribute = 'noplan';
                        //U.log('someday');
                    }else if(new RegExp(L('Today'),'i').test(time)){
                        start_at_tmp = Date.today().getTime();
                        task.attribute = 'plan';
                        //U.log('today');
                    }else if(new RegExp(L('Next'),'i').test(time)){
                        task.attribute = 'next';
                    }else{
                        task.attribute = 'plan';
                        var input_text = $.trim(time);
                        //这边是需要重构的
                        if( input_text.match(/^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/) ){//yyyy-mm-dd
                            start_at_tmp = input_text+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp);
                        }else if( input_text.match(/^(\d{4})\/(0\d{1}|1[0\/2])\/(0\d{1}|[12]\d{1}|3[01])$/) ){//yyyy/mm/dd
                            start_at_tmp = input_text.replace(/\//g,'-')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp);
                        }else if( input_text.match(/^(\d{2})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/) ){//yy-mm-dd
                            start_at_tmp = new Date().getFullYear().toString().substring(0,2)+input_text+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp);
                        }else if ( input_text.match(/^(\d{2})\/(0\d{1}|1[0\/2])\/(0\d{1}|[12]\d{1}|3[01])$/) ){//yy/mm/dd
                            start_at_tmp = new Date().getFullYear().toString().substring(0,2)+input_text.replace(/\//g,'-')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp);
                        }else if ( input_text.match(/^(\d{2})-([1-9])-([1-9])$/) ){//yy-m-d
                            start_at_tmp = new Date().getFullYear().toString().substring(0,2)+input_text.replace(/-/g,'-0')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                        }else if ( input_text.match(/^(\d{2})\/([1-9])\/([1-9])$/) ){//yy/m/d
                            start_at_tmp = new Date().getFullYear().toString().substring(0,2)+input_text.replace(/\//g,'-0')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                        }else if (input_text.match(/^(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/)){//mm-dd
                            start_at_tmp = new Date().getFullYear().toString()+'-'+input_text+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'mm-dd');
                        }else if (input_text.match(/^(0\d{1}|1[0\/2])\/(0\d{1}|[12]\d{1}|3[01])$/)){//mm/dd
                            start_at_tmp = new Date().getFullYear().toString()+'-'+input_text.replace(/\//g,'-')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'mm/dd');
                        }else if(input_text.match(/^([1-9])-(0\d{1}|[12]\d{1}|3[01])$/)){//m-dd
                            start_at_tmp = new Date().getFullYear().toString()+'-0'+input_text+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'m-dd');
                        }else if(input_text.match(/^([1-9])\/(0\d{1}|[12]\d{1}|3[01])$/)){//m/dd
                            start_at_tmp = new Date().getFullYear().toString()+'-0'+input_text.replace(/\//g,'-')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'m/dd');
                        }else if(input_text.match(/^(0\d{1}|1[0-2])-([1-9])$/)){//mm-d
                            start_at_tmp = new Date().getFullYear().toString()+'-'+input_text.replace(/-/g,'-0')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'mm-d');
                        }else if(input_text.match(/^(0\d{1}|1[0\/2])\/([1-9])$/)){//mm/d
                            start_at_tmp = new Date().getFullYear().toString()+'-'+input_text.replace(/\//g,'-0')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'mm/d');
                        }else if(input_text.match(/^([1-9])-([1-9])$/)){//m-d
                            start_at_tmp = new Date().getFullYear().toString()+'-0'+input_text.replace(/-/g,'-0')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'m-d');
                        }else if(input_text.match(/^([1-9])\/([1-9])$/)){//m/d
                            start_at_tmp = new Date().getFullYear().toString()+'-0'+input_text.replace(/\//g,'-0')+' 00:00:00 '+PROFILE.USER_TIMEZONE;
                            //U.log(start_at_tmp+'m/d');
                        }else{
                            start_at_tmp = Date.today().toString('yyyy-MM-dd HH:mm:ss ')+PROFILE.USER_TIMEZONE;
                        }
                        var date_split = start_at_tmp.split(' ');
                        start_at_tmp = date_split[0].replace(/-/g,'/') + ' ' + date_split[1] + ' ' + date_split[2];
                        start_at_tmp = new Date(start_at_tmp).getTime();
                    }

                    task.start_at = start_at_tmp;
                    if(project_id && !task.start_at) task.attribute = 'next';
                    postTask(task,function(){
                        addTaskAuto(task);
                        $input.val('');
                    });
                    return false;
                }
            }
        },350)
    }
    everything_init();
});