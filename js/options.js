function logout(callback){
    localStorage.removeItem('user_auth');
    localStorage.removeItem('account');
    localStorage.removeItem('all_tasks');
    localStorage.removeItem('projects');
    localStorage.removeItem('data_zone');
    chrome.browserAction.setBadgeText({text:''});
    callback && callback();
}
$(document).ready(function() {
	if(!localStorage.getItem('user_auth')){
		$('#option_please_login').show();
	    $('#auth_logout').hide();
	    $('#account_info').hide();
	}else{
		$('#option_please_login').hide();
	    $('#auth_logout').unbind('click').bind('click', function(){
	        logout();
	        location.reload();
	    }).show();
	}
	if(!localStorage.getItem('account')){
		var $account_info = $('#account_info');
		$account_info.hide();
	}else{
		var data = JSON.parse(localStorage.getItem('account'));
		var account = data.account;
        var username = data.username;
        var created = new Date(data.created).toString('yyyy-MM-dd');
        var $account_info = $('#account_info');
        $account_info.find('.account .value').html(account);
        $account_info.find('.email .value').html(username);
        $account_info.find('.registed .value').html(created);
        $account_info.show();
	}
	$('#logout').unbind('click').bind('click', function (){
		logout(function(){
			location.reload();
		});
	});

    //for options.html
    var L = chrome.i18n.getMessage;
    $(document).ready(function() {
        $('#register_jp').text(L('option_sign_up_a_new_account_in_Doitim')+L('option_sign_up_data_zone_jp'));
        $('#register_cn').text(L('option_sign_up_a_new_account_in_Doitim')+L('option_sign_up_data_zone_cn'));
        $('#auth_logout').text(L('option_logout'));

        $('#signin_username').attr('placeholder', L('signin_username'));
        $('#signin_password').attr('placeholder', L('signin_password'));
        $('.forget-password a').text(L('signin_forgetpwd'));
        $('#signin_submit').text(L('signin_submit'));

        $('.data-zone .data-zone-us span').text(L('web_signin_data_zone_global'));
        $('.data-zone .data-zone-cn span').text(L('web_signin_data_zone_mainland'));
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
        //登录
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
                    var data = JSON.parse(resp.responseText);
                    localStorage.setItem('account',JSON.stringify(data));
                    var account = data.account;
                    var username = data.username;
                    var created = new Date(data.created).toString('yyyy-MM-dd');
                    var $account_info = $('#account_info');
                    $account_info.find('.account .value').html(account);
                    $account_info.find('.email .value').html(username);
                    $account_info.find('.registed .value').html(created);
                    $account_info.show();
                    if(status == 401) {
                        $('.signin-form input').parent().addClass('error');
                        $('#signin_error').html('incorrect Username/Email or Password').show();
                    }else if(status == 200){
                        localStorage.setItem('user_auth',auth);
                        location.reload();
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
    });
});