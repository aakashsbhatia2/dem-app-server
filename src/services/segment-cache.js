const MAX_CACHED_SEGMENTS = 1000;

const segments = new Map();

const segmentKey = (from, to) =>
  `${from.latitude},${from.longitude}|${to.latitude},${to.longitude}`;

export function getCachedSegment(from, to) {
  return segments.get(segmentKey(from, to));
}

export function cacheSegment(from, to, segment) {
  segments.set(segmentKey(from, to), segment);
  if (segments.size > MAX_CACHED_SEGMENTS) {
    segments.delete(segments.keys().next().value);
  }
}
