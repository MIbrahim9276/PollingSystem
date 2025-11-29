import { Poll, CreatePollRequest, SubmitVoteRequest, PollResults, GetResultsRequest } from '../types/poll';

const API_BASE_URL = 'http://localhost:8080';

export const pollApi = {
  async createPoll(data: CreatePollRequest): Promise<Poll> {
    const response = await fetch(`${API_BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create poll');
    return response.json();
  },

  async listPolls(): Promise<Poll[]> {
    const response = await fetch(`${API_BASE_URL}/polls`);
    if (!response.ok) throw new Error('Failed to fetch polls');
    return response.json();
  },

  async getPollById(id: string): Promise<Poll> {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`);
    if (!response.ok) throw new Error('Failed to fetch poll');
    return response.json();
  },

  async closePoll(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to close poll');
  },

  async submitVote(pollId: string, data: SubmitVoteRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit vote');
  },

  async getVoteCount(pollId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/votes`);
    if (!response.ok) throw new Error('Failed to fetch vote count');
    return response.json();
  },

  async getResults(pollId: string, data: GetResultsRequest): Promise<PollResults> {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to fetch results');
    return response.json();
  },
};
