// src/config.js
const config = {
  provider: "huggingface",
  apiKey: null,
  model: "Qwen/Qwen2.5-7B-Instruct",
  maxRetries: 3,
  timeout: 30000,
  cacheEnabled: true,
  maxCacheSize: 100,
  defaultEmojis: 5,
  providers: {
    huggingface: {
      endpoint: "https://router.huggingface.co/v1",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
};

function getConfig() {
  return { ...config };
}

function updateConfig(newConfig) {
  Object.assign(config, newConfig);
  return config;
}

module.exports = {
  config,
  getConfig,
  updateConfig,
};
