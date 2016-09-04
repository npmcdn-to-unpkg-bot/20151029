var Line = Line || {};

Line = {
	callBack : null,
	bindError : false,
	speedFirst : false,
	startTimeArray : [],
	endTimeArray : [],
	
	lineArray : ["http://www.mc188.com", "http://www.moochen.com", "http://www.mc188.info", 
                "http://www.mc188.cc", "http://www.mc188.org" , "http://www.moochen.cc", 
				"http://www.moochen.net", "http://www.moochen.org", "http://mcplay888.com", 
				"http://mcgame8.net", "http://mcgame88.net", "http://mochen8.net"],
	
//	lineArray : ["http://www.sobet.tk"],
//	lineArray : ["http://debug-mobile-mc.sobet.tk"],
	errorLineArray : [],
	
	startSpeedTest : function(){
		//var tip = {content:"摩臣正在为您选取最佳线路",autoClose:false,width:180};
		//Q.showDialog(tip);
		console.log('开始选择线路')
		plus.nativeUI.showWaiting();
		
		var me = this;
		arguments[0] && (me.callBack = arguments[0]);
		
		$(me.lineArray).each(function(){
			if(Login.host){
				return false;
			}
			var index = arguments[0];
			var line = arguments[1];
			
			var date = (new Date()).getTime();
			me.startTimeArray.push(date)
			me.endTimeArray.push(date);
			
			var setting = {
				type:'get',//HTTP请求类型
				timeout:15000,
				success:function(data){
					plus.nativeUI.closeWaiting();
					console.log('success:' + line);
					me.endTimeArray[index] = (new Date()).getTime();
					
					if(me.speedFirst){
						return;
					}
					me.speedFirst = true;
					//第一个返回的链接
					Login.host = line;
					plus.storage.setItem('host',line);
					
					console.log('选取的线路：' + line)
					var content =  "摩臣为您选取的最佳线路是<br>" + line;
					var tip = {content:content,duration:2000,width:200};
					//Q.showDialog(tip);
					
					if(typeof me.callBack == 'function'){
						var fn = me.callBack;
						fn();
					}
				},
				error : function(){
					console.log('error:' + line);
					me.errorLineArray.push(line);
					if(me.errorLineArray.length == me.lineArray.length){
						plus.nativeUI.closeWaiting();
						var content =  "当前没有适合您的线路";
						var tip = {content:content,duration:3000,width:240,autoClose:true};
						Q.showDialog(tip);
						me.startTimeArray = [];
						me.endTimeArray = [];
						me.errorLineArray = [];
						Login.host = null;
						plus.storage.setItem('host','');
					}
				}
			};
			
			var url = line + '?_=' + date;
	    	mui.ajax(url,setting);
		})
	},
	
	refresh : function(){
		var me = this;
		me.startTimeArray = [];
		me.endTimeArray = [];
		me.errorLineArray = [];
		Login.host = null;
		plus.storage.setItem('host','');
	}
}
