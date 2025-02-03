import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ExcludePasswordInterceptor } from './interceptors/exclude-password.interceptor';
import { TransformDaetesInterceptor } from './interceptors/transform-dates.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useBodyParser('text');
  app.useGlobalInterceptors(new ExcludePasswordInterceptor(), new TransformDaetesInterceptor());
  await app.listen(3000);
}
bootstrap();
