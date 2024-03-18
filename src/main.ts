import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationTypePipe } from './pipes/validator-type.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter()); // 异常过滤器
  app.useGlobalInterceptors(new TransformInterceptor()); // 响应拦截
  app.useGlobalPipes(new ValidationTypePipe());
  await app.listen(4433);
}
bootstrap();
