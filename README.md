# js_superkanban

## API plan
Session
---
`POST /api/register`
`POST /api/login`

`GET /` - ekran startowy, niezalogowanych przenieś na `/api/login`, zalogowanych na `/api/users/:userId`

Projects
---
`GET /api/projects?filters` - wyświetl wszystkie projekty których jestem właścicielem lub do których jestem przypisany

`POST /api/projects` - dodaj nowy projekt

`PUT /api/projects/:projectId` - edytuj szczegóły projektu (jako właściciel lub admin)

`DELETE /api/projects/:projectId` - usuń projekt (jako właściciel lub admin)

Users
---
`GET /api/users?email=` - wyszukiwanie użytkownika

`GET /api/users/:userId` - profil użytkownika

`PUT /api/users/:userId` - zmień szczegóły konta użytkownika (jako użytkownik lub admin)

`DELETE /api/users/:userId` - usuń użytkownika (jako użytkownik lub admin)

`GET /api/users/:userId/tasks?filtering` - zobacz wszystkie zadania dla użytkownika (jako użytkownik lub admin)

Tasks
---
`GET /api/projects/:projectId/tasks` - zobacz wszystkie zadania dla projektu (jeżeli jesteś członkiem)

`POST /api/projects/:projectId/tasks` - dodaj zadanie do projektu (jeżeli jesteś właścicielem)

`PUT /api/projects/:projectId/tasks/:taskId` - zmien szczegóły zadania (jeżeli jesteś właścicielem)

`DELETE /api/projects/:projectId/tasks/:taskId` - usuń zadanie (jeżeli jesteś właścicielem)
