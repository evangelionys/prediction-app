import React, { useState } from 'react';
import { 
  ChevronLeft, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  FileText,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

const SettingsView = ({ onBack, onNavigate }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Handle logout logic here
      console.log('Logging out...');
      // You can add actual logout logic, e.g., clearing tokens, redirecting, etc.
    }
  };

  const handleNotifications = () => {
    // Open system settings (this would typically open native settings on mobile)
    // For web, we can show a message or try to open system settings
    if (navigator.userAgent.includes('Mobile')) {
      // On mobile, you might want to show instructions or use a deep link
      alert('Please go to your device Settings > Notifications to manage notification preferences.');
    } else {
      alert('Please go to your system Settings to manage notification preferences.');
    }
  };

  const SettingSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 px-4">
        {title}
      </h3>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ icon: Icon, title, subtitle, onClick, rightContent, showArrow = true }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
    >
      {Icon && <Icon size={20} className="text-slate-600 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900">{title}</div>
        {subtitle && (
          <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
        )}
      </div>
      {rightContent || (showArrow && <ChevronRight size={18} className="text-slate-400 shrink-0" />)}
    </button>
  );

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
        <h1 className="text-lg font-bold text-slate-900">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4">
          {/* Account Section */}
          <SettingSection title="Account">
            <SettingItem
              icon={User}
              title="Account Settings"
              subtitle="Edit account, delete account"
              onClick={() => onNavigate && onNavigate('account_settings')}
            />
          </SettingSection>

          {/* Notifications Section */}
          <SettingSection title="Notifications">
            <SettingItem
              icon={Bell}
              title="Notification Settings"
              subtitle="Manage notifications in system settings"
              onClick={handleNotifications}
            />
          </SettingSection>

          {/* Legal & Support Section */}
          <SettingSection title="Legal & Support">
            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onClick={() => console.log('Open privacy policy')}
              rightContent={<ExternalLink size={16} className="text-slate-400" />}
            />
            <SettingItem
              icon={FileText}
              title="Terms of Service"
              subtitle="Read our terms of service"
              onClick={() => console.log('Open terms of service')}
              rightContent={<ExternalLink size={16} className="text-slate-400" />}
            />
            <SettingItem
              icon={MessageSquare}
              title="Feedback"
              subtitle="Send us your feedback"
              onClick={() => console.log('Open feedback')}
            />
          </SettingSection>

          {/* Log Out */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
