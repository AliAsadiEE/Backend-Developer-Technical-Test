import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Signal, SignalSchema } from './schemas/signal.schema';
import { SignalsService } from './signals.service';
import { SignalsController } from './signals.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }])],
  providers: [SignalsService],
  controllers: [SignalsController],
  exports: [SignalsService],   // ⬅️ باید باشد
})
export class SignalsModule {}
