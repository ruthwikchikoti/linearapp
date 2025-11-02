import { useState, useEffect } from "react";
import { cycleAPI } from "../lib/api";
import { useApp } from "../lib/context";
import AddIcon from "./icons/Add";
import CrossIcon from "./icons/Cross";

export default function CyclesView() {
  const { currentTeam } = useApp();
  const [cycles, setCycles] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCycle, setNewCycle] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // Handle create modal trigger from layout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOpenCreate = () => {
      // This is handled by the layout, but we can keep it for consistency
    };
    window.addEventListener("open-create-modal", handleOpenCreate);
    return () => window.removeEventListener("open-create-modal", handleOpenCreate);
  }, []);

  useEffect(() => {
    fetchCycles();
  }, [currentTeam]);

  const fetchCycles = async () => {
    try {
      const res = await cycleAPI.getAll(currentTeam ? { team: currentTeam._id } : {});
      setCycles(res.data || []);
    } catch (error) {
      console.error("Error fetching cycles:", error);
    }
  };

  const createCycle = async () => {
    if (!currentTeam || !newCycle.name.trim() || !newCycle.startDate || !newCycle.endDate)
      return;
    try {
      await cycleAPI.create({
        ...newCycle,
        team: currentTeam._id,
        startDate: new Date(newCycle.startDate),
        endDate: new Date(newCycle.endDate),
      });
      setShowCreateModal(false);
      setNewCycle({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      await fetchCycles();
    } catch (error) {
      console.error("Error creating cycle:", error);
    }
  };

  const isActive = (cycle: any) => {
    const now = new Date();
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="cycles-view">
      <div className="cycles-header">
        <h1>Cycles</h1>
        <button
          className="create-cycle-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <AddIcon />
          New Cycle
        </button>
      </div>

      <div className="cycles-list">
        {cycles.map((cycle) => (
          <div key={cycle._id} className="cycle-card">
            <div className="cycle-header">
              <h3>{cycle.name}</h3>
              {isActive(cycle) && <span className="cycle-active-badge">Active</span>}
            </div>
            {cycle.description && (
              <p className="cycle-description">{cycle.description}</p>
            )}
            <div className="cycle-dates">
              <span>
                {new Date(cycle.startDate).toLocaleDateString()} -{" "}
                {new Date(cycle.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="cycle-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${cycle.progress || 0}%` }}
                />
              </div>
              <span className="progress-text">{cycle.progress || 0}% complete</span>
            </div>
          </div>
        ))}
        {cycles.length === 0 && (
          <div className="empty-state">
            <p>No cycles yet. Create a sprint to get started!</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Cycle</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <CrossIcon />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Cycle name (e.g., Sprint 1)"
                value={newCycle.name}
                onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                className="modal-input"
                autoFocus
              />
              <textarea
                placeholder="Description"
                value={newCycle.description}
                onChange={(e) =>
                  setNewCycle({ ...newCycle, description: e.target.value })
                }
                className="modal-textarea"
                rows={3}
              />
              <div className="modal-row">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={newCycle.startDate}
                  onChange={(e) =>
                    setNewCycle({ ...newCycle, startDate: e.target.value })
                  }
                  className="modal-input"
                  required
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={newCycle.endDate}
                  onChange={(e) =>
                    setNewCycle({ ...newCycle, endDate: e.target.value })
                  }
                  className="modal-input"
                  required
                />
              </div>
              <button onClick={createCycle} className="modal-submit-btn">
                Create Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

