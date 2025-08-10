"use client";

import { useRacePlayers } from "@/hooks/use-race-players";
import type { ColumnDef } from "@tanstack/react-table";
import type { RacePlayer } from "@typeracer/supabase/queries";
import { useMemo } from "react";
import { DataTable } from "./data-table";

export default function RaceTable({
  raceId,
  players,
  userId,
}: { raceId: string; players: RacePlayer[]; userId: string }) {
  const { racePlayers } = useRacePlayers(raceId, players);

  const columns: ColumnDef<RacePlayer>[] = useMemo(
    () => [
      {
        header: "Live progress",
        accessorKey: "current_text",
      },
      {
        header: "Player name",
        accessorKey: "username",
        cell: ({
          getValue,
          row: {
            original: { user_id },
          },
        }) => `${getValue()}${user_id === userId ? " (You)" : ""}`,
      },
      {
        header: "Words per minute",
        accessorKey: "wpm",
      },
      {
        header: "Accuracy",
        accessorKey: "accuracy",
      },
    ],
    [userId],
  );

  return <DataTable data={racePlayers} columns={columns} />;
}
