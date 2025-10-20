import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Producer } from './rabbitmq.producer';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true })], providers: [Producer] })
export class AppModule {}
