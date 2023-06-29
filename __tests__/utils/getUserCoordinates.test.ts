import getUserCoordinates from '../../utils/getUserCoordinates';

test('Should return latitude and longitude as numbers in an object', async () => {
  const coordinates = await getUserCoordinates() as { latitude: number, longitude: number };
  expect(coordinates).toHaveProperty('latitude');
  expect(coordinates).toHaveProperty('longitude');
  expect(typeof coordinates.latitude).toBe('number');
  expect(typeof coordinates.longitude).toBe('number');
});

test('Should return null if geolocation does not exist on navigator', async () => {
  const originalGeolocation = navigator.geolocation;
  Object.defineProperty(navigator, 'geolocation', {
    value: undefined
  });
  await expect(getUserCoordinates()).resolves.not.toThrow();
  expect(await getUserCoordinates()).toBeNull();
  Object.defineProperty(navigator, 'geolocation', {
    value: originalGeolocation
  });
});
