import getUserCoordinates from '../../utils/getUserCoordinates';

test('Should return latitude and longitude as numbers in an object', () => {
  const coordinates = getUserCoordinates() as { latitude: number, longitude: number };
  expect(coordinates).toHaveProperty('latitude');
  expect(coordinates).toHaveProperty('longitude');
  expect(typeof coordinates.latitude).toBe('number');
  expect(typeof coordinates.longitude).toBe('number');
});

test('Should return null if geolocation does not exist on navigator', () => {
  const originalGeolocation = navigator.geolocation;
  Object.defineProperty(navigator, 'geolocation', {
    value: undefined
  });
  expect(() => getUserCoordinates()).not.toThrow();
  expect(getUserCoordinates()).toBeNull();
  Object.defineProperty(navigator, 'geolocation', {
    value: originalGeolocation
  });
});
