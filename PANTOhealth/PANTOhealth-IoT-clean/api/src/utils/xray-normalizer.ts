export type RawXray = any;

export interface NormalizedXray {
  deviceId: string;
  time: number;
  data: Array<[number, [number, number, number]]>;
}

export function normalizeXrayPayload(raw: RawXray): NormalizedXray {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid xray payload');
  if ('deviceId' in raw && 'data' in raw) return raw as NormalizedXray;
  const keys = Object.keys(raw);
  if (keys.length !== 1) throw new Error('Ambiguous xray root keys');
  const deviceId = keys[0];
  const inner = (raw as any)[deviceId];
  if (!inner?.data || typeof inner.time !== 'number') throw new Error('Malformed xray inner object');
  return { deviceId, time: inner.time, data: inner.data } as NormalizedXray;
}
