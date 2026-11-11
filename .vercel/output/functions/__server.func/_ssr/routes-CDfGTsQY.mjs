import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { H as isRedirect, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as List, c as Activity, i as RefreshCw, o as Database, r as ShieldAlert, s as Cable, t as Users } from "../_libs/lucide-react.mjs";
import { n as Route, r as loadSnapshot } from "./router-CgdY1VLG.mjs";
import { a as Area, c as Tooltip, i as XAxis, n as BarChart, o as Bar, r as YAxis, s as ResponsiveContainer, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CDfGTsQY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var numberFormat = new Intl.NumberFormat("ru-RU");
var dateFormat = new Intl.DateTimeFormat("ru-RU", {
	timeZone: "Europe/Moscow",
	day: "2-digit",
	month: "short",
	hour: "2-digit",
	minute: "2-digit"
});
var dayFormat = new Intl.DateTimeFormat("ru-RU", {
	timeZone: "Europe/Moscow",
	day: "2-digit",
	month: "short"
});
function formatNumber(value) {
	return numberFormat.format(Number(value ?? 0));
}
function formatDate(raw) {
	if (!raw) return "Нет данных";
	const date = new Date(raw);
	return Number.isNaN(date.getTime()) ? "Нет данных" : dateFormat.format(date);
}
function formatDay(raw) {
	const date = /* @__PURE__ */ new Date(`${raw}T00:00:00Z`);
	return Number.isNaN(date.getTime()) ? raw : dayFormat.format(date);
}
function tail(uri) {
	if (!uri) return "";
	const cut = Math.max(uri.lastIndexOf("/"), uri.lastIndexOf(":"));
	return uri.slice(cut + 1);
}
var CLASS_LABELS = {
	InProgressDeal: "В процессе",
	ActiveDeal: "Активная",
	ClosedDeal: "Закрыта",
	SuccessfulDeal: "Успешно закрыта"
};
function readableClasses(raw) {
	if (!raw) return "Класс не определён";
	return raw.split(" · ").map((name) => CLASS_LABELS[name] ?? name).join(" · ");
}
var TYPE_LABELS = {
	deal: "Сделки",
	activity: "Активности",
	user: "Пользователи",
	category: "Категории",
	stage: "Стадии",
	source: "Источники"
};
var SYNC_LABELS = {
	running: "Работает",
	waiting: "Ждёт следующий цикл",
	idle: "Цикл завершён",
	error: "Ошибка цикла",
	stale: "Статус устарел",
	unknown: "Нет данных"
};
var NAV = [
	{
		id: "pulse",
		label: "Пульс",
		icon: Activity
	},
	{
		id: "team",
		label: "Команда",
		icon: Users
	},
	{
		id: "red",
		label: "Красные",
		icon: ShieldAlert
	},
	{
		id: "feed",
		label: "Лента",
		icon: List
	},
	{
		id: "store",
		label: "Хранилище",
		icon: Database
	},
	{
		id: "link",
		label: "Связь",
		icon: Cable
	}
];
var STORAGE_KEY = "semantic-bi-link";
var chartTip = {
	contentStyle: {
		background: "color-mix(in oklab, var(--color-ink) 88%, transparent)",
		border: "1px solid color-mix(in oklab, white 16%, transparent)",
		borderRadius: 12,
		color: "var(--color-fg)",
		fontSize: 12
	},
	cursor: { fill: "color-mix(in oklab, white 6%, transparent)" }
};
function Console({ initial }) {
	const load = useServerFn(loadSnapshot);
	const [view, setView] = (0, import_react.useState)("pulse");
	const [project, setProject] = (0, import_react.useState)("all");
	const [settings, setSettings] = (0, import_react.useState)({
		mode: "demo",
		crmBase: "",
		monitorBase: "",
		project: "all"
	});
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const saved = JSON.parse(raw);
			if (saved.mode === "live" || saved.mode === "demo") setSettings({
				mode: saved.mode,
				crmBase: saved.crmBase ?? "",
				monitorBase: saved.monitorBase ?? "",
				project: "all"
			});
		} catch {}
	}, []);
	const query = useQuery({
		queryKey: [
			"semantic-bi",
			settings.mode,
			settings.crmBase,
			settings.monitorBase,
			project
		],
		queryFn: () => load({ data: {
			...settings,
			project
		} }),
		initialData: settings.mode === "demo" && project === "all" ? initial : void 0,
		placeholderData: (previous) => previous,
		refetchInterval: settings.mode === "live" ? 2e4 : false
	});
	const data = query.data;
	const categories = data?.pulse?.categories ?? [];
	function save(next) {
		const stored = {
			...next,
			project: "all"
		};
		setSettings(stored);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
		setView(next.mode === "live" ? "pulse" : view);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "atmosphere",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-3 py-3 md:px-5 md:py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "glass sticky top-5 hidden h-[calc(100vh-2.5rem)] w-56 shrink-0 flex-col p-3 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-6 flex flex-1 flex-col gap-1",
						"aria-label": "Разделы",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
							item,
							active: view === item.id,
							onClick: () => setView(item.id)
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 text-xs leading-5 text-muted",
						children: "Только чтение · SPARQL SELECT"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col gap-4 pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "glass flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.18em] text-ice uppercase",
								children: "Semantic BI · Bitrix24"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl tracking-tight",
								children: titleFor(view)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								view !== "store" && view !== "feed" && view !== "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-w-40 flex-col gap-1 text-xs text-muted",
									children: ["Проект", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "field min-h-11 py-2",
										value: categories.some((item) => item.id === project) ? project : "all",
										onChange: (event) => setProject(event.target.value),
										"aria-label": "Фильтр по категории проекта",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "Все проекты"
										}), categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: item.id,
											children: item.name
										}, item.id))]
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									data,
									live: settings.mode === "live",
									pending: query.isFetching
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "glass glass-press inline-flex min-h-11 items-center gap-2 px-3 text-sm",
									onClick: () => void query.refetch(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: query.isFetching ? "size-4 animate-spin" : "size-4" }), "Обновить"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-2 overflow-x-auto md:hidden",
						"aria-label": "Разделы",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setView(item.id),
							className: "glass glass-press inline-flex min-h-11 shrink-0 items-center gap-2 px-3 text-sm " + (view === item.id ? "text-ice" : "text-steel"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}, item.id))
					}),
					!data && query.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {}) : null,
					query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text: query.error instanceof Error ? query.error.message : "Не удалось обновить срез" }) : null,
					data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewBody, {
						view,
						data,
						settings,
						onSave: save
					}) : null
				]
			})]
		})]
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 px-2 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-10 place-items-center rounded-2xl border border-white/15 bg-white/10 font-display text-sm text-ice",
			children: "SB"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg leading-none tracking-tight",
			children: "Nord"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "операционный контур"
		})] })]
	});
}
function NavButton({ item, active, onClick }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-current": active ? "page" : void 0,
		className: "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-left text-sm transition-colors duration-200 " + (active ? "bg-white/10 text-fg" : "text-steel hover:bg-white/5"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-ice" }), item.label]
	});
}
function StatusPill({ data, live, pending }) {
	const backend = data?.pulse?.backend ?? data?.status?.store.backend;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "size-2 rounded-full " + (live ? "bg-ice" : "bg-steel") }), !live ? "Демо-срез" : pending ? "Запрос" : backend === "graphdb" ? "GraphDB" : backend === "fuseki" ? "Fuseki" : "Живой контур"]
	});
}
function titleFor(view) {
	if (view === "pulse") return "Пульс воронки P";
	if (view === "team") return "Нагрузка команды";
	if (view === "red") return "Красные сделки";
	if (view === "feed") return "Последние активности";
	if (view === "store") return "RDF-хранилище";
	return "Связь с мониторами";
}
function Banner({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "glass border-signal/40 px-4 py-3 text-sm text-signal",
		role: "status",
		children: text
	});
}
function Skeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-4",
		children: Array.from({ length: 4 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "glass h-32 animate-pulse" }, index))
	});
}
function ViewBody({ view, data, settings, onSave }) {
	if (view === "pulse") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseView, { data });
	if (view === "team") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamView, { data });
	if (view === "red") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedView, { data });
	if (view === "feed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedView, { data });
	if (view === "store") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreView, { data });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkView, {
		settings,
		data,
		onSave
	});
}
function PulseView({ data }) {
	const summary = data.pulse?.summary;
	if (!summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text: data.errors.pulse ?? "Сводка пульса недоступна" });
	const windows = [
		{
			name: "24 ч",
			value: summary.created_24h
		},
		{
			name: "7 дн",
			value: summary.created_7d
		},
		{
			name: "30 дн",
			value: summary.created_30d
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			data.errors.pulse ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text: data.errors.pulse }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 md:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						className: "md:col-span-2",
						label: "Активные сделки",
						value: summary.active_deals,
						note: "Стадия P · в работе",
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "За 24 часа",
						value: summary.created_24h,
						note: "Новые в работе"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "За 7 дней",
						value: summary.created_7d,
						note: "Новые в работе"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "За 30 дней",
						value: summary.created_30d,
						note: "Новые в работе"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Без активности",
						value: summary.inactive_7d,
						note: "7 дней · владелец-сделка",
						signal: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass p-4 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.16em] text-muted uppercase",
							children: "Создано в окнах"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-xl",
							children: "Приток сделок P"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-52",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: windows,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											tick: {
												fill: "var(--color-muted)",
												fontSize: 12
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTip }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value",
											name: "Сделки",
											fill: "var(--color-ice)",
											radius: [
												10,
												10,
												4,
												4
											]
										})
									]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass flex flex-col justify-between p-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.16em] text-muted uppercase",
							children: "Срез"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-xl",
							children: "Как считается пульс"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3 text-sm leading-6 text-steel",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Активные сделки — семантика стадии P." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Окна 24 часа, 7 и 30 дней считаются от текущего времени хранилища." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Красная сделка: нет CRM Activity с владельцем-сделкой за 7 дней." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Обновлено ",
									formatDate(data.pulse?.as_of),
									"."
								] })
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "GET /api/pulse"
					})]
				})]
			})
		]
	});
}
function Metric({ label, value, note, accent, signal, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `glass p-4 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.14em] text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `metric mt-3 text-5xl ${signal ? "text-signal" : accent ? "text-ice" : "text-fg"}`,
				children: formatNumber(value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-steel",
				children: note
			})
		]
	});
}
function TeamView({ data }) {
	const rows = data.pulse?.employees ?? [];
	const max = Math.max(1, ...rows.map((row) => row.active_deals));
	if (!data.pulse) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text: data.errors.pulse ?? "Команда недоступна" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3 px-4 py-4 md:px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.16em] text-muted uppercase",
				children: "20 крупнейших портфелей"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Сотрудники и реакция"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-steel",
				children: "Сделки — по назначенному. Активности — по ответственному CRM-дела. В фильтре проекта учитываются только активности сделок этой категории."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs tracking-wide text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Сотрудник"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Сделки P"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "24 ч"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "7 дн"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "30 дн"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Без активности"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "px-4 py-8 text-muted",
					children: "Нет сотрудников с активными сделками P"
				}) }) : rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-white/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: row.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: tail(row.uri)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "metric text-lg",
								children: formatNumber(row.active_deals)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-ice",
									style: { width: `${row.active_deals / max * 100}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: formatNumber(row.activities_24h)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: formatNumber(row.activities_7d)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: formatNumber(row.activities_30d)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `px-4 py-3 tabular-nums ${row.inactive_deals_7d ? "text-signal" : ""}`,
							children: formatNumber(row.inactive_deals_7d)
						})
					]
				}, row.uri ?? row.name)) })]
			})
		})]
	});
}
function RedView({ data }) {
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return data.redDeals;
		return data.redDeals.filter((deal) => `${deal.title} ${deal.manager}`.toLowerCase().includes(needle));
	}, [data.redDeals, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3 px-4 py-4 md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.16em] text-signal uppercase",
					children: "Требуют внимания"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-xl",
					children: [formatNumber(data.redDeals.length), " без касания 7 дней"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field max-w-xs",
					value: q,
					onChange: (event) => setQ(event.target.value),
					placeholder: "Сделка или менеджер",
					"aria-label": "Поиск по красным сделкам"
				})]
			}),
			data.errors.red ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text: data.errors.red })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[680px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Сделка"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Ответственный"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Создана"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Последняя активность"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 4,
						className: "px-4 py-8 text-muted",
						children: "Сделок без активности за 7 дней нет."
					}) }) : rows.map((deal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "border-l-2 border-signal px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: deal.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted",
									children: tail(deal.uri)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: deal.manager
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-steel",
								children: formatDate(deal.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-signal",
								children: formatDate(deal.last_activity_time)
							})
						]
					}, deal.uri ?? deal.title)) })]
				})
			})
		]
	});
}
function FeedView({ data }) {
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return data.activities;
		return data.activities.filter((item) => `${item.subject} ${item.deal_title} ${item.employee_name}`.toLowerCase().includes(needle));
	}, [data.activities, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-steel",
					children: "Двадцать последних активностей по сделкам. GET /api/recent-activities"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field max-w-xs",
					value: q,
					onChange: (event) => setQ(event.target.value),
					placeholder: "Тема, сделка, сотрудник",
					"aria-label": "Поиск по активностям"
				})]
			}),
			data.errors.activities ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text: data.errors.activities }) : null,
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "glass px-4 py-8 text-sm text-muted",
				children: "Активностей по сделкам пока нет."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-3",
				children: rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "glass grid gap-3 p-4 md:grid-cols-[160px_1fr_1fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
							className: "text-sm text-ice",
							children: formatDate(item.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: item.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: tail(item.uri)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-steel",
								children: readableClasses(item.deal_classes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: item.deal_title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: item.employee_name
							})
						] })
					]
				}, item.uri ?? item.subject))
			})
		]
	});
}
function StoreView({ data }) {
	const store = data.status?.store;
	const sync = data.status?.sync;
	const exporter = data.status?.exporter;
	const types = Object.entries(store?.types ?? {}).sort((a, b) => b[1].graphs - a[1].graphs);
	const bars = (data.stats?.by_type ? Object.entries(data.stats.by_type) : types.map(([key, value]) => [key, value.graphs])).map(([key, value]) => ({
		name: TYPE_LABELS[key] ?? key,
		value
	}));
	const timeline = (data.stats?.by_date ?? []).map((item) => ({
		...item,
		label: formatDay(item.date)
	}));
	const syncState = sync?.state ?? "unknown";
	const alerts = alertsFor(data);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			alerts.map((text) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, { text }, text)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.16em] text-muted uppercase",
							children: "Синхронизация S3 → RDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl",
							children: SYNC_LABELS[syncState] ?? syncState
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-[140px_1fr] gap-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Checkpoint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "break-all",
									children: sync?.last_run_id ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Run S3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "break-all",
									children: exporter?.last_run_id ?? "недоступен"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Сверка"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: sync?.caught_up === true ? "Догнал S3" : sync?.caught_up === false ? "Есть отставание" : "Не определено" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Статус"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: sync?.age_seconds == null ? "—" : `${sync.age_seconds} сек. назад` })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.16em] text-muted uppercase",
							children: "Хранилище"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl",
							children: store?.available ? store.backend_name || "RDF доступен" : "Нет ответа"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-[140px_1fr] gap-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Графов"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "metric text-xl",
									children: formatNumber(data.stats?.total_graphs ?? types.reduce((n, [, v]) => n + v.graphs, 0))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Запрос"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: store?.query_seconds == null ? "—" : `${store.query_seconds} сек.` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Проверено"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatDate(store?.checked_at ?? data.status?.checked_at) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Предикат"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: data.stats?.date_predicate ?? "createdAt" })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass p-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Графы по типам"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-56",
						children: bars.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: bars,
								layout: "vertical",
								margin: {
									left: 8,
									right: 8
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										width: 96,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTip }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										name: "Графы",
										fill: "var(--color-ice)",
										radius: [
											0,
											8,
											8,
											0
										]
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Нет данных по графам"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass p-4 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Создание записей"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "По `createdAt`, не по свежести синка. GET /api/stats"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-56",
							children: timeline.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: timeline,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: {
												fill: "var(--color-muted)",
												fontSize: 11
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTip }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "graphs",
											name: "Графы",
											stroke: "var(--color-ice)",
											fill: "color-mix(in oklab, var(--color-ice) 28%, transparent)",
											strokeWidth: 2
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Таймлайн появится после ответа /api/stats"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "glass overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Тип"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Графы"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "С датой изменения"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Последний createdAt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Последний modifiedAt"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: types.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-4 py-8 text-muted",
						children: "Нет данных по графам"
					}) }) : types.map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: TYPE_LABELS[key] ?? key
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: formatNumber(value.graphs)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: formatNumber(value.modified_graphs)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-steel",
								children: formatDate(value.latest_created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-steel",
								children: formatDate(value.latest_modified_at)
							})
						]
					}, key)) })]
				})
			})
		]
	});
}
function alertsFor(data) {
	const notes = [];
	const sync = data.status?.sync;
	const exporter = data.status?.exporter;
	const store = data.status?.store;
	if (data.errors.status) notes.push(data.errors.status);
	if (data.errors.stats) notes.push(data.errors.stats);
	if (sync?.state === "error") notes.push("Загрузчик сообщил об ошибке цикла.");
	if (sync?.state === "stale") notes.push("Статус загрузчика устарел.");
	if (sync?.caught_up === false) notes.push("Checkpoint отстаёт от последнего завершённого run в S3.");
	if (exporter?.state === "unavailable") notes.push(`Не удалось прочитать экспортёр: ${exporter.reason ?? "ошибка"}`);
	if (exporter?.run_status && exporter.run_status !== "complete") notes.push(`Последний exporter run: ${exporter.run_status}`);
	if (store && store.available === false) notes.push("RDF-хранилище недоступно или SPARQL-запрос отклонён.");
	return notes;
}
var ENDPOINTS = [
	["CRM Pulse", "GET /api/pulse?project="],
	["CRM Pulse", "GET /api/red-deals?project="],
	["CRM Pulse", "GET /api/recent-activities"],
	["RDF монитор", "GET /api/status"],
	["RDF монитор", "GET /api/stats"]
];
function LinkView({ settings, data, onSave }) {
	const [draft, setDraft] = (0, import_react.useState)(settings);
	(0, import_react.useEffect)(() => setDraft(settings), [settings]);
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "glass flex flex-col gap-4 p-4 md:p-5",
			onSubmit: (event) => {
				event.preventDefault();
				if (draft.mode === "live" && !draft.crmBase.trim() && !draft.monitorBase.trim()) {
					setError("Для живого контура укажите хотя бы один адрес монитора.");
					return;
				}
				setError("");
				onSave(draft);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.16em] text-muted uppercase",
						children: "Источник"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Демо или живые мониторы"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-steel",
						children: "Консоль повторяет контракт CRM Pulse и RDF-монитора. Секреты GraphDB и Fuseki остаются на их серверах: сюда нужен только корень уже запущенного дашборда."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: ["demo", "live"].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-2xl border px-3 text-sm " + (draft.mode === mode ? "border-ice/50 bg-white/10 text-ice" : "border-white/10 text-steel"),
						onClick: () => setDraft({
							...draft,
							mode
						}),
						children: mode === "demo" ? "Демо-срез" : "Живые API"
					}, mode))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1 text-sm text-steel",
					children: ["CRM Pulse, обычно порт 8082", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "url",
						placeholder: "https://pulse.example.com",
						value: draft.crmBase,
						onChange: (event) => setDraft({
							...draft,
							crmBase: event.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1 text-sm text-steel",
					children: ["RDF-монитор, обычно порт 8080", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "url",
						placeholder: "https://monitor.example.com",
						value: draft.monitorBase,
						onChange: (event) => setDraft({
							...draft,
							monitorBase: event.target.value
						})
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-signal",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "min-h-11 rounded-2xl bg-ice px-4 text-sm font-semibold text-ink",
					children: "Применить"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "glass p-4 md:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Эндпоинты"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: ENDPOINTS.map(([group, path]) => {
					const key = path.includes("pulse") ? "pulse" : path.includes("red-deals") ? "red" : path.includes("recent") ? "activities" : path.includes("status") ? "status" : "stats";
					const problem = data.mode === "live" ? data.errors[key] : void 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-white/10 pt-3 first:border-0 first:pt-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: group
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: problem ? "text-sm text-signal" : "text-sm text-ice",
								children: problem ?? (data.mode === "demo" ? "Демо той же формы" : "Ответ получен")
							})
						]
					}, path);
				})
			})]
		})]
	});
}
function Home() {
	const initial = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Console, { initial });
}
//#endregion
export { Home as component };
