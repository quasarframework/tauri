var app = (function () {
  'use strict'
  function t() {}
  function e(t) {
    return t()
  }
  function n() {
    return Object.create(null)
  }
  function i(t) {
    t.forEach(e)
  }
  function o(t) {
    return 'function' == typeof t
  }
  function r(t, e) {
    return t != t
      ? e == e
      : t !== e || (t && 'object' == typeof t) || 'function' == typeof t
  }
  function u(e, n, i) {
    e.$$.on_destroy.push(
      (function (e, ...n) {
        if (null == e) return t
        const i = e.subscribe(...n)
        return i.unsubscribe ? () => i.unsubscribe() : i
      })(n, i)
    )
  }
  function s(t, e) {
    t.appendChild(e)
  }
  function c(t, e, n) {
    t.insertBefore(e, n || null)
  }
  function a(t) {
    t.parentNode.removeChild(t)
  }
  function l(t, e) {
    for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e)
  }
  function d(t) {
    return document.createElement(t)
  }
  function f(t) {
    return document.createTextNode(t)
  }
  function h() {
    return f(' ')
  }
  function p(t, e, n, i) {
    return t.addEventListener(e, n, i), () => t.removeEventListener(e, n, i)
  }
  function v(t) {
    return function (e) {
      return e.preventDefault(), t.call(this, e)
    }
  }
  function m(t, e, n) {
    null == n
      ? t.removeAttribute(e)
      : t.getAttribute(e) !== n && t.setAttribute(e, n)
  }
  function g(t) {
    return '' === t ? null : +t
  }
  function y(t, e) {
    ;(e = '' + e), t.wholeText !== e && (t.data = e)
  }
  function b(t, e) {
    t.value = null == e ? '' : e
  }
  function _(t, e, n, i) {
    t.style.setProperty(e, n, i ? 'important' : '')
  }
  function w(t, e) {
    for (let n = 0; n < t.options.length; n += 1) {
      const i = t.options[n]
      if (i.__value === e) return void (i.selected = !0)
    }
  }
  class x {
    constructor(t = null) {
      ;(this.a = t), (this.e = this.n = null)
    }
    m(t, e, n = null) {
      this.e || ((this.e = d(e.nodeName)), (this.t = e), this.h(t)), this.i(n)
    }
    h(t) {
      ;(this.e.innerHTML = t), (this.n = Array.from(this.e.childNodes))
    }
    i(t) {
      for (let e = 0; e < this.n.length; e += 1) c(this.t, this.n[e], t)
    }
    p(t) {
      this.d(), this.h(t), this.i(this.a)
    }
    d() {
      this.n.forEach(a)
    }
  }
  let M
  function k(t) {
    M = t
  }
  function C() {
    if (!M) throw new Error('Function called outside component initialization')
    return M
  }
  function $(t) {
    C().$$.on_mount.push(t)
  }
  function T(t) {
    C().$$.on_destroy.push(t)
  }
  const O = [],
    E = [],
    S = [],
    P = [],
    z = Promise.resolve()
  let A = !1
  function j(t) {
    S.push(t)
  }
  let W = !1
  const L = new Set()
  function F() {
    if (!W) {
      W = !0
      do {
        for (let t = 0; t < O.length; t += 1) {
          const e = O[t]
          k(e), D(e.$$)
        }
        for (k(null), O.length = 0; E.length; ) E.pop()()
        for (let t = 0; t < S.length; t += 1) {
          const e = S[t]
          L.has(e) || (L.add(e), e())
        }
        S.length = 0
      } while (O.length)
      for (; P.length; ) P.pop()()
      ;(A = !1), (W = !1), L.clear()
    }
  }
  function D(t) {
    if (null !== t.fragment) {
      t.update(), i(t.before_update)
      const e = t.dirty
      ;(t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, e),
        t.after_update.forEach(j)
    }
  }
  const R = new Set()
  let I
  function U(t, e) {
    t && t.i && (R.delete(t), t.i(e))
  }
  function N(t, e, n, i) {
    if (t && t.o) {
      if (R.has(t)) return
      R.add(t),
        I.c.push(() => {
          R.delete(t), i && (n && t.d(1), i())
        }),
        t.o(e)
    }
  }
  function K(t) {
    t && t.c()
  }
  function q(t, n, r, u) {
    const { fragment: s, on_mount: c, on_destroy: a, after_update: l } = t.$$
    s && s.m(n, r),
      u ||
        j(() => {
          const n = c.map(e).filter(o)
          a ? a.push(...n) : i(n), (t.$$.on_mount = [])
        }),
      l.forEach(j)
  }
  function B(t, e) {
    const n = t.$$
    null !== n.fragment &&
      (i(n.on_destroy),
      n.fragment && n.fragment.d(e),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []))
  }
  function H(t, e) {
    ;-1 === t.$$.dirty[0] &&
      (O.push(t), A || ((A = !0), z.then(F)), t.$$.dirty.fill(0)),
      (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31)
  }
  function G(e, o, r, u, s, c, l = [-1]) {
    const d = M
    k(e)
    const f = (e.$$ = {
      fragment: null,
      ctx: null,
      props: c,
      update: t,
      not_equal: s,
      bound: n(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(d ? d.$$.context : []),
      callbacks: n(),
      dirty: l,
      skip_bound: !1
    })
    let h = !1
    if (
      ((f.ctx = r
        ? r(e, o.props || {}, (t, n, ...i) => {
            const o = i.length ? i[0] : n
            return (
              f.ctx &&
                s(f.ctx[t], (f.ctx[t] = o)) &&
                (!f.skip_bound && f.bound[t] && f.bound[t](o), h && H(e, t)),
              n
            )
          })
        : []),
      f.update(),
      (h = !0),
      i(f.before_update),
      (f.fragment = !!u && u(f.ctx)),
      o.target)
    ) {
      if (o.hydrate) {
        const t = (function (t) {
          return Array.from(t.childNodes)
        })(o.target)
        f.fragment && f.fragment.l(t), t.forEach(a)
      } else f.fragment && f.fragment.c()
      o.intro && U(e.$$.fragment),
        q(e, o.target, o.anchor, o.customElement),
        F()
    }
    k(d)
  }
  class V {
    $destroy() {
      B(this, 1), (this.$destroy = t)
    }
    $on(t, e) {
      const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = [])
      return (
        n.push(e),
        () => {
          const t = n.indexOf(e)
          ;-1 !== t && n.splice(t, 1)
        }
      )
    }
    $set(t) {
      var e
      this.$$set &&
        ((e = t), 0 !== Object.keys(e).length) &&
        ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1))
    }
  }
  const J = []
  function X(e, n = t) {
    let i
    const o = []
    function u(t) {
      if (r(e, t) && ((e = t), i)) {
        const t = !J.length
        for (let t = 0; t < o.length; t += 1) {
          const n = o[t]
          n[1](), J.push(n, e)
        }
        if (t) {
          for (let t = 0; t < J.length; t += 2) J[t][0](J[t + 1])
          J.length = 0
        }
      }
    }
    return {
      set: u,
      update: function (t) {
        u(t(e))
      },
      subscribe: function (r, s = t) {
        const c = [r, s]
        return (
          o.push(c),
          1 === o.length && (i = n(u) || t),
          r(e),
          () => {
            const t = o.indexOf(c)
            ;-1 !== t && o.splice(t, 1), 0 === o.length && (i(), (i = null))
          }
        )
      }
    }
  }
  /*!
   * hotkeys-js v3.8.5
   * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies.
   *
   * Copyright (c) 2021 kenny wong <wowohoo@qq.com>
   * http://jaywcjlove.github.io/hotkeys
   *
   * Licensed under the MIT license.
   */ var Y =
    'undefined' != typeof navigator &&
    navigator.userAgent.toLowerCase().indexOf('firefox') > 0
  function Q(t, e, n) {
    t.addEventListener
      ? t.addEventListener(e, n, !1)
      : t.attachEvent &&
        t.attachEvent('on'.concat(e), function () {
          n(window.event)
        })
  }
  function Z(t, e) {
    for (var n = e.slice(0, e.length - 1), i = 0; i < n.length; i++)
      n[i] = t[n[i].toLowerCase()]
    return n
  }
  function tt(t) {
    'string' != typeof t && (t = '')
    for (
      var e = (t = t.replace(/\s/g, '')).split(','), n = e.lastIndexOf('');
      n >= 0;

    )
      (e[n - 1] += ','), e.splice(n, 1), (n = e.lastIndexOf(''))
    return e
  }
  for (
    var et = {
        backspace: 8,
        tab: 9,
        clear: 12,
        enter: 13,
        return: 13,
        esc: 27,
        escape: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        del: 46,
        delete: 46,
        ins: 45,
        insert: 45,
        home: 36,
        end: 35,
        pageup: 33,
        pagedown: 34,
        capslock: 20,
        num_0: 96,
        num_1: 97,
        num_2: 98,
        num_3: 99,
        num_4: 100,
        num_5: 101,
        num_6: 102,
        num_7: 103,
        num_8: 104,
        num_9: 105,
        num_multiply: 106,
        num_add: 107,
        num_enter: 108,
        num_subtract: 109,
        num_decimal: 110,
        num_divide: 111,
        '⇪': 20,
        ',': 188,
        '.': 190,
        '/': 191,
        '`': 192,
        '-': Y ? 173 : 189,
        '=': Y ? 61 : 187,
        ';': Y ? 59 : 186,
        "'": 222,
        '[': 219,
        ']': 221,
        '\\': 220
      },
      nt = {
        '⇧': 16,
        shift: 16,
        '⌥': 18,
        alt: 18,
        option: 18,
        '⌃': 17,
        ctrl: 17,
        control: 17,
        '⌘': 91,
        cmd: 91,
        command: 91
      },
      it = {
        16: 'shiftKey',
        18: 'altKey',
        17: 'ctrlKey',
        91: 'metaKey',
        shiftKey: 16,
        ctrlKey: 17,
        altKey: 18,
        metaKey: 91
      },
      ot = { 16: !1, 18: !1, 17: !1, 91: !1 },
      rt = {},
      ut = 1;
    ut < 20;
    ut++
  )
    et['f'.concat(ut)] = 111 + ut
  var st = [],
    ct = 'all',
    at = [],
    lt = function (t) {
      return (
        et[t.toLowerCase()] ||
        nt[t.toLowerCase()] ||
        t.toUpperCase().charCodeAt(0)
      )
    }
  function dt(t) {
    ct = t || 'all'
  }
  function ft() {
    return ct || 'all'
  }
  var ht = function (t) {
    var e = t.key,
      n = t.scope,
      i = t.method,
      o = t.splitKey,
      r = void 0 === o ? '+' : o
    tt(e).forEach(function (t) {
      var e = t.split(r),
        o = e.length,
        u = e[o - 1],
        s = '*' === u ? '*' : lt(u)
      if (rt[s]) {
        n || (n = ft())
        var c = o > 1 ? Z(nt, e) : []
        rt[s] = rt[s].map(function (t) {
          return (!i || t.method === i) &&
            t.scope === n &&
            (function (t, e) {
              for (
                var n = t.length >= e.length ? t : e,
                  i = t.length >= e.length ? e : t,
                  o = !0,
                  r = 0;
                r < n.length;
                r++
              )
                -1 === i.indexOf(n[r]) && (o = !1)
              return o
            })(t.mods, c)
            ? {}
            : t
        })
      }
    })
  }
  function pt(t, e, n) {
    var i
    if (e.scope === n || 'all' === e.scope) {
      for (var o in ((i = e.mods.length > 0), ot))
        Object.prototype.hasOwnProperty.call(ot, o) &&
          ((!ot[o] && e.mods.indexOf(+o) > -1) ||
            (ot[o] && -1 === e.mods.indexOf(+o))) &&
          (i = !1)
      ;((0 !== e.mods.length || ot[16] || ot[18] || ot[17] || ot[91]) &&
        !i &&
        '*' !== e.shortcut) ||
        (!1 === e.method(t, e) &&
          (t.preventDefault ? t.preventDefault() : (t.returnValue = !1),
          t.stopPropagation && t.stopPropagation(),
          t.cancelBubble && (t.cancelBubble = !0)))
    }
  }
  function vt(t) {
    var e = rt['*'],
      n = t.keyCode || t.which || t.charCode
    if (mt.filter.call(this, t)) {
      if (
        ((93 !== n && 224 !== n) || (n = 91),
        -1 === st.indexOf(n) && 229 !== n && st.push(n),
        ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (e) {
          var n = it[e]
          t[e] && -1 === st.indexOf(n)
            ? st.push(n)
            : !t[e] && st.indexOf(n) > -1
            ? st.splice(st.indexOf(n), 1)
            : 'metaKey' === e &&
              t[e] &&
              3 === st.length &&
              (t.ctrlKey ||
                t.shiftKey ||
                t.altKey ||
                (st = st.slice(st.indexOf(n))))
        }),
        n in ot)
      ) {
        for (var i in ((ot[n] = !0), nt)) nt[i] === n && (mt[i] = !0)
        if (!e) return
      }
      for (var o in ot)
        Object.prototype.hasOwnProperty.call(ot, o) && (ot[o] = t[it[o]])
      t.getModifierState &&
        (!t.altKey || t.ctrlKey) &&
        t.getModifierState('AltGraph') &&
        (-1 === st.indexOf(17) && st.push(17),
        -1 === st.indexOf(18) && st.push(18),
        (ot[17] = !0),
        (ot[18] = !0))
      var r = ft()
      if (e)
        for (var u = 0; u < e.length; u++)
          e[u].scope === r &&
            (('keydown' === t.type && e[u].keydown) ||
              ('keyup' === t.type && e[u].keyup)) &&
            pt(t, e[u], r)
      if (n in rt)
        for (var s = 0; s < rt[n].length; s++)
          if (
            (('keydown' === t.type && rt[n][s].keydown) ||
              ('keyup' === t.type && rt[n][s].keyup)) &&
            rt[n][s].key
          ) {
            for (
              var c = rt[n][s],
                a = c.splitKey,
                l = c.key.split(a),
                d = [],
                f = 0;
              f < l.length;
              f++
            )
              d.push(lt(l[f]))
            d.sort().join('') === st.sort().join('') && pt(t, c, r)
          }
    }
  }
  function mt(t, e, n) {
    st = []
    var i = tt(t),
      o = [],
      r = 'all',
      u = document,
      s = 0,
      c = !1,
      a = !0,
      l = '+'
    for (
      void 0 === n && 'function' == typeof e && (n = e),
        '[object Object]' === Object.prototype.toString.call(e) &&
          (e.scope && (r = e.scope),
          e.element && (u = e.element),
          e.keyup && (c = e.keyup),
          void 0 !== e.keydown && (a = e.keydown),
          'string' == typeof e.splitKey && (l = e.splitKey)),
        'string' == typeof e && (r = e);
      s < i.length;
      s++
    )
      (o = []),
        (t = i[s].split(l)).length > 1 && (o = Z(nt, t)),
        (t = '*' === (t = t[t.length - 1]) ? '*' : lt(t)) in rt || (rt[t] = []),
        rt[t].push({
          keyup: c,
          keydown: a,
          scope: r,
          mods: o,
          shortcut: i[s],
          method: n,
          key: i[s],
          splitKey: l
        })
    void 0 !== u &&
      !(function (t) {
        return at.indexOf(t) > -1
      })(u) &&
      window &&
      (at.push(u),
      Q(u, 'keydown', function (t) {
        vt(t)
      }),
      Q(window, 'focus', function () {
        st = []
      }),
      Q(u, 'keyup', function (t) {
        vt(t),
          (function (t) {
            var e = t.keyCode || t.which || t.charCode,
              n = st.indexOf(e)
            if (
              (n >= 0 && st.splice(n, 1),
              t.key &&
                'meta' === t.key.toLowerCase() &&
                st.splice(0, st.length),
              (93 !== e && 224 !== e) || (e = 91),
              e in ot)
            )
              for (var i in ((ot[e] = !1), nt)) nt[i] === e && (mt[i] = !1)
          })(t)
      }))
  }
  var gt = {
    setScope: dt,
    getScope: ft,
    deleteScope: function (t, e) {
      var n, i
      for (var o in (t || (t = ft()), rt))
        if (Object.prototype.hasOwnProperty.call(rt, o))
          for (n = rt[o], i = 0; i < n.length; )
            n[i].scope === t ? n.splice(i, 1) : i++
      ft() === t && dt(e || 'all')
    },
    getPressedKeyCodes: function () {
      return st.slice(0)
    },
    isPressed: function (t) {
      return 'string' == typeof t && (t = lt(t)), -1 !== st.indexOf(t)
    },
    filter: function (t) {
      var e = t.target || t.srcElement,
        n = e.tagName,
        i = !0
      return (
        (!e.isContentEditable &&
          (('INPUT' !== n && 'TEXTAREA' !== n && 'SELECT' !== n) ||
            e.readOnly)) ||
          (i = !1),
        i
      )
    },
    unbind: function (t) {
      if (t) {
        if (Array.isArray(t))
          t.forEach(function (t) {
            t.key && ht(t)
          })
        else if ('object' == typeof t) t.key && ht(t)
        else if ('string' == typeof t) {
          for (
            var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1;
            i < e;
            i++
          )
            n[i - 1] = arguments[i]
          var o = n[0],
            r = n[1]
          'function' == typeof o && ((r = o), (o = '')),
            ht({ key: t, scope: o, method: r, splitKey: '+' })
        }
      } else
        Object.keys(rt).forEach(function (t) {
          return delete rt[t]
        })
    }
  }
  for (var yt in gt)
    Object.prototype.hasOwnProperty.call(gt, yt) && (mt[yt] = gt[yt])
  if ('undefined' != typeof window) {
    var bt = window.hotkeys
    ;(mt.noConflict = function (t) {
      return t && window.hotkeys === mt && (window.hotkeys = bt), mt
    }),
      (window.hotkeys = mt)
  }
  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */ var _t =
    function (t, e) {
      return (_t =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (t, e) {
            t.__proto__ = e
          }) ||
        function (t, e) {
          for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
        })(t, e)
    }
  function wt(t, e) {
    if ('function' != typeof e && null !== e)
      throw new TypeError(
        'Class extends value ' + String(e) + ' is not a constructor or null'
      )
    function n() {
      this.constructor = t
    }
    _t(t, e),
      (t.prototype =
        null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()))
  }
  var xt = function () {
    return (xt =
      Object.assign ||
      function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++)
          for (var o in (e = arguments[n]))
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o])
        return t
      }).apply(this, arguments)
  }
  function Mt(t, e, n, i) {
    return new (n || (n = Promise))(function (o, r) {
      function u(t) {
        try {
          c(i.next(t))
        } catch (t) {
          r(t)
        }
      }
      function s(t) {
        try {
          c(i.throw(t))
        } catch (t) {
          r(t)
        }
      }
      function c(t) {
        var e
        t.done
          ? o(t.value)
          : ((e = t.value),
            e instanceof n
              ? e
              : new n(function (t) {
                  t(e)
                })).then(u, s)
      }
      c((i = i.apply(t, e || [])).next())
    })
  }
  function kt(t, e) {
    var n,
      i,
      o,
      r,
      u = {
        label: 0,
        sent: function () {
          if (1 & o[0]) throw o[1]
          return o[1]
        },
        trys: [],
        ops: []
      }
    return (
      (r = { next: s(0), throw: s(1), return: s(2) }),
      'function' == typeof Symbol &&
        (r[Symbol.iterator] = function () {
          return this
        }),
      r
    )
    function s(r) {
      return function (s) {
        return (function (r) {
          if (n) throw new TypeError('Generator is already executing.')
          for (; u; )
            try {
              if (
                ((n = 1),
                i &&
                  (o =
                    2 & r[0]
                      ? i.return
                      : r[0]
                      ? i.throw || ((o = i.return) && o.call(i), 0)
                      : i.next) &&
                  !(o = o.call(i, r[1])).done)
              )
                return o
              switch (((i = 0), o && (r = [2 & r[0], o.value]), r[0])) {
                case 0:
                case 1:
                  o = r
                  break
                case 4:
                  return u.label++, { value: r[1], done: !1 }
                case 5:
                  u.label++, (i = r[1]), (r = [0])
                  continue
                case 7:
                  ;(r = u.ops.pop()), u.trys.pop()
                  continue
                default:
                  if (
                    !(
                      (o = (o = u.trys).length > 0 && o[o.length - 1]) ||
                      (6 !== r[0] && 2 !== r[0])
                    )
                  ) {
                    u = 0
                    continue
                  }
                  if (3 === r[0] && (!o || (r[1] > o[0] && r[1] < o[3]))) {
                    u.label = r[1]
                    break
                  }
                  if (6 === r[0] && u.label < o[1]) {
                    ;(u.label = o[1]), (o = r)
                    break
                  }
                  if (o && u.label < o[2]) {
                    ;(u.label = o[2]), u.ops.push(r)
                    break
                  }
                  o[2] && u.ops.pop(), u.trys.pop()
                  continue
              }
              r = e.call(t, u)
            } catch (t) {
              ;(r = [6, t]), (i = 0)
            } finally {
              n = o = 0
            }
          if (5 & r[0]) throw r[1]
          return { value: r[0] ? r[1] : void 0, done: !0 }
        })([r, s])
      }
    }
  }
  function Ct(t, e) {
    void 0 === e && (e = !1)
    var n = (function () {
      var t = new Int8Array(1)
      window.crypto.getRandomValues(t)
      var e = new Uint8Array(Math.max(16, Math.abs(t[0])))
      return window.crypto.getRandomValues(e), e.join('')
    })()
    return (
      Object.defineProperty(window, n, {
        value: function (i) {
          return (
            e && Reflect.deleteProperty(window, n), null == t ? void 0 : t(i)
          )
        },
        writable: !1,
        configurable: !0
      }),
      n
    )
  }
  function $t(t, e) {
    return (
      void 0 === e && (e = {}),
      Mt(this, void 0, void 0, function () {
        return kt(this, function (n) {
          return [
            2,
            new Promise(function (n, i) {
              var o = Ct(function (t) {
                  n(t), Reflect.deleteProperty(window, r)
                }, !0),
                r = Ct(function (t) {
                  i(t), Reflect.deleteProperty(window, o)
                }, !0)
              window.rpc.notify(
                t,
                xt(
                  { __invokeKey: __TAURI_INVOKE_KEY__, callback: o, error: r },
                  e
                )
              )
            })
          ]
        })
      })
    )
  }
  function Tt(t) {
    return navigator.userAgent.includes('Windows')
      ? 'https://custom.protocol.asset_' + t
      : 'asset://' + t
  }
  function Ot(t) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (e) {
        return [2, $t('tauri', t)]
      })
    })
  }
  function Et(t, e, n, i) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (o) {
        return (
          'object' == typeof n && Object.freeze(n),
          [
            2,
            Ot({
              __tauriModule: 'Shell',
              message: {
                cmd: 'execute',
                program: e,
                args: 'string' == typeof n ? [n] : n,
                options: i,
                onEventFn: Ct(t)
              }
            })
          ]
        )
      })
    })
  }
  Object.freeze({
    __proto__: null,
    transformCallback: Ct,
    invoke: $t,
    convertFileSrc: Tt
  })
  var St,
    Pt,
    zt = (function () {
      function t() {
        this.eventListeners = Object.create(null)
      }
      return (
        (t.prototype.addEventListener = function (t, e) {
          t in this.eventListeners
            ? this.eventListeners[t].push(e)
            : (this.eventListeners[t] = [e])
        }),
        (t.prototype._emit = function (t, e) {
          if (t in this.eventListeners)
            for (var n = 0, i = this.eventListeners[t]; n < i.length; n++)
              (0, i[n])(e)
        }),
        (t.prototype.on = function (t, e) {
          return this.addEventListener(t, e), this
        }),
        t
      )
    })(),
    At = (function () {
      function t(t) {
        this.pid = t
      }
      return (
        (t.prototype.write = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Shell',
                  message: { cmd: 'stdinWrite', pid: this.pid, buffer: t }
                })
              ]
            })
          })
        }),
        (t.prototype.kill = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({
                  __tauriModule: 'Shell',
                  message: { cmd: 'killChild', pid: this.pid }
                })
              ]
            })
          })
        }),
        t
      )
    })(),
    jt = (function (t) {
      function e(e, n, i) {
        void 0 === n && (n = [])
        var o = t.call(this) || this
        return (
          (o.stdout = new zt()),
          (o.stderr = new zt()),
          (o.program = e),
          (o.args = 'string' == typeof n ? [n] : n),
          (o.options = null != i ? i : {}),
          o
        )
      }
      return (
        wt(e, t),
        (e.sidecar = function (t, n, i) {
          void 0 === n && (n = [])
          var o = new e(t, n, i)
          return (o.options.sidecar = !0), o
        }),
        (e.prototype.spawn = function () {
          return Mt(this, void 0, void 0, function () {
            var t = this
            return kt(this, function (e) {
              return [
                2,
                Et(
                  function (e) {
                    switch (e.event) {
                      case 'Error':
                        t._emit('error', e.payload)
                        break
                      case 'Terminated':
                        t._emit('close', e.payload)
                        break
                      case 'Stdout':
                        t.stdout._emit('data', e.payload)
                        break
                      case 'Stderr':
                        t.stderr._emit('data', e.payload)
                    }
                  },
                  this.program,
                  this.args,
                  this.options
                ).then(function (t) {
                  return new At(t)
                })
              ]
            })
          })
        }),
        (e.prototype.execute = function () {
          return Mt(this, void 0, void 0, function () {
            var t = this
            return kt(this, function (e) {
              return [
                2,
                new Promise(function (e, n) {
                  t.on('error', n)
                  var i = [],
                    o = []
                  t.stdout.on('data', function (t) {
                    i.push(t)
                  }),
                    t.stderr.on('data', function (t) {
                      o.push(t)
                    }),
                    t.on('close', function (t) {
                      e({
                        code: t.code,
                        signal: t.signal,
                        stdout: i.join('\n'),
                        stderr: o.join('\n')
                      })
                    }),
                    t.spawn().catch(n)
                })
              ]
            })
          })
        }),
        e
      )
    })(zt)
  function Wt(t, e) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (n) {
        return [
          2,
          Ot({
            __tauriModule: 'Shell',
            message: { cmd: 'open', path: t, with: e }
          })
        ]
      })
    })
  }
  function Lt() {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (t) {
        return [
          2,
          Ot({ __tauriModule: 'App', message: { cmd: 'getAppVersion' } })
        ]
      })
    })
  }
  function Ft() {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (t) {
        return [2, Ot({ __tauriModule: 'App', message: { cmd: 'getAppName' } })]
      })
    })
  }
  function Dt() {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (t) {
        return [
          2,
          Ot({ __tauriModule: 'App', message: { cmd: 'getTauriVersion' } })
        ]
      })
    })
  }
  function Rt(t) {
    return (
      void 0 === t && (t = 0),
      Mt(this, void 0, void 0, function () {
        return kt(this, function (e) {
          return [
            2,
            Ot({
              __tauriModule: 'Process',
              message: { cmd: 'exit', exitCode: t }
            })
          ]
        })
      })
    )
  }
  function It() {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (t) {
        return [
          2,
          Ot({ __tauriModule: 'Process', message: { cmd: 'relaunch' } })
        ]
      })
    })
  }
  function Ut(e) {
    let n, o, r, u, l, v, g, b, _, w, x, M, k, C, $, T, O, E, S, P, z
    return {
      c() {
        ;(n = d('h1')),
          (n.textContent = 'Welcome'),
          (o = h()),
          (r = d('p')),
          (r.textContent =
            "Tauri's API capabilities using the ` @tauri-apps/api ` package. It's used as\n  the main validation app, serving as the testbed of our development process. In\n  the future, this app will be used on Tauri's integration tests."),
          (u = h()),
          (l = d('p')),
          (v = f('Current App version: ')),
          (g = f(e[0])),
          (b = h()),
          (_ = d('p')),
          (w = f('Current Tauri version: ')),
          (x = f(e[1])),
          (M = h()),
          (k = d('p')),
          (C = f('Current App name: ')),
          ($ = f(e[2])),
          (T = h()),
          (O = d('button')),
          (O.textContent = 'Close application'),
          (E = h()),
          (S = d('button')),
          (S.textContent = 'Relaunch application'),
          m(O, 'class', 'button'),
          m(S, 'class', 'button')
      },
      m(t, i) {
        c(t, n, i),
          c(t, o, i),
          c(t, r, i),
          c(t, u, i),
          c(t, l, i),
          s(l, v),
          s(l, g),
          c(t, b, i),
          c(t, _, i),
          s(_, w),
          s(_, x),
          c(t, M, i),
          c(t, k, i),
          s(k, C),
          s(k, $),
          c(t, T, i),
          c(t, O, i),
          c(t, E, i),
          c(t, S, i),
          P || ((z = [p(O, 'click', e[3]), p(S, 'click', e[4])]), (P = !0))
      },
      p(t, [e]) {
        1 & e && y(g, t[0]), 2 & e && y(x, t[1]), 4 & e && y($, t[2])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n),
          t && a(o),
          t && a(r),
          t && a(u),
          t && a(l),
          t && a(b),
          t && a(_),
          t && a(M),
          t && a(k),
          t && a(T),
          t && a(O),
          t && a(E),
          t && a(S),
          (P = !1),
          i(z)
      }
    }
  }
  function Nt(t, e, n) {
    let i = 0,
      o = 0,
      r = 'Unknown'
    return (
      Ft().then((t) => {
        n(2, (r = t))
      }),
      Lt().then((t) => {
        n(0, (i = t))
      }),
      Dt().then((t) => {
        n(1, (o = t))
      }),
      [
        i,
        o,
        r,
        async function () {
          await Rt()
        },
        async function () {
          await It()
        }
      ]
    )
  }
  Object.freeze({ __proto__: null, Command: jt, Child: At, open: Wt }),
    Object.freeze({
      __proto__: null,
      getName: Ft,
      getVersion: Lt,
      getTauriVersion: Dt
    }),
    Object.freeze({ __proto__: null, exit: Rt, relaunch: It })
  class Kt extends V {
    constructor(t) {
      super(), G(this, t, Nt, Ut, r, {})
    }
  }
  function qt() {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (t) {
        return [2, Ot({ __tauriModule: 'Cli', message: { cmd: 'cliMatches' } })]
      })
    })
  }
  function Bt(e) {
    let n, i, o, r, u, l, v, g, y, b, _
    return {
      c() {
        ;(n = d('div')),
          (i = f(
            'This binary can be run on the terminal and takes the following arguments:\n  '
          )),
          (o = d('ul')),
          (o.innerHTML =
            '<li>--config PATH</li> \n    <li>--theme light|dark|system</li> \n    <li>--verbose</li>'),
          (r = f('\n  Additionally, it has a ')),
          (u = d('i')),
          (u.textContent = 'update --background'),
          (l = f(
            ' subcommand.\n  Note that the arguments are only parsed, not implemented.\n  '
          )),
          (v = d('br')),
          (g = h()),
          (y = d('button')),
          (y.textContent = 'Get matches'),
          m(y, 'class', 'button'),
          m(y, 'id', 'cli-matches')
      },
      m(t, a) {
        c(t, n, a),
          s(n, i),
          s(n, o),
          s(n, r),
          s(n, u),
          s(n, l),
          s(n, v),
          s(n, g),
          s(n, y),
          b || ((_ = p(y, 'click', e[0])), (b = !0))
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && a(n), (b = !1), _()
      }
    }
  }
  function Ht(t, e, n) {
    let { onMessage: i } = e
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(1, (i = t.onMessage))
      }),
      [
        function () {
          qt().then(i).catch(i)
        },
        i
      ]
    )
  }
  Object.freeze({ __proto__: null, getMatches: qt })
  class Gt extends V {
    constructor(t) {
      super(), G(this, t, Ht, Bt, r, { onMessage: 1 })
    }
  }
  function Vt(t, e, n) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (i) {
        switch (i.label) {
          case 0:
            return [
              4,
              Ot({
                __tauriModule: 'Event',
                message: { cmd: 'emit', event: t, windowLabel: e, payload: n }
              })
            ]
          case 1:
            return i.sent(), [2]
        }
      })
    })
  }
  function Jt(t) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (e) {
        return [
          2,
          Ot({
            __tauriModule: 'Event',
            message: { cmd: 'unlisten', eventId: t }
          })
        ]
      })
    })
  }
  function Xt(t, e) {
    return Mt(this, void 0, void 0, function () {
      var n = this
      return kt(this, function (i) {
        return [
          2,
          Ot({
            __tauriModule: 'Event',
            message: { cmd: 'listen', event: t, handler: Ct(e) }
          }).then(function (t) {
            return function () {
              return Mt(n, void 0, void 0, function () {
                return kt(this, function (e) {
                  return [2, Jt(t)]
                })
              })
            }
          })
        ]
      })
    })
  }
  function Yt(t, e) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (n) {
        return [
          2,
          Xt(t, function (t) {
            e(t), Jt(t.id).catch(function () {})
          })
        ]
      })
    })
  }
  function Qt(t, e) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (n) {
        return [2, Vt(t, void 0, e)]
      })
    })
  }
  function Zt(e) {
    let n, o, r, u, l, f, v, g
    return {
      c() {
        ;(n = d('div')),
          (o = d('button')),
          (o.textContent = 'Call Log API'),
          (r = h()),
          (u = d('button')),
          (u.textContent = 'Call Request (async) API'),
          (l = h()),
          (f = d('button')),
          (f.textContent = 'Send event to Rust'),
          m(o, 'class', 'button'),
          m(o, 'id', 'log'),
          m(u, 'class', 'button'),
          m(u, 'id', 'request'),
          m(f, 'class', 'button'),
          m(f, 'id', 'event')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(n, r),
          s(n, u),
          s(n, l),
          s(n, f),
          v ||
            ((g = [
              p(o, 'click', e[0]),
              p(u, 'click', e[1]),
              p(f, 'click', e[2])
            ]),
            (v = !0))
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && a(n), (v = !1), i(g)
      }
    }
  }
  function te(t, e, n) {
    let i,
      { onMessage: o } = e
    return (
      $(async () => {
        i = await Xt('rust-event', o)
      }),
      T(() => {
        i && i()
      }),
      (t.$$set = (t) => {
        'onMessage' in t && n(3, (o = t.onMessage))
      }),
      [
        function () {
          $t('log_operation', {
            event: 'tauri-click',
            payload: 'this payload is optional because we used Option in Rust'
          })
        },
        function () {
          $t('perform_request', {
            endpoint: 'dummy endpoint arg',
            body: { id: 5, name: 'test' }
          })
            .then(o)
            .catch(o)
        },
        function () {
          Qt('js-event', 'this is the payload string')
        },
        o
      ]
    )
  }
  Object.freeze({ __proto__: null, listen: Xt, once: Yt, emit: Qt })
  class ee extends V {
    constructor(t) {
      super(), G(this, t, te, Zt, r, { onMessage: 3 })
    }
  }
  function ne(t) {
    return (
      void 0 === t && (t = {}),
      Mt(this, void 0, void 0, function () {
        return kt(this, function (e) {
          return (
            'object' == typeof t && Object.freeze(t),
            [
              2,
              Ot({
                __tauriModule: 'Dialog',
                message: { cmd: 'openDialog', options: t }
              })
            ]
          )
        })
      })
    )
  }
  function ie(t) {
    return (
      void 0 === t && (t = {}),
      Mt(this, void 0, void 0, function () {
        return kt(this, function (e) {
          return (
            'object' == typeof t && Object.freeze(t),
            [
              2,
              Ot({
                __tauriModule: 'Dialog',
                message: { cmd: 'saveDialog', options: t }
              })
            ]
          )
        })
      })
    )
  }
  function oe(t, e) {
    return (
      void 0 === e && (e = {}),
      Mt(this, void 0, void 0, function () {
        return kt(this, function (n) {
          return [
            2,
            Ot({
              __tauriModule: 'Fs',
              message: { cmd: 'readBinaryFile', path: t, options: e }
            })
          ]
        })
      })
    )
  }
  function re(t) {
    var e = (function (t) {
      if (t.length < 65536)
        return String.fromCharCode.apply(null, Array.from(t))
      for (var e = '', n = t.length, i = 0; i < n; i++) {
        var o = t.subarray(65536 * i, 65536 * (i + 1))
        e += String.fromCharCode.apply(null, Array.from(o))
      }
      return e
    })(new Uint8Array(t))
    return btoa(e)
  }
  function ue(t, e) {
    return (
      void 0 === e && (e = {}),
      Mt(this, void 0, void 0, function () {
        return kt(this, function (n) {
          return [
            2,
            Ot({
              __tauriModule: 'Fs',
              message: { cmd: 'readDir', path: t, options: e }
            })
          ]
        })
      })
    )
  }
  function se(e) {
    let n, o, r, u, l, f, v, g, y, _, w, x, M, k, C, $, T, O, E, S
    return {
      c() {
        ;(n = d('div')),
          (o = d('input')),
          (r = h()),
          (u = d('input')),
          (l = h()),
          (f = d('div')),
          (v = d('input')),
          (g = h()),
          (y = d('label')),
          (y.textContent = 'Multiple'),
          (_ = h()),
          (w = d('div')),
          (x = d('input')),
          (M = h()),
          (k = d('label')),
          (k.textContent = 'Directory'),
          (C = h()),
          ($ = d('button')),
          ($.textContent = 'Open dialog'),
          (T = h()),
          (O = d('button')),
          (O.textContent = 'Open save dialog'),
          m(o, 'id', 'dialog-default-path'),
          m(o, 'placeholder', 'Default path'),
          m(u, 'id', 'dialog-filter'),
          m(u, 'placeholder', 'Extensions filter, comma-separated'),
          m(u, 'class', 'svelte-1eg58yg'),
          m(v, 'type', 'checkbox'),
          m(v, 'id', 'dialog-multiple'),
          m(y, 'for', 'dialog-multiple'),
          m(x, 'type', 'checkbox'),
          m(x, 'id', 'dialog-directory'),
          m(k, 'for', 'dialog-directory'),
          m($, 'class', 'button'),
          m($, 'id', 'open-dialog'),
          m(O, 'class', 'button'),
          m(O, 'id', 'save-dialog')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          b(o, e[0]),
          s(n, r),
          s(n, u),
          b(u, e[1]),
          s(n, l),
          s(n, f),
          s(f, v),
          (v.checked = e[2]),
          s(f, g),
          s(f, y),
          s(n, _),
          s(n, w),
          s(w, x),
          (x.checked = e[3]),
          s(w, M),
          s(w, k),
          s(n, C),
          s(n, $),
          s(n, T),
          s(n, O),
          E ||
            ((S = [
              p(o, 'input', e[7]),
              p(u, 'input', e[8]),
              p(v, 'change', e[9]),
              p(x, 'change', e[10]),
              p($, 'click', e[4]),
              p(O, 'click', e[5])
            ]),
            (E = !0))
      },
      p(t, [e]) {
        1 & e && o.value !== t[0] && b(o, t[0]),
          2 & e && u.value !== t[1] && b(u, t[1]),
          4 & e && (v.checked = t[2]),
          8 & e && (x.checked = t[3])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n), (E = !1), i(S)
      }
    }
  }
  function ce(t, e, n) {
    let { onMessage: i } = e,
      o = null,
      r = null,
      u = !1,
      s = !1
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(6, (i = t.onMessage))
      }),
      [
        o,
        r,
        u,
        s,
        function () {
          ne({
            defaultPath: o,
            filters: r
              ? [
                  {
                    name: 'Tauri Example',
                    extensions: r.split(',').map((t) => t.trim())
                  }
                ]
              : [],
            multiple: u,
            directory: s
          })
            .then(function (t) {
              if (Array.isArray(t)) i(t)
              else {
                var e = t,
                  n = e.match(/\S+\.\S+$/g)
                oe(e)
                  .then(function (o) {
                    var r, u, s, c
                    n && (e.includes('.png') || e.includes('.jpg'))
                      ? ((r = new Uint8Array(o)),
                        (u = function (t) {
                          i('<img src="data:image/png;base64,' + t + '"></img>')
                        }),
                        (s = new Blob([r], {
                          type: 'application/octet-binary'
                        })),
                        ((c = new FileReader()).onload = function (t) {
                          var e = t.target.result
                          u(e.substr(e.indexOf(',') + 1))
                        }),
                        c.readAsDataURL(s))
                      : i(t)
                  })
                  .catch(i(t))
              }
            })
            .catch(i)
        },
        function () {
          ie({
            defaultPath: o,
            filters: r
              ? [
                  {
                    name: 'Tauri Example',
                    extensions: r.split(',').map((t) => t.trim())
                  }
                ]
              : []
          })
            .then(i)
            .catch(i)
        },
        i,
        function () {
          ;(o = this.value), n(0, o)
        },
        function () {
          ;(r = this.value), n(1, r)
        },
        function () {
          ;(u = this.checked), n(2, u)
        },
        function () {
          ;(s = this.checked), n(3, s)
        }
      ]
    )
  }
  Object.freeze({ __proto__: null, open: ne, save: ie }),
    (function (t) {
      ;(t[(t.Audio = 1)] = 'Audio'),
        (t[(t.Cache = 2)] = 'Cache'),
        (t[(t.Config = 3)] = 'Config'),
        (t[(t.Data = 4)] = 'Data'),
        (t[(t.LocalData = 5)] = 'LocalData'),
        (t[(t.Desktop = 6)] = 'Desktop'),
        (t[(t.Document = 7)] = 'Document'),
        (t[(t.Download = 8)] = 'Download'),
        (t[(t.Executable = 9)] = 'Executable'),
        (t[(t.Font = 10)] = 'Font'),
        (t[(t.Home = 11)] = 'Home'),
        (t[(t.Picture = 12)] = 'Picture'),
        (t[(t.Public = 13)] = 'Public'),
        (t[(t.Runtime = 14)] = 'Runtime'),
        (t[(t.Template = 15)] = 'Template'),
        (t[(t.Video = 16)] = 'Video'),
        (t[(t.Resource = 17)] = 'Resource'),
        (t[(t.App = 18)] = 'App'),
        (t[(t.Current = 19)] = 'Current')
    })(St || (St = {})),
    Object.freeze({
      __proto__: null,
      get BaseDirectory() {
        return St
      },
      get Dir() {
        return St
      },
      readTextFile: function (t, e) {
        return (
          void 0 === e && (e = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [
                2,
                Ot({
                  __tauriModule: 'Fs',
                  message: { cmd: 'readTextFile', path: t, options: e }
                })
              ]
            })
          })
        )
      },
      readBinaryFile: oe,
      writeFile: function (t, e) {
        return (
          void 0 === e && (e = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return (
                'object' == typeof e && Object.freeze(e),
                'object' == typeof t && Object.freeze(t),
                [
                  2,
                  Ot({
                    __tauriModule: 'Fs',
                    message: {
                      cmd: 'writeFile',
                      path: t.path,
                      contents: t.contents,
                      options: e
                    }
                  })
                ]
              )
            })
          })
        )
      },
      writeBinaryFile: function (t, e) {
        return (
          void 0 === e && (e = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return (
                'object' == typeof e && Object.freeze(e),
                'object' == typeof t && Object.freeze(t),
                [
                  2,
                  Ot({
                    __tauriModule: 'Fs',
                    message: {
                      cmd: 'writeBinaryFile',
                      path: t.path,
                      contents: re(t.contents),
                      options: e
                    }
                  })
                ]
              )
            })
          })
        )
      },
      readDir: ue,
      createDir: function (t, e) {
        return (
          void 0 === e && (e = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [
                2,
                Ot({
                  __tauriModule: 'Fs',
                  message: { cmd: 'createDir', path: t, options: e }
                })
              ]
            })
          })
        )
      },
      removeDir: function (t, e) {
        return (
          void 0 === e && (e = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [
                2,
                Ot({
                  __tauriModule: 'Fs',
                  message: { cmd: 'removeDir', path: t, options: e }
                })
              ]
            })
          })
        )
      },
      copyFile: function (t, e, n) {
        return (
          void 0 === n && (n = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (i) {
              return [
                2,
                Ot({
                  __tauriModule: 'Fs',
                  message: {
                    cmd: 'copyFile',
                    source: t,
                    destination: e,
                    options: n
                  }
                })
              ]
            })
          })
        )
      },
      removeFile: function (t, e) {
        return (
          void 0 === e && (e = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [
                2,
                Ot({
                  __tauriModule: 'Fs',
                  message: { cmd: 'removeFile', path: t, options: e }
                })
              ]
            })
          })
        )
      },
      renameFile: function (t, e, n) {
        return (
          void 0 === n && (n = {}),
          Mt(this, void 0, void 0, function () {
            return kt(this, function (i) {
              return [
                2,
                Ot({
                  __tauriModule: 'Fs',
                  message: {
                    cmd: 'renameFile',
                    oldPath: t,
                    newPath: e,
                    options: n
                  }
                })
              ]
            })
          })
        )
      }
    })
  class ae extends V {
    constructor(t) {
      var e
      super(),
        document.getElementById('svelte-1eg58yg-style') ||
          (((e = d('style')).id = 'svelte-1eg58yg-style'),
          (e.textContent = '#dialog-filter.svelte-1eg58yg{width:260px}'),
          s(document.head, e)),
        G(this, t, ce, se, r, { onMessage: 6 })
    }
  }
  function le(t, e, n) {
    const i = t.slice()
    return (i[8] = e[n]), i
  }
  function de(e) {
    let n,
      i,
      o = e[8][0] + ''
    return {
      c() {
        ;(n = d('option')),
          (i = f(o)),
          (n.__value = e[8][1]),
          (n.value = n.__value)
      },
      m(t, e) {
        c(t, n, e), s(n, i)
      },
      p: t,
      d(t) {
        t && a(n)
      }
    }
  }
  function fe(e) {
    let n,
      o,
      r,
      u,
      f,
      g,
      y,
      _,
      w,
      x,
      M,
      k,
      C,
      $ = e[2],
      T = []
    for (let t = 0; t < $.length; t += 1) T[t] = de(le(e, $, t))
    return {
      c() {
        ;(n = d('form')),
          (o = d('select')),
          (r = d('option')),
          (r.textContent = 'None')
        for (let t = 0; t < T.length; t += 1) T[t].c()
        ;(u = h()),
          (f = d('input')),
          (g = h()),
          (y = d('button')),
          (y.textContent = 'Read'),
          (_ = h()),
          (w = d('button')),
          (w.textContent = 'Use as img src'),
          (x = h()),
          (M = d('img')),
          (r.__value = ''),
          (r.value = r.__value),
          m(o, 'class', 'button'),
          m(o, 'id', 'dir'),
          m(f, 'id', 'path-to-read'),
          m(f, 'placeholder', 'Type the path to read...'),
          m(y, 'class', 'button'),
          m(y, 'id', 'read'),
          m(w, 'class', 'button'),
          m(w, 'type', 'button'),
          m(M, 'alt', 'file')
      },
      m(t, i) {
        c(t, n, i), s(n, o), s(o, r)
        for (let t = 0; t < T.length; t += 1) T[t].m(o, null)
        s(n, u),
          s(n, f),
          b(f, e[0]),
          s(n, g),
          s(n, y),
          s(n, _),
          s(n, w),
          s(n, x),
          s(n, M),
          e[7](M),
          k ||
            ((C = [
              p(f, 'input', e[6]),
              p(w, 'click', e[4]),
              p(n, 'submit', v(e[3]))
            ]),
            (k = !0))
      },
      p(t, [e]) {
        if (4 & e) {
          let n
          for ($ = t[2], n = 0; n < $.length; n += 1) {
            const i = le(t, $, n)
            T[n] ? T[n].p(i, e) : ((T[n] = de(i)), T[n].c(), T[n].m(o, null))
          }
          for (; n < T.length; n += 1) T[n].d(1)
          T.length = $.length
        }
        1 & e && f.value !== t[0] && b(f, t[0])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n), l(T, t), e[7](null), (k = !1), i(C)
      }
    }
  }
  function he() {
    return document.getElementById('dir').value ? parseInt(dir.value) : null
  }
  function pe(t, e, n) {
    let i,
      { onMessage: o } = e,
      r = ''
    const u = Object.keys(St)
      .filter((t) => isNaN(parseInt(t)))
      .map((t) => [t, St[t]])
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(5, (o = t.onMessage))
      }),
      [
        r,
        i,
        u,
        function () {
          const t = r.match(/\S+\.\S+$/g),
            e = { dir: he() }
          ;(t ? oe(r, e) : ue(r, e))
            .then(function (e) {
              if (t)
                if (r.includes('.png') || r.includes('.jpg'))
                  !(function (t, e) {
                    const n = new Blob([t], {
                        type: 'application/octet-binary'
                      }),
                      i = new FileReader()
                    ;(i.onload = function (t) {
                      const n = t.target.result
                      e(n.substr(n.indexOf(',') + 1))
                    }),
                      i.readAsDataURL(n)
                  })(new Uint8Array(e), function (t) {
                    o(
                      '<img src="' + ('data:image/png;base64,' + t) + '"></img>'
                    )
                  })
                else {
                  const t = String.fromCharCode.apply(null, e)
                  o(
                    '<textarea id="file-response" style="height: 400px"></textarea><button id="file-save">Save</button>'
                  ),
                    setTimeout(() => {
                      const e = document.getElementById('file-response')
                      ;(e.value = t),
                        document
                          .getElementById('file-save')
                          .addEventListener('click', function () {
                            writeFile(
                              { file: r, contents: e.value },
                              { dir: he() }
                            ).catch(o)
                          })
                    })
                }
              else o(e)
            })
            .catch(o)
        },
        function () {
          n(1, (i.src = Tt(r)), i)
        },
        o,
        function () {
          ;(r = this.value), n(0, r)
        },
        function (t) {
          E[t ? 'unshift' : 'push'](() => {
            ;(i = t), n(1, i)
          })
        }
      ]
    )
  }
  class ve extends V {
    constructor(t) {
      super(), G(this, t, pe, fe, r, { onMessage: 5 })
    }
  }
  !(function (t) {
    ;(t[(t.JSON = 1)] = 'JSON'),
      (t[(t.Text = 2)] = 'Text'),
      (t[(t.Binary = 3)] = 'Binary')
  })(Pt || (Pt = {}))
  var me = (function () {
      function t(t, e) {
        ;(this.type = t), (this.payload = e)
      }
      return (
        (t.form = function (e) {
          return new t('Form', e)
        }),
        (t.json = function (e) {
          return new t('Json', e)
        }),
        (t.text = function (e) {
          return new t('Text', e)
        }),
        (t.bytes = function (e) {
          return new t('Bytes', e)
        }),
        t
      )
    })(),
    ge = function (t) {
      ;(this.url = t.url),
        (this.status = t.status),
        (this.ok = this.status >= 200 && this.status < 300),
        (this.headers = t.headers),
        (this.data = t.data)
    },
    ye = (function () {
      function t(t) {
        this.id = t
      }
      return (
        (t.prototype.drop = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({
                  __tauriModule: 'Http',
                  message: { cmd: 'dropClient', client: this.id }
                })
              ]
            })
          })
        }),
        (t.prototype.request = function (t) {
          return Mt(this, void 0, void 0, function () {
            var e
            return kt(this, function (n) {
              return (
                (e = !t.responseType || t.responseType === Pt.JSON) &&
                  (t.responseType = Pt.Text),
                [
                  2,
                  Ot({
                    __tauriModule: 'Http',
                    message: { cmd: 'httpRequest', client: this.id, options: t }
                  }).then(function (t) {
                    var n = new ge(t)
                    if (e) {
                      try {
                        n.data = JSON.parse(n.data)
                      } catch (t) {
                        if (n.ok)
                          throw Error(
                            'Failed to parse response `' +
                              n.data +
                              '` as JSON: ' +
                              t +
                              ';\n              try setting the `responseType` option to `ResponseType.Text` or `ResponseType.Binary` if the API does not return a JSON response.'
                          )
                      }
                      return n
                    }
                    return n
                  })
                ]
              )
            })
          })
        }),
        (t.prototype.get = function (t, e) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [2, this.request(xt({ method: 'GET', url: t }, e))]
            })
          })
        }),
        (t.prototype.post = function (t, e, n) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (i) {
              return [
                2,
                this.request(xt({ method: 'POST', url: t, body: e }, n))
              ]
            })
          })
        }),
        (t.prototype.put = function (t, e, n) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (i) {
              return [
                2,
                this.request(xt({ method: 'PUT', url: t, body: e }, n))
              ]
            })
          })
        }),
        (t.prototype.patch = function (t, e) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [2, this.request(xt({ method: 'PATCH', url: t }, e))]
            })
          })
        }),
        (t.prototype.delete = function (t, e) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (n) {
              return [2, this.request(xt({ method: 'DELETE', url: t }, e))]
            })
          })
        }),
        t
      )
    })()
  function be(t) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (e) {
        return [
          2,
          Ot({
            __tauriModule: 'Http',
            message: { cmd: 'createClient', options: t }
          }).then(function (t) {
            return new ye(t)
          })
        ]
      })
    })
  }
  var _e = null
  function we(e) {
    let n, o, r, u, l, f, g, y, x, M, k, C, $, T, O, E, S
    return {
      c() {
        ;(n = d('form')),
          (o = d('select')),
          (r = d('option')),
          (r.textContent = 'GET'),
          (u = d('option')),
          (u.textContent = 'POST'),
          (l = d('option')),
          (l.textContent = 'PUT'),
          (f = d('option')),
          (f.textContent = 'PATCH'),
          (g = d('option')),
          (g.textContent = 'DELETE'),
          (y = h()),
          (x = d('input')),
          (M = h()),
          (k = d('br')),
          (C = h()),
          ($ = d('textarea')),
          (T = h()),
          (O = d('button')),
          (O.textContent = 'Make request'),
          (r.__value = 'GET'),
          (r.value = r.__value),
          (u.__value = 'POST'),
          (u.value = u.__value),
          (l.__value = 'PUT'),
          (l.value = l.__value),
          (f.__value = 'PATCH'),
          (f.value = f.__value),
          (g.__value = 'DELETE'),
          (g.value = g.__value),
          m(o, 'class', 'button'),
          m(o, 'id', 'request-method'),
          void 0 === e[0] && j(() => e[5].call(o)),
          m(x, 'id', 'request-url'),
          m(x, 'placeholder', 'Type the request URL...'),
          m($, 'id', 'request-body'),
          m($, 'placeholder', 'Request body'),
          m($, 'rows', '5'),
          _($, 'width', '100%'),
          _($, 'margin-right', '10px'),
          _($, 'font-size', '12px'),
          m(O, 'class', 'button'),
          m(O, 'id', 'make-request')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(o, r),
          s(o, u),
          s(o, l),
          s(o, f),
          s(o, g),
          w(o, e[0]),
          s(n, y),
          s(n, x),
          b(x, e[1]),
          s(n, M),
          s(n, k),
          s(n, C),
          s(n, $),
          b($, e[2]),
          s(n, T),
          s(n, O),
          E ||
            ((S = [
              p(o, 'change', e[5]),
              p(x, 'input', e[6]),
              p($, 'input', e[7]),
              p(n, 'submit', v(e[3]))
            ]),
            (E = !0))
      },
      p(t, [e]) {
        1 & e && w(o, t[0]),
          2 & e && x.value !== t[1] && b(x, t[1]),
          4 & e && b($, t[2])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n), (E = !1), i(S)
      }
    }
  }
  function xe(t, e, n) {
    let i = 'GET',
      o = 'https://jsonplaceholder.typicode.com/todos/1',
      r = '',
      { onMessage: u } = e
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(4, (u = t.onMessage))
      }),
      [
        i,
        o,
        r,
        async function () {
          const t = await be(),
            e = { url: o || '' || '', method: i || 'GET' || 'GET' }
          ;(r.startsWith('{') && r.endsWith('}')) ||
          (r.startsWith('[') && r.endsWith(']'))
            ? (e.body = me.json(JSON.parse(r)))
            : '' !== r && (e.body = me.text(r)),
            t.request(e).then(u).catch(u)
        },
        u,
        function () {
          ;(i = (function (t) {
            const e = t.querySelector(':checked') || t.options[0]
            return e && e.__value
          })(this)),
            n(0, i)
        },
        function () {
          ;(o = this.value), n(1, o)
        },
        function () {
          ;(r = this.value), n(2, r)
        }
      ]
    )
  }
  Object.freeze({
    __proto__: null,
    getClient: be,
    fetch: function (t, e) {
      var n
      return Mt(this, void 0, void 0, function () {
        return kt(this, function (i) {
          switch (i.label) {
            case 0:
              return null !== _e ? [3, 2] : [4, be()]
            case 1:
              ;(_e = i.sent()), (i.label = 2)
            case 2:
              return [
                2,
                _e.request(
                  xt(
                    {
                      url: t,
                      method:
                        null !== (n = null == e ? void 0 : e.method) &&
                        void 0 !== n
                          ? n
                          : 'GET'
                    },
                    e
                  )
                )
              ]
          }
        })
      })
    },
    Body: me,
    Client: ye,
    Response: ge,
    get ResponseType() {
      return Pt
    }
  })
  class Me extends V {
    constructor(t) {
      super(), G(this, t, xe, we, r, { onMessage: 4 })
    }
  }
  function ke(e) {
    let n, i, o
    return {
      c() {
        ;(n = d('button')),
          (n.textContent = 'Send test notification'),
          m(n, 'class', 'button'),
          m(n, 'id', 'notification')
      },
      m(t, r) {
        c(t, n, r), i || ((o = p(n, 'click', e[0])), (i = !0))
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && a(n), (i = !1), o()
      }
    }
  }
  function Ce() {
    new Notification('Notification title', {
      body: 'This is the notification body'
    })
  }
  function $e(t, e, n) {
    let { onMessage: i } = e
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(1, (i = t.onMessage))
      }),
      [
        function () {
          'default' === Notification.permission
            ? Notification.requestPermission()
                .then(function (t) {
                  'granted' === t ? Ce() : i('Permission is ' + t)
                })
                .catch(i)
            : 'granted' === Notification.permission
            ? Ce()
            : i('Permission is denied')
        },
        i
      ]
    )
  }
  class Te extends V {
    constructor(t) {
      super(), G(this, t, $e, ke, r, { onMessage: 1 })
    }
  }
  var Oe,
    Ee = function (t, e) {
      ;(this.type = 'Logical'), (this.width = t), (this.height = e)
    },
    Se = (function () {
      function t(t, e) {
        ;(this.type = 'Physical'), (this.width = t), (this.height = e)
      }
      return (
        (t.prototype.toLogical = function (t) {
          return new Ee(this.width / t, this.height / t)
        }),
        t
      )
    })(),
    Pe = function (t, e) {
      ;(this.type = 'Logical'), (this.x = t), (this.y = e)
    },
    ze = (function () {
      function t(t, e) {
        ;(this.type = 'Physical'), (this.x = t), (this.y = e)
      }
      return (
        (t.prototype.toLogical = function (t) {
          return new Pe(this.x / t, this.y / t)
        }),
        t
      )
    })()
  function Ae() {
    return window.__TAURI__.__windows
  }
  !(function (t) {
    ;(t[(t.Critical = 1)] = 'Critical'),
      (t[(t.Informational = 2)] = 'Informational')
  })(Oe || (Oe = {}))
  var je = ['tauri://created', 'tauri://error'],
    We = (function () {
      function t(t) {
        ;(this.label = t), (this.listeners = Object.create(null))
      }
      return (
        (t.prototype.listen = function (t, e) {
          return Mt(this, void 0, void 0, function () {
            var n = this
            return kt(this, function (i) {
              return this._handleTauriEvent(t, e)
                ? [
                    2,
                    Promise.resolve(function () {
                      var i = n.listeners[t]
                      i.splice(i.indexOf(e), 1)
                    })
                  ]
                : [2, Xt(t, e)]
            })
          })
        }),
        (t.prototype.once = function (t, e) {
          return Mt(this, void 0, void 0, function () {
            var n = this
            return kt(this, function (i) {
              return this._handleTauriEvent(t, e)
                ? [
                    2,
                    Promise.resolve(function () {
                      var i = n.listeners[t]
                      i.splice(i.indexOf(e), 1)
                    })
                  ]
                : [2, Yt(t, e)]
            })
          })
        }),
        (t.prototype.emit = function (t, e) {
          return Mt(this, void 0, void 0, function () {
            var n, i
            return kt(this, function (o) {
              if (je.includes(t)) {
                for (n = 0, i = this.listeners[t] || []; n < i.length; n++)
                  (0, i[n])({ event: t, id: -1, payload: e })
                return [2, Promise.resolve()]
              }
              return [2, Vt(t, this.label, e)]
            })
          })
        }),
        (t.prototype._handleTauriEvent = function (t, e) {
          return (
            !!je.includes(t) &&
            (t in this.listeners
              ? this.listeners[t].push(e)
              : (this.listeners[t] = [e]),
            !0)
          )
        }),
        t
      )
    })(),
    Le = (function (t) {
      function e(e, n) {
        void 0 === n && (n = {})
        var i = t.call(this, e) || this
        return (
          Ot({
            __tauriModule: 'Window',
            message: {
              cmd: 'createWebview',
              data: { options: xt({ label: e }, n) }
            }
          })
            .then(function () {
              return Mt(i, void 0, void 0, function () {
                return kt(this, function (t) {
                  return [2, this.emit('tauri://created')]
                })
              })
            })
            .catch(function (t) {
              return Mt(i, void 0, void 0, function () {
                return kt(this, function (e) {
                  return [2, this.emit('tauri://error', t)]
                })
              })
            }),
          i
        )
      }
      return (
        wt(e, t),
        (e.getByLabel = function (t) {
          return Ae().some(function (e) {
            return e.label === t
          })
            ? new We(t)
            : null
        }),
        e
      )
    })(We),
    Fe = (function () {
      function t() {}
      return (
        (t.prototype.scaleFactor = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'scaleFactor' } })
              ]
            })
          })
        }),
        (t.prototype.innerPosition = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'innerPosition' }
                })
              ]
            })
          })
        }),
        (t.prototype.outerPosition = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'outerPosition' }
                })
              ]
            })
          })
        }),
        (t.prototype.innerSize = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'innerSize' } })
              ]
            })
          })
        }),
        (t.prototype.outerSize = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'outerSize' } })
              ]
            })
          })
        }),
        (t.prototype.isFullscreen = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'isFullscreen' }
                })
              ]
            })
          })
        }),
        (t.prototype.isMaximized = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'isMaximized' } })
              ]
            })
          })
        }),
        (t.prototype.isDecorated = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'isDecorated' } })
              ]
            })
          })
        }),
        (t.prototype.isResizable = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'isResizable' } })
              ]
            })
          })
        }),
        (t.prototype.isVisible = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'isVisible' } })
              ]
            })
          })
        }),
        (t.prototype.center = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'center' } })
              ]
            })
          })
        }),
        (t.prototype.requestUserAttention = function (t) {
          return Mt(this, void 0, void 0, function () {
            var e
            return kt(this, function (n) {
              return (
                (e = null),
                t &&
                  (e =
                    t === Oe.Critical
                      ? { type: 'Critical' }
                      : { type: 'Informational' }),
                [
                  2,
                  Ot({
                    __tauriModule: 'Window',
                    message: { cmd: 'requestUserAttention', data: e }
                  })
                ]
              )
            })
          })
        }),
        (t.prototype.setResizable = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setResizable', data: t }
                })
              ]
            })
          })
        }),
        (t.prototype.setTitle = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setTitle', data: t }
                })
              ]
            })
          })
        }),
        (t.prototype.maximize = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'maximize' } })
              ]
            })
          })
        }),
        (t.prototype.unmaximize = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'unmaximize' } })
              ]
            })
          })
        }),
        (t.prototype.minimize = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'minimize' } })
              ]
            })
          })
        }),
        (t.prototype.unminimize = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'unminimize' } })
              ]
            })
          })
        }),
        (t.prototype.show = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'show' } })
              ]
            })
          })
        }),
        (t.prototype.hide = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'hide' } })
              ]
            })
          })
        }),
        (t.prototype.close = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'close' } })
              ]
            })
          })
        }),
        (t.prototype.setDecorations = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setDecorations', data: t }
                })
              ]
            })
          })
        }),
        (t.prototype.setAlwaysOnTop = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setAlwaysOnTop', data: t }
                })
              ]
            })
          })
        }),
        (t.prototype.setSize = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              if (!t || ('Logical' !== t.type && 'Physical' !== t.type))
                throw new Error(
                  'the `size` argument must be either a LogicalSize or a PhysicalSize instance'
                )
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: {
                    cmd: 'setSize',
                    data: {
                      type: t.type,
                      data: { width: t.width, height: t.height }
                    }
                  }
                })
              ]
            })
          })
        }),
        (t.prototype.setMinSize = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              if (t && 'Logical' !== t.type && 'Physical' !== t.type)
                throw new Error(
                  'the `size` argument must be either a LogicalSize or a PhysicalSize instance'
                )
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: {
                    cmd: 'setMinSize',
                    data: t
                      ? {
                          type: t.type,
                          data: { width: t.width, height: t.height }
                        }
                      : null
                  }
                })
              ]
            })
          })
        }),
        (t.prototype.setMaxSize = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              if (t && 'Logical' !== t.type && 'Physical' !== t.type)
                throw new Error(
                  'the `size` argument must be either a LogicalSize or a PhysicalSize instance'
                )
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: {
                    cmd: 'setMaxSize',
                    data: t
                      ? {
                          type: t.type,
                          data: { width: t.width, height: t.height }
                        }
                      : null
                  }
                })
              ]
            })
          })
        }),
        (t.prototype.setPosition = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              if (!t || ('Logical' !== t.type && 'Physical' !== t.type))
                throw new Error(
                  'the `position` argument must be either a LogicalPosition or a PhysicalPosition instance'
                )
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: {
                    cmd: 'setPosition',
                    data: { type: t.type, data: { x: t.x, y: t.y } }
                  }
                })
              ]
            })
          })
        }),
        (t.prototype.setFullscreen = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setFullscreen', data: t }
                })
              ]
            })
          })
        }),
        (t.prototype.setFocus = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({ __tauriModule: 'Window', message: { cmd: 'setFocus' } })
              ]
            })
          })
        }),
        (t.prototype.setIcon = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setIcon', data: { icon: t } }
                })
              ]
            })
          })
        }),
        (t.prototype.setSkipTaskbar = function (t) {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (e) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'setSkipTaskbar', data: t }
                })
              ]
            })
          })
        }),
        (t.prototype.startDragging = function () {
          return Mt(this, void 0, void 0, function () {
            return kt(this, function (t) {
              return [
                2,
                Ot({
                  __tauriModule: 'Window',
                  message: { cmd: 'startDragging' }
                })
              ]
            })
          })
        }),
        t
      )
    })(),
    De = new Fe()
  function Re(e) {
    let n,
      o,
      r,
      u,
      l,
      y,
      w,
      x,
      M,
      k,
      C,
      $,
      T,
      O,
      E,
      S,
      P,
      z,
      A,
      j,
      W,
      L,
      F,
      D,
      R,
      I,
      U,
      N,
      K,
      q,
      B,
      H,
      G,
      V,
      J,
      X,
      Y,
      Q,
      Z,
      tt,
      et,
      nt,
      it,
      ot,
      rt,
      ut,
      st,
      ct,
      at,
      lt,
      dt,
      ft,
      ht,
      pt,
      vt,
      mt,
      gt,
      yt,
      bt,
      _t,
      wt,
      xt,
      Mt,
      kt,
      Ct,
      $t,
      Tt,
      Ot,
      Et,
      St,
      Pt,
      zt,
      At,
      jt,
      Wt,
      Lt,
      Ft,
      Dt,
      Rt,
      It,
      Ut,
      Nt,
      Kt,
      qt,
      Bt,
      Ht,
      Gt
    return {
      c() {
        ;(n = d('div')),
          (o = d('div')),
          (r = d('label')),
          (u = d('input')),
          (l = f('\n      Resizable')),
          (y = h()),
          (w = d('label')),
          (x = d('input')),
          (M = f('\n      Maximize')),
          (k = h()),
          (C = d('button')),
          (C.textContent = 'Center'),
          ($ = h()),
          (T = d('button')),
          (T.textContent = 'Minimize'),
          (O = h()),
          (E = d('button')),
          (E.textContent = 'Hide'),
          (S = h()),
          (P = d('label')),
          (z = d('input')),
          (A = f('\n      Transparent')),
          (j = h()),
          (W = d('label')),
          (L = d('input')),
          (F = f('\n      Has decorations')),
          (D = h()),
          (R = d('label')),
          (I = d('input')),
          (U = f('\n      Always on top')),
          (N = h()),
          (K = d('label')),
          (q = d('input')),
          (B = f('\n      Fullscreen')),
          (H = h()),
          (G = d('button')),
          (G.textContent = 'Change icon'),
          (V = h()),
          (J = d('div')),
          (X = d('div')),
          (Y = d('div')),
          (Q = d('div')),
          (Z = f('X\n          ')),
          (tt = d('input')),
          (et = h()),
          (nt = d('div')),
          (it = f('Y\n          ')),
          (ot = d('input')),
          (rt = h()),
          (ut = d('div')),
          (st = d('div')),
          (ct = f('Width\n          ')),
          (at = d('input')),
          (lt = h()),
          (dt = d('div')),
          (ft = f('Height\n          ')),
          (ht = d('input')),
          (pt = h()),
          (vt = d('div')),
          (mt = d('div')),
          (gt = f('Min width\n          ')),
          (yt = d('input')),
          (bt = h()),
          (_t = d('div')),
          (wt = f('Min height\n          ')),
          (xt = d('input')),
          (Mt = h()),
          (kt = d('div')),
          (Ct = d('div')),
          ($t = f('Max width\n          ')),
          (Tt = d('input')),
          (Ot = h()),
          (Et = d('div')),
          (St = f('Max height\n          ')),
          (Pt = d('input')),
          (zt = h()),
          (At = d('form')),
          (jt = d('input')),
          (Wt = h()),
          (Lt = d('button')),
          (Lt.textContent = 'Set title'),
          (Ft = h()),
          (Dt = d('form')),
          (Rt = d('input')),
          (It = h()),
          (Ut = d('button')),
          (Ut.textContent = 'Open URL'),
          (Nt = h()),
          (Kt = d('button')),
          (Kt.textContent = 'Request attention'),
          (qt = h()),
          (Bt = d('button')),
          (Bt.textContent = 'New window'),
          m(u, 'type', 'checkbox'),
          m(x, 'type', 'checkbox'),
          m(C, 'title', 'Unminimizes after 2 seconds'),
          m(T, 'title', 'Unminimizes after 2 seconds'),
          m(E, 'title', 'Visible again after 2 seconds'),
          m(z, 'type', 'checkbox'),
          m(L, 'type', 'checkbox'),
          m(I, 'type', 'checkbox'),
          m(q, 'type', 'checkbox'),
          m(tt, 'type', 'number'),
          m(tt, 'min', '0'),
          m(tt, 'class', 'svelte-b76pvm'),
          m(ot, 'type', 'number'),
          m(ot, 'min', '0'),
          m(ot, 'class', 'svelte-b76pvm'),
          m(Y, 'class', 'flex col grow svelte-b76pvm'),
          m(at, 'type', 'number'),
          m(at, 'min', '400'),
          m(at, 'class', 'svelte-b76pvm'),
          m(ht, 'type', 'number'),
          m(ht, 'min', '400'),
          m(ht, 'class', 'svelte-b76pvm'),
          m(ut, 'class', 'flex col grow svelte-b76pvm'),
          m(yt, 'type', 'number'),
          m(yt, 'class', 'svelte-b76pvm'),
          m(xt, 'type', 'number'),
          m(xt, 'class', 'svelte-b76pvm'),
          m(vt, 'class', 'flex col grow svelte-b76pvm'),
          m(Tt, 'type', 'number'),
          m(Tt, 'min', '400'),
          m(Tt, 'class', 'svelte-b76pvm'),
          m(Pt, 'type', 'number'),
          m(Pt, 'min', '400'),
          m(Pt, 'class', 'svelte-b76pvm'),
          m(kt, 'class', 'flex col grow svelte-b76pvm'),
          m(X, 'class', 'window-controls flex flex-row svelte-b76pvm'),
          m(n, 'class', 'flex col'),
          m(jt, 'id', 'title'),
          m(Lt, 'class', 'button'),
          m(Lt, 'type', 'submit'),
          _(At, 'margin-top', '24px'),
          m(Rt, 'id', 'url'),
          m(Ut, 'class', 'button'),
          m(Ut, 'id', 'open-url'),
          _(Dt, 'margin-top', '24px'),
          m(Kt, 'class', 'button'),
          m(
            Kt,
            'title',
            'Minimizes the window, requests attention for 3s and then resets it'
          ),
          m(Bt, 'class', 'button')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(o, r),
          s(r, u),
          (u.checked = e[0]),
          s(r, l),
          s(o, y),
          s(o, w),
          s(w, x),
          (x.checked = e[1]),
          s(w, M),
          s(o, k),
          s(o, C),
          s(o, $),
          s(o, T),
          s(o, O),
          s(o, E),
          s(o, S),
          s(o, P),
          s(P, z),
          (z.checked = e[14]),
          s(P, A),
          s(o, j),
          s(o, W),
          s(W, L),
          (L.checked = e[2]),
          s(W, F),
          s(o, D),
          s(o, R),
          s(R, I),
          (I.checked = e[3]),
          s(R, U),
          s(o, N),
          s(o, K),
          s(K, q),
          (q.checked = e[4]),
          s(K, B),
          s(o, H),
          s(o, G),
          s(n, V),
          s(n, J),
          s(J, X),
          s(X, Y),
          s(Y, Q),
          s(Q, Z),
          s(Q, tt),
          b(tt, e[11]),
          s(Y, et),
          s(Y, nt),
          s(nt, it),
          s(nt, ot),
          b(ot, e[12]),
          s(X, rt),
          s(X, ut),
          s(ut, st),
          s(st, ct),
          s(st, at),
          b(at, e[5]),
          s(ut, lt),
          s(ut, dt),
          s(dt, ft),
          s(dt, ht),
          b(ht, e[6]),
          s(X, pt),
          s(X, vt),
          s(vt, mt),
          s(mt, gt),
          s(mt, yt),
          b(yt, e[7]),
          s(vt, bt),
          s(vt, _t),
          s(_t, wt),
          s(_t, xt),
          b(xt, e[8]),
          s(X, Mt),
          s(X, kt),
          s(kt, Ct),
          s(Ct, $t),
          s(Ct, Tt),
          b(Tt, e[9]),
          s(kt, Ot),
          s(kt, Et),
          s(Et, St),
          s(Et, Pt),
          b(Pt, e[10]),
          c(t, zt, i),
          c(t, At, i),
          s(At, jt),
          b(jt, e[15]),
          s(At, Wt),
          s(At, Lt),
          c(t, Ft, i),
          c(t, Dt, i),
          s(Dt, Rt),
          b(Rt, e[13]),
          s(Dt, It),
          s(Dt, Ut),
          c(t, Nt, i),
          c(t, Kt, i),
          c(t, qt, i),
          c(t, Bt, i),
          Ht ||
            ((Gt = [
              p(u, 'change', e[25]),
              p(x, 'change', e[26]),
              p(C, 'click', e[16]),
              p(T, 'click', e[20]),
              p(E, 'click', e[19]),
              p(z, 'change', e[27]),
              p(L, 'change', e[28]),
              p(I, 'change', e[29]),
              p(q, 'change', e[30]),
              p(G, 'click', e[21]),
              p(tt, 'input', e[31]),
              p(ot, 'input', e[32]),
              p(at, 'input', e[33]),
              p(ht, 'input', e[34]),
              p(yt, 'input', e[35]),
              p(xt, 'input', e[36]),
              p(Tt, 'input', e[37]),
              p(Pt, 'input', e[38]),
              p(jt, 'input', e[39]),
              p(At, 'submit', v(e[18])),
              p(Rt, 'input', e[40]),
              p(Dt, 'submit', v(e[17])),
              p(Kt, 'click', e[23]),
              p(Bt, 'click', e[22])
            ]),
            (Ht = !0))
      },
      p(t, e) {
        1 & e[0] && (u.checked = t[0]),
          2 & e[0] && (x.checked = t[1]),
          16384 & e[0] && (z.checked = t[14]),
          4 & e[0] && (L.checked = t[2]),
          8 & e[0] && (I.checked = t[3]),
          16 & e[0] && (q.checked = t[4]),
          2048 & e[0] && g(tt.value) !== t[11] && b(tt, t[11]),
          4096 & e[0] && g(ot.value) !== t[12] && b(ot, t[12]),
          32 & e[0] && g(at.value) !== t[5] && b(at, t[5]),
          64 & e[0] && g(ht.value) !== t[6] && b(ht, t[6]),
          128 & e[0] && g(yt.value) !== t[7] && b(yt, t[7]),
          256 & e[0] && g(xt.value) !== t[8] && b(xt, t[8]),
          512 & e[0] && g(Tt.value) !== t[9] && b(Tt, t[9]),
          1024 & e[0] && g(Pt.value) !== t[10] && b(Pt, t[10]),
          32768 & e[0] && jt.value !== t[15] && b(jt, t[15]),
          8192 & e[0] && Rt.value !== t[13] && b(Rt, t[13])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n),
          t && a(zt),
          t && a(At),
          t && a(Ft),
          t && a(Dt),
          t && a(Nt),
          t && a(Kt),
          t && a(qt),
          t && a(Bt),
          (Ht = !1),
          i(Gt)
      }
    }
  }
  function Ie(t, e, n) {
    const {
      setResizable: i,
      setTitle: o,
      maximize: r,
      unmaximize: u,
      minimize: s,
      unminimize: c,
      show: a,
      hide: l,
      setDecorations: d,
      setAlwaysOnTop: f,
      setSize: h,
      setMinSize: p,
      setMaxSize: v,
      setPosition: m,
      setFullscreen: y,
      setIcon: b,
      center: _,
      requestUserAttention: w
    } = De
    ;(window.app = De), (window.UserAttentionType = Oe)
    let { onMessage: x } = e,
      M = 'https://tauri.studio',
      k = !0,
      C = !1,
      $ = !1,
      T = !0,
      O = !1,
      E = !1,
      S = 900,
      P = 700,
      z = 600,
      A = 600,
      j = null,
      W = null,
      L = 100,
      F = 100,
      D = 'Awesome Tauri Example!'
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(24, (x = t.onMessage))
      }),
      (t.$$.update = () => {
        1 & t.$$.dirty[0] && i(k),
          2 & t.$$.dirty[0] && (C ? r() : u()),
          4 & t.$$.dirty[0] && d(T),
          8 & t.$$.dirty[0] && f(O),
          16 & t.$$.dirty[0] && y(E),
          96 & t.$$.dirty[0] && h(new Ee(S, P)),
          384 & t.$$.dirty[0] && p(z && A ? new Ee(z, A) : null),
          1536 & t.$$.dirty[0] && v(j && W ? new Ee(j, W) : null),
          6144 & t.$$.dirty[0] && m(new Pe(L, F))
      }),
      [
        k,
        C,
        T,
        O,
        E,
        S,
        P,
        z,
        A,
        j,
        W,
        L,
        F,
        M,
        $,
        D,
        _,
        function () {
          Wt(M)
        },
        function () {
          o(D)
        },
        function () {
          l(), setTimeout(a, 2e3)
        },
        function () {
          s(), setTimeout(c, 2e3)
        },
        function () {
          ne({ multiple: !1 }).then(b)
        },
        function () {
          new Le(Math.random().toString()).once('tauri://error', function () {
            x('Error creating new webview')
          })
        },
        async function () {
          await s(),
            await w(Oe.Critical),
            await new Promise((t) => setTimeout(t, 3e3)),
            await w(null)
        },
        x,
        function () {
          ;(k = this.checked), n(0, k)
        },
        function () {
          ;(C = this.checked), n(1, C)
        },
        function () {
          ;($ = this.checked), n(14, $)
        },
        function () {
          ;(T = this.checked), n(2, T)
        },
        function () {
          ;(O = this.checked), n(3, O)
        },
        function () {
          ;(E = this.checked), n(4, E)
        },
        function () {
          ;(L = g(this.value)), n(11, L)
        },
        function () {
          ;(F = g(this.value)), n(12, F)
        },
        function () {
          ;(S = g(this.value)), n(5, S)
        },
        function () {
          ;(P = g(this.value)), n(6, P)
        },
        function () {
          ;(z = g(this.value)), n(7, z)
        },
        function () {
          ;(A = g(this.value)), n(8, A)
        },
        function () {
          ;(j = g(this.value)), n(9, j)
        },
        function () {
          ;(W = g(this.value)), n(10, W)
        },
        function () {
          ;(D = this.value), n(15, D)
        },
        function () {
          ;(M = this.value), n(13, M)
        }
      ]
    )
  }
  Object.freeze({
    __proto__: null,
    WebviewWindow: Le,
    WebviewWindowHandle: We,
    WindowManager: Fe,
    getCurrent: function () {
      return new We(window.__TAURI__.__currentWindow.label)
    },
    getAll: Ae,
    appWindow: De,
    LogicalSize: Ee,
    PhysicalSize: Se,
    LogicalPosition: Pe,
    PhysicalPosition: ze,
    get UserAttentionType() {
      return Oe
    },
    currentMonitor: function () {
      return Mt(this, void 0, void 0, function () {
        return kt(this, function (t) {
          return [
            2,
            Ot({ __tauriModule: 'Window', message: { cmd: 'currentMonitor' } })
          ]
        })
      })
    },
    primaryMonitor: function () {
      return Mt(this, void 0, void 0, function () {
        return kt(this, function (t) {
          return [
            2,
            Ot({ __tauriModule: 'Window', message: { cmd: 'primaryMonitor' } })
          ]
        })
      })
    },
    availableMonitors: function () {
      return Mt(this, void 0, void 0, function () {
        return kt(this, function (t) {
          return [
            2,
            Ot({
              __tauriModule: 'Window',
              message: { cmd: 'availableMonitors' }
            })
          ]
        })
      })
    }
  })
  class Ue extends V {
    constructor(t) {
      var e
      super(),
        document.getElementById('svelte-b76pvm-style') ||
          (((e = d('style')).id = 'svelte-b76pvm-style'),
          (e.textContent =
            '.flex-row.svelte-b76pvm.svelte-b76pvm{flex-direction:row}.grow.svelte-b76pvm.svelte-b76pvm{flex-grow:1}.window-controls.svelte-b76pvm input.svelte-b76pvm{width:50px}'),
          s(document.head, e)),
        G(this, t, Ie, Re, r, { onMessage: 24 }, [-1, -1])
    }
  }
  function Ne(t, e) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (n) {
        return [
          2,
          Ot({
            __tauriModule: 'GlobalShortcut',
            message: { cmd: 'register', shortcut: t, handler: Ct(e) }
          })
        ]
      })
    })
  }
  function Ke(t) {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (e) {
        return [
          2,
          Ot({
            __tauriModule: 'GlobalShortcut',
            message: { cmd: 'unregister', shortcut: t }
          })
        ]
      })
    })
  }
  function qe() {
    return Mt(this, void 0, void 0, function () {
      return kt(this, function (t) {
        return [
          2,
          Ot({
            __tauriModule: 'GlobalShortcut',
            message: { cmd: 'unregisterAll' }
          })
        ]
      })
    })
  }
  function Be(t, e, n) {
    const i = t.slice()
    return (i[9] = e[n]), i
  }
  function He(t) {
    let e,
      n,
      i,
      o,
      r,
      u,
      l = t[9] + ''
    function v() {
      return t[8](t[9])
    }
    return {
      c() {
        ;(e = d('div')),
          (n = f(l)),
          (i = h()),
          (o = d('button')),
          (o.textContent = 'Unregister'),
          m(o, 'type', 'button')
      },
      m(t, a) {
        c(t, e, a),
          s(e, n),
          s(e, i),
          s(e, o),
          r || ((u = p(o, 'click', v)), (r = !0))
      },
      p(e, i) {
        ;(t = e), 2 & i && l !== (l = t[9] + '') && y(n, l)
      },
      d(t) {
        t && a(e), (r = !1), u()
      }
    }
  }
  function Ge(e) {
    let n, i, o
    return {
      c() {
        ;(n = d('button')),
          (n.textContent = 'Unregister all'),
          m(n, 'type', 'button')
      },
      m(t, r) {
        c(t, n, r), i || ((o = p(n, 'click', e[5])), (i = !0))
      },
      p: t,
      d(t) {
        t && a(n), (i = !1), o()
      }
    }
  }
  function Ve(e) {
    let n,
      o,
      r,
      u,
      f,
      v,
      g,
      y,
      _,
      w,
      x = e[1],
      M = []
    for (let t = 0; t < x.length; t += 1) M[t] = He(Be(e, x, t))
    let k = e[1].length && Ge(e)
    return {
      c() {
        ;(n = d('div')),
          (o = d('div')),
          (r = d('input')),
          (u = h()),
          (f = d('button')),
          (f.textContent = 'Register'),
          (v = h()),
          (g = d('div'))
        for (let t = 0; t < M.length; t += 1) M[t].c()
        ;(y = h()),
          k && k.c(),
          m(r, 'placeholder', "Type a shortcut with '+' as separator..."),
          m(f, 'type', 'button')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(o, r),
          b(r, e[0]),
          s(o, u),
          s(o, f),
          s(n, v),
          s(n, g)
        for (let t = 0; t < M.length; t += 1) M[t].m(g, null)
        s(g, y),
          k && k.m(g, null),
          _ || ((w = [p(r, 'input', e[7]), p(f, 'click', e[3])]), (_ = !0))
      },
      p(t, [e]) {
        if ((1 & e && r.value !== t[0] && b(r, t[0]), 18 & e)) {
          let n
          for (x = t[1], n = 0; n < x.length; n += 1) {
            const i = Be(t, x, n)
            M[n] ? M[n].p(i, e) : ((M[n] = He(i)), M[n].c(), M[n].m(g, y))
          }
          for (; n < M.length; n += 1) M[n].d(1)
          M.length = x.length
        }
        t[1].length
          ? k
            ? k.p(t, e)
            : ((k = Ge(t)), k.c(), k.m(g, null))
          : k && (k.d(1), (k = null))
      },
      i: t,
      o: t,
      d(t) {
        t && a(n), l(M, t), k && k.d(), (_ = !1), i(w)
      }
    }
  }
  function Je(t, e, n) {
    let i,
      { onMessage: o } = e
    const r = X([])
    u(t, r, (t) => n(1, (i = t)))
    let s = 'CmdOrControl+X'
    function c(t) {
      const e = t
      Ke(e)
        .then(() => {
          r.update((t) => t.filter((t) => t !== e)),
            o(`Shortcut ${e} unregistered`)
        })
        .catch(o)
    }
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(6, (o = t.onMessage))
      }),
      [
        s,
        i,
        r,
        function () {
          const t = s
          Ne(t, () => {
            o(`Shortcut ${t} triggered`)
          })
            .then(() => {
              r.update((e) => [...e, t]),
                o(`Shortcut ${t} registered successfully`)
            })
            .catch(o)
        },
        c,
        function () {
          qe()
            .then(() => {
              r.update(() => []), o('Unregistered all shortcuts')
            })
            .catch(o)
        },
        o,
        function () {
          ;(s = this.value), n(0, s)
        },
        (t) => c(t)
      ]
    )
  }
  Object.freeze({
    __proto__: null,
    register: Ne,
    registerAll: function (t, e) {
      return Mt(this, void 0, void 0, function () {
        return kt(this, function (n) {
          return [
            2,
            Ot({
              __tauriModule: 'GlobalShortcut',
              message: { cmd: 'registerAll', shortcuts: t, handler: Ct(e) }
            })
          ]
        })
      })
    },
    isRegistered: function (t) {
      return Mt(this, void 0, void 0, function () {
        return kt(this, function (e) {
          return [
            2,
            Ot({
              __tauriModule: 'GlobalShortcut',
              message: { cmd: 'isRegistered', shortcut: t }
            })
          ]
        })
      })
    },
    unregister: Ke,
    unregisterAll: qe
  })
  class Xe extends V {
    constructor(t) {
      super(), G(this, t, Je, Ve, r, { onMessage: 6 })
    }
  }
  function Ye(t) {
    let e, n, o, r, u
    return {
      c() {
        ;(e = d('input')),
          (n = h()),
          (o = d('button')),
          (o.textContent = 'Write'),
          m(e, 'placeholder', 'write to stdin'),
          m(o, 'class', 'button')
      },
      m(i, s) {
        c(i, e, s),
          b(e, t[3]),
          c(i, n, s),
          c(i, o, s),
          r || ((u = [p(e, 'input', t[10]), p(o, 'click', t[7])]), (r = !0))
      },
      p(t, n) {
        8 & n && e.value !== t[3] && b(e, t[3])
      },
      d(t) {
        t && a(e), t && a(n), t && a(o), (r = !1), i(u)
      }
    }
  }
  function Qe(e) {
    let n,
      o,
      r,
      u,
      l,
      f,
      v,
      g,
      y,
      w,
      x,
      M,
      k,
      C,
      $,
      T = e[4] && Ye(e)
    return {
      c() {
        ;(n = d('div')),
          (o = d('div')),
          (r = d('input')),
          (u = h()),
          (l = d('button')),
          (l.textContent = 'Run'),
          (f = h()),
          (v = d('button')),
          (v.textContent = 'Kill'),
          (g = h()),
          T && T.c(),
          (y = h()),
          (w = d('div')),
          (x = d('input')),
          (M = h()),
          (k = d('input')),
          m(l, 'class', 'button'),
          m(v, 'class', 'button'),
          m(x, 'placeholder', 'Working directory'),
          m(k, 'placeholder', 'Environment variables'),
          _(k, 'width', '300px')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(o, r),
          b(r, e[0]),
          s(o, u),
          s(o, l),
          s(o, f),
          s(o, v),
          s(o, g),
          T && T.m(o, null),
          s(n, y),
          s(n, w),
          s(w, x),
          b(x, e[1]),
          s(w, M),
          s(w, k),
          b(k, e[2]),
          C ||
            (($ = [
              p(r, 'input', e[9]),
              p(l, 'click', e[5]),
              p(v, 'click', e[6]),
              p(x, 'input', e[11]),
              p(k, 'input', e[12])
            ]),
            (C = !0))
      },
      p(t, [e]) {
        1 & e && r.value !== t[0] && b(r, t[0]),
          t[4]
            ? T
              ? T.p(t, e)
              : ((T = Ye(t)), T.c(), T.m(o, null))
            : T && (T.d(1), (T = null)),
          2 & e && x.value !== t[1] && b(x, t[1]),
          4 & e && k.value !== t[2] && b(k, t[2])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n), T && T.d(), (C = !1), i($)
      }
    }
  }
  function Ze(t, e, n) {
    const i = navigator.userAgent.includes('Windows')
    let o,
      r = i ? 'cmd' : 'sh',
      u = i ? ['/C'] : ['-c'],
      { onMessage: s } = e,
      c = 'echo "hello world"',
      a = null,
      l = 'SOMETHING=value ANOTHER=2',
      d = ''
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(8, (s = t.onMessage))
      }),
      [
        c,
        a,
        l,
        d,
        o,
        function () {
          n(4, (o = null))
          const t = new jt(r, [...u, c], {
            cwd: a || null,
            env: l.split(' ').reduce((t, e) => {
              let [n, i] = e.split('=')
              return { ...t, [n]: i }
            }, {})
          })
          t.on('close', (t) => {
            s(`command finished with code ${t.code} and signal ${t.signal}`),
              n(4, (o = null))
          }),
            t.on('error', (t) => s(`command error: "${t}"`)),
            t.stdout.on('data', (t) => s(`command stdout: "${t}"`)),
            t.stderr.on('data', (t) => s(`command stderr: "${t}"`)),
            t
              .spawn()
              .then((t) => {
                n(4, (o = t))
              })
              .catch(s)
        },
        function () {
          o.kill()
            .then(() => s('killed child process'))
            .catch(s)
        },
        function () {
          o.write(d).catch(s)
        },
        s,
        function () {
          ;(c = this.value), n(0, c)
        },
        function () {
          ;(d = this.value), n(3, d)
        },
        function () {
          ;(a = this.value), n(1, a)
        },
        function () {
          ;(l = this.value), n(2, l)
        }
      ]
    )
  }
  class tn extends V {
    constructor(t) {
      super(), G(this, t, Ze, Qe, r, { onMessage: 8 })
    }
  }
  function en() {
    return Mt(this, void 0, void 0, function () {
      function t() {
        e && e(), (e = void 0)
      }
      var e
      return kt(this, function (n) {
        return [
          2,
          new Promise(function (n, i) {
            Xt('tauri://update-status', function (e) {
              var o
              ;(o = null == e ? void 0 : e.payload).error
                ? (t(), i(o.error))
                : 'DONE' === o.status && (t(), n())
            })
              .then(function (t) {
                e = t
              })
              .catch(function (e) {
                throw (t(), e)
              }),
              Qt('tauri://update-install').catch(function (e) {
                throw (t(), e)
              })
          })
        ]
      })
    })
  }
  function nn() {
    return Mt(this, void 0, void 0, function () {
      function t() {
        e && e(), (e = void 0)
      }
      var e
      return kt(this, function (n) {
        return [
          2,
          new Promise(function (n, i) {
            Yt('tauri://update-available', function (e) {
              var i
              ;(i = null == e ? void 0 : e.payload),
                t(),
                n({ manifest: i, shouldUpdate: !0 })
            }).catch(function (e) {
              throw (t(), e)
            }),
              Xt('tauri://update-status', function (e) {
                var o
                ;(o = null == e ? void 0 : e.payload).error
                  ? (t(), i(o.error))
                  : 'UPTODATE' === o.status && (t(), n({ shouldUpdate: !1 }))
              })
                .then(function (t) {
                  e = t
                })
                .catch(function (e) {
                  throw (t(), e)
                }),
              Qt('tauri://update').catch(function (e) {
                throw (t(), e)
              })
          })
        ]
      })
    })
  }
  function on(e) {
    let n, o, r, u, l, f
    return {
      c() {
        ;(n = d('div')),
          (o = d('button')),
          (o.textContent = 'Check update'),
          (r = h()),
          (u = d('button')),
          (u.textContent = 'Install update'),
          m(o, 'class', 'button'),
          m(o, 'id', 'check_update'),
          m(u, 'class', 'button hidden'),
          m(u, 'id', 'start_update')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(n, r),
          s(n, u),
          l || ((f = [p(o, 'click', e[0]), p(u, 'click', e[1])]), (l = !0))
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && a(n), (l = !1), i(f)
      }
    }
  }
  function rn(t, e, n) {
    let i,
      { onMessage: o } = e
    return (
      $(async () => {
        i = await Xt('tauri://update-status', o)
      }),
      T(() => {
        i && i()
      }),
      (t.$$set = (t) => {
        'onMessage' in t && n(2, (o = t.onMessage))
      }),
      [
        async function () {
          try {
            document.getElementById('check_update').classList.add('hidden')
            const { shouldUpdate: t, manifest: e } = await nn()
            o(`Should update: ${t}`),
              o(e),
              t &&
                document
                  .getElementById('start_update')
                  .classList.remove('hidden')
          } catch (t) {
            o(t)
          }
        },
        async function () {
          try {
            document.getElementById('start_update').classList.add('hidden'),
              await en(),
              o('Installation complete, restart required.'),
              await It()
          } catch (t) {
            o(t)
          }
        },
        o
      ]
    )
  }
  Object.freeze({ __proto__: null, installUpdate: en, checkUpdate: nn })
  class un extends V {
    constructor(t) {
      super(), G(this, t, rn, on, r, { onMessage: 2 })
    }
  }
  function sn(e) {
    let n, o, r, u, l, f, v, g, y
    return {
      c() {
        ;(n = d('div')),
          (o = d('div')),
          (r = d('input')),
          (u = h()),
          (l = d('button')),
          (l.textContent = 'Write'),
          (f = h()),
          (v = d('button')),
          (v.textContent = 'Read'),
          m(r, 'placeholder', 'Text to write to the clipboard'),
          m(l, 'type', 'button'),
          m(v, 'type', 'button')
      },
      m(t, i) {
        c(t, n, i),
          s(n, o),
          s(o, r),
          b(r, e[0]),
          s(o, u),
          s(o, l),
          s(n, f),
          s(n, v),
          g ||
            ((y = [
              p(r, 'input', e[4]),
              p(l, 'click', e[1]),
              p(v, 'click', e[2])
            ]),
            (g = !0))
      },
      p(t, [e]) {
        1 & e && r.value !== t[0] && b(r, t[0])
      },
      i: t,
      o: t,
      d(t) {
        t && a(n), (g = !1), i(y)
      }
    }
  }
  function cn(t, e, n) {
    let { onMessage: i } = e,
      o = 'clipboard message'
    return (
      (t.$$set = (t) => {
        'onMessage' in t && n(3, (i = t.onMessage))
      }),
      [
        o,
        function () {
          ;(function (t) {
            return Mt(this, void 0, void 0, function () {
              return kt(this, function (e) {
                return [
                  2,
                  Ot({
                    __tauriModule: 'Clipboard',
                    message: { cmd: 'writeText', data: t }
                  })
                ]
              })
            })
          })(o)
            .then(() => {
              i('Wrote to the clipboard')
            })
            .catch(i)
        },
        function () {
          ;(function () {
            return Mt(this, void 0, void 0, function () {
              return kt(this, function (t) {
                return [
                  2,
                  Ot({
                    __tauriModule: 'Clipboard',
                    message: { cmd: 'readText' }
                  })
                ]
              })
            })
          })()
            .then((t) => {
              i(`Clipboard contents: ${t}`)
            })
            .catch(i)
        },
        i,
        function () {
          ;(o = this.value), n(0, o)
        }
      ]
    )
  }
  class an extends V {
    constructor(t) {
      super(), G(this, t, cn, sn, r, { onMessage: 3 })
    }
  }
  function ln(t, e, n) {
    const i = t.slice()
    return (i[9] = e[n]), i
  }
  function dn(t) {
    let e,
      n,
      i,
      o,
      r,
      u,
      l = t[9].label + ''
    function v() {
      return t[7](t[9])
    }
    return {
      c() {
        ;(e = d('p')),
          (n = f(l)),
          (i = h()),
          m(
            e,
            'class',
            (o = 'nv noselect ' + (t[0] === t[9] ? 'nv_selected' : ''))
          )
      },
      m(t, o) {
        c(t, e, o), s(e, n), s(e, i), r || ((u = p(e, 'click', v)), (r = !0))
      },
      p(n, i) {
        ;(t = n),
          1 & i &&
            o !== (o = 'nv noselect ' + (t[0] === t[9] ? 'nv_selected' : '')) &&
            m(e, 'class', o)
      },
      d(t) {
        t && a(e), (r = !1), u()
      }
    }
  }
  function fn(t) {
    let e,
      n,
      o,
      r,
      u,
      f,
      v,
      g,
      y,
      b,
      w,
      M,
      k,
      C,
      $,
      T,
      O,
      E,
      S,
      P,
      z,
      A,
      j,
      W = t[2],
      L = []
    for (let e = 0; e < W.length; e += 1) L[e] = dn(ln(t, W, e))
    var F = t[0].component
    function D(t) {
      return { props: { onMessage: t[5] } }
    }
    return (
      F && (M = new F(D(t))),
      {
        c() {
          ;(e = d('main')),
            (n = d('div')),
            (o = d('img')),
            (u = h()),
            (f = d('div')),
            (f.innerHTML =
              '<a class="dark-link" target="_blank" href="https://tauri.studio/en/docs/getting-started/intro">Documentation</a> \n      <a class="dark-link" target="_blank" href="https://github.com/tauri-apps/tauri">Github</a> \n      <a class="dark-link" target="_blank" href="https://github.com/tauri-apps/tauri/tree/dev/tauri/examples/api">Source</a>'),
            (v = h()),
            (g = d('div')),
            (y = d('div'))
          for (let t = 0; t < L.length; t += 1) L[t].c()
          ;(b = h()),
            (w = d('div')),
            M && K(M.$$.fragment),
            (k = h()),
            (C = d('div')),
            ($ = d('p')),
            (T = d('strong')),
            (T.textContent = 'Tauri Console'),
            (O = h()),
            (E = d('a')),
            (E.textContent = 'clear'),
            (S = h()),
            m(o, 'class', 'logo'),
            o.src !== (r = 'tauri logo.png') && m(o, 'src', 'tauri logo.png'),
            m(o, 'height', '60'),
            m(o, 'alt', 'logo'),
            m(n, 'class', 'flex row noselect just-around'),
            m(n, 'style', 'margin=1em;'),
            m(n, 'data-tauri-drag-region', ''),
            _(y, 'width', '15em'),
            _(y, 'margin-left', '0.5em'),
            m(w, 'class', 'content'),
            m(g, 'class', 'flex row'),
            m(E, 'class', 'nv'),
            m($, 'class', 'flex row just-around'),
            (P = new x(null)),
            m(C, 'id', 'response'),
            _(C, 'white-space', 'pre-line')
        },
        m(i, r) {
          c(i, e, r),
            s(e, n),
            s(n, o),
            s(n, u),
            s(n, f),
            s(e, v),
            s(e, g),
            s(g, y)
          for (let t = 0; t < L.length; t += 1) L[t].m(y, null)
          s(g, b),
            s(g, w),
            M && q(M, w, null),
            s(e, k),
            s(e, C),
            s(C, $),
            s($, T),
            s($, O),
            s($, E),
            s(C, S),
            P.m(t[1], C),
            (z = !0),
            A || ((j = [p(o, 'click', t[6]), p(E, 'click', t[8])]), (A = !0))
        },
        p(t, [e]) {
          if (21 & e) {
            let n
            for (W = t[2], n = 0; n < W.length; n += 1) {
              const i = ln(t, W, n)
              L[n] ? L[n].p(i, e) : ((L[n] = dn(i)), L[n].c(), L[n].m(y, null))
            }
            for (; n < L.length; n += 1) L[n].d(1)
            L.length = W.length
          }
          if (F !== (F = t[0].component)) {
            if (M) {
              I = { r: 0, c: [], p: I }
              const t = M
              N(t.$$.fragment, 1, 0, () => {
                B(t, 1)
              }),
                I.r || i(I.c),
                (I = I.p)
            }
            F
              ? ((M = new F(D(t))),
                K(M.$$.fragment),
                U(M.$$.fragment, 1),
                q(M, w, null))
              : (M = null)
          }
          ;(!z || 2 & e) && P.p(t[1])
        },
        i(t) {
          z || (M && U(M.$$.fragment, t), (z = !0))
        },
        o(t) {
          M && N(M.$$.fragment, t), (z = !1)
        },
        d(t) {
          t && a(e), l(L, t), M && B(M), (A = !1), i(j)
        }
      }
    )
  }
  function hn(t, e, n) {
    $(() => {
      mt('ctrl+b', () => {
        $t('menu_toggle')
      })
    })
    const i = [
      { label: 'Welcome', component: Kt },
      { label: 'Messages', component: ee },
      { label: 'CLI', component: Gt },
      { label: 'Dialog', component: ae },
      { label: 'File system', component: ve },
      { label: 'HTTP', component: Me },
      { label: 'Notifications', component: Te },
      { label: 'Window', component: Ue },
      { label: 'Shortcuts', component: Xe },
      { label: 'Shell', component: tn },
      { label: 'Updater', component: un },
      { label: 'Clipboard', component: an }
    ]
    let o = i[0],
      r = X([]),
      u = ''
    function s(t) {
      n(0, (o = t))
    }
    $(() => {
      r.subscribe((t) => {
        n(1, (u = t.join('\n')))
      })
    })
    return [
      o,
      u,
      i,
      r,
      s,
      function (t) {
        r.update((e) => [
          `[${new Date().toLocaleTimeString()}]: ` +
            ('string' == typeof t ? t : JSON.stringify(t)),
          ...e
        ])
      },
      function () {
        Wt('https://tauri.studio/')
      },
      (t) => s(t),
      () => {
        r.update(() => [])
      }
    ]
  }
  return new (class extends V {
    constructor(t) {
      super(), G(this, t, hn, fn, r, {})
    }
  })({ target: document.body })
})()
//# sourceMappingURL=bundle.js.map
