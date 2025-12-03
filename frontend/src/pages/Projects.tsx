import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectApi } from '../services/api';
import { Search, Plus, Filter } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  skillsRequired: string[];
}

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await projectApi.getProjects(100);
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, navigate]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-dark-secondary bg-dark-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <button
            onClick={() => navigate('/projects/create')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="card p-6 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="input w-full pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="input bg-dark-secondary border-dark-secondary"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(search || filter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {search && (
                <div className="badge badge-primary">
                  Search: {search}
                  <button
                    onClick={() => setSearch('')}
                    className="ml-2 hover:opacity-75"
                  >
                    ✕
                  </button>
                </div>
              )}
              {filter !== 'all' && (
                <div className="badge badge-primary">
                  Status: {filter}
                  <button
                    onClick={() => setFilter('all')}
                    className="ml-2 hover:opacity-75"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No projects found</p>
            <button
              onClick={() => navigate('/projects/create')}
              className="btn-primary inline-block"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="card p-6 space-y-4 hover:border-primary-light/50 transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary-light transition-colors">
                    {project.title}
                  </h3>
                  <span className={`badge ${
                    project.status === 'open' ? 'badge-success' :
                    project.status === 'in-progress' ? 'badge-warning' :
                    'badge-secondary'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 line-clamp-2">
                  {project.description}
                </p>

                {/* Skills */}
                {project.skillsRequired && project.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired.slice(0, 3).map((skill) => (
                      <span key={skill} className="badge badge-secondary text-xs">
                        {skill}
                      </span>
                    ))}
                    {project.skillsRequired.length > 3 && (
                      <span className="badge badge-secondary text-xs">
                        +{project.skillsRequired.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-secondary">
                  <span className="text-lg font-bold text-primary-light">
                    ${project.budget}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
