# TAGSearch (Next.js app)

This folder contains the TAGSearch application: Next.js (App Router, TypeScript) with API routes, backed by MySQL through the `mysql2` driver.

Full setup instructions (MySQL via Docker, schema, environment variables) are in the [root README](../README.md#getting-started).

## Run the development server

```bash
npm install
npm run dev
```

Open http://localhost:3000. The page auto-updates as you edit files under `src/`.

## Database access

Connect as root, from inside the container (for admin tasks such as creating users or running `DESCRIBE`):

```bash
docker exec -it tagsearch-mysql mysql -u root -p
```

Connect as `tagsearch_app` from your host machine, the same way the app connects. This is useful for checking what the app actually did to the data, for example confirming a signup landed:

```bash
mysql -h 127.0.0.1 -P 3306 -u tagsearch_app -p tagsearch
```