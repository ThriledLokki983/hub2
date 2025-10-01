const changeFaqContent = () => {
	const faq = document.querySelectorAll('.faq__content > h2');

	// const children
};

export { changeFaqContent };

function e() {
	return (
		(e = Object.assign
			? Object.assign.bind()
			: function (e) {
					for (var t = 1; t < arguments.length; t++) {
						var n = arguments[t];
						for (var r in n)
							Object.prototype.hasOwnProperty.call(n, r) &&
								(e[r] = n[r]);
					}
					return e;
			  }),
		e.apply(this, arguments)
	);
}
function t(e, t) {
	const n = t.width,
		r = t.height,
		u = t.inlineSize,
		o = t.blockSize;
	switch (e) {
		case 1:
			return null != n ? { type: 3, value: n, unit: 'px' } : { type: 1 };
		case 3:
			return null != u ? { type: 3, value: u, unit: 'px' } : { type: 1 };
		case 2:
			return null != r ? { type: 3, value: r, unit: 'px' } : { type: 1 };
		case 4:
			return null != o ? { type: 3, value: o, unit: 'px' } : { type: 1 };
		case 5:
			return null != n && null != r && r > 0
				? { type: 2, value: n / r }
				: { type: 1 };
		case 6:
			return null != n && null != r
				? { type: 4, value: r >= n ? 'portrait' : 'landscape' }
				: { type: 1 };
	}
}
function n(e, t) {
	switch (e.type) {
		case 1:
		case 2:
		case 3:
		case 4:
			return i(e, t);
		case 5: {
			const n = t.sizeFeatures.get(e.feature);
			return null == n ? { type: 1 } : n;
		}
		case 6:
			return e.value;
	}
}
function r(e) {
	return { type: 5, value: e };
}
function u(e, t, n) {
	return r(
		(function (e, t, n) {
			switch (n) {
				case 1:
					return e === t;
				case 2:
					return e > t;
				case 3:
					return e >= t;
				case 4:
					return e < t;
				case 5:
					return e <= t;
			}
		})(e, t, n)
	);
}
function o(e, t, n) {
	return null == e ? t : null == t ? e : n(e, t);
}
function s(e, t) {
	switch (e) {
		case 'cqw':
			return t.cqw;
		case 'cqh':
			return t.cqh;
		case 'cqi':
			return 0 === t.writingAxis ? t.cqw : t.cqh;
		case 'cqb':
			return 1 === t.writingAxis ? t.cqw : t.cqh;
		case 'cqmin':
			return o(s('cqi', t), s('cqb', t), Math.min);
		case 'cqmax':
			return o(s('cqi', t), s('cqb', t), Math.max);
	}
}
function c(e, { treeContext: t }) {
	switch (e.unit) {
		case 'px':
			return e.value;
		case 'rem':
			return e.value * t.rootFontSize;
		case 'em':
			return e.value * t.fontSize;
		case 'cqw':
		case 'cqh':
		case 'cqi':
		case 'cqb':
		case 'cqmin':
		case 'cqmax':
			return o(e.value, s(e.unit, t), (e, t) => e * t);
	}
	return null;
}
function a(e, t) {
	switch (e.type) {
		case 2:
			return 0 === e.value ? 0 : null;
		case 3:
			return c(e, t);
	}
	return null;
}
function i(e, t) {
	switch (e.type) {
		case 4:
			return (function (e, t) {
				const o = n(e.left, t),
					s = n(e.right, t),
					c = e.operator;
				if (
					(4 === o.type && 4 === s.type) ||
					(5 === o.type && 5 === s.type)
				)
					return (function (e, t, n) {
						return 1 === n ? r(e.value === t.value) : { type: 1 };
					})(o, s, c);
				if (3 === o.type || 3 === s.type) {
					const e = a(o, t),
						n = a(s, t);
					if (null != e && null != n) return u(e, n, c);
				} else if (2 === o.type && 2 === s.type)
					return u(o.value, s.value, c);
				return { type: 1 };
			})(e, t);
		case 2:
			return (function (e, t) {
				const n = i(e.left, t);
				return 5 !== n.type || !0 !== n.value ? n : i(e.right, t);
			})(e, t);
		case 3:
			return (function (e, t) {
				const n = i(e.left, t);
				return 5 === n.type && !0 === n.value ? n : i(e.right, t);
			})(e, t);
		case 1: {
			const n = i(e.value, t);
			return 5 === n.type ? { type: 5, value: !n.value } : { type: 1 };
		}
		case 5:
			return l(n(e, t));
		case 6:
			return l(e.value);
	}
}
function l(e) {
	switch (e.type) {
		case 5:
			return e;
		case 2:
		case 3:
			return { type: 5, value: e.value > 0 };
	}
	return { type: 1 };
}
const f = Array.from({ length: 4 }, () =>
		Math.floor(256 * Math.random()).toString(16)
	).join(''),
	p = S('container'),
	y = S('container-type'),
	h = S('container-name'),
	d = `data-cqs-${f}`,
	v = `data-cqc-${f}`,
	m = S('cqw'),
	g = S('cqh'),
	w = S('cqi'),
	b = S('cqb');
function S(e) {
	return `--cq-${e}-${f}`;
}
const x = Symbol();
function q(e, t) {
	const n = {
		value: t,
		errorIndices: [],
		index: -1,
		at(r) {
			const u = n.index + r;
			return u >= e.length ? t : e[u];
		},
		consume: (e) => ((n.index += e), (n.value = n.at(0)), n.value),
		reconsume() {
			n.index -= 1;
		},
		error() {
			n.errorIndices.push(n.index);
		},
	};
	return n;
}
function C(e) {
	return q(e, { type: 0 });
}
function* z(e) {
	const t = [];
	let n = !1;
	for (const r of e) {
		const e = r.codePointAt(0);
		n && 10 !== e && ((n = !1), t.push(10)),
			0 === e || (e >= 55296 && e <= 57343)
				? t.push(65533)
				: 13 === e
				? (n = !0)
				: t.push(e);
	}
	const r = q(t, -1),
		{ at: u, consume: o, error: s, reconsume: c } = r;
	function a() {
		return String.fromCodePoint(r.value);
	}
	function i() {
		return { type: 13, value: a() };
	}
	function l() {
		for (; P(u(1)); ) o(1);
	}
	function f() {
		for (; -1 !== r.value; )
			if ((o(1), 42 === u(0) && 47 === u(1))) return void o(1);
		s();
	}
	function p() {
		const [e, t] = (function () {
				let e = 0,
					t = '',
					n = u(1);
				for ((43 !== n && 45 !== n) || (o(1), (t += a())); L(u(1)); )
					o(1), (t += a());
				if (46 === u(1) && L(u(2)))
					for (e = 1, o(1), t += a(); L(u(1)); ) o(1), (t += a());
				if (((n = u(1)), 69 === n || 101 === n)) {
					const n = u(2);
					if (L(n))
						for (e = 1, o(1), t += a(); L(u(1)); ) o(1), (t += a());
					else if ((45 === n || 43 === n) && L(u(3)))
						for (e = 1, o(1), t += a(), o(1), t += a(); L(u(1)); )
							o(1), (t += a());
				}
				return [t, e];
			})(),
			n = u(1);
		return v(n, u(1), u(2))
			? { type: 15, value: e, flag: t, unit: g() }
			: 37 === n
			? (o(1), { type: 16, value: e })
			: { type: 17, value: e, flag: t };
	}
	function y() {
		const e = g();
		let t = u(1);
		if ('url' === e.toLowerCase() && 40 === t) {
			for (o(1); P(u(1)) && P(u(2)); ) o(1);
			t = u(1);
			const n = u(2);
			return 34 === t || 39 === t
				? { type: 23, value: e }
				: !P(t) || (34 !== n && 39 !== n)
				? (function () {
						let e = '';
						for (l(); ; ) {
							const n = o(1);
							if (41 === n) return { type: 20, value: e };
							if (-1 === n) return s(), { type: 20, value: e };
							if (P(n)) {
								l();
								const t = u(1);
								return 41 === t || -1 === t
									? (o(1),
									  -1 === n && s(),
									  { type: 20, value: e })
									: (w(), { type: 21 });
							}
							if (
								34 === n ||
								39 === n ||
								40 === n ||
								((t = n) >= 0 && t <= 8) ||
								11 === t ||
								(t >= 14 && t <= 31) ||
								127 === t
							)
								return s(), w(), { type: 21 };
							if (92 === n) {
								if (!A(n, u(1))) return s(), { type: 21 };
								e += d();
							} else e += a();
						}
						var t;
				  })()
				: { type: 23, value: e };
		}
		return 40 === t
			? (o(1), { type: 23, value: e })
			: { type: 24, value: e };
	}
	function h(e) {
		let t = '';
		for (;;) {
			const n = o(1);
			if (-1 === n || n === e)
				return -1 === n && s(), { type: 2, value: t };
			if (E(n)) return s(), c(), { type: 3 };
			if (92 === n) {
				const e = u(1);
				if (-1 === e) continue;
				E(e) ? o(1) : (t += d());
			} else t += a();
		}
	}
	function d() {
		const e = o(1);
		if ($(e)) {
			const t = [e];
			for (let e = 0; e < 5; e++) {
				const e = u(1);
				if (!$(e)) break;
				t.push(e), o(1);
			}
			P(u(1)) && o(1);
			let n = parseInt(String.fromCodePoint(...t), 16);
			return (
				(0 === n || (n >= 55296 && n <= 57343) || n > 1114111) &&
					(n = 65533),
				String.fromCodePoint(n)
			);
		}
		return -1 === e ? (s(), String.fromCodePoint(65533)) : a();
	}
	function v(e, t, n) {
		return 45 === e ? k(t) || 45 === t || A(t, n) : !!k(e);
	}
	function m(e, t, n) {
		return 43 === e || 45 === e
			? L(t) || (46 === t && L(n))
			: !(46 !== e || !L(t)) || !!L(e);
	}
	function g() {
		let e = '';
		for (;;) {
			const t = o(1);
			if (M(t)) e += a();
			else {
				if (!A(t, u(1))) return c(), e;
				e += d();
			}
		}
	}
	function w() {
		for (;;) {
			const e = o(1);
			if (-1 === e) return;
			A(e, u(1)) && d();
		}
	}
	for (;;) {
		const e = o(1);
		if (47 === e && 42 === u(1)) o(2), f();
		else if (P(e)) l(), yield { type: 1 };
		else if (34 === e) yield h(e);
		else if (35 === e) {
			const e = u(1);
			M(e) || A(e, u(2))
				? yield {
						type: 14,
						flag: v(u(1), u(2), u(3)) ? 1 : 0,
						value: g(),
				  }
				: yield i();
		} else if (39 === e) yield h(e);
		else if (40 === e) yield { type: 4 };
		else if (41 === e) yield { type: 5 };
		else if (43 === e) m(e, u(1), u(2)) ? (c(), yield p()) : yield i();
		else if (44 === e) yield { type: 6 };
		else if (45 === e) {
			const t = u(1),
				n = u(2);
			m(e, t, n)
				? (c(), yield p())
				: 45 === t && 62 === n
				? (o(2), yield { type: 19 })
				: v(e, t, n)
				? (c(), yield y())
				: yield i();
		} else if (46 === e) m(e, u(1), u(2)) ? (c(), yield p()) : yield i();
		else if (58 === e) yield { type: 7 };
		else if (59 === e) yield { type: 8 };
		else if (60 === e)
			33 === u(1) && 45 === u(2) && 45 === u(3)
				? yield { type: 18 }
				: yield i();
		else if (64 === e)
			if (v(u(1), u(2), u(3))) {
				const e = g();
				yield { type: 22, value: e };
			} else yield i();
		else if (91 === e) yield { type: 9 };
		else if (92 === e) A(e, u(1)) ? (c(), yield y()) : (s(), yield i());
		else if (93 === e) yield { type: 10 };
		else if (123 === e) yield { type: 11 };
		else if (125 === e) yield { type: 12 };
		else if (L(e)) c(), yield p();
		else if (k(e)) c(), yield y();
		else {
			if (-1 === e) return yield { type: 0 }, r.errorIndices;
			yield { type: 13, value: a() };
		}
	}
}
function L(e) {
	return e >= 48 && e <= 57;
}
function $(e) {
	return L(e) || (e >= 65 && e <= 70) || (e >= 97 && e <= 102);
}
function E(e) {
	return 10 === e || 13 === e || 12 === e;
}
function P(e) {
	return E(e) || 9 === e || 32 === e;
}
function k(e) {
	return (
		(e >= 65 && e <= 90) || (e >= 97 && e <= 122) || e >= 128 || 95 === e
	);
}
function A(e, t) {
	return 92 === e && !E(t);
}
function M(e) {
	return k(e) || L(e) || 45 === e;
}
const j = { 11: 12, 9: 10, 4: 5 };
function F(t, n) {
	const r = (function (e, t) {
		const n = [];
		for (;;)
			switch (e.consume(1).type) {
				case 1:
					break;
				case 0:
					return { type: 3, value: n };
				case 18:
				case 19:
					if (!1 !== t) {
						e.reconsume();
						const t = U(e);
						t !== x && n.push(t);
					}
					break;
				case 22:
					e.reconsume(), n.push(Q(e));
					break;
				default: {
					e.reconsume();
					const t = U(e);
					t !== x && n.push(t);
					break;
				}
			}
	})(C(t), !0 === n);
	return e({}, r, {
		value: r.value.map((t) =>
			26 === t.type
				? (function (t, n) {
						return 0 === t.value.value.type
							? e({}, t, {
									value: e({}, t.value, {
										value: R(t.value.value.value),
									}),
							  })
							: t;
				  })(t)
				: t
		),
	});
}
function N(e) {
	const t = C(e),
		n = [];
	for (;;) {
		if (0 === t.consume(1).type) return n;
		t.reconsume(), n.push(T(t));
	}
}
function R(e) {
	return (function (e) {
		const t = [],
			n = [];
		for (;;) {
			const r = e.consume(1);
			switch (r.type) {
				case 1:
				case 8:
					break;
				case 0:
					return { type: 1, value: [...n, ...t] };
				case 22:
					e.reconsume(), t.push(Q(e));
					break;
				case 24: {
					const t = [r];
					let u = e.at(1);
					for (; 8 !== u.type && 0 !== u.type; )
						t.push(T(e)), (u = e.at(1));
					const o = O(C(t));
					o !== x && n.push(o);
					break;
				}
				case 13:
					if ('&' === r.value) {
						e.reconsume();
						const n = U(e);
						n !== x && t.push(n);
						break;
					}
				default: {
					e.error(), e.reconsume();
					let t = e.at(1);
					for (; 8 !== t.type && 0 !== t.type; ) T(e), (t = e.at(1));
					break;
				}
			}
		}
	})(C(e));
}
function D(e) {
	for (; 1 === e.at(1).type; ) e.consume(1);
}
function Q(e) {
	let t = e.consume(1);
	if (22 !== t.type) throw new Error(`Unexpected type ${t.type}`);
	const n = t.value,
		r = [];
	for (;;)
		switch (((t = e.consume(1)), t.type)) {
			case 8:
				return { type: 25, name: n, prelude: r, value: null };
			case 0:
				return (
					e.error(), { type: 25, name: n, prelude: r, value: null }
				);
			case 11:
				return { type: 25, name: n, prelude: r, value: V(e) };
			case 28:
				if (11 === t.source.type)
					return { type: 25, name: n, prelude: r, value: t };
			default:
				e.reconsume(), r.push(T(e));
		}
}
function U(e) {
	let t = e.value;
	const n = [];
	for (;;)
		switch (((t = e.consume(1)), t.type)) {
			case 0:
				return e.error(), x;
			case 11:
				return { type: 26, prelude: n, value: V(e) };
			case 28:
				if (11 === t.source.type)
					return { type: 26, prelude: n, value: t };
			default:
				e.reconsume(), n.push(T(e));
		}
}
function O(e) {
	const t = e.consume(1);
	if (24 !== t.type) throw new Error(`Unexpected type ${t.type}`);
	const n = t.value,
		r = [];
	let u = !1;
	if ((D(e), 7 !== e.at(1).type)) return e.error(), x;
	for (e.consume(1), D(e); 0 !== e.at(1).type; ) r.push(T(e));
	const o = r[r.length - 2],
		s = r[r.length - 1];
	return (
		o &&
			13 === o.type &&
			'!' === o.value &&
			24 === s.type &&
			'important' === s.value.toLowerCase() &&
			((u = !0), r.splice(r.length - 2)),
		{ type: 29, name: n, value: r, important: u }
	);
}
function T(e) {
	const t = e.consume(1);
	switch (t.type) {
		case 11:
		case 9:
		case 4:
			return V(e);
		case 23:
			return (function (e) {
				let t = e.value;
				if (23 !== t.type) throw new Error(`Unexpected type ${t.type}`);
				const n = t.value,
					r = [];
				for (;;)
					switch (((t = e.consume(1)), t.type)) {
						case 5:
							return { type: 27, name: n, value: r };
						case 0:
							return e.error(), { type: 27, name: n, value: r };
						default:
							e.reconsume(), r.push(T(e));
					}
			})(e);
		default:
			return t;
	}
}
function V(e) {
	let t = e.value;
	const n = t,
		r = j[n.type];
	if (!r) throw new Error(`Unexpected type ${t.type}`);
	const u = [];
	for (;;)
		switch (((t = e.consume(1)), t.type)) {
			case r:
				return { type: 28, source: n, value: { type: 0, value: u } };
			case 0:
				return (
					e.error(),
					{ type: 28, source: n, value: { type: 0, value: u } }
				);
			default:
				e.reconsume(), u.push(T(e));
		}
}
function I(e) {
	return D(e), 0 === e.at(1).type;
}
const H = { 11: ['{', '}'], 9: ['[', ']'], 4: ['(', ')'] };
function W(e, t) {
	switch (e.type) {
		case 25:
			return `@${CSS.escape(e.name)} ${e.prelude
				.map((e) => W(e))
				.join('')}${e.value ? W(e.value) : ';'}`;
		case 26:
			return `${e.prelude.map((e) => W(e)).join('')}${W(e.value)}`;
		case 28: {
			const [t, n] = H[e.source.type];
			return `${t}${B(e.value)}${n}`;
		}
		case 27:
			return `${CSS.escape(e.name)}(${e.value
				.map((e) => W(e))
				.join('')})`;
		case 29:
			return `${CSS.escape(e.name)}:${e.value.map((e) => W(e)).join('')}${
				e.important ? ' !important' : ''
			}`;
		case 1:
			return ' ';
		case 8:
			return ';';
		case 7:
			return ':';
		case 14:
			return '#' + CSS.escape(e.value);
		case 24:
			return CSS.escape(e.value);
		case 15:
			return e.value + CSS.escape(e.unit);
		case 13:
		case 17:
			return e.value;
		case 2:
			return `"${CSS.escape(e.value)}"`;
		case 6:
			return ',';
		case 20:
			return 'url(' + CSS.escape(e.value) + ')';
		case 22:
			return '@' + CSS.escape(e.value);
		case 16:
			return e.value + '%';
		default:
			throw new Error(`Unsupported token ${e.type}`);
	}
}
function B(e, t) {
	return e.value
		.map((t) => {
			let n = W(t);
			return 29 === t.type && 0 !== e.type && (n += ';'), n;
		})
		.join('');
}
function G(e) {
	return W(e);
}
function _(e) {
	const t = e.at(1);
	return 13 === t.type && '=' === t.value && (e.consume(1), !0);
}
function J(e, t) {
	const n = [];
	for (;;) {
		const r = e.at(1);
		if (
			0 === r.type ||
			(t && 7 === r.type) ||
			(13 === r.type &&
				('>' === r.value || '<' === r.value || '=' === r.value))
		)
			break;
		n.push(e.consume(1));
	}
	return n;
}
function K(e) {
	D(e);
	const t = e.consume(1);
	return 13 !== t.type
		? x
		: '>' === t.value
		? _(e)
			? 3
			: 2
		: '<' === t.value
		? _(e)
			? 5
			: 4
		: '=' === t.value
		? 1
		: x;
}
function X(e) {
	return 4 === e || 5 === e;
}
function Y(e) {
	return 2 === e || 3 === e;
}
function Z(e, t, n) {
	const r = (function (e) {
		D(e);
		const t = e.consume(1);
		return D(e), 24 !== t.type || 0 !== e.at(1).type ? x : t.value;
	})(C(e));
	if (r === x) return x;
	let u = r.toLowerCase();
	return (u = n ? n(u) : u), t.has(u) ? u : x;
}
function ee(e) {
	return { type: 13, value: e };
}
function te(e, t) {
	return { type: 29, name: e, value: t, important: !1 };
}
function ne(e) {
	return { type: 24, value: e };
}
function re(e, t) {
	return { type: 27, name: e, value: t };
}
function ue(e) {
	return re('var', [ne(e)]);
}
function oe(e, t) {
	D(e);
	let n = !1,
		r = e.at(1);
	if (24 === r.type) {
		if ('not' !== r.value.toLowerCase()) return x;
		e.consume(1), D(e), (n = !0);
	}
	let u = (function (e) {
		const t = e.consume(1);
		switch (t.type) {
			case 28: {
				if (4 !== t.source.type) return x;
				const e = oe(C(t.value.value), null);
				return e !== x ? e : { type: 4, value: t };
			}
			case 27:
				return { type: 4, value: t };
			default:
				return x;
		}
	})(e);
	if (u === x) return x;
	(u = n ? { type: 1, value: u } : u), D(e), (r = e.at(1));
	const o = 24 === r.type ? r.value.toLowerCase() : null;
	if (null !== o) {
		if (
			(e.consume(1),
			D(e),
			('and' !== o && 'or' !== o) || (null !== t && o !== t))
		)
			return x;
		const n = oe(e, o);
		return n === x ? x : { type: 'and' === o ? 2 : 3, left: u, right: n };
	}
	return I(e) ? u : x;
}
function se(e) {
	return oe(e, null);
}
function ce(e) {
	switch (e.type) {
		case 1:
			return [ne('not'), { type: 1 }, ...ce(e.value)];
		case 2:
		case 3:
			return [
				...ce(e.left),
				{ type: 1 },
				ne(2 === e.type ? 'and' : 'or'),
				{ type: 1 },
				...ce(e.right),
			];
		case 4:
			return [e.value];
	}
}
const ae = {
		'width': 1,
		'height': 2,
		'inline-size': 3,
		'block-size': 4,
		'aspect-ratio': 5,
		'orientation': 6,
	},
	ie = new Set(Object.keys(ae)),
	le = new Set(['none', 'and', 'not', 'or', 'normal', 'auto']),
	fe = new Set(['initial', 'inherit', 'revert', 'revert-layer', 'unset']),
	pe = new Set(['size', 'inline-size']);
function ye(e, t, n, r) {
	const u = n();
	if (u === x) return x;
	let o = [u, null];
	D(e);
	const s = e.at(1);
	if (13 === s.type) {
		if (s.value !== t) return x;
		e.consume(1), D(e);
		const n = r();
		D(e), n !== x && (o = [u, n]);
	}
	return I(e) ? o : x;
}
function he(e) {
	const t = e.consume(1);
	return 17 === t.type ? parseInt(t.value) : x;
}
function de(e) {
	const t = C(e);
	D(t);
	const n = t.consume(1);
	let r = x;
	switch (n.type) {
		case 17:
			t.reconsume(),
				(r = (function (e) {
					const t = ye(
						e,
						'/',
						() => he(e),
						() => he(e)
					);
					return t === x
						? x
						: { type: 2, value: t[0] / (null !== t[1] ? t[1] : 1) };
				})(t));
			break;
		case 15:
			r = {
				type: 3,
				value: parseInt(n.value),
				unit: n.unit.toLowerCase(),
			};
			break;
		case 24: {
			const e = n.value.toLowerCase();
			switch (e) {
				case 'landscape':
				case 'portrait':
					r = { type: 4, value: e };
			}
		}
	}
	return r === x ? x : I(t) ? { type: 6, value: r } : x;
}
function ve(e) {
	return !we((e = e.toLowerCase())) && !le.has(e);
}
function me(e, t) {
	const n = [];
	for (;;) {
		D(e);
		const r = e.at(1);
		if (24 !== r.type || !t(r.value)) return n;
		e.consume(1), n.push(r.value);
	}
}
function ge(e) {
	const t = [];
	for (;;) {
		D(e);
		const n = e.at(1);
		if (24 !== n.type) break;
		const r = n.value;
		if (!ve(r)) break;
		e.consume(1), t.push(r);
	}
	return t;
}
function we(e) {
	return fe.has(e);
}
function be(e) {
	return e.map((e) => 'cq-' + e);
}
function Se(e) {
	const t = me(e, (e) => we(e));
	return 1 === t.length ? be(t) : x;
}
function xe(e, t) {
	const n = me(e, (e) => 'none' === e);
	if (1 === n.length) return be(n);
	if (0 !== n.length) return x;
	if (t) {
		const t = Se(e);
		if (t !== x) return t;
	}
	const r = ge(e);
	return r.length > 0 && (!t || I(e)) ? r : x;
}
function qe(e, t) {
	if (t) {
		const t = Se(e);
		if (t !== x) return t;
	}
	return (function (e) {
		const t = me(e, (e) => 'normal' === e);
		if (1 === t.length) return be(t);
		if (0 !== t.length) return x;
		const n = me(e, (e) => pe.has(e));
		return n.length > 0 && I(e) ? n : x;
	})(e);
}
function Ce(e) {
	const t = C(e),
		n = Se(t);
	if (n !== x) return [n, n];
	const r = ye(
		t,
		'/',
		() => xe(t, !1),
		() => qe(t, !1)
	);
	return r !== x && I(t) ? [r[0], r[1] || []] : x;
}
function ze(e) {
	const t = C(e),
		n = ge(t);
	if (!n || n.length > 1) return x;
	const r = se(t);
	if (r === x) return x;
	const u = { features: new Set() },
		o = Le(r, u);
	return I(t)
		? {
				name: n.length > 0 ? n[0] : null,
				condition: o,
				features: u.features,
		  }
		: x;
}
function Le(e, t) {
	switch (e.type) {
		case 1:
			return { type: 1, value: Le(e.value, t) };
		case 2:
		case 3:
			return {
				type: 2 === e.type ? 2 : 3,
				left: Le(e.left, t),
				right: Le(e.right, t),
			};
		case 4:
			if (28 === e.value.type) {
				const n = (function (e, t) {
					const n = (function (e, t) {
						const n = J(e, !0),
							r = e.at(1);
						if (0 === r.type) {
							const e = Z(n, t);
							return e !== x && t.has(e)
								? { type: 1, feature: e }
								: x;
						}
						if (7 === r.type) {
							e.consume(1);
							const r = J(e, !1);
							let u = 1;
							const o = Z(n, t, (e) =>
								e.startsWith('min-')
									? ((u = 3), e.substring(4))
									: e.startsWith('max-')
									? ((u = 5), e.substring(4))
									: e
							);
							return o !== x
								? {
										type: 2,
										feature: o,
										bounds: [null, [u, r]],
								  }
								: x;
						}
						const u = K(e);
						if (u === x) return x;
						const o = J(e, !1);
						if (0 === e.at(1).type) {
							const e = Z(n, t);
							if (e !== x)
								return {
									type: 2,
									feature: e,
									bounds: [null, [u, o]],
								};
							const r = Z(o, t);
							return r !== x
								? {
										type: 2,
										feature: r,
										bounds: [[u, n], null],
								  }
								: x;
						}
						const s = K(e);
						if (s === x || !((Y(u) && Y(s)) || (X(u) && X(s))))
							return x;
						const c = J(e, !1),
							a = Z(o, t);
						return a !== x
							? {
									type: 2,
									feature: a,
									bounds: [
										[u, n],
										[s, c],
									],
							  }
							: x;
					})(e, ie);
					if (n === x) return x;
					const r = ae[n.feature];
					if (null == r) return x;
					if ((t.features.add(r), 1 === n.type))
						return { type: 5, feature: r };
					{
						const e = { type: 5, feature: r };
						let t = x;
						if (null !== n.bounds[0]) {
							const r = de(n.bounds[0][1]);
							if (r === x) return x;
							t = {
								type: 4,
								operator: n.bounds[0][0],
								left: r,
								right: e,
							};
						}
						if (null !== n.bounds[1]) {
							const r = de(n.bounds[1][1]);
							if (r === x) return x;
							const u = {
								type: 4,
								operator: n.bounds[1][0],
								left: e,
								right: r,
							};
							t = t !== x ? { type: 2, left: t, right: u } : u;
						}
						return t;
					}
				})(C(e.value.value.value), t);
				if (n !== x) return n;
			}
			return { type: 6, value: { type: 1 } };
	}
}
let $e = 0;
const Ee = { cqw: m, cqh: g, cqi: w, cqb: b },
	Pe = CSS.supports('selector(:where())'),
	ke = ':not(.container-query-polyfill)';
N(Array.from(z(ke)));
const Ae = document.createElement('div'),
	Me = new Set(['before', 'after', 'first-line', 'first-letter']);
function je(e, t) {
	return re('calc', [{ type: 17, flag: e.flag, value: e.value }, ee('*'), t]);
}
function Fe(t) {
	return t.map((t) => {
		switch (t.type) {
			case 15:
				return (function (e) {
					const t = e.unit,
						n = Ee[t];
					return null != n
						? je(e, ue(n))
						: 'cqmin' === t || 'cqmax' === t
						? je(
								e,
								re(e.unit.slice(2), [ue(w), { type: 6 }, ue(b)])
						  )
						: e;
				})(t);
			case 27:
				return e({}, t, { value: Fe(t.value) });
		}
		return t;
	});
}
function Ne(t) {
	switch (t.name) {
		case 'container':
			return Ce(t.value) ? e({}, t, { name: p }) : t;
		case 'container-name':
			return xe(C(t.value), !0) ? e({}, t, { name: h }) : t;
		case 'container-type':
			return null != qe(C(t.value), !0) ? e({}, t, { name: y }) : t;
	}
	return e({}, t, { value: Fe(t.value) });
}
function Re(t, n) {
	return e({}, t, {
		value: t.value.map((t) => {
			switch (t.type) {
				case 25:
					return Ve(t, n);
				case 26:
					return (function (t, n) {
						return n.transformStyleRule(
							e({}, t, { value: Ue(t.value, n) })
						);
					})(t, n);
				default:
					return t;
			}
		}),
	});
}
function De(e) {
	return 0 === e.type || 6 === e.type;
}
function Qe(e) {
	for (let t = e.length - 1; t >= 0; t--)
		if (1 !== e[t].type) return e.slice(0, t + 1);
	return e;
}
function Ue(t, n) {
	return (function (t, n) {
		const r = [];
		let u = null,
			o = null;
		for (const e of t.value.value)
			switch (e.type) {
				case 25:
					{
						const t = n ? n(e) : e;
						t && r.push(t);
					}
					break;
				case 29: {
					const t = Ne(e);
					switch (t.name) {
						case p: {
							const t = Ce(e.value);
							t !== x && ((u = t[0]), (o = t[1]));
							break;
						}
						case h: {
							const t = xe(C(e.value), !0);
							t !== x && (u = t);
							break;
						}
						case y: {
							const t = qe(C(e.value), !0);
							t !== x && (o = t);
							break;
						}
						default:
							r.push(t);
					}
				}
			}
		return (
			u && u.length > 0 && r.push(te(h, [ne(u.join(' '))])),
			o && o.length > 0 && r.push(te(y, [ne(o.join(' '))])),
			e({}, t, { value: { type: 2, value: r } })
		);
	})(t, (e) => Ve(e, n));
}
function Oe(t) {
	if (1 === t.type) return e({}, t, { value: Oe(t.value) });
	if (2 === t.type || 3 === t.type)
		return e({}, t, { left: Oe(t.left), right: Oe(t.right) });
	if (4 === t.type && 28 === t.value.type) {
		const n = (function (e) {
			const t = C(e);
			return D(t), 24 !== t.at(1).type ? x : O(t) || x;
		})(t.value.value.value);
		if (n !== x)
			return e({}, t, {
				value: e({}, t.value, { value: { type: 0, value: [Ne(n)] } }),
			});
	}
	return t;
}
function Te(t, n) {
	let r = se(C(t.prelude));
	return (
		(r = r !== x ? Oe(r) : x),
		e({}, t, {
			prelude: r !== x ? ce(r) : t.prelude,
			value: t.value
				? e({}, t.value, { value: Re(F(t.value.value.value), n) })
				: null,
		})
	);
}
function Ve(t, n) {
	switch (t.name.toLocaleLowerCase()) {
		case 'media':
		case 'layer':
			return (function (t, n) {
				return e({}, t, {
					value: t.value
						? e({}, t.value, {
								value: Re(F(t.value.value.value), n),
						  })
						: null,
				});
			})(t, n);
		case 'keyframes':
			return (function (t, n) {
				let r = null;
				return (
					t.value &&
						(r = e({}, t.value, {
							value: {
								type: 3,
								value: F(t.value.value.value).value.map((t) => {
									switch (t.type) {
										case 26:
											return (function (t, n) {
												return e({}, t, {
													value: Ue(t.value, n),
												});
											})(t, n);
										case 25:
											return Ve(t, n);
									}
								}),
							},
						})),
					e({}, t, { value: r })
				);
			})(t, n);
		case 'supports':
			return Te(t, n);
		case 'container':
			return (function (t, n) {
				if (t.value) {
					const r = ze(t.prelude);
					if (r !== x) {
						const u = {
								rule: r,
								selector: null,
								parent: n.parent,
								uid: 'c' + $e++,
							},
							o = new Set(),
							s = [],
							c = Re(F(t.value.value.value), {
								descriptors: n.descriptors,
								parent: u,
								transformStyleRule: (t) => {
									const [n, r] = (function (e, t, n) {
										const r = C(e),
											u = [],
											o = [];
										for (;;) {
											if (0 === r.at(1).type)
												return [u, o];
											const n = Math.max(0, r.index);
											for (
												;
												(c = r.at(1)),
													(a = r.at(2)),
													!(
														De(c) ||
														(7 === c.type &&
															(7 === a.type ||
																(24 ===
																	a.type &&
																	Me.has(
																		a.value.toLowerCase()
																	))))
													);

											)
												r.consume(1);
											const i = r.index + 1,
												l = e.slice(n, i),
												f =
													l.length > 0
														? Qe(l)
														: [ee('*')];
											for (; !De(r.at(1)); ) r.consume(1);
											const p = e.slice(
												i,
												Math.max(0, r.index + 1)
											);
											let y = f,
												h = [
													{
														type: 28,
														source: { type: 9 },
														value: {
															type: 0,
															value: [
																ne(
																	p.length > 0
																		? d
																		: v
																),
																ee('~'),
																ee('='),
																{
																	type: 2,
																	value: t,
																},
															],
														},
													},
												];
											if (Pe)
												h = [ee(':'), re('where', h)];
											else {
												const e = f.map(G).join('');
												e.endsWith(ke)
													? (y = N(
															Array.from(
																z(
																	e.substring(
																		0,
																		e.length -
																			ke.length
																	)
																)
															)
													  ))
													: s.push({
															actual: e,
															expected: e + ke,
													  });
											}
											u.push(...f),
												o.push(...y),
												o.push(...h),
												o.push(...p),
												r.consume(1);
										}
										var c, a;
									})(t.prelude, u.uid);
									if (s.length > 0) return t;
									const c = n.map(G).join('');
									try {
										Ae.matches(c), o.add(c);
									} catch (e) {}
									return e({}, t, { prelude: r });
								},
							}).value;
						if (s.length > 0) {
							const e = new Set(),
								t = [];
							let n = 0;
							for (const { actual: e } of s)
								n = Math.max(n, e.length);
							const r = Array.from({ length: n }, () => ' ').join(
								''
							);
							for (const { actual: u, expected: o } of s)
								e.has(u) ||
									(t.push(
										`${u}${r.substring(
											0,
											n - u.length
										)} => ${o}`
									),
									e.add(u));
							console.warn(
								`The :where() pseudo-class is not supported by this browser. To use the Container Query Polyfill, you must modify the selectors under your @container rules:\n\n${t.join(
									'\n'
								)}`
							);
						}
						return (
							o.size > 0 &&
								(u.selector = Array.from(o).join(', ')),
							n.descriptors.push(u),
							{
								type: 25,
								name: 'media',
								prelude: [ne('all')],
								value: e({}, t.value, {
									value: { type: 3, value: c },
								}),
							}
						);
					}
				}
				return t;
			})(t, n);
	}
	return t;
}
const Ie = Symbol('CQ_INSTANCE'),
	He = CSS.supports('width: 1svh'),
	We = new Set([
		'vertical-lr',
		'vertical-rl',
		'sideways-rl',
		'sideways-lr',
		'tb',
		'tb-lr',
		'tb-rl',
	]),
	Be = [
		'padding-left',
		'padding-right',
		'border-left-width',
		'border-right-width',
	],
	Ge = [
		'padding-top',
		'padding-bottom',
		'border-top-width',
		'border-bottom-width',
	],
	_e = /(\w*(\s|-))?(table|ruby)(-\w*)?/;
class Je {
	constructor(e) {
		(this.node = void 0), (this.node = e);
	}
	connected() {}
	disconnected() {}
	resized(e) {}
}
class Ke extends Je {
	constructor(e, t) {
		super(e),
			(this.context = void 0),
			(this.controller = null),
			(this.styleSheet = null),
			(this.context = t);
	}
	connected() {
		var e = this;
		const t = this.node;
		if ('stylesheet' === t.rel) {
			const n = new URL(t.href, document.baseURI);
			n.origin === location.origin &&
				(this.controller = tt(async function (r) {
					const u = await fetch(n.toString(), { signal: r }),
						o = await u.text(),
						s = (e.styleSheet = await e.context.registerStyleSheet({
							source: o,
							url: n,
							signal: r,
						})),
						c = new Blob([s.source], { type: 'text/css' }),
						a = new Image();
					(a.onload = a.onerror = s.refresh),
						(a.src = t.href = URL.createObjectURL(c));
				}));
		}
	}
	disconnected() {
		var e, t;
		null == (e = this.controller) || e.abort(),
			(this.controller = null),
			null == (t = this.styleSheet) || t.dispose(),
			(this.styleSheet = null);
	}
}
class Xe extends Je {
	constructor(e, t) {
		super(e),
			(this.context = void 0),
			(this.controller = null),
			(this.styleSheet = null),
			(this.context = t);
	}
	connected() {
		var e = this;
		this.controller = tt(async function (t) {
			const n = e.node,
				r = (e.styleSheet = await e.context.registerStyleSheet({
					source: n.innerHTML,
					signal: t,
				}));
			(n.innerHTML = r.source), r.refresh();
		});
	}
	disconnected() {
		var e, t;
		null == (e = this.controller) || e.abort(),
			(this.controller = null),
			null == (t = this.styleSheet) || t.dispose(),
			(this.styleSheet = null);
	}
}
class Ye extends Je {
	connected() {
		const e = `* { ${y}: cq-normal; ${h}: cq-none; }`;
		this.node.innerHTML =
			void 0 === window.CSSLayerBlockRule
				? e
				: `@layer cq-polyfill-${f} { ${e} }`;
	}
}
class Ze extends Je {
	constructor(e, t) {
		super(e), (this.context = void 0), (this.context = t);
	}
	connected() {
		this.node.style.cssText =
			'position: fixed; top: 0; left: 0; visibility: hidden; ' +
			(He ? 'width: 1svw; height: 1svh;' : 'width: 1%; height: 1%;');
	}
	resized(e) {
		const t = e.getLayoutData();
		this.context.viewportChanged({ width: t.width, height: t.height });
	}
}
class et {
	constructor(e, t) {
		(this.cachedState = null),
			(this.cachedLayoutData = null),
			(this.context = void 0),
			(this.styles = void 0),
			(this.styles = window.getComputedStyle(e)),
			(this.context = t);
	}
	invalidate() {
		(this.cachedState = null), (this.cachedLayoutData = null);
	}
	computeAttributesForElement(e) {
		const t = this.get().conditions;
		let n = '';
		for (const r of this.context.getQueryDescriptors())
			if (null != r.selector) {
				const u = t.get(r.uid);
				null != u &&
					2 == (2 & u) &&
					e.matches(r.selector) &&
					(n += r.uid + ' ');
			}
		return n;
	}
	getLayoutData() {
		let e = this.cachedLayoutData;
		if (!e) {
			const n = this.styles,
				r = 'border-box' === n.getPropertyValue('box-sizing'),
				u = (e) => parseFloat(n.getPropertyValue(e)),
				o = (e) => e.reduce((e, t) => e + u(t), 0);
			this.cachedLayoutData = e = {
				writingAxis:
					((t = n.getPropertyValue('writing-mode')),
					We.has(t) ? 1 : 0),
				fontSize: parseFloat(n.getPropertyValue('font-size')),
				width: u('width') - (r ? o(Be) : 0),
				height: u('height') - (r ? o(Ge) : 0),
				displayFlags: nt(n.getPropertyValue('display').trim()),
			};
		}
		var t;
		return e;
	}
	get() {
		let n = this.cachedState;
		if (!n) {
			const { context: r, styles: u } = this,
				o = this.getLayoutData(),
				s = r.getParentState(),
				{ context: c, conditions: a } = s;
			let l = o.displayFlags;
			0 == (1 & s.displayFlags) && (l = 0);
			let f = a,
				p = !1;
			const d = e({}, c, {
					fontSize: o.fontSize,
					writingAxis: o.writingAxis,
				}),
				v = (function (e) {
					let t = 0;
					if (0 === e.length) return t;
					if (
						e.startsWith('cq-') &&
						('normal' === (e = e.substring('cq-'.length)) || we(e))
					)
						return t;
					const n = e.split(' ');
					for (const e of n)
						switch (e) {
							case 'size':
								t |= 3;
								break;
							case 'inline-size':
								t |= 1;
								break;
							default:
								return 0;
						}
					return t;
				})(u.getPropertyValue(y).trim());
			if (v > 0 && ((f = new Map()), (p = !0), 2 == (2 & l))) {
				const e = (function (e, t) {
						const n = { value: t.width },
							r = { value: t.height };
						let u = n,
							o = r;
						if (1 === t.writingAxis) {
							const e = u;
							(u = o), (o = e);
						}
						return (
							2 != (2 & e) && (o.value = void 0),
							{
								width: n.value,
								height: r.value,
								inlineSize: u.value,
								blockSize: o.value,
							}
						);
					})(v, o),
					n = { sizeFeatures: e, treeContext: d },
					s = (function (e) {
						return e.startsWith('cq-') &&
							('none' === (e = e.substring('cq-'.length)) ||
								we(e))
							? new Set([])
							: new Set(0 === e.length ? [] : e.split(' '));
					})(u.getPropertyValue(h)),
					l = (e) => {
						const { rule: r } = e,
							u = r.name,
							o =
								null == u || s.has(u)
									? (function (e, n) {
											const r = new Map(),
												u = n.sizeFeatures;
											for (const n of e.features) {
												const e = t(n, u);
												if (1 === e.type) return null;
												r.set(n, e);
											}
											const o = i(e.condition, {
												sizeFeatures: r,
												treeContext: n.treeContext,
											});
											return 5 === o.type
												? o.value
												: null;
									  })(r, n)
									: null;
						var c;
						return null == o
							? 1 === ((null != (c = a.get(e.uid)) ? c : 0) && 1)
							: !0 === o;
					},
					p = (e, t) => {
						let n = e.get(t.uid);
						if (null == n) {
							const r = l(t);
							(n =
								(r ? 1 : 0) |
								(!0 !== r ||
								(null != t.parent && 1 != (1 & p(e, t.parent)))
									? 0
									: 2)),
								e.set(t.uid, n);
						}
						return n;
					};
				for (const e of r.getQueryDescriptors()) p(f, e);
				(d.cqw = null != e.width ? e.width / 100 : c.cqw),
					(d.cqh = null != e.height ? e.height / 100 : c.cqh);
			}
			this.cachedState = n = {
				conditions: f,
				context: d,
				displayFlags: l,
				isQueryContainer: p,
			};
		}
		return n;
	}
}
function tt(e) {
	const t = new AbortController();
	return (
		e(t.signal).catch((e) => {
			if (!(e instanceof DOMException && 'AbortError' === e.message))
				throw e;
		}),
		t
	);
}
function nt(e) {
	let t = 0;
	return (
		'none' !== e &&
			((t |= 1),
			'contents' === e || 'inline' === e || _e.test(e) || (t |= 2)),
		t
	);
}

(window.CQPolyfill = { version: '0.2.4' }),
	'container' in document.documentElement.style ||
		(function () {
			function t(e) {
				return e[Ie] || null;
			}
			const n = document.documentElement;
			if (t(n)) return;
			let r = null;
			const u = document.createElement(`cq-polyfill-${f}`),
				o = document.createElement('style');
			new MutationObserver((e) => {
				for (const n of e) {
					r = null;
					for (const e of n.removedNodes) {
						const n = t(e);
						null == n || n.disconnect();
					}
					('attributes' === n.type &&
						n.attributeName &&
						(n.attributeName === d ||
							n.attributeName === v ||
							(n.target instanceof Element &&
								n.target.getAttribute(n.attributeName) ===
									n.oldValue))) ||
						$(n.target).mutate();
				}
			}).observe(n, {
				childList: !0,
				subtree: !0,
				attributes: !0,
				attributeOldValue: !0,
			});
			const s = [];
			let c = !1;
			function a(e) {
				c ? s.push(e) : e();
			}
			const i = new Set(),
				l = new ResizeObserver((e) => {
					try {
						(c = !0),
							e
								.map((e) => {
									const t = e.target;
									return i.add(t), $(t);
								})
								.sort((e, t) => e.depth - t.depth)
								.forEach((e) => e.resize());
					} finally {
						i.clear(),
							(c = !1),
							s.forEach((e) => e()),
							(s.length = 0);
					}
				});
			function p(e) {
				l.unobserve(e), l.observe(e);
			}
			const y = new Je(n),
				h = new Map();
			async function S(e, { source: t, url: u, signal: o }) {
				const s = (function (e, t) {
					try {
						const n = Array.from(z(e));
						if (t)
							for (let e = 0; e < n.length; e++) {
								const r = n[e];
								if (20 === r.type)
									r.value = new URL(r.value, t).toString();
								else if (
									23 === r.type &&
									'url' === r.value.toLowerCase()
								) {
									const r =
										e + 1 < n.length ? n[e + 1] : null;
									r &&
										2 === r.type &&
										(r.value = new URL(
											r.value,
											t
										).toString());
								}
							}
						const r = {
							descriptors: [],
							parent: null,
							transformStyleRule: (e) => e,
						};
						return {
							source: B(Re(F(n, !0), r)),
							descriptors: r.descriptors,
						};
					} catch (t) {
						return (
							console.warn(
								'An error occurred while transpiling stylesheet: ' +
									t
							),
							{ source: e, descriptors: [] }
						);
					}
				})(t, u ? u.toString() : void 0);
				let c = () => {};
				return (
					(null != o && o.aborted) ||
						(h.set(e, s.descriptors),
						(c = () => h.delete(e)),
						(r = null)),
					{
						source: s.source,
						dispose: c,
						refresh() {
							p(n);
						},
					}
				);
			}
			function x() {
				if (!r) {
					r = [];
					for (const e of document.styleSheets) {
						const t = e.ownerNode;
						if (t instanceof Element) {
							const e = h.get(t);
							e && r.push(...e);
						}
					}
				}
				return r;
			}
			const q = { cqw: null, cqh: null };
			function C({ width: e, height: t }) {
				(q.cqw = e), (q.cqh = t);
			}
			function L(e, t, n) {
				if (e instanceof Element && t) {
					const r = t.computeAttributesForElement(e);
					a(() => {
						r.length > 0
							? e.setAttribute(n, r)
							: e.removeAttribute(n);
					});
				}
			}
			function $(r) {
				let s = t(r);
				if (!s) {
					let c,
						f,
						h = null,
						z = 0;
					if (r === n)
						(c = y),
							(f = new et(n, {
								getParentState() {
									const t = f.getLayoutData();
									return {
										conditions: new Map(),
										context: e({}, q, {
											fontSize: t.fontSize,
											rootFontSize: t.fontSize,
											writingAxis: t.writingAxis,
										}),
										displayFlags: t.displayFlags,
										isQueryContainer: !1,
									};
								},
								getQueryDescriptors: x,
							}));
					else {
						const n = r.parentNode,
							s = n ? t(n) : null;
						if (!s) throw new Error('Expected node to have parent');
						(h = s.state),
							(f =
								r instanceof Element
									? new et(r, {
											getParentState: () => s.state.get(),
											getQueryDescriptors: x,
									  })
									: h),
							(z = s.depth + 1),
							(c =
								r === u
									? new Ze(u, { viewportChanged: C })
									: r === o
									? new Ye(o)
									: r instanceof HTMLLinkElement
									? new Ke(r, {
											registerStyleSheet: (t) =>
												S(r, e({}, t)),
									  })
									: r instanceof HTMLStyleElement
									? new Xe(r, {
											registerStyleSheet: (t) =>
												S(r, e({}, t)),
									  })
									: new Je(r));
					}
					const E = r instanceof Element ? () => p(r) : () => {},
						P =
							r instanceof HTMLElement || r instanceof SVGElement
								? r.style
								: null;
					(s = {
						depth: z,
						state: f,
						connect() {
							r instanceof Element && l.observe(r);
							for (const e of r.childNodes) $(e);
							c.connected(), E();
						},
						disconnect() {
							r instanceof Element &&
								(l.unobserve(r),
								r.removeAttribute(d),
								r.removeAttribute(v)),
								P &&
									(P.removeProperty(w),
									P.removeProperty(b),
									P.removeProperty(m),
									P.removeProperty(g));
							for (const e of r.childNodes) {
								const n = t(e);
								null == n || n.disconnect();
							}
							c.disconnected(), delete r[Ie];
						},
						resize() {
							if ((f.invalidate(), L(r, f, d), P)) {
								const e = f.get(),
									t = e.context,
									n = t.writingAxis;
								a(() => {
									!h ||
									n !== h.get().context.writingAxis ||
									e.isQueryContainer
										? (P.setProperty(
												w,
												`var(${0 === n ? m : g})`
										  ),
										  P.setProperty(
												b,
												`var(${1 === n ? m : g})`
										  ))
										: (P.removeProperty(w),
										  P.removeProperty(b)),
										!h || e.isQueryContainer
											? (t.cqw &&
													P.setProperty(
														m,
														t.cqw + 'px'
													),
											  t.cqh &&
													P.setProperty(
														g,
														t.cqh + 'px'
													))
											: (P.removeProperty(m),
											  P.removeProperty(g));
								});
							}
							c.resized(f);
							for (const e of r.childNodes) $(e).parentResize();
						},
						parentResize() {
							if ((f.invalidate(), L(r, h, v), E(), !i.has(r)))
								for (const e of r.childNodes)
									$(e).parentResize();
						},
						mutate() {
							f.invalidate(), E();
							for (const e of r.childNodes) $(e);
						},
					}),
						(r[Ie] = s),
						s.connect();
				}
				return s;
			}
			n.prepend(o, u), $(n);
		})();
