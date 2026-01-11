'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function GameModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const [breadScore, setBreadScore] = useState('');
    const [croissantScore, setCroissantScore] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            breadScore: parseInt(breadScore),
            croissantScore: parseInt(croissantScore),
            date: new Date().toISOString()
        });
        setBreadScore('');
        setCroissantScore('');
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content">
                <button onClick={onClose} className="close-btn">
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Record Game Result
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'var(--bread-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Bread
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={breadScore}
                                onChange={(e) => setBreadScore(e.target.value)}
                                className="score-input"
                                style={{ borderColor: 'var(--border-color)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold', color: '#6b7280', paddingTop: '1.5rem' }}>
                            VS
                        </div>
                        <div className="form-group" style={{ textAlign: 'right' }}>
                            <label style={{ display: 'block', color: 'var(--croissant-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Croissant
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={croissantScore}
                                onChange={(e) => setCroissantScore(e.target.value)}
                                className="score-input"
                                style={{ borderColor: 'var(--border-color)' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center', opacity: isSubmitting ? 0.5 : 1 }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Result'}
                    </button>
                </form>
            </div>
        </div>
    );
}
