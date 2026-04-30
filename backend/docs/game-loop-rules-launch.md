# Launch Game Loop Rules

- Room starts in `collecting_options`.
- Options are appended in submission order.
- Starting matchups requires at least 2 options.
- Matchups are generated as deterministic round-robin pairs based on option insertion order.
- Only one active matchup exists at a time.
- `choose` resolves only the current active matchup.
- Winner receives 1 win; loser receives 1 loss.
- Final ranking sorts by score (`wins - losses`), then wins, then label alphabetically for deterministic ties.
- Room becomes `completed` when all matchups are resolved.
- Guest sessions may create rooms, add options, start, and choose without auth; authenticated `x-user-id` is attached when present.