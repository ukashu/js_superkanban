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

## Design
[Link do figmy](https://www.figma.com/design/1r6ZqHKMTm72fui7hrXOy0/js_superkanban?node-id=0-1&t=D3vBu3EETGncnLhE-1)

## Development
### Wymagania
- Node (ja używam v24.11.0)
- NPM (ja używam 11.6.1)
### Uruchomienie backendu
1. sklonuj repozytorium `git clone`
2. przejdź do folderu `/backend`
3. `npm install` - zainstaluj paczki
4. utwórz plik `.env` w folderze `/backend` i dodaj w nim dwie linijki:
```
PORT=5000 #lub inny port
NODE_ENV=development
```
5. `npm run dev` - włącz serwer
### Uruchomienie serwera Vite (frontend)
1. przejdź do folderu `/client`
2. `npm install`
3. `npm run dev`
### Docker
**coming soon**
### Postman
Zamiast Postmana używamy [Bruno](https://www.usebruno.com/).
Otwieramy folder [bruno](./backend/bruno/) jako kolekcję w programie Bruno. Testy dodawane w programie będą zapisywane w strukturze projektu.
### Prettier
- w celu ustanowienia jednej konwencji formatu plików dodałem do projektu moduł "Prettier" z podstawową konfiguracją oraz włączyłem formatowanie przy zapisie dla projektu (ustawienie VSCode)
    - aby korzystać z nowej funkcjonalności należy dodać do VSCode rozszerzenie [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) oraz wykonać komendę `npm install` w folderze `backend` oraz `client`