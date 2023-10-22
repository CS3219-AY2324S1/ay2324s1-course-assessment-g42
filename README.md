[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)
# <img src="frontend/public/PP.png" width="30" height="30" /> PeerPrep
PeerPrep is a is a technical interview preparation platform, where students can practise whiteboard-style interview questions together.

<img src="frontend/public/peerp_dark.png">

# 📃 Information for Assignments
Below contains additional information that is relevant for grading Assignments 1-6.

## ❓ How to Run
Ensure you have Node.js v.16^ installed before attempting to run.

The `.env` file is expected in this format:
```
PSQL_HOSTNAME=
PSQL_USERNAME=
PSQL_PASSWORD= 
PSQL_PORT=
 
MONGODB_URI=

JWT_SECRET_KEY=

CLOUDAMQP_URL=
```

### Assignments 1 to 3
1. Clone the repository or download the code.
2. In both the `backend` and `frontend` folders, run `npm install`.
3. Add a `.env` file to the `backend` folder.
4. In the `backend` folder, run `npm run dev`.
5. In another terminal, in the `frontend` folder, run `npm start`. The app should open in your browser at `localhost:3000`.

<details>
<summary>.env format </summary>

```
PSQL_HOSTNAME=
PSQL_USERNAME=
PSQL_PASSWORD= 
PSQL_PORT=
 
MONGODB_URI=

JWT_SECRET_KEY=
```

</details>

### Assignment 4 (Docker)
Note: The app can still be run the same way as Assignments 1 to 3 with multiple terminals for the different backend services.

Ensure you have Docker Engine installed before attempting to run.

1. Clone the repository or download the code.
2. Open Docker Engine.
3. Add `.env` files with necessary values to `question-service/` and `user-service/`.
4. At the root directory run `docker compose up`.
5. After all containers are up, access to the application at `localhost:3000`.

### Assignment 5
1. Clone the repository or download the code.
2. Open Docker Engine.
3. Add .env files with necessary values to `matching-service/`, `question-service/` and `user-service/`.
4. At the root directory run `docker compose up`.
5. After all containers are up, access to the application at `localhost:3000`.
## 📁 Relevant Files for Assignments
Below are the most relevant files/folders for each assignment. There may have been other files involved. If the assignment is not specified below, then all files in the tagged commit are relevant for that assignment.

<details>
<summary>Files for Assignment 1</summary>

* `frontend/src/App.js`
* `frontend/src/pages/questions.js`
* `frontend/src/components/questions`

</details>

<details>
<summary>Files for Assignment 4</summary>

* `*/Dockerfile`
* `*/.dockerignore`
* `nginx/`
* `docker-compose.yml`
</details>
<details>
<summary>Files For Assignment 5</summary>

* `matching-service/`
* `frontend/src/pages/match.js`
* `docker-compose.yml`
</details>