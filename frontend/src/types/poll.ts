export type PollType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'RANKED_CHOICE';
export type CountingStrategy = 'FIRST_PAST_THE_POST' | 'INSTANT_RUNOFF' | 'WEIGHTED_COUNTING'

export interface PollOption {
  id: string;
  text: string;
}

export interface Vote {
  username: string;
  ip: string;
  selected?: string[];
  ranked?: string[];
  weight?: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  pollType: PollType;
  options: PollOption[];
  closed: boolean;
  votes: Vote[];
}

export interface CreatePollRequest {
  title: string;
  description: string;
  pollType: PollType;
  options: string[];
  restrictedIps?: string[];
  endTime?: string;
}

export interface SubmitVoteRequest {
  username: string;
  ip: string;
  selected?: string[];
  ranked?: string[];
  weight?: number;
}

export interface GetResultsRequest {
  votingStrategy: 'FIRST_PAST_THE_POST' | 'INSTANT_RUNOFF' | 'WEIGHTED_COUNTING'
}

export interface PollResults {
  [optionId: string]: number;
}
