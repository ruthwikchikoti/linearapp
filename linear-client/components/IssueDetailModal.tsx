import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ticketAPI, commentAPI, labelAPI, projectAPI, cycleAPI, userAPI, uploadAPI } from "../lib/api";
import User from "./icons/User";
import CrossIcon from "./icons/Cross";
import FileUpload from "./FileUpload";

interface IssueDetailModalProps {
  issueId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function IssueDetailModal({
  issueId,
  isOpen,
  onClose,
  onUpdate,
}: IssueDetailModalProps) {
  const [issue, setIssue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [labels, setLabels] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen && issueId) {
      loadIssue();
      loadComments();
    }
  }, [isOpen, issueId]);

  useEffect(() => {
    if (issue) {
      loadOptions();
    }
  }, [issue]);

  // Reset uploaded files when modal closes or issue changes
  useEffect(() => {
    if (!isOpen || !issueId) {
      setUploadedFiles([]);
      setUploading(false);
    }
  }, [isOpen, issueId]);

  const loadIssue = async () => {
    try {
      const res = await ticketAPI.getById(issueId!);
      setIssue(res.data);
    } catch (error) {
      console.error("Error loading issue:", error);
    }
  };

  const loadComments = async () => {
    try {
      const res = await commentAPI.getAll({ issue: issueId });
      setComments(res.data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadOptions = async () => {
    if (!issue) return;
    try {
      const [labelsRes, projectsRes, cyclesRes, usersRes] = await Promise.all([
        labelAPI.getAll({ team: issue?.team?._id }),
        projectAPI.getAll({ team: issue?.team?._id }),
        cycleAPI.getAll({ team: issue?.team?._id }),
        userAPI.getAll(),
      ]);
      setLabels(labelsRes.data || []);
      setProjects(projectsRes.data || []);
      setCycles(cyclesRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error("Error loading options:", error);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    if (!issue) return;
    try {
      const updateData: any = { [field]: value };
      
      // Handle date conversion
      if (field === "dueDate" && value) {
        updateData[field] = new Date(value);
      } else if (field === "dueDate" && !value) {
        updateData[field] = null;
      }
      
      // Handle empty string to null for optional fields
      if (value === "" && (field === "assignee" || field === "project" || field === "cycle")) {
        updateData[field] = null;
      }
      
      await ticketAPI.update(issue._id, updateData);
      await loadIssue();
      onUpdate();
      setEditingField(null);
    } catch (error) {
      console.error("Error updating issue:", error);
      alert("Failed to update issue. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !issue) return;
    try {
      await commentAPI.create({
        issue: issue._id,
        body: newComment,
        author: "1", // Mock user ID
        team: issue.team?._id,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });
      setNewComment("");
      setUploadedFiles([]);
      await loadComments();
      onUpdate();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReaction = async (commentId: string, emoji: string) => {
    try {
      await commentAPI.addReaction(commentId, {
        emoji,
        userId: "1",
        action: "add",
      });
      await loadComments();
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="issue-modal-overlay" onClick={onClose}>
      <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
        <div className="issue-modal-header">
          <div className="issue-modal-title-row">
            {editingField === "title" ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => {
                  handleUpdate("title", editValue);
                  setEditingField(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdate("title", editValue);
                    setEditingField(null);
                  }
                  if (e.key === "Escape") {
                    setEditingField(null);
                  }
                }}
                className="issue-modal-title-input"
                autoFocus
              />
            ) : (
              <h2
                className="issue-modal-title"
                onClick={() => {
                  setEditValue(issue.title);
                  setEditingField("title");
                }}
              >
                {issue.title}
              </h2>
            )}
          </div>
          <button onClick={onClose} className="issue-modal-close">
            <CrossIcon />
          </button>
        </div>

        <div className="issue-modal-body">
          <div className="issue-modal-main">
            {/* Attachments */}
            {issue.attachments && issue.attachments.length > 0 && (
              <div className="issue-modal-section">
                <h3 className="issue-modal-section-title">Attachments</h3>
                <div className="issue-modal-attachments">
                  {issue.attachments.map((url: string, index: number) => (
                    <div key={index} className="issue-attachment">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                        📎 {url.split("/").pop()}
                      </a>
                      <button
                        onClick={async () => {
                          if (issue) {
                            const updated = issue.attachments.filter((_: any, i: number) => i !== index);
                            await ticketAPI.update(issue._id, { attachments: updated });
                            await loadIssue();
                            onUpdate();
                          }
                        }}
                        className="attachment-remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="issue-modal-section">
              <h3 className="issue-modal-section-title">Description</h3>
              {editingField === "description" ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    handleUpdate("description", editValue);
                    setEditingField(null);
                  }}
                  className="issue-modal-description-input"
                  autoFocus
                />
              ) : (
                <div
                  className="issue-modal-description"
                  onClick={() => {
                    setEditValue(issue.description || "");
                    setEditingField("description");
                  }}
                >
                  {issue.description ? (
                    <ReactMarkdown>{issue.description}</ReactMarkdown>
                  ) : (
                    <span style={{ color: "#858699" }}>Add description...</span>
                  )}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="issue-modal-section">
              <h3 className="issue-modal-section-title">Comments</h3>
              <div className="issue-modal-comments">
                {comments.map((comment) => (
                  <div key={comment._id} className="issue-comment">
                    <div className="issue-comment-header">
                      <div className="issue-comment-author">
                        <User />
                        <span>{comment.author?.name || "User"}</span>
                        <span className="issue-comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="issue-comment-body">{comment.body}</div>
                    <div className="issue-comment-reactions">
                      {comment.reactions?.map((reaction: any) => (
                        <button
                          key={reaction.emoji}
                          className="issue-comment-reaction"
                          onClick={() => handleReaction(comment._id, reaction.emoji)}
                        >
                          {reaction.emoji} {reaction.users?.length || 0}
                        </button>
                      ))}
                      <button
                        className="issue-comment-add-reaction"
                        onClick={() => handleReaction(comment._id, "👍")}
                      >
                        + Add reaction
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="issue-modal-add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="issue-modal-comment-input"
                  rows={3}
                />
                <FileUpload
                  onUpload={async (files) => {
                    if (files.length === 0) return;
                    setUploading(true);
                    try {
                      const formData = new FormData();
                      files.forEach((file) => {
                        formData.append("files", file);
                      });
                      const res = await uploadAPI.uploadFiles(formData);
                      const fileUrls = res.data.files || [];
                      
                      // Add to uploaded files for this comment
                      setUploadedFiles((prev) => [...prev, ...fileUrls]);
                      
                      // Also update issue with attachments if issue exists
                      if (issue) {
                        const currentAttachments = issue.attachments || [];
                        await ticketAPI.update(issue._id, {
                          attachments: [...currentAttachments, ...fileUrls],
                        });
                        await loadIssue();
                        onUpdate();
                      }
                    } catch (error) {
                      console.error("Error uploading files:", error);
                      alert("Failed to upload files. Please try again.");
                    } finally {
                      setUploading(false);
                    }
                  }}
                  multiple
                />
                {uploading && <div className="upload-status">Uploading files...</div>}
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-preview">
                    {uploadedFiles.map((url, idx) => (
                      <span key={idx} className="uploaded-file-tag">
                        📎 {url.split("/").pop()}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={handleAddComment} className="issue-modal-comment-button">
                  Comment
                </button>
              </div>
            </div>
          </div>

          <div className="issue-modal-sidebar">
            {/* Status */}
            <div className="issue-modal-field">
              <label>Status</label>
              <select
                value={issue.status}
                onChange={(e) => handleUpdate("status", e.target.value)}
                className="issue-modal-select"
              >
                <option value="TODO">Todo</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="IN_DEV_REVIEW">In Dev Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="issue-modal-field">
              <label>Priority</label>
              <select
                value={issue.priority}
                onChange={(e) => handleUpdate("priority", e.target.value)}
                className="issue-modal-select"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="issue-modal-field">
              <label>Assignee</label>
              <select
                value={issue.assignee?._id || ""}
                onChange={(e) => handleUpdate("assignee", e.target.value || null)}
                className="issue-modal-select"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div className="issue-modal-field">
              <label>Project</label>
              <select
                value={issue.project?._id || ""}
                onChange={(e) => handleUpdate("project", e.target.value || null)}
                className="issue-modal-select"
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cycle */}
            <div className="issue-modal-field">
              <label>Cycle</label>
              <select
                value={issue.cycle?._id || ""}
                onChange={(e) => handleUpdate("cycle", e.target.value || null)}
                className="issue-modal-select"
              >
                <option value="">No Cycle</option>
                {cycles.map((cycle) => (
                  <option key={cycle._id} value={cycle._id}>
                    {cycle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="issue-modal-field">
              <label>Due Date</label>
              <input
                type="date"
                value={issue.dueDate ? new Date(issue.dueDate).toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  handleUpdate("dueDate", e.target.value ? new Date(e.target.value) : null)
                }
                className="issue-modal-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

