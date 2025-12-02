import React from "react";
import Navbar from "../components/Navbar.jsx";
import ResumeBuilder from "../components/ResumeBuilder.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ResumeBuilder crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500 bg-white m-10 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <details className="whitespace-pre-wrap">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const ResumePage = () => (
  <>
    <Navbar />
    <main className="page-bg pt-20 px-6">
      <ErrorBoundary>
        <ResumeBuilder />
      </ErrorBoundary>
    </main>
  </>
);

export default ResumePage;
