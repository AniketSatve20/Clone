import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  createdAt: string;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary">+ New Project</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create your first project to get started!</p>
          <button className="btn btn-primary">Create Project</button>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <div className="project-details">
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Budget:</strong> ${project.budget}</p>
                <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="project-actions">
                <button className="btn btn-small">View</button>
                <button className="btn btn-small">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
