import { test } from "node:test";
import { equal, isFalse, isTrue } from "rich-assert";
import { Language } from "./language.ts";

test("string manipulation", () => {
  equal(Language.TR.upperCase(""), "");
  equal(Language.TR.upperCase("AaIıİi"), "AAIIİİ");
  equal(Language.TR.lowerCase(""), "");
  equal(Language.TR.lowerCase("AaIıİi"), "aaııii");
  equal(Language.TR.capitalCase(""), "");
  equal(Language.TR.capitalCase("aaIıİi"), "Aaııii");
});

test("check words", () => {
  isTrue(Language.EN.test(""));
  isTrue(Language.EN.test("ABCdef"));
  isFalse(Language.EN.test("AaIıİi"));
  isFalse(Language.EN.test("абвгде"));

  isTrue(Language.KO.test("ㅂㅈㄷㄱㅅㅏㅓ"));
  isFalse(Language.KO.test("hangul"));
  isFalse(Language.KO.test("한글"));
});

test("letter name", () => {
  equal(Language.EN.letterName(0x0069), "I");
  equal(Language.TR.letterName(0x0069), "İ");
  equal(Language.DE.letterName(0x00df), "ẞ");
  equal(Language.HE.letterName(0x05d0), "\u05D0");
  equal(Language.AR.letterName(0x0627), "\u200c\u0627");
  equal(Language.FA.letterName(0x0627), "\u200c\u0627");
  equal(Language.KO.letterName(0x3142), "ㅂ");
});
