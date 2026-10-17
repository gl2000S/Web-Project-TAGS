[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TZzxOLln)
 
# TAGSearch
 
## Overview
 
This repository represents the culminating project for CSCI 4300 – Web Programming at UGA.
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MySQL.
 
The database layer was originally built on MongoDB/Mongoose and later migrated to MySQL using the raw `mysql2` driver (parameterized queries, no ORM).
 
---
 
## Our Team - TAGS
 
| Member Name      | GitHub Username      | Role          |
|------------------|----------------------|---------------|
| Trent Utterback  | cyfam                | Project Leader  |
| Spencer Freese   | SpencerFreese        | Project Manager   |
| Gabriel Lee      | gl20330              | Communication Leader    |
| Alina Tran       | amt83612             | GitHub Captain |
 
---
 
## Project Features
 
- **Authentication & Authorization** (login/sign-up, protected routes). When logging in, a user may check a "Remember me" box. After logging out, the next time the user logs in, their email will be autofilled.
- **Route protection** for authenticated users: the listings page and the add-listing page redirect logged-out visitors, and the listings API returns `401` without a valid login.
- **CRUD operations** on job listings. Registered users can create listings, view listings from all registered users, and update or delete only the listings they created.
- **Responsive UI** and a dynamic navigation bar.
- **Live job search**: searching refreshes the listings provided by the third-party JSearch API, so results stay up to date.
---
 
## Repository Structure
 
```
/design                 Figma mockups (mockups.md)
/status                 WEEKLY_STATUS.md
/tagsearch              The Next.js application
  /config               mysql.ts, the pooled MySQL connection
  /sql                  schema.sql, the database schema (source of truth)
  /public               Static assets (images etc.)
  /src
    /app                Next.js App Router pages and API routes
    /components         AddForm, AuthenticatedView, Card, Footer, LoginForm,
                        Nav, SignupForm, SplashPage, TAGS_logo
    /context            AuthContext (client-side login state)
    /models             User.ts, Jobs.ts (raw parameterized MySQL queries)
    proxy.ts            Route protection (checks the auth cookie)
  env.sample            Template for the required environment variables
```
 
---
 
## Tech Stack
 
| Layer             | Technology                                                     |
|-------------------|----------------------------------------------------------------|
| Frontend          | React + Next.js (App Router), TypeScript                       |
| Backend           | Next.js API Routes / Node.js                                   |
| Database          | MySQL 8 via `mysql2` (raw parameterized queries, connection pool) |
| Styling           | Tailwind CSS and a global.css file                             |
| Authentication    | Custom JWT authentication (HttpOnly cookie) with bcrypt password hashing |
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js and npm
- Docker (used to run MySQL locally)
- A RapidAPI key with access to the JSearch API

### 1. Start MySQL
 
```bash
docker run --name tagsearch-mysql \
  -e MYSQL_ROOT_PASSWORD=<root-password> \
  -e MYSQL_DATABASE=tagsearch \
  -p 3306:3306 \
  -v tagsearch-mysql-data:/var/lib/mysql \
  -d mysql:8.4
```
 
### 2. Create the tables
 
From the repository root:
 
```bash
docker exec -i tagsearch-mysql sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" tagsearch' < tagsearch/sql/schema.sql
```
 
### 3. Create a limited database user for the app
 
Open a MySQL shell as root:
 
```bash
docker exec -it tagsearch-mysql mysql -u root -p
```
 
Then run:
 
```sql
CREATE USER 'tagsearch_app'@'%' IDENTIFIED BY '<choose-an-app-password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON tagsearch.* TO 'tagsearch_app'@'%';
```
 
The app connects as this user, not as root.
 
### 4. Configure environment variables
 
```bash
cd tagsearch
cp env.sample .env
```
 
Fill in `.env`. Never commit this file.
 
| Variable          | Description                                              |
|-------------------|----------------------------------------------------------|
| `DB_HOST`         | MySQL host (`127.0.0.1` for the local Docker container)  |
| `DB_PORT`         | MySQL port (`3306`)                                      |
| `DB_USER`         | `tagsearch_app`                                          |
| `DB_PASSWORD`     | Password                                                 |
| `DB_NAME`         | `tagsearch`                                              |
| `JWT_SECRET`      | Long random string used to sign login tokens             |
| `JSEARCH_API_KEY` | Your RapidAPI key for JSearch                            |
 
Generate a `JWT_SECRET` with:
 
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
 
### 5. Install and run
 
```bash
npm install
npm run dev
```
 
The project should now be running at http://localhost:3000.
 
---
 
## API Endpoints
 
| Endpoint             | Method        | Auth                | Purpose                                                          |
| -------------------- | ------------- | ------------------- | ---------------------------------------------------------------- |
| `/api/signup`        | POST          | none                | Create a new user (hash password, store in DB)                   |
| `/api/login`         | POST          | none                | Validate credentials, set the JWT cookie                         |
| `/api/logout`        | POST          | none                | Clear the auth cookie / end session                              |
| `/api/me`            | GET           | cookie              | Return current user info if the JWT cookie is valid              |
| `/api/jobs`          | GET           | none                | Calls the JSearch API and returns external job listings          |
| `/api/tagJobs`       | GET           | login required      | Returns all TAGSearch listings (`401` if not logged in)          |
| `/api/tagJobs`       | POST          | login required      | Create a listing owned by the logged-in user                     |
| `/api/tagJobs/[id]`  | PUT & DELETE  | login, owner only   | Update or delete a listing (`403` if it belongs to another user) |
 
---
 
## Database
 
The schema lives in [`tagsearch/sql/schema.sql`](tagsearch/sql/schema.sql), which is the source of truth. In short:
 
- **`users`**: `id`, `name`, unique `email`, `password_hash`, `created_at`, `updated_at`
- **`jobs`**: `id`, `user_id` (foreign key to `users.id`, `ON DELETE CASCADE`), `title`, `company`, `city`, `state`, `employment_type`, `min_salary`, `max_salary`, `description`, `url`, `created_at`
Job fields use snake_case end to end, from the database columns through the API to the UI.
 
---
 
## Client Routes
 
| Route            | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `/`              | Splash page                                                      |
| `/login`         | User login                                                       |
| `/signup`        | User signup                                                      |
| `/about`         | About page                                                       |
| `/add`           | Logged-in users can add a listing                                |
| `/authenticated` | Landing page after login. Displays TAGSearch and external listings |
| `/contact`       | Provides info on how to contact us                               |
 
---
 
## Deployment
 
The app needs a reachable MySQL instance and the environment variables above. The old MongoDB Atlas configuration no longer applies.
 
---
 
## Acknowledgements
 
- Dr. Stephens for providing the textbook which helped us understand how to implement certain parts of the website.

### EXAMPLE ###
Alex1234@gmail.com
Alex1234