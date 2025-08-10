import { createClient } from "@typeracer/supabase/client";
import type { Race } from "@typeracer/supabase/queries";
import { useEffect, useState } from "react";

export function useRace(initialRace: Race) {
  const [race, setRace] = useState(initialRace);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`race-${race.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "races",
          filter: `id=eq.${race.id}`,
        },
        (payload) => {
          setRace((prev) => ({ ...prev, ...payload.new }));
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { race };
}
