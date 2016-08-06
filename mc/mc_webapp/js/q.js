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
        return LotteryClass[t].ltMethod[a[0]][m].name;
    },
    getLtName: function(lt) {
        return LotteryClass.names[lt];
    },
    PkHzNum: {
        q2: ["3_19", "4_18", "5_17", "6_16", "7_15", "8_14", "9_13", "10_12", "11"],
        q3: ["6_27", "7_26", "8_25", "9_24", "10_23", "11_22", "12_21", "13_20", "14_19", "15_18", "16_17"]
    },
    
	/**
    formatOne: "MM-dd hh:mm:ss",
    convertStamp: function(e, t) {
        var a = new Date(parseInt(e));
        if (void 0 === t)
            return "Error Format";
        var n = {
            M: a.getMonth() + 1,
            d: a.getDate(),
            h: a.getHours(),
            m: a.getMinutes(),
            s: a.getSeconds(),
            q: Math.floor((a.getMonth() + 3) / 3),
            S: a.getMilliseconds()
        };
        return t = t.replace(/([yMdhmsqS])+/g, function(e, t) {
            var i = n[t];
            return void 0 !== i ? (e.length > 1 && (i = "0" + i,
            i = i.substr(i.length - 2)),
            i) : "y" === t ? (a.getFullYear() + "").substr(4 - e.length) : e
        }
        )
    },
    datetimeFormat: function(e, t) {
        var a = new Date(e);
        return void 0 === t ? "Error Format" : a.Format(t)
    },
    secondFormat: function(e) {
        var t = parseInt(e, 10)
          , a = Math.floor(t / 3600)
          , n = Math.floor((t - 3600 * a) / 60)
          , i = t - 3600 * a - 60 * n;
        10 > a && (a = "0" + a),
        10 > n && (n = "0" + n),
        10 > i && (i = "0" + i);
        var s = e > 3600 ? a + ":" + n + ":" + i : n + ":" + i;
        return s
    },
    formatNull: function(e) {
        return null  === e ? 0 : e
    },
    unique: function(e) {
        for (var t = {}, a = [], n = 0; n < e.length; n++)
            t[e[n]] || (t[e[n]] = !0,
            a.push(e[n]));
        return a
    },
    nameLottery: function(e) {
        return $("#lotteryClass dd[data-lt=" + e + "] em").html() || ""
    },
    getIcon: function(e) {
        return void 0 !== e ? '<div class="icon"><i>' + (parseInt(e, 10) ? "卖" : "买") + "</i></div>" : ""
    },
    nameCode: function(e) {
        if (null  == e)
            return "";
        var t = e.indexOf(" ");
        return {
            name: e.substr(0, t),
            code: e.substr(t + 1)
        }
    },
    iconGreenChs: function(e) {
        var t = {
            "买": 0,
            "卖": 1
        };
        return t[e]
    },
    traceType: function(e) {
        var t = ["利润率追号", "同倍追号", "翻倍追号", "买彩票同倍追号", "卖彩票同倍追号"];
        return t[parseInt(e, 10) - 1] || "未指定"
    },
    traceChs: function(e) {
        var t = ["追中继续", "追中即停"];
        return t[e]
    },
    iconGreen: function(e) {
        var t = ["买", "卖"];
        return t[e]
    },
    itemTyp: function(e) {
        var t = ["buy", "sale"];
        return t[e] || ""
    },
    getMethodName: function(e, t) {
        if (null  === e || "" === e)
            return "-";
        var a = e.split("_");
        return LotteryClass[t].ltMethod[a[0]][a[1]].method[a[2]].name
    },
    getPositionName: function(e) {
        var t = ["万", "千", "百", "十", "个"];
        return e = e ? " " + e : "",
        e.replace(/\d/g, function(e) {
            return t[e - 1]
        }
        )
    },
    nameContent: function(e) {
        return Q.nameCode(e).code
    },
    expireFormat: function(e) {
        return parseInt(e, 10) > 0 ? e + "天" : "永久有效"
    },
    urlFormat: function(e) {
        return "http://" + window.location.host + e
    },
    statusFormat: function(e) {
        var t = ["正常", "过期"];
        return t[e] || ""
    },
    percentFormat: function(e) {
        var t = 2;
        return arguments.length > 1 && (t = arguments[1]),
        0 == e || parseInt(100 * e, 10).toFixed(t) == Number(100 * e).toFixed(t) ? parseInt(100 * e, 10) : parseFloat(100 * e).toFixed(2 == t ? 1 : t)
    },
    percentStyle: function(e) {
        return -1 == e ? " rateabnormal" : " ratenormal"
    },
    doubleFormat: function(e) {
        var t = 3;
        return 0 == e || parseInt(e, 10).toFixed(3) == Number(e).toFixed(3) ? parseInt(e, 10) : (arguments.length > 1 && (t = arguments[1]),
        parseFloat(e).toFixed(t))
    },
    lotteryPointDiff: function(e) {
        return parseFloat(100 * e - .1).toFixed(1)
    },
    modeName: function(e) {
        var t = {
            2: "元",
            .2: "角",
            .02: "分",
            .002: "厘"
        };
        return t[String(parseFloat(e))] || "-"
    },
    getItemIdForChange: function(e) {
        return e ? '<a class="change-issue" data-id="' + e + '">' + e + "</a>" : "-"
    },
    statusCls: function(e) {
        return "已派奖" === e ? " status" : ""
    },
    statusChs: function(e) {
        var t = ["未开奖", "未中奖", "已派奖", "等待派奖", "个人撤单", "系统撤单", "已退款", "已中奖", "异常状态"];
        return t[e] || ""
    },
    istraceCh: function(e) {
        return 1 === e ? "是" : "否"
    },
    traceStatusChs: function(e) {
        var t = {
            1: '<i class="altrace">已追</i>',
            0: "未开始"
        };
        return t[e]
    },
    lotteryStatusChs: function(e) {
        var t = {
            1: '<i class="already">已派奖</i>',
            0: "未开奖"
        };
        return t[e]
    },
    agentStatusChs: function(e) {
        var t = {
            1: "暂停",
            0: "正常"
        };
        return t[e]
    },
    statusCh: function(e) {
        var t = {
            0: "进行中",
            1: "已完成",
            2: "已取消",
            4: "已撤单"
        };
        return t[e]
    },
    userChs: function(e) {
        var t = ["普通用户", "代理用户", "代理用户", "代理用户", "商家", "管理用户"];
        return t[e]
    },
    combineChs: function(e) {
        var t = ["合庄资金", "补充合庄资金", "撤庄资金"];
        return t[e]
    },
    setBalance: function(e, t, a) {
        return "number" != typeof a ? "" : .0751 > a ? "" : "5" == e ? "" : '<a class="hand balance" name="' + t + '" rel="balance">充值</a>'
    },
    setPermission: function(e, t) {
        return "5" == e ? '<a class="hand setting" name="' + t + '" rel="permission">修改权限</a>' : ""
    },
    lotteryChs: function(e) {
        var t = {
            CQ11Y: "重庆11选5"
        };
        return $("#lotteryClass dd[data-lt=" + e + "] em").size() > 0 ? $("#lotteryClass dd[data-lt=" + e + "] em").html() : "undefined" != typeof t[e] ? t[e] : "-"
    },
    ltDesc: function(e) {
        var t = {
            WBG: "10:00-02:00 3分钟一期 共320期",
            WBG5FC: "5分钟一期 全天参与",
            WBGFFC: "每分钟开奖 全天参与",
            WBGMMC: "即买即开 无需等待",
            CQSSC: "<span>10:00-22:00</span> 10分钟一期 共72期",
            JXSSC: "<span>9:10-23:00</span> 10分钟一期 共84期",
            XJSSC: "<span>10:10-02:00</span> 10分钟一期 共96期",
            CQ11Y: "<span>9:10-23:00</span> 10分钟一期 共84期",
            GD11Y: "<span>9:10-23:00</span> 10分钟一期 共84期",
            JX11Y: "<span>9:10-23:00</span> 10分钟一期 共84期",
            SD11Y: "<span>9:05-21:55</span> 10分钟一期 共78期",
            "3DFC": "每天一期 20:30开奖",
            BJPK10: "<span>9:02-23:57</span> 5分钟一期 共179期"
        }
          , a = new Date;
        return "CQSSC" === e && (a.getHours() > 21 || a.getHours() < 2) && (t.CQSSC = "22:00—01:55 5分钟一期 共48期"),
        t[e] || ""
    },
    checkDetail: function(e) {
        return void 0 === e ? "&nbsp;" : '<a class="hand traceDetails" data-id="' + e + '">详情</a>'
    },
    checkDetailByStatus: function(e, t) {
        return void 0 === e || 4 === t ? "&nbsp;" : '<a class="hand traceDetails" data-id="' + e + '">详情</a>'
    },
    tracestatusChs: function(e) {
        var t = {
            1: "已追号",
            0: "追号中",
            2: "追号撤销",
            3: "系统撤销"
        };
        return t[e]
    },
    tracestatusDisable: function(e) {
        var t = {
            1: ' disabled="disabled"',
            0: "追号中",
            2: ' disabled="disabled"',
            3: ' disabled="disabled"'
        };
        return t[e]
    },
    traceDisable: function(e) {
        return void 0 === e ? "" : ' disabled="disabled"'
    },
    traceClsDisable: function(e) {
        var t = {
            1: " disabled",
            0: "",
            2: " disabled",
            3: " disabled",
            4: " disabled"
        };
        return t[e]
    },
    traceClsDisableId: function(e) {
        return void 0 === e ? "" : " disabled"
    },
    modeTyp: function(e, t) {
        if ("undefined" == typeof e)
            return "";
        var a = {
            0: "Y",
            1: "SHI",
            2: "是"
        };
        return "0" === t ? a[e] : "否"
    },
    isNumber: function(e) {
        return "number" == typeof e && isFinite(e)
    },
    thousandSep: function(e) {
        if (!Q.isNumber(e))
            return "-";
        var t = e.toString()
          , a = t.indexOf(".");
        return t.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function(e, t) {
            return 0 > a || a > t ? e + "," : e
        }
        )
    },
    debouncer: function(e, t) {
        var a, t = t || 200;
        return function() {
            var n = this
              , i = arguments;
            clearTimeout(a),
            a = setTimeout(function() {
                e.apply(n, Array.prototype.slice.call(i))
            }
            , t)
        }
    },
    inputChk: function(e, t) {
        e.keyup(Q.debouncer(t, 600)),
        e.on("paste", function(e) {
            Q.debouncer(t, 200)
        }
        ),
        e.change(function() {
            Q.debouncer(t, 200)
        }
        )
    },
    inputBlankCheck: function(e, t, a) {
        var n = function() {
            var n = e.attr("name")
              , i = "errorcount"
              , s = a;
            "" === e.val() ? t.find('.regform-error[name="' + n + '"]').html(s).css("opacity", 1).addClass(i) : t.find('.regform-error[name="' + n + '"]').css("opacity", 0).removeClass(i)
        }
        ;
        Q.inputChk(e, n)
    },
    inputFormatCheck: function(e, t, a, n) {
        var i = function() {
            var i = e.attr("name")
              , s = "errorcount"
              , l = n;
            "" === e.val() ? a.find('.regform-error[name="' + i + '"]').html(l).css("opacity", 1).addClass(s) : t.test(e.val()) ? a.find('.regform-error[name="' + i + '"]').css("opacity", 0).removeClass(s) : a.find('.regform-error[name="' + i + '"]').html(e.attr("rel")).css("opacity", 1).addClass(s)
        }
        ;
        Q.inputChk(e, i)
    },
    inputPwdFormatCheck: function(e, t, a, n, i, s) {
        var l = function() {
            var l = e.attr("name");
            "" === e.val() ? a.find('.regform-error[name="' + l + '"]').html(n).css("opacity", 1).addClass("errorcount") : t.test(e.val()) ? e.val() !== s.val() ? "" !== s.val() && a.find('.regform-error[name="' + l + '"]').html("两次输入的密码不一致").css("opacity", 1).addClass("errorcount") : (a.find('.regform-error[name="' + l + '"]').css("opacity", 0).removeClass("errorcount"),
            a.find('.regform-error[name="' + i + '"]').css("opacity", 0).removeClass("errorcount")) : a.find('.regform-error[name="' + l + '"]').html(e.attr("rel")).css("opacity", 1).addClass("errorcount")
        }
        ;
        Q.inputChk(e, l)
    },
    getRandom: function() {
        return Math.floor(8 * Math.random() + 1)
    },
    smartResize: function() {
        !function(e) {
            var t, a, n = e.event;
            t = n.special.debouncedresize = {
                setup: function() {
                    e(this).on("resize", t.handler)
                },
                teardown: function() {
                    e(this).off("resize", t.handler)
                },
                handler: function(e, i) {
                    var s = this
                      , l = arguments
                      , r = function() {
                        e.type = "debouncedresize",
                        n.dispatch.apply(s, l)
                    }
                    ;
                    a && clearTimeout(a),
                    i ? r() : a = setTimeout(r, t.threshold)
                },
                threshold: 75
            }
        }
        (jQuery)
    },
    showPagination: function(e, t, a, n) {
        $("#page").val(e);
        var i = Math.ceil(a / t);
        if (i !== n && null  !== n && (i = n),
        0 === a)
            return "";
        var s = ""
          , l = ""
          , r = "";
        1 != e && (s = '<a href="javascript:void(0);" class="prev" page="' + (e - 1) + '">上一页</a>'),
        e !== i && (r = '<a href="javascript:void(0);" class="next" page="' + (e + 1) + '">下一页</a>'),
        e - 2 >= 1 && (l += '<a href="javascript:void(0);" page="' + (e - 2) + '">' + (e - 2) + "</a>"),
        e - 1 >= 1 && (l += '<a href="javascript:void(0);" page="' + (e - 1) + '">' + (e - 1) + "</a>"),
        l += '<a href="javascript:;" class="on" page="' + e + '">' + e + "</a>",
        i >= e + 1 && (l += '<a href="javascript:void(0);" page="' + (e + 1) + '">' + (e + 1) + "</a>",
        i > e + 2 && 4 > i && (l += '<span class="page-break">...</span>')),
        i >= e + 2 && (l += '<a href="javascript:void(0);" page="' + (e + 2) + '">' + (e + 2) + "</a>",
        e >= 2 && i > 6 && e > 99 && (l += '<span class="page-break">...</span>')),
        i >= e + 3 && 100 > e && (l += '<a href="javascript:void(0);" page="' + (e + 3) + '">' + (e + 3) + "</a>",
        e >= 3 && i > 6 && (l += '<span class="page-break">...</span>')),
        1 > e - 2 && i >= e + 4 && (l += '<a href="javascript:void(0);" page="' + (e + 4) + '">' + (e + 4) + "</a>",
        2 == e && i > 6 && (l += '<span class="page-break">...</span>')),
        1 == e && i >= 6 && (l += '<a href="javascript:void(0);" page="' + (e + 5) + '">' + (e + 5) + "</a>",
        i > 6 && (l += '<span class="page-break">...</span>'));
        var d = [s, l, r].join("");
        return d
    },
    changeTypeChs: function(e) {
        var t = ["游戏投注", "追号扣款", "奖金派送", "投注返点", "佣金收入", "撤单返款", "撤销追号", "撤销派奖", "撤销返点", "撤销佣金", "成交金额", "冻结返款", "", "", "", "活动红利"];
        return t[e - 1]
    },
    orderTypeChs: function(e) {
        var t = ["交易市场", "传统投注"];
        return t[e]
    },
    isSelf: function(e) {
        return void 0 !== e && 1 === parseInt(e, 10) ? "highlight" : ""
    },
    calTxtwidth: function(e) {
        var t = e.html()
          , a = "<span>" + t + "</span>";
        e.html(a);
        var n = e.find("span:first").width();
        return e.html(t),
        n
    },
    oddEven: function(e) {
        return e % 2 === 0 ? 0 === e ? "evenTr first" : "evenTr" : void 0
    },
    traceNumber: function(e, t, a) {
        if (a > 119) {
            var n = Math.abs(119 - a);
            return a = 10 > n ? "0" + n : n,
            t + "-" + a
        }
        return a += 1,
        e + "-" + a
    },
    minutePer: function(e, t) {
        return (e + 1) * t
    },
    nextDay: function(e, t) {
        return t > 119 ? " nextDay" : ""
    },
    initChk: function(e) {
        return 5 > e ? ' checked="checked"' : ""
    },
    rightChk: function(e) {
        return e ? ' checked="checked"' : ""
    },
    itemChk: function(e) {
        return 5 > e ? " chkitem" : ""
    },
    itemNextDay: function(e) {
        if (e.indexOf("-") > -1) {
            var t = new Date;
            if (String(e.split("-")[0]) === t.Format("YYYYMMDD"))
                return ""
        }
        return " nextDay"
    },
    sameTimes: function() {
        return 1
    },
    doubleTimes: function() {
        return [1, 1, 2, 2, 4, 4, 8, 8, 16, 16, 32, 32, 64, 64, 128, 128, 256, 256, 512, 512, 1024, 1024, 2048, 2048, 4096, 4096, 8192, 8192, 16384, 16384, 32768, 32768, 65536, 65536, 99999]
    },
    initTraceList: function(e) {
        var t = Trace.maxtimes
          , a = Q.doubleTimes();
        return e < a.length ? a[e] : t
    },
    initSameTraceList: function(e) {
        var t = Q.sameTimes();
        return t
    },
    getUrlVars: function() {
        var e = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(t, a, n) {
            e[a] = n
        }
        );
        return e
    },
    numberConuter: function(e, t) {
        var a = []
          , n = [40, 50, 20, 15, 30];
        arguments.length > 2 && (a = arguments[2]),
        arguments.length > 3 && (n = arguments[3]),
        Counter = function() {
            function s() {}
            return s.prototype.init = function(l) {
                var r = Math.max.apply(null , t)
                  , d = t.indexOf(String(r));
                for (j = 0; j < l.length; j++)
                    a.length > 0 ? s.prototype["n" + j] = a[j] : s.prototype["n" + j] = 1;
                return this.render = setInterval(function(a) {
                    return function() {
                        for (i = 0; i < l.length; i++)
                            "0" != a["n" + i] && (i == d && (n[i] = Math.min.apply(null , n)),
                            a["n" + i] += Math.round(a["n" + i] * Math.random() * n[i]) / 100,
                            a["n" + i] > t[i] && (a["n" + i] = t[i] + ".00",
                            parseInt(t[i]) == t[i] ? a["n" + i] = t[i] + ".00" : a["n" + i] = t[i]),
                            a["n" + i] <= parseFloat(t[i]) && (parseInt(a["n" + i]) == a["n" + i] ? l[i].html(Q.thousandSep(parseFloat(a["n" + i])) + ".00") : l[i].html(Q.thousandSep(Math.round(100 * a["n" + i]) / 100))));
                        if (e.length > 1 && t.length > 1) {
                            if (a["n" + d] == r)
                                return clearInterval(a.render)
                        } else if (a.n0 == r)
                            return clearInterval(a.render)
                    }
                }
                (this), 1e3 / 60)
            }
            ,
            s
        }
        ();
        var s = new Counter
          , l = s.init(e);
        return l
    },
    chkquota: function(e) {
        return parseFloat(100 * e) < 7.6 ? "0" : "1"
    },
    floatAdd: function(e, t) {
        var a, n, i;
        try {
            a = e.toString().split(".")[1].length
        } catch (s) {
            a = 0
        }
        try {
            n = t.toString().split(".")[1].length
        } catch (s) {
            n = 0
        }
        return i = Math.pow(10, Math.max(a, n)),
        (e * i + t * i) / i
    },
    floatSub: function(e, t) {
        var a, n, i, s;
        try {
            a = e.toString().split(".")[1].length
        } catch (l) {
            a = 0
        }
        try {
            n = t.toString().split(".")[1].length
        } catch (l) {
            n = 0
        }
        return i = Math.pow(10, Math.max(a, n)),
        s = a >= n ? a : n,
        ((e * i - t * i) / i).toFixed(s)
    },
    floatMul: function(e, t) {
        var a = 0
          , n = e.toString()
          , i = t.toString();
        try {
            a += n.split(".")[1].length
        } catch (s) {}
        try {
            a += i.split(".")[1].length
        } catch (s) {}
        return Number(n.replace(".", "")) * Number(i.replace(".", "")) / Math.pow(10, a)
    },
    floatDiv: function(arg1, arg2) {
        var r1, r2, t1 = 0, t2 = 0;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {}
        with (Math)
            return r1 = Number(arg1.toString().replace(".", "")),
            r2 = Number(arg2.toString().replace(".", "")),
            r1 / r2 * pow(10, t2 - t1)
    },
    PkHzNum: {
        q2: ["3_19", "4_18", "5_17", "6_16", "7_15", "8_14", "9_13", "10_12", "11"],
        q3: ["6_27", "7_26", "8_25", "9_24", "10_23", "11_22", "12_21", "13_20", "14_19", "15_18", "16_17"]
    },
    getUrlParam: function(e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)")
          , a = window.location.search.substr(1).match(t);
        return null  != a ? unescape(a[2]).toUpperCase() : null 
    }
    */
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