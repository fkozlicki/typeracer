import type { ColumnDef } from "@tanstack/react-table";
import { type Stat, getStatsQuery } from "@typeracer/supabase/queries";
import { createClient } from "@typeracer/supabase/server";
import { DataTable } from "./data-table";

export default async function StatsTable({
  searchParams,
}: { searchParams: Record<string, string> }) {
  const supabase = await createClient();
  const { pageSize, pageIndex } = searchParams;

  const { data, count } = await getStatsQuery(supabase, {
    page: pageIndex ? +pageIndex : undefined,
    size: pageSize ? +pageSize : undefined,
  });

  if (!data) {
    return null;
  }

  return <DataTable columns={columns} data={data} rowCount={count ?? 0} />;
}

const columns: ColumnDef<Stat>[] = [
  {
    header: "Player name",
    accessorKey: "profile.username",
  },
  {
    header: "WPM",
    accessorKey: "avg_wpm",
  },
  {
    header: "Accuracy",
    accessorKey: "avg_accuracy",
  },
  {
    header: "Total races",
    accessorKey: "total_races",
  },
];
