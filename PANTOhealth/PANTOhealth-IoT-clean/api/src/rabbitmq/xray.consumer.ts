import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';
import { SignalsService } from '../signals/signals.service';
import { normalizeXrayPayload } from '../utils/xray-normalizer';

@Injectable()
export class XrayConsumer implements OnModuleInit {
  private readonly logger = new Logger(XrayConsumer.name);
  constructor(
    private readonly cfg: ConfigService,
    private readonly rmq: RabbitmqService,
    private readonly signals: SignalsService,
  ) {}

  async onModuleInit() {
    await this.rmq.waitUntilReady();
    const queue = this.cfg.get<string>('rabbitmq.xrayQueue') || process.env.RABBITMQ_XRAY_QUEUE || 'xray';
    const dlq = process.env.RABBITMQ_DLQ || 'xray.dlq';
    const ch = this.rmq.getChannel();

    await ch.assertQueue(dlq, { durable: true });

    await ch.consume(queue, async (msg) => {
      if (!msg) return;
      const raw = msg.content.toString('utf8');
      try {
        const payload = JSON.parse(raw);
        const normalized = normalizeXrayPayload(payload);
        const dataVolume = Buffer.byteLength(raw, 'utf8');
        await this.signals.ingestXray(normalized, dataVolume);
        ch.ack(msg);
      } catch (err) {
        this.logger.error(`Failed to process message, sending to DLQ: ${err}`);
        ch.sendToQueue(dlq, Buffer.from(raw), { persistent: true, contentType: 'application/json' });
        ch.nack(msg, false, false); // drop original
      }
    });

    this.logger.log(`Consuming xray messages from queue: ${queue}`);
  }
}
