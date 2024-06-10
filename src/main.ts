import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationTypePipe } from './pipes/validator-type.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/static/', //设置虚拟路径
  });
  app.useGlobalFilters(new HttpExceptionFilter()); // 异常过滤器
  app.useGlobalInterceptors(new TransformInterceptor()); // 响应拦截
  app.useGlobalPipes(new ValidationTypePipe());
  const config = new DocumentBuilder()
    .setTitle('loopyBot API')
    .setDescription('The loopyBot API description')
    .setVersion('1.0')
    .addTag('loopyBot')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(4433);
}
bootstrap();
