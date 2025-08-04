import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Customize the fallback UI
      return (
        <div className="bg-gray-900 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4 text-red-400">Something went wrong</h2>
          <p className="mb-4">We're sorry, but there was an error loading this component.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700"
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 p-4 bg-gray-800 rounded-lg">
              <summary className="text-purple-400 cursor-pointer">Error details</summary>
              <pre className="mt-2 text-xs text-gray-300 overflow-auto">
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
