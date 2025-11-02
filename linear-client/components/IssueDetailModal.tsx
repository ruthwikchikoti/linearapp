import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ticketAPI, commentAPI, labelAPI, projectAPI, cycleAPI, userAPI, uploadAPI } from "../lib/api";
import { useApp } from "../lib/context";
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
  const { user } = useApp();
  const [issue, setIssue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(0);
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
      const allComments = res.data || [];
      // Organize comments by parent (threading)
      setComments(allComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const organizeComments = (comments: any[]) => {
    // Normalize IDs to strings for comparison
    const normalizeId = (id: any): string => {
      if (!id) return '';
      if (typeof id === 'string') return id;
      if (typeof id === 'object' && id._id) return typeof id._id === 'string' ? id._id : id._id.toString();
      return id.toString();
    };
    
    // Separate parent comments (no parent) from all replies (have a parent)
    const parentComments = comments.filter((c) => {
      const parentId = normalizeId(c.parent);
      return !parentId || parentId === 'null' || parentId === 'undefined';
    });
    const allReplies = comments.filter((c) => {
      const parentId = normalizeId(c.parent);
      return parentId && parentId !== 'null' && parentId !== 'undefined';
    });
    
    // Function to recursively get all replies for a comment (handles nested replies)
    const getRepliesForComment = (commentId: string, replyList: any[]): any[] => {
      const directReplies = replyList.filter((r) => {
        const replyParentId = normalizeId(r.parent);
        return replyParentId === commentId;
      });
      
      // For each direct reply, also get its replies (nested)
      return directReplies.map((reply) => ({
        ...reply,
        replies: getRepliesForComment(normalizeId(reply._id), replyList),
      }));
    };
    
    return parentComments.map((parent) => {
      const parentId = normalizeId(parent._id);
      return {
        ...parent,
        replies: getRepliesForComment(parentId, allReplies),
      };
    });
  };

  const extractMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      const user = users.find((u) => u.name.toLowerCase().includes(username.toLowerCase()));
      if (user) {
        // Ensure we only push string IDs, not objects
        const userId = typeof user._id === 'object' ? (user._id as any).toString() : user._id;
        mentions.push(userId);
      }
    }
    return mentions;
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

  const handleAddComment = async (parentId?: string, commentText?: string) => {
    const text = commentText || newComment;
    if (!text.trim() || !issue) return;
    
    const mentions = extractMentions(text);
    
    // Get a valid author ID - use first user from users list (from database), or context user as fallback
    let authorId: string | undefined;
    
    // Prefer a real user from the database (users list) over the mock context user
    if (users.length > 0) {
      const firstUser = users[0];
      authorId = typeof firstUser._id === 'object' ? (firstUser._id as any).toString() : firstUser._id;
    } else if (user?._id && user._id !== "1") {
      // Fall back to context user if it's not the mock "1"
      authorId = typeof user._id === 'object' ? (user._id as any).toString() : user._id;
    }
    
    if (!authorId) {
      console.error("No valid author ID available. Cannot create comment. Please ensure users are loaded.");
      alert("Unable to create comment: No valid user found. Please refresh and try again.");
      return;
    }
    
    // Ensure we only send primitive values, not objects with circular references
    const teamId = typeof issue.team === 'object' && issue.team !== null 
      ? (issue.team as any)?._id || (issue.team as any)?.toString()
      : issue.team;
    
    try {
      await commentAPI.create({
        issue: typeof issue._id === 'object' ? (issue._id as any).toString() : issue._id,
        body: text.trim(),
        author: authorId,
        team: typeof teamId === 'object' ? (teamId as any).toString() : teamId,
        parent: parentId || undefined,
        mentions: mentions.length > 0 ? mentions.map(m => typeof m === 'object' ? (m as any).toString() : m) : undefined,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });
      
      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
        setUploadedFiles([]);
      }
      await loadComments();
      onUpdate();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentionPicker(true);
        setNewComment(value);
        return;
      }
    }
    
    setShowMentionPicker(false);
    setNewComment(value);
  };

  const handleReaction = async (commentId: string, emoji: string) => {
    // Get a valid user ID - use first user from users list (from database), or context user as fallback
    let userId: string | undefined;
    
    // Prefer a real user from the database (users list) over the mock context user
    if (users.length > 0) {
      const firstUser = users[0];
      userId = typeof firstUser._id === 'object' ? (firstUser._id as any).toString() : firstUser._id;
    } else if (user?._id && user._id !== "1") {
      // Fall back to context user if it's not the mock "1"
      userId = typeof user._id === 'object' ? (user._id as any).toString() : user._id;
    }
    
    if (!userId) {
      console.error("No valid user ID available. Cannot add reaction.");
      return;
    }
    
    // Check if user has already reacted to this comment with this emoji
    const comment = comments.find((c) => c._id === commentId) || 
                    comments.flatMap((c) => c.replies || []).find((r: any) => r._id === commentId);
    const existingReaction = comment?.reactions?.find((r: any) => r.emoji === emoji);
    const hasReacted = existingReaction?.users?.some((id: any) => {
      const idStr = typeof id === 'object' ? (id as any).toString() : id;
      return idStr === userId;
    });
    
    const action = hasReacted ? "remove" : "add";
    
    try {
      await commentAPI.addReaction(commentId, {
        emoji,
        userId,
        action,
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
                {organizeComments(comments).map((comment) => (
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
                      <button
                        className="issue-comment-reply"
                        onClick={() => setReplyingTo(comment._id)}
                      >
                        Reply
                      </button>
                    </div>
                    
                    {/* Threaded Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="issue-comment-replies">
                        {comment.replies.map((reply: any) => (
                          <div key={reply._id} className="issue-comment reply-comment">
                            <div className="issue-comment-header">
                              <div className="issue-comment-author">
                                <User />
                                <span>{reply.author?.name || "User"}</span>
                                <span className="issue-comment-date">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="issue-comment-body">{reply.body}</div>
                            <div className="issue-comment-reactions">
                              {reply.reactions?.map((reaction: any) => (
                                <button
                                  key={reaction.emoji}
                                  className="issue-comment-reaction"
                                  onClick={() => handleReaction(reply._id, reaction.emoji)}
                                >
                                  {reaction.emoji} {reaction.users?.length || 0}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                      <div className="issue-comment-reply-form">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="issue-modal-comment-input"
                          rows={2}
                        />
                        <div className="comment-actions">
                          <button
                            onClick={() => handleAddComment(comment._id, replyText)}
                            className="comment-submit-btn"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="comment-cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="issue-modal-add-comment">
                <div className="comment-input-wrapper">
                  <textarea
                    value={newComment}
                    onChange={handleCommentInput}
                    placeholder="Add a comment... (use @ to mention users)"
                    className="issue-modal-comment-input"
                    rows={3}
                  />
                  {showMentionPicker && (
                    <div className="mention-picker">
                      {users
                        .filter((u) =>
                          u.name.toLowerCase().includes(mentionQuery.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((user) => (
                          <div
                            key={user._id}
                            className="mention-item"
                            onClick={() => {
                              const beforeMention = newComment.substring(0, mentionPosition);
                              const afterCursor = newComment.substring(
                                mentionPosition + mentionQuery.length + 1
                              );
                              setNewComment(`${beforeMention}@${user.name} ${afterCursor}`);
                              setShowMentionPicker(false);
                            }}
                          >
                            <User />
                            <span>{user.name}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
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
                <button onClick={(e) => { e.preventDefault(); handleAddComment(); }} className="issue-modal-comment-button">
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

