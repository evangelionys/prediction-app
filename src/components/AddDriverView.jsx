import React, { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';

const AddDriverView = ({ onBack, onSubmit }) => {
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState('');
  const [side, setSide] = useState('yes');
  const [strength, setStrength] = useState('Medium');

  const handleSubmit = () => {
    if (claim.trim() && evidence.trim()) {
      // In a real app, this would save to backend
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Add Driver</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Which side does this support?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSide('yes')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                side === 'yes' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setSide('no')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                side === 'no' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Claim
          </label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Enter your claim..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={3}
          />
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Evidence
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Provide evidence or source..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={4}
          />
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Confidence Level
          </label>
          <select
            value={strength}
            onChange={(e) => setStrength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!claim.trim() || !evidence.trim()}
          className="w-full bg-black text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Submit Driver
        </button>
      </div>
    </div>
  );
};

export default AddDriverView;

