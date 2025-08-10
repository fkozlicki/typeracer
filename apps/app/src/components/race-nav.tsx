import { startRaceAction } from "@/actions/start-race-action";
import { Button } from "@typeracer/ui/button";
import Link from "next/link";

export default function RaceNav() {
  return (
    <div className="flex justify-between">
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
      <Button onClick={startRaceAction}>Run a New Race</Button>
    </div>
  );
}
