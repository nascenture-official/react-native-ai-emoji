// src/services/EmotionService.js
const cache = require("../utils/cache");

class EmotionService {
  constructor(providerManager) {
    this.providerManager = providerManager;
    this.cache = cache;
  }

  async detectEmotion(text) {
    const provider = this.providerManager.getProvider();
    const result = await provider.detectEmotion(text);

    return {
      emotion: result.emotion,
      confidence: result.confidence,
    };
  }

  getEmotionEmojis(emotion, count = 5) {
    const emojiMap = require("../database/emojiMap");
    const emojis = emojiMap[emotion] || [];

    if (emojis.length === 0) {
      return ["😊"];
    }

    const shuffled = this.shuffleArray([...emojis]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

module.exports = EmotionService;
