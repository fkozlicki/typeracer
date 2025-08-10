"use client";

import { useRace } from "@/hooks/use-race";
import type { Race } from "@typeracer/supabase/queries";
import RaceHeader from "./race-header";

export default function RaceContainer({ initialRace }: { initialRace: Race }) {
  const { race } = useRace(initialRace);

  return (
    <div className="p-8 space-y-4 max-w-3xl mx-auto">
      <RaceHeader race={race} />
    </div>
  );
}
