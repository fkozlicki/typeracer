"use client";

import { useRace } from "@/hooks/use-race";
import type { Race } from "@typeracer/supabase/queries";
import RaceHeader from "./race-header";
import RaceTable from "./race-table";

export default function RaceContainer({
  initialRace,
  userId,
}: { initialRace: Race; userId: string }) {
  const { race } = useRace(initialRace);

  return (
    <div className="p-8 space-y-4 max-w-3xl mx-auto">
      <RaceHeader race={race} />
      <RaceTable raceId={race.id} players={race.race_players} userId={userId} />
    </div>
  );
}
