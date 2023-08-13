import Config from './Config'
import { defaultSettings, getDeliveryStatus } from './helper'
import mail from './react/client'
const nodemailer = require('nodemailer')

let configurations = null

/**
 * Server-side mailing API
 * @function mailer
 * @param {MailBody} config
 * @returns {Promise<any>}
 */
export async function mailer({
  attachments,
  html,
  receivers = '',
  sender = process?.env?.MAILER_SENDER,
  subject = 'Subject',
  text
}) {
  if (!configurations) {
    return await mail({
      attachments,
      html,
      receivers,
      sender,
      subject,
      text
    })
  }

  const { logger = defaultSettings.logger, ...options } = configurations
  const MAIL_CONFIG = new Config(options)
  const transporter = nodemailer.createTransport(MAIL_CONFIG)
  try {
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

/**
 *
 * @param {object} settings
 * @param {Logger} settings.logger
 * @returns
 */
const NextMailer = (settings = defaultSettings) => {
  // transporter is a way to send your emails

  // const CONFIG = { ...defaultSettings, ...settings }
  configurations = settings
  const { logger = defaultSettings.logger } = settings

  const handler = async function handler(req, res) {
    const {
      method,
      body: { attachments, html, receivers, sender, subject, text }
    } = req

    try {
      switch (method) {
        // TODO: retreive sent mail metadata
        case 'POST': {
          await mailer({
            attachments,
            html,
            receivers,
            sender,
            subject,
            text,
            settings
          })
          break
        }
        default:
          res.setHeader('Allow', ['POST'])
          res.status(405).end(`Method ${method} Not Allowed`)
      }
      // send result
      logger.info('NextMailer - HTTP Status OK')
      return res.status(200).json({ message: 'Message sent' })
    } catch (error) {
      logger.error('NextMailer - Internal Server Error', error)
      return res.status(500).json(error)
    }
  }

  // Attach getLogger methods to handler
  handler.getLogger = () => logger

  // Return the handler function, now with attached methods
  return handler
}

export default NextMailer
