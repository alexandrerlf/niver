-- Só o admin envia arte, e só nos modelos. O cliente não troca a arte do convite.

drop policy "autorizados enviam arte" on storage.objects;

-- O cliente edita os dados e a situação do convite, mas não a arte.
revoke update on public.invitations from authenticated;
grant update (
  status, description, theme, child_name, age, event_date, event_time,
  location_name, maps_url, message, gifts, image_prompt, art_attempts, html_template
) on public.invitations to authenticated;
