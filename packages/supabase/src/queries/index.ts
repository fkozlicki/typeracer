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

export const getStatsQuery = (
  supabase: Client,
  { page = 0, size = 10 }: { size?: number; page?: number },
) => {
  const from = page * size;
  const to = (page + 1) * size - 1;

  return supabase
    .from("stats")
    .select("*, profile:profiles!inner(username)", { count: "exact" })
    .range(from, to);
};

export type Stat = QueryData<ReturnType<typeof getStatsQuery>>[number];
