const { getConfig, updateConfig } = require("./config");
const ProviderManager = require("./ProviderManager");
const EmotionService = require("./services/EmotionService");
const EmojiService = require("./services/EmojiService");
const errors = require("./utils/errors");
const validator = require("./utils/validator");
const packageJson = require("../package.json");

function AIEmoji() {
  this.providerManager = null;
  this.emotionService = null;
  this.emojiService = null;
  this.initialized = false;
}

AIEmoji.prototype.configure = function (options) {
  if (!options) {
    throw new errors.ValidationError("Configuration options are required");
  }

  if (!options.apiKey) {
    throw new errors.ValidationError("API key is required");
  }

  if (options.provider && options.provider !== "huggingface") {
    throw new errors.ProviderError(
      'Unsupported provider. Currently only "huggingface" is supported',
    );
  }

  updateConfig(options);

  this.providerManager = new ProviderManager();
  this.emotionService = new EmotionService(this.providerManager);
  this.emojiService = new EmojiService();
  this.initialized = true;

  return this;
};

AIEmoji.prototype.ensureInitialized = function () {
  if (!this.initialized) {
    throw new errors.ValidationError(
      "AIEmoji must be configured first. Call AIEmoji.configure()",
    );
  }
};

AIEmoji.prototype.generate = function (text) {
  var self = this;
  self.ensureInitialized();
  validator.validateText(text);

  return self.emotionService.detectEmotion(text).then(function (emotionResult) {
    var emojis = self.emojiService.getEmojisByEmotion(
      emotionResult.emotion,
      text,
    );

    return {
      text: text,
      emotion: emotionResult.emotion,
      confidence: emotionResult.confidence,
      emojis: emojis,
    };
  });
};

AIEmoji.prototype.detectEmotion = function (text) {
  this.ensureInitialized();
  validator.validateText(text);

  return this.emotionService.detectEmotion(text);
};

AIEmoji.prototype.replace = function (text) {
  var self = this;
  self.ensureInitialized();
  validator.validateText(text);

  return self.emotionService.detectEmotion(text).then(function (emotionResult) {
    var emojis = self.emojiService.getEmojisByEmotion(
      emotionResult.emotion,
      text,
    );

    var result = text;
    var words = text.split(" ");
    var usedEmojis = [];

    for (var i = 0; i < words.length; i++) {
      var word = words[i].toLowerCase();
      var matchingEmojis = self.emojiService.searchEmojisByKeyword(word);

      if (matchingEmojis.length > 0 && usedEmojis.length < emojis.length) {
        var emoji = matchingEmojis[0];
        var wordIndex = result.toLowerCase().indexOf(word);
        if (wordIndex !== -1) {
          var before = result.substring(0, wordIndex);
          var after = result.substring(wordIndex + word.length);
          var replacement = self.findReplacementEmoji(emoji, emojis);
          if (replacement && usedEmojis.indexOf(replacement) === -1) {
            result = before + replacement + after;
            usedEmojis.push(replacement);
          }
        }
      }
    }

    if (usedEmojis.length === 0 && emojis.length > 0) {
      result = result + " " + emojis[0];
    }

    return result;
  });
};

AIEmoji.prototype.findReplacementEmoji = function (
  matchingEmoji,
  availableEmojis,
) {
  var exactMatch = null;
  for (var i = 0; i < availableEmojis.length; i++) {
    if (availableEmojis[i] === matchingEmoji) {
      exactMatch = availableEmojis[i];
      break;
    }
  }
  if (exactMatch) {
    return exactMatch;
  }
  return availableEmojis[0] || null;
};

AIEmoji.prototype.predict = function (text) {
  var self = this;
  self.ensureInitialized();
  validator.validateText(text);

  return self.emotionService.detectEmotion(text).then(function (emotionResult) {
    return self.emojiService.getEmojisByEmotion(emotionResult.emotion, text);
  });
};

AIEmoji.prototype.search = function (keyword) {
  this.ensureInitialized();
  validator.validateKeyword(keyword);

  return this.emojiService.searchEmojisByKeyword(keyword);
};

AIEmoji.prototype.random = function (emotion) {
  this.ensureInitialized();

  if (!emotion) {
    return this.emojiService.getRandomEmoji();
  }

  var normalizedEmotion = emotion.toLowerCase().trim();
  var validEmotions = [
    "joy",
    "sadness",
    "anger",
    "fear",
    "love",
    "surprise",
    "neutral",
    "disgust",
  ];

  if (validEmotions.indexOf(normalizedEmotion) === -1) {
    throw new errors.ValidationError(
      "Invalid emotion. Must be one of: " + validEmotions.join(", "),
    );
  }

  return this.emojiService.getRandomEmojiByEmotion(normalizedEmotion);
};

AIEmoji.prototype.version = function () {
  return packageJson.version;
};

var instance = new AIEmoji();
module.exports = instance;
