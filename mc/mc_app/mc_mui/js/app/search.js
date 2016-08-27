var Search = Search || {};

Search = {
	listType : 'orderlist', // orderlist-投注查询   tracelist-追号查询
	orderParam : {
		currPage:1,
		pageSize:10
	},
	traceParam : {
		currPage:1,
		pageSize:10
	},
	pullStatus :　'down', // down-下拉刷新   up-上拉加载更多
	loading :　false,  //是否正在加载数据

	_init : function(){
		var me = this;
		me.orderDetailPage = mui.preload({
	      	url:'../html/orderDetail.html',
	      	id:'order_detail',
	      	styles:{
				scrollIndicator:'none',
				scalable:false,
				top: '0px',
				bottom: '0px',
				popGesture: 'hide'
			}
	  	});
		
		me.traceDetailPage = mui.preload({
	      	url:'../html/traceDetail.html',
	      	id:'trace_detail',
	      	styles:{
				scrollIndicator:'none',
				scalable:false,
				top: '0px',
				bottom: '0px',
				popGesture: 'hide'
			}
	  	});
	  	
		$('.order-list').on('tap','li:not(.no-data)',function(){
			var obj = {
				orderId	: $(this).attr('id')
			}
			me.getOrderDetail(obj);
		});
		
		$('.trace-list').on('tap','li:not(.no-data)',function(){
			var obj = {
				traceId	: $(this).attr('id')
			}
    		me.getTraceDetail(obj);
		});
	},
	
	pulldownRefresh : function(){
		if(Search.loading){
			return;
		}
		Search.loading = true;
		Search.pullStatus = 'down';
		
		Search.listType == 'orderlist' ? Search.orderParam.currPage = 1 : Search.traceParam.currPage = 1;
	
		setTimeout(function(){
			Search.listType == 'orderlist' ? Search.getOrderList() : Search.getTraceList();
		},1000);
	},
	
	pullupRefresh : function(){
		if(Search.loading){
			return;
		}
		Search.loading = true;
		
		Search.pullStatus = 'up';
		
		var param = Search.listType == 'orderlist' ? Search.orderParam : Search.traceParam;
		var fn = Search.listType == 'orderlist' ? Search.getOrderList : Search.getTraceList;
		
		param.currPage = param.currPage + 1;
				    	
		if(param.currPage > 10){
			var tip = {content : '更多数据请到PC端查询'};
			Q.showDialog(tip);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			Search.loading = false;
			return;
		}
		
		setTimeout(function(){
			fn.call(Search);
		},1000);
		
	},
	
	getOrderLi : function(){
		var d = arguments[0];
		var h = '';
		var lt = d.lottery;
		(lt == '3DFC') && (lt = 'l' + lt);
		h += '<li id="' + d.orderItemId + '"><div class="title">' + d.orderTime + '</div><div class="content">' +
				'<div class="' + lt + ' ltIcon"></div><div class="ltInfo"><p>' + Q.getMethodName(d.method,d.lottery) + 
				'</p><p>' + d.amount + '元</p></div><div class="status"><p>' + d.state + '</p><p>' + d.awardMoney +
				'元</p></div></div><div class="btm">';
		if(d.lottery != 'WBGMMC'){
			h += '<span>期号' + d.issue + '</span>';
		}
		if(d.winningNumber){
			h += '<span>开奖号码 ' + d.winningNumber + '</span>'
		}
		h += '</div></li>';
		return h;
	},
	
	getTraceLi : function(){
		var d = arguments[0];
		var h = '';
		var lt = d.lottery;
		if (lt=='3DFC') {
			lt='l'+lt;
		}
		h += '<li id="' + d.traceId + '"><div class="title">' + d.createTime + '</div><div class="content">' +
			'<div class="' + lt + ' ltIcon"></div>' + 
			'<div class="ltInfo"><p>' + Q.getMethodName(d.method,d.lottery) + '</p><p>起始期号：' + d.start + '</p></div>' +
			'<div class="status"><p>' + d.status + '</p><p>追'+d.issueCount+'期，已完成'+d.finishCount+'期</p></div></div><div class="btm">' +
			'<span>追号编号' + d.traceId + '</span><span>追号总金额' + d.totalMoney + '元</span>';
		
		if(d.winStop){
			h += '<label class="winstop">追中即停</label></span>'
		}
			
		h += '</div></li>';
		return h;
	},
	
	getOrderList : function(){
    	var me = this;
    	me.listType = 'orderlist';
    	var ul =  $('.order-list');
    	Api.getOrderList(me.orderParam,function(res){
    		console.log(JSON.stringify(res))
    		if(res.code == '1'){
    			var list = res.result.his_orders;
	    		if(list.length > 0){
	    			var h = '';
	    			$(list).each(function(){
						h += me.getOrderLi(arguments[1]);
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
    			var tip = {content : res.msg};
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
	
    getTraceList : function(){
    	var me = this;
    	me.listType = 'tracelist';
    	var ul = $('.trace-list');
    	Api.getTraceList(me.traceParam,function(res){
    		if(res.code == '1'){
	    		var list = res.result.list;
	    		if(list.length > 0){
	    			var h = '';
	    			$(list).each(function(){
	    				h += me.getTraceLi(arguments[1]);
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
    			var tip = {content : res.msg};
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
    
    getOrderDetail : function(obj){
    	var me = this;
    	
    	Api.getOrderDetail(obj,function(res){
    		console.log(JSON.stringify(res))
    		if(res.code == '1'){
    			var d = res.result;
    			mui.fire(me.orderDetailPage,'initData',d);
    			me.orderDetailPage.show('slide-in-right',400);
    		}else{
    			var tip = {content : res.msg};
    			Q.showDialog(tip);
    		}
    	});
    },
    
    getTraceDetail : function(obj){
    	var me = this;
    	Api.getTraceDetail(obj,function(res){
    		if(res.code == '1'){
    			var d = res.result;
    			mui.fire(me.traceDetailPage,'initData',d);
    			me.traceDetailPage.show('slide-in-right',400);
    		}else{
    			var tip = {content : res.msg};
    			Q.showDialog(tip);
    		}
    	});
    },
};
