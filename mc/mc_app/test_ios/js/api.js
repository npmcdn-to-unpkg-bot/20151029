var Api = Api || {};

Api = {
	host : 'http://www.mc188.com',
    route: {
    	getSlides: '/m/sobet/api/i/anon/activity/queryCurrentActivity',
    	getAdminNotice:'/m/sobet/adminCommon/getAdminNotice.do',
    	getOdds: "/lottery-mobile/api/anon/v1/lottery/odds",
        getOddsByLt: "/lottery-mobile/api/anon/v1/lottery/odds_app",
        getAllHistory: "/lottery-mobile/api/m/v1/lottery/open_issue_app",
        getHistoryByLt: "/lottery-mobile/api/m/v1/lottery/last_open_issue_app",
        getIssue: "/lottery-mobile/api/m/v1/lottery/issue_info_app",
        addOrder: "/lottery-mobile/api/m/v1/lottery/add_order",
        addOrderMMC: "/lottery-mobile/api/m/v1/lottery/add_order_now",
        getOrderList : "/lottery-mobile/api/m/v1/lottery/history_orders",
        getOrderDetail : "/lottery-mobile/api/m/v1/lottery/recent_detail",
        getTraceList : "/lottery-mobile/api/m/v1/lottery/lottery_trace",
        getTraceDetail : "/lottery-mobile/api/m/v1/lottery/trace",
        stopTrace : "/lottery-mobile/api/m/v1/lottery/trace_cancel",
        getTraceIssue : "/lottery-mobile/api/m/v1/lottery/trace_issue",
        cancelOrder : "/lottery-mobile/api/m/v1/lottery/cancel_order",
        getRechargeList : "/m/sobet/m/query/rechargeOrder_ajaxList",
        rechargeIndex : "/m/sobet/pay/m/rechargeIndexView",
        recharge : "/m/sobet/pay/m/recharge",
        getDrawList : "/m/sobet/m/query/drawOrder_ajaxList",
        getWithDrawInfo : '/m/sobet/pay/m/drawCashIndexView',
        withDrawSubmit : '/m/sobet/pay/m/withdrawCash',
        
    },
    
    getData : function(url,fn){
    	url = Api.host + url;
    	var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {	
			if(xhr.readyState == 4){
				if ( xhr.status == 200 ){
					fn(xhr.responseText);
				} else {
					fn('error');
				}
			}
		}
		xhr.open( "GET", url );
		xhr.send();
    },
    
    postData : function(url,fn,param){
    	url = Api.host + url;
    	var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {	
			if(xhr.readyState == 4){
				if ( xhr.status == 200 ){
					fn(xhr.responseText);
				} else {
					fn('error');
				}
			}
		}
		xhr.open( "POST", url );
		xhr.send(param);
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
    	var url = "WBGMMC" === obj.lottery ? Api.route.addOrderMMC : Api.route.addOrder;
    	Api.postData(url,fn,obj);
    },
    getSlides: function(s, fn) {
    	Api.getData(Api.route.getSlides,fn,s);
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
    rechargeIndex:function(obj,fn){
    	Api.getData(Api.route.rechargeIndex,fn,obj);
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
}
