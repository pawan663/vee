import React, { useState } from 'react';
import { sarkariHubData } from '../data/sarkariHubData';
import { ExternalLink, Bell, FileCheck, CheckCircle2, Award } from 'lucide-react';

export default function SarkariHubSection({ onSelectJobTitle }) {
  const [activeColumn, setActiveColumn] = useState('jobs'); // 'jobs' | 'admit' | 'results'

  return (
    <div className="sarkari-hub-wrapper mb-4">
      {/* 3-Tab Header Switcher for Mobile */}
      <div className="hub-tabs-row flex-between mb-2">
        <button
          className={`hub-tab-btn flex-1 ${activeColumn === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveColumn('jobs')}
        >
          <Bell size={13} /> Notifications ({sarkariHubData.jobNotifications.length})
        </button>
        <button
          className={`hub-tab-btn flex-1 ${activeColumn === 'admit' ? 'active' : ''}`}
          onClick={() => setActiveColumn('admit')}
        >
          <FileCheck size={13} /> Admit Card ({sarkariHubData.admitCards.length})
        </button>
        <button
          className={`hub-tab-btn flex-1 ${activeColumn === 'results' ? 'active' : ''}`}
          onClick={() => setActiveColumn('results')}
        >
          <Award size={13} /> Results ({sarkariHubData.results.length})
        </button>
      </div>

      {/* Column Display Container */}
      <div className="sarkari-hub-card">
        {/* Column 1: Job Notifications */}
        {activeColumn === 'jobs' && (
          <div className="hub-column-panel">
            <div className="hub-col-header bg-hub-blue">
              <h3 className="hub-col-title">Job Notifications</h3>
              <p className="hub-col-sub">Latest central and state government recruitment notifications with apply online links</p>
            </div>
            <ul className="hub-items-list">
              {sarkariHubData.jobNotifications.map((item, idx) => (
                <li key={idx} className="hub-item-row">
                  <span className="hub-bullet">•</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-link"
                    title={item.dept}
                  >
                    {item.title}
                  </a>
                  {item.badge && <span className="hub-badge-sm">{item.badge}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Column 2: Admit Card */}
        {activeColumn === 'admit' && (
          <div className="hub-column-panel">
            <div className="hub-col-header bg-hub-blue">
              <h3 className="hub-col-title">Admit Card</h3>
              <p className="hub-col-sub">Download hall tickets and call letters for upcoming government exams</p>
            </div>
            <ul className="hub-items-list">
              {sarkariHubData.admitCards.map((item, idx) => (
                <li key={idx} className="hub-item-row">
                  <span className="hub-bullet">•</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-link"
                    title={item.dept}
                  >
                    {item.title}
                  </a>
                  <span className={`hub-status-pill ${item.status.includes('Soon') ? 'status-soon' : 'status-live'}`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Column 3: Results */}
        {activeColumn === 'results' && (
          <div className="hub-column-panel">
            <div className="hub-col-header bg-hub-blue">
              <h3 className="hub-col-title">Results</h3>
              <p className="hub-col-sub">Check exam results, merit lists, and cut-off marks for Sarkari Naukri exams</p>
            </div>
            <ul className="hub-items-list">
              {sarkariHubData.results.map((item, idx) => (
                <li key={idx} className="hub-item-row">
                  <span className="hub-bullet">•</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-link"
                    title={item.dept}
                  >
                    {item.title}
                  </a>
                  <span className="hub-status-pill status-result">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
