function logout(callback){
    localStorage.removeItem('user_auth');
    localStorage.removeItem('account');
    localStorage.removeItem('all_tasks');
    localStorage.removeItem('projects');
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
});