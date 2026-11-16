import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, ButtonLink } from '../ui/Button';
import { translations } from '../../i18n/dictionary';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Route-level error boundary. Copy is taken directly from the dictionary so it
 * is shown in whichever language was active when the error occurred.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Kept intentionally simple: this is a demo, so we surface it in the console.
    console.error('NESTORA render error:', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;

    const lang = typeof document !== 'undefined' && document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const dictionary = translations[lang];

    return (
      <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <span className="eyebrow">NESTORA</span>
        <h1 className="mt-5 font-display text-4xl text-ink">{dictionary['error.title']}</h1>
        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-secondary">{dictionary['error.text']}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={this.reset}>{dictionary['action.retry']}</Button>
          <ButtonLink to="/" variant="outline">
            {dictionary['action.goHome']}
          </ButtonLink>
        </div>
      </section>
    );
  }
}

export default ErrorBoundary;
