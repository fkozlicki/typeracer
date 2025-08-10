import type { Client } from "../types";

interface UpdateRacePlayerParams {
  current_text: string;
  is_finished: boolean;
  wpm: number;
  userId: string;
  raceId: string;
}

export async function updateRacePlayer(
  supabase: Client,
  params: UpdateRacePlayerParams,
) {
  const { userId, raceId, ...data } = params;

  return await supabase
    .from("race_players")
    .update(data)
    .eq("user_id", userId)
    .eq("race_id", raceId);
}
