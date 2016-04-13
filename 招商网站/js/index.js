var banner_index = 2,prv_banner_index=1;
var banner_num ;
var s ;
var delayTime ;
var obj ;
$(document).ready(function(){

	$(window).scroll(function(event) {
		initScroll();
	});

	initScroll();
	
	function initScroll(){
		var top = $(window).scrollTop();
		if(top > 37){
			$('.topMenu').addClass('fixedMenu');
		}else{
			$('.topMenu').removeClass('fixedMenu');
		}
	}
	
	$(".banner_ctrl i").hover(function(){
		$(this).addClass('ctrl-hover');
	},function(){
		$(this).removeClass('ctrl-hover');
	});
			
	var tNum=$(".m_banner .banner").length-1;
	var nNum=0;		
	$(".banner_ctrl .prev").click(function(){
		(nNum-1)<0?n2=tNum:n2=nNum-1;
		bSwitch(nNum,n2);
		nNum=n2;
	});	
	$(".banner_ctrl .next").click(function(){
		(nNum+1)>tNum?n2=0:n2=nNum+1;
		bSwitch(nNum,n2);
		nNum=n2;
	});
	function bSwitch(nNum,n2){
		$(".m_banner .banner:eq("+nNum+")").removeClass('act').fadeOut();
		$(".m_banner .banner:eq("+n2+")").addClass('act').fadeIn();
	};
							
	
	var switchTime = setInterval(function(){
		(nNum+1)>tNum?n2=0:n2=nNum+1;
		bSwitch(nNum,n2);
		nNum=n2;
	},6000);
	
	$(".notice_box").animate({bottom:0});
	$(".notice_box_t .close").click(function(){
		$(".notice_box").fadeOut();
	});

});

function delayHide(){
	$(obj).children(".s_nav").removeClass("fade_in");
	if(delayTime)
		clearTimeout(delayTime);
	delayTime = null;
	obj = null;
}

function slide() {
	if (banner_index > banner_num) {banner_index = 1;} 
	$('#c'+banner_index).addClass("curr");
	if(prv_banner_index > 0){
		$('#c'+prv_banner_index).removeClass("curr");
	}
	$('#banner'+banner_index).fadeIn(500);
	if(prv_banner_index > 0){
		$('#banner'+prv_banner_index).hide(); 
	}
	prv_banner_index=banner_index;
	banner_index++;
}
function convert(index){
	if($('#c'+index).hasClass("curr"))
		return ;
	
	if(s != null){
		clearInterval(s);
		s = null ;
	}
	banner_index = index ;
	prv_banner_index = ( prv_banner_index == 0 ? 1 : prv_banner_index );
	$('#c'+banner_index).addClass("curr");
	$('#c'+prv_banner_index).removeClass("curr");
	$('#banner'+banner_index).fadeIn(500);
	$('#banner'+prv_banner_index).hide();
	prv_banner_index=banner_index;banner_index++;
	if(s == null )
		s=setInterval(slide, 8000); 
}
function go(url){
	$("#gform").attr("action",url);
	$("#gform").submit();
}
