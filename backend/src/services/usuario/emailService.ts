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
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Olá, ${email}</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no <a href="https://app.nowbi.com.br"><strong style="color: #76B2FE;">NowBi</strong>.</a></p>
        <p>Clique no botão abaixo para escolher uma nova senha. Este link é válido por 30 minutos.</p>
        <a href="${resetLink}" style="background-color: #76B2FE; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Redefinir senha
        </a>
        <p><strong>Se você não solicitou essa alteração, por favor entre em contato conosco.</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #4C556C;">Este é um e-mail automático, por favor não responda.</p>
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
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Olá, ${email}</h2>
        <p>Este é um aviso de segurança para informar que a senha da sua conta no <a href="https://app.nowbi.com.br"><strong style="color: #76B2FE;">NowBi</strong>.</a></p> foi alterada recentemente.</p>
        <p><strong>Se foi você quem fez essa alteração:</strong> Pode ignorar este e-mail com segurança.</p>
        <p><strong>Se você NÃO alterou sua senha:</strong> Por favor, entre em contato com nosso suporte imediatamente!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #4C556C;">Este é um e-mail automático de segurança.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};