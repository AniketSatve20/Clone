import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userApi, verificationApi } from '../services/api';
import { User, Mail, Briefcase, Shield, Loader } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await userApi.getUser(user.address);
        setProfile(res.data.user);
        setFormData(res.data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    setVerifying(true);
    try {
      const res = await userApi.updateProfile(user.address, formData);
      setProfile(res.data.user);
      updateUser(res.data.user);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyKYC = async () => {
    setVerifying(true);
    try {
      const res = await verificationApi.initiateKYC({
        address: user.address,
        fullName: formData.name,
        email: formData.email,
      });
      setVerification(res.data);
    } catch (error) {
      console.error('Failed to verify KYC:', error);
    } finally {
      setVerifying(false);
    }
  };

  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary-light" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-dark-secondary bg-dark-primary/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost text-sm"
          >
            Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Avatar */}
            <div className="card p-6 space-y-4 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-light/20 to-accent-bright/20 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-primary-light" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{profile?.name || 'User'}</h2>
                <p className="text-sm text-gray-400 font-mono break-all">
                  {user.address}
                </p>
              </div>

              <div className="pt-4 space-y-2 border-t border-dark-secondary">
                {profile?.verified && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                    <Shield className="w-4 h-4" />
                    Verified
                  </div>
                )}
                {!profile?.verified && (
                  <div className="text-xs text-gray-400 text-center">
                    Not verified
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6 space-y-4 mt-4">
              <div>
                <p className="text-xs text-gray-400">Member Since</p>
                <p className="font-semibold">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Projects</p>
                <p className="font-semibold text-lg text-primary-light">
                  {profile?.projectsCount || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Completed</p>
                <p className="font-semibold text-lg text-green-400">
                  {profile?.completedCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h3>

              {!editing ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Full Name</p>
                    <p className="font-medium">{profile?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="font-medium">{profile?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Bio</p>
                    <p className="font-medium">{profile?.bio || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills && profile.skills.length > 0
                        ? profile.skills.map((skill: string) => (
                            <span key={skill} className="badge badge-secondary">
                              {skill}
                            </span>
                          ))
                        : <p className="text-gray-400">No skills added</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary w-full py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="input w-full resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={verifying}
                      className="btn-primary flex-1 py-2 rounded-lg"
                    >
                      {verifying ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(profile);
                      }}
                      className="btn-ghost flex-1 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Verification */}
            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification
              </h3>

              {verification ? (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                    <p className="text-green-400 font-semibold">KYC Verification Initiated</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Status: {verification.status}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Verify your identity to unlock premium features and build trust with clients.
                  </p>
                  <button
                    onClick={handleVerifyKYC}
                    disabled={verifying}
                    className="btn-primary w-full py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Initiating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Start KYC Verification
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Skills & Expertise
              </h3>

              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Add skills to your profile to help clients find you and build your reputation.
                </p>
                <button
                  onClick={() => navigate('/profile/skills')}
                  className="btn-outline w-full py-2 rounded-lg"
                >
                  Manage Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
