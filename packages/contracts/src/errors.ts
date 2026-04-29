export const API_ERROR_CODE = {
  invalidRequest: 'invalid_request',
  roomNotFound: 'room_not_found',
  roomClosed: 'room_closed',
  playerNotFound: 'player_not_found',
  duplicateName: 'duplicate_name',
  duplicateOption: 'duplicate_option',
  optionLimitReached: 'option_limit_reached',
  matchupNotReady: 'matchup_not_ready',
  voteConflict: 'vote_conflict',
  resultsNotReady: 'results_not_ready',
} as const;

export type APIErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

export interface APIError {
  code: APIErrorCode;
  message: string;
  field?: string;
  retryable?: boolean;
}