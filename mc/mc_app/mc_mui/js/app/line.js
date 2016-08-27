var Line = Line || {};

Line = {
	callBack : null,
	bindError : false,
	speedFirst : false,
	startTimeArray : [],
	endTimeArray : [],
	
	lineArray : ["http://www.mc188.com", "http://www.mc188.info", "http://www.mc188.org", 
				"http://www.mc188.cc", "http://www.moochen.cc", "http://www.moochen.com", 
				"http://www.moochen.net", "http://www.moochen.org", "http://mcplay888.com", 
				"http://mcgame8.net", "http://mcgame88.net", "http://mochen8.net"],
	
//	lineArray : ["http://www.sobet.tk"],
	
	startSpeedTest : function(){
		var tip = {content:"摩臣正在为您选取最佳线路",autoClose:false,width:180};
		Q.showDialog(tip);
		
		var me = this;
		arguments[0] && (me.callBack = arguments[0]);
		
		$(me.lineArray).each(function(){
			var index = arguments[0];
			var line = arguments[1];
			
			var date = (new Date()).getTime();
			me.startTimeArray.push(date)
			me.endTimeArray.push(date);
			
			var setting = {
				type:'get',//HTTP请求类型              
				success:function(data){
					console.log('success:' + line);
					me.endTimeArray[index] = (new Date()).getTime();
					
					if(me.speedFirst){
						return;
					}
					me.speedFirst = true;
					//第一个返回的链接
					plus.storage.setItem('host',line);
					
					console.log('选取的线路：' + line)
					var content =  "摩臣为您选取的最佳线路是<br>" + line;
					var tip = {content:content,duration:2000,width:200};
					Q.showDialog(tip);
					
					if(typeof me.callBack == 'function'){
						var fn = me.callBack;
						fn();
					}
				},
				error : function(){
					console.log('error:' + line);
				}
			};
			
			var url = line + '?_=' + date;
			console.log(url);
	    	mui.ajax(url,setting);
		})
	},
	
	refresh : function(){
		var me = this;
		me.startTimeArray = [];
		me.endTimeArray = [];
	}
}
