import { DefaultEventsMap } from "@socket.io/component-emitter";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import IssueIcon from "../components/icons/issue-icon";
import SearchIcon from "../components/icons/search-icon";
import InboxIcon from "../components/icons/inbox";
import MyIssue from "../components/icons/MyIssue";
import RoadmapIcon from "../components/icons/Roadmap";
import ViewIcon from "../components/icons/View";
import StarIcon from "../components/icons/Star";
import Todo from "../components/icons/todo";
import AddIcon from "../components/icons/Add";
import InprogressIcon from "../components/icons/Inprogress";
import DoneIcon from "../components/icons/Done";
import IndevReview from "../components/icons/Indevreview";
import User from "../components/icons/User";
import HomeIcon from "../components/icons/Home";
import CrossIcon from "../components/icons/Cross";
import CommandPalette from "../components/CommandPalette";
import IssueDetailModal from "../components/IssueDetailModal";
import SidebarToggle from "../components/SidebarToggle";
import { AppProvider, useApp } from "../lib/context";
import { ticketAPI, projectAPI, cycleAPI, labelAPI, activityAPI, userAPI } from "../lib/api";

const server = process.env.NEXT_PUBLIC_SERVER_URL || "https://linear-server.onrender.com";
var socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const columnList = [
  { name: "Todo", icon: Todo, value: "TODO" },
  { name: "In Progress", icon: InprogressIcon, value: "INPROGRESS" },
  { name: "In Dev Review", icon: IndevReview, value: "IN_DEV_REVIEW" },
  { name: "Done", icon: DoneIcon, value: "DONE" },
];

function HomeContent() {
  const router = useRouter();
  const { currentTeam } = useApp();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState({
    assignee: "",
    status: "",
    priority: "",
    label: "",
    project: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [todo, setTodo] = useState<any[]>([]);
  const [inprogress, setInProgress] = useState<any[]>([]);
  const [indev, setIndev] = useState<any[]>([]);
  const [done, setDone] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const filterTicket = [todo, inprogress, indev, done];
  const [currentTicket, setCurrentTicket] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assignee: "",
    project: "",
    cycle: "",
    dueDate: "",
    labels: [] as string[],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchAllData();
    setupSocket();
    setupKeyboardShortcuts();
  }, [currentTeam, filters, sortBy, sortOrder]);

  const setupKeyboardShortcuts = () => {
    if (typeof window === 'undefined') return;

    // Listen for custom events from AppLayout keyboard shortcuts
    const handleOpenCreate = () => setShowCreateModal(true);

    // Handle Escape key for closing modals
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCommandPalette(false);
        setShowCreateModal(false);
        setShowIssueModal(false);
      }
    };

    window.addEventListener("open-create-modal", handleOpenCreate);
    window.addEventListener("keydown", handleEscape);

    // Cleanup
    return () => {
      window.removeEventListener("open-create-modal", handleOpenCreate);
      window.removeEventListener("keydown", handleEscape);
    };
  };

  const setupSocket = () => {
    socket = io(server);
    if (currentTeam) {
      socket.emit("current-team", currentTeam._id);
    }
    socket.on("recieved-update-ticket", ({ prevStatus, receiveData }: any) => {
      handleTicketUpdate(prevStatus, receiveData);
    });
    socket.on("recieved-ticket", (receiveData: any) => {
      handleNewTicket(receiveData);
    });
    socket.on("comment-created", () => {
      if (showIssueModal) fetchAllData();
    });
    return () => socket.disconnect();
  };

  const fetchAllData = async () => {
    try {
      const params: any = {};
      if (currentTeam) params.team = currentTeam._id;
      if (filters.assignee) params.assignee = filters.assignee;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.project) params.project = filters.project;
      if (filters.label) params.label = filters.label;
      if (filters.search) params.search = filters.search;
      params.sortBy = sortBy;
      params.order = sortOrder;

      const [ticketsRes, projectsRes, cyclesRes, labelsRes, usersRes, activitiesRes] =
        await Promise.all([
          ticketAPI.getAll(params),
          projectAPI.getAll(currentTeam ? { team: currentTeam._id } : {}),
          cycleAPI.getAll(currentTeam ? { team: currentTeam._id } : {}),
          labelAPI.getAll(currentTeam ? { team: currentTeam._id } : {}),
          userAPI.getAll(),
          activityAPI.getAll({ team: currentTeam?._id }),
        ]);

      const tickets = ticketsRes.data || [];
      organizeTickets(tickets);
      setProjects(projectsRes.data || []);
      setCycles(cyclesRes.data || []);
      setLabels(labelsRes.data || []);
      setUsers(usersRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const organizeTickets = (tickets: any[]) => {
    const organized: { [key: string]: any[] } = { TODO: [], INPROGRESS: [], IN_DEV_REVIEW: [], DONE: [] };
    tickets.forEach((ticket) => {
      if (organized[ticket.status as keyof typeof organized]) {
        organized[ticket.status as keyof typeof organized].push(ticket);
      }
    });
    setTodo(organized.TODO);
    setInProgress(organized.INPROGRESS);
    setIndev(organized.IN_DEV_REVIEW);
    setDone(organized.DONE);
  };

  const handleTicketUpdate = (prevStatus: string, receiveData: any) => {
    const statusMap: any = { TODO: setTodo, INPROGRESS: setInProgress, IN_DEV_REVIEW: setIndev, DONE: setDone };
    statusMap[prevStatus]((prev: any[]) => prev.filter((el: any) => el._id !== receiveData._id));
    statusMap[receiveData.status]((prev: any[]) => {
      if (!prev.find((el: any) => el._id === receiveData._id)) {
        return [receiveData, ...prev];
      }
      return prev;
    });
  };

  const handleNewTicket = (receiveData: any) => {
    const statusMap: any = { TODO: setTodo, INPROGRESS: setInProgress, IN_DEV_REVIEW: setIndev, DONE: setDone };
    statusMap[receiveData.status]((prev: any[]) => {
      if (!prev.find((el: any) => el._id === receiveData._id)) {
        return [receiveData, ...prev];
      }
      return prev;
    });
  };

  const handleChange = (e: any) => {
    setCurrentTicket({ ...currentTicket, [e.target.name]: e.target.value });
  };

  const createTicket = async () => {
    if (!currentTeam) return;
    try {
      const ticketData = {
        ...currentTicket,
        team: currentTeam._id,
        dueDate: currentTicket.dueDate ? new Date(currentTicket.dueDate) : undefined,
        createdBy: "1",
      };
      const { data } = await ticketAPI.create(ticketData);
      socket.emit("create-ticket", { ...data, team: currentTeam._id });
      setShowCreateModal(false);
      setCurrentTicket({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        assignee: "",
        project: "",
        cycle: "",
        dueDate: "",
        labels: [],
      });
      await fetchAllData();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const statusLists: any = { TODO: todo, INPROGRESS: inprogress, IN_DEV_REVIEW: indev, DONE: done };
    const setters: any = { TODO: setTodo, INPROGRESS: setInProgress, IN_DEV_REVIEW: setIndev, DONE: setDone };

    if (source.droppableId === destination.droppableId) {
      const list = [...statusLists[source.droppableId]];
      const [removed] = list.splice(source.index, 1);
      list.splice(destination.index, 0, removed);
      setters[source.droppableId](list);
    } else {
      const sourceList = [...statusLists[source.droppableId]];
      const destList = [...statusLists[destination.droppableId]];
      const [removed] = sourceList.splice(source.index, 1);
      removed.status = destination.droppableId;
      destList.splice(destination.index, 0, removed);
      setters[source.droppableId](sourceList);
      setters[destination.droppableId](destList);

      ticketAPI
        .update(removed._id, { status: destination.droppableId })
        .then(({ data }) => {
          socket.emit("update-ticket", {
            prevStatus: source.droppableId,
            receiveData: data,
            team: currentTeam?._id,
          });
        });
    }
  };

  const openIssue = (issueId: string) => {
    setSelectedIssue(issueId);
    setShowIssueModal(true);
  };

  return (
    <>
      <Head>
        <title>Linear</title>
        <meta name="description" content="Linear - Issue Tracking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SidebarToggle />
      <div className="home-container">
        <div className="nav-bar">
          <div className="profile" onClick={() => router.push('/settings')}>
            <div className="avatar-cont">
              <div className="avatar">{currentTeam?.identifier?.substring(0, 2) || "LI"}</div>
              <div className="org">{currentTeam?.name || "LINEAR"}</div>
            </div>
            <div className="user_profile">DU</div>
          </div>
          <div className="issue-search">
            <div
              className="create-issue"
              onClick={() => setShowCreateModal(true)}
            >
              <IssueIcon />
              <div>New Issue</div>
            </div>
            <div className="search" onClick={() => setShowCommandPalette(true)}>
              <SearchIcon />
            </div>
          </div>
            <div className="feature">
              <div onClick={() => router.push('/activity')} className={router.pathname === '/activity' ? 'active' : ''}>
                <InboxIcon />
                Inbox
              </div>
              <div onClick={() => {
                setFilters({ ...filters, assignee: '1' }); // Mock user ID
              }}>
                <MyIssue />
                My Issues
              </div>
              <div>
                <ViewIcon />
                Views
              </div>
              <div onClick={() => router.push('/projects')} className={router.pathname === '/projects' ? 'active' : ''}>
                <RoadmapIcon />
                Projects
              </div>
              <div onClick={() => router.push('/cycles')} className={router.pathname === '/cycles' ? 'active' : ''}>
                <RoadmapIcon />
                Cycles
              </div>
              <div onClick={() => router.push('/integrations')} className={router.pathname === '/integrations' ? 'active' : ''}>
                <ViewIcon />
                Integrations
              </div>
            </div>
        </div>
        <div className="ticket-cont">
            <div className="top-nav">
              <div>All Issues</div>
              <StarIcon />
              <div className="view-toggle">
                <button
                  className={view === "kanban" ? "active" : ""}
                  onClick={() => setView("kanban")}
                >
                  Kanban
                </button>
                <button
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                >
                  List
                </button>
              </div>
              <div className="filter">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="TODO">Todo</option>
                  <option value="INPROGRESS">In Progress</option>
                  <option value="IN_DEV_REVIEW">In Dev Review</option>
                  <option value="DONE">Done</option>
                </select>
                <select
                  value={filters.assignee}
                  onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                >
                  <option value="">All Assignees</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <option value="">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="search-input"
                />
              </div>
            </div>
            {view === "kanban" ? (
              isMounted ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="ticket-cont1">
                    {columnList.map((el, i) => (
                      <div key={el.value} className="list-cont">
                        <div className="ticket-col">
                          <div className="status-bar">
                            <div>
                              <el.icon />
                              <div>{el.name}</div>
                              <div>{filterTicket[i].length}</div>
                            </div>
                            <AddIcon />
                          </div>
                          <Droppable droppableId={el.value} type="category">
                            {(provided: DroppableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="ticket-scroll"
                              >
                                {filterTicket[i]?.map((el: any, idx: number) => (
                                  <Draggable
                                    draggableId={el._id}
                                    key={el._id}
                                    index={idx}
                                  >
                                    {(
                                      provided: DraggableProvided,
                                      snapshot: DraggableStateSnapshot
                                    ) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`ticket ${snapshot.isDragging ? "dragging" : ""}`}
                                        onClick={() => openIssue(el._id)}
                                      >
                                        <div>
                                          <div>{el.issueId}</div>
                                          {el.assignee && <User />}
                                        </div>
                                        <div className="title">{el.title}</div>
                                        <div className="ticket-meta">
                                          {el.priority && (
                                            <span className={`priority priority-${el.priority.toLowerCase()}`}>
                                              {el.priority}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              ) : (
                <div className="ticket-cont1">
                  {columnList.map((el, i) => (
                    <div key={el.value} className="list-cont">
                      <div className="ticket-col">
                        <div className="status-bar">
                          <div>
                            <el.icon />
                            <div>{el.name}</div>
                            <div>{filterTicket[i].length}</div>
                          </div>
                          <AddIcon />
                        </div>
                        <div className="ticket-scroll">
                          {filterTicket[i]?.map((el: any, idx: number) => (
                            <div
                              key={el._id}
                              className="ticket"
                              onClick={() => openIssue(el._id)}
                            >
                              <div>
                                <div>{el.issueId}</div>
                                {el.assignee && <User />}
                              </div>
                              <div className="title">{el.title}</div>
                              <div className="ticket-meta">
                                {el.priority && (
                                  <span className={`priority priority-${el.priority.toLowerCase()}`}>
                                    {el.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="list-view">
                <table className="issues-table">
                  <thead>
                    <tr>
                      <th>Issue</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assignee</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...todo, ...inprogress, ...indev, ...done].map((issue) => (
                      <tr key={issue._id} onClick={() => openIssue(issue._id)}>
                        <td>
                          <div className="issue-id">{issue.issueId}</div>
                          <div className="issue-title">{issue.title}</div>
                        </td>
                        <td>
                          <span className={`status-badge status-${issue.status}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td>
                          <span className={`priority priority-${issue.priority?.toLowerCase()}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td>{issue.assignee?.name || "Unassigned"}</td>
                        <td>
                          {issue.dueDate
                            ? new Date(issue.dueDate).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {showCreateModal && (
          <div className="create-ticket">
            <div className="head">
              <div>
                <HomeIcon />
                <div className="head-c">{currentTeam?.identifier || "ILL"}</div>
                <span>New Issue</span>
              </div>
              <div onClick={() => setShowCreateModal(false)}>
                <CrossIcon />
              </div>
            </div>
            <div>
              <input
                name="title"
                className="issuetitile"
                value={currentTicket.title}
                onChange={handleChange}
                type="text"
                placeholder="Issue title"
                autoFocus
              />
              <textarea
                className="issuetitile desc"
                name="description"
                value={currentTicket.description}
                onChange={handleChange}
                placeholder="Add description..."
                rows={4}
              />
            </div>
            <div className="status-priority">
              <select
                onChange={handleChange}
                name="status"
                className="status-select"
                value={currentTicket.status}
              >
                <option value="TODO">Todo</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="IN_DEV_REVIEW">In Dev Review</option>
                <option value="DONE">Done</option>
              </select>
              <select
                className="status-select"
                onChange={handleChange}
                name="priority"
                value={currentTicket.priority}
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <select
                className="status-select"
                onChange={handleChange}
                name="assignee"
                value={currentTicket.assignee}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <select
                className="status-select"
                onChange={handleChange}
                name="project"
                value={currentTicket.project}
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-button-cont">
              <button onClick={createTicket}>Create issue</button>
            </div>
          </div>
        )}

        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onCreateIssue={() => {
            setShowCommandPalette(false);
            setShowCreateModal(true);
          }}
          onApplyFilter={(filterType, value) => {
            setFilters((prev) => ({ ...prev, [filterType]: value }));
          }}
          onOpenIssue={(issueId) => {
            setSelectedIssue(issueId);
            setShowIssueModal(true);
          }}
          onNavigateToProject={(projectId) => {
            router.push(`/projects`);
          }}
        />

        <IssueDetailModal
          issueId={selectedIssue}
          isOpen={showIssueModal}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedIssue(null);
          }}
          onUpdate={fetchAllData}
        />
      </div>
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}

(Home as any).noLayout = true;
