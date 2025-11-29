import { useState, useEffect } from 'react';
import { Plus, Users, CheckCircle, XCircle } from 'lucide-react';
import { Poll } from '../types/poll';
import { pollApi } from '../api/pollApi';

interface PollListProps {
  onSelectPoll: (pollId: string) => void;
  onCreatePoll: () => void;
  refreshTrigger: number;
}

export function PollList({ onSelectPoll, onCreatePoll, refreshTrigger }: PollListProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPolls();
  }, [refreshTrigger]);

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pollApi.listPolls();
      setPolls(data);
    } catch (err) {
      setError('Failed to load polls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">All Polls</h2>
        <button
          onClick={onCreatePoll}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Poll
        </button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500">No polls yet. Create your first poll!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <div
              key={poll.id}
              onClick={() => onSelectPoll(poll.id)}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">{poll.title}</h3>
                <div className="flex items-center gap-2">
                  {poll.closed ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                      <XCircle className="w-4 h-4" />
                      Closed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Open
                    </span>
                  )}
                </div>
              </div>
              <p className="text-slate-600 mb-3">{poll.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {poll.votes.length} votes
                </span>
                <span>{poll.options.length} options</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
