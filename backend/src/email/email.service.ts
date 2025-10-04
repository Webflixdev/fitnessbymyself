import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY')
    this.resend = new Resend(apiKey)
  }

  async sendPasswordResetCode(email: string, code: string, lang: string = 'en') {
    const subject = lang === 'es'
      ? 'Código de restablecimiento de contraseña'
      : 'Password Reset Code'

    const htmlContent = lang === 'es'
      ? `
        <h1>Código de restablecimiento de contraseña</h1>
        <p>Tu código de restablecimiento es: <strong>${code}</strong></p>
        <p>Este código expirará en 15 minutos.</p>
        <p>Si no solicitaste restablecer tu contraseña, ignora este email.</p>
      `
      : `
        <h1>Password Reset Code</h1>
        <p>Your password reset code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject,
        html: htmlContent,
      })

      if (error) {
        console.error('Error sending email:', error)
        throw new Error('Failed to send email')
      }

      console.log('Email sent successfully:', data)
      return data
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }
}
