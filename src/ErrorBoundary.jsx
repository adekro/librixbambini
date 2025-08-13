import React from 'react';

/**
 * ErrorBoundary Component
 *
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree
 * that crashed. This prevents a "white screen of death" for the user.
 *
 * It must be a class component to use the `getDerivedStateFromError` and
 * `componentDidCatch` lifecycle methods.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred.
    this.state = { hasError: false, error: null };
  }

  /**
   * This lifecycle method is triggered after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state.
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  /**
   * This lifecycle method is also called after an error in a descendant component.
   * It's a good place to log the error to an external service.
   */
  componentDidCatch(error, errorInfo) {
    // Example of logging to the console. In a real application, you might
    // send this to a service like Sentry, LogRocket, etc.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // If an error was caught, render the fallback UI.
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', margin: '20px', border: '2px solid red', borderRadius: '8px', backgroundColor: '#fff0f0', color: '#333' }}>
          <h1 style={{ color: '#d32f2f' }}>Oops! Qualcosa è andato storto.</h1>
          <p>L'applicazione ha riscontrato un errore imprevisto e non può continuare.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Dettagli tecnici per il debug</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.error && this.state.error.stack}
            </pre>
          </details>
        </div>
      );
    }

    // If there's no error, render the children components as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;
