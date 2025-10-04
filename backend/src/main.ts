import 'tsconfig-paths/register'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
    })
  )
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    })
  )
  app.enableCors(true)
  const PORT = 3000
  await app.listen(PORT)
}
bootstrap()
