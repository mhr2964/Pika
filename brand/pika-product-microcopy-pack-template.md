# Pika Product Microcopy Pack — Frontend / Prototype Handoff

> **Artifact status:** **CURRENT**
> This is the active microcopy handoff format for Pika’s first shippable product slice.
>
> **Scope:** Create room, join room, participant naming, add options, waiting/ready-to-start, matchup prompts, result reveal, and share/copy confirmation.
>
> **Superseded artifacts:** Earlier exploratory drafts, loose copy notes, and any package not marked **CURRENT** are reference-only and should not be used as implementation source copy.

## 1) Create Room
### Primary copy
- **Screen title:** [selected line]
- **Screen subtitle / helper text:** [selected line]
- **Primary button:** [selected line]
- **Secondary button/link:** [selected line, if used]

### Field labels
- **Field 1 label:** [selected line]
- **Field 1 placeholder:** [selected line]
- **Field 2 label:** [selected line, if used]
- **Field 2 placeholder:** [selected line, if used]

### States
- **Loading state:** [selected line]
- **Success state:** [selected line]
- **Empty state:** [selected line, if used]

### Errors
- **Validation error:** [selected line]
- **System/server error:** [selected line]

---

## 2) Join Room
### Primary copy
- **Screen title:** [selected line]
- **Screen subtitle / helper text:** [selected line]
- **Primary button:** [selected line]
- **Secondary button/link:** [selected line, if used]

### Field labels
- **Room code label:** [selected line]
- **Room code placeholder:** [selected line]
- **Name label:** [selected line]
- **Name placeholder:** [selected line]

### States
- **Loading state:** [selected line]
- **Success state:** [selected line]
- **Empty state:** [selected line, if used]

### Errors
- **Invalid code error:** [selected line]
- **Missing name error:** [selected line]
- **System/server error:** [selected line]

---

## 3) Participant Naming
### Primary copy
- **Section title:** [selected line]
- **Helper text:** [selected line]
- **Primary button:** [selected line]
- **Secondary button/link:** [selected line, if used]

### Field labels
- **Participant name label:** [selected line]
- **Participant name placeholder:** [selected line]

### States
- **Editing state helper:** [selected line]
- **Saved state:** [selected line]

### Errors
- **Duplicate name error:** [selected line]
- **Missing name error:** [selected line]

---

## 4) Add Options
### Primary copy
- **Section title:** [selected line]
- **Helper text:** [selected line]
- **Primary button:** [selected line]
- **Secondary button/link:** [selected line, if used]

### Field labels
- **Option input label:** [selected line]
- **Option input placeholder:** [selected line]

### States
- **Empty state:** [selected line]
- **Added state:** [selected line]
- **Ready state:** [selected line]

### Errors
- **Minimum options error:** [selected line]
- **Duplicate option error:** [selected line]

---

## 5) Waiting / Ready to Start
### Primary copy
- **Screen title:** [selected line]
- **Helper text:** [selected line]
- **Primary button:** [selected line]
- **Secondary button/link:** [selected line, if used]

### Status states
- **Waiting for others:** [selected line]
- **Almost ready:** [selected line]
- **Ready to start:** [selected line]

### Errors
- **Unable to start error:** [selected line]
- **Refresh/reconnect error:** [selected line]

---

## 6) Matchup Prompts
### Primary copy
- **Prompt title:** [selected line]
- **Prompt instruction:** [selected line]
- **Choice A label:** [selected line]
- **Choice B label:** [selected line]

### Action copy
- **Confirm selection button:** [selected line]
- **Next prompt button:** [selected line, if used]

### States
- **Waiting for next matchup:** [selected line]
- **Selection received:** [selected line]

### Errors
- **Selection required error:** [selected line]
- **Sync/update error:** [selected line]

---

## 7) Result Reveal
### Primary copy
- **Result title:** [selected line]
- **Result support line:** [selected line]
- **Winning option label/prefix:** [selected line]

### Action copy
- **Primary button:** [selected line]
- **Secondary button/link:** [selected line, if used]

### States
- **Revealing/loading state:** [selected line]
- **Final result state:** [selected line]

### Errors
- **Result unavailable error:** [selected line]
- **Retry error:** [selected line]

---

## 8) Share / Copy Confirmation
### Primary copy
- **Section title:** [selected line]
- **Helper text:** [selected line]
- **Share button:** [selected line]
- **Copy button:** [selected line]

### Confirmation states
- **Copied confirmation:** [selected line]
- **Shared confirmation:** [selected line]
- **Invite-sent style confirmation (if used):** [selected line]

### Errors
- **Copy failed error:** [selected line]
- **Share unavailable error:** [selected line]

---

## 9) Implementation Notes
- Use this pack screen by screen; avoid mixing labels or states across sections unless the final selected copy explicitly repeats.
- Prefer the shortest clear line that still sounds human.
- Keep implementation text consistent across buttons, helpers, and confirmations.
- If a UI element does not exist in the shipped slice, omit its line rather than inventing new copy.
- If product behavior changes, update this pack and re-mark artifact status before implementation.