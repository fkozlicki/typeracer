"use client";

import { useRace } from "@/hooks/use-race";
import type { Race } from "@typeracer/supabase/queries";
import { Button } from "@typeracer/ui/button";
import Link from "next/link";
import { useState } from "react";
import RaceHeader from "./race-header";
import RaceInput from "./race-input";
import RaceNav from "./race-nav";
import RaceTable from "./race-table";

export default function RaceContainer({
  initialRace,
  userId,
}: { initialRace: Race; userId: string }) {
  const { race } = useRace(initialRace);
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="p-8 space-y-4 max-w-3xl mx-auto">
      <RaceHeader race={race} />
      <RaceTable raceId={race.id} players={race.race_players} userId={userId} />
      {race.status === "finished" || isFinished ? (
        <RaceNav />
      ) : (
        <>
          <RaceInput
            userId={userId}
            raceId={race.id}
            sentence={race.sentence.text}
            onComplete={() => setIsFinished(true)}
            disabled={race.status === "waiting"}
          />
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </>
      )}
    </div>
  );
}
