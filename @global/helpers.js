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

export const waitScript = (src, isModule = false) => {
  return new Promise((resolve) => {
    console.info("Loading script:", src);
    const script = document.createElement("script");
    script.src = src;
    if (isModule) {
      script.type = "module";
    }
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const waitStyle = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};
