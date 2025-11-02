import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  status?: 'active' | 'error' | 'pending';
  lastSync?: string;
}

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Automatically link commits, PRs, and issues',
      icon: '🐙',
      connected: true,
      status: 'active',
      lastSync: '2 minutes ago',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications in Slack channels',
      icon: '💬',
      connected: false,
    },
    {
      id: 'figma',
      name: 'Figma',
      description: 'Attach Figma designs to issues',
      icon: '🎨',
      connected: false,
    },
    {
      id: 'sentry',
      name: 'Sentry',
      description: 'Automatically create issues from errors',
      icon: '🐛',
      connected: false,
    },
  ]);

  const [githubModal, setGithubModal] = useState(false);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id
          ? {
              ...int,
              connected: !int.connected,
              status: !int.connected ? 'active' : undefined,
              lastSync: !int.connected ? 'Just now' : undefined,
            }
          : int
      )
    );
  };

  return (
    <div className="integrations-view" style={{ flex: 1, padding: 'var(--spacing-6)' }}>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h1
            style={{
              fontSize: 'var(--font-size-5xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--linear-text-primary)',
              marginBottom: 'var(--spacing-3)',
            }}
          >
            Integrations
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--linear-text-secondary)',
            }}
          >
            Connect Linear with your favorite tools to streamline your workflow
          </p>
        </div>

        {/* Integrations Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: 'var(--spacing-4)',
          }}
        >
          {integrations.map((integration) => (
            <div
              key={integration.id}
              style={{
                backgroundColor: 'var(--linear-bg-secondary)',
                border: '1px solid var(--linear-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-5)',
                transition: 'all var(--transition-base)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--linear-bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--linear-border-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--linear-bg-secondary)';
                e.currentTarget.style.borderColor = 'var(--linear-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ fontSize: '32px' }}>{integration.icon}</div>
                  <div>
                    <h3
                      style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--linear-text-primary)',
                        marginBottom: 'var(--spacing-1)',
                      }}
                    >
                      {integration.name}
                    </h3>
                    {integration.connected && (
                      <span
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--linear-success)',
                          fontWeight: 'var(--font-weight-medium)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-1)',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--linear-success)',
                          }}
                        />
                        Connected
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (integration.id === 'github' && integration.connected) {
                      setGithubModal(true);
                    } else {
                      toggleIntegration(integration.id);
                    }
                  }}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    backgroundColor: integration.connected
                      ? 'transparent'
                      : 'var(--linear-accent)',
                    border: integration.connected
                      ? '1px solid var(--linear-border)'
                      : '1px solid var(--linear-accent)',
                    color: integration.connected
                      ? 'var(--linear-text-primary)'
                      : 'white',
                  }}
                >
                  {integration.connected ? 'Configure' : 'Connect'}
                </button>
              </div>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--linear-text-secondary)',
                  marginBottom: 'var(--spacing-3)',
                }}
              >
                {integration.description}
              </p>
              {integration.connected && integration.lastSync && (
                <div
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--linear-text-tertiary)',
                  }}
                >
                  Last synced {integration.lastSync}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* GitHub Configuration Modal */}
        {githubModal && (
          <div className="modal-overlay" onClick={() => setGithubModal(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '600px' }}
            >
              <div className="modal-header">
                <h2>GitHub Integration</h2>
                <button onClick={() => setGithubModal(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-3)',
                      padding: 'var(--spacing-4)',
                      backgroundColor: 'var(--linear-success-subtle)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--spacing-5)',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>✓</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--linear-success)',
                          marginBottom: 'var(--spacing-1)',
                        }}
                      >
                        Connected to GitHub
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--linear-text-secondary)' }}>
                        Your GitHub account is linked
                      </div>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: 'var(--font-size-md)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--linear-text-primary)',
                      marginBottom: 'var(--spacing-3)',
                    }}
                  >
                    Webhook URL
                  </h3>
                  <div
                    style={{
                      padding: 'var(--spacing-3)',
                      backgroundColor: 'var(--linear-bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--linear-text-secondary)',
                      marginBottom: 'var(--spacing-5)',
                      overflowX: 'auto',
                    }}
                  >
                    http://localhost:3005/linear/webhook
                  </div>

                  <h3
                    style={{
                      fontSize: 'var(--font-size-md)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--linear-text-primary)',
                      marginBottom: 'var(--spacing-3)',
                    }}
                  >
                    Features
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    {[
                      'Auto-link commits to issues using issue IDs',
                      'Create issues from GitHub issues',
                      'Link pull requests to Linear issues',
                      'Sync PR status with issue status',
                      'Show commit history in issue timeline',
                    ].map((feature, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-2)',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--linear-text-secondary)',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--linear-success)">
                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                  <button
                    onClick={() => {
                      toggleIntegration('github');
                      setGithubModal(false);
                    }}
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--linear-border)',
                      color: 'var(--linear-error)',
                    }}
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => setGithubModal(false)}
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      backgroundColor: 'var(--linear-accent)',
                      border: '1px solid var(--linear-accent)',
                      color: 'white',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
