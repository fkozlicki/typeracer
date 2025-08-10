# Typing Race Game

A real-time multiplayer typing race game built with Next.js + Supabase

## 🚀 Tech Stack

- **Runtime/Package Manager:** Bun
- **Monorepo:** Turborepo
- **Database/Realtime/Auth:** Supabase
- **UI Components:** ShadCN UI
- **Styling:** TailwindCSS
- **Data Tables:** Tanstack Table
- **Code Quality:** Biome (formatting & linting)

## ✨ Features

### Authentication
- Anonymous sign-in via Supabase for quick access

### Real-time Racing
- Live race status updates
- Player progress tracking with live WPM calculations
- Synchronized countdown and race timing

### Game Mechanics
- **Countdown:** 15-second countdown once 2+ players join
- **Race Duration:** 90 seconds maximum
- **Early Finish:** Race ends when all players complete the text
- **Word-by-word Input:** Locked input requiring space after each correct word

### Table
- Server-side pagination with nuqs & Tanstack Table

## 🎮 Game Flow

```mermaid
graph TD
    A[User clicks "Start a new Race"] --> B[Find/Create race in races table]
    B --> C[Join race - Insert into race_players table]
    C --> D[Redirect to race page]
    D --> E[2+ players joined?]
    E -->|Yes| F[Update race start_time & end_time via trigger]
    E -->|No| G[Wait for more players]
    F --> H[Supabase cron job updates race status every 1s]
    H --> I[Race begins with countdown]
```

### Step-by-step Process
1. **Race Creation/Discovery:** User clicks "Start a new Race" → System finds existing waiting race or creates new one
2. **Player Registration:** Join race (inserts row in `race_players` table) → Redirect to race page
3. **Race Initialization:** When 2 players join, trigger updates race `start_time` and `end_time`
4. **Status Management:** Supabase cron job updates race status every second

## 🏁 Race Lifecycle

| Status | Description | Duration | User Experience |
|--------|-------------|----------|-----------------|
| **Waiting** | Lobby state | Until 2+ players join | Shows waiting message and player list |
| **Countdown** | Pre-race preparation | 15 seconds | Countdown timer, input disabled |
| **Active** | Live racing | 90 seconds max | Input enabled, live progress tracking |
| **Finished** | Race complete | Permanent | Input hidden, final results displayed |

## 🤖 AI Chunks

<details>

### Find or Create Race
Locates an available race or creates a new one with random sentence.

```sql
create or replace function public.find_or_create_race()
returns uuid
language plpgsql
security definer
as $$
declare
  race_id uuid;
  sentence_id int;
begin
  -- Try to find existing race in 'waiting' status with < 5 players
  select r.id into race_id
  from public.races r
  left join public.race_players rp on r.id = rp.race_id
  where r.status = 'waiting'::race_status
  group by r.id
  having count(rp.id) < 5
  limit 1;

  -- If no race found, create a new one
  if race_id is null then
    select id into sentence_id
    from public.sentences
    order by random()
    limit 1;

    insert into public.races (sentence_id, status)
    values (sentence_id, 'waiting'::race_status)
    returning id into race_id;
  end if;

  return race_id;
end;
$$;
```

### Join Race
Adds authenticated user to an available race with validation.

```sql
create or replace function public.join_race(p_race_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  player_count int;
  player_name text;
begin
  -- Validate race exists & is waiting
  if not exists (select 1 from public.races where id = p_race_id and status = 'waiting'::race_status) then
    raise exception 'Race not available';
  end if;

  -- Check player limit
  select count(*) into player_count from public.race_players where race_id = p_race_id;
  if player_count >= 5 then
    raise exception 'Race is full';
  end if;

  -- Get player username
  select username into player_name from public.profiles where id = auth.uid();

  -- Add player to race
  insert into public.race_players (user_id, race_id, username)
  values (auth.uid(), p_race_id, player_name)
  on conflict do nothing;
end;
$$;
```

</details>

## 🙏 Acknowledgments

Based on the [Midday v1 repository](https://github.com/midday-ai/v1).

## 🔥 Improvements

 - Cypress E2e in /apps dir
 - Unit & Integration test in Next.js app
 - Better WPM/Accuracy calculation & better sentence input component
 - Inserting race results to stats table on race finish & displaying them in the table