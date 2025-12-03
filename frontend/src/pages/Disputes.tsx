import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { disputeApi } from '../services/api';
import { AlertCircle, MessageSquare, Clock } from 'lucide-react';

interface Dispute {
  id: number;
  projectId: number;
  clientAddress: string;
  freelancerAddress: string;
  description: string;
  status: string;
  createdAt: string;
  resolution?: {
    verdict: string;
    confidence: number;
  };
}

export const Disputes: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchDisputes = async () => {
      try {
        const res = await disputeApi.getDisputes(100);
        setDisputes(res.data.disputes || []);
      } catch (error) {
        console.error('Failed to fetch disputes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [user, navigate]);

  const openDisputes = disputes.filter(d => d.status === 'open');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-dark-secondary bg-dark-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <h1 className="text-2xl font-bold">Disputes</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading disputes...</div>
        ) : (
          <div className="space-y-8">
            {/* Open Disputes */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold">
                  Open Disputes ({openDisputes.length})
                </h2>
              </div>

              {openDisputes.length === 0 ? (
                <div className="card p-12 text-center text-gray-400">
                  <p>No open disputes. All projects are going smoothly!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {openDisputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      onClick={() => navigate(`/disputes/${dispute.id}`)}
                      className="card p-6 border-l-4 border-orange-500 hover:border-orange-400 transition-colors cursor-pointer space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            Project #{dispute.projectId}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {dispute.description}
                          </p>
                        </div>
                        <span className="badge badge-warning whitespace-nowrap">
                          Open
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(dispute.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          View Details
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-dark-secondary">
                        <div className="text-xs text-gray-500">
                          Client: {dispute.clientAddress?.slice(0, 6)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          Freelancer: {dispute.freelancerAddress?.slice(0, 6)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Resolved Disputes */}
            {resolvedDisputes.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Resolved Disputes</h2>

                <div className="grid grid-cols-1 gap-4">
                  {resolvedDisputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      onClick={() => navigate(`/disputes/${dispute.id}`)}
                      className="card p-6 border-l-4 border-green-500 hover:border-green-400 transition-colors cursor-pointer space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            Project #{dispute.projectId}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {dispute.description}
                          </p>
                        </div>
                        <span className="badge badge-success whitespace-nowrap">
                          Resolved
                        </span>
                      </div>

                      {dispute.resolution && (
                        <div className="bg-dark-secondary p-4 rounded-lg space-y-2">
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold">Verdict:</span> {dispute.resolution.verdict}
                          </p>
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold">Confidence:</span> {(dispute.resolution.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(dispute.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
