import { useState, useEffect } from 'react';
import { PollList } from './components/PollList';
import { PollDetail } from './components/PollDetail';
import { CreatePoll } from './components/CreatePoll';
import { BarChart3 } from 'lucide-react';

function App() {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectPoll = (pollId: string) => {
    setSelectedPollId(pollId);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedPollId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreatePoll = () => {
    setView('create');
  };

  const handlePollCreated = () => {
    setView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Poll System</h1>
            </div>
            {view !== 'list' && (
              <button
                onClick={handleBackToList}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Back to Polls
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'list' && (
          <PollList
            onSelectPoll={handleSelectPoll}
            onCreatePoll={handleCreatePoll}
            refreshTrigger={refreshTrigger}
          />
        )}
        {view === 'detail' && selectedPollId && (
          <PollDetail pollId={selectedPollId} onBack={handleBackToList} />
        )}
        {view === 'create' && (
          <CreatePoll onCancel={handleBackToList} onCreated={handlePollCreated} />
        )}
      </main>
    </div>
  );
}

export default App;
