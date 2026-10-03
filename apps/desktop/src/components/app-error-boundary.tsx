import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled application error:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center p-6'>
          <div className='w-full max-w-md space-y-4 text-center'>
            <h1 className='text-2xl font-semibold'>Something went wrong</h1>

            <p className='text-muted-foreground'>
              Helpy encountered an unexpected error. Please try reloading the
              application.
            </p>

            <button
              type='button'
              onClick={this.handleReload}
              className='rounded-md border px-4 py-2'
            >
              Reload Helpy
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
