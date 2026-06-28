import { type WordList } from "@keybr/content";
import { type Keyboard } from "@keybr/keyboard";
import { Filter, Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { randomSample, type RNGStream } from "@keybr/rand";
import { type KeyStatsMap } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePoint } from "@keybr/unicode";
import { Dictionary, filterWordList } from "./dictionary.ts";
import { LessonKey, LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import {
  mangledWords,
  phoneticWords,
  randomWords,
  uniqueWords,
} from "./text/words.ts";

export class GuidedLesson extends Lesson {
  readonly dictionary: Dictionary;

  constructor(
    settings: Settings,
    keyboard: Keyboard,
    model: PhoneticModel,
    wordList: WordList,
  ) {
    super(settings, keyboard, model);
    this.dictionary = new Dictionary(
      filterWordList(wordList, this.codePoints).filter(
        (word) => word.length > 2,
      ),
    );
  }

  override get letters() {
    return this.model.letters;
  }

  override update(keyStatsMap: KeyStatsMap) {
    const alphabetSize = this.settings.get(lessonProps.guided.alphabetSize);
    const recoverKeys = this.settings.get(lessonProps.guided.recoverKeys);

    const letters = this.#getLetters();

    const minSize = 6;
    const maxSize =
      minSize + Math.round((letters.length - minSize) * alphabetSize);

    const target = new Target(this.settings);

    const lessonKeys = new LessonKeys(
      letters.map((letter) => LessonKey.from(keyStatsMap.get(letter), target)),
    );

    for (const lessonKey of lessonKeys) {
      const includedKeys = lessonKeys.findIncludedKeys();

      if (includedKeys.length < minSize) {
        // Meet the minimal required alphabet size.
        lessonKeys.include(lessonKey.letter);
        continue;
      }

      if (includedKeys.length < maxSize) {
        // Meet the maximal required alphabet size.
        lessonKeys.force(lessonKey.letter);
        continue;
      }

      if ((lessonKey.bestConfidence ?? 0) >= 1) {
        // Must include all confident keys.
        lessonKeys.include(lessonKey.letter);
        continue;
      }

      if (recoverKeys) {
        if (includedKeys.every((key) => (key.confidence ?? 0) >= 1)) {
          // Include a new key only when all the previous keys
          // are now above the target speed.
          lessonKeys.include(lessonKey.letter);
          continue;
        }
      } else {
        if (includedKeys.every((key) => (key.bestConfidence ?? 0) >= 1)) {
          // Include a new key only when all the previous keys
          // were once above the target speed.
          lessonKeys.include(lessonKey.letter);
          continue;
        }
      }
    }

    // Find the least confident of all included keys and focus on it.
    const confidenceOf = (key: LessonKey): number => {
      return recoverKeys ? (key.confidence ?? 0) : (key.bestConfidence ?? 0);
    };
    const weakestKeys = lessonKeys
      .findIncludedKeys()
      .filter((key) => confidenceOf(key) < 1)
      .sort((a, b) => confidenceOf(a) - confidenceOf(b));
    if (weakestKeys.length > 0) {
      lessonKeys.focus(weakestKeys[0].letter);
    }

    return lessonKeys;
  }

  override generate(lessonKeys: LessonKeys, rng: RNGStream) {
    const filter = new Filter(
      lessonKeys.findIncludedKeys(),
      lessonKeys.findFocusedKey(),
    );
    const wordGenerator = this.#makeWordGenerator(filter, lessonKeys, rng);
    const words = mangledWords(
      uniqueWords(wordGenerator),
      this.model.language,
      Letter.restrict(Letter.punctuators, this.codePoints),
      {
        withCapitals: this.settings.get(lessonProps.capitals),
        withPunctuators: this.settings.get(lessonProps.punctuators),
      },
      rng,
    );
    return generateFragment(this.settings, words, {
      repeatWords: this.settings.get(lessonProps.repeatWords),
    });
  }

  #getLetters() {
    const { letters } = this.model;
    const { codePoints } = this;
    if (this.settings.get(lessonProps.guided.keyboardOrder)) {
      return Letter.weightedFrequencyOrder(letters, ({ codePoint }) =>
        codePoints.weight(codePoint),
      );
    } else {
      return Letter.frequencyOrder(letters);
    }
  }

  #makeWordGenerator(filter: Filter, lessonKeys: LessonKeys, rng: RNGStream) {
    const pseudoWords = phoneticWords(this.model, filter, rng);
    if (this.#shouldUseKoreanJamoDrills(lessonKeys)) {
      return koreanJamoDrillWords(lessonKeys, rng);
    }
    if (
      this.settings.get(lessonProps.guided.naturalWords) &&
      !this.#shouldStartWithUnlockedKeys(lessonKeys)
    ) {
      const words = this.dictionary.find(filter).slice(0, 1000);
      while (words.length < 15) {
        const word = pseudoWords();
        if (word != null) {
          words.push(word);
        } else {
          break;
        }
      }
      if (words.length === 0) {
        words.push("?");
      }
      return randomWords(words, rng);
    }
    return pseudoWords;
  }

  #shouldUseKoreanJamoDrills(lessonKeys: LessonKeys): boolean {
    if (this.model.language.id !== "ko") {
      return false;
    }
    if (lessonKeys.findIncludedKeys().length >= this.model.letters.length) {
      return false;
    }
    const focusedKey = lessonKeys.findFocusedKey();
    return focusedKey == null || focusedKey.samples.length === 0;
  }

  #shouldStartWithUnlockedKeys(lessonKeys: LessonKeys): boolean {
    return (
      this.model.language.id === "ko" &&
      lessonKeys.findIncludedKeys().length < this.model.letters.length
    );
  }
}

function koreanJamoDrillWords(
  lessonKeys: LessonKeys,
  rng: RNGStream,
): () => string | null {
  const included = lessonKeys
    .findIncludedKeys()
    .map(({ letter }) => letter.codePoint)
    .filter(isKoreanJamoLetter);
  const focused = lessonKeys.findFocusedKey();
  const focusedCodePoint =
    focused != null && isKoreanJamoLetter(focused.letter.codePoint)
      ? focused.letter.codePoint
      : null;
  const vowels = included.filter(isKoreanVowel);
  const consonants = included.filter(isKoreanConsonant);

  return () => {
    if (included.length === 0) {
      return null;
    }
    const word: CodePoint[] = [];
    // Keep vowels before consonants so early drills stay as jamo after display composition.
    appendDrillSegment(
      word,
      vowels,
      focusedCodePoint != null && isKoreanVowel(focusedCodePoint)
        ? focused
        : null,
      rng,
    );
    appendDrillSegment(
      word,
      consonants,
      focusedCodePoint != null && isKoreanConsonant(focusedCodePoint)
        ? focused
        : null,
      rng,
    );
    if (word.length === 0) {
      word.push(focusedCodePoint ?? randomSample(included, rng));
    }
    return String.fromCodePoint(...word);
  };
}

function appendDrillSegment(
  word: CodePoint[],
  codePoints: readonly CodePoint[],
  focusedKey: LessonKey | null,
  rng: RNGStream,
): void {
  if (codePoints.length === 0) {
    return;
  }
  const start = word.length;
  const length = 1 + ((rng() * 3) | 0);
  for (let i = 0; i < length; i++) {
    word.push(randomSample(codePoints, rng));
  }
  if (focusedKey != null) {
    word[start + ((rng() * length) | 0)] = focusedKey.letter.codePoint;
  }
}

function isKoreanJamoLetter(codePoint: CodePoint): boolean {
  return isKoreanConsonant(codePoint) || isKoreanVowel(codePoint);
}

function isKoreanConsonant(codePoint: CodePoint): boolean {
  return codePoint >= 0x3131 && codePoint <= 0x314e;
}

function isKoreanVowel(codePoint: CodePoint): boolean {
  return codePoint >= 0x314f && codePoint <= 0x3163;
}
