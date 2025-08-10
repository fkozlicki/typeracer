import RaceContainer from "@/components/race-container";
import { getRaceQuery } from "@typeracer/supabase/queries";
import { createClient } from "@typeracer/supabase/server";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  const { data } = await getRaceQuery(supabase, id);

  if (!data) {
    notFound();
  }

  return <RaceContainer initialRace={data} />;
}
