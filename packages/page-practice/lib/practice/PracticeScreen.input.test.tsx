import { after, test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import {
  Emulation,
  KeyboardOptions,
  keyboardProps,
  Language,
  Ngram1,
  Ngram2,
} from "@keybr/keyboard";
import { lessonProps, LessonType } from "@keybr/lesson";
import { Letter, PhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { ResultContext } from "@keybr/result";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { equal, notEqual } from "rich-assert";
import { PracticeScreen } from "./PracticeScreen.tsx";

const jamoG = 0x3131;
const jamoI = 0x3163;
const syllableGi = String.fromCodePoint(0xae30);
const originalLoader = PhoneticModelLoader.loader;

after(() => {
  PhoneticModelLoader.loader = originalLoader;
});

test("type Korean practice text with physical dubeolsik keys", async () => {
  const { r, input } = await renderKoreanPracticeScreen();

  fireEvent.keyDown(input, { code: "KeyR", key: "r" });
  fireEvent.keyUp(input, { code: "KeyR", key: "r" });
  fireEvent.keyDown(input, { code: "KeyL", key: "l" });
  fireEvent.keyUp(input, { code: "KeyL", key: "l" });

  await waitFor(() => {
    notEqual(cursorText(r.container), syllableGi);
  });

  r.unmount();
});

test("advance Korean keyboard hint after partial jamo input", async () => {
  const { r, input } = await renderKoreanPracticeScreen();

  fireEvent.keyDown(input, { code: "KeyR", key: "r" });
  fireEvent.keyUp(input, { code: "KeyR", key: "r" });

  await waitFor(
    () => {
      equal(pointerKey(r.container), "KeyL");
    },
    { timeout: 2500 },
  );

  r.unmount();
});

test("type Korean practice text with IME composed syllables", async () => {
  const { r, input } = await renderKoreanPracticeScreen();

  fireEvent.input(input, { inputType: "insertText", data: syllableGi });

  await waitFor(() => {
    notEqual(cursorText(r.container), syllableGi);
  });

  r.unmount();
});

async function renderKoreanPracticeScreen() {
  PhoneticModelLoader.loader = async () => new KoreanMiniModel();
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext initialSettings={koreanSettings()}>
        <ResultContext.Provider
          value={{
            results: [],
            appendResults: () => {},
            clearResults: () => {},
          }}
        >
          <PracticeScreen />
        </ResultContext.Provider>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  await r.findByTitle("Change lesson settings", { exact: false });
  const input = r.container.querySelector("textarea")!;
  const textAreaRoot = input.closest("div")!.parentElement!;
  await waitFor(() => {
    equal(cursorText(r.container), syllableGi);
  });
  fireEvent.click(textAreaRoot);
  return { r, input };
}

function cursorText(container: HTMLElement): string | null {
  return container.querySelector<HTMLElement>(".cursor")?.textContent ?? null;
}

function pointerKey(container: HTMLElement): string | null {
  const pointer = container.querySelector<SVGCircleElement>('circle[r="30"]');
  if (pointer == null) {
    return null;
  }
  const cx = Number(pointer.getAttribute("cx"));
  const cy = Number(pointer.getAttribute("cy"));
  for (const key of ["KeyR", "KeyL"]) {
    const elem = container.querySelector<SVGSVGElement>(
      `svg[data-key="${key}"]`,
    );
    if (elem == null) {
      continue;
    }
    const x = Number(elem.getAttribute("x"));
    const y = Number(elem.getAttribute("y"));
    const width = Number(elem.getAttribute("width"));
    const height = Number(elem.getAttribute("height"));
    if (cx === x + width / 2 && cy === y + height / 2) {
      return key;
    }
  }
  return null;
}

function koreanSettings(): Settings {
  return KeyboardOptions.default()
    .withLanguage(Language.KO)
    .save(new Settings())
    .set(keyboardProps.emulation, Emulation.None)
    .set(lessonProps.type, LessonType.CUSTOM)
    .set(
      lessonProps.customText.content,
      String.fromCodePoint(jamoG, jamoI, 0x20, jamoG, jamoI),
    )
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
