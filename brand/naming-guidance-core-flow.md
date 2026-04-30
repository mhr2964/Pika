# Product Naming Guidance — Core Flow States + Primary Actions

## Naming standard
Use names that tell the user:
1. **where they are**
2. **what happens next**
3. **what the action will do**

Default to plain language. Brand flavor can live in supporting copy, not in the main label a user relies on to move forward.

---

## Core flow states

### 1) Start state
**Recommended label:** `Start a room`

**Use when:** the user is beginning a new session, space, or collaborative flow.

**Why:** It is specific, active, and easy to scan. “Start” signals forward motion. “Room” is the clearest product noun if that is the primary container in the prototype.

**Good supporting variants:**
- `Create a room` if the product is emphasizing setup
- `New room` for compact navigation labels only

**Avoid as the primary state label:**
- `Launch`
- `Spin up`
- `Open a vibe`
- `Begin the magic`

---

### 2) Pre-join / entry state
**Recommended label:** `Join a room`

**Use when:** a user is entering an existing room via link, code, or invitation.

**Why:** “Join” is familiar and unmistakable. It works across invited and self-serve entry moments.

**Good supporting variants:**
- `Enter room code` for the field label
- `Join with link` if there are multiple entry methods

**Avoid as the primary state label:**
- `Hop in`
- `Drop in`
- `Enter the portal`
- `Step inside`

---

### 3) Setup / details state
**Recommended label:** `Room details`

**Use when:** the user is naming the room, setting options, or reviewing basics before continuing.

**Why:** It describes the content of the screen without sounding technical or vague.

**Good supporting variants:**
- `Set up your room`
- `Add room details`

**Avoid as the primary state label:**
- `Configuration`
- `Customize`
- `Tune it`
- `Make it yours`

---

### 4) Waiting / pre-live state
**Recommended label:** `Waiting for others`

**Use when:** a room exists but the collaborative activity has not fully started.

**Why:** It clearly explains the current status and implies that the user does not need to guess what is happening.

**Good supporting variants:**
- `Waiting for participants`
- `Room is ready`

**Avoid as the primary state label:**
- `Lobby` unless the product already uses game-language everywhere
- `Staging`
- `Idle`
- `Standing by`

---

### 5) Live / active collaboration state
**Recommended label:** `In the room`

**Use when:** the session is active and the user is participating.

**Why:** It is simple, human, and durable across different room activities.

**Good supporting variants:**
- `Live in room` if a stronger status distinction is needed
- `Room in progress` for admin or system status views

**Avoid as the primary state label:**
- `Session mode`
- `Live mode`
- `Now vibing`
- `Inside the experience`

---

### 6) Completed state
**Recommended label:** `Room finished`

**Use when:** the active collaboration has ended.

**Why:** It is direct and neutral. It avoids emotional assumptions like “success” when a session may simply be over.

**Good supporting variants:**
- `Session ended`
- `This room has ended`

**Avoid as the primary state label:**
- `Complete`
- `Donezo`
- `Wrapped`
- `Mission accomplished`

---

### 7) Empty state
**Recommended label:** `No rooms yet`

**Use when:** there are no created rooms, no recent activity, or no available items in a list.

**Why:** It is concrete and fast to understand. “Yet” keeps it from sounding punitive.

**Good supporting variants:**
- `No one has joined yet`
- `Nothing here yet` only for secondary empty states, not core navigation

**Avoid as the primary state label:**
- `It’s quiet in here`
- `A blank canvas`
- `Zero activity`
- `Nothing to see`

---

### 8) Error / blocked state
**Recommended label:** `Couldn’t join room`

**Use when:** the user attempted an action and the product must explain a failure.

**Why:** Error labels should state the failed action in plain language. This makes recovery easier.

**Good supporting variants:**
- `Couldn’t create room`
- `Room not found`
- `Something went wrong` only when the product truly cannot identify the failed action

**Avoid as the primary state label:**
- `Oops`
- `Uh-oh`
- `That didn’t work`
- `We hit a snag`

---

## Primary actions / CTAs

### Create flow
- **Primary CTA:** `Start room`
- **Secondary acceptable:** `Create room`
- **Do not use:** `Launch room`, `Make room`, `Open room`

### Join flow
- **Primary CTA:** `Join room`
- **Secondary acceptable:** `Join with code`
- **Do not use:** `Enter`, `Hop in`, `Go`

### Continue / next-step flow
- **Primary CTA:** `Continue`
- **Use only when:** the next step is obvious from the page context
- **If context is not obvious, prefer:** `Review details`, `Choose name`, `Confirm settings`
- **Do not use:** `Next` when several unrelated things could happen

### Confirmation flow
- **Primary CTA:** `Confirm`
- **Better when action-specific:** `Confirm room`, `Save changes`, `End room`
- **Do not use:** `Done` unless there is no ambiguity at all

### Save/edit flow
- **Primary CTA:** `Save changes`
- **Secondary acceptable:** `Update room`
- **Do not use:** `Apply`, `Submit`, `Lock it in`

### Exit/cancel flow
- **Primary CTA:** `Cancel`
- **If destructive or irreversible, prefer:** `Leave room`, `End room`, `Delete room`
- **Do not use:** `Back` unless it truly navigates to the previous screen

### Retry / recovery flow
- **Primary CTA:** `Try again`
- **If action-specific, prefer:** `Retry join`, `Reload room`
- **Do not use:** `Refresh` unless it literally refreshes the page or data view

### Invite/share flow
- **Primary CTA:** `Copy invite link`
- **Secondary acceptable:** `Invite people`
- **Do not use:** `Share`, if the destination or method is not clear

---

## Banned alternatives to avoid ambiguity or over-branding

Do not use these as primary labels for core states or main CTAs:

1. **`Vibe` / `Vibing` / `Set the vibe`**  
   Too cute, too vague, and not reliable in navigation.

2. **`Magic` / `Make magic` / `Start the magic`**  
   Says nothing about the action; reads like filler.

3. **`Portal` / `Jump in` / `Hop in`**  
   Playful, but weak on clarity and accessibility.

4. **`Experience` / `Journey` / `Workspace`**  
   Generic product language that obscures the actual object.

5. **`Done` / `Go` / `Enter`**  
   Too unspecific for primary CTAs in a multi-step product flow.

---

## Quick rules for future naming decisions
- Prefer **verb + object** for CTAs: `Join room`, `Copy link`, `Save changes`
- Prefer **plain status phrases** for states: `Waiting for others`, `Room finished`
- Keep the core product noun consistent: if it is a **room**, do not alternate with **space**, **session**, **hub**, or **place** unless there is a real product distinction
- If a label could apply to three different actions, it is too vague
- If a label sounds clever out of context, it is probably wrong for the primary UI