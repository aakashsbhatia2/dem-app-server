const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export function distanceBetween(a, b) {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function trackDistance(segments) {
  return segments.reduce((total, segment) => {
    let segmentTotal = 0;
    for (let i = 1; i < segment.length; i++) {
      segmentTotal += distanceBetween(segment[i - 1], segment[i]);
    }
    return total + segmentTotal;
  }, 0);
}
