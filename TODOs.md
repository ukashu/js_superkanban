## Na zjazd 4

### Łukasz

- [ ] utworzyć ścieżki, kontrolery i testy Bruno związane z użytkownikami
  - [x] `GET /api/users?email=`
  - [x] `GET /api/users/:userId`
  - [x] `PUT /api/users/:userId`
  - [x] `DELETE /api/users/:userId`
  - [ ] `GET /api/users/:userId/tasks?filtering`

### Wiktoria

- [x] utworzyć ścieżki, kontrolery i testy Bruno związane z [taskami](./README.md#tasks) (bez funkcjonalności, wejście w ścieżkę wyświetla komunikat typu "Hello, world")
  - [x] `GET /api/projects/:projectId/tasks`
  - [x] `POST /api/projects/:projectId/tasks`
  - [x] `PUT /api/projects/:projectId/tasks/:taskId`
  - [x] `DELETE /api/projects/:projectId/tasks/:taskId`

### Ola

- [x] utworzyć ścieżki, kontrolery i testy Bruno związane z [projektami](./README.md#projects) (bez funkcjonalności, wejście w ścieżkę wyświetla komunikat typu "Hello, world")
  - [x] `POST /api/projects`
  - [x] `PUT /api/projects/:projectId`
  - [x] `DELETE /api/projects/:projectId`

**Wskazówka**

- Wykonując zadania wzorujcie się tym co ja już zrobiłem. Postanowiłem zmienić strukturę folderów w stosunku do tego co było pokazane na wykładzie - zamiast tworzyć oddzielny folder na kontrolery, oddzielny na routery itp. grupuję kontrolery, routery i inne związane z użytkownikami w folderze `/users`, wy stworzycie foldery `/projects` i `/tasks`.
- instrukcja uruchomienia w [README.md](./README.md#development)
- zamiast Postmana używamy Bruno do testowania API, instrukcja w [README.md](./README.md#postman)
- proponuję aby każdy swoje zadania robił na oddzielnych branchach

## Na zjazd 6

### Łukasz

- [x] podłączyć do backendu bazę danych
- [x] zaprogramować inicjalizację bazy danych, wraz z dodaniem danych przykładowych
- [x] zmienić backendowe ścieżki powiązane z użytkownikami na korzystające z bazy danych zamiast z mockowej tablicy w kodzie
  - [x] dodać walidację
- [x] zinicjalizować projekt Vue
- [x] zaprogramować w Vue stronę wyświetlającą informacje o użytkowniku pobrane z endpointa `GET /api/users/:userId`

### Wiktoria

- [x] zmienić backendowe ścieżki powiązane z taskami na korzystające z bazy danych zamiast z mockowej tablicy w kodzie
  - [x] dodać walidację
- [x] zaprogramować w Vue stronę wyświetlającą taski pobrane z endpointa `GET /api/projects/:projectId`

### Ola

- [x] zmienić backendowe ścieżki powiązane z projektami na korzystające z bazy danych zamiast z mockowej tablicy w kodzie
- [x] dodać walidację używając express-validator
- [x] zaprogramować w Vue stronę wyświetlającą projekty pobrane z endpointa `GET /api/projects/:projectId`

**Wskazówki**

- struktura bazy danych widoczna w pliku `/backend/db/dbInit.js`

## Na zjazd 7

### Backlog

- [ ] design interfejsu
- [ ] stworzenie komponentów bez stylingu
  - [ ] Task - task as displayed on a kanban board
  - [ ] KanbanBoard
  - [ ] Backlog - list of tasks in backlog for a project (more compact tasks)
  - [ ] ProjectDetails popup showing project details, members and description
  - [ ] TaskEdit popup with delete option
  - [ ] ProjectEdit popup with delete option
- - [ ] UserDetailsEdit popup with delete option
- [ ] ProjectCreate popup component
- [ ] Task Create popup component
- [ ] Assign user to task popup component
- [ ] UpcomingTasks component
- [ ] stworzenie Viewsów
  - [ ] User Account/Homepage view
  - [ ] Project view
- [ ] Add new route getTasksForUser `/users/:userId/tasks`
- [ ] Add new route getProjectsForUser `/users/:userId/projects` (always project owner first, project worker second)
- [ ] filtrowanie i sortowanie tasków po stronie backendu w `/projects/:projectId/tasks` oraz `/users/:userId/tasks`

### Łukasz

- [ ] zmienić fetche na stosujące Composables
- [ ] rozwinąć UserHomePage
  - [ ] stworzyć stronę zgodną z wireframe
    - [ ] dane użytkownika
    - [ ] możliwość edycji danych użytkownika
    - [ ] nadchodzące terminy tasków
    - [ ] kanban board ze wszystkimi taskami użytkownika jako Component (póki co bez drag and drop)
- [ ] KanbanBoard component
- [ ] EditUserData popup component
- [ ] Add new route getProjectsForUser `/users/:userId/projects`

### Wiktoria

- [ ] CreateProject component
  - komponent do stworzenia nowego projektu
- [ ] CreateTask component
  - komponent do stworzenia nowego taska dla projektu
- [ ] ProjectBacklog component
  - wyświetlanie listy tasków w backlogu (ze statusem "BACKLOG") dla projektu
- [ ] AssignUserToTask component
  - komponent do którego przekazywany będzie taskId, komponent ma pobierać z serwera i wyświetlać listę wszystkich pracowników, użytkownik może wtedy wybrać jednego z pracowników i po kliknięciu przycisku "Confirm" zostaje przekazany request do backendu z edycją taska (przypisanie assignee_id i zmiana statusu)

### Ola

- [x] Task component - task as displayed on a kanban board
- [x] Add new backend route getTasksForUser `/users/:userId/tasks`
- [x] filtrowanie i sortowanie tasków po stronie backendu w `/projects/:projectId/tasks` oraz `/users/:userId/tasks`
  - w `/users/:userId/tasks` sortowanie po assignment date bez grupowania wg projektu i sortowanie po assignment date grupowane wg projektów
  - w `/projects/:projectId/tasks` sortowanie po assignment date bez grupowania wg assignee, sortowanie po assignment date grupowane wg assignee oraz szukanie tasków przypisanych do userName podanych w query stringu

**Notatki:**

- [Link do designu w Figmie](https://www.figma.com/design/1r6ZqHKMTm72fui7hrXOy0/js_superkanban?node-id=0-1&t=D3vBu3EETGncnLhE-1)
- póki co chodzi o stworzenie komponentów bez większego stylizowania

## Zjazd 8

### Backlog

- [ ] w get tasks for project group by zmienić żeby struktura odpowiedzi była taka sama jak innych, po prostu posortowane po assignee
- [ ] zmienić backend żeby data to zawsze była raw data, nie np. key "tasks" i dopiero wtedy array of tasks
- [x] naprawić dodawanie taska
- [ ] Styling
  - [ ] zmienić CreateTask na popup
