import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - just redirect to main app
    router.push('/app');
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/linear-logo.png" alt="Linear" className="logo-image" />
            <span>Linear</span>
          </div>
          <div className="nav-links">
            <a href="#product">Product</a>
            <a href="#resources">Resources</a>
            <a href="#pricing">Pricing</a>
            <a href="#customers">Customers</a>
            <a href="#now">Now</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="btn-black" onClick={() => { setAuthMode('login'); setShowAuth(true); }}>
              Log in
            </button>
            <button className="btn-white" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Linear is a purpose-built tool for<br/>planning and building products
          </h1>
          <h2 className="hero-subtitle">
            Meet the system for modern software development. Streamline issues, projects, and product roadmaps.
          </h2>
          <div className="hero-cta">
            <button className="btn-white-large" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
              Start building
            </button>
            <button className="btn-black-large" onClick={() => window.location.href = '#agent'}>
              New: Linear agent for Slack
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* App Screenshot with 3D Perspective */}
        <div className="app-preview-container">
          <div className="app-preview-wrapper">
            <iframe
              src="/app"
              className="app-preview-iframe"
              title="Linear Clone Preview"
            />
            <div className="preview-gradient-overlay"></div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof-section">
        <div className="social-proof-container">
          <p className="social-proof-title">Powering the world's best product teams.</p>
          <p className="social-proof-subtitle">From next-gen startups to established enterprises.</p>
          <div className="company-logos">
            <div className="company-logo">OpenAI</div>
            <div className="company-logo">Cash App</div>
            <div className="company-logo">scale</div>
            <div className="company-logo">ramp ↗</div>
            <div className="company-logo">▲Vercel</div>
            <div className="company-logo">coinbase</div>
            <div className="company-logo">✦ BOOM</div>
            <div className="company-logo">⬡ CURSOR</div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="auth-modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuth(false)}>×</button>
            <div className="auth-modal-content">
              <h2>{authMode === 'login' ? 'Welcome back' : 'Get started for free'}</h2>
              <p>
                {authMode === 'login'
                  ? 'Log in to your Linear workspace'
                  : 'Create your Linear workspace'}
              </p>
              <form onSubmit={handleAuth}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-full">
                  {authMode === 'login' ? 'Log in' : 'Sign up'}
                </button>
              </form>
              <div className="auth-divider">
                <span>or</span>
              </div>
              <div className="auth-providers">
                <button className="provider-btn" onClick={handleAuth}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  GitHub
                </button>
                <button className="provider-btn" onClick={handleAuth}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M15.545 6.558a9.42 9.42 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.689 7.689 0 015.352 2.082l-2.284 2.284A4.347 4.347 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 000 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 001.599-2.431H8v-3.08h7.545z"/>
                  </svg>
                  Google
                </button>
              </div>
              <div className="auth-switch">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button className="link-btn" onClick={() => setAuthMode('signup')}>
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button className="link-btn" onClick={() => setAuthMode('login')}>
                      Log in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Disable default layout for this page
(LandingPage as any).noLayout = true;
