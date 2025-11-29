import { useState, useEffect } from 'react';
import { Users, BarChart2, Lock, CheckCircle } from 'lucide-react';
import { CountingStrategy, Poll, PollResults } from '../types/poll';
import { pollApi } from '../api/pollApi';
import { VoteForm } from './VoteForm';
import { ResultsChart } from './ResultsChart';

interface PollDetailProps {
  pollId: string;
  onBack: () => void;
}

export function PollDetail({ pollId, onBack }: PollDetailProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [voteCount, setVoteCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    loadPollData();
  }, [pollId]);

  const loadPollData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pollData, count] = await Promise.all([
        pollApi.getPollById(pollId),
        pollApi.getVoteCount(pollId),
      ]);
      setPoll(pollData);
      setVoteCount(count);
    } catch (err) {
      setError('Failed to load poll data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetResults = async (strategy: CountingStrategy) => {
    try {
      const results = await pollApi.getResults(pollId, {
        votingStrategy: strategy
      });
      setResults(results);
      setShowResults(true)
    } catch (err) {
      setError('Failed to load Results: ' + err);
    }
  }

  const handleVoteSubmitted = () => {
    setHasVoted(true);
    loadPollData();
  };

  const handleClosePoll = async () => {
    if (!confirm('Are you sure you want to close this poll? This action cannot be undone.')) {
      return;
    }
    try {
      await pollApi.closePoll(pollId);
      loadPollData();
    } catch (err) {
      alert('Failed to close poll');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Poll not found'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-bold text-slate-900">{poll.title}</h2>
            {poll.closed ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <Lock className="w-4 h-4" />
                Closed
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Open
              </span>
            )}
          </div>
          <p className="text-slate-600 mb-4">{poll.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {voteCount} votes
            </span>
            <span>{poll.options.length} options</span>
          </div>
        </div>

        <div className="p-6">
          {!showResults && !poll.closed ? (
            <VoteForm poll={poll} onVoteSubmitted={handleVoteSubmitted} />
          ) : (
            <ResultsChart poll={poll} results={results || {}} totalVotes={voteCount} />
          )}
        </div>

        {dropdownOpen && (
          <div className="absolute mt-2 bg-white border border-slate-300 rounded shadow-lg z-10 w-48">
            {(poll.pollType === 'RANKED_CHOICE' ?
              [
                { label: 'Instant Runoff', value: 'INSTANT_RUNOFF' as CountingStrategy }
              ] : [
                { label: 'First Past The Post', value: 'FIRST_PAST_THE_POST' as CountingStrategy },
                { label: 'Weighted Counting', value: 'WEIGHTED_COUNTING' as CountingStrategy },
              ]
            ).map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleGetResults(option.value);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
          {!poll.closed && !showResults && (
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              <BarChart2 className="w-4 h-4" />
              View Results
            </button>
          )}
          {!poll.closed && showResults && (
            <button
              onClick={() => setShowResults(false)}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Vote
            </button>
          )}
          {!poll.closed && (
            <button
              onClick={handleClosePoll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium ml-auto"
            >
              <Lock className="w-4 h-4" />
              Close Poll
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
