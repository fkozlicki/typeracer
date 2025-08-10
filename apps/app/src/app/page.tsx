import { startRaceAction } from "@/actions/start-race-action";
import ResultsTable from "@/components/results-table";
import { Button } from "@typeracer/ui/button";
import { Suspense, use } from "react";

export default function Home({
  searchParams,
}: { searchParams: Promise<Record<string, string>> }) {
  const p = use(searchParams);

  return (
    <div className="p-10 max-w-4xl mx-auto flex flex-col gap-8">
      <Button className="self-center" onClick={startRaceAction}>
        Start a New Race
      </Button>

      <Suspense key={JSON.stringify(p)} fallback={"loading results..."}>
        <ResultsTable searchParams={p} />
      </Suspense>
    </div>
  );
}
