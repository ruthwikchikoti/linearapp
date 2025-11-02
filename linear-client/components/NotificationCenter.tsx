import { useState, useEffect } from 'react';
import { useApp } from '../lib/context';

interface Notification {
  id: string;
  type: 'mention' | 'assigned' | 'comment' | 'status_change' | 'completed';
  title: string;
  message: string;
  issueId?: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useApp();

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'mention',
        title: 'You were mentioned',
        message: 'John mentioned you in a comment on "Fix login bug"',
        issueId: 'ENG-123',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false,
      },
      {
        id: '2',
        type: 'assigned',
        title: 'New issue assigned',
        message: 'Sarah assigned "Update documentation" to you',
        issueId: 'DOC-45',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      {
        id: '3',
        type: 'comment',
        title: 'New comment',
        message: 'Mike commented on "Redesign homepage"',
        issueId: 'DESIGN-12',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
      },
      {
        id: '4',
        type: 'status_change',
        title: 'Status updated',
        message: '"API Integration" moved to Done',
        issueId: 'ENG-98',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention':
        return '@';
      case 'assigned':
        return '👤';
      case 'comment':
        return '💬';
      case 'status_change':
        return '🔄';
      case 'completed':
        return '✓';
      default:
        return '•';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'transparent',
          border: 'none',
          color: 'var(--linear-text-secondary)',
          cursor: 'pointer',
          padding: 'var(--spacing-2)',
          borderRadius: 'var(--radius-md)',
          transition: 'all var(--transition-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--linear-bg-hover)';
          e.currentTarget.style.color = 'var(--linear-text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--linear-text-secondary)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 016 6v3.586l.707.707A1 1 0 0116 14H4a1 1 0 01-.707-1.707L4 11.586V8a6 6 0 016-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: 'var(--linear-error)',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: 'var(--font-size-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="notification-dropdown"
            style={{
              position: 'absolute',
              top: '60px',
              right: 'var(--spacing-6)',
              width: '400px',
              maxHeight: '600px',
              backgroundColor: 'var(--linear-bg-secondary)',
              border: '1px solid var(--linear-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: 'var(--spacing-4) var(--spacing-5)',
                borderBottom: '1px solid var(--linear-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--linear-text-primary)',
                }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--linear-accent)',
                    fontSize: 'var(--font-size-sm)',
                    cursor: 'pointer',
                    padding: 'var(--spacing-1)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: '500px',
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--spacing-10)',
                    textAlign: 'center',
                    color: 'var(--linear-text-tertiary)',
                    fontSize: 'var(--font-size-md)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-3)' }}>
                    🔔
                  </div>
                  <div>No notifications</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-2)' }}>
                    We'll notify you when something happens
                  </div>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      padding: 'var(--spacing-4) var(--spacing-5)',
                      borderBottom: '1px solid var(--linear-border-subtle)',
                      cursor: 'pointer',
                      backgroundColor: notification.read
                        ? 'transparent'
                        : 'rgba(94, 106, 210, 0.05)',
                      transition: 'background-color var(--transition-base)',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--linear-bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notification.read
                        ? 'transparent'
                        : 'rgba(94, 106, 210, 0.05)';
                    }}
                  >
                    {!notification.read && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 'var(--spacing-3)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--linear-accent)',
                        }}
                      />
                    )}
                    <div style={{ marginLeft: notification.read ? '0' : 'var(--spacing-4)' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--spacing-3)',
                          marginBottom: 'var(--spacing-2)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 'var(--font-size-lg)',
                            flexShrink: 0,
                          }}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 'var(--font-size-sm)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--linear-text-primary)',
                              marginBottom: 'var(--spacing-1)',
                            }}
                          >
                            {notification.title}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--linear-text-secondary)',
                              marginBottom: 'var(--spacing-2)',
                            }}
                          >
                            {notification.message}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--linear-text-tertiary)',
                            }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
