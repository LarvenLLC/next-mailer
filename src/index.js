import NextMailer, { getTransporter } from './api'
import mailer from './server'

module.exports = NextMailer
module.exports.getTransporter = getTransporter
module.exports.mailer = mailer
