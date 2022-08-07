export default function Config(options = {}) {
  if (process?.env?.MAILER_USER || process?.env?.MAILER_PASSWORD) {
    throw new Error('Auth Not Set')
  }

  const MAIL_CONFIG = {
    auth: { user: process.env.MAILER_USER, pass: process.env.MAILER_PASSWORD },
    ...options
  }

  if (!process?.env?.MAILER_SERVICE) {
    MAIL_CONFIG.host = process.env.MAILER_HOST
    MAIL_CONFIG.port = process.env.MAILER_PORT
  } else {
    MAIL_CONFIG.service = process.env.MAILER_SERVICE
  }

  return MAIL_CONFIG
}
