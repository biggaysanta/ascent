//#region node_modules/alpinejs/dist/module.esm.js
var e = !1, t = !1, n = [], r = -1, i = !1;
function a(e) {
	c(e);
}
function o() {
	i = !0;
}
function s() {
	i = !1, u();
}
function c(e) {
	n.includes(e) || n.push(e), u();
}
function l(e) {
	let t = n.indexOf(e);
	t !== -1 && t > r && n.splice(t, 1);
}
function u() {
	if (!t && !e) {
		if (i) return;
		e = !0, queueMicrotask(d);
	}
}
function d() {
	e = !1, t = !0;
	for (let e = 0; e < n.length; e++) n[e](), r = e;
	n.length = 0, r = -1, t = !1;
}
var f, p, m, h, g = !0;
function _(e) {
	g = !1, e(), g = !0;
}
function v(e) {
	f = e.reactive, m = e.release, p = (t) => e.effect(t, { scheduler: (e) => {
		g ? a(e) : e();
	} }), h = e.raw;
}
function y(e) {
	p = e;
}
function b(e) {
	let t = () => {};
	return [(n) => {
		let r = p(n);
		return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
			e._x_effects.forEach((e) => e());
		}), e._x_effects.add(r), t = () => {
			r !== void 0 && (e._x_effects.delete(r), m(r));
		}, r;
	}, () => {
		t();
	}];
}
function x(e, t) {
	let n = !0, r, i, a = p(() => {
		let a = e(), o = JSON.stringify(a);
		if (!n && (typeof a == "object" || a !== r)) {
			let e = typeof r == "object" ? JSON.parse(i) : r;
			queueMicrotask(() => {
				t(a, e);
			});
		}
		r = a, i = o, n = !1;
	});
	return () => m(a);
}
async function S(e) {
	o();
	try {
		await e(), await Promise.resolve();
	} finally {
		s();
	}
}
var C = [], w = [], T = [];
function E(e) {
	T.push(e);
}
function D(e, t) {
	typeof t == "function" ? (e._x_cleanups ||= [], e._x_cleanups.push(t)) : (t = e, w.push(t));
}
function O(e) {
	C.push(e);
}
function k(e, t, n) {
	e._x_attributeCleanups ||= {}, e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function A(e, t) {
	e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, r]) => {
		(t === void 0 || t.includes(n)) && (r.forEach((e) => e()), delete e._x_attributeCleanups[n]);
	});
}
function j(e) {
	for (e._x_effects?.forEach(l); e._x_cleanups?.length;) e._x_cleanups.pop()();
}
var M = new MutationObserver(ie), N = !1;
function P() {
	M.observe(document, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeOldValue: !0
	}), N = !0;
}
function F() {
	ee(), M.disconnect(), N = !1;
}
var I = [];
function ee() {
	let e = M.takeRecords();
	I.push(() => e.length > 0 && ie(e));
	let t = I.length;
	queueMicrotask(() => {
		if (I.length === t) for (; I.length > 0;) I.shift()();
	});
}
function L(e) {
	if (!N) return e();
	F();
	let t = e();
	return P(), t;
}
var te = !1, ne = [];
function re() {
	te = !0;
}
function R() {
	te = !1, ie(ne), ne = [];
}
function ie(e) {
	if (te) {
		ne = ne.concat(e);
		return;
	}
	let t = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let a = 0; a < e.length; a++) if (!e[a].target._x_ignoreMutationObserver && (e[a].type === "childList" && (e[a].removedNodes.forEach((e) => {
		e.nodeType === 1 && e._x_marker && n.add(e);
	}), e[a].addedNodes.forEach((e) => {
		if (e.nodeType === 1) {
			if (n.has(e)) {
				n.delete(e);
				return;
			}
			e._x_marker || t.push(e);
		}
	})), e[a].type === "attributes")) {
		let t = e[a].target, n = e[a].attributeName, o = e[a].oldValue, s = () => {
			r.has(t) || r.set(t, []), r.get(t).push({
				name: n,
				value: t.getAttribute(n)
			});
		}, c = () => {
			i.has(t) || i.set(t, []), i.get(t).push(n);
		};
		t.hasAttribute(n) && o === null ? s() : t.hasAttribute(n) ? (c(), s()) : c();
	}
	i.forEach((e, t) => {
		A(t, e);
	}), r.forEach((e, t) => {
		C.forEach((n) => n(t, e));
	});
	for (let e of n) t.some((t) => t.contains(e)) || w.forEach((t) => t(e));
	for (let e of t) e.isConnected && T.forEach((t) => t(e));
	t = null, n = null, r = null, i = null;
}
function ae(e) {
	return ce(se(e));
}
function oe(e, t, n) {
	return e._x_dataStack = [t, ...se(n || e)], () => {
		e._x_dataStack = e._x_dataStack.filter((e) => e !== t);
	};
}
function se(e) {
	return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? se(e.host) : e.parentNode ? se(e.parentNode) : [];
}
function ce(e) {
	return new Proxy({ objects: e }, ue);
}
function le(e, t) {
	return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : le(Object.getPrototypeOf(e), t);
}
var ue = {
	ownKeys({ objects: e }) {
		return Array.from(new Set(e.flatMap((e) => Object.keys(e))));
	},
	has({ objects: e }, t) {
		return t != Symbol.unscopables && e.some((e) => Object.prototype.hasOwnProperty.call(e, t) || Reflect.has(e, t));
	},
	get({ objects: e }, t, n) {
		return t == "toJSON" ? de : Reflect.get(e.find((e) => Reflect.has(e, t)) || {}, t, n);
	},
	set({ objects: e }, t, n, r) {
		let i;
		for (let n of e) if (i = le(n, t), i) break;
		i ||= e[e.length - 1];
		let a = Object.getOwnPropertyDescriptor(i, t);
		return a?.set && a?.get ? a.set.call(r, n) || !0 : Reflect.set(i, t, n);
	}
};
function de() {
	return Reflect.ownKeys(this).reduce((e, t) => (e[t] = Reflect.get(this, t), e), {});
}
function fe(e) {
	let t = (e) => typeof e == "object" && !Array.isArray(e) && e !== null, n = (r, i = "") => {
		Object.entries(Object.getOwnPropertyDescriptors(r)).forEach(([a, { value: o, enumerable: s }]) => {
			if (s === !1 || o === void 0 || typeof o == "object" && o && o.__v_skip) return;
			let c = i === "" ? a : `${i}.${a}`;
			typeof o == "object" && o && o._x_interceptor ? r[a] = o.initialize(e, c, a) : t(o) && o !== r && !(o instanceof Element) && n(o, c);
		});
	};
	return n(e);
}
function pe(e, t = () => {}) {
	let n = {
		initialValue: void 0,
		_x_interceptor: !0,
		initialize(t, n, r) {
			return e(this.initialValue, () => me(t, n), (e) => he(t, n, e), n, r);
		}
	};
	return t(n), (e) => {
		if (typeof e == "object" && e && e._x_interceptor) {
			let t = n.initialize.bind(n);
			n.initialize = (r, i, a) => {
				let o = e.initialize(r, i, a);
				return n.initialValue = o, t(r, i, a);
			};
		} else n.initialValue = e;
		return n;
	};
}
function me(e, t) {
	return t.split(".").reduce((e, t) => e[t], e);
}
function he(e, t, n) {
	if (typeof t == "string" && (t = t.split(".")), t.length === 1) e[t[0]] = n;
	else if (t.length === 0) throw error;
	else if (e[t[0]]) return he(e[t[0]], t.slice(1), n);
	else return e[t[0]] = {}, he(e[t[0]], t.slice(1), n);
}
var ge = {};
function _e(e, t) {
	ge[e] = t;
}
function ve(e, t) {
	let n = ye(t);
	return Object.entries(ge).forEach(([r, i]) => {
		Object.defineProperty(e, `$${r}`, {
			get() {
				return i(t, n);
			},
			enumerable: !1
		});
	}), e;
}
function ye(e) {
	let [t, n] = $e(e), r = {
		interceptor: pe,
		...t
	};
	return D(e, n), r;
}
function be(e, t, n, ...r) {
	try {
		return n(...r);
	} catch (n) {
		xe(n, e, t);
	}
}
function xe(...e) {
	return Se(...e);
}
var Se = we;
function Ce(e) {
	Se = e;
}
function we(e, t, n = void 0) {
	e = Object.assign(e ?? { message: "No error message given." }, {
		el: t,
		expression: n
	}), console.warn(`Alpine Expression Error: ${e.message}

${n ? "Expression: \"" + n + "\"\n\n" : ""}`, t), setTimeout(() => {
		throw e;
	}, 0);
}
var Te = !0;
function Ee(e) {
	let t = Te;
	Te = !1;
	let n = e();
	return Te = t, n;
}
function De(e, t, n = {}) {
	let r;
	return Oe(e, t)((e) => r = e, n), r;
}
function Oe(...e) {
	return ke(...e);
}
var ke = () => {};
function Ae(e) {
	ke = e;
}
var je;
function Me(e) {
	je = e;
}
function Ne(e, t) {
	let n = {};
	ve(n, e);
	let r = [n, ...se(e)], i = typeof t == "function" ? Pe(r, t) : Le(r, t, e);
	return be.bind(null, e, t, i);
}
function Pe(e, t) {
	return (n = () => {}, { scope: r = {}, params: i = [], context: a } = {}) => {
		if (!Te) {
			Re(n, t, ce([r, ...e]), i);
			return;
		}
		Re(n, t.apply(ce([r, ...e]), i));
	};
}
var Fe = {};
function Ie(e, t) {
	if (Fe[e]) return Fe[e];
	let n = Object.getPrototypeOf(async function() {}).constructor, r = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, i = (() => {
		try {
			let t = new n(["__self", "scope"], `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`);
			return Object.defineProperty(t, "name", { value: `[Alpine] ${e}` }), t;
		} catch (n) {
			return xe(n, t, e), Promise.resolve();
		}
	})();
	return Fe[e] = i, i;
}
function Le(e, t, n) {
	let r = Ie(t, n);
	return (i = () => {}, { scope: a = {}, params: o = [], context: s } = {}) => {
		r.result = void 0, r.finished = !1;
		let c = ce([a, ...e]);
		if (typeof r == "function") {
			let e = r.call(s, r, c).catch((e) => xe(e, n, t));
			r.finished ? (Re(i, r.result, c, o, n), r.result = void 0) : e.then((e) => {
				Re(i, e, c, o, n);
			}).catch((e) => xe(e, n, t)).finally(() => r.result = void 0);
		}
	};
}
function Re(e, t, n, r, i) {
	if (Te && typeof t == "function") {
		let a = t.apply(n, r);
		a instanceof Promise ? a.then((t) => Re(e, t, n, r)).catch((e) => xe(e, i, t)) : e(a);
	} else typeof t == "object" && t instanceof Promise ? t.then((t) => e(t)) : e(t);
}
function ze(...e) {
	return je(...e);
}
function Be(e, t, n = {}) {
	let r = {};
	ve(r, e);
	let i = [r, ...se(e)], a = ce([n.scope ?? {}, ...i]), o = n.params ?? [];
	if (t.includes("await")) {
		let e = Object.getPrototypeOf(async function() {}).constructor;
		return new e(["scope"], `with (scope) { let __result = ${/^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t}; return __result }`).call(n.context, a);
	}
	{
		let e = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(()=>{ ${t} })()` : t, r = Function(["scope"], `with (scope) { let __result = ${e}; return __result }`).call(n.context, a);
		return typeof r == "function" && Te ? r.apply(a, o) : r;
	}
}
var Ve = "x-";
function He(e = "") {
	return Ve + e;
}
function Ue(e) {
	Ve = e;
}
var We = {};
function Ge(e, t) {
	return We[e] = t, { before(t) {
		if (!We[t]) {
			console.warn(String.raw`Cannot find directive \`${t}\`. \`${e}\` will use the default order of execution`);
			return;
		}
		let n = ut.indexOf(t);
		ut.splice(n >= 0 ? n : ut.indexOf("DEFAULT"), 0, e);
	} };
}
function Ke(e) {
	return Object.keys(We).includes(e);
}
function qe(e, t, n) {
	if (t = Array.from(t), e._x_virtualDirectives) {
		let n = Object.entries(e._x_virtualDirectives).map(([e, t]) => ({
			name: e,
			value: t
		})), r = Je(n);
		n = n.map((e) => r.find((t) => t.name === e.name) ? {
			name: `x-bind:${e.name}`,
			value: `"${e.value}"`
		} : e), t = t.concat(n);
	}
	let r = {};
	return t.map(rt((e, t) => r[e] = t)).filter(ot).map(ct(r, n)).sort(dt).map((t) => et(e, t));
}
function Je(e) {
	return Array.from(e).map(rt()).filter((e) => !ot(e));
}
var Ye = !1, Xe = /* @__PURE__ */ new Map(), Ze = Symbol();
function Qe(e) {
	Ye = !0;
	let t = Symbol();
	Ze = t, Xe.set(t, []);
	let n = () => {
		for (; Xe.get(t).length;) Xe.get(t).shift()();
		Xe.delete(t);
	};
	e(n), Ye = !1, n();
}
function $e(e) {
	let t = [], n = (e) => t.push(e), [r, i] = b(e);
	return t.push(i), [{
		Alpine: Kn,
		effect: r,
		cleanup: n,
		evaluateLater: Oe.bind(Oe, e),
		evaluate: De.bind(De, e)
	}, () => t.forEach((e) => e())];
}
function et(e, t) {
	let n = We[t.type] || (() => {}), [r, i] = $e(e);
	k(e, t.original, i);
	let a = () => {
		e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, r), n = n.bind(n, e, t, r), Ye ? Xe.get(Ze).push(n) : n());
	};
	return a.runCleanups = i, a;
}
var tt = (e, t) => ({ name: n, value: r }) => (n.startsWith(e) && (n = n.replace(e, t)), {
	name: n,
	value: r
}), nt = (e) => e;
function rt(e = () => {}) {
	return ({ name: t, value: n }) => {
		let { name: r, value: i } = it.reduce((e, t) => t(e), {
			name: t,
			value: n
		});
		return r !== t && e(r, t), {
			name: r,
			value: i
		};
	};
}
var it = [];
function at(e) {
	it.push(e);
}
function ot({ name: e }) {
	return st().test(e);
}
var st = () => RegExp(`^${Ve}([^:^.]+)\\b`);
function ct(e, t) {
	return ({ name: n, value: r }) => {
		n === r && (r = "");
		let i = n.match(st()), a = n.match(/:([a-zA-Z0-9\-_:]+)/), o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], s = t || e[n] || n;
		return {
			type: i ? i[1] : null,
			value: a ? a[1] : null,
			modifiers: o.map((e) => e.replace(".", "")),
			expression: r,
			original: s
		};
	};
}
var lt = "DEFAULT", ut = [
	"ignore",
	"ref",
	"data",
	"id",
	"anchor",
	"bind",
	"init",
	"for",
	"model",
	"modelable",
	"transition",
	"show",
	"if",
	lt,
	"teleport"
];
function dt(e, t) {
	let n = ut.indexOf(e.type) === -1 ? lt : e.type, r = ut.indexOf(t.type) === -1 ? lt : t.type;
	return ut.indexOf(n) - ut.indexOf(r);
}
function ft(e, t, n = {}, r = {}) {
	return e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0,
		cancelable: !0,
		...r
	}));
}
function pt(e, t) {
	if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
		Array.from(e.children).forEach((e) => pt(e, t));
		return;
	}
	let n = !1;
	if (t(e, () => n = !0), n) return;
	let r = e.firstElementChild;
	for (; r;) pt(r, t, !1), r = r.nextElementSibling;
}
function mt(e, ...t) {
	console.warn(`Alpine Warning: ${e}`, ...t);
}
var ht = !1;
function gt() {
	ht && mt("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), ht = !0, document.body || mt("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ft(document, "alpine:init"), ft(document, "alpine:initializing"), P(), E((e) => kt(e, pt)), D((e) => At(e)), O((e, t) => {
		qe(e, t).forEach((e) => e());
	}), Array.from(document.querySelectorAll(bt().join(","))).filter((e) => !Ct(e.parentElement, !0)).forEach((e) => {
		kt(e);
	}), ft(document, "alpine:initialized"), setTimeout(() => {
		jt();
	});
}
var _t = [], vt = [];
function yt() {
	return _t.map((e) => e());
}
function bt() {
	return _t.concat(vt).map((e) => e());
}
function xt(e) {
	_t.push(e);
}
function St(e) {
	vt.push(e);
}
function Ct(e, t = !1) {
	return wt(e, (e) => {
		if ((t ? bt() : yt()).some((t) => e.matches(t))) return !0;
	});
}
function wt(e, t) {
	if (e) {
		if (t(e)) return e;
		if (e._x_teleportBack) return wt(e._x_teleportBack, t);
		if (e.parentNode instanceof ShadowRoot) return wt(e.parentNode.host, t);
		if (e.parentElement) return wt(e.parentElement, t);
	}
}
function Tt(e) {
	return yt().some((t) => e.matches(t));
}
var Et = [];
function Dt(e) {
	Et.push(e);
}
var Ot = 1;
function kt(e, t = pt, n = () => {}) {
	wt(e, (e) => e._x_ignore) || Qe(() => {
		t(e, (e, t) => {
			e._x_marker || (n(e, t), Et.forEach((n) => n(e, t)), qe(e, e.attributes).forEach((e) => e()), e._x_ignore || (e._x_marker = Ot++), e._x_ignore && t());
		});
	});
}
function At(e, t = pt) {
	t(e, (e) => {
		j(e), A(e), delete e._x_marker;
	});
}
function jt() {
	[
		[
			"ui",
			"dialog",
			["[x-dialog], [x-popover]"]
		],
		[
			"anchor",
			"anchor",
			["[x-anchor]"]
		],
		[
			"sort",
			"sort",
			["[x-sort]"]
		]
	].forEach(([e, t, n]) => {
		Ke(t) || n.some((t) => {
			if (document.querySelector(t)) return mt(`found "${t}", but missing ${e} plugin`), !0;
		});
	});
}
var Mt = [], Nt = !1;
function Pt(e = () => {}) {
	return queueMicrotask(() => {
		Nt || setTimeout(() => {
			Ft();
		});
	}), new Promise((t) => {
		Mt.push(() => {
			e(), t();
		});
	});
}
function Ft() {
	for (Nt = !1; Mt.length;) Mt.shift()();
}
function It() {
	Nt = !0;
}
function Lt(e, t) {
	return Array.isArray(t) ? zt(e, t.join(" ")) : typeof t == "object" && t ? Bt(e, t) : typeof t == "function" ? Lt(e, t()) : zt(e, t);
}
function Rt(e) {
	return e.split(/\s/).filter(Boolean);
}
function zt(e, t) {
	return t = t === !0 ? t = "" : t || "", ((t) => (e.classList.add(...t), () => {
		e.classList.remove(...t);
	}))(((t) => Rt(t).filter((t) => !e.classList.contains(t)).filter(Boolean))(t));
}
function Bt(e, t) {
	let n = Object.entries(t).flatMap(([e, t]) => t ? Rt(e) : !1).filter(Boolean), r = Object.entries(t).flatMap(([e, t]) => !t && Rt(e)).filter(Boolean), i = [], a = [];
	return r.forEach((t) => {
		e.classList.contains(t) && (e.classList.remove(t), a.push(t));
	}), n.forEach((t) => {
		e.classList.contains(t) || (e.classList.add(t), i.push(t));
	}), () => {
		a.forEach((t) => e.classList.add(t)), i.forEach((t) => e.classList.remove(t));
	};
}
function Vt(e, t) {
	return typeof t == "object" && t ? Ht(e, t) : Ut(e, t);
}
function Ht(e, t) {
	let n = {};
	return Object.entries(t).forEach(([t, r]) => {
		n[t] = e.style[t], t.startsWith("--") || (t = Wt(t)), e.style.setProperty(t, r);
	}), setTimeout(() => {
		e.style.length === 0 && e.removeAttribute("style");
	}), () => {
		Vt(e, n);
	};
}
function Ut(e, t) {
	let n = e.getAttribute("style", t);
	return e.setAttribute("style", t), () => {
		e.setAttribute("style", n || "");
	};
}
function Wt(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Gt(e, t = () => {}) {
	let n = !1;
	return function() {
		n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
	};
}
Ge("transition", (e, { value: t, modifiers: n, expression: r }, { evaluate: i }) => {
	typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? qt(e, n, t) : Kt(e, r, t));
});
function Kt(e, t, n) {
	Jt(e, Lt, ""), {
		enter: (t) => {
			e._x_transition.enter.during = t;
		},
		"enter-start": (t) => {
			e._x_transition.enter.start = t;
		},
		"enter-end": (t) => {
			e._x_transition.enter.end = t;
		},
		leave: (t) => {
			e._x_transition.leave.during = t;
		},
		"leave-start": (t) => {
			e._x_transition.leave.start = t;
		},
		"leave-end": (t) => {
			e._x_transition.leave.end = t;
		}
	}[n](t);
}
function qt(e, t, n) {
	Jt(e, Vt);
	let r = !t.includes("in") && !t.includes("out") && !n, i = r || t.includes("in") || ["enter"].includes(n), a = r || t.includes("out") || ["leave"].includes(n);
	t.includes("in") && !r && (t = t.filter((e, n) => n < t.indexOf("out"))), t.includes("out") && !r && (t = t.filter((e, n) => n > t.indexOf("out")));
	let o = !t.includes("opacity") && !t.includes("scale"), s = o || t.includes("opacity"), c = o || t.includes("scale"), l = +!s, u = c ? Qt(t, "scale", 95) / 100 : 1, d = Qt(t, "delay", 0) / 1e3, f = Qt(t, "origin", "center"), p = "opacity, transform", m = Qt(t, "duration", 150) / 1e3, h = Qt(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
	i && (e._x_transition.enter.during = {
		transformOrigin: f,
		transitionDelay: `${d}s`,
		transitionProperty: p,
		transitionDuration: `${m}s`,
		transitionTimingFunction: g
	}, e._x_transition.enter.start = {
		opacity: l,
		transform: `scale(${u})`
	}, e._x_transition.enter.end = {
		opacity: 1,
		transform: "scale(1)"
	}), a && (e._x_transition.leave.during = {
		transformOrigin: f,
		transitionDelay: `${d}s`,
		transitionProperty: p,
		transitionDuration: `${h}s`,
		transitionTimingFunction: g
	}, e._x_transition.leave.start = {
		opacity: 1,
		transform: "scale(1)"
	}, e._x_transition.leave.end = {
		opacity: l,
		transform: `scale(${u})`
	});
}
function Jt(e, t, n = {}) {
	e._x_transition ||= {
		enter: {
			during: n,
			start: n,
			end: n
		},
		leave: {
			during: n,
			start: n,
			end: n
		},
		in(n = () => {}, r = () => {}) {
			Xt(e, t, {
				during: this.enter.during,
				start: this.enter.start,
				end: this.enter.end
			}, n, r);
		},
		out(n = () => {}, r = () => {}) {
			Xt(e, t, {
				during: this.leave.during,
				start: this.leave.start,
				end: this.leave.end
			}, n, r);
		}
	};
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, r) {
	let i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout, a = () => i(n);
	if (t) {
		e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : a() : e._x_transition ? e._x_transition.in(n) : a();
		return;
	}
	e._x_hidePromise = e._x_transition ? new Promise((t, n) => {
		e._x_transition.out(() => {}, () => t(r)), e._x_transitioning && e._x_transitioning.beforeCancel(() => n({ isFromCancelledTransition: !0 }));
	}) : Promise.resolve(r), queueMicrotask(() => {
		let t = Yt(e);
		t ? (t._x_hideChildren ||= [], t._x_hideChildren.push(e)) : i(() => {
			let t = (e) => {
				let n = Promise.all([e._x_hidePromise, ...(e._x_hideChildren || []).map(t)]).then(([e]) => e?.());
				return delete e._x_hidePromise, delete e._x_hideChildren, n;
			};
			t(e).catch((e) => {
				if (!e.isFromCancelledTransition) throw e;
			});
		});
	});
};
function Yt(e) {
	let t = e.parentNode;
	if (t) return t._x_hidePromise ? t : Yt(t);
}
function Xt(e, t, { during: n, start: r, end: i } = {}, a = () => {}, o = () => {}) {
	if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
		a(), o();
		return;
	}
	let s, c, l;
	Zt(e, {
		start() {
			s = t(e, r);
		},
		during() {
			c = t(e, n);
		},
		before: a,
		end() {
			s(), l = t(e, i);
		},
		after: o,
		cleanup() {
			c(), l();
		}
	});
}
function Zt(e, t) {
	let n, r, i, a = Gt(() => {
		L(() => {
			n = !0, r || t.before(), i || (t.end(), Ft()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
		});
	});
	e._x_transitioning = {
		beforeCancels: [],
		beforeCancel(e) {
			this.beforeCancels.push(e);
		},
		cancel: Gt(function() {
			for (; this.beforeCancels.length;) this.beforeCancels.shift()();
			a();
		}),
		finish: a
	}, L(() => {
		t.start(), t.during();
	}), It(), requestAnimationFrame(() => {
		if (n) return;
		let a = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
		a === 0 && (a = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), L(() => {
			t.before();
		}), r = !0, requestAnimationFrame(() => {
			n || (L(() => {
				t.end();
			}), Ft(), setTimeout(e._x_transitioning.finish, a + o), i = !0);
		});
	});
}
function Qt(e, t, n) {
	if (e.indexOf(t) === -1) return n;
	let r = e[e.indexOf(t) + 1];
	if (!r || t === "scale" && isNaN(r)) return n;
	if (t === "duration" || t === "delay") {
		let e = r.match(/([0-9]+)ms/);
		if (e) return e[1];
	}
	return t === "origin" && [
		"top",
		"right",
		"left",
		"center",
		"bottom"
	].includes(e[e.indexOf(t) + 2]) ? [r, e[e.indexOf(t) + 2]].join(" ") : r;
}
var $t = !1;
function en(e, t = () => {}) {
	return (...n) => $t ? t(...n) : e(...n);
}
function tn(e) {
	return (...t) => $t && e(...t);
}
var nn = [];
function rn(e) {
	nn.push(e);
}
function an(e, t) {
	nn.forEach((n) => n(e, t)), $t = !0, ln(() => {
		kt(t, (e, t) => {
			t(e, () => {});
		});
	}), $t = !1;
}
var on = !1;
function sn(e, t) {
	t._x_dataStack ||= e._x_dataStack, $t = !0, on = !0, ln(() => {
		cn(t);
	}), $t = !1, on = !1;
}
function cn(e) {
	let t = !1;
	kt(e, (e, n) => {
		pt(e, (e, r) => {
			if (t && Tt(e)) return r();
			t = !0, n(e, r);
		});
	});
}
function ln(e) {
	let t = p;
	y((e, n) => {
		let r = t(e);
		return m(r), () => {};
	}), e(), y(t);
}
function un(e, t, n, r = []) {
	switch (e._x_bindings ||= f({}), e._x_bindings[t] = n, t = r.includes("camel") ? yn(t) : t, t) {
		case "value":
			dn(e, n);
			break;
		case "style":
			pn(e, n);
			break;
		case "class":
			fn(e, n);
			break;
		case "selected":
		case "checked":
			mn(e, t, n);
			break;
		default: hn(e, t, n);
	}
}
function dn(e, t) {
	if (kn(e)) e.attributes.value === void 0 && (e.value = t);
	else if (On(e)) Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : e.checked = Array.isArray(t) ? t.some((t) => bn(t, e.value)) : !!t;
	else if (e.tagName === "SELECT") vn(e, t);
	else {
		if (e.value === t) return;
		e.value = t === void 0 ? "" : t;
	}
}
function fn(e, t) {
	e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Lt(e, t);
}
function pn(e, t) {
	e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = Vt(e, t);
}
function mn(e, t, n) {
	hn(e, t, n), _n(e, t, n);
}
function hn(e, t, n) {
	[
		null,
		void 0,
		!1
	].includes(n) && wn(t) ? e.removeAttribute(t) : (Cn(t) && (n = t), gn(e, t, n));
}
function gn(e, t, n) {
	e.getAttribute(t) != n && e.setAttribute(t, n);
}
function _n(e, t, n) {
	e[t] !== n && (e[t] = n);
}
function vn(e, t) {
	let n = [].concat(t).map((e) => e + "");
	Array.from(e.options).forEach((e) => {
		e.selected = n.includes(e.value);
	});
}
function yn(e) {
	return e.toLowerCase().replace(/-(\w)/g, (e, t) => t.toUpperCase());
}
function bn(e, t) {
	return e == t;
}
function xn(e) {
	return [
		1,
		"1",
		"true",
		"on",
		"yes",
		!0
	].includes(e) ? !0 : [
		0,
		"0",
		"false",
		"off",
		"no",
		!1
	].includes(e) ? !1 : e ? !!e : null;
}
var Sn = /* @__PURE__ */ new Set(/* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.defer.disabled.formnovalidate.inert.ismap.itemscope.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.selected.shadowrootclonable.shadowrootdelegatesfocus.shadowrootserializable".split("."));
function Cn(e) {
	return Sn.has(e);
}
function wn(e) {
	return ![
		"aria-pressed",
		"aria-checked",
		"aria-expanded",
		"aria-selected"
	].includes(e);
}
function Tn(e, t, n) {
	return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Dn(e, t, n);
}
function En(e, t, n, r = !0) {
	if (e._x_bindings && e._x_bindings[t] !== void 0) return e._x_bindings[t];
	if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
		let n = e._x_inlineBindings[t];
		return n.extract = r, Ee(() => De(e, n.expression));
	}
	return Dn(e, t, n);
}
function Dn(e, t, n) {
	let r = e.getAttribute(t);
	return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : Cn(t) ? !![t, "true"].includes(r) : r;
}
function On(e) {
	return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function kn(e) {
	return e.type === "radio" || e.localName === "ui-radio";
}
function An(e, t) {
	let n;
	return function() {
		let r = this, i = arguments;
		clearTimeout(n), n = setTimeout(function() {
			n = null, e.apply(r, i);
		}, t);
	};
}
function jn(e, t) {
	let n;
	return function() {
		let r = this, i = arguments;
		n || (e.apply(r, i), n = !0, setTimeout(() => n = !1, t));
	};
}
function Mn({ get: e, set: t }, { get: n, set: r }) {
	let i = !0, a, o = p(() => {
		let o = e(), s = n();
		if (i) r(Nn(o)), i = !1;
		else {
			let e = JSON.stringify(o), n = JSON.stringify(s);
			e === a ? e !== n && t(Nn(s)) : r(Nn(o));
		}
		a = JSON.stringify(e()), JSON.stringify(n());
	});
	return () => {
		m(o);
	};
}
function Nn(e) {
	return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Pn(e) {
	(Array.isArray(e) ? e : [e]).forEach((e) => e(Kn));
}
var Fn = {}, In = !1;
function Ln(e, t) {
	if (In ||= (Fn = f(Fn), !0), t === void 0) return Fn[e];
	Fn[e] = t, fe(Fn[e]), typeof t == "object" && t && t.hasOwnProperty("init") && typeof t.init == "function" && Fn[e].init();
}
function Rn() {
	return Fn;
}
var zn = {};
function Bn(e, t) {
	let n = typeof t == "function" ? t : () => t;
	return e instanceof Element ? Hn(e, n()) : (zn[e] = n, () => {});
}
function Vn(e) {
	return Object.entries(zn).forEach(([t, n]) => {
		Object.defineProperty(e, t, { get() {
			return (...e) => n(...e);
		} });
	}), e;
}
function Hn(e, t, n) {
	let r = [];
	for (; r.length;) r.pop()();
	let i = Object.entries(t).map(([e, t]) => ({
		name: e,
		value: t
	})), a = Je(i);
	return i = i.map((e) => a.find((t) => t.name === e.name) ? {
		name: `x-bind:${e.name}`,
		value: `"${e.value}"`
	} : e), qe(e, i, n).map((e) => {
		r.push(e.runCleanups), e();
	}), () => {
		for (; r.length;) r.pop()();
	};
}
var Un = {};
function Wn(e, t) {
	Un[e] = t;
}
function Gn(e, t) {
	return Object.entries(Un).forEach(([n, r]) => {
		Object.defineProperty(e, n, {
			get() {
				return (...e) => r.bind(t)(...e);
			},
			enumerable: !1
		});
	}), e;
}
var Kn = {
	get reactive() {
		return f;
	},
	get release() {
		return m;
	},
	get effect() {
		return p;
	},
	get raw() {
		return h;
	},
	get transaction() {
		return S;
	},
	version: "3.15.11",
	flushAndStopDeferringMutations: R,
	dontAutoEvaluateFunctions: Ee,
	disableEffectScheduling: _,
	startObservingMutations: P,
	stopObservingMutations: F,
	setReactivityEngine: v,
	onAttributeRemoved: k,
	onAttributesAdded: O,
	closestDataStack: se,
	skipDuringClone: en,
	onlyDuringClone: tn,
	addRootSelector: xt,
	addInitSelector: St,
	setErrorHandler: Ce,
	interceptClone: rn,
	addScopeToNode: oe,
	deferMutations: re,
	mapAttributes: at,
	evaluateLater: Oe,
	interceptInit: Dt,
	initInterceptors: fe,
	injectMagics: ve,
	setEvaluator: Ae,
	setRawEvaluator: Me,
	mergeProxies: ce,
	extractProp: En,
	findClosest: wt,
	onElRemoved: D,
	closestRoot: Ct,
	destroyTree: At,
	interceptor: pe,
	transition: Xt,
	setStyles: Vt,
	mutateDom: L,
	directive: Ge,
	entangle: Mn,
	throttle: jn,
	debounce: An,
	evaluate: De,
	evaluateRaw: ze,
	initTree: kt,
	nextTick: Pt,
	prefixed: He,
	prefix: Ue,
	plugin: Pn,
	magic: _e,
	store: Ln,
	start: gt,
	clone: sn,
	cloneNode: an,
	bound: Tn,
	$data: ae,
	watch: x,
	walk: pt,
	data: Wn,
	bind: Bn
};
function qn(e, t) {
	let n = /* @__PURE__ */ Object.create(null), r = e.split(",");
	for (let e = 0; e < r.length; e++) n[r[e]] = !0;
	return t ? (e) => !!n[e.toLowerCase()] : (e) => !!n[e];
}
var Jn = Object.freeze({});
Object.freeze([]);
var Yn = Object.prototype.hasOwnProperty, Xn = (e, t) => Yn.call(e, t), Zn = Array.isArray, Qn = (e) => rr(e) === "[object Map]", $n = (e) => typeof e == "string", er = (e) => typeof e == "symbol", tr = (e) => typeof e == "object" && !!e, nr = Object.prototype.toString, rr = (e) => nr.call(e), ir = (e) => rr(e).slice(8, -1), ar = (e) => $n(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, or = ((e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return (n) => t[n] || (t[n] = e(n));
})((e) => e.charAt(0).toUpperCase() + e.slice(1)), sr = (e, t) => e !== t && (e === e || t === t), cr = /* @__PURE__ */ new WeakMap(), lr = [], ur, dr = Symbol("iterate"), fr = Symbol("Map key iterate");
function pr(e) {
	return e && e._isEffect === !0;
}
function mr(e, t = Jn) {
	pr(e) && (e = e.raw);
	let n = _r(e, t);
	return t.lazy || n(), n;
}
function hr(e) {
	e.active &&= (vr(e), e.options.onStop && e.options.onStop(), !1);
}
var gr = 0;
function _r(e, t) {
	let n = function() {
		if (!n.active) return e();
		if (!lr.includes(n)) {
			vr(n);
			try {
				return Sr(), lr.push(n), ur = n, e();
			} finally {
				lr.pop(), Cr(), ur = lr[lr.length - 1];
			}
		}
	};
	return n.id = gr++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function vr(e) {
	let { deps: t } = e;
	if (t.length) {
		for (let n = 0; n < t.length; n++) t[n].delete(e);
		t.length = 0;
	}
}
var yr = !0, br = [];
function xr() {
	br.push(yr), yr = !1;
}
function Sr() {
	br.push(yr), yr = !0;
}
function Cr() {
	let e = br.pop();
	yr = e === void 0 || e;
}
function wr(e, t, n) {
	if (!yr || ur === void 0) return;
	let r = cr.get(e);
	r || cr.set(e, r = /* @__PURE__ */ new Map());
	let i = r.get(n);
	i || r.set(n, i = /* @__PURE__ */ new Set()), i.has(ur) || (i.add(ur), ur.deps.push(i), ur.options.onTrack && ur.options.onTrack({
		effect: ur,
		target: e,
		type: t,
		key: n
	}));
}
function Tr(e, t, n, r, i, a) {
	let o = cr.get(e);
	if (!o) return;
	let s = /* @__PURE__ */ new Set(), c = (e) => {
		e && e.forEach((e) => {
			(e !== ur || e.allowRecurse) && s.add(e);
		});
	};
	if (t === "clear") o.forEach(c);
	else if (n === "length" && Zn(e)) o.forEach((e, t) => {
		(t === "length" || t >= r) && c(e);
	});
	else switch (n !== void 0 && c(o.get(n)), t) {
		case "add":
			Zn(e) ? ar(n) && c(o.get("length")) : (c(o.get(dr)), Qn(e) && c(o.get(fr)));
			break;
		case "delete":
			Zn(e) || (c(o.get(dr)), Qn(e) && c(o.get(fr)));
			break;
		case "set": Qn(e) && c(o.get(dr));
	}
	s.forEach((o) => {
		o.options.onTrigger && o.options.onTrigger({
			effect: o,
			target: e,
			key: n,
			type: t,
			newValue: r,
			oldValue: i,
			oldTarget: a
		}), o.options.scheduler ? o.options.scheduler(o) : o();
	});
}
var Er = /* @__PURE__ */ qn("__proto__,__v_isRef,__isVue"), Dr = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(er)), Or = /* @__PURE__ */ Mr(), kr = /* @__PURE__ */ Mr(!0), Ar = /* @__PURE__ */ jr();
function jr() {
	let e = {};
	return [
		"includes",
		"indexOf",
		"lastIndexOf"
	].forEach((t) => {
		e[t] = function(...e) {
			let n = z(this);
			for (let e = 0, t = this.length; e < t; e++) wr(n, "get", e + "");
			let r = n[t](...e);
			return r === -1 || r === !1 ? n[t](...e.map(z)) : r;
		};
	}), [
		"push",
		"pop",
		"shift",
		"unshift",
		"splice"
	].forEach((t) => {
		e[t] = function(...e) {
			xr();
			let n = z(this)[t].apply(this, e);
			return Cr(), n;
		};
	}), e;
}
function Mr(e = !1, t = !1) {
	return function(n, r, i) {
		if (r === "__v_isReactive") return !e;
		if (r === "__v_isReadonly") return e;
		if (r === "__v_raw" && i === (e ? t ? fi : di : t ? ui : li).get(n)) return n;
		let a = Zn(n);
		if (!e && a && Xn(Ar, r)) return Reflect.get(Ar, r, i);
		let o = Reflect.get(n, r, i);
		return (er(r) ? Dr.has(r) : Er(r)) || (e || wr(n, "get", r), t) ? o : vi(o) ? !a || !ar(r) ? o.value : o : tr(o) ? e ? gi(o) : hi(o) : o;
	};
}
var Nr = /* @__PURE__ */ Pr();
function Pr(e = !1) {
	return function(t, n, r, i) {
		let a = t[n];
		if (!e && (r = z(r), a = z(a), !Zn(t) && vi(a) && !vi(r))) return a.value = r, !0;
		let o = Zn(t) && ar(n) ? Number(n) < t.length : Xn(t, n), s = Reflect.set(t, n, r, i);
		return t === z(i) && (o ? sr(r, a) && Tr(t, "set", n, r, a) : Tr(t, "add", n, r)), s;
	};
}
function Fr(e, t) {
	let n = Xn(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
	return i && n && Tr(e, "delete", t, void 0, r), i;
}
function Ir(e, t) {
	let n = Reflect.has(e, t);
	return (!er(t) || !Dr.has(t)) && wr(e, "has", t), n;
}
function Lr(e) {
	return wr(e, "iterate", Zn(e) ? "length" : dr), Reflect.ownKeys(e);
}
var Rr = {
	get: Or,
	set: Nr,
	deleteProperty: Fr,
	has: Ir,
	ownKeys: Lr
}, zr = {
	get: kr,
	set(e, t) {
		return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	},
	deleteProperty(e, t) {
		return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
}, Br = (e) => tr(e) ? hi(e) : e, Vr = (e) => tr(e) ? gi(e) : e, Hr = (e) => e, Ur = (e) => Reflect.getPrototypeOf(e);
function Wr(e, t, n = !1, r = !1) {
	e = e.__v_raw;
	let i = z(e), a = z(t);
	t !== a && !n && wr(i, "get", t), !n && wr(i, "get", a);
	let { has: o } = Ur(i), s = r ? Hr : n ? Vr : Br;
	if (o.call(i, t)) return s(e.get(t));
	if (o.call(i, a)) return s(e.get(a));
	e !== i && e.get(t);
}
function Gr(e, t = !1) {
	let n = this.__v_raw, r = z(n), i = z(e);
	return e !== i && !t && wr(r, "has", e), !t && wr(r, "has", i), e === i ? n.has(e) : n.has(e) || n.has(i);
}
function Kr(e, t = !1) {
	return e = e.__v_raw, !t && wr(z(e), "iterate", dr), Reflect.get(e, "size", e);
}
function qr(e) {
	e = z(e);
	let t = z(this);
	return Ur(t).has.call(t, e) || (t.add(e), Tr(t, "add", e, e)), this;
}
function Jr(e, t) {
	t = z(t);
	let n = z(this), { has: r, get: i } = Ur(n), a = r.call(n, e);
	a ? ci(n, r, e) : (e = z(e), a = r.call(n, e));
	let o = i.call(n, e);
	return n.set(e, t), a ? sr(t, o) && Tr(n, "set", e, t, o) : Tr(n, "add", e, t), this;
}
function Yr(e) {
	let t = z(this), { has: n, get: r } = Ur(t), i = n.call(t, e);
	i ? ci(t, n, e) : (e = z(e), i = n.call(t, e));
	let a = r ? r.call(t, e) : void 0, o = t.delete(e);
	return i && Tr(t, "delete", e, void 0, a), o;
}
function Xr() {
	let e = z(this), t = e.size !== 0, n = Qn(e) ? new Map(e) : new Set(e), r = e.clear();
	return t && Tr(e, "clear", void 0, void 0, n), r;
}
function Zr(e, t) {
	return function(n, r) {
		let i = this, a = i.__v_raw, o = z(a), s = t ? Hr : e ? Vr : Br;
		return !e && wr(o, "iterate", dr), a.forEach((e, t) => n.call(r, s(e), s(t), i));
	};
}
function Qr(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = z(i), o = Qn(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Hr : t ? Vr : Br;
		return !t && wr(a, "iterate", c ? fr : dr), {
			next() {
				let { value: e, done: t } = l.next();
				return t ? {
					value: e,
					done: t
				} : {
					value: s ? [u(e[0]), u(e[1])] : u(e),
					done: t
				};
			},
			[Symbol.iterator]() {
				return this;
			}
		};
	};
}
function $r(e) {
	return function(...t) {
		{
			let n = t[0] ? `on key "${t[0]}" ` : "";
			console.warn(`${or(e)} operation ${n}failed: target is readonly.`, z(this));
		}
		return e !== "delete" && this;
	};
}
function ei() {
	let e = {
		get(e) {
			return Wr(this, e);
		},
		get size() {
			return Kr(this);
		},
		has: Gr,
		add: qr,
		set: Jr,
		delete: Yr,
		clear: Xr,
		forEach: Zr(!1, !1)
	}, t = {
		get(e) {
			return Wr(this, e, !1, !0);
		},
		get size() {
			return Kr(this);
		},
		has: Gr,
		add: qr,
		set: Jr,
		delete: Yr,
		clear: Xr,
		forEach: Zr(!1, !0)
	}, n = {
		get(e) {
			return Wr(this, e, !0);
		},
		get size() {
			return Kr(this, !0);
		},
		has(e) {
			return Gr.call(this, e, !0);
		},
		add: $r("add"),
		set: $r("set"),
		delete: $r("delete"),
		clear: $r("clear"),
		forEach: Zr(!0, !1)
	}, r = {
		get(e) {
			return Wr(this, e, !0, !0);
		},
		get size() {
			return Kr(this, !0);
		},
		has(e) {
			return Gr.call(this, e, !0);
		},
		add: $r("add"),
		set: $r("set"),
		delete: $r("delete"),
		clear: $r("clear"),
		forEach: Zr(!0, !0)
	};
	return [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((i) => {
		e[i] = Qr(i, !1, !1), n[i] = Qr(i, !0, !1), t[i] = Qr(i, !1, !0), r[i] = Qr(i, !0, !0);
	}), [
		e,
		n,
		t,
		r
	];
}
var [ti, ni, ri, ii] = /* @__PURE__ */ ei();
function ai(e, t) {
	let n = t ? e ? ii : ri : e ? ni : ti;
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(Xn(n, r) && r in t ? n : t, r, i);
}
var oi = { get: /* @__PURE__ */ ai(!1, !1) }, si = { get: /* @__PURE__ */ ai(!0, !1) };
function ci(e, t, n) {
	let r = z(n);
	if (r !== n && t.call(e, r)) {
		let t = ir(e);
		console.warn(`Reactive ${t} contains both the raw and reactive versions of the same object${t === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
	}
}
var li = /* @__PURE__ */ new WeakMap(), ui = /* @__PURE__ */ new WeakMap(), di = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakMap();
function pi(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
function mi(e) {
	return e.__v_skip || !Object.isExtensible(e) ? 0 : pi(ir(e));
}
function hi(e) {
	return e && e.__v_isReadonly ? e : _i(e, !1, Rr, oi, li);
}
function gi(e) {
	return _i(e, !0, zr, si, di);
}
function _i(e, t, n, r, i) {
	if (!tr(e)) return console.warn(`value cannot be made reactive: ${String(e)}`), e;
	if (e.__v_raw && !(t && e.__v_isReactive)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = mi(e);
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
function z(e) {
	return e && z(e.__v_raw) || e;
}
function vi(e) {
	return !!(e && e.__v_isRef === !0);
}
_e("nextTick", () => Pt), _e("dispatch", (e) => ft.bind(ft, e)), _e("watch", (e, { evaluateLater: t, cleanup: n }) => (e, r) => {
	let i = t(e);
	n(x(() => {
		let e;
		return i((t) => e = t), e;
	}, r));
}), _e("store", Rn), _e("data", (e) => ae(e)), _e("root", (e) => Ct(e)), _e("refs", (e) => (e._x_refs_proxy ||= ce(yi(e)), e._x_refs_proxy));
function yi(e) {
	let t = [];
	return wt(e, (e) => {
		e._x_refs && t.push(e._x_refs);
	}), t;
}
var bi = {};
function xi(e) {
	return bi[e] || (bi[e] = 0), ++bi[e];
}
function Si(e, t) {
	return wt(e, (e) => {
		if (e._x_ids && e._x_ids[t]) return !0;
	});
}
function Ci(e, t) {
	e._x_ids ||= {}, e._x_ids[t] || (e._x_ids[t] = xi(t));
}
_e("id", (e, { cleanup: t }) => (n, r = null) => wi(e, `${n}${r ? `-${r}` : ""}`, t, () => {
	let t = Si(e, n), i = t ? t._x_ids[n] : xi(n);
	return r ? `${n}-${i}-${r}` : `${n}-${i}`;
})), rn((e, t) => {
	e._x_id && (t._x_id = e._x_id);
});
function wi(e, t, n, r) {
	if (e._x_id ||= {}, e._x_id[t]) return e._x_id[t];
	let i = r();
	return e._x_id[t] = i, n(() => {
		delete e._x_id[t];
	}), i;
}
_e("el", (e) => e), Ti("Focus", "focus", "focus"), Ti("Persist", "persist", "persist");
function Ti(e, t, n) {
	_e(t, (r) => mt(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
Ge("modelable", (e, { expression: t }, { effect: n, evaluateLater: r, cleanup: i }) => {
	let a = r(t), o = () => {
		let e;
		return a((t) => e = t), e;
	}, s = r(`${t} = __placeholder`), c = (e) => s(() => {}, { scope: { __placeholder: e } });
	c(o()), queueMicrotask(() => {
		if (!e._x_model) return;
		e._x_removeModelListeners.default();
		let t = e._x_model.get, n = e._x_model.setWithModifiers;
		i(Mn({
			get() {
				return t();
			},
			set(e) {
				n(e);
			}
		}, {
			get() {
				return o();
			},
			set(e) {
				c(e);
			}
		}));
	});
}), Ge("teleport", (e, { modifiers: t, expression: n }, { cleanup: r }) => {
	e.tagName.toLowerCase() !== "template" && mt("x-teleport can only be used on a <template> tag", e);
	let i = Di(n), a = e.content.cloneNode(!0).firstElementChild;
	e._x_teleport = a, a._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), a.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((t) => {
		a.addEventListener(t, (t) => {
			t.stopPropagation(), e.dispatchEvent(new t.constructor(t.type, t));
		});
	}), oe(a, {}, e);
	let o = (e, t, n) => {
		n.includes("prepend") ? t.parentNode.insertBefore(e, t) : n.includes("append") ? t.parentNode.insertBefore(e, t.nextSibling) : t.appendChild(e);
	};
	L(() => {
		o(a, i, t), en(() => {
			kt(a);
		})();
	}), e._x_teleportPutBack = () => {
		let r = Di(n);
		L(() => {
			o(e._x_teleport, r, t);
		});
	}, r(() => L(() => {
		a.remove(), At(a);
	}));
});
var Ei = document.createElement("div");
function Di(e) {
	let t = en(() => document.querySelector(e), () => Ei)();
	return t || mt(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Oi = () => {};
Oi.inline = (e, { modifiers: t }, { cleanup: n }) => {
	t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
		t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
	});
}, Ge("ignore", Oi), Ge("effect", en((e, { expression: t }, { effect: n }) => {
	n(Oe(e, t));
}));
function ki(e, t, n, r) {
	let i = e, a = (e) => r(e), o = {}, s = (e, t) => (n) => t(e, n);
	return n.includes("dot") && (t = ji(t)), n.includes("camel") && (t = Mi(t)), n.includes("capture") && (o.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("passive") && (o.passive = n[n.indexOf("passive") + 1] !== "false"), a = Ai(n, a), n.includes("prevent") && (a = s(a, (e, t) => {
		t.preventDefault(), e(t);
	})), n.includes("stop") && (a = s(a, (e, t) => {
		t.stopPropagation(), e(t);
	})), n.includes("once") && (a = s(a, (e, n) => {
		e(n), i.removeEventListener(t, a, o);
	})), (n.includes("away") || n.includes("outside")) && (i = document, a = s(a, (t, n) => {
		e.contains(n.target) || n.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && t(n));
	})), n.includes("self") && (a = s(a, (t, n) => {
		n.target === e && t(n);
	})), t === "submit" && (a = s(a, (e, t) => {
		t.target._x_pendingModelUpdates && t.target._x_pendingModelUpdates.forEach((e) => e()), e(t);
	})), (Fi(t) || Ii(t)) && (a = s(a, (e, t) => {
		Li(t, n) || e(t);
	})), i.addEventListener(t, a, o), () => {
		i.removeEventListener(t, a, o);
	};
}
function Ai(e, t) {
	if (e.includes("debounce")) {
		let n = e[e.indexOf("debounce") + 1] || "invalid-wait", r = Ni(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
		t = An(t, r);
	}
	if (e.includes("throttle")) {
		let n = e[e.indexOf("throttle") + 1] || "invalid-wait", r = Ni(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
		t = jn(t, r);
	}
	return t;
}
function ji(e) {
	return e.replace(/-/g, ".");
}
function Mi(e) {
	return e.toLowerCase().replace(/-(\w)/g, (e, t) => t.toUpperCase());
}
function Ni(e) {
	return !Array.isArray(e) && !isNaN(e);
}
function Pi(e) {
	return [" ", "_"].includes(e) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Fi(e) {
	return ["keydown", "keyup"].includes(e);
}
function Ii(e) {
	return [
		"contextmenu",
		"click",
		"mouse"
	].some((t) => e.includes(t));
}
function Li(e, t) {
	let n = t.filter((e) => ![
		"window",
		"document",
		"prevent",
		"stop",
		"once",
		"capture",
		"self",
		"away",
		"outside",
		"passive",
		"preserve-scroll",
		"blur",
		"change",
		"lazy"
	].includes(e));
	if (n.includes("debounce")) {
		let e = n.indexOf("debounce");
		n.splice(e, Ni((n[e + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
	}
	if (n.includes("throttle")) {
		let e = n.indexOf("throttle");
		n.splice(e, Ni((n[e + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
	}
	if (n.length === 0 || n.length === 1 && Ri(e.key).includes(n[0])) return !1;
	let r = [
		"ctrl",
		"shift",
		"alt",
		"meta",
		"cmd",
		"super"
	].filter((e) => n.includes(e));
	return n = n.filter((e) => !r.includes(e)), !(r.length > 0 && r.filter((t) => ((t === "cmd" || t === "super") && (t = "meta"), e[`${t}Key`])).length === r.length && (Ii(e.type) || Ri(e.key).includes(n[0])));
}
function Ri(e) {
	if (!e) return [];
	e = Pi(e);
	let t = {
		ctrl: "control",
		slash: "/",
		space: " ",
		spacebar: " ",
		cmd: "meta",
		esc: "escape",
		up: "arrow-up",
		down: "arrow-down",
		left: "arrow-left",
		right: "arrow-right",
		period: ".",
		comma: ",",
		equal: "=",
		minus: "-",
		underscore: "_"
	};
	return t[e] = e, Object.keys(t).map((n) => {
		if (t[n] === e) return n;
	}).filter((e) => e);
}
Ge("model", (e, { modifiers: t, expression: n }, { effect: r, cleanup: i }) => {
	let a = e;
	t.includes("parent") && (a = wt(e, (t) => t !== e));
	let o = Oe(a, n), s;
	s = typeof n == "string" ? Oe(a, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? Oe(a, `${n()} = __placeholder`) : () => {};
	let c = () => {
		let e;
		return o((t) => e = t), Ui(e) ? e.get() : e;
	}, l = (e) => {
		let t;
		o((e) => t = e), Ui(t) ? t.set(e) : s(() => {}, { scope: { __placeholder: e } });
	};
	typeof n == "string" && e.type === "radio" && L(() => {
		e.hasAttribute("name") || e.setAttribute("name", n);
	});
	let u = t.includes("change") || t.includes("lazy"), d = t.includes("blur"), f = t.includes("enter"), p = u || d || f, m;
	if ($t) m = () => {};
	else if (p) {
		let n = [], r = (n) => l(zi(e, t, n, c()));
		if (u && n.push(ki(e, "change", t, r)), d && (n.push(ki(e, "blur", t, r)), e.form)) {
			let t = e.form, n = () => r({ target: e });
			t._x_pendingModelUpdates ||= [], t._x_pendingModelUpdates.push(n), i(() => {
				t._x_pendingModelUpdates && t._x_pendingModelUpdates.splice(t._x_pendingModelUpdates.indexOf(n), 1);
			});
		}
		f && n.push(ki(e, "keydown", t, (e) => {
			e.key === "Enter" && r(e);
		})), m = () => n.forEach((e) => e());
	} else m = ki(e, e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input", t, (n) => {
		l(zi(e, t, n, c()));
	});
	if (t.includes("fill") && ([
		void 0,
		null,
		""
	].includes(c()) || On(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && l(zi(e, t, { target: e }, c())), e._x_removeModelListeners ||= {}, e._x_removeModelListeners.default = m, i(() => e._x_removeModelListeners.default()), e.form) {
		let n = ki(e.form, "reset", [], (n) => {
			Pt(() => e._x_model && e._x_model.set(zi(e, t, { target: e }, c())));
		});
		i(() => n());
	}
	e._x_model = {
		get() {
			return c();
		},
		set(e) {
			l(e);
		},
		setWithModifiers: Ai(t, l)
	}, e._x_forceModelUpdate = (t) => {
		t === void 0 && typeof n == "string" && n.match(/\./) && (t = ""), L(() => {
			On(e) ? e.checked = Array.isArray(t) ? t.some((t) => t == e.value) : !!t : kn(e) ? e.checked = typeof t == "boolean" ? xn(e.value) === t : e.value == t : un(e, "value", t);
		});
	}, r(() => {
		let n = c();
		t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(n);
	});
});
function zi(e, t, n, r) {
	return L(() => {
		if (n instanceof CustomEvent && n.detail !== void 0) return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
		if (On(e)) {
			if (Array.isArray(r)) {
				let e = null;
				return e = t.includes("number") ? Bi(n.target.value) : t.includes("boolean") ? xn(n.target.value) : n.target.value, n.target.checked ? r.includes(e) ? r : r.concat([e]) : r.filter((t) => !Vi(t, e));
			}
			return n.target.checked;
		}
		if (e.tagName.toLowerCase() === "select" && e.multiple) return t.includes("number") ? Array.from(n.target.selectedOptions).map((e) => Bi(e.value || e.text)) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((e) => xn(e.value || e.text)) : Array.from(n.target.selectedOptions).map((e) => e.value || e.text);
		{
			let i;
			return i = kn(e) ? n.target.checked ? n.target.value : r : n.target.value, t.includes("number") ? Bi(i) : t.includes("boolean") ? xn(i) : t.includes("trim") ? i.trim() : i;
		}
	});
}
function Bi(e) {
	let t = e ? parseFloat(e) : null;
	return Hi(t) ? t : e;
}
function Vi(e, t) {
	return e == t;
}
function Hi(e) {
	return !Array.isArray(e) && !isNaN(e);
}
function Ui(e) {
	return typeof e == "object" && !!e && typeof e.get == "function" && typeof e.set == "function";
}
Ge("cloak", (e) => queueMicrotask(() => L(() => e.removeAttribute(He("cloak"))))), St(() => `[${He("init")}]`), Ge("init", en((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1))), Ge("text", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
	let i = r(t);
	n(() => {
		i((t) => {
			L(() => {
				e.textContent = t;
			});
		});
	});
}), Ge("html", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
	let i = r(t);
	n(() => {
		i((t) => {
			L(() => {
				e.innerHTML = t ?? "", e._x_ignoreSelf = !0, kt(e), delete e._x_ignoreSelf;
			});
		});
	});
}), at(tt(":", nt(He("bind:"))));
var Wi = (e, { value: t, modifiers: n, expression: r, original: i }, { effect: a, cleanup: o }) => {
	if (!t) {
		let t = {};
		Vn(t), Oe(e, r)((t) => {
			Hn(e, t, i);
		}, { scope: t });
		return;
	}
	if (t === "key") return Gi(e, r);
	if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract) return;
	let s = Oe(e, r);
	a(() => s((i) => {
		i === void 0 && typeof r == "string" && r.match(/\./) && (i = ""), L(() => un(e, t, i, n));
	})), o(() => {
		e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
	});
};
Wi.inline = (e, { value: t, modifiers: n, expression: r }) => {
	t && (e._x_inlineBindings ||= {}, e._x_inlineBindings[t] = {
		expression: r,
		extract: !1
	});
}, Ge("bind", Wi);
function Gi(e, t) {
	e._x_keyExpression = t;
}
xt(() => `[${He("data")}]`), Ge("data", (e, { expression: t }, { cleanup: n }) => {
	if (Ki(e)) return;
	t = t === "" ? "{}" : t;
	let r = {};
	ve(r, e);
	let i = {};
	Gn(i, r);
	let a = De(e, t, { scope: i });
	(a === void 0 || a === !0) && (a = {}), ve(a, e);
	let o = f(a);
	fe(o);
	let s = oe(e, o);
	o.init && De(e, o.init), n(() => {
		o.destroy && De(e, o.destroy), s();
	});
}), rn((e, t) => {
	e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Ki(e) {
	return $t ? on ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
Ge("show", (e, { modifiers: t, expression: n }, { effect: r }) => {
	let i = Oe(e, n);
	e._x_doHide ||= () => {
		L(() => {
			e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
		});
	}, e._x_doShow ||= () => {
		L(() => {
			e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
		});
	};
	let a = () => {
		e._x_doHide(), e._x_isShown = !1;
	}, o = () => {
		e._x_doShow(), e._x_isShown = !0;
	}, s = () => setTimeout(o), c = Gt((e) => e ? o() : a(), (t) => {
		typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, t, o, a) : t ? s() : a();
	}), l, u = !0;
	r(() => i((e) => {
		!u && e === l || (t.includes("immediate") && (e ? s() : a()), c(e), l = e, u = !1);
	}));
}), Ge("for", (e, { expression: t }, { effect: n, cleanup: r }) => {
	let i = Yi(t), a = Oe(e, i.items), o = Oe(e, e._x_keyExpression || "index");
	e._x_lookup = /* @__PURE__ */ new Map(), n(() => Ji(e, i, a, o)), r(() => {
		e._x_lookup.forEach((e) => L(() => {
			At(e), e.remove();
		})), delete e._x_lookup;
	});
});
function qi(e) {
	return (t) => {
		Object.entries(t).forEach(([t, n]) => {
			e[t] = n;
		});
	};
}
function Ji(e, t, n, r) {
	n((n) => {
		Zi(n) && (n = Array.from({ length: n }, (e, t) => t + 1)), n === void 0 && (n = []), n instanceof Set && (n = Array.from(n)), n instanceof Map && (n = Array.from(n));
		let i = e._x_lookup, a = /* @__PURE__ */ new Map();
		e._x_lookup = a;
		let o = Qi(n), s = Object.entries(n).map(([s, c]) => {
			o || (s = parseInt(s));
			let l = Xi(t, c, s, n), u;
			return r((t) => {
				typeof t == "object" && mt("x-for key cannot be an object, it must be a string or an integer", e), i.has(t) && (a.set(t, i.get(t)), i.delete(t)), u = t;
			}, { scope: {
				index: s,
				...l
			} }), [u, l];
		});
		L(() => {
			i.forEach((e) => {
				At(e), e.remove();
			});
			let t = /* @__PURE__ */ new Set(), n = e;
			s.forEach(([r, i]) => {
				if (a.has(r)) {
					let e = a.get(r);
					e._x_refreshXForScope(i), n.nextElementSibling !== e && (n.nextElementSibling && e.replaceWith(n.nextElementSibling), n.after(e)), n = e, e._x_currentIfEl && (e.nextElementSibling !== e._x_currentIfEl && n.after(e._x_currentIfEl), n = e._x_currentIfEl);
					return;
				}
				e.content.children.length > 1 && mt("x-for templates require a single root element, additional elements will be ignored.", e);
				let o = document.importNode(e.content, !0).firstElementChild, s = f(i);
				oe(o, s, e), o._x_refreshXForScope = qi(s), a.set(r, o), t.add(o), n.after(o), n = o;
			}), en(() => t.forEach((e) => kt(e)))();
		});
	});
}
function Yi(e) {
	let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = e.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);
	if (!r) return;
	let i = {};
	i.items = r[2].trim();
	let a = r[1].replace(n, "").trim(), o = a.match(t);
	return o ? (i.item = a.replace(t, "").trim(), i.index = o[1].trim(), o[2] && (i.collection = o[2].trim())) : i.item = a, i;
}
function Xi(e, t, n, r) {
	let i = {};
	return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((e) => e.trim()).forEach((e, n) => {
		i[e] = t[n];
	}) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((e) => e.trim()).forEach((e) => {
		i[e] = t[e];
	}) : i[e.item] = t, e.index && (i[e.index] = n), e.collection && (i[e.collection] = r), i;
}
function Zi(e) {
	return !Array.isArray(e) && !isNaN(e);
}
function Qi(e) {
	return typeof e == "object" && !Array.isArray(e);
}
function $i() {}
$i.inline = (e, { expression: t }, { cleanup: n }) => {
	let r = Ct(e);
	r && (r._x_refs ||= {}, r._x_refs[t] = e, n(() => delete r._x_refs[t]));
}, Ge("ref", $i), Ge("if", (e, { expression: t }, { effect: n, cleanup: r }) => {
	e.tagName.toLowerCase() !== "template" && mt("x-if can only be used on a <template> tag", e);
	let i = Oe(e, t), a = () => {
		if (e._x_currentIfEl) return e._x_currentIfEl;
		let t = e.content.cloneNode(!0).firstElementChild;
		return oe(t, {}, e), L(() => {
			e.after(t), en(() => kt(t))();
		}), e._x_currentIfEl = t, e._x_undoIf = () => {
			L(() => {
				At(t), t.remove();
			}), delete e._x_currentIfEl;
		}, t;
	}, o = () => {
		e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
	};
	n(() => i((e) => {
		e ? a() : o();
	})), r(() => e._x_undoIf && e._x_undoIf());
}), Ge("id", (e, { expression: t }, { evaluate: n }) => {
	n(t).forEach((t) => Ci(e, t));
}), rn((e, t) => {
	e._x_ids && (t._x_ids = e._x_ids);
}), at(tt("@", nt(He("on:")))), Ge("on", en((e, { value: t, modifiers: n, expression: r }, { cleanup: i }) => {
	let a = r ? Oe(e, r) : () => {};
	e.tagName.toLowerCase() === "template" && (e._x_forwardEvents ||= [], e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
	let o = ki(e, t, n, (e) => {
		a(() => {}, {
			scope: { $event: e },
			params: [e]
		});
	});
	i(() => o());
})), ea("Collapse", "collapse", "collapse"), ea("Intersect", "intersect", "intersect"), ea("Focus", "trap", "focus"), ea("Mask", "mask", "mask");
function ea(e, t, n) {
	Ge(t, (r) => mt(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
Kn.setEvaluator(Ne), Kn.setRawEvaluator(Be), Kn.setReactivityEngine({
	reactive: hi,
	effect: mr,
	release: hr,
	raw: z
});
var ta = Kn, na = 0, B = (e) => `atlas-${e}-${++na}`, ra = (e) => ({
	role: "dialog",
	"aria-modal": "true",
	...e.labelledBy && { "aria-labelledby": e.labelledBy },
	...e.describedBy && { "aria-describedby": e.describedBy }
}), ia = (e) => ({
	role: "dialog",
	"aria-modal": "true",
	...e.labelledBy && { "aria-labelledby": e.labelledBy }
}), aa = (e) => ({
	"aria-haspopup": "true",
	"aria-expanded": String(e.isOpen),
	"aria-controls": e.menuId
}), oa = (e) => ({
	role: "menu",
	id: e.id,
	"aria-labelledby": e.labelledBy
}), sa = (e) => ({
	role: "menuitem",
	tabindex: e.disabled ? "-1" : "0",
	...e.disabled && { "aria-disabled": "true" }
}), ca = (e, t = "polite") => {
	if (typeof document > "u") return;
	let n = document.createElement("div");
	n.setAttribute("role", "status"), n.setAttribute("aria-live", t), n.setAttribute("aria-atomic", "true"), n.style.cssText = "\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border: 0;\n  ", document.body.appendChild(n), setTimeout(() => {
		n.textContent = e;
	}, 100), setTimeout(() => {
		n.remove();
	}, 1e3);
}, V = () => typeof window < "u" && typeof document < "u", la = () => V() ? document : null, ua = (e, t = {}) => {
	let n = la();
	if (!n) return null;
	let r = n.createElement(e);
	if (t.className && (r.className = t.className), t.attributes) for (let [e, n] of Object.entries(t.attributes)) r.setAttribute(e, n);
	if (t.styles && Object.assign(r.style, t.styles), t.dataset) for (let [e, n] of Object.entries(t.dataset)) r.dataset[e] = n;
	return r;
}, da = (e) => {
	let t = [
		"a[href]",
		"button:not([disabled])",
		"input:not([disabled])",
		"select:not([disabled])",
		"textarea:not([disabled])",
		"[tabindex]:not([tabindex=\"-1\"])"
	].join(", ");
	return Array.from(e.querySelectorAll(t)).filter((e) => e.offsetParent !== null);
}, fa = () => {
	let e = la();
	if (!e) return () => {};
	let t = window.scrollY, n = e.body, r = n.style.cssText;
	return n.style.cssText = `
    position: fixed;
    top: -${t}px;
    left: 0;
    right: 0;
    overflow: hidden;
  `, () => {
		n.style.cssText = r, window.scrollTo(0, t);
	};
}, H = (e, t, n, r) => (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r)), pa = {
	ROOT: "data-atlas-sidebar",
	SIDEBAR: "data-atlas-sidebar-panel",
	CONTENT: "data-atlas-sidebar-content",
	BODY: "data-atlas-sidebar-body",
	GROUP: "data-atlas-sidebar-group",
	GROUP_LABEL: "data-atlas-sidebar-group-label",
	MENU: "data-atlas-sidebar-menu",
	ITEM: "data-atlas-sidebar-item",
	TRIGGER: "data-atlas-sidebar-trigger",
	OVERLAY: "data-atlas-sidebar-overlay"
}, U = {
	ROOT: "atlas-sidebar-provider",
	SIDEBAR: "atlas-sidebar",
	SIDEBAR_LEFT: "atlas-sidebar--left",
	SIDEBAR_RIGHT: "atlas-sidebar--right",
	SIDEBAR_OPEN: "atlas-sidebar--open",
	SIDEBAR_COLLAPSED: "atlas-sidebar--collapsed",
	CONTENT: "atlas-sidebar-content",
	CONTENT_COLLAPSED: "atlas-sidebar-content--collapsed",
	BODY: "atlas-sidebar-body",
	GROUP: "atlas-sidebar-group",
	GROUP_LABEL: "atlas-sidebar-group-label",
	GROUP_COLLAPSED: "atlas-sidebar-group--collapsed",
	MENU: "atlas-sidebar-menu",
	ITEM: "atlas-sidebar-item",
	ITEM_ACTIVE: "atlas-sidebar-item--active",
	ITEM_DISABLED: "atlas-sidebar-item--disabled",
	ITEM_ICON: "atlas-sidebar-item-icon",
	ITEM_LABEL: "atlas-sidebar-item-label",
	ITEM_BADGE: "atlas-sidebar-item-badge",
	OVERLAY: "atlas-sidebar-overlay",
	OVERLAY_VISIBLE: "atlas-sidebar-overlay--visible"
}, ma = 768;
function ha(e, t = {}) {
	if (!V()) return ga();
	let { side: n = "left", collapsible: r = !1, defaultOpen: i = !0, defaultCollapsed: a = !1, width: o = "280px", collapsedWidth: s = "60px", groups: c = [] } = t, l = c, u = i, d = a, f = null;
	B("sidebar");
	let p = null, m = null, h = null, g = [];
	function _() {
		e.classList.add(U.ROOT), e.setAttribute(pa.ROOT, ""), e.style.setProperty("--atlas-sidebar-width", o), e.style.setProperty("--atlas-sidebar-width-collapsed", s), p = e.querySelector(`[${pa.SIDEBAR}]`), p || (p = document.createElement("aside"), p.setAttribute(pa.SIDEBAR, "")), p.className = `${U.SIDEBAR} ${n === "right" ? U.SIDEBAR_RIGHT : U.SIDEBAR_LEFT}`, p.setAttribute("role", "navigation"), p.setAttribute("aria-label", "Sidebar navigation"), m = e.querySelector(`[${pa.CONTENT}]`), m || (m = document.createElement("div"), m.setAttribute(pa.CONTENT, ""), m.className = U.CONTENT), h = document.createElement("div"), h.className = U.OVERLAY, h.setAttribute(pa.OVERLAY, ""), l.length > 0 && v(), e.querySelector(`[${pa.SIDEBAR}]`) ? e.insertBefore(h, p) : (e.insertBefore(h, e.firstChild), e.insertBefore(p, e.firstChild)), w(), x();
	}
	function v() {
		if (!p) return;
		let e = p.querySelector(`[${pa.BODY}]`);
		e ? e.innerHTML = "" : (e = document.createElement("div"), e.className = U.BODY, e.setAttribute(pa.BODY, ""), p.appendChild(e)), l.forEach((t) => {
			let n = y(t);
			e?.appendChild(n);
		});
	}
	function y(e) {
		let t = document.createElement("div");
		if (t.className = U.GROUP, t.setAttribute(pa.GROUP, e.id), e.collapsed && t.classList.add(U.GROUP_COLLAPSED), e.label) {
			let n = document.createElement("div");
			n.className = U.GROUP_LABEL, n.setAttribute(pa.GROUP_LABEL, ""), n.textContent = e.label, e.collapsible && (n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), n.setAttribute("aria-expanded", e.collapsed ? "false" : "true"), n.addEventListener("click", () => C(e.id)), n.addEventListener("keydown", (t) => {
				(t.key === "Enter" || t.key === " ") && (t.preventDefault(), C(e.id));
			})), t.appendChild(n);
		}
		let n = document.createElement("ul");
		return n.className = U.MENU, n.setAttribute(pa.MENU, ""), n.setAttribute("role", "menu"), e.items.forEach((e) => {
			let t = b(e);
			n.appendChild(t);
		}), t.appendChild(n), t;
	}
	function b(e) {
		let n = document.createElement("li");
		n.setAttribute("role", "none");
		let r = document.createElement("a");
		if (r.className = U.ITEM, r.setAttribute(pa.ITEM, e.id), r.setAttribute("role", "menuitem"), r.href = e.href || "#", r.tabIndex = 0, e.active && (r.classList.add(U.ITEM_ACTIVE), r.setAttribute("aria-current", "page")), e.disabled && (r.classList.add(U.ITEM_DISABLED), r.setAttribute("aria-disabled", "true"), r.tabIndex = -1), e.icon) {
			let t = document.createElement("span");
			t.className = U.ITEM_ICON, t.setAttribute("aria-hidden", "true"), t.innerHTML = e.icon, r.appendChild(t);
		}
		let i = document.createElement("span");
		if (i.className = U.ITEM_LABEL, i.textContent = e.label, r.appendChild(i), e.badge) {
			let t = document.createElement("span");
			t.className = U.ITEM_BADGE, t.textContent = e.badge, r.appendChild(t);
		}
		return r.addEventListener("click", (n) => {
			if (e.disabled) {
				n.preventDefault();
				return;
			}
			e.onSelect?.(), t.onSelect?.(e), (!e.href || e.href === "#") && n.preventDefault(), S() && E();
		}), n.appendChild(r), n;
	}
	function x() {
		h && g.push(H(h, "click", () => {
			E();
		})), e.querySelectorAll(`[${pa.TRIGGER}]`).forEach((e) => {
			g.push(H(e, "click", () => {
				S() ? D() : r && A();
			}));
		}), g.push(H(document, "keydown", (e) => {
			e.key === "Escape" && u && S() && E();
		})), g.push(H(window, "resize", () => {
			w();
		}));
	}
	function S() {
		return window.innerWidth <= ma;
	}
	function C(t) {
		let n = l.find((e) => e.id === t);
		if (!n) return;
		n.collapsed = !n.collapsed;
		let r = e.querySelector(`[${pa.GROUP}="${t}"]`), i = r?.querySelector(`[${pa.GROUP_LABEL}]`);
		r && r.classList.toggle(U.GROUP_COLLAPSED, n.collapsed), i && i.setAttribute("aria-expanded", n.collapsed ? "false" : "true");
	}
	function w() {
		if (!p || !m || !h) return;
		let e = S();
		e ? (p.classList.toggle(U.SIDEBAR_OPEN, u), p.classList.remove(U.SIDEBAR_COLLAPSED), h.classList.toggle(U.OVERLAY_VISIBLE, u), u && !f ? f = fa() : !u && f && (f(), f = null)) : (p.classList.remove(U.SIDEBAR_OPEN), p.classList.toggle(U.SIDEBAR_COLLAPSED, d), h.classList.remove(U.OVERLAY_VISIBLE), m.classList.toggle(U.CONTENT_COLLAPSED, d), f &&= (f(), null)), p.setAttribute("aria-hidden", e && !u ? "true" : "false");
	}
	function T() {
		u || (u = !0, w(), t.onOpenChange?.(!0));
	}
	function E() {
		u && (u = !1, w(), t.onOpenChange?.(!1));
	}
	function D() {
		u ? E() : T();
	}
	function O() {
		d || !r || (d = !0, w(), t.onCollapsedChange?.(!0));
	}
	function k() {
		d && (d = !1, w(), t.onCollapsedChange?.(!1));
	}
	function A() {
		d ? k() : O();
	}
	function j(t) {
		e.querySelectorAll(`.${U.ITEM_ACTIVE}`).forEach((e) => {
			e.classList.remove(U.ITEM_ACTIVE), e.removeAttribute("aria-current");
		});
		let n = e.querySelector(`[${pa.ITEM}="${t}"]`);
		n && (n.classList.add(U.ITEM_ACTIVE), n.setAttribute("aria-current", "page")), l.forEach((e) => {
			e.items.forEach((e) => {
				e.active = e.id === t;
			});
		});
	}
	function M() {
		f && f(), g.forEach((e) => e()), h?.remove(), e.classList.remove(U.ROOT), e.removeAttribute(pa.ROOT), e.style.removeProperty("--atlas-sidebar-width"), e.style.removeProperty("--atlas-sidebar-width-collapsed");
	}
	return _(), {
		isOpen: () => u,
		isCollapsed: () => d,
		open: T,
		close: E,
		toggle: D,
		collapse: O,
		expand: k,
		toggleCollapse: A,
		getGroups: () => [...l],
		setGroups: (e) => {
			l = e, v();
		},
		setActiveItem: j,
		destroy: M
	};
}
function ga() {
	return {
		isOpen: () => !1,
		isCollapsed: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		collapse: () => {},
		expand: () => {},
		toggleCollapse: () => {},
		getGroups: () => [],
		setGroups: () => {},
		setActiveItem: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-PTH7T5K6.js
var W = {
	instant: 0,
	fast: 150,
	normal: 250,
	slow: 400
}, G = {
	standard: "cubic-bezier(0.4, 0, 0.2, 1)",
	decelerate: "cubic-bezier(0, 0, 0.2, 1)",
	accelerate: "cubic-bezier(0.4, 0, 1, 1)",
	bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
	spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
}, _a = {
	dropdown: 100,
	sticky: 200,
	drawer: 300,
	modal: 400,
	toast: 500,
	tooltip: 600
};
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-OF6BWNO5.js
function va(e, t = {}) {
	if (!V()) return ya();
	let { min: n = 0, max: r = 100, step: i = 1, value: a = 50, orientation: o = "horizontal", size: s = "md", disabled: c = !1, showTooltip: l = !0, alwaysShowTooltip: u = !1, marks: d = !1, formatValue: f = (e) => String(e), name: p, onChange: m, onDragStart: h, onDragEnd: g } = t, _ = B("slider"), v = Array.isArray(a), y = v ? [...a] : a, b = c, x = !1, S = null, C = [], { track: w, thumb: T } = {
		sm: {
			track: 4,
			thumb: 14
		},
		md: {
			track: 6,
			thumb: 18
		},
		lg: {
			track: 8,
			thumb: 22
		}
	}[s], E, D, O, k = null, A = null, j = null;
	function M() {
		e.innerHTML = "", e.classList.add("atlas-slider", `atlas-slider-${s}`, `atlas-slider-${o}`), e.setAttribute("data-atlas-slider", ""), e.setAttribute("role", "group"), e.setAttribute("aria-label", "Slider");
		let t = o === "vertical";
		if (e.style.cssText = `
      position: relative;
      ${t ? "height: 200px; width: auto;" : "width: 100%; height: auto;"}
      display: flex;
      align-items: center;
      ${t ? "flex-direction: column;" : ""}
      padding: ${T / 2}px;
      touch-action: none;
      user-select: none;
    `, E = document.createElement("div"), E.className = "atlas-slider-track", E.style.cssText = `
      position: relative;
      ${t ? `width: ${w}px; height: 100%;` : `height: ${w}px; width: 100%;`}
      background: var(--atlas-muted, hsl(210 40% 96.1%));
      border-radius: ${w / 2}px;
      cursor: ${b ? "not-allowed" : "pointer"};
    `, D = document.createElement("div"), D.className = "atlas-slider-fill", D.style.cssText = `
      position: absolute;
      ${t ? "width: 100%; left: 0;" : "height: 100%; top: 0;"}
      background: var(--atlas-primary, hsl(222.2 47.4% 11.2%));
      border-radius: ${w / 2}px;
      pointer-events: none;
      transition: ${x ? "none" : `all ${W.fast}ms ${G.standard}`};
    `, E.appendChild(D), O = N("start"), E.appendChild(O), v && (k = N("end"), E.appendChild(k)), e.appendChild(E), d && P(), p) {
			let t = document.createElement("input");
			t.type = "hidden", t.name = p, t.id = `${_}-hidden`, t.value = v ? y.join(",") : String(y), e.appendChild(t);
		}
		re();
	}
	function N(e) {
		let t = document.createElement("div");
		t.className = `atlas-slider-thumb atlas-slider-thumb-${e}`, t.setAttribute("role", "slider"), t.setAttribute("tabindex", b ? "-1" : "0"), t.setAttribute("aria-valuemin", String(n)), t.setAttribute("aria-valuemax", String(r)), t.setAttribute("aria-orientation", o), t.id = `${_}-thumb-${e}`;
		let i = o === "vertical";
		if (t.style.cssText = `
      position: absolute;
      width: ${T}px;
      height: ${T}px;
      background: var(--atlas-background, hsl(0 0% 100%));
      border: 2px solid var(--atlas-primary, hsl(222.2 47.4% 11.2%));
      border-radius: 50%;
      cursor: ${b ? "not-allowed" : "grab"};
      transform: translate(-50%, ${i ? "50%" : "-50%"});
      ${i ? "left: 50%;" : "top: 50%;"}
      transition: ${x ? "none" : `box-shadow ${W.fast}ms ${G.standard}`};
      z-index: 1;
    `, l || u) {
			let n = document.createElement("div");
			n.className = "atlas-slider-tooltip", n.style.cssText = `
        position: absolute;
        ${i ? "left: calc(100% + 8px); top: 50%; transform: translateY(-50%);" : "bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);"}
        background: var(--atlas-foreground, hsl(222.2 84% 4.9%));
        color: var(--atlas-background, hsl(0 0% 100%));
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: ${u ? "1" : "0"};
        transition: opacity ${W.fast}ms ${G.standard};
      `, t.appendChild(n), e === "start" ? A = n : j = n;
		}
		return I(t, e), t;
	}
	function P() {
		let t = document.createElement("div");
		t.className = "atlas-slider-marks";
		let i = o === "vertical";
		t.style.cssText = `
      position: absolute;
      ${i ? "left: calc(100% + 12px); top: 0; height: 100%;" : "top: calc(100% + 8px); left: 0; width: 100%;"}
      pointer-events: none;
    `, (d === !0 ? F() : d).forEach((e) => {
			let a = (e.value - n) / (r - n) * 100, o = document.createElement("div");
			o.className = "atlas-slider-mark", o.style.cssText = `
        position: absolute;
        ${i ? `bottom: ${a}%; transform: translateY(50%);` : `left: ${a}%; transform: translateX(-50%);`}
        font-size: 11px;
        color: var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%));
      `, o.textContent = e.label ?? String(e.value), t.appendChild(o);
		}), e.appendChild(t);
	}
	function F() {
		let e = (r - n) / 4, t = [];
		for (let r = 0; r <= 4; r++) t.push({ value: n + e * r });
		return t;
	}
	function I(e, t) {
		C.push(H(e, "mousedown", (e) => {
			if (b) return;
			e.preventDefault(), ee(t);
			let n = (e) => {
				te(e, t);
			}, r = () => {
				L(), document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", r);
			};
			document.addEventListener("mousemove", n), document.addEventListener("mouseup", r);
		})), C.push(H(e, "touchstart", (e) => {
			if (b) return;
			e.preventDefault(), ee(t);
			let n = (e) => {
				te(e.touches[0], t);
			}, r = () => {
				L(), document.removeEventListener("touchmove", n), document.removeEventListener("touchend", r);
			};
			document.addEventListener("touchmove", n, { passive: !1 }), document.addEventListener("touchend", r);
		}, { passive: !1 })), C.push(H(e, "keydown", ((e) => {
			b || ne(e, t);
		}))), l && !u && C.push(H(e, "focus", (() => {
			let e = t === "start" ? A : j;
			e && (e.style.opacity = "1");
		})), H(e, "blur", (() => {
			let e = t === "start" ? A : j;
			e && (e.style.opacity = "0");
		})));
	}
	function ee(e) {
		x = !0, S = e;
		let t = e === "start" ? O : k;
		if (t && (t.style.cursor = "grabbing", t.style.boxShadow = "0 0 0 4px hsl(var(--atlas-ring) / 0.3)"), l && !u) {
			let t = e === "start" ? A : j;
			t && (t.style.opacity = "1");
		}
		h?.();
	}
	function L() {
		x = !1;
		let e = S === "start" ? O : k;
		if (e && (e.style.cursor = b ? "not-allowed" : "grab", e.style.boxShadow = "none"), l && !u) {
			let e = S === "start" ? A : j;
			e && (e.style.opacity = "0");
		}
		S = null, g?.();
	}
	function te(e, t) {
		let a = E.getBoundingClientRect(), s = o === "vertical", c;
		c = s ? 1 - (e.clientY - a.top) / a.height : (e.clientX - a.left) / a.width, c = Math.max(0, Math.min(1, c));
		let l = n + c * (r - n);
		if (l = Math.round(l / i) * i, l = Math.max(n, Math.min(r, l)), v) {
			let [e, n] = y;
			t === "start" ? (l = Math.min(l, n), y = [l, n]) : (l = Math.max(l, e), y = [e, l]);
		} else y = l;
		re(), R(), m?.(y);
	}
	function ne(e, t) {
		let a = o === "vertical", s = 0;
		switch (e.key) {
			case "ArrowRight":
			case "ArrowUp":
				s = a ? e.key === "ArrowUp" ? i : 0 : e.key === "ArrowRight" ? i : 0, s === 0 && (s = i);
				break;
			case "ArrowLeft":
			case "ArrowDown":
				s = a ? e.key === "ArrowDown" ? -i : 0 : e.key === "ArrowLeft" ? -i : 0, s === 0 && (s = -i);
				break;
			case "PageUp":
				s = i * 10;
				break;
			case "PageDown":
				s = -i * 10;
				break;
			case "Home":
				if (v) {
					let [, e] = y;
					y = t === "start" ? [n, e] : [n, n];
				} else y = n;
				re(), R(), m?.(y), e.preventDefault();
				return;
			case "End":
				if (v) {
					let [e] = y;
					y = t === "end" ? [e, r] : [r, r];
				} else y = r;
				re(), R(), m?.(y), e.preventDefault();
				return;
			default: return;
		}
		if (e.preventDefault(), v) {
			let [e, i] = y;
			if (t === "start") {
				let t = e + s;
				t = Math.max(n, Math.min(t, i)), y = [t, i];
			} else {
				let t = i + s;
				t = Math.max(e, Math.min(t, r)), y = [e, t];
			}
		} else {
			let e = y + s;
			e = Math.max(n, Math.min(e, r)), y = e;
		}
		re(), R(), m?.(y);
	}
	function re() {
		let e = o === "vertical";
		if (v) {
			let [t, i] = y, a = (t - n) / (r - n) * 100, o = (i - n) / (r - n) * 100;
			e ? (O.style.bottom = `${a}%`, k && (k.style.bottom = `${o}%`), D.style.bottom = `${a}%`, D.style.height = `${o - a}%`) : (O.style.left = `${a}%`, k && (k.style.left = `${o}%`), D.style.left = `${a}%`, D.style.width = `${o - a}%`), O.setAttribute("aria-valuenow", String(t)), O.setAttribute("aria-valuetext", f(t)), k?.setAttribute("aria-valuenow", String(i)), k?.setAttribute("aria-valuetext", f(i)), A && (A.textContent = f(t)), j && (j.textContent = f(i));
		} else {
			let t = y, i = (t - n) / (r - n) * 100;
			e ? (O.style.bottom = `${i}%`, D.style.bottom = "0", D.style.height = `${i}%`) : (O.style.left = `${i}%`, D.style.left = "0", D.style.width = `${i}%`), O.setAttribute("aria-valuenow", String(t)), O.setAttribute("aria-valuetext", f(t)), A && (A.textContent = f(t));
		}
	}
	function R() {
		if (!p) return;
		let t = e.querySelector(`#${_}-hidden`);
		t && (t.value = v ? y.join(",") : String(y));
	}
	function ie() {
		[O, k].filter(Boolean).forEach((e) => {
			e.setAttribute("tabindex", b ? "-1" : "0"), e.style.cursor = b ? "not-allowed" : "grab", e.style.opacity = b ? "0.5" : "1";
		}), E.style.cursor = b ? "not-allowed" : "pointer", E.style.opacity = b ? "0.5" : "1", b ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
	}
	function ae() {
		C.push(H(E, "click", ((e) => {
			if (b || e.target !== E && e.target !== D) return;
			let t = E.getBoundingClientRect(), a = o === "vertical", s;
			s = a ? 1 - (e.clientY - t.top) / t.height : (e.clientX - t.left) / t.width, s = Math.max(0, Math.min(1, s));
			let c = n + s * (r - n);
			if (c = Math.round(c / i) * i, v) {
				let [e, t] = y;
				y = Math.abs(c - e) <= Math.abs(c - t) ? [Math.min(c, t), t] : [e, Math.max(c, e)];
			} else y = c;
			re(), R(), m?.(y);
		})));
	}
	return M(), ae(), ie(), {
		get value() {
			return y;
		},
		get isDisabled() {
			return b;
		},
		get isDragging() {
			return x;
		},
		get isRange() {
			return v;
		},
		setValue: (e) => {
			v && Array.isArray(e) ? y = [Math.max(n, Math.min(e[0], r)), Math.max(n, Math.min(e[1], r))] : !v && typeof e == "number" && (y = Math.max(n, Math.min(e, r))), re(), R(), m?.(y);
		},
		setDisabled: (e) => {
			b = e, ie();
		},
		focus: () => {
			O.focus();
		},
		destroy: () => {
			C.forEach((e) => e()), e.innerHTML = "", e.classList.remove("atlas-slider", `atlas-slider-${s}`, `atlas-slider-${o}`), e.removeAttribute("data-atlas-slider"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.removeAttribute("aria-disabled"), e.style.cssText = "";
		}
	};
}
function ya() {
	return {
		get value() {
			return 0;
		},
		get isDisabled() {
			return !1;
		},
		get isDragging() {
			return !1;
		},
		get isRange() {
			return !1;
		},
		setValue: () => {},
		setDisabled: () => {},
		focus: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-JFKLXHXA.js
function ba(e, t = {}) {
	if (!V()) return xa();
	let { size: n = "md", autoResize: r = !1, resize: i = "vertical", minHeight: a, maxHeight: o, rows: s = 3, maxLength: c, showCount: l = !1, placeholder: u, disabled: d = !1, readOnly: f = !1, focusGlow: p = !0, validate: m, validateDebounce: h = 300, validateOnBlur: g = !0, validateOnInput: _ = !1, name: v, onChange: y, onValidate: b, onFocus: x, onBlur: S } = t, C = B("textarea"), w = !0, T = null, E = !1, D = d, O = null, k = null, A = null, j = [], M = {
		transition: e.style.transition,
		boxShadow: e.style.boxShadow,
		resize: e.style.resize,
		overflow: e.style.overflow
	};
	e.classList.add("atlas-textarea", `atlas-textarea-${n}`), e.setAttribute("data-atlas-textarea", ""), e.id ||= C, e.rows = s, v && (e.name = v), u && (e.placeholder = u), c !== void 0 && (e.maxLength = c), f && (e.readOnly = !0), e.disabled = D;
	let { fontSize: N, padding: P } = {
		sm: {
			fontSize: "0.875rem",
			padding: "0.5rem 0.75rem"
		},
		md: {
			fontSize: "1rem",
			padding: "0.625rem 0.875rem"
		},
		lg: {
			fontSize: "1.125rem",
			padding: "0.75rem 1rem"
		}
	}[n];
	if (e.style.cssText = `
    width: 100%;
    font-size: ${N};
    padding: ${P};
    border: 1px solid var(--atlas-border, hsl(214.3 31.8% 91.4%));
    border-radius: 6px;
    background: var(--atlas-background, hsl(0 0% 100%));
    color: var(--atlas-foreground, hsl(222.2 84% 4.9%));
    outline: none;
    font-family: inherit;
    line-height: 1.5;
    resize: ${r ? "none" : i};
    transition: border-color ${W.fast}ms ${G.standard},
                box-shadow ${W.fast}ms ${G.standard};
  `, a && (e.style.minHeight = `${a}px`), o && (e.style.maxHeight = `${o}px`), l) {
		let t = e.parentElement;
		t && !t.classList.contains("atlas-textarea-wrapper") ? (A = document.createElement("div"), A.className = "atlas-textarea-wrapper", A.style.cssText = "position: relative; width: 100%;", t.insertBefore(A, e), A.appendChild(e)) : A = t, k = document.createElement("span"), k.className = "atlas-textarea-count", k.style.cssText = "\n      position: absolute;\n      right: 0.75rem;\n      bottom: 0.5rem;\n      font-size: 0.75rem;\n      color: var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%));\n      pointer-events: none;\n      background: var(--atlas-background, hsl(0 0% 100%));\n      padding: 0 0.25rem;\n    ", I(), A?.appendChild(k);
	}
	function F() {
		if (!r) return;
		e.style.height = "auto";
		let t = e.scrollHeight;
		a && t < a && (t = a), o && t > o ? (t = o, e.style.overflowY = "auto") : e.style.overflowY = "hidden", e.style.height = `${t}px`;
	}
	function I() {
		if (!k) return;
		let t = e.value.length, n = c;
		k.textContent = n ? `${t}/${n}` : String(t), n && (t >= n ? k.style.color = "var(--atlas-destructive, hsl(0 84.2% 60.2%))" : t >= n * .9 ? k.style.color = "var(--atlas-warning, hsl(38 92% 50%))" : k.style.color = "var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%))");
	}
	function ee() {
		p && (e.style.borderColor = "var(--atlas-ring, hsl(215 20.2% 65.1%))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-ring) / 0.2)");
	}
	function L() {
		w ? (e.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))", e.style.boxShadow = "none") : (e.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)");
	}
	function te() {
		e.animate && e.animate([
			{ transform: "translateX(0)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(4px)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(4px)" },
			{ transform: "translateX(0)" }
		], {
			duration: 400,
			easing: "ease-in-out"
		});
	}
	function ne() {
		if (!m) return w = !0, T = null, !0;
		let t = m(e.value);
		return w = t === null, T = t, w ? (e.classList.remove("atlas-textarea-error"), e.removeAttribute("aria-invalid"), L()) : (e.classList.add("atlas-textarea-error"), e.setAttribute("aria-invalid", "true"), e.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)", te()), b?.(w, T || void 0), w;
	}
	function re() {
		O && clearTimeout(O), O = setTimeout(() => {
			ne();
		}, h);
	}
	return j.push(H(e, "focus", () => {
		E = !0, ee(), x?.();
	}), H(e, "blur", () => {
		E = !1, L(), g && m && ne(), S?.();
	}), H(e, "input", () => {
		y?.(e.value), l && I(), r && F(), _ && m && re(), !w && e.value && (e.classList.remove("atlas-textarea-error"), E ? ee() : (e.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))", e.style.boxShadow = "none"));
	})), r && requestAnimationFrame(F), {
		get value() {
			return e.value;
		},
		get isValid() {
			return w;
		},
		get errorMessage() {
			return T;
		},
		get isFocused() {
			return E;
		},
		get isDisabled() {
			return D;
		},
		setValue: (t) => {
			e.value = t, l && I(), r && F(), y?.(t);
		},
		validate: () => ne(),
		setError: (t) => {
			w = !1, T = t, e.classList.add("atlas-textarea-error"), e.setAttribute("aria-invalid", "true"), e.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)", te(), b?.(!1, t);
		},
		clearError: () => {
			w = !0, T = null, e.classList.remove("atlas-textarea-error"), e.removeAttribute("aria-invalid"), E ? ee() : (e.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))", e.style.boxShadow = "none"), b?.(!0);
		},
		setDisabled: (t) => {
			D = t, e.disabled = t, t ? (e.style.opacity = "0.5", e.style.cursor = "not-allowed") : (e.style.opacity = "1", e.style.cursor = "text");
		},
		focus: () => {
			e.focus();
		},
		blur: () => {
			e.blur();
		},
		selectAll: () => {
			e.select();
		},
		destroy: () => {
			if (O && clearTimeout(O), j.forEach((e) => e()), e.style.transition = M.transition, e.style.boxShadow = M.boxShadow, e.style.resize = M.resize, e.style.overflow = M.overflow, e.classList.remove("atlas-textarea", `atlas-textarea-${n}`, "atlas-textarea-error"), e.removeAttribute("data-atlas-textarea"), e.removeAttribute("aria-invalid"), k && k.remove(), A?.classList.contains("atlas-textarea-wrapper")) {
				let t = A.parentElement;
				t && (t.insertBefore(e, A), A.remove());
			}
		}
	};
}
function xa() {
	return {
		get value() {
			return "";
		},
		get isValid() {
			return !0;
		},
		get errorMessage() {
			return null;
		},
		get isFocused() {
			return !1;
		},
		get isDisabled() {
			return !1;
		},
		setValue: () => {},
		validate: () => !0,
		setError: () => {},
		clearError: () => {},
		setDisabled: () => {},
		focus: () => {},
		blur: () => {},
		selectAll: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-ZG6MA7L6.js
function Sa(e, t = {}) {
	if (!V()) return {
		setFocus: () => {},
		getCurrentIndex: () => -1,
		update: () => {},
		destroy: () => {}
	};
	let { orientation: n = "horizontal", loop: r = !0, itemSelector: i = "[role=\"menuitem\"], [role=\"option\"], [role=\"tab\"], [role=\"radio\"]", onFocusChange: a, homeEnd: o = !0 } = t, s = 0;
	function c() {
		return Array.from(e.querySelectorAll(i)).filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
	}
	function l(e) {
		let t = c();
		t.length !== 0 && (e = r ? (e % t.length + t.length) % t.length : Math.max(0, Math.min(e, t.length - 1)), t.forEach((t, n) => {
			t.setAttribute("tabindex", n === e ? "0" : "-1");
		}), t[e]?.focus(), s = e, a?.(t[e], e));
	}
	function u(e) {
		let t = c();
		if (t.length === 0) return;
		let r = e.target, i = t.indexOf(r);
		if (i === -1) return;
		let a = !1, s = i;
		switch (e.key) {
			case "ArrowRight":
				(n === "horizontal" || n === "both") && (s = i + 1, a = !0);
				break;
			case "ArrowLeft":
				(n === "horizontal" || n === "both") && (s = i - 1, a = !0);
				break;
			case "ArrowDown":
				(n === "vertical" || n === "both") && (s = i + 1, a = !0);
				break;
			case "ArrowUp":
				(n === "vertical" || n === "both") && (s = i - 1, a = !0);
				break;
			case "Home":
				o && (s = 0, a = !0);
				break;
			case "End": o && (s = t.length - 1, a = !0);
		}
		a && (e.preventDefault(), e.stopPropagation(), l(s));
	}
	function d() {
		c().forEach((e, t) => {
			e.setAttribute("tabindex", t === s ? "0" : "-1");
		});
	}
	return d(), e.addEventListener("keydown", u), {
		setFocus: l,
		getCurrentIndex: () => s,
		update: d,
		destroy: () => {
			e.removeEventListener("keydown", u);
		}
	};
}
function Ca(e, t = {}) {
	if (!V()) return {
		reset: () => {},
		destroy: () => {}
	};
	let { itemSelector: n = "[role=\"menuitem\"], [role=\"option\"]", textAttribute: r = "data-text", timeout: i = 500, onMatch: a } = t, o = "", s = null;
	function c() {
		return Array.from(e.querySelectorAll(n)).filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
	}
	function l(e) {
		return (e.getAttribute(r) || e.textContent || "").toLowerCase().trim();
	}
	function u() {
		if (!o) return;
		let e = c(), t = o.toLowerCase(), n = e.findIndex((e) => l(e).startsWith(t));
		n !== -1 && a?.(e[n], n);
	}
	function d(e) {
		e.ctrlKey || e.metaKey || e.altKey || e.key.length === 1 && /^[a-zA-Z0-9 ]$/.test(e.key) && (e.preventDefault(), s && clearTimeout(s), o += e.key, u(), s = setTimeout(() => {
			o = "";
		}, i));
	}
	function f() {
		o = "", s &&= (clearTimeout(s), null);
	}
	return e.addEventListener("keydown", d), {
		reset: f,
		destroy: () => {
			e.removeEventListener("keydown", d), f();
		}
	};
}
function wa(e, t, n = ["Enter", " "]) {
	if (!V()) return () => {};
	function r(e) {
		n.includes(e.key) && (e.preventDefault(), t());
	}
	return e.addEventListener("keydown", r), () => {
		e.removeEventListener("keydown", r);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-AYH6ZYZ6.js
var Ta = {
	ITEM: "data-atlas-toggle-group-item",
	VALUE: "data-value"
}, K = {
	ROOT: "atlas-toggle-group",
	ROOT_OUTLINE: "atlas-toggle-group--outline",
	ROOT_SM: "atlas-toggle-group--sm",
	ROOT_MD: "atlas-toggle-group--md",
	ROOT_LG: "atlas-toggle-group--lg",
	ROOT_VERTICAL: "atlas-toggle-group--vertical",
	ROOT_DISABLED: "atlas-toggle-group--disabled",
	ITEM: "atlas-toggle-group-item",
	ITEM_PRESSED: "atlas-toggle-group-item--pressed",
	ITEM_DISABLED: "atlas-toggle-group-item--disabled"
};
function Ea(e, t = {}) {
	if (!V()) return Da();
	let { type: n = "single", value: r = n === "multiple" ? [] : "", variant: i = "default", size: a = "md", disabled: o = !1, orientation: s = "horizontal", loop: c = !0, required: l = !1 } = t, u = n === "multiple" ? Array.isArray(r) ? [...r] : r ? [r] : [] : Array.isArray(r) ? r[0] || "" : r, d = o, f = B("toggle-group"), p = [], m = null;
	function h() {
		e.classList.add(K.ROOT), e.setAttribute("data-atlas-toggle-group", ""), e.setAttribute("role", "group"), e.id = f, i === "outline" && e.classList.add(K.ROOT_OUTLINE), e.classList.add(a === "sm" ? K.ROOT_SM : a === "lg" ? K.ROOT_LG : K.ROOT_MD), s === "vertical" && e.classList.add(K.ROOT_VERTICAL), d && e.classList.add(K.ROOT_DISABLED), g(), m = Sa(e, {
			orientation: s,
			loop: c,
			itemSelector: `[${Ta.ITEM}]:not([aria-disabled="true"])`,
			onFocusChange: (e) => e.focus()
		}), S();
	}
	function g() {
		let e = _();
		e.forEach((e) => {
			e.classList.add(K.ITEM), e.setAttribute("role", "radio"), e.setAttribute("tabindex", "-1"), e.style.transition = `
        background-color ${W.fast}ms ${G.standard},
        color ${W.fast}ms ${G.standard},
        border-color ${W.fast}ms ${G.standard}
      `.replace(/\s+/g, " ").trim();
			let t = H(e, "click", () => y(e)), n = wa(e, () => y(e));
			p.push(t, n);
		});
		let t = e.find((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
		t && t.setAttribute("tabindex", "0");
	}
	function _() {
		return Array.from(e.querySelectorAll(`[${Ta.ITEM}]`));
	}
	function v(e) {
		return e.getAttribute(Ta.VALUE) || "";
	}
	function y(e) {
		if (d || e.hasAttribute("disabled") || e.getAttribute("aria-disabled") === "true") return;
		let t = v(e);
		t && (b(t), e.animate && e.animate([{ transform: "scale(0.97)" }, { transform: "scale(1)" }], {
			duration: W.fast,
			easing: G.bounce
		}));
	}
	function b(e) {
		if (n === "multiple") {
			let t = u, n = t.indexOf(e);
			n >= 0 ? t.splice(n, 1) : t.push(e), u = [...t];
		} else u === e ? l || (u = "") : u = e;
		S(), t.onChange?.(u);
	}
	function x(e) {
		return n === "multiple" ? u.includes(e) : u === e;
	}
	function S() {
		_().forEach((e) => {
			let t = x(v(e)), n = e.hasAttribute("disabled") || e.getAttribute("aria-disabled") === "true";
			e.setAttribute("aria-pressed", String(t)), e.setAttribute("data-state", t ? "on" : "off"), t ? e.classList.add(K.ITEM_PRESSED) : e.classList.remove(K.ITEM_PRESSED), n || d ? (e.classList.add(K.ITEM_DISABLED), e.setAttribute("aria-disabled", "true")) : (e.classList.remove(K.ITEM_DISABLED), e.removeAttribute("aria-disabled"));
		}), m?.update();
	}
	function C(e) {
		u = n === "multiple" ? Array.isArray(e) ? [...e] : e ? [e] : [] : Array.isArray(e) ? e[0] || "" : e, S(), t.onChange?.(u);
	}
	function w(t) {
		d = t, t ? e.classList.add(K.ROOT_DISABLED) : e.classList.remove(K.ROOT_DISABLED), S();
	}
	function T(e, t) {
		let n = _().find((t) => v(t) === e);
		n && (t ? (n.setAttribute("disabled", ""), n.setAttribute("aria-disabled", "true")) : (n.removeAttribute("disabled"), n.removeAttribute("aria-disabled")), S());
	}
	function E() {
		g(), S(), m?.update();
	}
	function D() {
		_().find((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true")?.focus();
	}
	function O() {
		m?.destroy(), p.forEach((e) => e()), e.classList.remove(K.ROOT, K.ROOT_OUTLINE, K.ROOT_SM, K.ROOT_MD, K.ROOT_LG, K.ROOT_VERTICAL, K.ROOT_DISABLED), e.removeAttribute("data-atlas-toggle-group"), e.removeAttribute("data-atlas-toggle-group-initialized"), e.removeAttribute("role"), _().forEach((e) => {
			e.classList.remove(K.ITEM, K.ITEM_PRESSED, K.ITEM_DISABLED), e.removeAttribute("role"), e.removeAttribute("tabindex"), e.removeAttribute("aria-pressed"), e.removeAttribute("data-state");
		});
	}
	return h(), {
		getValue: () => n === "multiple" ? [...u] : u,
		setValue: C,
		toggleValue: b,
		isSelected: x,
		setDisabled: w,
		isDisabled: () => d,
		setItemDisabled: T,
		update: E,
		focus: D,
		destroy: O
	};
}
function Da() {
	return {
		getValue: () => [],
		setValue: () => {},
		toggleValue: () => {},
		isSelected: () => !1,
		setDisabled: () => {},
		isDisabled: () => !1,
		setItemDisabled: () => {},
		update: () => {},
		focus: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-XUFQCFU6.js
function Oa() {
	return {
		x: 0,
		y: 0,
		width: window.innerWidth,
		height: window.innerHeight
	};
}
function ka(e, t) {
	let n = e.getBoundingClientRect();
	return t === "fixed" ? {
		x: n.left,
		y: n.top,
		width: n.width,
		height: n.height
	} : {
		x: n.left + window.scrollX,
		y: n.top + window.scrollY,
		width: n.width,
		height: n.height
	};
}
function Aa(e) {
	return e.startsWith("top") || e.startsWith("bottom") ? "y" : "x";
}
function ja(e) {
	let t = {
		top: "bottom",
		bottom: "top",
		left: "right",
		right: "left"
	};
	return e.replace(/^(top|bottom|left|right)/, (e) => t[e]);
}
function Ma(e, t, n, r) {
	let [i, a = "center"] = n.split("-"), o = 0, s = 0;
	switch (i) {
		case "top":
			s = e.y - t.height - r;
			break;
		case "bottom":
			s = e.y + e.height + r;
			break;
		case "left":
			o = e.x - t.width - r;
			break;
		case "right": o = e.x + e.width + r;
	}
	if (i === "top" || i === "bottom") switch (a) {
		case "start":
			o = e.x;
			break;
		case "end":
			o = e.x + e.width - t.width;
			break;
		default: o = e.x + (e.width - t.width) / 2;
	}
	else switch (a) {
		case "start":
			s = e.y;
			break;
		case "end":
			s = e.y + e.height - t.height;
			break;
		default: s = e.y + (e.height - t.height) / 2;
	}
	return {
		x: o,
		y: s
	};
}
function Na(e, t, n, r) {
	return {
		top: r - t.y,
		right: t.x + e.width - (n.width - r),
		bottom: t.y + e.height - (n.height - r),
		left: r - t.x
	};
}
function Pa(e, t, n = {}) {
	if (!V()) return {
		x: 0,
		y: 0,
		placement: n.placement || "bottom"
	};
	let { placement: r = "bottom", strategy: i = "absolute", offset: a = 8, flip: o = !0, shift: s = !0, shiftPadding: c = 8, arrow: l = null } = n, u = ka(e, i), d = {
		...ka(t, i),
		width: t.offsetWidth,
		height: t.offsetHeight
	}, f = Oa(), p = r, m = Ma(u, d, p, a);
	if (o) {
		let e = Na(d, m, f, c);
		(Aa(p) === "y" ? p.startsWith("top") && e.top > 0 || p.startsWith("bottom") && e.bottom > 0 : p.startsWith("left") && e.left > 0 || p.startsWith("right") && e.right > 0) && (p = ja(p), m = Ma(u, d, p, a));
	}
	if (s) {
		let e = Na(d, m, f, c);
		Aa(p) === "y" ? e.left > 0 ? m.x += e.left : e.right > 0 && (m.x -= e.right) : e.top > 0 ? m.y += e.top : e.bottom > 0 && (m.y -= e.bottom);
	}
	let h, g;
	if (l) {
		let e = l.getBoundingClientRect();
		Aa(p) === "y" ? (h = u.x + u.width / 2 - m.x - e.width / 2, h = Math.max(8, Math.min(h, d.width - e.width - 8))) : (g = u.y + u.height / 2 - m.y - e.height / 2, g = Math.max(8, Math.min(g, d.height - e.height - 8)));
	}
	return {
		x: Math.round(m.x),
		y: Math.round(m.y),
		placement: p,
		arrowX: h,
		arrowY: g
	};
}
function Fa(e, t, n = "absolute") {
	Object.assign(e.style, {
		position: n,
		left: `${t.x}px`,
		top: `${t.y}px`,
		margin: "0"
	});
}
function Ia(e, t, n, r = {}) {
	if (!V()) return () => {};
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = !0 } = r, s = [];
	if (i) {
		let t = e;
		for (; t;) {
			t.addEventListener("scroll", n, { passive: !0 });
			let e = t;
			s.push(() => e.removeEventListener("scroll", n)), t = t.parentElement;
		}
		window.addEventListener("scroll", n, { passive: !0 }), s.push(() => window.removeEventListener("scroll", n));
	}
	if (a && (window.addEventListener("resize", n), s.push(() => window.removeEventListener("resize", n))), o && typeof ResizeObserver < "u") {
		let r = new ResizeObserver(n);
		r.observe(e), r.observe(t), s.push(() => r.disconnect());
	}
	return n(), () => {
		s.forEach((e) => e());
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-XMPNQU52.js
function La(e, t) {
	if (!V()) return {
		destroy: () => {},
		pause: () => {},
		resume: () => {}
	};
	let { onDismiss: n, escapeKey: r = !0, clickOutside: i = !0, ignore: a = [], pointerDownOutside: o = !1 } = t, s = !1, c = [];
	function l(e) {
		s || r && e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), n());
	}
	function u(t) {
		if (!t || !(t instanceof Node) || e.contains(t)) return !1;
		for (let e of a) if (e?.contains(t)) return !1;
		return !0;
	}
	function d(e) {
		s || i && u(e.target) && n();
	}
	function f(e) {
		s || i && (o || u(e.target) && n());
	}
	return c.push(H(document, "keydown", l, { capture: !0 })), o ? c.push(H(document, "pointerdown", d, { capture: !0 })) : setTimeout(() => {
		s || c.push(H(document, "click", f, { capture: !0 }));
	}, 0), {
		destroy: () => {
			c.forEach((e) => e());
		},
		pause: () => {
			s = !0;
		},
		resume: () => {
			s = !1;
		}
	};
}
new class {
	constructor() {
		this.layers = /* @__PURE__ */ new Map();
	}
	push(e, t) {
		this.layers.set(e, t);
	}
	remove(e) {
		this.layers.delete(e);
	}
	isTop(e) {
		let t = Array.from(this.layers.keys());
		return t[t.length - 1] === e;
	}
	dismissTop() {
		let e = Array.from(this.layers.entries());
		if (e.length === 0) return !1;
		let [, t] = e[e.length - 1];
		return t(), !0;
	}
	get size() {
		return this.layers.size;
	}
}();
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-ALZ2UYTV.js
var Ra = (e) => {
	let { container: t, initialFocus: n = "first", returnFocus: r = "previous", onEscape: i } = e, a = !1, o = null, s = [], c = [], l = () => {
		s = da(t);
	}, u = (e) => {
		if (a) {
			if (e.key === "Escape") {
				e.preventDefault(), i?.();
				return;
			}
			if (e.key === "Tab") {
				if (l(), s.length === 0) {
					e.preventDefault();
					return;
				}
				let n = s[0], r = s[s.length - 1], i = la();
				if (!i) return;
				e.shiftKey ? (i.activeElement === n || i.activeElement === t) && (e.preventDefault(), r.focus()) : i.activeElement === r && (e.preventDefault(), n.focus());
			}
		}
	}, d = (e) => {
		if (!a) return;
		let n = e.relatedTarget;
		n && !t.contains(n) && (e.preventDefault(), s[0]?.focus());
	};
	return {
		activate: () => {
			if (a) return;
			a = !0;
			let e = la();
			e && (o = e.activeElement, l(), requestAnimationFrame(() => {
				n === "first" && s.length > 0 ? s[0].focus() : n === "container" ? (t.setAttribute("tabindex", "-1"), t.focus()) : n instanceof HTMLElement && n.focus();
			}), c.push(H(e, "keydown", u), H(t, "focusout", d)));
		},
		deactivate: () => {
			a && (a = !1, c.forEach((e) => e()), c = [], t.getAttribute("tabindex") === "-1" && t.removeAttribute("tabindex"), r === "previous" && o ? o.focus() : r instanceof HTMLElement && r.focus(), o = null);
		},
		updateElements: l
	};
}, za = {
	HEADER: "data-atlas-calendar-header",
	GRID: "data-atlas-calendar-grid",
	DAY: "data-atlas-calendar-day",
	PREV: "data-atlas-calendar-prev",
	NEXT: "data-atlas-calendar-next"
}, Ba = {
	ROOT: "atlas-calendar",
	HEADER: "atlas-calendar-header",
	TITLE: "atlas-calendar-title",
	NAV_BTN: "atlas-calendar-nav-btn",
	GRID: "atlas-calendar-grid",
	WEEKDAYS: "atlas-calendar-weekdays",
	WEEKDAY: "atlas-calendar-weekday",
	WEEK: "atlas-calendar-week",
	WEEK_NUMBER: "atlas-calendar-week-number",
	DAY: "atlas-calendar-day",
	DAY_TODAY: "atlas-calendar-day--today",
	DAY_SELECTED: "atlas-calendar-day--selected",
	DAY_DISABLED: "atlas-calendar-day--disabled",
	DAY_OUTSIDE: "atlas-calendar-day--outside",
	DAY_RANGE_START: "atlas-calendar-day--range-start",
	DAY_RANGE_END: "atlas-calendar-day--range-end",
	DAY_RANGE_MIDDLE: "atlas-calendar-day--range-middle"
}, Va = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"15 18 9 12 15 6\"></polyline></svg>", Ha = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>";
function Ua(e, t = {}) {
	if (!V()) return Wa();
	let { mode: n = "single", value: r = null, minDate: i, maxDate: a, disabledDates: o, weekStartsOn: s = 1, locale: c = "en-US", showWeekNumbers: l = !1, showOutsideDays: u = !0, numberOfMonths: d = 1 } = t, f = r, p = r instanceof Date ? new Date(r) : /* @__PURE__ */ new Date(), m = B("calendar"), h = [], g = new Intl.DateTimeFormat(c, {
		month: "long",
		year: "numeric"
	}), _ = new Intl.DateTimeFormat(c, { weekday: "short" });
	function v() {
		e.classList.add(Ba.ROOT), e.setAttribute("data-atlas-calendar", ""), e.setAttribute("role", "application"), e.setAttribute("aria-label", "Calendar"), e.id = m, y();
	}
	function y() {
		e.innerHTML = "";
		for (let t = 0; t < d; t++) {
			let n = new Date(p);
			n.setMonth(n.getMonth() + t), e.appendChild(b(n, t === 0, t === d - 1));
		}
	}
	function b(e, t, n) {
		let r = document.createElement("div");
		r.className = "atlas-calendar-month";
		let i = document.createElement("div");
		if (i.className = Ba.HEADER, i.setAttribute(za.HEADER, ""), t) {
			let e = document.createElement("button");
			e.className = Ba.NAV_BTN, e.setAttribute(za.PREV, ""), e.type = "button", e.innerHTML = Va, e.setAttribute("aria-label", "Previous month"), e.addEventListener("click", k), i.appendChild(e);
		} else i.appendChild(document.createElement("span"));
		let a = document.createElement("div");
		if (a.className = Ba.TITLE, a.textContent = g.format(e), a.setAttribute("aria-live", "polite"), i.appendChild(a), n) {
			let e = document.createElement("button");
			e.className = Ba.NAV_BTN, e.setAttribute(za.NEXT, ""), e.type = "button", e.innerHTML = Ha, e.setAttribute("aria-label", "Next month"), e.addEventListener("click", O), i.appendChild(e);
		} else i.appendChild(document.createElement("span"));
		r.appendChild(i);
		let o = document.createElement("div");
		o.className = Ba.GRID, o.setAttribute(za.GRID, ""), o.setAttribute("role", "grid");
		let c = document.createElement("div");
		if (c.className = Ba.WEEKDAYS, c.setAttribute("role", "row"), l) {
			let e = document.createElement("div");
			e.className = Ba.WEEK_NUMBER, c.appendChild(e);
		}
		for (let e = 0; e < 7; e++) {
			let t = (s + e) % 7, n = document.createElement("div");
			n.className = Ba.WEEKDAY, n.setAttribute("role", "columnheader");
			let r = new Date(2024, 0, t);
			n.textContent = _.format(r).slice(0, 2), c.appendChild(n);
		}
		return o.appendChild(c), C(e).forEach((t) => {
			let n = document.createElement("div");
			if (n.className = Ba.WEEK, n.setAttribute("role", "row"), l) {
				let e = document.createElement("div");
				e.className = Ba.WEEK_NUMBER, e.textContent = String(w(t[0])), n.appendChild(e);
			}
			t.forEach((t) => {
				let r = x(t, e);
				n.appendChild(r);
			}), o.appendChild(n);
		}), r.appendChild(o), r;
	}
	function x(e, t) {
		let r = document.createElement("button");
		r.className = Ba.DAY, r.setAttribute(za.DAY, ""), r.setAttribute("role", "gridcell"), r.type = "button", r.textContent = String(e.getDate()), r.setAttribute("data-date", e.toISOString());
		let i = T(e, /* @__PURE__ */ new Date()), a = e.getMonth() !== t.getMonth(), o = D(e), s = E(e);
		if (i && r.classList.add(Ba.DAY_TODAY), a && r.classList.add(Ba.DAY_OUTSIDE), o && (r.classList.add(Ba.DAY_DISABLED), r.disabled = !0), s && r.classList.add(Ba.DAY_SELECTED), n === "range" && Array.isArray(f) && f.length === 2) {
			let [t, n] = f;
			T(e, t) && r.classList.add(Ba.DAY_RANGE_START), T(e, n) && r.classList.add(Ba.DAY_RANGE_END), e > t && e < n && r.classList.add(Ba.DAY_RANGE_MIDDLE);
		}
		return r.setAttribute("aria-selected", s ? "true" : "false"), o && r.setAttribute("aria-disabled", "true"), !a || u ? (r.addEventListener("click", () => S(e)), n === "range" && r.addEventListener("mouseenter", () => void 0)) : r.style.visibility = "hidden", r;
	}
	function S(e) {
		if (!D(e)) {
			switch (n) {
				case "single":
					f = e;
					break;
				case "multiple": {
					let t = f ?? [], n = t.findIndex((t) => T(t, e));
					n >= 0 ? t.splice(n, 1) : t.push(e), f = [...t];
					break;
				}
				case "range": {
					let t = f;
					if (!t || t.length === 2 || !t[0]) f = [e, e];
					else {
						let [n] = t;
						f = e < n ? [e, n] : [n, e];
					}
					break;
				}
			}
			y(), t.onChange?.(f);
		}
	}
	function C(e) {
		let t = e.getFullYear(), n = e.getMonth(), r = new Date(t, n, 1), i = new Date(t, n + 1, 0), a = new Date(r), o = (a.getDay() - s + 7) % 7;
		a.setDate(a.getDate() - o);
		let c = [], l = new Date(a);
		for (; l <= i || c.length < 6;) {
			let e = [];
			for (let t = 0; t < 7; t++) e.push(new Date(l)), l.setDate(l.getDate() + 1);
			if (c.push(e), l.getMonth() !== n && c.length >= 4) break;
		}
		return c;
	}
	function w(e) {
		let t = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())), n = t.getUTCDay() || 7;
		t.setUTCDate(t.getUTCDate() + 4 - n);
		let r = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
		return Math.ceil(((t.getTime() - r.getTime()) / 864e5 + 1) / 7);
	}
	function T(e, t) {
		return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
	}
	function E(e) {
		return f ? f instanceof Date ? T(e, f) : Array.isArray(f) ? f.some((t) => T(e, t)) : !1 : !1;
	}
	function D(e) {
		return i && e < i || a && e > a ? !0 : typeof o == "function" ? o(e) : Array.isArray(o) ? o.some((t) => T(e, t)) : !1;
	}
	function O() {
		p.setMonth(p.getMonth() + 1), y(), t.onMonthChange?.(new Date(p));
	}
	function k() {
		p.setMonth(p.getMonth() - 1), y(), t.onMonthChange?.(new Date(p));
	}
	function A() {
		p = /* @__PURE__ */ new Date(), y(), t.onMonthChange?.(new Date(p));
	}
	function j(e) {
		f = e, e instanceof Date && (p = new Date(e)), y();
	}
	function M(e) {
		p = new Date(e), y(), t.onMonthChange?.(new Date(p));
	}
	function N() {
		y();
	}
	function P() {
		h.forEach((e) => e()), e.classList.remove(Ba.ROOT), e.removeAttribute("data-atlas-calendar"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.innerHTML = "";
	}
	return v(), {
		getValue: () => f,
		setValue: j,
		getViewedMonth: () => new Date(p),
		setViewedMonth: M,
		nextMonth: O,
		prevMonth: k,
		goToToday: A,
		isSelected: E,
		isDisabled: D,
		refresh: N,
		destroy: P
	};
}
function Wa() {
	return {
		getValue: () => null,
		setValue: () => {},
		getViewedMonth: () => /* @__PURE__ */ new Date(),
		setViewedMonth: () => {},
		nextMonth: () => {},
		prevMonth: () => {},
		goToToday: () => {},
		isSelected: () => !1,
		isDisabled: () => !1,
		refresh: () => {},
		destroy: () => {}
	};
}
var Ga = {
	TRIGGER: "data-atlas-date-picker-trigger",
	CONTENT: "data-atlas-date-picker-content",
	PRESETS: "data-atlas-date-picker-presets",
	PRESET: "data-atlas-date-picker-preset",
	CLEAR: "data-atlas-date-picker-clear",
	CALENDAR: "data-atlas-date-picker-calendar"
}, q = {
	ROOT: "atlas-date-picker",
	TRIGGER: "atlas-date-picker-trigger",
	TRIGGER_ICON: "atlas-date-picker-trigger-icon",
	TRIGGER_TEXT: "atlas-date-picker-trigger-text",
	TRIGGER_PLACEHOLDER: "atlas-date-picker-trigger-placeholder",
	TRIGGER_CLEAR: "atlas-date-picker-trigger-clear",
	CONTENT: "atlas-date-picker-content",
	CONTENT_OPEN: "atlas-date-picker-content--open",
	PRESETS: "atlas-date-picker-presets",
	PRESET: "atlas-date-picker-preset",
	WITH_PRESETS: "atlas-date-picker-with-presets",
	CALENDAR: "atlas-date-picker-calendar",
	DISABLED: "atlas-date-picker--disabled",
	OPEN: "atlas-date-picker--open"
}, Ka = [
	{
		label: "Today",
		getValue: () => /* @__PURE__ */ new Date()
	},
	{
		label: "Tomorrow",
		getValue: () => {
			let e = /* @__PURE__ */ new Date();
			return e.setDate(e.getDate() + 1), e;
		}
	},
	{
		label: "In a week",
		getValue: () => {
			let e = /* @__PURE__ */ new Date();
			return e.setDate(e.getDate() + 7), e;
		}
	},
	{
		label: "In a month",
		getValue: () => {
			let e = /* @__PURE__ */ new Date();
			return e.setMonth(e.getMonth() + 1), e;
		}
	}
], qa = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/></svg>", Ja = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/></svg>";
function Ya(e, t = {}) {
	if (!V()) return Xa();
	let { mode: n = "single", value: r = null, placeholder: i = "Pick a date", minDate: a, maxDate: o, disabledDates: s, weekStartsOn: c = 1, locale: l = "en-US", placement: u = "bottom-start", offset: d = 4, showPresets: f = !1, presets: p = Ka, disabled: m = !1, clearable: h = !0, closeOnEsc: g = !0, closeOnClickOutside: _ = !0, numberOfMonths: v = 1, showWeekNumbers: y = !1 } = t, b = r, x = !1, S = m, C = u, w = B("date-picker"), T = null, E = null, D = null, O = null, k = null, A = null, j = null, M = null, N = null, P = [], F = new Intl.DateTimeFormat(l, {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric"
	});
	function I() {
		e.classList.add(q.ROOT), e.setAttribute("data-atlas-date-picker", ""), e.id = w, S && e.classList.add(q.DISABLED), T = e.querySelector(`[${Ga.TRIGGER}]`), T || (T = document.createElement("button"), T.setAttribute(Ga.TRIGGER, ""), e.appendChild(T)), ee(), E = e.querySelector(`[${Ga.CONTENT}]`), E || (E = document.createElement("div"), E.setAttribute(Ga.CONTENT, ""), e.appendChild(E)), L(), ue();
	}
	function ee() {
		T && (T.className = q.TRIGGER, T.type = "button", T.setAttribute("aria-haspopup", "dialog"), T.setAttribute("aria-expanded", "false"), T.setAttribute("aria-controls", `${w}-content`), T.disabled = S, T.innerHTML = `
      <span class="${q.TRIGGER_ICON}">${qa}</span>
      <span class="${q.TRIGGER_TEXT} ${q.TRIGGER_PLACEHOLDER}">${i}</span>
    `, O = T.querySelector(`.${q.TRIGGER_TEXT}`), P.push(H(T, "click", ne)), P.push(H(T, "keydown", re)));
	}
	function L() {
		E && (E.id = `${w}-content`, E.className = q.CONTENT, E.setAttribute("role", "dialog"), E.setAttribute("aria-modal", "true"), E.setAttribute("aria-label", "Choose date"), E.style.display = "none", E.style.position = "absolute", te());
	}
	function te() {
		if (E) {
			if (E.innerHTML = "", f) {
				E.classList.add(q.WITH_PRESETS);
				let e = document.createElement("div");
				e.className = q.PRESETS, e.setAttribute(Ga.PRESETS, ""), p.forEach((t, n) => {
					let r = document.createElement("button");
					r.className = q.PRESET, r.setAttribute(Ga.PRESET, ""), r.type = "button", r.textContent = t.label, r.dataset.presetIndex = String(n), r.addEventListener("click", () => R(n)), e.appendChild(r);
				}), E.appendChild(e);
			}
			D = document.createElement("div"), D.className = q.CALENDAR, D.setAttribute(Ga.CALENDAR, ""), E.appendChild(D), A = Ua(D, {
				mode: n,
				value: b,
				minDate: a,
				maxDate: o,
				disabledDates: s,
				weekStartsOn: c,
				locale: l,
				numberOfMonths: v,
				showWeekNumbers: y,
				onChange: ie
			});
		}
	}
	function ne(e) {
		if (e.preventDefault(), e.stopPropagation(), e.target.closest(`.${q.TRIGGER_CLEAR}`)) {
			fe();
			return;
		}
		S || se();
	}
	function re(e) {
		S || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), se());
	}
	function R(e) {
		let t = p[e];
		t && (de(t.getValue()), oe());
	}
	function ie(e) {
		if (b = e, ue(), t.onChange?.(e), n === "single" && e && setTimeout(() => oe(), 150), n === "range" && Array.isArray(e) && e.length === 2) {
			let [t, n] = e;
			t && n && t.getTime() !== n.getTime() && setTimeout(() => oe(), 150);
		}
	}
	function ae() {
		x || S || !E || !T || (x = !0, T.setAttribute("aria-expanded", "true"), E.style.display = "", e.classList.add(q.OPEN), E.classList.add(q.CONTENT_OPEN), ce(), N = Ia(T, E, ce), j = Ra({
			container: E,
			initialFocus: "container",
			returnFocus: T
		}), j.activate(), M = La(E, {
			escapeKey: g,
			clickOutside: _,
			ignore: [T],
			onDismiss: oe
		}), requestAnimationFrame(() => {
			(D?.querySelector("button[data-atlas-calendar-day]"))?.focus();
		}), t.onOpen?.());
	}
	function oe() {
		!x || !E || !T || (x = !1, T.setAttribute("aria-expanded", "false"), e.classList.remove(q.OPEN), E.classList.remove(q.CONTENT_OPEN), N?.(), N = null, j?.deactivate(), j = null, M?.destroy(), M = null, setTimeout(() => {
			!x && E && (E.style.display = "none");
		}, W.normal), T.focus(), t.onClose?.());
	}
	function se() {
		x ? oe() : ae();
	}
	function ce() {
		if (!T || !E) return;
		let e = Pa(T, E, {
			placement: C,
			offset: d,
			flip: !0,
			shift: !0
		});
		E.style.left = `${e.x}px`, E.style.top = `${e.y}px`, E.setAttribute("data-placement", e.placement);
	}
	function le(e) {
		return F.format(e);
	}
	function ue() {
		if (!O || !T) return;
		k?.remove(), k = null;
		let e, t = !1;
		if (n === "range") {
			if (Array.isArray(b) && b.length === 2 && b[0] && b[1]) {
				let [n, r] = b;
				e = `${le(n)} - ${le(r)}`, t = !0;
			} else Array.isArray(b) && b[0] ? (e = `${le(b[0])} - ...`, t = !0) : e = i;
		} else n === "multiple" ? Array.isArray(b) && b.length > 0 ? (e = b.length === 1 ? le(b[0]) : `${b.length} dates selected`, t = !0) : e = i : b instanceof Date ? (e = le(b), t = !0) : e = i;
		O.textContent = e, t ? O.classList.remove(q.TRIGGER_PLACEHOLDER) : O.classList.add(q.TRIGGER_PLACEHOLDER), h && t && (k = document.createElement("button"), k.className = q.TRIGGER_CLEAR, k.setAttribute(Ga.CLEAR, ""), k.type = "button", k.setAttribute("aria-label", "Clear date"), k.innerHTML = Ja, T.appendChild(k));
	}
	function de(e) {
		b = e, A?.setValue(e), ue(), t.onChange?.(e);
	}
	function fe() {
		de(null);
	}
	function pe(t) {
		S = t, t ? (e.classList.add(q.DISABLED), T?.setAttribute("disabled", ""), x && oe()) : (e.classList.remove(q.DISABLED), T?.removeAttribute("disabled"));
	}
	function me() {
		x && (j?.deactivate(), M?.destroy(), N?.()), A?.destroy(), P.forEach((e) => e()), e.classList.remove(q.ROOT, q.OPEN, q.DISABLED), e.removeAttribute("data-atlas-date-picker"), e.removeAttribute("data-atlas-date-picker-initialized");
	}
	return I(), {
		getValue: () => b,
		setValue: de,
		isOpen: () => x,
		open: ae,
		close: oe,
		toggle: se,
		clear: fe,
		setDisabled: pe,
		isDisabled: () => S,
		getCalendar: () => A,
		destroy: me
	};
}
function Xa() {
	return {
		getValue: () => null,
		setValue: () => {},
		isOpen: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		clear: () => {},
		setDisabled: () => {},
		isDisabled: () => !1,
		getCalendar: () => null,
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-F2H3TK3B.js
function Za(e, t = {}) {
	if (!V()) return Qa();
	let { length: n = 6, type: r = "numeric", masked: i = !1, disabled: a = !1, separatorAfter: o = [], separatorChar: s = "-", autoFocus: c = !0, name: l, placeholder: u = "○", onChange: d, onComplete: f, onFocus: p, onBlur: m } = t, h = B("otp"), g = Array(n).fill(""), _ = a, v = !1, y = !1, b = [], x = [], S = (() => {
		switch (r) {
			case "numeric": return /^[0-9]$/;
			case "alphabetic": return /^[a-zA-Z]$/;
			case "alphanumeric": return /^[a-zA-Z0-9]$/;
			default: return /^[0-9]$/;
		}
	})();
	function C() {
		if (e.innerHTML = "", e.classList.add("atlas-input-otp"), e.setAttribute("role", "group"), e.setAttribute("aria-label", `OTP input with ${n} characters`), e.setAttribute("data-atlas-input-otp", ""), e.style.cssText = "\n      display: inline-flex;\n      align-items: center;\n      gap: 8px;\n    ", l) {
			let t = document.createElement("input");
			t.type = "hidden", t.name = l, t.id = `${h}-hidden`, e.appendChild(t);
		}
		for (let t = 0; t < n; t++) {
			let a = document.createElement("div");
			a.className = "atlas-input-otp-slot", a.style.cssText = "\n        position: relative;\n        width: 40px;\n        height: 48px;\n      ";
			let c = document.createElement("input");
			if (c.type = i ? "password" : "text", c.inputMode = r === "numeric" ? "numeric" : "text", c.maxLength = 1, c.className = "atlas-input-otp-input", c.id = `${h}-${t}`, c.setAttribute("aria-label", `Character ${t + 1} of ${n}`), c.setAttribute("autocomplete", "one-time-code"), c.placeholder = u, c.disabled = _, c.style.cssText = `
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 1.25rem;
        font-weight: 600;
        border: 2px solid var(--atlas-border, hsl(214.3 31.8% 91.4%));
        border-radius: 8px;
        background: var(--atlas-background, hsl(0 0% 100%));
        color: var(--atlas-foreground, hsl(222.2 84% 4.9%));
        outline: none;
        transition: border-color ${W.fast}ms ${G.standard},
                    box-shadow ${W.fast}ms ${G.standard},
                    transform ${W.fast}ms ${G.standard};
      `, b.push(c), a.appendChild(c), e.appendChild(a), o.includes(t + 1) && t < n - 1) {
				let t = document.createElement("span");
				t.className = "atlas-input-otp-separator", t.textContent = s, t.style.cssText = "\n          color: var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%));\n          font-size: 1.25rem;\n          user-select: none;\n        ", e.appendChild(t);
			}
			w(c, t);
		}
		c && !_ && requestAnimationFrame(() => {
			b[0]?.focus();
		});
	}
	function w(e, t) {
		x.push(H(e, "input", ((r) => {
			let i = r, a = e.value;
			if (i.inputType !== "insertFromPaste") {
				if (a && !S.test(a)) {
					e.value = g[t], E(e);
					return;
				}
				g[t] = a, O(), d?.(D()), a && t < n - 1 && b[t + 1].focus(), k();
			}
		}))), x.push(H(e, "keydown", ((r) => {
			switch (r.key) {
				case "Backspace":
					!e.value && t > 0 ? (r.preventDefault(), b[t - 1].focus(), b[t - 1].value = "", g[t - 1] = "", O(), d?.(D())) : e.value && (g[t] = "", O(), d?.(D()));
					break;
				case "Delete":
					g[t] = "", e.value = "", O(), d?.(D());
					break;
				case "ArrowLeft":
					r.preventDefault(), t > 0 && b[t - 1].focus();
					break;
				case "ArrowRight":
					r.preventDefault(), t < n - 1 && b[t + 1].focus();
					break;
				case "Home":
					r.preventDefault(), b[0].focus();
					break;
				case "End": r.preventDefault(), b[n - 1].focus();
			}
		}))), x.push(H(e, "paste", ((e) => {
			e.preventDefault(), T(e.clipboardData?.getData("text") || "", t);
		}))), x.push(H(e, "focus", (() => {
			v = !0, e.style.borderColor = "var(--atlas-ring, hsl(215 20.2% 65.1%))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-ring) / 0.2)", e.style.transform = "scale(1.05)", e.select(), p?.();
		}))), x.push(H(e, "blur", (() => {
			requestAnimationFrame(() => {
				let e = document.activeElement;
				b.some((t) => t === e) || (v = !1, m?.());
			}), e.style.borderColor = y ? "var(--atlas-destructive, hsl(0 84.2% 60.2%))" : "var(--atlas-border, hsl(214.3 31.8% 91.4%))", e.style.boxShadow = y ? "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)" : "none", e.style.transform = "scale(1)";
		})));
	}
	function T(e, t) {
		let r = e.split("").filter((e) => S.test(e));
		for (let e = 0; e < r.length && t + e < n; e++) {
			let n = t + e;
			g[n] = r[e], b[n].value = r[e];
		}
		O(), d?.(D());
		let i = g.findIndex((e) => !e);
		i === -1 ? b[n - 1].focus() : b[i].focus(), k();
	}
	function E(e) {
		e.animate && e.animate([
			{ transform: "translateX(0) scale(1.05)" },
			{ transform: "translateX(-3px) scale(1.05)" },
			{ transform: "translateX(3px) scale(1.05)" },
			{ transform: "translateX(-3px) scale(1.05)" },
			{ transform: "translateX(0) scale(1.05)" }
		], {
			duration: 300,
			easing: "ease-in-out"
		});
	}
	function D() {
		return g.join("");
	}
	function O() {
		if (l) {
			let t = e.querySelector(`#${h}-hidden`);
			t && (t.value = D());
		}
	}
	function k() {
		let e = D();
		e.length === n && g.every((e) => e) && f?.(e);
	}
	function A() {
		b.forEach((e) => {
			e.disabled = _, _ ? (e.style.opacity = "0.5", e.style.cursor = "not-allowed") : (e.style.opacity = "1", e.style.cursor = "text");
		}), _ ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
	}
	function j() {
		b.forEach((e) => {
			y ? (e.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))", document.activeElement !== e && (e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)")) : (e.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))", document.activeElement !== e && (e.style.boxShadow = "none"));
		}), y ? e.setAttribute("aria-invalid", "true") : e.removeAttribute("aria-invalid");
	}
	return C(), {
		get value() {
			return D();
		},
		get isComplete() {
			return D().length === n && g.every((e) => e);
		},
		get isDisabled() {
			return _;
		},
		get isFocused() {
			return v;
		},
		setValue: (e) => {
			let t = e.split("").slice(0, n);
			g = Array(n).fill(""), t.forEach((e, t) => {
				S.test(e) && (g[t] = e, b[t].value = e);
			}), O(), d?.(D()), k();
		},
		clear: () => {
			g = Array(n).fill(""), b.forEach((e) => {
				e.value = "";
			}), O(), d?.(""), b[0]?.focus();
		},
		focus: () => {
			let e = g.findIndex((e) => !e);
			b[e === -1 ? 0 : e]?.focus();
		},
		blur: () => {
			b.forEach((e) => e.blur());
		},
		setDisabled: (e) => {
			_ = e, A();
		},
		setError: (e) => {
			y = e, j(), e && b.forEach((e) => E(e));
		},
		destroy: () => {
			x.forEach((e) => e()), e.innerHTML = "", e.classList.remove("atlas-input-otp"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.removeAttribute("aria-disabled"), e.removeAttribute("aria-invalid"), e.removeAttribute("data-atlas-input-otp"), e.style.cssText = "";
		}
	};
}
function Qa() {
	return {
		get value() {
			return "";
		},
		get isComplete() {
			return !1;
		},
		get isDisabled() {
			return !1;
		},
		get isFocused() {
			return !1;
		},
		setValue: () => {},
		clear: () => {},
		focus: () => {},
		blur: () => {},
		setDisabled: () => {},
		setError: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-RBWHW7MF.js
var $a = {
	ROOT: "data-atlas-menubar",
	MENU: "data-atlas-menubar-menu",
	TRIGGER: "data-atlas-menubar-trigger",
	CONTENT: "data-atlas-menubar-content",
	ITEM: "data-atlas-menubar-item",
	SEPARATOR: "data-atlas-menubar-separator",
	LABEL: "data-atlas-menubar-label"
}, eo = {
	ROOT: "atlas-menubar",
	MENU: "atlas-menubar-menu",
	TRIGGER: "atlas-menubar-trigger",
	TRIGGER_OPEN: "atlas-menubar-trigger--open",
	CONTENT: "atlas-menubar-content",
	CONTENT_OPEN: "atlas-menubar-content--open",
	ITEM: "atlas-menubar-item",
	ITEM_DISABLED: "atlas-menubar-item--disabled",
	ITEM_HIGHLIGHTED: "atlas-menubar-item--highlighted",
	SEPARATOR: "atlas-menubar-separator",
	LABEL: "atlas-menubar-label",
	SHORTCUT: "atlas-menubar-shortcut",
	ICON: "atlas-menubar-icon",
	INDICATOR: "atlas-menubar-indicator"
};
function to(e, t = {}) {
	if (!V()) return no();
	let { menus: n = [], placement: r = "bottom-start", offset: i = 4, closeOnSelect: a = !0 } = t, o = n, s = null, c = B("menubar"), l = /* @__PURE__ */ new Map(), u = null, d = null, f = null, p = [];
	function m() {
		e.classList.add(eo.ROOT), e.setAttribute($a.ROOT, ""), e.setAttribute("role", "menubar"), o.length > 0 ? g() : h(), b();
	}
	function h() {
		e.querySelectorAll(`[${$a.MENU}]`).forEach((e) => {
			let t = e.getAttribute($a.MENU) || B("menu"), n = e.querySelector(`[${$a.TRIGGER}]`), r = e.querySelector(`[${$a.CONTENT}]`);
			n && r && y(t, e, n, r);
		});
	}
	function g() {
		e.innerHTML = "", o.forEach((t) => {
			let n = document.createElement("div");
			n.className = eo.MENU, n.setAttribute($a.MENU, t.id);
			let r = document.createElement("button");
			r.className = eo.TRIGGER, r.setAttribute($a.TRIGGER, ""), r.setAttribute("type", "button"), r.setAttribute("role", "menuitem"), r.setAttribute("aria-haspopup", "menu"), r.setAttribute("aria-expanded", "false"), r.textContent = t.label, r.id = `${c}-trigger-${t.id}`, t.disabled && (r.setAttribute("disabled", ""), r.setAttribute("aria-disabled", "true"));
			let i = document.createElement("div");
			i.className = eo.CONTENT, i.setAttribute($a.CONTENT, ""), i.setAttribute("role", "menu"), i.setAttribute("aria-labelledby", r.id), i.id = `${c}-content-${t.id}`, i.style.display = "none", _(i, t.items, t.id), n.appendChild(r), n.appendChild(i), e.appendChild(n), y(t.id, n, r, i);
		});
	}
	function _(e, t, n) {
		t.forEach((t) => {
			let r = v(t, n);
			e.appendChild(r);
		});
	}
	function v(e, t) {
		if (e.type === "separator") {
			let e = document.createElement("div");
			return e.className = eo.SEPARATOR, e.setAttribute($a.SEPARATOR, ""), e.setAttribute("role", "separator"), e;
		}
		if (e.type === "label") {
			let t = document.createElement("div");
			return t.className = eo.LABEL, t.setAttribute($a.LABEL, ""), t.textContent = e.label, t;
		}
		let n = document.createElement("div");
		n.className = eo.ITEM, n.setAttribute($a.ITEM, ""), n.setAttribute("data-menu-id", t), n.setAttribute("data-item-id", e.id), n.setAttribute("role", e.type === "checkbox" ? "menuitemcheckbox" : e.type === "radio" ? "menuitemradio" : "menuitem"), n.tabIndex = -1, e.disabled && (n.classList.add(eo.ITEM_DISABLED), n.setAttribute("aria-disabled", "true")), (e.type === "checkbox" || e.type === "radio") && n.setAttribute("aria-checked", e.checked ? "true" : "false");
		let r = "";
		return (e.type === "checkbox" || e.type === "radio") && (r += `<span class="${eo.INDICATOR}" aria-hidden="true">`, e.checked && (r += e.type === "checkbox" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>" : "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"4\"></circle></svg>"), r += "</span>"), e.icon && (r += `<span class="${eo.ICON}" aria-hidden="true">${e.icon}</span>`), r += `<span class="atlas-menubar-item-label">${ro(e.label)}</span>`, e.shortcut && (r += `<span class="${eo.SHORTCUT}">${ro(e.shortcut)}</span>`), n.innerHTML = r, n;
	}
	function y(e, t, n, r) {
		n.setAttribute("aria-controls", r.id || `${c}-content-${e}`), l.set(e, {
			trigger: n,
			content: r,
			rovingFocus: null
		}), p.push(H(n, "click", (t) => {
			t.preventDefault(), t.stopPropagation(), s === e ? E() : w(e);
		})), p.push(H(n, "mouseenter", () => {
			s && s !== e && w(e);
		})), p.push(H(r, "click", (t) => {
			let n = t.target.closest(`[${$a.ITEM}]`);
			n && !n.hasAttribute("aria-disabled") && S(e, n);
		})), p.push(H(r, "keydown", (t) => {
			let n = t;
			if (n.key === "Enter" || n.key === " ") {
				t.preventDefault();
				let n = t.target.closest(`[${$a.ITEM}]`);
				n && !n.hasAttribute("aria-disabled") && S(e, n);
			}
		})), p.push(H(r, "mouseover", (e) => {
			let t = e.target.closest(`[${$a.ITEM}]`);
			t && !t.hasAttribute("aria-disabled") && x(r, t);
		}));
	}
	function b() {
		f = Sa(e, {
			itemSelector: `[${$a.TRIGGER}]:not([disabled])`,
			orientation: "horizontal",
			loop: !0
		}), p.push(H(e, "keydown", (e) => {
			let t = e;
			if (t.key === "ArrowRight" && s) {
				e.preventDefault();
				let t = Array.from(l.keys());
				w(t[(t.indexOf(s) + 1) % t.length]);
			} else if (t.key === "ArrowLeft" && s) {
				e.preventDefault();
				let t = Array.from(l.keys());
				w(t[(t.indexOf(s) - 1 + t.length) % t.length]);
			} else t.key === "Escape" && (e.preventDefault(), E());
		}));
	}
	function x(e, t) {
		e.querySelectorAll(`.${eo.ITEM_HIGHLIGHTED}`).forEach((e) => {
			e.classList.remove(eo.ITEM_HIGHLIGHTED);
		}), t.classList.add(eo.ITEM_HIGHLIGHTED), t.focus();
	}
	function S(e, n) {
		let r = n.getAttribute("data-item-id"), i = o.find((t) => t.id === e), s = i?.items.find((e) => e.id === r);
		!s || s.disabled || (s.type === "checkbox" ? (s.checked = !s.checked, n.setAttribute("aria-checked", s.checked ? "true" : "false"), C(n, s)) : s.type === "radio" && s.group && (i?.items.forEach((e) => {
			e.type === "radio" && e.group === s.group && (e.checked = e.id === s.id);
		}), (l.get(e)?.content)?.querySelectorAll(`[${$a.ITEM}]`).forEach((e) => {
			let t = e.getAttribute("data-item-id"), n = i?.items.find((e) => e.id === t);
			n?.type === "radio" && n.group === s.group && (e.setAttribute("aria-checked", n.checked ? "true" : "false"), C(e, n));
		})), s.onSelect?.(), t.onSelect?.(e, s), a && s.type !== "checkbox" && s.type !== "radio" && E());
	}
	function C(e, t) {
		let n = e.querySelector(`.${eo.INDICATOR}`);
		n && (n.innerHTML = t.checked ? t.type === "checkbox" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>" : "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"4\"></circle></svg>" : "");
	}
	function w(n) {
		let r = l.get(n);
		if (!r) return;
		s && s !== n && T(s), s = n;
		let { trigger: i, content: a } = r;
		i.classList.add(eo.TRIGGER_OPEN), i.setAttribute("aria-expanded", "true"), a.style.display = "", a.classList.add(eo.CONTENT_OPEN), O(i, a), d = Ia(i, a, () => O(i, a)), r.rovingFocus = Sa(a, {
			itemSelector: `[${$a.ITEM}]:not([aria-disabled="true"])`,
			orientation: "vertical",
			loop: !0
		}), u = La(a, {
			escapeKey: !0,
			clickOutside: !0,
			ignore: [e],
			onDismiss: E
		}), requestAnimationFrame(() => {
			let e = a.querySelector(`[${$a.ITEM}]:not([aria-disabled="true"])`);
			e && x(a, e);
		}), t.onMenuOpen?.(n);
	}
	function T(e) {
		let n = l.get(e);
		if (!n) return;
		let { trigger: r, content: i, rovingFocus: a } = n;
		r.classList.remove(eo.TRIGGER_OPEN), r.setAttribute("aria-expanded", "false"), i.classList.remove(eo.CONTENT_OPEN), i.querySelectorAll(`.${eo.ITEM_HIGHLIGHTED}`).forEach((e) => {
			e.classList.remove(eo.ITEM_HIGHLIGHTED);
		}), a?.destroy(), n.rovingFocus = null, setTimeout(() => {
			s !== e && (i.style.display = "none");
		}, W.fast), t.onMenuClose?.(e);
	}
	function E() {
		if (!s) return;
		let e = s;
		s = null, T(e), d?.(), d = null, u?.destroy(), u = null, l.get(e)?.trigger.focus();
	}
	function D() {
		E();
	}
	function O(e, t) {
		let n = Pa(e, t, {
			placement: r,
			offset: i,
			flip: !0,
			shift: !0
		});
		t.style.position = "absolute", t.style.left = `${n.x}px`, t.style.top = `${n.y}px`;
	}
	function k() {
		E(), f?.destroy(), p.forEach((e) => e()), l.clear(), e.classList.remove(eo.ROOT), e.removeAttribute($a.ROOT), e.removeAttribute("role");
	}
	return m(), {
		getOpenMenu: () => s,
		openMenu: w,
		closeMenu: E,
		closeAll: D,
		hasOpenMenu: () => s !== null,
		getMenus: () => [...o],
		setMenus: (e) => {
			o = e, l.clear(), g(), b();
		},
		destroy: k
	};
}
function no() {
	return {
		getOpenMenu: () => null,
		openMenu: () => {},
		closeMenu: () => {},
		closeAll: () => {},
		hasOpenMenu: () => !1,
		getMenus: () => [],
		setMenus: () => {},
		destroy: () => {}
	};
}
function ro(e) {
	let t = document.createElement("div");
	return t.textContent = e, t.innerHTML;
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-G4LDOE2T.js
var io = {
	ROOT: "data-atlas-navigation-menu",
	LIST: "data-atlas-navigation-menu-list",
	ITEM: "data-atlas-navigation-menu-item",
	TRIGGER: "data-atlas-navigation-menu-trigger",
	CONTENT: "data-atlas-navigation-menu-content",
	LINK: "data-atlas-navigation-menu-link"
}, ao = {
	ROOT: "atlas-navigation-menu",
	LIST: "atlas-navigation-menu-list",
	ITEM: "atlas-navigation-menu-item",
	TRIGGER: "atlas-navigation-menu-trigger",
	TRIGGER_OPEN: "atlas-navigation-menu-trigger--open",
	CONTENT: "atlas-navigation-menu-content",
	CONTENT_OPEN: "atlas-navigation-menu-content--open",
	LINK: "atlas-navigation-menu-link",
	LINK_ACTIVE: "atlas-navigation-menu-link--active",
	CHEVRON: "atlas-navigation-menu-chevron",
	DESCRIPTION: "atlas-navigation-menu-description",
	ICON: "atlas-navigation-menu-icon"
};
function oo(e, t = {}) {
	if (!V()) return so();
	let { items: n = [], trigger: r = "hover", placement: i = "bottom-start", offset: a = 4, openDelay: o = 0, closeDelay: s = 150 } = t, c = n, l = null, u = null, d = null, f = B("nav-menu"), p = /* @__PURE__ */ new Map(), m = null, h = null, g = null, _ = [];
	function v() {
		e.classList.add(ao.ROOT), e.setAttribute(io.ROOT, "");
		let t = document.createElement("nav");
		t.setAttribute("aria-label", "Main navigation"), c.length > 0 ? b(t) : y(), (e.children.length === 0 || c.length > 0) && e.appendChild(t), T(), _.push(H(document, "click", (t) => {
			e.contains(t.target) || A();
		}));
	}
	function y() {
		e.querySelectorAll(`[${io.ITEM}]`).forEach((e) => {
			w(e.getAttribute(io.ITEM) || B("nav-item"), e, e.querySelector(`[${io.TRIGGER}]`), e.querySelector(`[${io.CONTENT}]`));
		});
	}
	function b(e) {
		let t = document.createElement("ul");
		t.className = ao.LIST, t.setAttribute(io.LIST, ""), t.setAttribute("role", "menubar"), c.forEach((e) => {
			let n = document.createElement("li");
			if (n.className = ao.ITEM, n.setAttribute(io.ITEM, e.id), n.setAttribute("role", "none"), e.items && e.items.length > 0) {
				let t = x(e), r = S(e);
				n.appendChild(t), n.appendChild(r), w(e.id, n, t, r);
			} else if (e.href) {
				let t = C(e);
				n.appendChild(t), w(e.id, n, null, null);
			}
			t.appendChild(n);
		}), e.appendChild(t);
	}
	function x(e) {
		let t = document.createElement("button");
		t.className = ao.TRIGGER, t.setAttribute(io.TRIGGER, ""), t.setAttribute("type", "button"), t.setAttribute("role", "menuitem"), t.setAttribute("aria-haspopup", "true"), t.setAttribute("aria-expanded", "false"), t.id = `${f}-trigger-${e.id}`, e.disabled && (t.setAttribute("disabled", ""), t.setAttribute("aria-disabled", "true")), e.icon && (t.innerHTML = `<span class="${ao.ICON}" aria-hidden="true">${e.icon}</span>`);
		let n = document.createElement("span");
		n.textContent = e.label, t.appendChild(n);
		let r = document.createElement("span");
		return r.className = ao.CHEVRON, r.setAttribute("aria-hidden", "true"), r.innerHTML = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>", t.appendChild(r), t;
	}
	function S(e) {
		let t = document.createElement("div");
		if (t.className = ao.CONTENT, t.setAttribute(io.CONTENT, ""), t.setAttribute("role", "menu"), t.id = `${f}-content-${e.id}`, t.style.display = "none", e.content) t.innerHTML = e.content;
		else if (e.items) {
			let n = document.createElement("ul");
			n.setAttribute("role", "menu"), e.items.forEach((e) => {
				let t = document.createElement("li");
				t.setAttribute("role", "none");
				let r = C(e);
				t.appendChild(r), n.appendChild(t);
			}), t.appendChild(n);
		}
		return t;
	}
	function C(e) {
		let n = document.createElement("a");
		n.className = ao.LINK, n.setAttribute(io.LINK, ""), n.setAttribute("role", "menuitem"), n.href = e.href || "#", n.tabIndex = -1, e.active && (n.classList.add(ao.LINK_ACTIVE), n.setAttribute("aria-current", "page")), e.disabled && (n.setAttribute("aria-disabled", "true"), n.tabIndex = -1), e.icon && (n.innerHTML = `<span class="${ao.ICON}" aria-hidden="true">${e.icon}</span>`);
		let r = document.createElement("div");
		r.className = "atlas-navigation-menu-text";
		let i = document.createElement("span");
		if (i.className = "atlas-navigation-menu-label", i.textContent = e.label, r.appendChild(i), e.description) {
			let t = document.createElement("span");
			t.className = ao.DESCRIPTION, t.textContent = e.description, r.appendChild(t);
		}
		return n.appendChild(r), n.addEventListener("click", (n) => {
			if (e.disabled) {
				n.preventDefault();
				return;
			}
			e.onSelect?.(), t.onSelect?.(e), (!e.href || e.href === "#") && n.preventDefault(), A();
		}), n;
	}
	function w(e, t, n, i) {
		p.set(e, {
			itemEl: t,
			trigger: n,
			content: i,
			rovingFocus: null
		}), !(!n || !i) && (n.setAttribute("aria-controls", i.id), r === "click" ? _.push(H(n, "click", (t) => {
			t.preventDefault(), t.stopPropagation(), l === e ? k() : D(e);
		})) : (_.push(H(t, "mouseenter", () => {
			E(), u = setTimeout(() => {
				D(e);
			}, o);
		})), _.push(H(t, "mouseleave", () => {
			E(), d = setTimeout(() => {
				l === e && k();
			}, s);
		})), _.push(H(n, "click", (t) => {
			t.preventDefault(), l === e ? k() : D(e);
		}))), _.push(H(i, "keydown", (e) => {
			e.key === "Escape" && (e.preventDefault(), k(), n.focus());
		})));
	}
	function T() {
		let t = e.querySelector(`[${io.LIST}]`);
		t && (g = Sa(t, {
			itemSelector: `[${io.TRIGGER}]:not([disabled]), [${io.LINK}]:not([aria-disabled="true"])`,
			orientation: "horizontal",
			loop: !0
		}), _.push(H(e, "keydown", (e) => {
			e.key === "ArrowDown" && l && (e.preventDefault(), (p.get(l)?.content?.querySelector(`[${io.LINK}]:not([aria-disabled="true"])`))?.focus());
		})));
	}
	function E() {
		u &&= (clearTimeout(u), null), d &&= (clearTimeout(d), null);
	}
	function D(e) {
		let n = p.get(e);
		if (!n?.trigger || !n?.content) return;
		l && l !== e && O(l), l = e;
		let { trigger: i, content: a } = n;
		i.classList.add(ao.TRIGGER_OPEN), i.setAttribute("aria-expanded", "true"), a.style.display = "", a.classList.add(ao.CONTENT_OPEN), j(i, a), h = Ia(i, a, () => j(i, a)), n.rovingFocus = Sa(a, {
			itemSelector: `[${io.LINK}]:not([aria-disabled="true"])`,
			orientation: "vertical",
			loop: !0
		}), r === "click" && (m = La(a, {
			escapeKey: !0,
			clickOutside: !0,
			ignore: [n.itemEl],
			onDismiss: k
		})), t.onOpen?.(e);
	}
	function O(e) {
		let n = p.get(e);
		if (!n?.trigger || !n?.content) return;
		let { trigger: r, content: i, rovingFocus: a } = n;
		r.classList.remove(ao.TRIGGER_OPEN), r.setAttribute("aria-expanded", "false"), i.classList.remove(ao.CONTENT_OPEN), a?.destroy(), n.rovingFocus = null, setTimeout(() => {
			l !== e && (i.style.display = "none");
		}, W.fast), t.onClose?.(e);
	}
	function k() {
		if (!l) return;
		let e = l;
		l = null, E(), O(e), h?.(), h = null, m?.destroy(), m = null;
	}
	function A() {
		k();
	}
	function j(e, t) {
		let n = Pa(e, t, {
			placement: i,
			offset: a,
			flip: !0,
			shift: !0
		});
		t.style.position = "absolute", t.style.left = `${n.x}px`, t.style.top = `${n.y}px`;
	}
	function M() {
		E(), k(), g?.destroy(), _.forEach((e) => e()), p.clear(), e.classList.remove(ao.ROOT), e.removeAttribute(io.ROOT);
	}
	return v(), {
		getOpenItem: () => l,
		openItem: D,
		closeItem: k,
		closeAll: A,
		hasOpenItem: () => l !== null,
		getItems: () => [...c],
		setItems: (t) => {
			c = t, p.clear(), e.innerHTML = "", v();
		},
		destroy: M
	};
}
function so() {
	return {
		getOpenItem: () => null,
		openItem: () => {},
		closeItem: () => {},
		closeAll: () => {},
		hasOpenItem: () => !1,
		getItems: () => [],
		setItems: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-3NLMITNR.js
var co = {
	NAV: "data-atlas-pagination-nav",
	LIST: "data-atlas-pagination-list",
	ITEM: "data-atlas-pagination-item",
	PREV: "data-atlas-pagination-prev",
	NEXT: "data-atlas-pagination-next",
	FIRST: "data-atlas-pagination-first",
	LAST: "data-atlas-pagination-last",
	PAGE: "data-atlas-pagination-page",
	ELLIPSIS: "data-atlas-pagination-ellipsis"
}, lo = {
	ROOT: "atlas-pagination",
	NAV: "atlas-pagination-nav",
	LIST: "atlas-pagination-list",
	ITEM: "atlas-pagination-item",
	BUTTON: "atlas-pagination-button",
	BUTTON_NAV: "atlas-pagination-button--nav",
	BUTTON_PAGE: "atlas-pagination-button--page",
	BUTTON_ACTIVE: "atlas-pagination-button--active",
	BUTTON_DISABLED: "atlas-pagination-button--disabled",
	ELLIPSIS: "atlas-pagination-ellipsis"
}, uo = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"15 18 9 12 15 6\"></polyline></svg>", fo = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>", po = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"11 17 6 12 11 7\"></polyline><polyline points=\"18 17 13 12 18 7\"></polyline></svg>", mo = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"13 17 18 12 13 7\"></polyline><polyline points=\"6 17 11 12 6 7\"></polyline></svg>";
function ho(e, t = {}) {
	if (!V()) return go();
	let { page: n = 1, total: r = 1, siblings: i = 1, showEdges: a = !1, showPrevNext: o = !0 } = t, s = Math.max(1, Math.min(n, r)), c = Math.max(1, r), l = B("pagination"), u = null, d = null, f = [];
	function p() {
		e.classList.add(lo.ROOT), e.setAttribute("data-atlas-pagination", ""), e.id = l, u = document.createElement("nav"), u.className = lo.NAV, u.setAttribute(co.NAV, ""), u.setAttribute("aria-label", "Pagination"), d = document.createElement("ul"), d.className = lo.LIST, d.setAttribute(co.LIST, ""), u.appendChild(d), e.appendChild(u), h();
	}
	function m() {
		let e = [];
		if (c <= 0) return e;
		e.push(1);
		let t = Math.max(2, s - i), n = Math.min(c - 1, s + i);
		t > 2 && e.push("ellipsis");
		for (let r = t; r <= n; r++) r > 1 && r < c && e.push(r);
		return n < c - 1 && e.push("ellipsis"), c > 1 && e.push(c), e;
	}
	function h() {
		d && (d.innerHTML = "", a && g("first", po, "First page", s <= 1, S), o && g("prev", uo, "Previous page", s <= 1, x), m().forEach((e) => {
			e === "ellipsis" ? v() : _(e, e === s);
		}), o && g("next", fo, "Next page", s >= c, b), a && g("last", mo, "Last page", s >= c, C));
	}
	function g(e, t, n, r, i) {
		let a = document.createElement("li");
		a.className = lo.ITEM, a.setAttribute(co.ITEM, "");
		let o = document.createElement("button");
		o.className = `${lo.BUTTON} ${lo.BUTTON_NAV}`, r && o.classList.add(lo.BUTTON_DISABLED), o.type = "button", o.disabled = r, o.setAttribute("aria-label", n), o.setAttribute(`${co[e.toUpperCase()]}`, ""), o.innerHTML = t, r || o.addEventListener("click", i), a.appendChild(o), d?.appendChild(a);
	}
	function _(e, t) {
		let n = document.createElement("li");
		n.className = lo.ITEM, n.setAttribute(co.ITEM, "");
		let r = document.createElement("button");
		r.className = `${lo.BUTTON} ${lo.BUTTON_PAGE}`, t && r.classList.add(lo.BUTTON_ACTIVE), r.type = "button", r.textContent = String(e), r.setAttribute(co.PAGE, String(e)), r.setAttribute("aria-label", `Page ${e}`), t && r.setAttribute("aria-current", "page"), r.addEventListener("click", () => y(e)), n.appendChild(r), d?.appendChild(n);
	}
	function v() {
		let e = document.createElement("li");
		e.className = lo.ITEM, e.setAttribute(co.ITEM, "");
		let t = document.createElement("span");
		t.className = lo.ELLIPSIS, t.setAttribute(co.ELLIPSIS, ""), t.setAttribute("aria-hidden", "true"), t.textContent = "...", e.appendChild(t), d?.appendChild(e);
	}
	function y(e) {
		e < 1 || e > c || e === s || (s = e, h(), t.onChange?.(s));
	}
	function b() {
		s < c && y(s + 1);
	}
	function x() {
		s > 1 && y(s - 1);
	}
	function S() {
		y(1);
	}
	function C() {
		y(c);
	}
	function w(e) {
		y(Math.max(1, Math.min(e, c)));
	}
	function T(e) {
		c = Math.max(1, e), s > c && (s = c), h();
	}
	function E() {
		return s > 1;
	}
	function D() {
		return s < c;
	}
	function O() {
		h();
	}
	function k() {
		f.forEach((e) => e()), e.classList.remove(lo.ROOT), e.removeAttribute("data-atlas-pagination"), e.innerHTML = "";
	}
	return p(), {
		getPage: () => s,
		setPage: w,
		getTotal: () => c,
		setTotal: T,
		next: b,
		prev: x,
		first: S,
		last: C,
		canPrev: E,
		canNext: D,
		refresh: O,
		destroy: k
	};
}
function go() {
	return {
		getPage: () => 1,
		setPage: () => {},
		getTotal: () => 1,
		setTotal: () => {},
		next: () => {},
		prev: () => {},
		first: () => {},
		last: () => {},
		canPrev: () => !1,
		canNext: () => !1,
		refresh: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-H2HBAE5O.js
var _o = {
	GROUP: "data-atlas-resizable-group",
	PANEL: "data-atlas-resizable-panel",
	HANDLE: "data-atlas-resizable-handle"
}, vo = {
	ROOT: "atlas-resizable",
	GROUP: "atlas-resizable-group",
	PANEL: "atlas-resizable-panel",
	PANEL_COLLAPSED: "atlas-resizable-panel--collapsed",
	HANDLE: "atlas-resizable-handle",
	HANDLE_GRIP: "atlas-resizable-handle-grip",
	HANDLE_ACTIVE: "atlas-resizable-handle--active",
	HORIZONTAL: "atlas-resizable--horizontal",
	VERTICAL: "atlas-resizable--vertical",
	DRAGGING: "atlas-resizable--dragging"
};
function yo(e, t = {}) {
	if (!V()) return bo();
	let { direction: n = "horizontal", panels: r = [], keyboardStep: i = 5, showHandle: a = !0 } = t, o = [], s = [], c = [], l = /* @__PURE__ */ new Set(), u = [], d = !1, f = -1, p = 0, m = [], h = B("resizable"), g = [];
	function _() {
		e.classList.add(vo.ROOT, vo.GROUP), e.classList.add(n === "horizontal" ? vo.HORIZONTAL : vo.VERTICAL), e.setAttribute("data-atlas-resizable", ""), e.setAttribute(_o.GROUP, ""), e.setAttribute("role", "group"), e.id = h, v(), y(), T(), E();
	}
	function v() {
		o = Array.from(e.querySelectorAll(`[${_o.PANEL}]`)), o.length === 0 && (o = Array.from(e.children).filter((e) => e instanceof HTMLElement && !e.hasAttribute(_o.HANDLE)), o.forEach((e, t) => {
			e.setAttribute(_o.PANEL, String(t)), e.classList.add(vo.PANEL);
		}));
	}
	function y() {
		s.forEach((e) => e.remove()), s = [];
		for (let e = 0; e < o.length - 1; e++) {
			let t = document.createElement("div");
			if (t.className = vo.HANDLE, t.setAttribute(_o.HANDLE, String(e)), t.setAttribute("role", "separator"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-orientation", n === "horizontal" ? "vertical" : "horizontal"), t.setAttribute("aria-valuenow", "50"), t.setAttribute("aria-valuemin", "0"), t.setAttribute("aria-valuemax", "100"), t.setAttribute("aria-label", `Resize handle ${e + 1}`), a) {
				let e = document.createElement("div");
				e.className = vo.HANDLE_GRIP, t.appendChild(e);
			}
			o[e].after(t), s.push(t), b(t, e);
		}
	}
	function b(e, a) {
		let o = (e) => {
			e.preventDefault(), x(a, n === "horizontal" ? e.clientX : e.clientY);
		};
		e.addEventListener("mousedown", o), g.push(() => e.removeEventListener("mousedown", o));
		let s = (e) => {
			let t = e.touches[0];
			x(a, n === "horizontal" ? t.clientX : t.clientY);
		};
		e.addEventListener("touchstart", s, { passive: !0 }), g.push(() => e.removeEventListener("touchstart", s));
		let l = (e) => {
			let o = 0;
			n === "horizontal" ? e.key === "ArrowLeft" ? o = -i : e.key === "ArrowRight" && (o = i) : e.key === "ArrowUp" ? o = -i : e.key === "ArrowDown" && (o = i), e.shiftKey && (o *= 2), o !== 0 && (e.preventDefault(), w(a, o), t.onResize?.(c)), e.key === "Home" && (e.preventDefault(), r[a]?.collapsible && O(a)), e.key === "End" && (e.preventDefault(), k(a));
		};
		e.addEventListener("keydown", l), g.push(() => e.removeEventListener("keydown", l));
		let u = () => {
			P();
		};
		e.addEventListener("dblclick", u), g.push(() => e.removeEventListener("dblclick", u));
	}
	function x(r, i) {
		d = !0, f = r, p = i, m = [...c], e.classList.add(vo.DRAGGING), s[r].classList.add(vo.HANDLE_ACTIVE), document.body.style.cursor = n === "horizontal" ? "col-resize" : "row-resize", document.body.style.userSelect = "none", t.onResizeStart?.();
		let a = (e) => {
			d && S(n === "horizontal" ? e.clientX : e.clientY);
		}, o = (e) => {
			if (!d) return;
			let t = e.touches[0];
			S(n === "horizontal" ? t.clientX : t.clientY);
		}, l = () => {
			C(), document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", l), document.removeEventListener("touchmove", o), document.removeEventListener("touchend", l);
		};
		document.addEventListener("mousemove", a), document.addEventListener("mouseup", l), document.addEventListener("touchmove", o, { passive: !0 }), document.addEventListener("touchend", l);
	}
	function S(r) {
		if (!d || f < 0) return;
		let i = n === "horizontal" ? e.clientWidth : e.clientHeight, a = (r - p) / i * 100;
		w(f, a, m), t.onResize?.(c);
	}
	function C() {
		d && (d = !1, e.classList.remove(vo.DRAGGING), f >= 0 && s[f] && s[f].classList.remove(vo.HANDLE_ACTIVE), document.body.style.cursor = "", document.body.style.userSelect = "", f = -1, t.onResizeEnd?.(c));
	}
	function w(e, t, n) {
		let i = n ?? c, a = e, s = e + 1;
		if (a < 0 || s >= o.length) return;
		let u = r[a] ?? {}, d = r[s] ?? {}, f = u.minSize ?? 0, p = u.maxSize ?? 100, m = d.minSize ?? 0, h = d.maxSize ?? 100, g = i[a] + t, _ = i[s] - t;
		g < f && (g = f, _ = i[a] + i[s] - f), g > p && (g = p, _ = i[a] + i[s] - p), _ < m && (_ = m, g = i[a] + i[s] - m), _ > h && (_ = h, g = i[a] + i[s] - h), c[a] = g, c[s] = _;
		let v = u.collapsedSize ?? 0, y = d.collapsedSize ?? 0;
		u.collapsible && g <= v ? l.add(a) : l.delete(a), d.collapsible && _ <= y ? l.add(s) : l.delete(s), E(), D();
	}
	function T() {
		let e = o.length;
		if (e === 0) {
			c = [], u = [];
			return;
		}
		let t = 100 / e;
		c = o.map((e, n) => r[n]?.defaultSize ?? t);
		let n = c.reduce((e, t) => e + t, 0);
		if (n !== 100) {
			let e = 100 / n;
			c = c.map((t) => t * e);
		}
		u = [...c];
	}
	function E() {
		o.forEach((e, t) => {
			let i = c[t] ?? 0;
			r[t];
			let a = l.has(t);
			n === "horizontal" ? (e.style.width = `${i}%`, e.style.flexBasis = `${i}%`) : (e.style.height = `${i}%`, e.style.flexBasis = `${i}%`), e.style.flexGrow = "0", e.style.flexShrink = "0", e.classList.toggle(vo.PANEL_COLLAPSED, a), a ? e.style.overflow = "hidden" : e.style.overflow = "";
		});
	}
	function D() {
		s.forEach((e, t) => {
			let n = c[t] ?? 0;
			e.setAttribute("aria-valuenow", String(Math.round(n)));
		});
	}
	function O(e) {
		let n = r[e];
		if (!n?.collapsible || e < 0 || e >= o.length) return;
		let i = n.collapsedSize ?? 0, a = i - c[e];
		e > 0 ? c[e - 1] -= a : e < o.length - 1 && (c[e + 1] -= a), c[e] = i, l.add(e), E(), D(), t.onResize?.(c);
	}
	function k(e) {
		if (e < 0 || e >= o.length || !l.has(e)) return;
		let n = (r[e] ?? {}).defaultSize ?? u[e] ?? 100 / o.length, i = n - c[e];
		e > 0 && c[e - 1] > i ? c[e - 1] -= i : e < o.length - 1 && (c[e + 1] -= i), c[e] = n, l.delete(e), E(), D(), t.onResize?.(c);
	}
	function A(e) {
		l.has(e) ? k(e) : O(e);
	}
	function j(e) {
		return l.has(e);
	}
	function M() {
		return [...c];
	}
	function N(e) {
		if (e.length !== o.length) {
			console.warn("[Atlas Resizable] Size array length must match panel count");
			return;
		}
		c = [...e], l.clear(), o.forEach((e, t) => {
			let n = r[t] ?? {}, i = n.collapsedSize ?? 0;
			n.collapsible && c[t] <= i && l.add(t);
		}), E(), D(), t.onResize?.(c);
	}
	function P() {
		c = [...u], l.clear(), E(), D(), t.onResize?.(c);
	}
	function F() {
		v(), y(), T(), E();
	}
	function I() {
		g.forEach((e) => e()), s.forEach((e) => e.remove()), e.classList.remove(vo.ROOT, vo.GROUP, vo.HORIZONTAL, vo.VERTICAL, vo.DRAGGING), e.removeAttribute("data-atlas-resizable"), e.removeAttribute(_o.GROUP), e.removeAttribute("role"), o.forEach((e) => {
			e.classList.remove(vo.PANEL, vo.PANEL_COLLAPSED), e.removeAttribute(_o.PANEL), e.style.width = "", e.style.height = "", e.style.flexBasis = "", e.style.flexGrow = "", e.style.flexShrink = "", e.style.overflow = "";
		});
	}
	return _(), {
		getSizes: M,
		setSizes: N,
		getPanelCount: () => o.length,
		collapse: O,
		expand: k,
		toggle: A,
		isCollapsed: j,
		reset: P,
		refresh: F,
		destroy: I
	};
}
function bo() {
	return {
		getSizes: () => [],
		setSizes: () => {},
		getPanelCount: () => 0,
		collapse: () => {},
		expand: () => {},
		toggle: () => {},
		isCollapsed: () => !1,
		reset: () => {},
		refresh: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-CXYQOZ6F.js
var xo = {
	VIEWPORT: "data-atlas-scroll-viewport",
	CONTENT: "data-atlas-scroll-content",
	SCROLLBAR: "data-atlas-scrollbar",
	SCROLLBAR_THUMB: "data-atlas-scrollbar-thumb",
	CORNER: "data-atlas-scroll-corner"
}, J = {
	ROOT: "atlas-scroll-area",
	VIEWPORT: "atlas-scroll-area-viewport",
	CONTENT: "atlas-scroll-area-content",
	SCROLLBAR: "atlas-scrollbar",
	SCROLLBAR_VERTICAL: "atlas-scrollbar--vertical",
	SCROLLBAR_HORIZONTAL: "atlas-scrollbar--horizontal",
	SCROLLBAR_THUMB: "atlas-scrollbar-thumb",
	SCROLLBAR_VISIBLE: "atlas-scrollbar--visible",
	SCROLLBAR_DRAGGING: "atlas-scrollbar--dragging",
	CORNER: "atlas-scroll-area-corner",
	TYPE_AUTO: "atlas-scroll-area--type-auto",
	TYPE_ALWAYS: "atlas-scroll-area--type-always",
	TYPE_SCROLL: "atlas-scroll-area--type-scroll",
	TYPE_HOVER: "atlas-scroll-area--type-hover"
};
function So(e, t = {}) {
	if (!V()) return Co();
	let { orientation: n = "vertical", type: r = "auto", scrollbarSize: i = 10 } = t, a = B("scroll-area"), o = null, s = null, c = null, l = null, u = null, d = null, f = null, p = [], m = !1, h = !1, g = 0, _ = 0, v = 0, y = 0, b = null, x = !1;
	function S() {
		switch (e.classList.add(J.ROOT), e.classList.add(`${J.ROOT}--${n}`), e.classList.add(C(r)), e.setAttribute("data-atlas-scroll-area", ""), e.id = a, o = document.createElement("div"), o.className = J.VIEWPORT, o.setAttribute(xo.VIEWPORT, ""), n) {
			case "vertical":
				o.style.overflowX = "hidden", o.style.overflowY = "scroll";
				break;
			case "horizontal":
				o.style.overflowX = "scroll", o.style.overflowY = "hidden";
				break;
			case "both": o.style.overflow = "scroll";
		}
		for (o.style.scrollbarWidth = "none", o.style.msOverflowStyle = "none", s = document.createElement("div"), s.className = J.CONTENT, s.setAttribute(xo.CONTENT, ""); e.firstChild;) s.appendChild(e.firstChild);
		o.appendChild(s), e.appendChild(o), (n === "vertical" || n === "both") && w(), (n === "horizontal" || n === "both") && T(), n === "both" && E(), D(), O(), k(), A();
	}
	function C(e) {
		switch (e) {
			case "always": return J.TYPE_ALWAYS;
			case "scroll": return J.TYPE_SCROLL;
			case "hover": return J.TYPE_HOVER;
			default: return J.TYPE_AUTO;
		}
	}
	function w() {
		c = document.createElement("div"), c.className = `${J.SCROLLBAR} ${J.SCROLLBAR_VERTICAL}`, c.setAttribute(xo.SCROLLBAR, "vertical"), c.style.width = `${i}px`, l = document.createElement("div"), l.className = J.SCROLLBAR_THUMB, l.setAttribute(xo.SCROLLBAR_THUMB, "vertical"), c.appendChild(l), e.appendChild(c), c.addEventListener("mousedown", N), l.addEventListener("mousedown", F);
	}
	function T() {
		u = document.createElement("div"), u.className = `${J.SCROLLBAR} ${J.SCROLLBAR_HORIZONTAL}`, u.setAttribute(xo.SCROLLBAR, "horizontal"), u.style.height = `${i}px`, d = document.createElement("div"), d.className = J.SCROLLBAR_THUMB, d.setAttribute(xo.SCROLLBAR_THUMB, "horizontal"), u.appendChild(d), e.appendChild(u), u.addEventListener("mousedown", P), d.addEventListener("mousedown", I);
	}
	function E() {
		f = document.createElement("div"), f.className = J.CORNER, f.setAttribute(xo.CORNER, ""), f.style.width = `${i}px`, f.style.height = `${i}px`, e.appendChild(f);
	}
	function D() {
		o && p.push(H(o, "scroll", () => {
			A(), j(), t.onScroll?.(o?.scrollTop ?? 0, o?.scrollLeft ?? 0);
		}));
	}
	function O() {
		r === "hover" && (p.push(H(e, "mouseenter", () => {
			x = !0, j();
		})), p.push(H(e, "mouseleave", () => {
			x = !1, M();
		})));
	}
	function k() {
		if (!o) return;
		let e = new ResizeObserver(() => {
			A();
		});
		e.observe(o), s && e.observe(s), p.push(() => e.disconnect());
	}
	function A() {
		if (!o) return;
		let { scrollTop: e, scrollLeft: t, scrollHeight: n, scrollWidth: r, clientHeight: i, clientWidth: a } = o;
		if (l && c) {
			let t = c.clientHeight, r = Math.max(30, i / n * t), a = e / (n - i) * (t - r);
			l.style.height = `${r}px`, l.style.transform = `translateY(${a}px)`;
			let o = n > i;
			c.style.display = o ? "block" : "none";
		}
		if (d && u) {
			let e = u.clientWidth, n = Math.max(30, a / r * e), i = t / (r - a) * (e - n);
			d.style.width = `${n}px`, d.style.transform = `translateX(${i}px)`;
			let o = r > a;
			u.style.display = o ? "block" : "none";
		}
	}
	function j() {
		(r === "scroll" || r === "auto") && (c?.classList.add(J.SCROLLBAR_VISIBLE), u?.classList.add(J.SCROLLBAR_VISIBLE), b && clearTimeout(b), b = setTimeout(() => {
			!m && !h && !x && M();
		}, 1e3));
	}
	function M() {
		(r === "scroll" || r === "auto") && !m && !h && (c?.classList.remove(J.SCROLLBAR_VISIBLE), u?.classList.remove(J.SCROLLBAR_VISIBLE));
	}
	function N(e) {
		if (e.target === l || !o || !c) return;
		let t = c.getBoundingClientRect(), n = l?.getBoundingClientRect();
		if (!n) return;
		let r = e.clientY - t.top < n.top - t.top + n.height / 2 ? -1 : 1;
		o.scrollTop += r * o.clientHeight * .9;
	}
	function P(e) {
		if (e.target === d || !o || !u) return;
		let t = u.getBoundingClientRect(), n = d?.getBoundingClientRect();
		if (!n) return;
		let r = e.clientX - t.left < n.left - t.left + n.width / 2 ? -1 : 1;
		o.scrollLeft += r * o.clientWidth * .9;
	}
	function F(e) {
		if (e.preventDefault(), e.stopPropagation(), !o) return;
		m = !0, g = e.clientY, v = o.scrollTop, c?.classList.add(J.SCROLLBAR_DRAGGING), document.body.style.userSelect = "none", document.body.style.cursor = "grabbing";
		let t = (e) => {
			if (!o || !c) return;
			let t = e.clientY - g, n = c.clientHeight, r = l?.clientHeight ?? 0, i = o.scrollHeight - o.clientHeight, a = t / (n - r) * i;
			o.scrollTop = v + a;
		}, n = () => {
			m = !1, c?.classList.remove(J.SCROLLBAR_DRAGGING), document.body.style.userSelect = "", document.body.style.cursor = "", document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n), x || M();
		};
		document.addEventListener("mousemove", t), document.addEventListener("mouseup", n);
	}
	function I(e) {
		if (e.preventDefault(), e.stopPropagation(), !o) return;
		h = !0, _ = e.clientX, y = o.scrollLeft, u?.classList.add(J.SCROLLBAR_DRAGGING), document.body.style.userSelect = "none", document.body.style.cursor = "grabbing";
		let t = (e) => {
			if (!o || !u) return;
			let t = e.clientX - _, n = u.clientWidth, r = d?.clientWidth ?? 0, i = o.scrollWidth - o.clientWidth, a = t / (n - r) * i;
			o.scrollLeft = y + a;
		}, n = () => {
			h = !1, u?.classList.remove(J.SCROLLBAR_DRAGGING), document.body.style.userSelect = "", document.body.style.cursor = "", document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n), x || M();
		};
		document.addEventListener("mousemove", t), document.addEventListener("mouseup", n);
	}
	function ee(e) {
		o?.scrollTo(e);
	}
	function L(e) {
		o?.scrollBy(e);
	}
	function te(e, t) {
		e.scrollIntoView(t);
	}
	function ne() {
		A();
	}
	function re() {
		if (p.forEach((e) => e()), b && clearTimeout(b), e.classList.remove(J.ROOT, `${J.ROOT}--${n}`, J.TYPE_AUTO, J.TYPE_ALWAYS, J.TYPE_SCROLL, J.TYPE_HOVER), e.removeAttribute("data-atlas-scroll-area"), s && o) for (; s.firstChild;) e.appendChild(s.firstChild);
		o?.remove(), c?.remove(), u?.remove(), f?.remove();
	}
	return S(), {
		getViewport: () => o,
		scrollTo: ee,
		scrollBy: L,
		getScrollTop: () => o?.scrollTop ?? 0,
		setScrollTop: (e) => {
			o && (o.scrollTop = e);
		},
		getScrollLeft: () => o?.scrollLeft ?? 0,
		setScrollLeft: (e) => {
			o && (o.scrollLeft = e);
		},
		getScrollSize: () => ({
			width: o?.scrollWidth ?? 0,
			height: o?.scrollHeight ?? 0
		}),
		getViewportSize: () => ({
			width: o?.clientWidth ?? 0,
			height: o?.clientHeight ?? 0
		}),
		scrollIntoView: te,
		refresh: ne,
		destroy: re
	};
}
function Co() {
	return {
		getViewport: () => null,
		scrollTo: () => {},
		scrollBy: () => {},
		getScrollTop: () => 0,
		setScrollTop: () => {},
		getScrollLeft: () => 0,
		setScrollLeft: () => {},
		getScrollSize: () => ({
			width: 0,
			height: 0
		}),
		getViewportSize: () => ({
			width: 0,
			height: 0
		}),
		scrollIntoView: () => {},
		refresh: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-SQ3UGIKZ.js
function wo(e, t = {}) {
	if (!V()) return To();
	let { hover: n = "lift", tilt: r = !1, tiltMax: i = 10, shine: a = !1, liftDistance: o = 4, clickable: s = !0, onClick: c, onHoverChange: l } = t, u = !1, d = [], f = null, p = null, m = e.style.transform, h = e.style.transition, g = e.style.boxShadow;
	e.style.transition = `
    transform ${W.normal}ms ${G.spring},
    box-shadow ${W.normal}ms ${G.standard}
  `.replace(/\s+/g, " ").trim(), e.style.transformStyle = "preserve-3d", e.style.willChange = "transform", s && (e.style.cursor = "pointer"), a && (f = document.createElement("div"), f.className = "atlas-card-shine", f.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      background: linear-gradient(
        105deg,
        transparent 40%,
        rgba(255, 255, 255, 0.1) 45%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 55%,
        transparent 60%
      );
      background-size: 200% 200%;
      background-position: 100% 0%;
      opacity: 0;
      transition: opacity ${W.fast}ms ${G.standard};
      border-radius: inherit;
    `, window.getComputedStyle(e).position === "static" && (e.style.position = "relative"), e.appendChild(f));
	let _ = (e, t) => {
		let n = e.clientX - t.left, r = e.clientY - t.top, a = (n / t.width - .5) * 2, o = (r / t.height - .5) * 2;
		return {
			rotateX: -o * i,
			rotateY: a * i,
			percentX: a,
			percentY: o
		};
	}, v = (t) => {
		let i = "", a = "";
		switch (n) {
			case "lift":
				i = `translateY(-${o}px)`, a = `
          0 ${o}px ${o * 2}px rgba(0, 0, 0, 0.1),
          0 ${o / 2}px ${o}px rgba(0, 0, 0, 0.08)
        `;
				break;
			case "scale":
				i = "scale(1.02)", a = "0 10px 30px rgba(0, 0, 0, 0.12)";
				break;
			case "glow": a = "0 0 30px rgba(var(--atlas-primary-rgb, 59, 130, 246), 0.4)";
		}
		if (r && t) {
			let r = e.getBoundingClientRect(), { rotateX: a, rotateY: s, percentX: c } = _(t, r);
			if (i = n === "lift" ? `translateY(-${o}px) perspective(1000px) rotateX(${a}deg) rotateY(${s}deg)` : n === "scale" ? `scale(1.02) perspective(1000px) rotateX(${a}deg) rotateY(${s}deg)` : `perspective(1000px) rotateX(${a}deg) rotateY(${s}deg)`, f) {
				let e = (c + 1) * 50;
				f.style.backgroundPosition = `${e}% 0%`;
			}
		}
		e.style.transform = i, e.style.boxShadow = a;
	}, y = () => {
		e.style.transform = "", e.style.boxShadow = g || "", f && (f.style.opacity = "0");
	};
	return d.push(H(e, "mouseenter", () => {
		u = !0, l?.(!0), f && (f.style.opacity = "1"), r || v();
	}), H(e, "mousemove", (e) => {
		u && (p && cancelAnimationFrame(p), p = requestAnimationFrame(() => {
			v(e);
		}));
	}), H(e, "mouseleave", () => {
		u = !1, l?.(!1), p &&= (cancelAnimationFrame(p), null), y();
	}), H(e, "click", () => {
		s && (e.animate && e.animate([
			{ transform: e.style.transform },
			{ transform: `${e.style.transform || ""} scale(0.98)`.trim() },
			{ transform: e.style.transform }
		], {
			duration: 150,
			easing: G.bounce
		}), c?.());
	})), {
		get isHovered() {
			return u;
		},
		animateIn: (t = 0) => {
			e.style.opacity = "0", e.style.transform = "translateY(20px) scale(0.95)", setTimeout(() => {
				e.style.transition = `
        opacity ${W.normal}ms ${G.decelerate},
        transform ${W.normal}ms ${G.spring}
      `.replace(/\s+/g, " ").trim(), e.style.opacity = "1", e.style.transform = "", setTimeout(() => {
					e.style.transition = `
          transform ${W.normal}ms ${G.spring},
          box-shadow ${W.normal}ms ${G.standard}
        `.replace(/\s+/g, " ").trim();
				}, W.normal);
			}, t);
		},
		animateOut: () => new Promise((t) => {
			e.style.transition = `
        opacity ${W.fast}ms ${G.accelerate},
        transform ${W.fast}ms ${G.accelerate}
      `.replace(/\s+/g, " ").trim(), e.style.opacity = "0", e.style.transform = "translateY(-10px) scale(0.95)", setTimeout(t, W.fast);
		}),
		destroy: () => {
			p && cancelAnimationFrame(p), d.forEach((e) => e()), d = [], f && f.remove(), e.style.transform = m, e.style.transition = h, e.style.boxShadow = g;
		}
	};
}
function To() {
	return {
		get isHovered() {
			return !1;
		},
		animateIn: () => {},
		animateOut: () => Promise.resolve(),
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-IQSLKJJZ.js
function Eo(e = {}) {
	let { initialValues: t = {}, validate: n, onSubmit: r, onChange: i } = e, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
	for (let e in t) if (Object.prototype.hasOwnProperty.call(t, e)) {
		let n = e, r = t;
		a.set(n, {
			value: r[n],
			touched: !1,
			dirty: !1
		});
	}
	let s = () => {
		let e = f();
		i?.(e), o.forEach((t) => t(e));
	}, c = (e, t) => {
		let n = a.get(e) || {
			value: void 0,
			touched: !1,
			dirty: !1
		};
		a.set(e, {
			...n,
			value: t,
			dirty: !0
		}), s();
	}, l = (e) => {
		let t = a.get(e);
		t && (a.set(e, {
			...t,
			touched: !0
		}), s());
	}, u = (e, t) => {
		let n = a.get(e);
		n && (a.set(e, {
			...n,
			error: t
		}), s());
	}, d = (e) => a.get(e), f = () => {
		let e = {};
		return a.forEach((t, n) => {
			e[n] = t.value;
		}), e;
	}, p = () => {
		if (!n) return {};
		let e = n(f());
		return a.forEach((t, n) => {
			t.error = e[n];
		}), s(), e;
	};
	return {
		get fields() {
			return a;
		},
		setValue: c,
		setTouched: l,
		setError: u,
		getField: d,
		getValues: f,
		validateForm: p,
		handleSubmit: async () => {
			let e = p();
			Object.keys(e).length === 0 && await r?.(f());
		},
		reset: () => {
			a.clear();
			for (let e in t) if (Object.prototype.hasOwnProperty.call(t, e)) {
				let n = e, r = t;
				a.set(n, {
					value: r[n],
					touched: !1,
					dirty: !1
				});
			}
			s();
		},
		subscribe: (e) => (o.add(e), e(f()), () => {
			o.delete(e);
		}),
		destroy: () => {
			o.clear(), a.clear();
		}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-6MVIPYM2.js
function Do(e, t = {}) {
	if (!V()) return Oo();
	let { ripple: n = !0, hover: r = "breathing", haptic: i = !0, pressScale: a = .97, pressDuration: o = 150, successDuration: s = 1500, onPress: c, onLoadingChange: l, onStateChange: u } = t, d = !1, f = e.hasAttribute("disabled") || e.getAttribute("aria-disabled") === "true", p = !1, m = !1, h = "idle", g = null, _ = "", v = [], y = null, b = null, x = e.style.transition, S = e.style.transform, C = e.style.filter, w = e.style.boxShadow;
	e.style.transition = `
    transform ${o}ms ${G.bounce},
    filter ${o}ms ${G.standard},
    box-shadow ${W.fast}ms ${G.standard}
  `.replace(/\s+/g, " ").trim(), e.style.transformOrigin = "center center", e.style.position = "relative", e.style.overflow = "hidden";
	let T = (e = 10) => {
		i && "vibrate" in navigator && navigator.vibrate(e);
	}, E = (e) => {
		h !== e && (h = e, u?.(e));
	}, D = () => {
		if (!(f || d || r === "none")) switch (r) {
			case "glow":
				e.style.boxShadow = "0 0 20px rgba(var(--atlas-primary-rgb, 59, 130, 246), 0.5)", e.style.filter = "brightness(1.05)";
				break;
			case "lift":
				e.style.transform = "translateY(-2px)", e.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
				break;
			case "breathing": !b && e.animate && (b = e.animate([
				{
					transform: "scale(1)",
					filter: "brightness(1)"
				},
				{
					transform: "scale(1.02)",
					filter: "brightness(1.05)"
				},
				{
					transform: "scale(1)",
					filter: "brightness(1)"
				}
			], {
				duration: 2e3,
				iterations: Infinity,
				easing: "ease-in-out"
			}));
		}
	}, O = () => {
		r !== "none" && (b &&= (b.cancel(), null), e.style.boxShadow = w, p || (e.style.transform = S || "", e.style.filter = C || ""));
	}, k = (t) => {
		if (!n || f || d) return;
		let r = e.getBoundingClientRect(), i, a;
		if (t instanceof MouseEvent) i = t.clientX - r.left, a = t.clientY - r.top;
		else {
			let e = t.touches[0];
			i = e.clientX - r.left, a = e.clientY - r.top;
		}
		let o = Math.max(r.width, r.height) * 2, s = ua("span", {
			className: "atlas-button-ripple",
			styles: {
				position: "absolute",
				borderRadius: "50%",
				backgroundColor: "currentColor",
				opacity: "0.2",
				transform: "scale(0)",
				pointerEvents: "none",
				width: `${o}px`,
				height: `${o}px`,
				left: `${i - o / 2}px`,
				top: `${a - o / 2}px`,
				animation: `atlas-ripple ${W.normal}ms ${G.decelerate} forwards`
			}
		});
		s && (e.appendChild(s), setTimeout(() => s.remove(), W.normal));
	}, A = () => {
		f || d || p || (p = !0, b && b.pause(), e.style.transform = `scale(${a})`, e.style.filter = "brightness(0.95)", T());
	}, j = () => {
		p && (p = !1, e.style.transform = m && r === "lift" ? "translateY(-2px)" : "", e.style.filter = m && r === "glow" ? "brightness(1.05)" : "", b && m && b.play());
	}, M = (e) => {
		if (e === "spinner") return ua("span", {
			className: "atlas-button-spinner",
			attributes: { "aria-hidden": "true" },
			styles: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: "1em",
				height: "1em",
				border: "2px solid currentColor",
				borderTopColor: "transparent",
				borderRadius: "50%",
				animation: "atlas-spin 600ms linear infinite"
			}
		});
		if (e === "success") {
			let e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("width", "1em"), e.setAttribute("height", "1em"), e.setAttribute("fill", "none"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "3"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), e.setAttribute("aria-hidden", "true"), e.style.cssText = "display: inline-block; vertical-align: middle;";
			let t = document.createElementNS("http://www.w3.org/2000/svg", "path");
			return t.setAttribute("d", "M5 13l4 4L19 7"), t.style.cssText = `
        stroke-dasharray: 24;
        stroke-dashoffset: 24;
        animation: atlas-checkmark-draw 400ms ${G.decelerate} forwards;
      `, e.appendChild(t), e;
		}
		if (e === "error") {
			let e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("width", "1em"), e.setAttribute("height", "1em"), e.setAttribute("fill", "none"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "3"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("aria-hidden", "true"), e.style.cssText = "display: inline-block; vertical-align: middle;";
			let t = document.createElementNS("http://www.w3.org/2000/svg", "line");
			t.setAttribute("x1", "6"), t.setAttribute("y1", "6"), t.setAttribute("x2", "18"), t.setAttribute("y2", "18"), t.style.cssText = `
        stroke-dasharray: 17;
        stroke-dashoffset: 17;
        animation: atlas-x-draw 300ms ${G.decelerate} forwards;
      `;
			let n = document.createElementNS("http://www.w3.org/2000/svg", "line");
			return n.setAttribute("x1", "18"), n.setAttribute("y1", "6"), n.setAttribute("x2", "6"), n.setAttribute("y2", "18"), n.style.cssText = `
        stroke-dasharray: 17;
        stroke-dashoffset: 17;
        animation: atlas-x-draw 300ms ${G.decelerate} 100ms forwards;
      `, e.appendChild(t), e.appendChild(n), e;
		}
		return null;
	};
	return v.push(H(e, "mouseenter", () => {
		m = !0, D();
	}), H(e, "mouseleave", () => {
		m = !1, O(), p && j();
	}), H(e, "mousedown", (e) => {
		A(), k(e);
	}), H(e, "mouseup", () => {
		j();
	}), H(e, "touchstart", (e) => {
		A(), k(e);
	}, { passive: !0 }), H(e, "touchend", () => {
		j();
	}), H(e, "click", () => {
		f || d || c?.();
	}), H(e, "keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), A());
	}), H(e, "keyup", (e) => {
		(e.key === "Enter" || e.key === " ") && (j(), !f && !d && (c?.(), T()));
	})), {
		get isLoading() {
			return d;
		},
		get isDisabled() {
			return f;
		},
		get visualState() {
			return h;
		},
		setLoading: (t) => {
			d !== t && (d = t, y &&= (clearTimeout(y), null), t ? (E("loading"), _ = e.innerHTML, e.style.transition = `opacity ${W.fast}ms ${G.standard}`, e.style.opacity = "0.5", setTimeout(() => {
				g = M("spinner"), g && (e.innerHTML = "", e.appendChild(g)), e.style.opacity = "1";
			}, W.fast / 2), e.setAttribute("aria-busy", "true"), e.style.pointerEvents = "none") : (e.style.opacity = "0.5", setTimeout(() => {
				e.innerHTML = _, e.style.opacity = "1", g = null;
			}, W.fast / 2), e.removeAttribute("aria-busy"), e.style.pointerEvents = "", E("idle")), l?.(t));
		},
		setDisabled: (t) => {
			f = t, t ? (O(), e.setAttribute("aria-disabled", "true"), e.style.opacity = "0.5", e.style.cursor = "not-allowed") : (e.removeAttribute("aria-disabled"), e.style.opacity = "", e.style.cursor = "");
		},
		setSuccess: (t) => {
			y && clearTimeout(y), E("success"), d = !1, _ ||= e.innerHTML, T([
				10,
				50,
				10
			]), e.style.opacity = "0.5", setTimeout(() => {
				g = M("success"), g && (e.innerHTML = "", e.appendChild(g)), e.style.opacity = "1", e.animate && e.animate([
					{ transform: "scale(1)" },
					{ transform: "scale(1.05)" },
					{ transform: "scale(1)" }
				], {
					duration: 300,
					easing: G.bounce
				});
			}, W.fast / 2), e.removeAttribute("aria-busy"), e.style.pointerEvents = "", t && ca(t, "polite"), y = setTimeout(() => {
				e.style.opacity = "0.5", setTimeout(() => {
					e.innerHTML = _, e.style.opacity = "1", g = null, _ = "", E("idle");
				}, W.fast / 2);
			}, s);
		},
		setError: (t) => {
			y && clearTimeout(y), E("error"), d = !1, _ ||= e.innerHTML, T([
				50,
				100,
				50
			]), e.style.opacity = "0.5", setTimeout(() => {
				g = M("error"), g && (e.innerHTML = "", e.appendChild(g)), e.style.opacity = "1", e.animate && e.animate([
					{ transform: "translateX(0)" },
					{ transform: "translateX(-4px)" },
					{ transform: "translateX(4px)" },
					{ transform: "translateX(-4px)" },
					{ transform: "translateX(4px)" },
					{ transform: "translateX(0)" }
				], {
					duration: 400,
					easing: "ease-in-out"
				});
			}, W.fast / 2), e.removeAttribute("aria-busy"), e.style.pointerEvents = "", t && ca(t, "assertive"), y = setTimeout(() => {
				e.style.opacity = "0.5", setTimeout(() => {
					e.innerHTML = _, e.style.opacity = "1", g = null, _ = "", E("idle");
				}, W.fast / 2);
			}, s);
		},
		triggerPress: () => {
			f || d || (A(), T(), setTimeout(() => {
				j(), c?.();
			}, o));
		},
		destroy: () => {
			y && clearTimeout(y), b && b.cancel(), v.forEach((e) => e()), v = [], e.style.transition = x, e.style.transform = S, e.style.filter = C, e.style.boxShadow = w, _ && (e.innerHTML = _, e.removeAttribute("aria-busy"));
		}
	};
}
function Oo() {
	return {
		get isLoading() {
			return !1;
		},
		get isDisabled() {
			return !1;
		},
		get visualState() {
			return "idle";
		},
		setLoading: () => {},
		setDisabled: () => {},
		setSuccess: () => {},
		setError: () => {},
		triggerPress: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-YIJTCXVH.js
function ko(e, t = {}) {
	if (!V()) return Ao(e);
	let { backdrop: n = !0, closeOnBackdrop: r = !0, closeOnEscape: i = !0, trapFocus: a = !0, animation: o = "normal", backdropBlur: s = !0, ariaLabel: c, ariaLabelledBy: l, ariaDescribedBy: u, onOpen: d, onClose: f } = t, p = W[o], m = B("modal"), h = !1, g = null, _ = null, v = null, y = [], b = ra({
		labelledBy: l,
		describedBy: u
	});
	e.id = e.id || m;
	for (let [t, n] of Object.entries(b)) e.setAttribute(t, n);
	c && e.setAttribute("aria-label", c), e.setAttribute("aria-hidden", "true"), e.style.display = "none", a && (_ = Ra({
		container: e,
		initialFocus: "first",
		returnFocus: "previous",
		onEscape: i ? () => D() : void 0
	}));
	let x = () => n ? ua("div", {
		className: "atlas-modal-backdrop",
		attributes: {
			"data-atlas-modal-backdrop": "",
			"aria-hidden": "true"
		},
		styles: {
			position: "fixed",
			inset: "0",
			zIndex: String(_a.modal - 1),
			backgroundColor: "rgba(0, 0, 0, 0)",
			backdropFilter: s ? "blur(0px)" : "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			transition: `background-color ${p}ms ${G.standard}, backdrop-filter ${p}ms ${G.standard}`
		}
	}) : null, S = () => {
		g && requestAnimationFrame(() => {
			g && (g.style.backgroundColor = "rgba(0, 0, 0, 0.5)", s && (g.style.backdropFilter = "blur(4px)")), e.style.opacity = "1", e.style.transform = "scale(1)";
		});
	}, C = () => new Promise((t) => {
		g && (g.style.backgroundColor = "rgba(0, 0, 0, 0)", s && (g.style.backdropFilter = "blur(0px)")), e.style.opacity = "0", e.style.transform = "scale(0.95)", setTimeout(t, p);
	}), w = (e) => {
		r && e.target === g && D();
	}, T = (e) => {
		i && e.key === "Escape" && h && (e.preventDefault(), D());
	}, E = () => {
		h || (h = !0, v = fa(), n && (g = x(), g && (document.body.appendChild(g), r && y.push(H(g, "click", w)))), e.style.display = "", e.style.position = "fixed", e.style.zIndex = String(_a.modal), e.style.opacity = "0", e.style.transform = "scale(0.95)", e.style.transition = `opacity ${p}ms ${G.decelerate}, transform ${p}ms ${G.spring}`, e.setAttribute("aria-hidden", "false"), i && !a && y.push(H(document, "keydown", T)), S(), _?.activate(), ca("Dialog opened"), d?.());
	}, D = async () => {
		h && (h = !1, _?.deactivate(), await C(), e.style.display = "none", e.setAttribute("aria-hidden", "true"), g &&= (g.remove(), null), y.forEach((e) => e()), y = [], v?.(), v = null, ca("Dialog closed"), f?.());
	};
	return {
		get isOpen() {
			return h;
		},
		get element() {
			return e;
		},
		open: E,
		close: D,
		toggle: () => {
			h ? D() : E();
		},
		update: () => {
			_?.updateElements();
		},
		destroy: () => {
			h && (_?.deactivate(), e.style.display = "none", e.setAttribute("aria-hidden", "true"), g?.remove(), y.forEach((e) => e()), v?.()), e.removeAttribute("aria-modal"), e.removeAttribute("aria-hidden");
		}
	};
}
function Ao(e) {
	return {
		get isOpen() {
			return !1;
		},
		get element() {
			return e;
		},
		open: () => {},
		close: () => {},
		toggle: () => {},
		update: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-ZMDYGJAY.js
var jo = {
	top: "bottom center",
	bottom: "top center",
	left: "right center",
	right: "left center"
};
function Mo(e, t, n = {}) {
	if (!V()) return No(e, t, n.placement || "bottom");
	let { placement: r = "bottom", closeOnClickOutside: i = !0, closeOnSelect: a = !0, animation: o = "fast", offset: s = 4, onOpen: c, onClose: l, onSelect: u } = n, d = W[o], f = e.id || B("dropdown-trigger"), p = t.id || B("dropdown-menu"), m = !1, h = -1, g = [], _ = [];
	e.id = f, t.id = p;
	let v = () => {
		let t = aa({
			isOpen: m,
			menuId: p
		});
		for (let [n, r] of Object.entries(t)) e.setAttribute(n, r);
	}, y = oa({
		id: p,
		labelledBy: f
	});
	for (let [e, n] of Object.entries(y)) t.setAttribute(e, n);
	v(), t.style.position = "absolute", t.style.zIndex = String(_a.dropdown), t.style.opacity = "0", t.style.transform = "scale(0.95)", t.style.transformOrigin = jo[r], t.style.visibility = "hidden", t.style.pointerEvents = "none";
	let b = () => Array.from(t.querySelectorAll("[role=\"menuitem\"], [data-dropdown-item]")).filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true"), x = () => {
		g = b(), g.forEach((e) => {
			let t = sa({ disabled: !1 });
			for (let [n, r] of Object.entries(t)) e.hasAttribute(n) || e.setAttribute(n, r);
		});
	}, S = () => {
		let n = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = 0, o = 0;
		switch (r) {
			case "bottom":
				a = n.bottom + s, o = n.left + (n.width - i.width) / 2;
				break;
			case "top":
				a = n.top - i.height - s, o = n.left + (n.width - i.width) / 2;
				break;
			case "left":
				a = n.top + (n.height - i.height) / 2, o = n.left - i.width - s;
				break;
			case "right": a = n.top + (n.height - i.height) / 2, o = n.right + s;
		}
		o = Math.max(8, Math.min(o, window.innerWidth - i.width - 8)), a = Math.max(8, Math.min(a, window.innerHeight - i.height - 8)), t.style.top = `${a}px`, t.style.left = `${o}px`;
	}, C = (e) => {
		if (g.length === 0) return;
		e < 0 && (e = g.length - 1), e >= g.length && (e = 0), g.forEach((e) => e.classList.remove("atlas-dropdown-focused")), h = e;
		let t = g[h];
		t.classList.add("atlas-dropdown-focused"), t.focus();
	}, w = (e) => {
		let t = g.indexOf(e);
		u?.(e, t), a && N();
	}, T = () => {
		P();
	}, E = (e) => {
		switch (e.key) {
			case "Enter":
			case " ":
			case "ArrowDown":
				e.preventDefault(), m || (M(), setTimeout(() => C(0), 50));
				break;
			case "ArrowUp": e.preventDefault(), m || (M(), setTimeout(() => C(g.length - 1), 50));
		}
	}, D = (t) => {
		switch (t.key) {
			case "ArrowDown":
				t.preventDefault(), C(h + 1);
				break;
			case "ArrowUp":
				t.preventDefault(), C(h - 1);
				break;
			case "Home":
				t.preventDefault(), C(0);
				break;
			case "End":
				t.preventDefault(), C(g.length - 1);
				break;
			case "Enter":
			case " ":
				t.preventDefault(), h >= 0 && g[h] && w(g[h]);
				break;
			case "Escape":
				t.preventDefault(), N(), e.focus();
				break;
			case "Tab": N();
		}
	}, O = (e) => {
		let t = e.target.closest("[role=\"menuitem\"], [data-dropdown-item]");
		t && g.includes(t) && w(t);
	}, k = (n) => {
		i && !e.contains(n.target) && !t.contains(n.target) && N();
	}, A = () => {
		t.style.visibility = "visible", t.style.pointerEvents = "auto", t.style.transition = `opacity ${d}ms ${G.decelerate}, transform ${d}ms ${G.spring}`, requestAnimationFrame(() => {
			t.style.opacity = "1", t.style.transform = "scale(1)";
		});
	}, j = () => new Promise((e) => {
		t.style.transition = `opacity ${d}ms ${G.accelerate}, transform ${d}ms ${G.accelerate}`, t.style.opacity = "0", t.style.transform = "scale(0.95)", setTimeout(() => {
			t.style.visibility = "hidden", t.style.pointerEvents = "none", e();
		}, d);
	}), M = () => {
		m || (m = !0, x(), h = -1, v(), S(), _.push(H(document, "click", k), H(t, "keydown", D), H(t, "click", O)), A(), c?.());
	}, N = async () => {
		m && (m = !1, v(), g.forEach((e) => e.classList.remove("atlas-dropdown-focused")), h = -1, _.forEach((e) => e()), _ = [], await j(), l?.());
	}, P = () => {
		m ? N() : M();
	}, F = () => {
		m && (t.style.visibility = "hidden", t.style.pointerEvents = "none", _.forEach((e) => e())), e.removeAttribute("aria-haspopup"), e.removeAttribute("aria-expanded"), e.removeAttribute("aria-controls");
	}, I = H(e, "click", T), ee = H(e, "keydown", E), L = F;
	return {
		get isOpen() {
			return m;
		},
		get trigger() {
			return e;
		},
		get menu() {
			return t;
		},
		get placement() {
			return r;
		},
		get focusedIndex() {
			return h;
		},
		open: M,
		close: N,
		toggle: P,
		focusItem: C,
		getItems: () => [...g],
		destroy: () => {
			I(), ee(), L();
		}
	};
}
function No(e, t, n) {
	return {
		get isOpen() {
			return !1;
		},
		get trigger() {
			return e;
		},
		get menu() {
			return t;
		},
		get placement() {
			return n;
		},
		get focusedIndex() {
			return -1;
		},
		open: () => {},
		close: () => {},
		toggle: () => {},
		focusItem: () => {},
		getItems: () => [],
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-LX3S7IFA.js
function Po(e, t = {}) {
	if (!e || e.length === 0) throw Error("[Atlas Tabs] tabIds must be a non-empty array");
	let { defaultTab: n = e[0], onChange: r, orientation: i = "horizontal" } = t;
	if (!e.includes(n)) throw Error(`[Atlas Tabs] defaultTab "${n}" is not in tabIds`);
	let a = n, o = /* @__PURE__ */ new Set(), s = () => {
		o.forEach((e) => e(a));
	}, c = (t) => {
		if (!e.includes(t)) {
			console.warn(`[Atlas Tabs] Invalid tab ID: "${t}"`);
			return;
		}
		t !== a && (a = t, r?.(t), s());
	}, l = (e) => e === a;
	return {
		get activeTab() {
			return a;
		},
		get orientation() {
			return i;
		},
		setActiveTab: c,
		isActive: l,
		getTabProps: (e) => ({
			"aria-selected": l(e),
			"aria-controls": `panel-${e}`,
			tabIndex: l(e) ? 0 : -1,
			role: "tab",
			id: `tab-${e}`
		}),
		getPanelProps: (e) => ({
			hidden: !l(e),
			"aria-labelledby": `tab-${e}`,
			role: "tabpanel",
			id: `panel-${e}`
		}),
		getTabListProps: () => ({
			role: "tablist",
			"aria-orientation": i
		}),
		subscribe: (e) => (o.add(e), e(a), () => {
			o.delete(e);
		}),
		destroy: () => {
			o.clear();
		}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-7YF5Q2EM.js
function Fo(e, t = {}) {
	if (!e || e.length === 0) throw Error("[Atlas Accordion] panelIds must be a non-empty array");
	let { collapsible: n = !0, multiple: r = !1, defaultOpen: i = [], onChange: a } = t, o = i.filter((t) => !e.includes(t));
	if (o.length > 0) throw Error(`[Atlas Accordion] defaultOpen contains invalid panel IDs: ${o.join(", ")}`);
	let s = new Set(i), c = /* @__PURE__ */ new Set(), l = () => {
		a?.(new Set(s)), c.forEach((e) => e(new Set(s)));
	}, u = (t) => {
		if (!e.includes(t)) {
			console.warn(`[Atlas Accordion] Invalid panel ID: "${t}"`);
			return;
		}
		s.has(t) ? (n || s.size > 1) && (s.delete(t), l()) : (r || s.clear(), s.add(t), l());
	}, d = (t) => {
		if (!e.includes(t)) {
			console.warn(`[Atlas Accordion] Invalid panel ID: "${t}"`);
			return;
		}
		let n = s.has(t);
		r || s.clear(), s.add(t), (!n || !r) && l();
	}, f = (t) => {
		if (!e.includes(t)) {
			console.warn(`[Atlas Accordion] Invalid panel ID: "${t}"`);
			return;
		}
		s.has(t) && (n || s.size > 1) && (s.delete(t), l());
	}, p = (e) => s.has(e);
	return {
		getOpenPanels: () => new Set(s),
		toggle: u,
		open: d,
		close: f,
		isOpen: p,
		getButtonProps: (e) => ({
			"aria-expanded": p(e),
			"aria-controls": `panel-${e}`,
			id: `button-${e}`,
			role: "button",
			tabIndex: 0
		}),
		getPanelProps: (e) => ({
			id: `panel-${e}`,
			"aria-labelledby": `button-${e}`,
			role: "region",
			hidden: !p(e)
		}),
		subscribe: (e) => (c.add(e), e(new Set(s)), () => {
			c.delete(e);
		}),
		destroy: () => {
			c.clear(), s.clear();
		}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-MSX65MAU.js
function Io(e, t = {}) {
	let { delay: n = 500, placement: r = "top", trigger: i = "hover", onShow: a, onHide: o } = t, s = !1, c, l = () => {
		clearTimeout(c), c = window.setTimeout(() => {
			s = !0, e.setAttribute("data-tooltip-visible", "true"), e.setAttribute("data-tooltip-placement", r), a?.();
		}, n);
	}, u = () => {
		clearTimeout(c), s = !1, e.removeAttribute("data-tooltip-visible"), o?.();
	}, d = () => s ? u() : l(), f = () => l(), p = () => u(), m = () => l(), h = () => u(), g = () => d();
	return i === "hover" ? (e.addEventListener("mouseenter", f), e.addEventListener("mouseleave", p)) : i === "focus" ? (e.addEventListener("focus", m), e.addEventListener("blur", h)) : i === "click" && e.addEventListener("click", g), {
		get isVisible() {
			return s;
		},
		get placement() {
			return r;
		},
		show: l,
		hide: u,
		toggle: d,
		destroy: () => {
			clearTimeout(c), e.removeEventListener("mouseenter", f), e.removeEventListener("mouseleave", p), e.removeEventListener("focus", m), e.removeEventListener("blur", h), e.removeEventListener("click", g), e.removeAttribute("data-tooltip-visible"), e.removeAttribute("data-tooltip-placement");
		}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-JTEL6HS5.js
var Lo = {
	"top-left": {
		top: "16px",
		left: "16px",
		alignItems: "flex-start"
	},
	"top-center": {
		top: "16px",
		left: "50%",
		transform: "translateX(-50%)",
		alignItems: "center"
	},
	"top-right": {
		top: "16px",
		right: "16px",
		alignItems: "flex-end"
	},
	"bottom-left": {
		bottom: "16px",
		left: "16px",
		alignItems: "flex-start"
	},
	"bottom-center": {
		bottom: "16px",
		left: "50%",
		transform: "translateX(-50%)",
		alignItems: "center"
	},
	"bottom-right": {
		bottom: "16px",
		right: "16px",
		alignItems: "flex-end"
	}
}, Ro = {
	success: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n    <circle cx=\"10\" cy=\"10\" r=\"9\" stroke=\"currentColor\" stroke-width=\"2\"/>\n    <path class=\"atlas-toast-checkmark\" d=\"M6 10l3 3 5-6\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>\n  </svg>",
	error: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n    <circle cx=\"10\" cy=\"10\" r=\"9\" stroke=\"currentColor\" stroke-width=\"2\"/>\n    <path d=\"M7 7l6 6M13 7l-6 6\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n  </svg>",
	warning: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M10 2L18 17H2L10 2z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\" fill=\"none\"/>\n    <path d=\"M10 8v4M10 14v1\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n  </svg>",
	info: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n    <circle cx=\"10\" cy=\"10\" r=\"9\" stroke=\"currentColor\" stroke-width=\"2\"/>\n    <path d=\"M10 9v5M10 6v1\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n  </svg>",
	default: ""
}, zo = {
	success: {
		bg: "#ecfdf5",
		border: "#10b981",
		text: "#065f46"
	},
	error: {
		bg: "#fef2f2",
		border: "#ef4444",
		text: "#991b1b"
	},
	warning: {
		bg: "#fffbeb",
		border: "#f59e0b",
		text: "#92400e"
	},
	info: {
		bg: "#eff6ff",
		border: "#3b82f6",
		text: "#1e40af"
	},
	default: {
		bg: "#f9fafb",
		border: "#6b7280",
		text: "#1f2937"
	}
}, Bo = 0;
function Vo(e = {}) {
	if (!V()) return Ho();
	let { position: t = "bottom-right", maxVisible: n = 5, gap: r = 12, container: i = document.body } = e, a = /* @__PURE__ */ new Map(), o = null, s = () => o || (o = ua("div", {
		className: "atlas-toast-container",
		attributes: {
			"data-atlas-toast-container": "",
			"aria-live": "polite",
			"aria-atomic": "true"
		},
		styles: {
			position: "fixed",
			zIndex: String(_a.toast),
			display: "flex",
			flexDirection: t.startsWith("top") ? "column" : "column-reverse",
			gap: `${r}px`,
			pointerEvents: "none",
			...Lo[t]
		}
	}), o && i.appendChild(o), o), c = (e, r = {}) => {
		let { type: i = "default", duration: o = 4e3, dismissible: c = !0, action: u, pauseOnHover: d = !0, showProgress: f = o > 0, onDismiss: p } = r, m = `toast-${++Bo}`, h = zo[i], g = Ro[i], _ = s();
		if (!_) return {
			id: m,
			message: e,
			type: i,
			dismiss: () => {}
		};
		for (; a.size >= n;) {
			let e = a.keys().next().value;
			e && l(e);
		}
		let v = ua("div", {
			className: `atlas-toast atlas-toast-${i}`,
			attributes: {
				"data-atlas-toast": m,
				role: "alert"
			},
			styles: {
				display: "flex",
				alignItems: "center",
				gap: "12px",
				padding: "12px 16px",
				borderRadius: "8px",
				backgroundColor: h.bg,
				border: `1px solid ${h.border}`,
				color: h.text,
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
				pointerEvents: "auto",
				opacity: "0",
				transform: t.startsWith("top") ? "translateY(-100%)" : "translateY(100%)",
				transition: `opacity ${W.normal}ms ${G.decelerate}, transform ${W.normal}ms ${G.spring}`,
				maxWidth: "400px",
				position: "relative",
				overflow: "hidden"
			}
		});
		if (!v) return {
			id: m,
			message: e,
			type: i,
			dismiss: () => {}
		};
		let y = "";
		g && (y += `<span class="atlas-toast-icon" style="flex-shrink: 0; color: ${h.border};">${g}</span>`), y += `<span class="atlas-toast-message" style="flex: 1;">${e}</span>`, u && (y += `<button class="atlas-toast-action" style="
        background: transparent;
        border: none;
        color: ${h.border};
        font-weight: 600;
        cursor: pointer;
        padding: 4px 8px;
        margin: -4px;
        border-radius: 4px;
        transition: background ${W.fast}ms;
      " data-action>${u.label}</button>`), c && (y += `<button class="atlas-toast-dismiss" aria-label="Dismiss" style="
        background: transparent;
        border: none;
        color: currentColor;
        opacity: 0.5;
        cursor: pointer;
        padding: 4px;
        margin: -4px;
        display: flex;
        transition: opacity ${W.fast}ms;
      " data-dismiss>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>`), f && o > 0 && (y += `<div class="atlas-toast-progress" style="
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: ${h.border};
        opacity: 0.3;
        width: 100%;
        transform-origin: left;
        animation: atlas-toast-progress ${o}ms linear forwards;
      "></div>`), v.innerHTML = y;
		let b = null, x = o, S = Date.now(), C = [], w = () => {
			o <= 0 || (S = Date.now(), b = setTimeout(() => l(m), x));
		};
		d && C.push(H(v, "mouseenter", () => {
			b && (clearTimeout(b), b = null, x -= Date.now() - S);
			let e = v.querySelector(".atlas-toast-progress");
			e && (e.style.animationPlayState = "paused");
		}), H(v, "mouseleave", () => {
			if (o > 0 && x > 0) {
				w();
				let e = v.querySelector(".atlas-toast-progress");
				e && (e.style.animationPlayState = "running");
			}
		}));
		let T = v.querySelector("[data-dismiss]");
		T && C.push(H(T, "click", () => l(m)));
		let E = v.querySelector("[data-action]");
		return E && u && C.push(H(E, "click", (() => {
			u.onClick(), l(m);
		}))), a.set(m, {
			element: v,
			cleanup: () => {
				b && clearTimeout(b), C.forEach((e) => e()), p?.();
			}
		}), _.appendChild(v), requestAnimationFrame(() => {
			v.style.opacity = "1", v.style.transform = "translateY(0)";
		}), w(), ca(e, i === "error" ? "assertive" : "polite"), {
			id: m,
			message: e,
			type: i,
			dismiss: () => l(m)
		};
	}, l = (e) => {
		let n = a.get(e);
		if (!n) return;
		let { element: r, cleanup: i } = n;
		i(), r.style.opacity = "0", r.style.transform = t.startsWith("top") ? "translateY(-100%)" : "translateY(100%)", setTimeout(() => {
			r.remove(), a.delete(e), a.size === 0 && o && (o.remove(), o = null);
		}, W.normal);
	}, u = () => {
		for (let e of a.keys()) l(e);
	};
	return {
		show: c,
		success: (e, t) => c(e, {
			...t,
			type: "success"
		}),
		error: (e, t) => c(e, {
			...t,
			type: "error"
		}),
		warning: (e, t) => c(e, {
			...t,
			type: "warning"
		}),
		info: (e, t) => c(e, {
			...t,
			type: "info"
		}),
		dismiss: l,
		dismissAll: u,
		getToasts: () => Array.from(a.keys()).map((e) => ({
			id: e,
			message: "",
			type: "default",
			dismiss: () => l(e)
		})),
		destroy: () => {
			u(), o &&= (o.remove(), null);
		}
	};
}
function Ho() {
	let e = {
		id: "",
		message: "",
		type: "default",
		dismiss: () => {}
	};
	return {
		show: () => e,
		success: () => e,
		error: () => e,
		warning: () => e,
		info: () => e,
		dismiss: () => {},
		dismissAll: () => {},
		getToasts: () => [],
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/chunk-W77B4YAA.js
var Uo = {
	left: {
		open: "translateX(0)",
		closed: "translateX(-100%)"
	},
	right: {
		open: "translateX(0)",
		closed: "translateX(100%)"
	},
	top: {
		open: "translateY(0)",
		closed: "translateY(-100%)"
	},
	bottom: {
		open: "translateY(0)",
		closed: "translateY(100%)"
	}
}, Wo = {
	left: {
		top: "0",
		left: "0",
		bottom: "0",
		width: "auto",
		height: "100%"
	},
	right: {
		top: "0",
		right: "0",
		bottom: "0",
		width: "auto",
		height: "100%"
	},
	top: {
		top: "0",
		left: "0",
		right: "0",
		width: "100%",
		height: "auto"
	},
	bottom: {
		bottom: "0",
		left: "0",
		right: "0",
		width: "100%",
		height: "auto"
	}
};
function Go(e, t = {}) {
	if (!V()) return Ko(e, t.side || "right");
	let { side: n = "right", backdrop: r = !0, closeOnBackdrop: i = !0, closeOnEscape: a = !0, trapFocus: o = !0, animation: s = "normal", backdropBlur: c = !0, ariaLabel: l, ariaLabelledBy: u, onOpen: d, onClose: f } = t, p = W[s], m = B("drawer"), h = Uo[n], g = Wo[n], _ = !1, v = null, y = null, b = null, x = [], S = ia({
		labelledBy: u,
		side: n
	});
	e.id = e.id || m;
	for (let [t, n] of Object.entries(S)) e.setAttribute(t, n);
	l && e.setAttribute("aria-label", l), e.setAttribute("aria-hidden", "true"), e.style.position = "fixed", e.style.zIndex = String(_a.drawer), e.style.transform = h.closed, e.style.visibility = "hidden", Object.assign(e.style, g), o && (y = Ra({
		container: e,
		initialFocus: "first",
		returnFocus: "previous",
		onEscape: a ? () => k() : void 0
	}));
	let C = () => r ? ua("div", {
		className: "atlas-drawer-backdrop",
		attributes: {
			"data-atlas-drawer-backdrop": "",
			"data-side": n,
			"aria-hidden": "true"
		},
		styles: {
			position: "fixed",
			inset: "0",
			zIndex: String(_a.drawer - 1),
			backgroundColor: "rgba(0, 0, 0, 0)",
			backdropFilter: c ? "blur(0px)" : "none",
			transition: `background-color ${p}ms ${G.standard}, backdrop-filter ${p}ms ${G.standard}`
		}
	}) : null, w = () => {
		v && requestAnimationFrame(() => {
			v && (v.style.backgroundColor = "rgba(0, 0, 0, 0.5)", c && (v.style.backdropFilter = "blur(4px)"));
		}), e.style.transition = `transform ${p}ms ${G.spring}, visibility 0ms`, e.style.visibility = "visible", requestAnimationFrame(() => {
			e.style.transform = h.open;
		});
	}, T = () => new Promise((t) => {
		v && (v.style.backgroundColor = "rgba(0, 0, 0, 0)", c && (v.style.backdropFilter = "blur(0px)")), e.style.transition = `transform ${p}ms ${G.accelerate}, visibility 0ms ${p}ms`, e.style.transform = h.closed, setTimeout(() => {
			e.style.visibility = "hidden", t();
		}, p);
	}), E = (e) => {
		i && e.target === v && k();
	}, D = (e) => {
		a && e.key === "Escape" && _ && (e.preventDefault(), k());
	}, O = () => {
		_ || (_ = !0, b = fa(), r && (v = C(), v && (document.body.appendChild(v), i && x.push(H(v, "click", E)))), e.setAttribute("aria-hidden", "false"), a && !o && x.push(H(document, "keydown", D)), w(), setTimeout(() => {
			y?.activate();
		}, 50), ca(`${n} drawer opened`), d?.());
	}, k = async () => {
		_ && (_ = !1, y?.deactivate(), await T(), e.setAttribute("aria-hidden", "true"), v &&= (v.remove(), null), x.forEach((e) => e()), x = [], b?.(), b = null, ca("Drawer closed"), f?.());
	};
	return {
		get isOpen() {
			return _;
		},
		get element() {
			return e;
		},
		get side() {
			return n;
		},
		open: O,
		close: k,
		toggle: () => {
			_ ? k() : O();
		},
		update: () => {
			y?.updateElements();
		},
		destroy: () => {
			_ && (y?.deactivate(), e.style.visibility = "hidden", e.style.transform = h.closed, e.setAttribute("aria-hidden", "true"), v?.remove(), x.forEach((e) => e()), b?.()), e.removeAttribute("aria-modal"), e.removeAttribute("aria-hidden");
		}
	};
}
function Ko(e, t) {
	return {
		get isOpen() {
			return !1;
		},
		get element() {
			return e;
		},
		get side() {
			return t;
		},
		open: () => {},
		close: () => {},
		toggle: () => {},
		update: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-components/dist/index.js
var qo = /* @__PURE__ */ new WeakSet(), Jo = /* @__PURE__ */ new WeakMap();
function Yo(e) {
	return e !== null && e !== "false";
}
function Xo(e) {
	if (qo.has(e)) return;
	let t = e.dataset.atlas;
	if (!t) return;
	let n;
	switch (t) {
		case "button":
			n = Zo(e);
			break;
		case "tooltip":
			n = Qo(e);
			break;
		case "card":
			n = $o(e);
			break;
		case "input":
			n = es(e);
			break;
		case "grid": n = ts(e);
	}
	n && (qo.add(e), Jo.set(e, n));
}
function Zo(e) {
	let t = Do(e, {
		ripple: Yo(e.dataset.ripple ?? "true"),
		hover: e.dataset.hover || "breathing",
		haptic: Yo(e.dataset.haptic ?? "true"),
		pressScale: e.dataset.pressScale ? parseFloat(e.dataset.pressScale) : void 0
	}), n = new MutationObserver((n) => {
		for (let r of n) r.attributeName === "data-loading" && t.setLoading(Yo(e.dataset.loading ?? null)), (r.attributeName === "data-disabled" || r.attributeName === "disabled") && t.setDisabled(Yo(e.dataset.disabled ?? null) || e.hasAttribute("disabled"));
	});
	return n.observe(e, { attributes: !0 }), () => {
		n.disconnect(), t.destroy();
	};
}
function Qo(e) {
	let t = {
		content: e.dataset.content || e.getAttribute("title") || "",
		placement: e.dataset.placement || "top",
		delay: e.dataset.delay ? parseInt(e.dataset.delay, 10) : 500,
		trigger: e.dataset.trigger || "hover"
	};
	e.hasAttribute("title") && e.removeAttribute("title");
	let n = Io(e, t);
	return () => n.destroy();
}
function $o(e) {
	let t = wo(e, {
		hover: e.dataset.hover || "lift",
		tilt: Yo(e.dataset.tilt ?? null),
		tiltMax: e.dataset.tiltMax ? parseFloat(e.dataset.tiltMax) : 10,
		shine: Yo(e.dataset.shine ?? null),
		liftDistance: e.dataset.liftDistance ? parseFloat(e.dataset.liftDistance) : void 0,
		clickable: Yo(e.dataset.clickable ?? "true")
	});
	if (Yo(e.dataset.animate ?? null)) {
		let n = e.dataset.delay ? parseInt(e.dataset.delay, 10) : 0;
		t.animateIn(n);
	}
	return () => t.destroy();
}
function es(e) {
	let t = e, n = [], r = t.style.transition, i = t.style.boxShadow, a = t.style.borderColor;
	if (t.style.transition = `
    box-shadow ${W.fast}ms ${G.standard},
    border-color ${W.fast}ms ${G.standard},
    transform ${W.fast}ms ${G.standard}
  `.replace(/\s+/g, " ").trim(), Yo(t.dataset.focusGlow ?? "true")) {
		let e = t.dataset.glowColor || "rgba(59, 130, 246, 0.5)";
		n.push(H(t, "focus", () => {
			t.style.boxShadow = `0 0 0 3px ${e}`, t.style.borderColor = "rgba(59, 130, 246, 0.8)";
		})), n.push(H(t, "blur", () => {
			t.dataset.error || (t.style.boxShadow = i || "", t.style.borderColor = a || "");
		}));
	}
	let o = new MutationObserver((e) => {
		for (let n of e) n.attributeName === "data-error" && (Yo(t.dataset.error ?? null) ? (t.style.borderColor = "rgba(239, 68, 68, 0.8)", t.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.3)", t.animate && t.animate([
			{ transform: "translateX(0)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(4px)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(4px)" },
			{ transform: "translateX(0)" }
		], {
			duration: 400,
			easing: "ease-in-out"
		})) : (t.style.borderColor = a || "", t.style.boxShadow = i || "")), n.attributeName === "data-success" && Yo(t.dataset.success ?? null) && (t.style.borderColor = "rgba(34, 197, 94, 0.8)", t.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.3)", t.animate && t.animate([
			{ transform: "scale(1)" },
			{ transform: "scale(1.02)" },
			{ transform: "scale(1)" }
		], {
			duration: 200,
			easing: G.bounce
		}));
	});
	return o.observe(t, { attributes: !0 }), () => {
		o.disconnect(), n.forEach((e) => e()), t.style.transition = r, t.style.boxShadow = i, t.style.borderColor = a;
	};
}
function ts(e) {
	let t = e.dataset.stagger ? parseInt(e.dataset.stagger, 10) : 50, n = e.dataset.initialDelay ? parseInt(e.dataset.initialDelay, 10) : 0, r = Yo(e.dataset.animateOnScroll ?? null), i = Array.from(e.children);
	i.forEach((e) => {
		e.style.opacity = "0", e.style.transform = "translateY(20px)", e.style.transition = `
      opacity ${W.normal}ms ${G.decelerate},
      transform ${W.normal}ms ${G.spring}
    `.replace(/\s+/g, " ").trim();
	});
	let a = () => {
		i.forEach((e, r) => {
			setTimeout(() => {
				e.style.opacity = "1", e.style.transform = "translateY(0)";
			}, n + r * t);
		});
	}, o = null;
	return r ? (o = new IntersectionObserver((e) => {
		e.forEach((e) => {
			e.isIntersecting && (a(), o?.disconnect());
		});
	}, { threshold: .1 }), o.observe(e)) : requestAnimationFrame(() => {
		a();
	}), () => {
		o?.disconnect(), i.forEach((e) => {
			e.style.opacity = "", e.style.transform = "", e.style.transition = "";
		});
	};
}
function ns(e) {
	let t = Jo.get(e);
	t && (t(), Jo.delete(e), qo.delete(e));
}
function rs(e = document) {
	e.querySelectorAll("[data-atlas]").forEach(Xo);
}
var is = null;
function as() {
	!V() || is || (is = new MutationObserver((e) => {
		for (let t of e) {
			for (let e of t.addedNodes) e instanceof HTMLElement && (e.dataset.atlas && Xo(e), e.querySelectorAll("[data-atlas]").forEach(Xo));
			for (let e of t.removedNodes) e instanceof HTMLElement && (qo.has(e) && ns(e), e.querySelectorAll("[data-atlas]").forEach(ns));
		}
	}), is.observe(document.body, {
		childList: !0,
		subtree: !0
	}));
}
function os() {
	V() && (rs(), as());
}
function ss() {
	is &&= (is.disconnect(), null), document.querySelectorAll("[data-atlas]").forEach(ns);
}
V() && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", os) : os(), document.addEventListener("astro:page-load", os));
var cs = {
	IMAGE: "data-atlas-avatar-image",
	FALLBACK: "data-atlas-avatar-fallback",
	STATUS: "data-atlas-avatar-status"
}, ls = {
	ROOT: "atlas-avatar",
	IMAGE: "atlas-avatar-image",
	FALLBACK: "atlas-avatar-fallback",
	STATUS: "atlas-avatar-status",
	LOADING: "atlas-avatar--loading",
	ERROR: "atlas-avatar--error"
}, us = {
	xs: "atlas-avatar--xs",
	sm: "atlas-avatar--sm",
	default: "atlas-avatar--default",
	lg: "atlas-avatar--lg",
	xl: "atlas-avatar--xl"
}, ds = {
	circle: "atlas-avatar--circle",
	square: "atlas-avatar--square"
}, fs = {
	online: "atlas-avatar-status--online",
	offline: "atlas-avatar-status--offline",
	busy: "atlas-avatar-status--busy",
	away: "atlas-avatar-status--away"
};
function ps(e, t = {}) {
	if (!V()) return ms();
	let { src: n, alt: r = "", fallback: i = "", size: a = "default", shape: o = "circle", status: s = null, color: c } = t, l = n, u = i, d = a, f = o, p = s, m = !1, h = B("avatar"), g = null, _ = null, v = null;
	function y() {
		e.classList.add(ls.ROOT), e.setAttribute("data-atlas-avatar", ""), e.setAttribute("role", "img"), e.setAttribute("aria-label", r || u || "Avatar"), e.id = h, E(), D(), c && e.style.setProperty("--atlas-avatar-color", c), g = document.createElement("img"), g.className = ls.IMAGE, g.setAttribute(cs.IMAGE, ""), g.alt = r, g.addEventListener("load", x), g.addEventListener("error", S), _ = document.createElement("span"), _.className = ls.FALLBACK, _.setAttribute(cs.FALLBACK, ""), _.setAttribute("aria-hidden", "true"), p && T(), e.appendChild(g), e.appendChild(_), l ? b(l) : C();
	}
	function b(t) {
		g && (e.classList.add(ls.LOADING), e.classList.remove(ls.ERROR), m = !1, g.src = t);
	}
	function x() {
		m = !1, e.classList.remove(ls.LOADING, ls.ERROR), g && (g.style.display = ""), _ && (_.style.display = "none"), t.onLoad?.();
	}
	function S() {
		m = !0, e.classList.remove(ls.LOADING), e.classList.add(ls.ERROR), C(), t.onError?.();
	}
	function C() {
		g && (g.style.display = "none"), _ && (_.style.display = "", _.textContent = w(u));
	}
	function w(e) {
		if (!e) return "";
		let t = e.trim().split(/\s+/);
		return t.length === 1 ? t[0].slice(0, 2).toUpperCase() : (t[0][0] + t[t.length - 1][0]).toUpperCase();
	}
	function T() {
		v && v.remove(), p && (v = document.createElement("span"), v.className = `${ls.STATUS} ${fs[p] || ""}`, v.setAttribute(cs.STATUS, ""), v.setAttribute("aria-label", p), e.appendChild(v));
	}
	function E() {
		Object.values(us).forEach((t) => {
			e.classList.remove(t);
		}), e.classList.add(us[d]);
	}
	function D() {
		Object.values(ds).forEach((t) => {
			e.classList.remove(t);
		}), e.classList.add(ds[f]);
	}
	function O(e) {
		l = e, e ? b(e) : C();
	}
	function k(t) {
		u = t, _ && (!l || m) && (_.textContent = w(t)), e.setAttribute("aria-label", r || t || "Avatar");
	}
	function A(e) {
		d = e, E();
	}
	function j(e) {
		f = e, D();
	}
	function M(e) {
		p = e, T();
	}
	function N() {
		g?.removeEventListener("load", x), g?.removeEventListener("error", S), e.classList.remove(ls.ROOT, ls.LOADING, ls.ERROR, ...Object.values(us), ...Object.values(ds)), e.removeAttribute("data-atlas-avatar"), e.removeAttribute("role"), e.removeAttribute("aria-label");
	}
	return y(), {
		getSrc: () => l,
		setSrc: O,
		setFallback: k,
		setSize: A,
		getSize: () => d,
		setShape: j,
		getShape: () => f,
		setStatus: M,
		getStatus: () => p,
		destroy: N
	};
}
function ms() {
	return {
		getSrc: () => void 0,
		setSrc: () => {},
		setFallback: () => {},
		setSize: () => {},
		getSize: () => "default",
		setShape: () => {},
		getShape: () => "circle",
		setStatus: () => {},
		getStatus: () => null,
		destroy: () => {}
	};
}
function hs(e, t = {}) {
	if (!V()) return {
		getCount: () => 0,
		setMax: () => {},
		getMax: () => 0,
		destroy: () => {}
	};
	let { max: n = Infinity, size: r = "default", spacing: i = -8 } = t, a = n;
	function o() {
		e.classList.add("atlas-avatar-group"), e.setAttribute("data-atlas-avatar-group", ""), e.setAttribute("role", "group"), e.style.setProperty("--atlas-avatar-group-spacing", `${i}px`), s();
	}
	function s() {
		let t = e.querySelectorAll("[data-atlas-avatar]"), n = 0;
		t.forEach((e, t) => {
			let r = e;
			t < a ? (r.style.display = "", r.style.setProperty("--atlas-avatar-index", String(t))) : (r.style.display = "none", n++);
		});
		let i = e.querySelector(".atlas-avatar-overflow");
		n > 0 ? (i || (i = document.createElement("span"), i.className = `atlas-avatar-overflow ${us[r]}`, e.appendChild(i)), i.textContent = `+${n}`, i.style.display = "") : i && (i.style.display = "none");
	}
	function c(e) {
		a = e, s();
	}
	function l() {
		e.classList.remove("atlas-avatar-group"), e.removeAttribute("data-atlas-avatar-group"), e.removeAttribute("role");
	}
	return o(), {
		getCount: () => e.querySelectorAll("[data-atlas-avatar]").length,
		setMax: c,
		getMax: () => a,
		destroy: l
	};
}
var gs = {
	default: "atlas-badge-default",
	primary: "atlas-badge-primary",
	secondary: "atlas-badge-secondary",
	destructive: "atlas-badge-destructive",
	success: "atlas-badge-success",
	warning: "atlas-badge-warning",
	outline: "atlas-badge-outline"
}, _s = {
	sm: "atlas-badge-sm",
	md: "atlas-badge-md",
	lg: "atlas-badge-lg"
};
function vs(e, t = {}) {
	if (!V()) return ys();
	let { variant: n = "default", size: r = "md", pulse: i = !1, dot: a = !1, content: o = "", max: s } = t, c = n, l = f(o, s), u = i, d = null;
	e.classList.add("atlas-badge"), e.classList.add(gs[c]), e.classList.add(_s[r]), a && (e.classList.add("atlas-badge-dot"), e.setAttribute("aria-hidden", "true")), !a && l && (e.textContent = l), u && p();
	function f(e, t) {
		return typeof e == "number" && t !== void 0 && e > t ? `${t}+` : String(e);
	}
	function p() {
		d || !e.animate || (d = e.animate([
			{
				opacity: 1,
				transform: "scale(1)"
			},
			{
				opacity: .7,
				transform: "scale(1.1)"
			},
			{
				opacity: 1,
				transform: "scale(1)"
			}
		], {
			duration: 1500,
			iterations: Infinity,
			easing: "ease-in-out"
		}));
	}
	function m() {
		d &&= (d.cancel(), null);
	}
	return {
		get variant() {
			return c;
		},
		get content() {
			return l;
		},
		get isPulsing() {
			return u;
		},
		setContent: (t) => {
			l = f(t, s), a || (e.textContent = l);
		},
		setVariant: (t) => {
			e.classList.remove(gs[c]), c = t, e.classList.add(gs[c]);
		},
		setPulse: (e) => {
			u = e, e ? p() : m();
		},
		setVisible: (t) => {
			e.style.display = t ? "" : "none", e.setAttribute("aria-hidden", String(!t));
		},
		destroy: () => {
			m(), e.classList.remove("atlas-badge"), e.classList.remove(gs[c]), e.classList.remove(_s[r]), a && e.classList.remove("atlas-badge-dot");
		}
	};
}
function ys() {
	return {
		get variant() {
			return "default";
		},
		get content() {
			return "";
		},
		get isPulsing() {
			return !1;
		},
		setContent: () => {},
		setVariant: () => {},
		setPulse: () => {},
		setVisible: () => {},
		destroy: () => {}
	};
}
var bs = {
	ROOT: "data-atlas-bento",
	ITEM: "data-atlas-bento-item",
	ID: "data-bento-id",
	SIZE: "data-bento-size"
}, xs = {
	ROOT: "atlas-bento-grid",
	ITEM: "atlas-bento-item",
	ITEM_CONTENT: "atlas-bento-item-content",
	DRAGGING: "atlas-bento-dragging",
	DROP_TARGET: "atlas-bento-drop-target"
}, Ss = {
	"1x1": {
		col: 1,
		row: 1
	},
	"1x2": {
		col: 1,
		row: 2
	},
	"2x1": {
		col: 2,
		row: 1
	},
	"2x2": {
		col: 2,
		row: 2
	},
	"1x3": {
		col: 1,
		row: 3
	},
	"3x1": {
		col: 3,
		row: 1
	},
	"2x3": {
		col: 2,
		row: 3
	},
	"3x2": {
		col: 3,
		row: 2
	}
};
function Cs(e, t = {}) {
	if (!V()) return {
		getItems: () => [],
		addItem: () => {},
		removeItem: () => {},
		updateItem: () => {},
		reorder: () => {},
		refresh: () => {},
		destroy: () => {}
	};
	let { items: n = [], columns: r = 4, gap: i = 16, rowHeight: a = "auto", aspectRatio: o = 1, animateHover: s = !0, hoverScale: c = 1.02, animateEntrance: l = !0, staggerDelay: u = 50, draggable: d = !1, breakpoints: f, onItemClick: p, onReorder: m } = t, h = r, g = null;
	e.setAttribute(bs.ROOT, ""), e.classList.add(xs.ROOT);
	function _() {
		let t = a === "auto" ? `calc((100% - ${(h - 1) * i}px) / ${h} * ${o})` : `${a}px`;
		e.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${h}, 1fr);
      grid-auto-rows: ${t};
      gap: ${i}px;
    `;
	}
	function v(e) {
		let t = document.createElement("div");
		t.className = `${xs.ITEM} ${e.className || ""}`, t.setAttribute(bs.ITEM, ""), t.setAttribute(bs.ID, e.id);
		let n = e.size || "1x1", r = Ss[n], i = e.colSpan ?? r.col, a = e.rowSpan ?? r.row;
		t.setAttribute(bs.SIZE, n), t.style.gridColumn = `span ${Math.min(i, h)}`, t.style.gridRow = `span ${a}`;
		let o = document.createElement("div");
		return o.className = xs.ITEM_CONTENT, o.innerHTML = e.content || "", o.style.cssText = "\n      width: 100%;\n      height: 100%;\n      border-radius: 12px;\n      overflow: hidden;\n      background: var(--bento-bg, #f5f5f5);\n      transition: transform 0.3s ease, box-shadow 0.3s ease;\n    ", t.appendChild(o), s && (t.addEventListener("mouseenter", () => {
			o.style.transform = `scale(${c})`, o.style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)";
		}), t.addEventListener("mouseleave", () => {
			o.style.transform = "", o.style.boxShadow = "";
		})), p && (t.style.cursor = "pointer", t.addEventListener("click", () => p(e))), d && (t.draggable = !0, y(t, e)), t;
	}
	function y(e, t) {
		e.addEventListener("dragstart", (n) => {
			g = e, e.classList.add(xs.DRAGGING), n.dataTransfer?.setData("text/plain", t.id);
		}), e.addEventListener("dragend", () => {
			e.classList.remove(xs.DRAGGING), g = null, document.querySelectorAll(`.${xs.DROP_TARGET}`).forEach((e) => {
				e.classList.remove(xs.DROP_TARGET);
			});
		}), e.addEventListener("dragover", (t) => {
			t.preventDefault(), g && g !== e && e.classList.add(xs.DROP_TARGET);
		}), e.addEventListener("dragleave", () => {
			e.classList.remove(xs.DROP_TARGET);
		}), e.addEventListener("drop", (t) => {
			if (t.preventDefault(), e.classList.remove(xs.DROP_TARGET), !g || g === e) return;
			let r = g.getAttribute(bs.ID), i = e.getAttribute(bs.ID);
			if (!r || !i) return;
			let a = n.findIndex((e) => e.id === r), o = n.findIndex((e) => e.id === i);
			if (a !== -1 && o !== -1) {
				let [e] = n.splice(a, 1);
				n.splice(o, 0, e), b(), m?.(n);
			}
		});
	}
	function b() {
		e.innerHTML = "", _(), n.forEach((t, n) => {
			let r = v(t);
			l && (r.style.opacity = "0", r.style.transform = "translateY(20px)", r.style.transition = "opacity 0.5s ease, transform 0.5s ease", setTimeout(() => {
				r.style.opacity = "1", r.style.transform = "";
			}, n * u)), e.appendChild(r);
		});
	}
	function x() {
		if (!f) return;
		let t = window.innerWidth, n = r;
		f.lg && t >= 1024 ? n = f.lg : f.md && t >= 768 ? n = f.md : f.sm && (n = f.sm), n !== h && (h = n, _(), e.querySelectorAll(`[${bs.ITEM}]`).forEach((e) => {
			let t = e.getAttribute(bs.SIZE);
			if (t) {
				let n = Ss[t];
				e.style.gridColumn = `span ${Math.min(n.col, h)}`;
			}
		}));
	}
	return n.length === 0 && Array.from(e.children).forEach((e, t) => {
		let r = e;
		n.push({
			id: r.getAttribute(bs.ID) || `item-${t}`,
			size: r.getAttribute(bs.SIZE) || "1x1",
			content: r.innerHTML,
			className: r.className
		});
	}), b(), f && (window.addEventListener("resize", x), x()), {
		getItems() {
			return [...n];
		},
		addItem(t) {
			n.push(t);
			let r = v(t);
			l ? (r.style.opacity = "0", r.style.transform = "translateY(20px) scale(0.9)", r.style.transition = "opacity 0.4s ease, transform 0.4s ease", e.appendChild(r), requestAnimationFrame(() => {
				r.style.opacity = "1", r.style.transform = "";
			})) : e.appendChild(r);
		},
		removeItem(t) {
			let r = n.findIndex((e) => e.id === t);
			if (r === -1) return;
			n.splice(r, 1);
			let i = e.querySelector(`[${bs.ID}="${t}"]`);
			i && (i.style.opacity = "0", i.style.transform = "scale(0.9)", setTimeout(() => i.remove(), 300));
		},
		updateItem(t, r) {
			let i = n.findIndex((e) => e.id === t);
			if (i === -1) return;
			n[i] = {
				...n[i],
				...r
			};
			let a = e.querySelector(`[${bs.ID}="${t}"]`);
			if (a) {
				let e = a.querySelector(`.${xs.ITEM_CONTENT}`);
				if (e && r.content !== void 0 && (e.innerHTML = r.content), r.size || r.colSpan || r.rowSpan) {
					let e = r.size || n[i].size || "1x1", t = Ss[e], o = r.colSpan ?? n[i].colSpan ?? t.col, s = r.rowSpan ?? n[i].rowSpan ?? t.row;
					a.style.gridColumn = `span ${Math.min(o, h)}`, a.style.gridRow = `span ${s}`, a.setAttribute(bs.SIZE, e);
				}
			}
		},
		reorder(e) {
			let t = [];
			for (let r of e) {
				let e = n.find((e) => e.id === r);
				e && t.push(e);
			}
			n = t, b();
		},
		refresh() {
			b();
		},
		destroy() {
			f && window.removeEventListener("resize", x), e.innerHTML = "", e.removeAttribute(bs.ROOT), e.classList.remove(xs.ROOT), e.style.cssText = "";
		}
	};
}
var ws = class extends HTMLElement {
	constructor() {
		super(...arguments), this._grid = null;
	}
	static get observedAttributes() {
		return [
			"columns",
			"gap",
			"animate"
		];
	}
	connectedCallback() {
		requestAnimationFrame(() => {
			this._init();
		});
	}
	disconnectedCallback() {
		this._grid?.destroy(), this._grid = null;
	}
	_init() {
		this._grid = Cs(this, {
			columns: parseInt(this.getAttribute("columns") || "4", 10),
			gap: parseInt(this.getAttribute("gap") || "16", 10),
			animateHover: this.getAttribute("animate-hover") !== "false",
			animateEntrance: this.getAttribute("animate-entrance") !== "false",
			draggable: this.hasAttribute("draggable")
		});
	}
	refresh() {
		this._grid?.refresh();
	}
};
V() && !customElements.get("atlas-bento-grid") && customElements.define("atlas-bento-grid", ws);
var Ts = {
	LIST: "data-atlas-breadcrumb-list",
	ITEM: "data-atlas-breadcrumb-item",
	LINK: "data-atlas-breadcrumb-link",
	SEPARATOR: "data-atlas-breadcrumb-separator",
	CURRENT: "data-atlas-breadcrumb-current"
}, Es = {
	ROOT: "atlas-breadcrumb",
	LIST: "atlas-breadcrumb-list",
	ITEM: "atlas-breadcrumb-item",
	LINK: "atlas-breadcrumb-link",
	SEPARATOR: "atlas-breadcrumb-separator",
	CURRENT: "atlas-breadcrumb-current"
}, Ds = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>";
function Os(e, t = {}) {
	if (!V()) return ks();
	let { items: n = [], separator: r = Ds, ariaLabel: i = "Breadcrumb" } = t, a = n, o = r, s = B("breadcrumb"), c = null;
	function l() {
		e.classList.add(Es.ROOT), e.setAttribute("data-atlas-breadcrumb", ""), e.setAttribute("role", "navigation"), e.setAttribute("aria-label", i), e.id = s, c = e.querySelector(`[${Ts.LIST}]`), c || (c = document.createElement("ol"), c.className = Es.LIST, c.setAttribute(Ts.LIST, ""), e.appendChild(c)), a.length > 0 ? d() : u();
	}
	function u() {
		let t = e.querySelectorAll(`[${Ts.ITEM}]`);
		a = Array.from(t).map((e) => {
			let t = e.querySelector(`[${Ts.LINK}]`), n = e.hasAttribute(Ts.CURRENT) || t?.hasAttribute("aria-current");
			return {
				label: t?.textContent?.trim() ?? e.textContent?.trim() ?? "",
				href: t?.getAttribute("href") ?? void 0,
				current: n
			};
		});
	}
	function d() {
		c && (c.innerHTML = "", a.forEach((e, t) => {
			let n = f(e, t);
			if (c?.appendChild(n), t < a.length - 1) {
				let e = p();
				c?.appendChild(e);
			}
		}));
	}
	function f(e, n) {
		let r = document.createElement("li");
		if (r.className = Es.ITEM, r.setAttribute(Ts.ITEM, ""), e.current) {
			r.setAttribute(Ts.CURRENT, ""), r.classList.add(Es.CURRENT);
			let t = document.createElement("span");
			t.className = Es.LINK, t.setAttribute("role", "link"), t.setAttribute("aria-current", "page"), t.setAttribute("aria-disabled", "true"), t.textContent = e.label, r.appendChild(t);
		} else {
			let i = document.createElement("a");
			i.className = Es.LINK, i.setAttribute(Ts.LINK, ""), i.href = e.href ?? "#", i.textContent = e.label, i.addEventListener("click", (r) => {
				t.onNavigate && (r.preventDefault(), t.onNavigate(e, n));
			}), r.appendChild(i);
		}
		return r;
	}
	function p() {
		let e = document.createElement("li");
		return e.className = Es.SEPARATOR, e.setAttribute(Ts.SEPARATOR, ""), e.setAttribute("role", "presentation"), e.setAttribute("aria-hidden", "true"), e.innerHTML = o, e;
	}
	function m(e) {
		a = e, d();
	}
	function h(e) {
		o = e, d();
	}
	function g() {
		e.classList.remove(Es.ROOT), e.removeAttribute("data-atlas-breadcrumb"), e.removeAttribute("role"), e.removeAttribute("aria-label");
	}
	return l(), {
		getItems: () => [...a],
		setItems: m,
		setSeparator: h,
		destroy: g
	};
}
function ks() {
	return {
		getItems: () => [],
		setItems: () => {},
		setSeparator: () => {},
		destroy: () => {}
	};
}
var As = {
	VIEWPORT: "data-atlas-carousel-viewport",
	CONTAINER: "data-atlas-carousel-container",
	SLIDE: "data-atlas-carousel-slide",
	PREV: "data-atlas-carousel-prev",
	NEXT: "data-atlas-carousel-next",
	DOTS: "data-atlas-carousel-dots",
	DOT: "data-atlas-carousel-dot"
}, Y = {
	ROOT: "atlas-carousel",
	VIEWPORT: "atlas-carousel-viewport",
	CONTAINER: "atlas-carousel-container",
	SLIDE: "atlas-carousel-slide",
	SLIDE_ACTIVE: "atlas-carousel-slide--active",
	ARROW: "atlas-carousel-arrow",
	ARROW_PREV: "atlas-carousel-arrow--prev",
	ARROW_NEXT: "atlas-carousel-arrow--next",
	ARROW_DISABLED: "atlas-carousel-arrow--disabled",
	DOTS: "atlas-carousel-dots",
	DOT: "atlas-carousel-dot",
	DOT_ACTIVE: "atlas-carousel-dot--active",
	DRAGGING: "atlas-carousel--dragging",
	HORIZONTAL: "atlas-carousel--horizontal",
	VERTICAL: "atlas-carousel--vertical"
}, js = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"15 18 9 12 15 6\"></polyline></svg>", Ms = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>";
function Ns(e, t = {}) {
	if (!V()) return Ps();
	let { startIndex: n = 0, loop: r = !1, autoplay: i = 0, pauseOnHover: a = !0, draggable: o = !0, slidesToShow: s = 1, slidesToScroll: c = 1, orientation: l = "horizontal", gap: u = "0px", duration: d = W.normal, showArrows: f = !0, showDots: p = !0 } = t, m = n, h = i > 0, g = null, _ = !1, v = 0, y = 0, b = B("carousel"), x = null, S = null, C = [], w = null, T = null, E = null, D = [];
	function O() {
		e.classList.add(Y.ROOT), e.classList.add(l === "horizontal" ? Y.HORIZONTAL : Y.VERTICAL), e.setAttribute("data-atlas-carousel", ""), e.setAttribute("role", "region"), e.setAttribute("aria-roledescription", "carousel"), e.setAttribute("aria-label", "Image carousel"), e.id = b, x = e.querySelector(`[${As.VIEWPORT}]`), x || (x = document.createElement("div"), x.className = Y.VIEWPORT, x.setAttribute(As.VIEWPORT, ""), Array.from(e.children).forEach((e) => x?.appendChild(e)), e.appendChild(x)), S = x.querySelector(`[${As.CONTAINER}]`), S || (S = document.createElement("div"), S.className = Y.CONTAINER, S.setAttribute(As.CONTAINER, ""), Array.from(x.children).forEach((e) => S?.appendChild(e)), x.appendChild(S)), k(), S.style.gap = u, f && A(), p && j(), o && M(), N(), a && i > 0 && (D.push(H(e, "mouseenter", () => re())), D.push(H(e, "mouseleave", () => {
			h && ne();
		}))), F(m, !1), i > 0 && ne();
	}
	function k() {
		C = Array.from(S?.querySelectorAll(`[${As.SLIDE}]`) ?? []), C.length === 0 && S && (C = Array.from(S.children), C.forEach((e) => {
			e.classList.add(Y.SLIDE), e.setAttribute(As.SLIDE, "");
		})), C.forEach((e, t) => {
			e.setAttribute("role", "group"), e.setAttribute("aria-roledescription", "slide"), e.setAttribute("aria-label", `Slide ${t + 1} of ${C.length}`);
			let n = `calc((100% - ${u} * ${s - 1}) / ${s})`;
			e.style.flex = `0 0 ${n}`, e.style.minWidth = n;
		}), p && E && j();
	}
	function A() {
		w = document.createElement("button"), w.className = `${Y.ARROW} ${Y.ARROW_PREV}`, w.setAttribute(As.PREV, ""), w.setAttribute("aria-label", "Previous slide"), w.type = "button", w.innerHTML = js, w.addEventListener("click", ee), e.appendChild(w), T = document.createElement("button"), T.className = `${Y.ARROW} ${Y.ARROW_NEXT}`, T.setAttribute(As.NEXT, ""), T.setAttribute("aria-label", "Next slide"), T.type = "button", T.innerHTML = Ms, T.addEventListener("click", I), e.appendChild(T);
	}
	function j() {
		E && E.remove();
		let t = Math.ceil((C.length - s + 1) / c);
		if (!(t <= 1)) {
			E = document.createElement("div"), E.className = Y.DOTS, E.setAttribute(As.DOTS, ""), E.setAttribute("role", "tablist"), E.setAttribute("aria-label", "Slide navigation");
			for (let e = 0; e < t; e++) {
				let t = document.createElement("button");
				t.className = `${Y.DOT} ${e === Math.floor(m / c) ? Y.DOT_ACTIVE : ""}`, t.setAttribute(As.DOT, ""), t.setAttribute("role", "tab"), t.setAttribute("aria-label", `Go to slide ${e + 1}`), t.setAttribute("aria-selected", e === Math.floor(m / c) ? "true" : "false"), t.type = "button", t.addEventListener("click", () => F(e * c)), E.appendChild(t);
			}
			e.appendChild(E);
		}
	}
	function M() {
		if (!S) return;
		let t = l === "horizontal";
		function n(n) {
			n.button === 0 && (_ = !0, v = t ? n.clientX : n.clientY, y = 0, e.classList.add(Y.DRAGGING), S && (S.style.transition = "none"), S?.setPointerCapture(n.pointerId));
		}
		function r(e) {
			if (!_) return;
			y = (t ? e.clientX : e.clientY) - v;
			let n = P(m), r = t ? `translateX(${n + y}px)` : `translateY(${n + y}px)`;
			S && (S.style.transform = r);
		}
		function i(t) {
			if (!_) return;
			_ = !1, e.classList.remove(Y.DRAGGING), S && (S.style.transition = "");
			let n = (x?.clientWidth ?? 0) / 4;
			Math.abs(y) > n ? y > 0 ? ee() : I() : F(m), S?.releasePointerCapture(t.pointerId);
		}
		S.addEventListener("pointerdown", n), S.addEventListener("pointermove", r), S.addEventListener("pointerup", i), S.addEventListener("pointercancel", i), D.push(() => {
			S?.removeEventListener("pointerdown", n), S?.removeEventListener("pointermove", r), S?.removeEventListener("pointerup", i), S?.removeEventListener("pointercancel", i);
		});
	}
	function N() {
		function t(e) {
			switch (e.key) {
				case "ArrowLeft":
				case "ArrowUp":
					e.preventDefault(), ee();
					break;
				case "ArrowRight":
				case "ArrowDown": e.preventDefault(), I();
			}
		}
		e.setAttribute("tabindex", "0"), D.push(H(e, "keydown", t));
	}
	function P(e) {
		return !x || C.length === 0 ? 0 : -(e * (C[0].offsetWidth + (parseFloat(u) || 0)));
	}
	function F(e, n = !0) {
		let i = Math.max(0, C.length - s);
		if (r ? e < 0 ? e = i : e > i && (e = 0) : e = Math.max(0, Math.min(e, i)), m = e, S) {
			let e = P(m), t = l === "horizontal";
			S.style.transition = n ? `transform ${d}ms ${G.standard}` : "none", S.style.transform = t ? `translateX(${e}px)` : `translateY(${e}px)`;
		}
		C.forEach((e, t) => {
			let n = t >= m && t < m + s;
			e.classList.toggle(Y.SLIDE_ACTIVE, n), e.setAttribute("aria-hidden", n ? "false" : "true");
		}), L(), te(), n && t.onChange?.(m);
	}
	function I() {
		F(m + c);
	}
	function ee() {
		F(m - c);
	}
	function L() {
		if (!r) {
			let e = Math.max(0, C.length - s);
			w?.classList.toggle(Y.ARROW_DISABLED, m === 0), T?.classList.toggle(Y.ARROW_DISABLED, m >= e);
		}
	}
	function te() {
		if (!E) return;
		let e = E.querySelectorAll(`[${As.DOT}]`), t = Math.floor(m / c);
		e.forEach((e, n) => {
			e.classList.toggle(Y.DOT_ACTIVE, n === t), e.setAttribute("aria-selected", n === t ? "true" : "false");
		});
	}
	function ne() {
		g ||= setInterval(() => {
			I();
		}, i);
	}
	function re() {
		g &&= (clearInterval(g), null);
	}
	function R() {
		h = !0, ne();
	}
	function ie() {
		h = !1, re();
	}
	function ae() {
		k(), F(Math.min(m, C.length - s), !1);
	}
	function oe() {
		re(), D.forEach((e) => e()), e.classList.remove(Y.ROOT, Y.HORIZONTAL, Y.VERTICAL, Y.DRAGGING), e.removeAttribute("data-atlas-carousel"), e.removeAttribute("role"), e.removeAttribute("aria-roledescription"), e.removeAttribute("aria-label"), e.removeAttribute("tabindex");
	}
	return O(), {
		getIndex: () => m,
		goTo: F,
		next: I,
		prev: ee,
		getCount: () => C.length,
		play: R,
		pause: ie,
		isPlaying: () => h && g !== null,
		refresh: ae,
		destroy: oe
	};
}
function Ps() {
	return {
		getIndex: () => 0,
		goTo: () => {},
		next: () => {},
		prev: () => {},
		getCount: () => 0,
		play: () => {},
		pause: () => {},
		isPlaying: () => !1,
		refresh: () => {},
		destroy: () => {}
	};
}
function Fs(e, t = {}) {
	if (!V()) return Is();
	let { checked: n = !1, indeterminate: r = !1, disabled: i = !1, name: a, value: o, onChange: s } = t, c = n, l = r, u = i, d = [];
	e.classList.add("atlas-checkbox"), e.setAttribute("role", "checkbox"), e.setAttribute("tabindex", u ? "-1" : "0"), a && e.setAttribute("data-name", a), o && e.setAttribute("data-value", o);
	function f() {
		l ? (e.setAttribute("aria-checked", "mixed"), e.classList.add("atlas-checkbox-indeterminate"), e.classList.remove("atlas-checkbox-checked")) : c ? (e.setAttribute("aria-checked", "true"), e.classList.add("atlas-checkbox-checked"), e.classList.remove("atlas-checkbox-indeterminate")) : (e.setAttribute("aria-checked", "false"), e.classList.remove("atlas-checkbox-checked", "atlas-checkbox-indeterminate")), u ? (e.setAttribute("aria-disabled", "true"), e.setAttribute("tabindex", "-1"), e.classList.add("atlas-checkbox-disabled")) : (e.removeAttribute("aria-disabled"), e.setAttribute("tabindex", "0"), e.classList.remove("atlas-checkbox-disabled"));
	}
	function p() {
		e.animate && e.animate([
			{ transform: "scale(1)" },
			{ transform: "scale(0.9)" },
			{ transform: "scale(1.05)" },
			{ transform: "scale(1)" }
		], {
			duration: W.fast,
			easing: G.bounce
		});
	}
	function m() {
		u || (l ? (l = !1, c = !0) : c = !c, f(), p(), s?.(c));
	}
	return d.push(H(e, "click", m), wa(e, m)), f(), {
		get isChecked() {
			return c;
		},
		get isIndeterminate() {
			return l;
		},
		get isDisabled() {
			return u;
		},
		setChecked: (e) => {
			c !== e && (c = e, l = !1, f(), p(), s?.(c));
		},
		toggle: () => {
			m();
		},
		setIndeterminate: (e) => {
			l = e, f();
		},
		setDisabled: (e) => {
			u = e, f();
		},
		focus: () => {
			e.focus();
		},
		destroy: () => {
			d.forEach((e) => e()), e.classList.remove("atlas-checkbox", "atlas-checkbox-checked", "atlas-checkbox-indeterminate", "atlas-checkbox-disabled"), e.removeAttribute("role"), e.removeAttribute("tabindex"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled");
		}
	};
}
function Is() {
	return {
		get isChecked() {
			return !1;
		},
		get isIndeterminate() {
			return !1;
		},
		get isDisabled() {
			return !1;
		},
		setChecked: () => {},
		toggle: () => {},
		setIndeterminate: () => {},
		setDisabled: () => {},
		focus: () => {},
		destroy: () => {}
	};
}
var X = {
	ROOT: "data-atlas-combobox",
	INPUT: "data-atlas-combobox-input",
	CONTENT: "data-atlas-combobox-content",
	OPTION: "data-atlas-combobox-option",
	VALUE: "data-value",
	SELECTED: "data-selected",
	DISABLED: "data-disabled",
	HIGHLIGHTED: "data-highlighted",
	LOADING: "data-loading",
	EMPTY: "data-empty",
	CREATE: "data-create"
}, Ls = {
	ROOT: "atlas-combobox",
	INPUT_WRAPPER: "atlas-combobox-input-wrapper",
	INPUT: "atlas-combobox-input",
	CLEAR: "atlas-combobox-clear",
	LOADING: "atlas-combobox-loading",
	CONTENT: "atlas-combobox-content",
	OPTIONS: "atlas-combobox-options",
	OPTION: "atlas-combobox-option",
	OPTION_LABEL: "atlas-combobox-option-label",
	HIGHLIGHT: "atlas-combobox-highlight",
	EMPTY: "atlas-combobox-empty",
	CREATE: "atlas-combobox-create"
};
function Rs(e, t) {
	return e.label.toLowerCase().includes(t.toLowerCase());
}
function zs(e, t) {
	if (!t) return e;
	let n = RegExp(`(${Bs(t)})`, "gi");
	return e.replace(n, `<mark class="${Ls.HIGHLIGHT}">$1</mark>`);
}
function Bs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Vs(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
function Hs(e, t) {
	if (!V()) return {
		getValue: () => "",
		getSelected: () => null,
		setValue: () => {},
		setInputValue: () => {},
		open: () => {},
		close: () => {},
		isOpen: () => !1,
		focus: () => {},
		setOptions: () => {},
		clear: () => {},
		setDisabled: () => {},
		destroy: () => {}
	};
	let n = t.options || [], r = [], i = t.value || "", a = null, o = "", s = !1, c = !1, l = -1, u = t.disabled ?? !1, { placeholder: d = "", minChars: f = 0, debounce: p = 150, showLoading: m = !0, allowCreate: h = !1, createLabel: g = (e) => `Create "${e}"`, placement: _ = "bottom-start", maxOptions: v = 10, emptyMessage: y = "No results found", loadingMessage: b = "Loading...", filterFn: x = Rs, renderOption: S, highlightMatches: C = !0, onSearch: w, onChange: T, onCreate: E, onFocus: D, onBlur: O } = t, k = B("combobox"), A = `${k}-input`, j = `${k}-listbox`, M = null, N = null, P = null, F = null, I = null, ee = null, L = null;
	i && (a = n.find((e) => e.value === i) || null, o = a?.label || i);
	function te() {
		e.innerHTML = "", e.setAttribute(X.ROOT, ""), e.classList.add(Ls.ROOT);
		let t = document.createElement("div");
		t.className = Ls.INPUT_WRAPPER, M = document.createElement("input"), M.type = "text", M.id = A, M.className = Ls.INPUT, M.placeholder = d, M.value = o, M.setAttribute(X.INPUT, ""), M.setAttribute("role", "combobox"), M.setAttribute("aria-autocomplete", "list"), M.setAttribute("aria-expanded", "false"), M.setAttribute("aria-controls", j), M.setAttribute("autocomplete", "off"), u && (M.disabled = !0, M.setAttribute(X.DISABLED, "")), t.appendChild(M), F = document.createElement("button"), F.type = "button", F.className = Ls.CLEAR, F.innerHTML = "\n      <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\">\n        <path d=\"M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n      </svg>\n    ", F.setAttribute("aria-label", "Clear"), F.hidden = !o, t.appendChild(F), m && (I = document.createElement("div"), I.className = Ls.LOADING, I.innerHTML = "\n        <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\">\n          <circle cx=\"8\" cy=\"8\" r=\"6\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-dasharray=\"28\" stroke-dashoffset=\"7\">\n            <animateTransform attributeName=\"transform\" type=\"rotate\" from=\"0 8 8\" to=\"360 8 8\" dur=\"1s\" repeatCount=\"indefinite\"/>\n          </circle>\n        </svg>\n      ", I.hidden = !0, t.appendChild(I)), e.appendChild(t), N = document.createElement("div"), N.id = `${k}-content`, N.className = Ls.CONTENT, N.setAttribute(X.CONTENT, ""), N.hidden = !0, P = document.createElement("div"), P.id = j, P.className = Ls.OPTIONS, P.setAttribute("role", "listbox"), N.appendChild(P), document.body.appendChild(N);
	}
	function ne() {
		let e = r.slice(0, v);
		if (c) {
			P.innerHTML = `<div class="${Ls.EMPTY}" ${X.LOADING}>${b}</div>`;
			return;
		}
		if (e.length === 0) {
			let e = `<div class="${Ls.EMPTY}" ${X.EMPTY}>${y}</div>`;
			h && o.trim() && (e += `
          <div
            class="${Ls.CREATE}"
            ${X.CREATE}
            role="option"
            tabindex="-1"
          >
            ${g(o.trim())}
          </div>
        `), P.innerHTML = e;
			return;
		}
		let t = e.map((e, t) => {
			let n = e.value === i, r = t === l, a = `${k}-option-${t}`, s;
			if (S) s = S(e, r);
			else {
				let t = C ? zs(e.label, o) : e.label;
				s = `<span class="${Ls.OPTION_LABEL}">${t}</span>`;
			}
			return `
          <div
            id="${a}"
            class="${Ls.OPTION}"
            role="option"
            ${X.OPTION}
            ${X.VALUE}="${e.value}"
            ${n ? X.SELECTED : ""}
            ${r ? X.HIGHLIGHTED : ""}
            ${e.disabled ? X.DISABLED : ""}
            aria-selected="${n}"
            aria-disabled="${e.disabled || !1}"
          >
            ${s}
          </div>
        `;
		}).join("");
		h && o.trim() && !e.some((e) => e.label.toLowerCase() === o.toLowerCase()) && (t += `
        <div
          class="${Ls.CREATE}"
          ${X.CREATE}
          role="option"
          tabindex="-1"
        >
          ${g(o.trim())}
        </div>
      `), P.innerHTML = t, l >= 0 && l < e.length ? M.setAttribute("aria-activedescendant", `${k}-option-${l}`) : M.removeAttribute("aria-activedescendant");
	}
	function re() {
		return Array.from(P.querySelectorAll(`[${X.OPTION}]:not([${X.DISABLED}])`));
	}
	function R(e) {
		let t = re();
		if (t.forEach((e) => e.removeAttribute(X.HIGHLIGHTED)), e >= 0 && e < t.length) {
			let n = t[e];
			n.setAttribute(X.HIGHLIGHTED, ""), n.scrollIntoView({ block: "nearest" }), M.setAttribute("aria-activedescendant", n.id), l = e;
		} else l = -1, M.removeAttribute("aria-activedescendant");
	}
	let ie = Vs(async (e) => {
		if (e.length < f) {
			r = [], ne();
			return;
		}
		if (w) {
			c = !0, ne();
			try {
				r = await w(e);
			} catch (e) {
				console.error("[Combobox] Search error:", e), r = [];
			} finally {
				c = !1;
			}
		} else r = n.filter((t) => x(t, e));
		l = r.length > 0 ? 0 : -1, ne();
	}, p);
	function ae(e) {
		i = e.value, a = e, o = e.label, M.value = o, F && (F.hidden = !1), le(), T?.(i, a);
	}
	function oe(e) {
		E?.(e), o = e, i = e, a = null, F && (F.hidden = !1), le();
	}
	function se() {
		i = "", a = null, o = "", M.value = "", F && (F.hidden = !0), r = [], ne(), T?.("", null);
	}
	function ce() {
		if (s || u) return;
		s = !0, N.hidden = !1, M.setAttribute("aria-expanded", "true");
		let t = () => {
			let e = Pa(M, N, {
				placement: _,
				offset: 4,
				flip: !0
			});
			Fa(N, e), N.style.minWidth = `${M.offsetWidth}px`;
		};
		t(), L = Ia(M, N, t), ie(o), ee = La(N, {
			onDismiss: le,
			escapeKey: !0,
			clickOutside: !0,
			ignore: [e]
		});
	}
	function le() {
		s && (s = !1, N.hidden = !0, M.setAttribute("aria-expanded", "false"), M.removeAttribute("aria-activedescendant"), L?.(), L = null, ee?.destroy(), ee = null, l = -1, c = !1);
	}
	function ue(e) {
		o = e.target.value, F && (F.hidden = !o), a && o !== a.label && (i = "", a = null), !s && o.length >= f ? ce() : s && ie(o);
	}
	function de() {
		D?.(), (o.length >= f || n.length > 0) && ce();
	}
	function fe() {
		O?.(), setTimeout(() => {
			N.contains(document.activeElement) || le();
		}, 150);
	}
	function pe(e) {
		let t = re(), n = h && o.trim() && P.querySelector(`[${X.CREATE}]`), i = t.length + +!!n;
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), s ? R(Math.min(l + 1, i - 1)) : ce();
				break;
			case "ArrowUp":
				e.preventDefault(), s && R(Math.max(l - 1, 0));
				break;
			case "Enter":
				if (e.preventDefault(), s) {
					if (n && l === t.length) oe(o.trim());
					else if (l >= 0 && l < t.length) {
						let e = t[l].getAttribute(X.VALUE), n = r.find((t) => t.value === e);
						n && ae(n);
					}
				} else o.length >= f && ce();
				break;
			case "Escape":
				s && (e.preventDefault(), le());
				break;
			case "Tab":
				le();
				break;
			case "Home":
				s && (e.preventDefault(), R(0));
				break;
			case "End": s && (e.preventDefault(), R(i - 1));
		}
	}
	function me(e) {
		let t = e.target;
		if (t.closest(`[${X.CREATE}]`)) {
			oe(o.trim());
			return;
		}
		let n = t.closest(`[${X.OPTION}]`);
		if (n && !n.hasAttribute(X.DISABLED)) {
			let e = n.getAttribute(X.VALUE), t = r.find((t) => t.value === e);
			t && ae(t);
		}
	}
	function he(e) {
		e.preventDefault(), e.stopPropagation(), se(), M.focus();
	}
	return te(), M.addEventListener("input", ue), M.addEventListener("focus", de), M.addEventListener("blur", fe), M.addEventListener("keydown", pe), P.addEventListener("click", me), F !== null && F.addEventListener("click", he), {
		getValue() {
			return i;
		},
		getSelected() {
			return a;
		},
		setValue(e) {
			let t = n.find((t) => t.value === e);
			t ? ae(t) : (i = e, a = null, o = e, M.value = e);
		},
		setInputValue(e) {
			o = e, M.value = e, F && (F.hidden = !e);
		},
		open: ce,
		close: le,
		isOpen() {
			return s;
		},
		focus() {
			M.focus();
		},
		setOptions(e) {
			n = e, s && ie(o);
		},
		clear() {
			se();
		},
		setDisabled(e) {
			u = e, M.disabled = u, u ? (M.setAttribute(X.DISABLED, ""), le()) : M.removeAttribute(X.DISABLED);
		},
		destroy() {
			le(), M.removeEventListener("input", ue), M.removeEventListener("focus", de), M.removeEventListener("blur", fe), M.removeEventListener("keydown", pe), P.removeEventListener("click", me), F?.removeEventListener("click", he), N.remove(), e.innerHTML = "";
		}
	};
}
var Us = class extends HTMLElement {
	constructor() {
		super(...arguments), this._combobox = null, this._options = [];
	}
	static get observedAttributes() {
		return [
			"placeholder",
			"disabled",
			"value",
			"min-chars"
		];
	}
	connectedCallback() {
		this._parseOptions(), this._init();
	}
	disconnectedCallback() {
		this._combobox?.destroy(), this._combobox = null;
	}
	attributeChangedCallback(e, t, n) {
		if (this._combobox) switch (e) {
			case "disabled":
				this._combobox.setDisabled(n !== null);
				break;
			case "value": n && this._combobox.setValue(n);
		}
	}
	_parseOptions() {
		let e = this.getAttribute("data-options");
		if (e) try {
			this._options = JSON.parse(e);
			return;
		} catch {
			console.warn("[AtlasCombobox] Invalid JSON in data-options");
		}
		let t = this.getAttribute("list");
		if (t) {
			let e = document.getElementById(t);
			e && (this._options = Array.from(e.querySelectorAll("option")).map((e) => ({
				value: e.value,
				label: e.textContent || e.value
			})));
		}
	}
	_init() {
		this._combobox = Hs(this, {
			options: this._options,
			placeholder: this.getAttribute("placeholder") || void 0,
			disabled: this.hasAttribute("disabled"),
			value: this.getAttribute("value") || void 0,
			minChars: parseInt(this.getAttribute("min-chars") || "0", 10),
			allowCreate: this.hasAttribute("allow-create"),
			onChange: (e, t) => {
				this.dispatchEvent(new CustomEvent("change", {
					detail: {
						value: e,
						option: t
					},
					bubbles: !0
				}));
			},
			onCreate: (e) => {
				this.dispatchEvent(new CustomEvent("create", {
					detail: { value: e },
					bubbles: !0
				}));
			}
		});
	}
	get value() {
		return this._combobox?.getValue() || "";
	}
	set value(e) {
		this._combobox?.setValue(e);
	}
	get selected() {
		return this._combobox?.getSelected() || null;
	}
	open() {
		this._combobox?.open();
	}
	close() {
		this._combobox?.close();
	}
	clear() {
		this._combobox?.clear();
	}
	focus() {
		this._combobox?.focus();
	}
};
V() && !customElements.get("atlas-combobox") && customElements.define("atlas-combobox", Us);
var Ws = {
	DIALOG: "data-atlas-command-dialog",
	INPUT: "data-atlas-command-input",
	LIST: "data-atlas-command-list",
	GROUP: "data-atlas-command-group",
	ITEM: "data-atlas-command-item",
	EMPTY: "data-atlas-command-empty"
}, Z = {
	ROOT: "atlas-command",
	DIALOG: "atlas-command-dialog",
	INPUT_WRAPPER: "atlas-command-input-wrapper",
	INPUT: "atlas-command-input",
	ICON: "atlas-command-icon",
	LIST: "atlas-command-list",
	GROUP: "atlas-command-group",
	GROUP_LABEL: "atlas-command-group-label",
	ITEM: "atlas-command-item",
	ITEM_ICON: "atlas-command-item-icon",
	ITEM_LABEL: "atlas-command-item-label",
	ITEM_SHORTCUT: "atlas-command-item-shortcut",
	ITEM_HIGHLIGHTED: "atlas-command-item--highlighted",
	ITEM_DISABLED: "atlas-command-item--disabled",
	EMPTY: "atlas-command-empty",
	OPEN: "atlas-command--open",
	BACKDROP: "atlas-command-backdrop"
}, Gs = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"8\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"/></svg>";
function Ks(e, t = {}) {
	if (!V()) return qs();
	let { items: n = [], placeholder: r = "Type a command or search...", emptyMessage: i = "No results found.", searchDebounce: a = 150 } = t, o = !1, s = n, c = "", l = [], u = null, d = B("command"), f = null, p = null, m = null, h = null, g = null, _ = null, v = null, y = [];
	function b() {
		e.classList.add(Z.ROOT), e.setAttribute("data-atlas-command", ""), e.id = d, f = document.createElement("div"), f.className = Z.BACKDROP, f.addEventListener("click", F), e.appendChild(f), p = document.createElement("div"), p.className = Z.DIALOG, p.setAttribute(Ws.DIALOG, ""), p.setAttribute("role", "dialog"), p.setAttribute("aria-modal", "true"), p.setAttribute("aria-label", "Command palette");
		let t = document.createElement("div");
		t.className = Z.INPUT_WRAPPER, t.innerHTML = `<span class="${Z.ICON}" aria-hidden="true">${Gs}</span>`, m = document.createElement("input"), m.className = Z.INPUT, m.setAttribute(Ws.INPUT, ""), m.type = "text", m.placeholder = r, m.setAttribute("role", "combobox"), m.setAttribute("aria-autocomplete", "list"), m.setAttribute("aria-controls", `${d}-list`), t.appendChild(m), h = document.createElement("div"), h.className = Z.LIST, h.setAttribute(Ws.LIST, ""), h.id = `${d}-list`, h.setAttribute("role", "listbox"), g = document.createElement("div"), g.className = Z.EMPTY, g.setAttribute(Ws.EMPTY, ""), g.textContent = i, g.style.display = "none", p.appendChild(t), p.appendChild(h), p.appendChild(g), e.appendChild(p), x(), j();
	}
	function x() {
		m && (y.push(H(m, "input", S)), y.push(H(m, "keydown", C)));
	}
	function S(e) {
		let n = e.target;
		u && clearTimeout(u), u = setTimeout(() => {
			c = n.value, j(), t.onSearch?.(c);
		}, a);
	}
	function C(e) {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), w();
				break;
			case "ArrowUp":
				e.preventDefault(), T();
				break;
			case "Enter":
				e.preventDefault(), D();
				break;
			case "Escape": e.preventDefault(), F();
		}
	}
	function w() {
		let e = h?.querySelectorAll(`[${Ws.ITEM}]:not([aria-disabled="true"])`);
		if (!e || e.length === 0) return;
		let t = h?.querySelector(`.${Z.ITEM_HIGHLIGHTED}`);
		E(e[((t ? Array.from(e).indexOf(t) : -1) + 1) % e.length]);
	}
	function T() {
		let e = h?.querySelectorAll(`[${Ws.ITEM}]:not([aria-disabled="true"])`);
		if (!e || e.length === 0) return;
		let t = h?.querySelector(`.${Z.ITEM_HIGHLIGHTED}`), n = t ? Array.from(e).indexOf(t) : 0;
		E(e[n <= 0 ? e.length - 1 : n - 1]);
	}
	function E(e) {
		h?.querySelectorAll(`.${Z.ITEM_HIGHLIGHTED}`).forEach((e) => {
			e.classList.remove(Z.ITEM_HIGHLIGHTED);
		}), e.classList.add(Z.ITEM_HIGHLIGHTED), e.scrollIntoView({ block: "nearest" });
	}
	function D() {
		let e = h?.querySelector(`.${Z.ITEM_HIGHLIGHTED}`);
		if (!e) return;
		let t = e.getAttribute("data-id"), n = l.find((e) => e.id === t);
		n && !n.disabled && O(n);
	}
	function O(e) {
		e.onSelect?.(), t.onSelect?.(e), F();
	}
	function k(e) {
		let t = [];
		for (let n of e) "items" in n ? t.push(...n.items) : t.push(n);
		return t;
	}
	function A(e, t) {
		let n = t.toLowerCase(), r = e.label.toLowerCase(), i = e.keywords?.map((e) => e.toLowerCase()) ?? [];
		return r.includes(n) || i.some((e) => e.includes(n));
	}
	function j() {
		let e = k(s), n = t.filter ?? A;
		l = c ? e.filter((e) => n(e, c)) : e.slice(), M();
	}
	function M() {
		if (!h || !g) return;
		if (h.innerHTML = "", l.length === 0) {
			g.style.display = "";
			return;
		}
		g.style.display = "none";
		let e = /* @__PURE__ */ new Map(), t = [];
		for (let n of l) if (n.group) {
			let t = e.get(n.group) ?? [];
			t.push(n), e.set(n.group, t);
		} else t.push(n);
		t.forEach((e) => {
			h?.appendChild(N(e));
		});
		for (let [t, n] of e) {
			let e = document.createElement("div");
			e.className = Z.GROUP, e.setAttribute(Ws.GROUP, ""), e.setAttribute("role", "group"), e.setAttribute("aria-label", t);
			let r = document.createElement("div");
			r.className = Z.GROUP_LABEL, r.textContent = t, e.appendChild(r), n.forEach((t) => {
				e.appendChild(N(t));
			}), h?.appendChild(e);
		}
		let n = h.querySelector(`[${Ws.ITEM}]:not([aria-disabled="true"])`);
		n && E(n);
	}
	function N(e) {
		let t = document.createElement("div");
		t.className = `${Z.ITEM} ${e.disabled ? Z.ITEM_DISABLED : ""}`, t.setAttribute(Ws.ITEM, ""), t.setAttribute("role", "option"), t.setAttribute("data-id", e.id), e.disabled && t.setAttribute("aria-disabled", "true");
		let n = "";
		return e.icon && (n += `<span class="${Z.ITEM_ICON}" aria-hidden="true">${e.icon}</span>`), n += `<span class="${Z.ITEM_LABEL}">${Js(e.label)}</span>`, e.shortcut && (n += `<span class="${Z.ITEM_SHORTCUT}">${Js(e.shortcut)}</span>`), t.innerHTML = n, e.disabled || (t.addEventListener("click", () => O(e)), t.addEventListener("mouseenter", () => E(t))), t;
	}
	function P() {
		o || (o = !0, e.classList.add(Z.OPEN), v = fa(), p && (_ = Ra({
			container: p,
			initialFocus: m ?? "first"
		}), _.activate()), requestAnimationFrame(() => {
			m?.focus(), m?.select();
		}), t.onOpen?.());
	}
	function F() {
		o && (o = !1, e.classList.remove(Z.OPEN), m && (m.value = ""), c = "", j(), _?.deactivate(), _ = null, v?.(), v = null, t.onClose?.());
	}
	function I() {
		o ? F() : P();
	}
	function ee(e) {
		c = e, m && (m.value = e), j();
	}
	function L(e) {
		s = e, j();
	}
	function te() {
		u && clearTimeout(u), o && (_?.deactivate(), v?.()), y.forEach((e) => e()), e.classList.remove(Z.ROOT, Z.OPEN), e.removeAttribute("data-atlas-command"), e.innerHTML = "";
	}
	return b(), {
		isOpen: () => o,
		open: P,
		close: F,
		toggle: I,
		getQuery: () => c,
		setQuery: ee,
		getItems: () => [...s],
		setItems: L,
		getFilteredItems: () => [...l],
		destroy: te
	};
}
function qs() {
	return {
		isOpen: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		getQuery: () => "",
		setQuery: () => {},
		getItems: () => [],
		setItems: () => {},
		getFilteredItems: () => [],
		destroy: () => {}
	};
}
function Js(e) {
	let t = document.createElement("div");
	return t.textContent = e, t.innerHTML;
}
var Ys = {
	BACKDROP: "data-atlas-dialog-backdrop",
	CONTENT: "data-atlas-dialog-content",
	TITLE: "data-atlas-dialog-title",
	DESCRIPTION: "data-atlas-dialog-description",
	CLOSE: "data-atlas-dialog-close"
}, Xs = {
	ROOT: "atlas-dialog",
	BACKDROP: "atlas-dialog-backdrop",
	WRAPPER: "atlas-dialog-wrapper",
	CONTENT: "atlas-dialog-content",
	OPEN: "atlas-dialog--open",
	CLOSING: "atlas-dialog--closing"
}, Zs = {
	sm: "atlas-dialog--sm",
	default: "atlas-dialog--default",
	lg: "atlas-dialog--lg",
	xl: "atlas-dialog--xl",
	full: "atlas-dialog--full"
};
function Qs(e, t = {}) {
	if (!V()) return $s();
	let { modal: n = !0, size: r = "default", closeOnEsc: i = !0, closeOnBackdrop: a = !0, open: o = !1 } = t, s = !1, c = r, l = null, u = B("dialog"), d = null, f = null, p = null, m = null, h = null, g = null;
	function _() {
		if (e.classList.add(Xs.ROOT), e.setAttribute("data-atlas-dialog", ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", n ? "true" : "false"), e.id = u, b(), d = e.querySelector(`[${Ys.BACKDROP}]`), d || (d = document.createElement("div"), d.className = Xs.BACKDROP, d.setAttribute(Ys.BACKDROP, ""), e.insertBefore(d, e.firstChild)), f = e.querySelector(`.${Xs.WRAPPER}`), !f) {
			f = document.createElement("div"), f.className = Xs.WRAPPER;
			let t = e.querySelector(`[${Ys.CONTENT}]`);
			t && f.appendChild(t), e.appendChild(f);
		}
		p = e.querySelector(`[${Ys.CONTENT}]`), p ||= f.querySelector(`.${Xs.CONTENT}`), p && p.setAttribute("tabindex", "-1");
		let t = e.querySelector(`[${Ys.TITLE}]`);
		if (t) {
			let n = `${u}-title`;
			t.id = n, e.setAttribute("aria-labelledby", n);
		}
		let r = e.querySelector(`[${Ys.DESCRIPTION}]`);
		if (r) {
			let t = `${u}-desc`;
			r.id = t, e.setAttribute("aria-describedby", t);
		}
		v(), a && d && d.addEventListener("click", y), o && requestAnimationFrame(() => x());
	}
	function v() {
		e.querySelectorAll(`[${Ys.CLOSE}]`).forEach((e) => {
			e.addEventListener("click", S), e.getAttribute("aria-label") || e.setAttribute("aria-label", "Close dialog");
		});
	}
	function y(e) {
		e.target === d && S();
	}
	function b() {
		Object.values(Zs).forEach((t) => {
			e.classList.remove(t);
		}), e.classList.add(Zs[c]);
	}
	function x() {
		s || (s = !0, l = document.activeElement, e.classList.add(Xs.OPEN), e.removeAttribute("hidden"), n && (g = fa()), m = Ra({
			container: p ?? f ?? e,
			initialFocus: "container",
			returnFocus: l ?? "previous"
		}), m.activate(), i && (h = La(e, {
			escapeKey: !0,
			clickOutside: !1,
			onDismiss: S
		})), requestAnimationFrame(() => {
			(p ?? e).focus();
		}), t.onOpen?.());
	}
	function S() {
		s && (s = !1, e.classList.add(Xs.CLOSING), setTimeout(() => {
			e.classList.remove(Xs.OPEN, Xs.CLOSING), e.setAttribute("hidden", ""), m?.deactivate(), m = null, h?.destroy(), h = null, g?.(), g = null, l?.focus(), l = null, t.onClose?.();
		}, W.normal));
	}
	function C() {
		s ? S() : x();
	}
	function w(e) {
		c = e, b();
	}
	function T() {
		s && (e.classList.remove(Xs.OPEN, Xs.CLOSING), m?.deactivate(), h?.destroy(), g?.()), d?.removeEventListener("click", y), e.querySelectorAll(`[${Ys.CLOSE}]`).forEach((e) => {
			e.removeEventListener("click", S);
		}), e.classList.remove(Xs.ROOT, Xs.OPEN, ...Object.values(Zs)), e.removeAttribute("data-atlas-dialog"), e.removeAttribute("role"), e.removeAttribute("aria-modal");
	}
	return _(), {
		isOpen: () => s,
		open: x,
		close: S,
		toggle: C,
		setSize: w,
		getSize: () => c,
		destroy: T
	};
}
function $s() {
	return {
		isOpen: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		setSize: () => {},
		getSize: () => "default",
		destroy: () => {}
	};
}
function ec(e, t = {}) {
	if (!V()) return tc();
	let { size: n = "md", focusGlow: r = !0, shakeOnError: i = !0, validate: a, validateDebounce: o = 300, validateOnBlur: s = !0, validateOnInput: c = !1, showCount: l = !1, maxLength: u, onValidate: d, onChange: f, onFocus: p, onBlur: m } = t, h = !0, g = null, _ = !1, v = null, y = null, b = [], x = e.style.transition, S = e.style.boxShadow;
	if (e.classList.add("atlas-input"), e.classList.add(`atlas-input-${n}`), e.style.transition = `
    border-color ${W.fast}ms ${G.standard},
    box-shadow ${W.fast}ms ${G.standard}
  `.replace(/\s+/g, " ").trim(), u !== void 0 && e.setAttribute("maxlength", String(u)), l) {
		y = document.createElement("span"), y.className = "atlas-input-count", y.style.cssText = "\n      position: absolute;\n      right: 0.75rem;\n      bottom: 0.5rem;\n      font-size: 0.75rem;\n      color: hsl(var(--atlas-muted-foreground));\n      pointer-events: none;\n    ", C();
		let t = e.parentElement;
		if (t && !t.classList.contains("atlas-input-wrapper")) {
			let n = document.createElement("div");
			n.className = "atlas-input-wrapper", n.style.position = "relative", t.insertBefore(n, e), n.appendChild(e), n.appendChild(y);
		} else t && t.appendChild(y);
	}
	function C() {
		if (y) {
			let t = e.value.length, n = u || "";
			y.textContent = n ? `${t}/${n}` : String(t), u && (t >= u ? y.style.color = "hsl(var(--atlas-destructive))" : t >= u * .9 ? y.style.color = "hsl(var(--atlas-warning))" : y.style.color = "hsl(var(--atlas-muted-foreground))");
		}
	}
	function w() {
		r && (e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-ring) / 0.2)");
	}
	function T() {
		h ? e.style.boxShadow = S : e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
	}
	function E() {
		!i || !e.animate || e.animate([
			{ transform: "translateX(0)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(4px)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(4px)" },
			{ transform: "translateX(0)" }
		], {
			duration: 400,
			easing: "ease-in-out"
		});
	}
	function D() {
		if (!a) return h = !0, g = null, !0;
		let t = a(e.value);
		return h = t === null, g = t, h ? (e.classList.remove("atlas-input-error"), e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage"), T()) : (e.classList.add("atlas-input-error"), e.setAttribute("aria-invalid", "true"), e.style.borderColor = "hsl(var(--atlas-destructive))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)", E()), d?.(h, g || void 0), h;
	}
	function O() {
		v && clearTimeout(v), v = setTimeout(() => {
			D();
		}, o);
	}
	return b.push(H(e, "focus", () => {
		_ = !0, w(), p?.();
	}), H(e, "blur", () => {
		_ = !1, T(), s && a && D(), m?.();
	}), H(e, "input", () => {
		f?.(e.value), l && C(), c && a && O(), h || (e.style.borderColor = "", _ ? w() : e.style.boxShadow = S);
	})), {
		get value() {
			return e.value;
		},
		get isValid() {
			return h;
		},
		get errorMessage() {
			return g;
		},
		get isFocused() {
			return _;
		},
		setValue: (t) => {
			e.value = t, l && C(), f?.(t);
		},
		validate: () => D(),
		setError: (t) => {
			h = !1, g = t, e.classList.add("atlas-input-error"), e.setAttribute("aria-invalid", "true"), e.style.borderColor = "hsl(var(--atlas-destructive))", e.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)", E(), d?.(!1, t);
		},
		clearError: () => {
			h = !0, g = null, e.classList.remove("atlas-input-error"), e.removeAttribute("aria-invalid"), e.style.borderColor = "", _ ? w() : e.style.boxShadow = S, d?.(!0);
		},
		focus: () => {
			e.focus();
		},
		blur: () => {
			e.blur();
		},
		selectAll: () => {
			e.select();
		},
		destroy: () => {
			v && clearTimeout(v), b.forEach((e) => e()), e.style.transition = x, e.style.boxShadow = S, e.classList.remove("atlas-input", `atlas-input-${n}`, "atlas-input-error"), y && y.remove();
		}
	};
}
function tc() {
	return {
		get value() {
			return "";
		},
		get isValid() {
			return !0;
		},
		get errorMessage() {
			return null;
		},
		get isFocused() {
			return !1;
		},
		setValue: () => {},
		validate: () => !0,
		setError: () => {},
		clearError: () => {},
		focus: () => {},
		blur: () => {},
		selectAll: () => {},
		destroy: () => {}
	};
}
function nc(e, t = {}) {
	if (!V()) return rc();
	let { for: n, required: r = !1, optional: i = !1, requiredText: a = "*", optionalText: o = "(optional)", hasError: s = !1 } = t, c = s, l = null, u = null, d = null, f = [];
	e.classList.add("atlas-label"), n && (e.tagName.toLowerCase() === "label" && (e.htmlFor = n), d = document.getElementById(n)), r && p(), i && !r && h(), c && e.classList.add("atlas-label-error"), e.tagName.toLowerCase() !== "label" && n && (f.push(H(e, "click", () => {
		let e = document.getElementById(n);
		e && "focus" in e && e.focus();
	})), e.style.cursor = "pointer");
	function p() {
		l || (l = document.createElement("span"), l.className = "atlas-label-required", l.textContent = a, l.setAttribute("aria-hidden", "true"), l.style.cssText = "\n      color: hsl(var(--atlas-destructive));\n      margin-left: 0.25rem;\n    ", e.appendChild(l));
	}
	function m() {
		l &&= (l.remove(), null);
	}
	function h() {
		u || (u = document.createElement("span"), u.className = "atlas-label-optional", u.textContent = ` ${o}`, u.style.cssText = "\n      color: hsl(var(--atlas-muted-foreground));\n      font-weight: normal;\n      font-size: 0.875em;\n    ", e.appendChild(u));
	}
	function g() {
		u &&= (u.remove(), null);
	}
	return {
		get hasError() {
			return c;
		},
		get associatedInput() {
			return d;
		},
		setError: (t) => {
			c = t, t ? e.classList.add("atlas-label-error") : e.classList.remove("atlas-label-error");
		},
		setRequired: (e) => {
			e ? (g(), p()) : m();
		},
		setFor: (t) => {
			e.tagName.toLowerCase() === "label" && (e.htmlFor = t), d = document.getElementById(t);
		},
		destroy: () => {
			f.forEach((e) => e()), m(), g(), e.classList.remove("atlas-label", "atlas-label-error");
		}
	};
}
function rc() {
	return {
		get hasError() {
			return !1;
		},
		get associatedInput() {
			return null;
		},
		setError: () => {},
		setRequired: () => {},
		setFor: () => {},
		destroy: () => {}
	};
}
var ic = {
	ROOT: "data-atlas-marquee",
	CONTENT: "data-atlas-marquee-content",
	INNER: "data-atlas-marquee-inner"
}, ac = {
	ROOT: "atlas-marquee",
	INNER: "atlas-marquee-inner",
	CONTENT: "atlas-marquee-content",
	GRADIENT_LEFT: "atlas-marquee-gradient-left",
	GRADIENT_RIGHT: "atlas-marquee-gradient-right",
	GRADIENT_TOP: "atlas-marquee-gradient-top",
	GRADIENT_BOTTOM: "atlas-marquee-gradient-bottom",
	PAUSED: "atlas-marquee-paused"
};
function oc(e, t = {}) {
	if (!V()) return {
		play: () => {},
		pause: () => {},
		isPlaying: () => !1,
		setSpeed: () => {},
		setDirection: () => {},
		destroy: () => {}
	};
	let { direction: n = "left", speed: r = 50, pauseOnHover: i = !0, gap: a = 40, gradient: o = !0, gradientSize: s = 50, gradientColor: c = "white", copies: l, easing: u = "linear", delay: d = 0, autoplay: f = !0, onCycle: p } = t, m = n, h = r, g = !1, _ = null, v = null, y = 0, b = 0, x = m === "left" || m === "right", S = m === "right" || m === "down", C = e.innerHTML;
	e.innerHTML = "", e.setAttribute(ic.ROOT, ""), e.classList.add(ac.ROOT), e.style.overflow = "hidden", e.style.position = "relative";
	let w = document.createElement("div");
	w.className = ac.INNER, w.setAttribute(ic.INNER, ""), w.style.display = "flex", w.style.flexDirection = x ? "row" : "column", w.style.width = x ? "max-content" : "100%", w.style.height = x ? "100%" : "max-content", w.style.gap = `${a}px`;
	let T = document.createElement("div");
	T.className = ac.CONTENT, T.setAttribute(ic.CONTENT, ""), T.innerHTML = C, T.style.display = "flex", T.style.flexDirection = x ? "row" : "column", T.style.gap = `${a}px`, T.style.flexShrink = "0", w.appendChild(T), e.appendChild(w);
	let E = x ? T.offsetWidth : T.offsetHeight, D = x ? e.offsetWidth : e.offsetHeight, O = l ?? Math.ceil(D * 2 / E) + 1;
	for (let e = 0; e < O; e++) {
		let e = T.cloneNode(!0);
		e.setAttribute("aria-hidden", "true"), w.appendChild(e);
	}
	if (E += a, o) {
		let t = "\n      position: absolute;\n      z-index: 1;\n      pointer-events: none;\n    ";
		if (x) {
			let n = document.createElement("div");
			n.className = ac.GRADIENT_LEFT, n.style.cssText = `
        ${t}
        left: 0;
        top: 0;
        bottom: 0;
        width: ${s}px;
        background: linear-gradient(to right, ${c}, transparent);
      `;
			let r = document.createElement("div");
			r.className = ac.GRADIENT_RIGHT, r.style.cssText = `
        ${t}
        right: 0;
        top: 0;
        bottom: 0;
        width: ${s}px;
        background: linear-gradient(to left, ${c}, transparent);
      `, e.appendChild(n), e.appendChild(r);
		} else {
			let n = document.createElement("div");
			n.className = ac.GRADIENT_TOP, n.style.cssText = `
        ${t}
        left: 0;
        right: 0;
        top: 0;
        height: ${s}px;
        background: linear-gradient(to bottom, ${c}, transparent);
      `;
			let r = document.createElement("div");
			r.className = ac.GRADIENT_BOTTOM, r.style.cssText = `
        ${t}
        left: 0;
        right: 0;
        bottom: 0;
        height: ${s}px;
        background: linear-gradient(to top, ${c}, transparent);
      `, e.appendChild(n), e.appendChild(r);
		}
	}
	function k(e) {
		if (!g) return;
		v === null && (v = e - y);
		let t = (e - v) / 1e3 * h;
		b = t % E;
		let n = S ? b : -b;
		x ? w.style.transform = `translateX(${n}px)` : w.style.transform = `translateY(${n}px)`, p && Math.floor(t / E) > Math.floor((t - h / 60) / E) && p(), _ = requestAnimationFrame(k);
	}
	function A() {
		g || (g = !0, e.classList.remove(ac.PAUSED), _ = requestAnimationFrame(k));
	}
	function j() {
		g && (g = !1, e.classList.add(ac.PAUSED), y = performance.now() - (v || 0), v = null, _ !== null && (cancelAnimationFrame(_), _ = null));
	}
	function M() {
		i && g && (j(), e.dataset.wasPlaying = "true");
	}
	function N() {
		i && e.dataset.wasPlaying === "true" && (delete e.dataset.wasPlaying, A());
	}
	return i && (e.addEventListener("mouseenter", M), e.addEventListener("mouseleave", N)), f && (d > 0 ? setTimeout(A, d) : A()), {
		play: A,
		pause: j,
		isPlaying() {
			return g;
		},
		setSpeed(e) {
			let t = g;
			t && j(), h = e, t && A();
		},
		setDirection(e) {
			m = e, console.warn("[Marquee] Direction change requires rebuild");
		},
		destroy() {
			j(), e.removeEventListener("mouseenter", M), e.removeEventListener("mouseleave", N), e.innerHTML = C, e.removeAttribute(ic.ROOT), e.classList.remove(ac.ROOT), e.style.overflow = "", e.style.position = "";
		}
	};
}
var sc = class extends HTMLElement {
	constructor() {
		super(...arguments), this._marquee = null;
	}
	static get observedAttributes() {
		return [
			"speed",
			"direction",
			"pause-on-hover",
			"gap",
			"gradient"
		];
	}
	connectedCallback() {
		requestAnimationFrame(() => {
			this._init();
		});
	}
	disconnectedCallback() {
		this._marquee?.destroy(), this._marquee = null;
	}
	attributeChangedCallback(e, t, n) {
		this._marquee && e === "speed" && this._marquee.setSpeed(parseFloat(n) || 50);
	}
	_init() {
		this._marquee = oc(this, {
			speed: parseFloat(this.getAttribute("speed") || "50"),
			direction: this.getAttribute("direction") || "left",
			pauseOnHover: this.getAttribute("pause-on-hover") !== "false",
			gap: parseFloat(this.getAttribute("gap") || "40"),
			gradient: this.getAttribute("gradient") !== "false",
			gradientSize: parseFloat(this.getAttribute("gradient-size") || "50"),
			gradientColor: this.getAttribute("gradient-color") || "white"
		});
	}
	play() {
		this._marquee?.play();
	}
	pause() {
		this._marquee?.pause();
	}
};
V() && !customElements.get("atlas-marquee") && customElements.define("atlas-marquee", sc);
var cc = {
	TRIGGER: "data-atlas-menu-trigger",
	CONTENT: "data-atlas-menu-content",
	ITEM: "data-atlas-menu-item",
	SEPARATOR: "data-atlas-menu-separator",
	LABEL: "data-atlas-menu-label"
}, lc = {
	ROOT: "atlas-menu",
	CONTENT: "atlas-menu-content",
	ITEM: "atlas-menu-item",
	ITEM_DISABLED: "atlas-menu-item--disabled",
	ITEM_HIGHLIGHTED: "atlas-menu-item--highlighted",
	SEPARATOR: "atlas-menu-separator",
	LABEL: "atlas-menu-label",
	SHORTCUT: "atlas-menu-shortcut",
	ICON: "atlas-menu-icon",
	INDICATOR: "atlas-menu-indicator",
	OPEN: "atlas-menu--open"
};
function uc(e, t = {}) {
	if (!V()) return dc();
	let { trigger: n = "click", placement: r = "bottom-start", offset: i = 4, items: a = [], closeOnSelect: o = !0 } = t, s = !1, c = a, l = null, u = B("menu"), d = null, f = null, p = null, m = null, h = null, g = [];
	function _() {
		e.classList.add(lc.ROOT), e.setAttribute("data-atlas-menu", ""), d = e.querySelector(`[${cc.TRIGGER}]`), d || (d = e.firstElementChild, d?.setAttribute(cc.TRIGGER, "")), f = e.querySelector(`[${cc.CONTENT}]`), f || (f = document.createElement("div"), f.className = lc.CONTENT, f.setAttribute(cc.CONTENT, ""), e.appendChild(f)), f.id = `${u}-content`, f.setAttribute("role", "menu"), f.setAttribute("tabindex", "-1"), f.style.display = "none", d && (d.id = d.id || `${u}-trigger`, d.setAttribute("aria-haspopup", "menu"), d.setAttribute("aria-expanded", "false"), d.setAttribute("aria-controls", f.id)), v(), c.length > 0 && C();
	}
	function v() {
		if (d) switch (n) {
			case "click":
				g.push(H(d, "click", y)), g.push(H(d, "keydown", b));
				break;
			case "contextmenu":
				g.push(H(d, "contextmenu", x));
				break;
			case "hover": g.push(H(d, "mouseenter", () => D())), g.push(H(d, "mouseleave", S)), f && g.push(H(f, "mouseleave", S));
		}
	}
	function y(e) {
		e.preventDefault(), e.stopPropagation(), k();
	}
	function b(e) {
		(e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && (e.preventDefault(), D());
	}
	function x(e) {
		e.preventDefault(), l = {
			x: e.clientX,
			y: e.clientY
		}, D(l);
	}
	function S() {
		setTimeout(() => {
			e.matches(":hover") || O();
		}, 100);
	}
	function C() {
		f && (f.innerHTML = "", c.forEach((e) => {
			let t = w(e);
			f?.appendChild(t);
		}), m?.destroy(), m = Sa(f, {
			itemSelector: `[${cc.ITEM}]:not([aria-disabled="true"])`,
			orientation: "vertical",
			loop: !0
		}));
	}
	function w(e) {
		if (e.type === "separator") {
			let e = document.createElement("div");
			return e.className = lc.SEPARATOR, e.setAttribute(cc.SEPARATOR, ""), e.setAttribute("role", "separator"), e;
		}
		if (e.type === "label") {
			let t = document.createElement("div");
			return t.className = lc.LABEL, t.setAttribute(cc.LABEL, ""), t.textContent = e.label, t;
		}
		let t = document.createElement("div");
		t.className = lc.ITEM, t.setAttribute(cc.ITEM, ""), t.setAttribute("role", e.type === "checkbox" ? "menuitemcheckbox" : e.type === "radio" ? "menuitemradio" : "menuitem"), t.setAttribute("data-id", e.id), t.tabIndex = -1, e.disabled && (t.classList.add(lc.ITEM_DISABLED), t.setAttribute("aria-disabled", "true")), (e.type === "checkbox" || e.type === "radio") && t.setAttribute("aria-checked", e.checked ? "true" : "false");
		let n = "";
		return (e.type === "checkbox" || e.type === "radio") && (n += `<span class="${lc.INDICATOR}" aria-hidden="true">`, e.checked && (n += e.type === "checkbox" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>" : "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"4\"></circle></svg>"), n += "</span>"), e.icon && (n += `<span class="${lc.ICON}" aria-hidden="true">${e.icon}</span>`), n += `<span class="atlas-menu-label">${fc(e.label)}</span>`, e.shortcut && (n += `<span class="${lc.SHORTCUT}">${fc(e.shortcut)}</span>`), e.items && e.items.length > 0 && (n += "<svg class=\"atlas-menu-chevron\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>"), t.innerHTML = n, e.disabled || (t.addEventListener("click", () => E(e)), t.addEventListener("keydown", (t) => {
			(t.key === "Enter" || t.key === " ") && (t.preventDefault(), E(e));
		}), t.addEventListener("mouseenter", () => T(t))), t;
	}
	function T(e) {
		f?.querySelectorAll(`.${lc.ITEM_HIGHLIGHTED}`).forEach((e) => {
			e.classList.remove(lc.ITEM_HIGHLIGHTED);
		}), e.classList.add(lc.ITEM_HIGHLIGHTED), e.focus();
	}
	function E(e) {
		e.disabled || (e.type === "checkbox" ? (e.checked = !e.checked, C()) : e.type === "radio" && e.group && (c.forEach((t) => {
			t.type === "radio" && t.group === e.group && (t.checked = t.id === e.id);
		}), C()), e.onSelect?.(), t.onSelect?.(e), o && e.type !== "checkbox" && e.type !== "radio" && O());
	}
	function D(n) {
		s || !f || (s = !0, l = n ?? null, d?.setAttribute("aria-expanded", "true"), f.style.display = "", e.classList.add(lc.OPEN), A(), !l && d && (h = Ia(d, f, A)), p = La(f, {
			escapeKey: !0,
			clickOutside: !0,
			ignore: d ? [d] : [],
			onDismiss: O
		}), requestAnimationFrame(() => {
			let e = f?.querySelector(`[${cc.ITEM}]:not([aria-disabled="true"])`);
			e && T(e);
		}), t.onOpen?.());
	}
	function O() {
		!s || !f || (s = !1, l = null, d?.setAttribute("aria-expanded", "false"), e.classList.remove(lc.OPEN), h?.(), h = null, p?.destroy(), p = null, f.querySelectorAll(`.${lc.ITEM_HIGHLIGHTED}`).forEach((e) => {
			e.classList.remove(lc.ITEM_HIGHLIGHTED);
		}), setTimeout(() => {
			!s && f && (f.style.display = "none");
		}, W.fast), d?.focus(), t.onClose?.());
	}
	function k() {
		s ? O() : D();
	}
	function A() {
		if (f) {
			if (l) f.style.position = "fixed", f.style.left = `${l.x}px`, f.style.top = `${l.y}px`;
			else if (d) {
				let e = Pa(d, f, {
					placement: r,
					offset: i,
					flip: !0,
					shift: !0
				});
				f.style.position = "absolute", f.style.left = `${e.x}px`, f.style.top = `${e.y}px`;
			}
		}
	}
	function j() {
		s && (p?.destroy(), h?.()), m?.destroy(), g.forEach((e) => e()), e.classList.remove(lc.ROOT, lc.OPEN), e.removeAttribute("data-atlas-menu");
	}
	return _(), {
		isOpen: () => s,
		open: D,
		close: O,
		toggle: k,
		getItems: () => [...c],
		setItems: (e) => {
			c = e, C();
		},
		getCheckedItems: () => c.filter((e) => e.checked),
		destroy: j
	};
}
function dc() {
	return {
		isOpen: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		getItems: () => [],
		setItems: () => {},
		getCheckedItems: () => [],
		destroy: () => {}
	};
}
function fc(e) {
	let t = document.createElement("div");
	return t.textContent = e, t.innerHTML;
}
var pc = {
	TRIGGER: "data-atlas-popover-trigger",
	CONTENT: "data-atlas-popover-content",
	ARROW: "data-atlas-popover-arrow"
}, mc = {
	ROOT: "atlas-popover",
	OPEN: "atlas-popover--open"
};
function hc(e, t = {}) {
	if (!V()) return gc();
	let { trigger: n = "click", placement: r = "bottom", offset: i = 8, trapFocus: a = !0, showDelay: o = 0, hideDelay: s = 100, closeOnEsc: c = !0, closeOnClickOutside: l = !0, open: u = !1 } = t, d = !1, f = r, p = null, m = null, h = B("popover"), g = null, _ = null, v = null, y = null, b = null, x = [];
	function S() {
		e.classList.add(mc.ROOT), e.setAttribute("data-atlas-popover", ""), g = e.querySelector(`[${pc.TRIGGER}]`), g || (g = e.firstElementChild, g?.setAttribute(pc.TRIGGER, "")), _ = e.querySelector(`[${pc.CONTENT}]`), _ && (_.id = `${h}-content`, _.setAttribute("role", "dialog"), _.setAttribute("aria-modal", "false"), _.setAttribute("tabindex", "-1"), _.style.display = "none"), g && (g.id = g.id || `${h}-trigger`, g.setAttribute("aria-haspopup", "dialog"), g.setAttribute("aria-expanded", "false"), _ && g.setAttribute("aria-controls", _.id)), C(), u && requestAnimationFrame(() => A());
	}
	function C() {
		if (g) switch (n) {
			case "click":
				x.push(H(g, "click", w)), x.push(H(g, "keydown", T));
				break;
			case "hover":
				x.push(H(g, "mouseenter", E)), x.push(H(g, "mouseleave", D)), _ && (x.push(H(_, "mouseenter", O)), x.push(H(_, "mouseleave", D)));
				break;
			case "focus": x.push(H(g, "focus", () => A())), x.push(H(g, "blur", () => j()));
		}
	}
	function w(e) {
		e.preventDefault(), e.stopPropagation(), M();
	}
	function T(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), M());
	}
	function E() {
		k(), p = setTimeout(() => {
			A();
		}, o);
	}
	function D() {
		k(), m = setTimeout(() => {
			j();
		}, s);
	}
	function O() {
		k();
	}
	function k() {
		p &&= (clearTimeout(p), null), m &&= (clearTimeout(m), null);
	}
	function A() {
		d || !_ || !g || (k(), d = !0, g.setAttribute("aria-expanded", "true"), _.style.display = "", e.classList.add(mc.OPEN), N(), b = Ia(g, _, N), a && (v = Ra({
			container: _,
			initialFocus: "container",
			returnFocus: g
		}), v.activate()), y = La(_, {
			escapeKey: c,
			clickOutside: l,
			ignore: [g],
			onDismiss: j
		}), requestAnimationFrame(() => {
			_?.focus();
		}), t.onOpen?.());
	}
	function j() {
		!d || !_ || !g || (k(), d = !1, g.setAttribute("aria-expanded", "false"), e.classList.remove(mc.OPEN), b?.(), b = null, v?.deactivate(), v = null, y?.destroy(), y = null, setTimeout(() => {
			!d && _ && (_.style.display = "none");
		}, W.normal), g.focus(), t.onClose?.());
	}
	function M() {
		d ? j() : A();
	}
	function N() {
		if (!g || !_) return;
		let e = Pa(g, _, {
			placement: f,
			offset: i,
			flip: !0,
			shift: !0
		});
		_.style.position = "absolute", _.style.left = `${e.x}px`, _.style.top = `${e.y}px`, _.setAttribute("data-placement", e.placement);
		let t = _.querySelector(`[${pc.ARROW}]`);
		t && (e.arrowX !== void 0 || e.arrowY !== void 0) && (t.style.left = e.arrowX === void 0 ? "" : `${e.arrowX}px`, t.style.top = e.arrowY === void 0 ? "" : `${e.arrowY}px`);
	}
	function P(e) {
		f = e, d && N();
	}
	function F() {
		k(), d && (v?.deactivate(), y?.destroy(), b?.()), x.forEach((e) => e()), e.classList.remove(mc.ROOT, mc.OPEN), e.removeAttribute("data-atlas-popover");
	}
	return S(), {
		isOpen: () => d,
		open: A,
		close: j,
		toggle: M,
		updatePosition: N,
		setPlacement: P,
		getPlacement: () => f,
		destroy: F
	};
}
function gc() {
	return {
		isOpen: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		updatePosition: () => {},
		setPlacement: () => {},
		getPlacement: () => "bottom",
		destroy: () => {}
	};
}
function _c(e, t = {}) {
	if (!V()) return vc();
	let { type: n = "linear", value: r = 0, indeterminate: i = !1, shimmer: a = !0, animated: o = !0, size: s = 48, strokeWidth: c = 4, color: l = "var(--atlas-primary, #3b82f6)", trackColor: u = "var(--atlas-gray-200, #e5e7eb)", showLabel: d = !1, announceProgress: f = !0, onChange: p, onComplete: m } = t, h = Math.max(0, Math.min(100, r)), g = i ? "loading" : "idle", _ = i, v = null, y = null, b = e.innerHTML;
	n === "linear" ? x() : S();
	function x() {
		if (e.innerHTML = "", e.style.cssText = `
      position: relative;
      width: 100%;
      height: 4px;
      background: ${u};
      border-radius: 9999px;
      overflow: hidden;
    `, e.setAttribute("role", "progressbar"), e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(h)), v = document.createElement("div"), v.className = "atlas-progress-bar", v.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: ${h}%;
      background: ${l};
      border-radius: 9999px;
      transition: ${o ? `width ${W.normal}ms ${G.decelerate}` : "none"};
    `, a) {
			let e = document.createElement("div");
			e.className = "atlas-progress-shimmer", e.style.cssText = "\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        background: linear-gradient(\n          90deg,\n          transparent 0%,\n          rgba(255, 255, 255, 0.3) 50%,\n          transparent 100%\n        );\n        animation: atlas-shimmer 1.5s infinite;\n      ", v.appendChild(e);
		}
		e.appendChild(v), d && (y = document.createElement("span"), y.className = "atlas-progress-label", y.style.cssText = "\n        position: absolute;\n        right: 8px;\n        top: 50%;\n        transform: translateY(-50%);\n        font-size: 12px;\n        font-weight: 500;\n        color: currentColor;\n      ", y.textContent = `${Math.round(h)}%`, e.style.height = "20px", e.appendChild(y)), _ && C();
	}
	function S() {
		e.innerHTML = "", e.style.cssText = `
      position: relative;
      width: ${s}px;
      height: ${s}px;
    `, e.setAttribute("role", "progressbar"), e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(h));
		let t = (s - c) / 2, n = 2 * Math.PI * t, r = n - h / 100 * n, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		i.setAttribute("width", String(s)), i.setAttribute("height", String(s)), i.setAttribute("viewBox", `0 0 ${s} ${s}`), i.style.cssText = "transform: rotate(-90deg);";
		let a = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		a.setAttribute("cx", String(s / 2)), a.setAttribute("cy", String(s / 2)), a.setAttribute("r", String(t)), a.setAttribute("fill", "none"), a.setAttribute("stroke", u), a.setAttribute("stroke-width", String(c));
		let f = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		f.setAttribute("cx", String(s / 2)), f.setAttribute("cy", String(s / 2)), f.setAttribute("r", String(t)), f.setAttribute("fill", "none"), f.setAttribute("stroke", l), f.setAttribute("stroke-width", String(c)), f.setAttribute("stroke-linecap", "round"), f.setAttribute("stroke-dasharray", String(n)), f.setAttribute("stroke-dashoffset", String(r)), f.style.cssText = o ? `transition: stroke-dashoffset ${W.normal}ms ${G.decelerate};` : "", i.appendChild(a), i.appendChild(f), e.appendChild(i), v = f, d && (y = document.createElement("span"), y.className = "atlas-progress-label", y.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: ${s / 4}px;
        font-weight: 600;
        color: currentColor;
      `, y.textContent = `${Math.round(h)}%`, e.appendChild(y)), _ && w();
	}
	function C() {
		v && (v.style.width = "30%", v.style.animation = "atlas-progress-indeterminate 1.5s ease-in-out infinite");
	}
	function w() {
		let t = e.querySelector("svg");
		if (t && (t.style.animation = "atlas-spin 1.5s linear infinite"), v) {
			let e = (s - c) / 2, t = 2 * Math.PI * e;
			v.setAttribute("stroke-dasharray", `${t * .25} ${t * .75}`), v.setAttribute("stroke-dashoffset", "0");
		}
	}
	function T() {
		if (n === "linear" && v) v.style.animation = "", v.style.width = `${h}%`;
		else {
			let t = e.querySelector("svg");
			t && (t.style.animation = "");
		}
	}
	let E = (t) => {
		let r = Math.max(0, Math.min(100, t));
		if (r !== h) {
			if (h = r, g = "loading", _ && D(!1), e.setAttribute("aria-valuenow", String(h)), n === "linear" && v) v.style.width = `${h}%`;
			else if (n === "circular" && v) {
				let e = (s - c) / 2, t = 2 * Math.PI * e, n = t - h / 100 * t;
				v.setAttribute("stroke-dashoffset", String(n));
			}
			y && (y.textContent = `${Math.round(h)}%`), f && h % 25 == 0 && ca(`Progress: ${Math.round(h)}%`, "polite"), p?.(h), h >= 100 && m?.();
		}
	}, D = (t) => {
		_ !== t && (_ = t, t ? (e.removeAttribute("aria-valuenow"), g = "loading", n === "linear" ? C() : w()) : (e.setAttribute("aria-valuenow", String(h)), T()));
	};
	return {
		get value() {
			return h;
		},
		get visualState() {
			return g;
		},
		setValue: E,
		setIndeterminate: D,
		complete: () => {
			if (E(100), g = "success", v) {
				let t = "var(--atlas-success, #22c55e)";
				n === "linear" ? v.style.background = t : v.setAttribute("stroke", t), e.animate && e.animate([
					{ transform: "scale(1)" },
					{ transform: "scale(1.05)" },
					{ transform: "scale(1)" }
				], {
					duration: 300,
					easing: G.bounce
				});
			}
			d && y && (y.textContent = "✓"), ca("Progress complete", "polite");
		},
		error: () => {
			if (g = "error", v) {
				let t = "var(--atlas-error, #ef4444)";
				n === "linear" ? v.style.background = t : v.setAttribute("stroke", t), e.animate && e.animate([
					{ transform: "translateX(0)" },
					{ transform: "translateX(-3px)" },
					{ transform: "translateX(3px)" },
					{ transform: "translateX(-3px)" },
					{ transform: "translateX(0)" }
				], {
					duration: 300,
					easing: "ease-in-out"
				});
			}
			d && y && (y.textContent = "✕"), ca("Progress error", "assertive");
		},
		reset: () => {
			h = 0, g = "idle", _ = i, n === "linear" ? x() : S();
		},
		destroy: () => {
			e.innerHTML = b, e.removeAttribute("role"), e.removeAttribute("aria-valuemin"), e.removeAttribute("aria-valuemax"), e.removeAttribute("aria-valuenow"), e.style.cssText = "";
		}
	};
}
function vc() {
	return {
		get value() {
			return 0;
		},
		get visualState() {
			return "idle";
		},
		setValue: () => {},
		setIndeterminate: () => {},
		complete: () => {},
		error: () => {},
		reset: () => {},
		destroy: () => {}
	};
}
function yc(e, t = {}) {
	if (!V()) return bc();
	let { name: n, value: r, disabled: i = !1, orientation: a = "vertical", onChange: o } = t, s = r ?? null, c = i, l = null, u = [];
	e.classList.add("atlas-radio-group"), e.setAttribute("role", "radiogroup"), n && e.setAttribute("aria-label", n);
	function d() {
		return Array.from(e.querySelectorAll("[role=\"radio\"], [data-atlas-radio]"));
	}
	function f() {
		d().forEach((e) => {
			let t = (e.dataset.value || e.getAttribute("value") || "") === s, n = c || e.hasAttribute("data-disabled");
			e.setAttribute("aria-checked", String(t)), t ? e.classList.add("atlas-radio-checked") : e.classList.remove("atlas-radio-checked"), n ? (e.setAttribute("aria-disabled", "true"), e.classList.add("atlas-radio-disabled")) : (e.removeAttribute("aria-disabled"), e.classList.remove("atlas-radio-disabled"));
		});
	}
	function p(e) {
		if (c || e.hasAttribute("data-disabled")) return;
		let t = e.dataset.value || e.getAttribute("value") || "";
		t !== s && (s = t, f(), e.animate && e.animate([{ transform: "scale(0.95)" }, { transform: "scale(1)" }], {
			duration: W.fast,
			easing: G.bounce
		}), o?.(s));
	}
	return l = Sa(e, {
		orientation: a,
		itemSelector: "[role=\"radio\"], [data-atlas-radio]",
		onFocusChange: (e) => {
			p(e);
		}
	}), d().forEach((e) => {
		e.hasAttribute("role") || e.setAttribute("role", "radio"), e.classList.add("atlas-radio"), u.push(H(e, "click", () => {
			p(e), e.focus();
		}));
	}), f(), {
		get value() {
			return s;
		},
		get isDisabled() {
			return c;
		},
		setValue: (e) => {
			s !== e && (s = e, f(), o?.(s));
		},
		setDisabled: (e) => {
			c = e, f();
		},
		setOptionDisabled: (e, t) => {
			let n = d().find((t) => (t.dataset.value || t.getAttribute("value") || "") === e);
			n && (t ? n.setAttribute("data-disabled", "") : n.removeAttribute("data-disabled"), f());
		},
		focus: () => {
			let e = d();
			(e.find((e) => (e.dataset.value || e.getAttribute("value") || "") === s) || e[0])?.focus();
		},
		destroy: () => {
			l?.destroy(), u.forEach((e) => e()), e.classList.remove("atlas-radio-group"), e.removeAttribute("role"), e.removeAttribute("aria-label"), d().forEach((e) => {
				e.classList.remove("atlas-radio", "atlas-radio-checked", "atlas-radio-disabled"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled");
			});
		}
	};
}
function bc() {
	return {
		get value() {
			return null;
		},
		get isDisabled() {
			return !1;
		},
		setValue: () => {},
		setDisabled: () => {},
		setOptionDisabled: () => {},
		focus: () => {},
		destroy: () => {}
	};
}
var Q = {
	ROOT: "data-atlas-select",
	TRIGGER: "data-atlas-select-trigger",
	CONTENT: "data-atlas-select-content",
	SEARCH: "data-atlas-select-search",
	OPTION: "data-atlas-select-option",
	GROUP: "data-atlas-select-group",
	GROUP_LABEL: "data-atlas-select-group-label",
	VALUE: "data-value",
	SELECTED: "data-selected",
	DISABLED: "data-disabled",
	HIGHLIGHTED: "data-highlighted",
	EMPTY: "data-empty"
}, xc = {
	ROOT: "atlas-select",
	TRIGGER: "atlas-select-trigger",
	TRIGGER_TEXT: "atlas-select-trigger-text",
	TRIGGER_ICON: "atlas-select-trigger-icon",
	TRIGGER_CLEAR: "atlas-select-trigger-clear",
	TAGS: "atlas-select-tags",
	TAG: "atlas-select-tag",
	TAG_REMOVE: "atlas-select-tag-remove",
	CONTENT: "atlas-select-content",
	SEARCH: "atlas-select-search",
	SEARCH_INPUT: "atlas-select-search-input",
	OPTIONS: "atlas-select-options",
	OPTION: "atlas-select-option",
	OPTION_CHECK: "atlas-select-option-check",
	GROUP: "atlas-select-group",
	GROUP_LABEL: "atlas-select-group-label",
	EMPTY: "atlas-select-empty"
};
function Sc(e) {
	let t = [];
	for (let n of e) "options" in n ? t.push(...n.options) : t.push(n);
	return t;
}
function Cc(e, t) {
	return e.label.toLowerCase().includes(t.toLowerCase());
}
function wc(e, t) {
	return `${t ? `<span class="${xc.OPTION_CHECK}">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
       </span>` : `<span class="${xc.OPTION_CHECK}"></span>`}<span>${e.label}</span>`;
}
function Tc(e) {
	return e.length === 0 ? "" : e.length === 1 ? e[0].label : `${e.length} selected`;
}
function Ec(e, t) {
	if (!V()) return {
		getValue: () => t.multiple ? [] : "",
		getSelected: () => [],
		setValue: () => {},
		open: () => {},
		close: () => {},
		toggle: () => {},
		isOpen: () => !1,
		focus: () => {},
		setOptions: () => {},
		clear: () => {},
		setDisabled: () => {},
		destroy: () => {}
	};
	let n = t.options, r = Sc(n), i = new Set(Array.isArray(t.value) ? t.value : t.value ? [t.value] : []), a = !1, o = "", s = -1, c = t.disabled ?? !1, { placeholder: l = "Select...", multiple: u = !1, searchable: d = !1, searchPlaceholder: f = "Search...", clearable: p = !1, maxSelections: m, placement: h = "bottom-start", closeOnSelect: g = !u, filterFn: _ = Cc, renderOption: v = wc, renderValue: y = Tc, onChange: b, onOpen: x, onClose: S, onSearch: C } = t, w = B("select"), T = `${w}-trigger`, E = `${w}-content`, D = `${w}-search`, O = `${w}-listbox`, k = null, A = null, j = null, M = null, N = null, P = null, F = null, I = null;
	function ee() {
		if (e.innerHTML = "", e.setAttribute(Q.ROOT, ""), e.classList.add(xc.ROOT), k = document.createElement("button"), k.type = "button", k.id = T, k.className = xc.TRIGGER, k.setAttribute(Q.TRIGGER, ""), k.setAttribute("aria-haspopup", "listbox"), k.setAttribute("aria-expanded", "false"), k.setAttribute("aria-controls", E), c && (k.disabled = !0, k.setAttribute(Q.DISABLED, "")), L(), e.appendChild(k), A = document.createElement("div"), A.id = E, A.className = xc.CONTENT, A.setAttribute(Q.CONTENT, ""), A.setAttribute("role", "dialog"), A.setAttribute("aria-labelledby", T), A.hidden = !0, d) {
			let e = document.createElement("div");
			e.className = xc.SEARCH, j = document.createElement("input"), j.type = "text", j.id = D, j.className = xc.SEARCH_INPUT, j.placeholder = f, j.setAttribute(Q.SEARCH, ""), j.setAttribute("aria-controls", O), j.setAttribute("aria-autocomplete", "list"), e.appendChild(j), A.appendChild(e);
		}
		M = document.createElement("div"), M.id = O, M.className = xc.OPTIONS, M.setAttribute("role", "listbox"), M.setAttribute("aria-multiselectable", String(u)), te(), A.appendChild(M), document.body.appendChild(A);
	}
	function L() {
		let e = ie();
		if (u && e.length > 0) {
			let t = e.map((e) => `
          <span class="${xc.TAG}" data-value="${e.value}">
            ${e.label}
            <button type="button" class="${xc.TAG_REMOVE}" aria-label="Remove ${e.label}">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </span>
        `).join("");
			k.innerHTML = `
        <span class="${xc.TAGS}">${t}</span>
        <span class="${xc.TRIGGER_ICON}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;
		} else {
			let t = e.length > 0 ? y(e) : l, n = e.length === 0, r = "";
			p && e.length > 0 && (r = `
          <button type="button" class="${xc.TRIGGER_CLEAR}" aria-label="Clear selection">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        `), k.innerHTML = `
        <span class="${xc.TRIGGER_TEXT}" ${n ? "data-placeholder=\"true\"" : ""}>${t}</span>
        ${r}
        <span class="${xc.TRIGGER_ICON}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;
		}
	}
	function te() {
		let e = o ? r.filter((e) => _(e, o)) : r;
		if (e.length === 0) {
			M.innerHTML = `<div class="${xc.EMPTY}" ${Q.EMPTY}>No options found</div>`, M.setAttribute("aria-activedescendant", "");
			return;
		}
		let t = /* @__PURE__ */ new Map(), n = [];
		for (let r of e) if (r.group) {
			let e = t.get(r.group) || [];
			e.push(r), t.set(r.group, e);
		} else n.push(r);
		let i = "";
		for (let e of n) i += ne(e);
		for (let [e, n] of t) i += `
        <div class="${xc.GROUP}" ${Q.GROUP} role="group" aria-label="${e}">
          <div class="${xc.GROUP_LABEL}" ${Q.GROUP_LABEL}>${e}</div>
          ${n.map((e) => ne(e)).join("")}
        </div>
      `;
		M.innerHTML = i, s === -1 && e.length > 0 && R(0);
	}
	function ne(e) {
		let t = i.has(e.value), n = e.disabled ?? !1;
		return `
      <div
        id="${`${w}-option-${e.value}`}"
        class="${xc.OPTION}"
        role="option"
        ${Q.OPTION}
        ${Q.VALUE}="${e.value}"
        ${t ? `${Q.SELECTED}` : ""}
        ${n ? `${Q.DISABLED}` : ""}
        aria-selected="${t}"
        aria-disabled="${n}"
      >
        ${v(e, t)}
      </div>
    `;
	}
	function re() {
		return Array.from(M.querySelectorAll(`[${Q.OPTION}]:not([${Q.DISABLED}])`));
	}
	function R(e) {
		let t = re();
		if (t.forEach((e) => e.removeAttribute(Q.HIGHLIGHTED)), e >= 0 && e < t.length) {
			let n = t[e];
			n.setAttribute(Q.HIGHLIGHTED, ""), n.scrollIntoView({ block: "nearest" }), M.setAttribute("aria-activedescendant", n.id), s = e;
		}
	}
	function ie() {
		return r.filter((e) => i.has(e.value));
	}
	function ae(e) {
		let t = r.find((t) => t.value === e);
		if (!t || t.disabled) return;
		if (u) {
			if (i.has(e)) i.delete(e);
			else {
				if (m && i.size >= m) return;
				i.add(e);
			}
		} else i.clear(), i.add(e);
		L(), te();
		let n = ie(), a = u ? Array.from(i) : e;
		b?.(a, n), g && ce();
	}
	function oe() {
		i.clear(), L(), te(), b?.(u ? [] : "", []);
	}
	function se() {
		if (a || c) return;
		a = !0, A.hidden = !1, k.setAttribute("aria-expanded", "true");
		let e = () => {
			let e = Pa(k, A, {
				placement: h,
				offset: 4,
				flip: !0
			});
			Fa(A, e);
		};
		e(), I = Ia(k, A, e), j ? (j.value = "", o = "", te(), j.focus()) : (R(0), M.focus()), N = Sa(M, {
			itemSelector: `[${Q.OPTION}]:not([${Q.DISABLED}])`,
			orientation: "vertical",
			loop: !0,
			onFocusChange: (e, t) => {
				s = t;
			}
		}), d || (P = Ca(M, {
			itemSelector: `[${Q.OPTION}]:not([${Q.DISABLED}])`,
			onMatch: (e, t) => {
				R(t);
			}
		})), F = La(A, {
			onDismiss: ce,
			escapeKey: !0,
			clickOutside: !0,
			ignore: [k]
		}), x?.();
	}
	function ce() {
		a && (a = !1, A.hidden = !0, k.setAttribute("aria-expanded", "false"), I?.(), I = null, N?.destroy(), N = null, P?.destroy(), P = null, F?.destroy(), F = null, o = "", s = -1, k.focus(), S?.());
	}
	function le() {
		a ? ce() : se();
	}
	function ue(e) {
		let t = e.target;
		if (t.closest(`.${xc.TRIGGER_CLEAR}`)) {
			e.stopPropagation(), oe();
			return;
		}
		let n = t.closest(`.${xc.TAG_REMOVE}`);
		if (n) {
			e.stopPropagation();
			let t = n.closest(`.${xc.TAG}`)?.dataset.value;
			if (t) {
				i.delete(t), L(), te();
				let e = ie();
				b?.(Array.from(i), e);
			}
			return;
		}
		le();
	}
	function de(e) {
		switch (e.key) {
			case "Enter":
			case " ":
			case "ArrowDown":
			case "ArrowUp": e.preventDefault(), se();
		}
	}
	function fe(e) {
		let t = e.target.closest(`[${Q.OPTION}]`);
		if (t && !t.hasAttribute(Q.DISABLED)) {
			let e = t.getAttribute(Q.VALUE);
			e && ae(e);
		}
	}
	function pe(e) {
		let t = re();
		switch (e.key) {
			case "Enter":
			case " ":
				if (e.preventDefault(), s >= 0 && s < t.length) {
					let e = t[s].getAttribute(Q.VALUE);
					e && ae(e);
				}
				break;
			case "ArrowDown":
				e.preventDefault(), R(Math.min(s + 1, t.length - 1));
				break;
			case "ArrowUp":
				e.preventDefault(), R(Math.max(s - 1, 0));
				break;
			case "Home":
				e.preventDefault(), R(0);
				break;
			case "End":
				e.preventDefault(), R(t.length - 1);
				break;
			case "Tab": ce();
		}
	}
	function me(e) {
		o = e.target.value, s = -1, te(), C?.(o);
	}
	function he(e) {
		let t = re();
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault(), R(Math.min(s + 1, t.length - 1));
				break;
			case "ArrowUp":
				e.preventDefault(), R(Math.max(s - 1, 0));
				break;
			case "Enter":
				if (e.preventDefault(), s >= 0 && s < t.length) {
					let e = t[s].getAttribute(Q.VALUE);
					e && ae(e);
				}
				break;
			case "Escape": ce();
		}
	}
	if (ee(), k.addEventListener("click", ue), k.addEventListener("keydown", de), M.addEventListener("click", fe), M.addEventListener("keydown", pe), j !== null) {
		let e = j;
		e.addEventListener("input", me), e.addEventListener("keydown", he);
	}
	return {
		getValue() {
			return u ? Array.from(i) : Array.from(i)[0] || "";
		},
		getSelected: ie,
		setValue(e) {
			i.clear();
			let t = Array.isArray(e) ? e : [e];
			for (let e of t) r.some((t) => t.value === e) && i.add(e);
			L(), te();
		},
		open: se,
		close: ce,
		toggle: le,
		isOpen() {
			return a;
		},
		focus() {
			k.focus();
		},
		setOptions(e) {
			n = e, r = Sc(n);
			for (let e of i) r.some((t) => t.value === e) || i.delete(e);
			L(), a && te();
		},
		clear() {
			oe();
		},
		setDisabled(e) {
			c = e, k.disabled = c, c ? (k.setAttribute(Q.DISABLED, ""), ce()) : k.removeAttribute(Q.DISABLED);
		},
		destroy() {
			ce(), k.removeEventListener("click", ue), k.removeEventListener("keydown", de), M.removeEventListener("click", fe), M.removeEventListener("keydown", pe), j && (j.removeEventListener("input", me), j.removeEventListener("keydown", he)), A.remove(), e.innerHTML = "";
		}
	};
}
var Dc = class extends HTMLElement {
	constructor() {
		super(...arguments), this._select = null, this._options = [];
	}
	static get observedAttributes() {
		return [
			"placeholder",
			"disabled",
			"multiple",
			"searchable",
			"clearable",
			"value"
		];
	}
	connectedCallback() {
		this._parseOptions(), this._init();
	}
	disconnectedCallback() {
		this._select?.destroy(), this._select = null;
	}
	attributeChangedCallback(e, t, n) {
		if (this._select) switch (e) {
			case "disabled":
				this._select.setDisabled(n !== null);
				break;
			case "value": if (n) {
				let e = n.includes(",") ? n.split(",") : n;
				this._select.setValue(e);
			}
		}
	}
	_parseOptions() {
		let e = this.getAttribute("data-options");
		if (e) try {
			this._options = JSON.parse(e);
			return;
		} catch {
			console.warn("[AtlasSelect] Invalid JSON in data-options");
		}
		let t = [];
		for (let e of Array.from(this.children)) if (e.tagName === "OPTGROUP") {
			let n = {
				label: e.getAttribute("label") || "",
				options: []
			};
			for (let t of Array.from(e.children)) t.tagName === "OPTION" && n.options.push({
				value: t.getAttribute("value") || t.textContent || "",
				label: t.textContent || "",
				disabled: t.hasAttribute("disabled")
			});
			t.push(n);
		} else e.tagName === "OPTION" && t.push({
			value: e.getAttribute("value") || e.textContent || "",
			label: e.textContent || "",
			disabled: e.hasAttribute("disabled")
		});
		this._options = t;
	}
	_init() {
		this.innerHTML = "", this._select = Ec(this, {
			options: this._options,
			placeholder: this.getAttribute("placeholder") || void 0,
			disabled: this.hasAttribute("disabled"),
			multiple: this.hasAttribute("multiple"),
			searchable: this.hasAttribute("searchable"),
			clearable: this.hasAttribute("clearable"),
			value: this.getAttribute("value") || void 0,
			onChange: (e, t) => {
				this.dispatchEvent(new CustomEvent("change", {
					detail: {
						value: e,
						options: t
					},
					bubbles: !0
				}));
			}
		});
	}
	get value() {
		return this._select?.getValue() || "";
	}
	set value(e) {
		this._select?.setValue(e);
	}
	get selected() {
		return this._select?.getSelected() || [];
	}
	open() {
		this._select?.open();
	}
	close() {
		this._select?.close();
	}
	clear() {
		this._select?.clear();
	}
};
V() && !customElements.get("atlas-select") && customElements.define("atlas-select", Dc);
function Oc(e, t = {}) {
	if (!V()) return kc();
	let { orientation: n = "horizontal", decorative: r = !0, label: i } = t, a = n;
	e.classList.add("atlas-separator"), o(a), r ? (e.setAttribute("role", "none"), e.setAttribute("aria-hidden", "true")) : (e.setAttribute("role", "separator"), e.setAttribute("aria-orientation", a), i && e.setAttribute("aria-label", i));
	function o(t) {
		e.classList.remove("atlas-separator-horizontal", "atlas-separator-vertical"), e.classList.add(`atlas-separator-${t}`), r || e.setAttribute("aria-orientation", t), t === "horizontal" ? (e.style.height = "1px", e.style.width = "100%") : (e.style.width = "1px", e.style.height = "100%");
	}
	return {
		get orientation() {
			return a;
		},
		setOrientation: (e) => {
			a = e, o(a);
		},
		destroy: () => {
			e.classList.remove("atlas-separator", "atlas-separator-horizontal", "atlas-separator-vertical"), e.removeAttribute("role"), e.removeAttribute("aria-hidden"), e.removeAttribute("aria-orientation"), e.removeAttribute("aria-label"), e.style.width = "", e.style.height = "";
		}
	};
}
function kc() {
	return {
		get orientation() {
			return "horizontal";
		},
		setOrientation: () => {},
		destroy: () => {}
	};
}
function Ac(e, t, n, r, i) {
	let { stiffness: a, damping: o, mass: s } = r, c = n + (-a * (e - t) + -o * n) / s * i, l = e + c * i, u = Math.abs(t - l) < .001 && Math.abs(c) < .001;
	return {
		value: u ? t : l,
		velocity: u ? 0 : c,
		done: u
	};
}
function jc(e, t, n = {}, r, i) {
	if (!V()) return r(t), i?.(), () => {};
	let a = {
		stiffness: n.stiffness ?? 100,
		damping: n.damping ?? 10,
		mass: n.mass ?? 1,
		velocity: n.velocity ?? 0
	}, o = e, s = a.velocity, c = performance.now(), l = null;
	function u(e) {
		let n = Math.min((e - c) / 1e3, .064);
		c = e;
		let d = Ac(o, t, s, a, n);
		o = d.value, s = d.velocity, r(o), d.done ? (l = null, i?.()) : l = requestAnimationFrame(u);
	}
	return l = requestAnimationFrame(u), () => {
		l !== null && (cancelAnimationFrame(l), l = null);
	};
}
var Mc = {
	fade: {
		enter: "opacity: 0 -> opacity: 1",
		exit: "opacity: 1 -> opacity: 0"
	},
	"slide-up": {
		enter: "transform: translateY(10px); opacity: 0 -> transform: translateY(0); opacity: 1",
		exit: "transform: translateY(0); opacity: 1 -> transform: translateY(-10px); opacity: 0"
	},
	"slide-down": {
		enter: "transform: translateY(-10px); opacity: 0 -> transform: translateY(0); opacity: 1",
		exit: "transform: translateY(0); opacity: 1 -> transform: translateY(10px); opacity: 0"
	},
	"slide-left": {
		enter: "transform: translateX(10px); opacity: 0 -> transform: translateX(0); opacity: 1",
		exit: "transform: translateX(0); opacity: 1 -> transform: translateX(-10px); opacity: 0"
	},
	"slide-right": {
		enter: "transform: translateX(-10px); opacity: 0 -> transform: translateX(0); opacity: 1",
		exit: "transform: translateX(0); opacity: 1 -> transform: translateX(10px); opacity: 0"
	},
	scale: {
		enter: "transform: scale(0.95); opacity: 0 -> transform: scale(1); opacity: 1",
		exit: "transform: scale(1); opacity: 1 -> transform: scale(0.95); opacity: 0"
	},
	"scale-up": {
		enter: "transform: scale(0.9); opacity: 0 -> transform: scale(1); opacity: 1",
		exit: "transform: scale(1); opacity: 1 -> transform: scale(1.1); opacity: 0"
	},
	"scale-down": {
		enter: "transform: scale(1.1); opacity: 0 -> transform: scale(1); opacity: 1",
		exit: "transform: scale(1); opacity: 1 -> transform: scale(0.9); opacity: 0"
	},
	"flip-x": {
		enter: "transform: perspective(400px) rotateX(90deg); opacity: 0 -> transform: perspective(400px) rotateX(0); opacity: 1",
		exit: "transform: perspective(400px) rotateX(0); opacity: 1 -> transform: perspective(400px) rotateX(-90deg); opacity: 0"
	},
	"flip-y": {
		enter: "transform: perspective(400px) rotateY(90deg); opacity: 0 -> transform: perspective(400px) rotateY(0); opacity: 1",
		exit: "transform: perspective(400px) rotateY(0); opacity: 1 -> transform: perspective(400px) rotateY(-90deg); opacity: 0"
	},
	rotate: {
		enter: "transform: rotate(-10deg) scale(0.95); opacity: 0 -> transform: rotate(0) scale(1); opacity: 1",
		exit: "transform: rotate(0) scale(1); opacity: 1 -> transform: rotate(10deg) scale(0.95); opacity: 0"
	},
	blur: {
		enter: "filter: blur(8px); opacity: 0 -> filter: blur(0); opacity: 1",
		exit: "filter: blur(0); opacity: 1 -> filter: blur(8px); opacity: 0"
	},
	"blur-fade": {
		enter: "filter: blur(12px); opacity: 0; transform: scale(1.02) -> filter: blur(0); opacity: 1; transform: scale(1)",
		exit: "filter: blur(0); opacity: 1; transform: scale(1) -> filter: blur(12px); opacity: 0; transform: scale(0.98)"
	}
};
function Nc(e) {
	let [t, n] = e.split(" -> "), r = {}, i = {};
	for (let e of t.split(";")) {
		let [t, n] = e.split(":").map((e) => e.trim());
		t && n && (r[t] = n);
	}
	for (let e of n.split(";")) {
		let [t, n] = e.split(":").map((e) => e.trim());
		t && n && (i[t] = n);
	}
	return {
		from: r,
		to: i
	};
}
function Pc(e, t = {}) {
	let { duration: n = 200, easing: r = "ease-out", delay: i = 0, preset: a = "fade", onStart: o, onEnd: s } = t, c = "idle", l = null, u = Mc[a], d = Nc(u.enter), f = Nc(u.exit);
	function p(t) {
		for (let [n, r] of Object.entries(t)) e.style.setProperty(n, r);
	}
	function m(t, a, u) {
		return new Promise((d) => {
			if (!V()) {
				p(a), c = u === "entering" ? "entered" : "exited", d();
				return;
			}
			l?.(), c = u, o?.(c), p(t), e.offsetHeight;
			let f = Object.keys(a);
			e.style.transition = f.map((e) => `${e} ${n}ms ${r} ${i}ms`).join(", "), p(a);
			let m = (t) => {
				t && t.target !== e || (e.removeEventListener("transitionend", m), e.style.transition = "", l = null, c = u === "entering" ? "entered" : "exited", s?.(c), d());
			};
			l = () => {
				e.removeEventListener("transitionend", m), e.style.transition = "", l = null;
			}, e.addEventListener("transitionend", m, { once: !1 }), setTimeout(() => {
				l && m();
			}, n + i + 50);
		});
	}
	return {
		get state() {
			return c;
		},
		enter() {
			return m(d.from, d.to, "entering");
		},
		exit() {
			return m(f.from, f.to, "exiting");
		},
		async toggle() {
			c === "idle" || c === "exited" ? await this.enter() : await this.exit();
		},
		cancel() {
			l?.(), c = "idle";
		},
		destroy() {
			l?.(), e.style.transition = "";
		}
	};
}
var Fc = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	standard: "cubic-bezier(0.4, 0, 0.2, 1)",
	decelerate: "cubic-bezier(0, 0, 0.2, 1)",
	accelerate: "cubic-bezier(0.4, 0, 1, 1)",
	emphasized: "cubic-bezier(0.2, 0, 0, 1)",
	bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
	elastic: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
	smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
	smoothIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
	smoothOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
	smoothInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
	sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
	sharpIn: "cubic-bezier(0.55, 0, 1, 0.45)",
	sharpOut: "cubic-bezier(0, 0.55, 0.45, 1)"
}, Ic = {
	linear: (e) => e,
	easeInQuad: (e) => e * e,
	easeOutQuad: (e) => e * (2 - e),
	easeInOutQuad: (e) => e < .5 ? 2 * e * e : -1 + (4 - 2 * e) * e,
	easeInCubic: (e) => e * e * e,
	easeOutCubic: (e) => --e * e * e + 1,
	easeInOutCubic: (e) => e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1,
	easeInQuart: (e) => e * e * e * e,
	easeOutQuart: (e) => 1 - --e * e * e * e,
	easeInOutQuart: (e) => e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e,
	easeOutElastic: (e) => {
		let t = .3;
		return 2 ** (-10 * e) * Math.sin((e - t / 4) * (2 * Math.PI) / t) + 1;
	},
	easeOutBounce: (e) => {
		let t = e;
		return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? (t -= 1.5 / 2.75, 7.5625 * t * t + .75) : t < 2.5 / 2.75 ? (t -= 2.25 / 2.75, 7.5625 * t * t + .9375) : (t -= 2.625 / 2.75, 7.5625 * t * t + .984375);
	}
}, Lc = {
	instant: 0,
	fastest: 50,
	faster: 100,
	fast: 150,
	normal: 200,
	slow: 300,
	slower: 400,
	slowest: 500,
	micro: 100,
	short: 150,
	medium: 250,
	long: 400,
	tooltip: 150,
	modal: 250,
	page: 400,
	loading: 1e3
}, Rc = /* @__PURE__ */ new Map();
function zc(e, t) {
	Rc.set(e, {
		name: e,
		...t
	});
}
function Bc(e) {
	return Rc.get(e);
}
function Vc() {
	return new Map(Rc);
}
var Hc = {
	keyframes: [{ opacity: 0 }, { opacity: 1 }],
	options: {
		duration: Lc.normal,
		easing: Fc.smooth,
		fill: "forwards"
	}
}, Uc = {
	keyframes: [{ opacity: 1 }, { opacity: 0 }],
	options: {
		duration: Lc.normal,
		easing: Fc.smooth,
		fill: "forwards"
	}
}, Wc = {
	keyframes: [{
		opacity: 0,
		transform: "scale(0.95)"
	}, {
		opacity: 1,
		transform: "scale(1)"
	}],
	options: {
		duration: Lc.normal,
		easing: Fc.decelerate,
		fill: "forwards"
	}
}, Gc = {
	keyframes: [{
		opacity: 1,
		transform: "scale(1)"
	}, {
		opacity: 0,
		transform: "scale(0.95)"
	}],
	options: {
		duration: Lc.fast,
		easing: Fc.accelerate,
		fill: "forwards"
	}
}, Kc = {
	keyframes: [{
		opacity: 0,
		transform: "translateY(10px)"
	}, {
		opacity: 1,
		transform: "translateY(0)"
	}],
	options: {
		duration: Lc.normal,
		easing: Fc.decelerate,
		fill: "forwards"
	}
}, qc = {
	keyframes: [{
		opacity: 0,
		transform: "translateY(-10px)"
	}, {
		opacity: 1,
		transform: "translateY(0)"
	}],
	options: {
		duration: Lc.normal,
		easing: Fc.decelerate,
		fill: "forwards"
	}
}, Jc = {
	keyframes: [{
		opacity: 0,
		transform: "translateX(-10px)"
	}, {
		opacity: 1,
		transform: "translateX(0)"
	}],
	options: {
		duration: Lc.normal,
		easing: Fc.decelerate,
		fill: "forwards"
	}
}, Yc = {
	keyframes: [{
		opacity: 0,
		transform: "translateX(10px)"
	}, {
		opacity: 1,
		transform: "translateX(0)"
	}],
	options: {
		duration: Lc.normal,
		easing: Fc.decelerate,
		fill: "forwards"
	}
}, Xc = {
	keyframes: [{
		opacity: 1,
		transform: "translateY(0)"
	}, {
		opacity: 0,
		transform: "translateY(-10px)"
	}],
	options: {
		duration: Lc.fast,
		easing: Fc.accelerate,
		fill: "forwards"
	}
}, Zc = {
	keyframes: [{
		opacity: 1,
		transform: "translateY(0)"
	}, {
		opacity: 0,
		transform: "translateY(10px)"
	}],
	options: {
		duration: Lc.fast,
		easing: Fc.accelerate,
		fill: "forwards"
	}
}, Qc = {
	keyframes: [
		{
			opacity: 0,
			transform: "scale(0.3)"
		},
		{
			opacity: 1,
			transform: "scale(1.05)"
		},
		{ transform: "scale(0.9)" },
		{ transform: "scale(1.03)" },
		{ transform: "scale(0.97)" },
		{ transform: "scale(1)" }
	],
	options: {
		duration: Lc.slow,
		easing: Fc.bounce,
		fill: "forwards"
	}
}, $c = {
	keyframes: [
		{ transform: "scale(1)" },
		{ transform: "scale(0.9)" },
		{
			opacity: 1,
			transform: "scale(1.1)"
		},
		{
			opacity: 0,
			transform: "scale(0.3)"
		}
	],
	options: {
		duration: Lc.slow,
		easing: Fc.bounce,
		fill: "forwards"
	}
}, el = {
	keyframes: [
		{ transform: "translateX(0)" },
		{ transform: "translateX(-10px)" },
		{ transform: "translateX(10px)" },
		{ transform: "translateX(-10px)" },
		{ transform: "translateX(10px)" },
		{ transform: "translateX(0)" }
	],
	options: {
		duration: Lc.slow,
		easing: Fc.smooth
	}
}, tl = {
	keyframes: [
		{ transform: "scale(1)" },
		{ transform: "scale(1.05)" },
		{ transform: "scale(1)" }
	],
	options: {
		duration: Lc.medium,
		easing: Fc.smooth
	}
}, nl = {
	keyframes: [
		{ transform: "rotate(0deg)" },
		{ transform: "rotate(-5deg)" },
		{ transform: "rotate(5deg)" },
		{ transform: "rotate(-5deg)" },
		{ transform: "rotate(5deg)" },
		{ transform: "rotate(0deg)" }
	],
	options: {
		duration: Lc.slow,
		easing: Fc.smooth
	}
}, rl = {
	keyframes: [
		{ transform: "scale(1)" },
		{ transform: "scale(1.15)" },
		{ transform: "scale(1.05)" },
		{ transform: "scale(1.25)" },
		{ transform: "scale(1)" }
	],
	options: {
		duration: Lc.slow,
		easing: Fc.smooth
	}
}, il = {
	keyframes: [
		{
			transform: "scale(1)",
			opacity: 1
		},
		{
			transform: "scale(1.02)",
			opacity: .9
		},
		{
			transform: "scale(1)",
			opacity: 1
		}
	],
	options: {
		duration: 2e3,
		easing: Fc.smooth,
		iterations: Infinity
	}
}, al = {
	keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
	options: {
		duration: Lc.loading,
		easing: Fc.linear,
		iterations: Infinity
	}
};
zc("fadeIn", {
	...Hc,
	description: "Fade in"
}), zc("fadeOut", {
	...Uc,
	description: "Fade out"
}), zc("scaleIn", {
	...Wc,
	description: "Scale in with fade"
}), zc("scaleOut", {
	...Gc,
	description: "Scale out with fade"
}), zc("slideInUp", {
	...Kc,
	description: "Slide in from bottom"
}), zc("slideInDown", {
	...qc,
	description: "Slide in from top"
}), zc("slideInLeft", {
	...Jc,
	description: "Slide in from left"
}), zc("slideInRight", {
	...Yc,
	description: "Slide in from right"
}), zc("slideOutUp", {
	...Xc,
	description: "Slide out to top"
}), zc("slideOutDown", {
	...Zc,
	description: "Slide out to bottom"
}), zc("bounceIn", {
	...Qc,
	description: "Bouncy entrance"
}), zc("bounceOut", {
	...$c,
	description: "Bouncy exit"
}), zc("shake", {
	...el,
	description: "Shake horizontally"
}), zc("pulse", {
	...tl,
	description: "Subtle pulse"
}), zc("wiggle", {
	...nl,
	description: "Wiggle rotation"
}), zc("heartbeat", {
	...rl,
	description: "Heartbeat pulse"
}), zc("breathe", {
	...il,
	description: "Continuous breathing"
}), zc("spin", {
	...al,
	description: "Continuous spin"
});
function ol(e, t, n) {
	let r = typeof t == "string" ? Bc(t) : t;
	if (!r) return console.warn(`[Atlas Animation] Animation "${t}" not found`), e.animate([], {});
	let i = {
		...r.options,
		...n
	};
	return e.animate(r.keyframes, i);
}
async function sl(e, t, n) {
	await ol(e, t, n).finished;
}
function cl(e = {}) {
	let { stiffness: t = 100, damping: n = 10, mass: r = 1 } = e, i = e.velocity ?? 0;
	return (e, a) => {
		let o = (-t * (e - a) + -n * i) / r;
		return i += 1 / 60 * o, e + 1 / 60 * i;
	};
}
var ll = [];
function ul(e) {
	return ll.push(e), () => {
		let t = ll.indexOf(e);
		t > -1 && ll.splice(t, 1);
	};
}
function dl() {
	let e = /* @__PURE__ */ new Map();
	return {
		on(t, n) {
			return e.has(t) || e.set(t, /* @__PURE__ */ new Set()), e.get(t)?.add(n), () => this.off(t, n);
		},
		off(t, n) {
			e.get(t)?.delete(n);
		},
		emit(t, n) {
			e.get(t)?.forEach((e) => {
				try {
					e(n);
				} catch (e) {
					console.error(`[Atlas] Error in event handler for "${String(t)}":`, e);
				}
			});
		}
	};
}
function fl(e) {
	let { name: t, defaults: n, createState: r, setup: i, onUpdate: a, cleanup: o, noopState: s } = e;
	return (e, t) => {
		if (!V()) return pl(s);
		let c = {
			...n,
			...t
		}, l = r(e, c), u = dl(), d = [], f = [], p = [], m = [], h = {
			element: e,
			get state() {
				return l;
			},
			set state(e) {
				l = e;
			},
			options: c,
			on(e, t, n, r) {
				e.addEventListener(t, n, r), d.push(() => e.removeEventListener(t, n, r));
			},
			onEvent(e, t, n, r) {
				e.addEventListener(t, n, r), d.push(() => e.removeEventListener(t, n, r));
			},
			emit(e, t) {
				u.emit(e, t);
			},
			setState(e) {
				let t = { ...l };
				l = {
					...l,
					...e
				}, a?.(h, t), u.emit("change", l);
				for (let e of ll) e.onStateChange?.(g, l);
			},
			onCleanup(e) {
				d.push(e);
			},
			raf(e) {
				let t = requestAnimationFrame(e);
				return f.push(t), t;
			},
			timeout(e, t) {
				let n = window.setTimeout(e, t);
				return p.push(n), n;
			},
			interval(e, t) {
				let n = window.setInterval(e, t);
				return m.push(n), n;
			}
		};
		i(h), c.className && e.classList.add(...c.className.split(" "));
		let g = {
			get state() {
				return l;
			},
			element: e,
			on(e, t) {
				return u.on(e, t);
			},
			update(e) {
				h.setState(e);
			},
			destroy() {
				o?.(h), f.forEach((e) => cancelAnimationFrame(e)), p.forEach((e) => clearTimeout(e)), m.forEach((e) => clearInterval(e)), d.forEach((e) => e()), c.className && e.classList.remove(...c.className.split(" ")), u.emit("destroy", void 0);
				for (let e of ll) e.onComponentDestroy?.(g);
				c.onDestroy?.();
			}
		};
		for (let e of ll) e.onComponentCreate?.(g, c);
		return g;
	};
}
function pl(e) {
	return {
		state: e,
		element: null,
		on: () => () => {},
		update: () => {},
		destroy: () => {}
	};
}
function ml(e, t, n) {
	return (r, i) => {
		if (!V()) return pl({});
		let a = e(r, i), o = dl(), s = t(a);
		return {
			get state() {
				return s;
			},
			element: r,
			on: o.on.bind(o),
			update(e) {
				s = {
					...s,
					...e
				}, o.emit("change", s);
			},
			destroy() {
				n(a)(), o.emit("destroy", void 0);
			}
		};
	};
}
var hl = /* @__PURE__ */ new Map();
function gl() {
	return Array.from(hl.values());
}
function _l(e, t = {}) {
	let { history: n = !1, maxHistory: r = 50, persist: i, compare: a = vl, middleware: o = [] } = t, s = e;
	if (i && typeof localStorage < "u") try {
		let t = localStorage.getItem(i);
		t && (s = {
			...e,
			...JSON.parse(t)
		});
	} catch {}
	let c = n ? [s] : [], l = 0, u = [], d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
	function p(e) {
		for (let t of d) try {
			t(s, e);
		} catch (e) {
			console.error("[Atlas State] Error in subscriber:", e);
		}
		for (let [t, n] of f) {
			let r = t(e), i = t(s);
			if (r !== i) for (let e of n) try {
				e(i, r);
			} catch (e) {
				console.error("[Atlas State] Error in watcher:", e);
			}
		}
	}
	function m() {
		if (i && typeof localStorage < "u") try {
			localStorage.setItem(i, JSON.stringify(s));
		} catch {}
	}
	function h(e, t) {
		let n = t;
		for (let t of o) {
			let r = t(e, n, g);
			r !== void 0 && (n = r);
		}
		return n;
	}
	let g = {
		get() {
			return s;
		},
		select(e) {
			return e(s);
		},
		set(e) {
			let t = s, i = {
				...s,
				...e
			};
			i = h(t, i), !a(t, i) && (s = i, n && (u.length = 0, c.push(s), c.length > r && c.shift(), l = c.length - 1), m(), p(t));
		},
		update(e) {
			let t = e(s);
			this.set(t);
		},
		subscribe(e) {
			return d.add(e), () => d.delete(e);
		},
		watch(e, t) {
			f.has(e) || f.set(e, /* @__PURE__ */ new Set());
			let n = f.get(e);
			return n ? (n.add(t), () => {
				n.delete(t), n.size === 0 && f.delete(e);
			}) : () => {};
		},
		reset() {
			let t = s;
			s = e, n && (c.length = 0, c.push(s), l = 0, u.length = 0), m(), p(t);
		},
		history() {
			return [...c];
		},
		undo() {
			if (!n || l <= 0) return !1;
			let e = s;
			return u.push(s), l--, s = c[l], m(), p(e), !0;
		},
		redo() {
			if (!n || u.length === 0) return !1;
			let e = s, t = u.pop();
			return t ? (l++, s = t, c[l] = s, m(), p(e), !0) : !1;
		},
		destroy() {
			d.clear(), f.clear(), c.length = 0, u.length = 0;
		}
	};
	return g;
}
function vl(e, t) {
	if (e === t) return !0;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r of n) if (e[r] !== t[r]) return !1;
	return !0;
}
function yl(e, t) {
	let n = t(e.get()), r = /* @__PURE__ */ new Set(), i = e.subscribe((e, i) => {
		let a = n;
		n = t(e);
		for (let e of r) e(n, a);
	});
	return {
		get() {
			return n;
		},
		select(e) {
			return e(n);
		},
		subscribe(e) {
			return r.add(e), () => r.delete(e);
		},
		watch(e, t) {
			let r = e(n);
			return this.subscribe((n, i) => {
				let a = e(n);
				a !== r && (t(a, r), r = a);
			});
		},
		history() {
			return [];
		},
		destroy() {
			i(), r.clear();
		}
	};
}
function bl(e) {
	function t() {
		let t = {};
		for (let n in e) t[n] = e[n].get();
		return t;
	}
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i in e) {
		let a = e[i].subscribe(() => {
			let e = t();
			for (let t of n) t(e, e);
		});
		r.push(a);
	}
	return {
		get: t,
		select(e) {
			return e(t());
		},
		subscribe(e) {
			return n.add(e), () => n.delete(e);
		},
		watch(e, n) {
			let r = e(t());
			return this.subscribe((t) => {
				let i = e(t);
				i !== r && (n(i, r), r = i);
			});
		},
		history() {
			return [];
		},
		destroy() {
			r.forEach((e) => e()), n.clear();
		}
	};
}
function xl(e) {
	return (t, n) => (console.group(`[Atlas State] ${e}`), console.log("Previous:", t), console.log("Next:", n), console.groupEnd(), n);
}
function Sl(e) {
	return (t, n) => {
		for (let t in e) {
			let r = e[t];
			if (r && t in n) {
				let e = r(n[t]);
				if (e !== !0) {
					console.warn(`[Atlas State] Validation failed for "${t}": ${e}`);
					return;
				}
			}
		}
		return n;
	};
}
var Cl = {
	OVERLAY: "data-atlas-sheet-overlay",
	CONTENT: "data-atlas-sheet-content",
	TITLE: "data-atlas-sheet-title",
	DESCRIPTION: "data-atlas-sheet-description",
	CLOSE: "data-atlas-sheet-close"
}, wl = {
	ROOT: "atlas-sheet",
	OVERLAY: "atlas-sheet-overlay",
	OPEN: "atlas-sheet--open",
	CLOSING: "atlas-sheet--closing"
}, Tl = {
	top: "atlas-sheet--top",
	right: "atlas-sheet--right",
	bottom: "atlas-sheet--bottom",
	left: "atlas-sheet--left"
}, El = {
	sm: "atlas-sheet--sm",
	default: "atlas-sheet--default",
	lg: "atlas-sheet--lg",
	xl: "atlas-sheet--xl",
	full: "atlas-sheet--full"
};
function Dl(e, t = {}) {
	if (!V()) return Ol();
	let { side: n = "right", size: r = "default", modal: i = !0, closeOnEsc: a = !0, closeOnOverlay: o = !0, open: s = !1 } = t, c = !1, l = n, u = r, d = null, f = B("sheet"), p = null, m = null, h = null, g = null, _ = null;
	function v() {
		e.classList.add(wl.ROOT), e.setAttribute("data-atlas-sheet", ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", i ? "true" : "false"), e.id = f, x(), S(), p = e.querySelector(`[${Cl.OVERLAY}]`), !p && i && (p = document.createElement("div"), p.className = wl.OVERLAY, p.setAttribute(Cl.OVERLAY, ""), e.insertBefore(p, e.firstChild)), m = e.querySelector(`[${Cl.CONTENT}]`), m && m.setAttribute("tabindex", "-1");
		let t = e.querySelector(`[${Cl.TITLE}]`);
		if (t) {
			let n = `${f}-title`;
			t.id = n, e.setAttribute("aria-labelledby", n);
		}
		let n = e.querySelector(`[${Cl.DESCRIPTION}]`);
		if (n) {
			let t = `${f}-desc`;
			n.id = t, e.setAttribute("aria-describedby", t);
		}
		y(), o && p && p.addEventListener("click", b), s && requestAnimationFrame(() => C());
	}
	function y() {
		e.querySelectorAll(`[${Cl.CLOSE}]`).forEach((e) => {
			e.addEventListener("click", w), e.getAttribute("aria-label") || e.setAttribute("aria-label", "Close sheet");
		});
	}
	function b(e) {
		e.target === p && w();
	}
	function x() {
		Object.values(Tl).forEach((t) => {
			e.classList.remove(t);
		}), e.classList.add(Tl[l]);
	}
	function S() {
		Object.values(El).forEach((t) => {
			e.classList.remove(t);
		}), e.classList.add(El[u]);
	}
	function C() {
		c || (c = !0, d = document.activeElement, e.classList.add(wl.OPEN), e.removeAttribute("hidden"), i && (_ = fa()), h = Ra({
			container: m ?? e,
			initialFocus: "container",
			returnFocus: d ?? "previous"
		}), h.activate(), a && (g = La(e, {
			escapeKey: !0,
			clickOutside: !1,
			onDismiss: w
		})), requestAnimationFrame(() => {
			(m ?? e).focus();
		}), t.onOpen?.());
	}
	function w() {
		c && (c = !1, e.classList.add(wl.CLOSING), setTimeout(() => {
			e.classList.remove(wl.OPEN, wl.CLOSING), e.setAttribute("hidden", ""), h?.deactivate(), h = null, g?.destroy(), g = null, _?.(), _ = null, d?.focus(), d = null, t.onClose?.();
		}, W.normal));
	}
	function T() {
		c ? w() : C();
	}
	function E(e) {
		l = e, x();
	}
	function D(e) {
		u = e, S();
	}
	function O() {
		c && (e.classList.remove(wl.OPEN, wl.CLOSING), h?.deactivate(), g?.destroy(), _?.()), p?.removeEventListener("click", b), e.querySelectorAll(`[${Cl.CLOSE}]`).forEach((e) => {
			e.removeEventListener("click", w);
		}), e.classList.remove(wl.ROOT, wl.OPEN, ...Object.values(Tl), ...Object.values(El)), e.removeAttribute("data-atlas-sheet");
	}
	return v(), {
		isOpen: () => c,
		open: C,
		close: w,
		toggle: T,
		setSide: E,
		getSide: () => l,
		setSize: D,
		getSize: () => u,
		destroy: O
	};
}
function Ol() {
	return {
		isOpen: () => !1,
		open: () => {},
		close: () => {},
		toggle: () => {},
		setSide: () => {},
		getSide: () => "right",
		setSize: () => {},
		getSize: () => "default",
		destroy: () => {}
	};
}
var kl = {
	text: {
		height: "1em",
		borderRadius: "4px"
	},
	avatar: {
		width: "48px",
		height: "48px",
		borderRadius: "50%"
	},
	card: {
		height: "200px",
		borderRadius: "8px"
	},
	image: {
		height: "200px",
		borderRadius: "8px"
	},
	custom: {}
}, Al = [
	"100%",
	"95%",
	"85%",
	"90%",
	"75%"
];
function jl(e, t = {}) {
	if (!V()) return Ml();
	let { type: n = "text", animation: r = "shimmer", lines: i = 1, width: a = "100%", height: o, borderRadius: s, className: c, ariaLabel: l = "Loading..." } = t, u = kl[n], d = o || u.height || "1em", f = s || u.borderRadius || "4px", p = n === "avatar" ? u.width : a, m = !0, h = [], g = null;
	if (g = ua("div", {
		className: `atlas-skeleton-wrapper ${c || ""}`.trim(),
		attributes: {
			"data-atlas-skeleton": "",
			role: "status",
			"aria-busy": "true",
			"aria-label": l
		},
		styles: {
			display: "flex",
			flexDirection: "column",
			gap: "8px",
			width: p
		}
	}), !g) return Ml();
	let _ = (e, t) => {
		let n = ua("div", {
			className: "atlas-skeleton",
			styles: {
				width: e,
				height: t,
				borderRadius: f,
				backgroundColor: "#e5e7eb",
				position: "relative",
				overflow: "hidden"
			}
		});
		if (n && r !== "none") {
			let e = ua("div", {
				className: "atlas-skeleton-animation",
				styles: {
					position: "absolute",
					inset: "0",
					...r === "shimmer" ? {
						background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
						animation: `atlas-skeleton-shimmer 1.5s ${G.standard} infinite`
					} : {
						animation: `atlas-skeleton-pulse 1.5s ${G.standard} infinite`,
						backgroundColor: "rgba(255,255,255,0.3)"
					}
				}
			});
			e && n.appendChild(e);
		}
		return n;
	};
	if (n === "text") for (let e = 0; e < i; e++) {
		let t = Al[e % Al.length], n = _(t, d);
		n && (h.push(n), g.appendChild(n));
	}
	else if (n === "avatar") {
		let e = _(p || "48px", d);
		e && (h.push(e), g.appendChild(e));
	} else if (n === "card") {
		let e = _("100%", "120px");
		e && (e.style.borderRadius = `${f} ${f} 0 0`, h.push(e), g.appendChild(e));
		let t = ua("div", { styles: {
			padding: "16px",
			display: "flex",
			flexDirection: "column",
			gap: "8px"
		} });
		if (t) {
			let e = _("60%", "1.25em");
			e && (h.push(e), t.appendChild(e));
			for (let e = 0; e < 2; e++) {
				let n = _(Al[e], "0.875em");
				n && (h.push(n), t.appendChild(n));
			}
			g.appendChild(t);
		}
	} else if (n === "image") {
		let e = _("100%", d);
		e && (h.push(e), g.appendChild(e));
	} else {
		let e = _(p || "100%", d);
		e && (h.push(e), g.appendChild(e));
	}
	e.appendChild(g);
	let v = () => {
		m || !g || (m = !0, g.style.display = "flex", g.setAttribute("aria-busy", "true"));
	}, y = () => {
		!m || !g || (m = !1, g.style.transition = `opacity 200ms ${G.accelerate}`, g.style.opacity = "0", setTimeout(() => {
			g && (g.style.display = "none", g.setAttribute("aria-busy", "false"));
		}, 200));
	};
	return {
		get isVisible() {
			return m;
		},
		get elements() {
			return [...h];
		},
		show: v,
		hide: y,
		toggle: () => {
			m ? y() : v();
		},
		destroy: () => {
			g?.remove(), g = null, h.length = 0;
		}
	};
}
function Ml() {
	return {
		get isVisible() {
			return !1;
		},
		get elements() {
			return [];
		},
		show: () => {},
		hide: () => {},
		toggle: () => {},
		destroy: () => {}
	};
}
function Nl(e, t) {
	return {
		fade: {
			initial: { opacity: "0" },
			final: { opacity: "1" }
		},
		"fade-up": {
			initial: {
				opacity: "0",
				transform: `translateY(${t}px)`
			},
			final: {
				opacity: "1",
				transform: "translateY(0)"
			}
		},
		"fade-down": {
			initial: {
				opacity: "0",
				transform: `translateY(-${t}px)`
			},
			final: {
				opacity: "1",
				transform: "translateY(0)"
			}
		},
		"fade-left": {
			initial: {
				opacity: "0",
				transform: `translateX(${t}px)`
			},
			final: {
				opacity: "1",
				transform: "translateX(0)"
			}
		},
		"fade-right": {
			initial: {
				opacity: "0",
				transform: `translateX(-${t}px)`
			},
			final: {
				opacity: "1",
				transform: "translateX(0)"
			}
		},
		scale: {
			initial: {
				opacity: "0",
				transform: "scale(0.8)"
			},
			final: {
				opacity: "1",
				transform: "scale(1)"
			}
		},
		"scale-up": {
			initial: {
				opacity: "0",
				transform: `scale(0.8) translateY(${t}px)`
			},
			final: {
				opacity: "1",
				transform: "scale(1) translateY(0)"
			}
		},
		flip: {
			initial: {
				opacity: "0",
				transform: "perspective(400px) rotateX(-90deg)"
			},
			final: {
				opacity: "1",
				transform: "perspective(400px) rotateX(0)"
			}
		},
		"slide-up": {
			initial: { transform: `translateY(${t * 2}px)` },
			final: { transform: "translateY(0)" }
		},
		"slide-down": {
			initial: { transform: `translateY(-${t * 2}px)` },
			final: { transform: "translateY(0)" }
		},
		"slide-left": {
			initial: { transform: `translateX(${t * 2}px)` },
			final: { transform: "translateX(0)" }
		},
		"slide-right": {
			initial: { transform: `translateX(-${t * 2}px)` },
			final: { transform: "translateX(0)" }
		},
		zoom: {
			initial: {
				opacity: "0",
				transform: "scale(0)"
			},
			final: {
				opacity: "1",
				transform: "scale(1)"
			}
		}
	}[e];
}
function Pl(e) {
	let t = [...e];
	for (let e = t.length - 1; e > 0; e--) {
		let n = Math.floor(Math.random() * (e + 1));
		[t[e], t[n]] = [t[n], t[e]];
	}
	return t;
}
function Fl() {
	return V() ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : !1;
}
function Il(e, t) {
	t.opacity !== void 0 && (e.style.opacity = t.opacity), t.transform !== void 0 && (e.style.transform = t.transform);
}
function Ll(e, t = {}) {
	if (!V()) return () => {};
	let { animation: n = "fade-up", delay: r = 50, initialDelay: i = 0, duration: a = W.normal, easing: o = G.spring, order: s = "normal", trigger: c = "immediate", threshold: l = .1, once: u = !0, distance: d = 20, onComplete: f, onElementAnimate: p } = t, m = Array.from(e);
	if (m.length === 0) return () => {};
	if (Fl()) return m.forEach((e) => {
		e.style.opacity = "1", e.style.transform = "";
	}), f?.(), () => {};
	switch (s) {
		case "reverse":
			m = m.reverse();
			break;
		case "random": m = Pl(m);
	}
	let { initial: h, final: g } = Nl(n, d), _ = 0, v = null, y = [], b = /* @__PURE__ */ new Map();
	m.forEach((e) => {
		b.set(e, e.style.cssText), Il(e, h), e.style.transition = "none";
	});
	let x = (e, t) => {
		let n = i + t * r, s = setTimeout(() => {
			e.style.transition = `
        opacity ${a}ms ${o},
        transform ${a}ms ${o}
      `.replace(/\s+/g, " ").trim(), Il(e, g), p?.(e, t), _++, _ === m.length && setTimeout(() => {
				f?.();
			}, a);
		}, n);
		y.push(s);
	};
	if (c === "immediate") m.forEach((e, t) => {
		x(e, t);
	});
	else if (c === "scroll") {
		let e = /* @__PURE__ */ new Set();
		v = new IntersectionObserver((t) => {
			t.forEach((t) => {
				let n = t.target;
				t.isIntersecting && !e.has(n) ? (x(n, e.size), u && (e.add(n), v?.unobserve(n))) : !t.isIntersecting && !u && e.has(n) && (e.delete(n), Il(n, h), _ = Math.max(0, _ - 1));
			});
		}, { threshold: l }), m.forEach((e) => v?.observe(e));
	}
	return () => {
		y.forEach((e) => clearTimeout(e)), v && v.disconnect(), m.forEach((e) => {
			let t = b.get(e);
			t !== void 0 && (e.style.cssText = t);
		});
	};
}
function Rl(e, t = {}) {
	if (!V()) return zl();
	let { checked: n = !1, disabled: r = !1, size: i = "md", name: a, value: o, onChange: s } = t, c = n, l = r, u = !1, d = null, f = [];
	e.classList.add("atlas-switch", `atlas-switch-${i}`), e.setAttribute("role", "switch"), e.setAttribute("tabindex", l ? "-1" : "0"), a && e.setAttribute("data-name", a), o && e.setAttribute("data-value", o), d = e.querySelector(".atlas-switch-thumb"), d || (d = document.createElement("span"), d.className = "atlas-switch-thumb", d.setAttribute("aria-hidden", "true"), e.appendChild(d)), e.style.transition = `background-color ${W.fast}ms ${G.standard}`, d.style.transition = `transform ${W.fast}ms ${G.spring}`;
	function p() {
		e.setAttribute("aria-checked", String(c)), c ? e.classList.add("atlas-switch-checked") : e.classList.remove("atlas-switch-checked"), l ? (e.setAttribute("aria-disabled", "true"), e.setAttribute("tabindex", "-1"), e.classList.add("atlas-switch-disabled")) : (e.removeAttribute("aria-disabled"), e.setAttribute("tabindex", "0"), e.classList.remove("atlas-switch-disabled")), u ? (e.classList.add("atlas-switch-loading"), e.setAttribute("aria-busy", "true")) : (e.classList.remove("atlas-switch-loading"), e.removeAttribute("aria-busy"));
	}
	function m() {
		l || u || (c = !c, p(), s?.(c), "vibrate" in navigator && navigator.vibrate(10));
	}
	return f.push(H(e, "click", m), wa(e, m, [" "])), p(), {
		get isChecked() {
			return c;
		},
		get isDisabled() {
			return l;
		},
		get isLoading() {
			return u;
		},
		setChecked: (e) => {
			c !== e && (c = e, p(), s?.(c));
		},
		toggle: () => {
			m();
		},
		setDisabled: (e) => {
			l = e, p();
		},
		setLoading: (e) => {
			u = e, p();
		},
		focus: () => {
			e.focus();
		},
		destroy: () => {
			f.forEach((e) => e()), e.classList.remove("atlas-switch", `atlas-switch-${i}`, "atlas-switch-checked", "atlas-switch-disabled", "atlas-switch-loading"), e.removeAttribute("role"), e.removeAttribute("tabindex"), e.removeAttribute("aria-checked"), e.removeAttribute("aria-disabled"), e.removeAttribute("aria-busy"), d && d.parentElement === e && d.remove();
		}
	};
}
function zl() {
	return {
		get isChecked() {
			return !1;
		},
		get isDisabled() {
			return !1;
		},
		get isLoading() {
			return !1;
		},
		setChecked: () => {},
		toggle: () => {},
		setDisabled: () => {},
		setLoading: () => {},
		focus: () => {},
		destroy: () => {}
	};
}
var Bl = {
	HEADER: "data-atlas-table-header",
	BODY: "data-atlas-table-body",
	ROW: "data-atlas-table-row",
	CELL: "data-atlas-table-cell",
	SORTABLE: "data-atlas-table-sortable",
	CHECKBOX: "data-atlas-table-checkbox"
}, $ = {
	ROOT: "atlas-table",
	WRAPPER: "atlas-table-wrapper",
	TABLE: "atlas-table-element",
	HEADER: "atlas-table-header",
	HEADER_ROW: "atlas-table-header-row",
	HEADER_CELL: "atlas-table-header-cell",
	BODY: "atlas-table-body",
	ROW: "atlas-table-row",
	ROW_SELECTED: "atlas-table-row--selected",
	CELL: "atlas-table-cell",
	CHECKBOX: "atlas-table-checkbox",
	SORT_ICON: "atlas-table-sort-icon",
	SORT_ASC: "atlas-table-sort--asc",
	SORT_DESC: "atlas-table-sort--desc",
	STRIPED: "atlas-table--striped",
	HOVERABLE: "atlas-table--hoverable",
	COMPACT: "atlas-table--compact",
	STICKY: "atlas-table--sticky-header"
};
function Vl(e, t = {}) {
	if (!V()) return Hl();
	let { columns: n = [], data: r = [], selectable: i = !1, multiSelect: a = !0, striped: o = !1, hoverable: s = !0, compact: c = !1, stickyHeader: l = !1, rowKey: u } = t, d = n, f = r, p = /* @__PURE__ */ new Set(), m = null, h = null, g = B("table"), _ = null, v = null, y = null, b = [];
	function x() {
		e.classList.add($.ROOT), e.setAttribute("data-atlas-table", ""), e.id = g, o && e.classList.add($.STRIPED), s && e.classList.add($.HOVERABLE), c && e.classList.add($.COMPACT), l && e.classList.add($.STICKY);
		let t = document.createElement("div");
		t.className = $.WRAPPER, _ = document.createElement("table"), _.className = $.TABLE, _.setAttribute("role", "grid"), v = document.createElement("thead"), v.className = $.HEADER, v.setAttribute(Bl.HEADER, ""), y = document.createElement("tbody"), y.className = $.BODY, y.setAttribute(Bl.BODY, ""), _.appendChild(v), _.appendChild(y), t.appendChild(_), e.appendChild(t), C(), w();
	}
	function S(e, t) {
		return typeof u == "function" ? u(e) : String(u && typeof e == "object" && e ? e[u] : t);
	}
	function C() {
		if (!v) return;
		v.innerHTML = "";
		let e = document.createElement("tr");
		if (e.className = $.HEADER_ROW, i && a) {
			let t = document.createElement("th");
			t.className = `${$.HEADER_CELL} ${$.CHECKBOX}`, t.innerHTML = `
        <input type="checkbox" ${Bl.CHECKBOX} aria-label="Select all rows" />
      `;
			let n = t.querySelector("input");
			if (!n) return;
			n.addEventListener("change", () => {
				n.checked ? D() : O();
			}), e.appendChild(t);
		}
		d.forEach((t) => {
			if (t.hidden) return;
			let n = document.createElement("th");
			if (n.className = $.HEADER_CELL, n.setAttribute("data-key", t.key), t.width && (n.style.width = t.width), t.align && (n.style.textAlign = t.align), t.sortable) {
				n.setAttribute(Bl.SORTABLE, ""), n.setAttribute("role", "columnheader"), n.setAttribute("aria-sort", m === t.key ? h === "asc" ? "ascending" : "descending" : "none"), n.style.cursor = "pointer";
				let e = m === t.key;
				n.innerHTML = `
          <span class="atlas-table-header-content">
            <span>${Ul(t.header)}</span>
            <span class="${$.SORT_ICON} ${e && h === "asc" ? $.SORT_ASC : ""} ${e && h === "desc" ? $.SORT_DESC : ""}" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </span>
          </span>
        `, n.addEventListener("click", () => T(t.key));
			} else n.textContent = t.header;
			e.appendChild(n);
		}), v.appendChild(e);
	}
	function w() {
		y && (y.innerHTML = "", f.forEach((e, n) => {
			let r = S(e, n), o = p.has(r), s = document.createElement("tr");
			if (s.className = `${$.ROW} ${o ? $.ROW_SELECTED : ""}`, s.setAttribute(Bl.ROW, ""), s.setAttribute("data-row-key", r), s.setAttribute("data-row-index", String(n)), o && s.setAttribute("aria-selected", "true"), i) {
				let t = document.createElement("td");
				t.className = `${$.CELL} ${$.CHECKBOX}`, t.innerHTML = `
          <input type="checkbox" ${Bl.CHECKBOX} ${o ? "checked" : ""} aria-label="Select row" />
        `;
				let r = t.querySelector("input");
				r && r.addEventListener("change", (t) => {
					t.stopPropagation(), E(e, n);
				}), s.appendChild(t);
			}
			d.forEach((t) => {
				if (t.hidden) return;
				let r = document.createElement("td");
				r.className = $.CELL, r.setAttribute(Bl.CELL, ""), r.setAttribute("data-key", t.key), t.align && (r.style.textAlign = t.align);
				let i = e[t.key];
				if (t.render) {
					let a = t.render(i, e, n);
					typeof a == "string" ? r.innerHTML = a : r.appendChild(a);
				} else r.textContent = i == null ? "" : String(i);
				s.appendChild(r);
			}), s.addEventListener("click", (r) => {
				r.target.tagName !== "INPUT" && (i && !a && E(e, n), t.onRowClick?.(e, n));
			}), y?.appendChild(s);
		}), A());
	}
	function T(e) {
		m === e ? h = h === "asc" ? "desc" : h === "desc" ? null : "asc" : (m = e, h = "asc"), h === null && (m = null), C(), t.onSortChange?.(e, h);
	}
	function E(e, t) {
		let n = S(e, t);
		a ? p.has(n) ? p.delete(n) : p.add(n) : p.has(n) ? p.clear() : (p.clear(), p.add(n)), w(), j();
	}
	function D() {
		p.clear(), f.forEach((e, t) => {
			p.add(S(e, t));
		}), w(), j();
	}
	function O() {
		p.clear(), w(), j();
	}
	function k(e) {
		p.clear(), e.forEach((e) => {
			let t = f.indexOf(e);
			t !== -1 && p.add(S(e, t));
		}), w();
	}
	function A() {
		if (!i || !a) return;
		let e = v?.querySelector(`input[${Bl.CHECKBOX}]`);
		if (!e) return;
		let t = f.length > 0 && p.size === f.length, n = p.size > 0 && p.size < f.length;
		e.checked = t, e.indeterminate = n;
	}
	function j() {
		let e = f.filter((e, t) => p.has(S(e, t)));
		t.onSelectionChange?.(e);
	}
	function M() {
		return f.filter((e, t) => p.has(S(e, t)));
	}
	function N(e) {
		f = e, p.clear(), w();
	}
	function P(e) {
		d = e, C(), w();
	}
	function F(e, t) {
		m = t ? e : null, h = t, C();
	}
	function I() {
		C(), w();
	}
	function ee() {
		b.forEach((e) => e()), e.classList.remove($.ROOT, $.STRIPED, $.HOVERABLE, $.COMPACT, $.STICKY), e.removeAttribute("data-atlas-table"), e.innerHTML = "";
	}
	return x(), {
		getData: () => [...f],
		setData: N,
		getColumns: () => [...d],
		setColumns: P,
		getSelected: M,
		select: k,
		clearSelection: O,
		selectAll: D,
		getSort: () => m ? {
			key: m,
			direction: h
		} : null,
		setSort: F,
		refresh: I,
		destroy: ee
	};
}
function Hl() {
	return {
		getData: () => [],
		setData: () => {},
		getColumns: () => [],
		setColumns: () => {},
		getSelected: () => [],
		select: () => {},
		clearSelection: () => {},
		selectAll: () => {},
		getSort: () => null,
		setSort: () => {},
		refresh: () => {},
		destroy: () => {}
	};
}
function Ul(e) {
	let t = document.createElement("div");
	return t.textContent = e, t.innerHTML;
}
function Wl(e, t = {}) {
	if (!V()) return Gl();
	let { pressed: n = !1, disabled: r = !1, variant: i = "default", size: a = "md", onChange: o } = t, s = n, c = r, l = [];
	e.classList.add("atlas-toggle", `atlas-toggle-${i}`, `atlas-toggle-${a}`), e.setAttribute("role", "button"), e.setAttribute("tabindex", c ? "-1" : "0"), e.style.transition = `
    background-color ${W.fast}ms ${G.standard},
    border-color ${W.fast}ms ${G.standard},
    color ${W.fast}ms ${G.standard}
  `.replace(/\s+/g, " ").trim();
	function u() {
		e.setAttribute("aria-pressed", String(s)), s ? (e.classList.add("atlas-toggle-pressed"), e.dataset.state = "on") : (e.classList.remove("atlas-toggle-pressed"), e.dataset.state = "off"), c ? (e.setAttribute("aria-disabled", "true"), e.setAttribute("tabindex", "-1"), e.classList.add("atlas-toggle-disabled")) : (e.removeAttribute("aria-disabled"), e.setAttribute("tabindex", "0"), e.classList.remove("atlas-toggle-disabled"));
	}
	function d() {
		c || (s = !s, u(), e.animate && e.animate([{ transform: "scale(0.97)" }, { transform: "scale(1)" }], {
			duration: W.fast,
			easing: G.bounce
		}), o?.(s));
	}
	return l.push(H(e, "click", d), wa(e, d)), u(), {
		get isPressed() {
			return s;
		},
		get isDisabled() {
			return c;
		},
		setPressed: (e) => {
			s !== e && (s = e, u(), o?.(s));
		},
		toggle: () => {
			d();
		},
		setDisabled: (e) => {
			c = e, u();
		},
		focus: () => {
			e.focus();
		},
		destroy: () => {
			l.forEach((e) => e()), e.classList.remove("atlas-toggle", `atlas-toggle-${i}`, `atlas-toggle-${a}`, "atlas-toggle-pressed", "atlas-toggle-disabled"), e.removeAttribute("role"), e.removeAttribute("tabindex"), e.removeAttribute("aria-pressed"), e.removeAttribute("aria-disabled"), delete e.dataset.state;
		}
	};
}
function Gl() {
	return {
		get isPressed() {
			return !1;
		},
		get isDisabled() {
			return !1;
		},
		setPressed: () => {},
		toggle: () => {},
		setDisabled: () => {},
		focus: () => {},
		destroy: () => {}
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-IONIVXWP.js
function Kl(e) {
	let t = null, n = null, r = null, i = function(...i) {
		n = i, r = this, t === null && (t = requestAnimationFrame(() => {
			n !== null && e.apply(r, n), t = null, n = null, r = null;
		}));
	};
	return i.cancel = () => {
		t !== null && (cancelAnimationFrame(t), t = null, n = null, r = null);
	}, i;
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-ZP6AW5OK.js
var ql = class {
	constructor() {
		this.originalStyles = /* @__PURE__ */ new Map();
	}
	saveStyle(e, t) {
		this.originalStyles.has(e) || this.originalStyles.set(e, /* @__PURE__ */ new Map());
		let n = this.originalStyles.get(e);
		if (n && !n.has(t)) {
			let r = e.style.getPropertyValue(t);
			n.set(t, r);
		}
	}
	setStyle(e, t, n) {
		this.saveStyle(e, t), e.style.setProperty(t, n);
	}
	setStyles(e, t) {
		Object.entries(t).forEach(([t, n]) => {
			this.setStyle(e, t, n);
		});
	}
	restore(e) {
		let t = this.originalStyles.get(e);
		t && (t.forEach((t, n) => {
			t === "" ? e.style.removeProperty(n) : e.style.setProperty(n, t);
		}), this.originalStyles.delete(e));
	}
	restoreAll() {
		this.originalStyles.forEach((e, t) => {
			this.restore(t);
		});
	}
	clear(e) {
		e ? this.originalStyles.delete(e) : this.originalStyles.clear();
	}
};
function Jl() {
	return new ql();
}
function Yl(e) {
	if (window.getComputedStyle(e).position === "static") {
		let t = e.style.position;
		return e.style.position = "relative", () => {
			e.style.position = t;
		};
	}
	return () => {};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-XYB77AYA.js
function Xl() {
	return typeof window > "u" ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Zl(e) {
	return e ? typeof e == "string" ? document.querySelector(e) : e : null;
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-AMYXJLF7.js
function Ql(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Tilt] Element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Tilt] Effect disabled due to prefers-reduced-motion"), () => {};
	let { intensity: r = 20, scale: i = 1.05, perspective: a = 1e3, speed: o = 300, glareEffect: s = !0 } = t, c = Jl(), l = null;
	s && (l = document.createElement("div"), l.className = "atlas-tilt-glare", l.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%);
      opacity: 0;
      pointer-events: none;
      transition: opacity ${o}ms ease;
    `, n.appendChild(l)), c.setStyles(n, {
		"transform-style": "preserve-3d",
		transition: `transform ${o}ms ease`
	});
	let u = Kl((e) => {
		let t = n.getBoundingClientRect(), o = ((e.clientX - t.left) / t.width - .5) * 2, s = ((e.clientY - t.top) / t.height - .5) * 2, u = -s * r, d = o * r, f = `perspective(${a}px) rotateX(${u}deg) rotateY(${d}deg) scale(${i})`;
		if (c.setStyle(n, "transform", f), l) {
			l.style.opacity = "1";
			let e = Math.atan2(s, o) * 180 / Math.PI + 90;
			l.style.background = `linear-gradient(${e}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)`;
		}
	}), d = () => {
		let e = `perspective(${a}px) rotateX(0deg) rotateY(0deg) scale(1)`;
		c.setStyle(n, "transform", e), l && (l.style.opacity = "0");
	};
	return n.addEventListener("mousemove", u), n.addEventListener("mouseleave", d), () => {
		u.cancel(), n.removeEventListener("mousemove", u), n.removeEventListener("mouseleave", d), l?.parentNode && l.parentNode.removeChild(l), c.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-WX3EQFKS.js
function $l(e) {
	let t = null, n = !0, r = () => {
		n && (e(), t = requestAnimationFrame(r));
	};
	return t = requestAnimationFrame(r), () => {
		n = !1, t !== null && (cancelAnimationFrame(t), t = null);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-7J2CH7R4.js
function eu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Glow] Element not found:", e), () => {};
	let { color: r = "#3b82f6", intensity: i = .5, size: a = 20, animated: o = !0, interactive: s = !0 } = t, c = Jl(), l = [], u = (e = i, t = a) => {
		let o = `0 0 ${t}px ${Math.round(e * t)}px ${r}`;
		c.setStyle(n, "box-shadow", o);
	}, d = Xl();
	if (o && !d) {
		let e = 0, t = $l(() => {
			let t = Math.sin(e) * .3 + .7;
			u(i * t), e += .02;
		});
		l.push(t);
	} else u();
	if (s) {
		let e = () => u(i * 1.5, a * 1.2), t = () => u();
		n.addEventListener("mouseenter", e), n.addEventListener("mouseleave", t), l.push(() => {
			n.removeEventListener("mouseenter", e), n.removeEventListener("mouseleave", t);
		});
	}
	return () => {
		l.forEach((e) => e()), c.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-IT5NADLR.js
function tu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Morphing] Element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Morphing] Effect disabled due to prefers-reduced-motion"), () => {};
	let { shapes: r = [
		"50%",
		"0%",
		"25%",
		"50%"
	], duration: i = 2e3, autoPlay: a = !0, loop: o = !0 } = t, s = Jl(), c = 0, l = null, u = (e) => {
		s.setStyles(n, {
			"border-radius": r[e],
			transition: `border-radius ${i}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
		});
	};
	return a && (l = setInterval(() => {
		c = (c + 1) % r.length, u(c), !o && c === r.length - 1 && l !== null && (clearInterval(l), l = null);
	}, i + 100)), () => {
		l !== null && (clearInterval(l), l = null), s.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-JHVEHKOJ.js
function nu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Wave] Element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Wave] Effect disabled due to prefers-reduced-motion"), () => {};
	let { amplitude: r = 10, frequency: i = .02, speed: a = .05, direction: o = "horizontal" } = t, s = Jl(), c = 0, l = $l(() => {
		let e = Math.sin(c * i * 100) * r, t = o === "horizontal" ? `translateY(${e}px)` : `translateX(${e}px)`;
		s.setStyle(n, "transform", t), c += a;
	});
	return () => {
		l(), s.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-QDN5CXXW.js
function ru(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Magnetic] Element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Magnetic] Effect disabled due to prefers-reduced-motion"), () => {};
	let { strength: r = .3, threshold: i = 100, returnSpeed: a = .1 } = t, o = Jl(), s = 0, c = 0, l = 0, u = 0, d = (e, t, n) => e + (t - e) * n, f = Kl((e) => {
		let t = n.getBoundingClientRect(), a = t.left + t.width / 2, o = t.top + t.height / 2, s = e.clientX - a, c = e.clientY - o, d = Math.sqrt(s * s + c * c);
		if (d < i) {
			let e = (i - d) / i;
			l = s * r * e, u = c * r * e;
		} else l = 0, u = 0;
	}), p = $l(() => {
		s = d(s, l, a), c = d(c, u, a);
		let e = `translate(${s}px, ${c}px)`;
		o.setStyle(n, "transform", e);
	});
	return document.addEventListener("mousemove", f), () => {
		f.cancel(), document.removeEventListener("mousemove", f), p(), o.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-IGNN6O4E.js
function iu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Typewriter] Element not found:", e), () => {};
	let r = Xl(), { texts: i = ["Hello World!"], speed: a = 100, deleteSpeed: o = 50, pause: s = 1e3, loop: c = !0, cursor: l = !0, cursorChar: u = "|" } = t;
	if (r) return n.textContent = i[0], () => {
		n.textContent = "";
	};
	let d = 0, f = 0, p = !1, m = null, h = () => {
		let e = i[d], t = p ? e.substring(0, f - 1) : e.substring(0, f + 1);
		n.textContent = t + (l ? u : ""), !p && f < e.length ? (f++, m = setTimeout(h, a)) : p && f > 0 ? (f--, m = setTimeout(h, o)) : !p && f === e.length ? m = setTimeout(() => {
			p = !0, h();
		}, s) : p && f === 0 && (p = !1, d = c ? (d + 1) % i.length : Math.min(d + 1, i.length - 1), m = setTimeout(h, 500));
	};
	return h(), () => {
		m !== null && (clearTimeout(m), m = null), n.textContent = "";
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-IHOHEWWO.js
function au(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Ripple] Element not found:", e), () => {};
	let { strength: r = .5, duration: i = 600, color: a = "rgba(255, 255, 255, 0.3)" } = t, o = Yl(n), s = /* @__PURE__ */ new Set(), c = (e) => {
		if (Xl()) return;
		let t = e, o = n.getBoundingClientRect(), c = t.clientX - o.left, l = t.clientY - o.top, u = document.createElement("div"), d = Math.max(o.width, o.height) * 2 * r;
		u.className = "atlas-ripple", u.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${a};
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      transition: transform ${i}ms ease-out, opacity ${i}ms ease-out;
      width: ${d}px;
      height: ${d}px;
      left: ${c}px;
      top: ${l}px;
      opacity: 1;
      z-index: 1000;
    `, n.appendChild(u), s.add(u), requestAnimationFrame(() => {
			u.style.transform = "translate(-50%, -50%) scale(1)", u.style.opacity = "0";
		}), setTimeout(() => {
			u.parentNode && u.parentNode.removeChild(u), s.delete(u);
		}, i);
	};
	return n.addEventListener("pointerdown", c, { passive: !0 }), () => {
		n.removeEventListener("pointerdown", c), s.forEach((e) => {
			e.parentNode && e.parentNode.removeChild(e);
		}), s.clear(), o();
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-IF5S7JM2.js
function ou(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Orbs] Container element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Orbs] Effect disabled due to prefers-reduced-motion"), () => {};
	let { count: r = 5, minSize: i = 20, maxSize: a = 60, speed: o = .5, color: s = "rgba(255, 255, 255, 0.1)" } = t, c = [], l = [], u = Jl();
	u.setStyles(n, {
		position: n.style.position || "relative",
		overflow: "hidden"
	}), l.push(() => u.restore(n));
	let d = () => n.getBoundingClientRect(), f = d();
	for (let e = 0; e < r; e++) {
		let e = i + Math.random() * (a - i), t = {
			x: Math.random() * (f.width - e),
			y: Math.random() * (f.height - e),
			vx: (Math.random() - .5) * o,
			vy: (Math.random() - .5) * o,
			size: e,
			element: document.createElement("div")
		};
		t.element.className = "atlas-orb", t.element.style.cssText = `
      position: absolute;
      width: ${e}px;
      height: ${e}px;
      border-radius: 50%;
      background: ${s};
      pointer-events: none;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: transform 0.1s ease-out;
      will-change: transform;
    `, n.appendChild(t.element), c.push(t);
	}
	let p = $l(() => {
		let e = d();
		c.forEach((t) => {
			t.x += t.vx, t.y += t.vy, (t.x <= 0 || t.x >= e.width - t.size) && (t.vx *= -1, t.x = Math.max(0, Math.min(e.width - t.size, t.x))), (t.y <= 0 || t.y >= e.height - t.size) && (t.vy *= -1, t.y = Math.max(0, Math.min(e.height - t.size, t.y))), t.element.style.transform = `translate(${t.x}px, ${t.y}px)`;
		});
	});
	return l.push(p), () => {
		l.forEach((e) => e()), c.forEach((e) => {
			e.element.parentNode && e.element.parentNode.removeChild(e.element);
		});
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-GITFLOBJ.js
function su(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Parallax] Element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Parallax] Effect disabled due to prefers-reduced-motion"), () => {};
	let { speed: r = .5, direction: i = "vertical", offset: a = 0 } = t, o = Jl(), s = () => {
		let e = n.getBoundingClientRect(), t = e.top + window.scrollY, s = e.height, c = window.innerHeight, l = window.scrollY, u = t + s, d = l, f = l + c;
		if (u >= d && t <= f) {
			let e = l - t + a, s = "";
			switch (i) {
				case "vertical":
					s = `translateY(${e * r}px)`;
					break;
				case "horizontal":
					s = `translateX(${e * r}px)`;
					break;
				case "both": s = `translate(${e * r}px, ${e * r}px)`;
			}
			o.setStyle(n, "transform", s);
		}
	}, c = Kl(() => {
		s();
	}), l = Kl(() => {
		s();
	});
	return s(), window.addEventListener("scroll", c, { passive: !0 }), window.addEventListener("resize", l, { passive: !0 }), () => {
		c.cancel(), l.cancel(), window.removeEventListener("scroll", c), window.removeEventListener("resize", l), o.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-F3KESEUA.js
function cu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas GlassEffects] Element not found:", e), () => {};
	let { intensity: r = .15, blurAmount: i = 16, animated: a = !0, interactiveBlur: o = !0, color: s = "rgba(255, 255, 255, 0.1)" } = t, c = Jl(), l = [], u = (e = i, t = r) => {
		c.setStyles(n, {
			background: `color-mix(in srgb, ${s} ${Math.round(t * 100)}%, transparent)`,
			"backdrop-filter": `blur(${e}px) saturate(1.2)`,
			"-webkit-backdrop-filter": `blur(${e}px) saturate(1.2)`,
			border: `1px solid color-mix(in srgb, ${s} ${Math.round(t * 200)}%, transparent)`,
			transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
		});
	};
	if (o) {
		let e = Kl((e) => {
			let t = n.getBoundingClientRect(), a = (e.clientX - t.left) / t.width, o = (e.clientY - t.top) / t.height, s = Math.sqrt((a - .5) ** 2 + (o - .5) ** 2), c = i * (.7 + s * .6), l = r * (1.2 - s * .4);
			u(c, Math.max(.05, l));
		}), t = () => {
			u();
		};
		n.addEventListener("mousemove", e), n.addEventListener("mouseleave", t), l.push(() => {
			e.cancel(), n.removeEventListener("mousemove", e), n.removeEventListener("mouseleave", t);
		});
	}
	if (a && !Xl()) {
		let e = 0, t = $l(() => {
			let t = Math.sin(e) * .3 + 1, n = i * t, a = r * t;
			u(n, a), e += .02;
		});
		l.push(t);
	} else u();
	return (!a || Xl()) && u(), () => {
		l.forEach((e) => e()), c.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-4AYCY5MJ.js
function lu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas ScrollReveal] Element not found:", e), () => {};
	let { distance: r = "20px", duration: i = 800, delay: a = 0, easing: o = "cubic-bezier(0.16, 1, 0.3, 1)", origin: s = "bottom", scale: c = .95, opacity: l = [0, 1], threshold: u = .1, once: d = !0 } = t;
	if (Xl()) return n.setAttribute("style", `opacity: ${l[1]};`), () => {
		n.removeAttribute("style");
	};
	let f = Jl(), p = !1, m = () => {
		let e = [];
		switch (s) {
			case "top":
				e.push(`translateY(-${r})`);
				break;
			case "bottom":
				e.push(`translateY(${r})`);
				break;
			case "left":
				e.push(`translateX(-${r})`);
				break;
			case "right": e.push(`translateX(${r})`);
		}
		c !== 1 && e.push(`scale(${c})`), f.setStyles(n, {
			opacity: l[0].toString(),
			transform: e.join(" "),
			transition: `all ${i}ms ${o} ${a}ms`,
			"will-change": "transform, opacity"
		});
	}, h = () => {
		p && d || (f.setStyles(n, {
			opacity: l[1].toString(),
			transform: "translateX(0) translateY(0) scale(1)"
		}), p = !0);
	}, g = () => {
		d || (m(), p = !1);
	}, _ = new IntersectionObserver((e) => {
		e.forEach((e) => {
			e.isIntersecting ? h() : d || g();
		});
	}, {
		threshold: u,
		rootMargin: "50px 0px -50px 0px"
	});
	return m(), _.observe(n), () => {
		_.unobserve(n), _.disconnect(), f.restore(n);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-ADRMXDYZ.js
function uu(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas Particles] Container element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas Particles] Effect disabled due to prefers-reduced-motion"), () => {};
	let { count: r = 30, size: i = [2, 8], speed: a = [.1, .5], color: o = [
		"#3b82f6",
		"#8b5cf6",
		"#ec4899"
	], opacity: s = [.3, .8], interactive: c = !0, connectLines: l = !1, maxDistance: u = 100 } = t, d = [], f = Array.isArray(o) ? o : [o], p = [], m = null, h = null;
	if (l) {
		if (m = document.createElement("canvas"), h = m.getContext("2d"), !h) return console.warn("[Atlas Particles] Failed to create canvas context"), () => {};
		m.style.cssText = "\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      pointer-events: none;\n      z-index: 1;\n    ", n.appendChild(m);
	}
	let g = Yl(n);
	p.push(g);
	let _ = () => n.getBoundingClientRect(), v = _();
	for (let e = 0; e < r; e++) {
		let e = i[0] + Math.random() * (i[1] - i[0]), t = a[0] + Math.random() * (a[1] - a[0]), r = {
			x: Math.random() * v.width,
			y: Math.random() * v.height,
			vx: (Math.random() - .5) * t,
			vy: (Math.random() - .5) * t,
			size: e,
			opacity: s[0] + Math.random() * (s[1] - s[0]),
			element: document.createElement("div")
		}, o = f[Math.floor(Math.random() * f.length)];
		r.element.style.cssText = `
      position: absolute;
      width: ${e}px;
      height: ${e}px;
      background: ${o};
      border-radius: 50%;
      pointer-events: none;
      opacity: ${r.opacity};
      will-change: transform;
      z-index: 2;
    `, n.appendChild(r.element), d.push(r);
	}
	let y = 0, b = 0, x = Kl((e) => {
		if (!c) return;
		let t = _();
		y = e.clientX - t.left, b = e.clientY - t.top;
	});
	c && (n.addEventListener("mousemove", x), p.push(() => {
		x.cancel(), n.removeEventListener("mousemove", x);
	}));
	let S = () => {
		if (!(!h || !m)) {
			m.width = n.offsetWidth, m.height = n.offsetHeight, h.clearRect(0, 0, m.width, m.height), h.strokeStyle = f[0], h.lineWidth = 1, h.globalAlpha = .2;
			for (let e = 0; e < d.length; e++) for (let t = e + 1; t < d.length; t++) {
				let n = d[e].x - d[t].x, r = d[e].y - d[t].y;
				Math.sqrt(n * n + r * r) < u && (h.beginPath(), h.moveTo(d[e].x, d[e].y), h.lineTo(d[t].x, d[t].y), h.stroke());
			}
		}
	}, C = $l(() => {
		let e = _();
		d.forEach((t) => {
			if (c) {
				let e = y - t.x, n = b - t.y, r = Math.sqrt(e * e + n * n);
				if (r < 100) {
					let i = (100 - r) / 100 * .01;
					t.vx += e * i, t.vy += n * i;
				}
			}
			t.x += t.vx, t.y += t.vy, (t.x <= 0 || t.x >= e.width) && (t.vx *= -.9, t.x = Math.max(0, Math.min(e.width, t.x))), (t.y <= 0 || t.y >= e.height) && (t.vy *= -.9, t.y = Math.max(0, Math.min(e.height, t.y))), t.vx *= .999, t.vy *= .999, t.element.style.transform = `translate(${t.x - t.size / 2}px, ${t.y - t.size / 2}px)`;
		}), l && S();
	});
	return p.push(C), () => {
		p.forEach((e) => e()), d.forEach((e) => {
			e.element.parentNode && e.element.parentNode.removeChild(e.element);
		}), m?.parentNode && m.parentNode.removeChild(m);
	};
}
//#endregion
//#region node_modules/@casoon/atlas-effects/dist/chunk-Z6DNVY5A.js
function du(e, t = {}) {
	let n = Zl(e);
	if (!n) return console.warn("[Atlas CursorFollow] Element not found:", e), () => {};
	if (Xl()) return console.info("[Atlas CursorFollow] Effect disabled due to prefers-reduced-motion"), () => {};
	let { speed: r = .1, offset: i = {
		x: 0,
		y: 0
	}, magnetic: a = !1, magneticThreshold: o = 100 } = t, s = Jl(), c = 0, l = 0, u = 0, d = 0, f = (e, t, n) => e + (t - e) * n, p = Kl((e) => {
		if (a) {
			let t = n.getBoundingClientRect(), r = t.left + t.width / 2, a = t.top + t.height / 2, s = e.clientX - r, c = e.clientY - a;
			Math.sqrt(s * s + c * c) < o && (u = e.clientX + i.x, d = e.clientY + i.y);
		} else u = e.clientX + i.x, d = e.clientY + i.y;
	}), m = $l(() => {
		c = f(c, u, r), l = f(l, d, r);
		let e = `translate(${c}px, ${l}px)`;
		s.setStyle(n, "transform", e);
	});
	return document.addEventListener("mousemove", p), () => {
		p.cancel(), document.removeEventListener("mousemove", p), m(), s.restore(n);
	};
}
var fu = {
	init: os,
	destroy: ss,
	ui: {
		accordion: Fo,
		card: wo,
		separator: Oc,
		resizable: yo,
		scrollArea: So,
		sidebar: ha,
		bentoGrid: Cs,
		breadcrumb: Os,
		menu: uc,
		menubar: to,
		navigationMenu: oo,
		tabs: Po,
		pagination: ho,
		button: Do,
		checkbox: Fs,
		input: ec,
		inputOtp: Za,
		label: nc,
		radioGroup: yc,
		select: Ec,
		combobox: Hs,
		slider: va,
		switch: Rl,
		textarea: ba,
		form: Eo,
		avatar: ps,
		avatarGroup: hs,
		badge: vs,
		calendar: Ua,
		carousel: Ns,
		progress: _c,
		skeleton: jl,
		table: Vl,
		marquee: oc,
		dialog: Qs,
		drawer: Go,
		dropdown: Mo,
		modal: ko,
		popover: hc,
		sheet: Dl,
		tooltip: Io,
		command: Ks,
		datePicker: Ya,
		toast: Vo,
		toggle: Wl,
		toggleGroup: Ea
	},
	effects: {
		ripple: au,
		orbs: ou,
		parallax: su,
		scrollReveal: lu,
		glass: cu,
		particles: uu,
		cursorFollow: du,
		tilt: Ql,
		glow: eu,
		morphing: tu,
		wave: nu,
		magnetic: ru,
		typewriter: iu
	},
	utils: {
		createComponentFactory: fl,
		createEventEmitter: dl,
		registerPlugin: ul,
		getPlugins: gl,
		wrapComponent: ml,
		createStore: _l,
		derivedStore: yl,
		combineStores: bl,
		shallowEqual: vl,
		loggerMiddleware: xl,
		validatorMiddleware: Sl,
		animate: ol,
		animateAsync: sl,
		stagger: Ll,
		createSpring: cl,
		animateSpring: jc,
		createTransition: Pc,
		registerAnimation: zc,
		getAnimation: Bc,
		getAnimations: Vc,
		EASING: G,
		DURATION: Lc,
		easingFn: Ic,
		isBrowser: V,
		createElement: ua,
		addListener: H,
		getFocusableElements: da,
		generateId: B,
		announce: ca
	}
};
document.addEventListener("alpine:init", () => {
	Alpine.data("butterflySystem", () => ({
		mode: "sleep",
		landed: !1,
		hasTriggered: !1,
		x: -50,
		y: 100,
		angle: 45,
		zAngle: 0,
		time: 0,
		init() {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				this.mode = "landed", this.landed = !0;
				return;
			}
			this.x = window.innerWidth / 2, this.y = window.innerHeight + 100;
			let e = new IntersectionObserver((e) => {
				e[0].isIntersecting && !this.hasTriggered && (this.hasTriggered = !0, this.mode = "wander", setTimeout(() => {
					this.mode = "seek";
				}, 3e3), requestAnimationFrame(() => this.loop()));
			}, { threshold: .1 }), t = document.getElementById("ctaTarget");
			t && e.observe(t);
		},
		loop() {
			if (this.mode === "wander") this.time += .05, this.x += Math.cos(this.time) * 3 + 2, this.y += Math.sin(this.time * 1.5) * 5, this.angle = Math.sin(this.time) * 30;
			else if (this.mode === "seek") {
				this.time += .1;
				let e = document.getElementById("ctaTarget");
				if (!e) return;
				let t = e.getBoundingClientRect(), n = t.left + 20, r = t.top - 20;
				this.x += (n - this.x) * .04, this.y += (r - this.y) * .04, this.x += Math.cos(this.time) * 2, this.y += Math.sin(this.time) * 2, Math.hypot(n - this.x, r - this.y) < 5 && (this.mode = "landed", this.landed = !0, this.angle = -15, this.zAngle = 60);
			}
			this.landed || requestAnimationFrame(() => this.loop());
		}
	}));
}), window.Alpine = ta, ta.start();
var pu = fu;
pu && typeof pu.init == "function" && (window.atlas = pu, pu.init());
//#endregion
