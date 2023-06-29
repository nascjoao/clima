function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default async function getUserCoordinates() {
  try {
    const { coords: { latitude, longitude } } = await getCurrentPosition();
    return {
      latitude,
      longitude
    };
  } catch {
    return null;
  }
}
