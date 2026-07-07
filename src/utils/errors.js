class AIEmojiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AIEmojiError {
  constructor(message) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

class APIKeyError extends AIEmojiError {
  constructor(message) {
    super(message || "Invalid or missing API key", "API_KEY_ERROR");
    this.name = "APIKeyError";
  }
}

class NetworkError extends AIEmojiError {
  constructor(message) {
    super(message || "Network connection error", "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

class ModelError extends AIEmojiError {
  constructor(message) {
    super(message || "Model error occurred", "MODEL_ERROR");
    this.name = "ModelError";
  }
}

class RateLimitError extends AIEmojiError {
  constructor(message) {
    super(message || "Rate limit exceeded", "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
}

class ProviderError extends AIEmojiError {
  constructor(message) {
    super(message || "Provider error occurred", "PROVIDER_ERROR");
    this.name = "ProviderError";
  }
}

module.exports = {
  AIEmojiError,
  ValidationError,
  APIKeyError,
  NetworkError,
  ModelError,
  RateLimitError,
  ProviderError,
};
