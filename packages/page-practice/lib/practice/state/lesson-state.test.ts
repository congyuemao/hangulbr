import { test } from "node:test";
import {
  KeyboardOptions,
  Language,
  loadKeyboard,
  Ngram1,
  Ngram2,
} from "@keybr/keyboard";
import { CustomTextLesson, lessonProps, LessonType } from "@keybr/lesson";
import { Letter, PhoneticModel } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import { equal } from "rich-assert";
import { LessonState } from "./lesson-state.ts";
import { Progress } from "./progress.ts";

const jamoG = 0x3131;
const jamoI = 0x3163;

test("advance Korean keyboard suffix while composing a syllable", () => {
  const settings = koreanSettings();
  const lesson = new CustomTextLesson(
    settings,
    loadKeyboard(KeyboardOptions.from(settings).layout),
    new KoreanMiniModel(),
  );
  const state = new LessonState(new Progress(settings, lesson), () => {});

  equal(state.suffix[0], jamoG);
  equal(state.suffix[1], jamoI);

  state.onHangulPreedit(String.fromCodePoint(jamoG));

  equal(state.suffix[0], jamoI);
});

function koreanSettings(): Settings {
  return KeyboardOptions.default()
    .withLanguage(Language.KO)
    .save(new Settings())
    .set(lessonProps.type, LessonType.CUSTOM)
    .set(lessonProps.customText.content, String.fromCodePoint(jamoG, jamoI))
    .set(lessonProps.customText.randomize, false)
    .set(lessonProps.customText.lowercase, false)
    .set(lessonProps.customText.lettersOnly, true);
}

class KoreanMiniModel extends PhoneticModel {
  constructor() {
    super(Language.KO, [
      new Letter(jamoG, 0.5, String.fromCodePoint(jamoG)),
      new Letter(jamoI, 0.5, String.fromCodePoint(jamoI)),
    ]);
  }

  override nextWord(): string {
    return String.fromCodePoint(jamoG, jamoI);
  }

  override ngram1(): Ngram1 {
    const ngram = new Ngram1([jamoG, jamoI]);
    ngram.set(jamoG, 1);
    ngram.set(jamoI, 1);
    return ngram;
  }

  override ngram2(): Ngram2 {
    const ngram = new Ngram2([jamoG, jamoI]);
    ngram.set(jamoG, jamoI, 1);
    return ngram;
  }
}
