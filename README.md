# My Edu

A responsive learning and project website with Dashboard, About, Projects, and Contact us pages. Content can be managed in Sanity Studio, and public GitHub repositories can be displayed on the Projects page.

## Website configuration

Edit `site.config.js`:

- `githubUsername`: your public GitHub username (optional; can also be set in Sanity's Site settings).
- `sanityProjectId`: the project ID from your Sanity project.
- `sanityDataset`: the public dataset name, usually `production`.
- `sanityStudioUrl`: your deployed Sanity Studio URL (optional; otherwise Open CMS goes to Sanity Manage).

The site is static and can be served locally or published with GitHub Pages. For a local preview, run `python -m http.server 8000` in the repository and open `http://localhost:8000`. Do not open `index.html` directly as a `file://` URL: browsers block the CMS connection from local files.

## Sanity CMS

1. Install Node.js 20 or newer. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage) and use a dataset with public read access. The website only reads published documents; do not put secrets in `site.config.js`.
2. In PowerShell, set the Studio project details and start the CMS:

   ```powershell
   $env:SANITY_STUDIO_PROJECT_ID = "your-project-id"
   $env:SANITY_STUDIO_DATASET = "production"
   cd studio
   npm install
   npm run dev
   ```

3. In the Sanity project settings, add your local site origin (for example, `http://localhost:8000`) and the deployed website origin to the CORS origins list. The origin must match the browser address exactly; if you use `http://127.0.0.1:8000`, add that separately from `http://localhost:8000`.
4. In the Studio, create a Site settings document, Page content documents for the pages you want to customize, and Project or App documents for work you want to feature.
5. Copy the project ID and dataset into `site.config.js`. For a hosted CMS, publish the Studio with `npm run deploy` and set `sanityStudioUrl` to its URL.

The GitHub integration uses GitHub's public REST API and does not require a token. It shows recent non-fork, non-archived repositories for the configured username. Sanity project records can be used alongside GitHub repositories.

## Pages and content

- **Dashboard:** landing page and shortcuts to the rest of the site.
- **About:** introduction and story.
- **Projects:** featured CMS projects and public GitHub repositories.
- **Contact us:** contact details from Site settings and an email-app contact form.

The Sanity Studio schemas are in `studio/schemas/`. Adding another CMS-managed project, app, or page entry does not require editing the website code.
