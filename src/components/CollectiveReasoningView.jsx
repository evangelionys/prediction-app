import React from 'react';
import { ChevronLeft, Plus, BrainCircuit } from 'lucide-react';

const CollectiveReasoningView = ({ prediction, onBack, onAddDriver, onUpdatePrediction }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Your Reasoning</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit size={20} className="text-cyan-600" />
            <h3 className="font-bold text-slate-900">Your Prediction</h3>
          </div>
          <div className={`text-2xl font-bold ${prediction === 'yes' ? 'text-cyan-600' : 'text-rose-600'}`}>
            {prediction?.toUpperCase() || 'Not Set'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <h3 className="font-bold text-slate-900 mb-3">Your Drivers</h3>
          <p className="text-sm text-gray-500 mb-4">Add drivers to support your prediction</p>
          <button
            onClick={onAddDriver}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-cyan-500 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Driver
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-bold text-slate-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-1">•</span>
              <span>Review community drivers to strengthen your reasoning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-1">•</span>
              <span>Explore opportunities related to your prediction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-1">•</span>
              <span>Engage in discussions with other predictors</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollectiveReasoningView;

