// import * as Sentry from "@sentry/browser";
// import { DEVELOPMENT, SENTRY_DSN } from "configs/constants";


// try {
//   Sentry.init({
//     dsn: SENTRY_DSN,
//     environment: DEVELOPMENT ? "development" : "production",
//     release: "product-legislation-navigator@1.0.0",
//     debug: DEVELOPMENT ? true : false,
//     integrations: [
//       Sentry.replayIntegration(),
//       // new BrowserTracing(),
//       // Sentry.browserTracingIntegration(),
//     ],

//     // Performance Monitoring
//     tracesSampleRate: 1.0,
//     tracePropagationTargets: [
//       /^https:\/\/sustainabilitylegislationnavigator\.pwc\/com/,
//     ],

//     replaysSessionSampleRate: 0.1,
//     replaysOnErrorSampleRate: 1.0,
//   });
// } catch (error) {
//   Sentry.captureException(error);
// }

// Sentry.captureMessage('This is a custom message -- Testing if sentry catches error');

// const transaction = Sentry.startTransaction({ // Replace 'Sentry.startTransaction' with 'startTransaction'
//   name: "test-transaction",
// });

// const span = transaction.startChild({
//   op: "test-span",
//   described: "This is a test span",
// });

// span.finish();
// transaction.finish();
