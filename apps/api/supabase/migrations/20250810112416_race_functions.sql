create or replace function public.find_or_create_race()
returns uuid
language plpgsql
security definer
as $$
declare
  race_id uuid;
  sentence_id int;
begin
  -- 1. Try to find an existing race in 'waiting' status with < 5 players
  select r.id into race_id
  from public.races r
  left join public.race_players rp on r.id = rp.race_id
  where r.status = 'waiting'::race_status
  group by r.id
  having count(rp.id) < 5
  limit 1;

  -- 2. If no race found, create a new one
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

create or replace function public.join_race(p_race_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  player_count int;
  player_name text;
begin
  -- Check if race exists & is waiting
  if not exists (select 1 from public.races where id = p_race_id and status = 'waiting'::race_status) then
    raise exception 'Race not available';
  end if;

  -- Check player count
  select count(*) into player_count from public.race_players where race_id = p_race_id;
  if player_count >= 5 then
    raise exception 'Race is full';
  end if;

  select username into player_name from public.profiles where id = auth.uid();

  -- Insert player
  insert into public.race_players (user_id, race_id, username)
  values (auth.uid(), p_race_id, player_name)
  on conflict do nothing;
end;
$$;

create or replace function public.update_race_status()
returns void as $$
begin
  update races
  set status = 'started'::race_status
  where status = 'waiting'::race_status and now() >= start_time;

  update races
  set status = 'finished'::race_status
  where status = 'started'::race_status and now() >= end_time;
end;
$$ language plpgsql;

create or replace function public.start_race()
returns trigger as $$
declare
  player_count int;
begin
  select count(*) into player_count
  from race_players
  where race_id = new.race_id;

  if player_count >=2 
    and (select status from races where id = new.race_id) = 'waiting'::race_status then
      update races
      set start_time = now() + interval '15 seconds',
        end_time = now() + interval '105 seconds'
      where id = new.race_id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger on_race_player_created
after insert on public.race_players
for each row
execute function start_race();

create or replace function public.check_finish_race()
returns trigger as $$
declare
  unfinished int;
begin
  select count(*) into unfinished
  from race_players
  where race_id = new.race_id
    and is_finished = false;

  if unfinished = 0 then
    update races
    set status = 'finished'::race_status
    where id = new.race_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_race_player_finished
after update of is_finished on race_players
for each row execute function check_finish_race();