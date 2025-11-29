import { useState } from 'react';
import { Plus, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { CreatePollRequest, PollType } from '../types/poll';
import { pollApi } from '../api/pollApi';

interface CreatePollProps {
  onCancel: () => void;
  onCreated: () => void;
}

export function CreatePoll({ onCancel, onCreated }: CreatePollProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pollType, setPollType] = useState<PollType>('SINGLE_CHOICE');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restrictedIps, setRestrictedIps] = useState<string[]>(['']);
  const [timeLimit, setTimeLimit] = useState('');
  const [showTimeLimit, setShowTimeLimit] = useState(false);

  const handleAddRestrictedIp = () => {
    setRestrictedIps([...restrictedIps, '']);
  };

  const handleRemoveRestrictedIp = (index: number) => {
    setRestrictedIps(restrictedIps.filter((_, i) => i !== index));
  };

  const handleRestrictedIpChange = (index: number, value: string) => {
    const newRestrictedIps = [...restrictedIps];
    newRestrictedIps[index] = value;
    setRestrictedIps(newRestrictedIps);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validOptions = options.filter(opt => opt.trim() !== '');

    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a poll description');
      return;
    }
    if (validOptions.length < 2) {
      setError('Please enter at least 2 options');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const pollData: CreatePollRequest = {
        title: title.trim(),
        description: description.trim(),
        pollType,
        options: validOptions,
        restrictedIps: restrictedIps,
        endTime: showTimeLimit ? timeLimit : undefined
      };

      await pollApi.createPoll(pollData);
      onCreated();
    } catch (err) {
      setError('Failed to create poll. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Poll</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Poll Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter poll title"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your poll"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Poll Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="SINGLE_CHOICE"
                  checked={pollType === 'SINGLE_CHOICE'}
                  onChange={(e) => setPollType(e.target.value as PollType)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">Single Choice</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MULTIPLE_CHOICE"
                  checked={pollType === 'MULTIPLE_CHOICE'}
                  onChange={(e) => setPollType(e.target.value as PollType)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">Multiple Choice</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="RANKED_CHOICE"
                  checked={pollType === 'RANKED_CHOICE'}
                  onChange={(e) => setPollType(e.target.value as PollType)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">Ranked Choice</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Restricted IPs
            </label>
            <div className="space-y-3">
              {restrictedIps.map((ip, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => handleRestrictedIpChange(index, e.target.value)}
                    placeholder={`IP ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRestrictedIp(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddRestrictedIp}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Restricted IP
            </button>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Time Limit
            </label>
            {showTimeLimit && (
              <input
                type="datetime-local"
                id="time-limit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            )}

            <button
              type="button"
              onClick={() => setShowTimeLimit(!showTimeLimit)}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              {showTimeLimit ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              Set Time Limit
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
