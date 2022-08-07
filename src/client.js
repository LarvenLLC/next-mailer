// Client-side mailing API
/**
 * @function mail
 * @param {MailBody} config
 * @returns {Promise<any>}
 */
async function mail(config) {
  const response = await fetch(`/api/mailer`, {
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
