"use client";

import { createClient } from "@typeracer/supabase/client";
import { updateRacePlayer } from "@typeracer/supabase/mutations";
import { Input } from "@typeracer/ui/input";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

export default function RaceInput({
  userId,
  raceId,
  sentence,
  disabled,
  onComplete,
}: {
  userId: string;
  raceId: string;
  sentence: string;
  disabled: boolean;
  onComplete: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [totalKeysPressed, setTotalKeysPressed] = useState(0);
  const [correctKeysPressed, setCorrectKeysPressed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const supabase = createClient();

  const words = sentence.split(" ");

  const isWordComplete = (value: string): boolean => {
    return (
      (value.endsWith(" ") || value.endsWith(".")) &&
      currentWordIndex < words.length
    );
  };

  const trackCharacterInput = (newValue: string, previousValue: string) => {
    if (newValue.length <= previousValue.length) return;

    const newChar = newValue[newValue.length - 1];
    const expectedChar = words[currentWordIndex]?.[newValue.length - 1];

    setTotalKeysPressed((prev) => prev + 1);

    if (newChar === expectedChar) {
      setCorrectKeysPressed((prev) => prev + 1);
    }
  };

  const trackTime = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  const advanceToNextWord = () => {
    setCurrentWordIndex((prev) => prev + 1);
    setCurrentCharIndex(0);
    setInputValue("");
  };

  const handleIncorrectWord = (typedWord: string) => {
    setInputValue(typedWord);
    setCurrentCharIndex(typedWord.length);
  };

  const calculateWPM = () => {
    if (!startTime) {
      return 0;
    }

    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    return Math.round(currentWordIndex + 1 / timeElapsed);
  };

  const calculateAccuracy = () => {
    return +((correctKeysPressed / totalKeysPressed) * 100).toFixed(2);
  };

  const saveProgress = async () => {
    const isFinished = currentWordIndex + 1 >= words.length;

    const progress = words.slice(0, currentWordIndex + 1).join(" ");
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();

    await updateRacePlayer(supabase, {
      current_text: progress,
      wpm,
      is_finished: isFinished,
      accuracy,
      raceId,
      userId,
    });

    return isFinished;
  };

  const handleWordCompletion = async (value: string) => {
    const typedWord = value.trim();
    const expectedWord = words[currentWordIndex];
    const isCorrectWord = typedWord === expectedWord;

    if (isCorrectWord) {
      setTotalKeysPressed((prev) => prev + 1);
      setCorrectKeysPressed((prev) => prev + 1);

      advanceToNextWord();

      const isGameFinished = await saveProgress();

      if (isGameFinished) {
        onComplete();
      }
    } else {
      handleIncorrectWord(typedWord);
    }
  };

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value.length > 0) {
      trackTime();
    }

    trackCharacterInput(value, inputValue);

    if (isWordComplete(value)) {
      await handleWordCompletion(value);
    } else {
      setInputValue(value);
      setCurrentCharIndex(value.length);
    }
  }

  const renderText = () => {
    return words.map((word, wordIndex) => {
      const chars = word.split("").map((char, charIndex) => {
        let charClass = "";

        if (wordIndex < currentWordIndex) {
          charClass = "text-green-600";
        } else if (wordIndex === currentWordIndex) {
          if (charIndex < currentCharIndex) {
            const currentChar = inputValue[charIndex];
            charClass =
              char === currentChar
                ? "text-green-600"
                : "text-red-400 bg-red-100";
          } else {
            charClass = "text-gray-800";
          }
        } else {
          charClass = "text-gray-800";
        }

        return (
          <span
            key={`${wordIndex}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              charIndex
            }`}
            className={charClass}
          >
            {char}
          </span>
        );
      });

      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <span key={wordIndex} className="mr-1">
          {chars}
        </span>
      );
    });
  };

  return (
    <div className="space-y-4 border rounded-md p-3">
      <div className="text-xl">{renderText()}</div>
      <Input
        value={inputValue}
        onChange={onChange}
        type="text"
        autoFocus
        disabled={disabled}
      />
    </div>
  );
}
