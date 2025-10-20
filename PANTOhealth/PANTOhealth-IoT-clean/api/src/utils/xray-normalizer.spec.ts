import { normalizeXrayPayload } from './xray-normalizer';

describe('normalizeXrayPayload', () => {
  it('normalizes flat shape { deviceId, time, data }', () => {
    const n = normalizeXrayPayload({ deviceId: 'd1', time: 123, data: [[1, [0,0,0]]] });
    expect(n.deviceId).toBe('d1');
    expect(n.time).toBe(123);
    expect(n.data.length).toBe(1);
  });

  it('normalizes keyed shape { "<id>": { time, data } }', () => {
    const n = normalizeXrayPayload({ devA: { time: 7, data: [] } });
    expect(n.deviceId).toBe('devA');
    expect(n.time).toBe(7);
    expect(n.data).toEqual([]);
  });

  it('throws on malformed payload', () => {
    // @ts-expect-error
    expect(() => normalizeXrayPayload(null)).toThrow();
    expect(() => normalizeXrayPayload({})).toThrow();
    // missing fields
    expect(() => normalizeXrayPayload({ x: {} })).toThrow();
  });
});
