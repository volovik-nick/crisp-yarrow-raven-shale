import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  Cable,
  Database,
  List,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { loadSnapshot } from "@/lib/semantic/load";
import type { LoadInput, Snapshot } from "@/lib/semantic/types";
import {
  TYPE_LABELS,
  SYNC_LABELS,
  formatDate,
  formatDay,
  formatNumber,
  readableClasses,
  tail,
} from "./format";

type View = "pulse" | "team" | "red" | "feed" | "store" | "link";

const NAV: { id: View; label: string; icon: typeof Activity }[] = [
  { id: "pulse", label: "Пульс", icon: Activity },
  { id: "team", label: "Команда", icon: Users },
  { id: "red", label: "Красные", icon: ShieldAlert },
  { id: "feed", label: "Лента", icon: List },
  { id: "store", label: "Хранилище", icon: Database },
  { id: "link", label: "Связь", icon: Cable },
];

const STORAGE_KEY = "semantic-bi-link";

const chartTip = {
  contentStyle: {
    background: "color-mix(in oklab, var(--color-ink) 88%, transparent)",
    border: "1px solid color-mix(in oklab, white 16%, transparent)",
    borderRadius: 12,
    color: "var(--color-fg)",
    fontSize: 12,
  },
  cursor: { fill: "color-mix(in oklab, white 6%, transparent)" },
};

export function Console({ initial }: { initial: Snapshot }) {
  const load = useServerFn(loadSnapshot);
  const [view, setView] = useState<View>("pulse");
  const [project, setProject] = useState("all");
  const [settings, setSettings] = useState<LoadInput>({
    mode: "demo",
    crmBase: "",
    monitorBase: "",
    project: "all",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<LoadInput>;
      if (saved.mode === "live" || saved.mode === "demo") {
        setSettings({
          mode: saved.mode,
          crmBase: saved.crmBase ?? "",
          monitorBase: saved.monitorBase ?? "",
          project: "all",
        });
      }
    } catch {
      /* ignore broken local settings */
    }
  }, []);

  const query = useQuery({
    queryKey: ["semantic-bi", settings.mode, settings.crmBase, settings.monitorBase, project],
    queryFn: () => load({ data: { ...settings, project } }),
    initialData: settings.mode === "demo" && project === "all" ? initial : undefined,
    placeholderData: (previous) => previous,
    refetchInterval: settings.mode === "live" ? 20_000 : false,
  });

  const data = query.data;
  const categories = data?.pulse?.categories ?? [];

  function save(next: LoadInput) {
    const stored = { ...next, project: "all" };
    setSettings(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setView(next.mode === "live" ? "pulse" : view);
  }

  return (
    <div className="relative min-h-screen">
      <div className="atmosphere" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-3 py-3 md:px-5 md:py-5">
        <aside className="glass sticky top-5 hidden h-[calc(100vh-2.5rem)] w-56 shrink-0 flex-col p-3 md:flex">
          <Brand />
          <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Разделы">
            {NAV.map((item) => (
              <NavButton key={item.id} item={item} active={view === item.id} onClick={() => setView(item.id)} />
            ))}
          </nav>
          <p className="px-2 text-xs leading-5 text-muted">Только чтение · SPARQL SELECT</p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4 pb-4">
          <header className="glass flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.18em] text-ice uppercase">Semantic BI · Bitrix24</p>
              <h1 className="font-display text-2xl tracking-tight">{titleFor(view)}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {view !== "store" && view !== "feed" && view !== "link" ? (
                <label className="flex min-w-40 flex-col gap-1 text-xs text-muted">
                  Проект
                  <select
                    className="field min-h-11 py-2"
                    value={categories.some((item) => item.id === project) ? project : "all"}
                    onChange={(event) => setProject(event.target.value)}
                    aria-label="Фильтр по категории проекта"
                  >
                    <option value="all">Все проекты</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <StatusPill data={data} live={settings.mode === "live"} pending={query.isFetching} />
              <button
                type="button"
                className="glass glass-press inline-flex min-h-11 items-center gap-2 px-3 text-sm"
                onClick={() => void query.refetch()}
              >
                <RefreshCw className={query.isFetching ? "size-4 animate-spin" : "size-4"} />
                Обновить
              </button>
            </div>
          </header>

          <nav className="flex gap-2 overflow-x-auto md:hidden" aria-label="Разделы">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={
                  "glass glass-press inline-flex min-h-11 shrink-0 items-center gap-2 px-3 text-sm " +
                  (view === item.id ? "text-ice" : "text-steel")
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {!data && query.isPending ? <Skeleton /> : null}
          {query.isError ? (
            <Banner text={query.error instanceof Error ? query.error.message : "Не удалось обновить срез"} />
          ) : null}
          {data ? <ViewBody view={view} data={data} settings={settings} onSave={save} /> : null}
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2 pt-2">
      <span className="grid size-10 place-items-center rounded-2xl border border-white/15 bg-white/10 font-display text-sm text-ice">
        SB
      </span>
      <div>
        <p className="font-display text-lg leading-none tracking-tight">Nord</p>
        <p className="text-xs text-muted">операционный контур</p>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-left text-sm transition-colors duration-200 " +
        (active ? "bg-white/10 text-fg" : "text-steel hover:bg-white/5")
      }
    >
      <Icon className="size-4 text-ice" />
      {item.label}
    </button>
  );
}

function StatusPill({
  data,
  live,
  pending,
}: {
  data: Snapshot | undefined;
  live: boolean;
  pending: boolean;
}) {
  const backend = data?.pulse?.backend ?? data?.status?.store.backend;
  const label = !live ? "Демо-срез" : pending ? "Запрос" : backend === "graphdb" ? "GraphDB" : backend === "fuseki" ? "Fuseki" : "Живой контур";
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm">
      <i className={"size-2 rounded-full " + (live ? "bg-ice" : "bg-steel")} />
      {label}
    </span>
  );
}

function titleFor(view: View) {
  if (view === "pulse") return "Пульс воронки P";
  if (view === "team") return "Нагрузка команды";
  if (view === "red") return "Красные сделки";
  if (view === "feed") return "Последние активности";
  if (view === "store") return "RDF-хранилище";
  return "Связь с мониторами";
}

function Banner({ text }: { text: string }) {
  return (
    <p className="glass border-signal/40 px-4 py-3 text-sm text-signal" role="status">
      {text}
    </p>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="glass h-32 animate-pulse" />
      ))}
    </div>
  );
}

function ViewBody({
  view,
  data,
  settings,
  onSave,
}: {
  view: View;
  data: Snapshot;
  settings: LoadInput;
  onSave: (next: LoadInput) => void;
}) {
  if (view === "pulse") return <PulseView data={data} />;
  if (view === "team") return <TeamView data={data} />;
  if (view === "red") return <RedView data={data} />;
  if (view === "feed") return <FeedView data={data} />;
  if (view === "store") return <StoreView data={data} />;
  return <LinkView settings={settings} data={data} onSave={onSave} />;
}

function PulseView({ data }: { data: Snapshot }) {
  const summary = data.pulse?.summary;
  if (!summary) return <Banner text={data.errors.pulse ?? "Сводка пульса недоступна"} />;
  const windows = [
    { name: "24 ч", value: summary.created_24h },
    { name: "7 дн", value: summary.created_7d },
    { name: "30 дн", value: summary.created_30d },
  ];
  return (
    <div className="flex flex-col gap-4">
      {data.errors.pulse ? <Banner text={data.errors.pulse} /> : null}
      <section className="grid gap-3 md:grid-cols-6">
        <Metric
          className="md:col-span-2"
          label="Активные сделки"
          value={summary.active_deals}
          note="Стадия P · в работе"
          accent
        />
        <Metric label="За 24 часа" value={summary.created_24h} note="Новые в работе" />
        <Metric label="За 7 дней" value={summary.created_7d} note="Новые в работе" />
        <Metric label="За 30 дней" value={summary.created_30d} note="Новые в работе" />
        <Metric label="Без активности" value={summary.inactive_7d} note="7 дней · владелец-сделка" signal />
      </section>
      <section className="grid gap-3 lg:grid-cols-5">
        <article className="glass p-4 lg:col-span-3">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Создано в окнах</p>
          <h2 className="mt-1 font-display text-xl">Приток сделок P</h2>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={windows}>
                <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...chartTip} />
                <Bar dataKey="value" name="Сделки" fill="var(--color-ice)" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="glass flex flex-col justify-between p-4 lg:col-span-2">
          <div>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Срез</p>
            <h2 className="mt-1 font-display text-xl">Как считается пульс</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-steel">
              <li>Активные сделки — семантика стадии P.</li>
              <li>Окна 24 часа, 7 и 30 дней считаются от текущего времени хранилища.</li>
              <li>Красная сделка: нет CRM Activity с владельцем-сделкой за 7 дней.</li>
              <li>Обновлено {formatDate(data.pulse?.as_of)}.</li>
            </ul>
          </div>
          <p className="text-xs text-muted">GET /api/pulse</p>
        </article>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  accent,
  signal,
  className = "",
}: {
  label: string;
  value: number;
  note: string;
  accent?: boolean;
  signal?: boolean;
  className?: string;
}) {
  return (
    <article className={`glass p-4 ${className}`}>
      <p className="text-xs tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className={`metric mt-3 text-5xl ${signal ? "text-signal" : accent ? "text-ice" : "text-fg"}`}>
        {formatNumber(value)}
      </p>
      <p className="mt-3 text-sm text-steel">{note}</p>
    </article>
  );
}

function TeamView({ data }: { data: Snapshot }) {
  const rows = data.pulse?.employees ?? [];
  const max = Math.max(1, ...rows.map((row) => row.active_deals));
  if (!data.pulse) return <Banner text={data.errors.pulse ?? "Команда недоступна"} />;
  return (
    <section className="glass overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-4 md:px-5">
        <div>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">20 крупнейших портфелей</p>
          <h2 className="font-display text-xl">Сотрудники и реакция</h2>
        </div>
        <p className="max-w-md text-sm text-steel">
          Сделки — по назначенному. Активности — по ответственному CRM-дела. В фильтре проекта учитываются только активности сделок этой категории.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Сотрудник</th>
              <th className="px-3 py-3 font-medium">Сделки P</th>
              <th className="px-3 py-3 font-medium">24 ч</th>
              <th className="px-3 py-3 font-medium">7 дн</th>
              <th className="px-3 py-3 font-medium">30 дн</th>
              <th className="px-4 py-3 font-medium">Без активности</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-muted">
                  Нет сотрудников с активными сделками P
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.uri ?? row.name} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted">{tail(row.uri)}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="metric text-lg">{formatNumber(row.active_deals)}</div>
                    <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-ice" style={{ width: `${(row.active_deals / max) * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{formatNumber(row.activities_24h)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatNumber(row.activities_7d)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatNumber(row.activities_30d)}</td>
                  <td className={`px-4 py-3 tabular-nums ${row.inactive_deals_7d ? "text-signal" : ""}`}>
                    {formatNumber(row.inactive_deals_7d)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RedView({ data }: { data: Snapshot }) {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data.redDeals;
    return data.redDeals.filter((deal) =>
      `${deal.title} ${deal.manager}`.toLowerCase().includes(needle),
    );
  }, [data.redDeals, q]);
  return (
    <section className="glass overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-4 md:px-5">
        <div>
          <p className="text-xs tracking-[0.16em] text-signal uppercase">Требуют внимания</p>
          <h2 className="font-display text-xl">{formatNumber(data.redDeals.length)} без касания 7 дней</h2>
        </div>
        <input
          className="field max-w-xs"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Сделка или менеджер"
          aria-label="Поиск по красным сделкам"
        />
      </div>
      {data.errors.red ? <div className="px-4 pb-3"><Banner text={data.errors.red} /></div> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Сделка</th>
              <th className="px-3 py-3 font-medium">Ответственный</th>
              <th className="px-3 py-3 font-medium">Создана</th>
              <th className="px-4 py-3 font-medium">Последняя активность</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-muted">
                  Сделок без активности за 7 дней нет.
                </td>
              </tr>
            ) : (
              rows.map((deal) => (
                <tr key={deal.uri ?? deal.title} className="border-t border-white/10">
                  <td className="border-l-2 border-signal px-4 py-3">
                    <div className="font-medium">{deal.title}</div>
                    <div className="text-xs text-muted">{tail(deal.uri)}</div>
                  </td>
                  <td className="px-3 py-3">{deal.manager}</td>
                  <td className="px-3 py-3 text-steel">{formatDate(deal.created_at)}</td>
                  <td className="px-4 py-3 text-signal">{formatDate(deal.last_activity_time)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FeedView({ data }: { data: Snapshot }) {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data.activities;
    return data.activities.filter((item) =>
      `${item.subject} ${item.deal_title} ${item.employee_name}`.toLowerCase().includes(needle),
    );
  }, [data.activities, q]);
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-steel">Двадцать последних активностей по сделкам. GET /api/recent-activities</p>
        <input
          className="field max-w-xs"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Тема, сделка, сотрудник"
          aria-label="Поиск по активностям"
        />
      </div>
      {data.errors.activities ? <Banner text={data.errors.activities} /> : null}
      {rows.length === 0 ? (
        <p className="glass px-4 py-8 text-sm text-muted">Активностей по сделкам пока нет.</p>
      ) : (
        <ol className="grid gap-3">
          {rows.map((item) => (
            <li key={item.uri ?? item.subject} className="glass grid gap-3 p-4 md:grid-cols-[160px_1fr_1fr]">
              <time className="text-sm text-ice">{formatDate(item.created_at)}</time>
              <div>
                <p className="font-medium">{item.subject}</p>
                <p className="text-xs text-muted">{tail(item.uri)}</p>
              </div>
              <div>
                <p className="text-sm text-steel">{readableClasses(item.deal_classes)}</p>
                <p className="font-medium">{item.deal_title}</p>
                <p className="text-sm text-muted">{item.employee_name}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function StoreView({ data }: { data: Snapshot }) {
  const store = data.status?.store;
  const sync = data.status?.sync;
  const exporter = data.status?.exporter;
  const types = Object.entries(store?.types ?? {}).sort((a, b) => b[1].graphs - a[1].graphs);
  const bars = (data.stats?.by_type
    ? Object.entries(data.stats.by_type)
    : types.map(([key, value]) => [key, value.graphs] as [string, number])
  ).map(([key, value]) => ({ name: TYPE_LABELS[key] ?? key, value }));
  const timeline = (data.stats?.by_date ?? []).map((item) => ({ ...item, label: formatDay(item.date) }));
  const syncState = sync?.state ?? "unknown";
  const alerts = alertsFor(data);

  return (
    <div className="flex flex-col gap-4">
      {alerts.map((text) => (
        <Banner key={text} text={text} />
      ))}
      <section className="grid gap-3 lg:grid-cols-2">
        <article className="glass p-4">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Синхронизация S3 → RDF</p>
          <h2 className="mt-1 font-display text-2xl">{SYNC_LABELS[syncState] ?? syncState}</h2>
          <dl className="mt-4 grid grid-cols-[140px_1fr] gap-y-2 text-sm">
            <dt className="text-muted">Checkpoint</dt>
            <dd className="break-all">{sync?.last_run_id ?? "—"}</dd>
            <dt className="text-muted">Run S3</dt>
            <dd className="break-all">{exporter?.last_run_id ?? "недоступен"}</dd>
            <dt className="text-muted">Сверка</dt>
            <dd>{sync?.caught_up === true ? "Догнал S3" : sync?.caught_up === false ? "Есть отставание" : "Не определено"}</dd>
            <dt className="text-muted">Статус</dt>
            <dd>{sync?.age_seconds == null ? "—" : `${sync.age_seconds} сек. назад`}</dd>
          </dl>
        </article>
        <article className="glass p-4">
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Хранилище</p>
          <h2 className="mt-1 font-display text-2xl">
            {store?.available ? store.backend_name || "RDF доступен" : "Нет ответа"}
          </h2>
          <dl className="mt-4 grid grid-cols-[140px_1fr] gap-y-2 text-sm">
            <dt className="text-muted">Графов</dt>
            <dd className="metric text-xl">{formatNumber(data.stats?.total_graphs ?? types.reduce((n, [, v]) => n + v.graphs, 0))}</dd>
            <dt className="text-muted">Запрос</dt>
            <dd>{store?.query_seconds == null ? "—" : `${store.query_seconds} сек.`}</dd>
            <dt className="text-muted">Проверено</dt>
            <dd>{formatDate(store?.checked_at ?? data.status?.checked_at)}</dd>
            <dt className="text-muted">Предикат</dt>
            <dd>{data.stats?.date_predicate ?? "createdAt"}</dd>
          </dl>
        </article>
      </section>
      <section className="grid gap-3 lg:grid-cols-5">
        <article className="glass p-4 lg:col-span-2">
          <h2 className="font-display text-xl">Графы по типам</h2>
          <div className="mt-3 h-56">
            {bars.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bars} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={96} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTip} />
                  <Bar dataKey="value" name="Графы" fill="var(--color-ice)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted">Нет данных по графам</p>
            )}
          </div>
        </article>
        <article className="glass p-4 lg:col-span-3">
          <h2 className="font-display text-xl">Создание записей</h2>
          <p className="text-sm text-muted">По `createdAt`, не по свежести синка. GET /api/stats</p>
          <div className="mt-3 h-56">
            {timeline.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <XAxis dataKey="label" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip {...chartTip} />
                  <Area type="monotone" dataKey="graphs" name="Графы" stroke="var(--color-ice)" fill="color-mix(in oklab, var(--color-ice) 28%, transparent)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted">Таймлайн появится после ответа /api/stats</p>
            )}
          </div>
        </article>
      </section>
      <section className="glass overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Тип</th>
              <th className="px-3 py-3 font-medium">Графы</th>
              <th className="px-3 py-3 font-medium">С датой изменения</th>
              <th className="px-3 py-3 font-medium">Последний createdAt</th>
              <th className="px-4 py-3 font-medium">Последний modifiedAt</th>
            </tr>
          </thead>
          <tbody>
            {types.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted">
                  Нет данных по графам
                </td>
              </tr>
            ) : (
              types.map(([key, value]) => (
                <tr key={key} className="border-t border-white/10">
                  <td className="px-4 py-3">{TYPE_LABELS[key] ?? key}</td>
                  <td className="px-3 py-3 tabular-nums">{formatNumber(value.graphs)}</td>
                  <td className="px-3 py-3 tabular-nums">{formatNumber(value.modified_graphs)}</td>
                  <td className="px-3 py-3 text-steel">{formatDate(value.latest_created_at)}</td>
                  <td className="px-4 py-3 text-steel">{formatDate(value.latest_modified_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function alertsFor(data: Snapshot) {
  const notes: string[] = [];
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

const ENDPOINTS = [
  ["CRM Pulse", "GET /api/pulse?project="],
  ["CRM Pulse", "GET /api/red-deals?project="],
  ["CRM Pulse", "GET /api/recent-activities"],
  ["RDF монитор", "GET /api/status"],
  ["RDF монитор", "GET /api/stats"],
];

function LinkView({
  settings,
  data,
  onSave,
}: {
  settings: LoadInput;
  data: Snapshot;
  onSave: (next: LoadInput) => void;
}) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings]);
  const [error, setError] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        className="glass flex flex-col gap-4 p-4 md:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (draft.mode === "live" && !draft.crmBase.trim() && !draft.monitorBase.trim()) {
            setError("Для живого контура укажите хотя бы один адрес монитора.");
            return;
          }
          setError("");
          onSave(draft);
        }}
      >
        <div>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Источник</p>
          <h2 className="font-display text-2xl">Демо или живые мониторы</h2>
          <p className="mt-2 text-sm leading-6 text-steel">
            Консоль повторяет контракт CRM Pulse и RDF-монитора. Секреты GraphDB и Fuseki остаются на их серверах: сюда нужен только корень уже запущенного дашборда.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["demo", "live"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={
                "min-h-11 rounded-2xl border px-3 text-sm " +
                (draft.mode === mode ? "border-ice/50 bg-white/10 text-ice" : "border-white/10 text-steel")
              }
              onClick={() => setDraft({ ...draft, mode })}
            >
              {mode === "demo" ? "Демо-срез" : "Живые API"}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1 text-sm text-steel">
          CRM Pulse, обычно порт 8082
          <input
            className="field"
            inputMode="url"
            placeholder="https://pulse.example.com"
            value={draft.crmBase}
            onChange={(event) => setDraft({ ...draft, crmBase: event.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-steel">
          RDF-монитор, обычно порт 8080
          <input
            className="field"
            inputMode="url"
            placeholder="https://monitor.example.com"
            value={draft.monitorBase}
            onChange={(event) => setDraft({ ...draft, monitorBase: event.target.value })}
          />
        </label>
        {error ? <p className="text-sm text-signal">{error}</p> : null}
        <button type="submit" className="min-h-11 rounded-2xl bg-ice px-4 text-sm font-semibold text-ink">
          Применить
        </button>
      </form>
      <aside className="glass p-4 md:p-5">
        <h2 className="font-display text-xl">Эндпоинты</h2>
        <ul className="mt-4 space-y-3">
          {ENDPOINTS.map(([group, path]) => {
            const key = path.includes("pulse")
              ? "pulse"
              : path.includes("red-deals")
                ? "red"
                : path.includes("recent")
                  ? "activities"
                  : path.includes("status")
                    ? "status"
                    : "stats";
            const problem = data.mode === "live" ? data.errors[key] : undefined;
            return (
              <li key={path} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                <p className="text-xs text-muted">{group}</p>
                <p className="font-medium">{path}</p>
                <p className={problem ? "text-sm text-signal" : "text-sm text-ice"}>{problem ?? (data.mode === "demo" ? "Демо той же формы" : "Ответ получен")}</p>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
