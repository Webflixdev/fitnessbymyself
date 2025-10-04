import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class SignInDto {
  @IsEmail({}, { message: i18nValidationMessage('auth.validation.email_invalid') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.validation.email_required') })
  email: string

  @IsString({ message: i18nValidationMessage('auth.validation.field_string') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.validation.password_required') })
  @MinLength(8, { message: i18nValidationMessage('auth.validation.password_min_length') })
  password: string
}
