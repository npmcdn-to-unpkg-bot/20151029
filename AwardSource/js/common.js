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

var Common = {	
	t : null,
	timeArray : ['w300','w60'],
	bc : '<label>:</label>',
	api : {
		host : 'http://www.mc188.com/lottery',
		getTime : '/api/anon/v1/lottery/times_callback',
		getIssue : '/api/anon/v1/lottery/issue_info_callback',
		getHistory : '/api/anon/v1/lottery/trend_callback'
	},
	init : function(){
		var me = this;
		me.initGlobal();
		me.initTime();
		me.initVideo();
		me.initNote();
	},
	initGlobal : function(){
		var header = '<div class="head"><div class="head-top"><div class="logo"></div><div class="follow"><span>Follow Us On</span>\
			<i class="facebook"></i><i class="youtube"></i><i class="ins"></i></div></div><div class="head-menu"><ul>\
			<li class="homepage"><a href="index.html"></a></li><li class="about"><a>About WBG</a></li><li>\
			<label>Lottery results history</label><span class="l-m"><a href="w-300.html">WBG 300s Lottery</a>\
			<a href="w-60.html">WBG 60s Lottery</a></span></li><li><a>How To Play</a></li><li><a>Contact Us</a></li>\
			<li id="date" class="date"></li></ul></div></div>';
		var footer = '<div class="footer"><div class="information"><span>More Lottery Information</span><a>Terms & Conditions</a>\
					<a>Sietmap</a><a>Affiliation</a><a href="privacy.html">Privacy Policy</a><a>Security</a><a>Contact us</a>\
					</div><div class="right"><i></i>Copyright &copy; 2016 WBG International CO. ,  Ltd. All Rights Reserved</div></div>';
		
		$('body').prepend(header).append(footer);
	},
	initTime : function(){
		var me = this;
		var initTime = function(){
			$('#date').html(me.transDate());
			setTimeout(initTime,1000);
		};

		initTime();
	},
	initVideo : function(){
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
	},
	
	initNote :function(){
		$('#noteBtn').click(function(){
			var error = 'IT APPEARS THAT YOU HAVE NOT FILLED OUT ALL THE REQUIRED FIELDS. PLEASE CHECK AND RESUBMIT.';
			var success = 'SUBMIT SUCCESSFULLY';
			if(!$('#noteName').val() || !$('#noteEmail').val() || !$('#noteMsg').val()){
				$('.note .tip').html(error).show();
			}else{
				$('.note .tip').html(success).show();
			}
		});
	},
	countDown : function(el,i){
		var me = this;
		var array = el.html().split(me.bc);
		
		var h = parseInt(array[0]),
		    m = parseInt(array[1]),
		    s = parseInt(array[2]);
		if(h <= 0 && m <=0 && s<= 0){
			me.getTime();
			return;
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
			if(e < 10){
				array[i] = '0' + e;
			} 
		});
		
		el.html(array.join(me.bc));
	},

	transDate : function() {
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
	},
	
	getAjax : function(url,func){
		var me = this;
		$.ajax({
			url: me.api.host + url,
			dataType:'jsonp',    
	        jsonp:'callback'
		}).done(function(res){
			func(res);
		});
	},
	
	getTime : function(){
		var me = this;
		var url = me.api.getTime;
		clearInterval(me.t);

		me.getAjax(url,function(res){
			//var res = {"result":{"time":{"3DFC":20654,"WBGFFC":4,"GD11Y":194,"XJSSC":134,"WBGMMC":-1,"WBG":-2,"CQSSC":199,"SD11Y":434,"WBG5FC":224,"JX11Y":74,"CQ11Y":-2,"JXSSC":-2},"now":1460615746},"code":1,"msg":"ok"};
			clearInterval(me.t);
			
			var result = new Array();
			result.push(res.result.time.WBG5FC,res.result.time.WBGFFC);
			
			$(result).each(function(){
				var e = $('.' + me.timeArray[arguments[0]] + ' .nexttime');
				if(arguments[1] == '-1'){
					e.addClass('pause').html('暂停销售');
				}else{
					var m = Math.floor(arguments[1]/60);
					var s = arguments[1]%60;
					
					m < 10 ? m = '0' + m : m;
					s < 10 ? s = '0' + s : s;
					
					e.removeClass('pause').html('00<label>:</label>' + m + '<label>:</label>' + s);
				}
			});
			
			me.t = setInterval(function(){
				$(me.timeArray).each(function(i,e){
					var e = $('.' + arguments[1]).find('.nexttime');
					if(!e.hasClass('pause')){
						me.countDown(e,arguments[0]);
					}
				});
			},1000);
		});
	},

	getIssue : function(lt,el){
		var me = this;
		var url = me.api.getIssue + '?lottery=' + lt + '&_=' + new Date().getTime();
		me.getAjax(url,function(res){
			//var res = {"result":{"lottery":"WBG5FC","second":209,"issue":"20160414-176","state":0,"next":[{"issue":"20160414-176","time":"2016-04-14 14:34:30"},{"issue":"20160414-177","time":"2016-04-14 14:39:30"},{"issue":"20160414-178","time":"2016-04-14 14:44:30"},{"issue":"20160414-179","time":"2016-04-14 14:49:30"},{"issue":"20160414-180","time":"2016-04-14 14:54:30"},{"issue":"20160414-181","time":"2016-04-14 14:59:30"},{"issue":"20160414-182","time":"2016-04-14 15:04:30"},{"issue":"20160414-183","time":"2016-04-14 15:09:30"},{"issue":"20160414-184","time":"2016-04-14 15:14:30"},{"issue":"20160414-185","time":"2016-04-14 15:19:30"},{"issue":"20160414-186","time":"2016-04-14 15:24:30"},{"issue":"20160414-187","time":"2016-04-14 15:29:30"},{"issue":"20160414-188","time":"2016-04-14 15:34:30"},{"issue":"20160414-189","time":"2016-04-14 15:39:30"},{"issue":"20160414-190","time":"2016-04-14 15:44:30"},{"issue":"20160414-191","time":"2016-04-14 15:49:30"},{"issue":"20160414-192","time":"2016-04-14 15:54:30"},{"issue":"20160414-193","time":"2016-04-14 15:59:30"},{"issue":"20160414-194","time":"2016-04-14 16:04:30"},{"issue":"20160414-195","time":"2016-04-14 16:09:30"},{"issue":"20160414-196","time":"2016-04-14 16:14:30"},{"issue":"20160414-197","time":"2016-04-14 16:19:30"},{"issue":"20160414-198","time":"2016-04-14 16:24:30"},{"issue":"20160414-199","time":"2016-04-14 16:29:30"},{"issue":"20160414-200","time":"2016-04-14 16:34:30"},{"issue":"20160414-201","time":"2016-04-14 16:39:30"},{"issue":"20160414-202","time":"2016-04-14 16:44:30"},{"issue":"20160414-203","time":"2016-04-14 16:49:30"},{"issue":"20160414-204","time":"2016-04-14 16:54:30"},{"issue":"20160414-205","time":"2016-04-14 16:59:30"},{"issue":"20160414-206","time":"2016-04-14 17:04:30"},{"issue":"20160414-207","time":"2016-04-14 17:09:30"},{"issue":"20160414-208","time":"2016-04-14 17:14:30"},{"issue":"20160414-209","time":"2016-04-14 17:19:30"},{"issue":"20160414-210","time":"2016-04-14 17:24:30"},{"issue":"20160414-211","time":"2016-04-14 17:29:30"},{"issue":"20160414-212","time":"2016-04-14 17:34:30"},{"issue":"20160414-213","time":"2016-04-14 17:39:30"},{"issue":"20160414-214","time":"2016-04-14 17:44:30"},{"issue":"20160414-215","time":"2016-04-14 17:49:30"},{"issue":"20160414-216","time":"2016-04-14 17:54:30"},{"issue":"20160414-217","time":"2016-04-14 17:59:30"},{"issue":"20160414-218","time":"2016-04-14 18:04:30"},{"issue":"20160414-219","time":"2016-04-14 18:09:30"},{"issue":"20160414-220","time":"2016-04-14 18:14:30"},{"issue":"20160414-221","time":"2016-04-14 18:19:30"},{"issue":"20160414-222","time":"2016-04-14 18:24:30"},{"issue":"20160414-223","time":"2016-04-14 18:29:30"},{"issue":"20160414-224","time":"2016-04-14 18:34:30"},{"issue":"20160414-225","time":"2016-04-14 18:39:30"},{"issue":"20160414-226","time":"2016-04-14 18:44:30"},{"issue":"20160414-227","time":"2016-04-14 18:49:30"},{"issue":"20160414-228","time":"2016-04-14 18:54:30"},{"issue":"20160414-229","time":"2016-04-14 18:59:30"},{"issue":"20160414-230","time":"2016-04-14 19:04:30"},{"issue":"20160414-231","time":"2016-04-14 19:09:30"},{"issue":"20160414-232","time":"2016-04-14 19:14:30"},{"issue":"20160414-233","time":"2016-04-14 19:19:30"},{"issue":"20160414-234","time":"2016-04-14 19:24:30"},{"issue":"20160414-235","time":"2016-04-14 19:29:30"},{"issue":"20160414-236","time":"2016-04-14 19:34:30"},{"issue":"20160414-237","time":"2016-04-14 19:39:30"},{"issue":"20160414-238","time":"2016-04-14 19:44:30"},{"issue":"20160414-239","time":"2016-04-14 19:49:30"},{"issue":"20160414-240","time":"2016-04-14 19:54:30"},{"issue":"20160414-241","time":"2016-04-14 19:59:30"},{"issue":"20160414-242","time":"2016-04-14 20:04:30"},{"issue":"20160414-243","time":"2016-04-14 20:09:30"},{"issue":"20160414-244","time":"2016-04-14 20:14:30"},{"issue":"20160414-245","time":"2016-04-14 20:19:30"},{"issue":"20160414-246","time":"2016-04-14 20:24:30"},{"issue":"20160414-247","time":"2016-04-14 20:29:30"},{"issue":"20160414-248","time":"2016-04-14 20:34:30"},{"issue":"20160414-249","time":"2016-04-14 20:39:30"},{"issue":"20160414-250","time":"2016-04-14 20:44:30"},{"issue":"20160414-251","time":"2016-04-14 20:49:30"},{"issue":"20160414-252","time":"2016-04-14 20:54:30"},{"issue":"20160414-253","time":"2016-04-14 20:59:30"},{"issue":"20160414-254","time":"2016-04-14 21:04:30"},{"issue":"20160414-255","time":"2016-04-14 21:09:30"},{"issue":"20160414-256","time":"2016-04-14 21:14:30"},{"issue":"20160414-257","time":"2016-04-14 21:19:30"},{"issue":"20160414-258","time":"2016-04-14 21:24:30"},{"issue":"20160414-259","time":"2016-04-14 21:29:30"},{"issue":"20160414-260","time":"2016-04-14 21:34:30"},{"issue":"20160414-261","time":"2016-04-14 21:39:30"},{"issue":"20160414-262","time":"2016-04-14 21:44:30"},{"issue":"20160414-263","time":"2016-04-14 21:49:30"},{"issue":"20160414-264","time":"2016-04-14 21:54:30"},{"issue":"20160414-265","time":"2016-04-14 21:59:30"},{"issue":"20160414-266","time":"2016-04-14 22:04:30"},{"issue":"20160414-267","time":"2016-04-14 22:09:30"},{"issue":"20160414-268","time":"2016-04-14 22:14:30"},{"issue":"20160414-269","time":"2016-04-14 22:19:30"},{"issue":"20160414-270","time":"2016-04-14 22:24:30"},{"issue":"20160414-271","time":"2016-04-14 22:29:30"},{"issue":"20160414-272","time":"2016-04-14 22:34:30"},{"issue":"20160414-273","time":"2016-04-14 22:39:30"},{"issue":"20160414-274","time":"2016-04-14 22:44:30"},{"issue":"20160414-275","time":"2016-04-14 22:49:30"},{"issue":"20160414-276","time":"2016-04-14 22:54:30"},{"issue":"20160414-277","time":"2016-04-14 22:59:30"},{"issue":"20160414-278","time":"2016-04-14 23:04:30"},{"issue":"20160414-279","time":"2016-04-14 23:09:30"},{"issue":"20160414-280","time":"2016-04-14 23:14:30"},{"issue":"20160414-281","time":"2016-04-14 23:19:30"},{"issue":"20160414-282","time":"2016-04-14 23:24:30"},{"issue":"20160414-283","time":"2016-04-14 23:29:30"},{"issue":"20160414-284","time":"2016-04-14 23:34:30"},{"issue":"20160414-285","time":"2016-04-14 23:39:30"},{"issue":"20160414-286","time":"2016-04-14 23:44:30"},{"issue":"20160414-287","time":"2016-04-14 23:49:30"},{"issue":"20160414-288","time":"2016-04-14 23:54:30"},{"issue":"20160415-001","time":"2016-04-14 23:59:30"},{"issue":"20160415-002","time":"2016-04-15 00:04:30"},{"issue":"20160415-003","time":"2016-04-15 00:09:30"},{"issue":"20160415-004","time":"2016-04-15 00:14:30"},{"issue":"20160415-005","time":"2016-04-15 00:19:30"},{"issue":"20160415-006","time":"2016-04-15 00:24:30"},{"issue":"20160415-007","time":"2016-04-15 00:29:30"},{"issue":"20160415-008","time":"2016-04-15 00:34:30"},{"issue":"20160415-009","time":"2016-04-15 00:39:30"},{"issue":"20160415-010","time":"2016-04-15 00:44:30"},{"issue":"20160415-011","time":"2016-04-15 00:49:30"},{"issue":"20160415-012","time":"2016-04-15 00:54:30"},{"issue":"20160415-013","time":"2016-04-15 00:59:30"},{"issue":"20160415-014","time":"2016-04-15 01:04:30"},{"issue":"20160415-015","time":"2016-04-15 01:09:30"},{"issue":"20160415-016","time":"2016-04-15 01:14:30"},{"issue":"20160415-017","time":"2016-04-15 01:19:30"},{"issue":"20160415-018","time":"2016-04-15 01:24:30"},{"issue":"20160415-019","time":"2016-04-15 01:29:30"},{"issue":"20160415-020","time":"2016-04-15 01:34:30"},{"issue":"20160415-021","time":"2016-04-15 01:39:30"},{"issue":"20160415-022","time":"2016-04-15 01:44:30"},{"issue":"20160415-023","time":"2016-04-15 01:49:30"},{"issue":"20160415-024","time":"2016-04-15 01:54:30"},{"issue":"20160415-025","time":"2016-04-15 01:59:30"},{"issue":"20160415-026","time":"2016-04-15 02:04:30"},{"issue":"20160415-027","time":"2016-04-15 02:09:30"},{"issue":"20160415-028","time":"2016-04-15 02:14:30"},{"issue":"20160415-029","time":"2016-04-15 02:19:30"},{"issue":"20160415-030","time":"2016-04-15 02:24:30"},{"issue":"20160415-031","time":"2016-04-15 02:29:30"},{"issue":"20160415-032","time":"2016-04-15 02:34:30"},{"issue":"20160415-033","time":"2016-04-15 02:39:30"},{"issue":"20160415-034","time":"2016-04-15 02:44:30"},{"issue":"20160415-035","time":"2016-04-15 02:49:30"},{"issue":"20160415-036","time":"2016-04-15 02:54:30"},{"issue":"20160415-037","time":"2016-04-15 02:59:30"},{"issue":"20160415-038","time":"2016-04-15 03:04:30"},{"issue":"20160415-039","time":"2016-04-15 03:09:30"},{"issue":"20160415-040","time":"2016-04-15 03:14:30"},{"issue":"20160415-041","time":"2016-04-15 03:19:30"},{"issue":"20160415-042","time":"2016-04-15 03:24:30"},{"issue":"20160415-043","time":"2016-04-15 03:29:30"},{"issue":"20160415-044","time":"2016-04-15 03:34:30"},{"issue":"20160415-045","time":"2016-04-15 03:39:30"},{"issue":"20160415-046","time":"2016-04-15 03:44:30"},{"issue":"20160415-047","time":"2016-04-15 03:49:30"},{"issue":"20160415-048","time":"2016-04-15 03:54:30"},{"issue":"20160415-049","time":"2016-04-15 03:59:30"},{"issue":"20160415-050","time":"2016-04-15 04:04:30"},{"issue":"20160415-051","time":"2016-04-15 04:09:30"},{"issue":"20160415-052","time":"2016-04-15 04:14:30"},{"issue":"20160415-053","time":"2016-04-15 04:19:30"},{"issue":"20160415-054","time":"2016-04-15 04:24:30"},{"issue":"20160415-055","time":"2016-04-15 04:29:30"},{"issue":"20160415-056","time":"2016-04-15 04:34:30"},{"issue":"20160415-057","time":"2016-04-15 04:39:30"},{"issue":"20160415-058","time":"2016-04-15 04:44:30"},{"issue":"20160415-059","time":"2016-04-15 04:49:30"},{"issue":"20160415-060","time":"2016-04-15 04:54:30"},{"issue":"20160415-061","time":"2016-04-15 04:59:30"},{"issue":"20160415-062","time":"2016-04-15 05:04:30"},{"issue":"20160415-063","time":"2016-04-15 05:09:30"},{"issue":"20160415-064","time":"2016-04-15 05:14:30"},{"issue":"20160415-065","time":"2016-04-15 05:19:30"},{"issue":"20160415-066","time":"2016-04-15 05:24:30"},{"issue":"20160415-067","time":"2016-04-15 05:29:30"},{"issue":"20160415-068","time":"2016-04-15 05:34:30"},{"issue":"20160415-069","time":"2016-04-15 05:39:30"},{"issue":"20160415-070","time":"2016-04-15 05:44:30"},{"issue":"20160415-071","time":"2016-04-15 05:49:30"},{"issue":"20160415-072","time":"2016-04-15 05:54:30"},{"issue":"20160415-073","time":"2016-04-15 05:59:30"},{"issue":"20160415-074","time":"2016-04-15 06:04:30"},{"issue":"20160415-075","time":"2016-04-15 06:09:30"},{"issue":"20160415-076","time":"2016-04-15 06:14:30"},{"issue":"20160415-077","time":"2016-04-15 06:19:30"},{"issue":"20160415-078","time":"2016-04-15 06:24:30"},{"issue":"20160415-079","time":"2016-04-15 06:29:30"},{"issue":"20160415-080","time":"2016-04-15 06:34:30"},{"issue":"20160415-081","time":"2016-04-15 06:39:30"},{"issue":"20160415-082","time":"2016-04-15 06:44:30"},{"issue":"20160415-083","time":"2016-04-15 06:49:30"},{"issue":"20160415-084","time":"2016-04-15 06:54:30"},{"issue":"20160415-085","time":"2016-04-15 06:59:30"},{"issue":"20160415-086","time":"2016-04-15 07:04:30"},{"issue":"20160415-087","time":"2016-04-15 07:09:30"},{"issue":"20160415-088","time":"2016-04-15 07:14:30"},{"issue":"20160415-089","time":"2016-04-15 07:19:30"},{"issue":"20160415-090","time":"2016-04-15 07:24:30"},{"issue":"20160415-091","time":"2016-04-15 07:29:30"},{"issue":"20160415-092","time":"2016-04-15 07:34:30"},{"issue":"20160415-093","time":"2016-04-15 07:39:30"},{"issue":"20160415-094","time":"2016-04-15 07:44:30"},{"issue":"20160415-095","time":"2016-04-15 07:49:30"},{"issue":"20160415-096","time":"2016-04-15 07:54:30"},{"issue":"20160415-097","time":"2016-04-15 07:59:30"},{"issue":"20160415-098","time":"2016-04-15 08:04:30"},{"issue":"20160415-099","time":"2016-04-15 08:09:30"},{"issue":"20160415-100","time":"2016-04-15 08:14:30"},{"issue":"20160415-101","time":"2016-04-15 08:19:30"},{"issue":"20160415-102","time":"2016-04-15 08:24:30"},{"issue":"20160415-103","time":"2016-04-15 08:29:30"},{"issue":"20160415-104","time":"2016-04-15 08:34:30"},{"issue":"20160415-105","time":"2016-04-15 08:39:30"},{"issue":"20160415-106","time":"2016-04-15 08:44:30"},{"issue":"20160415-107","time":"2016-04-15 08:49:30"},{"issue":"20160415-108","time":"2016-04-15 08:54:30"},{"issue":"20160415-109","time":"2016-04-15 08:59:30"},{"issue":"20160415-110","time":"2016-04-15 09:04:30"},{"issue":"20160415-111","time":"2016-04-15 09:09:30"},{"issue":"20160415-112","time":"2016-04-15 09:14:30"},{"issue":"20160415-113","time":"2016-04-15 09:19:30"},{"issue":"20160415-114","time":"2016-04-15 09:24:30"},{"issue":"20160415-115","time":"2016-04-15 09:29:30"},{"issue":"20160415-116","time":"2016-04-15 09:34:30"},{"issue":"20160415-117","time":"2016-04-15 09:39:30"},{"issue":"20160415-118","time":"2016-04-15 09:44:30"},{"issue":"20160415-119","time":"2016-04-15 09:49:30"},{"issue":"20160415-120","time":"2016-04-15 09:54:30"},{"issue":"20160415-121","time":"2016-04-15 09:59:30"},{"issue":"20160415-122","time":"2016-04-15 10:04:30"},{"issue":"20160415-123","time":"2016-04-15 10:09:30"},{"issue":"20160415-124","time":"2016-04-15 10:14:30"},{"issue":"20160415-125","time":"2016-04-15 10:19:30"},{"issue":"20160415-126","time":"2016-04-15 10:24:30"},{"issue":"20160415-127","time":"2016-04-15 10:29:30"},{"issue":"20160415-128","time":"2016-04-15 10:34:30"},{"issue":"20160415-129","time":"2016-04-15 10:39:30"},{"issue":"20160415-130","time":"2016-04-15 10:44:30"},{"issue":"20160415-131","time":"2016-04-15 10:49:30"},{"issue":"20160415-132","time":"2016-04-15 10:54:30"},{"issue":"20160415-133","time":"2016-04-15 10:59:30"},{"issue":"20160415-134","time":"2016-04-15 11:04:30"},{"issue":"20160415-135","time":"2016-04-15 11:09:30"},{"issue":"20160415-136","time":"2016-04-15 11:14:30"},{"issue":"20160415-137","time":"2016-04-15 11:19:30"},{"issue":"20160415-138","time":"2016-04-15 11:24:30"},{"issue":"20160415-139","time":"2016-04-15 11:29:30"},{"issue":"20160415-140","time":"2016-04-15 11:34:30"},{"issue":"20160415-141","time":"2016-04-15 11:39:30"},{"issue":"20160415-142","time":"2016-04-15 11:44:30"},{"issue":"20160415-143","time":"2016-04-15 11:49:30"},{"issue":"20160415-144","time":"2016-04-15 11:54:30"},{"issue":"20160415-145","time":"2016-04-15 11:59:30"},{"issue":"20160415-146","time":"2016-04-15 12:04:30"},{"issue":"20160415-147","time":"2016-04-15 12:09:30"},{"issue":"20160415-148","time":"2016-04-15 12:14:30"},{"issue":"20160415-149","time":"2016-04-15 12:19:30"},{"issue":"20160415-150","time":"2016-04-15 12:24:30"},{"issue":"20160415-151","time":"2016-04-15 12:29:30"},{"issue":"20160415-152","time":"2016-04-15 12:34:30"},{"issue":"20160415-153","time":"2016-04-15 12:39:30"},{"issue":"20160415-154","time":"2016-04-15 12:44:30"},{"issue":"20160415-155","time":"2016-04-15 12:49:30"},{"issue":"20160415-156","time":"2016-04-15 12:54:30"},{"issue":"20160415-157","time":"2016-04-15 12:59:30"},{"issue":"20160415-158","time":"2016-04-15 13:04:30"},{"issue":"20160415-159","time":"2016-04-15 13:09:30"},{"issue":"20160415-160","time":"2016-04-15 13:14:30"},{"issue":"20160415-161","time":"2016-04-15 13:19:30"},{"issue":"20160415-162","time":"2016-04-15 13:24:30"},{"issue":"20160415-163","time":"2016-04-15 13:29:30"},{"issue":"20160415-164","time":"2016-04-15 13:34:30"},{"issue":"20160415-165","time":"2016-04-15 13:39:30"},{"issue":"20160415-166","time":"2016-04-15 13:44:30"},{"issue":"20160415-167","time":"2016-04-15 13:49:30"},{"issue":"20160415-168","time":"2016-04-15 13:54:30"},{"issue":"20160415-169","time":"2016-04-15 13:59:30"},{"issue":"20160415-170","time":"2016-04-15 14:04:30"},{"issue":"20160415-171","time":"2016-04-15 14:09:30"},{"issue":"20160415-172","time":"2016-04-15 14:14:30"},{"issue":"20160415-173","time":"2016-04-15 14:19:30"},{"issue":"20160415-174","time":"2016-04-15 14:24:30"},{"issue":"20160415-175","time":"2016-04-15 14:29:30"},{"issue":"20160415-176","time":"2016-04-15 14:34:30"},{"issue":"20160415-177","time":"2016-04-15 14:39:30"},{"issue":"20160415-178","time":"2016-04-15 14:44:30"},{"issue":"20160415-179","time":"2016-04-15 14:49:30"},{"issue":"20160415-180","time":"2016-04-15 14:54:30"},{"issue":"20160415-181","time":"2016-04-15 14:59:30"},{"issue":"20160415-182","time":"2016-04-15 15:04:30"},{"issue":"20160415-183","time":"2016-04-15 15:09:30"},{"issue":"20160415-184","time":"2016-04-15 15:14:30"},{"issue":"20160415-185","time":"2016-04-15 15:19:30"},{"issue":"20160415-186","time":"2016-04-15 15:24:30"},{"issue":"20160415-187","time":"2016-04-15 15:29:30"},{"issue":"20160415-188","time":"2016-04-15 15:34:30"},{"issue":"20160415-189","time":"2016-04-15 15:39:30"},{"issue":"20160415-190","time":"2016-04-15 15:44:30"},{"issue":"20160415-191","time":"2016-04-15 15:49:30"},{"issue":"20160415-192","time":"2016-04-15 15:54:30"},{"issue":"20160415-193","time":"2016-04-15 15:59:30"},{"issue":"20160415-194","time":"2016-04-15 16:04:30"},{"issue":"20160415-195","time":"2016-04-15 16:09:30"},{"issue":"20160415-196","time":"2016-04-15 16:14:30"},{"issue":"20160415-197","time":"2016-04-15 16:19:30"},{"issue":"20160415-198","time":"2016-04-15 16:24:30"},{"issue":"20160415-199","time":"2016-04-15 16:29:30"}],"lastFive":[{"code":"2,5,4,5,3","issue":"20160414-175"},{"code":"2,3,4,9,9","issue":"20160414-174"},{"code":"0,9,3,2,5","issue":"20160414-173"},{"code":"0,0,1,2,3","issue":"20160414-172"},{"code":"3,7,8,0,3","issue":"20160414-171"}]},"code":1,"msg":"ok"};
			var data = res.result.lastFive;
			el.find('.dataNo label').html(data[0].issue);
			
			$(data[0].code.split(',')).each(function(){
				el.find('.num span').eq(arguments[0]).html(arguments[1]);
			});
			
			$(data).each(function(){
				var $h = $('<li><label>' + arguments[1].issue + '</label></li>');
				var code = arguments[1].code.split(',');

				$(code).each(function(){
					$h.append('<span>' + arguments[1] + '</span>');
				});
				el.find('.history .list').append($h);
			});
		});
	},
	initHistory : function(){
		var date = new Date();
		$('#datepick').val(date.pattern('yyyy/MM/dd'));
			
		$('#datepick').datetimepicker({
			lang:'ch',
			timepicker:false,
			format:"Y/m/d"
		});

	},
	getHistory : function(lt){
		var date = $('#datepick').val();
		var me = this;
		var url = me.api.getHistory + '?lottery=' + lt+ '&startTime=' + date + '&endTime=' + date + '&issuecount=20&_=' + new Date().getTime();

		me.getAjax(url,function(res){
			//var res = {"result":{"data":[{"code":"0,0,5,8,3","issue":"20160414-146"},{"code":"5,7,1,5,3","issue":"20160414-147"},{"code":"1,4,1,0,6","issue":"20160414-148"},{"code":"2,8,4,4,4","issue":"20160414-149"},{"code":"0,8,7,2,1","issue":"20160414-150"},{"code":"8,5,4,7,2","issue":"20160414-151"},{"code":"8,4,2,1,0","issue":"20160414-152"},{"code":"2,7,8,9,5","issue":"20160414-153"},{"code":"0,3,9,3,6","issue":"20160414-154"},{"code":"8,7,1,9,4","issue":"20160414-155"},{"code":"1,9,3,1,8","issue":"20160414-156"},{"code":"6,5,5,6,2","issue":"20160414-157"},{"code":"9,2,9,0,7","issue":"20160414-158"},{"code":"9,1,0,9,3","issue":"20160414-159"},{"code":"7,9,3,0,9","issue":"20160414-160"},{"code":"4,1,6,1,7","issue":"20160414-161"},{"code":"5,8,1,1,4","issue":"20160414-162"},{"code":"9,1,7,9,5","issue":"20160414-163"},{"code":"1,0,6,5,7","issue":"20160414-164"},{"code":"0,6,7,5,1","issue":"20160414-165"},{"code":"0,3,8,8,9","issue":"20160414-166"},{"code":"3,4,6,6,5","issue":"20160414-167"},{"code":"7,2,2,7,8","issue":"20160414-168"},{"code":"6,8,3,3,3","issue":"20160414-169"},{"code":"7,6,9,3,3","issue":"20160414-170"},{"code":"3,7,8,0,3","issue":"20160414-171"},{"code":"0,0,1,2,3","issue":"20160414-172"},{"code":"0,9,3,2,5","issue":"20160414-173"},{"code":"2,3,4,9,9","issue":"20160414-174"},{"code":"2,5,4,5,3","issue":"20160414-175"}],"lottery":"WBG5FC"},"code":1,"msg":"ok"};
			var data = res.result.data;
			if(data.length > 0){
				$(data).each(function(){
					var $h = $('<li><label class="num">No.' + arguments[1].issue + '</label><label class="result">Draw result</label></li>');
					var code = arguments[1].code.split(',');
					$(code).each(function(){
						$h.append('<span>' + arguments[1] + '</span>');
					});

					$('.morelist .list ul').append($h);
				});
			}else{
				$('.morelist .list ul').html('<li class="nodata">暂无数据</li>');
			}
			
		});
	}
};

(function(){
	Common.init();
})();
