function getCurrentPosition() {
  let currentPosition: GeolocationPosition | object = {};
  navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
    currentPosition = position;
  });
  return currentPosition;
}

export default function getUserCoordinates() {
  try {
    const { coords: { latitude, longitude } } = getCurrentPosition() as GeolocationPosition;
    return {
      latitude,
      longitude
    };
  } catch {
    return null;
  }
}
