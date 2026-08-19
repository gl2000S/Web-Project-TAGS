[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TZzxOLln)
# TAGSearch

##  Overview

This repository represents the culminating project for CSCI 4300 – Web Programming at UGA.  
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MongoDB. 

---

## Our Team - TAGS

| Member Name      | GitHub Username      | Role          |
|------------------|----------------------|---------------|
| Trent Utterback  | cyfam                | Project Leader  |
|  Spencer Freese  | SpencerFreese        | Project Manager   |
| Gabriel Lee      | gl20330              | Communication Leader    |
| Alina Tran       | amt83612             | GitHub Captain |

---

## Project Features (Example)

- Authentication & Authorization** (login/sign-up, protected routes). When logging in, a user may check a "Remember me" box. After logging out, the next time the user logs in, their email will be autofilled.   
- Middleware or Route Protection** for authenticated users  
- CRUD operations are implemented with our job listings. Registered users can create, read, update, and delete listings made by them as well as view listings from other registered users. 
- Responsive UI** & dynamic navigation bar  
- Searching for specific jobs refreshes the listings provided from the api we used, providing up to date 3rd party job listings. 

---

## Repository Structure

```
/src
/app → Next.js App Router pages (frontend pages & API routes)
/components → (Any part of the website that needed to handle some interaction with the user) AddForm, AuthenticatedView, Card, Footer, LoginForm, Nav, SignupForm, SplashPage, TAGS_logo. 
/models → Mongoose schemas for users and jobs
/public → Static assets (images etc.)
/design → mockups.md (Our figma mockups)
/status → WEEKLY_STATUS.md
```

---

## Tech Stack

| Layer             | Technology                                                     |
|-------------------|----------------------------------------------------------------|
| Frontend          | React + Next.js (App Router)                                   |
| Backend           | Next.js API Routes / Node.js                                   |
| Database          | MongoDB + Mongoose                                             |
| Styling           | Tailwind CSS and a global.css file                             |
| Authentication    | Custom JWT Authentication with bcrypt password hashing.        |

---

## Run the development server

```
npm run dev
```

The project should now be running at:
    http://localhost:3000

## API Endpoints (Examples – update as you build)

| Endpoint      | Method | Purpose                                           |
| ------------- | ------ | ------------------------------------------------- |
| `/api/signup` | POST   | Create a new user (hash password, store in DB)    |
| `/api/login`  | POST   | Log in user, validate password, return JWT cookie |
| `/api/logout` | POST   | Clear auth cookie / end session                   |
| `/api/me`     | GET    | Return current user info if JWT cookie valid      |                                     
| `/api/jobs`   | GET    | Calls the JSearch API → returns job listings      |
| `/api/tagjobs`| GET & POST| Fetches all job listings and registered users can post new jobs| 
| `/api/tagjobs/[id]`| PUT & DELETE | A registered user can update/delete jobs tied to them|


## Database Models (example)
users
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| name     | String | Full name       |
| email    | String | Unique email    |
| password | String | Hashed password |

jobs
| Field    | Type   | Description     |
| -------- | ------ | --------------- |
| title     | String | Name of the listing      |
| company   | String | Name of the company posting the listing    |
| city      | String | City the job is located in |
| state     | String | State the job is located in |
| employment_type | String | Commitment expectation |
| minSalary | Int | Lowest salary |
| maxSalary | String | Highest salary |
| description | String | Description of job duties |
| url | String | Company's website |
| userid | String | Id of the user posting this listing |


## Client Routes (example)
| Route         | Description       |
| ------------- | ----------------- |
| `/`           | Splashpage        |
| `/login`      | User login        |
| `/signup`     | User signup       |
| `/about`      | About page        |
| `/add`        | Users can add a listing |
| `/authenticated` | Landing page after a user logs in. Displays all job listings   |
| `/contact`  | Provides info on how to contact us |

## Future Improvements
- More additions to improve the user experience:
-Add a robust profile page with the ability to pin jobs, add jobs to folders, and to make a system that tracks which jobs you have applied to. 
- Registered users could upload a resume and use it to more quickly apply
- Use a more reliable api that doesn't have a limit on the amount of requests


## Acknowledgements
- Dr. Stephens for providing the textbook which helped us understand how to implement certain parts of the website.
