const emojiDatabase = require("../database/emojiMap");
const emojiKeywords = require("../database/emojiKeywords");

class EmojiService {
  constructor() {
    this.emojiDatabase = emojiDatabase;
    this.emojiKeywords = emojiKeywords;
    this.allEmojis = this.buildAllEmojisList();
  }

  buildAllEmojisList() {
    const all = [];
    for (const category in this.emojiDatabase) {
      if (Array.isArray(this.emojiDatabase[category])) {
        all.push(...this.emojiDatabase[category]);
      }
    }
    return all;
  }

  getEmojisByEmotion(emotion, text = "") {
    const emotionEmojis = this.emojiDatabase[emotion] || [];

    if (emotionEmojis.length === 0) {
      return ["😊", "😄", "❤️", "👍", "✨"];
    }

    const scoredEmojis = this.scoreEmojis(emotionEmojis, emotion, text);
    const sorted = scoredEmojis.sort((a, b) => b.score - a.score);
    const topEmojis = sorted.slice(0, 5).map((item) => item.emoji);

    return topEmojis;
  }

  scoreEmojis(emojis, emotion, text) {
    const words = text.toLowerCase().split(" ");
    const scored = emojis.map((emoji) => {
      let score = 0;

      score += this.calculateEmotionScore(emoji, emotion);

      const keywords = this.emojiKeywords[emoji] || [];
      const matchCount = keywords.filter((keyword) =>
        words.some((word) => word.includes(keyword.toLowerCase())),
      ).length;

      score += matchCount * 10;

      score += this.calculatePriorityScore(emoji);

      score += Math.random() * 2;

      return {
        emoji: emoji,
        score: score,
      };
    });

    return scored;
  }

  calculateEmotionScore(emoji, emotion) {
    const emotionGroups = {
      joy: [
        "😊",
        "😄",
        "😁",
        "😂",
        "🤣",
        "😃",
        "😅",
        "😆",
        "😉",
        "😋",
        "😎",
        "🥳",
        "🎉",
        "🎊",
        "💖",
        "❤️",
        "💕",
        "✨",
        "🌟",
        "⭐",
      ],
      sadness: [
        "😢",
        "😭",
        "😩",
        "😫",
        "🥺",
        "😔",
        "😟",
        "😞",
        "😌",
        "😤",
        "😒",
        "😓",
        "😕",
        "☹️",
        "💔",
        "🖤",
        "🌧️",
        "🌈",
      ],
      anger: [
        "😡",
        "😠",
        "🤬",
        "💢",
        "🔥",
        "🗯️",
        "💥",
        "⚡",
        "👿",
        "😾",
        "🤯",
        "😤",
        "💪",
        "✊",
        "👊",
      ],
      fear: [
        "😨",
        "😰",
        "😱",
        "😬",
        "😳",
        "🥶",
        "😖",
        "😣",
        "😫",
        "😩",
        "😪",
        "😵",
        "💀",
        "👻",
        "🎃",
      ],
      love: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "💕",
        "💞",
        "💗",
        "💖",
        "💝",
        "💘",
        "😍",
        "🥰",
        "😘",
        "😗",
        "😙",
        "😚",
        "☺️",
      ],
      surprise: [
        "😮",
        "😲",
        "😯",
        "😦",
        "😧",
        "😵",
        "🤯",
        "😱",
        "🤩",
        "🥳",
        "🎉",
        "🎊",
        "✨",
        "🌟",
        "💫",
      ],
      neutral: [
        "😐",
        "😑",
        "😶",
        "🤔",
        "😏",
        "😒",
        "😓",
        "😔",
        "🤷",
        "🙄",
        "😬",
        "🤨",
        "🧐",
        "🤓",
        "😇",
      ],
      disgust: [
        "🤢",
        "🤮",
        "😷",
        "🤒",
        "🤕",
        "🤑",
        "😈",
        "👹",
        "🤡",
        "💩",
        "☠️",
        "👾",
        "🤖",
        "👽",
      ],
    };

    const group = emotionGroups[emotion] || [];
    return group.includes(emoji) ? 20 : 0;
  }

  calculatePriorityScore(emoji) {
    const priorityEmojis = {
      high: ["❤️", "🔥", "⭐", "✨", "💯", "👍", "🎉", "😊", "😄", "💪"],
      medium: ["🌟", "💫", "🌈", "☀️", "🌙", "🎯", "💡", "🔑", "📌", "🎈"],
    };

    if (priorityEmojis.high.includes(emoji)) {
      return 5;
    }
    if (priorityEmojis.medium.includes(emoji)) {
      return 3;
    }
    return 1;
  }

  searchEmojisByKeyword(keyword) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (!normalizedKeyword) {
      return [];
    }

    const results = [];
    const exactMatches = [];
    const partialMatches = [];

    for (const emoji in this.emojiKeywords) {
      const keywords = this.emojiKeywords[emoji];
      if (keywords) {
        const hasExactMatch = keywords.some(
          (k) => k.toLowerCase() === normalizedKeyword,
        );
        const hasPartialMatch = keywords.some((k) =>
          k.toLowerCase().includes(normalizedKeyword),
        );

        if (hasExactMatch) {
          exactMatches.push(emoji);
        } else if (hasPartialMatch) {
          partialMatches.push(emoji);
        }
      }
    }

    results.push(...exactMatches);
    results.push(...partialMatches);

    const uniqueResults = [...new Set(results)];
    return uniqueResults.slice(0, 20);
  }

  getRandomEmoji() {
    if (this.allEmojis.length === 0) {
      return "😊";
    }
    const randomIndex = Math.floor(Math.random() * this.allEmojis.length);
    return this.allEmojis[randomIndex];
  }

  getRandomEmojiByEmotion(emotion) {
    const emotionEmojis = this.emojiDatabase[emotion] || [];
    if (emotionEmojis.length === 0) {
      return this.getRandomEmoji();
    }
    const randomIndex = Math.floor(Math.random() * emotionEmojis.length);
    return emotionEmojis[randomIndex];
  }
}

module.exports = EmojiService;
