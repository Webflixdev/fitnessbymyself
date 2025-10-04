import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  SignUpDto,
  SignInDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from './dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { EmailService } from '../email/email.service'
import { I18nService } from 'nestjs-i18n'
import { Language } from '@shared/enums/language.enum'

type Tokens = {
  accessToken: string
  refreshToken: string
}

const RESET_CODE_EXPIRATION_MS = 15 * 60 * 1000
const RESET_CODE_MIN = 100000
const RESET_CODE_MAX = 999999

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly i18n: I18nService
  ) {}

  async signUp(dto: SignUpDto, lang: Language = Language.EN): Promise<Tokens> {
    const { email, password, name } = dto

    const userExists = await this.prisma.user.findUnique({ where: { email } })
    if (userExists) {
      throw new ForbiddenException(
        this.i18n.t('auth.credentials_taken', { lang })
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    const tokens = await this.getTokens(user.id, user.email, user.name)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async signIn(dto: SignInDto, lang: Language = Language.EN): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_credentials', { lang })
      )
    }

    const tokens = await this.getTokens(user.id, user.email, user.name)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
    return true
  }

  async refreshTokens(
    userId: number,
    rt: string,
    lang: Language = Language.EN
  ): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.hashedRt) {
      throw new ForbiddenException(this.i18n.t('auth.access_denied', { lang }))
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt)
    if (!rtMatches) {
      throw new ForbiddenException(this.i18n.t('auth.access_denied', { lang }))
    }

    const tokens = await this.getTokens(user.id, user.email, user.name)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
    lang: Language = Language.EN
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      return {
        message: this.i18n.t('auth.reset_code_sent', { lang }),
      }
    }

    const resetCode = Math.floor(
      RESET_CODE_MIN + Math.random() * (RESET_CODE_MAX - RESET_CODE_MIN)
    ).toString()
    const expiresAt = new Date(Date.now() + RESET_CODE_EXPIRATION_MS)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetCode,
        resetPasswordExpires: expiresAt,
      },
    })

    try {
      await this.emailService.sendPasswordResetCode(dto.email, resetCode, lang)
    } catch (error) {
      console.error('Error sending reset email:', error)
    }

    return {
      message: this.i18n.t('auth.reset_code_sent', { lang }),
    }
  }

  async verifyResetCode(
    dto: VerifyResetCodeDto,
    lang: Language = Language.EN
  ): Promise<{ valid: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_or_expired_code', { lang })
      )
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException(
        this.i18n.t('auth.reset_code_expired', { lang })
      )
    }

    if (user.resetPasswordToken !== dto.code) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_reset_code', { lang })
      )
    }

    return { valid: true }
  }

  async resetPassword(
    dto: ResetPasswordDto,
    lang: Language = Language.EN
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_or_expired_code', { lang })
      )
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException(
        this.i18n.t('auth.reset_code_expired', { lang })
      )
    }

    if (user.resetPasswordToken !== dto.code) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_reset_code', { lang })
      )
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    return {
      message: this.i18n.t('auth.password_reset_success', { lang }),
    }
  }

  // --- Helpers ---
  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    })
  }

  private async getTokens(
    userId: number,
    email: string,
    name: string
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, name },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1y' } // Secret para Access Token
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' } // Secret para Refresh Token
      ),
    ])

    return { accessToken, refreshToken }
  }
}
