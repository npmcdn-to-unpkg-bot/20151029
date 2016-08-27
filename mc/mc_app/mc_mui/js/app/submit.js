var Submit = Submit || {};

Submit = {
	MMCInited : false, //秒秒彩连续投注对话框事件是否已绑定
	
	saveData : false, //退出页面时候是否要保存注单数据
	restore: false,
	restoreIndex : null, //修改注单的li索引值
    orderObj: null, //提交注单时提交的注单数据
    orderlist : null, //提交注单页返回购彩大厅时保存的数据
    isContinue : true, //秒秒彩是否连续开奖
    mmcLoading : false, //秒秒彩是否正在开奖
    
	_init : function() {
    	var me = this;
		me.cw = plus.webview.currentWebview();
		me.lotteryPage = plus.webview.getWebviewById('lottery');
    	me.homePage = plus.webview.getWebviewById('home');
    	
    	me.cw.addEventListener( "hide", function(e){
    		var data = {
    			lt : me.lt
    		}
			if(me.saveData && $('.order-list li').length > 0){
				data.list = $('.order-list').html();
			}else{
				data.list = undefined;
			}
			
			mui.fire(me.homePage,'saveOrderList',data);
			
    		$('.order-list').find('li').remove();
    		$('.orderTotal .trace input').val(1);
			me.setSubmitData();
			mui.fire(me.lotteryPage, '_clearInterval');
    		
		}, false );
    	
    	me._initBack();
		me._initEvent();
    },
    
    _initBack : function(){
    	var me = this;
    	
		//重写退出函数
    	var old_back = mui.back;
    	
		mui.back = function(){
			if($('.order-list li').length > 0){
				plus.nativeUI.actionSheet( {
					title:"退出",
					cancel:"取消",
					buttons:[{title:"保留注单数据"},{title:"清除注单数据"}]
				}, function(e){
					var index = e.index;
					switch (index){
						case 0:break;
						case 1:
							me.saveData = true;
							me.cw.hide('slide-out-right',500);
							break;
						case 2:
							me.saveData = false;
							me.cw.hide('slide-out-right',500);
							break;
					}
				});
			}else{
				me.saveData = false;
				me.cw.hide('slide-out-right',500);
			}
		}
    },
    
    _initEvent : function(){
    	var me = this;
    	var list = $('.order-list');
    	
		//清空注单
    	$('.clearOrder span').on('tap',function(evt){
    		evt.preventDefault();
    		
    		if(list.find('li').length > 0){
    			mui.confirm('确定要清空注单吗？', '清空', ['否', '是'], function(e) {
					if (e.index == 1) {
						list.find('li').remove();
				    	me.setSubmitData();
					}
				})
    		}else{
    			var tip = {content:'已清空全部注单'};
    			Q.showDialog(tip);
    		}
    	});
    	
    	//添加号码
    	$('.addOrder span').on('tap',function(evt){
    		evt.preventDefault();
    		
    		mui.fire(me.lotteryPage, 'addCode');
    		me.lotteryPage.show('slide-in-bottom',500);
    	});
    	
    	//删除注单
    	list.on('tap','.delete',function(){
    		var _this = $(this);
    		mui.confirm('确定要删除吗？', '删除', ['否', '是'], function(e) {
				if (e.index == 1) {
					_this.parent('li').remove();
    				me.setSubmitData();
				}
			})
    	});
    	
    	//修改注单
    	list.on('tap','.update',function(evt){
    		evt.preventDefault();
    		var li = $(this).parent('li');
    		me.restoreIndex = li.index();
    		me.restore = true;
    		
    		var li_data = {
    			method : li.attr('data-method'),
    			countData : li.attr('data-count'),
    			code : li.attr('data-code')
    		};
    		mui.fire(me.lotteryPage, 'restoreCode',li_data);
    		me.lotteryPage.show('slide-in-bottom',500);
    	});
    	
    	//追号输入框change事件
    	$('.trace input').on('change',function(evt){
    		evt.preventDefault();
    		var val = $(this).val();
    		var min = 1;
    		var max = me.lt == "WBGMMC" ? 1000 : me.maxtraceCount;
    		
    		if(val === ''){
    			$(this).val(min);
    		}else if(parseInt(val) > parseInt(max)){
    			$(this).val(max);
    		}else if (parseInt(val) < parseInt(min)) {
    			$(this).val(min);
			}
    		me.setSubmitData();
    	});
    	
    	//追中即停
		$('.winstop').on('tap',function(evt){
    		evt.preventDefault();
    		var traceCount = parseInt($('.trace input').val());
    		if(traceCount == 1){
    			return;
    		}
    		$(this).toggleClass('on');
    		me.setSubmitData();
    	});
    	
    	//投注按钮事件
    	$('.submit button').on('tap',function(evt){
    		if ($(this).hasClass("locked")){
    			return false;
            }
    		if ($(this).hasClass("disabled")){
    			return false;
            }
    		
    		evt.preventDefault();
    		
    		me.setSubmitData();
    		
    		if(!me.orderObj){
    			Q.showDialog({
    				content:'请至少选择一注号码'
    			});
    			return;
    		}
    		//秒秒彩连投
            if(me.lt === 'WBGMMC' && me.orderObj.istrace) {
            	me.showMMCDialog();
              	me.addOrderMMCLoopApi();
            } else {
               me.addOrderApi();
            }
    	});
    },
    
    _initMMCEvent : function(){
    	var me = this;
      	$('.btn-mmc-loop').off('tap').on('tap',function(evt) {
            var type = parseInt($(this).attr("data-type"), 10);
            switch(type) {
            	case 1:
            		$(this).html('继续').attr('data-type', 2);
            		$('.mmc-close').show();
            		me.isContinue = false;
            		break;
            	case 2:
            		if(!me.mmcLoading){
                		$(this).html('停止').attr('data-type', 1);
                		me.isContinue = true;
                		me.addOrderMMCLoopApi();
                		$('.mmc-close').hide();
            		}else{
            			Q.showDialog({content:'请等待当前开奖完成'});
            		}
            		break;
            	case 3://关闭弹出框
                	if(!me.mmcLoading){
                		me.isContinue = true;
                    	me.closeMMCDialog();
            		}else{
            			Q.showDialog({content:'请等待当前开奖完成'});
            		}
            		break;
            	default: break;
            }
        });
      	
      	$('.mmc-close').off('tap').on('tap',function(evt) {
      		if(!me.mmcLoading){
      			me.isContinue = true;
      			me.closeMMCDialog();
  			}else{
  				Q.showDialog({content:'请等待当前开奖完成'});
  			}
        });
    },
    
    showMMCDialog : function(){
    	var me = this;
    	if(!me.MMCInit){
    		me.MMCInit = true;
    		me._initMMCEvent();
    	}
    	$('mmc-close').hide();
		$('#mmcLoopNow').text('0').parent().show();
		$(".dialog_mmc_trace .status").text('开奖中');
		$('#mmcLoopDone').text('0');
		$('#mmcTotalCount').text(me.orderObj.trace.totalCount);
		$('#mmcLoopPrize').text('0');
		$('#mmcLoopMoney').text('0');
		$('#mmcLoopAmount').text('0');
		$(".mmc-last-prize").show();
		$('.btn-mmc-loop').text('停止').attr('data-type', 1);
		
		$('#mmcDialog').show();
		$('#mmcMask').show();
    },
    
    closeMMCDialog : function(){
		$('#mmcDialog').hide();
		$('#mmcMask').hide();
    },
    
    init : function(){
    	var me = this;
    	me.renderOrder();
    },
    
    initIssue : function(data){
    	var me = this;
    	me.issue = data.issue;
    	//该彩种最大可连投期数
    	me.maxtraceCount = data.maxtraceCount;
    	var issue = me.cls == 'pk10' ? me.issue : me.issue.substring(4);
    	$('.orderTime .issue').html(issue);
    },
    
    initCountTime : function(time){
    	$('.orderTime .countdown').html(time);
    },
    
    //渲染订单
    renderOrder : function(){
    	var me = this;
    	$('header .title').html(me.ltName);
    	
    	if(me.lt == 'WBGMMC'){
    		$('body').addClass('show-mmc');
			// 初始化滚动数字
    		if(!me.flipball){
    			me.flipball = $("#flipball").flipball({
    				ballsize: 5, // 彩球个数
    				initball: '0,0,0,0,0', // 初始化彩球数据
    				loop: 3, // 彩球滚动循环次数（必须为整数）
    				timeout: 500, // 彩球滚动动画执行时间基数
    				delay: 80, // 每个彩球动画执行延迟时间基数
    				offset: [54, 56] // 球的宽高
    			});
    		}
    	}else{
    		$('body').removeClass('show-mmc');
    	}
    	var list = $('.order-list');
    	
    	var order = me.orderlist;
    	
    	if(me.restore){
    		me.restore = false;
    		list.find('li').eq(me.restoreIndex).replaceWith(order);
    	} else {
    		list.append(order);
    	}
    	
    	me.setSubmitData();
    },
    
    setSubmitData : function(){
    	var me = this;
    	
    	var list = $('.order-list li');
    	
    	var traceCount = parseInt($('.trace input').val());
    	
    	var totalCount = 0;
    	var totalMoney = 0;
    	
    	if(list.length == 0){
    		me.orderObj = null;
    	}else{
    		var orders = [];
        	
        	$(list).each(function(){
        	    //  注数  | 倍数  | 元角分厘   | 奖金模式  | 返点  | 总金额   | 选择位置（任选玩法）| 元角分厘名称
        		var data = $(this).attr('data-count').split('|');
        		var code = $(this).attr('data-code');
        		var method = $(this).attr('data-method');
        		totalCount += parseInt(data[0],10);
        		totalMoney += parseFloat(data[5],10);
        		var tmpOrder = {
    				//"method" : me.method,
        			"method" : method,
    				"code" : code,
    				"nums" : data[0],
    				"piece" : data[1],
    				"price" : data[2],
    				"odds" : data[3],
    				"point" : data[4],
    				"amount" : data[5]
        		}
        		if(data[6]){
        			tmpOrder['position'] = data[6];
        		}
        		orders.push(tmpOrder);
        	});
        	
        	totalMoney = totalMoney * traceCount;

    		me.traceCount = traceCount;
    		
    		totalMoney = totalMoney.toFixed(4);
    		var trace = {
    			"start":me.issue,
    			"totalMoney":totalMoney,
    			"totalCount":traceCount,
    			"mode":2,//同倍追号
    			"winStop" : $('.winstop').hasClass('on')
    		};
    		
    		if(traceCount > 1){
    			me.orderObj = {
    		        "lottery": me.lt,
    		        "order": orders,
    		        "trace" :trace,
    		        "istrace" : traceCount > 1
    		    };
    		}else{
    			me.orderObj = {
    		        "lottery": me.lt,
    		        "order": orders
    		    };
    		}

    		if(me.lt != "WBGMMC"){
    			me.orderObj.issue = me.issue;
    		}
    	}
    	
    	$('.traceCount').html(traceCount);
    	
    	$('.totalMoney em').html(totalMoney);
    	$('.totalCount').html(totalCount);
    },
    
    getOsType : function(){
    	var me = this;
    	var osName = plus.os.name;
    	if(osName == 'Android'){
    		me.orderObj.sourceType = 0;
    	}else if(osName == 'iOS'){
    		me.orderObj.sourceType = 1;
    	}
    },
    
    addOrderApi: function() {
        var me = this;
        me.getOsType();
        console.log(JSON.stringify(me.orderObj))
        Api.addOrder(me.orderObj, function(res) {
        	var tip = {};
        	if(res.code == '1'){
        		if (me.lt === 'WBGMMC' && me.flipball !== undefined) {
        			var prize = parseFloat(parseFloat(res.result.bonus, 10).toFixed(4));
        			var code = res.result.code.split(',');
        			
        			tip.content = '很遗憾，没有中奖';
        			me.flipball.flip(code, true, function() {
        				if (prize > 0) {
        					tip.content = '恭喜你中奖了，奖金：￥' + prize;
        	            }
        				Q.showDialog(tip);
        			});
        		} else{
        			tip.content = '订单提交成功';
    	    		Q.showDialog(tip);
        		}
        	} else {
        		tip.content = res.msg;
	    		Q.showDialog(tip);
        	}
        });
    },
    addOrderMMCLoopApi : function(){
      	var me = this;
        me.getOsType();
        if(me.isContinue){
          	var obj = me.orderObj;
          	//obj.trace.winStop;
          	var winTop = obj.trace.winStop;
          	var traceCount = obj.trace.totalCount;
          	
          	var mmcBtn = $('.btn-mmc-loop');
          
          	if(mmcBtn.attr('data-type') == 2){
        		return;
        	}
          	
        	$("#mmcLoopNow").html(parseInt($("#mmcLoopNow").html(), 10) + 1);
            $(".dialog_mmc_trace .status").html('开奖中');
            
            me.mmcLoading = true;
            Api.addOrder(obj, function(d) {
            	if (d.code && d.code == '1') {
    	            var isStopMMC = parseInt($(".btn-mmc-loop").attr('data-type'), 10);

    	            // 秒秒彩动画开始
    	            var prize = parseFloat(parseFloat(d.result.bonus, 10).toFixed(4));
    	            var code = d.result.code.split(',');
    	            
//    	            var prize = 0;
//    	            var code = [1,2,3,4,5];
    	            
    	            me.flipball.flip(code, true, function() {
    	            	$(".dialog_mmc_trace .status").html('已结束');
    	            	// 连投次数等于总次数 不继续
    	            	if(parseInt($("#mmcLoopNow").html(), 10) === traceCount) {
    	            		$(".btn-mmc-loop").html('确定').attr('data-type', 3);
    	            		$("#mmcLoopNow").parent('span').hide();
    	            		$(".mmc-last-prize").hide();
    	            		me.isContinue = false;
    	            	}

    	            	// 用户停止 不继续
    	            	if(isStopMMC !== 1) {
    	            		me.isContinue = false;
    	            	}
    	            	// 中奖即停
    	            	if (prize > 0 && winTop) {
    	            		$(".btn-mmc-loop").html('确定').attr('data-type', 3);
    	            		$("#mmcLoopDone").html(parseInt($("#mmcLoopDone").html(), 10) + 1);
    	            		$("#mmcLoopPrize").html($("#mmcLoopNow").html());
    	            		$("#mmcLoopMoney").html(prize);
                       
    	            		var prizeAmount = parseFloat((parseFloat($("#mmcLoopAmount").html(), 10) + prize).toFixed(4));
    	            		$("#mmcLoopAmount").html(prizeAmount);
    	            		me.isContinue = false;
    	            	} else if(prize > 0) {
    	            		// 投中更新已中奖次数
    	            		$("#mmcLoopDone").html(parseInt($("#mmcLoopDone").html(), 10) + 1);
    	            		$("#mmcLoopPrize").html($("#mmcLoopNow").html());
    	            		$("#mmcLoopMoney").html(prize);
                      
    	            		var prizeAmount = parseFloat((parseFloat($("#mmcLoopAmount").html(), 10) + prize).toFixed(4));
    	            		$("#mmcLoopAmount").html(prizeAmount);
    	            	}

            			me.mmcLoading = false;
    	            	if(me.isContinue) {
    	            		setTimeout(function(){
    		            		me.addOrderMMCLoopApi();
    	            		},2000);
    	            	}
                  });
                } else {
            		me.mmcLoading = false;
                	me.closeMMCDialog();
                	var tip = {content:d.msg};
    	    		Q.showDialog(tip);
                }
            });
        }
    }
}
