import StartRaceButton from "@/components/start-race-button";
import StatsTable from "@/components/stats-table";
import { Suspense, use } from "react";

export default function Home({
  searchParams,
}: { searchParams: Promise<Record<string, string>> }) {
  const p = use(searchParams);

  return (
    <div className="p-10 max-w-4xl mx-auto flex flex-col gap-8">
      <StartRaceButton className="self-center" />

      <Suspense key={JSON.stringify(p)} fallback={"loading results..."}>
        <StatsTable searchParams={p} />
      </Suspense>
    </div>
  );
}
