import type { Race } from "@typeracer/supabase/queries";
import Timer from "./timer";

export default function RaceHeader({ race }: { race: Race }) {
  const { status, start_time, end_time } = race;

  return (
    <div className="h-8 flex flex-col">
      {status === "waiting" &&
        (start_time ? (
          <Timer prefix="Race starts in:" date={start_time} />
        ) : (
          <div className="self-center">Waiting for the players...</div>
        ))}
      {status === "started" && end_time && (
        <Timer date={end_time} suffix="seconds left" />
      )}
      {status === "finished" && <div>Race ended</div>}
    </div>
  );
}
