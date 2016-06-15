var Common = Common || {};
Common = {
	scroll : null,
	swiper : null,
	currentPage : '#index',
	prePage : [],
	loaded : function(){
		var me = this;
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		me.initWrapper();
	},
	
	init : function(){
		var me = this;
		me.initEvent();
		me.initIndex();
	},
	
	initWrapper : function(){
		var me = this;
		if(me.scroll){
			me.scroll.destroy();
		}
		me.scroll = null;
		
		var wrapper = $(me.currentPage).attr('data-wrapper').split('|');
		
		$(wrapper).each(function(){	
			var s = me.currentPage + ' ' + arguments[1];
			me.scroll = new IScroll(s,{
				momentum: false,
				tap:true
			});
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
			
//			Lottery.lt = t.attr('data-lt');
//			Lottery.cls = t.attr('data-lt-cls');
			
			Lottery.lt = 'CQSSC';
			Lottery.cls = 'ssc';
			
		    me.pageIn('#lottery');
		    Lottery.init();
		});
		
		me.swiper = new Swiper('.swiper-container', {
		    loop: true,
		    autoplay:5000
		});
	},
	
	initEvent : function(){
		var me = this;
		$('header .pageback').on('touchend',function(){
			me.pageOut();
		});
	},
	
	pageIn : function(pageId){
		var me = this;
		me.prePage.push(me.currentPage);
		me.currentPage = pageId;
		$(me.currentPage).show().addClass('pageIn').css('transform','translate3d(0,0,0)');
		me.initWrapper();
	},
	
	pageOut : function(){
		var me = this;
		var e = $(me.currentPage);
		me.currentPage = me.prePage[me.prePage.length - 1];
		me.prePage.pop();
		me.initWrapper();
		
		e.removeClass('pageIn').css('transform','translate3d(100%,0,0)');
		
		e.one('webkitTransitionEnd transitionend',function(){
			if(!e.hasClass('pageIn')){
				e.hide();
			}
		});
	}
};

(function($){
	Common.init();
})(Zepto);
