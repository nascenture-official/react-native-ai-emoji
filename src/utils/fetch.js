// src/utils/fetch.js
function fetchWithTimeout(url, options = {}) {
  const timeout = options.timeout || 30000;

  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const fetchOptions = {
      ...options,
      signal: controller.signal,
    };

    global
      .fetch(url, fetchOptions)
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          const abortError = new Error("Request timeout");
          abortError.name = "AbortError";
          reject(abortError);
        } else {
          reject(error);
        }
      });
  });
}

module.exports = fetchWithTimeout;
