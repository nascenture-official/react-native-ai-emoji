const EMOTIONS = {
  JOY: "joy",
  SADNESS: "sadness",
  ANGER: "anger",
  FEAR: "fear",
  LOVE: "love",
  SURPRISE: "surprise",
  NEUTRAL: "neutral",
  DISGUST: "disgust",
};

const PROVIDERS = {
  HUGGINGFACE: "huggingface",
};

const DEFAULT_CONFIG = {
  provider: PROVIDERS.HUGGINGFACE,
  model: "j-hartmann/emotion-english-distilroberta-base",
  maxRetries: 3,
  timeout: 30000,
  cacheEnabled: true,
  maxCacheSize: 100,
  defaultEmojis: 5,
};

const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  API_KEY_ERROR: "API_KEY_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  MODEL_ERROR: "MODEL_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  PROVIDER_ERROR: "PROVIDER_ERROR",
};

const MAX_TEXT_LENGTH = 10000;
const MAX_KEYWORD_LENGTH = 100;
const MAX_EMOJIS_RETURNED = 20;
const MIN_EMOJIS_RETURNED = 1;

module.exports = {
  EMOTIONS,
  PROVIDERS,
  DEFAULT_CONFIG,
  ERROR_CODES,
  MAX_TEXT_LENGTH,
  MAX_KEYWORD_LENGTH,
  MAX_EMOJIS_RETURNED,
  MIN_EMOJIS_RETURNED,
};
