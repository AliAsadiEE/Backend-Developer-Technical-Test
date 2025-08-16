import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { SignalsModule } from './signals/signals.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';  // 👈 اضافه شده

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongo:27017/pantohealth'),
    SignalsModule,
    RabbitmqModule,
    HealthModule,  // 👈 اضافه شده
  ],
})
export class AppModule {}
