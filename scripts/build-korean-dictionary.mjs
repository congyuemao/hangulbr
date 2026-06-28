#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(rootDir, "packages", "keybr-content-words", "lib", "data");
const modelPath = join(
  rootDir,
  "packages",
  "keybr-phonetic-model",
  "assets",
  "model-ko.data",
);
const wordsPath = join(dataDir, "words-ko.json");
const dictionaryPath = join(dataDir, "dictionary-ko.json");

const sourcesDir = join(tmpdir(), "hangulbr-data-sources");
const deckRepo = join(sourcesDir, "language-learning-decks");
const vocablyRepo = join(sourcesDir, "vocably-ko");

const dictionarySize = 5000;
const hangulSyllablePattern = /^[\uac00-\ud7a3]+$/u;
const dubeolsikAlphabet =
  "ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅁㄴㅇㄹㅎㅗㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡ";

const initials = [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"];
const medials = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅗㅏ",
  "ㅗㅐ",
  "ㅗㅣ",
  "ㅛ",
  "ㅜ",
  "ㅜㅓ",
  "ㅜㅔ",
  "ㅜㅣ",
  "ㅠ",
  "ㅡ",
  "ㅡㅣ",
  "ㅣ",
];
const finals = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄱㅅ",
  "ㄴ",
  "ㄴㅈ",
  "ㄴㅎ",
  "ㄷ",
  "ㄹ",
  "ㄹㄱ",
  "ㄹㅁ",
  "ㄹㅂ",
  "ㄹㅅ",
  "ㄹㅌ",
  "ㄹㅍ",
  "ㄹㅎ",
  "ㅁ",
  "ㅂ",
  "ㅂㅅ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

function main() {
  mkdirSync(sourcesDir, { recursive: true });

  ensureRepo(
    "https://github.com/vbvss199/Language-Learning-decks.git",
    deckRepo,
    false,
  );
  ensureRepo("https://github.com/vocably/ko.git", vocablyRepo, true);

  const deck = JSON.parse(
    readFileSync(join(deckRepo, "korean", "korean.json"), "utf8"),
  );
  const vocably = readVocably(vocablyRepo);
  const entries = buildEntries(deck, vocably);
  const words = entries.map(({ jamo }) => jamo);
  const model = buildModel(words);

  writeFileSync(dictionaryPath, `${JSON.stringify(entries, null, 2)}\n`);
  writeFileSync(wordsPath, `${JSON.stringify(words, null, 2)}\n`);
  writeFileSync(modelPath, model);

  console.log(`Generated ${dictionaryPath} (${entries.length} entries)`);
  console.log(`Generated ${wordsPath} (${words.length} words)`);
  console.log(`Generated ${modelPath} (${model.length} bytes)`);
}

function ensureRepo(url, dir, noCheckout) {
  if (!existsSync(join(dir, ".git"))) {
    execFileSync(
      "git",
      [
        "clone",
        "--depth",
        "1",
        ...(noCheckout ? ["--no-checkout"] : []),
        url,
        dir,
      ],
      { stdio: "inherit" },
    );
    return;
  }
  execFileSync("git", ["-C", dir, "fetch", "--depth", "1", "origin", "main"], {
    stdio: "inherit",
  });
  execFileSync("git", ["-C", dir, "reset", "--soft", "origin/main"], {
    stdio: "ignore",
  });
}

function readVocably(repo) {
  const paths = execFileSync(
    "git",
    ["-C", repo, "ls-tree", "-r", "-z", "--name-only", "HEAD"],
    { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 },
  )
    .split("\0")
    .filter(Boolean);
  const byKey = new Map();
  const byWord = new Map();

  for (const path of paths) {
    const match = /^units-of-speech\/(.+)\/([^/]+)\.json$/u.exec(path);
    if (match == null) {
      continue;
    }
    const [, word, rawPos] = match;
    const pos = normalizePos(rawPos);
    const record = getVocablyRecord(byKey, byWord, word, pos);
    try {
      const data = JSON.parse(gitShow(repo, path));
      record.ko.push(...asArray(data.definitions));
      record.examples.push(
        ...asArray(data.examples).map((ko) => ({ ko, en: null })),
      );
    } catch {
      // Generated upstream data is occasionally malformed; skip the bad shard.
    }
  }

  for (const path of paths) {
    const match =
      /^translations\/(.+)\/([^/]+)\/(zh|zh-tw|en|en-gb)\.txt$/u.exec(path);
    if (match == null) {
      continue;
    }
    const [, word, rawPos, lang] = match;
    const pos = normalizePos(rawPos);
    const record = getVocablyRecord(byKey, byWord, word, pos);
    const lines = gitShow(repo, path)
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean);
    switch (lang) {
      case "zh":
        record.zh.push(...lines);
        break;
      case "zh-tw":
        record.zhTw.push(...lines);
        break;
      default:
        record.en.push(...lines);
        break;
    }
  }

  return { byKey, byWord };
}

function getVocablyRecord(byKey, byWord, word, pos) {
  const key = `${word}\t${pos}`;
  let record = byKey.get(key);
  if (record == null) {
    record = {
      word,
      pos,
      zh: [],
      zhTw: [],
      en: [],
      ko: [],
      examples: [],
    };
    byKey.set(key, record);
    const list = byWord.get(word) ?? [];
    list.push(record);
    byWord.set(word, list);
  }
  return record;
}

function gitShow(repo, path) {
  return execFileSync("git", ["-C", repo, "show", `HEAD:${path}`], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
}

function buildEntries(deck, vocably) {
  const entries = [];
  const seen = new Set();

  for (const item of deck) {
    const word = String(item.word ?? "").normalize("NFC");
    if (
      seen.has(word) ||
      !item.useful_for_flashcard ||
      !hangulSyllablePattern.test(word) ||
      [...word].length < 2
    ) {
      continue;
    }

    const pos = normalizePos(item.pos);
    const supplemental =
      vocably.byKey.get(`${word}\t${pos}`) ?? vocably.byWord.get(word)?.[0];
    const definitions = asArray(item.definitions)
      .map((definition) => cleanText(definition?.gloss))
      .filter(Boolean);
    const englishTranslation = String(item.english_translation ?? "")
      .split(";")
      .map(cleanText)
      .filter(Boolean);
    const examples = [];
    const exampleKo = cleanText(item.example_sentence_native);
    if (exampleKo !== "") {
      examples.push({
        ko: exampleKo,
        en: cleanText(item.example_sentence_english) || null,
      });
    }
    if (supplemental != null) {
      examples.push(...supplemental.examples);
    }

    const entry = {
      word,
      jamo: decomposeHangulText(word),
      pos,
      level: cleanText(item.cefr_level) || null,
      romanization: cleanText(item.romanization) || null,
      zh: unique(supplemental?.zh ?? []),
      zhTw: unique(supplemental?.zhTw ?? []),
      en: unique([
        ...definitions,
        ...englishTranslation,
        ...(supplemental?.en ?? []),
      ]),
      ko: unique(supplemental?.ko ?? []),
      examples: uniqueExamples(examples),
      sources:
        supplemental != null
          ? ["Language-Learning-decks", "Vocably/ko"]
          : ["Language-Learning-decks"],
    };

    entries.push(entry);
    seen.add(word);
    if (entries.length === dictionarySize) {
      break;
    }
  }

  return entries;
}

function normalizePos(pos) {
  return String(pos ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("_", " ");
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function cleanText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/gu, " ");
}

function unique(values) {
  const out = [];
  const seen = new Set();
  for (const value of values.map(cleanText).filter(Boolean)) {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  }
  return out.slice(0, 6);
}

function uniqueExamples(values) {
  const out = [];
  const seen = new Set();
  for (const value of values) {
    const ko = cleanText(value.ko);
    const en = cleanText(value.en) || null;
    if (ko === "" || seen.has(ko)) {
      continue;
    }
    seen.add(ko);
    out.push({ ko, en });
  }
  return out.slice(0, 2);
}

function decomposeHangulText(text) {
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code < 0xac00 || code > 0xd7a3) {
      out += char;
      continue;
    }
    const index = code - 0xac00;
    const l = Math.floor(index / (21 * 28));
    const v = Math.floor((index % (21 * 28)) / 28);
    const t = index % 28;
    out += initials[l] + medials[v] + finals[t];
  }
  return out;
}

function buildModel(words) {
  const order = 4;
  const alphabet = [
    0x20,
    ...[...dubeolsikAlphabet].map((c) => c.codePointAt(0)),
  ];
  const chain = new Chain(order, alphabet);
  const frequencies = new Float64Array(chain.width);
  for (let i = 0; i < words.length; i++) {
    const weight = Math.max(1, Math.ceil((words.length - i) / 1000));
    for (let n = 0; n < weight; n++) {
      appendWord(chain, frequencies, words[i]);
    }
  }
  const segments = buildSegments(chain, frequencies);
  return compress(chain, segments);
}

class Chain {
  constructor(order, alphabet) {
    this.order = order;
    this.alphabet = alphabet;
    this.size = alphabet.length;
    this.segments = Math.pow(this.size, order - 1);
    this.width = Math.pow(this.size, order);
    this.offsets = Array.from({ length: order }, (_, i) =>
      Math.pow(this.size, order - i - 1),
    );
  }

  entryIndex(chain) {
    let index = 0;
    for (let i = 0; i < this.order; i++) {
      const codePoint = chain[chain.length - this.order + i] || 0x20;
      index += this.alphabet.indexOf(codePoint) * this.offsets[i];
    }
    return index;
  }

  codePoint(index) {
    return this.alphabet[index];
  }

  index(codePoint) {
    return this.alphabet.indexOf(codePoint);
  }
}

function appendWord(chain, frequencies, word) {
  const buffer = new Array(chain.order).fill(0x20);
  for (const char of word) {
    const codePoint = char.codePointAt(0);
    if (codePoint !== 0x20 && chain.alphabet.includes(codePoint)) {
      push(chain, frequencies, buffer, codePoint);
    } else {
      push(chain, frequencies, buffer, 0x20);
    }
  }
  push(chain, frequencies, buffer, 0x20);
}

function push(chain, frequencies, buffer, codePoint) {
  if (codePoint === 0x20 && buffer[buffer.length - 1] === 0x20) {
    return;
  }
  for (let i = 0; i < buffer.length - 1; i++) {
    buffer[i] = buffer[i + 1];
  }
  buffer[buffer.length - 1] = codePoint;
  const index = chain.entryIndex(buffer);
  if (index >= 0) {
    frequencies[index] += 1;
  }
}

function buildSegments(chain, frequencies) {
  const segments = [];
  for (let segmentIndex = 0; segmentIndex < chain.segments; segmentIndex++) {
    const segment = [];
    for (let entryIndex = 0; entryIndex < chain.size; entryIndex++) {
      const frequency = frequencies[segmentIndex * chain.size + entryIndex];
      if (frequency > 0) {
        segment.push({ codePoint: chain.codePoint(entryIndex), frequency });
      }
    }
    scaleFrequencies(segment);
    segments.push(segment);
  }
  return segments;
}

function scaleFrequencies(segment) {
  if (segment.length === 0) {
    return;
  }
  const sorted = [...segment].sort((a, b) => b.frequency - a.frequency);
  let sum = sorted.reduce((sum, { frequency }) => sum + frequency, 0);
  for (const entry of sorted) {
    entry.frequency = Math.max(1, Math.round((255 / sum) * entry.frequency));
  }
  sum = sorted.reduce((sum, { frequency }) => sum + frequency, 0);
  while (sum > 255) {
    for (const entry of sorted) {
      if (sum <= 255) {
        break;
      }
      if (entry.frequency > 1) {
        entry.frequency -= 1;
        sum -= 1;
      }
    }
  }
  while (sum < 255) {
    for (const entry of sorted) {
      if (sum >= 255) {
        break;
      }
      entry.frequency += 1;
      sum += 1;
    }
  }
}

function compress(chain, segments) {
  const writer = new BinaryWriter();
  for (const byte of [0x6b, 0x65, 0x79, 0x62, 0x72, 0x2e, 0x63, 0x6f, 0x6d]) {
    writer.putUint8(byte);
  }
  writer.putUint8(chain.order);
  writer.putUint8(chain.size);
  for (const codePoint of chain.alphabet) {
    writer.putUint16(codePoint);
  }
  for (const segment of segments) {
    writer.putUint8(segment.length);
    for (const { codePoint, frequency } of segment) {
      writer.putUint8(chain.index(codePoint));
      writer.putUint8(frequency);
    }
  }
  return writer.buffer();
}

class BinaryWriter {
  #bytes = [];

  putUint8(value) {
    this.#bytes.push(value & 0xff);
  }

  putUint16(value) {
    this.#bytes.push((value >>> 8) & 0xff, value & 0xff);
  }

  buffer() {
    return Buffer.from(this.#bytes);
  }
}

main();
