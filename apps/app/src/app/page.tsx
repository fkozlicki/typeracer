import ResultsTable from "@/components/results-table";
import StartRaceButton from "@/components/start-race-button";
import { Suspense, use } from "react";

export default function Home({
  searchParams,
}: { searchParams: Promise<Record<string, string>> }) {
  const p = use(searchParams);

  return (
    <div className="p-10 max-w-4xl mx-auto flex flex-col gap-8">
      <StartRaceButton className="self-center" />

      <Suspense key={JSON.stringify(p)} fallback={"loading results..."}>
        <ResultsTable searchParams={p} />
      </Suspense>
    </div>
  );
}
