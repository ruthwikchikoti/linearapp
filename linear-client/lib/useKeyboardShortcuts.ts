import { useEffect } from 'react';
import { useRouter } from 'next/router';

export interface KeyboardShortcut {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
  category: 'navigation' | 'issues' | 'views' | 'general';
}

export const useKeyboardShortcuts = (
  onOpenCommandPalette?: () => void,
  onCreateIssue?: () => void,
  onToggleView?: () => void
) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // Command Palette: Cmd/Ctrl + K
      if (ctrlOrCmd && event.key === 'k') {
        event.preventDefault();
        onOpenCommandPalette?.();
        return;
      }

      // Create Issue: C (when not in input)
      if (event.key === 'c' && !isInputFocused()) {
        event.preventDefault();
        onCreateIssue?.();
        return;
      }

      // Create Issue: Cmd/Ctrl + I
      if (ctrlOrCmd && event.key === 'i') {
        event.preventDefault();
        onCreateIssue?.();
        return;
      }

      // Toggle View: V (when not in input)
      if (event.key === 'v' && !isInputFocused()) {
        event.preventDefault();
        onToggleView?.();
        return;
      }

      // Navigate to Projects: G then P
      if (event.key === 'g' && !isInputFocused()) {
        // Wait for next key
        const handleSecondKey = (e: KeyboardEvent) => {
          if (e.key === 'p') {
            router.push('/projects');
          } else if (e.key === 'c') {
            router.push('/cycles');
          } else if (e.key === 'a') {
            router.push('/activity');
          } else if (e.key === 's') {
            router.push('/settings');
          } else if (e.key === 'h') {
            router.push('/');
          }
          document.removeEventListener('keydown', handleSecondKey);
        };
        document.addEventListener('keydown', handleSecondKey);
        setTimeout(() => {
          document.removeEventListener('keydown', handleSecondKey);
        }, 1000);
        return;
      }

      // Search: / (when not in input)
      if (event.key === '/' && !isInputFocused()) {
        event.preventDefault();
        onOpenCommandPalette?.();
        return;
      }

      // Help: ? (when not in input)
      if (event.key === '?' && !isInputFocused()) {
        event.preventDefault();
        event.stopPropagation();
        // Use setTimeout to ensure event is dispatched after current event loop
        setTimeout(() => {
          const helpEvent = new CustomEvent('keyboard-shortcuts-help');
          window.dispatchEvent(helpEvent);
        }, 0);
        return;
      }

      // Escape: Close any open modal
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        const escapeEvent = new CustomEvent('keyboard-escape');
        window.dispatchEvent(escapeEvent);
        return;
      }

      // Refresh: R (when not in input)
      if (event.key === 'r' && !isInputFocused() && !ctrlOrCmd) {
        event.preventDefault();
        window.location.reload();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, onOpenCommandPalette, onCreateIssue, onToggleView]);
};

function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  return (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement instanceof HTMLSelectElement ||
    activeElement?.getAttribute('contenteditable') === 'true'
  );
}

// Export shortcut definitions for help modal
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: '⌘K / Ctrl+K',
    description: 'Open command palette',
    action: () => {},
    category: 'general',
  },
  {
    key: '/',
    description: 'Search issues',
    action: () => {},
    category: 'general',
  },
  {
    key: '?',
    description: 'Show keyboard shortcuts',
    action: () => {},
    category: 'general',
  },
  {
    key: 'Esc',
    description: 'Close modal or dialog',
    action: () => {},
    category: 'general',
  },
  {
    key: 'C',
    description: 'Create new issue',
    action: () => {},
    category: 'issues',
  },
  {
    key: '⌘I / Ctrl+I',
    description: 'Create new issue',
    action: () => {},
    category: 'issues',
  },
  {
    key: 'V',
    description: 'Toggle view (Kanban/List)',
    action: () => {},
    category: 'views',
  },
  {
    key: 'R',
    description: 'Refresh page',
    action: () => {},
    category: 'general',
  },
  {
    key: 'G then H',
    description: 'Go to home/issues',
    action: () => {},
    category: 'navigation',
  },
  {
    key: 'G then P',
    description: 'Go to projects',
    action: () => {},
    category: 'navigation',
  },
  {
    key: 'G then C',
    description: 'Go to cycles',
    action: () => {},
    category: 'navigation',
  },
  {
    key: 'G then A',
    description: 'Go to activity',
    action: () => {},
    category: 'navigation',
  },
  {
    key: 'G then S',
    description: 'Go to settings',
    action: () => {},
    category: 'navigation',
  },
];
