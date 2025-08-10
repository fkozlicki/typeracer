alter table stats add constraint stats_user_id_unique unique (user_id);

create or replace function update_race_stats()
returns trigger as $$
begin
  if old.is_finished = false and new.is_finished = true then
    insert into stats (user_id, total_races, avg_wpm, avg_accuracy)
    values (new.user_id, 1, new.wpm, new.accuracy)
    on conflict (user_id)
    do update set
      total_races = stats.total_races + 1,
      avg_wpm = (
        (stats.avg_wpm * stats.total_races + new.wpm) / (stats.total_races + 1)
      ),
      avg_accuracy = (
        (stats.avg_accuracy * stats.total_races + new.accuracy) / (stats.total_races + 1)
      );
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger race_finished_stats_update
after update of is_finished on race_players
for each row execute function update_race_stats();