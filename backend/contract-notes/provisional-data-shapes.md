# Lightweight Data Shapes Contract

Status: current lightweight alignment contract  
Audience: backend implementation guidance + approved clickable-flow alignment  
Scope: canonical lightweight shapes for room, option, matchup, result, and share

## Purpose of this note

This document is the current backend source for lightweight data-shape alignment across the approved clickable flow. It is intended to guide eventual implementation without creating dependency on prototype internals.

It covers only object shapes for:

- `room`
- `option`
- `matchup`
- `result`
- `share`

It does **not** define endpoints, database schema, persistence mechanics, transport envelopes, or prototype adapters.

## Confirmed conventions

- All top-level identifiers are opaque strings.
- Timestamps use ISO 8601 UTC strings.
- Field names use `lowerCamelCase`.
- Relationship fields use `{entity}Id` naming.
- Arrays may be empty unless a field is explicitly required by flow state.
- Example objects are minimal and omit unrelated metadata.

## Remaining explicit uncertainty

Only the following remain intentionally non-final:

- exact ID format
- participant/auth identity model
- matchup generation and ranking algorithm internals
- whether some derived share fields are stored or assembled at read time

---

## Room

**Purpose:** Top-level decision session containing participants, candidate options, matchup progress, and final outcome context.

**Canonical fields**

**Required**
- `id`
- `code`
- `creator`
- `state`
- `participants`
- `createdAt`

**Optional**
- `title`
- `currentMatchupId`
- `completedAt`

**Identifiers**
- `id`: canonical room identifier
- `code`: short human-friendly join/share code

**Key relationships**
- one room has many `options`
- one room has many `matchups`
- one room may have one `result`
- `currentMatchupId` references the active `matchup` when the room is in progress

**State enum**
- `draft`
- `collectingOptions`
- `inProgress`
- `completed`
- `archived`

**Minimal example**