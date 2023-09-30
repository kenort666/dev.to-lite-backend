const NodeMailer = require('nodemailer');
const dotenv = require('dotenv');

class mailService {
  constructor() {
    dotenv.config();
    this.transporter = NodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: `
          <div>
            <h1>
              Для активации аккаунта на Dev.To (Lite) перейдите по ссылке
            </h1>
            <a href="${link}">${link}</a>
          </div>
        `,
    });
  }
}

module.exports = new mailService();
