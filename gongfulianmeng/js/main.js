$(document).ready(function(){
	$('.carousel').flickity({
		prevNextButtons: false,
		wrapAround: true,
		autoPlay: 5000,
		pauseAutoPlayOnHover: false
	});

	$('.goTop').click(function(){
		if($(document).scrollTop() > 0){
			$('html,body').animate({
				scrollTop:0
			},500);
		}
	});
});

