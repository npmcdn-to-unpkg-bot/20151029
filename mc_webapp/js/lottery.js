var Lottery = Lottery || {};
Lottery = {
    lt: "",
    cls: "",
    method: "",
    methods: null,
    countData: null, //确认号码时生成的数据
    orders: null, //提交注单时提交的注单数据
    orderlist : {}, //提交注单页返回购彩大厅时保存的数据
    
    init: function() {
        var me = this;
        me.initTab(LotteryClass[me.lt]);
        
        //取期号 倒计时
        me.updateIssue();
        
    },
    initTab: function(obj) {
        var me = this;
        var el = $("#lottery");
        var tabDiv = el.find(".tabDiv");
        var ltTab = obj.ltTab;
        var ltMethod = obj.ltMethod;
        var tpl = '';
        
        for (var t in ltTab){
        	tpl += '<div class="tab">';
        	tpl += '<div class="tabName" data-type="' + t + '"><span>' + ltTab[t] + '</span></div>';
        	tpl += '<div class="subTab">';
        	
        	for(var m in ltMethod[t]){
        		tpl += '<span data-type="' + m + '">' + ltMethod[t][m].desc + '</span>';
        	}
        	
        	tpl += '</div></div></div>';
        }
        
        tabDiv.find('.scroller').html(tpl);
		
		$('.tabSelect').off('touchend').on('touchend',function(){
			tabDiv.toggleClass('tabShow');
        });
		
		tabDiv.off("tap").on("tap", function(evt) {
        	evt.preventDefault();
        	var _this = evt.target;
        	
        	if(_this.nodeName == 'SPAN'){
	        	$('.tabOn').removeClass('tabOn');
	        	$(_this).addClass('tabOn');
	        	
	        	var tab = $(_this).parent().prev();
	            var tabSelect = tab.find('span').html() + '&nbsp;-&nbsp;' + $(_this).html();
	        	$('.tabSelect').find('label').html(tabSelect);
	        	tabDiv.removeClass('tabShow');
	        	
	        	var m0 = tab.attr('data-type');
	        	var m1 = $(_this).attr('data-type');
	        	
	        	me.method = m0 + '_' + m1;
	        	me.methods = me.method.split('_');
	        	
	        	var numObj = ltMethod[m0][m1].num;
	        	me.renderNum(numObj);
	        	
	        	me.resetCount();
	        	
	        	me.updateOdds();
	        	
	        	//刷新 wrapper插件
	    		Common.initWrapper();
	    	}
        });
        
		tabDiv.find('.subTab span').eq(0).trigger('tap');
	
    },
    
    renderNum : function(obj){
    	var me = this;
    	var el = $('#lottery .number .scroller');
    	
    	var tits = obj.split('|')[0].split(',');//号码盘标题  万位-千位-百位
    	var nums = obj.split('|')[1];
    	
    	var tpl = '';
    	
    	if((/rx2|rx3|rx4/i).test(me.methods[0]) && me.method.indexOf('zx_fs') == -1){
    		tpl += '<dl class="dl-pos"><dt>选择位置</dt><dd>\
            	<i data-pos="1">万</i>\
            	<i data-pos="2">千</i>\
            	<i data-pos="3">百</i>\
            	<i data-pos="4">十</i>\
            	<i data-pos="5">个</i></dd></dl>';
    	}
    	
    	for(var i=0;i<tits.length;i++){
    		tpl += '<dl><dt>' + tits[i]+ '</dt>';
			tpl += '<dd>' + me.renderCodes(nums) + '</dd>';
			tpl += '</dl>';
    	}
    	el.html(tpl);
    	
    	el.off("tap").on("tap", function(evt) {
    		me.numHandler(evt)
    	});
    },
    renderCodes: function(n) {
        var me = this;
        var tpl = '';
        var txt = ["大", "小", "单", "双","龙", "虎"];
        var m0 = ["dxds", "qw", "dx", "ds", "lh"];
        
        n = n.split("-");
        m = me.methods;
        
        for (var i = parseInt(n[0]); i <= parseInt(n[1]); i++){
        	if(m0.indexOf(m[0]) != -1){
        		tpl += '<i>' + txt[i] + '</i>';
        	}else{
        		if((me.cls == "11y" ||  (me.cls == "pk10" && m[0] != "hz")) && (i < 10)){
        			tpl += '<i data-code="0' + i + '">0' + i + '</i>';
        		}else{
        			tpl += '<i data-code="' + i + '">' + i + '</i>';
        		}
        	}
        }
        return tpl;
    },
    
    resetCount : function(){
    	var me = this;

		$('#lottery .number i.on').removeClass('on');
		
    	var count = $('#lottery .count');
    	
    	count.find('.mode select').val('2');
    	count.find('.times input').val('1');
    	count.find('.totalMoney em').html('0');
    	count.find('.totalCount').html('0');
    	count.find('.totalTimes').html('1');
    	count.find('.confirm button').addClass('disabled');
    },
    
    numHandler : function(evt){
    	var me = this;
    	evt.preventDefault();
    	evt.stopPropagation();
    	
    	var _this = evt.target;
    	if(_this.nodeName == 'I'){
    		
            $(_this).toggleClass("on");
    		
            $(_this).addClass("ball").one("webkitAnimationEnd", function() {
                $(this).removeClass("ball");
            });
    		
            //pk10和值不同 赔率不同
            if(me.cls == 'pk10' && me.methods[0] == 'hz'){
            	me.updateOdds();
            }
            
            me.getStack();
            
            me.calcMoney();
    	}
    },
    
    getStack : function(){
    	var me = this;
    	var m = me.methods;
    	var n = 1;
    	var len = 0;
    	var arr = me.getCode();
    	
    	var pos = $("#lottery .dl-pos i.on").length; //选择位置 - 万 千 百 十 个
    	var rxNum = parseInt(m[0].charAt(m[0].length - 1)); //任选玩法  2 3 4
    	
    	if(m[1] === 'zx'){
    		switch (m[2]) {
            	case "fs": //复式
            	case "zh": //组合
            	case "hfs": //后复式
            	case "qfs": //前复式
            		var w = 0; //万位
            		var q = 0; //千位
            		var b = 0; //百位
            		var s = 0; //十位
            		var g = 0; //个位
	                for (var i = 0; i < arr.length; i++) {
	                    var _len = arr[i].length;
	                    n = n * parseInt(_len, 10);
	                }
	                if(m[2] === 'zh'){ //组合
	                	n = n * arr.length;
	                }
	                //任选二复式 任选三复式
	                if("rx2" === m[0] || "rx3" === m[0] || "rx4" === m[0]){
	                	w = arr[0].length;
	                    q = arr[1].length;
	                    b = arr[2].length;
	                    s = arr[3].length;
	                    g = arr[4].length;
	                }
	                if("rx2" === m[0]){
	                	n = w * (q + b + s + g) + q * b + (q + b) * (s + g) + s * g;
	                }
	                if("rx3" === m[0]){
	                	n = (w * q + w * b + q * b) * (s + g) + w * q * b + (w + q + b) * s * g;
	                }
	                if("rx4" === m[0]){
	                	n = w * q * b * s + w * q * b * g + w * q * s * g + w * b * s * g + q * b * s * g;
	                }
	                break;
	            case "hz": //和值
	            case "hhz"://后和值
	            case "qhz"://前和值
	                var data = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
	                var data2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	                n = 0;
	                for (var i = 0; i < arr[0].length; i++) {
	                    var a = arr[0][i];
	                    if(m[2] === 'hz' && "rx2" !== m[0]){
	                    	n += data[a];
	                    }else{
	                    	n += data2[a];
	                    }
	                }
	                if("rx2" === m[0] || "rx3" === m[0]){
	                	n = n * Math.combination(pos,rxNum);
	                }
	                break;
	            default:
	            	break;
    		}
    	}else if ("zux" === m[1]) {
    		var a = arr[0] || [];
            var b = arr[1] || [];
            switch (m[2]) {
            	case "z120": //组120
            		n = Math.combination(a.length, 5);
            		break;
            	case "z60": //组选60
            		var n1 = Math.combination(b.length, 3);
            		var n2 = Math.difference(a, b).length;
            		var n3 = Math.intersection(a, b).length;
            		var n4 = Math.combination(b.length - 1, 3) * n3;
            		
            		n = n1 * n2 + n4;
            		break;
            	case "z30": //组选30
            		var n1 = Math.combination(a.length, 2);
            		var n2 = Math.combination(b.length, 1);
            		var n3 = Math.intersection(a, b).length;
            		
            		n = n1 * n2 - (a.length - 1) * n3;
            		break;
            	case "z20": //组选20
            		var n1 = Math.combination(b.length, 2);
            		var n2 = Math.difference(a, b).length;
            		var n3 = Math.intersection(a, b).length;
            		var n4 = Math.combination(b.length - 1, 2) * n3;
            		
            		n = n1 * n2 + n4;
            		break;
            	case "z10": //组选10
            		var n1 = Math.combination(b.length, 1);
            		var n2 = Math.difference(a, b).length;
            		var n3 = Math.intersection(a, b).length;
            		var n4 = Math.combination(b.length - 1, 1) * n3;
            		
            		n = n1 * n2 + n4;
            		break;
            	case "z5": //组选5
            		var n1 = Math.combination(b.length, 1);
            		var n2 = Math.difference(a, b).length;
            		var n3 = Math.intersection(a, b).length;
            		var n4 = Math.combination(b.length - 1, 1) * n3;
            		
            		n = n1 * n2 + n4;
            		break;
            	case "z24": //组选24
            		n = Math.combination(a.length, 4);
            		if("rx4" === m[0] ){
            			n = n * Math.combination(pos, rxNum);
            		};
            		break;
            	case "z12": //组选12
            		var n1 = Math.combination(b.length, 2);
            		var n2 = Math.difference(a, b).length;
            		var n3 = Math.intersection(a, b).length;
            		var n4 = Math.combination(b.length - 1, 2) * n3;
            		
            		n = n1 * n2 + n4;
            		
            		if("rx4" === m[0] ){
            			n = n * Math.combination(pos, rxNum);
            		};
            		break;
            	case "z6":  //组选6
            		if("sx" === m[0] || "rx4" === m[0]){
            			n = Math.combination(a.length, 2);
            		}else {
            			n = Math.combination(a.length, 3);
            		}
            		// 任选三、任选四 组6 计算万千百十个是否选择
            		if("rx3" === m[0] || "rx4" === m[0]){
            			n = n * Math.combination(pos, rxNum);
            		}
            		break;
            	case "z4": //组选4
            		var n1 = Math.combination(b.length, 1);
            		var n2 = Math.difference(a, b).length;
            		var n3 = Math.intersection(a, b).length;
            		var n4 = Math.combination(b.length - 1, 1) * n3;
            		
            		n = n1 * n2 + n4;
            		if("rx4" === m[0]){
            			n = n * Math.combination(pos, rxNum);
            		}
            		break;
            	case "z3": //组三
            		n = a.length * (a.length - 1);
            		//组选三得计算万千百十个是否选择
            		if(m[0] === 'rx3'){
            			n = n * Math.combination(pos, rxNum);
            		}
            		break;
            	case "hz":
            	case "hhz":
            	case "qhz":
            		//data下标对应所选号码的值
            		var data = [1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1];
            		var data2 = [1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1];
            		n = 0;
            		for (var i = 0; i < arr[0].length; i++) {
            			var a = arr[0][i];
            			if(m[2] === 'hz' && m[0] !== 'rx2'){
            				n += data[a-1];
            			}else{
            				n += data2[a-1];
            			}
            		}
            		//任选和值需计算万千百十个是否选择
            		if("rx2" === m[0] || "rx3" === m[0]){
            			n = n * Math.combination(pos, rxNum);
            		}
            		break;
            	case "hfs":
            	case "qfs":
            	case "fs":
            		n = Math.combination(a.length, 2);
            		//任选复式需计算万千百十个是否选择
            		if("rx2" === m[0] || "rx3" === m[0]){
            			n = n * Math.combination(pos, rxNum);
            		}
            		break;
            	default:
            		break;
            }
    	} else if (0 == m[1].indexOf("cq")) {
            var pkstatus = true;
            
            $(arr).each(function() {
                if(arguments[1].length == 0){
                	pkstatus = false;
                	return false;
                }
            });
            
            if(pkstatus){
            	var newArr = [];
                var calcpkzux = function(arr) {
                	if (arr.length == 1) {
                		return;
                	}
                	for (var i=0; i<arr[0].length; i++){
                		for (var j = 0; j < arr[1].length; j++){
                			if (String(arr[0][i]).indexOf(arr[1][j] == -1)) {
                				var item = arr[0][i] + "-" + arr[1][j];
                				newArr.push(item);
                			}
                		}
                	}
                	arr.splice(0,2,newArr);
                	newArr = [];
                	calcpkzux(arr);
                }
                calcpkzux(arr),
                n = arr[0].length;
            }else{
            	n = 0;
            }
        } else if ("dwd" === m[1]) { //定位胆
            n = 0;
            for (var i = 0; i < arr.length; i++){
            	i += arr[i].length;
            }
        } else if ("bdd" === m[1]) { //不定胆
            switch (m[2]) {
            	case "hs1": //后三一码
            	case "qs1": //前三一码
            	case "bdd1": //一码不定胆
            		n = arr[0].length;
            		break;
            	case "hs2": //后三二码
            	case "qs2": //前三二码
            	case "bdd2": //二码不定胆
            		var k = arr[0].length;
            		n = k * (k - 1) / 2;
            		n = Math.combination(arr[0].length, 2);
            		break;
            	case "bdd11y": //11选5的不定胆
            		n = arr[0].length
            		break;
            	default:
            		break;
            }
        } else if ("dxds" === m[1]) { //大小单双
            n = arr[0].length * arr[1].length;
        } else if (me.cls == "pk10" && ("dx" === m[1] || "ds" === m[1] || "hz" === m[1] || "lh" === m[1])) { //pk10 大小 单双 龙虎 pk10 和值
            n = arr[0].length;
        } else if ("sm" === m[1]) { //11选5的三码 不影响时时彩三妈
            switch (m[2]) {
            	case "zxfs":
            		n = 0;
            		for (var i = 0; i < arr[0].length; i++) {
            			for (var j = 0; j < arr[1].length; j++) {
                            if (arr[1][j] === arr[0][i]) continue;
                            for (var k = 0; k < arr[2].length; k++){
                            	if(arr[2][k] === arr[0][i] || arr[2][k] === arr[1][j]) continue;
                            	n += 1;
                            }
                                    
            			}
            		}	
            		break;
            	case "zuxfs":
            		//与3中3公式一样
            		n = Math.nzn(arr[0].length, 3);
            		break;
            	default:
            		break;
            }
    	} else if ("em" === m[1]) { //11选5的 二码码(计算不影响时时彩二码)
            switch (m[2]) {
            	case "zxfs":
            		var n1 = arr[0].length * arr[1].length;
            		var n2 = Math.intersection(arr[0], arr[1]).length;
            		n = n1 - n2;
            		break;
            	case "zuxfs":
            		n = Math.nzn(arr[0].length, 2);
            		break;
            	default:
            		break;
            }
    	} else if ("rxfs" === m[1]) { //11选5的任选复式
            n = Math.round(Math.nzn(arr[0].length, parseInt(arr[2], 10)));
        } else if ("qw" === m[1]) { //北京快乐8趣味
            n = arr[0].length;
        } else if ("rxx" === m[1]) { //北京快乐8 任选x
        	//取rx1 rx2 ... rx7 的 1 2 ... 7
            var a = arr[0].length + arr[1].length;
            var b = parseInt(m[2].charAt(m[2].length - 1), 10);
            n = "rx1" === m[2] ? a : Math.combination(a, b);
        } else {
        	
        }
    	
        $("#lottery .count .totalCount").html(n);
    },
    
    calcMoney: function() {
    	var me = this;
    	var _el = $('#lottery>.count');
    	
    	var mode = parseFloat(_el.find(".mode select").val(), 10);
    	var modeName = _el.find(".mode select option:checked").html();
    	var times = parseInt(_el.find(".times input").val(), 10);
    	var odds = parseFloat(_el.find(".odds select").val(), 10);
        var point = parseFloat(_el.find(".odds select option:checked").data("point"), 10);
        var total = parseInt(_el.find(".totalCount").html(), 10);
        
        var money = _el.find(".totalMoney em");
        
        var btnConfirm = _el.find(".confirm button");
      
        var result = total * times * mode;
        result = result.toFixed(Math.precision(mode));
        
        if(total > 0){
        	btnConfirm.removeClass('disabled');
        	money.html(result);
        } else {
        	btnConfirm.addClass('disabled');
        	_el.removeAttr('data-count');
        	money.html(result);
        	return false;
        }

        var pos = $('#lottery .dl-pos i');
        var pos_val = [];
    	//任选玩法存在且有万千百十个
    	if(pos.length > 0){
    		$(pos).each(function(){
    			var cur = $(arguments[1]);
    			if(cur.hasClass('on')){
    				pos_val.push(cur.attr('data-pos'));
    			}
    		})
    	}
    	
    	//  注数  | 倍数  | 元角分厘   | 奖金模式  | 返点  | 总金额   | 选择位置（任选玩法）| 元角分厘名称
    	var countData = total + '|' + times + '|' + mode + '|' + odds + '|' + point + '|' + result + '|' + pos_val.join(',') + '|' + modeName;
    	me.countData = countData;
    },
    updateOdds: function() {
        var me = this;
        var $odds = $('#lottery>.count .odds');
        var obj;
        var m = me.methods;
        var hz_odds = [];
        
        if(me.odds[me.lt]){
        	//北京pk10和值号码不同赔率不同
            if ("pk10" == me.cls && -1 != me.method.indexOf("hz")) {
                var items = $("#lottery .number i.on");
                if (0 == items.length) {
                    obj = { odds: 0 };
                } else {
                    var arr = Q.PkHzNum[m[2]];
                    items.each(function() {
                        var num = $(this).html();
                        $(arr).each(function() {
                        	if(arguments[1].split("_").indexOf(num) != -1) {
                        		obj = me.odds[me.lt][me.method + '_' + arguments[1]];
                        		if(hz_odds.length == 0){
                        			hz_odds.push(obj);
                        			hz_odds.push(obj);
                        		}else{
                        			if(obj.odds > hz_odds[1].odds){
                        				hz_odds[1] = obj;
                        			}
                        			
                        			if(obj.odds < hz_odds[0].odds){
                        				hz_odds[0] = obj;
                        			}
                        		}
                        		return false;
                        	}
                        });
                    });
                }
            } else {
                if (!me.odds[me.lt][me.method]){
                	return;
                }
                obj = me.odds[me.lt][me.method];
            }
            
            me.lt_odds = obj.odds || hz_odds;
            
            if (obj.point) {
            	//登陆之后的赔率有返点
                var option = [];
                var val = 0;
                
                if (hz_odds.length > 0) {
                    var obj1 = hz_odds[0];
                    var obj2 = hz_odds[1];
                    
                    var v1 = (obj1.odds + obj1.x * obj1.point).toFixed(3);
                    var v2 = (obj2.odds + obj2.x * obj2.point).toFixed(3);
                    
                    v1 = v1.substr(0, v1.length - 1),
                    v2 = v2.substr(0, v2.length - 1);
                    
                    var v, odd;
                    
                    if(obj1.odds == obj2.odds){
                    	v = v1;
                    	odd = obj1.odds;
                    }else{
                    	v = v1 + ' - ' + v2;
                    	odd = obj1.odds + ' - ' + obj2.odds;
                    }
                    
                    if(0 === parseFloat(obj1.point, 10)){
                    	option.push('<option value="pk10_hz" data-point="0">' + v + " ~ 0%</option>");
                    	$odds.find('em').html(val).show();
                    	$odds.find('select').html(option.join('')).hide();
                    }else{
                    	option.push('<option value="pk10_hz" data-point="0">' + v + " ~ 0%</option>");
                    	option.push('<option value="pk10_hz" data-point="' + obj1.point + '">' + odd + " ~ " + Q.percentFormat(obj1.point) + "%</option>");
                        
                    	$odds.find('em').hide();
                    	$odds.find('select').html(option.join('')).show();
                    }
                } else {
                	val = (obj.odds + obj.x * obj.point).toFixed(3);
                    val = val.substr(0, val.length - 1);
                    if(parseInt(val, 10) === parseFloat(val, 10)){
                    	val = parseInt(val, 10);
                    } else {
                    	 val = parseFloat(val, 10);
                    }
                     
                    if(0 === parseFloat(obj.point, 10)){
                    	option.push('<option value="' + val + '" data-point="0">' + val + " ~ 0%</option>");
                    	$odds.find("em").html(val).show();
                        $odds.find("select").html(option.join("")).hide();
                    } else {
                    	option.push('<option value="' + val + '" data-point="0">' + val + " ~ 0%</option>");
                    	option.push('<option value="' + obj.odds + '" data-point="' + obj.point + '">' + obj.odds + " ~ " + Q.percentFormat(obj.point) + "%</option>");
                    	$odds.find("em").hide();
                    	$odds.find("select").html(option.join("")).show();
                    }
                }
            } else {
            	// 未登录赔率 无返点
                var odd;
                if(hz_odds.length > 0){
                	if(hz_odds[0].odds == hz_odds[1].odds){
                		odd = hz_odds[0].odds;
                	} else {
                		odd = hz_odds[0].odds + "~" + hz_odds[1].odds;
                	}
                } else {
                	odd = obj.odds;
                }
                
                $odds.find("select").html('<option value="' + odd + '" data-point="-1"></option>').hide();
                $odds.find("em").html(odd).show();
            }
        }
    },
    updateIssue : function(){
    	var me = this;
    	
    	var el = $('#lottery');
    	
		el.find('.lt-info span').html(me.ltName)
    },
    initLottery : function(){
    	var me = this;
    	var el = $('#lottery');
    	
    	el.find('.pageback').on("touchend",function(){
    		el.find('.tabDiv').removeClass('tabShow');
    		var obj = el.hasClass('edit') ?  {'transform':'translate3d(0,100%,0)'} : undefined;
        	Common.pageOut(obj);
    	});
    	
    	var count = $('#lottery>.count');
	
    	count.on('change','.times input',function(evt){
    		evt.preventDefault();
    		var val = $(this).val();
    		var min = 1;
    		var max = 99999;
    		
    		if(val === ''){
    			$(this).val(min);
    		}else if(parseInt(val) > parseInt(max)){
    			$(this).val(max);
    		}
    		count.find('.totalTimes').html($(this).val());
    		me.calcMoney();
    	});
    	
    	count.on('change','select',function(){
    		me.calcMoney();
    	});
    	
    	count.find('.clear button').on('touchend',function(evt){
    		evt.preventDefault();
    		me.resetCount();
    	});
    	
    	count.find('.confirm button').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		if($(this).hasClass('disabled')){
    			return false;
    		}
    		me.renderOrderList();
    		
    		if(el.hasClass('edit')){
    			Common.pageOut({
    				'transform':'translate3d(0,100%,0)'
    			});
    			el.removeClass('add restore');
    		}else{
    			me.lotteryToSubmit();
    			Common.prePage.pop();
    		}
    		me.resetCount();
    	});
    },
    lotteryToSubmit : function(){
    	Common.pageIn('#submit');
		$('#submit').one('webkitTransitionEnd transitionend',function(){
			$(this).off('webkitTransitionEnd transitionend');
			$('#lottery').hide().addClass('edit').css('transform','translate3d(0,100%,0)');
		});
    },
    renderOrderList : function(){
    	var me = this;
    	var lt = $('#lottery');
    	var el = $('#submit');
    	
    	var list = el.find('.order-list');
    	
    	var order = me.orderlist[me.lt] ? me.orderlist[me.lt] : me.getOrder();
    	
    	if(lt.hasClass('restore')){
    		var index = lt.attr('data-restore');
    		list.find('li').eq(index).replaceWith(order);
    	} else {
    		list.append(order);
    	}
    	
    	me.setSubmitData();
    },
    initSubmit　: function(){
    	var me = this;
    	var lt = $('#lottery');
    	var el = $('#submit');
    	var list = el.find('.order-list');
    	
		el.find('.pageback').on("touchend",function(evt){
			evt.preventDefault();
    		var tip = {
    			content : '要保存号码吗？',
    			fn : function(e){
    				var _e = $(e.target);
    				if (_e.hasClass('yes')) {
    					me.orderlist[me.lt] = list.html();
    				} else {
    					me.orderlist[me.lt] = undefined;
    				}
    				
    				list.find('li').remove();
    				Common.closeTip();
    				lt.removeClass('edit').css('transform','translate3d(100%,0,0)')
    				Common.pageOut();
    			}
    		}
    		Common.showTip(tip);
		});
    	el.find('.clearOrder span').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		var tip = {
    			content : '确定要清空注单吗？',
    			fn : function(e){
    				var _e = $(e.target);
    				if(_e.hasClass('yes')){
    					list.find('li').remove();
    				}
    				Common.closeTip();
    			}
    		}
    		Common.showTip(tip);
    	});
    	
    	el.find('.addOrder span').on('touchend',function(evt){
    		evt.preventDefault();
    		me.resetCount();
    		Common.pageIn('#lottery');
    		lt.addClass('add');
    	});
    	
    	list.on('touchend',function(evt){
    		evt.preventDefault();
    		var _this = $(evt.target);
    		
    		if(_this.hasClass('delete')){
    			
    			var tip = {
        			content : '确定要删除吗？',
        			fn : function(e){
        				var _e = $(e.target);
        				if(_e.hasClass('yes')){
        					_this.parent('li').remove();
        				}
        				Common.closeTip();
        			}
        		}
        		Common.showTip(tip);
    			
    		} else if(_this.hasClass('update')){
    			Common.pageIn('#lottery');
    			var li = _this.parent('li');
    			
    			$('#lottery').addClass('restore').attr('data-restore',li.index());
    			me.restoreLottery(li);
    		}
    	});
    	
    	el.find('.submit button').on('touchend',function(evt){
    		if ($(this).hasClass("locked")){
    			return false;
            }
    		evt.preventDefault();
    		
    		if ($(this).hasClass("disabled")){
    			return false;
            }
            
    		if(me.isStop){
    			alert('当前彩种暂停销售');
    		}
    		
    		me.addOrderApi();
    	});
    },
    restoreLottery : function(li){
    	var me = this;
    	var e = $('#lottery');
		
		me.method = li.attr('data-method');
		me.methods = me.method.split('_');
		me.countData = li.attr('data-count');
		var data = me.countData.split('|');
		
		var m = me.methods;
		var m1 = m[1] + '_' + m[2];
		var tabName = e.find('.tabDiv .tabName[data-type="' + m[0] + '"]');
		var s = tabName.next().find('span[data-type="' + m1 + '"]');
		s.trigger('tap');

		//万十百千个 位置选择
		var pos = data[6].split(',');
		if(pos.length > 0){
			var dl_pos = e.find('.number dl.dl-pos');
			$(pos).each(function(){
				$(dl_pos).find('i[data-pos="' + arguments[1] + '"]').addClass('on');
			});
		}
		
		var code = li.attr('data-code').split(',');
		var dl = e.find('.number dl').not('.dl-pos');
		$(code).each(function(){
			var dom = dl[arguments[0]];
			
			var num;
			
			//坑爹的pk10和值
			if(me.cls == 'pk10' && me.methods[0] == 'hz'){
				num = arguments[1].split();
			} else{
				var reg = me.cls == '11y' || (me.cls == 'pk10' && me.method.indexOf('hz') == -1) ? /(?=(?:\d{2})+?$)/ : '';
				num = arguments[1].split(reg);
			}
			
			$(num).each(function(){
				$(dom).find('i[data-code="' + arguments[1] + '"]').addClass('on');
			});
		});
		
		//pk10和值不同 赔率不同
        if(me.cls == 'pk10' && me.methods[0] == 'hz'){
        	me.updateOdds();
        }
                        
        var count = e.find('.count');
        count.find('.mode select').val(data[2]);
        count.find('.times input').val(data[1]);
        count.find('.odds select').val(data[3]);
        
        me.getStack();
        
        me.calcMoney();
    },
    getOrder : function(){
    	var me = this;
    	
    	var method = me.method;
    	var m = me.methods;
    
    	//  注数  | 倍数  | 元角分厘 (2,0.2,0.02)  | 奖金模式  | 返点  | 总金额   | 选择位置（任选玩法） | 元角分厘 
        var count = me.countData.split("|");
    
        var code = me.getCode(); // code = 01,01,01,01
        
        var name = Q.getMethodName(method,me.lt);
        var html = '';
        
        //pk10 和值订单拆分
        if ("pk10" == me.cls && -1 != method.indexOf("hz")){
        	code = code[0];
        	
        	count[0] = 1;
        	count[5] = count[2];
        	
        	$(code).each(function(){
        		var hz_num = arguments[1];
        		var hz_method;
        		
        		var arr = Q.PkHzNum[m[2]];
        		
                $(arr).each(function() {
                	if(arguments[1].split('_').indexOf(hz_num) != -1){
                		hz_method = method + "_" + arguments[1];
                		return false;
                	}
                });
                
                var obj = me.odds[me.lt][hz_method];
                
                if (obj.point !== undefined) {
                    var p = $("#lottery .count .odds option").not(function(){ return !this.selected }).attr("data-point");
                    if (p == 0) {
                        var val = (obj.odds + obj.x * obj.point).toFixed(3);
                        count[3] = val.substr(0, val.length - 1);
                    } else {
                    	count[3] = obj.odds;
                    }
                } else {
                	count[3] = obj.odds;
                }
                var win = me.getMoneyWin(count, hz_num.split(), hz_method).win;
                
                
                html = html + '<li data-method="' + me.method + '" data-count="' + count.join('|') + '" data-code="' + hz_num + '"><div class="delete"></div><div class="content"><div class="title">\
						<span class="lt-name">' + name + '</span><span class="odd">奖金模式<em>' + count[3] + '</em></span></div>\
						<div class="code">' + hz_num + '</div><div class="info">\
						<span><em class="count">' + count[0] + '</em>注<em class="times">' + count[1] + '</em>倍</span>\
						<span class="mode">模式<em>' + count[7] + '</em></span>\
						<span class="profit">盈利<em>' + win +'</em></span></div></div><div class="update"></div></li>';
                
        	});
        } else {
        	var win = me.getMoneyWin(count, code, method).win;
        	var desc = me.codeFormat(code);
        	html = html + '<li data-method="' + me.method + '" data-count="' + me.countData + '" data-code="' + desc + '"><div class="delete"></div><div class="content"><div class="title">\
				<span class="lt-name">' + name + '</span><span class="odd">奖金模式<em>' + count[3] + '</em></span></div>\
				<div class="code">' + desc + '</div><div class="info">\
				<span><em class="count">' + count[0] + '</em>注<em class="times">' + count[1] + '</em>倍</span>\
				<span class="mode">模式<em>' + count[7] + '</em></span>\
				<span class="profit">盈利<em>' + win +'</em></span></div></div><div class="update"></div></li>';
        }
        
        return html;
    },
    
    getCode : function(){
    	var me = this;
    	var dl = $('#lottery>.number dl').not(".dl-pos");
    	
    	var data = [];
    	
    	$(dl).each(function(i, el) {
    		if ($(el).find("i.on").length > 0) {
                var a1 = [];
                $(el).find("i.on").each(function(j, el) {
                	a1.push($(el).html())
                }),
                data.push(a1);
    		} else{
    			data.push([]);
            }
    	});
           
    	return data;
    },
    
    getMoneyWin : function(count, code, method){
    	//buytype 0  odds-奖金模式  total-注数  times-倍数  mode-元角分厘  code-所选号码   method-玩法
    	
    	var odds = count[3];
    	var total = count[0];
    	var times = count[1];
    	var mode = count[2];
    	
    	var me = this;
    	var money = 0;
    	var win = 0;
    	var wintime = 1;
    	var precision = Math.precision(odds) + Math.precision(mode);
    	var m = method.split('_');
    	var isBuy = true;
    	
    	if(m[2] === 'zh'){
    		//特殊处理五星、四星组合玩法
    		if(isBuy){
    			money = total * times * mode;
                for (var i = 0; i < code.length; i++){
                	win += (odds / Math.pow(10, i)) * times * mode / 2;
                }
                win = win - money;
    		}else{
    			 for (var i = 0; i< code.length; i++){
    				 money += (odds / Math.pow(10, i)) * times;
    			 }
                 win = total * times * mode;
    		}
    		precision = 1;
    	} else if(m[0] === 'dwd') {
    		//特殊处理定位胆玩法
    		if (isBuy) {
    			money = total * times * mode;
                for (var i = 0; i < code.length; i++){
                	if(code[i] !== ''){
                		win += odds * times * mode / 2; 
                	}
                }
                win = win - money;
            } else {
                for (var i = 0; i < code.length; i++){
                	if(code[i] !== ''){
                		money += odds * times; 
                	}
                }
                win = total * times * mode;
            }
    	} else if (m[0] === "bdd"){
    		//特殊处理不定胆玩法
    		if (isBuy) {
    			money = total * times * mode;
    			win = odds * times * mode / 2 * (total < 3 ? total : 3) - money;
    		} else {
    			money = odds * times * (total < 3 ? total : 3);
    			win = total * times * mode;
    		}
    	} else if (m[0] === "dxds") {
    		//特殊处理大小单双
    		var t0 = 1;
            var t1 = 1;
            if (/['大'|'小']/.test(code[0]) && /['单'|'双']/.test(code[0])) {
            	t0 = 2;
            }
            if (/['大'|'小']/.test(code[1]) && /['单'|'双']/.test(code[1])) {
            	t1 = 2;
            }
            if (isBuy) {
            	money = total * times * mode;
            	win = odds * times * mode / 2 * t0 * t1 - money; 
            } else {
            	money = odds * times * t0 * t1;
            	win = total * times * mode;
            }
    	} else if (m[0] === "rxfs" || m[0] === 'rxds') {
    		code = code[0].split(",");
            var rxNum = 1;
            
            if (parseInt(method.substr(-3, 1), 10) <= 5) {
            	rxNum = code.length < 5 ? total : Math.combination(5, parseInt(method.substr(-3, 1), 10)); 
            } else {
            	rxNum = Math.combination(code.length - 5, parseInt(method.substr(-3, 1), 10) - 5);
            }
            if (isBuy) {
            	money = total * times * mode;
            	win = odds * times * mode / 2 * rxNum - money;
            } else {
            	money = odds * times * rxNum;
            	win = total * times * mode;
            }
    	} else if ("rx2" === m[0] || "rx3" === m[0] || "rx4" === m[0]) {
    		money = total * times * mode;
    		win = times * odds * mode / 2;
    		if (m[1] === 'zx' && m[2] === 'fs') {
    			code = code.filter(function(){
    				if(n !== '') return n;
    			});
    			wintime = Math.combination(code.length, m[0].charAt(m[0].length - 1));
    			win = win * wintime;
    		} else {
    			wintime = Math.combination($("#lottery .number .dl-pos i.on").length, m[0].charAt(m[0].length - 1));
    			win = win * wintime;
    		}
    		win = win - total * times * mode;
    	} else {
    		if (isBuy) {
    			money = total * times * mode;
    			win = times * odds * mode / 2 - total * times * mode;
    		} else {
    			money = odds * times;
    			win = total * times * mode;
    		}
    	}
        //以下处理浮点数计算不精确的问题
    	money = money.toFixed(precision);
    	money = parseFloat(money, 10);
        win = win.toFixed(precision);
        win = parseFloat(win, 10);
        
        return {
        	money : money,
        	win : win,
        	wintime : wintime
        };
    },
    
    codeFormat : function(code){
    	var arr = [];
    	$(code).each(function(){
    		arr.push(arguments[1].join(''));
    	});
    	return arr.join(',');
    },
    
    setSubmitData: function() {
    	var me = this;
    	var _el = $('#submit');
    	
    	var list = _el.find('.order-list li');
    	
    	var totalCount = 0;
    	var totalMoney = 0;
    	
    	me.orders = [];
    	
    	$(list).each(function(){
    	    //  注数  | 倍数  | 元角分厘   | 奖金模式  | 返点  | 总金额   | 选择位置（任选玩法）| 元角分厘名称
    		var data = $(this).attr('data-count').split('|');
    		var code = $(this).attr('data-code');
    		totalCount += parseInt(data[0],10);
    		totalMoney += parseInt(data[5],10);
    		
    		var tmpOrder = {
    				"method" : me.method,
    				"code" : code,
    				"nums" : data[0],
    				"piece" : data[1],
    				"price" : data[2],
    				"odds" : data[3],
    				"point" : data[4],
    				"amount" : data[5]
    		}
    		if(data[6]){
    			tmpOrder['position'] = data[6];
    		}
    		me.orders.push(tmpOrder);
    	});
    	
    	_el.find('.totalMoney em').html(totalMoney);
    	_el.find('.totalCount').html(totalCount);
    },
    addOrderApi: function() {
        var me = this;
        var obj = me.orders;
        Api.addOrder(obj, function(d) {
        	
        });
    },
    initHistory　: function(){
    	var me = this;
    	
    	$('#history .history-list').on('touchend',function(evt){
    		evt.preventDefault();
    		var _this = $(evt.target);
    		
    		if(_this.hasClass('more')){
    			Common.pageIn('#morehistory');
    		}
    	});
    	
    	$('#morehistory .pageback').on('touchend',function(evt){
    		evt.preventDefault();
    		Common.pageOut();
    	});
    }
};