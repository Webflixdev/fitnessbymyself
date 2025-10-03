// backend/src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, VerifyResetCodeDto } from './dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

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
    private readonly jwtService: JwtService
  ) {}

  async signUp(dto: SignUpDto): Promise<Tokens> {
    const { email, password, name } = dto

    const userExists = await this.prisma.user.findUnique({ where: { email } })
    if (userExists) {
      throw new ForbiddenException('Credentials taken')
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

  async signIn(dto: SignInDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const tokens = await this.getTokens(user.id, user.email, user.name)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: number): Promise<boolean> {
    // Al hacer logout, simplemente borramos el hash del refresh token
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

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied')

    const rtMatches = await bcrypt.compare(rt, user.hashedRt)
    if (!rtMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user.id, user.email, user.name)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      return { message: 'If the email exists, a reset code has been sent' }
    }

    const resetCode = Math.floor(RESET_CODE_MIN + Math.random() * (RESET_CODE_MAX - RESET_CODE_MIN)).toString()
    const expiresAt = new Date(Date.now() + RESET_CODE_EXPIRATION_MS)

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetCode,
        resetPasswordExpires: expiresAt,
      },
    })

    console.log(`Reset code for ${dto.email}: ${resetCode}`)

    return { message: 'If the email exists, a reset code has been sent' }
  }

  async verifyResetCode(dto: VerifyResetCodeDto): Promise<{ valid: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new UnauthorizedException('Invalid or expired reset code')
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Reset code has expired')
    }

    if (user.resetPasswordToken !== dto.code) {
      throw new UnauthorizedException('Invalid reset code')
    }

    return { valid: true }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new UnauthorizedException('Invalid or expired reset code')
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Reset code has expired')
    }

    if (user.resetPasswordToken !== dto.code) {
      throw new UnauthorizedException('Invalid reset code')
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

    return { message: 'Password has been reset successfully' }
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
