import React from 'react';
import { ChevronLeft, List } from 'lucide-react';

const GenericListView = ({ title, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">{title}</span>
      </div>
      <div className="p-8 text-center text-slate-500">
        <List size={48} className="mx-auto mb-4 text-slate-300" />
        <p>List of {title} will appear here.</p>
      </div>
    </div>
  );
};

export default GenericListView;

