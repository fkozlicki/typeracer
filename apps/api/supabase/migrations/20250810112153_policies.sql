create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."race_players"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable read access for all users"
on "public"."race_players"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."race_players"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Enable read access for all users"
on "public"."races"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."sentences"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."stats"
as permissive
for select
to public
using (true);