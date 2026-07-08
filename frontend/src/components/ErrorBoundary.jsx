import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#F9F8F6',
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            maxWidth: 480,
            background: '#fff',
            border: '1px solid #E5E2DC',
            borderRadius: 16,
            padding: '2rem',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#5C5C5C', marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#E55A28',
                color: '#fff',
                border: 'none',
                borderRadius: 9999,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
