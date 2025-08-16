import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';
import { XrayConsumer } from './xray.consumer';
import { SignalsModule } from '../signals/signals.module';

@Module({
  imports: [
    ConfigModule,     // برای دسترسی به env
    SignalsModule,    // ⬅️ این لازم است تا SignalsService قابل تزریق باشد
  ],
  providers: [RabbitmqService, XrayConsumer],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
