// src/providers/HuggingFaceProvider.js
const { config } = require("../config");
const fetch = require("../utils/fetch");
const errors = require("../utils/errors");
const cache = require("../utils/cache");

class HuggingFaceProvider {
  constructor(options) {
    this.name = "huggingface";
    this.apiKey = options.apiKey;
    this.model = options.model || config.model;
    this.endpoint = config.providers.huggingface.endpoint;
    this.timeout = options.timeout || config.providers.huggingface.timeout;
    this.maxRetries = options.maxRetries || config.maxRetries;
    this.cacheEnabled =
      options.cacheEnabled !== undefined
        ? options.cacheEnabled
        : config.cacheEnabled;
  }

  async detectEmotion(text) {
    if (!this.apiKey) {
      throw new errors.APIKeyError("Hugging Face API key is required");
    }

    const cacheKey = this.getCacheKey(text);

    if (this.cacheEnabled) {
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }

    const url = `${this.endpoint}/chat/completions`;

    const payload = {
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            'You are an emotion detector. Return ONLY valid JSON like {"emotion":"joy","confidence":0.95}',
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0,
      max_tokens: 80,
    };

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
        timeout: this.timeout,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.handleApiError(response.status, errorText);
      }

      const data = await response.json();

      console.log("FULL RESPONSE:");
      console.log(JSON.stringify(data, null, 2));

      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new errors.ModelError("No content returned by model");
      }

      const json = JSON.parse(content);

      const result = this.parseResponse(json);

      if (this.cacheEnabled) {
        cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      if (error.name === "AbortError" || error.code === "ETIMEDOUT") {
        throw new errors.NetworkError("Request timeout. Please try again.");
      }
      if (error.message && error.message.includes("Network request failed")) {
        throw new errors.NetworkError(
          "Network connection error. Please check your internet connection.",
        );
      }
      throw error;
    }
  }

  getCacheKey(text) {
    return `huggingface:${this.model}:${text.toLowerCase().trim()}`;
  }

  handleApiError(status, errorText) {
    if (status === 401) {
      throw new errors.APIKeyError("Invalid Hugging Face API key");
    }
    if (status === 429) {
      throw new errors.RateLimitError(
        "Rate limit exceeded. Please wait and try again.",
      );
    }
    if (status === 503) {
      throw new errors.ModelError(
        "Model is currently loading. Please wait and try again.",
      );
    }
    if (status >= 500) {
      throw new errors.ModelError(
        "Hugging Face server error. Please try again later.",
      );
    }
    throw new errors.ModelError(`API error (${status}): ${errorText}`);
  }

  parseResponse(result) {
    if (!result || typeof result !== "object") {
      throw new errors.ModelError("Invalid response from AI model");
    }

    return {
      emotion: this.normalizeEmotion(result.emotion || "neutral"),
      confidence: Number(result.confidence || 0),
    };
  }

  normalizeEmotion(emotion) {
    const emotionMap = {
      joy: "joy",
      sadness: "sadness",
      anger: "anger",
      fear: "fear",
      love: "love",
      surprise: "surprise",
      neutral: "neutral",
      disgust: "disgust",
    };

    const normalized = emotion.toLowerCase().trim();
    return emotionMap[normalized] || "neutral";
  }
}

module.exports = HuggingFaceProvider;
