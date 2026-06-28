import { Tasks } from "@keybr/lang";
import {
  type Char,
  charArraysAreEqual,
  type Line,
  type LineList,
  type TextDisplaySettings,
  textDisplaySettings,
} from "@keybr/textinput";
import { Popup, Portal } from "@keybr/widget";
import { clsx } from "clsx";
import {
  type ComponentType,
  type CSSProperties,
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type CharTitleHandlers, renderChars } from "./chars.tsx";
import { Cursor } from "./Cursor.tsx";
import { textItemStyle } from "./styles.ts";
import * as styles from "./TextLines.module.less";

export type TextLineSize = "X0" | "X1" | "X2" | "X3";

type State = Readonly<
  | { type: "hidden" }
  | { type: "visible-in"; title: string; elem: Element }
  | { type: "visible"; title: string; elem: Element }
  | { type: "visible-out"; title: string; elem: Element }
>;

export const TextLines = memo(function TextLines({
  settings = textDisplaySettings,
  lines,
  wrap = true,
  size = "X0",
  lineTemplate: LineTemplate,
  cursor,
  focus,
}: {
  readonly lines: LineList;
  readonly settings?: TextDisplaySettings;
  readonly wrap?: boolean;
  readonly size?: TextLineSize;
  readonly lineTemplate?: ComponentType<any>;
  readonly cursor: boolean;
  readonly focus: boolean;
}): ReactNode {
  const className = clsx(
    styles.root,
    wrap ? styles.wrap : styles.nowrap,
    focus ? styles.focus : styles.blur,
    size === "X0" && styles.size_X0,
    size === "X1" && styles.size_X1,
    size === "X2" && styles.size_X2,
    size === "X3" && styles.size_X3,
  );
  const [state, setState] = useState<State>({ type: "hidden" });
  useEffect(() => {
    const tasks = new Tasks();
    switch (state.type) {
      case "visible-in":
        tasks.delayed(300, () => {
          setState({ ...state, type: "visible" });
        });
        break;
      case "visible-out":
        tasks.delayed(300, () => {
          setState({ type: "hidden" });
        });
        break;
    }
    return () => {
      tasks.cancelAll();
    };
  }, [state]);
  const titleHandlers = useMemo<CharTitleHandlers>(
    () => ({
      onTitleHoverIn(title, elem) {
        setState({ type: "visible-in", title, elem });
      },
      onTitleHoverOut() {
        setState((state) => {
          switch (state.type) {
            case "visible-in":
              return { type: "hidden" };
            case "visible":
              return { ...state, type: "visible-out" };
            default:
              return state;
          }
        });
      },
    }),
    [],
  );
  const children = lines.lines.map(({ text, chars, ...props }: Line) =>
    LineTemplate != null ? (
      <LineTemplate key={text} {...props}>
        <TextLine
          key={text}
          settings={settings}
          chars={chars}
          className={className}
          style={settings.font.cssProperties}
          titleHandlers={titleHandlers}
        />
      </LineTemplate>
    ) : (
      <TextLine
        key={text}
        settings={settings}
        chars={chars}
        className={className}
        style={settings.font.cssProperties}
        titleHandlers={titleHandlers}
      />
    ),
  );
  return (
    <>
      {cursor ? <Cursor settings={settings}>{children}</Cursor> : children}
      {(state.type === "visible" || state.type === "visible-out") && (
        <Portal>
          <Popup
            anchor={state.elem}
            onMouseEnter={() => {
              setState({ ...state, type: "visible" });
            }}
            onMouseLeave={() => {
              setState({ ...state, type: "visible-out" });
            }}
          >
            <DictionaryTitle title={state.title} />
          </Popup>
        </Portal>
      )}
    </>
  );
});

const TextLine = memo(
  function TextLine({
    settings,
    chars,
    className,
    style,
    titleHandlers,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
    readonly className: string;
    readonly style: CSSProperties;
    readonly titleHandlers: CharTitleHandlers;
  }): ReactNode {
    const items: Char[][] = [];
    let itemChars: Char[] = [];
    let ws = false;
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      switch (char.codePoint) {
        case 0x0009:
        case 0x000a:
        case 0x0020:
          ws = true;
          break;
        default:
          if (ws) {
            if (itemChars.length > 0) {
              items.push(itemChars);
              itemChars = [];
            }
            ws = false;
          }
          break;
      }
      itemChars.push(char);
    }
    if (itemChars.length > 0) {
      items.push(itemChars);
      itemChars = [];
    }
    return (
      <div
        className={className}
        style={style}
        dir={settings.language.direction}
      >
        {items.map((chars, index) => (
          <TextItem
            key={index}
            settings={settings}
            chars={chars}
            titleHandlers={titleHandlers}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.settings === nextProps.settings &&
    charArraysAreEqual(prevProps.chars, nextProps.chars) && // deep equality
    prevProps.className === nextProps.className &&
    prevProps.titleHandlers === nextProps.titleHandlers,
);

const TextItem = memo(
  function TextItem({
    settings,
    chars,
    titleHandlers,
  }: {
    readonly settings: TextDisplaySettings;
    readonly chars: readonly Char[];
    readonly titleHandlers: CharTitleHandlers;
  }): ReactNode {
    return (
      <span style={textItemStyle}>
        {renderChars(settings, chars, titleHandlers)}
      </span>
    );
  },
  (prevProps, nextProps) =>
    prevProps.settings === nextProps.settings &&
    charArraysAreEqual(prevProps.chars, nextProps.chars) && // deep equality
    prevProps.titleHandlers === nextProps.titleHandlers,
);

function DictionaryTitle({ title }: { readonly title: string }): ReactNode {
  const [head, ...lines] = title.split(/\r?\n/);
  return (
    <div className={styles.dictionaryPopup}>
      <div className={styles.dictionaryTitle}>{head}</div>
      {lines
        .filter((line) => line.trim().length > 0)
        .map((line, index) => (
          <div key={index} className={styles.dictionaryLine}>
            {line}
          </div>
        ))}
    </div>
  );
}
