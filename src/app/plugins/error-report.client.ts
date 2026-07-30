import { clientErrorReportLimits, type ClientErrorReport } from '../../shared/logging/error-report';

const recentReports = new Map<string, number>();
const clientDedupWindowMilliseconds = 5_000;

function readErrorDetails(error: unknown): Pick<ClientErrorReport, 'name' | 'message'> {
  if (error instanceof Error) {
    return {
      name: error.name.slice(0, clientErrorReportLimits.name),
      message: error.message.slice(0, clientErrorReportLimits.message),
    };
  }

  try {
    return {
      name: 'UnknownError',
      message: String(error).slice(0, clientErrorReportLimits.message),
    };
  } catch {
    return {
      name: 'UnknownError',
      message: 'A non-serializable value was thrown.',
    };
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  if (!config.public.errorReportingEnabled) {
    return;
  }

  const reportError = (error: unknown) => {
    const report: ClientErrorReport = {
      ...readErrorDetails(error),
      route: window.location.pathname.slice(0, clientErrorReportLimits.route),
    };
    const fingerprint = `${report.name}:${report.message}:${report.route}`;
    const now = Date.now();
    const previous = recentReports.get(fingerprint);

    if (previous && now - previous < clientDedupWindowMilliseconds) {
      return;
    }

    recentReports.set(fingerprint, now);

    if (recentReports.size >= 100) {
      for (const [key, timestamp] of recentReports) {
        if (now - timestamp >= clientDedupWindowMilliseconds) {
          recentReports.delete(key);
        }
      }
    }

    void $fetch('/api/_error-report', {
      method: 'POST',
      body: report,
    }).catch(() => undefined);
  };

  nuxtApp.hook('vue:error', (error) => reportError(error));
  nuxtApp.hook('app:error', (error) => reportError(error));
  window.addEventListener('error', (event) => reportError(event.error));
  window.addEventListener('unhandledrejection', (event) => reportError(event.reason));
});
