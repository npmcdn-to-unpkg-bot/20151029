var Main = Main || {};
Main = {
	scroll : null,
	swiper : null,
	currentPage : '#index',
	loaded : function(){
		var me = this;
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		me.initWrapper();
	},
	
	init : function(){
		var me = this;
		me.initIndex();
	},
	
	initWrapper : function(){
		var me = this;
		if(me.scroll){
			me.scroll.destroy();
		}
		me.scroll = null;
		var wrapper = me.currentPage + ' .wrapper';
		me.scroll = new IScroll(wrapper,{
			momentum: false,
			tap:true
		});
	},
	
	initIndex : function(){
		var me = this;
		$('#index .lts').on('tap',function(){
			me.currentPage = '#lottery';
		    me.switchPage();
		});
		
		me.swiper = new Swiper('.swiper-container', {
		    loop: true,
		    autoplay:5000
		});
	},
	
	switchPage : function(){
		var me = this;
		me.initWrapper();
		$('.pageCurrent').removeClass('pageCurrent');
	    $(me.currentPage).addClass('pageCurrent');
	}
};

(function($){
	Main.init();
})(Zepto);
