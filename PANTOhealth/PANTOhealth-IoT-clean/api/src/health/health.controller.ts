import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  liveness() {
    return { ok: true };
  }

  @Get('ready')
  readiness() {
    // In real-world you could check Mongo/Rabbit connectivity; kept simple here
    return { ready: true };
  }
}
