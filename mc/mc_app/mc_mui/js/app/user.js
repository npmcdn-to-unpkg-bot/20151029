var User = User || {};
User = {
  	ssoapi: {
	    'login': '/m/sso/login',
	    'status': '/m/sso/u/getUserLoginState',
	    'balance': '/m/sso/u/getUserBalance',
	    'logout': '/sso/logout',
	},
	
	//登陆
  	ssoUserLogin: function(s, fn) {
   		var url = User.ssoapi['login'] + '?callback=?&way=pwd&from=portal&cn=' + s.name + '&appId=5&password=' + md5(s.pwd);
    	if (s.capchaCode) {
      		url += '&capchaCode=' + s.capchaCode;
    	}
    	Api.getJsonP(url,fn);
    	
  	},
  	
  	//检查登陆状态
  	getStatus: function(fn) {
  		var url = User.ssoapi['status'] + '?appId=5';
  		Api.getData(url,fn);
  	},
  	
  	//获取余额
  	getBalance: function(fn){
  		var url = User.ssoapi['balance'] + '?appId=5';
  		Api.getData(url,function(res){
  			if(res.code == '0'){
          		plus.storage.setItem("balance",res.result.userMoney.avail);
          	}else{
          		var tip = {content:'获取余额失败'};
          		Q.showDialog(tip);
          	}
  		});
    },
    
    //退出登陆
    ssoUserLogout: function(fn) {
    	var url = User.ssoapi['logout'] + '?appContext=';
    	Api.getJsonP(url,fn);
  	}
};