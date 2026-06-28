import {
  Attr,
  type Char,
  type TextDisplaySettings,
  WhitespaceStyle,
} from "@keybr/textinput";
import { type CodePoint } from "@keybr/unicode";
import { type MouseEventHandler, type ReactNode } from "react";
import * as styles from "./chars.module.less";
import { getTextStyle } from "./styles.ts";

export type CharTitleHandlers = {
  readonly onTitleHoverIn: (title: string, elem: Element) => void;
  readonly onTitleHoverOut: () => void;
};

export function renderChars(
  settings: TextDisplaySettings,
  chars: readonly Char[],
  titleHandlers?: CharTitleHandlers,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  type Span = {
    chars: CodePoint[];
    attrs: number;
    cls: string | null;
    title: string | null;
  };
  let span: Span = { chars: [], attrs: 0, cls: null, title: null };
  const pushSpan = (nextSpan: Span) => {
    if (span.chars.length > 0) {
      nodes.push(
        <span
          key={nodes.length}
          {...spanTitle(span.title, titleHandlers)}
          className={getClassName(span)}
          style={getTextStyle(span, /* special= */ false)}
        >
          {String.fromCodePoint(...span.chars)}
        </span>,
      );
    }
    span = nextSpan;
  };
  for (let i = 0; i < chars.length; i++) {
    const { codePoint, attrs, cls = null, title = null } = chars[i];
    if (codePoint > 0x0020) {
      if (span.attrs !== attrs || span.cls !== cls || span.title !== title) {
        pushSpan({ chars: [], attrs, cls, title });
      }
      span.chars.push(codePoint);
    } else {
      pushSpan({ chars: [], attrs, cls, title });
      nodes.push(
        <span
          key={nodes.length}
          {...spanTitle(title, titleHandlers)}
          className={getClassName(span)}
          style={getTextStyle(span, /* special= */ true)}
        >
          {specialChar(settings.whitespaceStyle, codePoint)}
        </span>,
      );
    }
  }
  pushSpan({ chars: [], attrs: 0, cls: null, title: null });
  return nodes;
}

function specialChar(whitespaceStyle: WhitespaceStyle, codePoint: CodePoint) {
  switch (codePoint) {
    case 0x0009:
      return "\uE002";
    case 0x000a:
      return "\uE003";
    case 0x0020:
      switch (whitespaceStyle) {
        case WhitespaceStyle.Bar:
          return "\uE001";
        case WhitespaceStyle.Bullet:
          return "\uE000";
        default:
          return "\u00A0";
      }
    default:
      return `U+${codePoint.toString(16).padStart(4, "0")}`;
  }
}

function getClassName({ attrs }: { readonly attrs: Attr }) {
  return attrs === Attr.Cursor ? styles.cursor : undefined;
}

function spanTitle(
  title: string | null,
  titleHandlers?: CharTitleHandlers,
): {
  readonly "title"?: string;
  readonly "data-dictionary-title"?: string;
  readonly "onMouseEnter"?: MouseEventHandler<HTMLElement>;
  readonly "onMouseLeave"?: MouseEventHandler<HTMLElement>;
} {
  if (title == null) {
    return {};
  }
  if (titleHandlers == null) {
    return { title };
  }
  return {
    "data-dictionary-title": title,
    "onMouseEnter": (event) => {
      titleHandlers.onTitleHoverIn(title, event.currentTarget);
    },
    "onMouseLeave": () => {
      titleHandlers.onTitleHoverOut();
    },
  };
}

const cursorSelector = `.${styles.cursor}`;

export function findCursor(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(cursorSelector) ?? null;
}
