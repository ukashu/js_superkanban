## Na zjazd 4
### Łukasz
- [ ] utworzyć ścieżki i kontrolery związane z użytkownikami
    - [x] `GET /api/users?email=`
    - [x] `GET /api/users/:userId`
    - [x] `PUT /api/users/:userId`
    - [x] `DELETE /api/users/:userId`
    - [ ] `GET /api/users/:userId/tasks?filtering`
### Wiktoria
- [ ] utworzyć ścieżki, kontrolery i testy Bruno związane z [taskami](./README.md#tasks) (bez funkcjonalności, wejście w ścieżkę wyświetla komunikat typu "Hello, world")
    - [ ] `GET /api/projects/:projectId/tasks`
    - [ ] `POST /api/projects/:projectId/tasks`
    - [ ] `PUT /api/projects/:projectId/tasks/:taskId`
    - [ ] `DELETE /api/projects/:projectId/tasks/:taskId`
### Ola
- [ ] utworzyć ścieżki, kontrolery i testy Bruno związane z [projektami](./README.md#projects) (bez funkcjonalności, wejście w ścieżkę wyświetla komunikat typu "Hello, world")
    - [ ] `POST /api/projects`
    - [ ] `PUT /api/projects/:projectId`
    - [ ] `DELETE /api/projects/:projectId`

**Wskazówka**
- Wykonując zadania wzorujcie się tym co ja już zrobiłem. Postanowiłem zmienić strukturę folderów w stosunku do tego co było pokazane na wykładzie - zamiast tworzyć oddzielny folder na kontrolery, oddzielny na routery itp. grupuję kontrolery, routery i inne związane z użytkownikami w folderze `/users`, wy stworzycie foldery `/projects` i `/tasks`.
- instrukcja uruchomienia w [README.md](./README.md#development)
- zamiast Postmana używamy Bruno do testowania API, instrukcja w [README.md](./README.md#postman)
- proponuję aby każdy swoje zadania robił na oddzielnych branchach