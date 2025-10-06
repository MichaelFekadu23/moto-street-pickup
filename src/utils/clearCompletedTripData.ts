export function clearCompletedTripData() {
  const keep = new Set(['moto_name', 'moto_phone', 'moto_rideId', 'moto_language']);
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('moto_') && !keep.has(key)) {
      localStorage.removeItem(key);
    }
  });
}
