import { test } from "node:test";
import { Attr, textDisplaySettings } from "@keybr/textinput";
import { PortalContainer } from "@keybr/widget";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { equal, isNotNull } from "rich-assert";
import { TextLines } from "./TextLines.tsx";

test.before(() => {
  if (document.getElementById(PortalContainer.id) == null) {
    const container = document.createElement("div");
    container.id = PortalContainer.id;
    document.body.appendChild(container);
  }
});

test("render chars", () => {
  const r = render(
    <TextLines
      settings={textDisplaySettings}
      lines={{
        text: "abcd",
        lines: [
          {
            text: "abcd",
            chars: [
              { codePoint: /* "a" */ 0x0061, attrs: Attr.Miss },
              { codePoint: /* "b" */ 0x0062, attrs: Attr.Hit },
              { codePoint: /* "c" */ 0x0063, attrs: Attr.Cursor },
              { codePoint: /* "d" */ 0x0064, attrs: Attr.Normal },
            ],
          },
        ],
      }}
      cursor={false}
      focus={true}
    />,
  );

  equal(r.container.textContent, "abcd");

  r.unmount();
});

test("show title popup", async () => {
  const r = render(
    <TextLines
      settings={textDisplaySettings}
      lines={{
        text: "ko",
        lines: [
          {
            text: "ko",
            chars: [
              {
                codePoint: /* "k" */ 0x006b,
                attrs: Attr.Normal,
                title: "가다\n简中: 去",
              },
              {
                codePoint: /* "o" */ 0x006f,
                attrs: Attr.Normal,
                title: "가다\n简中: 去",
              },
            ],
          },
        ],
      }}
      cursor={false}
      focus={true}
    />,
  );

  const span = r.container.querySelector("[data-dictionary-title]");
  isNotNull(span);
  equal(span.getAttribute("title"), null);

  fireEvent.mouseEnter(span);

  await waitFor(() => {
    isNotNull(r.queryByText("简中: 去"));
  });

  r.unmount();
});

test("render chars with line template", () => {
  const r = render(
    <TextLines
      settings={textDisplaySettings}
      lines={{
        text: "abcd",
        lines: [
          {
            text: "abcd",
            chars: [
              { codePoint: /* "a" */ 0x0061, attrs: Attr.Miss },
              { codePoint: /* "b" */ 0x0062, attrs: Attr.Hit },
              { codePoint: /* "c" */ 0x0063, attrs: Attr.Cursor },
              { codePoint: /* "d" */ 0x0064, attrs: Attr.Normal },
            ],
          },
        ],
      }}
      cursor={false}
      focus={true}
      lineTemplate={({ children }) => <div>[{children}]</div>}
    />,
  );

  equal(r.container.textContent, "[abcd]");

  r.unmount();
});
