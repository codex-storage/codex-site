export const waitForVariable = (V, checkInterval = 100) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window[V] !== undefined) {
        clearInterval(interval);
        resolve(window[V]);
      }
    }, checkInterval);
  });
};
