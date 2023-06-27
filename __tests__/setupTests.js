const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementation((success) => Promise.resolve(success({
      coords: {
        latitude: 42.12345,
        longitude: -71.98765,
      }
    }))),
};

global.navigator.geolocation = mockGeolocation;
