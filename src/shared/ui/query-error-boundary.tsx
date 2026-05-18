"use client";

import { Component, type ComponentType, type ReactNode } from "react";

export type QueryErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type Props = {
  children: ReactNode;
  fallback: ComponentType<QueryErrorFallbackProps>;
  onReset?: () => void;
};

type State = { error: Error | null };

export class QueryErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    // 실 운영에서는 여기서 모니터링 도구로 전송
    if (process.env.NODE_ENV !== "production") {
      console.error("[QueryErrorBoundary]", error);
    }
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback;
      return <Fallback error={this.state.error} resetErrorBoundary={this.reset} />;
    }
    return this.props.children;
  }
}
