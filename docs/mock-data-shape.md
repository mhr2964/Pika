# Mock data shape

## Room
- `id: string`
- `slug: string`
- `title: string`
- `status: draft | active | complete`
- `ownerUserId: string | null`
- `ownerSessionId: string | null`

## Option
- `id: string`
- `roomId: string`
- `label: string`
- `description: string | null`

## Matchup
- `id: string`
- `roomId: string`
- `leftOptionId: string`
- `rightOptionId: string`
- `round: number`
- `status: pending | answered`

## Selection
- `id: string`
- `roomId: string`
- `matchupId: string`
- `chosenOptionId: string`
- `ownerUserId: string | null`
- `ownerSessionId: string | null`

## Result
- `roomId: string`
- `winnerOptionId: string | null`
- `rankedOptionIds: string[]`
- `totalSelections: number`
- `completedAt: string | null`