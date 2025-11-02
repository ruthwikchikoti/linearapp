import { useEffect, useState } from 'react';
import { KEYBOARD_SHORTCUTS } from '../lib/useKeyboardShortcuts';

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleHelp = () => {
      setIsOpen(true);
    };
    const handleEscape = () => {
      setIsOpen(false);
    };

    window.addEventListener('keyboard-shortcuts-help', handleHelp);
    window.addEventListener('keyboard-escape', handleEscape);

    return () => {
      window.removeEventListener('keyboard-shortcuts-help', handleHelp);
      window.removeEventListener('keyboard-escape', handleEscape);
    };
  }, []);

  if (!isOpen) return null;

  const groupedShortcuts = KEYBOARD_SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof KEYBOARD_SHORTCUTS>);

  const categoryNames = {
    general: 'General',
    navigation: 'Navigation',
    issues: 'Issues',
    views: 'Views',
  };

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="modal-content keyboard-shortcuts-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px' }}
      >
        <div className="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category} style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--linear-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--spacing-3)',
                }}
              >
                {categoryNames[category as keyof typeof categoryNames]}
              </h3>
              <div className="shortcuts-list">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <kbd
                      style={{
                        backgroundColor: 'var(--linear-bg-elevated)',
                        border: '1px solid var(--linear-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px var(--spacing-2)',
                        fontSize: 'var(--font-size-sm)',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--linear-text-primary)',
                        minWidth: '140px',
                        display: 'inline-block',
                        textAlign: 'center',
                      }}
                    >
                      {shortcut.key}
                    </kbd>
                    <span
                      style={{
                        fontSize: 'var(--font-size-md)',
                        color: 'var(--linear-text-secondary)',
                      }}
                    >
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: 'var(--spacing-8)',
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--linear-bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--linear-text-tertiary)',
            }}
          >
            <strong style={{ color: 'var(--linear-text-secondary)' }}>Pro tip:</strong> Press{' '}
            <kbd
              style={{
                backgroundColor: 'var(--linear-bg-elevated)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              ?
            </kbd>{' '}
            anytime to see these shortcuts
          </div>
        </div>
      </div>
    </div>
  );
}
