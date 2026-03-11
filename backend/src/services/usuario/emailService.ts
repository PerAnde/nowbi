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
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARpSURBVHgB1VlfbFNVGP995/QvbLWlm0KIqIShLkQiTkn2whI0UR80+OJCMCEhhIT4oj744pMx8UEfjCb6IMYXfMCYqZgQUSMmyIMRI0YdLiA4EBiw0rXb2rW99x7Ot9PSrml7L1u7lt+y3nvuPd93f+c73/m+755LMKDBN75cv7r38YOKsAVQQqE+glJizrJARGg2tEatlSxS+G381Ocvnfz01f/0ZYefRDtHZl6zr2XfyeWyTjwWEVJ3VdXilS3dVHVHoqrkVA0dqiFV23GQSKaccCQilHL2HdoTP0Bb9h/Y0Ld5x5mAT6kH1sYpV0BHIBgAzl6YVMrnpz9+/WwN7Xjvws8O1OAjD62jXF6hkxAKEn7/e1xJH30rSMpHV0UjlO8QS1aCDbcq2k1C+LcJKFtIIdDYb9oHwdwc269/SXUmxTKU/hPlZvNDTTMhvHZksxfs9g3HE9FMHujrAXY+BlgO2gJf+bS2p7Ilt94H7Bowthy4F9j/hUJ3EMsKV4tmC0yUFmSiB+/GssOVKKdL2zHHEiwbyw4fWgQe3FTWDPCuECCLJuHDxDSwQqdIdne+5yU+toSorimwaQ2w+wkzDZ/8ovDPVU1SN1M54ONhgk8zPnMdePeYQjTsrtNzeLodTM4akmwpNtaerYTrM8bfX9lGkEU36usF1se96WyJRf3SHCv9mqeeCc7mF/atbtdDSyxay+eYc0Cb5YPjCpdT2j10nyOngWQGntCyxVQPvV3AW9+reTeIrzSLyguaQpRXuPQ4N2ztiF7pKwPeZRiLmvqS7/EqTs8Bz/Sbh+csd9k53YdX+dMPG1nhsXhYlEVLPjg5Y0INN7f3AR+dUDifqCNTlOu/B9g3aGSe3AjsPaSL4xVwxZIW0+a15lh6hXu2n5Bp8KbAfrl9owlbJUMycS9wT6EN7tlOVT/VOMvUTMceqzFXop1S/ReJMp2ll8SLGZRX3yv26+zXEEbFgFo7yUs1RUtSaCvgvpi0oX1y4TVZbMsa88GWc+romddV9UQh0RyiYb8uHkbVrYcx/rpijqculUkwwSOjJneH9MPHk2Vy/07qvSS/0XV0bKGu0Ql4Ar3w/sVMLBoJ98QiWri2nxY47ensMbCO8PWfJpNw9cPxkKuf5zcRTl5U8+dcITHphD4f2mCC+09nFXq6DLm81hUr6vpK64oXddUkpxVdS6QwlZ4ueCJagq1wq+itvs45u/pWSR2Rd131iLq+LleinuJ61xvt88rbDAN34qrv4KBPhmhxhjp3T4/0hwVBQlqW04YdBQ9gC1q2zcE2KywrdyJxI62Cgc6aeo5AAT8hmUwry84dFf+PfrerOxqlsfNXFe+ZC/P9pK3/vMkcDgmcPndFxVbH6fg3b+9lM8rhg+nnfHBGpiaSKhbtovnt6OoRovZyq/Vxxk3GTc7W1XVqetaO9fbImQCeGnmx61ipn7x/aHd3//CbH4YK/iGdi3S+oDbthGruJDNZK/XDuR8Pvzx2+HV+87dvAiBqjEbpdlFTAAAAAElFTkSuQmCC"
                width="42" height="42" alt="NowBi Logo">
            <span style="font-size: 1.4rem; font-weight: bold; margin-left: 10px; color: #4C556C;">NowBi</span>
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
                    width="35" height="35" alt="WhatsApp">
                <div>
                    <p style="margin: 0; font-weight: bold;">Estamos no WhatsApp!</p>
                    <p style="margin: 5px 0 0 0;">Salve nosso número e chame sempre que precisar:
                    </p>
                    <a href="https://wa.me/5547984178977"
                        style="color: #25D366; font-weight: bold; text-decoration: none;">(47) 98417-8977</a>
                </div>
            </div>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 20px;">
            <p style="font-size: 14px; margin-bottom: 5px;"><strong>NowBi</strong></p>
            <p style="font-size: 12px; margin: 0;">
                <a href="https://app.nowbi.com.br" style="color: #76B2FE; text-decoration: none;">app.nowbi.com.br</a> |
                Dashboard BI
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">
                Este é um e-mail automáticamente. Por favor, não responda a este e-mail.
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
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARpSURBVHgB1VlfbFNVGP995/QvbLWlm0KIqIShLkQiTkn2whI0UR80+OJCMCEhhIT4oj744pMx8UEfjCb6IMYXfMCYqZgQUSMmyIMRI0YdLiA4EBiw0rXb2rW99x7Ot9PSrml7L1u7lt+y3nvuPd93f+c73/m+755LMKDBN75cv7r38YOKsAVQQqE+glJizrJARGg2tEatlSxS+G381Ocvnfz01f/0ZYefRDtHZl6zr2XfyeWyTjwWEVJ3VdXilS3dVHVHoqrkVA0dqiFV23GQSKaccCQilHL2HdoTP0Bb9h/Y0Ld5x5mAT6kH1sYpV0BHIBgAzl6YVMrnpz9+/WwN7Xjvws8O1OAjD62jXF6hkxAKEn7/e1xJH30rSMpHV0UjlO8QS1aCDbcq2k1C+LcJKFtIIdDYb9oHwdwc269/SXUmxTKU/hPlZvNDTTMhvHZksxfs9g3HE9FMHujrAXY+BlgO2gJf+bS2p7Ilt94H7Bowthy4F9j/hUJ3EMsKV4tmC0yUFmSiB+/GssOVKKdL2zHHEiwbyw4fWgQe3FTWDPCuECCLJuHDxDSwQqdIdne+5yU+toSorimwaQ2w+wkzDZ/8ovDPVU1SN1M54ONhgk8zPnMdePeYQjTsrtNzeLodTM4akmwpNtaerYTrM8bfX9lGkEU36usF1se96WyJRf3SHCv9mqeeCc7mF/atbtdDSyxay+eYc0Cb5YPjCpdT2j10nyOngWQGntCyxVQPvV3AW9+reTeIrzSLyguaQpRXuPQ4N2ztiF7pKwPeZRiLmvqS7/EqTs8Bz/Sbh+csd9k53YdX+dMPG1nhsXhYlEVLPjg5Y0INN7f3AR+dUDifqCNTlOu/B9g3aGSe3AjsPaSL4xVwxZIW0+a15lh6hXu2n5Bp8KbAfrl9owlbJUMycS9wT6EN7tlOVT/VOMvUTMceqzFXop1S/ReJMp2ll8SLGZRX3yv26+zXEEbFgFo7yUs1RUtSaCvgvpi0oX1y4TVZbMsa88GWc+romddV9UQh0RyiYb8uHkbVrYcx/rpijqculUkwwSOjJneH9MPHk2Vy/07qvSS/0XV0bKGu0Ql4Ar3w/sVMLBoJ98QiWri2nxY47ensMbCO8PWfJpNw9cPxkKuf5zcRTl5U8+dcITHphD4f2mCC+09nFXq6DLm81hUr6vpK64oXddUkpxVdS6QwlZ4ueCJagq1wq+itvs45u/pWSR2Rd131iLq+LleinuJ61xvt88rbDAN34qrv4KBPhmhxhjp3T4/0hwVBQlqW04YdBQ9gC1q2zcE2KywrdyJxI62Cgc6aeo5AAT8hmUwry84dFf+PfrerOxqlsfNXFe+ZC/P9pK3/vMkcDgmcPndFxVbH6fg3b+9lM8rhg+nnfHBGpiaSKhbtovnt6OoRovZyq/Vxxk3GTc7W1XVqetaO9fbImQCeGnmx61ipn7x/aHd3//CbH4YK/iGdi3S+oDbthGruJDNZK/XDuR8Pvzx2+HV+87dvAiBqjEbpdlFTAAAAAElFTkSuQmCC"
                width="42" height="42" alt="NowBi Logo">
            <span style="font-size: 1.4rem; font-weight: bold; margin-left: 10px; color: #4C556C;">NowBi</span>
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
                    width="35" height="35" alt="WhatsApp">
                <div>
                    <p style="margin: 0; font-weight: bold;">Estamos no WhatsApp!</p>
                    <p style="margin: 5px 0 0 0;">Salve nosso número e chame sempre que precisar:
                    </p>
                    <a href="https://wa.me/5547984178977"
                        style="color: #25D366; font-weight: bold; text-decoration: none;">(47) 98417-8977</a>
                </div>
            </div>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 20px;">
            <p style="font-size: 14px; margin-bottom: 5px;"><strong>NowBi</strong></p>
            <p style="font-size: 12px; margin: 0;">
                <a href="https://app.nowbi.com.br" style="color: #76B2FE; text-decoration: none;">app.nowbi.com.br</a> |
                Dashboard BI
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">
                Este é um e-mail automáticamente. Por favor, não responda a este e-mail.
            </p>
        </div>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};