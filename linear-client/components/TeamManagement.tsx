import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { teamAPI, userAPI } from "../lib/api";
import { useApp } from "../lib/context";
import AddIcon from "./icons/Add";
import CrossIcon from "./icons/Cross";

export default function TeamManagement() {
  const router = useRouter();
  const { teams, currentTeam, setCurrentTeam } = useApp();
  const [teamList, setTeamList] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    identifier: "",
    description: "",
  });

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await teamAPI.getAll();
      setTeamList(res.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createTeam = async () => {
    if (!newTeam.name.trim() || !newTeam.identifier.trim()) return;
    try {
      await teamAPI.create(newTeam);
      setShowCreateModal(false);
      setNewTeam({ name: "", identifier: "", description: "" });
      await fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const switchTeam = (team: any) => {
    setCurrentTeam(team);
    router.push("/");
  };

  return (
    <div className="team-management">
      <div className="team-header">
        <h1>Teams</h1>
        <button
          className="create-team-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <AddIcon />
          New Team
        </button>
      </div>

      <div className="teams-list">
        {teamList.map((team) => (
          <div
            key={team._id}
            className={`team-card ${currentTeam?._id === team._id ? "active" : ""}`}
            onClick={() => switchTeam(team)}
          >
            <div className="team-icon">{team.identifier.substring(0, 2)}</div>
            <div className="team-info">
              <h3>{team.name}</h3>
              <p>{team.description || "No description"}</p>
              <span className="team-members-count">
                {team.members?.length || 0} members
              </span>
            </div>
            {currentTeam?._id === team._id && (
              <span className="current-team-badge">Current</span>
            )}
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Team</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <CrossIcon />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Team name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="modal-input"
                autoFocus
              />
              <input
                type="text"
                placeholder="Identifier (e.g., ENG)"
                value={newTeam.identifier}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, identifier: e.target.value.toUpperCase() })
                }
                className="modal-input"
                maxLength={3}
              />
              <textarea
                placeholder="Description"
                value={newTeam.description}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, description: e.target.value })
                }
                className="modal-textarea"
                rows={3}
              />
              <button onClick={createTeam} className="modal-submit-btn">
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

