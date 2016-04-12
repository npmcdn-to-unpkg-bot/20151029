(function(){
	var initTime = function(){
		var date = new Date().pattern("Week, M d, yyyy at HH:mm:ss");
		$('#date').html(date);
		
		setTimeout(initTime,1000);
	};
	
	initTime();	
	
	
	
	$(".video").on("click",function(e) {
		console.info(111)
        e.preventDefault(),
        e.stopPropagation();
		
		var draggie;
		var html = '<div id="tvLiving">\
			<object id="flashObj" width="280" height="256" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" \
			codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,47,0">\
			<param name="movie" value="http://c.brightcove.com/services/viewer/federated_f9?isVid=1&isUI=1" />\
			<param name="bgcolor" value="#FFFFFF" />\
			<param name="flashVars" value="@videoPlayer=4372140149001&playerID=3875138597001&playerKey=AQ~~,AAADhlKg3Nk~,FY5afzSF6auJkIKzvxmmRAd0DE7VIy7P&domain=embed&dynamicStreaming=true" />\
			<param name="base" value="http://admin.brightcove.com" />\
			<param name="seamlesstabbing" value="false" />\
			<param name="allowFullScreen" value="true" />\
			<param name="swLiveConnect" value="true" />\
			<param name="allowScriptAccess" value="always" />\
			<embed src="http://c.brightcove.com/services/viewer/federated_f9?isVid=1&isUI=1" bgcolor="#FFFFFF" \
			flashVars="@videoPlayer=4372140149001&playerID=3875138597001&playerKey=AQ~~,AAADhlKg3Nk~,FY5afzSF6auJkIKzvxmmRAd0DE7VIy7P&domain=embed&dynamicStreaming=true" \
			base="http://admin.brightcove.com" name="flashObj" width="280" height="256" seamlesstabbing="false" type="application/x-shockwave-flash" allowFullScreen="true" \
			allowScriptAccess="always" swLiveConnect="true" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">\
			</embed></object></div>';
		
       if(0 === $("#tvLiving").length){
    	   $(this).append(html),
    	   $("#tvLiving").show().addClass("bounceInRight").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
               $("#tvLiving").removeClass("bounceInRight");
           });
    	   
	       $("#tvLiving span").unbind("click").click(function(e) {
	    	   $("#tvLiving").fadeOut("fast").remove();
	       });
       }
    });
})();