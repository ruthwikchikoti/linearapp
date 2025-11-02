import { useState, useEffect } from "react";

export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const sidebar = document.querySelector(".nav-bar") as HTMLElement;
    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add("open");
      } else {
        sidebar.classList.remove("open");
      }
    }
  }, [isOpen]);

  return (
    <button
      className="sidebar-toggle"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle sidebar"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {isOpen ? (
          <path d="M4 4l12 12M16 4L4 16" />
        ) : (
          <path d="M3 5h14M3 10h14M3 15h14" />
        )}
      </svg>
    </button>
  );
}

