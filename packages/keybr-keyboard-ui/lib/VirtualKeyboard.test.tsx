import { test } from "node:test";
import { Geometry, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { isTrue } from "rich-assert";
import { KeyLayer } from "./KeyLayer.tsx";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

test("render standard 101", () => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101);

  const r = render(
    <VirtualKeyboard keyboard={keyboard}>
      <KeyLayer />
    </VirtualKeyboard>,
  );

  r.unmount();
});

test("render standard 101 full", () => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101_FULL);

  const r = render(
    <VirtualKeyboard keyboard={keyboard}>
      <KeyLayer />
    </VirtualKeyboard>,
  );

  r.unmount();
});

test("render korean dubeolsik keycaps", () => {
  const keyboard = loadKeyboard(Layout.KO_KR, Geometry.KOREAN_103);

  const r = render(
    <VirtualKeyboard keyboard={keyboard}>
      <KeyLayer />
    </VirtualKeyboard>,
  );

  const text = r.container.textContent ?? "";
  isTrue(text.includes("ㅂ"));
  isTrue(text.includes("ㅈ"));
  isTrue(text.includes("ㅏ"));
  isTrue(text.includes("ㅜ"));
  isTrue(text.includes("Q"));
  isTrue(text.includes("K"));
  isTrue(text.includes("한/영"));
  isTrue(r.container.querySelector('[data-key="KeyQ"]') != null);

  r.unmount();
});
