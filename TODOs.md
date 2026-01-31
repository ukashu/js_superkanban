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
- [x] KanbanBoard component
- [ ] EditUserData popup component
- [ ] Add new route getProjectsForUser `/users/:userId/projects`

### Wiktoria

- [x] CreateProject component
  - komponent do stworzenia nowego projektu
- [x] CreateTask component
  - komponent do stworzenia nowego taska dla projektu
- [x] ProjectBacklog component
  - wyświetlanie listy tasków w backlogu (ze statusem "BACKLOG") dla projektu
- [x] AssignUserToTask component
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

### Łukasz

- [ ] zabezpieczenie ścieżek w backendzie
- [x] połączyć frontend z backendem w kontekście uwierzytelniania i autoryzacji
- [x] mechanika dodawania taska do pracownika poprzez przeciągnięcie taska w widoku projektu

### Wiktoria

- [x] strona Login (email, password)
- [x] strona Register (username, email, password)
      Nie ma jeszcze mechanizmu rejestracji/logowania więc strony Login i Register powinny tylko wysyłać do serwera wpisane dane (endpointy `/api/session/login` oraz `/api/session/register` - póki co nie ma ich na serwerze)

### Ola

- [x] mechanizm rejestracji i logowania w backendzie za pomocą JsonWebToken
- [x] authenticate Middleware - middleware do sprawdzania poprawności JWT wysłanego z klienta, odszyfrowywanie go i dodanie do `req`
      Nowe ścieżki i kontrolery w folderze `/sessions`

## Uwagi

- można dodac refresh_token ale nie trzeba może być JWT, ale może wyższa ocena
- rola zapisana w JWT?

## Na zjazd 9

### Backlog

- [ ] Dodać user homepage
  - [x] user kanban
  - [x] zmiana statusu tasks poprzez przeciągnięcie
    - [ ] może zmienić z refetcha po zmianie statusu na optimistic update?
  - [ ] user details
- [x] bug: nie widać tasków w backlogu w ProjectKanban
- [x] zmienić table na grid w kanbanie
- [ ] usuwanie tasków/projektów
- [ ] bug: reloadBacklogKey could cause overflow issues?
- [ ] zabezpieczenie wszystkich ścieżek w backendzie które powinny być chronione
- [ ] dodanie wysyłania JWT w frontendzie tam gdzie frontend requestuje chronione zasoby (według wzoru z `ProjectKanban.vue`)
- [ ] edit user details
- [ ] dodać logout
- [ ] make login/register redirect to user home
- [ ] extending Project homepage
  - [ ] dodać listę projektów zmieniającą listę tasków
- [ ] dodać opcje sortowania/filtracji w frontendzie
  - [ ] w project kanban
  - [ ] w user kanban
- [x] usunąć niepotrzebne części
  - [x] Tasks frontend route
- [ ] zmienić fetche na composables
- [ ] poprawne wyświetlanie errorów w UI (np. w popupach)
- [ ] dodanie listy projektów w ProjectView
- [ ] dodanie fetch composable i użycie w ProjectKanban
- [ ] kliknięcie na projekt z listy projektów zmienia zawartośc ProjectKanban

- [x] naprawić błąd: dwa taski w jednym rzędzie
- [x] cała strona nie powinna się scrollować, tylko kanban, backlog i project list
- [x] napraw podświetlanie stref zrzutu tasków
- [x] dodaj tailwind
- [x] przycisk Add project
- [ ] zmienić edycję użytkownika na popup
- [ ] owner_id przy tworzeniu taska powinien być brany z JWT w backendzie
- [ ] usuwanie tasków (w widoku projektu)
  - najlepiej poprzez przeciągnięcie i upuszczenie w strefie usuwania, strefa usuwania może pojawiać się pod backlogiem kiedy task jest podniesiony

### Łukasz

- [x] dodać kanban tasków dla użytkownika
- [x] funkcjonalność zmiany statusu taska poprzez przeciągnięcie go
- [x] zmienić table na grid w kanbanach
- [x] naprawić błąd: dwa taski w jednym rzędzie
- [x] cała strona nie powinna się scrollować, tylko kanban, backlog i project list
- [x] naprawić podświetlanie stref zrzutu tasków
- [x] dodać tailwind do projektu
- [x] przycisk Add project wyświetlający popup do dodania nowego projektu
- [x] naprawa scrollowania w User Home
- [x] bug: `/` przenosi na `/login` nawet jeżeli użytkownik jest zalogowany
- [x] dodać responsywność

### Ola

- [x] dodać listę projektów użytkownika w ProjectPage
  - układ zgodny z designem z Figmy
  - dodać ścieżkę w backendzie do pobrania projektów dla usera, Vue powinien pobierać tę listę `onMounted`
  - kliknięcie w projekt z listy powinno zmienić taski wyświetlane w ProjectBacklog i ProjectKanban
- [x] dodanie component library do projektu
- [x] zmienić edycję danych użytkownika na popup wyświetlany po kliknięciu przycisku

### Wiktoria

- [x] stworzyć komponent Vue do edycji danych użytkownika
- [x] przycisk i funkcjonalność Logout w Vue
  - wylogowanie polega na usunięciu wartości `token` i `user_id` z localStorage
- [x] po udanym logowaniu/rejestracji przenieść użytkownika na stronę domową użytkownika `/users/<USER_ID>`
- [x] przy kliknięciu przycisku "User" w nawigacji id użytkownika powinno byc brane z localstorage, obecnie jest chyba hardkodowane user_id 1 w `App.vue`
- [x] przycisk "Logout" powiniem być widzialny tylko dla zalogowanych użytkowników, przyciski "Login" i "Register" tylko dla niezalogowanych

## Na zjazd 10

### Backlog

- [x] użycie composables tam gdzie to możliwe
- [ ] sprawdzić czy errory z backendu wyświetlają się w poprawny sposób, jeżeli nie - naprawić
- [x] przeniesienie taska z powrotem do backlogu (w widoku projektu)
- [x] paginacja tasków w kanbanie
  - [ ] bug: kiedy taski załadowane za pierwszym razem nie przepełniają kontenera, nie doładowują się inne
  - [x] bug: reloading task list does not work
- [x] optimistic updates przy zmianach statusu tasków
- [x] bug: drop zone nie zajmuje całej kolumny UserKanban
- [x] dodać wyświetlanie daty utworzenia do tasków
- [ ] szczegóły taska
  - [ ] przycisk details (po kliknięciu wyświetla details)
  - [ ] edycja taska (przycisk do edycji wewnątrz details) (edycja title, description, status)
  - [ ] dodać przycisk delete (wewnątrz edycji)
- [ ] szczegóły projektu
  - [ ] przycisk details (po kliknięciu wyświetla details)
  - [ ] wewnątrz details przycisk do edycji (edycja title, description)
  - [ ] przycisk do usunięcia projektu wewnątrz edycji
- [ ] filtrowanie tasków po nazwie (UserKanban i ProjectKanban)
- [ ] dodać restrykcje związane z rolami
- [ ] owner_id przy tworzeniu taska powinien być brany z JWT w backendzie
- [ ] naprawić LoginView
  - [ ] bug: logowanie złymi danymi łamie stronę
  - [ ] LoginView powinien wyświetlać errory
  - można wzorowac się na obecnym RegisterView
- [ ] bug: dodanie nowego projektu powinno odświeżać listę projektów
- [ ] bug: taski w user kanban nie powinny wyświetlać się obok siebie

### Wiktoria

- [ ] szczegóły taska
  - [ ] przycisk details (po kliknięciu wyświetla details)
  - [ ] edycja taska (przycisk do edycji wewnątrz details) (edycja title, description, status)
  - [ ] dodać przycisk delete (wewnątrz edycji)
- [ ] szczegóły projektu
  - [ ] przycisk details (po kliknięciu wyświetla details)
  - [ ] wewnątrz details przycisk do edycji (edycja title, description)
  - [ ] przycisk do usunięcia projektu wewnątrz edycji
- [ ] naprawić LoginView
  - [ ] bug: logowanie złymi danymi łamie stronę
  - [ ] LoginView powinien wyświetlać errory (błędy z serwera/nieprawidłowe dane itp.)
  - można wzorowac się na obecnym RegisterView

### Ola

- [x] dodać restrykcje związane z rolami
  - najważniejsze jest zabezpieczenie na backendzie
  - na frontendzie trzeba przy uprzywilejowanych fetchach przekazywać token użytkownika, w `helpers.js` jest od tego funkcja `authFetch`
  - na frontendzie można ukryć niektóre funkcjonalności jeżeli użytkownik nie ma praw do wykonania ich (np. ukryć przycisk "Add task")
  - [x] tylko project owner i admin mogą dodać/edytować/usunąć task do projektu
  - [x] tylko project owner i admin mogą przypisać/cofnąć przypisanie tasku do użytkownika
  - [x] tylko użytkownik X i admin mogą zmienić detale użytkownika X
  - [x] tylko użytkownik X i admin mogą wejść w `/users/:userX` na frontendzie
  - [x] tylko użytkownik X i admin mogą wejść w `/users/:userX/projects` na frontendzie
  - [x] tylko użytkownik X, project owner i admin mogą zmienić status taska przypisanego do użytkownika X z "DOING" na "REVIEW" i odwrotnie
  - [x] tylko project owner i admin mogą zmienić status taska z "REVIEW" na "DONE" i odwrotnie

### Ostatnie zmiany

- [x] zmienic z powrotem na wyswietlanie daty w tasku
- [ ] klikanie w details projektu niczego nie pokazuje (można zamiast tego po prostu wyświetlić edit)
- [ ] naprawić responsywnosc w widoku userkanban i project kanban
  - [x] w user kanban nie pokazują się przyciski
  - [ ] w project kanban nie pokazują się przyciski, backlog pokazuje się w złym miejscu oraz taski nie wypełniają całej szerokości
- [x] edit task details doesnt do anything
- [x] editing task does not refresh project kanban
- [x] disable editing task in user kanban
- [x] My projects has useless margin on the bottom
- [ ] editing project does not refresh my projects list
- [ ] popups are not wide enough on small screens
- [ ] admin should fetch all projects in projectView
