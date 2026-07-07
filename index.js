/**
 * React Native AI Emoji
 * Main entry point for the package
 */
var AIEmoji = require("./src/AIEmoji");
var errors = require("./src/utils/errors");

module.exports = AIEmoji;
module.exports.errors = errors;
module.exports.package = require("./package.json");
module.exports.default = AIEmoji;

// Bind methods for named exports
module.exports.generate = AIEmoji.generate.bind(AIEmoji);
module.exports.detectEmotion = AIEmoji.detectEmotion.bind(AIEmoji);
module.exports.replace = AIEmoji.replace.bind(AIEmoji);
module.exports.predict = AIEmoji.predict.bind(AIEmoji);
module.exports.search = AIEmoji.search.bind(AIEmoji);
module.exports.random = AIEmoji.random.bind(AIEmoji);
module.exports.version = AIEmoji.version.bind(AIEmoji);
module.exports.configure = AIEmoji.configure.bind(AIEmoji);
