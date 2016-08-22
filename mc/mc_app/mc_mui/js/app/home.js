var Home = Home || {};

Home = {
	orderList : {}, //用于保存提交页面的注单数据
	
	_init : function(){
		Api.initHost();
		var me = this;
		$('.banner').height($('.banner').height());
		
		me.cw = plus.webview.currentWebview();
		
		me.loginPage = mui.preload({
			url:'../html/login.html',
      		id:'login',
      		styles:{
				scrollIndicator:'none',
				scalable:false,
				popGesture:'none'
			}
		});
		
		me.lotteryPage = mui.preload({
    		url:'../html/lottery.html',
	      	id:'lottery',
	      	styles:{
				scrollIndicator:'none',
				scalable:false,
				popGesture:'hide'
			},
		});
		
		me.loginPage.show('slide-in-bottom',400,function(){
			me.initEvent();
		});
		
	},
	
	initEvent : function(){
		var me = this;
		
	    $('.lt-list>div').on('tap',function(){
			var data = {
				lt : $(this).attr('data-lt'),
				cls : $(this).attr('data-lt-cls'),
				ltName : Q.getLtName($(this).attr('data-lt'))
			};
			
			mui.fire(me.lotteryPage, 'pageShow', data);
			
			if(me.orderList[data.lt]){ //如果之前保存过该彩种的数据
				if(!me.submitPage){
					me.submitPage = plus.webview.getWebviewById('submit');
				}
				
				data = $.extend(data, {
					orderList : me.orderList[data.lt],
	    			restore : false,
	    		});
	    		
	    		mui.fire(me.submitPage, 'pageShow', data);
		
				me.submitPage.show('slide-in-right',500);
			} else {
				me.lotteryPage.show('slide-in-right',500);
			}
		});
		
		mui.fire(me.cw.parent(),'initSubPage');
	},
	
	initSlide : function(){
		var me = this;
		me.getSlides();
		me.getAdminNotice();
	},
	
	/**
	 * 获取顶部轮播图片
	 */
	getSlides: function(){
		var me = this;
		Api.getSlides({pageSize:5},function(res){
			if (res.code=='0') {
			    var data = res.result.entities;
			    if (data.length>0) {
			    	var h = '';
			    	for (var i = 0; i < data.length; i++) {
			    		h += '<div class="swiper-slide"><img src="' + Api.host + data[i].frontImagePath +'"></div>';
			    	};
			    	
			    	$('.banner .swiper-wrapper').html(h);
			    	
			    	new Swiper('.banner', {
					    loop: true,
					    autoplay:5000,
					    autoplayDisableOnInteraction : false
					});
					
			    }
			}
		});
	},
	
	/**
	 * 获取首页公告
	 */
	getAdminNotice: function(){
		var me = this;
		Api.getAdminNotice({pageNumber:10,scroll:1},function(res){
			var list = res.items;
			var notice = "";
			$(list).each(function(){
				notice += '<div class="swiper-slide">' + arguments[1].title +'</div>';
			});
			$('.notice .swiper-wrapper').html(notice);
			
			new Swiper('.notice .swiper-container', {
			    loop: true,
			    autoplay:5000,
			    direction:'vertical',
				autoplayDisableOnInteraction : false
			});
		});
		
	}
}
