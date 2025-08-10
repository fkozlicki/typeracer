import { createClient } from "@typeracer/supabase/client";
import type { RacePlayer } from "@typeracer/supabase/queries";
import { useEffect, useState } from "react";

export function useRacePlayers(raceId: string, initialPlayers: RacePlayer[]) {
  const [racePlayers, setRacePlayers] = useState(initialPlayers);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`racePlayers-${raceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "race_players",
          filter: `race_id=eq.${raceId}`,
        },
        (payload) => {
          const updated = payload.new as RacePlayer;

          setRacePlayers((prev) => {
            if (prev.some((rp) => rp.id === updated.id)) {
              return prev.map((rp) => (rp.id === updated.id ? updated : rp));
            }
            return [...prev, updated];
          });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { racePlayers };
}
