import { test } from "node:test";
import { deepEqual, equal, isFalse, isTrue } from "rich-assert";
import { HangulIme } from "./hangul-ime.ts";
import { type IInputEvent } from "./types.ts";

test("compose dubeolsik jamo to hangul syllable", () => {
  const ime = new HangulIme();
  const expected = cp("한");

  deepEqual(ime.consume(input("ㅎ"), expected).events, []);
  equal(ime.preedit, "ㅎ");
  deepEqual(ime.consume(input("ㅏ"), expected).events, []);
  equal(ime.preedit, "ㅎㅏ");

  const result = ime.consume(input("ㄴ"), expected);
  equal(result.preedit, "");
  isTrue(result.valid);
  equal(result.events.length, 1);
  equal(result.events[0].codePoint, expected);
  deepEqual(
    result.jamoEvents.map(({ codePoint }) => String.fromCodePoint(codePoint)),
    ["ㅎ", "ㅏ", "ㄴ"],
  );
});

test("delete hangul preedit", () => {
  const ime = new HangulIme();
  const expected = cp("한");

  ime.consume(input("ㅎ"), expected);
  ime.consume(input("ㅏ"), expected);
  const result = ime.consume(clearChar(), expected);

  equal(result.preedit, "ㅎ");
  deepEqual(result.events, []);
});

test("pass through wrong jamo as a failed input event", () => {
  const ime = new HangulIme();
  const expected = cp("한");

  ime.consume(input("ㅎ"), expected);
  const result = ime.consume(input("ㅓ"), expected);

  equal(result.events.length, 1);
  equal(result.events[0].codePoint, cp("ㅓ"));
  equal(result.preedit, "");
  isFalse(result.valid);
});

test("pass through non-hangul targets", () => {
  const ime = new HangulIme();
  const result = ime.consume(input("a"), cp("a"));

  equal(result.events.length, 1);
  equal(result.events[0].codePoint, cp("a"));
});

function input(value: string): IInputEvent {
  return {
    type: "input",
    timeStamp: 100,
    inputType: "appendChar",
    codePoint: cp(value),
    timeToType: 50,
  };
}

function clearChar(): IInputEvent {
  return {
    type: "input",
    timeStamp: 100,
    inputType: "clearChar",
    codePoint: 0,
    timeToType: 50,
  };
}

function cp(value: string) {
  return value.codePointAt(0)!;
}
