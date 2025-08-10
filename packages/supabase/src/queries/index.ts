import type { QueryData } from "@supabase/supabase-js";
import type { Client } from "../types";

export const getRaceQuery = (supabase: Client, id: string) => {
  return supabase
    .from("races")
    .select("*, sentence:sentences!inner(*), race_players(*)")
    .eq("id", id)
    .single();
};

export type Race = QueryData<ReturnType<typeof getRaceQuery>>;
