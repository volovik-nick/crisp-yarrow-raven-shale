import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/load-CXJA8n_x.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CATEGORIES = [
	{
		id: "0",
		name: "Продажи"
	},
	{
		id: "4",
		name: "Сопровождение"
	},
	{
		id: "8",
		name: "Тендеры"
	},
	{
		id: "12",
		name: "Партнёрский канал"
	}
];
var employees = [
	row("Марина Лебедева", "user/7256", "0", 28, 6, 31, 96, 4),
	row("Илья Сорокин", "user/7310", "0", 24, 3, 22, 71, 6),
	row("Анна Крылова", "user/7402", "4", 19, 4, 18, 54, 2),
	row("Павел Ершов", "user/7518", "8", 17, 1, 9, 40, 5),
	row("Ольга Никитина", "user/7604", "0", 16, 5, 27, 63, 1),
	row("Сергей Волков", "user/7688", "12", 14, 2, 11, 33, 3),
	row("Дарья Морозова", "user/7741", "4", 13, 2, 14, 41, 2),
	row("Кирилл Антонов", "user/7812", "8", 12, 0, 6, 22, 4),
	row("Елена Басова", "user/7905", "0", 11, 1, 8, 29, 1),
	row("Никита Орлов", "user/8020", "12", 9, 2, 7, 18, 2),
	row("Юлия Савельева", "user/8114", "4", 8, 1, 5, 16, 0),
	row("Артём Громов", "user/8199", "8", 7, 0, 3, 11, 3)
];
function row(name, uri, project, active, a24, a7, a30, idle) {
	return {
		project,
		name,
		uri: `urn:bitrix24:entity:demo:${uri}`,
		active_deals: active,
		activities_24h: a24,
		activities_7d: a7,
		activities_30d: a30,
		inactive_deals_7d: idle
	};
}
var redDeals = [
	deal("23260", "Поставка стеллажей · Северсталь", "Илья Сорокин", "0", 18, 11),
	deal("24102", "Модернизация склада, этап 2", "Павел Ершов", "8", 40, 16),
	deal("23881", "Сервисный контракт Q4", "Кирилл Антонов", "8", 26, 9),
	deal("25014", "Лицензии и внедрение CRM", "Сергей Волков", "12", 12, 8),
	deal("24670", "Аудит воронки дистрибуции", "Никита Орлов", "12", 33, 21),
	deal("22990", "Расширение SLA сопровождения", "Анна Крылова", "4", 55, 14),
	deal("25501", "Пилот аналитики для отдела продаж", "Марина Лебедева", "0", 9, 8),
	deal("23340", "Интеграция 1С, остаток работ", "Артём Громов", "8", 61, 30)
];
function deal(id, title, manager, project, createdDays, idleDays) {
	return {
		project,
		uri: `urn:bitrix24:entity:demo:deal/${id}`,
		title,
		manager,
		created_at: daysAgo(createdDays),
		last_activity_time: daysAgo(idleDays)
	};
}
var subjects = [
	[
		"Созвон по коммерческому предложению",
		"InProgressDeal · ActiveDeal",
		"Поставка климатического контура"
	],
	[
		"Письмо со спецификацией",
		"InProgressDeal · ActiveDeal",
		"Линия комплектации, цех 3"
	],
	[
		"Встреча на объекте",
		"ActiveDeal",
		"Складской контур · логистика"
	],
	[
		"Комментарий в карточке",
		"InProgressDeal",
		"Сервис датчиков температуры"
	],
	[
		"Задача: согласовать смету",
		"InProgressDeal · ActiveDeal",
		"Тендер на оснащение"
	],
	[
		"Звонок: статус оплаты",
		"SuccessfulDeal",
		"Закрытый контракт сопровождения"
	],
	[
		"Письмо: протокол встречи",
		"ActiveDeal",
		"Партнёрский кабинет дилеров"
	],
	[
		"Напоминание менеджеру",
		"InProgressDeal",
		"Доработка воронки лидов"
	]
];
function activities() {
	const names = employees.map((item) => item.name);
	return Array.from({ length: 20 }, (_, index) => {
		const [subject, classes, title] = subjects[index % subjects.length];
		const owner = names[index % names.length];
		return {
			uri: `urn:bitrix24:entity:demo:activity/${794e3 + index}`,
			subject,
			created_at: hoursAgo(index * 5 + 2),
			deal_uri: `urn:bitrix24:entity:demo:deal/${23e3 + index}`,
			deal_title: title,
			deal_classes: classes,
			employee_uri: employees[index % employees.length].uri,
			employee_name: owner
		};
	});
}
function daysAgo(days) {
	return (/* @__PURE__ */ new Date(Date.now() - days * 864e5)).toISOString();
}
function hoursAgo(hours) {
	return (/* @__PURE__ */ new Date(Date.now() - hours * 36e5)).toISOString();
}
function sum(list, key) {
	return list.reduce((total, item) => total + Number(item[key] ?? 0), 0);
}
function buildDemo(project) {
	const known = CATEGORIES.some((item) => item.id === project);
	const selected = project === "all" || !known ? "all" : project;
	const team = employees.filter((item) => selected === "all" || item.project === selected);
	const idle = redDeals.filter((item) => selected === "all" || item.project === selected);
	const summaryTeam = selected === "all" ? employees : team;
	const pulse = {
		available: true,
		backend: "fuseki",
		as_of: (/* @__PURE__ */ new Date()).toISOString(),
		categories: CATEGORIES,
		summary: {
			active_deals: sum(summaryTeam, "active_deals"),
			created_24h: selected === "all" ? 7 : Math.max(1, Math.round(sum(summaryTeam, "active_deals") / 18)),
			created_7d: selected === "all" ? 41 : Math.max(2, Math.round(sum(summaryTeam, "active_deals") / 5)),
			created_30d: selected === "all" ? 128 : Math.max(4, Math.round(sum(summaryTeam, "active_deals") * .72)),
			inactive_7d: idle.length
		},
		employees: team.map(({ project: _project, ...employee }) => employee).sort((a, b) => b.active_deals - a.active_deals).slice(0, 20)
	};
	const byType = {
		deal: 1486,
		activity: 6240,
		user: 86,
		category: 4,
		stage: 22,
		source: 11
	};
	const byDate = Array.from({ length: 14 }, (_, index) => {
		const date = /* @__PURE__ */ new Date();
		date.setUTCDate(date.getUTCDate() - (13 - index));
		const wave = [
			42,
			38,
			55,
			61,
			48,
			33,
			29,
			70,
			66,
			51,
			44,
			58,
			63,
			47
		][index] ?? 40;
		return {
			date: date.toISOString().slice(0, 10),
			graphs: wave
		};
	});
	return {
		mode: "demo",
		project: selected,
		checked_at: (/* @__PURE__ */ new Date()).toISOString(),
		errors: {},
		pulse,
		redDeals: idle.map(({ project: _project, ...deal }) => deal),
		activities: activities(),
		status: {
			checked_at: (/* @__PURE__ */ new Date()).toISOString(),
			sync: {
				state: "waiting",
				last_run_id: "run-2026-11-11-demo",
				age_seconds: 46,
				caught_up: true,
				exporter_run_id: "run-2026-11-11-demo",
				exporter_run_status: "complete"
			},
			exporter: {
				state: "available",
				last_run_id: "run-2026-11-11-demo",
				run_status: "complete",
				mode: "incremental",
				created_at: hoursAgo(1),
				checked_at: (/* @__PURE__ */ new Date()).toISOString()
			},
			store: {
				available: true,
				backend: "fuseki",
				backend_name: "Apache Jena Fuseki",
				query_seconds: .42,
				checked_at: (/* @__PURE__ */ new Date()).toISOString(),
				types: {
					deal: {
						graphs: byType.deal,
						modified_graphs: 210,
						latest_created_at: hoursAgo(3),
						latest_modified_at: hoursAgo(1)
					},
					activity: {
						graphs: byType.activity,
						modified_graphs: 480,
						latest_created_at: hoursAgo(2),
						latest_modified_at: hoursAgo(1)
					},
					user: {
						graphs: byType.user,
						modified_graphs: 6,
						latest_created_at: daysAgo(12),
						latest_modified_at: daysAgo(2)
					},
					category: {
						graphs: byType.category,
						modified_graphs: 1,
						latest_created_at: daysAgo(80),
						latest_modified_at: daysAgo(20)
					},
					stage: {
						graphs: byType.stage,
						modified_graphs: 4,
						latest_created_at: daysAgo(40),
						latest_modified_at: daysAgo(6)
					},
					source: {
						graphs: byType.source,
						modified_graphs: 2,
						latest_created_at: daysAgo(30),
						latest_modified_at: daysAgo(9)
					}
				}
			}
		},
		stats: {
			backend: "fuseki",
			backend_name: "Apache Jena Fuseki",
			total_graphs: Object.values(byType).reduce((a, b) => a + b, 0),
			dated_graphs: byDate.reduce((a, b) => a + b.graphs, 0),
			by_type: byType,
			by_date: byDate,
			date_predicate: "createdAt",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
var PROJECT = /^[A-Za-z0-9_.:-]{1,64}$/;
function cleanBase(raw, label) {
	const value = raw.trim();
	if (!value) return "";
	if (value.length > 300) throw new Error(`${label}: слишком длинный адрес`);
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`${label}: нужен абсолютный http(s) адрес`);
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error(`${label}: только http или https`);
	if (url.username || url.password) throw new Error(`${label}: не передавайте логин и пароль в адресе`);
	url.hash = "";
	url.search = "";
	return url.toString().replace(/\/$/, "");
}
function join(base, path, query) {
	const url = new URL(base.endsWith("/") ? base : `${base}/`);
	url.pathname = `${url.pathname.replace(/\/$/, "")}${path}`;
	if (query) for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
	return url.toString();
}
async function readJson(url) {
	const response = await fetch(url, {
		headers: { accept: "application/json" },
		signal: AbortSignal.timeout(15e3),
		redirect: "follow"
	});
	const text = await response.text();
	let body = null;
	if (text) try {
		body = JSON.parse(text);
	} catch {
		body = null;
	}
	if (!response.ok) {
		const message = body && typeof body === "object" && "error" in body && typeof body.error === "string" ? body.error : `Ответ ${response.status}`;
		throw new Error(message);
	}
	return body;
}
async function settle(key, run, errors) {
	try {
		return await run();
	} catch (error) {
		errors[key] = error instanceof Error ? error.message : "Запрос не выполнен";
		return null;
	}
}
var loadSnapshot_createServerFn_handler = createServerRpc({
	id: "871addec83e1f0824ab54e1c0bf2d939df61e0251a0b292eaa549f4e24c7f61a",
	name: "loadSnapshot",
	filename: "src/lib/semantic/load.ts"
}, (opts) => loadSnapshot.__executeServer(opts));
var loadSnapshot = createServerFn({ method: "POST" }).validator((data) => {
	if (data.mode !== "demo" && data.mode !== "live") throw new Error("Неизвестный режим");
	const project = data.project?.trim() || "all";
	if (project !== "all" && !PROJECT.test(project)) throw new Error("Некорректный проект");
	return {
		mode: data.mode,
		project,
		crmBase: cleanBase(data.crmBase ?? "", "CRM Pulse"),
		monitorBase: cleanBase(data.monitorBase ?? "", "Монитор RDF")
	};
}).handler(loadSnapshot_createServerFn_handler, async ({ data }) => {
	if (data.mode === "demo") return buildDemo(data.project);
	const errors = {};
	if (!data.crmBase) errors.pulse = "Адрес CRM Pulse не задан";
	if (!data.monitorBase) errors.status = "Адрес монитора RDF не задан";
	const projectQuery = { project: data.project };
	const [pulse, red, activities, status, stats] = await Promise.all([
		data.crmBase ? settle("pulse", () => readJson(join(data.crmBase, "/api/pulse", projectQuery)), errors) : Promise.resolve(null),
		data.crmBase ? settle("red", async () => {
			return (await readJson(join(data.crmBase, "/api/red-deals", projectQuery))).red_deals ?? [];
		}, errors) : Promise.resolve([]),
		data.crmBase ? settle("activities", async () => {
			return (await readJson(join(data.crmBase, "/api/recent-activities"))).activities ?? [];
		}, errors) : Promise.resolve([]),
		data.monitorBase ? settle("status", () => readJson(join(data.monitorBase, "/api/status")), errors) : Promise.resolve(null),
		data.monitorBase ? settle("stats", () => readJson(join(data.monitorBase, "/api/stats")), errors) : Promise.resolve(null)
	]);
	return {
		mode: "live",
		project: data.project,
		checked_at: (/* @__PURE__ */ new Date()).toISOString(),
		errors,
		pulse,
		redDeals: red ?? [],
		activities: activities ?? [],
		status,
		stats
	};
});
//#endregion
export { loadSnapshot_createServerFn_handler };
