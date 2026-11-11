export type Category = { id: string; name: string };

export type PulseSummary = {
  active_deals: number;
  created_24h: number;
  created_7d: number;
  created_30d: number;
  inactive_7d: number;
};

export type Employee = {
  uri: string | null;
  name: string;
  active_deals: number;
  activities_24h: number;
  activities_7d: number;
  activities_30d: number;
  inactive_deals_7d: number;
};

export type Pulse = {
  available: boolean;
  backend: string;
  as_of: string;
  summary: PulseSummary;
  employees: Employee[];
  categories: Category[];
};

export type RedDeal = {
  uri: string | null;
  title: string;
  manager: string;
  created_at: string | null;
  last_activity_time: string | null;
};

export type Activity = {
  uri: string | null;
  subject: string;
  created_at: string | null;
  deal_uri: string | null;
  deal_title: string;
  deal_classes: string | null;
  employee_uri: string | null;
  employee_name: string;
};

export type TypeStat = {
  graphs: number;
  modified_graphs: number;
  latest_modified_at: string | null;
  latest_created_at: string | null;
};

export type StoreStatus = {
  available?: boolean;
  backend?: string;
  backend_name?: string;
  error?: string;
  checked_at?: string;
  query_seconds?: number;
  types?: Record<string, TypeStat>;
};

export type SyncStatus = {
  state?: string;
  reason?: string;
  last_run_id?: string;
  age_seconds?: number;
  caught_up?: boolean | null;
  exporter_run_id?: string;
  exporter_run_status?: string;
};

export type ExporterStatus = {
  state?: string;
  reason?: string;
  last_run_id?: string;
  run_status?: string;
  mode?: string;
  created_at?: string;
  checked_at?: string;
};

export type Overview = {
  sync: SyncStatus;
  exporter: ExporterStatus;
  store: StoreStatus;
  checked_at: string;
};

export type GraphStats = {
  backend: string;
  backend_name: string;
  total_graphs: number;
  dated_graphs: number;
  by_type: Record<string, number>;
  by_date: { date: string; graphs: number }[];
  date_predicate: string;
  updated_at: string;
};

export type EndpointKey = "pulse" | "red" | "activities" | "status" | "stats";

export type Snapshot = {
  mode: "demo" | "live";
  project: string;
  checked_at: string;
  errors: Partial<Record<EndpointKey, string>>;
  pulse: Pulse | null;
  redDeals: RedDeal[];
  activities: Activity[];
  status: Overview | null;
  stats: GraphStats | null;
};

export type LoadInput = {
  mode: "demo" | "live";
  crmBase: string;
  monitorBase: string;
  project: string;
};
