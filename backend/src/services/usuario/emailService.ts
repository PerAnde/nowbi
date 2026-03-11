import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const mailConfig: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(mailConfig);

export const sendResetEmail = async (email: string, resetLink: string) => {
  const mailOptions = {
    from: `"NowBi" <no-reply@nowbi.com.br>`,
    to: email,
    subject: "Redefinir Senha - NowBi",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; color: #4C556C; line-height: 1.5;">
        <div
            style="display: flex; align-items: center; background-color: #F6F8FA; padding: 1.5rem; border-radius: 8px 8px 0 0;">
            <table border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align: middle;">
        <img src="https://app.nowbi.com.br/logo.png" width="40" height="40" style="display: block;" alt="NowBi">
      </td>
      <td style="vertical-align: middle; padding-left: 12px;">
        <span style="font-family: sans-serif; font-size: 22px; font-weight: bold; color: #4C556C; line-height: 1;">NowBi</span>
      </td>
    </tr>
  </table>
        </div>

        <div style="padding: 20px;">
            <h2>Olá, ${email}</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no <a
                    href="https://app.nowbi.com.br"><strong style="color: #76B2FE;">NowBi</strong>.</a></p>

            <p>Clique no botão abaixo para escolher uma nova senha. Este link é válido por 30 minutos.</p>
            <a href="${resetLink}"
                style="background-color: #76B2FE; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
                Redefinir senha
            </a>

            <div
                style="padding: 1rem 1.5rem; border: 1px solid #ff3030; border-radius: .5rem; background-color: #fff9f9; margin: 20px 0;">
                <p style="margin: 0; color: #d32f2f;">
                    <strong>Se você não solicitou essa alteração, por favor entre em contato com nosso suporte.</strong>
                </p>
            </div>

            <div
                style="background-color: #EBF5FF; padding: 1.5rem; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="vertical-align: middle; width: 40px;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
                                width="35" height="35" style="display: block;" alt="WA">
                        </td>
                        <td style="vertical-align: middle; padding-left: 10px;">
                            <p
                                style="margin: 0; font-family: sans-serif; font-size: 14px; font-weight: bold; color: #4C556C;">
                                Estamos no WhatsApp!</p>
                            <p style="margin: 4px 0 0 0; font-family: sans-serif; font-size: 14px; color: #4C556C;">
                                Salve nosso número e chame sempre que precisar
                            </p>
                            <a href="https://wa.me/5547984178977"
                                style="color: #25D366; font-weight: bold; text-decoration: none;">(47)
                                98417-8977</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 20px;">
            <p style="font-size: 14px; margin-bottom: 5px;"><strong>NowBi</strong></p>
            <p style="font-size: 12px; margin: 0;">
                <a href="https://app.nowbi.com.br" style="color: #76B2FE; text-decoration: none;">app.nowbi.com.br</a> |
                Dashboard BI
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">
                Este é um e-mail automático. Por favor, não responda.
            </p>
        </div>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordChangedEmail = async (email: string) => {
  const mailOptions = {
    from: `"NowBi" <no-reply@nowbi.com.br>`,
    to: email,
    subject: "Sua senha foi alterada - NowBi",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; color: #4C556C; line-height: 1.5;">
        <div
            style="display: flex; align-items: center; background-color: #F6F8FA; padding: 1.5rem; border-radius: 8px 8px 0 0;">
            <table border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align: middle;">
        <img src="https://app.nowbi.com.br/logo.png" width="40" height="40" style="display: block;" alt="NowBi">
      </td>
      <td style="vertical-align: middle; padding-left: 12px;">
        <span style="font-family: sans-serif; font-size: 22px; font-weight: bold; color: #4C556C; line-height: 1;">NowBi</span>
      </td>
    </tr>
  </table>
        </div>

        <div style="padding: 20px;">
            <h2>Olá, ${email}</h2>
            <p>Este é um aviso de segurança para informar que a senha da sua conta no
                <a href="https://app.nowbi.com.br" style="text-decoration: none;"><strong
                        style="color: #76B2FE;">NowBi</strong></a>
                foi alterada recentemente.
            </p>

            <p>Se você realizou essa alteração, pode ignorar este e-mail com segurança.</p>

            <div
                style="padding: 1rem 1.5rem; border: 1px solid #ff3030; border-radius: .5rem; background-color: #fff9f9; margin: 20px 0;">
                <p style="margin: 0; color: #d32f2f;">
                    <strong>Caso você não reconheça essa mudança, entre em contato com nosso suporte
                        imediatamente!</strong>
                </p>
            </div>

            <div
                style="background-color: #EBF5FF; padding: 1.5rem; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="vertical-align: middle; width: 40px;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
                                width="35" height="35" style="display: block;" alt="WA">
                        </td>
                        <td style="vertical-align: middle; padding-left: 10px;">
                            <p
                                style="margin: 0; font-family: sans-serif; font-size: 14px; font-weight: bold; color: #4C556C;">
                                Estamos no WhatsApp!</p>
                            <p style="margin: 4px 0 0 0; font-family: sans-serif; font-size: 14px; color: #4C556C;">
                                Salve nosso número e chame sempre que precisar
                            </p>
                            <a href="https://wa.me/5547984178977"
                                style="color: #25D366; font-weight: bold; text-decoration: none;">(47)
                                98417-8977</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 20px;">
            <p style="font-size: 14px; margin-bottom: 5px;"><strong>NowBi</strong></p>
            <p style="font-size: 12px; margin: 0;">
                <a href="https://app.nowbi.com.br" style="color: #76B2FE; text-decoration: none;">app.nowbi.com.br</a> |
                Dashboard BI
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">
                Este é um e-mail automático. Por favor, não responda.
            </p>
        </div>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};