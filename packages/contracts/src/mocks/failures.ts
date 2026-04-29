import type { ContractFailure } from '../api';

export const roomNotFoundFailure: ContractFailure = {
  ok: false,
  error: {
    code: 'room_not_found',
    message: 'No room exists for the supplied room code.',
    field: 'roomCode',
    retryable: false,
  },
};

export const duplicateNameFailure: ContractFailure = {
  ok: false,
  error: {
    code: 'duplicate_name',
    message: 'That player name is already in use for this room.',
    field: 'playerName',
    retryable: true,
  },
};

export const duplicateOptionFailure: ContractFailure = {
  ok: false,
  error: {
    code: 'duplicate_option',
    message: 'That option has already been submitted in this room.',
    field: 'options',
    retryable: true,
  },
};

export const matchupNotReadyFailure: ContractFailure = {
  ok: false,
  error: {
    code: 'matchup_not_ready',
    message: 'A matchup cannot start until enough options are available.',
    retryable: true,
  },
};

export const resultsNotReadyFailure: ContractFailure = {
  ok: false,
  error: {
    code: 'results_not_ready',
    message: 'Results are not ready yet.',
    retryable: true,
  },
};