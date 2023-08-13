// Client-side mailing API

const getBaseURL = () => {
  if (process?.env?.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process?.env?.MAILER_BASE_URL) {
    return process.env.MAILER_BASE_URL;
  }
  return '';
}

/**
 * @function mail
 * @param {MailBody} config
 * @returns {Promise<any>}
 */
async function mail(config) {
  const response = await fetch(`${getBaseURL()}/api/mailer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  })
  return await response.json()
}

export default mail
