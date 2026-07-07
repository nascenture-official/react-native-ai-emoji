// src/utils/validator.js
const errors = require("./errors");

function validateText(text) {
  if (text === undefined || text === null) {
    throw new errors.ValidationError("Text is required");
  }

  if (typeof text !== "string") {
    throw new errors.ValidationError("Text must be a string");
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new errors.ValidationError("Text cannot be empty");
  }

  if (trimmed.length > 10000) {
    throw new errors.ValidationError(
      "Text is too long. Maximum length is 10000 characters",
    );
  }

  return trimmed;
}

function validateKeyword(keyword) {
  if (keyword === undefined || keyword === null) {
    throw new errors.ValidationError("Keyword is required");
  }

  if (typeof keyword !== "string") {
    throw new errors.ValidationError("Keyword must be a string");
  }

  const trimmed = keyword.trim();
  if (trimmed.length === 0) {
    throw new errors.ValidationError("Keyword cannot be empty");
  }

  if (trimmed.length > 100) {
    throw new errors.ValidationError(
      "Keyword is too long. Maximum length is 100 characters",
    );
  }

  return trimmed;
}

function validateEmotion(emotion) {
  const validEmotions = [
    "joy",
    "sadness",
    "anger",
    "fear",
    "love",
    "surprise",
    "neutral",
    "disgust",
  ];

  if (!emotion) {
    throw new errors.ValidationError("Emotion is required");
  }

  if (typeof emotion !== "string") {
    throw new errors.ValidationError("Emotion must be a string");
  }

  const trimmed = emotion.toLowerCase().trim();
  if (!validEmotions.includes(trimmed)) {
    throw new errors.ValidationError(
      `Invalid emotion. Must be one of: ${validEmotions.join(", ")}`,
    );
  }

  return trimmed;
}

function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new errors.ValidationError("Configuration must be an object");
  }

  if (!config.apiKey) {
    throw new errors.ValidationError("API key is required");
  }

  if (typeof config.apiKey !== "string") {
    throw new errors.ValidationError("API key must be a string");
  }

  if (config.apiKey.trim().length === 0) {
    throw new errors.ValidationError("API key cannot be empty");
  }

  if (config.provider && config.provider !== "huggingface") {
    throw new errors.ProviderError(
      'Unsupported provider. Currently only "huggingface" is supported',
    );
  }

  return config;
}

function validateCount(count) {
  if (count === undefined || count === null) {
    return 5;
  }

  if (typeof count !== "number") {
    throw new errors.ValidationError("Count must be a number");
  }

  if (!Number.isInteger(count)) {
    throw new errors.ValidationError("Count must be an integer");
  }

  if (count < 1 || count > 20) {
    throw new errors.ValidationError("Count must be between 1 and 20");
  }

  return count;
}

module.exports = {
  validateText,
  validateKeyword,
  validateEmotion,
  validateConfig,
  validateCount,
};
