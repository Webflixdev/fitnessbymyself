import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common'
import type { Request } from 'express'
import { AuthService } from './auth.service'
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto, VerifyResetCodeDto } from './dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint para registrar un nuevo usuario.
   * @param signUpDto - DTO con email, password y name.
   * @returns Un objeto con accessToken y refreshToken.
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // Devuelve un 201 en lugar de 200 por defecto
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  /**
   * Endpoint para iniciar sesión.
   * @param signInDto - DTO con email y password.
   * @returns Un objeto con accessToken y refreshToken.
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  /**
   * Endpoint para cerrar sesión.
   * Requiere un accessToken válido.
   */
  @UseGuards(AuthGuard('jwt')) // 🛡️ Protegido con el Guard del accessToken
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    // El Guard 'jwt' añade el objeto 'user' a la request
    const user = req.user as { sub: number }
    return this.authService.logout(user.sub)
  }

  /**
   * Endpoint para refrescar los tokens.
   * Requiere un refreshToken válido.
   */
  @UseGuards(AuthGuard('jwt-refresh')) // 🛡️ Protegido con el Guard del refreshToken
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    // El Guard 'jwt-refresh' añade el objeto 'user' con el refreshToken a la request
    const user = req.user as { sub: number; refreshToken: string }
    return this.authService.refreshTokens(user.sub, user.refreshToken)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(verifyResetCodeDto)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }
}
