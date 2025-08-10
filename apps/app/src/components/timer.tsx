"use client";

import { calculateSecondsFromNow } from "@/utils/time";
import { useEffect, useState } from "react";

export default function Timer({
  date,
  suffix,
  prefix,
}: { date: string; prefix?: string; suffix?: string }) {
  const [seconds, setSeconds] = useState(calculateSecondsFromNow(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(calculateSecondsFromNow(date));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {prefix && `${prefix} `}
      {seconds}
      {suffix && ` ${suffix}`}
    </div>
  );
}
