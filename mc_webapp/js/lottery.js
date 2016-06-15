var Lottery = Lottery || {};
Lottery = {
    lt: "",
//    old_lt: "",
//    issue: "",
    cls: "",
//    type: "",
//    odds: {},
//    lt_odds: 0,
//    ie: !1,
    method: "",
//    m_name: "",
//    noanimation: !1,
//    serverTime: null ,
//    tipchs: "请输入投注号码，按空格或回车键确认选号",
//    isStop: !1,
//    countDownSec: 2,
//    lengthMatchDict: {
//        sm_sm_zxds: 3,
//        sm_sm_zuxds: 3,
//        em_em_zxds: 2,
//        em_em_zuxds: 2,
//        rxds_rxds_1z1: 1,
//        rxds_rxds_2z2: 2,
//        rxds_rxds_3z3: 3,
//        rxds_rxds_4z4: 4,
//        rxds_rxds_5z5: 5,
//        rxds_rxds_6z5: 6,
//        rxds_rxds_7z5: 7,
//        rxds_rxds_8z5: 8,
//        cq5_cq5_ds: 5,
//        cq4_cq4_ds: 4,
//        cq3_cq3_ds: 3,
//        cq2_cq2_ds: 2
//    },
//    filterReg: /['\r\n','\n','\r','\t','\v','\D','\f','\s+','　','；','，',';',',']/g,
//    filterRegSelect: /['\r\n','\n','\r','\t','\v','\D','\f','　','；','，',';',',']/g,
//    filterRegLine: /['\r\n','\n','\r','\v',',','，',';','；',':','：','|']/g,
//    filterRegBreak: /['　',' ',\u4E00-\u9FA5]/g,
//    startDate: 0,
//    

    init: function() {
        var me = this;
        me.initTab(LotteryClass[me.lt]);
        
        //取期号 倒计时
//      me.updateIssue();
        
    },
    initTab: function(obj) {
        var me = this;
        var tabDiv = $("#lottery .tabDiv");
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
	        	
	        	me.method = tab.attr('data-type') + '_' + $(_this).attr('data-type');
	        	
	        	var numObj = ltMethod[tab.attr('data-type')][$(_this).attr('data-type')].num;
	        	me.renderNum(numObj);
	        	
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
    	
    	if((/rx2|rx3|rx4/i).test(method.split('_')[0]) && method.indexOf('zx_fs') == -1){
    		tpl += '<dl class="dl-pos"><dt>选择位置</dt><dd>\
            	<i data-pos="1">万</i>\
            	<i data-pos="2">千</i>\
            	<i data-pos="3">百</i>\
            	<i data-pos="4">十</i>\
            	<i data-pos="5">个</i></dd></dl>';
    	}
    	
    	for(var i=0;i<tits.length;i++){
    		tpl += '<dl><dt>' + tits[i]+ '</dt>';
			tpl += '<dd>' + me.renderCodes(nums,method) + '</dd>';
			tpl += '</dl>';
    	}
    	el.html(tpl);
    	
    	el.off("tap").on("tap", function(evt) {
    		me.numHandler(_el,evt)
    	});
    	me.resetCount();
    },
    renderCodes: function(n, m) {
        var me = this;
        var tpl = '';
        var txt = ["大", "小", "单", "双","龙", "虎"];
        var m0 = ["dxds", "qw", "dx", "ds", "lh"];
        
        n = n.split("-");
        m = m.split("_");
        
        for (var i = parseInt(n[0]); i <= parseInt(n[1]); i++){
        	if(m0.indexOf(m[0]) != -1){
        		tpl += '<i>' + txt[i] + '</i>';
        	}else{
        		if((me.cls == "11y" ||  (me.cls == "pk10" && m[0] != "hz")) && (i < 10)){
        			tpl += '<i>0' + i + '</i>';
        		}else{
        			tpl += '<i>' + i + '</i>';
        		}
        	}
        }
        return tpl;
    },
    
    resetCount : function(){
    	var me = this;
    	$('#lottery .count .times input').val('1');
    },
    
    numHandler : function(_el,evt){
    	var me = this;
    	evt.preventDefault();
    	evt.stopPropagation();
    	
    	var _this = evt.target;
    	if(_this.nodeName == 'I'){
    		var m = me.method.split("_");
        	
            $(_this).toggleClass("on");
            
            $(_this).addClass("ball").one("webkitAnimationEnd", function() {
                $(this).removeClass("ball");
            });
            
            //pk10和值不同 赔率不同
            if(me.cls == 'pk10' && m[0] == 'hz'){
            	me.updateOdds();
            }
            me.calcNum(_el);
    	}
    },
    calcNum : function(_el) {
        var me = this;
        $("#lottery .count .totalCount").html(me.getStack(_el));
        //me.calcMoney(evt)
    },
    getStack : function(_el){
    	var n = 1;
    	var len = 0;
    	var arr = [];
    	var pos = 0;
    	
    	if ($('#lottery .number dl:not(".dl-pos")').each(function(e, t) {
    		if ($(t).find("i.on").length > 0) {
                 var a = [];
                 $(t).find("i.on").each(function(e, t) {
                     a.push($(t).html())
                 }
                 ),
                 n.push(a)
             } else
                 n.push([])
         }
    	
    	/**
            var a = 1
              , n = []
              , i = 0
              , s = 0;
            if ($(e).children("dl").each(function(e, t) {
                if ($(t).find("i.on").length > 0) {
                    var a = [];
                    $(t).find("i.on").each(function(e, t) {
                        a.push($(t).html())
                    }
                    ),
                    n.push(a)
                } else
                    n.push([])
            }
            ),
            i = $(e).find(".pos label.on").length,
            s = parseInt(t[0].charAt(t[0].length - 1)),
            "zx" === t[1])
                switch (t[2]) {
                case "fs":
                case "zh":
                case "hfs":
                case "qfs":
                    for (var l = 0, r = 0, d = 0, o = 0, c = 0, u = 0; u < n.length; u++) {
                        var m = n[u].length;
                        a *= parseInt(m, 10)
                    }
                    "zh" === t[2] && (a *= n.length),
                    ("rx2" === t[0] || "rx3" === t[0] || "rx4" === t[0]) && (l = n[0].length,
                    r = n[1].length,
                    d = n[2].length,
                    o = n[3].length,
                    c = n[4].length,
                    "rx2" === t[0] && (a = l * (r + d + o + c) + r * d + (r + d) * (o + c) + o * c),
                    "rx3" === t[0] && (a = (l * r + l * d + r * d) * (o + c) + l * r * d + (l + r + d) * o * c),
                    "rx4" === t[0] && (a = l * r * d * o + l * r * d * c + l * r * o * c + l * d * o * c + r * d * o * c));
                    break;
                case "hz":
                case "hhz":
                case "qhz":
                    var p = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
                      , h = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
                    a = 0;
                    for (var u = 0; u < n[0].length; u++) {
                        var f = n[0][u];
                        a += "hz" === t[2] && "rx2" !== t[0] ? p[f] : h[f]
                    }
                    ("rx2" === t[0] || "rx3" === t[0]) && (a *= Math.combination(i, s))
                }
            else if ("zux" === t[1]) {
                var f = n[0] || []
                  , d = n[1] || [];
                switch (t[2]) {
                case "z120":
                    a = Math.combination(f.length, 5);
                    break;
                case "z60":
                    var g = Math.combination(d.length, 3)
                      , v = Math.difference(f, d).length
                      , b = Math.intersection(f, d).length
                      , y = Math.combination(d.length - 1, 3) * b;
                    a = g * v + y;
                    break;
                case "z30":
                    var g = Math.combination(f.length, 2)
                      , v = Math.combination(d.length, 1)
                      , b = Math.intersection(f, d).length;
                    a = g * v - (f.length - 1) * b;
                    break;
                case "z20":
                    var g = Math.combination(d.length, 2)
                      , v = Math.difference(f, d).length
                      , b = Math.intersection(f, d).length
                      , y = Math.combination(d.length - 1, 2) * b;
                    a = g * v + y;
                    break;
                case "z10":
                    var g = Math.combination(d.length, 1)
                      , v = Math.difference(f, d).length
                      , b = Math.intersection(f, d).length
                      , y = Math.combination(d.length - 1, 1) * b;
                    a = g * v + y;
                    break;
                case "z5":
                    var g = Math.combination(d.length, 1)
                      , v = Math.difference(f, d).length
                      , b = Math.intersection(f, d).length
                      , y = Math.combination(d.length - 1, 1) * b;
                    a = g * v + y;
                    break;
                case "z24":
                    a = Math.combination(f.length, 4),
                    "rx4" === t[0] && (a *= Math.combination(i, s));
                    break;
                case "z12":
                    var g = Math.combination(d.length, 2)
                      , v = Math.difference(f, d).length
                      , b = Math.intersection(f, d).length
                      , y = Math.combination(d.length - 1, 2) * b;
                    a = g * v + y,
                    "rx4" === t[0] && (a *= Math.combination(i, s));
                    break;
                case "z6":
                    a = "sx" === t[0] || "rx4" === t[0] ? Math.combination(f.length, 2) : Math.combination(f.length, 3),
                    ("rx3" === t[0] || "rx4" === t[0]) && (a *= Math.combination(i, s));
                    break;
                case "z4":
                    var g = Math.combination(d.length, 1)
                      , v = Math.difference(f, d).length
                      , b = Math.intersection(f, d).length
                      , y = Math.combination(d.length - 1, 1) * b;
                    a = g * v + y,
                    "rx4" === t[0] && (a *= Math.combination(i, s));
                    break;
                case "z3":
                    a = f.length * (f.length - 1),
                    "rx3" === t[0] && (a *= Math.combination(i, s));
                    break;
                case "hz":
                case "hhz":
                case "qhz":
                    var p = [1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1]
                      , h = [1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1];
                    a = 0;
                    for (var u = 0; u < n[0].length; u++) {
                        var f = n[0][u];
                        a += "hz" === t[2] && "rx2" !== t[0] ? p[f - 1] : h[f - 1]
                    }
                    ("rx2" === t[0] || "rx3" === t[0]) && (a *= Math.combination(i, s));
                    break;
                case "hfs":
                case "qfs":
                case "fs":
                    a = Math.combination(f.length, 2),
                    ("rx2" === t[0] || "rx3" === t[0]) && (a *= Math.combination(i, s))
                }
            } else if (0 == t[1].indexOf("cq")) {
                var x = !0;
                if ($(n).each(function() {
                    var e = arguments[1];
                    return 0 == e.length ? (x = !1,
                    !1) : void 0
                }
                ),
                x) {
                    var k = []
                      , z = function(e) {
                        if (1 != e.length) {
                            for (var t = 0; t < e[0].length; t++)
                                for (var a = 0; a < e[1].length; a++)
                                    if (-1 == String(e[0][t]).indexOf(e[1][a])) {
                                        var n = e[0][t] + "-" + e[1][a];
                                        k.push(n)
                                    }
                            e.splice(0, 2, k),
                            k = [],
                            z(e)
                        }
                    }
                    ;
                    z(n),
                    a = n[0].length
                } else
                    a = 0
            } else if ("dwd" === t[1]) {
                a = 0;
                for (var u = 0; u < n.length; u++)
                    a += n[u].length
            } else if ("bdd" === t[1])
                switch (t[2]) {
                case "hs1":
                case "qs1":
                case "bdd1":
                    a = n[0].length;
                    break;
                case "hs2":
                case "qs2":
                case "bdd2":
                    var w = n[0].length;
                    a = w * (w - 1) / 2,
                    a = Math.combination(n[0].length, 2);
                    break;
                case "bdd11y":
                    a = n[0].length
                }
            else if ("dxds" === t[1])
                a = n[0].length * n[1].length;
            else if ("dx" === t[1] || "ds" === t[1] || "hz" === t[1] || "lh" === t[1])
                a = n[0].length;
            else if ("sm" === t[1])
                switch (t[2]) {
                case "zxfs":
                    a = 0;
                    for (var u = 0; u < n[0].length; u++)
                        for (var C = 0; C < n[1].length; C++)
                            if (n[1][C] !== n[0][u])
                                for (var w = 0; w < n[2].length; w++)
                                    n[2][w] !== n[0][u] && n[2][w] !== n[1][C] && (a += 1);
                    break;
                case "zuxfs":
                    a = Math.nzn(n[0].length, 3)
                }
            else if ("em" === t[1])
                switch (t[2]) {
                case "zxfs":
                    var g = n[0].length * n[1].length
                      , v = Math.intersection(n[0], n[1]).length;
                    a = g - v;
                    break;
                case "zuxfs":
                    a = Math.nzn(n[0].length, 2)
                }
            else if ("rxfs" === t[1])
                a = Math.round(Math.nzn(n[0].length, parseInt(t[2], 10)));
            else if ("qw" === t[1])
                a = n[0].length;
            else if ("rxx" === t[1]) {
                var f = n[0].length + n[1].length
                  , d = parseInt(t[2].charAt(t[2].length - 1), 10);
                a = "rx1" === t[2] ? f : Math.combination(f, d)
            }
            return a
        },*/
    },

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /**
    renderSubTab: function(e, t) {
        var a = this
          , n = e.find(".tab")
          , i = n.find("span.on").attr("data-type")
          , s = e.find(".subtab")
          , l = ""
          , r = JSON.parse(Cookies.get("ltData") || "{}")
          , d = "";
        for (var o in t) {
            l += "<dl><dt>" + t[o].title + "</dt>";
            var d = t[o].method;
            for (var c in d) {
                var u = o + "_" + c;
                l += '<dd data-type="' + u + '"><i></i>' + d[c].desc + "</dd>"
            }
            l += "</dl>"
        }
        s.html(l),
        s.off("click").on("click", "dd", function(l) {
            if (l.preventDefault(),
            s.hasClass("lock"))
                return !1;
            s.find("dd").removeClass("on"),
            $(this).addClass("on");
            var d = $(this).data("type").split("_");
            s.attr({
                "data-type": $(this).data("type"),
                "data-desc": t[d[0]].method[d[1]].desc
            }),
            a.method = i + "_" + d.join("_"),
            a.m_name = n.find("span.on").html() + "_" + $(this).html(),
            a.renderNum(e, t[d[0]].method[d[1]].num, a.method),
            a.updateOdds(),
            a.countReset(e),
            r[a.lt] = a.method,
            Cookies.set("ltData", JSON.stringify(r)),
            /rx2|rx3|rx4/i.test(i) && "zx_fs" !== $(this).data("type") && a.renderPos(e)
        }
        ),
        d = r[a.lt],
        void 0 !== d && d.split("_")[0] === i ? (d = d.replace(/[a-z]+\d*_/i, ""),
        s.find("dl dd[data-type=" + d + "]").eq(0).trigger("click")) : s.find("dl dd").eq(0).trigger("click")
    },
    renderPos: function(e) {
        var t = $(e).find(".number")
          , a = ['<div class="pos">', "<span>选择位置</span>", '<label data-pos="1">万</label>', '<label data-pos="2">千</label>', '<label data-pos="3">百</label>', '<label data-pos="4">十</label>', '<label data-pos="5">个</label>', "</div>"];
        t.find(".pos").remove(),
        t.prepend(a.join(""))
    },
//    renderNum: function(e, t, a) {
//        var i = this
//          , s = e.find(".number")[0]
//          , l = $(e).find(".count")[0]
//          , r = ($(e).find(".box"),
//        $(e).find(".orders")[0])
//          , d = t.split("|");
//        if (-1 === t.indexOf("input")) {
//            for (var o = t.split("|")[0].split(","), c = t.split("|")[1], u = t.split("|")[2], m = "", d = 0; d < o.length; d++)
//                m += "<dl><dt>" + o[d] + "</dt>",
//                m += "<dd>" + i.renderCodes(d, c, a) + i.renderBtns(u) + "</dd>",
//                m += "</dl>";
//            $(s).html(m),
//            /msie|trident/i.test(navigator.userAgent) && $(s).find("dl dd i").attr("unselectable", "on")
//        } else {
//            var p = i.tipchs;
//            "hh" === d[1] && (p += "，注意：不包含豹子号 111、222 等"),
//            ("11y" === Lottery.cls || "pk10" === Lottery.cls) && (p += "，注意：小于10则前面加0，如 010203 等"),
//            $(s).html(i.renderBox(p))
//        }
//        $(l).find(".confirm").addClass("disabled"),
//        $(l).on("click", ".mode label", function(e) {
//            e.preventDefault(),
//            $(this).addClass("modeSelect").siblings().removeClass("modeSelect"),
//            $(this).prev().click().change()
//        }
//        ),
//        $(l).off("change keyup").on("change keyup", "input, select", function(t) {
//            t.preventDefault(),
//            "" === $(this).val() && $(this).val($(this).attr("min")),
//            i.calcMoney(e)
//        }
//        ),
//        $(l).find("a.quickSubmit").off("click").click(function(e) {
//            return e.preventDefault(),
//            $(this).hasClass("disabled") ? !1 : ($(r).addClass("quickSubmit-orders"),
//            $(l).find("a.confirm").click(),
//            void $(r).find("a.submit").click())
//        }
//        ),
//        $(l).find("a.confirm").off("click").click(function(t) {
//            if (t.preventDefault(),
//            $(this).hasClass("disabled"))
//                return !1;
//            var a = $(r).find("ul:eq(0)")
//              , n = i.getOrder();
//            $(n).prependTo(a),
//            Trace.chkRateTrace() ? Trace.toggleRateTab(!0) : Trace.toggleRateTab(!1),
//            i.countReset($(e)),
//            a.find('li input[type="text"].spinner.newInput').inputNumber().removeClass("newInput"),
//            a.find("li").removeClass("blink animated").eq(0).addClass("blink animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
//                $(this).removeClass("blink animated")
//            }
//            ),
//            e.find(".box textarea.editable").height(93).val(i.tipchs).select(),
//            i.setSubmitData()
//        }
//        ),
//        $(r).find(".list > ul").off("change keyup").on("change keyup", "input.spinner", function(e) {
//            e.preventDefault(),
//            "" === $(this).val() && $(this).val($(this).attr("min"));
//            var t, a = $(this).closest("li"), n = $(a).attr("data-count").split("|"), s = $(this).val(), l = $(a).attr("data-type");
//            t = Lottery.getMoneyWin(0, n[3], n[0], s, n[2], $(a).attr("data-code"), l),
//            $(a).find(".money").html("￥" + t.money),
//            $(a).find(".win").html("￥" + t.win),
//            n[1] = s,
//            n[5] = t.money,
//            n[7] = t.wintime,
//            $(a).attr("data-count", n.join("|")),
//            i.setSubmitData()
//        }
//        ),
//        $(r).off("click").on("click", ".delete", function(e) {
//            e.preventDefault();
//            var t;
//            $(this).parent("li").remove(),
//            t = $(r).find(".list li"),
//            Trace.chkRateTrace() ? Trace.toggleRateTab(!0) : Trace.toggleRateTab(!1),
//            i.setSubmitData()
//        }
//        ),
//        $(r).find("a.submit").off("click").click(function(e) {
//            if ($(this).hasClass("locked"))
//                return !1;
//            if (e.preventDefault(),
//            $(this).hasClass("disabled"))
//                return !1;
//            var t, a = $(this).closest(".orders").find(".list ul"), n = [], s = dialog({
//                id: "lottery_submit",
//                align: "top",
//                skin: "tip"
//            }), d = dialog({
//                id: "lottery_submit_mmc",
//                align: "top",
//                skin: "tip"
//            }), o = "", c = "", u = "", m = "", p = "", h = $(".quickSubmit-orders").length, f = $(l).find("a.quickSubmit"), g = $(e.target);
//            h > 0 && (g = f,
//            $(this).addClass("disabled"));
//            var v = g.html();
//            if (g.hasClass("loading"))
//                return s.content("请不要频繁点击！"),
//                s.show(g[0]),
//                setTimeout(function() {
//                    s.close().remove()
//                }
//                , 600),
//                !1;
//            if (i.isStop)
//                return s.content("当前彩种暂停销售，请关注官方动态！"),
//                s.show(g[0]),
//                $(".quickSubmit-orders").length > 0 && i.resetOrders(),
//                setTimeout(function() {
//                    s.close().remove()
//                }
//                , 2e3),
//                !1;
//            for (var b = 0, y = a.children("li").length; y > b; b++) {
//                var x = $(a).children("li").eq(b)
//                  , k = x.attr("data-type")
//                  , z = x.attr("data-code")
//                  , w = x.attr("data-desc")
//                  , C = x.attr("data-count").split("|")
//                  , T = null ;
//                switch (C[2]) {
//                case "2":
//                    c += "<dd>☆[" + Q.nameCode(w).name + "] <em>" + Q.nameCode(w).code + "</em></dd>";
//                    break;
//                case "0.2":
//                    u += "<dd>☆[" + Q.nameCode(w).name + "] <em>" + Q.nameCode(w).code + "</em></dd>";
//                    break;
//                case "0.02":
//                    m += "<dd>☆[" + Q.nameCode(w).name + "] <em>" + Q.nameCode(w).code + "</em></dd>";
//                    break;
//                case "0.002":
//                    p += "<dd>☆[" + Q.nameCode(w).name + "] <em>" + Q.nameCode(w).code + "</em></dd>"
//                }
//                T = {
//                    method: k,
//                    code: z,
//                    nums: C[0],
//                    piece: C[1],
//                    price: C[2],
//                    odds: C[3],
//                    point: C[4],
//                    amount: C[5]
//                },
//                void 0 !== C[6] && "" !== C[6] && (T.position = C[6]),
//                n.push(T)
//            }
//            "" !== c && (c = "<dl><dt>模式：元</dt>" + c + "</dl>"),
//            "" !== u && (u = "<dl><dt>模式：角</dt>" + u + "</dl>"),
//            "" !== m && (m = "<dl><dt>模式：分</dt>" + m + "</dl>"),
//            "" !== p && (p = "<dl><dt>模式：厘</dt>" + p + "</dl>");
//            var q = "<h3>您确定加入" + (i.issue || "/") + "期？</h3>"
//              , _ = "<h4>总金额：<em>" + $(r).find(".amount").html()
//              , M = {
//                lottery: i.lt,
//                issue: i.issue,
//                order: JSON.stringify(n)
//            }
//              , I = $(r).find(".trace-data > a:eq(0)");
//            if ($(r).find('input[name="autoTrace"]:checked').size() > 0 && I.data("traceCount") > 0) {
//                var S = $(r).find('input[name="autoStop"]:checked').size() > 0 ? !0 : !1
//                  , A = $(r).find(".trace-tab li.on").data("no");
//                M.istrace = $(r).find('input[name="autoTrace"]:checked').size() > 0 ? !0 : !1,
//                M.trace = JSON.stringify({
//                    start: i.issue,
//                    totalMoney: I.data("money"),
//                    totalCount: I.data("traceCount"),
//                    mode: A,
//                    winStop: S,
//                    counts: I.data("trace")
//                }),
//                void 0 === I.data("trace") ? M.istrace = !1 : 0 == I.data("trace").length && (M.istrace = !1),
//                q = '<h3>您确定要追号<em class="issue-num">' + I.data("traceCount") + "</em>期吗？</h3>",
//                _ = "<h4>总金额：￥<em>" + parseFloat(I.data("money")).toFixed(3)
//            } else
//                $(r).find('input[name="autoTrace"]:checked').size() > 0 && 0 == I.data("traceCount") && (M.istrace = !1,
//                q = '<h3 class="highmsg">您未选择追号期数，确定加入' + i.issue + "期？</h3>");
//            if (o = q,
//            o += '<div class="list">' + c + u + m + p + "</div>",
//            o += _,
//            "WBGMMC" === i.lt) {
//                g.html("操作中...").addClass("loading"),
//                M.issue = i.issue;
//                var L = parseInt($("#mmcLoop input[type=text]").val(), 10);
//                L > 1 ? i.addOrderMMCLoopApi(M, g, v, s, L) : i.addOrderApi(M, g, v, d)
//            } else {
//                var D = {
//                    title: "温馨提示",
//                    width: 396,
//                    content: o,
//                    skin: "confirm-again",
//                    fixed: !0,
//                    cancel: !1,
//                    button: [{
//                        id: "lt_ok",
//                        value: "确&nbsp;&nbsp;定",
//                        callback: function(e) {
//                            g.html("操作中...").addClass("loading"),
//                            M.issue = i.issue,
//                            i.addOrderApi(M, g, v, s)
//                        }
//                    }, {
//                        id: "lt_cancel",
//                        skin: "cancel",
//                        value: "取&nbsp;&nbsp;消",
//                        callback: function(e) {
//                            $(".quickSubmit-orders").length > 0 && i.resetOrders()
//                        }
//                    }]
//                };
//                c.length > 2e5 && (D.height = 350),
//                t = dialog(D).showModal()
//            }
//        }
//        ),
//        $(s).off("click").on("click", "i, label, button, .box, .close, .clear, .upload", function(t) {
//            i.numHandler(e, t, d)
//        }
//        ),
//        $(s).off("keydown").on("keydown", ".box input", function(e) {
//            -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13]) || 65 == e.keyCode && e.ctrlKey === !0 || 86 == e.keyCode && e.ctrlKey === !0 || e.keyCode >= 35 && e.keyCode <= 40 || (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && e.preventDefault()
//        }
//        );
//        var h = function(t, a, s, l, r, d, o, c, u, m, p) {
//            switch (("11y" === Lottery.cls || "pk10" === Lottery.cls) && (t = t.replace(/['\r\n','\n','\r','\s+','；','，',';',';\r',',']/g, "").split(/(?=(?:\d{2})+?$)/)),
//            l[1]) {
//            case "zx":
//                a = parseInt(l[2], 10) === t.length,
//                "TEXTAREA" == p && (a = parseInt(l[2], 10) === t.replace(/['\r\n','\n','\r','\s+','；','，',';',',']/g, "").length);
//                break;
//            case "zux":
//            case "hh":
//                t = t.split("").sort().join("");
//                var h = new RegExp("(\\d)\\1{" + (l[2] - 1) + "}");
//                a = t.replace(/['\r\n','\n','\r','\s+','；','，',';',',']/g, "").length === parseInt(l[2], 10) && null  === t.match(h);
//                break;
//            case "zx11":
//                var f = t.concat([]);
//                a = parseInt(l[2], 10) === Q.unique(t).length && Q.unique(t).length === f.length;
//                for (var g = 0; g < t.length; g++)
//                    a = a && 2 === t[g].length && parseInt(t[g], 10) >= 1 && parseInt(t[g], 10) <= 11;
//                break;
//            case "zux11":
//            case "rx":
//                var f = t.concat([]);
//                a = parseInt(l[2], 10) === Q.unique(t).length && Q.unique(t).length === f.length;
//                for (var g = 0; g < t.length; g++)
//                    a = a && 2 === t[g].length && parseInt(t[g], 10) >= 1 && parseInt(t[g], 10) <= 11;
//                t = t.sort();
//                break;
//            case "pkzux":
//                var v = t.join("||");
//                if (a = parseInt(l[2], 10) === t.length)
//                    for (var b = 0; b < t.length; b++) {
//                        if (v.indexOf(t[b]) != v.lastIndexOf(t[b])) {
//                            a = !1;
//                            break
//                        }
//                        if (a = !0,
//                        !(parseInt(t[b]) >= 1 && parseInt(t[b]) <= 10)) {
//                            a = !1;
//                            break
//                        }
//                        a = !0
//                    }
//            }
//            t = "11y" === Lottery.cls || "pk10" === Lottery.cls ? t.join(",") : t.replace(/['\r\n','\n','\r','\s+']/g, "").split("").join(",");
//            var y = $("#ds_" + t.replace(/[',',';','；','，','　']/g, "_"));
//            return a && 0 === y.length ? (t = t.replace(/[^\d]/g, ","),
//            t = t.replace(/^,+|,+$/g, ""),
//            t = t.replace(/,+/g, ","),
//            s.find("span").html(t),
//            s.attr("id", "ds_" + t.replace(/[',',';','；','，','　']/g, "_")),
//            s.attr("data-code", t),
//            r.append(s),
//            o.val("").select(),
//            d.scrollTop(9999),
//            n = r.children("li").length,
//            u.length > 0 && (n *= Math.combination(m, parseInt(l[2], 10))),
//            n > 0 ? r.show() : r.hide(),
//            $(c).find(".total em").html(n),
//            o.height(93 - r.height() < 25 ? 25 : 93 - r.height()),
//            "lottery" === i.type && i.calcMoney(e),
//            void 0) : (y.length > 0 && (y.addClass("wobble"),
//            setTimeout(function() {
//                y.removeClass("wobble")
//            }
//            , 1200)),
//            o.val("").select(),
//            !1)
//        }
//          , f = function(t) {
//            var a = $(s).find(".box .editable")
//              , n = t.type;
//            if ("keyup" == t.type && String(a.val()).indexOf("请输入投注号码") > -1)
//                return !1;
//            a.data("before", a.val());
//            var r, o = t ? t : event;
//            o.srcElement ? r = o.srcElement : o.target && (r = o.target);
//            var c = r.tagName
//              , u = a
//              , m = a.prev("ul")
//              , p = a.parent(".box")
//              , f = p.prev(".pos")
//              , v = !1
//              , b = 0;
//            if (b = $(s).find(".pos label.on").length,
//            !("11y" !== Lottery.cls && "pk10" !== Lottery.cls || "keyup" !== t.type && "change" !== t.type) && a.hasClass("waiting"))
//                return !1;
//            a.removeClass("waiting");
//            var y = function() {
//                var t = a.val()
//                  , s = t.split(" ");
//                if ("TEXTAREA" == c)
//                    if ("11y" === Lottery.cls) {
//                        t = t.replace(/\D/g, " ").replace(/\s+/g, " ");
//                        var r = t.replace(i.filterRegLine, " ").replace(i.filterRegBreak, " ").replace(/ $/gi, "").split(" ")
//                          , o = t.replace(i.filterRegLine, "").replace(i.filterRegBreak, "");
//                        if (o.length / r.length == 2 && r.length % 3 > 0 && "paste" == n) {
//                            dialog({
//                                id: "errornumbers",
//                                align: "top",
//                                skin: "tip",
//                                content: "粘贴内容中有个别组号码不完整，请再次检查输入号码！",
//                                quickClose: !0,
//                                onshow: function() {}
//                            }).show(u[0])
//                        } else
//                            s = o.length / r.length == 2 && o.length % r.length == 0 ? a.val().replace(i.filterRegLine, "b").replace(i.filterRegBreak, "").split("b") : a.val().replace(i.filterReg, " ").split(" ")
//                    } else
//                        s = a.val().replace(i.filterReg, " ").split(" ");
//                var y = function(e, t) {
//                    if ("undefined" == typeof t)
//                        return "TEXTAREA" == c ? 0 == m.find("li").size() && a.val(i.tipchs).select() : a.val(""),
//                        m.find("li").size() > 0 && a.val() != i.tipchs && $(l).find(".confirm").removeAttr("pass").removeClass("disabled"),
//                        !1;
//                    var n = $('<li><span/><em class="close"></em></li>');
//                    return a.val(t).trigger("keyup"),
//                    h(t, v, n, d, m, p, u, l, f, b, c),
//                    0 == e.length ? ($(l).find(".confirm").removeAttr("pass").removeClass("disabled"),
//                    !1) : (e.shift(),
//                    void setTimeout(function() {
//                        y(e, e[0])
//                    }
//                    , 2))
//                }
//                ;
//                return s.length > 100 ? m.find("li").size() > 0 ? (y(s, s[0]),
//                !1) : (g(s.join("; "), a, m, b, d, $(l).find(".total em"), e, f),
//                $(l).find(".confirm").removeAttr("pass").removeClass("disabled"),
//                !1) : void (s.length > 0 && y(s, s[0]))
//            }
//            ;
//            $(l).find(".confirm").attr("pass", 1).addClass("disabled"),
//            setTimeout(y, 300)
//        }
//        ;
//        $(s).off("keyup").on("keyup", ".box .editable", function(e) {
//            e.preventDefault();
//            var t, a = e ? e : event;
//            a.srcElement ? t = a.srcElement : a.target && (t = a.target);
//            var n = t.tagName
//              , r = $(this)
//              , o = $(this).prev("ul")
//              , c = $(this).parent(".box")
//              , u = $('<li><span/><em class="close"></em></li>')
//              , m = c.prev(".pos")
//              , p = !1
//              , g = 0;
//            g = $(s).find(".pos label.on").length;
//            var v = $(this).val();
//            v = v.replace(/[^\d]/g, ",");
//            var b = i.lengthMatchDict;
//            if (13 === e.keyCode || 32 === e.keyCode || 186 === e.keyCode || 188 === e.keyCode) {
//                if (("11y" == Lottery.cls || "pk10" === Lottery.cls) && 32 === e.keyCode) {
//                    String(Lottery.method);
//                    if ("undefined" != typeof b[Lottery.method]) {
//                        var y = parseInt(2 * b[Lottery.method], 10)
//                          , x = parseInt(2 * b[Lottery.method], 10) + (parseInt(b[Lottery.method], 10) - 1);
//                        if (v.replace(/,$/gi, "").split(",").length < b[Lottery.method] && v.length < x) {
//                            if (v.length >= (y > 6 ? 6 : y) && -1 != v.replace(/,$/gi, "").indexOf(","))
//                                return r.addClass("waiting"),
//                                !1;
//                            if (v.length < y && -1 == v.replace(/,$/gi, "").indexOf(","))
//                                return r.addClass("waiting"),
//                                !1
//                        }
//                    }
//                }
//                parseInt($(l).find(".total em").html(), 10) < 100 ? o.find("li").size() > 0 ? h(v, p, u, d, o, c, r, l, m, g, n) : 0 == parseInt($(l).find(".total em").html(), 10) && h(v, p, u, d, o, c, r, l, m, g, n) : o.find("li").size() > 1 ? h(v, p, u, d, o, c, r, l, m, g, n) : this.timeout && 186 !== e.keyCode && 13 !== e.keyCode && 32 !== e.keyCode && 188 !== e.keyCode ? (clearTimeout(this.timeout),
//                this.timeout = setTimeout(function() {
//                    f(e)
//                }
//                , 1e3)) : (clearTimeout(this.timeout),
//                this.timeout = setTimeout(function() {
//                    f(e)
//                }
//                , 1500))
//            } else
//                8 === e.keyCode && this.timeout && "" != v && (clearTimeout(this.timeout),
//                this.timeout = setTimeout(function() {
//                    f(e)
//                }
//                , 1e3));
//            "undefined" == typeof this.timeout && "" != v && (this.timeout = setTimeout(function() {
//                f(e)
//            }
//            , 1200))
//        }
//        ),
//        $(s).find(".box textarea.editable").off("click").on("click", function(e) {
//            $(this).val() && $(this).val().indexOf(i.tipchs) >= 0 ? ($(this).focus(),
//            $(this).select()) : ($(this).data("before") == i.tipchs || $(this).data("before") != $(this).val()) && setTimeout(function() {
//                f(e)
//            }
//            , 200)
//        }
//        );
//        var g = function(e, t, a, n, s, l, r, d) {
//            var o, c = [], u = 0;
//            e = e.replace(/[^\d]/g, ","),
//            e = e.replace(/^,+|,+$/g, ""),
//            e = e.replace(/,+/g, ","),
//            e = e.replace(/　/g, ",").replace(/；/g, ",").replace(/，/g, ",").replace(/;/g, ","),
//            o = e.split(","),
//            o = Q.unique(o),
//            o.sort();
//            for (var m = 0; m < o.length; m++) {
//                var p = !1
//                  , h = o[m];
//                switch (("11y" === Lottery.cls || "pk10" === Lottery.cls) && (h = h.split(/(?=(?:\d{2})+?$)/)),
//                s[1]) {
//                case "zx":
//                    p = parseInt(s[2], 10) === h.length;
//                    break;
//                case "zux":
//                case "hh":
//                    h = h.split("").sort().join("");
//                    var f = new RegExp("(\\d)\\1{" + (s[2] - 1) + "}");
//                    p = h.length === parseInt(s[2], 10) && null  === h.match(f);
//                    break;
//                case "zx11":
//                    var g = h.concat([]);
//                    p = parseInt(s[2], 10) === Q.unique(h).length && Q.unique(h).length === g.length;
//                    for (var v = 0; v < h.length; v++)
//                        p = p && 2 === h[v].length && parseInt(h[v], 10) >= 1 && parseInt(h[v], 10) <= 11;
//                    break;
//                case "zux11":
//                case "rx":
//                    var g = h.concat([]);
//                    p = parseInt(s[2], 10) === Q.unique(h).length && Q.unique(h).length === g.length;
//                    for (var v = 0; v < h.length; v++)
//                        p = p && 2 === h[v].length && parseInt(h[v], 10) >= 1 && parseInt(h[v], 10) <= 11;
//                    h = h.sort();
//                    break;
//                case "pkzux":
//                    var b = h.join("||");
//                    if (p = parseInt(s[2], 10) === h.length)
//                        for (var y = 0; y < h.length; y++) {
//                            if (b.indexOf(h[y]) != b.lastIndexOf(h[y])) {
//                                p = !1;
//                                break
//                            }
//                            if (p = !0,
//                            !(parseInt(h[y]) >= 1 && parseInt(h[y]) <= 10)) {
//                                p = !1;
//                                break
//                            }
//                            p = !0
//                        }
//                }
//                h = "11y" === Lottery.cls || "pk10" === Lottery.cls ? h.join(",") : h.split("").join(","),
//                p ? c.push(h) : t.val("")
//            }
//            c = Q.unique(c),
//            c.length > 0 ? (t.val(c.join("; ").replace(/,/g, "")).trigger("click"),
//            a.hide(),
//            u = c.length,
//            d.length > 0 && (u *= Math.combination(n, s[2])),
//            l.html(u),
//            i.calcMoney(r)) : (a.show(),
//            l.html(0),
//            i.calcMoney(r))
//        }
//        ;
//        $(s).off("paste").on("paste", ".box .editable", f),
//        $(s).off("change").on("change", ".box .editable", f)
//    },
    addOrderApi: function(e, t, a, n) {
        var i = this;
        Api.addOrder(e, function(s) {
            if (t.html(a).removeClass("loading"),
            -1 === s)
                $(".quickSubmit-orders").length > 0 && i.resetOrders(),
                User.chkLogin(function() {
                    i.addOrderApi(e, t, a, n)
                }
                );
            else {
                if (s.code = parseInt(s.code, 10),
                1 === s.code)
                    if ("WBGMMC" !== i.lt ? i.resetOrders() : (0 == $(".quickSubmit-orders").length && t.addClass("disabled"),
                    $("#lottery, #lotteryClass").addClass("mask"),
                    $(".gotop").trigger("click")),
                    n.content("订单提交成功！"),
                    n.show(),
                    "WBGMMC" === i.lt && void 0 !== i.flipball) {
                        var l = parseFloat(parseFloat(s.result.bonus, 10).toFixed(4))
                          , r = s.result.code.split(",")
                          , d = dialog({
                            skin: "tip",
                            align: "top",
                            fixed: !0,
                            content: "未中奖，再来一次！"
                        });
                        i.flipball.flip(r, !0, function() {
                            l > 0 && d.content("恭喜您中奖了！奖金：￥" + l),
                            i.updateRecency(),
                            i.updateIssueInfo(),
                            d.show(t[0]),
                            setTimeout(function() {
                                d.close().remove(),
                                $("#lottery, #lotteryClass").removeClass("mask"),
                                $(".quickSubmit-orders").length > 0 ? i.resetOrders() : t.removeClass("disabled")
                            }
                            , 2500)
                        }
                        )
                    } else
                        i.updateRecency();
                else if (4001 === s.code)
                    var o = dialog({
                        title: "余额不足",
                        fixed: !0,
                        content: '<p>对不起，您的余额不足，为保证您可以顺利购彩</p><p>建议您充值后再进行购彩。</p><a href="' + User.app + '/pay/rechargeIndexView" target="_blank" class="btn-recharge">立刻充值</a>',
                        onshow: function() {
                            $(this.node).find(".btn-recharge").unbind("click").click(function(e) {
                                o.close().remove()
                            }
                            ),
                            $(".quickSubmit-orders").length > 0 && i.resetOrders()
                        }
                    }).showModal();
                else
                    s.msg && (n.content(s.msg),
                    $(".quickSubmit-orders").length > 0 && i.resetOrders(),
                    n.show(t[0]));
                setTimeout(function() {
                    n.close().remove()
                }
                , 2e3),
                User.updateMoney(),
                Navigation.getUserMoney()
            }
        }
        )
    },
    addOrderMMCLoopApi: function(e, t, a, n, i) {
        var s, l, r = this, d = $("#mmcLoop input[type=checkbox]").is(":checked"), o = !0;
        dialog.get("mmc_loop_box") && (l = $(dialog.get("mmc_loop_box").node).find(".btn-mmc-loop"),
        2 == l.attr("data-type")) || Api.addOrder(e, function(c) {
            if (t.html(a).removeClass("loading"),
            -1 === c)
                $(".quickSubmit-orders").length > 0 && r.resetOrders(),
                User.chkLogin(function() {
                    r.addOrderMMCLoopApi(e, t, a, n, i)
                }
                );
            else {
                if (c.code = parseInt(c.code, 10),
                1 === c.code) {
                    0 == $(".quickSubmit-orders").length && t.addClass("disabled"),
                    $("#lottery, #lotteryClass").addClass("mask"),
                    $(".gotop").trigger("click"),
                    dialog.get("mmc_loop_box") || (s = dialog({
                        title: "连续开奖",
                        id: "mmc_loop_box",
                        skin: "mmc-loop",
                        fixed: !0,
                        content: '<p><span>第<em id="mmcLoopNow">0</em>次</span><span>已中奖<em id="mmcLoopDone">0</em>次</span><span>总共<em>' + i + '</em>次</span></p><p class="mmc-last-prize"><span>[第<b id="mmcLoopPrize">0</b>次中奖：<b id="mmcLoopMoney">0</b>元]</span></p><p class="mmc-amount"><span>共中奖：<em id="mmcLoopAmount">0</em>元</span></p><a href="javascript:;" class="btn-mmc-loop" data-type="1">停止</a>',
                        onshow: function() {
                            l = $(this.node).find(".btn-mmc-loop");
                            var s = $(this.node).find(".ui-dialog-close");
                            s.css("visibility", "hidden"),
                            l.unbind("click").click(function(d) {
                                var c = parseInt(l.attr("data-type"), 10);
                                switch (c) {
                                case 1:
                                    l.html("继续").attr("data-type", 2),
                                    s.css("visibility", "visible"),
                                    o = !1;
                                    break;
                                case 2:
                                    l.html("停止").attr("data-type", 1),
                                    s.css("visibility", "hidden"),
                                    r.addOrderMMCLoopApi(e, t, a, n, i);
                                    break;
                                case 3:
                                    setTimeout(function() {
                                        s.trigger("click")
                                    }
                                    , 500)
                                }
                            }
                            )
                        },
                        onclose: function() {
                            $(".quickSubmit-orders").length > 0 ? r.resetOrders() : t.removeClass("disabled"),
                            $("#lottery, #lotteryClass").removeClass("mask")
                        }
                    }).showModal());
                    var u = parseInt($(".btn-mmc-loop").attr("data-type"), 10)
                      , m = parseFloat(parseFloat(c.result.bonus, 10).toFixed(4))
                      , p = c.result.code.split(",");
                    r.flipball.flip(p, !0, function() {
                        if ($("#mmcLoopNow").html(parseInt($("#mmcLoopNow").html(), 10) + 1),
                        parseInt($("#mmcLoopNow").html(), 10) === i && ($(".btn-mmc-loop").html("确定").attr("data-type", 3),
                        $("#mmcLoopNow").parent("span").hide(),
                        $("#mmcLoopPrize").parent("span").hide(),
                        o = !1),
                        1 !== u && (o = !1),
                        m > 0 && d) {
                            $(".btn-mmc-loop").html("确定").attr("data-type", 3),
                            $("#mmcLoopDone").html(parseInt($("#mmcLoopDone").html(), 10) + 1),
                            $("#mmcLoopPrize").html($("#mmcLoopNow").html()),
                            $("#mmcLoopMoney").html(m);
                            var s = parseFloat((parseFloat($("#mmcLoopAmount").html(), 10) + m).toFixed(4));
                            $("#mmcLoopAmount").html(s),
                            o = !1
                        } else if (m > 0) {
                            $("#mmcLoopDone").html(parseInt($("#mmcLoopDone").html(), 10) + 1),
                            $("#mmcLoopPrize").html($("#mmcLoopNow").html()),
                            $("#mmcLoopMoney").html(m);
                            var s = parseFloat((parseFloat($("#mmcLoopAmount").html(), 10) + m).toFixed(4));
                            $("#mmcLoopAmount").html(s)
                        }
                        r.updateRecency(),
                        r.updateIssueInfo(),
                        o && r.addOrderMMCLoopApi(e, t, a, n, i)
                    }
                    )
                } else if (4001 === c.code)
                    var h = dialog({
                        title: "余额不足",
                        fixed: !0,
                        content: '<p>对不起，您的余额不足，为保证您可以顺利购彩</p><p>建议您充值后再进行购彩。</p><a href="' + User.app + '/pay/rechargeIndexView" target="_blank" class="btn-recharge">立刻充值</a>',
                        onshow: function() {
                            $(".btn-mmc-loop").html("继续").attr("data-type", 2),
                            $(".mmc-loop .ui-dialog-close").css("visibility", "visible"),
                            $(this.node).find(".btn-recharge").unbind("click").click(function(e) {
                                h.close().remove()
                            }
                            )
                        }
                    }).showModal();
                User.updateMoney(),
                Navigation.getUserMoney()
            }
        }
        )
    },
//    renderCodes: function(e, t, a) {
//        var n = this
//          , i = ""
//          , s = ["大", "小", "单", "双", "奇<br>奇>偶", "和<br>奇=偶", "偶<br>奇<偶", "上<br>上>下", "中<br>上=下", "下<br>上<下", "大.单", "大.双", "小.单", "小.双", "龙", "虎"]
//          , l = ["大", "小", "单", "双", "奇", "和", "偶", "上", "中", "下", "大.单", "大.双", "小.单", "小.双", "龙", "虎"]
//          , r = ["dxds", "qw", "dx", "ds", "lh"];
//        t = t.split("-"),
//        a = a.split("_"),
//        "kl8" === n.cls && 1 === e && (t[0] = 41,
//        t[1] = 80);
//        for (var d = parseInt(t[0]); d <= parseInt(t[1]); d++)
//            i += -1 != r.indexOf(a[0]) ? d > 3 && 10 > d ? '<i class="ft ft2" data-val="' + l[d] + '">' + s[d] + "</i>" : d > 9 && 14 > d ? '<i class="ft ft1" data-val="' + l[d] + '">' + s[d] + "</i>" : "<i>" + s[d] + "</i>" : ("11y" === n.cls || "kl8" === n.cls || "pk10" === n.cls && "hz" != a[0]) && 10 > d ? "<i>0" + d + "</i>" : "<i>" + d + "</i>";
//        return i
//    },
    renderBtns: function(e) {
        var t = this
          , a = ""
          , n = []
          , i = [];
        if ("all" === e)
            n = ["全", "大", "小", "奇", "偶", "清"],
            i = ["i", ":gt", ":lt", ":odd", ":even", ""],
            ("11y" === t.cls || "pk10" === t.cls) && (i[3] = ":even",
            i[4] = ":odd");
        else {
            if ("two" !== e)
                return "";
            n = ["全", "清"],
            i = ["i", ""]
        }
        for (var s = 0; s < n.length; s++)
            a += '<button data-filter="' + i[s] + '">' + n[s] + "</button>";
        return a = '<div class="fr numBtns">' + a + "</div>"
    },
    renderBox: function(e) {
        var t = this
          , a = function() {
            for (var e, t = 3, a = document.createElement("div"), n = a.getElementsByTagName("i"); a.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->",
            n[0]; )
                ;
            return t > 4 ? t : e
        }
        ();
        return t.ie = a,
        '<div class="box"><ul class="clearfix"></ul><textarea class="editable">' + e + '</textarea></div><div class="fr box-input"><input type="button" class="upload" value="导入文件"><input type="button" class="clear" value="清空"></div>'
    },
//    numHandler: function(e, t, a) {
//        t.preventDefault(),
//        t.stopPropagation();
//        var n = this
//          , i = t.target;
//        if ("I" === i.nodeName) {
//            var s = n.method.split("_");
//            if ("rxx" === s[1] && "rx1" !== s[2] && $(e).find(".number i.on").length > 7 && !$(i).hasClass("on"))
//                return !1;
//            $(i).toggleClass("on"),
//            $(i).addClass("ball").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
//                $(this).removeClass("ball")
//            }
//            ),
//            "pk10" == n.cls && n.updateOdds(),
//            n.calcNum(e, t)
//        } else if ("BUTTON" === i.nodeName) {
//            var l = $(i).parents("dd").find("i")
//              , r = $(i).data("filter");
//            ":gt" === r ? r += "(" + Math.floor(l.length / 2 - 1) + ")" : ":lt" === r ? r += "(" + Math.floor(l.length / 2) + ")" : r = r,
//            l.removeClass("on").filter(r).addClass("on"),
//            n.calcNum(e, t)
//        } else if ("LABEL" === i.nodeName) {
//            var d = $(i).parents(".pos");
//            $(i).toggleClass("on"),
//            d.next(".box").length > 0 ? n.calcSingleNum(e, t, a) : n.calcNum(e, t)
//        } else {
//            var o = i.className;
//            if ("box" === o)
//                $(i).find("input").focus();
//            else if ("close" === o)
//                $(i).parent("li").fadeOut("slow", function() {
//                    $(i).parent("li").remove(),
//                    n.calcSingleNum(e, t, a)
//                }
//                );
//            else if ("clear" === o) {
//                var c = $(e).find(".number .box");
//                if (c.find("ul li").length > 0 || c.find("textarea").length > 0)
//                    var u = dialog({
//                        title: "温馨提示",
//                        skin: "confirm-again",
//                        content: "您确定要清空当前选号码？",
//                        button: [{
//                            id: "clear_ok",
//                            value: "确定",
//                            callback: function() {
//                                c.find("ul").empty(),
//                                c.find("textarea").not(".editable").remove(),
//                                0 == c.find("textarea").size() && c.append('<textarea class="editable"></textarea>'),
//                                c.find("textarea.editable").removeAttr("readonly").height(93).val(n.tipchs).select(),
//                                c.find("ul, input").show(),
//                                $(e).find(".pos label").removeClass("on"),
//                                n.calcSingleNum(e, t, a),
//                                u.close().remove()
//                            }
//                        }, {
//                            id: "clear_cancel",
//                            skin: "cancel",
//                            value: "取消"
//                        }]
//                    }).showModal()
//            } else {
//                if ("upload" !== o)
//                    return !1;
//                var m = '<div id="uploader"><div class="progress"><div class="progress-bar"></div></div><p class="tip">每注号码之间请用一个 空格[ ]、逗号[,] 或者 分号[;] 隔开</p><input type="text" readonly="readonly" class="fileName" placeholder="请选择您要上传的txt文件" /><div id="filePicker">选择文件</div><div class="webuploader-upload disabled">开始上传</div>'
//                  , p = dialog({
//                    skin: "tip",
//                    align: "top"
//                })
//                  , u = dialog({
//                    title: "温馨提示",
//                    id: "uploader-pop",
//                    fixed: !0,
//                    skin: "sobet upload",
//                    padding: 0,
//                    content: m,
//                    onshow: function() {
//                        var t = $("#uploader")
//                          , i = t.find(".webuploader-upload")
//                          , s = t.find(".progress")
//                          , l = new WebUploader.Uploader({
//                            swf: "/static/lottery/scripts/Uploader.swf",
//                            server: Api.geturl("uploadCode"),
//                            pick: "#filePicker",
//                            accept: {
//                                title: "Text",
//                                extensions: "txt",
//                                mimeTypes: "text/*"
//                            }
//                        });
//                        l.on("fileQueued", function(e) {
//                            t.find(".fileName").val(e.name),
//                            i.removeClass("disabled")
//                        }
//                        ),
//                        l.on("uploadProgress", function(e, t) {
//                            s.find(".progress-bar").css("width", 100 * t + "%")
//                        }
//                        ),
//                        l.on("uploadSuccess", function(r, d) {
//                            -1 === d ? ($(".loginlnk").trigger("click"),
//                            i.addClass("disabled"),
//                            s.slideUp("fast"),
//                            t.find(".fileName").val(""),
//                            l.reset()) : (i.addClass("disabled"),
//                            s.slideUp("fast"),
//                            t.find(".fileName").val(""),
//                            u.close().remove(),
//                            n.handleSingleNums(e, a, d))
//                        }
//                        ),
//                        l.on("uploadError", function(e) {
//                            i.addClass("disabled"),
//                            s.slideUp("fast"),
//                            t.find(".fileName").val(""),
//                            p.content("上传出错"),
//                            p.show(i[0]),
//                            setTimeout(function() {
//                                p.close().remove()
//                            }
//                            , 1500)
//                        }
//                        ),
//                        i.on("click", function() {
//                            return $(this).hasClass("disabled") ? !1 : (l.upload(),
//                            i.addClass("disabled"),
//                            void s.slideDown("fast"))
//                        }
//                        )
//                    }
//                }).showModal()
//            }
//        }
//    },
    handleSingleNums: function(e, t, a) {
        var n = this
          , i = "";
        a = a.result.code,
        a = a.replace(/[^\d]/g, ","),
        a = a.replace(/^,+|,+$/g, ""),
        a = a.replace(/,+/g, ",");
        var s, l = $(e).find(".count"), r = $(e).find(".number .box"), d = dialog({
            fixed: !0,
            skin: "tip",
            padding: "10px 15px",
            content: '<p>正在校验选号，请稍等  . . .</p><br><p style="margin-top:10px;"><span class="ui-dialog-loading">Loading..</span></p>'
        }), o = function() {
            var a, s = [], o = 0;
            i = i.replace(/[^\d]/g, ","),
            i = i.replace(/^,+|,+$/g, ""),
            i = i.replace(/,+/g, ","),
            a = i.split(","),
            a = Q.unique(a),
            a.sort();
            for (var c = 0; c < a.length; c++) {
                var u = !1
                  , m = a[c];
                switch (("11y" === Lottery.cls || "pk10" === Lottery.cls) && (m = m.split(/(?=(?:\d{2})+?$)/)),
                t[1]) {
                case "zx":
                    u = parseInt(t[2], 10) === m.length;
                    break;
                case "zux":
                case "hh":
                    m = m.split("").sort().join("");
                    var p = new RegExp("(\\d)\\1{" + (t[2] - 1) + "}");
                    u = m.length === parseInt(t[2], 10) && null  === m.match(p);
                    break;
                case "zx11":
                    var h = m.concat([]);
                    u = parseInt(t[2], 10) === Q.unique(m).length && Q.unique(m).length === h.length;
                    for (var f = 0; f < m.length; f++)
                        u = u && 2 === m[f].length && parseInt(m[f], 10) >= 1 && parseInt(m[f], 10) <= 11;
                    break;
                case "zux11":
                case "rx":
                    var h = m.concat([]);
                    u = parseInt(t[2], 10) === Q.unique(m).length && Q.unique(m).length === h.length;
                    for (var f = 0; f < m.length; f++)
                        u = u && 2 === m[f].length && parseInt(m[f], 10) >= 1 && parseInt(m[f], 10) <= 11;
                    m = m.sort();
                    break;
                case "pkzux":
                    var g = m.join("||");
                    if (u = parseInt(t[2], 10) === m.length)
                        for (var v = 0; v < m.length; v++) {
                            if (g.indexOf(m[v]) != g.lastIndexOf(m[v])) {
                                u = !1;
                                break
                            }
                            if (u = !0,
                            !(parseInt(m[v]) >= 1 && parseInt(m[v]) <= 10)) {
                                u = !1;
                                break
                            }
                            u = !0
                        }
                }
                m = "11y" === Lottery.cls || "pk10" === Lottery.cls ? m.join(",") : m.split("").join(","),
                u && s.push(m)
            }
            s = Q.unique(s),
            s.length > 0 ? (d.close().remove(),
            r.find("textarea.editable").attr("readonly", "readonly").val(s.join("; ").replace(/,/g, "")),
            r.find("textarea.editable").trigger("change"),
            r.find("ul").hide(),
            r.find("input").hide(),
            o = s.length,
            r.prev(".pos").length > 0 && (o *= Math.combination(r.prev(".pos").find("label.on").length, t[2])),
            l.find(".total em").html(o),
            n.calcMoney(e)) : (d.close().remove(),
            r.find("ul").show(),
            r.find("input").show(),
            l.find(".total em").html(0),
            n.calcMoney(e))
        }
        ;
        s = dialog({
            title: "单式上传选号",
            id: "code-box",
            fixed: !0,
            skin: "sobet code-box",
            width: 480,
            height: 325,
            padding: "15px",
            content: "<textarea>" + a + "</textarea><p>注：确认导入之后，选号将不可编辑</p>",
            button: [{
                id: "cancle_ok",
                skin: "code-box-ok",
                value: "确认导入",
                callback: function() {
                    r.find("textarea").not(".editable").remove(),
                    i = $(this.node).find("textarea").val(),
                    dialog.get("code-box").close().remove(),
                    d.showModal()
                }
            }, {
                id: "cancle_cancel",
                skin: "cancel",
                value: "取消"
            }]
        }).showModal(),
        d.addEventListener("show", function() {
            setTimeout(function() {
                o()
            }
            , 500)
        }
        )
    },
    calcNum: function(e, t) {
        var a = this
          , n = t.delegateTarget
          , i = $(e).find(".count")[0]
          , s = $(e).find(".subtab dd.on").data("type").split("_");
        s.unshift($(n).siblings(".tab").attr("data-type")),
        $(i).find(".total em").html(a.getStack(n, s)),
        a.calcMoney(e)
    },
    calcSingleNum: function(e, t, a) {
        var n, i = this, s = $(e).find(".count")[0], l = 0, r = $(s).find(".odds em").html(), d = $(s).find(".times input").val(), o = $(s).find(".mode select").val(), c = $(e).find(".number .pos"), u = $(e).find(".number .box textarea");
        l = u.length > 0 && !u.hasClass("editable") ? u.val().split("; ").length : $(s).siblings(".number").find("ul li").length,
        c.length > 0 && (l *= Math.combination(c.find("label.on").length, a[2])),
        n = i.getMoneyWin(0, r, l, d, o, "", i.method),
        $(s).find(".total em").html(l),
        $(s).find(".money em").html(n.money),
        $(s).find(".odds select").data("times", n.wintime),
        i.calcMoney(e)
    },
    getStack: function(e, t) {
        var a = 1
          , n = []
          , i = 0
          , s = 0;
        if ($(e).children("dl").each(function(e, t) {
            if ($(t).find("i.on").length > 0) {
                var a = [];
                $(t).find("i.on").each(function(e, t) {
                    a.push($(t).html())
                }
                ),
                n.push(a)
            } else
                n.push([])
        }
        ),
        i = $(e).find(".pos label.on").length,
        s = parseInt(t[0].charAt(t[0].length - 1)),
        "zx" === t[1])
            switch (t[2]) {
            case "fs":
            case "zh":
            case "hfs":
            case "qfs":
                for (var l = 0, r = 0, d = 0, o = 0, c = 0, u = 0; u < n.length; u++) {
                    var m = n[u].length;
                    a *= parseInt(m, 10)
                }
                "zh" === t[2] && (a *= n.length),
                ("rx2" === t[0] || "rx3" === t[0] || "rx4" === t[0]) && (l = n[0].length,
                r = n[1].length,
                d = n[2].length,
                o = n[3].length,
                c = n[4].length,
                "rx2" === t[0] && (a = l * (r + d + o + c) + r * d + (r + d) * (o + c) + o * c),
                "rx3" === t[0] && (a = (l * r + l * d + r * d) * (o + c) + l * r * d + (l + r + d) * o * c),
                "rx4" === t[0] && (a = l * r * d * o + l * r * d * c + l * r * o * c + l * d * o * c + r * d * o * c));
                break;
            case "hz":
            case "hhz":
            case "qhz":
                var p = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
                  , h = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
                a = 0;
                for (var u = 0; u < n[0].length; u++) {
                    var f = n[0][u];
                    a += "hz" === t[2] && "rx2" !== t[0] ? p[f] : h[f]
                }
                ("rx2" === t[0] || "rx3" === t[0]) && (a *= Math.combination(i, s))
            }
        else if ("zux" === t[1]) {
            var f = n[0] || []
              , d = n[1] || [];
            switch (t[2]) {
            case "z120":
                a = Math.combination(f.length, 5);
                break;
            case "z60":
                var g = Math.combination(d.length, 3)
                  , v = Math.difference(f, d).length
                  , b = Math.intersection(f, d).length
                  , y = Math.combination(d.length - 1, 3) * b;
                a = g * v + y;
                break;
            case "z30":
                var g = Math.combination(f.length, 2)
                  , v = Math.combination(d.length, 1)
                  , b = Math.intersection(f, d).length;
                a = g * v - (f.length - 1) * b;
                break;
            case "z20":
                var g = Math.combination(d.length, 2)
                  , v = Math.difference(f, d).length
                  , b = Math.intersection(f, d).length
                  , y = Math.combination(d.length - 1, 2) * b;
                a = g * v + y;
                break;
            case "z10":
                var g = Math.combination(d.length, 1)
                  , v = Math.difference(f, d).length
                  , b = Math.intersection(f, d).length
                  , y = Math.combination(d.length - 1, 1) * b;
                a = g * v + y;
                break;
            case "z5":
                var g = Math.combination(d.length, 1)
                  , v = Math.difference(f, d).length
                  , b = Math.intersection(f, d).length
                  , y = Math.combination(d.length - 1, 1) * b;
                a = g * v + y;
                break;
            case "z24":
                a = Math.combination(f.length, 4),
                "rx4" === t[0] && (a *= Math.combination(i, s));
                break;
            case "z12":
                var g = Math.combination(d.length, 2)
                  , v = Math.difference(f, d).length
                  , b = Math.intersection(f, d).length
                  , y = Math.combination(d.length - 1, 2) * b;
                a = g * v + y,
                "rx4" === t[0] && (a *= Math.combination(i, s));
                break;
            case "z6":
                a = "sx" === t[0] || "rx4" === t[0] ? Math.combination(f.length, 2) : Math.combination(f.length, 3),
                ("rx3" === t[0] || "rx4" === t[0]) && (a *= Math.combination(i, s));
                break;
            case "z4":
                var g = Math.combination(d.length, 1)
                  , v = Math.difference(f, d).length
                  , b = Math.intersection(f, d).length
                  , y = Math.combination(d.length - 1, 1) * b;
                a = g * v + y,
                "rx4" === t[0] && (a *= Math.combination(i, s));
                break;
            case "z3":
                a = f.length * (f.length - 1),
                "rx3" === t[0] && (a *= Math.combination(i, s));
                break;
            case "hz":
            case "hhz":
            case "qhz":
                var p = [1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1]
                  , h = [1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1];
                a = 0;
                for (var u = 0; u < n[0].length; u++) {
                    var f = n[0][u];
                    a += "hz" === t[2] && "rx2" !== t[0] ? p[f - 1] : h[f - 1]
                }
                ("rx2" === t[0] || "rx3" === t[0]) && (a *= Math.combination(i, s));
                break;
            case "hfs":
            case "qfs":
            case "fs":
                a = Math.combination(f.length, 2),
                ("rx2" === t[0] || "rx3" === t[0]) && (a *= Math.combination(i, s))
            }
        } else if (0 == t[1].indexOf("cq")) {
            var x = !0;
            if ($(n).each(function() {
                var e = arguments[1];
                return 0 == e.length ? (x = !1,
                !1) : void 0
            }
            ),
            x) {
                var k = []
                  , z = function(e) {
                    if (1 != e.length) {
                        for (var t = 0; t < e[0].length; t++)
                            for (var a = 0; a < e[1].length; a++)
                                if (-1 == String(e[0][t]).indexOf(e[1][a])) {
                                    var n = e[0][t] + "-" + e[1][a];
                                    k.push(n)
                                }
                        e.splice(0, 2, k),
                        k = [],
                        z(e)
                    }
                }
                ;
                z(n),
                a = n[0].length
            } else
                a = 0
        } else if ("dwd" === t[1]) {
            a = 0;
            for (var u = 0; u < n.length; u++)
                a += n[u].length
        } else if ("bdd" === t[1])
            switch (t[2]) {
            case "hs1":
            case "qs1":
            case "bdd1":
                a = n[0].length;
                break;
            case "hs2":
            case "qs2":
            case "bdd2":
                var w = n[0].length;
                a = w * (w - 1) / 2,
                a = Math.combination(n[0].length, 2);
                break;
            case "bdd11y":
                a = n[0].length
            }
        else if ("dxds" === t[1])
            a = n[0].length * n[1].length;
        else if ("dx" === t[1] || "ds" === t[1] || "hz" === t[1] || "lh" === t[1])
            a = n[0].length;
        else if ("sm" === t[1])
            switch (t[2]) {
            case "zxfs":
                a = 0;
                for (var u = 0; u < n[0].length; u++)
                    for (var C = 0; C < n[1].length; C++)
                        if (n[1][C] !== n[0][u])
                            for (var w = 0; w < n[2].length; w++)
                                n[2][w] !== n[0][u] && n[2][w] !== n[1][C] && (a += 1);
                break;
            case "zuxfs":
                a = Math.nzn(n[0].length, 3)
            }
        else if ("em" === t[1])
            switch (t[2]) {
            case "zxfs":
                var g = n[0].length * n[1].length
                  , v = Math.intersection(n[0], n[1]).length;
                a = g - v;
                break;
            case "zuxfs":
                a = Math.nzn(n[0].length, 2)
            }
        else if ("rxfs" === t[1])
            a = Math.round(Math.nzn(n[0].length, parseInt(t[2], 10)));
        else if ("qw" === t[1])
            a = n[0].length;
        else if ("rxx" === t[1]) {
            var f = n[0].length + n[1].length
              , d = parseInt(t[2].charAt(t[2].length - 1), 10);
            a = "rx1" === t[2] ? f : Math.combination(f, d)
        }
        return a
    },
    calcMoney: function(e) {
        var t = $(e).find(".count")[0]
          , a = parseInt($(t).find(".total em").html(), 10)
          , n = parseInt($(t).find(".times input").val(), 10)
          , i = parseFloat($(t).find(".mode input:checked").val(), 10)
          , s = parseFloat($(t).find(".odds select").val(), 10)
          , l = parseFloat($(t).find(".odds select option:checked").data("point"), 10)
          , r = $(t).find(".money em")
          , d = $(t).find(".confirm")
          , o = $(t).find(".quickSubmit")
          , c = a * n * i
          , u = $(e).find(".number .pos label")
          , m = [];
        if (c = c.toFixed(Math.precision(i)),
        !(a > 0))
            return d.addClass("disabled"),
            o.addClass("disabled"),
            $(t).removeAttr("data-count"),
            r.html(c),
            !1;
        if (d.removeClass("disabled"),
        o.removeClass("disabled"),
        r.html("￥" + c),
        u.length > 0)
            for (var p = 0; p < u.length; p++) {
                var h = $(u[p]);
                h.hasClass("on") && m.push(h.attr("data-pos"))
            }
        var f = 1;
        "undefined" != typeof $(t).find(".odds select").data("times") && (f = parseInt($(t).find(".odds select").data("times"), 10)),
        $(t).attr("data-count", [a, n, i, s, l, c, m.join(","), f].join("|"))
    },
    countReset: function(e) {
        var t = this
          , a = $(e).find(".count")
          , n = $(e).find(".orders");
        if (t.old_lt !== t.lt)
            $(a).find(".times input").val("1"),
            $(a).find(".mode label").eq(0).click();
        else {
            var i = $(a).find(".mode .modeSelect");
            i.length > 0 ? i.click() : $(a).find(".mode label").eq(0).click()
        }
        if (0 == $(".quickSubmit-orders").length)
            $(e).find(".count .confirm").addClass("disabled"),
            $(a).find(".total em").html("0"),
            $(a).find(".money em").html("0"),
            $(".quickSubmit").addClass("disabled"),
            "pk10" == t.cls && -1 != t.method.indexOf("hz_hz") && ($(a).find(".odds em").show().html(0),
            $(a).find("select").hide());
        else {
            var s = $(e).find(".number .box textarea.editable");
            s.length > 0 && ($(e).find(".count .confirm").addClass("disabled"),
            $(".quickSubmit").addClass("disabled"))
        }
        $(n).find(".submit").removeClass("loading"),
        t.old_lt = t.lt
    },
    getOrder: function() {
        var e = this
          , t = $("#" + this.type)
          , a = (t.find(".tab"),
        t.find(".subtab"),
        t.find(".count").attr("data-count").split("|"))
          , n = e.getCode(t.find(".number"))
          , i = Q.getMethodName(e.method, e.lt)
          , s = "";
        if ("pk10" == e.cls && -1 != e.method.indexOf("hz"))
            return n = n.split(","),
            a[0] = 1,
            a[5] = a[2],
            $(n).each(function() {
                var t, n = arguments[1], l = e.descFormat(n, e.method), r = Q.PkHzNum[e.method.split("_")[2]];
                $(r).each(function() {
                    return -1 != arguments[1].split("_").indexOf(n) ? (t = e.method + "_" + arguments[1],
                    !1) : void 0
                }
                );
                var d = e.odds[e.lt][t];
                if (void 0 !== d.point) {
                    var o = $("#lottery .count .odds select option:selected").attr("data-point");
                    if (0 == o) {
                        var c = (d.odds + d.x * d.point).toFixed(3);
                        a[3] = c.substr(0, c.length - 1)
                    } else
                        a[3] = d.odds
                } else
                    a[3] = d.odds;
                var u = e.getMoneyWin(0, a[3], a[0], a[1], a[2], n, t).win;
                s += $(".quickSubmit-orders").length > 0 ? '<li class="quickSubmit-li" ' : "<li ",
                s += 'data-type="' + t + '" data-code="' + n + '" data-desc="' + i + " " + l + '" data-count="' + a.join("|") + '"><div class="codes" title="' + i + " " + Q.getPositionName(a[6]) + l + '">' + i + Q.getPositionName(a[6]) + "<em>" + l + '</em></div><div class="odds">' + a[3] + '</div><div class="share"> <input type="text" class="spinner newInput biggerw" min="1" max="99999" step="1" value="' + a[1] + '" /> </div><div class="money">￥' + a[5] + '</div><div class="win">￥' + u + '</div><a href="javascript:;" class="delete" title="删除"></a> </li>'
            }
            ),
            s;
        var l = e.getMoneyWin(0, a[3], a[0], a[1], a[2], n, e.method).win
          , r = e.descFormat(n, e.method);
        return s += $(".quickSubmit-orders").length > 0 ? '<li class="quickSubmit-li" ' : "<li ",
        s += 'data-type="' + e.method + '" data-code="' + n + '" data-desc="' + i + " " + r + '" data-count="' + a.join("|") + '"><div class="codes" title="' + i + " " + Q.getPositionName(a[6]) + r + '">' + i + Q.getPositionName(a[6]) + "<em>" + r + '</em></div><div class="odds">' + a[3] + '</div><div class="share"> <input type="text" class="spinner newInput biggerw" min="1" max="99999" step="1" value="' + a[1] + '" /> </div><div class="money">￥' + a[5] + '</div><div class="win">￥' + l + '</div><a href="javascript:;" class="delete" title="删除"></a> </li>',
        0 == $(".quickSubmit-orders").length && $(t).find(".count .confirm").addClass("disabled"),
        s
    },
    getCode: function(e) {
        var t = this
          , a = e.children("dl")
          , n = e.find(".box ul li")
          , i = e.find(".box textarea")
          , s = []
          , l = t.method.split("_");
        if (a && a.length > 0) {
            for (var r = 0, d = a.length; d > r; r++) {
                for (var o = $(a[r]).find("i.on"), c = [], u = 0; u < o.length; u++)
                    "qw" === l[0] ? c.push($(o[u]).attr("data-val")) : c.push($(o[u]).html());
                s.push(c.join(","))
            }
            "market" !== t.type && 0 == $(".quickSubmit-orders").length && $(e).find("i").removeClass("on")
        } else if (n && n.length > 0) {
            for (var r = 0; r < n.length; r++)
                s.push($(n[r]).attr("data-code"));
            "lottery" === t.type && $(e).find(".box ul").empty()
        } else
            i && i.length > 0 && (s = i.val(),
            "undefined" != typeof i.attr("readonly") && i.removeAttr("readonly"),
            s = s.replace(/\s+/g, "").split(";"),
            s = "11y" === t.cls || "pk10" === t.cls ? s.map(function(e) {
                return e.match(/\d{1,2}/g).join(",")
            }
            ) : s.map(function(e) {
                return e.split("").join(",")
            }
            ),
            i.hasClass("editable") || i.remove(),
            0 == e.find(".box textarea").size() && (e.find(".box").append('<textarea class="editable"></textarea>'),
            e.find(".box textarea").val(t.tipchs)),
            e.find(".box ul, .box input").show());
        return s.join("|")
    },
    descFormat: function(e, t) {
        t.split("_"),
        e.split("|");
        return e.split(",").join("").split("|").join(",")
    },
    getMoneyWin: function(e, t, a, n, i, s, l) {
        var r = 0
          , d = 0
          , o = 1
          , c = Math.precision(t) + Math.precision(i)
          , u = l.split("_")
          , m = 0 === e || "0" === e
          , s = s.split("|");
        if ("zh" === u[2]) {
            if (m) {
                r = a * n * i;
                for (var p = 0; p < s.length; p++)
                    d += t / Math.pow(10, p) * n * i / 2;
                d -= r
            } else {
                for (var p = 0; p < s.length; p++)
                    r += t / Math.pow(10, p) * n;
                d = a * n * i
            }
            c = 1
        } else if ("dwd" === u[0])
            if (m) {
                r = a * n * i;
                for (var p = 0; p < s.length; p++)
                    "" !== s[p] && (d += t * n * i / 2);
                d -= r
            } else {
                for (var p = 0; p < s.length; p++)
                    "" !== s[p] && (r += t * n);
                d = a * n * i
            }
        else if ("bdd" === u[0])
            m ? (r = a * n * i,
            d = t * n * i / 2 * (3 > a ? a : 3) - r) : (r = t * n * (3 > a ? a : 3),
            d = a * n * i);
        else if ("dxds" === u[0]) {
            var h = 1
              , f = 1;
            /['大'|'小']/.test(s[0]) && /['单'|'双']/.test(s[0]) && (h = 2),
            /['大'|'小']/.test(s[1]) && /['单'|'双']/.test(s[1]) && (f = 2),
            m ? (r = a * n * i,
            d = t * n * i / 2 * h * f - r) : (r = t * n * h * f,
            d = a * n * i)
        } else if ("rxfs" === u[0] || "rxds" === u[0]) {
            s = s[0].split(",");
            var g = 1;
            g = parseInt(l.substr(-3, 1), 10) <= 5 ? s.length < 5 ? a : Math.combination(5, parseInt(l.substr(-3, 1), 10)) : Math.combination(s.length - 5, parseInt(l.substr(-3, 1), 10) - 5),
            m ? (r = a * n * i,
            d = t * n * i / 2 * g - r) : (r = t * n * g,
            d = a * n * i)
        } else
            "rx2" === u[0] || "rx3" === u[0] || "rx4" === u[0] ? (r = a * n * i,
            d = n * t * i / 2,
            "zx" === u[1] && "fs" === u[2] ? (s = s.filter(function(e) {
                return "" !== e ? e : void 0
            }
            ),
            o = Math.combination(s.length, u[0].charAt(u[0].length - 1)),
            d *= o) : (o = Math.combination($("#lottery .number .pos label.on").length, u[0].charAt(u[0].length - 1)),
            d *= o),
            d -= a * n * i) : m ? (r = a * n * i,
            d = n * t * i / 2 - a * n * i) : (r = t * n,
            d = a * n * i);
        return r = r.toFixed(c),
        r = parseFloat(r, 10),
        d = d.toFixed(c),
        d = parseFloat(d, 10),
        {
            money: r,
            win: d,
            wintime: o
        }
    },
    setSubmitData: function() {
        var e = this
          , t = $("#" + e.type)
          , a = t.find("> div.orders")[0]
          , n = $(a).find(".list > ul > li")
          , i = 0
          , s = 0
          , l = 0
          , r = []
          , d = 0
          , o = 0
          , c = 0
          , u = 0
          , m = 0
          , p = 0;
        if (n.length > 0) {
            if ("lottery" === e.type) {
                r = [];
                for (var h = 0, f = n.length; f > h; h++) {
                    var g = $(n[h]).attr("data-count").split("|");
                    i += parseInt(g[0], 10),
                    s += Q.floatMul(parseFloat(g[5], 10), 1e4),
                    l += parseFloat(g[3], 10) * parseFloat(g[1], 10) - parseFloat(g[5], 10),
                    d += parseFloat(g[5], 10) / parseFloat(g[1], 10),
                    o += parseFloat(g[3], 10) * parseFloat(g[2] / 2) * parseInt(g[7], 10),
                    r.push(parseInt(g[7], 10))
                }
                $(a).find(".total").html(i)
            }
            s /= 1e4;
            var v = {
                type: e.type,
                traceM: d,
                times: 1,
                amount: s,
                profixP: o,
                money: s,
                traceMSale: c,
                profixPSale: u,
                traceMBuy: m,
                profixPBuy: p,
                profixPer: o - d,
                profixRate: 100 * parseFloat((o - d) / d)
            };
            $(a).data("trace", v).find(".amount").html("￥" + s),
            Trace.updateTimes($(a).find(">div.trace-data"), $(a).find(">div.trace-data>a:eq(0)"), v),
            $(a).find(".submit").removeClass("disabled")
        } else
            e.resetOrders()
    },
    resetOrders: function() {
        var e = $("#lottery")
          , t = e.find(".orders");
        $(t).hasClass("quickSubmit-orders") ? $(t).find(".list > ul li.quickSubmit-li").remove() : $(t).find(".list > ul").empty(),
        $(t).find(".total, .amount").html(0),
        $(t).find(".submit").addClass("disabled"),
        $(t).removeClass("quickSubmit-orders"),
        Trace.resetTraceBox($(t))
    },
    updateOdds: function() {
        var e, t = this, a = $("#lottery .count .odds"), n = [];
        if (t.odds[t.lt]) {
            if ("pk10" == t.cls && -1 != t.method.indexOf("hz")) {
                var i = $("#lottery .number i.on");
                if (0 == i.length)
                    e = {
                        odds: 0
                    };
                else {
                    var s = Q.PkHzNum[t.method.split("_")[2]];
                    i.each(function() {
                        var a = $(this).html();
                        $(s).each(function() {
                            return -1 != arguments[1].split("_").indexOf(a) ? (e = t.odds[t.lt][t.method + "_" + arguments[1]],
                            0 == n.length ? (n.push(e),
                            n.push(e)) : (e.odds > n[1].odds && (n[1] = e),
                            e.odds < n[0].odds && (n[0] = e)),
                            !1) : void 0
                        }
                        )
                    }
                    )
                }
            } else {
                if (!t.odds[t.lt][t.method])
                    return;
                e = t.odds[t.lt][t.method]
            }
            if (t.lt_odds = e.odds || n,
            void 0 !== e.point) {
                var l = []
                  , r = 0;
                if (n.length > 0) {
                    var d = n[0]
                      , o = n[1]
                      , c = (d.odds + d.x * d.point).toFixed(3)
                      , u = (o.odds + o.x * o.point).toFixed(3);
                    c = c.substr(0, c.length - 1),
                    u = u.substr(0, u.length - 1);
                    var m, p;
                    d.odds == o.odds ? (m = c,
                    p = d.odds) : (m = c + " - " + u,
                    p = d.odds + " - " + o.odds),
                    0 === parseFloat(d.point, 10) ? (l.push('<option value="pk10_hz" data-point="0">' + m + " ~ 0%</option>"),
                    a.find("em").html(r).show(),
                    a.find("select").html(l.join("")).hide()) : (l.push('<option value="pk10_hz" data-point="0">' + m + " ~ 0%</option>"),
                    l.push('<option value="pk10_hz" data-point="' + d.point + '">' + p + " ~ " + Q.percentFormat(d.point) + "%</option>"),
                    a.find("em").hide(),
                    a.find("select").html(l.join("")).show())
                } else
                    r = (e.odds + e.x * e.point).toFixed(3),
                    r = r.substr(0, r.length - 1),
                    r = parseInt(r, 10) === parseFloat(r, 10) ? parseInt(r, 10) : parseFloat(r, 10),
                    0 === parseFloat(e.point, 10) ? (l.push('<option value="' + r + '" data-point="0">' + r + " ~ 0%</option>"),
                    a.find("em").html(r).show(),
                    a.find("select").html(l.join("")).hide()) : (l.push('<option value="' + r + '" data-point="0">' + r + " ~ 0%</option>"),
                    l.push('<option value="' + e.odds + '" data-point="' + e.point + '">' + e.odds + " ~ " + Q.percentFormat(e.point) + "%</option>"),
                    a.find("em").hide(),
                    a.find("select").html(l.join("")).show())
            } else {
                var p;
                p = n.length > 0 ? n[0].odds == n[1].odds ? n[0].odds : n[0].odds + "~" + n[1].odds : e.odds,
                a.find("select").html('<option value="' + p + '" data-point="-1"></option>').hide(),
                a.find("em").html(p).show()
            }
        }
    },
    updateIssueInfo: function() {
        var e = this
          , t = !1;
        arguments.length > 0 && (t = arguments[0]),
        Api.getIssueInfo({
            lottery: e.lt
        }, function(a) {
            var n, i = $(".main .info"), s = $(".main .countTime"), l = [], r = [], d = 0, o = "-", c = $("#lotteryClass dd.on em").eq(0).html();
            if (a.result) {
                if (a = a.result,
                e.next = a.next,
                e.loop = a.loop,
                e.issue = a.issue,
                t || e.updateRecency(),
                "WBGMMC" === a.lottery) {
                    s.hide();
                    var u = "";
                    if (a.lastFive && a.lastFive.length > 0)
                        for (var m = 0; m < a.lastFive.length; m++) {
                            u += 12 > m ? "<li><span>" : '<li class="history-hidden"><span>';
                            var p = a.lastFive[m].code.replace(/,/g, "");
                            u += p.replace(new RegExp(/\d/g), function(e, t) {
                                return "<em>" + e + "</em>"
                            }
                            ),
                            u += "</span></li>"
                        }
                    if (i.attr("class", "info lt-" + e.lt.toLowerCase()),
                    i.find(".name em").html(c),
                    i.find(".name p").html(Q.ltDesc(a.lottery)),
                    i.find(".issue, .last-issue").hide(),
                    i.find(".flipball-wrap").show(),
                    $(".aside .history").addClass("mmc-history").find("ul").html(u),
                    $(".aside .history .chart").attr("href", "/lottery/chart.html?lt=" + a.lottery),
                    i.find(".clock").remove(),
                    i.find(".issue").append($('<div class="clock"></div>')),
                    $("#lottery .mode label").last().attr("style", "display: none"),
                    e.flipball = $("#flipball").flipball({
                        ballsize: 5,
                        initball: "0,0,0,0,0",
                        loop: 3,
                        timeout: 1500,
                        delay: 80,
                        offset: [82, 86]
                    }),
                    e.isStop = !1,
                    t || e.updateTime(),
                    $(".trace-box").hide(),
                    0 === $("#mmcLoop").length) {
                        var h = '<div id="mmcLoop">连续投注<select><option value="1" selected>1</option><option value="5">5</option><option value="10">10</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="1000">1000</option></select><input type="checkbox" id="succStop">中奖即停</div>';
                        $(h).insertAfter(".trace-box"),
                        $("#mmcLoop select").editableSelect({
                            filter: !1,
                            effects: "fade",
                            onCreate: function() {
                                var e = $("#mmcLoop input[type=text]");
                                e.on("keyup", function() {
                                    e.val(e.val().replace(/[^\d]/g, "")),
                                    e.val(parseInt(e.val(), 10) > 1e3 ? 1e3 : e.val())
                                }
                                )
                            }
                        })
                    }
                } else {
                    if ($(".trace-box").show(),
                    $("#mmcLoop").hide(),
                    $("#lottery .mode label").last().removeAttr("style"),
                    i.find(".flipball-wrap, .mmc-last5").hide(),
                    i.find(".issue, .last-issue").show(),
                    a.lastFive && a.lastFive.length > 0) {
                        for (var f = [], m = 0; m < a.lastFive.length; m++)
                            null  !== a.lastFive[m].code && "" !== a.lastFive[m].code && f.push(a.lastFive[m]);
                        a.lastFive = f
                    }
                    if (a.lastFive && a.lastFive.length > 0) {
                        if ("undefined" == typeof e.chknewopen)
                            e.chknewopen = a.lastFive[0].code.replace(/,/g, "");
                        else {
                            var g = a.lastFive[0].code.replace(/,/g, "");
                            e.chknewopen != g ? (e.noanimation = !1,
                            e.chknewopen = a.lastFive[0].code.replace(/,/g, "")) : e.noanimation = !0
                        }
                        for (var m = 0; m < a.lastFive.length; m++) {
                            var v = "";
                            if ("pk10" == e.cls && m > 11)
                                break;
                            v = "pk10" == e.cls && 6 > m || "pk10" != e.cls && 12 > m ? "<li>" : '<li class="history-hidden">';
                            var p = a.lastFive[m].code.replace(/,/g, "");
                            a.lastFive[m].code = p;
                            var b = "pk10" === e.cls ? a.lastFive[m].issue : a.lastFive[m].issue.substring(4);
                            v += "<label>" + b + "</label>",
                            "pk10" === e.cls ? (p = p.substring(0, 10) + "<br>" + p.substring(10),
                            v += '<span class="pk10-history">') : v += "<span>",
                            v += p.replace("11y" === e.cls || "kl8" === e.cls || "pk10" === e.cls ? new RegExp(/\d{2}/g) : new RegExp(/\d/g), function(e, t) {
                                return "<em>" + e + "</em>"
                            }
                            ),
                            v += "</span></li>",
                            l.push(v)
                        }
                        r.push(a.lastFive[0].code.replace("11y" === e.cls || "kl8" === e.cls || "pk10" === e.cls ? new RegExp(/\d{2}/g) : new RegExp(/\d/g), function(e, t) {
                            return "<li>" + e + "</li>"
                        }
                        )),
                        o = a.lastFive[0].issue.split("-")[1] || a.lastFive[0].issue
                    } else
                        l.push("3d" === e.cls ? "<li>-</li><li>-</li><li>-</li>" : "<li>-</li><li>-</li><li>-</li><li>-</li><li>-</li>");
                    if ("WBG" === a.lottery && (c += '<b class="tv-living" title="点击观看开奖直播"></b>'),
                    i.attr("class", "info lt-" + e.lt.toLowerCase()),
                    i.find(".name em").html(c),
                    i.find(".name p").html(Q.ltDesc(a.lottery)),
                    i.find(".issue em").html(void 0 === a.issue ? "-" : a.issue),
                    i.find(".last-issue p span em").html(o),
                    ("11y" === e.cls || "kl8" === e.cls || "pk10" === e.cls) && i.find(".last-issue ul").addClass("twoNum"),
                    i.find(".last-issue ul").html(r.join("")),
                    $(".aside .history").removeClass("mmc-history").find("ul").html(l.join("")),
                    $(".aside .history .chart").attr("href", "/lottery/chart.html?lt=" + a.lottery),
                    e.noanimation || i.find(".last-issue ul li:not(.last5)").removeClass("bounceInDown").addClass("bounceInDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                        $(this).removeClass("bounceInDown"),
                        e.noanimation = !1
                    }
                    ),
                    $("#" + e.type + " .orders input[name=autoTrace]").is(":checked") && Trace.resetTraceDate(),
                    i.find(".clock").attr("class", "clock"),
                    $("#lotteryClass dd").removeClass("warning"),
                    e.isStop = a.second < 0,
                    0 === a.second)
                        return e.updateIssueInfo(),
                        !1;
                    if (-1 === a.second)
                        return i.find(".clock").remove(),
                        i.find(".issue").append($('<div class="clock stop">等待开售</div>')),
                        i.find(".name p").html("等待开售"),
                        s.hide(),
                        t || e.updateTime(),
                        !1;
                    if (-2 === a.second)
                        return i.find(".clock").remove(),
                        i.find(".issue").append($('<div class="clock stop">暂停销售</div>')),
                        i.find(".name p").html("暂停销售"),
                        s.hide(),
                        t || e.updateTime(),
                        !1;
                    t || e.updateTime();
                    var y = (new Date).valueOf() + 1e3 * a.second;
                    i.find(".clock").countdown(y.toString(), function(t) {
                        d = 60 * t.offset.hours * 60 + 60 * t.offset.minutes + t.offset.seconds,
                        d >= 3600 && "3DFC" !== e.lt ? $(this).addClass("h") : $(this).hasClass("h") && "3DFC" !== e.lt && $(this).removeClass("h"),
                        $(this).html(t.strftime(d >= 3600 ? "%#H:%#M:%#S" : "%#M:%#S")),
                        s.show().find("em").html(t.strftime(d >= 3600 ? "%#H:%#M:%#S" : "%#M:%#S")),
                        d > 0 && 30 >= d && !i.find(".main-clock").hasClass("warning") && i.find(".clock").addClass("warning"),
                        i.find(".clock b").each(function() {
                            var e = "clock_b" + arguments[0];
                            $(this).addClass(e)
                        }
                        ),
                        i.find(".clock label").each(function() {
                            var e = "clock_label" + arguments[0];
                            $(this).addClass(e)
                        }
                        )
                    }
                    ).on("finish.countdown", function() {
                        void 0 === dialog.get("go-next-issue") && (n = dialog({
                            id: "go-next-issue",
                            skin: "go-next-issue",
                            title: "温馨提示",
                            content: "<h3>" + $("#lotteryClass dd.on em").html() + '</h3><p class="t">第<em>' + i.find(".issue p em").html() + "</em>期售彩已结束</p><p>点击进入下一期购彩</p>",
                            cancel: !1,
                            fixed: !0,
                            zIndex: 1023,
                            onshow: function() {
                                var t = e.countDownSec
                                  , a = $(this.node).find(".cdown")
                                  , i = setInterval(function() {
                                    return 0 == t ? (n.close().remove(),
                                    clearInterval(i),
                                    Guide.guiding || e.updateIssueInfo(1),
                                    !1) : void a.html(["(", t--, ")"].join(""))
                                }
                                , 1e3)
                            },
                            button: [{
                                id: "clock_ok",
                                value: '确&nbsp;&nbsp;&nbsp;&nbsp;定<em class="cdown">(' + e.countDownSec + ")</em>",
                                callback: function() {
                                    Guide.guiding || e.updateIssueInfo(1),
                                    $(".confirm-again").size() > 0 && $(".confirm-again button.cancel").trigger("click")
                                }
                            }]
                        }),
                        n.showModal())
                    }
                    ),
                    e.updateTime(),
                    $(".trace-box").show(),
                    $("#mmcLoop").remove()
                }
                $(".aside .history .moreHistory").off("click").click(function() {
                    $(".aside li.history-hidden").toggle()
                }
                ),
                e.openindex = 0
            }
        }
        )
    },
    updateTime: function() {
        var e = this
          , t = (new Date).getTime();
        return t - e.startDate < 300 ? !1 : (e.startDate = t,
        e.openindex = 0,
        void Api.getLotteryTimes({}, function(t) {
            -1 == t && $(".loginlnk").trigger("click");
            var a = t.result.time
              , n = 1e3 * t.result.now;
            $("#servertime").data("time", n),
            $("#servertime").html("服务器时间：" + Q.convertStamp(n, "yyyy年MM月dd日 hh:mm:ss")),
            null  !== e.serverTime && clearInterval(e.serverTime),
            e.serverTime = setInterval(function() {
                n = parseInt($("#servertime").data("time"), 10) + 1e3,
                $("#servertime").data("time", n),
                $("#servertime").html("服务器时间：" + Q.convertStamp(n, "yyyy年MM月dd日 hh:mm:ss")),
                e.openindex > 180 && (e.updateOpenOnly(),
                e.openindex = 0)
            }
            , 1e3),
            $("#lotteryClass dd").removeClass("warning");
            for (var i in a) {
                var s = $("#lotteryClass dd[data-lt=" + i + "] span")
                  , l = 0;
                "WBGMMC" !== i ? -1 !== a[i] ? -2 !== a[i] ? (l = (new Date).valueOf() + 1e3 * a[i],
                0 === parseInt(s.attr("countdown"), 10) ? s.countdown(l.toString(), function(t) {
                    var a = 60 * t.offset.hours * 60 + 60 * t.offset.minutes + t.offset.seconds;
                    a >= 3600 ? $(this).addClass("h") : $(this).hasClass("h") && $(this).removeClass("h"),
                    $(this).html(t.strftime(a >= 3600 ? "%#H:%#M:%#S" : "%#M:%#S")),
                    30 >= a && !$(this).parent("dd").hasClass("warning") && $(this).parent("dd").addClass("warning"),
                    100 >= a && e.openindex++
                }
                ).on("finish.countdown", function() {
                    $(this).countdown("stop"),
                    setTimeout(function() {
                        e.updateTime()
                    }
                    , 500)
                }
                ) : s.countdown(l.toString()),
                s.attr("countdown", 1)) : s.parent("dd").addClass("stop").end().html("停售") : s.parent("dd").addClass("wait").end().html("等待") : s.parent("dd").addClass("mmc").end().html("即开")
            }
        }
        ))
    },
    updateOpenOnly: function() {
        var e = this;
        e.updateIssueInfo(1)
    },
    updateRecency: function() {
        var e = this
          , t = $("#lottery .recency ul:eq(0)")
          , a = {
            lottery: e.lt
        };
        Api.getRecency(a, function(e) {
            if (e.result && e.result.length > 0) {
                var a = "</span>"
                  , n = ["<% for ( var i = 0; i < result.length; i++ ) { %>", '<li data-id="<%=result[i].orderId%>" data-istrace="<%=result[i].istrace%>">', '<span class="wd1"><%=result[i].orderTime|Q.convertStamp,Q.formatOne%>', a, '<span class="wd2"><%=result[i].method|Q.getMethodName,result[i].lottery%>', a, '<span class="wd1"><%=result[i].issue%>', a, '<span class="wd3"><%=result[i].mode|Q.modeName%>', a, '<span class="wd2" title="<%=result[i].code|Lottery.descFormat,result[i].method%>"><%=result[i].code|Lottery.descFormat,result[i].method%>', a, '<span class="wd3"><%=result[i].piece%>', a, '<span class="wd5"><%=result[i].amount%>', a, '<span class="wd4<%=result[i].status|Q.statusCls%>"><%=result[i].status%>', a, '<span class="wd3"><%=result[i].istrace|Q.istraceCh%>', a, "</li><% } %>"].join("");
                $(t).html(tmpl.apply(this, ["list_recency", n, e])),
                $("#lottery .recency").is(":hidden") && $("#lottery .recency").slideDown()
            } else
                $(t).empty();
            $(t).off("click").on("click", "li", function(e) {
                e.preventDefault(),
                Lottery.popDetail($(this).attr("data-istrace"), {
                    orderId: $(this).attr("data-id")
                })
            }
            )
        }
        )
    },
    popDetail: function(e, t) {
        var a = this
          , n = "<table><tbody>"
          , i = dialog({
            id: "recency-details",
            skin: "sobet recency-pop recency-pop-h",
            title: "投注详细",
            fixed: !0,
            onshow: function() {
                var n = this;
                1 === parseInt(e, 10) && a.chkTraceDetail(t, n, i)
            }
        });
        a.queryRecencyDetail(i, i, n, t)
    },
    chkTraceDetail: function(e, t, a) {
        var n = this;
        Api.getTrace(e, function(i) {
            i = i.result;
            var s = ['<table class="traceTable traceHTable"><tbody>', "<tr>", "<th>追号编号：</th>", "<td>", i.traceId, "</td>", '<td rowspan="18" class="fixtrace">', '<ul class="traceInner"></ul>', '<div class="tracePager popdetails-page"></div>', '<div class="cancelTrace"><a class="hand disabled" name="', i.traceId, '">追号终止</a></div>', "</td></tr>", "<tr><th>游戏用户：</th><td>", User.nick, "</td></tr>", "<tr><th>追号时间：</th><td>", i.createTime, "</td></tr>", "<tr><th>彩种：</th><td>", Q.nameLottery(i.lottery), "</td></tr>", '<tr><th>追号内容：</th><td><em class="desc">', n.descFormat(i.code, i.method), "</em></td></tr>", "<tr><th>玩法：</th><td>", Q.getMethodName(i.method, i.lottery), "</td></tr>", "<tr><th>追号模式：</th><td>", Q.traceType(i.traceType), "</td></tr>", "<tr><th>开始期号：</th><td>", i.start, "</td></tr>", "<tr><th>奖金模式：</th><td>", i.odds, "</td></tr>", "<tr><th>模式：</th><td>", Q.modeName(i.perAmount), "</td></tr>", "<tr><th>追号期数：</th><td>", i.issues.length, "</td></tr>", "<tr><th>追号总金额：</th><td>¥", i.totalMoney, "</td></tr>", "<tr><th>完成期数：</th><td>", i.finishCount, "</td></tr>", "<tr><th>完成金额：</th><td>¥", i.finishMoney, "</td></tr>", "<tr><th>取消期数：</th><td>", i.cancelCount, "</td></tr>", "<tr><th>取消金额：</th><td>¥", i.cancelMoney, "</td></tr>", "<tr><th>追号状态：</th><td>", i.status, "</td></tr>", "<th>&nbsp;&nbsp;中奖后终止：</th><td>", Q.traceChs(i.winStop), "</td></tr>", '</tbody></table><div class="traceInnerDetails"></div>'].join("")
              , l = ['<li class="traceHead"><span><input type="checkbox" class="chkall hand">奖期</span><em>追号倍数</em><em>追号状态</em><em>注单详情</em></li>', "<% for ( var i = 0; i < issues.length; i++ ) { %>", '<li id="<%=issues[i].orderId%>">', '<span><input type="checkbox" rel="<%=issues[i].orderId%>" class="hand<%=issues[i].status|Q.traceClsDisable%>" <%=issues[i].orderId|Q.traceDisable%> name="<%=issues[i].issue%>" <%=issues[i].status|Q.tracestatusDisable%>><%=issues[i].issue%></span>', "<em><%=issues[i].count%></em>", "<em><label><%=issues[i].status|Q.statusCh%></label></em>", "<em><%=issues[i].orderId|Q.checkDetailByStatus,issues[i].status%></em>", "</li><% } %>"].join("");
            0 == $(t.node).find(".ui-dialog-content table.traceTable").size() && ($(t.node).find(".ui-dialog-content table:eq(0)").length > 0 ? $(t.node).find(".ui-dialog-content table:eq(0)").after(s) : ($(t.node).find(".ui-dialog-content").html(s),
            $(t.node).find(".ui-dialog-content > table.traceTable").show(),
            a.width(960).height("auto")),
            $(t.node).find(".ui-dialog-title").html('<em>追号详情</em> <a class="hand backInfo" rel="0">(返回)</a>')),
            $(t.node).find("a.traceview").unbind("click").click(function() {
                0 == $(t.node).find(".ui-dialog-content table.traceTable").size() ? $(t.node).find(".ui-dialog-content table:eq(0)").after(traceTable) : ($(t.node).find(".ui-dialog-content table.traceTable").show(),
                $(t.node).find(".ui-dialog-title a").show(),
                a.width(960).height("auto")),
                $(t.node).find(".ui-dialog-content table:eq(0)").hide()
            }
            ),
            $(t.node).find(".traceInner").html(tmpl.apply(this, ["traceInner", l, i])),
            $(t.node).find(".ui-dialog-title a").unbind("click").click(function() {
                "0" == $(this).attr("rel") ? ($(t.node).find(".ui-dialog-title em").html("投注详细"),
                $(t.node).find(".traceInnerDetails").size() > 0 && "" != $(t.node).find(".traceInnerDetails").html() ? ($(t.node).find(".traceInnerDetails").show(),
                $(t.node).find(".traceHTable").hide()) : ($(t.node).find(".ui-dialog-content table.traceTable").hide(),
                $(t.node).find(".ui-dialog-content table:eq(0)").show()),
                $(t.node).find(".ui-dialog-title a").hide(),
                a.width(640).height("auto")) : ($(t.node).find(".ui-dialog-title em").html("追号详情"),
                $(t.node).find(".ui-dialog-content table.traceTable").show(),
                $(t.node).find(".ui-dialog-content table:eq(0),.ui-dialog-content div.traceInnerDetails").hide(),
                $(t.node).find(".ui-dialog-title a").attr("rel", "0"),
                a.width(960).height("auto"))
            }
            );
            var r = 10
              , d = i.issues.length;
            if (d > r && "" == $(t.node).find(".tracePager").html())
                $(t.node).find(".traceInner li:gt(" + r + ")").hide(),
                n.queryTracePage(1, t, r, d);
            else {
                var o = (parseInt($(t.node).find(".tracePager a.on").attr("page"), 10) - 1) * r;
                isNaN(o) && (o = 0),
                $(t.node).find(".traceInner li:visible:not(.traceHead)").hide(),
                $(t.node).find(".traceInner li:gt(" + o + "):lt(" + r + ")").show()
            }
            $(t.node).find("a.traceDetails").attr("rel", $(a.node).find("div.ui-dialog-content").height()),
            $(t.node).find("a.traceDetails").unbind("click").click(function() {
                var e = {
                    orderId: $(this).attr("data-id")
                }
                  , i = $(this).attr("rel")
                  , s = "<table><tbody>";
                $(t.node).find(".ui-dialog-content > table").hide(),
                $(t.node).find(".ui-dialog-title em").html("投注详细"),
                $(t.node).find(".ui-dialog-title a").attr("rel", "1").hide(),
                a.width(640).height(i),
                e.relheight = i,
                n.queryRecencyDetail($(t.node).find(".ui-dialog-content div.traceInnerDetails"), a, s, e)
            }
            ),
            $(t.node).find("li:not(.traceHead) span > input:not(.disabled)").off("click").on("click", function(e) {
                $(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(.disabled):checked").length > 0 ? $(t.node).find("div.cancelTrace a").removeClass("disabled") : $(t.node).find("div.cancelTrace a").addClass("disabled"),
                $(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(.disabled):checked").length == $(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(.disabled)").length ? $(t.node).find("li.traceHead input.chkall").prop("checked", !0) : $(t.node).find("li.traceHead input.chkall").attr("checked", !1)
            }
            ),
            $(t.node).find("li.traceHead input.chkall").off("click").on("click", function(e) {
                return 0 == $(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(.disabled)").length ? !1 : ($(this).prop("checked") ? $(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(:checked):not(.disabled)").prop("checked", !0) : $(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(.disabled):checked").prop("checked", !1),
                void ($(t.node).find(".traceInner li:visible:not(.traceHead) span input:not(.disabled):checked").length > 0 ? $(t.node).find("div.cancelTrace a").removeClass("disabled") : $(t.node).find("div.cancelTrace a").addClass("disabled")))
            }
            ),
            $(t.node).find("div.cancelTrace a").off("click").on("click", function(i) {
                var s = $(this)
                  , l = {
                    traceId: s.attr("name")
                };
                return l.issues = $(t.node).find(".traceInner li:visible:not(.traceHead) span input:checked").map(function() {
                    return $(this).attr("name")
                }
                ).get(),
                s.hasClass("disabled") || 0 == l.issues.length ? !1 : void Api.cancelTrace(l, function(i) {
                    if (-1 === i)
                        return $(".loginlnk").trigger("click"),
                        !1;
                    if (i && i.code && i.msg) {
                        var l = dialog({
                            align: "top",
                            skin: "tip",
                            content: "追号终止成功"
                        }).show(s[0]);
                        1 === parseInt(i.code, 10) && ($(t.node).find("div.cancelTrace a").addClass("disabled"),
                        n.chkTraceDetail(e, t, a)),
                        setTimeout(function() {
                            l.close().remove()
                        }
                        , 1e3)
                    }
                }
                )
            }
            ),
            $(t.node).find(".traceInner li:not(.traceHead)").length == $(t.node).find(".traceInner li:not(.traceHead) input.disabled").length && $(t.node).find("div.cancelTrace a").addClass("disabled")
        }
        )
    },
    queryTracePage: function(e, t, a, n) {
        var i = this;
        $(t.node).find(".tracePager").html(Q.showPagination(e, a, n, null )).show(),
        $(t.node).find(".tracePager a").unbind("click").click(function() {
            $(t.node).find(".traceInner li.traceHead input.chkall").prop("checked", !1),
            $(t.node).find(".traceInner li:gt(0) input").prop("checked", !1);
            var e = (parseInt($(this).attr("page"), 10) - 1) * a;
            $(t.node).find(".traceInner li:visible:not(.traceHead)").hide(),
            $(t.node).find(".traceInner li:gt(" + e + "):lt(" + a + ")").show(),
            i.queryTracePage(parseInt($(this).attr("page"), 10), t, a, n)
        }
        )
    },
    queryRecencyDetail: function(e, t, a, n) {
        var i = this
          , s = []
          , l = ["<th>注单编号：</th>", "<th>游戏用户：</th>", "<th>投单时间：</th>", "<th>彩种：</th>", "<th>玩法：</th>", "<th>期号：</th>", "<th>投注内容：</th>", "<th>奖金模式：</th>", "<th>倍数：</th>", "<th>模式：</th>", "<th>投注总金额：</th>", "<th>奖金：</th>", "<th>开奖号码：</th>", "<th>状态：</th>", "<tbody>"];
        Api.getRecencyDetail(n, function(r) {
            if (void 0 !== r.result) {
                r = r.result,
                s.push(r.orderId),
                s.push(r.username),
                s.push(r.orderTime),
                s.push(Q.nameLottery(r.lottery)),
                s.push(Q.getMethodName(r.method, r.lottery) + Q.getPositionName(r.position || "")),
                1 === parseInt(r.istrace, 10) ? s.push("<em>" + r.issue + '</em><a class="traceview hand">(查看追号信息)</a>') : s.push("<em>" + r.issue + "</em>"),
                s.push('<em class="desc">' + i.descFormat(r.code, r.method) + "</em>"),
                s.push(r.odds),
                s.push(r.count),
                s.push(Q.modeName(r.perAmount)),
                s.push(r.amount),
                s.push(r.awardMoney),
                s.push(r.lotteryNumber),
                s.push(r.status);
                for (var d = 0; d < s.length; d++)
                    if (0 === d && void 0 !== r.cancel) {
                        var o = parseInt(r.cancel, 10);
                        a += "<tr>" + l[d] + "<td><em>" + s[d] + "</em>",
                        0 === o && 1 === r.isCurrentIssue ? a += '<a href="javascript:;" data-id="' + s[d] + '" id="cancel_order" class="btnCancel">撤 单</a>' : 1 === o && (a += '<a href="javascript:;" class="btnCancel disabled">个人撤单</a>'),
                        a += "</td></tr>"
                    } else
                        a += "<tr>" + l[d] + "<td>" + s[d] + "</td></tr>";
                a += "</tbody></table>",
                "undefined" != typeof e.selector ? (e.html(a).show(),
                e.height() != parseInt(n.relheight, 10) && t.height(e.height()),
                e.find("a.traceview").off("click").on("click", function(a) {
                    t.width(960).height("auto"),
                    $(t.node).find(".ui-dialog-title a").attr("rel", "0").show(),
                    e.hide(),
                    e.prev().show()
                }
                ).show()) : (e.content(a),
                e.width(n.width ? n.width : 640).showModal(),
                $(e.node).find("a.traceview").off("click").on("click", function(a) {
                    t.width(960).height("auto"),
                    e.hide(),
                    e.prev().show()
                }
                ).show());
                var c = $(e.node).find("a#cancel_order");
                0 == c.length && (c = $(e).find("a#cancel_order")),
                c.off("click").on("click", function(e) {
                    var t = $(this)
                      , a = {
                        orderId: t.attr("data-id")
                    };
                    if (t.hasClass("disabled"))
                        return !1;
                    var n = dialog({
                        title: "温馨提示",
                        skin: "confirm-again",
                        content: "您确定要撤销" + i.issue + "期的这一注单吗？",
                        button: [{
                            id: "cancle_ok",
                            value: "确定",
                            callback: function() {
                                n.close().remove(),
                                t.addClass("disabled"),
                                Api.cancelOrder(a, function(e) {
                                    if (e && e.code && e.msg) {
                                        var n = dialog({
                                            align: "right",
                                            skin: "tip",
                                            content: e.msg
                                        }).show(t[0]);
                                        0 === parseInt(e.code, 10) && (t.addClass("disabled").html("个人撤单"),
                                        i.updateRecency(),
                                        $("#" + a.orderId).length > 0 && $("#" + a.orderId).find("label").html("已取消")),
                                        setTimeout(function() {
                                            n.close().remove()
                                        }
                                        , 2e3)
                                    }
                                }
                                )
                            }
                        }, {
                            id: "cancle_cancel",
                            skin: "cancel",
                            value: "取消"
                        }]
                    }).showModal()
                }
                )
            }
        }
        )
    },
    queryHistory: function() {
        var e = this
          , t = dialog({
            id: "history_list",
            title: " ",
            skin: "sobet history-pop",
            width: 1070,
            height: 560,
            fixed: !0
        })
          , a = {
            lottery: '<span class="wd1">投注时间</span><span class="wd5">彩种</span><span>玩法</span><span class="wd2">投注期号</span><span class="wd3">模式</span><span>投注内容</span><span class="wd4">倍数</span><span>投注金额</span><span>奖金</span><span class="wd4">状态</span><span>开奖号码</span><span class="wd3">追号</span>',
            trace: '<span class="wd5">用户名</span><span class="wd1">追号时间</span><span class="wd5">彩种</span><span>玩法</span><span class="wd2">开始期数</span><span>投注内容</span><span>总金额</span><span>完成金额</span><span>取消金额</span><span class="wd3">中奖即停</span><span class="wd3">状态</span>'
        }
          , n = '<ul class="tab"><li data-type="lottery" class="on"><span>投注查询</span></li><li data-type="trace"><span>追号查询</span></li></ul><div class="filter"><label>时间:</label><input type="text" id="date_from" value="" readonly="readonly"><label>至:</label><input type="text" id="date_end" value="" readonly="readonly"><label>彩种:</label><select class="lotteryList" name=""><option value="">所有彩种</option></select><label>玩法:</label><select class="methodList" name=""><option value="">所有玩法</option></select><label>状态:</label><select class="status" name=""><option value="">全部</option><option value="0">未开奖</option><option value="1">未中奖</option><option value="2">已派奖</option><option value="3">等待派奖</option><option value="4">个人撤单</option><option value="5">系统撤单</option></select><a href="javascript:;" class="query">查询</a></div><div class="list"><div class="tit"></div><div class="box"><ul></ul><div class="grid-total"><label>合计</label><span class="grid-amount">¥0</span><span class="grid-award">¥0</span></div><div class="pagging"></div></div><div class="box-trace hide"><ul></ul><div class="grid-total"><label>合计</label><span class="grid-amount">¥0</span><span class="grid-finish">¥0</span><span class="grid-cancel">¥0</span></div><div class="pagging"></div></div></div>'
          , s = ['<option value="" selected="selected">所有彩种</option>', "<% for ( var i = 0; i < list.length; i++ ) { %>", '<option value="<%=list[i].lottery%>"><%=list[i].lottery|Q.lotteryChs%></option>', "<% } %>"].join("")
          , l = ['<option value="" selected="selected">所有玩法</option>', "<% for ( var i = 0; i < items.length; i++ ) { %>", '<option value="<%=items[i].method%>"><%=items[i].method|Q.getMethodName,items[i].lottery%></option>', "<% } %>"].join("");
        Api.getCommon("getHistoryParams", {}, function(r) {
            return void 0 === r.result && -1 === parseInt(r, 10) ? (User.chkLogin(function() {
                e.queryHistory()
            }
            ),
            !1) : (r = r.result,
            t.content(n),
            t.addEventListener("show", function() {
                var t = $(this.node)
                  , n = t.find(".tab")
                  , d = t.find("#date_from")
                  , o = t.find("#date_end")
                  , c = t.find(".filter select.lotteryList")
                  , u = t.find(".filter select.methodList")
                  , m = t.find(".filter a.query")
                  , p = t.find(".list .tit");
                d.datetimepicker({
                    id: "dp_from",
                    lang: "zh",
                    value: "-1970/01/01",
                    minDate: "-1970/03/31",
                    maxDate: "+1970/01/01",
                    step: 1,
                    type: ":first"
                }),
                o.datetimepicker({
                    id: "dp_end",
                    lang: "zh",
                    value: "+1970/01/01",
                    minDate: "-1970/03/31",
                    maxDate: "+1970/01/01",
                    step: 1,
                    type: ":last"
                }),
                p.html(a.lottery);
                var h = {}
                  , f = function(e) {
                    var t = r[e];
                    for (i = 0; i < t.length; i++)
                        h[t[i].lottery] = {
                            items: t[i].methods.map(function(e) {
                                return {
                                    method: e,
                                    lottery: t[i].lottery
                                }
                            }
                            )
                        };
                    return {
                        list: t
                    }
                }
                ;
                c.html(tmpl.apply(this, ["gnav_option", s, f("lotteryList")])),
                t.find(".tab").off("click").on("click", "li", function(e) {
                    e.preventDefault(),
                    $(this).addClass("on").siblings("li").removeClass("on"),
                    "trace" === $(this).attr("data-type") ? (p.html(a.trace),
                    t.find(".box").hide().siblings(".box-trace").show(),
                    t.find(".filter .status").hide().prev("label").hide(),
                    t.find(".list").attr("class", "list trace"),
                    c.html(tmpl.apply(this, ["gnav_option", s, f("lotteryTraceList")]))) : (p.html(a.lottery),
                    t.find(".box-trace").hide().siblings(".box").show(),
                    t.find(".filter .status").show().prev("label").show(),
                    t.find(".list").removeClass("trace"),
                    c.html(tmpl.apply(this, ["gnav_option", s, f("lotteryList")]))),
                    c.trigger("change")
                }
                ),
                c.on("change", function() {
                    "" != $(this).val() && null  != h[$(this).val()].items ? u.removeAttr("disabled").html(tmpl.apply(this, ["gnav_moption", l, h[$(this).val()]])) : "" === $(this).val() ? u.attr("disabled", "disabled").html('<option value="" selected="selected">所有玩法</option>') : u.html('<option value="" selected="selected">所有玩法</option>')
                }
                ),
                u.attr("disabled", "disabled").html('<option value="" selected="selected">所有玩法</option>'),
                m.unbind("click").click(function() {
                    var e = {
                        pageSize: 10,
                        lottery: c.val(),
                        method: u.val()
                    };
                    "" !== d.val() && (e.orderStartTime = d.val()),
                    "" !== o.val() && (e.orderEndTime = o.val()),
                    $("#game a.go-history").data("rel", "lottery"),
                    Cookies.set("rptyp", "lottery"),
                    "trace" === n.find("li.on").attr("data-type") ? Lottery.dataHistoryTrace(t, e, "lottery") : (e.status = t.find(".filter .status").val(),
                    Lottery.dataHistory(t, e, a, "lottery"))
                }
                ),
                "undefined" != typeof Cookies.get("rptyp") && m.trigger("click"),
                "undefined" != typeof $("#game a.go-history").data("rel") && m.trigger("click"),
                t.find(".list .box ul:eq(0)").off("click").on("click", "li", function(e) {
                    e.preventDefault();
                    var t = {
                        orderId: $(this).attr("data-id")
                    };
                    "lottery" === $(this).parent("ul").attr("type") && Lottery.popDetail($(this).attr("data-istrace"), t)
                }
                ),
                t.find(".list .box-trace ul:eq(0)").off("click").on("click", "li", function(t) {
                    t.preventDefault();
                    var a = {
                        traceId: $(this).attr("data-id")
                    };
                    if ("lottery" === $(this).parent("ul").attr("type")) {
                        var n = dialog({
                            skin: "sobet recency-pop recency-pop-h",
                            title: "追号详情",
                            fixed: !0,
                            onshow: function() {
                                var t = this;
                                e.chkTraceDetail(a, t, t)
                            }
                        });
                        n.showModal()
                    }
                }
                )
            }
            ),
            void t.showModal())
        }
        )
    },
    dataHistory: function(e, t, a, n) {
        var i = ["<% for ( var i = 0; i < his_orders.length; i++ ) { %>", '<li data-id="<%=his_orders[i].orderItemId%>" data-istrace="<%=his_orders[i].istrace%>" class="<%=i|Q.oddEven%>">', '<span class="wd1"><%=his_orders[i].orderTime%></span>', '<span class="wd5"><%=his_orders[i].lottery|Q.nameLottery%></span>', '<span title="<%=his_orders[i].method|Q.getMethodName,his_orders[i].lottery%>"><%=his_orders[i].method|Q.getMethodName,his_orders[i].lottery%></span>', '<span class="wd2"><%=his_orders[i].issue%></span>', '<span class="wd3"><%=his_orders[i].perAmount|Q.modeName%></span>', '<span class="grid-toggle" alt="号码详情："><div class="wrapbox"><em alt="<%=his_orders[i].code|Lottery.descFormat,his_orders[i].method%>"><%=his_orders[i].code|Lottery.descFormat,his_orders[i].method%></em></div></span>', '<span class="wd4"><%=his_orders[i].count%></span>', "<span>¥<%=his_orders[i].amount%></span>", "<span>¥<%=his_orders[i].awardMoney%></span>", '<span class="wd4"><%=his_orders[i].status|Q.statusChs%></span>', '<span alt="开奖号码："><%=his_orders[i].winningNumber%></span>', '<span class="wd3"><%=his_orders[i].istrace|Q.istraceCh%></span>', "</li><% } %>"].join("");
        e.find(".box .pagging").html(""),
        Api.getCommon("getHistory", t, function(s) {
            if (-1 === s)
                return $(".loginlnk").trigger("click"),
                !1;
            if (void 0 !== s.result) {
                if (s = s.result,
                0 == s.his_orders.length)
                    return e.find(".list .box ul").html('<div class="blank">暂无数据</div>'),
                    e.find(".list .box ul div.blank").height(200),
                    e.find(".list .box .grid-total .grid-amount").html(""),
                    e.find(".list .box .grid-total .grid-award").html(""),
                    !1;
                var l = {
                    lottery: ["gnav_lottery", i, s]
                };
                e.find(".list .tit").html(a[n]),
                e.find(".list .box ul").html(tmpl.apply(this, l[n])).attr("type", n),
                e.find(".list .box ul li span.grid-toggle").each(function(e, t) {
                    $(t).find("em").attr("alt").length > 10 && $(t).addClass("grid-hover").find("em").html('<a href="javascript:;" class="hand viewfull">查看全部</a>')
                }
                ),
                e.find(".list .box .grid-total .grid-amount").html("¥" + Q.doubleFormat(s.dealMoneyCount)),
                e.find(".list .box .grid-total .grid-award").html("¥" + Q.doubleFormat(s.awardMoneyCount)),
                $(".box .grid-hover").unbind("click").click(function() {
                    var e = dialog({
                        skin: "tip",
                        align: "top",
                        content: $(this).attr("alt") + '<div class="all-code">' + $(this).find("em").attr("alt") + "</div>",
                        quickClose: !0
                    });
                    return e.show($(this)[0]),
                    !1
                }
                ),
                e.find(".box .pagging").html(Q.showPagination(s.currPage, s.pageSize, s.totalItem, s.totalPage)),
                e.find(".box .pagging a").unbind("click").click(function() {
                    t.currPage = $(this).attr("page"),
                    Lottery.dataHistory(e, t, a, n)
                }
                )
            }
        }
        )
    },
    dataHistoryTrace: function(e, t, a) {
        var n = ["<% for ( var i = 0; i < list.length; i++ ) { %>", '<li data-id="<%=list[i].traceId%>" class="<%=list[i].buyType|Q.itemTyp%> <%=i|Q.oddEven%>">', '<span class="wd5"><%=list[i].buyType|Q.getIcon%><%=list[i].userName%></span>', '<span class="wd1"><%=list[i].createTime%></span>', '<span class="wd5"><%=list[i].lottery|Q.nameLottery%></span>', "<span><%=list[i].method|Q.getMethodName,list[i].lottery%></span>", '<span class="wd2"><%=list[i].start%></span>', '<span class="grid-toggle" alt="号码详情："><div class="wrapbox"><em alt="<%=list[i].code|Lottery.descFormat,list[i].method%>"><%=list[i].code|Lottery.descFormat,list[i].method%></em></div></span>', "<span>¥<%=list[i].totalMoney%></span>", "<span>¥<%=list[i].finishMoney%></span>", "<span>¥<%=list[i].cancelMoney%></span>", '<span class="wd3"><%=list[i].winStop|Q.istraceCh%></span>', '<span class="wd3"><%=list[i].status%></span>', "</li><% } %>"].join("");
        e.find(".box-trace .pagging").html(""),
        Api.getCommon("getTraces", t, function(i) {
            if (-1 === i)
                return $(".loginlnk").trigger("click"),
                !1;
            if (void 0 !== i.result) {
                if (i = i.result,
                0 === i.list.length)
                    return e.find(".list .box-trace ul").empty(),
                    e.find(".list .box-trace .grid-total .grid-amount").html("￥0"),
                    e.find(".list .box-trace .grid-total .grid-finish").html("￥0"),
                    e.find(".list .box-trace .grid-total .grid-cancel").html("￥0"),
                    !1;
                e.find(".list .box-trace ul").html(tmpl.apply(this, ["gnav_trace", n, i])).attr("type", a),
                e.find(".list").addClass("trace"),
                e.find(".list .box-trace ul li span.grid-toggle").each(function(e, t) {
                    $(t).find("em").attr("alt").length > 10 && $(t).addClass("grid-hover").find("em").html('<a href="javascript:;" class="hand viewfull">查看全部</a>')
                }
                ),
                e.find(".list .box-trace .grid-total .grid-amount").html("¥" + Q.doubleFormat(i.totalMoney)),
                e.find(".list .box-trace .grid-total .grid-finish").html("¥" + Q.doubleFormat(i.finishMoney)),
                e.find(".list .box-trace .grid-total .grid-cancel").html("¥" + Q.doubleFormat(i.cancelMoney)),
                $(".grid-hover").unbind("click").click(function() {
                    var e = dialog({
                        skin: "tip",
                        align: "top",
                        content: $(this).attr("alt") + '<div class="all-code">' + $(this).find("em").attr("alt") + "</div>",
                        quickClose: !0
                    });
                    return e.show($(this)[0]),
                    !1
                }
                ),
                i.totalItem = i.pageSize * i.totalPage,
                i.list.length > 0 ? e.find(".box-trace .pagging").html(Q.showPagination(i.currPage, i.pageSize, i.totalItem, i.totalPage)) : (e.find(".list .box-trace ul").html('<div class="blank">暂无数据</div>'),
                e.find(".list .box-trace ul div.blank").height(200),
                e.find(".list .box-trace .grid-total .grid-amount,.list .box-trace .grid-total .grid-finish,.list .box-trace .grid-total .grid-cancel").html("")),
                e.find(".box-trace .pagging a").unbind("click").click(function() {
                    t.currPage = $(this).attr("page"),
                    Lottery.dataHistoryTrace(e, t, a)
                }
                )
            }
        }
        )
    }*/
},
Math.factorial = function(e) {
    return 0 >= e ? 1 : e * Math.factorial(e - 1)
}