"use client";

import { useRacePlayers } from "@/hooks/use-race-players";
import type { RacePlayer } from "@typeracer/supabase/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@typeracer/ui/table";

export default function RaceTable({
  raceId,
  players,
  userId,
}: { raceId: string; players: RacePlayer[]; userId: string }) {
  const { racePlayers } = useRacePlayers(raceId, players);

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Live progress</TableHead>
            <TableHead>Player name</TableHead>
            <TableHead>Words per minute</TableHead>
            <TableHead>Accuracy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {racePlayers.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.current_text}</TableCell>
              <TableCell>
                {player.username}
                {player.user_id === userId ? " (You)" : ""}
              </TableCell>
              <TableCell>{player.wpm}</TableCell>
              <TableCell>{player.accuracy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
