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
	skipTime: 0,
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
		if((h <= 0 && m <=0 && s<= 0) || me.skipTime > 6){
			me.skipTime = 0;
			me.getTime();
			clearInterval(me.t);
			me.getIssue('WBG5FC',$('.w300'));
			me.getIssue('WBGFFC',$('.w60'));
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
		
		me.skipTime += 1; 
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
			var data = res.result.lastFive;
			
			$(data[0].code.split(',')).each(function(){
				el.find('.num span').eq(arguments[0]).html(arguments[1]);
			});
			
			if(data[0].issue != el.find('.dateNo label').html()){
				el.find('.history .list li').remove();
				el.find('.dateNo label').html(data[0].issue);
				$(data).each(function(){
					var $h = $('<li><label>' + arguments[1].issue + '</label></li>');
					var code = arguments[1].code.split(',');

					$(code).each(function(){
						$h.append('<span>' + arguments[1] + '</span>');
					});
					el.find('.history .list').append($h);
				});
			}
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
