var RWRecord = RWRecord || {};

RWRecord = {
	listType : 'rechargelist', // rechargelist-充值记录     withdrawlist-提现记录
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
		
		if(!param){
			return;
		}
		param.currPage = param.currPage + 1;
				    	
		if(param.currPage > 10){
			var tip = {content : '更多数据请到PC端查询'};
			Q.showDialog(tip);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			return;
		}
		
		fn.call(RWRecord,param,true);
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
    	
    	var obj = {
    		currPage:1,
    		pageSize:10
    	};
    	
    	var append = false;
    	
    	arguments[0] && (obj = arguments[0]);
    	arguments[1] && (append = arguments[1]);
    	
    	var ul =  $('.recharge-list');
    	console.log(JSON.stringify(obj))
    	Api.getRechargeList(obj,function(res){
    		var list = res.data;
    		if(list && list.length > 0){
    			var h = '';
    			$(list).each(function(){
					h += me.getRechargeLi(arguments[1]);
    			});
    			if(append){
        			ul.append(h);
    			}else{
    				ul.html(h);
    			}
    		}else{
    			var tip = {content : "暂无更多数据"}
    			Q.showDialog(tip);
    			me.loading = false;
    			
    			if(append){
    				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
    			}else{
    				ul.html('<li class="no-data">暂无数据</li>');
    				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
    			}
    			return;
    		}
    		
    		if(!append){
    			me.rechargeParam = obj;
    		}
    		
    		if(me.pullStatus == 'down'){
    			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
    			if(list.length == 10){
    				mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    			}
    		}else if(me.pullStatus == 'up'){
    			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
    		}
    		me.loading = false;
    	});
	},
	
    getWithDrawList : function(){
    	var me = this;
    	
    	me.listType = 'withdrawlist';
    	
    	var obj = {
    		currPage:1,
    		pageSize:10
    	};

    	var append = false;
    	
    	arguments[0] && (obj = arguments[0]);
    	arguments[1] && (append = arguments[1]);
    	
    	var ul = $('.withdraw-list');
    	
    	console.log(JSON.stringify(obj))
    	Api.getDrawList(obj,function(res){
    		console.log(JSON.stringify(res))
    		var list = res.data;
    		var h = '';
    		if(list && list.length > 0){
    			$(list).each(function(){
    				h += me.getWithDrawLi(arguments[1]);
    			});
    			
    			if(append){
        			ul.append(h);
    			}else{
    				ul.html(h);
    			}
    		}else{
    			var tip = {content : "暂无更多数据"}
    			Q.showDialog(tip);
    			me.loading = false;
    			
    			if(append){
    				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
    			}else{
    				ul.html('<li class="no-data">暂无数据</li>');
    				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
    			}
    			return;
    		}

			if(!append){
    			me.withdrawParam = obj;
    		}
    		
    		if(me.pullStatus == 'down'){
    			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
    			if(list.length == 10){
    				mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    			}
    		}else if(me.pullStatus == 'up'){
    			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
    		}
    		me.loading = false;
    	});
    },
};
