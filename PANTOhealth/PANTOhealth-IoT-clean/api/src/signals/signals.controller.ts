import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignalsService } from './signals.service';
import { CreateSignalDto } from './dto/create-signal.dto';
import { QuerySignalDto } from './dto/query-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';

@ApiTags('signals')
@Controller('signals')
export class SignalsController {
  constructor(private readonly svc: SignalsService) {}

  @Post() create(@Body() dto: CreateSignalDto) { return this.svc.create(dto); }
  @Get() list(@Query() q: QuerySignalDto) { return this.svc.findAll(q); }
  @Get(':id') get(@Param('id') id: string) { return this.svc.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateSignalDto) { return this.svc.update(id, dto as any); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
