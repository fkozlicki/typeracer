create extension if not exists pg_cron;

select cron.schedule(
  'update_race_status_job',
  '1 second',
  'select public.update_race_status();'
);