Date.prototype.pattern=function(fmt) {
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
    var o = {           
    	"d+" : this.getDate(), //日           
    	"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    	"H+" : this.getHours(), //小时           
    	"m+" : this.getMinutes(), //分           
    	"s+" : this.getSeconds(), //秒           
    	"q+" : Math.floor((this.getMonth()+3)/3), //季度           
    	"S" : this.getMilliseconds() //毫秒           
    };
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }           
    }
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }
    if(/(M)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, month[this.getMonth()+1]);           
    }
    if(/(Week)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, week[this.getDay()]);           
    }
    this.getHours() > 12 ? fmt += " AM" : fmt += " PM";
    return fmt;           
}