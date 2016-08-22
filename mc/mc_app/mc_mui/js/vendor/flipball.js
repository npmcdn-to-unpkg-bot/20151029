!function(e) {
    function t(t, i) {
        this.opts = e.extend({
            ballsize: 5,
            initball: "0,0,0,0,0",
            loop: 5,
            timeout: 5e3,
            delay: 150,
            offset: [50, 80],
            handbar: ".handle_hand",
            lamp: ".lamp",
            debugs: !0
        }, i),
        this.slides = [],
        this.size = this.opts.ballsize,
        this.$t = e(t),
        this.balls = [],
        this.callback = function() {
            "sss"
        }
        ,
        this.errors = {
            invalidBallFormat: "彩球数据格式错误"
        },
        this.debugs = this.opts.debugs,
        this.init()
    }
    t.prototype = {
        init: function() {
            var t = this
              , i = t.opts;
            t.checkballs(i.initball) != t.size && alert(t.errors.invalidBallFormat),
            t.$handles = e(i.handbar).children(),
            t.createdom(),
            t.preloadLightImg()
        },
        checkballs: function(e) {
            var t = this
              , i = 0;
            if (e && "string" == typeof e && (e = e.split(",")),
            e && "[object Array]" === Object.prototype.toString.call(e) && e.length == t.size) {
                t.balls = e;
                for (var s = 0; s < e.length; s++) {
                    var a = Number(e[s]);
                    if (0 > a || a > 9)
                        break;
                    i++
                }
            }
            return i
        },
        createdom: function() {
            for (var t = this, i = t.opts, s = t.balls, a = 0; a < t.size; a++) {
                var n = "position:absolute;top:0;left:" + a * t.opts.offset[0] + "px;float:none;";
                n += "height:" + 10 * i.offset[1] * (i.loop + 3) + "px",
                t.slides.push(e("<div>", {
                    "class": "flipball flipball_" + (a + 1),
                    style: n,
                    text: s[a]
                }).appendTo(t.$t))
            }
        },
        preloadLightImg: function() {
            var t = this
              , i = e("img", this.opts.lamp)
              , s = i.data("imgholder");
            e("<img/>").on("load", function() {
                t.$lampimg = i,
                t.originsrc = i.attr("src"),
                t.lampsrc = s
            }
            ).attr("src", s)
        },
        marquee: function(e) {
            this.lampsrc && this.$lampimg.length && ("on" == e ? this.$lampimg.attr("src", this.lampsrc) : "off" == e && this.$lampimg.attr("src", this.originsrc))
        },
        drawbar: function(t) {
            this.$handles.eq(0).animate({
                opacity: "hide"
            }, 300, function() {
                e(this).animate({
                    opacity: "show"
                }, 300, function() {
                    t && t()
                }
                )
            }
            )
        },
        play: function() {
            this.marquee("on"),
            this.drawbar()
        },
        stop: function() {
            this.marquee("off")
        },
        flip: function(t, i, s) {
            var a = this
              , n = a.opts
              , t = t || a.balls
              , s = s || a.callback;
            return a.checkballs(t) != a.size ? alert(a.errors.invalidBallFormat) : (a.$t.hasClass(".hasball") || a.$t.addClass("hasball"),
            t = a.balls,
            a.callback = s,
            void (i === !1 || "undefined" === i ? (a.stop(),
            e.each(a.slides, function(e, i) {
                var s = Number(t[e]);
                i.css("marginTop", -(10 + s) * n.offset[1])
            }
            ),
            a.doCallback(a.callback)) : (a.play(),
            e.each(a.slides, function(i, s) {
                var r = Number(t[i])
                  , o = n.timeout + n.delay * i
                  , l = (10 * n.loop + r) * n.offset[1];
                s.animate({
                    marginTop: -l
                }, o, function() {
                    e(this).css("marginTop", -(10 + r) * n.offset[1]),
                    i == a.size - 1 && (a.stop(),
                    a.doCallback(a.callback))
                }
                )
            }
            ))))
        },
        quickflip: function(t) {
            var i = this
              , s = i.opts
              , a = a || i.balls
              , n = n || i.callback;
            return i.callback = null ,
            i.checkballs(a) != i.size ? alert(i.errors.invalidBallFormat) : void e.each(i.slides, function(e, r) {
                var o = Number(a[e]);
                r.css({
                    marginTop: -(10 + o) * s.offset[1]
                }).animate({
                    marginTop: -(10 + o + 10) * s.offset[1]
                }, 1e3, function() {
                    e == i.size - 1 && (i.doCallback(n),
                    t && t())
                }
                )
            }
            )
        },
        doCallback: function(e) {
            e && "[object Function]" === Object.prototype.toString.call(e) && e()
        },
        debug: function() {
            this.debugs && window.console && console.log && console.log("[flipball] " + Array.prototype.join.call(arguments, " "))
        }
    },
    e.fn.flipball = function(e) {
        return new t(this,e)
    }
}($);