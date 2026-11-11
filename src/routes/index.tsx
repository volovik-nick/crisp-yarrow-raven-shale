import { createFileRoute } from "@tanstack/react-router";
import { Console } from "@/components/bi/console";
import { loadSnapshot } from "@/lib/semantic/load";

export const Route = createFileRoute("/")({
  loader: () =>
    loadSnapshot({ data: { mode: "demo", crmBase: "", monitorBase: "", project: "all" } }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  return <Console initial={initial} />;
}
