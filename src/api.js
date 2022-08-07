import Config from './Config'
import { getDeliveryStatus } from './helper'
const nodemailer = require('nodemailer')

// TODO: default settings
// const defaultSettings = {}

/**
 *
 * @param {object} options
 * @param {Logger} options.logger
 * @returns
 */
export default function NextMailer({
  logger = {
    debug: () => null,
    error: () => null,
    info: () => null,
    warn: () => null
  },
  ...options
}) {
  // transporter is a way to send your emails

  // TODO: setup dynamic MAIL_CONFIG
  const MAIL_CONFIG = new Config(options)
  const transporter = nodemailer.createTransport(MAIL_CONFIG)

  return async function handler(req, res) {
    const {
      method,
      body: {
        data = {},
        html,
        receivers = '',
        sender = process?.env?.MAILER_FNAME_LNAME,
        subject = 'Subject',
        text
      }
    } = req

    try {
      switch (method) {
        // TODO: retreive sent mail metadata
        case 'POST': {
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
}
