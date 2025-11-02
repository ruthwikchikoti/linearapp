import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { ticketAPI, projectAPI, userAPI } from "../lib/api";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIssue?: () => void;
  onApplyFilter?: (filterType: string, value: string) => void;
  onOpenIssue?: (issueId: string) => void;
  onNavigateToProject?: (projectId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onCreateIssue, onApplyFilter, onOpenIssue, onNavigateToProject }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tickets, setTickets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      fetchData();
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    filterItems();
  }, [query, tickets, projects, users]);

  const fetchData = async () => {
    try {
      const [ticketsRes, projectsRes, usersRes] = await Promise.all([
        ticketAPI.getAll({ search: query }),
        projectAPI.getAll(),
        userAPI.getAll(),
      ]);
      setTickets(ticketsRes.data || []);
      setProjects(projectsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterItems = () => {
    const filtered: CommandItem[] = [];

    // Actions
    filtered.push({
      id: "create-issue",
      title: "Create new issue",
      subtitle: "Create a new issue",
      category: "Actions",
      action: () => {
        onCreateIssue?.();
        onClose();
      },
    });

    // Filter by assignee
    if (query.startsWith("assignee:")) {
      const assigneeQuery = query.replace("assignee:", "").trim();
      users
        .filter((u) => u.name.toLowerCase().includes(assigneeQuery.toLowerCase()))
        .forEach((user) => {
          filtered.push({
            id: `filter-assignee-${user._id}`,
            title: `Filter by ${user.name}`,
            subtitle: `Show issues assigned to ${user.name}`,
            category: "Filters",
            action: () => {
              onApplyFilter?.("assignee", user._id);
              onClose();
            },
          });
        });
    }

    // Filter by status
    if (query.startsWith("status:")) {
      const statusQuery = query.replace("status:", "").trim().toUpperCase();
      const statuses = ["TODO", "INPROGRESS", "IN_DEV_REVIEW", "DONE"].filter(
        (s) => s.includes(statusQuery) || statusQuery === ""
      );
      statuses.forEach((status) => {
        filtered.push({
          id: `filter-status-${status}`,
          title: `Filter by ${status}`,
          subtitle: `Show ${status} issues`,
          category: "Filters",
          action: () => {
            onApplyFilter?.("status", status);
            onClose();
          },
        });
      });
    }

    // Filter by label
    if (query.startsWith("label:")) {
      const labelQuery = query.replace("label:", "").trim();
      // Note: labels would need to be fetched separately
      filtered.push({
        id: "filter-label-help",
        title: "Use label filter dropdown in main view",
        subtitle: "Label filtering available in main filters",
        category: "Filters",
        action: () => onClose(),
      });
    }

    // Issues
    if (!query.startsWith("assignee:") && !query.startsWith("status:") && !query.startsWith("label:")) {
      tickets
        .filter((t) => 
          t.title?.toLowerCase().includes(query.toLowerCase()) ||
          t.issueId?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .forEach((ticket) => {
          filtered.push({
            id: `issue-${ticket._id}`,
            title: ticket.title,
            subtitle: ticket.issueId,
            category: "Issues",
            action: () => {
              onOpenIssue?.(ticket._id);
              onClose();
            },
          });
        });
    }

    // Projects
    if (!query.startsWith("assignee:") && !query.startsWith("status:") && !query.startsWith("label:")) {
      projects
        .filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach((project) => {
          filtered.push({
            id: `project-${project._id}`,
            title: project.name,
            subtitle: "Project",
            category: "Projects",
            action: () => {
              onNavigateToProject?.(project._id);
              onClose();
            },
          });
        });
    }

    setItems(filtered);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  let itemIndex = 0;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-header">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="command-palette-input"
          />
        </div>
        <div className="command-palette-results">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="command-palette-category">
              <div className="command-palette-category-title">{category}</div>
              {categoryItems.map((item) => {
                const isSelected = itemIndex === selectedIndex;
                itemIndex++;
                return (
                  <div
                    key={item.id}
                    className={`command-palette-item ${isSelected ? "selected" : ""}`}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(itemIndex - 1)}
                  >
                    <div className="command-palette-item-title">{item.title}</div>
                    {item.subtitle && (
                      <div className="command-palette-item-subtitle">{item.subtitle}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {items.length === 0 && (
            <div className="command-palette-empty">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}

