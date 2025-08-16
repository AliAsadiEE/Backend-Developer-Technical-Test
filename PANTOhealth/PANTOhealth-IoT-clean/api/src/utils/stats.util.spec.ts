import { computeSpeedStats, computeBBox } from './stats.util';

describe('stats.util', () => {
  it('computes speed stats', () => {
    const data: Array<[number, [number, number, number]]> = [
      [1, [0, 0, 1]],
      [2, [0, 0, 3]],
      [3, [0, 0, 2]],
    ];
    const s = computeSpeedStats(data);
    expect(s.min).toBe(1);
    expect(s.max).toBe(3);
    expect(s.avg).toBeCloseTo(2, 5);
  });

  it('computes bbox', () => {
    const data: Array<[number, [number, number, number]]> = [
      [1, [1, 5, 0]],
      [2, [3, 2, 0]],
      [3, [2, 8, 0]],
    ];
    const b = computeBBox(data);
    expect(b).toEqual({ minX: 1, maxX: 3, minY: 2, maxY: 8 });
  });
});
