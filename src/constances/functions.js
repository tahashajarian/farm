import { Vector3 } from 'three';

export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

let looped = 0
export const randomRangeWithoutOverlap = (start, end, count, range) => {
  const points = [];
  for (let i = 0; points.length < count; i++) {
    if (looped >= count * 20) return points;
    looped++
    const point = new Vector3(
      randomNumber(start.x, end.x),
      0,
      randomNumber(start.z, end.z)
    );
    let overlap = false;
    for (let j = 0; j < points.length; j++) {
      if (point.distanceTo(points[j]) <= range) {
        overlap = true;
      }
    }
    if (!overlap) points.push(point);

  }
  return points;
}




