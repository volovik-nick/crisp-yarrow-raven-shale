const numberFormat = new Intl.NumberFormat("ru-RU");

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const dayFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit",
  month: "short",
});

export function formatNumber(value: number | null | undefined) {
  return numberFormat.format(Number(value ?? 0));
}

export function formatDate(raw: string | null | undefined) {
  if (!raw) return "Нет данных";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "Нет данных" : dateFormat.format(date);
}

export function formatDay(raw: string) {
  const date = new Date(`${raw}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? raw : dayFormat.format(date);
}

export function tail(uri: string | null | undefined) {
  if (!uri) return "";
  const cut = Math.max(uri.lastIndexOf("/"), uri.lastIndexOf(":"));
  return uri.slice(cut + 1);
}

const CLASS_LABELS: Record<string, string> = {
  InProgressDeal: "В процессе",
  ActiveDeal: "Активная",
  ClosedDeal: "Закрыта",
  SuccessfulDeal: "Успешно закрыта",
};

export function readableClasses(raw: string | null) {
  if (!raw) return "Класс не определён";
  return raw
    .split(" · ")
    .map((name) => CLASS_LABELS[name] ?? name)
    .join(" · ");
}

export const TYPE_LABELS: Record<string, string> = {
  deal: "Сделки",
  activity: "Активности",
  user: "Пользователи",
  category: "Категории",
  stage: "Стадии",
  source: "Источники",
};

export const SYNC_LABELS: Record<string, string> = {
  running: "Работает",
  waiting: "Ждёт следующий цикл",
  idle: "Цикл завершён",
  error: "Ошибка цикла",
  stale: "Статус устарел",
  unknown: "Нет данных",
};
