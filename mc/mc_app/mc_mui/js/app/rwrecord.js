var RWRecord = RWRecord || {};

RWRecord = {
	listType : 'rechargelist', // rechargelist-充值记录     withdrawlist-提现记录
	rechargeParam : {
		currPage:1,
		pageSize:10
	},
	withdrawParam : {
		currPage:1,
		pageSize:10
	},
	pullStatus :　'down', // down-下拉刷新   up-上拉加载更多
	loading :　false,  //是否正在加载数据
	
	_init : function(){
		mui.fire(RWRecord.cw.parent(),'initEvent');
	},
	
	pulldownRefresh : function(){
		if(RWRecord.loading){
			return;
		}
		RWRecord.loading = true;
		RWRecord.pullStatus = 'down';
		
		RWRecord.listType == 'rechargelist' ? RWRecord.rechargeParam.currPage = 1 : RWRecord.withdrawParam.currPage = 1;
	
		setTimeout(function(){
			RWRecord.listType == 'rechargelist' ? RWRecord.getRechargeList() : RWRecord.getWithDrawList();
		},1000);
	},
	
	pullupRefresh : function(){
		if(RWRecord.loading){
			return;
		}
		RWRecord.loading = true;
		
		RWRecord.pullStatus = 'up';
		
		var param = RWRecord.listType == 'rechargelist' ? RWRecord.rechargeParam : RWRecord.withdrawParam;
		var fn = RWRecord.listType == 'rechargelist' ? RWRecord.getRechargeList : RWRecord.getWithDrawList;
		
		param.currPage = param.currPage + 1;
				    	
		if(param.currPage > 10){
			var tip = {content : '更多数据请到PC端查询'};
			Q.showDialog(tip);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			RWRecord.loading = false;
			return;
		}
		setTimeout(function(){
			fn.call(RWRecord);
		},1000);
	},
	
	getRechargeLi : function(){
		var d = arguments[0];
		var h = '';
		h += '<li><div class="title">' + d.orderDate + '</div>' + '<div class="content ';
		var cls;
		var status;
		switch(d.status){
			case 0 : status = '充值成功';cls = 'success';break;
			case 2 : status = '充值失败';cls = 'fail';break;
			case 6 : status = '充值失败';cls = 'fail';break;
			case 7 : status = '充值失败';cls = 'fail';break;
			default: status = '处理中';cls = '';break;
		}
		
		h += cls + '"><div class="info"><p class="t">订单编号</p><p class="num">'
			+ d.spsn + '</p></div><div class="status"><p>'+ status + '</p><p>' + d.cash + '元</p></div></div></li>';
		
		return h;
	},
	
	getWithDrawLi : function(){
		var d = arguments[0];
		var h = '';
		
		h += '<li><div class="title">' + d.createTime + '</div>' + '<div class="content ';
		var cls;
		var status;
		switch(d.status){
			case 0 : status = '提现成功';cls = 'success';break;
			case 2 : status = '提现失败';cls = 'fail';break;
			case 6 : status = '提现失败';cls = 'fail';break;
			case 7 : status = '提现失败';cls = 'fail';break;
			default: status = '处理中';cls = '';break;
		}
		
		h += cls + '"><div class="info"><p class="t">订单编号</p><p class="num">'
			+ d.spsn + '</p></div><div class="status"><p>'+ status + '</p><p>' + d.cash + '元</p></div></div></li>';
		return h;
	},
	
	getRechargeList : function(){
    	var me = this;
    	me.listType = 'rechargelist';
    	var ul =  $('.recharge-list');

    	Api.getRechargeList(me.rechargeParam,function(res){
    		if(res.data && res.data.length > 0){
	    		var list = res.data;
	    		if(list && list.length > 0){
	    			var h = '';
	    			$(list).each(function(){
						h += me.getRechargeLi(arguments[1]);
	    			});
	    			
	    			if(me.pullStatus == 'down'){
	    				ul.html(h);
		    			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		    			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		    			if(list.length == 10){
		    				mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		    			}
		    		}else if(me.pullStatus == 'up'){
		    			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	        			ul.append(h);
		    		}
	    		}else{
	    			var tip = {content : "暂无更多数据"}
	    			Q.showDialog(tip);
	    			
	    			if(me.pullStatus == 'down'){
	    				ul.html('<li class="no-data">暂无数据</li>');
	    				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	    				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
	    			}else{
	    				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	    			}
	    		}
    		}else{
    			var tip = {content : "暂无更多数据"};
	    		Q.showDialog(tip);
	    		ul.html('<li class="no-data">暂无数据</li>');
	    		if(me.pullStatus == 'down'){
    				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
    			}else{
    				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
    			}
    		}
	    	me.loading = false;
    	});
	},
	
    getWithDrawList : function(){
    	var me = this;
    	me.listType = 'withdrawlist';
    	var ul = $('.withdraw-list');
    	
    	Api.getDrawList(me.withdrawParam,function(res){
    		if(res.data && res.data.length > 0){
	    		var list = res.data;
	    		if(list && list.length > 0){
	    			var h = '';
	    			$(list).each(function(){
	    				h += me.getWithDrawLi(arguments[1]);
	    			});
	    			
	    			if(me.pullStatus == 'down'){
	    				ul.html(h);
		    			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		    			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		    			if(list.length == 10){
		    				mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		    			}
		    		}else if(me.pullStatus == 'up'){
		    			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	        			ul.append(h);
		    		}
	    		}else{
	    			var tip = {content : "暂无更多数据"};
	    			Q.showDialog(tip);
	    			if(me.pullStatus == 'down'){
	    				ul.html('<li class="no-data">暂无数据</li>');
	    				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	    				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
	    			}else{
	    				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	    			}
	    		}
    		}else{
    			var tip = {content : "暂无更多数据"};
	    		Q.showDialog(tip);
	    		ul.html('<li class="no-data">暂无数据</li>');
	    		if(me.pullStatus == 'down'){
    				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
    			}else{
    				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
    			}
    		}
	    	me.loading = false;
    	});
    },
};
