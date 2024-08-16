expect.extend({
  toBeValidUrl(received) {
    try {
      new URL(received);
      return {
        message: () => `expected ${received} to be an invalid URL`,
        pass: true,
      };
    } catch (e) {
      return {
        message: () => `expected ${received} to be a valid URL`,
        pass: false,
      };
    }
  },
});
