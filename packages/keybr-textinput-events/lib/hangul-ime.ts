import {
  decomposeHangulSyllable,
  isHangulJamo,
  isHangulSyllable,
} from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { type IInputEvent } from "./types.ts";

export type HangulImeResult = {
  readonly events: readonly IInputEvent[];
  readonly jamoEvents: readonly IInputEvent[];
  readonly preedit: string;
  readonly valid: boolean;
};

export class HangulIme {
  #preedit: IInputEvent[] = [];
  #valid = true;

  get preedit(): string {
    return String.fromCodePoint(
      ...this.#preedit.map(({ codePoint }) => codePoint),
    );
  }

  get valid(): boolean {
    return this.#valid;
  }

  reset(): void {
    this.#preedit = [];
    this.#valid = true;
  }

  consume(event: IInputEvent, expected: CodePoint | null): HangulImeResult {
    switch (event.inputType) {
      case "clearChar":
        if (this.#preedit.length > 0) {
          this.#preedit = this.#preedit.slice(0, -1);
          this.#valid = true;
          return this.#result();
        }
        this.reset();
        return this.#result([event]);
      case "clearWord":
        this.reset();
        return this.#result([event]);
      case "appendLineBreak":
        if (this.#preedit.length === 0) {
          return this.#result([event]);
        }
        return this.#result();
      case "appendChar":
        return this.#appendChar(event, expected);
    }
  }

  #appendChar(event: IInputEvent, expected: CodePoint | null): HangulImeResult {
    if (
      expected == null ||
      !isHangulSyllable(expected) ||
      !isHangulJamo(event.codePoint)
    ) {
      this.reset();
      return this.#result([event]);
    }

    const expectedJamo = decomposeHangulSyllable(expected);
    if (expectedJamo == null) {
      this.reset();
      return this.#result([event]);
    }

    const next = [...this.#preedit, event];
    const nextCodePoints = next.map(({ codePoint }) => codePoint);
    if (!startsWith(expectedJamo, nextCodePoints)) {
      this.#preedit = [];
      this.#valid = false;
      return this.#result([event]);
    }

    this.#preedit = next;
    this.#valid = true;
    if (same(expectedJamo, nextCodePoints)) {
      const jamoEvents = this.#preedit;
      this.reset();
      return this.#result([{ ...event, codePoint: expected }], jamoEvents);
    }
    return this.#result();
  }

  #result(
    events: readonly IInputEvent[] = [],
    jamoEvents: readonly IInputEvent[] = [],
  ): HangulImeResult {
    return {
      events,
      jamoEvents,
      preedit: this.preedit,
      valid: this.valid,
    };
  }
}

function startsWith(
  a: readonly CodePoint[],
  b: readonly CodePoint[],
): boolean {
  if (b.length > a.length) {
    return false;
  }
  for (let i = 0; i < b.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function same(a: readonly CodePoint[], b: readonly CodePoint[]): boolean {
  return a.length === b.length && startsWith(a, b);
}
