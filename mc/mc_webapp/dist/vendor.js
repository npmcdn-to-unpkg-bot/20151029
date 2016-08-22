var Zepto = function() {
    function e(e) {
        return null  == e ? String(e) : F[q.call(e)] || "object"
    }
    function t(t) {
        return "function" == e(t)
    }
    function i(e) {
        return null  != e && e == e.window
    }
    function s(e) {
        return null  != e && e.nodeType == e.DOCUMENT_NODE
    }
    function a(t) {
        return "object" == e(t)
    }
    function n(e) {
        return a(e) && !i(e) && Object.getPrototypeOf(e) == Object.prototype
    }
    function r(e) {
        return "number" == typeof e.length
    }
    function o(e) {
        return M.call(e, function(e) {
            return null  != e
        }
        )
    }
    function l(e) {
        return e.length > 0 ? S.fn.concat.apply([], e) : e
    }
    function p(e) {
        return e.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }
    function c(e) {
        return e in B ? B[e] : B[e] = new RegExp("(^|\\s)" + e + "(\\s|$)")
    }
    function d(e, t) {
        return "number" != typeof t || X[p(e)] ? t : t + "px"
    }
    function h(e) {
        var t, i;
        return D[e] || (t = I.createElement(e),
        I.body.appendChild(t),
        i = getComputedStyle(t, "").getPropertyValue("display"),
        t.parentNode.removeChild(t),
        "none" == i && (i = "block"),
        D[e] = i),
        D[e]
    }
    function u(e) {
        return "children" in e ? k.call(e.children) : S.map(e.childNodes, function(e) {
            return 1 == e.nodeType ? e : void 0
        }
        )
    }
    function f(e, t, i) {
        for (T in t)
            i && (n(t[T]) || U(t[T])) ? (n(t[T]) && !n(e[T]) && (e[T] = {}),
            U(t[T]) && !U(e[T]) && (e[T] = []),
            f(e[T], t[T], i)) : t[T] !== b && (e[T] = t[T])
    }
    function m(e, t) {
        return null  == t ? S(e) : S(e).filter(t)
    }
    function g(e, i, s, a) {
        return t(i) ? i.call(e, s, a) : i
    }
    function v(e, t, i) {
        null  == i ? e.removeAttribute(t) : e.setAttribute(t, i)
    }
    function w(e, t) {
        var i = e.className || ""
          , s = i && i.baseVal !== b;
        return t === b ? s ? i.baseVal : i : void (s ? i.baseVal = t : e.className = t)
    }
    function y(e) {
        try {
            return e ? "true" == e || ("false" == e ? !1 : "null" == e ? null  : +e + "" == e ? +e : /^[\[\{]/.test(e) ? S.parseJSON(e) : e) : e
        } catch (t) {
            return e
        }
    }
    function x(e, t) {
        t(e);
        for (var i = 0, s = e.childNodes.length; s > i; i++)
            x(e.childNodes[i], t)
    }
    var b, T, S, E, C, P, z = [], k = z.slice, M = z.filter, I = window.document, D = {}, B = {}, X = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    }, Y = /^\s*<(\w+|!)[^>]*>/, H = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, L = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, A = /^(?:body|html)$/i, _ = /([A-Z])/g, O = ["val", "css", "html", "text", "data", "width", "height", "offset"], N = ["after", "prepend", "before", "append"], W = I.createElement("table"), R = I.createElement("tr"), G = {
        tr: I.createElement("tbody"),
        tbody: W,
        thead: W,
        tfoot: W,
        td: R,
        th: R,
        "*": I.createElement("div")
    }, j = /complete|loaded|interactive/, V = /^[\w-]*$/, F = {}, q = F.toString, $ = {}, Z = I.createElement("div"), K = {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    }, U = Array.isArray || function(e) {
        return e instanceof Array
    }
    ;
    return $.matches = function(e, t) {
        if (!t || !e || 1 !== e.nodeType)
            return !1;
        var i = e.webkitMatchesSelector || e.mozMatchesSelector || e.oMatchesSelector || e.matchesSelector;
        if (i)
            return i.call(e, t);
        var s, a = e.parentNode, n = !a;
        return n && (a = Z).appendChild(e),
        s = ~$.qsa(a, t).indexOf(e),
        n && Z.removeChild(e),
        s
    }
    ,
    C = function(e) {
        return e.replace(/-+(.)?/g, function(e, t) {
            return t ? t.toUpperCase() : ""
        }
        )
    }
    ,
    P = function(e) {
        return M.call(e, function(t, i) {
            return e.indexOf(t) == i
        }
        )
    }
    ,
    $.fragment = function(e, t, i) {
        var s, a, r;
        return H.test(e) && (s = S(I.createElement(RegExp.$1))),
        s || (e.replace && (e = e.replace(L, "<$1></$2>")),
        t === b && (t = Y.test(e) && RegExp.$1),
        t in G || (t = "*"),
        r = G[t],
        r.innerHTML = "" + e,
        s = S.each(k.call(r.childNodes), function() {
            r.removeChild(this)
        }
        )),
        n(i) && (a = S(s),
        S.each(i, function(e, t) {
            O.indexOf(e) > -1 ? a[e](t) : a.attr(e, t)
        }
        )),
        s
    }
    ,
    $.Z = function(e, t) {
        return e = e || [],
        e.__proto__ = S.fn,
        e.selector = t || "",
        e
    }
    ,
    $.isZ = function(e) {
        return e instanceof $.Z
    }
    ,
    $.init = function(e, i) {
        var s;
        if (!e)
            return $.Z();
        if ("string" == typeof e)
            if (e = e.trim(),
            "<" == e[0] && Y.test(e))
                s = $.fragment(e, RegExp.$1, i),
                e = null ;
            else {
                if (i !== b)
                    return S(i).find(e);
                s = $.qsa(I, e)
            }
        else {
            if (t(e))
                return S(I).ready(e);
            if ($.isZ(e))
                return e;
            if (U(e))
                s = o(e);
            else if (a(e))
                s = [e],
                e = null ;
            else if (Y.test(e))
                s = $.fragment(e.trim(), RegExp.$1, i),
                e = null ;
            else {
                if (i !== b)
                    return S(i).find(e);
                s = $.qsa(I, e)
            }
        }
        return $.Z(s, e)
    }
    ,
    S = function(e, t) {
        return $.init(e, t)
    }
    ,
    S.extend = function(e) {
        var t, i = k.call(arguments, 1);
        return "boolean" == typeof e && (t = e,
        e = i.shift()),
        i.forEach(function(i) {
            f(e, i, t)
        }
        ),
        e
    }
    ,
    $.qsa = function(e, t) {
        var i, a = "#" == t[0], n = !a && "." == t[0], r = a || n ? t.slice(1) : t, o = V.test(r);
        return s(e) && o && a ? (i = e.getElementById(r)) ? [i] : [] : 1 !== e.nodeType && 9 !== e.nodeType ? [] : k.call(o && !a ? n ? e.getElementsByClassName(r) : e.getElementsByTagName(t) : e.querySelectorAll(t))
    }
    ,
    S.contains = I.documentElement.contains ? function(e, t) {
        return e !== t && e.contains(t)
    }
     : function(e, t) {
        for (; t && (t = t.parentNode); )
            if (t === e)
                return !0;
        return !1
    }
    ,
    S.type = e,
    S.isFunction = t,
    S.isWindow = i,
    S.isArray = U,
    S.isPlainObject = n,
    S.isEmptyObject = function(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }
    ,
    S.inArray = function(e, t, i) {
        return z.indexOf.call(t, e, i)
    }
    ,
    S.camelCase = C,
    S.trim = function(e) {
        return null  == e ? "" : String.prototype.trim.call(e)
    }
    ,
    S.uuid = 0,
    S.support = {},
    S.expr = {},
    S.map = function(e, t) {
        var i, s, a, n = [];
        if (r(e))
            for (s = 0; s < e.length; s++)
                i = t(e[s], s),
                null  != i && n.push(i);
        else
            for (a in e)
                i = t(e[a], a),
                null  != i && n.push(i);
        return l(n)
    }
    ,
    S.each = function(e, t) {
        var i, s;
        if (r(e)) {
            for (i = 0; i < e.length; i++)
                if (t.call(e[i], i, e[i]) === !1)
                    return e
        } else
            for (s in e)
                if (t.call(e[s], s, e[s]) === !1)
                    return e;
        return e
    }
    ,
    S.grep = function(e, t) {
        return M.call(e, t)
    }
    ,
    window.JSON && (S.parseJSON = JSON.parse),
    S.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        F["[object " + t + "]"] = t.toLowerCase()
    }
    ),
    S.fn = {
        forEach: z.forEach,
        reduce: z.reduce,
        push: z.push,
        sort: z.sort,
        indexOf: z.indexOf,
        concat: z.concat,
        map: function(e) {
            return S(S.map(this, function(t, i) {
                return e.call(t, i, t)
            }
            ))
        },
        slice: function() {
            return S(k.apply(this, arguments))
        },
        ready: function(e) {
            return j.test(I.readyState) && I.body ? e(S) : I.addEventListener("DOMContentLoaded", function() {
                e(S)
            }
            , !1),
            this
        },
        get: function(e) {
            return e === b ? k.call(this) : this[e >= 0 ? e : e + this.length]
        },
        toArray: function() {
            return this.get()
        },
        size: function() {
            return this.length
        },
        remove: function() {
            return this.each(function() {
                null  != this.parentNode && this.parentNode.removeChild(this)
            }
            )
        },
        each: function(e) {
            return z.every.call(this, function(t, i) {
                return e.call(t, i, t) !== !1
            }
            ),
            this
        },
        filter: function(e) {
            return t(e) ? this.not(this.not(e)) : S(M.call(this, function(t) {
                return $.matches(t, e)
            }
            ))
        },
        add: function(e, t) {
            return S(P(this.concat(S(e, t))))
        },
        is: function(e) {
            return this.length > 0 && $.matches(this[0], e)
        },
        not: function(e) {
            var i = [];
            if (t(e) && e.call !== b)
                this.each(function(t) {
                    e.call(this, t) || i.push(this)
                }
                );
            else {
                var s = "string" == typeof e ? this.filter(e) : r(e) && t(e.item) ? k.call(e) : S(e);
                this.forEach(function(e) {
                    s.indexOf(e) < 0 && i.push(e)
                }
                )
            }
            return S(i)
        },
        has: function(e) {
            return this.filter(function() {
                return a(e) ? S.contains(this, e) : S(this).find(e).size()
            }
            )
        },
        eq: function(e) {
            return -1 === e ? this.slice(e) : this.slice(e, +e + 1)
        },
        first: function() {
            var e = this[0];
            return e && !a(e) ? e : S(e)
        },
        last: function() {
            var e = this[this.length - 1];
            return e && !a(e) ? e : S(e)
        },
        find: function(e) {
            var t, i = this;
            return t = e ? "object" == typeof e ? S(e).filter(function() {
                var e = this;
                return z.some.call(i, function(t) {
                    return S.contains(t, e)
                }
                )
            }
            ) : 1 == this.length ? S($.qsa(this[0], e)) : this.map(function() {
                return $.qsa(this, e)
            }
            ) : S()
        },
        closest: function(e, t) {
            var i = this[0]
              , a = !1;
            for ("object" == typeof e && (a = S(e)); i && !(a ? a.indexOf(i) >= 0 : $.matches(i, e)); )
                i = i !== t && !s(i) && i.parentNode;
            return S(i)
        },
        parents: function(e) {
            for (var t = [], i = this; i.length > 0; )
                i = S.map(i, function(e) {
                    return (e = e.parentNode) && !s(e) && t.indexOf(e) < 0 ? (t.push(e),
                    e) : void 0
                }
                );
            return m(t, e)
        },
        parent: function(e) {
            return m(P(this.pluck("parentNode")), e)
        },
        children: function(e) {
            return m(this.map(function() {
                return u(this)
            }
            ), e)
        },
        contents: function() {
            return this.map(function() {
                return k.call(this.childNodes)
            }
            )
        },
        siblings: function(e) {
            return m(this.map(function(e, t) {
                return M.call(u(t.parentNode), function(e) {
                    return e !== t
                }
                )
            }
            ), e)
        },
        empty: function() {
            return this.each(function() {
                this.innerHTML = ""
            }
            )
        },
        pluck: function(e) {
            return S.map(this, function(t) {
                return t[e]
            }
            )
        },
        show: function() {
            return this.each(function() {
                "none" == this.style.display && (this.style.display = ""),
                "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName))
            }
            )
        },
        replaceWith: function(e) {
            return this.before(e).remove()
        },
        wrap: function(e) {
            var i = t(e);
            if (this[0] && !i)
                var s = S(e).get(0)
                  , a = s.parentNode || this.length > 1;
            return this.each(function(t) {
                S(this).wrapAll(i ? e.call(this, t) : a ? s.cloneNode(!0) : s)
            }
            )
        },
        wrapAll: function(e) {
            if (this[0]) {
                S(this[0]).before(e = S(e));
                for (var t; (t = e.children()).length; )
                    e = t.first();
                S(e).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            var i = t(e);
            return this.each(function(t) {
                var s = S(this)
                  , a = s.contents()
                  , n = i ? e.call(this, t) : e;
                a.length ? a.wrapAll(n) : s.append(n)
            }
            )
        },
        unwrap: function() {
            return this.parent().each(function() {
                S(this).replaceWith(S(this).children())
            }
            ),
            this
        },
        clone: function() {
            return this.map(function() {
                return this.cloneNode(!0)
            }
            )
        },
        hide: function() {
            return this.css("display", "none")
        },
        toggle: function(e) {
            return this.each(function() {
                var t = S(this);
                (e === b ? "none" == t.css("display") : e) ? t.show() : t.hide()
            }
            )
        },
        prev: function(e) {
            return S(this.pluck("previousElementSibling")).filter(e || "*")
        },
        next: function(e) {
            return S(this.pluck("nextElementSibling")).filter(e || "*")
        },
        html: function(e) {
            return 0 in arguments ? this.each(function(t) {
                var i = this.innerHTML;
                S(this).empty().append(g(this, e, t, i))
            }
            ) : 0 in this ? this[0].innerHTML : null 
        },
        text: function(e) {
            return 0 in arguments ? this.each(function(t) {
                var i = g(this, e, t, this.textContent);
                this.textContent = null  == i ? "" : "" + i
            }
            ) : 0 in this ? this[0].textContent : null 
        },
        attr: function(e, t) {
            var i;
            return "string" != typeof e || 1 in arguments ? this.each(function(i) {
                if (1 === this.nodeType)
                    if (a(e))
                        for (T in e)
                            v(this, T, e[T]);
                    else
                        v(this, e, g(this, t, i, this.getAttribute(e)))
            }
            ) : this.length && 1 === this[0].nodeType ? !(i = this[0].getAttribute(e)) && e in this[0] ? this[0][e] : i : b
        },
        removeAttr: function(e) {
            return this.each(function() {
                1 === this.nodeType && e.split(" ").forEach(function(e) {
                    v(this, e)
                }
                , this)
            }
            )
        },
        prop: function(e, t) {
            return e = K[e] || e,
            1 in arguments ? this.each(function(i) {
                this[e] = g(this, t, i, this[e])
            }
            ) : this[0] && this[0][e]
        },
        data: function(e, t) {
            var i = "data-" + e.replace(_, "-$1").toLowerCase()
              , s = 1 in arguments ? this.attr(i, t) : this.attr(i);
            return null  !== s ? y(s) : b
        },
        val: function(e) {
            return 0 in arguments ? this.each(function(t) {
                this.value = g(this, e, t, this.value)
            }
            ) : this[0] && (this[0].multiple ? S(this[0]).find("option").filter(function() {
                return this.selected
            }
            ).pluck("value") : this[0].value)
        },
        offset: function(e) {
            if (e)
                return this.each(function(t) {
                    var i = S(this)
                      , s = g(this, e, t, i.offset())
                      , a = i.offsetParent().offset()
                      , n = {
                        top: s.top - a.top,
                        left: s.left - a.left
                    };
                    "static" == i.css("position") && (n.position = "relative"),
                    i.css(n)
                }
                );
            if (!this.length)
                return null ;
            var t = this[0].getBoundingClientRect();
            return {
                left: t.left + window.pageXOffset,
                top: t.top + window.pageYOffset,
                width: Math.round(t.width),
                height: Math.round(t.height)
            }
        },
        css: function(t, i) {
            if (arguments.length < 2) {
                var s, a = this[0];
                if (!a)
                    return;
                if (s = getComputedStyle(a, ""),
                "string" == typeof t)
                    return a.style[C(t)] || s.getPropertyValue(t);
                if (U(t)) {
                    var n = {};
                    return S.each(t, function(e, t) {
                        n[t] = a.style[C(t)] || s.getPropertyValue(t)
                    }
                    ),
                    n
                }
            }
            var r = "";
            if ("string" == e(t))
                i || 0 === i ? r = p(t) + ":" + d(t, i) : this.each(function() {
                    this.style.removeProperty(p(t))
                }
                );
            else
                for (T in t)
                    t[T] || 0 === t[T] ? r += p(T) + ":" + d(T, t[T]) + ";" : this.each(function() {
                        this.style.removeProperty(p(T))
                    }
                    );
            return this.each(function() {
                this.style.cssText += ";" + r
            }
            )
        },
        index: function(e) {
            return e ? this.indexOf(S(e)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(e) {
            return e ? z.some.call(this, function(e) {
                return this.test(w(e))
            }
            , c(e)) : !1
        },
        addClass: function(e) {
            return e ? this.each(function(t) {
                if ("className" in this) {
                    E = [];
                    var i = w(this)
                      , s = g(this, e, t, i);
                    s.split(/\s+/g).forEach(function(e) {
                        S(this).hasClass(e) || E.push(e)
                    }
                    , this),
                    E.length && w(this, i + (i ? " " : "") + E.join(" "))
                }
            }
            ) : this
        },
        removeClass: function(e) {
            return this.each(function(t) {
                if ("className" in this) {
                    if (e === b)
                        return w(this, "");
                    E = w(this),
                    g(this, e, t, E).split(/\s+/g).forEach(function(e) {
                        E = E.replace(c(e), " ")
                    }
                    ),
                    w(this, E.trim())
                }
            }
            )
        },
        toggleClass: function(e, t) {
            return e ? this.each(function(i) {
                var s = S(this)
                  , a = g(this, e, i, w(this));
                a.split(/\s+/g).forEach(function(e) {
                    (t === b ? !s.hasClass(e) : t) ? s.addClass(e) : s.removeClass(e)
                }
                )
            }
            ) : this
        },
        scrollTop: function(e) {
            if (this.length) {
                var t = "scrollTop" in this[0];
                return e === b ? t ? this[0].scrollTop : this[0].pageYOffset : this.each(t ? function() {
                    this.scrollTop = e
                }
                 : function() {
                    this.scrollTo(this.scrollX, e)
                }
                )
            }
        },
        scrollLeft: function(e) {
            if (this.length) {
                var t = "scrollLeft" in this[0];
                return e === b ? t ? this[0].scrollLeft : this[0].pageXOffset : this.each(t ? function() {
                    this.scrollLeft = e
                }
                 : function() {
                    this.scrollTo(e, this.scrollY)
                }
                )
            }
        },
        position: function() {
            if (this.length) {
                var e = this[0]
                  , t = this.offsetParent()
                  , i = this.offset()
                  , s = A.test(t[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : t.offset();
                return i.top -= parseFloat(S(e).css("margin-top")) || 0,
                i.left -= parseFloat(S(e).css("margin-left")) || 0,
                s.top += parseFloat(S(t[0]).css("border-top-width")) || 0,
                s.left += parseFloat(S(t[0]).css("border-left-width")) || 0,
                {
                    top: i.top - s.top,
                    left: i.left - s.left
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || I.body; e && !A.test(e.nodeName) && "static" == S(e).css("position"); )
                    e = e.offsetParent;
                return e
            }
            )
        }
    },
    S.fn.detach = S.fn.remove,
    ["width", "height"].forEach(function(e) {
        var t = e.replace(/./, function(e) {
            return e[0].toUpperCase()
        }
        );
        S.fn[e] = function(a) {
            var n, r = this[0];
            return a === b ? i(r) ? r["inner" + t] : s(r) ? r.documentElement["scroll" + t] : (n = this.offset()) && n[e] : this.each(function(t) {
                r = S(this),
                r.css(e, g(this, a, t, r[e]()))
            }
            )
        }
    }
    ),
    N.forEach(function(t, i) {
        var s = i % 2;
        S.fn[t] = function() {
            var t, a, n = S.map(arguments, function(i) {
                return t = e(i),
                "object" == t || "array" == t || null  == i ? i : $.fragment(i)
            }
            ), r = this.length > 1;
            return n.length < 1 ? this : this.each(function(e, t) {
                a = s ? t : t.parentNode,
                t = 0 == i ? t.nextSibling : 1 == i ? t.firstChild : 2 == i ? t : null ;
                var o = S.contains(I.documentElement, a);
                n.forEach(function(e) {
                    if (r)
                        e = e.cloneNode(!0);
                    else if (!a)
                        return S(e).remove();
                    a.insertBefore(e, t),
                    o && x(e, function(e) {
                        null  == e.nodeName || "SCRIPT" !== e.nodeName.toUpperCase() || e.type && "text/javascript" !== e.type || e.src || window.eval.call(window, e.innerHTML)
                    }
                    )
                }
                )
            }
            )
        }
        ,
        S.fn[s ? t + "To" : "insert" + (i ? "Before" : "After")] = function(e) {
            return S(e)[t](this),
            this
        }
    }
    ),
    $.Z.prototype = S.fn,
    $.uniq = P,
    $.deserializeValue = y,
    S.zepto = $,
    S
}
();
window.Zepto = Zepto,
void 0 === window.$ && (window.$ = Zepto),
function(e) {
    function t(e) {
        return e._zid || (e._zid = h++)
    }
    function i(e, i, n, r) {
        if (i = s(i),
        i.ns)
            var o = a(i.ns);
        return (g[t(e)] || []).filter(function(e) {
            return !(!e || i.e && e.e != i.e || i.ns && !o.test(e.ns) || n && t(e.fn) !== t(n) || r && e.sel != r)
        }
        )
    }
    function s(e) {
        var t = ("" + e).split(".");
        return {
            e: t[0],
            ns: t.slice(1).sort().join(" ")
        }
    }
    function a(e) {
        return new RegExp("(?:^| )" + e.replace(" ", " .* ?") + "(?: |$)")
    }
    function n(e, t) {
        return e.del && !w && e.e in y || !!t
    }
    function r(e) {
        return x[e] || w && y[e] || e
    }
    function o(i, a, o, l, c, h, u) {
        var f = t(i)
          , m = g[f] || (g[f] = []);
        a.split(/\s/).forEach(function(t) {
            if ("ready" == t)
                return e(document).ready(o);
            var a = s(t);
            a.fn = o,
            a.sel = c,
            a.e in x && (o = function(t) {
                var i = t.relatedTarget;
                return !i || i !== this && !e.contains(this, i) ? a.fn.apply(this, arguments) : void 0
            }
            ),
            a.del = h;
            var f = h || o;
            a.proxy = function(e) {
                if (e = p(e),
                !e.isImmediatePropagationStopped()) {
                    e.data = l;
                    var t = f.apply(i, e._args == d ? [e] : [e].concat(e._args));
                    return t === !1 && (e.preventDefault(),
                    e.stopPropagation()),
                    t
                }
            }
            ,
            a.i = m.length,
            m.push(a),
            "addEventListener" in i && i.addEventListener(r(a.e), a.proxy, n(a, u))
        }
        )
    }
    function l(e, s, a, o, l) {
        var p = t(e);
        (s || "").split(/\s/).forEach(function(t) {
            i(e, t, a, o).forEach(function(t) {
                delete g[p][t.i],
                "removeEventListener" in e && e.removeEventListener(r(t.e), t.proxy, n(t, l))
            }
            )
        }
        )
    }
    function p(t, i) {
        return (i || !t.isDefaultPrevented) && (i || (i = t),
        e.each(E, function(e, s) {
            var a = i[e];
            t[e] = function() {
                return this[s] = b,
                a && a.apply(i, arguments)
            }
            ,
            t[s] = T
        }
        ),
        (i.defaultPrevented !== d ? i.defaultPrevented : "returnValue" in i ? i.returnValue === !1 : i.getPreventDefault && i.getPreventDefault()) && (t.isDefaultPrevented = b)),
        t
    }
    function c(e) {
        var t, i = {
            originalEvent: e
        };
        for (t in e)
            S.test(t) || e[t] === d || (i[t] = e[t]);
        return p(i, e)
    }
    var d, h = 1, u = Array.prototype.slice, f = e.isFunction, m = function(e) {
        return "string" == typeof e
    }
    , g = {}, v = {}, w = "onfocusin" in window, y = {
        focus: "focusin",
        blur: "focusout"
    }, x = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    v.click = v.mousedown = v.mouseup = v.mousemove = "MouseEvents",
    e.event = {
        add: o,
        remove: l
    },
    e.proxy = function(i, s) {
        var a = 2 in arguments && u.call(arguments, 2);
        if (f(i)) {
            var n = function() {
                return i.apply(s, a ? a.concat(u.call(arguments)) : arguments)
            }
            ;
            return n._zid = t(i),
            n
        }
        if (m(s))
            return a ? (a.unshift(i[s], i),
            e.proxy.apply(null , a)) : e.proxy(i[s], i);
        throw new TypeError("expected function")
    }
    ,
    e.fn.bind = function(e, t, i) {
        return this.on(e, t, i)
    }
    ,
    e.fn.unbind = function(e, t) {
        return this.off(e, t)
    }
    ,
    e.fn.one = function(e, t, i, s) {
        return this.on(e, t, i, s, 1)
    }
    ;
    var b = function() {
        return !0
    }
      , T = function() {
        return !1
    }
      , S = /^([A-Z]|returnValue$|layer[XY]$)/
      , E = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
    };
    e.fn.delegate = function(e, t, i) {
        return this.on(t, e, i)
    }
    ,
    e.fn.undelegate = function(e, t, i) {
        return this.off(t, e, i)
    }
    ,
    e.fn.live = function(t, i) {
        return e(document.body).delegate(this.selector, t, i),
        this
    }
    ,
    e.fn.die = function(t, i) {
        return e(document.body).undelegate(this.selector, t, i),
        this
    }
    ,
    e.fn.on = function(t, i, s, a, n) {
        var r, p, h = this;
        return t && !m(t) ? (e.each(t, function(e, t) {
            h.on(e, i, s, t, n)
        }
        ),
        h) : (m(i) || f(a) || a === !1 || (a = s,
        s = i,
        i = d),
        (f(s) || s === !1) && (a = s,
        s = d),
        a === !1 && (a = T),
        h.each(function(d, h) {
            n && (r = function(e) {
                return l(h, e.type, a),
                a.apply(this, arguments)
            }
            ),
            i && (p = function(t) {
                var s, n = e(t.target).closest(i, h).get(0);
                return n && n !== h ? (s = e.extend(c(t), {
                    currentTarget: n,
                    liveFired: h
                }),
                (r || a).apply(n, [s].concat(u.call(arguments, 1)))) : void 0
            }
            ),
            o(h, t, a, s, i, p || r)
        }
        ))
    }
    ,
    e.fn.off = function(t, i, s) {
        var a = this;
        return t && !m(t) ? (e.each(t, function(e, t) {
            a.off(e, i, t)
        }
        ),
        a) : (m(i) || f(s) || s === !1 || (s = i,
        i = d),
        s === !1 && (s = T),
        a.each(function() {
            l(this, t, s, i)
        }
        ))
    }
    ,
    e.fn.trigger = function(t, i) {
        return t = m(t) || e.isPlainObject(t) ? e.Event(t) : p(t),
        t._args = i,
        this.each(function() {
            t.type in y && "function" == typeof this[t.type] ? this[t.type]() : "dispatchEvent" in this ? this.dispatchEvent(t) : e(this).triggerHandler(t, i)
        }
        )
    }
    ,
    e.fn.triggerHandler = function(t, s) {
        var a, n;
        return this.each(function(r, o) {
            a = c(m(t) ? e.Event(t) : t),
            a._args = s,
            a.target = o,
            e.each(i(o, t.type || t), function(e, t) {
                return n = t.proxy(a),
                a.isImmediatePropagationStopped() ? !1 : void 0
            }
            )
        }
        ),
        n
    }
    ,
    "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(t) {
        e.fn[t] = function(e) {
            return 0 in arguments ? this.bind(t, e) : this.trigger(t)
        }
    }
    ),
    e.Event = function(e, t) {
        m(e) || (t = e,
        e = t.type);
        var i = document.createEvent(v[e] || "Events")
          , s = !0;
        if (t)
            for (var a in t)
                "bubbles" == a ? s = !!t[a] : i[a] = t[a];
        return i.initEvent(e, s, !0),
        p(i)
    }
}
(Zepto),
function(e) {
    function t(t, i, s) {
        var a = e.Event(i);
        return e(t).trigger(a, s),
        !a.isDefaultPrevented()
    }
    function i(e, i, s, a) {
        return e.global ? t(i || w, s, a) : void 0
    }
    function s(t) {
        t.global && 0 === e.active++ && i(t, null , "ajaxStart")
    }
    function a(t) {
        t.global && !--e.active && i(t, null , "ajaxStop")
    }
    function n(e, t) {
        var s = t.context;
        return t.beforeSend.call(s, e, t) === !1 || i(t, s, "ajaxBeforeSend", [e, t]) === !1 ? !1 : void i(t, s, "ajaxSend", [e, t])
    }
    function r(e, t, s, a) {
        var n = s.context
          , r = "success";
        s.success.call(n, e, r, t),
        a && a.resolveWith(n, [e, r, t]),
        i(s, n, "ajaxSuccess", [t, s, e]),
        l(r, t, s)
    }
    function o(e, t, s, a, n) {
        var r = a.context;
        a.error.call(r, s, t, e),
        n && n.rejectWith(r, [s, t, e]),
        i(a, r, "ajaxError", [s, a, e || t]),
        l(t, s, a)
    }
    function l(e, t, s) {
        var n = s.context;
        s.complete.call(n, t, e),
        i(s, n, "ajaxComplete", [t, s]),
        a(s)
    }
    function p() {}
    function c(e) {
        return e && (e = e.split(";", 2)[0]),
        e && (e == S ? "html" : e == T ? "json" : x.test(e) ? "script" : b.test(e) && "xml") || "text"
    }
    function d(e, t) {
        return "" == t ? e : (e + "&" + t).replace(/[&?]{1,2}/, "?")
    }
    function h(t) {
        t.processData && t.data && "string" != e.type(t.data) && (t.data = e.param(t.data, t.traditional)),
        !t.data || t.type && "GET" != t.type.toUpperCase() || (t.url = d(t.url, t.data),
        t.data = void 0)
    }
    function u(t, i, s, a) {
        return e.isFunction(i) && (a = s,
        s = i,
        i = void 0),
        e.isFunction(s) || (a = s,
        s = void 0),
        {
            url: t,
            data: i,
            success: s,
            dataType: a
        }
    }
    function f(t, i, s, a) {
        var n, r = e.isArray(i), o = e.isPlainObject(i);
        e.each(i, function(i, l) {
            n = e.type(l),
            a && (i = s ? a : a + "[" + (o || "object" == n || "array" == n ? i : "") + "]"),
            !a && r ? t.add(l.name, l.value) : "array" == n || !s && "object" == n ? f(t, l, s, i) : t.add(i, l)
        }
        )
    }
    var m, g, v = 0, w = window.document, y = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, x = /^(?:text|application)\/javascript/i, b = /^(?:text|application)\/xml/i, T = "application/json", S = "text/html", E = /^\s*$/, C = w.createElement("a");
    C.href = window.location.href,
    e.active = 0,
    e.ajaxJSONP = function(t, i) {
        if (!("type" in t))
            return e.ajax(t);
        var s, a, l = t.jsonpCallback, p = (e.isFunction(l) ? l() : l) || "jsonp" + ++v, c = w.createElement("script"), d = window[p], h = function(t) {
            e(c).triggerHandler("error", t || "abort")
        }
        , u = {
            abort: h
        };
        return i && i.promise(u),
        e(c).on("load error", function(n, l) {
            clearTimeout(a),
            e(c).off().remove(),
            "error" != n.type && s ? r(s[0], u, t, i) : o(null , l || "error", u, t, i),
            window[p] = d,
            s && e.isFunction(d) && d(s[0]),
            d = s = void 0
        }
        ),
        n(u, t) === !1 ? (h("abort"),
        u) : (window[p] = function() {
            s = arguments
        }
        ,
        c.src = t.url.replace(/\?(.+)=\?/, "?$1=" + p),
        w.head.appendChild(c),
        t.timeout > 0 && (a = setTimeout(function() {
            h("timeout")
        }
        , t.timeout)),
        u)
    }
    ,
    e.ajaxSettings = {
        type: "GET",
        beforeSend: p,
        success: p,
        error: p,
        complete: p,
        context: null ,
        global: !0,
        xhr: function() {
            return new window.XMLHttpRequest
        },
        accepts: {
            script: "text/javascript, application/javascript, application/x-javascript",
            json: T,
            xml: "application/xml, text/xml",
            html: S,
            text: "text/plain"
        },
        crossDomain: !1,
        timeout: 0,
        processData: !0,
        cache: !0
    },
    e.ajax = function(t) {
        var i, a = e.extend({}, t || {}), l = e.Deferred && e.Deferred();
        for (m in e.ajaxSettings)
            void 0 === a[m] && (a[m] = e.ajaxSettings[m]);
        s(a),
        a.crossDomain || (i = w.createElement("a"),
        i.href = a.url,
        i.href = i.href,
        a.crossDomain = C.protocol + "//" + C.host != i.protocol + "//" + i.host),
        a.url || (a.url = window.location.toString()),
        h(a);
        var u = a.dataType
          , f = /\?.+=\?/.test(a.url);
        if (f && (u = "jsonp"),
        a.cache !== !1 && (t && t.cache === !0 || "script" != u && "jsonp" != u) || (a.url = d(a.url, "_=" + Date.now())),
        "jsonp" == u)
            return f || (a.url = d(a.url, a.jsonp ? a.jsonp + "=?" : a.jsonp === !1 ? "" : "callback=?")),
            e.ajaxJSONP(a, l);
        var v, y = a.accepts[u], x = {}, b = function(e, t) {
            x[e.toLowerCase()] = [e, t]
        }
        , T = /^([\w-]+:)\/\//.test(a.url) ? RegExp.$1 : window.location.protocol, S = a.xhr(), P = S.setRequestHeader;
        if (l && l.promise(S),
        a.crossDomain || b("X-Requested-With", "XMLHttpRequest"),
        b("Accept", y || "*/*"),
        (y = a.mimeType || y) && (y.indexOf(",") > -1 && (y = y.split(",", 2)[0]),
        S.overrideMimeType && S.overrideMimeType(y)),
        (a.contentType || a.contentType !== !1 && a.data && "GET" != a.type.toUpperCase()) && b("Content-Type", a.contentType || "application/x-www-form-urlencoded"),
        a.headers)
            for (g in a.headers)
                b(g, a.headers[g]);
        if (S.setRequestHeader = b,
        S.onreadystatechange = function() {
            if (4 == S.readyState) {
                S.onreadystatechange = p,
                clearTimeout(v);
                var t, i = !1;
                if (S.status >= 200 && S.status < 300 || 304 == S.status || 0 == S.status && "file:" == T) {
                    u = u || c(a.mimeType || S.getResponseHeader("content-type")),
                    t = S.responseText;
                    try {
                        "script" == u ? (1,
                        eval)(t) : "xml" == u ? t = S.responseXML : "json" == u && (t = E.test(t) ? null  : e.parseJSON(t))
                    } catch (s) {
                        i = s
                    }
                    i ? o(i, "parsererror", S, a, l) : r(t, S, a, l)
                } else
                    o(S.statusText || null , S.status ? "error" : "abort", S, a, l)
            }
        }
        ,
        n(S, a) === !1)
            return S.abort(),
            o(null , "abort", S, a, l),
            S;
        if (a.xhrFields)
            for (g in a.xhrFields)
                S[g] = a.xhrFields[g];
        var z = "async" in a ? a.async : !0;
        S.open(a.type, a.url, z, a.username, a.password);
        for (g in x)
            P.apply(S, x[g]);
        return a.timeout > 0 && (v = setTimeout(function() {
            S.onreadystatechange = p,
            S.abort(),
            o(null , "timeout", S, a, l)
        }
        , a.timeout)),
        S.send(a.data ? a.data : null ),
        S
    }
    ,
    e.get = function() {
        return e.ajax(u.apply(null , arguments))
    }
    ,
    e.post = function() {
        var t = u.apply(null , arguments);
        return t.type = "POST",
        e.ajax(t)
    }
    ,
    e.getJSON = function() {
        var t = u.apply(null , arguments);
        return t.dataType = "json",
        e.ajax(t)
    }
    ,
    e.fn.load = function(t, i, s) {
        if (!this.length)
            return this;
        var a, n = this, r = t.split(/\s/), o = u(t, i, s), l = o.success;
        return r.length > 1 && (o.url = r[0],
        a = r[1]),
        o.success = function(t) {
            n.html(a ? e("<div>").html(t.replace(y, "")).find(a) : t),
            l && l.apply(n, arguments)
        }
        ,
        e.ajax(o),
        this
    }
    ;
    var P = encodeURIComponent;
    e.param = function(t, i) {
        var s = [];
        return s.add = function(t, i) {
            e.isFunction(i) && (i = i()),
            null  == i && (i = ""),
            this.push(P(t) + "=" + P(i))
        }
        ,
        f(s, t, i),
        s.join("&").replace(/%20/g, "+")
    }
}
(Zepto),
function(e) {
    e.fn.serializeArray = function() {
        var t, i, s = [], a = function(e) {
            return e.forEach ? e.forEach(a) : void s.push({
                name: t,
                value: e
            })
        }
        ;
        return this[0] && e.each(this[0].elements, function(s, n) {
            i = n.type,
            t = n.name,
            t && "fieldset" != n.nodeName.toLowerCase() && !n.disabled && "submit" != i && "reset" != i && "button" != i && "file" != i && ("radio" != i && "checkbox" != i || n.checked) && a(e(n).val())
        }
        ),
        s
    }
    ,
    e.fn.serialize = function() {
        var e = [];
        return this.serializeArray().forEach(function(t) {
            e.push(encodeURIComponent(t.name) + "=" + encodeURIComponent(t.value))
        }
        ),
        e.join("&")
    }
    ,
    e.fn.submit = function(t) {
        if (0 in arguments)
            this.bind("submit", t);
        else if (this.length) {
            var i = e.Event("submit");
            this.eq(0).trigger(i),
            i.isDefaultPrevented() || this.get(0).submit()
        }
        return this
    }
}
(Zepto),
function(e) {
    "__proto__" in {} || e.extend(e.zepto, {
        Z: function(t, i) {
            return t = t || [],
            e.extend(t, e.fn),
            t.selector = i || "",
            t.__Z = !0,
            t
        },
        isZ: function(t) {
            return "array" === e.type(t) && "__Z" in t
        }
    });
    try {
        getComputedStyle(void 0)
    } catch (t) {
        var i = getComputedStyle;
        window.getComputedStyle = function(e) {
            try {
                return i(e)
            } catch (t) {
                return null 
            }
        }
    }
}
(Zepto),
function(e, t) {
    function i(e) {
        return e.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
    }
    function s(e) {
        return a ? a + e : e.toLowerCase()
    }
    var a, n, r, o, l, p, c, d, h, u, f = "", m = {
        Webkit: "webkit",
        Moz: "",
        O: "o"
    }, g = document.createElement("div"), v = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, w = {};
    e.each(m, function(e, i) {
        return g.style[e + "TransitionProperty"] !== t ? (f = "-" + e.toLowerCase() + "-",
        a = i,
        !1) : void 0
    }
    ),
    n = f + "transform",
    w[r = f + "transition-property"] = w[o = f + "transition-duration"] = w[p = f + "transition-delay"] = w[l = f + "transition-timing-function"] = w[c = f + "animation-name"] = w[d = f + "animation-duration"] = w[u = f + "animation-delay"] = w[h = f + "animation-timing-function"] = "",
    e.fx = {
        off: a === t && g.style.transitionProperty === t,
        speeds: {
            _default: 400,
            fast: 200,
            slow: 600
        },
        cssPrefix: f,
        transitionEnd: s("TransitionEnd"),
        animationEnd: s("AnimationEnd")
    },
    e.fn.animate = function(i, s, a, n, r) {
        return e.isFunction(s) && (n = s,
        a = t,
        s = t),
        e.isFunction(a) && (n = a,
        a = t),
        e.isPlainObject(s) && (a = s.easing,
        n = s.complete,
        r = s.delay,
        s = s.duration),
        s && (s = ("number" == typeof s ? s : e.fx.speeds[s] || e.fx.speeds._default) / 1e3),
        r && (r = parseFloat(r) / 1e3),
        this.anim(i, s, a, n, r)
    }
    ,
    e.fn.anim = function(s, a, f, m, g) {
        var y, x, b, T = {}, S = "", E = this, C = e.fx.transitionEnd, P = !1;
        if (a === t && (a = e.fx.speeds._default / 1e3),
        g === t && (g = 0),
        e.fx.off && (a = 0),
        "string" == typeof s)
            T[c] = s,
            T[d] = a + "s",
            T[u] = g + "s",
            T[h] = f || "linear",
            C = e.fx.animationEnd;
        else {
            x = [];
            for (y in s)
                v.test(y) ? S += y + "(" + s[y] + ") " : (T[y] = s[y],
                x.push(i(y)));
            S && (T[n] = S,
            x.push(n)),
            a > 0 && "object" == typeof s && (T[r] = x.join(", "),
            T[o] = a + "s",
            T[p] = g + "s",
            T[l] = f || "linear")
        }
        return b = function(t) {
            if ("undefined" != typeof t) {
                if (t.target !== t.currentTarget)
                    return;
                e(t.target).unbind(C, b)
            } else
                e(this).unbind(C, b);
            P = !0,
            e(this).css(w),
            m && m.call(this)
        }
        ,
        a > 0 && (this.bind(C, b),
        setTimeout(function() {
            P || b.call(E)
        }
        , 1e3 * (a + g) + 25)),
        this.size() && this.get(0).clientLeft,
        this.css(T),
        0 >= a && setTimeout(function() {
            E.each(function() {
                b.call(this)
            }
            )
        }
        , 0),
        this
    }
    ,
    g = null 
}
(Zepto),
function(e, t) {
    function i(i, s, a, n, r) {
        "function" != typeof s || r || (r = s,
        s = t);
        var o = {
            opacity: a
        };
        return n && (o.scale = n,
        i.css(e.fx.cssPrefix + "transform-origin", "0 0")),
        i.animate(o, s, null , r)
    }
    function s(t, s, a, n) {
        return i(t, s, 0, a, function() {
            r.call(e(this)),
            n && n.call(this)
        }
        )
    }
    var a = window.document
      , n = (a.documentElement,
    e.fn.show)
      , r = e.fn.hide
      , o = e.fn.toggle;
    e.fn.show = function(e, s) {
        return n.call(this),
        e === t ? e = 0 : this.css("opacity", 0),
        i(this, e, 1, "1,1", s)
    }
    ,
    e.fn.hide = function(e, i) {
        return e === t ? r.call(this) : s(this, e, "0,0", i)
    }
    ,
    e.fn.toggle = function(i, s) {
        return i === t || "boolean" == typeof i ? o.call(this, i) : this.each(function() {
            var t = e(this);
            t["none" == t.css("display") ? "show" : "hide"](i, s)
        }
        )
    }
    ,
    e.fn.fadeTo = function(e, t, s) {
        return i(this, e, t, null , s)
    }
    ,
    e.fn.fadeIn = function(e, t) {
        var i = this.css("opacity");
        return i > 0 ? this.css("opacity", 0) : i = 1,
        n.call(this).fadeTo(e, i, t)
    }
    ,
    e.fn.fadeOut = function(e, t) {
        return s(this, e, null , t)
    }
    ,
    e.fn.fadeToggle = function(t, i) {
        return this.each(function() {
            var s = e(this);
            s[0 == s.css("opacity") || "none" == s.css("display") ? "fadeIn" : "fadeOut"](t, i)
        }
        )
    }
}
(Zepto),
function(e, t, i) {
    function s(i, s) {
        this.wrapper = "string" == typeof i ? t.querySelector(i) : i,
        this.scroller = this.wrapper.children[0],
        this.scrollerStyle = this.scroller.style,
        this.options = {
            resizeScrollbars: !0,
            mouseWheelSpeed: 20,
            snapThreshold: .334,
            disablePointer: !o.hasPointer,
            disableTouch: o.hasPointer || !o.hasTouch,
            disableMouse: o.hasPointer || o.hasTouch,
            startX: 0,
            startY: 0,
            scrollY: !0,
            directionLockThreshold: 5,
            momentum: !0,
            bounce: !0,
            bounceTime: 600,
            bounceEasing: "",
            preventDefault: !0,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            HWCompositing: !0,
            useTransition: !0,
            useTransform: !0,
            bindToWrapper: "undefined" == typeof e.onmousedown
        };
        for (var a in s)
            this.options[a] = s[a];
        this.translateZ = this.options.HWCompositing && o.hasPerspective ? " translateZ(0)" : "",
        this.options.useTransition = o.hasTransition && this.options.useTransition,
        this.options.useTransform = o.hasTransform && this.options.useTransform,
        this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough,
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault,
        this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY,
        this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX,
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough,
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold,
        this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? o.ease[this.options.bounceEasing] || o.ease.circular : this.options.bounceEasing,
        this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling,
        this.options.tap === !0 && (this.options.tap = "tap"),
        this.options.useTransition || this.options.useTransform || /relative|absolute/i.test(this.scrollerStyle.position) || (this.scrollerStyle.position = "relative"),
        "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1),
        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1,
        3 == this.options.probeType && (this.options.useTransition = !1),
        this.x = 0,
        this.y = 0,
        this.directionX = 0,
        this.directionY = 0,
        this._events = {},
        this._init(),
        this.refresh(),
        this.scrollTo(this.options.startX, this.options.startY),
        this.enable()
    }
    function a(e, i, s) {
        var a = t.createElement("div")
          , n = t.createElement("div");
        return s === !0 && (a.style.cssText = "position:absolute;z-index:9999",
        n.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),
        n.className = "iScrollIndicator",
        "h" == e ? (s === !0 && (a.style.cssText += ";height:7px;left:2px;right:2px;bottom:0",
        n.style.height = "100%"),
        a.className = "iScrollHorizontalScrollbar") : (s === !0 && (a.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px",
        n.style.width = "100%"),
        a.className = "iScrollVerticalScrollbar"),
        a.style.cssText += ";overflow:hidden",
        i || (a.style.pointerEvents = "none"),
        a.appendChild(n),
        a
    }
    function n(i, s) {
        this.wrapper = "string" == typeof s.el ? t.querySelector(s.el) : s.el,
        this.wrapperStyle = this.wrapper.style,
        this.indicator = this.wrapper.children[0],
        this.indicatorStyle = this.indicator.style,
        this.scroller = i,
        this.options = {
            listenX: !0,
            listenY: !0,
            interactive: !1,
            resize: !0,
            defaultScrollbars: !1,
            shrink: !1,
            fade: !1,
            speedRatioX: 0,
            speedRatioY: 0
        };
        for (var a in s)
            this.options[a] = s[a];
        if (this.sizeRatioX = 1,
        this.sizeRatioY = 1,
        this.maxPosX = 0,
        this.maxPosY = 0,
        this.options.interactive && (this.options.disableTouch || (o.addEvent(this.indicator, "touchstart", this),
        o.addEvent(e, "touchend", this)),
        this.options.disablePointer || (o.addEvent(this.indicator, o.prefixPointerEvent("pointerdown"), this),
        o.addEvent(e, o.prefixPointerEvent("pointerup"), this)),
        this.options.disableMouse || (o.addEvent(this.indicator, "mousedown", this),
        o.addEvent(e, "mouseup", this))),
        this.options.fade) {
            this.wrapperStyle[o.style.transform] = this.scroller.translateZ;
            var n = o.style.transitionDuration;
            if (!n)
                return;
            this.wrapperStyle[n] = o.isBadAndroid ? "0.0001ms" : "0ms";
            var l = this;
            o.isBadAndroid && r(function() {
                "0.0001ms" === l.wrapperStyle[n] && (l.wrapperStyle[n] = "0s")
            }
            ),
            this.wrapperStyle.opacity = "0"
        }
    }
    var r = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(t) {
        e.setTimeout(t, 1e3 / 60)
    }
      , o = function() {
        function s(e) {
            return r === !1 ? !1 : "" === r ? e : r + e.charAt(0).toUpperCase() + e.substr(1)
        }
        var a = {}
          , n = t.createElement("div").style
          , r = function() {
            for (var e, t = ["t", "webkitT", "MozT", "msT", "OT"], i = 0, s = t.length; s > i; i++)
                if (e = t[i] + "ransform",
                e in n)
                    return t[i].substr(0, t[i].length - 1);
            return !1
        }
        ();
        a.getTime = Date.now || function() {
            return (new Date).getTime()
        }
        ,
        a.extend = function(e, t) {
            for (var i in t)
                e[i] = t[i]
        }
        ,
        a.addEvent = function(e, t, i, s) {
            e.addEventListener(t, i, !!s)
        }
        ,
        a.removeEvent = function(e, t, i, s) {
            e.removeEventListener(t, i, !!s)
        }
        ,
        a.prefixPointerEvent = function(t) {
            return e.MSPointerEvent ? "MSPointer" + t.charAt(7).toUpperCase() + t.substr(8) : t
        }
        ,
        a.momentum = function(e, t, s, a, n, r) {
            var o, l, p = e - t, c = i.abs(p) / s;
            return r = void 0 === r ? 6e-4 : r,
            o = e + c * c / (2 * r) * (0 > p ? -1 : 1),
            l = c / r,
            a > o ? (o = n ? a - n / 2.5 * (c / 8) : a,
            p = i.abs(o - e),
            l = p / c) : o > 0 && (o = n ? n / 2.5 * (c / 8) : 0,
            p = i.abs(e) + o,
            l = p / c),
            {
                destination: i.round(o),
                duration: l
            }
        }
        ;
        var o = s("transform");
        return a.extend(a, {
            hasTransform: o !== !1,
            hasPerspective: s("perspective") in n,
            hasTouch: "ontouchstart" in e,
            hasPointer: !(!e.PointerEvent && !e.MSPointerEvent),
            hasTransition: s("transition") in n
        }),
        a.isBadAndroid = function() {
            var t = e.navigator.appVersion;
            if (/Android/.test(t) && !/Chrome\/\d/.test(t)) {
                var i = t.match(/Safari\/(\d+.\d)/);
                return i && "object" == typeof i && i.length >= 2 ? parseFloat(i[1]) < 535.19 : !0
            }
            return !1
        }
        (),
        a.extend(a.style = {}, {
            transform: o,
            transitionTimingFunction: s("transitionTimingFunction"),
            transitionDuration: s("transitionDuration"),
            transitionDelay: s("transitionDelay"),
            transformOrigin: s("transformOrigin")
        }),
        a.hasClass = function(e, t) {
            var i = new RegExp("(^|\\s)" + t + "(\\s|$)");
            return i.test(e.className)
        }
        ,
        a.addClass = function(e, t) {
            if (!a.hasClass(e, t)) {
                var i = e.className.split(" ");
                i.push(t),
                e.className = i.join(" ")
            }
        }
        ,
        a.removeClass = function(e, t) {
            if (a.hasClass(e, t)) {
                var i = new RegExp("(^|\\s)" + t + "(\\s|$)","g");
                e.className = e.className.replace(i, " ")
            }
        }
        ,
        a.offset = function(e) {
            for (var t = -e.offsetLeft, i = -e.offsetTop; e = e.offsetParent; )
                t -= e.offsetLeft,
                i -= e.offsetTop;
            return {
                left: t,
                top: i
            }
        }
        ,
        a.preventDefaultException = function(e, t) {
            for (var i in t)
                if (t[i].test(e[i]))
                    return !0;
            return !1
        }
        ,
        a.extend(a.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        }),
        a.extend(a.ease = {}, {
            quadratic: {
                style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fn: function(e) {
                    return e * (2 - e)
                }
            },
            circular: {
                style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                fn: function(e) {
                    return i.sqrt(1 - --e * e)
                }
            },
            back: {
                style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                fn: function(e) {
                    var t = 4;
                    return (e -= 1) * e * ((t + 1) * e + t) + 1
                }
            },
            bounce: {
                style: "",
                fn: function(e) {
                    return (e /= 1) < 1 / 2.75 ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
                }
            },
            elastic: {
                style: "",
                fn: function(e) {
                    var t = .22
                      , s = .4;
                    return 0 === e ? 0 : 1 == e ? 1 : s * i.pow(2, -10 * e) * i.sin((e - t / 4) * (2 * i.PI) / t) + 1
                }
            }
        }),
        a.tap = function(e, i) {
            var s = t.createEvent("Event");
            s.initEvent(i, !0, !0),
            s.pageX = e.pageX,
            s.pageY = e.pageY,
            e.target.dispatchEvent(s)
        }
        ,
        a.click = function(i) {
            var s, a = i.target;
            /(SELECT|INPUT|TEXTAREA)/i.test(a.tagName) || (s = t.createEvent(e.MouseEvent ? "MouseEvents" : "Event"),
            s.initEvent("click", !0, !0),
            s.view = i.view || e,
            s.detail = 1,
            s.screenX = a.screenX || 0,
            s.screenY = a.screenY || 0,
            s.clientX = a.clientX || 0,
            s.clientY = a.clientY || 0,
            s.ctrlKey = !!i.ctrlKey,
            s.altKey = !!i.altKey,
            s.shiftKey = !!i.shiftKey,
            s.metaKey = !!i.metaKey,
            s.button = 0,
            s.relatedTarget = null ,
            s._constructed = !0,
            a.dispatchEvent(s))
        }
        ,
        a
    }
    ();
    s.prototype = {
        version: "5.2.0",
        _init: function() {
            this._initEvents(),
            (this.options.scrollbars || this.options.indicators) && this._initIndicators(),
            this.options.mouseWheel && this._initWheel(),
            this.options.snap && this._initSnap(),
            this.options.keyBindings && this._initKeys()
        },
        destroy: function() {
            this._initEvents(!0),
            clearTimeout(this.resizeTimeout),
            this.resizeTimeout = null ,
            this._execEvent("destroy")
        },
        _transitionEnd: function(e) {
            e.target == this.scroller && this.isInTransition && (this._transitionTime(),
            this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1,
            this._execEvent("scrollEnd")))
        },
        _start: function(e) {
            if (1 != o.eventType[e.type]) {
                var t;
                if (t = e.which ? e.button : e.button < 2 ? 0 : 4 == e.button ? 1 : 2,
                0 !== t)
                    return
            }
            if (this.enabled && (!this.initiated || o.eventType[e.type] === this.initiated)) {
                !this.options.preventDefault || o.isBadAndroid || o.preventDefaultException(e.target, this.options.preventDefaultException) || e.preventDefault();
                var s, a = e.touches ? e.touches[0] : e;
                this.initiated = o.eventType[e.type],
                this.moved = !1,
                this.distX = 0,
                this.distY = 0,
                this.directionX = 0,
                this.directionY = 0,
                this.directionLocked = 0,
                this.startTime = o.getTime(),
                this.options.useTransition && this.isInTransition ? (this._transitionTime(),
                this.isInTransition = !1,
                s = this.getComputedPosition(),
                this._translate(i.round(s.x), i.round(s.y)),
                this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1,
                this._execEvent("scrollEnd")),
                this.startX = this.x,
                this.startY = this.y,
                this.absStartX = this.x,
                this.absStartY = this.y,
                this.pointX = a.pageX,
                this.pointY = a.pageY,
                this._execEvent("beforeScrollStart")
            }
        },
        _move: function(e) {
            if (this.enabled && o.eventType[e.type] === this.initiated) {
                this.options.preventDefault && e.preventDefault();
                var t, s, a, n, r = e.touches ? e.touches[0] : e, l = r.pageX - this.pointX, p = r.pageY - this.pointY, c = o.getTime();
                if (this.pointX = r.pageX,
                this.pointY = r.pageY,
                this.distX += l,
                this.distY += p,
                a = i.abs(this.distX),
                n = i.abs(this.distY),
                !(c - this.endTime > 300 && 10 > a && 10 > n)) {
                    if (this.directionLocked || this.options.freeScroll || (a > n + this.options.directionLockThreshold ? this.directionLocked = "h" : n >= a + this.options.directionLockThreshold ? this.directionLocked = "v" : this.directionLocked = "n"),
                    "h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough)
                            e.preventDefault();
                        else if ("horizontal" == this.options.eventPassthrough)
                            return void (this.initiated = !1);
                        p = 0
                    } else if ("v" == this.directionLocked) {
                        if ("horizontal" == this.options.eventPassthrough)
                            e.preventDefault();
                        else if ("vertical" == this.options.eventPassthrough)
                            return void (this.initiated = !1);
                        l = 0
                    }
                    l = this.hasHorizontalScroll ? l : 0,
                    p = this.hasVerticalScroll ? p : 0,
                    t = this.x + l,
                    s = this.y + p,
                    (t > 0 || t < this.maxScrollX) && (t = this.options.bounce ? this.x + l / 3 : t > 0 ? 0 : this.maxScrollX),
                    (s > 0 || s < this.maxScrollY) && (s = this.options.bounce ? this.y + p / 3 : s > 0 ? 0 : this.maxScrollY),
                    this.directionX = l > 0 ? -1 : 0 > l ? 1 : 0,
                    this.directionY = p > 0 ? -1 : 0 > p ? 1 : 0,
                    this.moved || this._execEvent("scrollStart"),
                    this.moved = !0,
                    this._translate(t, s),
                    c - this.startTime > 300 && (this.startTime = c,
                    this.startX = this.x,
                    this.startY = this.y,
                    1 == this.options.probeType && this._execEvent("scroll")),
                    this.options.probeType > 1 && this._execEvent("scroll")
                }
            }
        },
        _end: function(e) {
            if (this.enabled && o.eventType[e.type] === this.initiated) {
                this.options.preventDefault && !o.preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
                var t, s, a = (e.changedTouches ? e.changedTouches[0] : e,
                o.getTime() - this.startTime), n = i.round(this.x), r = i.round(this.y), l = i.abs(n - this.startX), p = i.abs(r - this.startY), c = 0, d = "";
                if (this.isInTransition = 0,
                this.initiated = 0,
                this.endTime = o.getTime(),
                !this.resetPosition(this.options.bounceTime)) {
                    if (this.scrollTo(n, r),
                    !this.moved)
                        return this.options.tap && o.tap(e, this.options.tap),
                        this.options.click && o.click(e),
                        void this._execEvent("scrollCancel");
                    if (this._events.flick && 200 > a && 100 > l && 100 > p)
                        return void this._execEvent("flick");
                    if (this.options.momentum && 300 > a && (t = this.hasHorizontalScroll ? o.momentum(this.x, this.startX, a, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                        destination: n,
                        duration: 0
                    },
                    s = this.hasVerticalScroll ? o.momentum(this.y, this.startY, a, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                        destination: r,
                        duration: 0
                    },
                    n = t.destination,
                    r = s.destination,
                    c = i.max(t.duration, s.duration),
                    this.isInTransition = 1),
                    this.options.snap) {
                        var h = this._nearestSnap(n, r);
                        this.currentPage = h,
                        c = this.options.snapSpeed || i.max(i.max(i.min(i.abs(n - h.x), 1e3), i.min(i.abs(r - h.y), 1e3)), 300),
                        n = h.x,
                        r = h.y,
                        this.directionX = 0,
                        this.directionY = 0,
                        d = this.options.bounceEasing
                    }
                    return n != this.x || r != this.y ? ((n > 0 || n < this.maxScrollX || r > 0 || r < this.maxScrollY) && (d = o.ease.quadratic),
                    void this.scrollTo(n, r, c, d)) : void this._execEvent("scrollEnd")
                }
            }
        },
        _resize: function() {
            var e = this;
            clearTimeout(this.resizeTimeout),
            this.resizeTimeout = setTimeout(function() {
                e.refresh()
            }
            , this.options.resizePolling)
        },
        resetPosition: function(e) {
            var t = this.x
              , i = this.y;
            return e = e || 0,
            !this.hasHorizontalScroll || this.x > 0 ? t = 0 : this.x < this.maxScrollX && (t = this.maxScrollX),
            !this.hasVerticalScroll || this.y > 0 ? i = 0 : this.y < this.maxScrollY && (i = this.maxScrollY),
            t == this.x && i == this.y ? !1 : (Common.stopScrollBack || this.scrollTo(t, i, e, this.options.bounceEasing),
            !0)
        },
        disable: function() {
            this.enabled = !1
        },
        enable: function() {
            this.enabled = !0
        },
        refresh: function() {
            this.wrapper.offsetHeight;
            this.wrapperWidth = this.wrapper.clientWidth,
            this.wrapperHeight = this.wrapper.clientHeight,
            this.scrollerWidth = this.scroller.offsetWidth,
            this.scrollerHeight = this.scroller.offsetHeight,
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth,
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight,
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0,
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0,
            this.hasHorizontalScroll || (this.maxScrollX = 0,
            this.scrollerWidth = this.wrapperWidth),
            this.hasVerticalScroll || (this.maxScrollY = 0,
            this.scrollerHeight = this.wrapperHeight),
            this.endTime = 0,
            this.directionX = 0,
            this.directionY = 0,
            this.wrapperOffset = o.offset(this.wrapper),
            this._execEvent("refresh"),
            this.resetPosition()
        },
        on: function(e, t) {
            this._events[e] || (this._events[e] = []),
            this._events[e].push(t)
        },
        off: function(e, t) {
            if (this._events[e]) {
                var i = this._events[e].indexOf(t);
                i > -1 && this._events[e].splice(i, 1)
            }
        },
        _execEvent: function(e) {
            if (this._events[e]) {
                var t = 0
                  , i = this._events[e].length;
                if (i)
                    for (; i > t; t++)
                        this._events[e][t].apply(this, [].slice.call(arguments, 1))
            }
        },
        scrollBy: function(e, t, i, s) {
            e = this.x + e,
            t = this.y + t,
            i = i || 0,
            this.scrollTo(e, t, i, s)
        },
        scrollTo: function(e, t, i, s) {
            s = s || o.ease.circular,
            this.isInTransition = this.options.useTransition && i > 0;
            var a = this.options.useTransition && s.style;
            !i || a ? (a && (this._transitionTimingFunction(s.style),
            this._transitionTime(i)),
            this._translate(e, t)) : this._animate(e, t, i, s.fn)
        },
        scrollToElement: function(e, t, s, a, n) {
            if (e = e.nodeType ? e : this.scroller.querySelector(e)) {
                var r = o.offset(e);
                r.left -= this.wrapperOffset.left,
                r.top -= this.wrapperOffset.top,
                s === !0 && (s = i.round(e.offsetWidth / 2 - this.wrapper.offsetWidth / 2)),
                a === !0 && (a = i.round(e.offsetHeight / 2 - this.wrapper.offsetHeight / 2)),
                r.left -= s || 0,
                r.top -= a || 0,
                r.left = r.left > 0 ? 0 : r.left < this.maxScrollX ? this.maxScrollX : r.left,
                r.top = r.top > 0 ? 0 : r.top < this.maxScrollY ? this.maxScrollY : r.top,
                t = void 0 === t || null  === t || "auto" === t ? i.max(i.abs(this.x - r.left), i.abs(this.y - r.top)) : t,
                this.scrollTo(r.left, r.top, t, n)
            }
        },
        _transitionTime: function(e) {
            if (this.options.useTransition) {
                e = e || 0;
                var t = o.style.transitionDuration;
                if (t) {
                    if (this.scrollerStyle[t] = e + "ms",
                    !e && o.isBadAndroid) {
                        this.scrollerStyle[t] = "0.0001ms";
                        var i = this;
                        r(function() {
                            "0.0001ms" === i.scrollerStyle[t] && (i.scrollerStyle[t] = "0s")
                        }
                        )
                    }
                    if (this.indicators)
                        for (var s = this.indicators.length; s--; )
                            this.indicators[s].transitionTime(e)
                }
            }
        },
        _transitionTimingFunction: function(e) {
            if (this.scrollerStyle[o.style.transitionTimingFunction] = e,
            this.indicators)
                for (var t = this.indicators.length; t--; )
                    this.indicators[t].transitionTimingFunction(e)
        },
        _translate: function(e, t) {
            if (this.options.useTransform ? this.scrollerStyle[o.style.transform] = "translate(" + e + "px," + t + "px)" + this.translateZ : (e = i.round(e),
            t = i.round(t),
            this.scrollerStyle.left = e + "px",
            this.scrollerStyle.top = t + "px"),
            this.x = e,
            this.y = t,
            this.indicators)
                for (var s = this.indicators.length; s--; )
                    this.indicators[s].updatePosition()
        },
        _initEvents: function(t) {
            var i = t ? o.removeEvent : o.addEvent
              , s = this.options.bindToWrapper ? this.wrapper : e;
            i(e, "orientationchange", this),
            i(e, "resize", this),
            this.options.click && i(this.wrapper, "click", this, !0),
            this.options.disableMouse || (i(this.wrapper, "mousedown", this),
            i(s, "mousemove", this),
            i(s, "mousecancel", this),
            i(s, "mouseup", this)),
            o.hasPointer && !this.options.disablePointer && (i(this.wrapper, o.prefixPointerEvent("pointerdown"), this),
            i(s, o.prefixPointerEvent("pointermove"), this),
            i(s, o.prefixPointerEvent("pointercancel"), this),
            i(s, o.prefixPointerEvent("pointerup"), this)),
            o.hasTouch && !this.options.disableTouch && (i(this.wrapper, "touchstart", this),
            i(s, "touchmove", this),
            i(s, "touchcancel", this),
            i(s, "touchend", this)),
            i(this.scroller, "transitionend", this),
            i(this.scroller, "webkitTransitionEnd", this),
            i(this.scroller, "oTransitionEnd", this),
            i(this.scroller, "MSTransitionEnd", this)
        },
        getComputedPosition: function() {
            var t, i, s = e.getComputedStyle(this.scroller, null );
            return this.options.useTransform ? (s = s[o.style.transform].split(")")[0].split(", "),
            t = +(s[12] || s[4]),
            i = +(s[13] || s[5])) : (t = +s.left.replace(/[^-\d.]/g, ""),
            i = +s.top.replace(/[^-\d.]/g, "")),
            {
                x: t,
                y: i
            }
        },
        _initIndicators: function() {
            function e(e) {
                if (o.indicators)
                    for (var t = o.indicators.length; t--; )
                        e.call(o.indicators[t])
            }
            var t, i = this.options.interactiveScrollbars, s = "string" != typeof this.options.scrollbars, r = [], o = this;
            this.indicators = [],
            this.options.scrollbars && (this.options.scrollY && (t = {
                el: a("v", i, this.options.scrollbars),
                interactive: i,
                defaultScrollbars: !0,
                customStyle: s,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenX: !1
            },
            this.wrapper.appendChild(t.el),
            r.push(t)),
            this.options.scrollX && (t = {
                el: a("h", i, this.options.scrollbars),
                interactive: i,
                defaultScrollbars: !0,
                customStyle: s,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenY: !1
            },
            this.wrapper.appendChild(t.el),
            r.push(t))),
            this.options.indicators && (r = r.concat(this.options.indicators));
            for (var l = r.length; l--; )
                this.indicators.push(new n(this,r[l]));
            this.options.fadeScrollbars && (this.on("scrollEnd", function() {
                e(function() {
                    this.fade()
                }
                )
            }
            ),
            this.on("scrollCancel", function() {
                e(function() {
                    this.fade()
                }
                )
            }
            ),
            this.on("scrollStart", function() {
                e(function() {
                    this.fade(1)
                }
                )
            }
            ),
            this.on("beforeScrollStart", function() {
                e(function() {
                    this.fade(1, !0)
                }
                )
            }
            )),
            this.on("refresh", function() {
                e(function() {
                    this.refresh()
                }
                )
            }
            ),
            this.on("destroy", function() {
                e(function() {
                    this.destroy()
                }
                ),
                delete this.indicators
            }
            )
        },
        _initWheel: function() {
            o.addEvent(this.wrapper, "wheel", this),
            o.addEvent(this.wrapper, "mousewheel", this),
            o.addEvent(this.wrapper, "DOMMouseScroll", this),
            this.on("destroy", function() {
                clearTimeout(this.wheelTimeout),
                this.wheelTimeout = null ,
                o.removeEvent(this.wrapper, "wheel", this),
                o.removeEvent(this.wrapper, "mousewheel", this),
                o.removeEvent(this.wrapper, "DOMMouseScroll", this)
            }
            )
        },
        _wheel: function(e) {
            if (this.enabled) {
                e.preventDefault();
                var t, s, a, n, r = this;
                if (void 0 === this.wheelTimeout && r._execEvent("scrollStart"),
                clearTimeout(this.wheelTimeout),
                this.wheelTimeout = setTimeout(function() {
                    r.options.snap || r._execEvent("scrollEnd"),
                    r.wheelTimeout = void 0
                }
                , 400),
                "deltaX" in e)
                    1 === e.deltaMode ? (t = -e.deltaX * this.options.mouseWheelSpeed,
                    s = -e.deltaY * this.options.mouseWheelSpeed) : (t = -e.deltaX,
                    s = -e.deltaY);
                else if ("wheelDeltaX" in e)
                    t = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed,
                    s = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                else if ("wheelDelta" in e)
                    t = s = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
                else {
                    if (!("detail" in e))
                        return;
                    t = s = -e.detail / 3 * this.options.mouseWheelSpeed
                }
                if (t *= this.options.invertWheelDirection,
                s *= this.options.invertWheelDirection,
                this.hasVerticalScroll || (t = s,
                s = 0),
                this.options.snap)
                    return a = this.currentPage.pageX,
                    n = this.currentPage.pageY,
                    t > 0 ? a-- : 0 > t && a++,
                    s > 0 ? n-- : 0 > s && n++,
                    void this.goToPage(a, n);
                a = this.x + i.round(this.hasHorizontalScroll ? t : 0),
                n = this.y + i.round(this.hasVerticalScroll ? s : 0),
                this.directionX = t > 0 ? -1 : 0 > t ? 1 : 0,
                this.directionY = s > 0 ? -1 : 0 > s ? 1 : 0,
                a > 0 ? a = 0 : a < this.maxScrollX && (a = this.maxScrollX),
                n > 0 ? n = 0 : n < this.maxScrollY && (n = this.maxScrollY),
                this.scrollTo(a, n, 0),
                this.options.probeType > 1 && this._execEvent("scroll")
            }
        },
        _initSnap: function() {
            this.currentPage = {},
            "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)),
            this.on("refresh", function() {
                var e, t, s, a, n, r, o = 0, l = 0, p = 0, c = this.options.snapStepX || this.wrapperWidth, d = this.options.snapStepY || this.wrapperHeight;
                if (this.pages = [],
                this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
                    if (this.options.snap === !0)
                        for (s = i.round(c / 2),
                        a = i.round(d / 2); p > -this.scrollerWidth; ) {
                            for (this.pages[o] = [],
                            e = 0,
                            n = 0; n > -this.scrollerHeight; )
                                this.pages[o][e] = {
                                    x: i.max(p, this.maxScrollX),
                                    y: i.max(n, this.maxScrollY),
                                    width: c,
                                    height: d,
                                    cx: p - s,
                                    cy: n - a
                                },
                                n -= d,
                                e++;
                            p -= c,
                            o++
                        }
                    else
                        for (r = this.options.snap,
                        e = r.length,
                        t = -1; e > o; o++)
                            (0 === o || r[o].offsetLeft <= r[o - 1].offsetLeft) && (l = 0,
                            t++),
                            this.pages[l] || (this.pages[l] = []),
                            p = i.max(-r[o].offsetLeft, this.maxScrollX),
                            n = i.max(-r[o].offsetTop, this.maxScrollY),
                            s = p - i.round(r[o].offsetWidth / 2),
                            a = n - i.round(r[o].offsetHeight / 2),
                            this.pages[l][t] = {
                                x: p,
                                y: n,
                                width: r[o].offsetWidth,
                                height: r[o].offsetHeight,
                                cx: s,
                                cy: a
                            },
                            p > this.maxScrollX && l++;
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0),
                    this.options.snapThreshold % 1 === 0 ? (this.snapThresholdX = this.options.snapThreshold,
                    this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = i.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold),
                    this.snapThresholdY = i.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
                }
            }
            ),
            this.on("flick", function() {
                var e = this.options.snapSpeed || i.max(i.max(i.min(i.abs(this.x - this.startX), 1e3), i.min(i.abs(this.y - this.startY), 1e3)), 300);
                this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, e)
            }
            )
        },
        _nearestSnap: function(e, t) {
            if (!this.pages.length)
                return {
                    x: 0,
                    y: 0,
                    pageX: 0,
                    pageY: 0
                };
            var s = 0
              , a = this.pages.length
              , n = 0;
            if (i.abs(e - this.absStartX) < this.snapThresholdX && i.abs(t - this.absStartY) < this.snapThresholdY)
                return this.currentPage;
            for (e > 0 ? e = 0 : e < this.maxScrollX && (e = this.maxScrollX),
            t > 0 ? t = 0 : t < this.maxScrollY && (t = this.maxScrollY); a > s; s++)
                if (e >= this.pages[s][0].cx) {
                    e = this.pages[s][0].x;
                    break
                }
            for (a = this.pages[s].length; a > n; n++)
                if (t >= this.pages[0][n].cy) {
                    t = this.pages[0][n].y;
                    break
                }
            return s == this.currentPage.pageX && (s += this.directionX,
            0 > s ? s = 0 : s >= this.pages.length && (s = this.pages.length - 1),
            e = this.pages[s][0].x),
            n == this.currentPage.pageY && (n += this.directionY,
            0 > n ? n = 0 : n >= this.pages[0].length && (n = this.pages[0].length - 1),
            t = this.pages[0][n].y),
            {
                x: e,
                y: t,
                pageX: s,
                pageY: n
            }
        },
        goToPage: function(e, t, s, a) {
            a = a || this.options.bounceEasing,
            e >= this.pages.length ? e = this.pages.length - 1 : 0 > e && (e = 0),
            t >= this.pages[e].length ? t = this.pages[e].length - 1 : 0 > t && (t = 0);
            var n = this.pages[e][t].x
              , r = this.pages[e][t].y;
            s = void 0 === s ? this.options.snapSpeed || i.max(i.max(i.min(i.abs(n - this.x), 1e3), i.min(i.abs(r - this.y), 1e3)), 300) : s,
            this.currentPage = {
                x: n,
                y: r,
                pageX: e,
                pageY: t
            },
            this.scrollTo(n, r, s, a)
        },
        next: function(e, t) {
            var i = this.currentPage.pageX
              , s = this.currentPage.pageY;
            i++,
            i >= this.pages.length && this.hasVerticalScroll && (i = 0,
            s++),
            this.goToPage(i, s, e, t)
        },
        prev: function(e, t) {
            var i = this.currentPage.pageX
              , s = this.currentPage.pageY;
            i--,
            0 > i && this.hasVerticalScroll && (i = 0,
            s--),
            this.goToPage(i, s, e, t)
        },
        _initKeys: function(t) {
            var i, s = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            if ("object" == typeof this.options.keyBindings)
                for (i in this.options.keyBindings)
                    "string" == typeof this.options.keyBindings[i] && (this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0));
            else
                this.options.keyBindings = {};
            for (i in s)
                this.options.keyBindings[i] = this.options.keyBindings[i] || s[i];
            o.addEvent(e, "keydown", this),
            this.on("destroy", function() {
                o.removeEvent(e, "keydown", this)
            }
            )
        },
        _key: function(e) {
            if (this.enabled) {
                var t, s = this.options.snap, a = s ? this.currentPage.pageX : this.x, n = s ? this.currentPage.pageY : this.y, r = o.getTime(), l = this.keyTime || 0, p = .25;
                switch (this.options.useTransition && this.isInTransition && (t = this.getComputedPosition(),
                this._translate(i.round(t.x), i.round(t.y)),
                this.isInTransition = !1),
                this.keyAcceleration = 200 > r - l ? i.min(this.keyAcceleration + p, 50) : 0,
                e.keyCode) {
                case this.options.keyBindings.pageUp:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? a += s ? 1 : this.wrapperWidth : n += s ? 1 : this.wrapperHeight;
                    break;
                case this.options.keyBindings.pageDown:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? a -= s ? 1 : this.wrapperWidth : n -= s ? 1 : this.wrapperHeight;
                    break;
                case this.options.keyBindings.end:
                    a = s ? this.pages.length - 1 : this.maxScrollX,
                    n = s ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    a = 0,
                    n = 0;
                    break;
                case this.options.keyBindings.left:
                    a += s ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.up:
                    n += s ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.right:
                    a -= s ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.down:
                    n -= s ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                default:
                    return
                }
                if (s)
                    return void this.goToPage(a, n);
                a > 0 ? (a = 0,
                this.keyAcceleration = 0) : a < this.maxScrollX && (a = this.maxScrollX,
                this.keyAcceleration = 0),
                n > 0 ? (n = 0,
                this.keyAcceleration = 0) : n < this.maxScrollY && (n = this.maxScrollY,
                this.keyAcceleration = 0),
                this.scrollTo(a, n, 0),
                this.keyTime = r
            }
        },
        _animate: function(e, t, i, s) {
            function a() {
                var h, u, f, m = o.getTime();
                return m >= d ? (n.isAnimating = !1,
                n._translate(e, t),
                void (n.resetPosition(n.options.bounceTime) || n._execEvent("scrollEnd"))) : (m = (m - c) / i,
                f = s(m),
                h = (e - l) * f + l,
                u = (t - p) * f + p,
                n._translate(h, u),
                n.isAnimating && r(a),
                void (3 == n.options.probeType && n._execEvent("scroll")))
            }
            var n = this
              , l = this.x
              , p = this.y
              , c = o.getTime()
              , d = c + i;
            this.isAnimating = !0,
            a()
        },
        handleEvent: function(e) {
            switch (e.type) {
            case "touchstart":
            case "pointerdown":
            case "MSPointerDown":
            case "mousedown":
                this._start(e);
                break;
            case "touchmove":
            case "pointermove":
            case "MSPointerMove":
            case "mousemove":
                this._move(e);
                break;
            case "touchend":
            case "pointerup":
            case "MSPointerUp":
            case "mouseup":
            case "touchcancel":
            case "pointercancel":
            case "MSPointerCancel":
            case "mousecancel":
                this._end(e);
                break;
            case "orientationchange":
            case "resize":
                this._resize();
                break;
            case "transitionend":
            case "webkitTransitionEnd":
            case "oTransitionEnd":
            case "MSTransitionEnd":
                this._transitionEnd(e);
                break;
            case "wheel":
            case "DOMMouseScroll":
            case "mousewheel":
                this._wheel(e);
                break;
            case "keydown":
                this._key(e);
                break;
            case "click":
                this.enabled && !e._constructed && (e.preventDefault(),
                e.stopPropagation())
            }
        }
    },
    n.prototype = {
        handleEvent: function(e) {
            switch (e.type) {
            case "touchstart":
            case "pointerdown":
            case "MSPointerDown":
            case "mousedown":
                this._start(e);
                break;
            case "touchmove":
            case "pointermove":
            case "MSPointerMove":
            case "mousemove":
                this._move(e);
                break;
            case "touchend":
            case "pointerup":
            case "MSPointerUp":
            case "mouseup":
            case "touchcancel":
            case "pointercancel":
            case "MSPointerCancel":
            case "mousecancel":
                this._end(e)
            }
        },
        destroy: function() {
            this.options.fadeScrollbars && (clearTimeout(this.fadeTimeout),
            this.fadeTimeout = null ),
            this.options.interactive && (o.removeEvent(this.indicator, "touchstart", this),
            o.removeEvent(this.indicator, o.prefixPointerEvent("pointerdown"), this),
            o.removeEvent(this.indicator, "mousedown", this),
            o.removeEvent(e, "touchmove", this),
            o.removeEvent(e, o.prefixPointerEvent("pointermove"), this),
            o.removeEvent(e, "mousemove", this),
            o.removeEvent(e, "touchend", this),
            o.removeEvent(e, o.prefixPointerEvent("pointerup"), this),
            o.removeEvent(e, "mouseup", this)),
            this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper)
        },
        _start: function(t) {
            var i = t.touches ? t.touches[0] : t;
            t.preventDefault(),
            t.stopPropagation(),
            this.transitionTime(),
            this.initiated = !0,
            this.moved = !1,
            this.lastPointX = i.pageX,
            this.lastPointY = i.pageY,
            this.startTime = o.getTime(),
            this.options.disableTouch || o.addEvent(e, "touchmove", this),
            this.options.disablePointer || o.addEvent(e, o.prefixPointerEvent("pointermove"), this),
            this.options.disableMouse || o.addEvent(e, "mousemove", this),
            this.scroller._execEvent("beforeScrollStart")
        },
        _move: function(e) {
            var t, i, s, a, n = e.touches ? e.touches[0] : e, r = o.getTime();
            this.moved || this.scroller._execEvent("scrollStart"),
            this.moved = !0,
            t = n.pageX - this.lastPointX,
            this.lastPointX = n.pageX,
            i = n.pageY - this.lastPointY,
            this.lastPointY = n.pageY,
            s = this.x + t,
            a = this.y + i,
            this._pos(s, a),
            1 == this.scroller.options.probeType && r - this.startTime > 300 ? (this.startTime = r,
            this.scroller._execEvent("scroll")) : this.scroller.options.probeType > 1 && this.scroller._execEvent("scroll"),
            e.preventDefault(),
            e.stopPropagation()
        },
        _end: function(t) {
            if (this.initiated) {
                if (this.initiated = !1,
                t.preventDefault(),
                t.stopPropagation(),
                o.removeEvent(e, "touchmove", this),
                o.removeEvent(e, o.prefixPointerEvent("pointermove"), this),
                o.removeEvent(e, "mousemove", this),
                this.scroller.options.snap) {
                    var s = this.scroller._nearestSnap(this.scroller.x, this.scroller.y)
                      , a = this.options.snapSpeed || i.max(i.max(i.min(i.abs(this.scroller.x - s.x), 1e3), i.min(i.abs(this.scroller.y - s.y), 1e3)), 300);
                    (this.scroller.x != s.x || this.scroller.y != s.y) && (this.scroller.directionX = 0,
                    this.scroller.directionY = 0,
                    this.scroller.currentPage = s,
                    this.scroller.scrollTo(s.x, s.y, a, this.scroller.options.bounceEasing))
                }
                this.moved && this.scroller._execEvent("scrollEnd")
            }
        },
        transitionTime: function(e) {
            e = e || 0;
            var t = o.style.transitionDuration;
            if (t && (this.indicatorStyle[t] = e + "ms",
            !e && o.isBadAndroid)) {
                this.indicatorStyle[t] = "0.0001ms";
                var i = this;
                r(function() {
                    "0.0001ms" === i.indicatorStyle[t] && (i.indicatorStyle[t] = "0s")
                }
                )
            }
        },
        transitionTimingFunction: function(e) {
            this.indicatorStyle[o.style.transitionTimingFunction] = e
        },
        refresh: function() {
            this.transitionTime(),
            this.options.listenX && !this.options.listenY ? this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.indicatorStyle.display = this.scroller.hasVerticalScroll ? "block" : "none" : this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none",
            this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (o.addClass(this.wrapper, "iScrollBothScrollbars"),
            o.removeClass(this.wrapper, "iScrollLoneScrollbar"),
            this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (o.removeClass(this.wrapper, "iScrollBothScrollbars"),
            o.addClass(this.wrapper, "iScrollLoneScrollbar"),
            this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px"));
            this.wrapper.offsetHeight;
            this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth,
            this.options.resize ? (this.indicatorWidth = i.max(i.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8),
            this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth,
            this.maxPosX = this.wrapperWidth - this.indicatorWidth,
            "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8,
            this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0,
            this.maxBoundaryX = this.maxPosX),
            this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX),
            this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight,
            this.options.resize ? (this.indicatorHeight = i.max(i.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8),
            this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight,
            this.maxPosY = this.wrapperHeight - this.indicatorHeight,
            "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8,
            this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0,
            this.maxBoundaryY = this.maxPosY),
            this.maxPosY = this.wrapperHeight - this.indicatorHeight,
            this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY),
            this.updatePosition()
        },
        updatePosition: function() {
            var e = this.options.listenX && i.round(this.sizeRatioX * this.scroller.x) || 0
              , t = this.options.listenY && i.round(this.sizeRatioY * this.scroller.y) || 0;
            this.options.ignoreBoundaries || (e < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = i.max(this.indicatorWidth + e, 8),
            this.indicatorStyle.width = this.width + "px"),
            e = this.minBoundaryX) : e > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = i.max(this.indicatorWidth - (e - this.maxPosX), 8),
            this.indicatorStyle.width = this.width + "px",
            e = this.maxPosX + this.indicatorWidth - this.width) : e = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth,
            this.indicatorStyle.width = this.width + "px"),
            t < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = i.max(this.indicatorHeight + 3 * t, 8),
            this.indicatorStyle.height = this.height + "px"),
            t = this.minBoundaryY) : t > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = i.max(this.indicatorHeight - 3 * (t - this.maxPosY), 8),
            this.indicatorStyle.height = this.height + "px",
            t = this.maxPosY + this.indicatorHeight - this.height) : t = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight,
            this.indicatorStyle.height = this.height + "px")),
            this.x = e,
            this.y = t,
            this.scroller.options.useTransform ? this.indicatorStyle[o.style.transform] = "translate(" + e + "px," + t + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = e + "px",
            this.indicatorStyle.top = t + "px")
        },
        _pos: function(e, t) {
            0 > e ? e = 0 : e > this.maxPosX && (e = this.maxPosX),
            0 > t ? t = 0 : t > this.maxPosY && (t = this.maxPosY),
            e = this.options.listenX ? i.round(e / this.sizeRatioX) : this.scroller.x,
            t = this.options.listenY ? i.round(t / this.sizeRatioY) : this.scroller.y,
            this.scroller.scrollTo(e, t)
        },
        fade: function(e, t) {
            if (!t || this.visible) {
                clearTimeout(this.fadeTimeout),
                this.fadeTimeout = null ;
                var i = e ? 250 : 500
                  , s = e ? 0 : 300;
                e = e ? "1" : "0",
                this.wrapperStyle[o.style.transitionDuration] = i + "ms",
                this.fadeTimeout = setTimeout(function(e) {
                    this.wrapperStyle.opacity = e,
                    this.visible = +e
                }
                .bind(this, e), s)
            }
        }
    },
    s.utils = o,
    "undefined" != typeof module && module.exports ? module.exports = s : "function" == typeof define && define.amd ? define(function() {
        return s
    }
    ) : e.IScroll = s
}
(window, document, Math),
!function() {
    "use strict";
    function e(e) {
        e.fn.swiper = function(t) {
            var s;
            return e(this).each(function() {
                var e = new i(this,t);
                s || (s = e)
            }
            ),
            s
        }
    }
    var t, i = function(e, s) {
        function a(e) {
            return Math.floor(e)
        }
        function n() {
            y.autoplayTimeoutId = setTimeout(function() {
                y.params.loop ? (y.fixLoop(),
                y._slideNext(),
                y.emit("onAutoplay", y)) : y.isEnd ? s.autoplayStopOnLast ? y.stopAutoplay() : (y._slideTo(0),
                y.emit("onAutoplay", y)) : (y._slideNext(),
                y.emit("onAutoplay", y))
            }
            , y.params.autoplay)
        }
        function r(e, i) {
            var s = t(e.target);
            if (!s.is(i))
                if ("string" == typeof i)
                    s = s.parents(i);
                else if (i.nodeType) {
                    var a;
                    return s.parents().each(function(e, t) {
                        t === i && (a = i)
                    }
                    ),
                    a ? i : void 0
                }
            return 0 !== s.length ? s[0] : void 0
        }
        function o(e, t) {
            t = t || {};
            var i = window.MutationObserver || window.WebkitMutationObserver
              , s = new i(function(e) {
                e.forEach(function(e) {
                    y.onResize(!0),
                    y.emit("onObserverUpdate", y, e)
                }
                )
            }
            );
            s.observe(e, {
                attributes: "undefined" == typeof t.attributes ? !0 : t.attributes,
                childList: "undefined" == typeof t.childList ? !0 : t.childList,
                characterData: "undefined" == typeof t.characterData ? !0 : t.characterData
            }),
            y.observers.push(s)
        }
        function l(e) {
            e.originalEvent && (e = e.originalEvent);
            var t = e.keyCode || e.charCode;
            if (!y.params.allowSwipeToNext && (y.isHorizontal() && 39 === t || !y.isHorizontal() && 40 === t))
                return !1;
            if (!y.params.allowSwipeToPrev && (y.isHorizontal() && 37 === t || !y.isHorizontal() && 38 === t))
                return !1;
            if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
                if (37 === t || 39 === t || 38 === t || 40 === t) {
                    var i = !1;
                    if (y.container.parents(".swiper-slide").length > 0 && 0 === y.container.parents(".swiper-slide-active").length)
                        return;
                    var s = {
                        left: window.pageXOffset,
                        top: window.pageYOffset
                    }
                      , a = window.innerWidth
                      , n = window.innerHeight
                      , r = y.container.offset();
                    y.rtl && (r.left = r.left - y.container[0].scrollLeft);
                    for (var o = [[r.left, r.top], [r.left + y.width, r.top], [r.left, r.top + y.height], [r.left + y.width, r.top + y.height]], l = 0; l < o.length; l++) {
                        var p = o[l];
                        p[0] >= s.left && p[0] <= s.left + a && p[1] >= s.top && p[1] <= s.top + n && (i = !0)
                    }
                    if (!i)
                        return
                }
                y.isHorizontal() ? ((37 === t || 39 === t) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1),
                (39 === t && !y.rtl || 37 === t && y.rtl) && y.slideNext(),
                (37 === t && !y.rtl || 39 === t && y.rtl) && y.slidePrev()) : ((38 === t || 40 === t) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1),
                40 === t && y.slideNext(),
                38 === t && y.slidePrev())
            }
        }
        function p(e) {
            e.originalEvent && (e = e.originalEvent);
            var t = y.mousewheel.event
              , i = 0
              , s = y.rtl ? -1 : 1;
            if ("mousewheel" === t)
                if (y.params.mousewheelForceToAxis)
                    if (y.isHorizontal()) {
                        if (!(Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)))
                            return;
                        i = e.wheelDeltaX * s
                    } else {
                        if (!(Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)))
                            return;
                        i = e.wheelDeltaY
                    }
                else
                    i = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? -e.wheelDeltaX * s : -e.wheelDeltaY;
            else if ("DOMMouseScroll" === t)
                i = -e.detail;
            else if ("wheel" === t)
                if (y.params.mousewheelForceToAxis)
                    if (y.isHorizontal()) {
                        if (!(Math.abs(e.deltaX) > Math.abs(e.deltaY)))
                            return;
                        i = -e.deltaX * s
                    } else {
                        if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX)))
                            return;
                        i = -e.deltaY
                    }
                else
                    i = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX * s : -e.deltaY;
            if (0 !== i) {
                if (y.params.mousewheelInvert && (i = -i),
                y.params.freeMode) {
                    var a = y.getWrapperTranslate() + i * y.params.mousewheelSensitivity
                      , n = y.isBeginning
                      , r = y.isEnd;
                    if (a >= y.minTranslate() && (a = y.minTranslate()),
                    a <= y.maxTranslate() && (a = y.maxTranslate()),
                    y.setWrapperTransition(0),
                    y.setWrapperTranslate(a),
                    y.updateProgress(),
                    y.updateActiveIndex(),
                    (!n && y.isBeginning || !r && y.isEnd) && y.updateClasses(),
                    y.params.freeModeSticky ? (clearTimeout(y.mousewheel.timeout),
                    y.mousewheel.timeout = setTimeout(function() {
                        y.slideReset()
                    }
                    , 300)) : y.params.lazyLoading && y.lazy && y.lazy.load(),
                    0 === a || a === y.maxTranslate())
                        return
                } else {
                    if ((new window.Date).getTime() - y.mousewheel.lastScrollTime > 60)
                        if (0 > i)
                            if (y.isEnd && !y.params.loop || y.animating) {
                                if (y.params.mousewheelReleaseOnEdges)
                                    return !0
                            } else
                                y.slideNext();
                        else if (y.isBeginning && !y.params.loop || y.animating) {
                            if (y.params.mousewheelReleaseOnEdges)
                                return !0
                        } else
                            y.slidePrev();
                    y.mousewheel.lastScrollTime = (new window.Date).getTime()
                }
                return y.params.autoplay && y.stopAutoplay(),
                e.preventDefault ? e.preventDefault() : e.returnValue = !1,
                !1
            }
        }
        function c(e, i) {
            e = t(e);
            var s, a, n, r = y.rtl ? -1 : 1;
            s = e.attr("data-swiper-parallax") || "0",
            a = e.attr("data-swiper-parallax-x"),
            n = e.attr("data-swiper-parallax-y"),
            a || n ? (a = a || "0",
            n = n || "0") : y.isHorizontal() ? (a = s,
            n = "0") : (n = s,
            a = "0"),
            a = a.indexOf("%") >= 0 ? parseInt(a, 10) * i * r + "%" : a * i * r + "px",
            n = n.indexOf("%") >= 0 ? parseInt(n, 10) * i + "%" : n * i + "px",
            e.transform("translate3d(" + a + ", " + n + ",0px)")
        }
        function d(e) {
            return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e),
            e
        }
        if (!(this instanceof i))
            return new i(e,s);
        var h = {
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            autoplay: !1,
            autoplayDisableOnInteraction: !0,
            autoplayStopOnLast: !1,
            iOSEdgeSwipeDetection: !1,
            iOSEdgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: .02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: !0
            },
            flip: {
                slideShadows: !0,
                limitRotation: !0
            },
            cube: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            },
            fade: {
                crossFade: !1
            },
            parallax: !1,
            scrollbar: null ,
            scrollbarHide: !0,
            scrollbarDraggable: !1,
            scrollbarSnapOnRelease: !1,
            keyboardControl: !1,
            mousewheelControl: !1,
            mousewheelReleaseOnEdges: !1,
            mousewheelInvert: !1,
            mousewheelForceToAxis: !1,
            mousewheelSensitivity: 1,
            hashnav: !1,
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            centeredSlides: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            onlyExternal: !1,
            threshold: 0,
            touchMoveStopPropagation: !0,
            uniqueNavElements: !0,
            pagination: null ,
            paginationElement: "span",
            paginationClickable: !1,
            paginationHide: !1,
            paginationBulletRender: null ,
            paginationProgressRender: null ,
            paginationFractionRender: null ,
            paginationCustomRender: null ,
            paginationType: "bullets",
            resistance: !0,
            resistanceRatio: .85,
            nextButton: null ,
            prevButton: null ,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            lazyLoading: !1,
            lazyLoadingInPrevNext: !1,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null ,
            control: void 0,
            controlInverse: !1,
            controlBy: "slide",
            allowSwipeToPrev: !0,
            allowSwipeToNext: !0,
            swipeHandler: null ,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            slideClass: "swiper-slide",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            buttonDisabledClass: "swiper-button-disabled",
            paginationCurrentClass: "swiper-pagination-current",
            paginationTotalClass: "swiper-pagination-total",
            paginationHiddenClass: "swiper-pagination-hidden",
            paginationProgressbarClass: "swiper-pagination-progressbar",
            observer: !1,
            observeParents: !1,
            a11y: !1,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
            paginationBulletMessage: "Go to slide {{index}}",
            runCallbacksOnInit: !0
        }
          , u = s && s.virtualTranslate;
        s = s || {};
        var f = {};
        for (var m in s)
            if ("object" != typeof s[m] || null  === s[m] || s[m].nodeType || s[m] === window || s[m] === document || "undefined" != typeof Dom7 && s[m] instanceof Dom7 || "undefined" != typeof jQuery && s[m] instanceof jQuery)
                f[m] = s[m];
            else {
                f[m] = {};
                for (var g in s[m])
                    f[m][g] = s[m][g]
            }
        for (var v in h)
            if ("undefined" == typeof s[v])
                s[v] = h[v];
            else if ("object" == typeof s[v])
                for (var w in h[v])
                    "undefined" == typeof s[v][w] && (s[v][w] = h[v][w]);
        var y = this;
        if (y.params = s,
        y.originalParams = f,
        y.classNames = [],
        "undefined" != typeof t && "undefined" != typeof Dom7 && (t = Dom7),
        ("undefined" != typeof t || (t = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7)) && (y.$ = t,
        y.currentBreakpoint = void 0,
        y.getActiveBreakpoint = function() {
            if (!y.params.breakpoints)
                return !1;
            var e, t = !1, i = [];
            for (e in y.params.breakpoints)
                y.params.breakpoints.hasOwnProperty(e) && i.push(e);
            i.sort(function(e, t) {
                return parseInt(e, 10) > parseInt(t, 10)
            }
            );
            for (var s = 0; s < i.length; s++)
                e = i[s],
                e >= window.innerWidth && !t && (t = e);
            return t || "max"
        }
        ,
        y.setBreakpoint = function() {
            var e = y.getActiveBreakpoint();
            if (e && y.currentBreakpoint !== e) {
                var t = e in y.params.breakpoints ? y.params.breakpoints[e] : y.originalParams
                  , i = y.params.loop && t.slidesPerView !== y.params.slidesPerView;
                for (var s in t)
                    y.params[s] = t[s];
                y.currentBreakpoint = e,
                i && y.destroyLoop && y.reLoop(!0)
            }
        }
        ,
        y.params.breakpoints && y.setBreakpoint(),
        y.container = t(e),
        0 !== y.container.length)) {
            if (y.container.length > 1) {
                var x = [];
                return y.container.each(function() {
                    x.push(new i(this,s))
                }
                ),
                x
            }
            y.container[0].swiper = y,
            y.container.data("swiper", y),
            y.classNames.push("swiper-container-" + y.params.direction),
            y.params.freeMode && y.classNames.push("swiper-container-free-mode"),
            y.support.flexbox || (y.classNames.push("swiper-container-no-flexbox"),
            y.params.slidesPerColumn = 1),
            y.params.autoHeight && y.classNames.push("swiper-container-autoheight"),
            (y.params.parallax || y.params.watchSlidesVisibility) && (y.params.watchSlidesProgress = !0),
            ["cube", "coverflow", "flip"].indexOf(y.params.effect) >= 0 && (y.support.transforms3d ? (y.params.watchSlidesProgress = !0,
            y.classNames.push("swiper-container-3d")) : y.params.effect = "slide"),
            "slide" !== y.params.effect && y.classNames.push("swiper-container-" + y.params.effect),
            "cube" === y.params.effect && (y.params.resistanceRatio = 0,
            y.params.slidesPerView = 1,
            y.params.slidesPerColumn = 1,
            y.params.slidesPerGroup = 1,
            y.params.centeredSlides = !1,
            y.params.spaceBetween = 0,
            y.params.virtualTranslate = !0,
            y.params.setWrapperSize = !1),
            ("fade" === y.params.effect || "flip" === y.params.effect) && (y.params.slidesPerView = 1,
            y.params.slidesPerColumn = 1,
            y.params.slidesPerGroup = 1,
            y.params.watchSlidesProgress = !0,
            y.params.spaceBetween = 0,
            y.params.setWrapperSize = !1,
            "undefined" == typeof u && (y.params.virtualTranslate = !0)),
            y.params.grabCursor && y.support.touch && (y.params.grabCursor = !1),
            y.wrapper = y.container.children("." + y.params.wrapperClass),
            y.params.pagination && (y.paginationContainer = t(y.params.pagination),
            y.params.uniqueNavElements && "string" == typeof y.params.pagination && y.paginationContainer.length > 1 && 1 === y.container.find(y.params.pagination).length && (y.paginationContainer = y.container.find(y.params.pagination)),
            "bullets" === y.params.paginationType && y.params.paginationClickable ? y.paginationContainer.addClass("swiper-pagination-clickable") : y.params.paginationClickable = !1,
            y.paginationContainer.addClass("swiper-pagination-" + y.params.paginationType)),
            (y.params.nextButton || y.params.prevButton) && (y.params.nextButton && (y.nextButton = t(y.params.nextButton),
            y.params.uniqueNavElements && "string" == typeof y.params.nextButton && y.nextButton.length > 1 && 1 === y.container.find(y.params.nextButton).length && (y.nextButton = y.container.find(y.params.nextButton))),
            y.params.prevButton && (y.prevButton = t(y.params.prevButton),
            y.params.uniqueNavElements && "string" == typeof y.params.prevButton && y.prevButton.length > 1 && 1 === y.container.find(y.params.prevButton).length && (y.prevButton = y.container.find(y.params.prevButton)))),
            y.isHorizontal = function() {
                return "horizontal" === y.params.direction
            }
            ,
            y.rtl = y.isHorizontal() && ("rtl" === y.container[0].dir.toLowerCase() || "rtl" === y.container.css("direction")),
            y.rtl && y.classNames.push("swiper-container-rtl"),
            y.rtl && (y.wrongRTL = "-webkit-box" === y.wrapper.css("display")),
            y.params.slidesPerColumn > 1 && y.classNames.push("swiper-container-multirow"),
            y.device.android && y.classNames.push("swiper-container-android"),
            y.container.addClass(y.classNames.join(" ")),
            y.translate = 0,
            y.progress = 0,
            y.velocity = 0,
            y.lockSwipeToNext = function() {
                y.params.allowSwipeToNext = !1
            }
            ,
            y.lockSwipeToPrev = function() {
                y.params.allowSwipeToPrev = !1
            }
            ,
            y.lockSwipes = function() {
                y.params.allowSwipeToNext = y.params.allowSwipeToPrev = !1
            }
            ,
            y.unlockSwipeToNext = function() {
                y.params.allowSwipeToNext = !0
            }
            ,
            y.unlockSwipeToPrev = function() {
                y.params.allowSwipeToPrev = !0
            }
            ,
            y.unlockSwipes = function() {
                y.params.allowSwipeToNext = y.params.allowSwipeToPrev = !0
            }
            ,
            y.params.grabCursor && (y.container[0].style.cursor = "move",
            y.container[0].style.cursor = "-webkit-grab",
            y.container[0].style.cursor = "-moz-grab",
            y.container[0].style.cursor = "grab"),
            y.imagesToLoad = [],
            y.imagesLoaded = 0,
            y.loadImage = function(e, t, i, s, a) {
                function n() {
                    a && a()
                }
                var r;
                e.complete && s ? n() : t ? (r = new window.Image,
                r.onload = n,
                r.onerror = n,
                i && (r.srcset = i),
                t && (r.src = t)) : n()
            }
            ,
            y.preloadImages = function() {
                function e() {
                    "undefined" != typeof y && null  !== y && (void 0 !== y.imagesLoaded && y.imagesLoaded++,
                    y.imagesLoaded === y.imagesToLoad.length && (y.params.updateOnImagesReady && y.update(),
                    y.emit("onImagesReady", y)))
                }
                y.imagesToLoad = y.container.find("img");
                for (var t = 0; t < y.imagesToLoad.length; t++)
                    y.loadImage(y.imagesToLoad[t], y.imagesToLoad[t].currentSrc || y.imagesToLoad[t].getAttribute("src"), y.imagesToLoad[t].srcset || y.imagesToLoad[t].getAttribute("srcset"), !0, e)
            }
            ,
            y.autoplayTimeoutId = void 0,
            y.autoplaying = !1,
            y.autoplayPaused = !1,
            y.startAutoplay = function() {
                return "undefined" != typeof y.autoplayTimeoutId ? !1 : y.params.autoplay ? y.autoplaying ? !1 : (y.autoplaying = !0,
                y.emit("onAutoplayStart", y),
                void n()) : !1
            }
            ,
            y.stopAutoplay = function(e) {
                y.autoplayTimeoutId && (y.autoplayTimeoutId && clearTimeout(y.autoplayTimeoutId),
                y.autoplaying = !1,
                y.autoplayTimeoutId = void 0,
                y.emit("onAutoplayStop", y))
            }
            ,
            y.pauseAutoplay = function(e) {
                y.autoplayPaused || (y.autoplayTimeoutId && clearTimeout(y.autoplayTimeoutId),
                y.autoplayPaused = !0,
                0 === e ? (y.autoplayPaused = !1,
                n()) : y.wrapper.transitionEnd(function() {
                    y && (y.autoplayPaused = !1,
                    y.autoplaying ? n() : y.stopAutoplay())
                }
                ))
            }
            ,
            y.minTranslate = function() {
                return -y.snapGrid[0]
            }
            ,
            y.maxTranslate = function() {
                return -y.snapGrid[y.snapGrid.length - 1]
            }
            ,
            y.updateAutoHeight = function() {
                var e = y.slides.eq(y.activeIndex)[0];
                if ("undefined" != typeof e) {
                    var t = e.offsetHeight;
                    t && y.wrapper.css("height", t + "px")
                }
            }
            ,
            y.updateContainerSize = function() {
                var e, t;
                e = "undefined" != typeof y.params.width ? y.params.width : y.container[0].clientWidth,
                t = "undefined" != typeof y.params.height ? y.params.height : y.container[0].clientHeight,
                0 === e && y.isHorizontal() || 0 === t && !y.isHorizontal() || (e = e - parseInt(y.container.css("padding-left"), 10) - parseInt(y.container.css("padding-right"), 10),
                t = t - parseInt(y.container.css("padding-top"), 10) - parseInt(y.container.css("padding-bottom"), 10),
                y.width = e,
                y.height = t,
                y.size = y.isHorizontal() ? y.width : y.height)
            }
            ,
            y.updateSlidesSize = function() {
                y.slides = y.wrapper.children("." + y.params.slideClass),
                y.snapGrid = [],
                y.slidesGrid = [],
                y.slidesSizesGrid = [];
                var e, t = y.params.spaceBetween, i = -y.params.slidesOffsetBefore, s = 0, n = 0;
                if ("undefined" != typeof y.size) {
                    "string" == typeof t && t.indexOf("%") >= 0 && (t = parseFloat(t.replace("%", "")) / 100 * y.size),
                    y.virtualSize = -t,
                    y.rtl ? y.slides.css({
                        marginLeft: "",
                        marginTop: ""
                    }) : y.slides.css({
                        marginRight: "",
                        marginBottom: ""
                    });
                    var r;
                    y.params.slidesPerColumn > 1 && (r = Math.floor(y.slides.length / y.params.slidesPerColumn) === y.slides.length / y.params.slidesPerColumn ? y.slides.length : Math.ceil(y.slides.length / y.params.slidesPerColumn) * y.params.slidesPerColumn,
                    "auto" !== y.params.slidesPerView && "row" === y.params.slidesPerColumnFill && (r = Math.max(r, y.params.slidesPerView * y.params.slidesPerColumn)));
                    var o, l = y.params.slidesPerColumn, p = r / l, c = p - (y.params.slidesPerColumn * p - y.slides.length);
                    for (e = 0; e < y.slides.length; e++) {
                        o = 0;
                        var d = y.slides.eq(e);
                        if (y.params.slidesPerColumn > 1) {
                            var h, u, f;
                            "column" === y.params.slidesPerColumnFill ? (u = Math.floor(e / l),
                            f = e - u * l,
                            (u > c || u === c && f === l - 1) && ++f >= l && (f = 0,
                            u++),
                            h = u + f * r / l,
                            d.css({
                                "-webkit-box-ordinal-group": h,
                                "-moz-box-ordinal-group": h,
                                "-ms-flex-order": h,
                                "-webkit-order": h,
                                order: h
                            })) : (f = Math.floor(e / p),
                            u = e - f * p),
                            d.css({
                                "margin-top": 0 !== f && y.params.spaceBetween && y.params.spaceBetween + "px"
                            }).attr("data-swiper-column", u).attr("data-swiper-row", f)
                        }
                        "none" !== d.css("display") && ("auto" === y.params.slidesPerView ? (o = y.isHorizontal() ? d.outerWidth(!0) : d.outerHeight(!0),
                        y.params.roundLengths && (o = a(o))) : (o = (y.size - (y.params.slidesPerView - 1) * t) / y.params.slidesPerView,
                        y.params.roundLengths && (o = a(o)),
                        y.isHorizontal() ? y.slides[e].style.width = o + "px" : y.slides[e].style.height = o + "px"),
                        y.slides[e].swiperSlideSize = o,
                        y.slidesSizesGrid.push(o),
                        y.params.centeredSlides ? (i = i + o / 2 + s / 2 + t,
                        0 === e && (i = i - y.size / 2 - t),
                        Math.abs(i) < .001 && (i = 0),
                        n % y.params.slidesPerGroup === 0 && y.snapGrid.push(i),
                        y.slidesGrid.push(i)) : (n % y.params.slidesPerGroup === 0 && y.snapGrid.push(i),
                        y.slidesGrid.push(i),
                        i = i + o + t),
                        y.virtualSize += o + t,
                        s = o,
                        n++)
                    }
                    y.virtualSize = Math.max(y.virtualSize, y.size) + y.params.slidesOffsetAfter;
                    var m;
                    if (y.rtl && y.wrongRTL && ("slide" === y.params.effect || "coverflow" === y.params.effect) && y.wrapper.css({
                        width: y.virtualSize + y.params.spaceBetween + "px"
                    }),
                    (!y.support.flexbox || y.params.setWrapperSize) && (y.isHorizontal() ? y.wrapper.css({
                        width: y.virtualSize + y.params.spaceBetween + "px"
                    }) : y.wrapper.css({
                        height: y.virtualSize + y.params.spaceBetween + "px"
                    })),
                    y.params.slidesPerColumn > 1 && (y.virtualSize = (o + y.params.spaceBetween) * r,
                    y.virtualSize = Math.ceil(y.virtualSize / y.params.slidesPerColumn) - y.params.spaceBetween,
                    y.wrapper.css({
                        width: y.virtualSize + y.params.spaceBetween + "px"
                    }),
                    y.params.centeredSlides)) {
                        for (m = [],
                        e = 0; e < y.snapGrid.length; e++)
                            y.snapGrid[e] < y.virtualSize + y.snapGrid[0] && m.push(y.snapGrid[e]);
                        y.snapGrid = m
                    }
                    if (!y.params.centeredSlides) {
                        for (m = [],
                        e = 0; e < y.snapGrid.length; e++)
                            y.snapGrid[e] <= y.virtualSize - y.size && m.push(y.snapGrid[e]);
                        y.snapGrid = m,
                        Math.floor(y.virtualSize - y.size) - Math.floor(y.snapGrid[y.snapGrid.length - 1]) > 1 && y.snapGrid.push(y.virtualSize - y.size)
                    }
                    0 === y.snapGrid.length && (y.snapGrid = [0]),
                    0 !== y.params.spaceBetween && (y.isHorizontal() ? y.rtl ? y.slides.css({
                        marginLeft: t + "px"
                    }) : y.slides.css({
                        marginRight: t + "px"
                    }) : y.slides.css({
                        marginBottom: t + "px"
                    })),
                    y.params.watchSlidesProgress && y.updateSlidesOffset()
                }
            }
            ,
            y.updateSlidesOffset = function() {
                for (var e = 0; e < y.slides.length; e++)
                    y.slides[e].swiperSlideOffset = y.isHorizontal() ? y.slides[e].offsetLeft : y.slides[e].offsetTop
            }
            ,
            y.updateSlidesProgress = function(e) {
                if ("undefined" == typeof e && (e = y.translate || 0),
                0 !== y.slides.length) {
                    "undefined" == typeof y.slides[0].swiperSlideOffset && y.updateSlidesOffset();
                    var t = -e;
                    y.rtl && (t = e),
                    y.slides.removeClass(y.params.slideVisibleClass);
                    for (var i = 0; i < y.slides.length; i++) {
                        var s = y.slides[i]
                          , a = (t - s.swiperSlideOffset) / (s.swiperSlideSize + y.params.spaceBetween);
                        if (y.params.watchSlidesVisibility) {
                            var n = -(t - s.swiperSlideOffset)
                              , r = n + y.slidesSizesGrid[i]
                              , o = n >= 0 && n < y.size || r > 0 && r <= y.size || 0 >= n && r >= y.size;
                            o && y.slides.eq(i).addClass(y.params.slideVisibleClass)
                        }
                        s.progress = y.rtl ? -a : a
                    }
                }
            }
            ,
            y.updateProgress = function(e) {
                "undefined" == typeof e && (e = y.translate || 0);
                var t = y.maxTranslate() - y.minTranslate()
                  , i = y.isBeginning
                  , s = y.isEnd;
                0 === t ? (y.progress = 0,
                y.isBeginning = y.isEnd = !0) : (y.progress = (e - y.minTranslate()) / t,
                y.isBeginning = y.progress <= 0,
                y.isEnd = y.progress >= 1),
                y.isBeginning && !i && y.emit("onReachBeginning", y),
                y.isEnd && !s && y.emit("onReachEnd", y),
                y.params.watchSlidesProgress && y.updateSlidesProgress(e),
                y.emit("onProgress", y, y.progress)
            }
            ,
            y.updateActiveIndex = function() {
                var e, t, i, s = y.rtl ? y.translate : -y.translate;
                for (t = 0; t < y.slidesGrid.length; t++)
                    "undefined" != typeof y.slidesGrid[t + 1] ? s >= y.slidesGrid[t] && s < y.slidesGrid[t + 1] - (y.slidesGrid[t + 1] - y.slidesGrid[t]) / 2 ? e = t : s >= y.slidesGrid[t] && s < y.slidesGrid[t + 1] && (e = t + 1) : s >= y.slidesGrid[t] && (e = t);
                (0 > e || "undefined" == typeof e) && (e = 0),
                i = Math.floor(e / y.params.slidesPerGroup),
                i >= y.snapGrid.length && (i = y.snapGrid.length - 1),
                e !== y.activeIndex && (y.snapIndex = i,
                y.previousIndex = y.activeIndex,
                y.activeIndex = e,
                y.updateClasses())
            }
            ,
            y.updateClasses = function() {
                y.slides.removeClass(y.params.slideActiveClass + " " + y.params.slideNextClass + " " + y.params.slidePrevClass);
                var e = y.slides.eq(y.activeIndex);
                e.addClass(y.params.slideActiveClass);
                var i = e.next("." + y.params.slideClass).addClass(y.params.slideNextClass);
                y.params.loop && 0 === i.length && y.slides.eq(0).addClass(y.params.slideNextClass);
                var s = e.prev("." + y.params.slideClass).addClass(y.params.slidePrevClass);
                if (y.params.loop && 0 === s.length && y.slides.eq(-1).addClass(y.params.slidePrevClass),
                y.paginationContainer && y.paginationContainer.length > 0) {
                    var a, n = y.params.loop ? Math.ceil((y.slides.length - 2 * y.loopedSlides) / y.params.slidesPerGroup) : y.snapGrid.length;
                    if (y.params.loop ? (a = Math.ceil((y.activeIndex - y.loopedSlides) / y.params.slidesPerGroup),
                    a > y.slides.length - 1 - 2 * y.loopedSlides && (a -= y.slides.length - 2 * y.loopedSlides),
                    a > n - 1 && (a -= n),
                    0 > a && "bullets" !== y.params.paginationType && (a = n + a)) : a = "undefined" != typeof y.snapIndex ? y.snapIndex : y.activeIndex || 0,
                    "bullets" === y.params.paginationType && y.bullets && y.bullets.length > 0 && (y.bullets.removeClass(y.params.bulletActiveClass),
                    y.paginationContainer.length > 1 ? y.bullets.each(function() {
                        t(this).index() === a && t(this).addClass(y.params.bulletActiveClass)
                    }
                    ) : y.bullets.eq(a).addClass(y.params.bulletActiveClass)),
                    "fraction" === y.params.paginationType && (y.paginationContainer.find("." + y.params.paginationCurrentClass).text(a + 1),
                    y.paginationContainer.find("." + y.params.paginationTotalClass).text(n)),
                    "progress" === y.params.paginationType) {
                        var r = (a + 1) / n
                          , o = r
                          , l = 1;
                        y.isHorizontal() || (l = r,
                        o = 1),
                        y.paginationContainer.find("." + y.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + o + ") scaleY(" + l + ")").transition(y.params.speed)
                    }
                    "custom" === y.params.paginationType && y.params.paginationCustomRender && (y.paginationContainer.html(y.params.paginationCustomRender(y, a + 1, n)),
                    y.emit("onPaginationRendered", y, y.paginationContainer[0]))
                }
                y.params.loop || (y.params.prevButton && y.prevButton && y.prevButton.length > 0 && (y.isBeginning ? (y.prevButton.addClass(y.params.buttonDisabledClass),
                y.params.a11y && y.a11y && y.a11y.disable(y.prevButton)) : (y.prevButton.removeClass(y.params.buttonDisabledClass),
                y.params.a11y && y.a11y && y.a11y.enable(y.prevButton))),
                y.params.nextButton && y.nextButton && y.nextButton.length > 0 && (y.isEnd ? (y.nextButton.addClass(y.params.buttonDisabledClass),
                y.params.a11y && y.a11y && y.a11y.disable(y.nextButton)) : (y.nextButton.removeClass(y.params.buttonDisabledClass),
                y.params.a11y && y.a11y && y.a11y.enable(y.nextButton))))
            }
            ,
            y.updatePagination = function() {
                if (y.params.pagination && y.paginationContainer && y.paginationContainer.length > 0) {
                    var e = "";
                    if ("bullets" === y.params.paginationType) {
                        for (var t = y.params.loop ? Math.ceil((y.slides.length - 2 * y.loopedSlides) / y.params.slidesPerGroup) : y.snapGrid.length, i = 0; t > i; i++)
                            e += y.params.paginationBulletRender ? y.params.paginationBulletRender(i, y.params.bulletClass) : "<" + y.params.paginationElement + ' class="' + y.params.bulletClass + '"></' + y.params.paginationElement + ">";
                        y.paginationContainer.html(e),
                        y.bullets = y.paginationContainer.find("." + y.params.bulletClass),
                        y.params.paginationClickable && y.params.a11y && y.a11y && y.a11y.initPagination()
                    }
                    "fraction" === y.params.paginationType && (e = y.params.paginationFractionRender ? y.params.paginationFractionRender(y, y.params.paginationCurrentClass, y.params.paginationTotalClass) : '<span class="' + y.params.paginationCurrentClass + '"></span> / <span class="' + y.params.paginationTotalClass + '"></span>',
                    y.paginationContainer.html(e)),
                    "progress" === y.params.paginationType && (e = y.params.paginationProgressRender ? y.params.paginationProgressRender(y, y.params.paginationProgressbarClass) : '<span class="' + y.params.paginationProgressbarClass + '"></span>',
                    y.paginationContainer.html(e)),
                    "custom" !== y.params.paginationType && y.emit("onPaginationRendered", y, y.paginationContainer[0])
                }
            }
            ,
            y.update = function(e) {
                function t() {
                    s = Math.min(Math.max(y.translate, y.maxTranslate()), y.minTranslate()),
                    y.setWrapperTranslate(s),
                    y.updateActiveIndex(),
                    y.updateClasses()
                }
                if (y.updateContainerSize(),
                y.updateSlidesSize(),
                y.updateProgress(),
                y.updatePagination(),
                y.updateClasses(),
                y.params.scrollbar && y.scrollbar && y.scrollbar.set(),
                e) {
                    var i, s;
                    y.controller && y.controller.spline && (y.controller.spline = void 0),
                    y.params.freeMode ? (t(),
                    y.params.autoHeight && y.updateAutoHeight()) : (i = ("auto" === y.params.slidesPerView || y.params.slidesPerView > 1) && y.isEnd && !y.params.centeredSlides ? y.slideTo(y.slides.length - 1, 0, !1, !0) : y.slideTo(y.activeIndex, 0, !1, !0),
                    i || t())
                } else
                    y.params.autoHeight && y.updateAutoHeight()
            }
            ,
            y.onResize = function(e) {
                y.params.breakpoints && y.setBreakpoint();
                var t = y.params.allowSwipeToPrev
                  , i = y.params.allowSwipeToNext;
                y.params.allowSwipeToPrev = y.params.allowSwipeToNext = !0,
                y.updateContainerSize(),
                y.updateSlidesSize(),
                ("auto" === y.params.slidesPerView || y.params.freeMode || e) && y.updatePagination(),
                y.params.scrollbar && y.scrollbar && y.scrollbar.set(),
                y.controller && y.controller.spline && (y.controller.spline = void 0);
                var s = !1;
                if (y.params.freeMode) {
                    var a = Math.min(Math.max(y.translate, y.maxTranslate()), y.minTranslate());
                    y.setWrapperTranslate(a),
                    y.updateActiveIndex(),
                    y.updateClasses(),
                    y.params.autoHeight && y.updateAutoHeight()
                } else
                    y.updateClasses(),
                    s = ("auto" === y.params.slidesPerView || y.params.slidesPerView > 1) && y.isEnd && !y.params.centeredSlides ? y.slideTo(y.slides.length - 1, 0, !1, !0) : y.slideTo(y.activeIndex, 0, !1, !0);
                y.params.lazyLoading && !s && y.lazy && y.lazy.load(),
                y.params.allowSwipeToPrev = t,
                y.params.allowSwipeToNext = i
            }
            ;
            var b = ["mousedown", "mousemove", "mouseup"];
            window.navigator.pointerEnabled ? b = ["pointerdown", "pointermove", "pointerup"] : window.navigator.msPointerEnabled && (b = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]),
            y.touchEvents = {
                start: y.support.touch || !y.params.simulateTouch ? "touchstart" : b[0],
                move: y.support.touch || !y.params.simulateTouch ? "touchmove" : b[1],
                end: y.support.touch || !y.params.simulateTouch ? "touchend" : b[2]
            },
            (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === y.params.touchEventsTarget ? y.container : y.wrapper).addClass("swiper-wp8-" + y.params.direction),
            y.initEvents = function(e) {
                var t = e ? "off" : "on"
                  , i = e ? "removeEventListener" : "addEventListener"
                  , a = "container" === y.params.touchEventsTarget ? y.container[0] : y.wrapper[0]
                  , n = y.support.touch ? a : document
                  , r = y.params.nested ? !0 : !1;
                y.browser.ie ? (a[i](y.touchEvents.start, y.onTouchStart, !1),
                n[i](y.touchEvents.move, y.onTouchMove, r),
                n[i](y.touchEvents.end, y.onTouchEnd, !1)) : (y.support.touch && (a[i](y.touchEvents.start, y.onTouchStart, !1),
                a[i](y.touchEvents.move, y.onTouchMove, r),
                a[i](y.touchEvents.end, y.onTouchEnd, !1)),
                !s.simulateTouch || y.device.ios || y.device.android || (a[i]("mousedown", y.onTouchStart, !1),
                document[i]("mousemove", y.onTouchMove, r),
                document[i]("mouseup", y.onTouchEnd, !1))),
                window[i]("resize", y.onResize),
                y.params.nextButton && y.nextButton && y.nextButton.length > 0 && (y.nextButton[t]("click", y.onClickNext),
                y.params.a11y && y.a11y && y.nextButton[t]("keydown", y.a11y.onEnterKey)),
                y.params.prevButton && y.prevButton && y.prevButton.length > 0 && (y.prevButton[t]("click", y.onClickPrev),
                y.params.a11y && y.a11y && y.prevButton[t]("keydown", y.a11y.onEnterKey)),
                y.params.pagination && y.params.paginationClickable && (y.paginationContainer[t]("click", "." + y.params.bulletClass, y.onClickIndex),
                y.params.a11y && y.a11y && y.paginationContainer[t]("keydown", "." + y.params.bulletClass, y.a11y.onEnterKey)),
                (y.params.preventClicks || y.params.preventClicksPropagation) && a[i]("click", y.preventClicks, !0)
            }
            ,
            y.attachEvents = function() {
                y.initEvents()
            }
            ,
            y.detachEvents = function() {
                y.initEvents(!0)
            }
            ,
            y.allowClick = !0,
            y.preventClicks = function(e) {
                y.allowClick || (y.params.preventClicks && e.preventDefault(),
                y.params.preventClicksPropagation && y.animating && (e.stopPropagation(),
                e.stopImmediatePropagation()))
            }
            ,
            y.onClickNext = function(e) {
                e.preventDefault(),
                (!y.isEnd || y.params.loop) && y.slideNext()
            }
            ,
            y.onClickPrev = function(e) {
                e.preventDefault(),
                (!y.isBeginning || y.params.loop) && y.slidePrev()
            }
            ,
            y.onClickIndex = function(e) {
                e.preventDefault();
                var i = t(this).index() * y.params.slidesPerGroup;
                y.params.loop && (i += y.loopedSlides),
                y.slideTo(i)
            }
            ,
            y.updateClickedSlide = function(e) {
                var i = r(e, "." + y.params.slideClass)
                  , s = !1;
                if (i)
                    for (var a = 0; a < y.slides.length; a++)
                        y.slides[a] === i && (s = !0);
                if (!i || !s)
                    return y.clickedSlide = void 0,
                    void (y.clickedIndex = void 0);
                if (y.clickedSlide = i,
                y.clickedIndex = t(i).index(),
                y.params.slideToClickedSlide && void 0 !== y.clickedIndex && y.clickedIndex !== y.activeIndex) {
                    var n, o = y.clickedIndex;
                    if (y.params.loop) {
                        if (y.animating)
                            return;
                        n = t(y.clickedSlide).attr("data-swiper-slide-index"),
                        y.params.centeredSlides ? o < y.loopedSlides - y.params.slidesPerView / 2 || o > y.slides.length - y.loopedSlides + y.params.slidesPerView / 2 ? (y.fixLoop(),
                        o = y.wrapper.children("." + y.params.slideClass + '[data-swiper-slide-index="' + n + '"]:not(.swiper-slide-duplicate)').eq(0).index(),
                        setTimeout(function() {
                            y.slideTo(o)
                        }
                        , 0)) : y.slideTo(o) : o > y.slides.length - y.params.slidesPerView ? (y.fixLoop(),
                        o = y.wrapper.children("." + y.params.slideClass + '[data-swiper-slide-index="' + n + '"]:not(.swiper-slide-duplicate)').eq(0).index(),
                        setTimeout(function() {
                            y.slideTo(o)
                        }
                        , 0)) : y.slideTo(o)
                    } else
                        y.slideTo(o)
                }
            }
            ;
            var T, S, E, C, P, z, k, M, I, D, B = "input, select, textarea, button", X = Date.now(), Y = [];
            y.animating = !1,
            y.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };
            var H, L;
            if (y.onTouchStart = function(e) {
                if (e.originalEvent && (e = e.originalEvent),
                H = "touchstart" === e.type,
                H || !("which" in e) || 3 !== e.which) {
                    if (y.params.noSwiping && r(e, "." + y.params.noSwipingClass))
                        return void (y.allowClick = !0);
                    if (!y.params.swipeHandler || r(e, y.params.swipeHandler)) {
                        var i = y.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX
                          , s = y.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (!(y.device.ios && y.params.iOSEdgeSwipeDetection && i <= y.params.iOSEdgeSwipeThreshold)) {
                            if (T = !0,
                            S = !1,
                            E = !0,
                            P = void 0,
                            L = void 0,
                            y.touches.startX = i,
                            y.touches.startY = s,
                            C = Date.now(),
                            y.allowClick = !0,
                            y.updateContainerSize(),
                            y.swipeDirection = void 0,
                            y.params.threshold > 0 && (M = !1),
                            "touchstart" !== e.type) {
                                var a = !0;
                                t(e.target).is(B) && (a = !1),
                                document.activeElement && t(document.activeElement).is(B) && document.activeElement.blur(),
                                a && e.preventDefault()
                            }
                            y.emit("onTouchStart", y, e)
                        }
                    }
                }
            }
            ,
            y.onTouchMove = function(e) {
                if (e.originalEvent && (e = e.originalEvent),
                !H || "mousemove" !== e.type) {
                    if (e.preventedByNestedSwiper)
                        return y.touches.startX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        void (y.touches.startY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY);
                    if (y.params.onlyExternal)
                        return y.allowClick = !1,
                        void (T && (y.touches.startX = y.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        y.touches.startY = y.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                        C = Date.now()));
                    if (H && document.activeElement && e.target === document.activeElement && t(e.target).is(B))
                        return S = !0,
                        void (y.allowClick = !1);
                    if (E && y.emit("onTouchMove", y, e),
                    !(e.targetTouches && e.targetTouches.length > 1)) {
                        if (y.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        y.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                        "undefined" == typeof P) {
                            var i = 180 * Math.atan2(Math.abs(y.touches.currentY - y.touches.startY), Math.abs(y.touches.currentX - y.touches.startX)) / Math.PI;
                            P = y.isHorizontal() ? i > y.params.touchAngle : 90 - i > y.params.touchAngle
                        }
                        if (P && y.emit("onTouchMoveOpposite", y, e),
                        "undefined" == typeof L && y.browser.ieTouch && (y.touches.currentX !== y.touches.startX || y.touches.currentY !== y.touches.startY) && (L = !0),
                        T) {
                            if (P)
                                return void (T = !1);
                            if (L || !y.browser.ieTouch) {
                                y.allowClick = !1,
                                y.emit("onSliderMove", y, e),
                                e.preventDefault(),
                                y.params.touchMoveStopPropagation && !y.params.nested && e.stopPropagation(),
                                S || (s.loop && y.fixLoop(),
                                k = y.getWrapperTranslate(),
                                y.setWrapperTransition(0),
                                y.animating && y.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),
                                y.params.autoplay && y.autoplaying && (y.params.autoplayDisableOnInteraction ? y.stopAutoplay() : y.pauseAutoplay()),
                                D = !1,
                                y.params.grabCursor && (y.container[0].style.cursor = "move",
                                y.container[0].style.cursor = "-webkit-grabbing",
                                y.container[0].style.cursor = "-moz-grabbin",
                                y.container[0].style.cursor = "grabbing")),
                                S = !0;
                                var a = y.touches.diff = y.isHorizontal() ? y.touches.currentX - y.touches.startX : y.touches.currentY - y.touches.startY;
                                a *= y.params.touchRatio,
                                y.rtl && (a = -a),
                                y.swipeDirection = a > 0 ? "prev" : "next",
                                z = a + k;
                                var n = !0;
                                if (a > 0 && z > y.minTranslate() ? (n = !1,
                                y.params.resistance && (z = y.minTranslate() - 1 + Math.pow(-y.minTranslate() + k + a, y.params.resistanceRatio))) : 0 > a && z < y.maxTranslate() && (n = !1,
                                y.params.resistance && (z = y.maxTranslate() + 1 - Math.pow(y.maxTranslate() - k - a, y.params.resistanceRatio))),
                                n && (e.preventedByNestedSwiper = !0),
                                !y.params.allowSwipeToNext && "next" === y.swipeDirection && k > z && (z = k),
                                !y.params.allowSwipeToPrev && "prev" === y.swipeDirection && z > k && (z = k),
                                y.params.followFinger) {
                                    if (y.params.threshold > 0) {
                                        if (!(Math.abs(a) > y.params.threshold || M))
                                            return void (z = k);
                                        if (!M)
                                            return M = !0,
                                            y.touches.startX = y.touches.currentX,
                                            y.touches.startY = y.touches.currentY,
                                            z = k,
                                            void (y.touches.diff = y.isHorizontal() ? y.touches.currentX - y.touches.startX : y.touches.currentY - y.touches.startY)
                                    }
                                    (y.params.freeMode || y.params.watchSlidesProgress) && y.updateActiveIndex(),
                                    y.params.freeMode && (0 === Y.length && Y.push({
                                        position: y.touches[y.isHorizontal() ? "startX" : "startY"],
                                        time: C
                                    }),
                                    Y.push({
                                        position: y.touches[y.isHorizontal() ? "currentX" : "currentY"],
                                        time: (new window.Date).getTime()
                                    })),
                                    y.updateProgress(z),
                                    y.setWrapperTranslate(z)
                                }
                            }
                        }
                    }
                }
            }
            ,
            y.onTouchEnd = function(e) {
                if (e.originalEvent && (e = e.originalEvent),
                E && y.emit("onTouchEnd", y, e),
                E = !1,
                T) {
                    y.params.grabCursor && S && T && (y.container[0].style.cursor = "move",
                    y.container[0].style.cursor = "-webkit-grab",
                    y.container[0].style.cursor = "-moz-grab",
                    y.container[0].style.cursor = "grab");
                    var i = Date.now()
                      , s = i - C;
                    if (y.allowClick && (y.updateClickedSlide(e),
                    y.emit("onTap", y, e),
                    300 > s && i - X > 300 && (I && clearTimeout(I),
                    I = setTimeout(function() {
                        y && (y.params.paginationHide && y.paginationContainer.length > 0 && !t(e.target).hasClass(y.params.bulletClass) && y.paginationContainer.toggleClass(y.params.paginationHiddenClass),
                        y.emit("onClick", y, e))
                    }
                    , 300)),
                    300 > s && 300 > i - X && (I && clearTimeout(I),
                    y.emit("onDoubleTap", y, e))),
                    X = Date.now(),
                    setTimeout(function() {
                        y && (y.allowClick = !0)
                    }
                    , 0),
                    !T || !S || !y.swipeDirection || 0 === y.touches.diff || z === k)
                        return void (T = S = !1);
                    T = S = !1;
                    var a;
                    if (a = y.params.followFinger ? y.rtl ? y.translate : -y.translate : -z,
                    y.params.freeMode) {
                        if (a < -y.minTranslate())
                            return void y.slideTo(y.activeIndex);
                        if (a > -y.maxTranslate())
                            return void (y.slides.length < y.snapGrid.length ? y.slideTo(y.snapGrid.length - 1) : y.slideTo(y.slides.length - 1));
                        if (y.params.freeModeMomentum) {
                            if (Y.length > 1) {
                                var n = Y.pop()
                                  , r = Y.pop()
                                  , o = n.position - r.position
                                  , l = n.time - r.time;
                                y.velocity = o / l,
                                y.velocity = y.velocity / 2,
                                Math.abs(y.velocity) < y.params.freeModeMinimumVelocity && (y.velocity = 0),
                                (l > 150 || (new window.Date).getTime() - n.time > 300) && (y.velocity = 0);
                            } else
                                y.velocity = 0;
                            Y.length = 0;
                            var p = 1e3 * y.params.freeModeMomentumRatio
                              , c = y.velocity * p
                              , d = y.translate + c;
                            y.rtl && (d = -d);
                            var h, u = !1, f = 20 * Math.abs(y.velocity) * y.params.freeModeMomentumBounceRatio;
                            if (d < y.maxTranslate())
                                y.params.freeModeMomentumBounce ? (d + y.maxTranslate() < -f && (d = y.maxTranslate() - f),
                                h = y.maxTranslate(),
                                u = !0,
                                D = !0) : d = y.maxTranslate();
                            else if (d > y.minTranslate())
                                y.params.freeModeMomentumBounce ? (d - y.minTranslate() > f && (d = y.minTranslate() + f),
                                h = y.minTranslate(),
                                u = !0,
                                D = !0) : d = y.minTranslate();
                            else if (y.params.freeModeSticky) {
                                var m, g = 0;
                                for (g = 0; g < y.snapGrid.length; g += 1)
                                    if (y.snapGrid[g] > -d) {
                                        m = g;
                                        break
                                    }
                                d = Math.abs(y.snapGrid[m] - d) < Math.abs(y.snapGrid[m - 1] - d) || "next" === y.swipeDirection ? y.snapGrid[m] : y.snapGrid[m - 1],
                                y.rtl || (d = -d)
                            }
                            if (0 !== y.velocity)
                                p = y.rtl ? Math.abs((-d - y.translate) / y.velocity) : Math.abs((d - y.translate) / y.velocity);
                            else if (y.params.freeModeSticky)
                                return void y.slideReset();
                            y.params.freeModeMomentumBounce && u ? (y.updateProgress(h),
                            y.setWrapperTransition(p),
                            y.setWrapperTranslate(d),
                            y.onTransitionStart(),
                            y.animating = !0,
                            y.wrapper.transitionEnd(function() {
                                y && D && (y.emit("onMomentumBounce", y),
                                y.setWrapperTransition(y.params.speed),
                                y.setWrapperTranslate(h),
                                y.wrapper.transitionEnd(function() {
                                    y && y.onTransitionEnd()
                                }
                                ))
                            }
                            )) : y.velocity ? (y.updateProgress(d),
                            y.setWrapperTransition(p),
                            y.setWrapperTranslate(d),
                            y.onTransitionStart(),
                            y.animating || (y.animating = !0,
                            y.wrapper.transitionEnd(function() {
                                y && y.onTransitionEnd()
                            }
                            ))) : y.updateProgress(d),
                            y.updateActiveIndex()
                        }
                        return void ((!y.params.freeModeMomentum || s >= y.params.longSwipesMs) && (y.updateProgress(),
                        y.updateActiveIndex()))
                    }
                    var v, w = 0, x = y.slidesSizesGrid[0];
                    for (v = 0; v < y.slidesGrid.length; v += y.params.slidesPerGroup)
                        "undefined" != typeof y.slidesGrid[v + y.params.slidesPerGroup] ? a >= y.slidesGrid[v] && a < y.slidesGrid[v + y.params.slidesPerGroup] && (w = v,
                        x = y.slidesGrid[v + y.params.slidesPerGroup] - y.slidesGrid[v]) : a >= y.slidesGrid[v] && (w = v,
                        x = y.slidesGrid[y.slidesGrid.length - 1] - y.slidesGrid[y.slidesGrid.length - 2]);
                    var b = (a - y.slidesGrid[w]) / x;
                    if (s > y.params.longSwipesMs) {
                        if (!y.params.longSwipes)
                            return void y.slideTo(y.activeIndex);
                        "next" === y.swipeDirection && (b >= y.params.longSwipesRatio ? y.slideTo(w + y.params.slidesPerGroup) : y.slideTo(w)),
                        "prev" === y.swipeDirection && (b > 1 - y.params.longSwipesRatio ? y.slideTo(w + y.params.slidesPerGroup) : y.slideTo(w))
                    } else {
                        if (!y.params.shortSwipes)
                            return void y.slideTo(y.activeIndex);
                        "next" === y.swipeDirection && y.slideTo(w + y.params.slidesPerGroup),
                        "prev" === y.swipeDirection && y.slideTo(w)
                    }
                }
            }
            ,
            y._slideTo = function(e, t) {
                return y.slideTo(e, t, !0, !0)
            }
            ,
            y.slideTo = function(e, t, i, s) {
                "undefined" == typeof i && (i = !0),
                "undefined" == typeof e && (e = 0),
                0 > e && (e = 0),
                y.snapIndex = Math.floor(e / y.params.slidesPerGroup),
                y.snapIndex >= y.snapGrid.length && (y.snapIndex = y.snapGrid.length - 1);
                var a = -y.snapGrid[y.snapIndex];
                y.params.autoplay && y.autoplaying && (s || !y.params.autoplayDisableOnInteraction ? y.pauseAutoplay(t) : y.stopAutoplay()),
                y.updateProgress(a);
                for (var n = 0; n < y.slidesGrid.length; n++)
                    -Math.floor(100 * a) >= Math.floor(100 * y.slidesGrid[n]) && (e = n);
                return !y.params.allowSwipeToNext && a < y.translate && a < y.minTranslate() ? !1 : !y.params.allowSwipeToPrev && a > y.translate && a > y.maxTranslate() && (y.activeIndex || 0) !== e ? !1 : ("undefined" == typeof t && (t = y.params.speed),
                y.previousIndex = y.activeIndex || 0,
                y.activeIndex = e,
                y.rtl && -a === y.translate || !y.rtl && a === y.translate ? (y.params.autoHeight && y.updateAutoHeight(),
                y.updateClasses(),
                "slide" !== y.params.effect && y.setWrapperTranslate(a),
                !1) : (y.updateClasses(),
                y.onTransitionStart(i),
                0 === t ? (y.setWrapperTranslate(a),
                y.setWrapperTransition(0),
                y.onTransitionEnd(i)) : (y.setWrapperTranslate(a),
                y.setWrapperTransition(t),
                y.animating || (y.animating = !0,
                y.wrapper.transitionEnd(function() {
                    y && y.onTransitionEnd(i)
                }
                ))),
                !0))
            }
            ,
            y.onTransitionStart = function(e) {
                "undefined" == typeof e && (e = !0),
                y.params.autoHeight && y.updateAutoHeight(),
                y.lazy && y.lazy.onTransitionStart(),
                e && (y.emit("onTransitionStart", y),
                y.activeIndex !== y.previousIndex && (y.emit("onSlideChangeStart", y),
                y.activeIndex > y.previousIndex ? y.emit("onSlideNextStart", y) : y.emit("onSlidePrevStart", y)))
            }
            ,
            y.onTransitionEnd = function(e) {
                y.animating = !1,
                y.setWrapperTransition(0),
                "undefined" == typeof e && (e = !0),
                y.lazy && y.lazy.onTransitionEnd(),
                e && (y.emit("onTransitionEnd", y),
                y.activeIndex !== y.previousIndex && (y.emit("onSlideChangeEnd", y),
                y.activeIndex > y.previousIndex ? y.emit("onSlideNextEnd", y) : y.emit("onSlidePrevEnd", y))),
                y.params.hashnav && y.hashnav && y.hashnav.setHash()
            }
            ,
            y.slideNext = function(e, t, i) {
                return y.params.loop ? y.animating ? !1 : (y.fixLoop(),
                y.container[0].clientLeft,
                y.slideTo(y.activeIndex + y.params.slidesPerGroup, t, e, i)) : y.slideTo(y.activeIndex + y.params.slidesPerGroup, t, e, i)
            }
            ,
            y._slideNext = function(e) {
                return y.slideNext(!0, e, !0)
            }
            ,
            y.slidePrev = function(e, t, i) {
                return y.params.loop ? y.animating ? !1 : (y.fixLoop(),
                y.container[0].clientLeft,
                y.slideTo(y.activeIndex - 1, t, e, i)) : y.slideTo(y.activeIndex - 1, t, e, i)
            }
            ,
            y._slidePrev = function(e) {
                return y.slidePrev(!0, e, !0)
            }
            ,
            y.slideReset = function(e, t, i) {
                return y.slideTo(y.activeIndex, t, e)
            }
            ,
            y.setWrapperTransition = function(e, t) {
                y.wrapper.transition(e),
                "slide" !== y.params.effect && y.effects[y.params.effect] && y.effects[y.params.effect].setTransition(e),
                y.params.parallax && y.parallax && y.parallax.setTransition(e),
                y.params.scrollbar && y.scrollbar && y.scrollbar.setTransition(e),
                y.params.control && y.controller && y.controller.setTransition(e, t),
                y.emit("onSetTransition", y, e)
            }
            ,
            y.setWrapperTranslate = function(e, t, i) {
                var s = 0
                  , n = 0
                  , r = 0;
                y.isHorizontal() ? s = y.rtl ? -e : e : n = e,
                y.params.roundLengths && (s = a(s),
                n = a(n)),
                y.params.virtualTranslate || (y.support.transforms3d ? y.wrapper.transform("translate3d(" + s + "px, " + n + "px, " + r + "px)") : y.wrapper.transform("translate(" + s + "px, " + n + "px)")),
                y.translate = y.isHorizontal() ? s : n;
                var o, l = y.maxTranslate() - y.minTranslate();
                o = 0 === l ? 0 : (e - y.minTranslate()) / l,
                o !== y.progress && y.updateProgress(e),
                t && y.updateActiveIndex(),
                "slide" !== y.params.effect && y.effects[y.params.effect] && y.effects[y.params.effect].setTranslate(y.translate),
                y.params.parallax && y.parallax && y.parallax.setTranslate(y.translate),
                y.params.scrollbar && y.scrollbar && y.scrollbar.setTranslate(y.translate),
                y.params.control && y.controller && y.controller.setTranslate(y.translate, i),
                y.emit("onSetTranslate", y, y.translate)
            }
            ,
            y.getTranslate = function(e, t) {
                var i, s, a, n;
                return "undefined" == typeof t && (t = "x"),
                y.params.virtualTranslate ? y.rtl ? -y.translate : y.translate : (a = window.getComputedStyle(e, null ),
                window.WebKitCSSMatrix ? (s = a.transform || a.webkitTransform,
                s.split(",").length > 6 && (s = s.split(", ").map(function(e) {
                    return e.replace(",", ".")
                }
                ).join(", ")),
                n = new window.WebKitCSSMatrix("none" === s ? "" : s)) : (n = a.MozTransform || a.OTransform || a.MsTransform || a.msTransform || a.transform || a.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"),
                i = n.toString().split(",")),
                "x" === t && (s = window.WebKitCSSMatrix ? n.m41 : 16 === i.length ? parseFloat(i[12]) : parseFloat(i[4])),
                "y" === t && (s = window.WebKitCSSMatrix ? n.m42 : 16 === i.length ? parseFloat(i[13]) : parseFloat(i[5])),
                y.rtl && s && (s = -s),
                s || 0)
            }
            ,
            y.getWrapperTranslate = function(e) {
                return "undefined" == typeof e && (e = y.isHorizontal() ? "x" : "y"),
                y.getTranslate(y.wrapper[0], e)
            }
            ,
            y.observers = [],
            y.initObservers = function() {
                if (y.params.observeParents)
                    for (var e = y.container.parents(), t = 0; t < e.length; t++)
                        o(e[t]);
                o(y.container[0], {
                    childList: !1
                }),
                o(y.wrapper[0], {
                    attributes: !1
                })
            }
            ,
            y.disconnectObservers = function() {
                for (var e = 0; e < y.observers.length; e++)
                    y.observers[e].disconnect();
                y.observers = []
            }
            ,
            y.createLoop = function() {
                y.wrapper.children("." + y.params.slideClass + "." + y.params.slideDuplicateClass).remove();
                var e = y.wrapper.children("." + y.params.slideClass);
                "auto" !== y.params.slidesPerView || y.params.loopedSlides || (y.params.loopedSlides = e.length),
                y.loopedSlides = parseInt(y.params.loopedSlides || y.params.slidesPerView, 10),
                y.loopedSlides = y.loopedSlides + y.params.loopAdditionalSlides,
                y.loopedSlides > e.length && (y.loopedSlides = e.length);
                var i, s = [], a = [];
                for (e.each(function(i, n) {
                    var r = t(this);
                    i < y.loopedSlides && a.push(n),
                    i < e.length && i >= e.length - y.loopedSlides && s.push(n),
                    r.attr("data-swiper-slide-index", i)
                }
                ),
                i = 0; i < a.length; i++)
                    y.wrapper.append(t(a[i].cloneNode(!0)).addClass(y.params.slideDuplicateClass));
                for (i = s.length - 1; i >= 0; i--)
                    y.wrapper.prepend(t(s[i].cloneNode(!0)).addClass(y.params.slideDuplicateClass))
            }
            ,
            y.destroyLoop = function() {
                y.wrapper.children("." + y.params.slideClass + "." + y.params.slideDuplicateClass).remove(),
                y.slides.removeAttr("data-swiper-slide-index")
            }
            ,
            y.reLoop = function(e) {
                var t = y.activeIndex - y.loopedSlides;
                y.destroyLoop(),
                y.createLoop(),
                y.updateSlidesSize(),
                e && y.slideTo(t + y.loopedSlides, 0, !1)
            }
            ,
            y.fixLoop = function() {
                var e;
                y.activeIndex < y.loopedSlides ? (e = y.slides.length - 3 * y.loopedSlides + y.activeIndex,
                e += y.loopedSlides,
                y.slideTo(e, 0, !1, !0)) : ("auto" === y.params.slidesPerView && y.activeIndex >= 2 * y.loopedSlides || y.activeIndex > y.slides.length - 2 * y.params.slidesPerView) && (e = -y.slides.length + y.activeIndex + y.loopedSlides,
                e += y.loopedSlides,
                y.slideTo(e, 0, !1, !0))
            }
            ,
            y.appendSlide = function(e) {
                if (y.params.loop && y.destroyLoop(),
                "object" == typeof e && e.length)
                    for (var t = 0; t < e.length; t++)
                        e[t] && y.wrapper.append(e[t]);
                else
                    y.wrapper.append(e);
                y.params.loop && y.createLoop(),
                y.params.observer && y.support.observer || y.update(!0)
            }
            ,
            y.prependSlide = function(e) {
                y.params.loop && y.destroyLoop();
                var t = y.activeIndex + 1;
                if ("object" == typeof e && e.length) {
                    for (var i = 0; i < e.length; i++)
                        e[i] && y.wrapper.prepend(e[i]);
                    t = y.activeIndex + e.length
                } else
                    y.wrapper.prepend(e);
                y.params.loop && y.createLoop(),
                y.params.observer && y.support.observer || y.update(!0),
                y.slideTo(t, 0, !1)
            }
            ,
            y.removeSlide = function(e) {
                y.params.loop && (y.destroyLoop(),
                y.slides = y.wrapper.children("." + y.params.slideClass));
                var t, i = y.activeIndex;
                if ("object" == typeof e && e.length) {
                    for (var s = 0; s < e.length; s++)
                        t = e[s],
                        y.slides[t] && y.slides.eq(t).remove(),
                        i > t && i--;
                    i = Math.max(i, 0)
                } else
                    t = e,
                    y.slides[t] && y.slides.eq(t).remove(),
                    i > t && i--,
                    i = Math.max(i, 0);
                y.params.loop && y.createLoop(),
                y.params.observer && y.support.observer || y.update(!0),
                y.params.loop ? y.slideTo(i + y.loopedSlides, 0, !1) : y.slideTo(i, 0, !1)
            }
            ,
            y.removeAllSlides = function() {
                for (var e = [], t = 0; t < y.slides.length; t++)
                    e.push(t);
                y.removeSlide(e)
            }
            ,
            y.effects = {
                fade: {
                    setTranslate: function() {
                        for (var e = 0; e < y.slides.length; e++) {
                            var t = y.slides.eq(e)
                              , i = t[0].swiperSlideOffset
                              , s = -i;
                            y.params.virtualTranslate || (s -= y.translate);
                            var a = 0;
                            y.isHorizontal() || (a = s,
                            s = 0);
                            var n = y.params.fade.crossFade ? Math.max(1 - Math.abs(t[0].progress), 0) : 1 + Math.min(Math.max(t[0].progress, -1), 0);
                            t.css({
                                opacity: n
                            }).transform("translate3d(" + s + "px, " + a + "px, 0px)")
                        }
                    },
                    setTransition: function(e) {
                        if (y.slides.transition(e),
                        y.params.virtualTranslate && 0 !== e) {
                            var t = !1;
                            y.slides.transitionEnd(function() {
                                if (!t && y) {
                                    t = !0,
                                    y.animating = !1;
                                    for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], i = 0; i < e.length; i++)
                                        y.wrapper.trigger(e[i])
                                }
                            }
                            )
                        }
                    }
                },
                flip: {
                    setTranslate: function() {
                        for (var e = 0; e < y.slides.length; e++) {
                            var i = y.slides.eq(e)
                              , s = i[0].progress;
                            y.params.flip.limitRotation && (s = Math.max(Math.min(i[0].progress, 1), -1));
                            var a = i[0].swiperSlideOffset
                              , n = -180 * s
                              , r = n
                              , o = 0
                              , l = -a
                              , p = 0;
                            if (y.isHorizontal() ? y.rtl && (r = -r) : (p = l,
                            l = 0,
                            o = -r,
                            r = 0),
                            i[0].style.zIndex = -Math.abs(Math.round(s)) + y.slides.length,
                            y.params.flip.slideShadows) {
                                var c = y.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top")
                                  , d = y.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");
                                0 === c.length && (c = t('<div class="swiper-slide-shadow-' + (y.isHorizontal() ? "left" : "top") + '"></div>'),
                                i.append(c)),
                                0 === d.length && (d = t('<div class="swiper-slide-shadow-' + (y.isHorizontal() ? "right" : "bottom") + '"></div>'),
                                i.append(d)),
                                c.length && (c[0].style.opacity = Math.max(-s, 0)),
                                d.length && (d[0].style.opacity = Math.max(s, 0))
                            }
                            i.transform("translate3d(" + l + "px, " + p + "px, 0px) rotateX(" + o + "deg) rotateY(" + r + "deg)")
                        }
                    },
                    setTransition: function(e) {
                        if (y.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                        y.params.virtualTranslate && 0 !== e) {
                            var i = !1;
                            y.slides.eq(y.activeIndex).transitionEnd(function() {
                                if (!i && y && t(this).hasClass(y.params.slideActiveClass)) {
                                    i = !0,
                                    y.animating = !1;
                                    for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], s = 0; s < e.length; s++)
                                        y.wrapper.trigger(e[s])
                                }
                            }
                            )
                        }
                    }
                },
                cube: {
                    setTranslate: function() {
                        var e, i = 0;
                        y.params.cube.shadow && (y.isHorizontal() ? (e = y.wrapper.find(".swiper-cube-shadow"),
                        0 === e.length && (e = t('<div class="swiper-cube-shadow"></div>'),
                        y.wrapper.append(e)),
                        e.css({
                            height: y.width + "px"
                        })) : (e = y.container.find(".swiper-cube-shadow"),
                        0 === e.length && (e = t('<div class="swiper-cube-shadow"></div>'),
                        y.container.append(e))));
                        for (var s = 0; s < y.slides.length; s++) {
                            var a = y.slides.eq(s)
                              , n = 90 * s
                              , r = Math.floor(n / 360);
                            y.rtl && (n = -n,
                            r = Math.floor(-n / 360));
                            var o = Math.max(Math.min(a[0].progress, 1), -1)
                              , l = 0
                              , p = 0
                              , c = 0;
                            s % 4 === 0 ? (l = 4 * -r * y.size,
                            c = 0) : (s - 1) % 4 === 0 ? (l = 0,
                            c = 4 * -r * y.size) : (s - 2) % 4 === 0 ? (l = y.size + 4 * r * y.size,
                            c = y.size) : (s - 3) % 4 === 0 && (l = -y.size,
                            c = 3 * y.size + 4 * y.size * r),
                            y.rtl && (l = -l),
                            y.isHorizontal() || (p = l,
                            l = 0);
                            var d = "rotateX(" + (y.isHorizontal() ? 0 : -n) + "deg) rotateY(" + (y.isHorizontal() ? n : 0) + "deg) translate3d(" + l + "px, " + p + "px, " + c + "px)";
                            if (1 >= o && o > -1 && (i = 90 * s + 90 * o,
                            y.rtl && (i = 90 * -s - 90 * o)),
                            a.transform(d),
                            y.params.cube.slideShadows) {
                                var h = y.isHorizontal() ? a.find(".swiper-slide-shadow-left") : a.find(".swiper-slide-shadow-top")
                                  , u = y.isHorizontal() ? a.find(".swiper-slide-shadow-right") : a.find(".swiper-slide-shadow-bottom");
                                0 === h.length && (h = t('<div class="swiper-slide-shadow-' + (y.isHorizontal() ? "left" : "top") + '"></div>'),
                                a.append(h)),
                                0 === u.length && (u = t('<div class="swiper-slide-shadow-' + (y.isHorizontal() ? "right" : "bottom") + '"></div>'),
                                a.append(u)),
                                h.length && (h[0].style.opacity = Math.max(-o, 0)),
                                u.length && (u[0].style.opacity = Math.max(o, 0))
                            }
                        }
                        if (y.wrapper.css({
                            "-webkit-transform-origin": "50% 50% -" + y.size / 2 + "px",
                            "-moz-transform-origin": "50% 50% -" + y.size / 2 + "px",
                            "-ms-transform-origin": "50% 50% -" + y.size / 2 + "px",
                            "transform-origin": "50% 50% -" + y.size / 2 + "px"
                        }),
                        y.params.cube.shadow)
                            if (y.isHorizontal())
                                e.transform("translate3d(0px, " + (y.width / 2 + y.params.cube.shadowOffset) + "px, " + -y.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + y.params.cube.shadowScale + ")");
                            else {
                                var f = Math.abs(i) - 90 * Math.floor(Math.abs(i) / 90)
                                  , m = 1.5 - (Math.sin(2 * f * Math.PI / 360) / 2 + Math.cos(2 * f * Math.PI / 360) / 2)
                                  , g = y.params.cube.shadowScale
                                  , v = y.params.cube.shadowScale / m
                                  , w = y.params.cube.shadowOffset;
                                e.transform("scale3d(" + g + ", 1, " + v + ") translate3d(0px, " + (y.height / 2 + w) + "px, " + -y.height / 2 / v + "px) rotateX(-90deg)")
                            }
                        var x = y.isSafari || y.isUiWebView ? -y.size / 2 : 0;
                        y.wrapper.transform("translate3d(0px,0," + x + "px) rotateX(" + (y.isHorizontal() ? 0 : i) + "deg) rotateY(" + (y.isHorizontal() ? -i : 0) + "deg)")
                    },
                    setTransition: function(e) {
                        y.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                        y.params.cube.shadow && !y.isHorizontal() && y.container.find(".swiper-cube-shadow").transition(e)
                    }
                },
                coverflow: {
                    setTranslate: function() {
                        for (var e = y.translate, i = y.isHorizontal() ? -e + y.width / 2 : -e + y.height / 2, s = y.isHorizontal() ? y.params.coverflow.rotate : -y.params.coverflow.rotate, a = y.params.coverflow.depth, n = 0, r = y.slides.length; r > n; n++) {
                            var o = y.slides.eq(n)
                              , l = y.slidesSizesGrid[n]
                              , p = o[0].swiperSlideOffset
                              , c = (i - p - l / 2) / l * y.params.coverflow.modifier
                              , d = y.isHorizontal() ? s * c : 0
                              , h = y.isHorizontal() ? 0 : s * c
                              , u = -a * Math.abs(c)
                              , f = y.isHorizontal() ? 0 : y.params.coverflow.stretch * c
                              , m = y.isHorizontal() ? y.params.coverflow.stretch * c : 0;
                            Math.abs(m) < .001 && (m = 0),
                            Math.abs(f) < .001 && (f = 0),
                            Math.abs(u) < .001 && (u = 0),
                            Math.abs(d) < .001 && (d = 0),
                            Math.abs(h) < .001 && (h = 0);
                            var g = "translate3d(" + m + "px," + f + "px," + u + "px)  rotateX(" + h + "deg) rotateY(" + d + "deg)";
                            if (o.transform(g),
                            o[0].style.zIndex = -Math.abs(Math.round(c)) + 1,
                            y.params.coverflow.slideShadows) {
                                var v = y.isHorizontal() ? o.find(".swiper-slide-shadow-left") : o.find(".swiper-slide-shadow-top")
                                  , w = y.isHorizontal() ? o.find(".swiper-slide-shadow-right") : o.find(".swiper-slide-shadow-bottom");
                                0 === v.length && (v = t('<div class="swiper-slide-shadow-' + (y.isHorizontal() ? "left" : "top") + '"></div>'),
                                o.append(v)),
                                0 === w.length && (w = t('<div class="swiper-slide-shadow-' + (y.isHorizontal() ? "right" : "bottom") + '"></div>'),
                                o.append(w)),
                                v.length && (v[0].style.opacity = c > 0 ? c : 0),
                                w.length && (w[0].style.opacity = -c > 0 ? -c : 0)
                            }
                        }
                        if (y.browser.ie) {
                            var x = y.wrapper[0].style;
                            x.perspectiveOrigin = i + "px 50%"
                        }
                    },
                    setTransition: function(e) {
                        y.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
                    }
                }
            },
            y.lazy = {
                initialImageLoaded: !1,
                loadImageInSlide: function(e, i) {
                    if ("undefined" != typeof e && ("undefined" == typeof i && (i = !0),
                    0 !== y.slides.length)) {
                        var s = y.slides.eq(e)
                          , a = s.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");
                        !s.hasClass("swiper-lazy") || s.hasClass("swiper-lazy-loaded") || s.hasClass("swiper-lazy-loading") || (a = a.add(s[0])),
                        0 !== a.length && a.each(function() {
                            var e = t(this);
                            e.addClass("swiper-lazy-loading");
                            var a = e.attr("data-background")
                              , n = e.attr("data-src")
                              , r = e.attr("data-srcset");
                            y.loadImage(e[0], n || a, r, !1, function() {
                                if (a ? (e.css("background-image", 'url("' + a + '")'),
                                e.removeAttr("data-background")) : (r && (e.attr("srcset", r),
                                e.removeAttr("data-srcset")),
                                n && (e.attr("src", n),
                                e.removeAttr("data-src"))),
                                e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),
                                s.find(".swiper-lazy-preloader, .preloader").remove(),
                                y.params.loop && i) {
                                    var t = s.attr("data-swiper-slide-index");
                                    if (s.hasClass(y.params.slideDuplicateClass)) {
                                        var o = y.wrapper.children('[data-swiper-slide-index="' + t + '"]:not(.' + y.params.slideDuplicateClass + ")");
                                        y.lazy.loadImageInSlide(o.index(), !1)
                                    } else {
                                        var l = y.wrapper.children("." + y.params.slideDuplicateClass + '[data-swiper-slide-index="' + t + '"]');
                                        y.lazy.loadImageInSlide(l.index(), !1)
                                    }
                                }
                                y.emit("onLazyImageReady", y, s[0], e[0])
                            }
                            ),
                            y.emit("onLazyImageLoad", y, s[0], e[0])
                        }
                        )
                    }
                },
                load: function() {
                    var e;
                    if (y.params.watchSlidesVisibility)
                        y.wrapper.children("." + y.params.slideVisibleClass).each(function() {
                            y.lazy.loadImageInSlide(t(this).index())
                        }
                        );
                    else if (y.params.slidesPerView > 1)
                        for (e = y.activeIndex; e < y.activeIndex + y.params.slidesPerView; e++)
                            y.slides[e] && y.lazy.loadImageInSlide(e);
                    else
                        y.lazy.loadImageInSlide(y.activeIndex);
                    if (y.params.lazyLoadingInPrevNext)
                        if (y.params.slidesPerView > 1 || y.params.lazyLoadingInPrevNextAmount && y.params.lazyLoadingInPrevNextAmount > 1) {
                            var i = y.params.lazyLoadingInPrevNextAmount
                              , s = y.params.slidesPerView
                              , a = Math.min(y.activeIndex + s + Math.max(i, s), y.slides.length)
                              , n = Math.max(y.activeIndex - Math.max(s, i), 0);
                            for (e = y.activeIndex + y.params.slidesPerView; a > e; e++)
                                y.slides[e] && y.lazy.loadImageInSlide(e);
                            for (e = n; e < y.activeIndex; e++)
                                y.slides[e] && y.lazy.loadImageInSlide(e)
                        } else {
                            var r = y.wrapper.children("." + y.params.slideNextClass);
                            r.length > 0 && y.lazy.loadImageInSlide(r.index());
                            var o = y.wrapper.children("." + y.params.slidePrevClass);
                            o.length > 0 && y.lazy.loadImageInSlide(o.index())
                        }
                },
                onTransitionStart: function() {
                    y.params.lazyLoading && (y.params.lazyLoadingOnTransitionStart || !y.params.lazyLoadingOnTransitionStart && !y.lazy.initialImageLoaded) && y.lazy.load()
                },
                onTransitionEnd: function() {
                    y.params.lazyLoading && !y.params.lazyLoadingOnTransitionStart && y.lazy.load()
                }
            },
            y.scrollbar = {
                isTouched: !1,
                setDragPosition: function(e) {
                    var t = y.scrollbar
                      , i = y.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY
                      , s = i - t.track.offset()[y.isHorizontal() ? "left" : "top"] - t.dragSize / 2
                      , a = -y.minTranslate() * t.moveDivider
                      , n = -y.maxTranslate() * t.moveDivider;
                    a > s ? s = a : s > n && (s = n),
                    s = -s / t.moveDivider,
                    y.updateProgress(s),
                    y.setWrapperTranslate(s, !0)
                },
                dragStart: function(e) {
                    var t = y.scrollbar;
                    t.isTouched = !0,
                    e.preventDefault(),
                    e.stopPropagation(),
                    t.setDragPosition(e),
                    clearTimeout(t.dragTimeout),
                    t.track.transition(0),
                    y.params.scrollbarHide && t.track.css("opacity", 1),
                    y.wrapper.transition(100),
                    t.drag.transition(100),
                    y.emit("onScrollbarDragStart", y)
                },
                dragMove: function(e) {
                    var t = y.scrollbar;
                    t.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1,
                    t.setDragPosition(e),
                    y.wrapper.transition(0),
                    t.track.transition(0),
                    t.drag.transition(0),
                    y.emit("onScrollbarDragMove", y))
                },
                dragEnd: function(e) {
                    var t = y.scrollbar;
                    t.isTouched && (t.isTouched = !1,
                    y.params.scrollbarHide && (clearTimeout(t.dragTimeout),
                    t.dragTimeout = setTimeout(function() {
                        t.track.css("opacity", 0),
                        t.track.transition(400)
                    }
                    , 1e3)),
                    y.emit("onScrollbarDragEnd", y),
                    y.params.scrollbarSnapOnRelease && y.slideReset())
                },
                enableDraggable: function() {
                    var e = y.scrollbar
                      , i = y.support.touch ? e.track : document;
                    t(e.track).on(y.touchEvents.start, e.dragStart),
                    t(i).on(y.touchEvents.move, e.dragMove),
                    t(i).on(y.touchEvents.end, e.dragEnd)
                },
                disableDraggable: function() {
                    var e = y.scrollbar
                      , i = y.support.touch ? e.track : document;
                    t(e.track).off(y.touchEvents.start, e.dragStart),
                    t(i).off(y.touchEvents.move, e.dragMove),
                    t(i).off(y.touchEvents.end, e.dragEnd)
                },
                set: function() {
                    if (y.params.scrollbar) {
                        var e = y.scrollbar;
                        e.track = t(y.params.scrollbar),
                        y.params.uniqueNavElements && "string" == typeof y.params.scrollbar && e.track.length > 1 && 1 === y.container.find(y.params.scrollbar).length && (e.track = y.container.find(y.params.scrollbar)),
                        e.drag = e.track.find(".swiper-scrollbar-drag"),
                        0 === e.drag.length && (e.drag = t('<div class="swiper-scrollbar-drag"></div>'),
                        e.track.append(e.drag)),
                        e.drag[0].style.width = "",
                        e.drag[0].style.height = "",
                        e.trackSize = y.isHorizontal() ? e.track[0].offsetWidth : e.track[0].offsetHeight,
                        e.divider = y.size / y.virtualSize,
                        e.moveDivider = e.divider * (e.trackSize / y.size),
                        e.dragSize = e.trackSize * e.divider,
                        y.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px" : e.drag[0].style.height = e.dragSize + "px",
                        e.divider >= 1 ? e.track[0].style.display = "none" : e.track[0].style.display = "",
                        y.params.scrollbarHide && (e.track[0].style.opacity = 0)
                    }
                },
                setTranslate: function() {
                    if (y.params.scrollbar) {
                        var e, t = y.scrollbar, i = (y.translate || 0,
                        t.dragSize);
                        e = (t.trackSize - t.dragSize) * y.progress,
                        y.rtl && y.isHorizontal() ? (e = -e,
                        e > 0 ? (i = t.dragSize - e,
                        e = 0) : -e + t.dragSize > t.trackSize && (i = t.trackSize + e)) : 0 > e ? (i = t.dragSize + e,
                        e = 0) : e + t.dragSize > t.trackSize && (i = t.trackSize - e),
                        y.isHorizontal() ? (y.support.transforms3d ? t.drag.transform("translate3d(" + e + "px, 0, 0)") : t.drag.transform("translateX(" + e + "px)"),
                        t.drag[0].style.width = i + "px") : (y.support.transforms3d ? t.drag.transform("translate3d(0px, " + e + "px, 0)") : t.drag.transform("translateY(" + e + "px)"),
                        t.drag[0].style.height = i + "px"),
                        y.params.scrollbarHide && (clearTimeout(t.timeout),
                        t.track[0].style.opacity = 1,
                        t.timeout = setTimeout(function() {
                            t.track[0].style.opacity = 0,
                            t.track.transition(400)
                        }
                        , 1e3))
                    }
                },
                setTransition: function(e) {
                    y.params.scrollbar && y.scrollbar.drag.transition(e)
                }
            },
            y.controller = {
                LinearSpline: function(e, t) {
                    this.x = e,
                    this.y = t,
                    this.lastIndex = e.length - 1;
                    var i, s;
                    this.x.length,
                    this.interpolate = function(e) {
                        return e ? (s = a(this.x, e),
                        i = s - 1,
                        (e - this.x[i]) * (this.y[s] - this.y[i]) / (this.x[s] - this.x[i]) + this.y[i]) : 0
                    }
                    ;
                    var a = function() {
                        var e, t, i;
                        return function(s, a) {
                            for (t = -1,
                            e = s.length; e - t > 1; )
                                s[i = e + t >> 1] <= a ? t = i : e = i;
                            return e
                        }
                    }
                    ()
                },
                getInterpolateFunction: function(e) {
                    y.controller.spline || (y.controller.spline = y.params.loop ? new y.controller.LinearSpline(y.slidesGrid,e.slidesGrid) : new y.controller.LinearSpline(y.snapGrid,e.snapGrid))
                },
                setTranslate: function(e, t) {
                    function s(t) {
                        e = t.rtl && "horizontal" === t.params.direction ? -y.translate : y.translate,
                        "slide" === y.params.controlBy && (y.controller.getInterpolateFunction(t),
                        n = -y.controller.spline.interpolate(-e)),
                        n && "container" !== y.params.controlBy || (a = (t.maxTranslate() - t.minTranslate()) / (y.maxTranslate() - y.minTranslate()),
                        n = (e - y.minTranslate()) * a + t.minTranslate()),
                        y.params.controlInverse && (n = t.maxTranslate() - n),
                        t.updateProgress(n),
                        t.setWrapperTranslate(n, !1, y),
                        t.updateActiveIndex()
                    }
                    var a, n, r = y.params.control;
                    if (y.isArray(r))
                        for (var o = 0; o < r.length; o++)
                            r[o] !== t && r[o] instanceof i && s(r[o]);
                    else
                        r instanceof i && t !== r && s(r)
                },
                setTransition: function(e, t) {
                    function s(t) {
                        t.setWrapperTransition(e, y),
                        0 !== e && (t.onTransitionStart(),
                        t.wrapper.transitionEnd(function() {
                            n && (t.params.loop && "slide" === y.params.controlBy && t.fixLoop(),
                            t.onTransitionEnd())
                        }
                        ))
                    }
                    var a, n = y.params.control;
                    if (y.isArray(n))
                        for (a = 0; a < n.length; a++)
                            n[a] !== t && n[a] instanceof i && s(n[a]);
                    else
                        n instanceof i && t !== n && s(n)
                }
            },
            y.hashnav = {
                init: function() {
                    if (y.params.hashnav) {
                        y.hashnav.initialized = !0;
                        var e = document.location.hash.replace("#", "");
                        if (e)
                            for (var t = 0, i = 0, s = y.slides.length; s > i; i++) {
                                var a = y.slides.eq(i)
                                  , n = a.attr("data-hash");
                                if (n === e && !a.hasClass(y.params.slideDuplicateClass)) {
                                    var r = a.index();
                                    y.slideTo(r, t, y.params.runCallbacksOnInit, !0)
                                }
                            }
                    }
                },
                setHash: function() {
                    y.hashnav.initialized && y.params.hashnav && (document.location.hash = y.slides.eq(y.activeIndex).attr("data-hash") || "")
                }
            },
            y.disableKeyboardControl = function() {
                y.params.keyboardControl = !1,
                t(document).off("keydown", l)
            }
            ,
            y.enableKeyboardControl = function() {
                y.params.keyboardControl = !0,
                t(document).on("keydown", l)
            }
            ,
            y.mousewheel = {
                event: !1,
                lastScrollTime: (new window.Date).getTime()
            },
            y.params.mousewheelControl) {
                try {
                    new window.WheelEvent("wheel"),
                    y.mousewheel.event = "wheel"
                } catch (A) {
                    (window.WheelEvent || y.container[0] && "wheel" in y.container[0]) && (y.mousewheel.event = "wheel")
                }
                !y.mousewheel.event && window.WheelEvent,
                y.mousewheel.event || void 0 === document.onmousewheel || (y.mousewheel.event = "mousewheel"),
                y.mousewheel.event || (y.mousewheel.event = "DOMMouseScroll")
            }
            y.disableMousewheelControl = function() {
                return y.mousewheel.event ? (y.container.off(y.mousewheel.event, p),
                !0) : !1
            }
            ,
            y.enableMousewheelControl = function() {
                return y.mousewheel.event ? (y.container.on(y.mousewheel.event, p),
                !0) : !1
            }
            ,
            y.parallax = {
                setTranslate: function() {
                    y.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        c(this, y.progress)
                    }
                    ),
                    y.slides.each(function() {
                        var e = t(this);
                        e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            var t = Math.min(Math.max(e[0].progress, -1), 1);
                            c(this, t)
                        }
                        )
                    }
                    )
                },
                setTransition: function(e) {
                    "undefined" == typeof e && (e = y.params.speed),
                    y.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        var i = t(this)
                          , s = parseInt(i.attr("data-swiper-parallax-duration"), 10) || e;
                        0 === e && (s = 0),
                        i.transition(s)
                    }
                    )
                }
            },
            y._plugins = [];
            for (var _ in y.plugins) {
                var O = y.plugins[_](y, y.params[_]);
                O && y._plugins.push(O)
            }
            return y.callPlugins = function(e) {
                for (var t = 0; t < y._plugins.length; t++)
                    e in y._plugins[t] && y._plugins[t][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            }
            ,
            y.emitterEventListeners = {},
            y.emit = function(e) {
                y.params[e] && y.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                var t;
                if (y.emitterEventListeners[e])
                    for (t = 0; t < y.emitterEventListeners[e].length; t++)
                        y.emitterEventListeners[e][t](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                y.callPlugins && y.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            }
            ,
            y.on = function(e, t) {
                return e = d(e),
                y.emitterEventListeners[e] || (y.emitterEventListeners[e] = []),
                y.emitterEventListeners[e].push(t),
                y
            }
            ,
            y.off = function(e, t) {
                var i;
                if (e = d(e),
                "undefined" == typeof t)
                    return y.emitterEventListeners[e] = [],
                    y;
                if (y.emitterEventListeners[e] && 0 !== y.emitterEventListeners[e].length) {
                    for (i = 0; i < y.emitterEventListeners[e].length; i++)
                        y.emitterEventListeners[e][i] === t && y.emitterEventListeners[e].splice(i, 1);
                    return y
                }
            }
            ,
            y.once = function(e, t) {
                e = d(e);
                var i = function() {
                    t(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]),
                    y.off(e, i)
                }
                ;
                return y.on(e, i),
                y
            }
            ,
            y.a11y = {
                makeFocusable: function(e) {
                    return e.attr("tabIndex", "0"),
                    e
                },
                addRole: function(e, t) {
                    return e.attr("role", t),
                    e
                },
                addLabel: function(e, t) {
                    return e.attr("aria-label", t),
                    e
                },
                disable: function(e) {
                    return e.attr("aria-disabled", !0),
                    e
                },
                enable: function(e) {
                    return e.attr("aria-disabled", !1),
                    e
                },
                onEnterKey: function(e) {
                    13 === e.keyCode && (t(e.target).is(y.params.nextButton) ? (y.onClickNext(e),
                    y.isEnd ? y.a11y.notify(y.params.lastSlideMessage) : y.a11y.notify(y.params.nextSlideMessage)) : t(e.target).is(y.params.prevButton) && (y.onClickPrev(e),
                    y.isBeginning ? y.a11y.notify(y.params.firstSlideMessage) : y.a11y.notify(y.params.prevSlideMessage)),
                    t(e.target).is("." + y.params.bulletClass) && t(e.target)[0].click())
                },
                liveRegion: t('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                notify: function(e) {
                    var t = y.a11y.liveRegion;
                    0 !== t.length && (t.html(""),
                    t.html(e))
                },
                init: function() {
                    y.params.nextButton && y.nextButton && y.nextButton.length > 0 && (y.a11y.makeFocusable(y.nextButton),
                    y.a11y.addRole(y.nextButton, "button"),
                    y.a11y.addLabel(y.nextButton, y.params.nextSlideMessage)),
                    y.params.prevButton && y.prevButton && y.prevButton.length > 0 && (y.a11y.makeFocusable(y.prevButton),
                    y.a11y.addRole(y.prevButton, "button"),
                    y.a11y.addLabel(y.prevButton, y.params.prevSlideMessage)),
                    t(y.container).append(y.a11y.liveRegion)
                },
                initPagination: function() {
                    y.params.pagination && y.params.paginationClickable && y.bullets && y.bullets.length && y.bullets.each(function() {
                        var e = t(this);
                        y.a11y.makeFocusable(e),
                        y.a11y.addRole(e, "button"),
                        y.a11y.addLabel(e, y.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1))
                    }
                    )
                },
                destroy: function() {
                    y.a11y.liveRegion && y.a11y.liveRegion.length > 0 && y.a11y.liveRegion.remove()
                }
            },
            y.init = function() {
                y.params.loop && y.createLoop(),
                y.updateContainerSize(),
                y.updateSlidesSize(),
                y.updatePagination(),
                y.params.scrollbar && y.scrollbar && (y.scrollbar.set(),
                y.params.scrollbarDraggable && y.scrollbar.enableDraggable()),
                "slide" !== y.params.effect && y.effects[y.params.effect] && (y.params.loop || y.updateProgress(),
                y.effects[y.params.effect].setTranslate()),
                y.params.loop ? y.slideTo(y.params.initialSlide + y.loopedSlides, 0, y.params.runCallbacksOnInit) : (y.slideTo(y.params.initialSlide, 0, y.params.runCallbacksOnInit),
                0 === y.params.initialSlide && (y.parallax && y.params.parallax && y.parallax.setTranslate(),
                y.lazy && y.params.lazyLoading && (y.lazy.load(),
                y.lazy.initialImageLoaded = !0))),
                y.attachEvents(),
                y.params.observer && y.support.observer && y.initObservers(),
                y.params.preloadImages && !y.params.lazyLoading && y.preloadImages(),
                y.params.autoplay && y.startAutoplay(),
                y.params.keyboardControl && y.enableKeyboardControl && y.enableKeyboardControl(),
                y.params.mousewheelControl && y.enableMousewheelControl && y.enableMousewheelControl(),
                y.params.hashnav && y.hashnav && y.hashnav.init(),
                y.params.a11y && y.a11y && y.a11y.init(),
                y.emit("onInit", y)
            }
            ,
            y.cleanupStyles = function() {
                y.container.removeClass(y.classNames.join(" ")).removeAttr("style"),
                y.wrapper.removeAttr("style"),
                y.slides && y.slides.length && y.slides.removeClass([y.params.slideVisibleClass, y.params.slideActiveClass, y.params.slideNextClass, y.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),
                y.paginationContainer && y.paginationContainer.length && y.paginationContainer.removeClass(y.params.paginationHiddenClass),
                y.bullets && y.bullets.length && y.bullets.removeClass(y.params.bulletActiveClass),
                y.params.prevButton && t(y.params.prevButton).removeClass(y.params.buttonDisabledClass),
                y.params.nextButton && t(y.params.nextButton).removeClass(y.params.buttonDisabledClass),
                y.params.scrollbar && y.scrollbar && (y.scrollbar.track && y.scrollbar.track.length && y.scrollbar.track.removeAttr("style"),
                y.scrollbar.drag && y.scrollbar.drag.length && y.scrollbar.drag.removeAttr("style"))
            }
            ,
            y.destroy = function(e, t) {
                y.detachEvents(),
                y.stopAutoplay(),
                y.params.scrollbar && y.scrollbar && y.params.scrollbarDraggable && y.scrollbar.disableDraggable(),
                y.params.loop && y.destroyLoop(),
                t && y.cleanupStyles(),
                y.disconnectObservers(),
                y.params.keyboardControl && y.disableKeyboardControl && y.disableKeyboardControl(),
                y.params.mousewheelControl && y.disableMousewheelControl && y.disableMousewheelControl(),
                y.params.a11y && y.a11y && y.a11y.destroy(),
                y.emit("onDestroy"),
                e !== !1 && (y = null )
            }
            ,
            y.init(),
            y
        }
    }
    ;
    i.prototype = {
        isSafari: function() {
            var e = navigator.userAgent.toLowerCase();
            return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
        }
        (),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function(e) {
            return "[object Array]" === Object.prototype.toString.apply(e)
        },
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
        },
        device: function() {
            var e = navigator.userAgent
              , t = e.match(/(Android);?[\s\/]+([\d.]+)?/)
              , i = e.match(/(iPad).*OS\s([\d_]+)/)
              , s = e.match(/(iPod)(.*OS\s([\d_]+))?/)
              , a = !i && e.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: i || a || s,
                android: t
            }
        }
        (),
        support: {
            touch: window.Modernizr && Modernizr.touch === !0 || function() {
                return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
            }
            (),
            transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function() {
                var e = document.createElement("div").style;
                return "webkitPerspective" in e || "MozPerspective" in e || "OPerspective" in e || "MsPerspective" in e || "perspective" in e
            }
            (),
            flexbox: function() {
                for (var e = document.createElement("div").style, t = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), i = 0; i < t.length; i++)
                    if (t[i] in e)
                        return !0
            }
            (),
            observer: function() {
                return "MutationObserver" in window || "WebkitMutationObserver" in window
            }
            ()
        },
        plugins: {}
    };
    for (var s = ["jQuery", "Zepto", "Dom7"], a = 0; a < s.length; a++)
        window[s[a]] && e(window[s[a]]);
    var n;
    n = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7,
    n && ("transitionEnd" in n.fn || (n.fn.transitionEnd = function(e) {
        function t(n) {
            if (n.target === this)
                for (e.call(this, n),
                i = 0; i < s.length; i++)
                    a.off(s[i], t)
        }
        var i, s = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], a = this;
        if (e)
            for (i = 0; i < s.length; i++)
                a.on(s[i], t);
        return this
    }
    ),
    "transform" in n.fn || (n.fn.transform = function(e) {
        for (var t = 0; t < this.length; t++) {
            var i = this[t].style;
            i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = e
        }
        return this
    }
    ),
    "transition" in n.fn || (n.fn.transition = function(e) {
        "string" != typeof e && (e += "ms");
        for (var t = 0; t < this.length; t++) {
            var i = this[t].style;
            i.webkitTransitionDuration = i.MsTransitionDuration = i.msTransitionDuration = i.MozTransitionDuration = i.OTransitionDuration = i.transitionDuration = e
        }
        return this
    }
    )),
    window.Swiper = i
}
(),
"undefined" != typeof module ? module.exports = window.Swiper : "function" == typeof define && define.amd && define([], function() {
    "use strict";
    return window.Swiper
}
),
!function(e) {
    "use strict";
    function t(e, t) {
        var i = (65535 & e) + (65535 & t)
          , s = (e >> 16) + (t >> 16) + (i >> 16);
        return s << 16 | 65535 & i
    }
    function i(e, t) {
        return e << t | e >>> 32 - t
    }
    function s(e, s, a, n, r, o) {
        return t(i(t(t(s, e), t(n, o)), r), a)
    }
    function a(e, t, i, a, n, r, o) {
        return s(t & i | ~t & a, e, t, n, r, o)
    }
    function n(e, t, i, a, n, r, o) {
        return s(t & a | i & ~a, e, t, n, r, o)
    }
    function r(e, t, i, a, n, r, o) {
        return s(t ^ i ^ a, e, t, n, r, o)
    }
    function o(e, t, i, a, n, r, o) {
        return s(i ^ (t | ~a), e, t, n, r, o)
    }
    function l(e, i) {
        e[i >> 5] |= 128 << i % 32,
        e[(i + 64 >>> 9 << 4) + 14] = i;
        var s, l, p, c, d, h = 1732584193, u = -271733879, f = -1732584194, m = 271733878;
        for (s = 0; s < e.length; s += 16)
            l = h,
            p = u,
            c = f,
            d = m,
            h = a(h, u, f, m, e[s], 7, -680876936),
            m = a(m, h, u, f, e[s + 1], 12, -389564586),
            f = a(f, m, h, u, e[s + 2], 17, 606105819),
            u = a(u, f, m, h, e[s + 3], 22, -1044525330),
            h = a(h, u, f, m, e[s + 4], 7, -176418897),
            m = a(m, h, u, f, e[s + 5], 12, 1200080426),
            f = a(f, m, h, u, e[s + 6], 17, -1473231341),
            u = a(u, f, m, h, e[s + 7], 22, -45705983),
            h = a(h, u, f, m, e[s + 8], 7, 1770035416),
            m = a(m, h, u, f, e[s + 9], 12, -1958414417),
            f = a(f, m, h, u, e[s + 10], 17, -42063),
            u = a(u, f, m, h, e[s + 11], 22, -1990404162),
            h = a(h, u, f, m, e[s + 12], 7, 1804603682),
            m = a(m, h, u, f, e[s + 13], 12, -40341101),
            f = a(f, m, h, u, e[s + 14], 17, -1502002290),
            u = a(u, f, m, h, e[s + 15], 22, 1236535329),
            h = n(h, u, f, m, e[s + 1], 5, -165796510),
            m = n(m, h, u, f, e[s + 6], 9, -1069501632),
            f = n(f, m, h, u, e[s + 11], 14, 643717713),
            u = n(u, f, m, h, e[s], 20, -373897302),
            h = n(h, u, f, m, e[s + 5], 5, -701558691),
            m = n(m, h, u, f, e[s + 10], 9, 38016083),
            f = n(f, m, h, u, e[s + 15], 14, -660478335),
            u = n(u, f, m, h, e[s + 4], 20, -405537848),
            h = n(h, u, f, m, e[s + 9], 5, 568446438),
            m = n(m, h, u, f, e[s + 14], 9, -1019803690),
            f = n(f, m, h, u, e[s + 3], 14, -187363961),
            u = n(u, f, m, h, e[s + 8], 20, 1163531501),
            h = n(h, u, f, m, e[s + 13], 5, -1444681467),
            m = n(m, h, u, f, e[s + 2], 9, -51403784),
            f = n(f, m, h, u, e[s + 7], 14, 1735328473),
            u = n(u, f, m, h, e[s + 12], 20, -1926607734),
            h = r(h, u, f, m, e[s + 5], 4, -378558),
            m = r(m, h, u, f, e[s + 8], 11, -2022574463),
            f = r(f, m, h, u, e[s + 11], 16, 1839030562),
            u = r(u, f, m, h, e[s + 14], 23, -35309556),
            h = r(h, u, f, m, e[s + 1], 4, -1530992060),
            m = r(m, h, u, f, e[s + 4], 11, 1272893353),
            f = r(f, m, h, u, e[s + 7], 16, -155497632),
            u = r(u, f, m, h, e[s + 10], 23, -1094730640),
            h = r(h, u, f, m, e[s + 13], 4, 681279174),
            m = r(m, h, u, f, e[s], 11, -358537222),
            f = r(f, m, h, u, e[s + 3], 16, -722521979),
            u = r(u, f, m, h, e[s + 6], 23, 76029189),
            h = r(h, u, f, m, e[s + 9], 4, -640364487),
            m = r(m, h, u, f, e[s + 12], 11, -421815835),
            f = r(f, m, h, u, e[s + 15], 16, 530742520),
            u = r(u, f, m, h, e[s + 2], 23, -995338651),
            h = o(h, u, f, m, e[s], 6, -198630844),
            m = o(m, h, u, f, e[s + 7], 10, 1126891415),
            f = o(f, m, h, u, e[s + 14], 15, -1416354905),
            u = o(u, f, m, h, e[s + 5], 21, -57434055),
            h = o(h, u, f, m, e[s + 12], 6, 1700485571),
            m = o(m, h, u, f, e[s + 3], 10, -1894986606),
            f = o(f, m, h, u, e[s + 10], 15, -1051523),
            u = o(u, f, m, h, e[s + 1], 21, -2054922799),
            h = o(h, u, f, m, e[s + 8], 6, 1873313359),
            m = o(m, h, u, f, e[s + 15], 10, -30611744),
            f = o(f, m, h, u, e[s + 6], 15, -1560198380),
            u = o(u, f, m, h, e[s + 13], 21, 1309151649),
            h = o(h, u, f, m, e[s + 4], 6, -145523070),
            m = o(m, h, u, f, e[s + 11], 10, -1120210379),
            f = o(f, m, h, u, e[s + 2], 15, 718787259),
            u = o(u, f, m, h, e[s + 9], 21, -343485551),
            h = t(h, l),
            u = t(u, p),
            f = t(f, c),
            m = t(m, d);
        return [h, u, f, m]
    }
    function p(e) {
        var t, i = "";
        for (t = 0; t < 32 * e.length; t += 8)
            i += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        return i
    }
    function c(e) {
        var t, i = [];
        for (i[(e.length >> 2) - 1] = void 0,
        t = 0; t < i.length; t += 1)
            i[t] = 0;
        for (t = 0; t < 8 * e.length; t += 8)
            i[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        return i
    }
    function d(e) {
        return p(l(c(e), 8 * e.length))
    }
    function h(e, t) {
        var i, s, a = c(e), n = [], r = [];
        for (n[15] = r[15] = void 0,
        a.length > 16 && (a = l(a, 8 * e.length)),
        i = 0; 16 > i; i += 1)
            n[i] = 909522486 ^ a[i],
            r[i] = 1549556828 ^ a[i];
        return s = l(n.concat(c(t)), 512 + 8 * t.length),
        p(l(r.concat(s), 640))
    }
    function u(e) {
        var t, i, s = "0123456789abcdef", a = "";
        for (i = 0; i < e.length; i += 1)
            t = e.charCodeAt(i),
            a += s.charAt(t >>> 4 & 15) + s.charAt(15 & t);
        return a
    }
    function f(e) {
        return unescape(encodeURIComponent(e))
    }
    function m(e) {
        return d(f(e))
    }
    function g(e) {
        return u(m(e))
    }
    function v(e, t) {
        return h(f(e), f(t))
    }
    function w(e, t) {
        return u(v(e, t))
    }
    function y(e, t, i) {
        return t ? i ? v(t, e) : w(t, e) : i ? m(e) : g(e)
    }
    "function" == typeof define && define.amd ? define(function() {
        return y
    }
    ) : e.md5 = y
}
(this),
function(e) {
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
}
($);
