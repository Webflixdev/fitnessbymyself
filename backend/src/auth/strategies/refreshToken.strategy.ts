// backend/src/auth/strategies/refreshToken.strategy.ts
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express' // 👈 Make sure this import exists
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET || '',
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: any) {
    // Safely get the token
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim()

    // If no token is found, reject the request
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing')
    }

    return { ...payload, refreshToken }
  }
}
