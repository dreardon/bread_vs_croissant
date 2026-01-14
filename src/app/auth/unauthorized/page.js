'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ShieldAlert } from 'lucide-react';

function UnauthorizedContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'Your account';

    return (
        <div className="unauthorized-container">
            <div className="glass-panel unauthorized-card">
                <div className="unauthorized-icon">
                    <ShieldAlert size={64} color="var(--bread-color)" />
                </div>
                <h1>Access Denied</h1>
                <p className="unauthorized-message">
                    <span className="user-email">{email}</span> isn't allowed to administer this site.
                </p>
                <div className="unauthorized-actions">
                    <Link href="/" className="btn-primary">
                        Return to Dashboard
                    </Link>
                </div>
            </div>

            <style jsx>{`
        .unauthorized-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 300px);
          padding: 2rem;
        }
        .unauthorized-card {
          max-width: 500px;
          width: 100%;
          text-align: center;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .unauthorized-icon {
          margin-bottom: 0.5rem;
          animation: pulse 2s infinite;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
        }
        .unauthorized-message {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #aaa;
          margin: 0;
        }
        .user-email {
          color: var(--bread-color);
          font-weight: 600;
        }
        .unauthorized-actions {
          margin-top: 1rem;
          width: 100%;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}

export default function UnauthorizedPage() {
    return (
        <Suspense fallback={
            <div className="unauthorized-container">
                <div className="glass-panel unauthorized-card">
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <UnauthorizedContent />
        </Suspense>
    );
}
