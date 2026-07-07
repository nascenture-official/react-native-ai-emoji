# react-native-ai-emoji

AI-powered emoji recommendations for React Native using Hugging Face emotion detection.

---

## Features

- **AI-Powered** — Emotion detection via Hugging Face models
- **Intelligent Ranking** — Combines emotion scores, keyword matching, and priority weighting
- **Automatic Replacement** — Swap words in text with matching emojis
- **Search** — Query 1000+ emojis by keyword
- **Built-in Caching** — Avoids duplicate API calls automatically
- **Zero Native Dependencies** — Pure JavaScript, no native linking required

---

## Installation

```bash
npm install react-native-ai-emoji
# or
yarn add react-native-ai-emoji
```

**Android only** — add the internet permission to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<application android:usesCleartextTraffic="true">
```

---

## Configuration

Get your API key from [Hugging Face](https://huggingface.co/settings/tokens), then configure once at app startup:

```js
import AIEmoji from "react-native-ai-emoji";

AIEmoji.configure({
  provider: "huggingface",
  apiKey: "YOUR_HUGGINGFACE_API_KEY",
  model: "Qwen/Qwen2.5-7B-Instruct", // optional
  timeout: 30000, // optional, ms
  maxRetries: 3, // optional
  cacheEnabled: true, // optional, default true
  maxCacheSize: 100, // optional
});
```

---

## Usage

### Generate emojis from text

```js
const result = await AIEmoji.generate("I am very happy today");
// {
//   text: 'I am very happy today',
//   emotion: 'joy',
//   confidence: 0.95,
//   emojis: ['😊', '🎉', '😄', '❤️', '✨']
// }
```

### Detect emotion only

```js
const emotion = await AIEmoji.detectEmotion("This is amazing!");
// { emotion: 'joy', confidence: 0.92 }
```

### Replace words with emojis

```js
const text = await AIEmoji.replace("I love pizza");
// 'I ❤️ 🍕'
```

### Predict emojis

```js
const emojis = await AIEmoji.predict("I am feeling hungry");
// ['🍕', '🍔', '😋', '🌮', '🍟']
```

### Search emojis by keyword

```js
const emojis = AIEmoji.search("food");
// ['🍕', '🍔', '🍟', '🌮', '🍣']
```

### Get a random emoji

```js
AIEmoji.random("happy"); // '😊'
AIEmoji.random(); // any random emoji
```

---

## API Reference

### `AIEmoji.configure(options)`

| Option         | Type      | Required | Description                               |
| -------------- | --------- | -------- | ----------------------------------------- |
| `apiKey`       | `string`  | **Yes**  | Your Hugging Face API key                 |
| `provider`     | `string`  | No       | Provider name — currently `'huggingface'` |
| `model`        | `string`  | No       | Hugging Face model to use                 |
| `timeout`      | `number`  | No       | Request timeout in milliseconds           |
| `maxRetries`   | `number`  | No       | Maximum retry attempts                    |
| `cacheEnabled` | `boolean` | No       | Enable/disable caching (default: `true`)  |
| `maxCacheSize` | `number`  | No       | Max cached entries (default: `100`)       |

---

### `AIEmoji.generate(text)` → `Promise`

Returns emotion data and recommended emojis for the input text.

```js
{
  text: string,       // Original input
  emotion: string,    // Detected emotion
  confidence: number, // Score from 0 to 1
  emojis: string[]    // Top 5 recommended emojis
}
```

### `AIEmoji.detectEmotion(text)` → `Promise`

```js
{ emotion: string, confidence: number }
```

### `AIEmoji.replace(text)` → `Promise<string>`

Returns the input text with recognized words replaced by emojis.

### `AIEmoji.predict(text)` → `Promise<string[]>`

Returns an array of emojis predicted from the text.

### `AIEmoji.search(keyword)` → `string[]`

Synchronous. Returns emojis matching the keyword.

### `AIEmoji.random(emotion?)` → `string`

Returns a random emoji. Pass an emotion string to scope the result.

### `AIEmoji.version()` → `string`

Returns the installed library version.

---

## Supported Emotions

| Emotion    | Example Emojis |
| ---------- | -------------- |
| `joy`      | 😊 😄 🎉       |
| `sadness`  | 😢 😭 💔       |
| `anger`    | 😡 😠 🔥       |
| `fear`     | 😨 😱 💀       |
| `love`     | ❤️ 😍 💕       |
| `surprise` | 😮 😲 🎉       |
| `neutral`  | 😐 🤔 😶       |
| `disgust`  | 🤢 🤮 😷       |

---

## Error Handling

```js
import AIEmoji, { errors } from "react-native-ai-emoji";

try {
  await AIEmoji.generate("Hello");
} catch (error) {
  if (error instanceof errors.APIKeyError)
    console.error("Invalid or missing API key");
  if (error instanceof errors.NetworkError)
    console.error("Network connection issue");
  if (error instanceof errors.RateLimitError)
    console.error("Rate limit exceeded");
  if (error instanceof errors.ModelError)
    console.error("Model loading or inference error");
  if (error instanceof errors.ValidationError) console.error("Invalid input");
  if (error instanceof errors.ProviderError)
    console.error("Unsupported provider");
}
```

| Error             | When it occurs                              |
| ----------------- | ------------------------------------------- |
| `ValidationError` | Empty text or invalid parameters            |
| `APIKeyError`     | Missing or invalid API key                  |
| `NetworkError`    | No internet, timeout, or connection failure |
| `RateLimitError`  | Too many requests sent in a short period    |
| `ModelError`      | Model loading or inference failure          |
| `ProviderError`   | Unsupported provider specified              |

---

## Troubleshooting

**Network error on Android** — Ensure `INTERNET` permission and `usesCleartextTraffic="true"` are set in `AndroidManifest.xml`. Prefer a real device over the emulator for network calls.

**Invalid API key** — Check your token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Make sure there are no leading/trailing spaces.

**Rate limit exceeded** — Wait a few minutes, reduce request frequency, or upgrade your Hugging Face plan.

**Model cold start** — The first request may take up to 30 seconds while the model warms up. Retry after waiting.

**Android build error** (`Unable to resolve @babel/runtime`) —

```bash
npm install @babel/runtime --save
npx react-native start --reset-cache
```

---

## Requirements

- React Native 0.70+
- Node.js 14+
- Hugging Face API key
- Internet connection

---

## License

This project is under the MIT license.

---

## Author

Built with ❤️ by **Nascenture**.

- 🌐 Website: https://www.nascenture.com
- 📱 React Native Development Services: https://www.nascenture.com/react-native-app-development/
