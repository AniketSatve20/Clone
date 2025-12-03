import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-crypto flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-blockchain-card border border-blockchain-border rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-danger/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
            
            <p className="text-gray-400 mb-4 text-sm">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>

            <div className="bg-blockchain-dark/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-gray-500 font-mono break-all">
                {this.state.error?.toString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-neon hover:shadow-neon-purple text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
