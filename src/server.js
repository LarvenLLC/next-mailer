import { getConfig, getLogger, getTransporter } from './api'
import { getDeliveryStatus } from './helper'

/**
 * Server-side mailing API
 * @function mailer
 * @param {MailBody} config
 * @returns {Promise<any>}
 */
export default async function mailer({
  attachments,
  html,
  receivers = '',
  sender = process?.env?.MAILER_FNAME_LNAME,
  subject = 'Subject',
  text
}) {
  const MAIL_CONFIG = getConfig()
  const logger = getLogger()

  const transporter = getTransporter()

  try {
    // send mail
    // TODO: mail preview text
    // setup email data with unicode symbols
    // this is how your email are going to look like
    const mailOptions = {
      from: `"${sender}" <${MAIL_CONFIG.auth.user}>`, // sender address
      to: `${receivers}`, // list of receivers
      subject, // Subject line
      text, // text body
      html // html body
    }

    if (!sender) {
      throw new Error('Sender not set')
    }

    if (Array.isArray(attachments)) {
      mailOptions.attachments = attachments
    }

    // call of this function send an email, and return status
    transporter.sendMail(mailOptions, (error, info) =>
      getDeliveryStatus(error, info, logger)
    )
  } catch (error) {
    logger.error('NextMailer - Error', error)
  }
}
