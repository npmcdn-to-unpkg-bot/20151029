var Main = Main || {};
Main = {
	scroll : [],
	swiper : null,
	currentPage : '#index',
	prePage : [],
	stopScrollBack:false, //滚动是否回弹
	
	init : function(){
		var me = this;
		/**
		me.initEvents();
		
		User.getStatus(function(res){
			if(res.code != 0){
				me.pageIn('#login');
			}else {
				//获取轮播图
				User.name = res.result.name;
				$('.userInfo .username').html(User.name);
				me.getSlides();
				me.getAdminNotice();
				me.getOdds();
			}
 		});
 		*/
 		console.info(111111111111)
 		me.getSlides();
		me.getAdminNotice();
	},
	
	initEvents : function(){
		var me = this;
		
		me.initLogin();
		me.initDialog();
		me.initIndex();
		Lottery.initEvents();
	},
	
	initWrapper : function(){
		var me = this;
		me.stopScrollBack = false;
		
		if(me.scroll.length > 0){
			$(me.scroll).each(function(){
				arguments[1].destroy();
				arguments[1] = null;
			});
		}
		me.scroll = null;
		me.scroll = [];
		
		var wrapper = $(me.currentPage).attr('data-wrapper');
		if(wrapper){
			wrapper = wrapper.split('|');
			$(wrapper).each(function(){	
				var s = me.currentPage + ' ' + arguments[1];
				var config = {
					momentum: true,
					tap:true
				};
				
				if($(s).attr('data-probe')){
					config.probeType = $(s).attr('data-probe');
				}
				
				var scroll = new IScroll(s,config);
				me.scroll.push(scroll);
			});
		}
	},
	
	getOdds : function(){
		var me = this;
		me.showLoading();
		$(document.body).append('<iframe id="login-iframe" style="display: none;"></iframe>');
		$("iframe#login-iframe").attr('src', '/lottery-mobile/u/login?backType=0&t=' + (new Date()).getTime());
		$("iframe#login-iframe").on('load',function() {
			Api.getOddsByLt({lottery:'CQSSC'},function(d) {
				Lottery.odds.CQSSC = d.result.CQSSC;
				me.closeDialog();
			});
			
			Lottery.refreshBalance();
			
		    setTimeout(function() {
		      $("iframe#login-iframe").remove();
		    }, 1000);
		});
	},
	
	initIndex : function(){
		var me = this;
		
		$('#index .lt-list').on('tap',function(e){
			if($(e.target).hasClass('lt-list')){
				return false;
			}
			var t;
			if(e.target.nodeName == "DIV"){
				t = $(e.target);
			}else{
				t = $(e.target).closest('div');
			}
			
			Lottery.lt = t.attr('data-lt');
			Lottery.cls = t.attr('data-lt-cls');
			Lottery.ltName = Q.getLtName(Lottery.lt);
			
			if(Lottery.orderlist[Lottery.lt]){ //如果之前保存过该彩种的数据
				Lottery.renderOrder();
				Lottery.lotteryToSubmit();
			} else {
				me.pageIn('#lottery');
			}

		    Lottery.init();
		});
		
		$('footer.menu').on('touchend',function(e){
			var t;
			if(e.target.nodeName == "DIV"){
				t = $(e.target);
			}else{
				t = $(e.target).closest('div');
			}
			
			var target = t.attr("data-page");
			
			$(target).show().siblings().hide();
			
			//me.prePage = [];
			//me.currentPage = target;
			$('#index').removeClass('showSeachMenu');
			
			switch (target) {
        		case "#historyPage": 
        			Lottery.getAllHistory();
        			break;
        		case "#searchPage":
        			$('#index').addClass('showSeachMenu');
        			Lottery.getOrderList();
        			break;
        		default:
        			break;
			}
			
			me.initWrapper();
		});
		
		$('.pageback').on('touchend',function(evt){
    		evt.preventDefault();
    		Common.pageOut();
    	});
	},
	
	getSlides: function(){
		var me = this;
		me.showLoading();
		Api.getSlides({pageSize:5},function(res){
			res = JSON.parse(res);
			if (res.code=='0') {
			    var data = res.result.entities;
			    if (data.length>0) {
			    	var h = '';
			    	for (var i = 0; i < data.length; i++) {
			    		h += '<div class="swiper-slide"><img src="' + Api.host + data[i].frontImagePath +'"></div>';
			    	};
			    	
			    	$('#content .banner .swiper-wrapper').html(h);
			    	
			    	new Swiper('#content .banner', {
					    loop: true,
					    autoplay:5000
					});
			    }
			}
		    
		});
	},
	getAdminNotice: function(){
		var me = this;
		Api.getAdminNotice({pageNumber:10,scroll:1},function(res){
			
			console.log("11:"+res);
			
			var list = [
		            {title:'1111'},
		            {title:'2222'},
		            {title:'333'}
		    ];
			
			var notice = "";
			$(list).each(function(){
				notice += '<div class="swiper-slide">' + arguments[1].title +'</div>';
			});
			console.log(notice)
			$('#content .notice .swiper-wrapper').html(notice);
			
			new Swiper('#content .notice .swiper-container', {
			    loop: true,
			    autoplay:5000,
			    direction:'vertical'
			});
		});
		
	},
	
	
	
	
	initLogin : function(){
		var me = this;
		//登录表单操作[START]
		var form = $('.login-form');
		
		var username = form.find('input[name="usrname"]');
		var password = form.find('input[name="secret"]');
		var codeinput = form.find('input[name="code"]');
		
		var error = form.find('.login-err');
		var verifycode = form.find('img.verifycode');
		
		
		verifycode.on('touchend',function() {
		    verifycode.attr('src', '/sso/imageCode?date=' + new Date());
		    codeinput.val('');
		}).trigger('click');

		
		form.find('.login-btn').on('touchend',function() {
			
			var tip = {
				type:'tip'	
			};
			
			if(username.val() == ''){
				tip.content = '请输入用户名';
				me.showDialog(tip);
				return false;
			}
			
			if(password.val() == ''){
				tip.content = '请输入密码';
				me.showDialog(tip);
				return false;
			}
			
			if(form.hasClass('show-code')){
				var checkCode = true;
				if (codeinput.val() == '') {
					tip.content = '请输入验证码';
					me.showDialog(tip);
					return false;
			    }
			}
			
		    var loginparams = {
		    	backurl: '?',
		    	context: $('.loginformIndex'),
		    	name: username.val(),
		    	pwd: password.val()
		    };
		    
		    if (form.hasClass('show-code')) {
		    	loginparams["capchaCode"] = codeinput.val();
		    }
		    
		    me.showLoading();
		    User.ssoUserLogin(loginparams, function(res) {
		    	me.closeDialog();
		    	if (res.code == 0) {
		    		User.name = res.user.cn;
	    			$('.userInfo .username').html(User.name);
	    			
	    			$('#indexPage').show().siblings().hide();
	    			
		    		//获取轮播图
					me.getSlides();
					//获取公告
	    			me.getAdminNotice();
	    			//获取赔率
					me.getOdds();
	    			
		    		me.pageOut({
	    				'transform':'translate3d(0,100%,0)'
	    			});
		    	} else {
		    		tip.content = res.msg;
		    		me.showDialog(tip);
		    		
		    		if(res.needCapchaCode){
		    			form.addClass('show-code');
		    			verifycode.attr('src', '/sso/imageCode?date=' + new Date());
		    			codeinput.val('');
		    		}
		    	}
		    });
		});
	},

	pageIn : function(pageId){
		var me = this;
		me.prePage.push(me.currentPage);
		me.currentPage = pageId;
		$(me.currentPage).show().css('transform','translate3d(0,0,0)');
		me.initWrapper();
	},
	
	pageOut : function(){
		var me = this;
		var e = $(me.currentPage);
		me.currentPage = me.prePage[me.prePage.length - 1];
		me.prePage.pop();
		me.initWrapper();
		
		if(arguments[0]){
			e.css(arguments[0]);
		}else{
			e.css('transform','translate3d(100%,0,0)');
		}
		e.one('webkitTransitionEnd transitionend',function(){
			e.off('webkitTransitionEnd transitionend');
			//zepto one事件不只触发一次 ???
			e.hide();
		});
	},

	initDialog : function(){
		var me = this;
		$('#dialog button.cancel').on('touchend',function(){
			me.closeDialog();
		});
	},
	
	showDialog : function(d){
		var me = this;
		
		d.type = d.type || 'tip';
		
		var el = $('#dialog');
		el.show();
		
		var target = null;
		var mask = $('#mask');
		var tip = el.find('.tip');
		var dialog = el.find('.dialog');
		
		if (d.type == 'tip') {
			target = tip;
			
			if(dialog.css('display') == 'block'){
				tip.html(d.content).show();
				setTimeout(function(){
					me.closeTip();
				},1500);
			}else{
				mask.removeClass().addClass('tip-mask');
				tip.html(d.content).show();
				
				setTimeout(function(){
					me.closeDialog();
				},1500);
			}
		}  else if (d.type == 'dialog') {
			target = dialog;
			mask.removeClass().addClass('dialog-mask');
			
			var title = dialog.find('.title');
			var cancel = dialog.find('button.cancel');
			var btns = dialog.find('.btnDiv');
			
			d.title ? title.show().html(d.title) : title.hide();
			d.cancel ? cancel.show() : cancel.hide();
			
			if(d.contentStyle){
				dialog.find('.content').addClass(d.contentStyle);
			}else{
				dialog.find('.content').removeClass().addClass('content');
			}
			
			if(d.btns){
				var h = '';
				$(d.btns).each(function(){
					h += '<button class="' + arguments[1].cls + '">' + arguments[1].text + '</button>';
				});
				btns.html(h);
				
				btns.off('touchend').on('touchend',function(evt){
					evt.preventDefault();
					var _this = evt.target;
					
					var index = $(_this).index();
					d.btns[index].fn();
				});
			}else{
				btns.hide();
			}
			
			dialog.find('.content').html(d.content);
			
			dialog.show();
		}
		
		if(target){
			var h,w;
			
			if(d.width && d.height){
				h = d.height;
				w = d.width;
			} else {
				h = target.height();
				w = target.width();
			}
			
			target.css({
				"margin-top":'-' + h/2 + 'px',
				"margin-left" : '-' + w/2 + 'px',
				"width" : w + 'px',
				"height" : h + 'px'
			});
		}
	},
	
	showLoading : function(d){
		$('#mask').addClass('tip-mask');
		
		$('#loading').show();
		
		if(d && d.content){
			$('#loading').find('p').html(d.content);
		}
	},
	
	closeDialog : function(){
		var el = $('#dialog');
		el.hide();
		$('#mask').removeClass();
		el.find('.loading').hide();
		el.find('.tip').hide();
		el.find('.dialog').hide();
		el.find('.dialog .btnDiv').show();
	},
	
	closeLoading : function(){
		$('#mask').removeClass('tip-mask');
		$('#loading').hide();
	},
	
	closeTip : function(){
		var el = $('#dialog');
		el.find('.tip').hide();
	}
};