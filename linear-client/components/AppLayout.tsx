import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useApp } from "../lib/context";
import IssueIcon from "./icons/issue-icon";
import SearchIcon from "./icons/search-icon";
import InboxIcon from "./icons/inbox";
import MyIssue from "./icons/MyIssue";
import RoadmapIcon from "./icons/Roadmap";
import ViewIcon from "./icons/View";
import CommandPalette from "./CommandPalette";
import SidebarToggle from "./SidebarToggle";
import { useState, useEffect, KeyboardEvent } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { currentTeam } = useApp();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown as any);
    return () => window.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && router.pathname === "/") return true;
    if (path !== "/" && router.pathname.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    {
      path: "/",
      label: "Issues",
      icon: IssueIcon,
      onClick: () => router.push("/"),
    },
    {
      path: "/activity",
      label: "Inbox",
      icon: InboxIcon,
      onClick: () => router.push("/activity"),
    },
    {
      path: "/my-issues",
      label: "My Issues",
      icon: MyIssue,
      onClick: () => {
        // Navigate to home with filter
        router.push("/");
        // Set filter via query param or state
      },
    },
    {
      path: "/projects",
      label: "Projects",
      icon: RoadmapIcon,
      onClick: () => router.push("/projects"),
    },
    {
      path: "/cycles",
      label: "Cycles",
      icon: RoadmapIcon,
      onClick: () => router.push("/cycles"),
    },
  ];

  return (
    <main>
      <SidebarToggle />
      <div className="home-container">
        {/* Persistent Sidebar Navigation */}
        <div className="nav-bar">
          {/* Profile Section */}
          <div className="profile" onClick={() => router.push("/settings")}>
            <div className="avatar-cont">
              <div className="avatar">
                {currentTeam?.identifier?.substring(0, 2) || "LI"}
              </div>
              <div className="org">{currentTeam?.name || "LINEAR"}</div>
            </div>
            <div className="user_profile">DU</div>
          </div>

          {/* New Issue & Search */}
          <div className="issue-search">
            <div
              className="create-issue"
              onClick={() => {
                if (router.pathname === "/") {
                  // Trigger create modal on home page (only in browser)
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent("open-create-modal"));
                  }
                } else {
                  router.push("/?action=create");
                }
              }}
            >
              <IssueIcon />
              <div>New Issue</div>
            </div>
            <div className="search" onClick={() => setShowCommandPalette(true)}>
              <SearchIcon />
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="feature">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div
                  key={item.path}
                  onClick={item.onClick}
                  className={active ? "nav-item-active" : ""}
                >
                  <Icon />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ticket-cont">{children}</div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCreateIssue={() => {
          setShowCommandPalette(false);
          if (router.pathname === "/") {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent("open-create-modal"));
            }
          } else {
            router.push("/?action=create");
          }
        }}
        onApplyFilter={(filterType, value) => {
          // Navigate to home page with filter
          router.push(`/?${filterType}=${value}`);
        }}
        onOpenIssue={(issueId) => {
          router.push(`/?issue=${issueId}`);
        }}
        onNavigateToProject={(projectId) => {
          router.push(`/projects`);
        }}
      />
    </main>
  );
}

