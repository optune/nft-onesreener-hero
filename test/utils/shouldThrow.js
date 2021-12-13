function shouldThrow(func, errorMessage) {
  return new Promise((resolve) => {
    func()
      .then(() => {
        assert(false, "Function did not throw error");
        resolve();
      })
      .catch((error) => {
        assert.include(error.message, errorMessage);
        resolve();
      });
  });
}

module.exports = {
  shouldThrow,
};
