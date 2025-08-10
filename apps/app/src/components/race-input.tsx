"use client";

import { createClient } from "@typeracer/supabase/client";
import { updateRacePlayer } from "@typeracer/supabase/mutations";
import { cn } from "@typeracer/ui/cn";
import { Input } from "@typeracer/ui/input";
import { type ChangeEvent, useState } from "react";

export default function RaceInput({
  userId,
  raceId,
  sentence,
  startTime,
  disabled,
  onComplete,
}: {
  userId: string;
  raceId: string;
  sentence: string;
  startTime: string;
  disabled: boolean;
  onComplete: () => void;
}) {
  const words = sentence.split(" ");

  const [value, setValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const supabase = createClient();

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;

    setValue(val);

    if (val === " ") {
      setValue("");
    }

    if (val === words[currentIndex]) {
      setCurrentIndex((prev) => prev + 1);
      setValue("");

      const progress = words.slice(0, currentIndex + 1).join(" ");

      const ellapsedMinutes =
        (Date.now() - new Date(startTime).getTime()) / 60000;

      const isFinished = currentIndex + 1 === words.length;

      if (isFinished) {
        onComplete();
      }

      await updateRacePlayer(supabase, {
        current_text: progress,
        is_finished: isFinished,
        wpm: Math.floor(currentIndex + 1 / ellapsedMinutes),
        raceId,
        userId,
      });
    }
  }

  return (
    <div className="space-y-4 border rounded-md p-3">
      <div className="flex gap-1">
        {words.map((word, idx) => (
          <span
            key={Math.random()}
            className={cn("text-xl", {
              "bg-green-300": idx < currentIndex,
            })}
          >
            {word}
          </span>
        ))}
      </div>
      <Input
        value={value}
        onChange={onChange}
        type="text"
        autoFocus
        disabled={disabled}
      />
    </div>
  );
}
