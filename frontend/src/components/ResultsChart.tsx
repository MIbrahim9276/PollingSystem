import { Poll, PollResults } from '../types/poll';

interface ResultsChartProps {
  poll: Poll;
  results: PollResults;
  totalVotes: number;
}

export function ResultsChart({ poll, results, totalVotes }: ResultsChartProps) {
  const getPercentage = (optionId: string) => {
    if (totalVotes === 0) return 0;
    const votes = results[optionId] || 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getVoteCount = (optionId: string) => {
    return results[optionId] || 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Results</h3>
      {poll.options.map((option) => {
        const percentage = getPercentage(option.id);
        const votes = getVoteCount(option.id);

        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-medium">{option.text}</span>
              <span className="text-slate-600 text-sm">
                {votes} {votes === 1 ? 'vote' : 'votes'} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
      {totalVotes === 0 && (
        <p className="text-center text-slate-500 py-4">No votes yet</p>
      )}
    </div>
  );
}
