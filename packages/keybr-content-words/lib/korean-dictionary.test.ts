import { test } from "node:test";
import { equal, fail, isTrue } from "rich-assert";
import {
  findKoreanDictionaryEntry,
  formatKoreanDictionaryTooltip,
  koreanDictionary,
} from "./korean-dictionary.ts";

test("korean dictionary entries", () => {
  equal(koreanDictionary.length, 5000);

  const entry = findKoreanDictionaryEntry("하다");
  if (entry == null) {
    fail("Missing Korean dictionary entry");
  }

  equal(entry.word, "하다");
  equal(entry.jamo, "ㅎㅏㄷㅏ");
  isTrue(entry.en.length > 0);

  const tooltip = formatKoreanDictionaryTooltip(entry);
  isTrue(tooltip.includes("하다"));
  isTrue(tooltip.includes("EN:"));
});

test("missing korean dictionary entry", () => {
  equal(findKoreanDictionaryEntry("없는단어"), null);
});
