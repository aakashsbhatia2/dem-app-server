export function isLatLng(value) {
  return (
    typeof value?.latitude === "number" &&
    typeof value?.longitude === "number" &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180
  );
}
