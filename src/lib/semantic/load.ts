import { createServerFn } from "@tanstack/react-start";
import { buildDemo } from "./demo";
import type {
  Activity,
  EndpointKey,
  GraphStats,
  LoadInput,
  Overview,
  Pulse,
  RedDeal,
  Snapshot,
} from "./types";

const PROJECT = /^[A-Za-z0-9_.:-]{1,64}$/;

function cleanBase(raw: string, label: string) {
  const value = raw.trim();
  if (!value) return "";
  if (value.length > 300) throw new Error(`${label}: слишком длинный адрес`);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label}: нужен абсолютный http(s) адрес`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${label}: только http или https`);
  }
  if (url.username || url.password) {
    throw new Error(`${label}: не передавайте логин и пароль в адресе`);
  }
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

function join(base: string, path: string, query?: Record<string, string>) {
  const url = new URL(base.endsWith("/") ? base : `${base}/`);
  const prefix = url.pathname.replace(/\/$/, "");
  url.pathname = `${prefix}${path}`;
  if (query) {
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  }
  return url.toString();
}

async function readJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });
  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : `Ответ ${response.status}`;
    throw new Error(message);
  }
  return body;
}

async function settle<T>(key: EndpointKey, run: () => Promise<T>, errors: Snapshot["errors"]) {
  try {
    return await run();
  } catch (error) {
    errors[key] = error instanceof Error ? error.message : "Запрос не выполнен";
    return null;
  }
}

export const loadSnapshot = createServerFn({ method: "POST" })
  .validator((data: LoadInput) => {
    if (data.mode !== "demo" && data.mode !== "live") throw new Error("Неизвестный режим");
    const project = data.project?.trim() || "all";
    if (project !== "all" && !PROJECT.test(project)) throw new Error("Некорректный проект");
    return {
      mode: data.mode,
      project,
      crmBase: cleanBase(data.crmBase ?? "", "CRM Pulse"),
      monitorBase: cleanBase(data.monitorBase ?? "", "Монитор RDF"),
    };
  })
  .handler(async ({ data }): Promise<Snapshot> => {
    if (data.mode === "demo") return buildDemo(data.project);

    const errors: Snapshot["errors"] = {};
    if (!data.crmBase) errors.pulse = "Адрес CRM Pulse не задан";
    if (!data.monitorBase) errors.status = "Адрес монитора RDF не задан";

    const projectQuery = { project: data.project };
    const [pulse, red, activities, status, stats] = await Promise.all([
      data.crmBase
        ? settle("pulse", () => readJson(join(data.crmBase, "/api/pulse", projectQuery)) as Promise<Pulse>, errors)
        : Promise.resolve(null),
      data.crmBase
        ? settle(
            "red",
            async () => {
              const body = (await readJson(join(data.crmBase, "/api/red-deals", projectQuery))) as {
                red_deals?: RedDeal[];
              };
              return body.red_deals ?? [];
            },
            errors,
          )
        : Promise.resolve([] as RedDeal[]),
      data.crmBase
        ? settle(
            "activities",
            async () => {
              const body = (await readJson(join(data.crmBase, "/api/recent-activities"))) as {
                activities?: Activity[];
              };
              return body.activities ?? [];
            },
            errors,
          )
        : Promise.resolve([] as Activity[]),
      data.monitorBase
        ? settle("status", () => readJson(join(data.monitorBase, "/api/status")) as Promise<Overview>, errors)
        : Promise.resolve(null),
      data.monitorBase
        ? settle("stats", () => readJson(join(data.monitorBase, "/api/stats")) as Promise<GraphStats>, errors)
        : Promise.resolve(null),
    ]);

    return {
      mode: "live",
      project: data.project,
      checked_at: new Date().toISOString(),
      errors,
      pulse,
      redDeals: red ?? [],
      activities: activities ?? [],
      status,
      stats,
    };
  });
