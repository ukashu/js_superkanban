# js_superkanban

## API plan
`POST /register`
`POST /login`

`GET /` - ekran startowy, niezalogowanych przenieś na `/login`, zalogowanych na `/users/:userId`

---
`GET /projects?filters` - wyświetl wszystkie projekty których jestem właścicielem lub do których jestem przypisany

`POST /projects` - dodaj nowy projekt

`UPDATE /projects/:projectId` - edytuj szczegóły projektu (jako właściciel lub admin)

`DELETE /projects/:projectId` - usuń projekt (jako właściciel lub admin)

---
`GET /users?email=` - wyszukiwanie użytkownika

`GET /users/:userId` - profil użytkownika

`UPDATE /users/:userId` - zmień szczegóły konta użytkownika (jako użytkownik lub admin)

`DELETE /users/:userId` - usuń użytkownika (jako użytkownik lub admin)

`GET /users/:userId/tasks?filtering` - zobacz wszystkie zadania dla użytkownika (jako użytkownik lub admin)

---
`GET /projects/:projectId/tasks` - zobacz wszystkie zadania dla projektu (jeżeli jesteś członkiem)

`POST /projects/:projectId/tasks` - dodaj zadanie do projektu (jeżeli jesteś właścicielem)

`UPDATE /tasks/:taskId` - zmien szczegóły zadania (jeżeli jesteś właścicielem)

`DELETE /tasks/:taskId` - usuń zadanie (jeżeli jesteś właścicielem)