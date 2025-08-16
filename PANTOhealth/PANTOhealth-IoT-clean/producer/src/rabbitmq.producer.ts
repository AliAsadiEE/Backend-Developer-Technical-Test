import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import * as fs from 'fs';
import * as path from 'path';

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

@Injectable()
export class Producer implements OnModuleInit {
  private readonly logger = new Logger(Producer.name);
  constructor(private readonly cfg: ConfigService) {}

  async onModuleInit() {
    const url = this.cfg.get<string>('RABBITMQ_URL');
    const queue = this.cfg.get<string>('RABBITMQ_XRAY_QUEUE');
    const mode = this.cfg.get<string>('PRODUCER_MODE') ?? 'single';
    const delay = parseInt(this.cfg.get<string>('STREAM_DELAY_MS') ?? '200', 10);

    // retry connect
    let ch: any, conn: any;
    for (let i=1;i<=30;i++){
      try {
        conn = await amqp.connect(url as string);
        ch = await conn.createChannel();
        await ch.assertQueue(queue as string, { durable: true });
        break;
      } catch (e) {
        this.logger.warn(`Producer connect attempt ${i}/30 failed: ${e}`);
        await sleep(1000);
      }
    }
    if (!ch) throw new Error('Producer could not connect to RabbitMQ');

    const file = path.resolve(__dirname, 'sample', 'x-ray.json');
    const json = fs.readFileSync(file, 'utf8');
    const payload = JSON.parse(json);

    if (mode === 'stream') {
      const entries = Object.entries(payload);
      for (const [deviceId, obj] of entries) {
        const msg = JSON.stringify({ [deviceId]: obj });
        ch.sendToQueue(queue as string, Buffer.from(msg), { persistent: true, contentType: 'application/json' });
        this.logger.log(`Streamed chunk for device ${deviceId}`);
        await sleep(delay);
      }
    } else {
      ch.sendToQueue(queue as string, Buffer.from(json), { persistent: true, contentType: 'application/json' });
      this.logger.log('Published single x-ray message');
    }

    await ch.close();
    await conn.close();
  }
}
