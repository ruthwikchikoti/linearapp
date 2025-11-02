import { useState, useEffect } from "react";
import { projectAPI, ticketAPI } from "../lib/api";
import { useApp } from "../lib/context";
import AddIcon from "./icons/Add";
import CrossIcon from "./icons/Cross";

export default function ProjectsView() {
  const { currentTeam } = useApp();
  const [projects, setProjects] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: "#5E6AD2",
    status: "planned",
    startDate: "",
    targetDate: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [currentTeam]);

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll(currentTeam ? { team: currentTeam._id } : {});
      setProjects(res.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const createProject = async () => {
    if (!currentTeam || !newProject.name.trim()) return;
    try {
      await projectAPI.create({
        ...newProject,
        team: currentTeam._id,
        startDate: newProject.startDate ? new Date(newProject.startDate) : undefined,
        targetDate: newProject.targetDate ? new Date(newProject.targetDate) : undefined,
      });
      setShowCreateModal(false);
      setNewProject({
        name: "",
        description: "",
        color: "#5E6AD2",
        status: "planned",
        startDate: "",
        targetDate: "",
      });
      await fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      planned: "rgba(156, 39, 176, 0.2)",
      active: "rgba(33, 150, 243, 0.2)",
      paused: "rgba(255, 152, 0, 0.2)",
      completed: "rgba(76, 175, 80, 0.2)",
      cancelled: "rgba(158, 158, 158, 0.2)",
    };
    return colors[status] || colors.planned;
  };

  const getStatusTextColor = (status: string) => {
    const colors: any = {
      planned: "#9c27b0",
      active: "#2196f3",
      paused: "#ff9800",
      completed: "#4caf50",
      cancelled: "#9e9e9e",
    };
    return colors[status] || colors.planned;
  };

  return (
    <div className="projects-view">
      <div className="projects-header">
        <h1>Projects</h1>
        <button
          className="create-project-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <AddIcon />
          New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project._id}
            className="project-card"
            onClick={() => setSelectedProject(project._id)}
          >
            <div className="project-card-header">
              <div
                className="project-icon"
                style={{ backgroundColor: project.color || "#5E6AD2" }}
              >
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div className="project-info">
                <h3>{project.name}</h3>
                <span
                  className="project-status"
                  style={{
                    backgroundColor: getStatusColor(project.status),
                    color: getStatusTextColor(project.status),
                  }}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
            <div className="project-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
              <span className="progress-text">{project.progress || 0}% complete</span>
            </div>
            {project.targetDate && (
              <div className="project-date">
                Target: {new Date(project.targetDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <CrossIcon />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="modal-input"
                autoFocus
              />
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="modal-textarea"
                rows={3}
              />
              <div className="modal-row">
                <select
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
                  }
                  className="modal-select"
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
                <input
                  type="color"
                  value={newProject.color}
                  onChange={(e) =>
                    setNewProject({ ...newProject, color: e.target.value })
                  }
                  className="color-picker"
                />
              </div>
              <div className="modal-row">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, startDate: e.target.value })
                  }
                  className="modal-input"
                />
                <input
                  type="date"
                  placeholder="Target Date"
                  value={newProject.targetDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, targetDate: e.target.value })
                  }
                  className="modal-input"
                />
              </div>
              <button onClick={createProject} className="modal-submit-btn">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

