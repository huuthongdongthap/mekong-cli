import * as Sentry from "@sentry/nestjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Scrub PII before sending
    if (event.request?.headers) {
      delete event.request.headers.authorization
      delete event.request.headers.cookie
    }
    return event
  },
})
