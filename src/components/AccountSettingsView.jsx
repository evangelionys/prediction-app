import React, { useState } from 'react';
import { ChevronLeft, User, Mail, Trash2, AlertTriangle } from 'lucide-react';

const AccountSettingsView = ({ onBack }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [email, setEmail] = useState('user@example.com');
  const [username, setUsername] = useState('username');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving account changes...', { email, username });
    setIsEditing(false);
    // You can add actual save logic here
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log('Deleting account...');
    setShowDeleteConfirm(false);
    // You can add actual deletion logic here, e.g., API call, redirect, etc.
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Account Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          {/* Edit Account Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Account Information
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {/* Username */}
              <div className="px-4 py-3">
                <label className="text-xs text-slate-500 mb-1.5 block">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter username"
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-900">{username}</div>
                )}
              </div>

              {/* Email */}
              <div className="px-4 py-3">
                <label className="text-xs text-slate-500 mb-1.5 block">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter email"
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-900">{email}</div>
                )}
              </div>
            </div>

            {/* Edit/Save Button */}
            <div className="mt-4">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to original values if needed
                    }}
                    className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
                >
                  Edit Account
                </button>
              )}
            </div>
          </div>

          {/* Delete Account Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Danger Zone
            </h3>
            <div className="bg-white rounded-xl border border-red-200">
              <div className="px-4 py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 mb-1">Delete Account</div>
                    <div className="text-xs text-slate-500 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-600 shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Account</h3>
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsView;
