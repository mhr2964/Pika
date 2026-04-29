# Pika canonical naming and entry labels v1
_Last updated: 2026-04-29_  
_Status: authoritative naming reference for engineering readiness_  
_Source references: `experience-spec-state-matrix.md`, `pika-experience-appendix-v1.md`_  
_Freeze rule: canonical state IDs and canonical screen/state names in this document are authoritative for handoff; user-facing labels should be used as written unless UI constraints require a shorter approved variant._

---

## 1) Naming conventions

### Canonical naming rules
**APPROVED**

- Use canonical state IDs in code, analytics, and QA references.
- Use canonical screen/state names in specs, tickets, and cross-team discussion.
- Use user-facing entry labels only where a player sees a nav item, route title, entry prompt, or button leading into the flow.
- Prefer “room” over “lobby” in player-facing language unless the player is already inside the room.
- Prefer “matchup” over “pairing” in player-facing language unless the system is still actively assigning players.
- Prefer “results” over “outcome,” “summary,” or “resolution.”
- Prefer “reconnect” over “resume” when connection recovery is the job.
- Prefer “start over” over “reset” in player-facing recovery copy.

### Copy casing rules
**APPROVED**

- Screen names: title case
- State IDs: dot notation, lowercase
- CTAs: sentence case, short and direct
- Labels: plain language over shorthand
- Error titles: specific and calm, never dramatic

### Aliases to avoid
**APPROVED**

Do not use these as primary labels in product copy, tickets, or specs:

| Avoid | Use instead | Why |
|---|---|---|
| lobby code | room code | “Room code” is the approved player-facing label |
| pairing screen | matchup screen / waiting for matchup | “Pairing” is system language, not the main player-facing label |
| outcome | results | “Results” is clearer and already established |
| restart flow | rematch / play again | Player-facing wording should feel natural and immediate |
| resume session | reconnect / rejoin | Use the more specific recovery verb |
| sync failure | sync issue | Softer, clearer error wording |
| reset | start over | Less technical, less severe |
| match screen | matchup / active matchup | More specific to current state |
| failure state | error state / recovery state | Cleaner and more human in specs |
| empty lobby | room ready / waiting for players | “Empty lobby” sounds internal and flat |

---

## 2) User-facing route and entry labels

### Entry label set
**APPROVED**

| Job | User-facing label | Notes |
|---|---|---|
| Initial home entry | Keep the game moving | Welcome/onboarding hero line, not a nav label |
| Start new room entry | Start a room | Preferred entry label before room creation |
| Join existing room entry | Join a room | Preferred secondary onboarding path |
| Reconnect entry | Reconnect | Use only when an in-progress session is detected |
| Return-home entry | Back to home | Preferred recovery route label |
| Leave current flow | Leave game | Use once a player is inside active game flow |
| Leave pre-game room | Leave room | Use before match play begins |

### Route title guidance
**APPROVED**

Use these where route/page titles are visible to users:

| Flow area | Preferred route title |
|---|---|
| onboarding welcome | Welcome to Pika |
| join flow | Join a room |
| create flow | Start a room |
| room waiting state | Room ready |
| guest room waiting state | You’re in |
| matchup wait state | Hold tight |
| active round | Your turn |
| results reveal | Results |
| rematch waiting | Rematch |
| reconnect flow | Reconnecting |

---

## 3) Normalized state naming table

| State ID | Canonical screen/state name | User-facing route or entry label | Primary user-facing title | State type | Aliases to avoid |
|---|---|---|---|---|---|
| `onboarding.welcome.idle` | Welcome | Welcome to Pika | Keep the game moving | onboarding | home, start screen |
| `onboarding.welcome.name_missing` | Welcome / Validation | Welcome to Pika | Keep the game moving | validation | missing profile, blank name |
| `onboarding.welcome.name_invalid` | Welcome / Validation | Welcome to Pika | Keep the game moving | validation | invalid username |
| `onboarding.welcome.resume_found` | Welcome / Resume | Reconnect | Pick up where you left off | recovery | resume session, restore session |
| `onboarding.join_room.idle` | Join Room | Join a room | Enter the room code | onboarding | enter lobby, room lookup |
| `onboarding.join_room.code_missing` | Join Room / Validation | Join a room | Enter the room code | validation | missing code |
| `onboarding.join_room.code_invalid_format` | Join Room / Validation | Join a room | That code looks off | validation | bad code, invalid invite |
| `onboarding.join_room.loading` | Join Room / Loading | Join a room | Joining room | loading | connecting to room |
| `onboarding.join_room.not_found` | Join Room / Error | Join a room | We couldn’t find that room | error | invalid room, room missing |
| `onboarding.join_room.full` | Join Room / Error | Join a room | That room is full | error | room unavailable |
| `onboarding.join_room.closed` | Join Room / Error | Join a room | That room is closed | error | expired room |
| `onboarding.join_room.network_error` | Join Room / Error | Join a room | We couldn’t join the room | error | join failed |
| `onboarding.reconnect.prompt` | Reconnect Prompt | Reconnect | Your game is still in progress | recovery | resume prompt |
| `onboarding.reconnect.loading` | Reconnect / Loading | Reconnecting | Reconnecting | loading | restoring session |
| `onboarding.reconnect.failed` | Reconnect / Error | Reconnect | We couldn’t reconnect this time | error | reconnect failure |
| `room.create.idle` | Create Room | Start a room | Create a new game | room creation | new lobby |
| `room.create.loading` | Create Room / Loading | Start a room | Creating room | loading | opening lobby |
| `room.create.success_waiting` | Room Lobby / Host | Room ready | Share the code and gather your players | waiting | host lobby |
| `room.create.empty` | Room Lobby / Empty | Room ready | You’re the first one here | empty | empty lobby |
| `room.create.start_locked` | Room Lobby / Disabled Start | Room ready | You need more players to start | empty | locked start |
| `room.create.network_error` | Create Room / Error | Start a room | We couldn’t create the room | error | create failed |
| `room.lobby.guest_waiting` | Room Lobby / Guest | You’re in | Waiting for the host to start | waiting | guest lobby |
| `room.lobby.player_joined` | Room Lobby / Update | Room ready | The room is filling up | update | player added |
| `room.lobby.player_left` | Room Lobby / Update | Room ready | A player left the room | update | player removed |
| `room.lobby.syncing` | Room Lobby / Loading | Room ready | Refreshing the room | loading | syncing lobby |
| `room.lobby.closed` | Room Closed | Back to home | This room is closed | error | closed lobby |
| `room.lobby.rejoin_offer` | Rejoin Lobby | Reconnect | Your room is still here | recovery | resume lobby |
| `match.progress.match_found` | Match Found | Match ready | You’ve got your matchup | transition | pairing complete |
| `match.progress.waiting_for_pairing` | Waiting for Matchup | Hold tight | We’re setting up your next matchup | loading | pairing screen |
| `match.progress.round_intro` | Round Intro | New round | Here’s your next matchup | transition | round start |
| `match.progress.turn_active` | Active Matchup | Your turn | Make your move | active | gameplay screen |
| `match.progress.turn_incomplete` | Active Matchup / Validation | Your turn | You’re not done yet | validation | incomplete turn |
| `match.progress.turn_submitting` | Active Matchup / Loading | Your turn | Sending your turn | loading | submitting answer |
| `match.progress.waiting_for_opponent` | Waiting on Opponent | Hold tight | Waiting for the other player | waiting | opponent pending |
| `match.progress.opponent_disconnected` | Match Interruption | Hold tight | The other player dropped for a moment | recovery | opponent left, disconnect state |
| `match.progress.sync_error` | Match Sync Error | Your turn | We lost the thread for a second | error | sync failure |
| `match.progress.reconnect_loading` | Match Reconnect / Loading | Reconnecting | Restoring your match | loading | restoring round |
| `match.progress.reconnect_failed` | Match Reconnect / Error | Reconnect | We couldn’t restore the match | error | round recovery failed |
| `match.progress.round_complete` | Round Complete | New round | That one’s done | transition | round summary |
| `match.progress.game_paused` | Game Paused | Hold tight | The game is paused | paused | suspended game |
| `results.reveal.loading` | Results Reveal / Loading | Results | Loading results | loading | outcome loading |
| `results.reveal.standard` | Results Reveal | Results | Here’s how it landed | results | outcome screen |
| `results.reveal.tie` | Results Reveal / Tie | Results | Too close to call | results | tie screen |
| `results.reveal.personal_win` | Results Reveal / Personalized | Results | You won this one | results | winner screen |
| `results.reveal.personal_loss` | Results Reveal / Personalized | Results | Not your round | results | loss screen |
| `results.reveal.partial_data` | Results Reveal / Degraded | Results | The round finished, but some details are missing | degraded | incomplete results |
| `results.reveal.rematch_waiting` | Rematch Lobby | Rematch | Waiting on the rest of the room | waiting | rematch queue |
| `results.reveal.rematch_ready` | Rematch Ready | Rematch | Everybody’s in | ready | restart ready |
| `results.reveal.rematch_declined` | Rematch Declined | Rematch | Not everyone wants another round | recovery | rematch failed |
| `results.reveal.network_error` | Results Reveal / Error | Results | We couldn’t load the full result | error | results failure |
| `results.reveal.closed` | Results Reveal / Closed | Back to home | This game has ended | closed | match closed |

---

## 4) Flow-specific naming guidance

### Onboarding
**APPROVED**

- Entry points should be labeled “Start a room” and “Join a room.”
- “Welcome to Pika” is the preferred visible route title when a top title is needed.
- Use “Your name” as the only primary player-identity field label.
- Recovery language should split clearly:
  - **Rejoin** for a known room before active play
  - **Reconnect** for an in-progress game or active round

### Room creation and lobby
**APPROVED**

- Use “Room ready” for the host waiting state, not “Lobby.”
- Use “You’re in” for guest entry into a room.
- Use “Room code” consistently everywhere.
- Use “Waiting for players” or “Waiting for the host to start” instead of generic “Pending.”

### Matchup progression
**APPROVED**

- Use “Matchup” when the player is being shown who they face.
- Use “Pairing” only in helper/loading language when assignment is still happening.
- Use “Your turn” as the stable route/title label for the active move state.
- Use “Hold tight” for interim waiting states that do not require action.

### Results reveal and rematch
**APPROVED**

- Use “Results” as the route title across all result variants.
- Use “Play again” for the standard replay CTA and “Run it back” only in supporting copy, not as the primary system label unless UI wants the warmer variant consistently.
- Use “Rematch” for readiness and waiting states after results.
- Use “This game has ended” for the final closed state, not “Session expired.”

---

## 5) Empty, loading, error, and recovery conventions

### Empty states
**APPROVED**

- Name the situation plainly.
- Keep the title specific to the user’s current status.
- Pair the empty state with a next action:
  - “You’re the first one here” → “Copy code”
  - “You need more players to start” → “Copy code”

### Loading states
**APPROVED**

- Prefer present-progressive verbs:
  - Joining room
  - Creating room
  - Reconnecting
  - Loading results
- Avoid vague “Please wait” loaders as the main title.
- If the action is reversible, a cancel or leave label may appear.

### Error states
**APPROVED**

- State what happened in plain language.
- Avoid blamey or technical phrasing.
- Use specific titles:
  - We couldn’t find that room
  - We couldn’t join the room
  - We couldn’t create the room
  - We couldn’t reconnect this time
  - We couldn’t load the full result

### Recovery states
**APPROVED**

- If the system has partial confidence, say so plainly:
  - “We think this is your latest session…”
  - “We can’t confirm whether your spot is still active.”
- Recovery actions should be concrete:
  - Rejoin
  - Reconnect
  - Try again
  - Start over
- Avoid technical recovery wording like “restore state” or “resume execution.”

---

## 6) Approved label inventory

### Core action labels
**APPROVED**

- Continue
- I’m joining a room
- Join room
- Try again
- Rejoin
- Reconnect
- Start fresh
- Start over
- Create room
- Copy code
- Start game
- Ready
- Leave room
- Leave game
- I’m ready
- Submit
- Keep editing
- Refresh state
- Next round
- Play again
- Run it back
- Share result
- Cancel rematch
- Start rematch
- Back to lobby
- Back to home

### Core helper labels
**APPROVED**

- Your name
- Room code
- Players in room
- Players here
- Host is getting things ready
- Waiting for players
- Time left
- Winner
- Final scores
- Placement
- Players ready

### Labels to avoid as generic substitutes
**APPROVED**

- Proceed
- Continue session
- Resume session
- Retry request
- Initialize room
- Submit response
- Exit
- Return
- Pending
- Outcome
- Resolution
- Session code
- Participant list

---

## 7) Implementation notes for frontend handoff

### Normalization rules
**APPROVED**

- If UI space is tight, shorten only the route/entry label first, not the canonical screen/state name.
- If a state needs both a route title and a large on-screen headline, keep them coordinated but allow the route title to be shorter.
- Do not create new synonyms for the same state in different flows.
- If engineering needs an internal alias for legacy reasons, keep the canonical label visible in comments, specs, and QA references.

### Escalation triggers
**PROVISIONAL**

Escalate for brand review if downstream implementation introduces:

- a new player-facing name for an existing state
- “lobby” as the main visible label in places where “room” is approved
- technical recovery wording replacing “rejoin,” “reconnect,” or “start over”
- new result-state names that imply claims or emotional tone not present in the appendix