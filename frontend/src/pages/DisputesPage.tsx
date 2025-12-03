import React, { useState, useEffect } from 'react';

interface Dispute {
  id: string;
  projectName: string;
  status: string;
  reason: string;
  createdAt: string;
  resolution?: string;
}

export function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/disputes');
      if (!response.ok) throw new Error('Failed to fetch disputes');
      const data = await response.json();
      setDisputes(data.disputes || []);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page disputes-page">
      <div className="page-header">
        <h1>Disputes</h1>
        <button className="btn btn-primary">+ File Dispute</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading">Loading disputes...</p>
      ) : disputes.length === 0 ? (
        <div className="empty-state">
          <p>No disputes yet. Everything looks peaceful!</p>
        </div>
      ) : (
        <div className="disputes-list">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="dispute-card">
              <div className="dispute-header">
                <h3>{dispute.projectName}</h3>
                <span className={`status status-${dispute.status.toLowerCase()}`}>
                  {dispute.status}
                </span>
              </div>
              <div className="dispute-details">
                <p><strong>Reason:</strong> {dispute.reason}</p>
                <p><strong>Filed:</strong> {new Date(dispute.createdAt).toLocaleDateString()}</p>
                {dispute.resolution && (
                  <p><strong>Resolution:</strong> {dispute.resolution}</p>
                )}
              </div>
              <div className="dispute-actions">
                <button className="btn btn-small">View Details</button>
                {dispute.status === 'open' && (
                  <button className="btn btn-small btn-warning">Vote</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
