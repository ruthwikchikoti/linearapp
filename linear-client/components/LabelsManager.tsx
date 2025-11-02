import { useState, useEffect } from "react";
import { labelAPI } from "../lib/api";
import { useApp } from "../lib/context";
import AddIcon from "./icons/Add";
import CrossIcon from "./icons/Cross";

export default function LabelsManager() {
  const { currentTeam } = useApp();
  const [labels, setLabels] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLabel, setNewLabel] = useState({
    name: "",
    color: "#5E6AD2",
    description: "",
  });

  useEffect(() => {
    fetchLabels();
  }, [currentTeam]);

  const fetchLabels = async () => {
    try {
      const res = await labelAPI.getAll(currentTeam ? { team: currentTeam._id } : {});
      setLabels(res.data || []);
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };

  const createLabel = async () => {
    if (!currentTeam || !newLabel.name.trim()) return;
    try {
      await labelAPI.create({
        ...newLabel,
        team: currentTeam._id,
      });
      setShowCreateModal(false);
      setNewLabel({ name: "", color: "#5E6AD2", description: "" });
      await fetchLabels();
    } catch (error) {
      console.error("Error creating label:", error);
    }
  };

  const deleteLabel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this label?")) return;
    try {
      await labelAPI.delete(id);
      await fetchLabels();
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  return (
    <div className="labels-manager">
      <div className="labels-header">
        <h2>Labels</h2>
        <button
          className="create-label-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <AddIcon />
          New Label
        </button>
      </div>
      <div className="labels-grid">
        {labels.map((label) => (
          <div key={label._id} className="label-card">
            <div className="label-color-dot" style={{ backgroundColor: label.color }} />
            <div className="label-info">
              <h4>{label.name}</h4>
              {label.description && <p>{label.description}</p>}
            </div>
            <button
              onClick={() => deleteLabel(label._id)}
              className="label-delete-btn"
            >
              <CrossIcon />
            </button>
          </div>
        ))}
        {labels.length === 0 && (
          <div className="empty-state">No labels yet. Create one to organize issues!</div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Label</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <CrossIcon />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Label name"
                value={newLabel.name}
                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                className="modal-input"
                autoFocus
              />
              <textarea
                placeholder="Description"
                value={newLabel.description}
                onChange={(e) =>
                  setNewLabel({ ...newLabel, description: e.target.value })
                }
                className="modal-textarea"
                rows={2}
              />
              <div className="modal-row">
                <label>Color</label>
                <input
                  type="color"
                  value={newLabel.color}
                  onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                  className="color-picker"
                />
              </div>
              <button onClick={createLabel} className="modal-submit-btn">
                Create Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

