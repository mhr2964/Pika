export type RoomStage =
  | 'welcome'
  | 'room-setup'
  | 'room-active'
  | 'room-outcome';

export type ReactionTone = 'hype' | 'side-eye' | 'locked-in';

export type RoomOption = {
  id: string;
  label: string;
  votes: number;
};

export type RoomParticipant = {
  id: string;
  name: string;
  reaction: string;
  tone: ReactionTone;
};

export type RoomActivity = {
  id: string;
  actor: string;
  message: string;
};

export type RoomState = {
  code: string;
  prompt: string;
  hostName: string;
  roundLabel: string;
  participants: RoomParticipant[];
  options: RoomOption[];
  activity: RoomActivity[];
  selectedOptionId: string | null;
  winningOptionId: string | null;
};