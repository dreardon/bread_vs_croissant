'use client';

import { useState, useEffect } from 'react';
import { ChartPie, Trophy, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { WinPieChart, HistoryLineChart, CumulativeStackedBarChart } from '@/components/DashboardCharts';
import GameModal from '@/components/GameModal';

const Whistle = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 10H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h13.5a2.5 2 0 0 0 2.5-2.5v-3a2.5 2.5 0 0 0-2.5-2.5z" />
    <path d="M18 10l3-3" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    <circle cx="10" cy="14" r="1" />
  </svg>
);

export default function Home() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    breadWins: 0,
    croissantWins: 0,
    totalGames: 0,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/games');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleGameSubmit(gameData) {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });

      if (res.ok) {
        await fetchStats();
        setIsModalOpen(false);
      } else {
        alert('Failed to save game');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving game');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRecordClick = () => {
    setIsModalOpen(true);
  };

  const playWhistle = () => {
    const audio = new Audio('/sounds/whistle.mp3');
    audio.play().catch(e => console.error("Error playing audio:", e));
  };

  return (
    <div className="dashboard-col" style={{ position: 'relative' }}>
      <button
        onClick={playWhistle}
        className="whistle-btn"
        aria-label="Play referee whistle"
        title="Play referee whistle"
      >
        <Whistle size={20} />
      </button>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <h3 className="stat-label">Total Games</h3>
          <span className="stat-value">
            {loading ? '-' : stats.totalGames}
          </span>
        </div>
        <div className="glass-panel stat-card" style={{ borderBottom: '4px solid var(--bread-color)' }}>
          <h3 className="stat-label" style={{ color: 'var(--bread-color)' }}>Bread Wins</h3>
          <span className="stat-value">
            {loading ? '-' : stats.breadWins}
          </span>
        </div>
        <div className="glass-panel stat-card" style={{ borderBottom: '4px solid var(--croissant-color)' }}>
          <h3 className="stat-label" style={{ color: 'var(--croissant-color)' }}>Croissant Wins</h3>
          <span className="stat-value">
            {loading ? '-' : stats.croissantWins}
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <ChartPie size={20} className="text-[var(--accent-color)]" style={{ color: 'var(--accent-color)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Win Distribution</h2>
          </div>
          <div className="chart-container">
            <WinPieChart breadWins={stats.breadWins} croissantWins={stats.croissantWins} />
          </div>
        </div>
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <Trophy size={20} className="text-[var(--accent-color)]" style={{ color: 'var(--accent-color)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent History</h2>
          </div>
          <div className="chart-container">
            <HistoryLineChart history={stats.history} />
          </div>
        </div>
      </div>

      {/* New Row for Cumulative Chart */}
      <div className="glass-panel chart-card" style={{ marginTop: '2rem' }}>
        <div className="chart-header">
          <Trophy size={20} className="text-[var(--accent-color)]" style={{ color: 'var(--accent-color)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cumulative Weekly Points</h2>
        </div>
        <div className="chart-container">
          <CumulativeStackedBarChart history={stats.history} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fab-container">
        {session ? (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => signOut()}
              className="btn-primary"
              style={{ padding: '12px', background: 'var(--card-bg)' }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <button
              onClick={handleRecordClick}
              className="btn-primary"
            >
              <span style={{ fontSize: '1.25rem' }}>+</span> Record Game
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="btn-google"
          >
            <svg viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Sign in with Google
          </button>
        )}
      </div>

      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGameSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
