import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallbackUI?: ReactNode  // Optional custom fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log the error details to an external service (e.g., Sentry)
    console.error("ErrorBoundary caught an error:", error, info)
    // You could also send the error info to a logging service here.
  }

  handleResetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback UI if provided, otherwise use default
      const fallbackUI = this.props.fallbackUI || (
        <div className="hero min-h-screen bg-teal-400">
          <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
            <div className="max-w-md">
              <h1 className="text-4xl">Error occurred</h1>
              <p className="py-6">
                {this.state.error?.message.includes('Attempt to get default algod configuration')
                  ? 'Please make sure to set up your environment variables correctly. Create a .env file based on .env.template and fill in the required values. This controls the network and credentials for connections with Algod and Indexer.'
                  : this.state.error?.message}
              </p>
              <button className="btn btn-primary" onClick={this.handleResetError}>
                Retry
              </button>
            </div>
          </div>
        </div>
      )

      return fallbackUI
    }

    return this.props.children
  }
}

export default ErrorBoundary
