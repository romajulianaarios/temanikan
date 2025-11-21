import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ERROR CAUGHT:', error);
    console.error('📍 Stack:', errorInfo.componentStack);
    
    // Save to localStorage untuk persist
    const errorLog = {
      timestamp: new Date().toISOString(),
      component: this.props.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };
    
    const existingLogs = localStorage.getItem('error_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(errorLog);
    localStorage.setItem('error_logs', JSON.stringify(logs));
    
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '30px',
          margin: '20px',
          border: '3px solid #DC2626',
          borderRadius: '12px',
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          fontFamily: 'monospace',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h1 style={{ marginTop: 0, color: '#DC2626', fontSize: '24px' }}>
            ❌ Error di {this.props.name || 'Component'}
          </h1>
          
          <div style={{ 
            backgroundColor: '#FEF2F2', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #FCA5A5'
          }}>
            <strong style={{ fontSize: '16px' }}>🐛 Error Message:</strong>
            <pre style={{
              marginTop: '10px',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {this.state.error?.message}
            </pre>
          </div>

          <details style={{ marginBottom: '15px' }}>
            <summary style={{ 
              cursor: 'pointer', 
              padding: '10px',
              backgroundColor: '#FEF2F2',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              📋 Component Stack (click to expand)
            </summary>
            <pre style={{
              backgroundColor: '#FFFBEB',
              padding: '15px',
              borderRadius: '6px',
              overflow: 'auto',
              maxHeight: '300px',
              fontSize: '12px',
              marginTop: '10px'
            }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>

          <details>
            <summary style={{ 
              cursor: 'pointer', 
              padding: '10px',
              backgroundColor: '#FEF2F2',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🔍 Full Stack Trace
            </summary>
            <pre style={{
              backgroundColor: '#FFFBEB',
              padding: '15px',
              borderRadius: '6px',
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '11px',
              marginTop: '10px'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🔄 Reload Page
            </button>
            
            <button
              onClick={() => {
                const logs = localStorage.getItem('error_logs');
                console.log('All Error Logs:', JSON.parse(logs || '[]'));
                alert('Error logs printed to console (F12)');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📊 Show All Logs
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
