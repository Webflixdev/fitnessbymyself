// backend/src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SignUpDto, SignInDto } from './dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

// Definimos los tipos para los tokens para mayor claridad
type Tokens = {
  accessToken: string
  refreshToken: string
}

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

    const tokens = await this.getTokens(user.id, user.email)
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

    const tokens = await this.getTokens(user.id, user.email)
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

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  // --- Helpers ---
  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    })
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' } // Secret para Access Token
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' } // Secret para Refresh Token
      ),
    ])

    return { accessToken, refreshToken }
  }
}
