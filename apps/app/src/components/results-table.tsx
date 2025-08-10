import type { ColumnDef } from "@tanstack/react-table";
import {
  type RacePlayer,
  getRacePlayersQuery,
} from "@typeracer/supabase/queries";
import { createClient } from "@typeracer/supabase/server";
import { DataTable } from "./data-table";

export default async function ResultsTable({
  searchParams,
}: { searchParams: Record<string, string> }) {
  const supabase = await createClient();
  const { pageSize, pageIndex } = searchParams;

  const { data, count } = await getRacePlayersQuery(supabase, {
    page: pageIndex ? +pageIndex : undefined,
    size: pageSize ? +pageSize : undefined,
  });

  if (!data || !count) {
    return null;
  }

  return <DataTable columns={columns} data={data} rowCount={count} />;
}

const columns: ColumnDef<RacePlayer>[] = [
  {
    header: "Player name",
    accessorKey: "username",
  },
  {
    header: "Words per minute",
    accessorKey: "wpm",
  },
  {
    header: "Accuracy",
    accessorKey: "accuracy",
  },
];
