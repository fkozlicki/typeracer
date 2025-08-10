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
