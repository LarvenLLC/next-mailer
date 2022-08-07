/**
 * @function getDeliveryStatus
 * this is callback function to return status to console
 * @param {Error | null} error
 * @param {SMTPTransport.SentMessageInfo} info
 * @param {*} logger
 */
export function getDeliveryStatus(error, info, logger) {
  if (error) {
    console.log('Mail failed', error)
    return logger.error('Mail failed', error)
  }
  console.log('Mail sent: %s', info.messageId)
  return logger.info('Mail sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
