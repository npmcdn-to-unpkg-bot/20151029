Date.prototype.pattern = function(fmt) {           
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }          
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
};         
 
var transDate = function() {
	var date = new Date();
	var month = {
		"1" : "January",
		"2" : "February",
		"3" : "March",
		"4" : "April",
		"5" : "May",
		"6" : "June",
		"7" : "July",
		"8" : "August",
		"9" : "September",
		"10": "October",
		"11": "November",
		"12": "December"
	};
	var week = {           
    	"0" : "Sunday",           
    	"1" : "Monday",           
    	"2" : "Tuesday",           
    	"3" : "Wednesday",           
    	"4" : "Thursday",           
    	"5" : "Friday",           
    	"6" : "Saturday"          
    };
	
	var str = week[date.getDay()] + ', ' + month[date.getMonth()+1] + ' ' + date.pattern("dd, yyyy at HH:mm:ss");
	date.getHours() > 12 ? str += " PM" : str += " AM";
	return str;           
};

var countDown = function(array,func,i){
	var h = parseInt(array[0]),
	    m = parseInt(array[1]),
	    s = parseInt(array[2]);
	if(h <= 0 && m <=0 && s<= 0){
		func(i);
		return ['00','00','00'];
	}
	
	s = s - 1;
	if(s < 0){
		s = 59;
		m = m - 1;
		if(m < 0){
			m = 59;
			h = h - 1;
		}
	}
	array.splice(0,3,h,m,s)
	$(array).each(function(i,e){
		if(String(e).length == 1){
			array[i] = '0' + e;
		} 
	});
	return array;
};

(function(){
	var header = '<div class="head"><div class="head-top"><div class="logo"></div><div class="follow"><span>Follow Us On</span>\
				<i class="facebook"></i><i class="youtube"></i><i class="ins"></i></div></div><div class="head-menu"><ul>\
				<li class="homepage"><a href="index.html"></a></li><li class="about"><a>About WBG</a></li><li>\
				<label>Lottery results history</label><span class="l-m"><a href="w-300.html">WBG 300s Lottery</a>\
				<a href="w-60.html">WBG 60s Lottery</a></span></li><li><a>How To Play</a></li><li><a>Contact Us</a></li>\
				<li id="date" class="date"></li></ul></div></div>';
	var footer = '<div class="footer"><div class="information"><span>More Lottery Information</span><a>Terms & Conditions</a>\
				<a>Sietmap</a><a>Affiliation</a><a href="privacy.html">Privacy Policy</a><a>Security</a><a>Contact us</a>\
				</div><div class="right"><i></i>Copyright &copy; 2016 WBG International CO. ,  Ltd. All Rights Reserved</div></div>';
	
	$('.m').before(header).after(footer);
	
	var initTime = function(){
		$('#date').html(transDate());
		setTimeout(initTime,1000);
	};

	initTime();
	
	$(".video").on("click",function(e) {
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
