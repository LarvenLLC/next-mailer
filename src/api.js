import Config from './Config'
import { defaultSettings } from './helper'
import mailer from './server'
const nodemailer = require('nodemailer')

/**
 *
 * @param {object} settings
 * @param {Logger} settings.logger
 * @returns
 */
const NextMailer = (settings = defaultSettings) => {
  // transporter is a way to send your emails

  // const CONFIG = { ...defaultSettings, ...settings }
  const { logger = defaultSettings.logger, ...options } = settings

  // TODO: setup dynamic MAIL_CONFIG
  const MAIL_CONFIG = new Config(options)
  const transporter = nodemailer.createTransport(MAIL_CONFIG)

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

  // Attach getConfig and getTransporter methods to handler
  handler.getConfig = () => MAIL_CONFIG
  handler.getLogger = () => logger
  handler.getTransporter = () => transporter

  // Return the handler function, now with attached methods
  return handler
}

export default NextMailer
const getConfig = NextMailer.getConfig
const getLogger = NextMailer.getLogger
const getTransporter = NextMailer.getTransporter
export { getConfig, getLogger, getTransporter }
