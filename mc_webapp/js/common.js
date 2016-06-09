function loaded(){
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	var myScroll = new IScroll('#wrapper',{
		momentum: false
	});
	
	var mySwiper = new Swiper ('.swiper-container', {
	    loop: true,
	    autoplay:5000
	})   
};
