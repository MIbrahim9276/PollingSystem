import { useState } from 'react';
import { Send } from 'lucide-react';
import { Poll } from '../types/poll';
import { pollApi } from '../api/pollApi';
import { Reorder } from 'motion/react';

interface VoteFormProps {
  poll: Poll;
  onVoteSubmitted: () => void;
}

export function VoteForm({ poll, onVoteSubmitted }: VoteFormProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(() =>
    poll.pollType === 'RANKED_CHOICE' ? poll.options.map(o => o.id) : []
  );
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSingleChoice = poll.pollType === 'SINGLE_CHOICE';
  const isRankedChoice = poll.pollType === 'RANKED_CHOICE';

  const handleOptionToggle = (optionId: string) => {
    if (isSingleChoice) {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRankedChoice && selectedOptions.length === 0) {
      setError('Please select at least one option');
      return;
    }

    if (isRankedChoice && selectedOptions.length !== poll.options.length) {
      setError('All options must be ranked');
      return;
    }
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await pollApi.submitVote(poll.id, {
        username: username.trim(),
        ip: '0.0.0.0',
        selected: isRankedChoice ? undefined : selectedOptions,
        ranked: isRankedChoice ? selectedOptions : undefined,
      });
      onVoteSubmitted();
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          {isRankedChoice
            ? 'Rank the options by preference:'
            : isSingleChoice
            ? 'Select one option:'
            : 'Select one or more options:'}
        </label>
        
        {isRankedChoice ? (
          <Reorder.Group values={selectedOptions} onReorder={setSelectedOptions} as='ol' className='space-y-2'>
            {selectedOptions.map((optionId, index) => {
              const option = poll.options.find(o => o.id === optionId);
              if (!option) return null;

              return (
                <Reorder.Item key={optionId} value={optionId}>
                  <div
                    key={optionId}
                    className="flex items-center gap-3 p-4 border rounded-lg bg-white"
                  >
                    <span className="flex-1 text-slate-900 font-medium">{index + 1}. {option.text}</span>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div className="space-y-2">
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedOptions.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type={isSingleChoice ? 'radio' : 'checkbox'}
                  name="poll-option"
                  value={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-900 font-medium">{option.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
          Your Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || selectedOptions.length === 0 || !username.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Submitting...' : 'Submit Vote'}
      </button>
    </form>
  );
}
