// src/ProviderManager.js
const HuggingFaceProvider = require("./providers/HuggingFaceProvider");
const { getConfig } = require("./config");
const errors = require("./utils/errors");

class ProviderManager {
  constructor() {
    this.providers = {
      huggingface: HuggingFaceProvider,
    };
    this.activeProvider = null;
  }

  getProvider() {
    const config = getConfig();
    const providerName = config.provider || "huggingface";

    if (!this.providers[providerName]) {
      throw new errors.ProviderError(
        `Provider "${providerName}" is not supported`,
      );
    }

    if (!this.activeProvider || this.activeProvider.name !== providerName) {
      const ProviderClass = this.providers[providerName];
      this.activeProvider = new ProviderClass(config);
    }

    return this.activeProvider;
  }

  registerProvider(name, providerClass) {
    if (this.providers[name]) {
      throw new errors.ProviderError(
        `Provider "${name}" is already registered`,
      );
    }
    this.providers[name] = providerClass;
  }
}

module.exports = ProviderManager;
