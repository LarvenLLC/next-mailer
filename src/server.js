import Config from './Config'
import { defaultSettings, getDeliveryStatus } from './helper'
const nodemailer = require('nodemailer')

/**
 *
 * @param {object} config
 * @param {Logger} config.logger
 * @returns
 */
export default function MailerAPI(settings = defaultSettings) {
  const { logger: LOGGER = defaultSettings.logger, ...options } = settings

  const CONFIG = new Config(options)
  const TRANSPORTER = nodemailer.createTransport(CONFIG)

  // Server-side mailing API
  /**
   * @function mail
   * @param {MailBody} config
   * @returns {Promise<any>}
   */
  return async function mailer(
    { data, html, receivers, sender, subject, text },
    MAIL_CONFIG = CONFIG,
    logger = LOGGER,
    transporter = TRANSPORTER
  ) {
    try {
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

      if (Object.prototype.hasOwnProperty.call(data, 'file')) {
        mailOptions.attachments = [
          {
            filename: `${data.filePath[0]}`,
            path: `${data.file[0]}`
          }
        ]
      }

      // call of this function send an email, and return status
      transporter.sendMail(mailOptions, (error, info) =>
        getDeliveryStatus(error, info, logger)
      )
    } catch (error) {}
  }
}
