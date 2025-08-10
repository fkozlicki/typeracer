import type { QueryData } from "@supabase/supabase-js";
import type { Client, Database } from "../types";

export const getRaceQuery = (supabase: Client, id: string) => {
  return supabase
    .from("races")
    .select("*, sentence:sentences!inner(*), race_players(*)")
    .eq("id", id)
    .single();
};

export type Race = QueryData<ReturnType<typeof getRaceQuery>>;

export type RacePlayer = Database["public"]["Tables"]["race_players"]["Row"];

export const getRacePlayersQuery = (
  supabase: Client,
  { page = 0, size = 10 }: { size?: number; page?: number },
) => {
  const from = page * size;
  const to = (page + 1) * size - 1;

  return supabase
    .from("race_players")
    .select("*", { count: "exact" })
    .range(from, to);
};
