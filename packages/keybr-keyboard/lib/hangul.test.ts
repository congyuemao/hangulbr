import { test } from "node:test";
import { toCodePoints } from "@keybr/unicode";
import { deepEqual, equal, isFalse, isTrue } from "rich-assert";
import {
  composeHangulSyllable,
  composeHangulText,
  decomposeHangulSyllable,
  decomposeHangulText,
  hangulKeystream,
  isHangulJamo,
  isHangulSyllable,
} from "./hangul.ts";

test("detect hangul code points", () => {
  isTrue(isHangulSyllable("한".codePointAt(0)!));
  isFalse(isHangulSyllable("ㅎ".codePointAt(0)!));
  isTrue(isHangulJamo("ㅎ".codePointAt(0)!));
  isFalse(isHangulJamo("a".codePointAt(0)!));
});

test("decompose hangul syllables to dubeolsik jamo", () => {
  equal(decomposeHangulText("한글"), "ㅎㅏㄴㄱㅡㄹ");
  equal(decomposeHangulText("괜찮"), "ㄱㅗㅐㄴㅊㅏㄴㅎ");
  equal(decomposeHangulText("읽"), "ㅇㅣㄹㄱ");

  deepEqual(decomposeHangulSyllable("한".codePointAt(0)!), [
    "ㅎ".codePointAt(0),
    "ㅏ".codePointAt(0),
    "ㄴ".codePointAt(0),
  ]);
});

test("compose exact dubeolsik jamo syllables", () => {
  const compose = (value: string) =>
    String.fromCodePoint(composeHangulSyllable([...toCodePoints(value)])!);

  equal(compose("ㅎㅏㄴ"), "한");
  equal(compose("ㄱㅡㄹ"), "글");
  equal(compose("ㄱㅗㅐㄴ"), "괜");
  equal(compose("ㅇㅏㄴㅈ"), "앉");
  equal(compose("ㅇㅣㄹㄱ"), "읽");
});

test("compose dubeolsik jamo text for display", () => {
  equal(composeHangulText("ㅎㅏㄴ ㄱㅡㄹ"), "한 글");
  equal(composeHangulText("ㅇㅏㄴㅏ"), "아나");
  equal(composeHangulText("ㅎㅏㄴㄱㅡㄹ"), "한글");
  equal(composeHangulText("abc ㄷㄷㄷ"), "abc ㄷㄷㄷ");
});

test("make hangul keystream", () => {
  deepEqual(
    hangulKeystream([...toCodePoints("한 글")]),
    [...toCodePoints("ㅎㅏㄴ ㄱㅡㄹ")],
  );
});
