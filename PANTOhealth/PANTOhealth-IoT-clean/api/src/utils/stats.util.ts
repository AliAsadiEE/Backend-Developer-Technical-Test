export function computeSpeedStats(data: Array<[number, [number, number, number]]>) {
  if (!data?.length) return { min: 0, max: 0, avg: 0 };
  let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY, sum = 0;
  for (const [, [, , speed]] of data) {
    min = Math.min(min, speed);
    max = Math.max(max, speed);
    sum += speed;
  }
  return { min, max, avg: sum / data.length };
}

export function computeBBox(data: Array<[number, [number, number, number]]>) {
  if (!data?.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [, [x, y]] of data) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, maxX, minY, maxY };
}
