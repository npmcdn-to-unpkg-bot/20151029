var Login = Login || {};

Login = {
	host : null,
	loginStatus : 0,  // 0-打开应用时从首页转到登陆页面      1-退出后转到登陆页面    2-请求数据过程中返回-1
	
	_init : function(){
		var me = this;
		me.homePage = plus.webview.getWebviewById('home');
		me.cw = plus.webview.currentWebview();
		
		var form = $('.login-form');
	
		var username = form.find('.username');
		var password = form.find('.password');
		
		/*记住最后一次登陆的用户名*/
		var lastloginName = plus.storage.getItem('username');
		if(lastloginName){
			username.val(lastloginName);
		}
		
		var codeinput = form.find('.codeinput');
		var verifycode = form.find('img.verifycode');
		
		verifycode.on('tap',function() {
	    	verifycode.attr('src', Api.host + '/sso/imageCode?date=' + new Date());
		    codeinput.val('');
		}).trigger('tap');
		
		var loginFunction = function(){
			Api.initHost();
			var tip = {content:''};
			if(username.val() == ''){
				tip.content = "请输入用户名";
				Q.showDialog(tip);
				return false;
			}
			
			if(password.val() == ''){
				tip.content = "请输入密码 ";
				Q.showDialog(tip);
				return false;
			}
			
			if(form.hasClass('show-code')){
				var checkCode = true;
				if (codeinput.val() == '') {
					tip.content = "请输入验证码 ";
					Q.showDialog(tip);
					return false;
			    }
			}
			
		    var loginparams = {
		    	name: username.val(),
		    	pwd: password.val()
		    };
		    
		    if (form.hasClass('show-code')) {
		    	loginparams["capchaCode"] = codeinput.val();
		    }
		    User.ssoUserLogin(loginparams, function(res) {
		    	res = eval(res.substring(1));
		    	if (res.code == 0) {
					plus.nativeUI.showWaiting();
					
		    		$(document.body).append('<iframe id="login-iframe" style="display: none;"></iframe>');
					$("iframe#login-iframe").attr('src', Api.host + '/lottery/u/login?backType=0&t=' + (new Date()).getTime());
					$("iframe#login-iframe").on('load',function() {
		    			plus.storage.setItem("username",res.user.cn);
		    			plus.storage.setItem("userUin",String(res.user.uin));

						var homePage = plus.webview.getWebviewById('home');
						
						mui.fire(homePage.parent(),'initSubPage');
						
						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().hide('slide-out-bottom',400);
						
						setTimeout(function(){
							$("iframe#login-iframe").remove();
						},1000);
					});
		    	} else {
		    		tip.content = res.msg;
					Q.showDialog(tip);
		    		if(res.needCapchaCode){
		    			form.addClass('show-code');
		    			verifycode.attr('src', Api.host + '/sso/imageCode?date=' + new Date());
		    			codeinput.val('');
		    		}
		    	}
		    });
		};
		
		$('.login-btn').on('tap',function() {
			if(me.host){
				loginFunction();
			}else{
				Line.startSpeedTest(function(){
					loginFunction();
				});
			}
		});
	},
}
