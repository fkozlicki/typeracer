"use client";

import { startRaceAction } from "@/actions/start-race-action";
import { Button } from "@typeracer/ui/button";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";

export default function StartRaceButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    setIsLoading(true);
    await startRaceAction();
    setIsLoading(false);
  }

  return (
    <Button className={className} onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <LoaderIcon className="animate-spin size-4" />
      ) : (
        "Start a New Race"
      )}
    </Button>
  );
}
