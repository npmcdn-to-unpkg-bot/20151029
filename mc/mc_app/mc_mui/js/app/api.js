var Api = Api || {};

Api = {
	shopId : 0,
	useShopId : false,
	showLoading : true,
    route: {
    	getSlides: '/m/sobet/api/i/anon/activity/queryCurrentActivity',
    	getAdminNotice:'/m/sobet/adminCommon/getAdminNotice.do',
    	getOdds: "/lottery/api/anon/v1/lottery/odds",
        getOddsByLt: "/lottery/api/anon/v1/lottery/odds_app",
        getAllHistory: "/lottery/api/m/v1/lottery/open_issue_app",
        getHistoryByLt: "/lottery/api/m/v1/lottery/last_open_issue_app",
        getIssue: "/lottery/api/m/v1/lottery/issue_info_app",
        addOrder: "/lottery/api/m/v1/lottery/add_order",
        addOrderApp: "/lottery/api/m/v1/lottery/add_order_app",
        addOrderMMC: "/lottery/api/m/v1/lottery/add_order_now",
        addOrderMMCApp: "/lottery/api/m/v1/lottery/add_order_now_app",
        getOrderList : "/lottery/api/m/v1/lottery/history_orders",
        getOrderDetail : "/lottery/api/m/v1/lottery/recent_detail",
        getTraceList : "/lottery/api/m/v1/lottery/lottery_trace",
        getTraceDetail : "/lottery/api/m/v1/lottery/trace",
        stopTrace : "/lottery/api/m/v1/lottery/trace_cancel",
        getTraceIssue : "/lottery/api/m/v1/lottery/trace_issue",
        cancelOrder : "/lottery/api/m/v1/lottery/cancel_order",
        getRechargeList : "/m/sobet/m/query/rechargeOrder_ajaxList",
        rechargeIndex : "/m/sobet/pay/m/rechargeIndexView",
        recharge : "/m/sobet/pay/m/recharge",
        getDrawList : "/m/sobet/m/query/drawOrder_ajaxList",
        getWithDrawInfo : '/m/sobet/pay/m/drawCashIndexView',
        withDrawSubmit : '/m/sobet/pay/m/withdrawCash',
        rechargeApp : '/m/sobet/pay/app/recharge?',
        payResult : '/m/sobet/api/payCheck/finalResult',
        payPwdExist : '/m/sobet/api/payPwdCheck/existResult',
        setPayPwd : '/m/sobet/api/payPwdCheck/setResult',
        updatePayPwd : '/m/sobet/api/payPwdCheck/updateResult',
        checkPayPwd : '/m/sobet/api/payPwdCheck/authResult',
        queryBankList : '/m/sobet/api/userBankCheck/queryResult',
        addBankCard : '/m/sobet/api/userBankCheck/addResult'
    },
    
    checkOnline : function(){
    	if(!window.navigator.onLine){
			plus.nativeUI.toast('网络中断 ');
			return false;
		}else{
			return true;
		}
    },
    initHost : function(){
    	if(!Api.host){
    		Api.host = plus.storage.getItem('host');
    	}
    },
    getData : function(url,fn){
    	if(!Api.checkOnline()){
    		return;
    	}
    	
    	Api.initHost();
    	url = Api.host + url;
    	console.log(url)

    	if(Api.showLoading){
    		plus.nativeUI.showWaiting();
    	}
    	
    	var setting = {
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{
				'Content-Type':'application/json'
			},
			success:function(data){
				plus.nativeUI.closeWaiting();
				if(data == '-1'){
					var loginPage = plus.webview.getWebviewById('login');
					loginPage.show('slide-in-bottom',400,function(){
						mui.fire(loginPage,'loginAgain');
					});
				}else{
					fn(data);
				}
			},
			error:function(xhr,type,errorThrown){
				console.log(url)
				plus.nativeUI.closeWaiting();
				var tip = {content:'请求数据出错'};
				Q.showDialog(tip);
			}
		};
    	
    	if(arguments[2]){
    		setting.data = arguments[2];
    	}
    	
    	mui.ajax(url,setting);
    },
    
    getJsonP : function(url,fn){
    	if(!Api.checkOnline()){
    		return;
    	}
    	Api.initHost();
    	
    	url = Api.host + url;
    	console.log(url)
    	plus.nativeUI.showWaiting();
    	
    	var setting = {
			dataType:'jsonp',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				plus.nativeUI.closeWaiting();
				if(data == '-1'){
    				var loginPage = plus.webview.getWebviewById('login');
					loginPage.show('slide-in-bottom',400,function(){
						mui.fire(loginPage,'loginAgain');
					});
				}else{
					fn(data);
				}
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.closeWaiting();
				var tip = {content:'请求数据出错'};
				Q.showDialog(tip);
			}
		};
    	
    	if(arguments[2]){
    		setting.data = arguments[2];
    	}
    	mui.ajax(url,setting);
    },
    
    postData : function(url,fn,param){
    	if(!Api.checkOnline()){
    		return;
    	}
    	Api.initHost();
    	url = Api.host + url;
    	console.log(url)
    	
    	plus.nativeUI.showWaiting();
    	var setting = {
    		data:JSON.stringify(param),
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				plus.nativeUI.closeWaiting();
				if(data == '-1'){
					var loginPage = plus.webview.getWebviewById('login');
					loginPage.show('slide-in-bottom',400,function(){
						mui.fire(loginPage,'loginAgain');
					});
				}else{
					fn(data);
				}
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.closeWaiting();
				var tip = {content:'请求数据出错'};
				Q.showDialog(tip);
			}
		}
    	mui.ajax(url,setting);
    },
    
    getSlides: function(obj, fn) {
    	Api.getData(Api.route.getSlides,fn,obj);
    },
    getAdminNotice:function(obj,fn){
    	Api.getData(Api.route.getAdminNotice,fn,obj);
    },
    getOdds: function(fn) {
    	Api.getData(Api.route.getOdds,fn);
    },
    getOddsByLt: function(obj,fn) {
    	Api.getData(Api.route.getOddsByLt,fn,obj);
    },
    getIssueInfo: function(p, fn) {
    	Api.getData(Api.route.getIssueInfo,fn,p);
    },
    addOrder: function(obj, fn) {
    	var url = "WBGMMC" === obj.lottery ? Api.route.addOrderMMCApp : Api.route.addOrderApp;
    	Api.postData(url,fn,obj);
    },
    getAllHistory:function(fn){
    	Api.getData(Api.route.getAllHistory,fn);
    },
    getHistoryByLt:function(lt,fn){
    	Api.getData(Api.route.getHistoryByLt,fn,lt);
    },
    getIssue:function(lt,fn){
    	Api.getData(Api.route.getIssue,fn,lt);
    },
    getOrderList:function(obj,fn){
    	Api.getData(Api.route.getOrderList,fn,obj);
    },
    getOrderDetail:function(id,fn){
    	Api.getData(Api.route.getOrderDetail,fn,id);
    },
    getTraceList:function(obj,fn){
    	Api.getData(Api.route.getTraceList,fn,obj);
    },
    getTraceDetail:function(id,fn){
    	Api.getData(Api.route.getTraceDetail,fn,id);
    },
    stopTrace:function(obj,fn){
    	Api.getData(Api.route.stopTrace,fn,obj);
    },
    getTraceIssue:function(obj,fn){
    	Api.getData(Api.route.getTraceIssue,fn,obj);
    },
    cancelOrder:function(obj,fn){
    	Api.getData(Api.route.cancelOrder,fn,obj);
    },
    getRechargeList:function(obj,fn){
    	Api.getData(Api.route.getRechargeList,fn,obj);
    },
    rechargeIndex:function(fn){
    	Api.getData(Api.route.rechargeIndex,fn);
    },
    getDrawList:function(obj,fn){
    	Api.getData(Api.route.getDrawList,fn,obj);
    },
    getWithDrawInfo:function(fn){
    	Api.getData(Api.route.getWithDrawInfo,fn);
    },
    withDrawSubmit:function(obj,fn){
    	Api.getData(Api.route.withDrawSubmit,fn,obj);
    },
    payResult : function(obj,fn){
    	Api.getData(Api.route.payResult,fn,obj);
    },
    payPwdExist : function(fn){
    	Api.getData(Api.route.payPwdExist,fn);
    },
    setPayPwd : function(obj,fn){
    	Api.getData(Api.route.setPayPwd,fn,obj);
    },
    updatePayPwd : function(obj,fn){
    	Api.getData(Api.route.updatePayPwd,fn,obj);
    },
    checkPayPwd : function(obj,fn){
    	Api.getData(Api.route.checkPayPwd,fn,obj);
    },
    queryBankList : function(fn){
    	Api.getData(Api.route.queryBankList,fn);
    },
    addBankCard : function(obj,fn){
    	Api.getData(Api.route.addBankCard,fn,obj);
    },
}
