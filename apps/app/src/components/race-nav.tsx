import { Button } from "@typeracer/ui/button";
import Link from "next/link";
import StartRaceButton from "./start-race-button";

export default function RaceNav() {
  return (
    <div className="flex justify-between">
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
      <StartRaceButton />
    </div>
  );
}
