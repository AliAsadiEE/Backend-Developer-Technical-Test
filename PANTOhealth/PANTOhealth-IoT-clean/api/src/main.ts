import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const cfg = new DocumentBuilder()
    .setTitle('PANTOhealth Signals API')
    .setDescription('CRUD + filtering for x-ray signals')
    .setVersion('1.0.0')
    .build();
  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('docs', app, doc);

  const port = process.env.PORT || '3000';
  await app.listen(port as any, '0.0.0.0');
  console.log(`API listening on ${port}. Swagger at /docs`);
}
bootstrap();
