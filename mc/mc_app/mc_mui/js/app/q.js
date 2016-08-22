var Q = Q || {};

Q = {
	percentFormat: function(num) {
	    var dotnum = 2;
	    if(arguments.length > 1){
	    	dotnum = arguments[1];
	    }
	    
	    if(num == 0 || parseInt(100 * num, 10).toFixed(dotnum) == Number(100 * num).toFixed(dotnum)){
	    	return parseInt(num * 100, 10);
	    }
	    
	    return parseFloat(num * 100).toFixed((dotnum == 2 ? 1 : dotnum));
	},
	getMethodName: function(e, t) {
        if (null  === e || "" === e){
            return "-";
        }
        var a = e.split("_");
        var m = a[1] + '_' + a[2];
        var ma = LotteryClass[t].ltMethod[a[0]][m];
        if (ma!=undefined) {
        	 return ma.name;
		}else {
			return "-";
		}
       
    },
    getLtName: function(lt) {
        return LotteryClass.names[lt];
    },
    PkHzNum: {
        q2: ["3_19", "4_18", "5_17", "6_16", "7_15", "8_14", "9_13", "10_12", "11"],
        q3: ["6_27", "7_26", "8_25", "9_24", "10_23", "11_22", "12_21", "13_20", "14_19", "15_18", "16_17"]
    },
    
    PkNum: {
    	hz_q2:['3_19','4_18','5_17','6_16','7_15','8_14','9_13','10_12','11'],
    	hz_q3:['6_27','7_26','8_25','9_24','10_23','11_22','12_21','13_20','14_19','15_18','16_17'],
      	dx_q2:['da','xiao'],
      	ds_q2:['dan','shuang']
    },
      
    PKDXDS : {
    	DX : ['da','xiao'],
    	DS : ['dan','shuang']
    },
      
    PkOddsArr : ['hz_hz_q2','hz_hz_q3','dx_dx_q2','ds_ds_q2'],
    
    showDialog : function(d){
		var me = this;
		
		var defaults = {
        	type : 'tip',
            showMask : true,
            autoClose : true,
          	duration : 1500
       	};
        
        d = $.extend(defaults, d);
        
		var target = null;
		
		if($('#mask').length == 0){
			$('body').append('<div id="mask"></div>');
		}
		if($('#tip').length == 0){
			$('body').append('<div id="tip"></div>');
		}
		
		var mask = $('#mask');
		var tip = $('#tip');
		
		if (d.type == 'tip') {
			target = tip;
			
			if(d.showMask){
				mask.removeClass().addClass('tip-mask');
			}	
			tip.html(d.content).show();
			
			if(d.autoClose){
				setTimeout(function(){
					me.closeTip();
				},d.duration);
			}
		}
		
		var cw = plus.webview.currentWebview();
		var t = parseInt(cw.getStyle().top);
		if(target){
			var h,w;
			
			if(d.width){
				target.width(d.width);
			}
			
			w = target.width();
			h = target.height() + t;
			
			target.css({
				"margin-top":'-' + h/2 + 'px',
				"margin-left" : '-' + w/2 + 'px',
			});
		}
	},
	
	closeTip : function(){
		$('#tip').hide().css('width','auto');
	}
}
Math.factorial = function(e) {
    return 0 >= e ? 1 : e * Math.factorial(e - 1)
};
Math.combination = function(e, t) {
    var a = Math.factorial;
    return t > e ? 0 : a(e) / (a(t) * a(e - t))
};
Math.intersection = function(e, t) {
    return e.filter(function(e) {
        return -1 != t.indexOf(e)
    })
};
Math.union = function(e, t) {
    return e.concat(t).filter(function(e, t, a) {
        return a.indexOf(e) === t
    })
};
Math.difference = function(e, t) {
    return e.filter(function(e) {
        return -1 === t.indexOf(e)
    })
};
Math.nzn = function(e, t) {
    for (var a = 1, n = 0; t > n; n++)
        a *= (e - n) / (n + 1);
    return a
};
Math.precision = function(e) {
    var e = (e + "").split(".")[1];
    return e ? e.length : 0
};