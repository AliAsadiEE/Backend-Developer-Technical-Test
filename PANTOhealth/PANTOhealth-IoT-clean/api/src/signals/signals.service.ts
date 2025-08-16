import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Signal, SignalDocument } from './schemas/signal.schema';
import { CreateSignalDto } from './dto/create-signal.dto';
import { QuerySignalDto } from './dto/query-signal.dto';
import { NormalizedXray } from '../utils/xray-normalizer';
import { computeBBox, computeSpeedStats } from '../utils/stats.util';

@Injectable()
export class SignalsService {
  constructor(@InjectModel(Signal.name) private readonly model: Model<SignalDocument>) {}

  async create(dto: CreateSignalDto) { return this.model.create(dto); }

  async ingestXray(x: NormalizedXray, dataVolume: number) {
    const dataLength = x.data?.length ?? 0;
    const stats = { speed: computeSpeedStats(x.data), bbox: computeBBox(x.data) };
    return this.create({ deviceId: x.deviceId, time: x.time, dataLength, dataVolume, stats });
  }

  async findAll(q: QuerySignalDto) {
    const filter: any = {};
    if (q.deviceId) filter.deviceId = q.deviceId;
    if (q.from || q.to) filter.time = { ...(q.from ? { $gte: q.from } : {}), ...(q.to ? { $lte: q.to } : {}) };
    if (q.minDataLength) filter.dataLength = { $gte: q.minDataLength };
    const limit = q.limit ?? 50; const skip = q.skip ?? 0;
    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ time: -1 }).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter),
    ]);
    return { total, items };
  }

  async findOne(id: string) { return this.model.findById(id).lean(); }
  async update(id: string, patch: Partial<Signal>) { return this.model.findByIdAndUpdate(id, patch, { new: true }).lean(); }
  async remove(id: string) { await this.model.findByIdAndDelete(id); return { deleted: true }; }
}
