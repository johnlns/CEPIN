import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

export async function sendOTPEmail(email: string, code: string) {
  const mailOptions = {
    from: 'CEPIN <onboarding@resend.dev>',
    to: email,
    subject: 'Código de Acesso - CEPIN',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A90E2;">CEPIN</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: -10px;">Academia para bebês, crianças e adolescentes</p>
        <p>Olá!</p>
        <p>Seu código de acesso é:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 4px; margin: 0;">${code}</h1>
        </div>
        <p>Este código é válido por 10 minutos.</p>
        <p>Se você não solicitou este código, ignore este email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">CEPIN - Academia para Crianças</p>
      </div>
    `,
  }
// ==== MODO DEV: sem SMTP, apenas loga o código no terminal ====
if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
  console.log(`[DEV] OTP para ${email}: ${code}`);
  return;
}

  await transporter.sendMail(mailOptions)
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: 'CEPIN <onboarding@resend.dev>',
    to: email,
    subject: 'Bem-vindo à CEPIN - Academia para Crianças!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A90E2;">CEPIN</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: -10px;">Academia para bebês, crianças e adolescentes</p>
        <p>Olá ${name}!</p>
        <p>Bem-vindo ao nosso sistema de gestão!</p>
        <p>Agora você pode acessar todas as funcionalidades disponíveis para o seu perfil.</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Próximos passos:</h3>
          <ul style="color: #1f2937;">
            <li>Explore o painel administrativo</li>
            <li>Configure suas preferências</li>
            <li>Entre em contato conosco se precisar de ajuda</li>
          </ul>
        </div>
        <p>Obrigado por escolher a CEPIN!</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">CEPIN - Academia para Crianças</p>
      </div>
    `,
  }
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.log(`[DEV] E-mail de boas-vindas -> ${email} (simulado)`);
    return;
  }
  
  await transporter.sendMail(mailOptions)
}
