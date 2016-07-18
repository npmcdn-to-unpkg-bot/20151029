var User = User || {};
User = {
//  sso: globeEnv[envFlag].auth, //sso登录地址
//  app: globeEnv[envFlag].sso,
  ssoapi: {
    'login': '/m/sso/login', //1.1.单点登录 [SSO接口,非用户中心接口，需提供appId参数]
    'logout': '/m/sso/logout', //1.2.登出 [SSO接口,非用户中心接口]
    'status': '/m/sso/u/getUserLoginState', //1.3.查询用户登录状态 [SSO接口,非用户中心接口，需提供appId参数]
    'msgs': '/m/sso/u/getUserNewsCount', //1.4.查询用户最新的消息条数 [SSO接口,非用户中心接口，需提供appId参数]
    'balance': '/m/sso/u/getUserBalance', //1.5.查询用户余额 [SSO接口,非用户中心接口，需提供appId参数]
    'verify': '/m/sso/validateImageCode' //1.6.验证码输入判断接口
  },
  api: {
    'verify': '/m/sobet/validateImageCode', //2.1.验证码输入判断接口
    'exist': '/m/sobet/customerRegister/cnValidate', //2.2.验证用户是否存在
    'register': '/m/sobet/customerRegister', //2.3.验证码输入判断接口 [用户中心接口，需提供appId参数]
    'logout': '/sso/logout', //2.4.退出
    '': ''
  },
  looptime: 30000,
  local_url: window.location.origin || (window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '')),
  local_path: window.location.pathname,
  app_context: "", //加载该js的应用的名称
  loginOutRedirectUrl: null, //登出登出之后重定向url
  userLogout: null, //登出成功之后回调函数
  looprefresh: null,
  name: '',
  balance: 0,
  //[封][SSO接口1.1,非用户中心接口，需提供appId参数] //登陆成功之后回调函数,参数1为传入回调函数
  userLogin: function() {
    var loginbackfn;
    var login_platform = window.location.pathname + '/';
    login_platform = login_platform.replace(/\/+/g, '/');
    login_platform = login_platform.match(/\/([^\/]+)/i) ? login_platform.match(/\/([^\/]+)/i)[0] : '/';
    if (arguments.length > 0) {
      loginbackfn = arguments[0];
    }
    //console.log('user login, filter xss');
    //var htmlxss = filterXSS('<script>alert("xss");</scr'+'ipt>');
    //console.log(htmlxss);
    
    $(document.body).append('<iframe id="login-iframe" style="display: none;"></iframe>');
    $("iframe#login-iframe").attr('src', login_platform + '/u/login?backType=0&t=' + (new Date()).getTime());
    $("iframe#login-iframe").load(function() {
      if (typeof loginbackfn === 'function') {
        loginbackfn();
      }

      if (typeof User.loginOk === 'function') {
        User.loginOk();
      }

      //获取用户总消息数 和 用户余额
      User.updateMsg();
      User.updateMoney();

      setTimeout(function() {
        $("iframe#login-iframe").remove();
      }, 1000);
    });
  },
  //[封][SSO接口1.1,非用户中心接口，需提供appId参数] //注册成功之后的回调函数
  registerCallback: function(usr, pwd) {

    User.ssoUserLogin({
      backurl: '?',
      context: $('.loginform'),
      name: usr,
      pwd: pwd
    }, function(res) {
      if (res.code == 0) {
        if ($('.loginform #rememberme:checked').size() > 0) {
          Cookies.set('lastlogin', usrname, {
            expires: 7
          });
        } else {
          Cookies.remove('lastlogin');
        }
        User.updateMoney();
        User.userLogin();

        $("ul.welcome li.guest").hide();
        $("ul.welcome li.customer").show();
      }
    });
  },
  //[原][SSO接口1.1,非用户中心接口，需提供appId参数]
  ssoUserLogin: function(s, fn) {
    var ssoParams = [
      User.ssoapi['login'],
      '?',
      'callback=', s.backurl,
      '&way=pwd',
      '&from=portal',
      '&cn=', s.name,
      '&appId=', '5',
      '&password=', md5(s.pwd)
    ];

    if (typeof s.capchaCode !== 'undefined') {
      ssoParams.push('&capchaCode=' + s.capchaCode);
    }
    $.ajax({
      url: ssoParams.join(''),
      context: s.context,
      dataType: 'jsonp',
      error: function(xhr) {
        fn(xhr);
      },
      success: function(res) {
        fn(res);
      }
    });
  },
  //[原][SSO接口1.2,非用户中心接口]IFRAME方式
  iframeLogout: function() {
    $(document.body).append('<iframe id="logout-iframe" style="display: none;"></iframe>');
    $("iframe#logout-iframe").attr('src', User.ssoapi['logout'] + '?cn=' + $('#globe-welcome span.nickname').html() + '&noRedirect=true&t=' + (new Date()).getTime());
    $("iframe#logout-iframe").load(function() {
      $("#globe-welcome .customer span.nickname").empty();
      $("#globe-welcome .customer .cash").empty();
      $("#globe-welcome .showmoney").attr('rel', 0);
      $('#globe-welcome .customer').hide();
      $('#globe-welcome .guest').show();

      if (typeof Lottery !== 'undefined') {
        Lottery.updateRecency();
      }

      setTimeout(function() {
        $("iframe#logout-iframe").remove();
      }, 1000);

      window.location = globeEnv[envFlag].sso + '/login';
    });
  },
  //[封][SSO接口1.2,非用户中心接口] //快速退出
  userQuit: function() {
    $('.quitall').unbind('click').click(function() {
      var d = dialog({
        title: '温馨提示',
        content: '您确定要退出吗？',
        skin: 'confirm-again',
        fixed: true,
        button: [{
          id: 'logout-ok',
          value: '确定',
          callback: function() {
            if (User.userLogout) {
              User.userLogout(function(res) {
                User.iframeLogout();
              });
            } else {
              User.iframeLogout();
            }
          }
        }, {
          id: 'logout-cancel',
          skin: 'cancel',
          value: '取消'
        }]
      }).showModal();
    });
  },
  //[原][SSO接口1.3,非用户中心接口，需提供appId参数]
  getStatus: function(fn) {
    $.ajax({
      url: User.ssoapi['status'] + '?appId=5',
      type: 'GET',
      dataType: 'jsonp',
      success:function(res) {
          fn(res);
      },
      error:function() {
          fn("error");
      }
    });
  },
  //[封][SSO接口1.3,非用户中心接口，需提供appId参数] //前置检查登录状态
  chkLogin: function() {
    var backfn;
    if (arguments.length > 0) {
      backfn = arguments[0];
    }
    User.getStatus(function(d) {
      if (d.code === 0) {
        if ($('#loginiframe').length) {
          $('#loginiframe').remove();
        }
        User.userLogin(backfn);
      } else {
        // 需要登录
        if (!$(".loginlnk").hasClass('waiting')) {
          $(".loginlnk").trigger('click');
        }
      }
    });
  },
  //[用户中心接口2.1]OLD
  chkVerifyCode: function(type, code, fn) {

    $.ajax({
      url: User[type]['verify'],
      type: 'POST',
      dataType: "jsonp",
      data: {
        'imageCode': code
      }
    }).done(function(res) {
      fn(res);
    }).fail(function() {
      fn("error");
    });
  },
  //[用户中心接口2.2]OLD
  chkUserExist: function(username, fn) {
    $.ajax({
      url: User.api['exist'],
      type: 'POST',
      dataType: "jsonp",
      data: {
        'type': 'jsonp',
        'cn': username,
        'userName': username
      }
    }).done(function(res) {
      fn(res);
    }).fail(function() {
      fn("error");
    });
  },
  //[用户中心接口2.3]OLD //用户中心注册新用户 [需提供appId参数]
  ssoUserReg: function(s, fn) {
    $.ajax({
      url: User.api['register'] + '?appId=' + globeId(User.local_path),
      type: 'POST',
      dataType: 'jsonp',
      data: {
        'cn': s.cn,
        'password': md5(s.pwd),
        'authCode': s.code
      }
    }).done(function(res) {
      fn(res);
    }).fail(function() {
      fn("error");
    });
  },
  //[用户中心接口2.4]OLD //[用户中心退出]跨域方式，暂未使用
  ssoUserLogout: function(fn) {
    var ssoParams = [
      User.api['logout'],
      '?',
      'appContext=', User.sso
    ];
    $.ajax({
      url: ssoParams.join(''),
      dataType: 'jsonp',
      error: function(xhr) {
        fn(xhr)
      },
      success: function(res) {
        fn(res);
      }
    });
  }
};
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

var Api = Api || {};
Api = {
    route: {
    	getSlides: '/m/sobet/api/i/anon/activity/queryCurrentActivity',
    	getAdminNotice:'/m/sobet/adminCommon/getAdminNotice.do',
        getOdds: "/lottery-mobile/api/anon/v1/lottery/odds",
        getOddsByLt: "/lottery-mobile/api/anon/v1/lottery/odds_app",
        getAllHistory: "/lottery-mobile/api/m/v1/lottery/open_issue_app",
        getHistoryByLt: "/lottery-mobile/api/m/v1/lottery/last_open_issue_app",
        getIssue: "/lottery-mobile/api/m/v1/lottery/issue_info_app",
        addOrder: "/lottery-mobile/api/m/v1/lottery/add_order",
        addOrderMMC: "/lottery-mobile/api/m/v1/lottery/add_order_now",
        getOrderList : "/lottery-mobile/api/m/v1/lottery/history_orders",
        getOrderDetail : "/lottery-mobile/api/m/v1/lottery/recent_detail",
        getTraceList : "/lottery-mobile/api/m/v1/lottery/lottery_trace",
        getTraceDetail : "/lottery-mobile/api/m/v1/lottery/trace",
        stopTrace : "/lottery-mobile/api/m/v1/lottery/trace_cancel",
        getTraceIssue : "/lottery-mobile/api/m/v1/lottery/trace_issue",
        cancelOrder : "/lottery-mobile/api/m/v1/lottery/cancel_order",
        getRechargeList : "/m/sobet/m/query/rechargeOrder_ajaxList",
        rechargeIndex : "/m/sobet/pay/m/rechargeIndexView",
        recharge : "/m/sobet/pay/m/recharge",
        getDrawList : "/m/sobet/m/query/drawOrder_ajaxList",
        getWithDrawInfo : '/m/sobet/pay/m/drawCashIndexView',
        withDrawSubmit : '/m/sobet/pay/m/withdrawCash',
        
        
        
        
        /**
        getIssueInfo: "/api/anon/v1/lottery/issue_info",
        getLotteryTimes: "/api/call/v1/lottery/times",
        getSimilar: "/api/anon/v1/lottery/matches",
        getDish: "/api/anon/v1/lottery_market/top_odds_code",
        getUserTradeVolume: "/api/anon/v1/lottery_market/trade_volume",
        getSameNumber: "/api/anon/v1/lottery_market/same_number",
        qusrpermission: "/api/u/v1/agent/queryUserPermission",
        getproxyinfo: "/api/u/v1/agent/getProxyInfo",
        qpermissionlist: "/api/u/v1/agent/queryPermissionList",
        qpermissionbyid: "/api/u/v1/agent/queryUserPermissionById",
        mpermission: "/api/u/v1/agent/modifyPermission",
        
        uploadCode: "/api/u/v1/lottery/uploadCode",
        getRecency: "/api/u/v1/lottery/recent_order",
        getRecencyDetail: "/api/u/v1/lottery/recent_detail",
        addOrderMarket: "/api/u/v1/lottery_market/add_order",
        getTradeNumber: "/api/u/v1/lottery_market/trade_number",
        getOrderDetail: "/api/u/v1/lottery_market/order_detail",
        getMoney: "/api/u/money",
        getHistoryParams: "/api/u/v1/lottery/search_params",
        getHistory: "/api/u/v1/lottery/history_orders",
        getMarketHistory: "/api/u/v1/lottery_market/history_orders",
        cancelOrder: "/api/u/v1/lottery/cancel_order",
        cancelOrderMarket: "/api/u/v1/lottery_market/cancel_order",
        getTraces: "/api/u/v1/lottery/lottery_trace",
        getMarketTraces: "/api/u/v1/lottery_market/lottery_trace",
        getTrace: "/api/u/v1/lottery/trace",
        getMarketTrace: "/api/u/v1/lottery_market/trace",
        cancelTrace: "/api/u/v1/lottery/trace_cancel",
        cancelMarketTrace: "/api/u/v1/lottery_market/trace_cancel",
        agentlink: "/api/u/v1/agent/user_link",
        updatepoint: "/api/u/v1/agent/update_point",
        createlink: "/api/u/v1/agent/create_link",
        getlinks: "/api/u/v1/agent/links",
        deletelink: "/api/u/v1/agent/delete_link",
        lotterypoints: "/api/u/v1/agent/lottery_points",
        lotterypointrate: "/api/u/v1/agent/point_info",
        users: "/api/u/v1/agent/users",
        agentregister: "/api/u/v1/agent/agent_register",
        userinfo: "/api/u/v1/agent/user_info",
        teambalance: "/api/u/v1/agent/team_balance",
        transfer: "",
        setpoints: "/api/u/v1/agent/set_user_point",
        accountinfo: "/api/u/v1/agent/account_info",
        getteamreport: "/api/u/v1/agent/getTeamReport",
        accountinforeport: "/api/u/v1/report/account_info",
        pointinfo: "/api/u/v1/agent/point_info",
        summary: "/api/u/v1/agent/summary",
        reportquery: "/api/u/v1/report/report_query",
        reportquerymarket: "/api/u/v1/report/report_query",
        commission: "/api/u/v1/report/commission",
        getteaminfo: "/api/u/v1/agent/getTeamInfo",
        getagentquota: "/api/u/v1/agent/getAgentquota",
        getagentquotabyusr: "/api/u/v1/agent/getAgentquotaByUser",
        quotaassign: "/api/u/v1/agent/quotaAssign",
        quotagc: "/api/u/v1/agent/quotagc",
        agent: {
            html: "/lottery/agent.html"
        },
        report: {
            html: "/lottery/report.html"
        },
        queryActivity: "/api/i/anon/activity/queryCurrentActivity"
        */
    },
    
    getData : function(url,fn){
    	Common.showLoading();
    	var param = {
            url: url,
            type: "GET",
            cache: false,
            dataType: "json",
            success : function(xhr) {
            	Common.closeLoading();
				fn(xhr);
			},
			error : function(){
				Common.closeLoading();
				fn("error");
			}
    	};    
    	if(arguments.length > 2){
    		param.data = arguments[2];
    	}
    	$.ajax(param);
    },
    postData : function(url,fn){
    	Common.showLoading();
    	var param = {
            url: url,
            type: "POST",
            cache: false,
            dataType: "json",
            success : function(xhr) {
            	Common.closeLoading();
				fn(xhr);
			},
			error : function(){
				Common.closeLoading();
				fn("error");
			}
    	};    
    	if(arguments.length > 2){
    		param.data = arguments[2];
    	}
    	$.ajax(param);
    },
    
    getOdds: function(fn) {
    	Api.getData(Api.route.getOdds,fn);
    },
    getOddsByLt: function(obj,fn) {
    	Api.getData(Api.route.getOddsByLt,fn,obj);
    },
    getIssueInfo: function(p, fn) {
    	Api.getData(Api.route.getIssueInfo,fn,p);
    },
    addOrder: function(obj, fn) {
    	var url = "WBGMMC" === obj.lottery ? Api.route.addOrderMMC : Api.route.addOrder;
    	Api.postData(url,fn,obj);
    },
    getSlides: function(s, fn) {
    	Api.getData(Api.route.getSlides,fn,s);
    },
    getAllHistory:function(fn){
    	Api.getData(Api.route.getAllHistory,fn);
    },
    getHistoryByLt:function(lt,fn){
    	Api.getData(Api.route.getHistoryByLt,fn,lt);
    },
    getIssue:function(lt,fn){
    	Api.getData(Api.route.getIssue,fn,lt);
    },
    getOrderList:function(obj,fn){
    	Api.getData(Api.route.getOrderList,fn,obj);
    },
    getOrderDetail:function(id,fn){
    	Api.getData(Api.route.getOrderDetail,fn,id);
    },
    getTraceList:function(obj,fn){
    	Api.getData(Api.route.getTraceList,fn,obj);
    },
    getTraceDetail:function(id,fn){
    	Api.getData(Api.route.getTraceDetail,fn,id);
    },
    stopTrace:function(obj,fn){
    	Api.getData(Api.route.stopTrace,fn,obj);
    },
    getTraceIssue:function(obj,fn){
    	Api.getData(Api.route.getTraceIssue,fn,obj);
    },
    cancelOrder:function(obj,fn){
    	Api.getData(Api.route.cancelOrder,fn,obj);
    },
    getRechargeList:function(obj,fn){
    	Api.getData(Api.route.getRechargeList,fn,obj);
    },
    rechargeIndex:function(obj,fn){
    	Api.getData(Api.route.rechargeIndex,fn,obj);
    },
   /* recharge:function(obj,fn){
    	Api.getData(Api.route.recharge,fn,obj);
    },*/
    getDrawList:function(obj,fn){
    	Api.getData(Api.route.getDrawList,fn,obj);
    },
    getWithDrawInfo:function(fn){
    	Api.getData(Api.route.getWithDrawInfo,fn);
    },
    withDrawSubmit:function(obj,fn){
    	Api.getData(Api.route.withDrawSubmit,fn,obj);
    },
    getAdminNotice:function(obj,fn){
    	Api.getData(Api.route.getAdminNotice,fn,obj);
    },
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    geturl: function(e) {
        var t, a = arguments;
        if (arguments.length > 1 && (t = arguments[1]),
        "object" == typeof Api.apimap.route[e] && t)
            return arguments.length > 2 ? (pageparams = arguments[2],
            [String(Api.apimap.route[e][t]).replace(".json", (pageparams.page > 1 ? "_" + pageparams.page : "") + ".json")].join("")) : [Api.apimap.route[e][t]].join("");
        var n = 0;
        return a.length > 1 && (n = a[1].page),
        [Api.url, String(Api.apimap.route[e]).replace(".json", (n > 1 ? "_" + n : "") + ".json")].join("")
    },
    getCommon: function(e, t, a) {
        var n = arguments;
        if ("undefined" != typeof t.cache) {
            if ("object" == typeof Api.cache[e]) {
                var i = Api.cache[e];
                return -1 !== i || void 0 === n[3] || n[3] !== !0 || $(".loginlnk").hasClass("waiting") ? (a(i),
                setTimeout(function() {
                    delete Api.cache[e]
                }
                , 1e4),
                !1) : ($(".loginlnk").trigger("click"),
                !1)
            }
            Api.cache[e] = 1
        }
        $.ajax({
            url: Api.geturl(e, t),
            type: "undefined" != typeof t.action ? t.action : "GET",
            cache: !1,
            dataType: "json",
            data: t
        }).done(function(i) {
            return "undefined" != typeof Api.cache[e] && Api.cache[e] && (Api.cache[e] = i),
            -1 !== i || void 0 === n[3] || 1 !== n[3] || $(".loginlnk").hasClass("waiting") ? void a(i) : ($(".loginlnk").trigger("click"),
            "function" == typeof t.failed && t.failed(),
            !1)
        }
        ).fail(function() {
            "function" == typeof t.failed && t.failed(),
            a("error")
        }
        )
    },
    getHtml: function(e, t, a, n) {
        $.ajax({
            url: Api.geturl(e, t, a),
            type: "GET",
            cache: !1,
            dataType: "undefined" != typeof a.type ? a.type : "html",
            data: a
        }).done(function(e) {
            n(e)
        }
        ).fail(function() {
            n("error")
        }
        )
    },
    getOdds: function(e) {
        $.ajax({
            url: Api.geturl("getOdds"),
            type: "GET",
            cache: !1,
            dataType: "json"
        }).done(function(t) {
            e(t)
        }
        ).fail(function() {
            e("error")
        }
        )
    },
    getMarketOdds: function(e) {
        $.ajax({
            url: Api.geturl("getMarketOdds"),
            type: "GET",
            cache: !1,
            dataType: "json"
        }).done(function(t) {
            e(t)
        }
        ).fail(function() {
            e("error")
        }
        )
    },
    
    getLotteryTimes: function(e, t) {
        $.ajax({
            url: Api.geturl("getLotteryTimes", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    getSimilar: function(e, t) {
        $.ajax({
            url: Api.geturl("getSimilar", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    addOrder: function(e, t) {
        $.ajax({
            url: "WBGMMC" === e.lottery ? Api.geturl("addOrderMMC", e) : Api.geturl("addOrder", e),
            type: "POST",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function(e) {
            t(e)
        }
        )
    },
    cancelOrder: function(e, t) {
        $.ajax({
            url: Api.geturl("cancelOrder", e),
            type: "POST",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function(e) {
            t(e)
        }
        )
    },
    cancelOrderMarket: function(e, t) {
        $.ajax({
            url: Api.geturl("cancelOrderMarket", e),
            type: "POST",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function(e) {
            t(e)
        }
        )
    },
    getRecency: function(e, t) {
        $.ajax({
            url: Api.geturl("getRecency", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function(e) {
            t(e)
        }
        )
    },
    getRecencyDetail: function(e, t) {
        $.ajax({
            url: Api.url + "/api/u/v1/lottery/recent_detail",
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function(e) {
            t(e)
        }
        )
    },
    addOrderMarket: function(e, t) {
        $.ajax({
            url: Api.url + "/api/u/v1/lottery_market/add_order",
            type: "POST",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function(e) {
            t(e)
        }
        )
    },
    getSameNumber: function(e, t) {
        $.ajax({
            url: Api.geturl("getSameNumber", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    getTradeNumber: function(e, t) {
        $.ajax({
            url: Api.geturl("getTradeNumber", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    getOrderDetail: function(e, t) {
        $.ajax({
            url: Api.url + "/api/u/v1/lottery_market/order_detail",
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    getDish: function(e, t) {
        $.ajax({
            url: Api.geturl("getDish", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    getUserTradeVolume: function(e, t) {
        $.ajax({
            url: Api.geturl("getUserTradeVolume", e),
            type: "GET",
            cache: !1,
            dataType: "json",
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    },
    getMoney: function(e) {
        $.ajax({
            url: Api.url + "/api/u/money",
            type: "GET",
            cache: !1,
            dataType: "json",
            data: s
        }).done(function(t) {
            e(t)
        }
        ).fail(function(t) {
            e(t)
        }
        )
    },
    getTrace: function(e, t) {
        Api.getCommon("getTrace", e, t)
    },
    getMarketTrace: function(e, t) {
        Api.getCommon("getMarketTrace", e, t)
    },
    cancelTrace: function(e, t) {
        Api.getCommon("cancelTrace", e, t)
    },
    cancelMarketTrace: function(e, t) {
        Api.getCommon("cancelMarketTrace", e, t)
    },
    getActivity: function(e, t) {
        var a = Api.geturl("queryActivity").replace("/lottery/", "/sobet/");
        $.ajax({
            url: a,
            type: "GET",
            dataType: "json",
            cache: !1,
            data: e
        }).done(function(e) {
            t(e)
        }
        ).fail(function() {
            t("error")
        }
        )
    }
};
var Q = Q || {};
Q = {
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
    }*/
}
var LotteryClass = LotteryClass || {};
LotteryClass = {
    names: {
    	"WBG5FC": "WBG5分彩",
        "WBGFFC": "WBG分分彩",
        "WBGMMC": "WBG秒秒彩",
        "CQSSC": "重庆时时彩",
        "XJSSC": "新疆时时彩",
        "GD11Y": "广东11选5",
        "SD11Y": "山东11选5",
        "JX11Y": "江西11选5",
        "BJPK10": "北京PK10",
        "3DFC": "3D福彩"
    },
    WBG5FC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双",
            rx: "任选玩法",
            rx2: "任选二",
            rx3: "任选三",
            rx4: "任选四"
        },
        ltMethod: {
        	wx: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|4",
                    name: "四星直选单式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "后三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "后三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "前三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "前三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "中三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "中三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
            	zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hds: {
                    desc: "后二直选(单式)",
                    num: "input|zx|2",
                    name: "后二直选单式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qds: {
                    desc: "前二直选(单式)",
                    num: "input|zx|2",
                    name: "前二直选单式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hds: {
                    desc: "后二组选(单式)",
                    num: "input|zux|2",
                    name: "后二组选单式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qds: {
                    desc: "前二组选(单式)",
                    num: "input|zux|2",
                    name: "前二组选单式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
            	dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
            	bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
            	dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
            	zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_ds: {
                    desc: "直选单式",
                    num: "input|zx|2",
                    name: "任二直选单式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_ds: {
                    desc: "组选单式",
                    num: "input|zux|2",
                    name: "任二组选单式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "任三直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hh: {
                    desc: "混合组选",
                    num: "input|hh|3",
                    name: "任三混合组选"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|4",
                    name: "任四直选单式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    WBGFFC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双"
        },
        ltMethod: {
            wx: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|5",
                    name: "五星直选单式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|4",
                    name: "四星直选单式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "后三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "后三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "前三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "前三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "中三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "中三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
            	zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hds: {
                    desc: "后二直选(单式)",
                    num: "input|zx|2",
                    name: "后二直选单式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qds: {
                    desc: "前二直选(单式)",
                    num: "input|zx|2",
                    name: "前二直选单式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hds: {
                    desc: "后二组选(单式)",
                    num: "input|zux|2",
                    name: "后二组选单式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qds: {
                    desc: "前二组选(单式)",
                    num: "input|zux|2",
                    name: "前二组选单式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
            	dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
            	bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
            	dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            }
        }
    },
    WBGMMC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双"
        },
        ltMethod: {
            wx: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|5",
                    name: "五星直选单式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|4",
                    name: "四星直选单式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "后三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "后三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "前三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "前三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_ds: {
                    desc: "单式",
                    num: "input|zx|3",
                    name: "中三码直选单式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "中三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
            	zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hds: {
                    desc: "后二直选(单式)",
                    num: "input|zx|2",
                    name: "后二直选单式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qds: {
                    desc: "前二直选(单式)",
                    num: "input|zx|2",
                    name: "前二直选单式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hds: {
                    desc: "后二组选(单式)",
                    num: "input|zux|2",
                    name: "后二组选单式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qds: {
                    desc: "前二组选(单式)",
                    num: "input|zux|2",
                    name: "前二组选单式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
            	dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
            	bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
            	dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            }
        }
    },
    CQSSC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双",
            rx2: "任选二",
            rx3: "任选三",
            rx4: "任选四"
        },
        ltMethod: {
            wx: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组选120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "后三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "前三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "中三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
            	zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
            	dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
            	bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
            	dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
            	zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hh: {
                    desc: "混合组选",
                    num: "input|hh|3",
                    name: "任三混合组选"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    XJSSC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双",
            rx2: "任选二",
            rx3: "任选三",
            rx4: "任选四"
        },
        ltMethod: {
            wx: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组选120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "后三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "前三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
            	zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "中三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
            	zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
            	dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
            	bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
            	dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
            	zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hh: {
                    desc: "混合组选",
                    num: "input|hh|3",
                    name: "任三混合组选"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    GD11Y: {
        ltTab: {
            sm: "三码",
            em: "二码",
            bdd: "不定胆",
            dwd: "定位胆",
            rxfs: "任选复式"
        },
        ltMethod: {
            sm: {
            	sm_zxfs: {
                    desc: "前三直选复式",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "前三直选复式"
                },
                sm_zuxfs: {
                    desc: "前三组选复式",
                    num: "前三组选|1-11|all",
                    name: "前三组选复式"
                },
            },
            em: {
            	em_zxfs: {
                    desc: "前二直选复式",
                    num: "第一位,第二位|1-11|all",
                    name: "前二直选复式"
                },
                em_zuxfs: {
                    desc: "前二组选复式",
                    num: "前二组选|1-11|all",
                    name: "前二组选复式"
                },
            },
            bdd: {
            	bdd_bdd11y: {
                    desc: "前三位",
                    num: "前三位|1-11|all",
                    name: "前三位不定胆"
                }
            },
            dwd: {
            	dwd_dwd11y: {
                    desc: "定位胆",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "定位胆"
                }
            },
            rxfs: {
            	"rxfs_1z1": {
                    desc: "一中一",
                    num: "选一中1|1-11|all",
                    name: "任选复式一中一"
                },
                "rxfs_2z2": {
                    desc: "二中二",
                    num: "选二中2|1-11|all",
                    name: "任选复式二中二"
                },
                "rxfs_3z3": {
                    desc: "三中三",
                    num: "选三中3|1-11|all",
                    name: "任选复式三中三"
                },
                "rxfs_4z4": {
                    desc: "四中四",
                    num: "选四中4|1-11|all",
                    name: "任选复式四中四"
                },
                "rxfs_5z5": {
                    desc: "五中五",
                    num: "选五中5|1-11|all",
                    name: "任选复式五中五"
                },
                "rxfs_6z5": {
                    desc: "六中五",
                    num: "选六中5|1-11|all",
                    name: "任选复式六中五"
                },
                "rxfs_7z5": {
                    desc: "七中五",
                    num: "选七中5|1-11|all",
                    name: "任选复式七中五"
                },
                "rxfs_8z5": {
                    desc: "八中五",
                    num: "选八中5|1-11|all",
                    name: "任选复式八中五"
                }
            }
        }
    },
    SD11Y: {
        ltTab: {
            sm: "三码",
            em: "二码",
            bdd: "不定胆",
            dwd: "定位胆",
            rxfs: "任选复式"
        },
        ltMethod: {
            sm: {
            	sm_zxfs: {
                    desc: "前三直选复式",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "前三直选复式"
                },
                sm_zuxfs: {
                    desc: "前三组选复式",
                    num: "前三组选|1-11|all",
                    name: "前三组选复式"
                },
            },
            em: {
            	em_zxfs: {
                    desc: "前二直选复式",
                    num: "第一位,第二位|1-11|all",
                    name: "前二直选复式"
                },
                em_zuxfs: {
                    desc: "前二组选复式",
                    num: "前二组选|1-11|all",
                  name: "前二组选复式"
                },
            },
            bdd: {
            	bdd_bdd11y: {
                    desc: "前三位",
                    num: "前三位|1-11|all",
                    name: "前三位不定胆"
                }
            },
            dwd: {
            	dwd_dwd11y: {
                    desc: "定位胆",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "定位胆"
                }
            },
            rxfs: {
            	"rxfs_1z1": {
                    desc: "一中一",
                    num: "选一中1|1-11|all",
                    name: "任选复式一中一"
                },
                "rxfs_2z2": {
                    desc: "二中二",
                    num: "选二中2|1-11|all",
                    name: "任选复式二中二"
                },
                "rxfs_3z3": {
                    desc: "三中三",
                    num: "选三中3|1-11|all",
                    name: "任选复式三中三"
                },
                "rxfs_4z4": {
                    desc: "四中四",
                    num: "选四中4|1-11|all",
                    name: "任选复式四中四"
                },
                "rxfs_5z5": {
                    desc: "五中五",
                    num: "选五中5|1-11|all",
                    name: "任选复式五中五"
                },
                "rxfs_6z5": {
                    desc: "六中五",
                    num: "选六中5|1-11|all",
                    name: "任选复式六中五"
                },
                "rxfs_7z5": {
                    desc: "七中五",
                    num: "选七中5|1-11|all",
                    name: "任选复式七中五"
                },
                "rxfs_8z5": {
                    desc: "八中五",
                    num: "选八中5|1-11|all",
                    name: "任选复式八中五"
                }
            }
        }
    },
    JX11Y: {
        ltTab: {
            sm: "三码",
            em: "二码",
            bdd: "不定胆",
            dwd: "定位胆",
            rxfs: "任选复式"
        },
        ltMethod: {
            sm: {
            	sm_zxfs: {
                    desc: "前三直选复式",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "前三直选复式"
                },
                sm_zuxfs: {
                    desc: "前三组选复式",
                    num: "前三组选|1-11|all",
                    name: "前三组选复式"
                },
            },
            em: {
            	em_zxfs: {
                    desc: "前二直选复式",
                    num: "第一位,第二位|1-11|all",
                    name: "前二直选复式"
                },
                em_zuxfs: {
                    desc: "前二组选复式",
                    num: "前二组选|1-11|all",
                    name: "前二组选复式"
                },
            },
            bdd: {
            	bdd_bdd11y: {
                    desc: "前三位",
                    num: "前三位|1-11|all",
                    name: "前三位不定胆"
                }
            },
            dwd: {
            	dwd_dwd11y: {
                    desc: "定位胆",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "定位胆"
                }
            },
            rxfs: {
            	"rxfs_1z1": {
                    desc: "一中一",
                    num: "选一中1|1-11|all",
                    name: "任选复式一中一"
                },
                "rxfs_2z2": {
                    desc: "二中二",
                    num: "选二中2|1-11|all",
                    name: "任选复式二中二"
                },
                "rxfs_3z3": {
                    desc: "三中三",
                    num: "选三中3|1-11|all",
                    name: "任选复式三中三"
                },
                "rxfs_4z4": {
                    desc: "四中四",
                    num: "选四中4|1-11|all",
                    name: "任选复式四中四"
                },
                "rxfs_5z5": {
                    desc: "五中五",
                    num: "选五中5|1-11|all",
                    name: "任选复式五中五"
                },
                "rxfs_6z5": {
                    desc: "六中五",
                    num: "选六中5|1-11|all",
                    name: "任选复式六中五"
                },
                "rxfs_7z5": {
                    desc: "七中五",
                    num: "选七中5|1-11|all",
                    name: "任选复式七中五"
                },
                "rxfs_8z5": {
                    desc: "八中五",
                    num: "选八中5|1-11|all",
                    name: "任选复式八中五"
                }
            }
        }
    },
    "3DFC": {
        ltTab: {
            sm: "三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆"
        },
        ltMethod: {
            sm: {
            	zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "三码组选六"
                },
                zux_hh: {
                    desc: "混合",
                    num: "input|hh|3",
                    name: "三码混合组选"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "三码组选和值"
                }
            },
            em: {
            	zx_hfs: {
                    desc: "后二直选复式",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_qfs: {
                    desc: "前二直选复式",
                    num: "百位,十位|0-9|all",
                    name: "前二直选复式"
                },
                zux_hfs: {
                    desc: "后二组选复式",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_qfs: {
                    desc: "前二组选复式",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                }
            },
            dwd: {
            	dwd_dwd: {
                    desc: "定位胆",
                    num: "百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
            	bdd_bdd1: {
                    desc: "一码",
                    num: "不定胆|0-9|all",
                    name: "一码不定胆"
                },
                bdd_bdd2: {
                    desc: "二码",
                    num: "不定胆|0-9|all",
                    name: "二码不定胆"
                }
            }
        }
    },

    BJPK10: {
        ltTab: {
            cq1: "猜冠军",
            cq2: "猜前二",
            cq3: "猜前三",
            cq4: "猜前四",
            cq5: "猜前五",
            dwd: "定位胆",
            dx: "大小",
            hz: "和值",
            ds: "单双",
            lh: "龙虎"
        },
        ltMethod: {
            cq1: {
            	cq1_cq1: {
                    desc: "猜冠军",
                    num: "冠军|1-10|all",
                    name: "猜冠军"
                }
            },
            cq2: {
            	cq2_cq2: {
                    desc: "猜前二",
                    num: "冠军,第二名|1-10|all",
                    name: "猜前二"
                },
                cq2_ds: {
                    desc: "猜前二(单式)",
                    num: "冠军,第二名|1-10|all",
                    name: "猜前二(单式)"
                }
            },
            cq3: {
            	cq3_cq3: {
                    desc: "猜前三",
                    num: "冠军,第二名,第三名|1-10|all",
                    name: "猜前三"
                },
                cq3_ds: {
                    desc: "猜前三(单式)",
                    num: "冠军,第二名,第三名|1-10|all",
                    name: "猜前三(单式)"
                }
            },
            cq4: {
            	cq4_cq4: {
                    desc: "猜前四",
                    num: "冠军,第二名,第三名,第四名|1-10|all",
                    name: "猜前四"
                },
                cq4_ds: {
                    desc: "猜前四(单式)",
                    num: "冠军,第二名,第三名,第四名|1-10|all",
                    name: "猜前四(单式)"
                }
            },
            cq5: {
            	cq5_cq5: {
                    desc: "猜前五",
                    num: "冠军,第二名,第三名,第四名,第五名|1-10|all",
                    name: "猜前五"
                },
                cq5_ds: {
                    desc: "猜前五(单式)",
                    num: "冠军,第二名,第三名,第四名,第五名|1-10|all",
                    name: "猜前五(单式)"
                }
            },
            dwd: {
            	dwd_q5: {
                    desc: "前五定位胆",
                    num: "冠军,第二名,第三名,第四名,第五名|1-10|all",
                    name: "前五定位胆"
                },
                dwd_h5: {
                    desc: "后五定位胆",
                    num: "第六名,第七名,第八名,第九名,第十名|1-10|all",
                    name: "后五定位胆"
                }
            },
            dx: {
            	dx_d1: {
                    desc: "冠军",
                    num: "冠军|0-1|two",
                    name: "大小冠军"
                },
                dx_d2: {
                    desc: "第二名",
                    num: "第二名|0-1|two",
                    name: "大小第二名"
                },
                dx_d3: {
                    desc: "第三名",
                    num: "第三名|0-1|two",
                    name: "大小第三名"
                },
                dx_d4: {
                    desc: "第四名",
                    num: "第四名|0-1|two",
                    name: "大小第四名"
                },
                dx_d5: {
                    desc: "第五名",
                    num: "第五名|0-1|two",
                    name: "大小第五名"
                }
            },
            hz: {
            	hz_q3: {
                    desc: "前三和值",
                    num: "和值|6-27|",
                    name: "前三和值"
                }
            },
            ds: {
            	ds_d1: {
                    desc: "冠军",
                    num: "冠军|2-3|two",
                    name: "单双冠军"
                },
                ds_d2: {
                    desc: "第二名",
                    num: "第二名|2-3|two",
                    name: "单双第二名"
                },
                ds_d3: {
                    desc: "第三名",
                    num: "第三名|2-3|two",
                    name: "单双第三名"
                },
                ds_d4: {
                    desc: "第四名",
                    num: "第四名|2-3|two",
                    name: "单双第四名"
                },
                ds_d5: {
                    desc: "第五名",
                    num: "第五名|2-3|two",
                    name: "单双第五名"
                }
            },
            lh: {
            	"lh_1v10": {
                    desc: "1v10",
                    num: "1v10|4-5|two",
                    name: "龙虎1v10"
                },
                "lh_2v9": {
                    desc: "2v9",
                    num: "2v9|4-5|two",
                    name: "龙虎2v9"
                },
                "lh_3v8": {
                    desc: "3v8",
                    num: "3v8|4-5|two",
                    name: "龙虎3v8"
                },
                "lh_4v7": {
                    desc: "4v7",
                    num: "4v7|4-5|two",
                    name: "龙虎4v7"
                },
                "lh_5v6": {
                    desc: "5v6",
                    num: "5v6|4-5|two",
                    name: "龙虎5v6"
                }
            }
        }
    }
};
var Lottery = Lottery || {};
Lottery = {
    lt: "",
    cls: "",
    method: "",
    odds:{},
    methods: null,
    countData: null, //确认号码时生成的数据
    orderObj: null, //提交注单时提交的注单数据
    orderlist : {}, //提交注单页返回购彩大厅时保存的数据
    countTime : null, //彩种倒计时
    interval : null, //定时器
    countOver : true, //倒计时
    skipTime : 0,
    isContinue : true, //秒秒彩是否连续开奖
    mmcLoading : false, //秒秒彩是否正在开奖
    loadingStatus:0,//下拉刷新上拉加载更多状态
    
    initEvents : function() {
    	var me = this;
    	
		me.initLottery();
		me.initSubmit();
		me.initHistory();
		me.initSearch();
		
		me.initTraceIssue();
		
		me.initMyAccount();
		
		me.initRecharge();
		
    },
    
    init: function() {
    	var me = this;
    	me.getOddsByLt();
    },
    
    getOddsByLt : function(){
		var me = this;
		Common.showLoading();
		if(!me.odds[me.lt]){
			Api.getOddsByLt({lottery:me.lt},function(d) {
				me.odds[me.lt] = d.result[me.lt];
				
		        //取期号 倒计时
				me.updateIssue();
				
				me.initTab(LotteryClass[me.lt]);

				Common.closeDialog();
			});
		}else{
			//取期号 倒计时
			me.updateIssue();
			
			me.initTab(LotteryClass[me.lt]);
	        
			Common.closeDialog();
		}
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
        		if (m.indexOf('zux_hh')!=-1 || m.indexOf('_ds')!=-1|| m.indexOf('_hds')!=-1|| m.indexOf('_qds')!=-1) {
        			if (m.indexOf('dxds')!=-1) {
        				
					}else {
						continue;
					}
				}
        		tpl += '<span data-type="' + m + '">' + ltMethod[t][m].desc + '</span>';
        	}
        	
        	tpl += '</div></div></div>';
        }
        
        tabDiv.find('.scroller').html(tpl);
		
		$('.tabSelect').off('touchend').on('touchend',function(){
			tabDiv.toggleClass('tabShow');
			tabDiv.hasClass('tabShow') ? Common.stopScrollBack = false : Common.stopScrollBack = true;
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
	        	
	        	//刷新 wrapper插件
	    		Common.initWrapper();
	    		
	        	if(Common.scroll[1]){
		    		var el = $(Common.scroll[1].scroller);
		    		
		    		Common.stopScrollBack = true;
		    		var h = 194;
		    		me.cls == 'pk10' ? h = 388 : h = 194;
		    		Common.scroll[1].on('scroll',function(){
		    			if(this.y > h){
		    				Common.stopScrollBack = false;
		    				el.removeClass('show-five');
		    			}else if(this.directionY < 0 && this.y > 0){//向下
			    			if(el.hasClass('show-five')){
			    				return;
			    			}
			    			Common.stopScrollBack = true;
			    			
		    				el.removeClass('hide-five').addClass('show-five');
		    				this.scrollTo(0,h,1000);
	    				} else if(this.directionY > 0  && this.y > 0){
	    					if(el.hasClass('hide-five')){
			    				return;
			    			}
	    					Common.stopScrollBack = false;
		    				el.removeClass('show-five').addClass('hide-five');
		    				this.scrollTo(0,h,0);
	    				}else{
	    					Common.stopScrollBack = false;
	    				}
		    		});
	        	}
	        	
	        	me.updateOdds();
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
                			if (String(arr[0][i]).indexOf(arr[1][j]) == -1) {
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
            	n += arr[i].length;
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
    		//alert(arr[0].length);
    		//alert(m[2]);
            n = Math.round(Math.nzn(arr[0].length, parseInt(m[2], 10)));
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
        //Math.precision(mode)
        result = result.toFixed(4);
        
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
    	if(me.interval){
			clearInterval(me.interval);
		}
    	var el = $('#lottery');
    	
		el.find('.ltName').html(me.ltName);
		
		if(me.lt == 'WBGMMC'){
			el.addClass('show-mmc');
		} else {
			el.removeClass('show-mmc');
		}
		Api.getIssue({lottery:me.lt},function(res){
			if(res.code == '1'){
				res = res.result;
				me.maxtraceCount = res.issueCount;
				me.issue = res.issue;
				if(res.lottery == 'WBGMMC'){
					me.updateLastFive(res);
				}else{
					el.removeClass('show-mmc');
					el.find('.lt-info').css('top',50 + 'px');
					el.find('.number').css('top',80 + 'px');
					//if(me.countOver){//只有当倒计时结束时候才会重新渲染最近5期
						el.find('.issue').html(me.issue);
						var issue = me.cls === 'pk10' ? me.issue : me.issue.substring(4);
						$('#submit .orderTime .issue').html(issue);
						me.updateLastFive(res);
					//}
					
					me.updateTime(res);
				}
			}
		});
    },
    updateLastFive : function(res){
    	var me = this;
    	var el = $('#lottery .lastfive ul');
    	el.find('li').remove();
    	if(me.lt == "WBGMMC"){
    		el.addClass('lastfive-mmc');
    	}
    	var lastfive = res.lastFive;
    	var li = '';
    	$(res.lastFive).each(function(){
    		li += '<li>';
    		if(me.lt != "WBGMMC"){
    			li += '<span>第<em>' + arguments[1].issue + '</em>期</span>';
    		}
    		
    		li += '<div>';
    		var code = arguments[1].code.split(',');
    		$(code).each(function(){
    			li += '<i>' + arguments[1] + '</i>';
    		})
    		
    		li += '</div></li>';
    	});
    	el.html(li);
    },
    
    updateTime : function(res){
    	var me = this;
    	var el = $('#lottery .lt-info');
    	
    	var second = parseInt(res.second);
		var time = el.find('.time');
		var stop = el.find('.stop');
		
		if (second == 0) {
			me.updateIssue();
			return false;
		} else if (second === -1) {
			stop.html('等待开售').show();
			time.hide();
			me.isStop = true;
		} else if (second === -2) {
			stop.html('暂停销售').show();
			time.hide();
			me.isStop = true;
		} else {
			me.isStop = false;
	        var h = Math.floor(second/3600);
	        var m = Math.floor((second%3600)/60)
	        var s = (second%3600)%60;
	        
	        h = h > 0 && h < 10 ? '0' + h : h;
	        m = m < 10 ? '0' + m : m;
	        s = s < 10 ? '0' + s : s;
	        
	        me.countTime = h == 0 ?  m + ":" + s : h + ":" + m + ":" + s;
	        
	        time.find('.countdown').html(me.countTime);
	        
	        me.interval = setInterval(function(){
	        	me.countDown();
			},1000);
	        
	        time.show();
	        stop.hide();
		} 
    },
    
    countDown : function(){
		var me = this;
		var array = me.countTime.split(":");
		
		var h,m,s;
		if(array.length > 2){
			h = parseInt(array[0]);
		    m = parseInt(array[1]);
		    s = parseInt(array[2]);
		} else {
			h = 0;
		    m = parseInt(array[0]);
		    s = parseInt(array[1]);
		}
		
		if(h <= 0 && m <=0 && s<= 0){
			me.countOver = true;
		} else {
			me.countOver = false;
		}
		
		if((h <= 0 && m <=0 && s<= 0) || me.skipTime > 10){
			me.skipTime = 0;
			me.updateIssue();
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
		
		h == 0 ?  array.splice(0,3,m,s) : array.splice(0,3,h,m,s)
		
		$(array).each(function(i,e){
			if(e < 10){
				array[i] = '0' + e;
			} 
		});
		
		me.skipTime += 1; 
		me.countTime = array.join(":");
		
		var lotteryCount = $('#lottery .time .countdown');
		var submitCount = $('#submit .orderTime .countdown');
			        
    	lotteryCount.html(me.countTime);
    	submitCount.html(me.countTime);
	},
	
    initLottery : function(){
    	var me = this;
    	var el = $('#lottery');
    	
    	el.find('.pageback').off('touchend').on("touchend",function(){
    		el.find('.tabDiv').removeClass('tabShow');
    		var obj = el.hasClass('edit') ?  {'transform':'translate3d(0,100%,0)'} : undefined;
        	Common.pageOut(obj);
        	
        	if(!obj){
        		if(me.interval){
        			clearInterval(me.interval);
        		}
        	}
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
    		}else if (parseInt(val) < parseInt(min)) {
    			$(this).val(min);
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
    		
    		if(me.isStop){
    			Common.showDialog({
    				content:'当前彩种暂停销售',
    				width:170,
    				height:41
    			});
    			return false;
    		}
    		
    		me.renderOrder();
    		
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
    renderOrder : function(){
    	var me = this;
    	var lt = $('#lottery');
    	var el = $('#submit');
    	
    	if(me.lt == 'WBGMMC'){
    		el.addClass('show-mmc');
			// 初始化滚动数字
    		if(!me.flipball){
    			me.flipball = $("#flipball").flipball({
    				ballsize: 5, // 彩球个数
    				initball: '0,0,0,0,0', // 初始化彩球数据
    				loop: 3, // 彩球滚动循环次数（必须为整数）
    				timeout: 500, // 彩球滚动动画执行时间基数
    				delay: 80, // 每个彩球动画执行延迟时间基数
    				offset: [54, 56] // 球的宽高
    			});
    		}
    	}else{
    		el.removeClass('show-mmc');
    	}
    	el.find('header .title').html(Q.getLtName(me.lt));
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
    	
		el.find('.pageback').off('touchend').on("touchend",function(evt){
			evt.preventDefault();
			var orderlist = $('.order-list');
			if(!$('.order-list') || $('.order-list > li').length ==0){
				me.orderlist[me.lt] = undefined;
				list.find('li').remove();
				me.setSubmitData();
				Common.closeDialog();
				
	    		lt.removeClass('edit').css('transform','translate3d(100%,0,0)')
				Common.pageOut();
	    		
        		if(me.interval){
        			clearInterval(me.interval);
        		}
			}else{
				var tip = {
		    			type : 'dialog',
		    			title : '返回',
		    			content : '要保存号码吗？',
		    			cancel : true,
		    			btns :[{
							cls:'no',
							text:'清除',
						    fn:function(){
								me.orderlist[me.lt] = undefined;
								list.find('li').remove();
								me.setSubmitData();
			    				Common.closeDialog();
			    				
			    	    		lt.removeClass('edit').css('transform','translate3d(100%,0,0)')
			    				Common.pageOut();
			    	    		
				        		if(me.interval){
				        			clearInterval(me.interval);
				        		}
							}
		    			},{
							cls:'yes',
							text:'保存',
							fn:function(){
								me.orderlist[me.lt] = list.html();
								list.find('li').remove();
			    				Common.closeDialog();
			    				me.setSubmitData();
			    				
			    	    		lt.removeClass('edit').css('transform','translate3d(100%,0,0)')
			    				Common.pageOut();
			    	    		
				        		if(me.interval){
				        			clearInterval(me.interval);
				        		}
							}
						}]
		    		}
		    		Common.showDialog(tip);
			}
    		
		});
		
		el.find('.winstop').on('touchend',function(evt){
    		evt.preventDefault();
    		var input = el.find('.trace input');
    		if(!input.val()){
    			return;
    		}
    		$(this).toggleClass('on');
    		me.setSubmitData();
    	});
		
    	el.find('.clearOrder span').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		var tip = {
    			type : 'dialog',
    		    title : '清空',
    			content : '确定要清空注单吗？',
    			btns :[{
					cls:'no',
					text:'确定',
				    fn:function(){
				    	list.find('li').remove();
				    	me.setSubmitData();
	    				Common.closeDialog();
	    			}
				},{
					cls:'yes',
					text:'取消',
					fn:function(){
	    				Common.closeDialog();
	    			}
				}]
    		}
    		Common.showDialog(tip);
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
    				type : 'dialog',
    				title : '删除',
        			content : '确定要删除吗？',
        			btns :[{
    					cls:'no',
    					text:'确定',
    				    fn:function(){
    				    	_this.parent('li').remove();
    				    	me.setSubmitData();
            				Common.closeDialog();
    	    			}
    				},{
    					cls:'yes',
    					text:'取消',
    					fn:function(){
    	    				Common.closeDialog();
    	    			}
    				}]
        		}
        		Common.showDialog(tip);
    			
    		} else if(_this.hasClass('update')){
    			Common.pageIn('#lottery');
    			var li = _this.parent('li');
    			
    			$('#lottery').addClass('restore').attr('data-restore',li.index());
    			me.restoreLottery(li);
    		}
    	});
    	
    	el.find('.trace input').on('change',function(evt){
    		evt.preventDefault();
    		var val = $(this).val();
    		var min = 1;
    		var max = me.lt == "WBGMMC" ? 1000 : me.maxtraceCount;
    		
    		if(val === ''){
    			$(this).val(min);
    		}else if(parseInt(val) > parseInt(max)){
    			$(this).val(max);
    		}else if (parseInt(val) < parseInt(min)) {
    			$(this).val(min);
			}
    		me.setSubmitData();
    	});
    	
    	el.find('.submit button').on('touchend',function(evt){
    		if ($(this).hasClass("locked")){
    			return false;
            }
    		evt.preventDefault();
    		
    		if ($(this).hasClass("disabled")){
    			return false;
            }
            
    		me.setSubmitData();
    		
    		if(!me.orderObj){
    			Common.showDialog({
    				content:'请至少选择一注号码'
    			});
    			return;
    		}
    		//秒秒彩连投
            if(me.lt === 'WBGMMC' && me.orderObj.istrace) {
	            var content = '<div class="dialog_mmc_trace"><div class="mmc-close">X</div>\
            	    <p><span>第<em id="mmcLoopNow">0</em>次</span><label class="status">开奖中</label></p>\
	            	<p>\
            	    	<span>已中奖<em id="mmcLoopDone">0</em>次</span>\
            	    	<span>总共<em>' + JSON.parse(Lottery.orderObj.trace).totalCount+ '</em>次</span>\
            	    </p>\
            	    <p class="mmc-last-prize">\
            	    	<span>[第<b id="mmcLoopPrize">0</b>次中奖：<b id="mmcLoopMoney">0</b>元]</span>\
            	    </p>\
            	    <p class="mmc-amount"><span>共中奖：<em id="mmcLoopAmount">0</em>元</span></p>\
            	    <p class="mmc-btn"><a href="javascript:;" class="btn-mmc-loop" data-type="1">停止</a></p>\
            	</div>';
            	
              	var tip = {
              		type:'dialog',
              		title:'连续开奖',
              		content:content,
              		contentStyle:'content-mmc'
              	}
              	
              	Common.showDialog(tip);
              	
              	$('.btn-mmc-loop').off('touchend').on('touchend',function(evt) {
                    var type = parseInt($(this).attr("data-type"), 10);
                    switch(type) {
                    	case 1:
                    		$(this).html('继续').attr('data-type', 2);
                    		$('.mmc-close').show();
                    		me.isContinue = false;
                    		break;
                    	case 2:
                    		if(!me.mmcLoading){
                        		$(this).html('停止').attr('data-type', 1);
                        		me.isContinue = true;
                        		me.addOrderMMCLoopApi();
                        		$('.mmc-close').hide();
                    		}else{
                    			Common.showDialog({content:'请等待当前开奖完成'});
                    		}
                    		break;
                    	case 3://关闭弹出框
                    		me.isContinue = true;
                        	Common.closeDialog();
                        	break;
                    	default: break;
                    }
                });
              	
              	$('.mmc-close').off('touchend').on('touchend',function(evt) {
              		if(!me.mmcLoading){
              			me.isContinue = true;
              			Common.closeDialog();
          			}else{
          				Common.showDialog({content:'请等待当前开奖完成'});
          			}
                });

              	me.addOrderMMCLoopApi();
            } else {
               me.addOrderApi();
            }
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
		
		var code = li.attr('data-code').split('|');
		var dl = e.find('.number dl').not('.dl-pos');
		$(code).each(function(){
			var dom = dl[arguments[0]];
			
//			var num;
			
			//坑爹的pk10和值
//			if(me.cls == 'pk10' && me.methods[0] == 'hz'){
//				num = arguments[1].split();
//			} else{
//				//var reg = me.cls == '11y' || (me.cls == 'pk10' && me.method.indexOf('hz') == -1) ? /(?=(?:\d{2})+?$)/ : '';
//				num = arguments[1].split(',');
//			}
			var num = arguments[1].split(',');

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
    
        var code = me.getCode();
        
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
                
                
                html = html + '<li data-method="' + hz_method + '" data-count="' + count.join('|') + '" data-code="' + hz_num + '"><div class="delete"></div><div class="content"><div class="title">\
						<span class="lt-name">' + name + '</span><span class="odd">奖金模式<em>' + count[3] + '</em></span></div>\
						<div class="code">' + hz_num + '</div><div class="info">\
						<span><em class="count">' + count[0] + '</em>注<em class="times">' + count[1] + '</em>倍</span>\
						<span class="mode">模式<em>' + count[7] + '</em></span>\
						<span class="profit">盈利<em>' + win +'</em></span></div></div><div class="update"></div></li>';
                
        	});
        } else {
        	var win = me.getMoneyWin(count, code, method).win;
        	var desc = me.codeFormat(code);
        	html = html + '<li data-method="' + me.method + '" data-count="' + me.countData + '" data-code="' + me.submitCodeFormat(code) + '"><div class="delete"></div><div class="content"><div class="title">\
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
    		code = code[0].toString().split(',');
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
    			code = code.filter(function(n){
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
    
    submitCodeFormat : function(code){
    	var me = this;
    	var arr = [];
    	$(code).each(function(){
    		arr.push(arguments[1].join(','));
    	});
    	return arr.join('|');
    },
    
    setSubmitData: function() {
    	var me = this;
    	var _el = $('#submit');
    	
    	var list = _el.find('.order-list li');
    	
    	var traceCount = parseInt(_el.find('.trace input').val());
    	
    	var totalCount = 0;
    	var totalMoney = 0;
    	
    	if(list.length == 0){
    		me.orderObj = null;
    	}else{
    		var orders = [];
        	
        	$(list).each(function(){
        	    //  注数  | 倍数  | 元角分厘   | 奖金模式  | 返点  | 总金额   | 选择位置（任选玩法）| 元角分厘名称
        		var data = $(this).attr('data-count').split('|');
        		var code = $(this).attr('data-code');
        		var method = $(this).attr('data-method');
        		totalCount += parseInt(data[0],10);
        		totalMoney += parseFloat(data[5],10);
        		var tmpOrder = {
    				//"method" : me.method,
        			"method" : method,
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
        		orders.push(tmpOrder);
        	});
        	
        	totalMoney = totalMoney * traceCount;

    		me.traceCount = traceCount;
    		
    		totalMoney = totalMoney.toFixed(4);
    		var trace = {
    			"start":me.issue,
    			"totalMoney":totalMoney,
    			"totalCount":traceCount,
    			"mode":2,//同倍追号
    			"winStop" : _el.find('.winstop').hasClass('on')
    		};
    		
    		if(traceCount > 1){
    			me.orderObj = {
    		        "lottery": me.lt,
    		        "order": JSON.stringify(orders),
    		        "trace" :JSON.stringify(trace),
    		        "istrace" : traceCount > 1
    		    };
    		}else{
    			me.orderObj = {
    		        "lottery": me.lt,
    		        "order": JSON.stringify(orders)
    		    };
    		}

    		if(me.lt != "WBGMMC"){
    			me.orderObj.issue = me.issue;
    		}
    	}
    	
    	_el.find('.traceCount').html(traceCount);
    	
    	_el.find('.totalMoney em').html(totalMoney);
    	_el.find('.totalCount').html(totalCount);
    },
    addOrderApi: function() {
        var me = this;
        Common.showLoading();
        me.orderObj.sourceType = 1;
        Api.addOrder(me.orderObj, function(res) {
        	var tip = {
				type:'tip'
            };
        	Common.closeDialog();
        	if(res.code == '1'){
        		if (me.lt === 'WBGMMC' && me.flipball !== undefined) {
        			
        			var prize = parseFloat(parseFloat(res.result.bonus, 10).toFixed(4));
        			var code = res.result.code.split(',');
        			
        			tip.content = '很遗憾，没有中奖';
        			me.flipball.flip(code, true, function() {
        				if (prize > 0) {
        					tip.content = '恭喜你中奖了，奖金：￥' + prize;
        	            }
        				Common.showDialog(tip);
        			});
        		} else{
        			tip.content = '订单提交成功';
    	    		Common.showDialog(tip);
        		}
        	} else {
        		tip.content = res.msg;
	    		Common.showDialog(tip);
        	}
        });
    },
    addOrderMMCLoopApi : function(){
      	var me = this;
        
        if(me.isContinue){
        	me.orderObj.sourceType = 1;
            
          	var obj = me.orderObj;
          	//obj.trace.winStop;
          	var winTop = JSON.parse(obj.trace).winStop;
          	var traceCount = JSON.parse(obj.trace).totalCount;
          	
          	var mmcBtn = $('.btn-mmc-loop');
          
          	if(mmcBtn.attr('data-type') == 2){
        		return;
        	}
          	
        	$("#mmcLoopNow").html(parseInt($("#mmcLoopNow").html(), 10) + 1);
            $(".dialog_mmc_trace .status").html('开奖中');
            
            me.mmcLoading = true;
            Api.addOrder(obj, function(d) {
            	if (d.code && d.code == '1') {
    	            var isStopMMC = parseInt($(".btn-mmc-loop").attr('data-type'), 10);

    	            // 秒秒彩动画开始
    	            var prize = parseFloat(parseFloat(d.result.bonus, 10).toFixed(4));
    	            var code = d.result.code.split(',');
    	            
//    	            var prize = 0;
//    	            var code = [1,2,3,4,5];
    	            
    	            me.flipball.flip(code, true, function() {
    	            	$(".dialog_mmc_trace .status").html('已结束');
    	            	// 连投次数等于总次数 不继续
    	            	if(parseInt($("#mmcLoopNow").html(), 10) === traceCount) {
    	            		$(".btn-mmc-loop").html('确定').attr('data-type', 3);
    	            		$("#mmcLoopNow").parent('span').hide();
    	            		$("#mmcLoopPrize").parent('span').hide();
    	            		me.isContinue = false;
    	            	}

    	            	// 用户停止 不继续
    	            	if(isStopMMC !== 1) {
    	            		me.isContinue = false;
    	            	}
    	            	// 中奖即停
    	            	if (prize > 0 && winTop) {
    	            		$(".btn-mmc-loop").html('确定').attr('data-type', 3);
    	            		$("#mmcLoopDone").html(parseInt($("#mmcLoopDone").html(), 10) + 1);
    	            		$("#mmcLoopPrize").html($("#mmcLoopNow").html());
    	            		$("#mmcLoopMoney").html(prize);
                       
    	            		var prizeAmount = parseFloat((parseFloat($("#mmcLoopAmount").html(), 10) + prize).toFixed(4));
    	            		$("#mmcLoopAmount").html(prizeAmount);
    	            		me.isContinue = false;
    	            	} else if(prize > 0) {
    	            		// 投中更新已中奖次数
    	            		$("#mmcLoopDone").html(parseInt($("#mmcLoopDone").html(), 10) + 1);
    	            		$("#mmcLoopPrize").html($("#mmcLoopNow").html());
    	            		$("#mmcLoopMoney").html(prize);
                      
    	            		var prizeAmount = parseFloat((parseFloat($("#mmcLoopAmount").html(), 10) + prize).toFixed(4));
    	            		$("#mmcLoopAmount").html(prizeAmount);
    	            	}

    	            	if(me.isContinue) {
    	            		setTimeout(function(){
    		            		me.addOrderMMCLoopApi();
    	            		},2000);
    	            	}
                  });
                } else {
                	$('#dialog .dialog').hide();
                	var tip = {
                		type:'tip',
                		content:d.msg
                	}
    	    		Common.showDialog(tip);
                }
            	
            	me.mmcLoading = false;
            });
        }
    },
    initHistory　: function(){
    	var me = this;
    	
    	$('#historyPage .history-list').on('touchend',function(evt){
    		evt.preventDefault();
    		var _this = $(evt.target);
    		
    		if(_this.hasClass('more')){
    			var lt = _this.closest('li').attr('data-lt');
    			var ltName = Q.getLtName(lt);
    			var obj = {
    				lottery:lt
    			};
    			$('#morehistory header .title').html(ltName);
    			Common.pageIn('#morehistory');
    			me.getHistoryByLt(obj);
    		}
    	});
    	
    },
    
    getAllHistory : function(){
    	Common.showLoading();
    	Api.getAllHistory(function(res){
    		var list = res.result;
    		var h = '';
    		if(list.length > 0){
    			$(list).each(function(){
    				if(arguments[1].code){
    					h += '<li data-lt="' + arguments[1].lottery + '"><div class="content"><div class="title"><span class="lt-name">' + Q.getLtName(arguments[1].lottery) 
    						+ '</span><span class="issue">第<em>' + arguments[1].issueNo + '</em>期</span></div><div class="code">';
    					var code = arguments[1].code.split(',');
        				$(code).each(function(){
        					h += '<i>' + arguments[1] + '</i>';
        				});
        				h += '</div></div><div class="more"></div></li>';
    				}
    			});
    			
    			$('#historyPage .history-list').html(h);
    			Common.initWrapper();
    			Common.closeDialog();
    		}
    	});
    },
    
    getHistoryByLt : function(obj){
    	Api.getHistoryByLt(obj,function(res){
    		var list = res.result;
    		var h = '';
    		if(list.length > 0){
    			$(list).each(function(){
    				if(arguments[1].code){
	    				h += '<li><div class="content"><div class="title"><span class="issue">第<em>' 
	    					+ arguments[1].issueNo + '</em>期</span></div><div class="code">';
	    				
	    				var code = arguments[1].code.split(',');
	    				$(code).each(function(){
	    					h += '<i>' + arguments[1] + '</i>';
	    				});
	    				h += '</div></div></li>';
	    			}
    			});
    			
    			$('#morehistory .history-list').html(h);
    			Common.initWrapper();
    		}
    	});
    },
    
    initSearch　: function(){
    	var me = this;
    	
    	$('#index .searchMenu').on('touchend',function(evt){
    		evt.preventDefault();
    		var _this = evt.target;
    		
    		if(_this.nodeName == 'I'){
    			var e = $(_this).parent();
    			if(e.hasClass('on')){
    				$(_this).next().toggle();
    			}else{
        			if(e.hasClass('orderRecord')){
            			me.getOrderList();
            		} else if(e.hasClass('traceRecord')){
            			me.getTraceList();
            		}
        			
        			e.addClass('on').siblings().removeClass('on');
            		$('#searchPage .list ul').eq(e.index()).show().siblings().hide();
            		$(this).find('.record-menu').hide().find('.on').removeClass('on');
    			}
    		} else if(_this.nodeName == 'SPAN') {
    			var e = $(_this).parent().parent();
    			$(_this).addClass('on').siblings().removeClass('on');
    			var obj = {
		    		currPage:1,
		    		pageSize:10,
		    		status:$(_this).attr('data-value')
		    	};	
    			if(e.hasClass('orderRecord')){
        			me.getOrderList(obj);
    			}else if(e.hasClass('traceRecord')){
    				me.getTraceList(obj);
    			}
    			$(_this).parent().hide();
    		} else if($(_this).hasClass('orderRecord')){
    			$(_this).addClass('on').siblings().removeClass('on');
    			me.getOrderList();
        		$('#searchPage .list ul').eq($(_this).index()).show().siblings().hide();
        		$(_this).find('.record-menu').hide().find('.on').removeClass('on');
    		} else if($(_this).hasClass('traceRecord')){
    			$(_this).addClass('on').siblings().removeClass('on');
    			me.getTraceList();
    			$('#searchPage .list ul').eq($(_this).index()).show().siblings().hide();
    			$(_this).find('.record-menu').hide().find('.on').removeClass('on');
    		} 
    	});
    	
    	$('#searchPage').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		var _this = $(evt.target);
    		
    		if(_this.hasClass('more')){
    			var id = $(_this).closest('li').attr('id');
    			var ul = $(_this).closest('ul');
    			if(ul.hasClass('order-list')){//投注查询
    				var obj = {
    					orderId	: id
    				}
        			Common.pageIn('#orderDetail');
    				$('#orderDetail').attr('data-type','order');
        			me.getOrderDetail(obj);
    			}else if(ul.hasClass('trace-list')){
    				var obj = {
    					traceId	: id
    				}
        			Common.pageIn('#traceDetail');
    				$('#orderDetail').attr('data-type','trace');
        			me.getTraceDetail(obj);
    			}
    		}
    	});
    	
    	//查看追号信息
    	$('.getTraceIssue').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		var obj = {
    			traceId	: $(this).attr("data-traceid")
    		} 
    		Common.pageIn('#traceIssue');
    		
//    		$('#traceIssue').one('webkitTransitionEnd transitionend',function(){
//				$(this).off('webkitTransitionEnd transitionend');
//				//$('#orderDetail').hide().addClass('edit').css('transform','translate3d(100%,0,0)');
//				$('#orderDetail').addClass('edit');
//			});
			me.getTraceIssue(obj);
    	});
    	
//    	$('#traceDetail .getTraceIssue').on('touchend',function(evt){
//    		evt.preventDefault();
//    		
//    		var obj = {
//    			traceId	: $(this).attr("data-traceid")
//    		} 
//    		Common.pageIn('#traceIssue');
//    		
////    		$('#traceIssue').one('webkitTransitionEnd transitionend',function(){
////				$(this).off('webkitTransitionEnd transitionend');
////				$('#orderDetail').addClass('editTrace');
////			});
//    		
//			me.getTraceIssue(obj);
//    	});
    	
    	$('#orderDetail').find('.pageback').off('touchend').on("touchend",function(evt){
    		evt.preventDefault();
//    		$('#orderDetail').one('webkitTransitionEnd transitionend',function(){
//				$(this).off('webkitTransitionEnd transitionend');
//				if($(this).hasClass('edit')){
//					$(this).removeClass('edit');
////					$(this).removeClass('edit').css('transform','translate3d(0,0,0)').show();
////					$(this).find('button.getTraceIssue').show();
//				} else if($(this).hasClass('editTrace')){
//					$(this).removeClass('editTrace');
//				}
//			});
//    		
    		Common.pageOut();
			
    		var type = $('#orderDetail').attr('data-type');
    		var el = $('#searchPage');
    		var fn = type == "order" ? me.getOrderList : me.getTraceList;
    		//重新绑定下拉刷新等事件
			me.initScroll(Common.scroll[0],el,fn);
    	});
    	
    	//撤单
    	$('#orderDetail .cancelOrder').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		var tip = {
    			type : 'dialog',
    		    title : '撤单',
    			content : '确定要撤销订单吗？',
    			btns :[{
					cls:'no',
					text:'确定',
				    fn:function(){
				    	Common.closeDialog();
				    	var obj = {
			    			orderId : $('#orderDetail').attr('data-orderId')	
			    		};
			    		
			    		Api.cancelOrder(obj,function(res){
			    			var tip = {};
			    			if(res.code == '0'){
			    				tip.content = '撤单成功';
			    			}else {
			    				tip.content = res.msg;
							}
							Common.showDialog(tip);
			    		});
	    			}
				},{
					cls:'yes',
					text:'取消',
					fn:function(){
	    				Common.closeDialog();
	    			}
				}]
    		}
    		Common.showDialog(tip);
    	});
    },
    
    getOrderList : function(){
    	var me = this;
    	
    	Common.showLoading();
    	var obj = {
    		currPage:1,
    		pageSize:10
    	};

    	var append = false;
    	if(arguments[0]){
    		obj = arguments[0];
    	}
    	if(arguments[1]){
    		append = arguments[1];
    	}
    	
    	var el = $('#searchPage');
    	var pullDownEl =  el.find('.pullDown');
    	var pullUpEl =  el.find('.pullUp');
    	
    	el.one('webkitTransitionEnd transitionend',function(){
			$(this).off('webkitTransitionEnd transitionend');
			if($(this).hasClass('load')){
				pullDownEl.removeClass('loading flip');
	    		pullDownEl.find('.icon').html('下拉刷新');
	    		$(this).removeClass('load');
			}
		});
		
    	var ul = el.find('.order-list');
    	
    	ul.attr('data-currPage',obj.currPage);
    	
    	Api.getOrderList(obj,function(res){
    		me.loadingStatus = 0;
    		el.css('top','-2rem');
    		pullUpEl.removeClass('loading flip').hide().find('.icon').html('上拉加载更多');
    		
    		var list = res.result.his_orders;
    		
    		var h = '';
    		if(list.length > 0){
    			$(list).each(function(){
					var d = arguments[1];
					var lt = d.lottery;
					if (lt=='3DFC') {
						lt='l'+lt;
					}
					var l = 
					h += '<li id="' + d.orderItemId + '"><div class="title">' + d.orderTime + '</div><div class="content">\
							<div class="' + lt + ' ltIcon"></div><div class="ltInfo"><p>' + Q.getMethodName(d.method,d.lottery) + 
							'</p><p>' + d.amount + '元</p></div><div class="status"><p>' + d.state + '</p><p>' + d.awardMoney +
							'元</p></div><div class="more"></div></div><div class="btm">';
					if(d.lottery != 'WBGMMC'){
						h += '<span>期号' + d.issue + '</span>';
					}
					
					if(d.winningNumber){
						h += '<span>开奖号码 ' + d.winningNumber + '</span>'
					}
							
					h += '</div></li>';
    			});
    			
    			if(append){
        			ul.append(h);
        			Common.scroll[0].refresh();
        			Common.closeDialog();
        			me.loading = false;
        			return;
    			}else{
    				ul.html(h);
    			}
    		}else{
    			if(append){
    				Common.closeDialog();
    				var tip = {
    					content : "暂无更多数据"
    				}
    				ul.attr('data-currPage',obj.currPage -1 );
    				Common.showDialog(tip);
    				me.loading = false;
    				return;
    			}else{
    				ul.html('<li class="no-data">暂无数据</li>');
    			}
    		}

    		if(!append){
    			Common.initWrapper();
    			
    			me.scrollParam = obj;
    			
    			me.initScroll(Common.scroll[0],el,me.getOrderList);
    		}
			
		
			Common.closeDialog();

    		me.loading = false;
    	});
    },
    
    initScroll : function(scroll,el,fn){
		var me = this;

		var param = me.scrollParam;
		
		var pullDownEl = el.find('.pullDown');
    	var pullUpEl = el.find('.pullUp');
    	
    	scroll.on('scroll',function(){
			if(me.loadingStatus == 0 && !pullDownEl.hasClass('flip') && !pullUpEl.hasClass('flip')){
				if(this.y > 32){ //下拉
					pullDownEl.addClass('flip');
					el.css('top','0');
					me.loadingStatus = 1;
				} else if(this.y < (this.maxScrollY - 5)){
					pullUpEl.show().addClass('flip');
					me.loadingStatus = 1;
				}
			}
		});
		
    	scroll.on('scrollEnd',function(){
			if(me.loadingStatus == 1 && !me.loading){
				me.loading = true;
				if(pullDownEl.hasClass('flip')){
					me.loadingStatus == 2;
					pullDownEl.addClass('loading').find('.icon').html('');
					param.currPage = 1;
					setTimeout(function(){
						el.addClass('load');
						fn.call(me,param);
					},1000);
				} else if(pullUpEl.hasClass('flip')){
					pullUpEl.addClass('loading').find('.icon').html('');
					param.currPage = param.currPage + 1;
			    	
					if(param.currPage > 10){
						var tip = {
							content : '更多数据请到PC端查询'
						}
						Common.showDialog(tip);
						me.loadingStatus = 0;
						setTimeout(function(){
							pullUpEl.removeClass('loading flip').hide().find('.icon').html('上拉加载更多');
						},1000);
						return;
					}
					
					me.loadingStatus == 2;
					setTimeout(function(){
						fn.call(me,param,true);
					},1000);
				}
			}
		});
    },
    
    getOrderDetail : function(obj){
    	Api.getOrderDetail(obj,function(res){
    		if(res.code == '1'){
    			var d = res.result;
    			var el = $('#orderDetail');
    			el.attr('data-orderId',d.orderId);
    			el.find('.orderId').html(d.orderId);
    			el.find('.username').html(d.username);
    			el.find('.orderTime').html(d.orderTime);
    			el.find('.count').html(d.count);
    			el.find('.lottery').html(Q.getLtName(d.lottery));
    			el.find('.method').html(Q.getMethodName(d.method,d.lottery));
    			el.find('.issue').html(d.issue);
    			el.find('.code').html(d.code);
    			el.find('.odds').html(d.odds);
    			el.find('.amount').html(d.amount);
    			el.find('.awardMoney').html(d.awardMoney);
    			0
    			var mode;
    			switch(d.perAmount){
    				case 2 : mode = '元';break;
    				case 0.2 : mode = '角';break;
    				case 0.02 : mode = '分';break;
    				case 0.002 : mode = '厘';break;
    			}
    			el.find('.perAmount').html(mode);
    			if(d.lotteryNumber){
    				el.find('.lotteryNumber').html(d.lotteryNumber);
    			}else{
    				el.find('.lotteryNumber').parent().hide();
    			}
    			el.find('.status').html(d.status);
    			el.find('.istrace').html(d.istrace == 1 ? "是" : "否");
    			
    			if(d.istrace == '1' && !el.hasClass('edit')){
    				el.find('.getTraceIssue').attr('data-traceid',d.traceId).show();
    			}else{
    				el.find('.getTraceIssue').hide();
    			}
    			if (d.status == '未开奖') {
    				el.find('.cancelOrder').show();
				}else {
					el.find('.cancelOrder').hide();
				}
    			
    		}
    	});
    },
    
    getTraceList : function(){

    	var me = this;
    	
    	Common.showLoading();
    	var obj = {
    		currPage:1,
    		pageSize:10
    	};

    	var append = false;
    	if(arguments[0]){
    		obj = arguments[0];
    	}
    	if(arguments[1]){
    		append = arguments[1];
    	}
    	
    	var el = $('#searchPage');
    	var pullDownEl = el.find('.pullDown');
    	var pullUpEl = el.find('.pullUp');
    	
    	el.one('webkitTransitionEnd transitionend',function(){
			$(this).off('webkitTransitionEnd transitionend');
			if($(this).hasClass('load')){
				pullDownEl.removeClass('loading flip');
	    		pullDownEl.find('.icon').html('下拉刷新');
	    		$(this).removeClass('load');
			}
		});
		
    	var ul = el.find('.trace-list');
    	
    	ul.attr('data-currPage',obj.currPage);
    	
    	Api.getTraceList(obj,function(res){
    		me.loadingStatus = 0;
    		el.css('top','-2rem');
    		pullUpEl.removeClass('loading flip').hide().find('.icon').html('上拉加载更多');
    		
    		var list = res.result.list;
    		var h = '';
    		if(list.length > 0){
    			$(list).each(function(){
					var d = arguments[1];
					var lt = d.lottery;
					if (lt=='3DFC') {
						lt='l'+lt;
					}
					h += '<li id="' + d.traceId + '"><div class="title">' + d.createTime + '</div><div class="content">\
						<div class="' + lt + ' ltIcon"></div>\
						<div class="ltInfo"><p>' + Q.getMethodName(d.method,d.lottery) + '</p><p>起始期号：' + d.start + '</p></div>\
						<div class="status"><p>' + d.status + '</p><p>追'+d.issueCount+'期，已完成'+d.finishCount+'期</p></div><div class="more"></div></div><div class="btm">\
						<span>追号编号' + d.traceId + '</span><span>追号总金额' + d.totalMoney + '元</span>';
					
					if(d.winStop){
						h += '<label class="winstop">追中即停</label></span>'
					}
						
					h += '</div></li>';
    			});
    			
    			if(append){
        			ul.append(h);
        			Common.scroll[0].refresh();
        			Common.closeDialog();
        			me.loading = false;
        			return;
    			}else{
    				ul.html(h);
    			}
    			
    		}else{
    			if(append){
    				Common.closeDialog();
    				var tip = {
    					content : "暂无更多数据"
    				}
    				ul.attr('data-currPage',obj.currPage -1 );
    				Common.showDialog(tip);
    				me.loading = false;
    				return;
    			}else{
    				ul.html('<li class="no-data">暂无数据</li>');
    			}
    		}

			Common.initWrapper();
			
			if(!append){
    			Common.initWrapper();
    			
    			me.scrollParam = obj;
    			
    			me.initScroll(Common.scroll[0],el,me.getTraceList);
    		}
			
			Common.closeDialog();
			
			me.loading = false;
    	});
    },
    
    getTraceDetail : function(obj){
    	Api.getTraceDetail(obj,function(res){
    		if(res.code == '1'){
    			var d = res.result;
    			var el = $('#traceDetail .orderdetail');
    			el.find('.traceId').html(d.traceId);
    			el.find('.username').html(d.userName);
    			el.find('.createTime').html(d.createTime);
    			el.find('.code').html(d.code);
    			el.find('.method').html(Q.getMethodName(d.method,d.lottery));
    			el.find('.start').html(d.start);
    			el.find('.odds').html(d.odds);
    			
    			var mode;
    			switch(d.perAmount){
    				case 2 : mode = '元';break;
    				case 0.2 : mode = '角';break;
    				case 0.02 : mode = '分';break;
    				case 0.002 : mode = '厘';break;
    			}
    			el.find('.issueCount').html(d.issueCount);
    			el.find('.perAmount').html(mode);
    			el.find('.totalMoney').html(d.totalMoney);
    			el.find('.finishMoney').html(d.finishMoney);
    			el.find('.cancelCount').html(d.cancelCount);
    			el.find('.cancelMoney').html(d.cancelMoney);
    			el.find('.status').html(d.status);
    			
    			el.find('.winstop').html(d.winStop == '1' ? '是' : '否');
    			
    			el.find('.getTraceIssue').attr('data-traceId',d.traceId);
    		}
    	});
    },
    
    initTraceIssue : function(){
    	var me = this;
    	var el= $('#traceIssue');
    	var ul = el.find('ul');
    	
    	el.find('.t .select').on('touchend',function(){
    		var e = $(this).parent();
    		if(e.hasClass('on')){
    			e.removeClass('on');
    			ul.find('li').removeClass('on');
    		}else{
    			e.addClass('on');
    			ul.find('li').not('.disable').addClass('on');
    		}
    	});
    	
    	ul.on('touchend',function(evt){
    		evt.preventDefault();
    		var _this = evt.target;
    		
    		if(_this.nodeName == 'I'){
    			_this = $(_this).parent();
    		}
    		if($(_this).hasClass('select')){
    			$(_this).parent().toggleClass('on');
    		}else if($(_this).hasClass('more')){
    			var id = $(_this).parent().attr('id');
    			var obj = {
    				orderId	: id
    			}
    			
    			Common.pageIn('#orderDetail');
    			me.getOrderDetail(obj);
    		}
    	});
    	
    	//中止追号
    	el.find('.stopTraceIssue').on('touchend',function(){
    		var tip = {
    			type : 'dialog',
    		    title : '中止追号',
    			content : '确定要中止追号吗？',
    			btns :[{
					cls:'no',
					text:'确定',
				    fn:function(){
				    	Common.closeDialog();
				    	var traceId = ul.attr('data-traceId');
			    		var issues = [];
			    		$(ul.find('li.on')).each(function(){
			    			issues.push($(arguments[1]).find('.issue').text())
			    		});
			    		
			    		var obj = {
			    			traceId:traceId,
			    			issues:issues
			    		}
			    		if (issues.length>0) {
			        		Api.stopTrace(obj,function(res){
			        			if(res.code == '1'&&res.result.length>0){
			        				var tip = {
			        					content:'中止追号成功'	
			        				}
			        				Common.showDialog(tip);
			        				$(res.result).each(function(i,v){
			        					$('#'+v.orderId).find('.status').text('已取消');
			        				});
			        			}
			        		});
			    		}
	    			}
				},{
					cls:'yes',
					text:'取消',
					fn:function(){
	    				Common.closeDialog();
	    			}
				}]
    		}
    		Common.showDialog(tip);
    	});
    },
    
    getTraceIssue : function(obj){
    	Api.getTraceIssue(obj,function(res){
    		if(res.code == '1'){
    			res = res.result;
    			var h = '';
    			$(res).each(function(){
    				var s = '进行中';
    				if (arguments[1].status=='1') {
    					if (arguments[1].lotteryStatus=='1') {
    						s = '未中奖';
						}else if(arguments[1].lotteryStatus=='2'){
							s = '已中奖';
						}else {
							s = '未开奖';
						}
					}else if (arguments[1].status=='2' || arguments[1].status=='3') {
						s = '已取消';
					}
    				var issue = arguments[1].issue;
    				h += '<li id="' + arguments[1].orderId + '"><div class="select"><i></i></div><div class="issue">' 
    					+ issue + '</div>'
    					//+'<div class="times">' + arguments[1].count + '</div>
    					+ '<div class="status">'+ s +'</div>';
    				if (arguments[1].status=='1' && arguments[1].bonus!=undefined) {
    					h+='<div class="bonus">'+arguments[1].bonus+'元</div></li>';
    				}else {
    					h+='<div class="bonus"></div></li>';
					}
    			});
    			var ul = $('#traceIssue ul');
    			ul.attr('data-traceId',obj.traceId).html(h);
    		}
    	});
    },
    
    initMyAccount : function(){
    	var me = this;
    	$('#index .feature').on('touchend',function(evt){
    		evt.preventDefault();
    		
    		var _this = $(evt.target);
    		if(_this.nodeName != 'LI'){
    			_this = _this.closest('li');
    		}
    		
    		if(_this.hasClass('recharge')){
    			me.getRechargeList();
    			Common.pageIn('#rechargeList');
    		}
    	});
    	
    	$('#index .recharge-btn').on('touchend',function(evt){
    		me.rechargeIndex();
    		Common.pageIn('#rechargeMoney');
    	});
    	
    	$('#index .withdraw-btn').on('touchend',function(evt){
    		me.getWithDrawInfo();
    	});
    	
    	$('#rechargeMoney .icon').on('touchend',function(evt){
    		$(this).addClass('on').siblings().removeClass('on');
    	});
    	
    	$('#rechargeMoney .button').on('touchend',function(evt){
    		me.recharge();
    	});
    	
    	$('#withDrawMoney .button').on('touchend',function(evt){
    		me.withDrawSubmit();
    	});
    	
    	$('#accountPage .logout').on('touchend',function() {
			var tip = {
				type : 'dialog',
				title : '退出登录',
				content : '确定要退出登录吗？',
				btns :[{
					cls:'no',
					text:'取消',
				    fn:function(){
	    				Common.closeDialog();
					}
				},{
					cls:'yes',
					text:'确定',
					fn:function(){
						User.ssoUserLogout(function(res){
							if(res.code == 0){
								Common.closeDialog();
								User.name = null;
								Common.pageIn('#login');
							}
						});
					}
				}]
			}
			Common.showDialog(tip);
		});
    },
    
    initRecharge : function(){
    	var me = this;
    	
    	$('#rechargeList .rechargeMenu').on('touchend',function(evt){
    		evt.preventDefault();
    		var _this = evt.target;
    		
    		if(_this.nodeName == 'I'){
    			var e = $(_this).parent();
    			if(e.hasClass('on')){
    				$(_this).next().toggle();
    			}else{
        			if(e.hasClass('rechargeRecord')){
            			me.getRechargeList();
            		} else if(e.hasClass('withdrawRecord')){
            			me.getDrawList();
            		}
        			
        			e.addClass('on').siblings().removeClass('on');
            		$('#rechargeList .list ul').eq(e.index()).show().siblings().hide();
            		$(this).find('.record-menu').hide().find('.on').removeClass('on');
    			}
    		} else if(_this.nodeName == 'SPAN') {
    			var e = $(_this).parent().parent();
    			$(_this).addClass('on').siblings().removeClass('on');
    			var obj = {
		    		currPage:0,
		    		pageSize:10,
		    		queryType:$(_this).attr('data-value')
		    	};
    			if(e.hasClass('rechargeRecord')){
        			me.getRechargeList(obj);
    			}else if(e.hasClass('withdrawRecord')){
    				me.getDrawList(obj);
    			}
    			$(_this).parent().hide();
    		} else if($(_this).hasClass('rechargeRecord')){
    			$(_this).addClass('on').siblings().removeClass('on');
    			me.getRechargeList();
        		$('#rechargeList .list ul').eq($(_this).index()).show().siblings().hide();
        		$(_this).find('.record-menu').hide().find('.on').removeClass('on');
    		} else if($(_this).hasClass('withdrawRecord')){
    			$(_this).addClass('on').siblings().removeClass('on');
    			me.getDrawList();
    			$('#rechargeList .list ul').eq($(_this).index()).show().siblings().hide();
    			$(_this).find('.record-menu').hide().find('.on').removeClass('on');
    		} 
    	});
    	
    },
    recharge : function(){
    	var me = this;
    	//Common.showLoading();
    	var amount = $('#rechargeMoney .rechargeInput').val();
    	var min = $('#rechargeMoneyForm').find('.tip .min').html();
		var max = $('#rechargeMoneyForm').find('.tip .max').html();
		//$('#rechargeMoneyForm').find('.tip .todaymax').html(res.rechargeMoneyMaxDay);
    	//alert(amount);
    	if((amount.substring(0,1) == 0 && amount.substring(0,2) != '0.') || amount < min || amount > max || amount == null || amount == "" || isNaN(amount)){
    		Common.showDialog({
     			  content:'输入的金额不合法'
  			});
    		return;
    	}
    	$('#rechargeMoneyForm').submit();
    },
    rechargeIndex : function(){
    	var me = this;
    	Common.showLoading();
    	var obj = {
    		currPage:10,
    		pageSize:10
    	};

    	var append = false;
    	if(arguments[0]){
    		obj = arguments[0];
    	}
    	if(arguments[1]){
    		append = arguments[1];
    	}
    	
    	Api.rechargeIndex(obj,function(res){
    		me.loadingStatus = 0;
    		res = res.result;
			$('#rechargeMoneyForm').find('.tip .min').html(res.rechargeMoneyMin);
			$('#rechargeMoneyForm').find('.tip .max').html(res.rechargeMoneyMax);
			$('#rechargeMoneyForm').find('.tip .todaymax').html(res.rechargeMoneyMaxDay);
			Common.closeDialog();
			me.loading = false;
    	});
    },
    getRechargeList : function(){
    	var me = this;
    	Common.showLoading();
    	var obj = {
    		currPage:1,
    		pageSize:10
    	};

    	var append = false;
    	if(arguments[0]){
    		obj = arguments[0];
    	}
    	if(arguments[1]){
    		append = arguments[1];
    	}
    	
    	var el = $('#rechargeList .scroller');
    	var pullDownEl =  el.find('.pullDown');
    	var pullUpEl =  el.find('.pullUp');
    	
    	el.one('webkitTransitionEnd transitionend',function(){
			$(this).off('webkitTransitionEnd transitionend');
			if($(this).hasClass('load')){
				pullDownEl.removeClass('loading flip');
	    		pullDownEl.find('.icon').html('下拉刷新');
	    		$(this).removeClass('load');
			}
		});
		
    	var ul = el.find('.recharge-list');
    	
    	ul.attr('data-currPage',obj.currPage);
    	
    	Api.getRechargeList(obj,function(res){
    		me.loadingStatus = 0;
    		el.css('top','-2rem');
    		pullUpEl.removeClass('loading flip').hide().find('.icon').html('上拉加载更多');
    		var list = res.data;
    		var h = '';
    		if(list && list.length > 0){
    			$(list).each(function(){
					var d = arguments[1];
					//订单状态  0:审核成功   1：认领（初始状态）   4：充值被认领   5：充值一审通过   2,充值失败  6：审核失败（一审没通过）,7：审核失败（二审未通过）					
					h += '<li><div class="title">' + d.orderDate + '</div>'
					+ '<div class="content ';
				var cls;
				var status;
				switch(d.status){
					case 0 : status = '充值成功';cls = 'success';break;
					case 2 : status = '充值失败';cls = 'fail';break;
					case 6 : status = '充值失败';cls = 'fail';break;
					case 7 : status = '充值失败';cls = 'fail';break;
					default: status = '处理中';cls = '';break;
				}
				
				h+= cls + '"><div class="info"><p class="t">订单编号</p><p class="num">'
					+ d.spsn + '</p></div><div class="status"><p>'+ status + '</p><p>' + d.cash + '元</p></div></div></li>';
					
    			});
    			
    			if(append){
        			ul.append(h);
        			Common.scroll[0].refresh();
        			Common.closeDialog();
        			me.loading = false;
        			return;
    			}else{
    				ul.html(h);
    			}
    		}else{
    			if(append){
    				Common.closeDialog();
    				var tip = {
    					content : "暂无更多数据"
    				}
    				ul.attr('data-currPage',obj.currPage -1 );
    				Common.showDialog(tip);
    				me.loading = false;
    				return;
    			}else{
    				ul.html('<li class="no-data">暂无数据</li>');
    			}
    		}

			if(!append){
    			Common.initWrapper();
    			
    			me.scrollParam = obj;
    			
    			me.initScroll(Common.scroll[0],el,me.getRechargeList);
    		}
			
			Common.closeDialog();
			
			me.loading = false;
    	});
    },
    
    getDrawList : function(){
    	var me = this;
    	Common.showLoading();
    	var obj = {
    		currPage:1,
    		pageSize:10
    	};

    	var append = false;
    	if(arguments[0]){
    		obj = arguments[0];
    	}
    	if(arguments[1]){
    		append = arguments[1];
    	}
    	
    	var el = $('#rechargeList .scroller');
    	var pullDownEl =  el.find('.pullDown');
    	var pullUpEl =  el.find('.pullUp');
    	
    	el.one('webkitTransitionEnd transitionend',function(){
			$(this).off('webkitTransitionEnd transitionend');
			if($(this).hasClass('load')){
				pullDownEl.removeClass('loading flip');
	    		pullDownEl.find('.icon').html('下拉刷新');
	    		$(this).removeClass('load');
			}
		});
		
    	var ul = el.find('.withdraw-list');
    	
    	ul.attr('data-currPage',obj.currPage);
    	
    	Api.getDrawList(obj,function(res){
    		me.loadingStatus = 0;
    		el.css('top','-2rem');
    		pullUpEl.removeClass('loading flip').hide().find('.icon').html('上拉加载更多');
    		
    		var list = res.data;
    		var h = '';
    		if(list && list.length > 0){
    			$(list).each(function(){
					var d = arguments[1];
					h += '<li><div class="title">' + d.createTime + '</div>'
						+ '<div class="content ';
					var cls;
					var status;
					switch(d.status){
						case 0 : status = '充值成功';cls = 'success';break;
						case 2 : status = '充值失败';cls = 'fail';break;
						case 6 : status = '充值失败';cls = 'fail';break;
						case 7 : status = '充值失败';cls = 'fail';break;
						default: status = '处理中';cls = '';break;
					}
					
					h+= cls + '"><div class="info"><p class="t">订单编号</p><p class="num">'
						+ d.spsn + '</p></div><div class="status"><p>'+ status + '</p><p>' + d.cash + '元</p></div></div></li>';
    			});
    			
    			if(append){
        			ul.append(h);
        			Common.scroll[0].refresh();
        			Common.closeDialog();
        			me.loading = false;
        			return;
    			}else{
    				ul.html(h);
    			}
    			
    		}else{
    			if(append){
    				Common.closeDialog();
    				var tip = {
    					content : "暂无更多数据"
    				}
    				ul.attr('data-currPage',obj.currPage -1 );
    				Common.showDialog(tip);
    				me.loading = false;
    				return;
    			}else{
    				ul.html('<li class="no-data">暂无数据</li>');
    			}
    		}

			if(!append){
    			Common.initWrapper();
    			
    			me.scrollParam = obj;
    			
    			me.initScroll(Common.scroll[0],el,me.getDrawList);
    		}
			
			Common.closeDialog();
			
			me.loading = false;
    	});
    },
    
    getWithDrawInfo : function(){
    	Api.getWithDrawInfo(function(res){
    		if(res.code == '1'){
    			Common.showDialog({
    				content:res.msg,
    				width : 230,
    				height : 62
             	});
    			return;
    		}else{
    			res = res.result;
    			$('#withDrawToken').val(res.token);
    			if(res.bankCardList.length > 0){
    				var el = $('#withDrawMoney .withDrawContent');
    				el.find('.drawname').html(res.sn);

    				var option = '';
    				$(res.bankCardList).each(function(){
    					
    					var d = arguments[1];
    					option += '<option id="' + d.id + '" data-bindtime="' + d.bindTime + '" cardNo="'+d.bankCardNo+'">' 
    						+ d.bankNameZH + '&nbsp;&nbsp;' + d.bankCardNo + '</option>';
    				});
    				
    				el.find('.bankCardSelect').html(option);
    				
    				el.find('.tip .min').html(res.onceWithdrawMin);
    				el.find('.tip .max').html(res.onceWithdrawMax);
    			}
    			Common.pageIn('#withDrawMoney');
    		}
    	});
    },
    
    withDrawSubmit : function(){
    	var me = this;
    	var el = $('#withDrawMoney .withDrawContent');
    	
    	var option = el.find('.bankCardSelect option:checked');
    	var obj = {
    		withdrawMoney:el.find('.withdrawInput').val(),
    		user_bank_id:option.attr('id'),
    		bindTime:option.attr('data-bindTime'),
    		payPassword:md5(el.find('.withdrawPwd').val()),
    		token:$('#withDrawToken').val(),
    		cardNo:option.attr('cardNo')
    	}
    	
    	var tip = {};
    	
    	if(!obj.withdrawMoney){
    		tip.content = '请输入提现金额';
    		Common.showDialog(tip);
    		return;
    	}
    	
    	if(!obj.payPassword){
    		tip.content = '请输入资金密码';
    		Common.showDialog(tip);
    		return;
    	}
    	
    	Api.withDrawSubmit(obj,function(res){
    		//if(res.code == '1'){
    		//	tip.content = '提现成功';
    		//}else{
    			tip.content = res.msg;
    		//}
    		
			Common.showDialog(tip);
			me.refreshBalance();
    	});
    },
    
    refreshBalance: function(){
        $.ajax({
            url : User.ssoapi['balance'],
            type : 'GET',
            dataType : 'json',
            data: 'appId=5',
            cache: false,
            success: function(res){
          	  if(res.code == '0'){
          		  $('.userInfo .balance em').html(res.result.userMoney.avail);
          	  }else{
          		  var tip = {
          			  content:'获取余额失败'
          		  }
          		  Common.showDialog(tip);
          	  }
            }
        });
    }
};
var Common = Common || {};
Common = {
	scroll : [],
	swiper : null,
	currentPage : '#index',
	prePage : [],
	stopScrollBack:false, //滚动是否回弹
	
	loaded : function(){
		var me = this;
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		me.init();
	},
	
	init : function(){
		var me = this;
		me.initEvents();
		
		User.getStatus(function(res){
			if(res.code != 0){
				me.pageIn('#login');
			}else {
				//获取轮播图
				User.name = res.result.name;
				$('.userInfo .username').html(User.name);
				me.getSlides();
				me.getAdminNotice();
				me.getOdds();
			}
 		});
	},
	
	initEvents : function(){
		var me = this;
		
		me.initLogin();
		me.initDialog();
		me.initIndex();
		Lottery.initEvents();
	},
	
	initWrapper : function(){
		var me = this;
		me.stopScrollBack = false;
		
		if(me.scroll.length > 0){
			$(me.scroll).each(function(){
				arguments[1].destroy();
				arguments[1] = null;
			});
		}
		me.scroll = null;
		me.scroll = [];
		
		var wrapper = $(me.currentPage).attr('data-wrapper');
		if(wrapper){
			wrapper = wrapper.split('|');
			$(wrapper).each(function(){	
				var s = me.currentPage + ' ' + arguments[1];
				var config = {
					momentum: true,
					tap:true
				};
				
				if($(s).attr('data-probe')){
					config.probeType = $(s).attr('data-probe');
				}
				
				var scroll = new IScroll(s,config);
				me.scroll.push(scroll);
			});
		}
	},
	
	getOdds : function(){
		var me = this;
		me.showLoading();
		$(document.body).append('<iframe id="login-iframe" style="display: none;"></iframe>');
		$("iframe#login-iframe").attr('src', '/lottery-mobile/u/login?backType=0&t=' + (new Date()).getTime());
		$("iframe#login-iframe").on('load',function() {
			Api.getOddsByLt({lottery:'CQSSC'},function(d) {
				Lottery.odds.CQSSC = d.result.CQSSC;
				me.closeDialog();
			});
			
			Lottery.refreshBalance();
			
		    setTimeout(function() {
		      $("iframe#login-iframe").remove();
		    }, 1000);
		});
	},
	
	initIndex : function(){
		var me = this;
		
		$('#index .lt-list').on('tap',function(e){
			if($(e.target).hasClass('lt-list')){
				return false;
			}
			var t;
			if(e.target.nodeName == "DIV"){
				t = $(e.target);
			}else{
				t = $(e.target).closest('div');
			}
			
			Lottery.lt = t.attr('data-lt');
			Lottery.cls = t.attr('data-lt-cls');
			Lottery.ltName = Q.getLtName(Lottery.lt);
			
			if(Lottery.orderlist[Lottery.lt]){ //如果之前保存过该彩种的数据
				Lottery.renderOrder();
				Lottery.lotteryToSubmit();
			} else {
				me.pageIn('#lottery');
			}

		    Lottery.init();
		});
		
		$('footer.menu').on('touchend',function(e){
			var t;
			if(e.target.nodeName == "DIV"){
				t = $(e.target);
			}else{
				t = $(e.target).closest('div');
			}
			
			var target = t.attr("data-page");
			
			$(target).show().siblings().hide();
			
			//me.prePage = [];
			//me.currentPage = target;
			$('#index').removeClass('showSeachMenu');
			
			switch (target) {
        		case "#historyPage": 
        			Lottery.getAllHistory();
        			break;
        		case "#searchPage":
        			$('#index').addClass('showSeachMenu');
        			Lottery.getOrderList();
        			break;
        		default:
        			break;
			}
			
			me.initWrapper();
		});
		
		$('.pageback').on('touchend',function(evt){
    		evt.preventDefault();
    		Common.pageOut();
    	});
	},
	
	getSlides: function(){
		var me = this;
		me.showLoading();
		Api.getSlides({pageSize:5},function(res){
			if (res.code=='0') {
			    var data = res.result.entities;
			    data = [
			            {frontImagePath:'/m/static/lottery/images/banner/1.jpg'},
			            {frontImagePath:'/m/static/lottery/images/banner/2.jpg'},
			            {frontImagePath:'/m/static/lottery/images/banner/3.jpg'},
			    ]
			    if (data.length>0) {
			    	var h = '';
			    	for (var i = 0; i < data.length; i++) {
			    		h += '<div class="swiper-slide"><img src="' + data[i].frontImagePath +'"></div>';
			    	};
			    	$('#index .banner .swiper-wrapper').html(h);
			    	
			    	new Swiper('#index .banner', {
					    loop: true,
					    autoplay:5000
					});
			    	
			    	//第一张活动图片加载完成后刷新wrapper
			    	$('#index .swiper-wrapper img').eq(0).on('load',function(){
			    		me.initWrapper();
					    me.closeDialog();
			    	});
			    }
			}
		    
		});
	},
	getAdminNotice: function(){
		var me = this;
		me.showLoading();
		Api.getAdminNotice({pageNumber:10,scroll:1},function(res){
//			if (res.totalCount > 0) {
				var list = res.items;
				
				list = [
			            {title:'1111'},
			            {title:'2222'},
			            {title:'333'}
			    ]
				
				var notice = "";
				
				$(list).each(function(){
					notice += '<div class="swiper-slide">' + arguments[1].title +'</div>';
				});
				
				$('#index .notice .swiper-wrapper').html(notice);
		    	
				new Swiper('#index .notice .swiper-container', {
				    loop: true,
				    autoplay:5000,
				    direction:'vertical'
				});
//			}
			
	    	
/*			$(".notice").smartmarquee({
				duration:3000,
				axis:'horizontal'
			});*/
			
/*			setInterval(function(){
				$(".notice").find(".list").animate({
					marginTop:"-14px"
				},500,function(){
					$(".list").css({marginTop:"0px"}).find("li:first").appendTo(this);
				})
			},3000)*/
		});
		
	},
	
	
	
	
	initLogin : function(){
		var me = this;
		//登录表单操作[START]
		var form = $('.login-form');
		
		var username = form.find('input[name="usrname"]');
		var password = form.find('input[name="secret"]');
		var codeinput = form.find('input[name="code"]');
		
		var error = form.find('.login-err');
		var verifycode = form.find('img.verifycode');
		
		
		verifycode.on('touchend',function() {
		    verifycode.attr('src', '/sso/imageCode?date=' + new Date());
		    codeinput.val('');
		}).trigger('click');

		
		form.find('.login-btn').on('touchend',function() {
			
			var tip = {
				type:'tip'	
			};
			
			if(username.val() == ''){
				tip.content = '请输入用户名';
				me.showDialog(tip);
				return false;
			}
			
			if(password.val() == ''){
				tip.content = '请输入密码';
				me.showDialog(tip);
				return false;
			}
			
			if(form.hasClass('show-code')){
				var checkCode = true;
				if (codeinput.val() == '') {
					tip.content = '请输入验证码';
					me.showDialog(tip);
					return false;
			    }
			}
			
		    var loginparams = {
		    	backurl: '?',
		    	context: $('.loginformIndex'),
		    	name: username.val(),
		    	pwd: password.val()
		    };
		    
		    if (form.hasClass('show-code')) {
		    	loginparams["capchaCode"] = codeinput.val();
		    }
		    
		    me.showLoading();
		    User.ssoUserLogin(loginparams, function(res) {
		    	me.closeDialog();
		    	if (res.code == 0) {
		    		User.name = res.user.cn;
	    			$('.userInfo .username').html(User.name);
	    			
	    			$('#indexPage').show().siblings().hide();
	    			
		    		//获取轮播图
					me.getSlides();
					//获取公告
	    			me.getAdminNotice();
	    			//获取赔率
					me.getOdds();
	    			
		    		me.pageOut({
	    				'transform':'translate3d(0,100%,0)'
	    			});
		    	} else {
		    		tip.content = res.msg;
		    		me.showDialog(tip);
		    		
		    		if(res.needCapchaCode){
		    			form.addClass('show-code');
		    			verifycode.attr('src', '/sso/imageCode?date=' + new Date());
		    			codeinput.val('');
		    		}
		    	}
		    });
		});
	},

	pageIn : function(pageId){
		var me = this;
		me.prePage.push(me.currentPage);
		me.currentPage = pageId;
		$(me.currentPage).show().css('transform','translate3d(0,0,0)');
		me.initWrapper();
	},
	
	pageOut : function(){
		var me = this;
		var e = $(me.currentPage);
		me.currentPage = me.prePage[me.prePage.length - 1];
		me.prePage.pop();
		me.initWrapper();
		
		if(arguments[0]){
			e.css(arguments[0]);
		}else{
			e.css('transform','translate3d(100%,0,0)');
		}
		e.one('webkitTransitionEnd transitionend',function(){
			e.off('webkitTransitionEnd transitionend');
			//zepto one事件不只触发一次 ???
			e.hide();
		});
	},

	initDialog : function(){
		var me = this;
		$('#dialog button.cancel').on('touchend',function(){
			me.closeDialog();
		});
	},
	
	showDialog : function(d){
		var me = this;
		
		d.type = d.type || 'tip';
		
		var el = $('#dialog');
		el.show();
		
		var target = null;
		var mask = $('#mask');
		var tip = el.find('.tip');
		var dialog = el.find('.dialog');
		
		if (d.type == 'tip') {
			target = tip;
			
			if(dialog.css('display') == 'block'){
				tip.html(d.content).show();
				setTimeout(function(){
					me.closeTip();
				},1500);
			}else{
				mask.removeClass().addClass('tip-mask');
				tip.html(d.content).show();
				
				setTimeout(function(){
					me.closeDialog();
				},1500);
			}
		}  else if (d.type == 'dialog') {
			target = dialog;
			mask.removeClass().addClass('dialog-mask');
			
			var title = dialog.find('.title');
			var cancel = dialog.find('button.cancel');
			var btns = dialog.find('.btnDiv');
			
			d.title ? title.show().html(d.title) : title.hide();
			d.cancel ? cancel.show() : cancel.hide();
			
			if(d.contentStyle){
				dialog.find('.content').addClass(d.contentStyle);
			}else{
				dialog.find('.content').removeClass().addClass('content');
			}
			
			if(d.btns){
				var h = '';
				$(d.btns).each(function(){
					h += '<button class="' + arguments[1].cls + '">' + arguments[1].text + '</button>';
				});
				btns.html(h);
				
				btns.off('touchend').on('touchend',function(evt){
					evt.preventDefault();
					var _this = evt.target;
					
					var index = $(_this).index();
					d.btns[index].fn();
				});
			}else{
				btns.hide();
			}
			
			dialog.find('.content').html(d.content);
			
			dialog.show();
		}
		
		if(target){
			var h,w;
			
			if(d.width && d.height){
				h = d.height;
				w = d.width;
			} else {
				h = target.height();
				w = target.width();
			}
			
			target.css({
				"margin-top":'-' + h/2 + 'px',
				"margin-left" : '-' + w/2 + 'px',
				"width" : w + 'px',
				"height" : h + 'px'
			});
		}
	},
	
	showLoading : function(d){
		$('#mask').addClass('tip-mask');
		
		$('#loading').show();
		
		if(d && d.content){
			$('#loading').find('p').html(d.content);
		}
	},
	
	closeDialog : function(){
		var el = $('#dialog');
		el.hide();
		$('#mask').removeClass();
		el.find('.loading').hide();
		el.find('.tip').hide();
		el.find('.dialog').hide();
		el.find('.dialog .btnDiv').show();
	},
	
	closeLoading : function(){
		$('#mask').removeClass('tip-mask');
		$('#loading').hide();
	},
	
	closeTip : function(){
		var el = $('#dialog');
		el.find('.tip').hide();
	}
};
