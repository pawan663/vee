import React from 'react';
import { Briefcase, PlaySquare, MessageSquare, BookOpen, User } from 'lucide-react';

export default function BottomNav({ activeTab, onChangeTab, t }) {
  const tabs = [
    { id: 'jobs', label: t.tabJobs, icon: Briefcase },
    { id: 'shorts', label: t.tabShorts, icon: PlaySquare, badge: 'HOT' },
    { id: 'charcha', label: t.tabCharcha, icon: MessageSquare },
    { id: 'books', label: t.tabBooks.split('&')[0], icon: BookOpen },
    { id: 'profile', label: t.tabProfile, icon: User }
  ];

  return (
    <nav className="bottom-navigation-bar">
      <div className="bottom-nav-inner flex-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onChangeTab(tab.id)}
            >
              <div className="nav-icon-container">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.badge && <span className="tab-pill-badge">{tab.badge}</span>}
              </div>
              <span className="nav-label text-3xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
