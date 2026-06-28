import {
  findKoreanDictionaryEntry,
  formatKoreanDictionaryTooltip,
} from "@keybr/content-words";
import {
  composeHangulText,
  hangulKeystream,
  keyboardProps,
  type KeyId,
} from "@keybr/keyboard";
import {
  type DailyGoal,
  Lesson,
  type LessonKeys,
  lessonProps,
} from "@keybr/lesson";
import {
  type KeyStatsMap,
  Result,
  type StreakList,
  type SummaryStats,
} from "@keybr/result";
import { type Settings } from "@keybr/settings";
import {
  type Feedback,
  flattenStyledText,
  type LineList,
  makeStats,
  type Step,
  type StyledText,
  type StyledTextSpan,
  type TextDisplaySettings,
  TextInput,
  type TextInputSettings,
  toTextDisplaySettings,
  toTextInputSettings,
} from "@keybr/textinput";
import { type IInputEvent } from "@keybr/textinput-events";
import { type CodePoint } from "@keybr/unicode";
import { type LastLesson } from "./last-lesson.ts";
import { type Progress } from "./progress.ts";

export class LessonState {
  readonly #onResult: (
    result: Result,
    textInput: TextInput,
    steps: readonly Step[],
  ) => void;
  readonly settings: Settings;
  readonly lesson: Lesson;
  readonly textInputSettings: TextInputSettings;
  readonly textDisplaySettings: TextDisplaySettings;
  readonly keyStatsMap: KeyStatsMap;
  readonly summaryStats: SummaryStats;
  readonly streakList: StreakList;
  readonly dailyGoal: DailyGoal;
  readonly lessonKeys: LessonKeys;

  lastLesson: LastLesson | null = null;

  textInput!: TextInput; // Mutable.
  lines!: LineList; // Mutable.
  suffix!: readonly CodePoint[]; // Mutable.
  depressedKeys: readonly KeyId[] = []; // Mutable.
  #resultSteps: Step[] | null = null;

  constructor(
    progress: Progress,
    onResult: (
      result: Result,
      textInput: TextInput,
      steps: readonly Step[],
    ) => void,
  ) {
    this.#onResult = onResult;
    this.settings = progress.settings;
    this.lesson = progress.lesson;
    this.textInputSettings = toTextInputSettings(this.settings);
    this.textDisplaySettings = toTextDisplaySettings(this.settings);
    this.keyStatsMap = progress.keyStatsMap.copy();
    this.summaryStats = progress.summaryStats.copy();
    this.streakList = progress.streakList.copy();
    this.dailyGoal = progress.dailyGoal.copy();
    this.lessonKeys = this.lesson.update(this.keyStatsMap);
    this.#reset(this.lesson.generate(this.lessonKeys, Lesson.rng));
  }

  resetLesson() {
    this.#reset(this.textInput.text);
  }

  skipLesson() {
    this.#reset(this.lesson.generate(this.lessonKeys, Lesson.rng));
  }

  onInput(event: IInputEvent): Feedback {
    return this.#onInput(event, []);
  }

  onHangulInput(
    event: IInputEvent,
    jamoEvents: readonly IInputEvent[],
  ): Feedback {
    return this.#onInput(event, jamoEvents);
  }

  get resultSteps(): readonly Step[] {
    return this.#resultSteps ?? this.textInput.steps;
  }

  #onInput(event: IInputEvent, jamoEvents: readonly IInputEvent[]): Feedback {
    const previousStepCount = this.textInput.steps.length;
    const feedback = this.textInput.onInput(event);
    this.#recordResultSteps(previousStepCount, jamoEvents);
    this.lines = this.textInput.lines;
    this.suffix = this.#remainingCodePoints();
    if (this.textInput.completed) {
      this.#onResult(this.#makeResult(), this.textInput, this.resultSteps);
    }
    return feedback;
  }

  #reset(fragment: StyledText) {
    const text = this.#hangulEnabled()
      ? annotateKoreanStyledText(composeHangulStyledText(fragment))
      : fragment;
    this.textInput = new TextInput(text, this.textInputSettings);
    this.lines = this.textInput.lines;
    this.suffix = this.#remainingCodePoints();
    this.#resultSteps = this.#hangulEnabled() ? [] : null;
  }

  #makeResult(timeStamp = Date.now()) {
    return Result.fromStats(
      this.settings.get(keyboardProps.layout),
      this.settings.get(lessonProps.type).textType,
      timeStamp,
      makeStats(this.resultSteps),
    );
  }

  #recordResultSteps(
    previousStepCount: number,
    jamoEvents: readonly IInputEvent[],
  ): void {
    if (this.#resultSteps == null) {
      return;
    }
    const added = this.textInput.steps.slice(previousStepCount);
    if (added.length !== 1) {
      return;
    }
    const [step] = added;
    const jamo = jamoEvents.length > 0 ? jamoEvents : expandStep(step);
    for (const event of jamo) {
      this.#resultSteps.push({
        timeStamp: event.timeStamp,
        codePoint: event.codePoint,
        timeToType: event.timeToType,
        typo: step.typo,
      });
    }
  }

  #remainingCodePoints(): CodePoint[] {
    const codePoints = this.textInput.remaining.map(
      ({ codePoint }) => codePoint,
    );
    return this.#hangulEnabled() ? hangulKeystream(codePoints) : codePoints;
  }

  #hangulEnabled(): boolean {
    return this.lesson.model.language.id === "ko";
  }
}

function expandStep(step: Step): readonly Step[] {
  const codePoints = hangulKeystream([step.codePoint]);
  return codePoints.map((codePoint) => ({
    ...step,
    codePoint,
  }));
}

function composeHangulStyledText(text: StyledText): StyledText {
  if (Array.isArray(text)) {
    return text.map(composeHangulStyledText);
  }
  if (typeof text === "string") {
    return composeHangulText(text);
  }
  return {
    ...text,
    text: composeHangulText((text as StyledTextSpan).text),
  };
}

function annotateKoreanStyledText(text: StyledText): StyledText {
  const value = flattenStyledText(text);
  const parts = value.split(/(\s+)/u);
  return parts.map((part): StyledText => {
    if (part === "" || /^\s+$/u.test(part)) {
      return part;
    }
    const entry = findKoreanDictionaryEntry(part);
    if (entry == null) {
      return part;
    }
    return {
      text: part,
      cls: "",
      title: formatKoreanDictionaryTooltip(entry),
    };
  });
}
