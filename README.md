# The Winds Homestay website
React + Vite. WebGL mist background (src/GL.jsx), scroll reveals, mobile-first.

    npm install
    npm run dev      # local preview
    npm run build    # production files in /dist (upload to any host)

## Supabase content editor

The public website reads editable content from Supabase and falls back to the
defaults in `src/siteContent.js` when no content has been published yet. The
editor is available at `/admin`; it uses Supabase Auth and only users explicitly
allowlisted in the database can publish changes.

1. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY` from your Supabase project's API settings.
   Use only the publishable (or legacy anon) key here. Never put a service-role
   or secret key in a `VITE_` variable or in browser code.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Disable public sign-ups in Supabase Auth. Create your editor user in the
   Supabase dashboard, then add that user's ID to the allowlist from the SQL
   Editor:

       insert into public.site_content_admins (user_id)
       values ('YOUR_AUTH_USER_UUID');

4. Start the app and visit `/admin`. Sign in with the account you created,
   edit the site content JSON, and select **Save and publish**.
5. Add the same two `VITE_SUPABASE_*` values to your hosting provider's
   environment settings and redeploy. `vercel.json` enables the `/admin` route
   on the existing Vercel deployment; other static hosts need an equivalent
   rewrite to `index.html`.

The editor covers the website's headings, body copy, rates, rooms, amenities,
gallery captions and image filenames, experiences, reviews, FAQs, contact
details, navigation labels, hero slideshow images and SEO title/description.
Image filenames must match files already present in `public/images` (omit the
`.jpg` extension). Loader labels can also be changed through their content
fields.
The editor validates the content structure before saving. Its SQL row-level
security policies allow public reads but restrict writes to the user IDs in
`site_content_admins`.

Do not commit `.env`; it is excluded by `.gitignore`.
# thewinds
