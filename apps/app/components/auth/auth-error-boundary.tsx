import {
  getErrorMessage,
  isForbiddenError,
  isUnauthenticatedError,
} from "@/lib/errors";
import { sessionQueryKey } from "@/lib/queries/session";
import { Button } from "@repo/ui";
import {
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { AlertCircle, ShieldX } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

interface ResetProps {
  resetErrorBoundary: () => void;
}

// Fallback for auth errors in protected routes
function AuthErrorFallback({ resetErrorBoundary }: ResetProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.resetQueries({ queryKey: sessionQueryKey });
    resetErrorBoundary();
  };

  const handleSignIn = () => {
    queryClient.removeQueries({ queryKey: sessionQueryKey });
    const { pathname, search, hash } = window.location;
    const returnTo = encodeURIComponent(pathname + search + hash);
    window.location.href = `/login?returnTo=${returnTo}`;
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Authentication Required</h1>
        <p className="mb-6 text-muted-foreground">
          Please sign in to access this page.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleRetry}>
            Try Again
          </Button>
          <Button onClick={handleSignIn}>Sign In</Button>
        </div>
      </div>
    </div>
  );
}

// Fallback for forbidden errors: the user is authenticated but lacks permission.
function ForbiddenErrorFallback({ resetErrorBoundary }: ResetProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <ShieldX className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Access denied</h1>
        <p className="mb-6 text-muted-foreground">
          You don&apos;t have permission to access this page. If you think this
          is a mistake, contact your organization administrator.
        </p>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

// Generic error fallback for non-auth errors
function GenericErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-6 text-muted-foreground">{getErrorMessage(error)}</p>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Routes auth errors to the matching fallback:
// - 401/UNAUTHORIZED -> AuthErrorFallback (sign-in recovery)
// - 403/FORBIDDEN    -> ForbiddenErrorFallback (access denied)
// - everything else  -> GenericErrorFallback
function AuthAwareErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  if (isUnauthenticatedError(error)) {
    return <AuthErrorFallback resetErrorBoundary={resetErrorBoundary} />;
  }
  if (isForbiddenError(error)) {
    return <ForbiddenErrorFallback resetErrorBoundary={resetErrorBoundary} />;
  }
  return (
    <GenericErrorFallback
      error={error}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

// Auth error boundary for protected routes only.
// Catches auth errors (tRPC UNAUTHORIZED or HTTP 401) and shows sign-in recovery UI.
// 403 (forbidden) shows a dedicated access-denied screen since the user IS authenticated.
export function AuthErrorBoundary({ children }: ErrorBoundaryProps) {
  const queryClient = useQueryClient();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={AuthAwareErrorFallback}
      onReset={reset}
      onError={(error) => {
        console.error("Error caught by boundary:", error);
        if (isUnauthenticatedError(error)) {
          queryClient.removeQueries({ queryKey: sessionQueryKey });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Generic error boundary for app root - no auth-specific handling
export function AppErrorBoundary({ children }: ErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={GenericErrorFallback}
      onReset={reset}
      onError={(error) => console.error("Uncaught error:", error)}
    >
      {children}
    </ErrorBoundary>
  );
}
