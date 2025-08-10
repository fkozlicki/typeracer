"use server";

import { createClient } from "@typeracer/supabase/server";
import { redirect } from "next/navigation";

export async function startRaceAction() {
  const supabase = await createClient();

  const { data } = await supabase.rpc("find_or_create_race");

  if (!data) {
    throw new Error("Could not find race. Try again.");
  }

  const { error } = await supabase.rpc("join_race", {
    p_race_id: data,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/races/${data}`);
}
