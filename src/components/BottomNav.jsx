import React from 'react';
import { Briefcase, PlaySquare, MessageSquare, BookOpen, User } from 'lucide-react';

export default function BottomNav({ activeTab, onChangeTab, t }) {
  const tabs = [
    {
      id: 'jobs',
      label: t.tabJobs,
      icon: Briefcase,
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #2563EB, #06B6D4)',
      bgLight: 'rgba(37, 99, 235, 0.12)',
      borderColor: 'rgba(37, 99, 235, 0.3)',
      inactiveColor: '#3B82F6'
    },
    {
      id: 'shorts',
      label: t.tabShorts,
      icon: PlaySquare,
      badge: 'HOT',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444, #F97316)',
      bgLight: 'rgba(239, 68, 68, 0.14)',
      borderColor: 'rgba(239, 68, 68, 0.35)',
      inactiveColor: '#F87171'
    },
    {
      id: 'charcha',
      label: t.tabCharcha,
      icon: MessageSquare,
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
      bgLight: 'rgba(139, 92, 246, 0.12)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      inactiveColor: '#A78BFA'
    },
    {
      id: 'books',
      label: t.tabBooks ? t.tabBooks.split('&')[0] : 'Books',
      icon: BookOpen,
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #14B8A6)',
      bgLight: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      inactiveColor: '#34D399'
    },
    {
      id: 'profile',
      label: t.tabProfile,
      icon: User,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B, #EA580C)',
      bgLight: 'rgba(245, 158, 11, 0.14)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      inactiveColor: '#FBBF24'
    }
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
              style={{
                color: isActive ? tab.color : 'var(--text-muted, #64748B)'
              }}
            >
              <div
                className="nav-icon-container"
                style={{
                  background: isActive ? tab.bgLight : 'transparent',
                  borderColor: isActive ? tab.borderColor : 'transparent',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.9}
                  color={isActive ? tab.color : tab.inactiveColor}
                />
                {tab.badge && (
                  <span
                    className="tab-pill-badge"
                    style={{
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
                      color: '#FFFFFF'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className="nav-label text-3xs"
                style={{
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? tab.color : 'var(--text-muted, #64748B)',
                  marginTop: '3px'
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="nav-active-dot"
                  style={{
                    background: tab.gradient,
                    width: '16px',
                    height: '3px',
                    borderRadius: '2px',
                    marginTop: '2px',
                    display: 'block'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
