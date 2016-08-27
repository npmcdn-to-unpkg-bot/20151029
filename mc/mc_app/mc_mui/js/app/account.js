var Account = Account || {};
Account = {
	pageStyle : {
		scrollIndicator:'none',
		scalable:false,
		top: '0px',
		bottom: '0px',
		popGesture: 'hide'
	},
	rechargeRecordPage : null,
	rechargePage : null,
	withdrawPage :　null,
	loginPage : null,
	payPwdPage : null,
	bankListPage : null,
	
	indexPage　: null,
	
	_init : function(){
		var me = this;
		
		window.addEventListener('refreshBalance',function(){
			User.getBalance();
			var username = plus.storage.getItem("username");
			$('.username').html(username);
			var balance = plus.storage.getItem('balance');
			$('.balance em').html(balance);
		});
		
		/*充提记录*/
		me.rechargeRecordPage = mui.preload({
	      	url:'../html/rechargeRecord.html',
	      	id:'rechargeRecord',
	      	styles:me.pageStyle
	  	});
	  	
	  	/* 充值页面 */
		me.rechargePage = mui.preload({
	      	url:'../html/recharge.html',
	      	id:'recharge',
	      	styles:me.pageStyle
	  	});
	  	
	  	/* 提现页面 */
		me.withdrawPage = mui.preload({
	      	url:'../html/withdraw.html',
	      	id:'draw',
	      	styles:me.pageStyle
	  	});
	  	
	  	me.loginPage = plus.webview.getWebviewById('login');
	  	
	  	/*资金密码页面*/
		me.payPwdPage = mui.preload({
	      	url:'../html/payPwd.html',
	      	id:'payPwd',
	      	styles:me.pageStyle
	 	});
	 	
	 	/*银行卡列表页面*/
	 	me.bankListPage = mui.preload({
	      	url:'../html/banklist.html',
	      	id:'banklist',
	      	styles:me.pageStyle
	 	});
	 	
	 	me.indexPage = plus.webview.currentWebview().parent();
	},
	
	init : function(){
		var me = this;
		//充提记录
		$('.rechargeRecord').on('tap',function(){
			me.rechargeRecordPage.show('slide-in-right',400);
			mui.fire(me.rechargeRecordPage,'getRechargeList');
		})
		
		//充值按钮事件
		$('.recharge-btn').on('tap',function(){
			me.rechargePage.show('slide-in-right',400);
			mui.fire(me.rechargePage,'initInfo');
		})
		
		//提现按钮事件-需先判断是否已绑定银行卡
		$('.withdraw-btn').on('tap',function(){
			Api.getWithDrawInfo(function(res){
	    		if(res.code == '1'){
	             	mui.alert('您尚未绑定银行卡', '提现', function() {
						mui.confirm('是否要转至绑定银行卡页面？', '绑定银行卡', ['否', '是'], function(e) {
							if (e.index == 1) {
								$('.bankLi').trigger('tap');
							}
						})
					});
	    		}else{
	    			mui.fire(me.withdrawPage,'initInfo',res);
	    			me.withdrawPage.show('slide-in-right',400);
	    		}
	    	});
		})
		
		/*资金密码 - 需验证是否已设置资金密码*/
		$('.payPwdLi').on('tap',function(){
			Api.payPwdExist(function(res){
				if(res.retCode == '0'){
					if(res.message == '0'){
		             	mui.alert('您尚未设置资金密码', '资金密码', function() {
							mui.confirm('是否要现在设置资金密码？', '设置资金密码', ['否', '是'], function(e) {
								if (e.index == 1) {
									mui.fire(me.payPwdPage,'setPayPwd');
									me.payPwdPage.show('slide-in-right',400);
								}
							})
						});
		    		}else if(res.message == '1'){
		    			mui.fire(me.payPwdPage,'updatePayPwd');
						me.payPwdPage.show('slide-in-right',400);
		    		}
				}else{
					var tip = {content:res.message};
					Q.showDialog(tip);
				}
	    	});
		})
		
		/*银行卡管理 */
		$('.bankLi').on('tap',function(){
			Api.payPwdExist(function(res){
				if(res.retCode == '0'){
					if(res.message == '0'){
		             	mui.alert('您尚未设置资金密码', '资金密码', function() {
							mui.confirm('是否要现在设置资金密码？', '设置资金密码', ['否', '是'], function(e) {
								if (e.index == 1) {
									mui.fire(me.payPwdPage,'setPayPwd');
									me.payPwdPage.show('slide-in-right',400);
								}
							})
						});
		    		}else if(res.message == '1'){
		    			mui.prompt('请先验证资金密码', '资金密码', '银行卡管理', ['取消', '确定'], function(e) {
							if (e.index == 1) {
								var obj = {
									payPassword : md5(e.value)
								};
								
								Api.checkPayPwd(obj,function(res){
									if(res.retCode == '0'){
										if(res.message == '1'){
											mui.fire(me.bankListPage,'initList');
											me.bankListPage.show('slide-in-right',400);
										}else{
											var tip = {content:'资金密码验证错误'};
											Q.showDialog(tip);
										}
									}else{
										var tip = {content:res.message};
										Q.showDialog(tip);
									}
								});
							} 
						},'div');
						
						$('.mui-popup-input input').attr('type','password').addClass('promptPwd');
						$('.mui-popup-input input').focus();
		    		}
				}else{
					var tip = {content:res.message};
					Q.showDialog(tip);
				}
	    	});
		})
		
		/*退出登陆*/
		$('.logout').on('tap',function(){
			mui.confirm('确定要退出登录吗？', '退出', ['否', '是'], function(e) {
				if (e.index == 1) {
					User.ssoUserLogout(function(res){
						res = JSON.parse(res);
						if(res.code == 0){
			    			me.loginPage.show('slide-in-bottom',400,function(){
			    				plus.storage.setItem("balance",'');
			    				mui.fire(me.rechargeRecordPage,'clearData')
			    				mui.fire(me.indexPage,'clearData');
			    			});
						}
					});
				}
			})
		});
	}
}
