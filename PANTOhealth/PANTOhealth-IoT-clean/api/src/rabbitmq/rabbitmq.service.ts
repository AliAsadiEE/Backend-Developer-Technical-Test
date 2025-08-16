import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private conn?: amqp.Connection;
  private channel?: amqp.Channel;
  private readyPromise!: Promise<void>;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('rabbitmq.url') || process.env.RABBITMQ_URL;
    const queue = this.config.get<string>('rabbitmq.xrayQueue') || process.env.RABBITMQ_XRAY_QUEUE || 'xray';

    this.readyPromise = (async () => {
      const maxAttempts = 30;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          this.conn = await amqp.connect(url as string);
          this.channel = await this.conn.createChannel();
          await this.channel.assertQueue(queue as string, { durable: true });
          await this.channel.prefetch(10);
          this.logger.log(`Connected to RabbitMQ. Queue asserted: ${queue}`);
          return;
        } catch (err) {
          this.logger.warn(`RabbitMQ connect attempt ${attempt}/${maxAttempts} failed: ${err}`);
          await sleep(1000);
        }
      }
      throw new Error('Unable to connect to RabbitMQ after retries');
    })();

    await this.readyPromise;
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.conn?.close().catch(() => undefined);
  }

  async waitUntilReady() {
    if (this.readyPromise) {
      await this.readyPromise;
    } else {
      throw new Error('RabbitMQ not initializing');
    }
  }

  getChannel(): amqp.Channel {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    return this.channel;
  }
}
