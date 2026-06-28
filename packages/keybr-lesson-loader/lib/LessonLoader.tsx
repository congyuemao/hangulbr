import { loadWordList } from "@keybr/content-words";
import { catchError } from "@keybr/debug";
import { KeyboardOptions, useKeyboard } from "@keybr/keyboard";
import {
  GuidedLesson,
  type Lesson,
  lessonProps,
  LessonType,
} from "@keybr/lesson";
import { LoadingProgress } from "@keybr/pages-shared";
import { type PhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { type Settings, useSettings } from "@keybr/settings";
import { type ReactNode, useEffect, useState } from "react";

export function LessonLoader({
  children,
  fallback = <LoadingProgress />,
}: {
  readonly children: (result: Lesson) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const { settings } = useSettings();
  const lessonSettings = guidedSettings(settings);
  const { language } = KeyboardOptions.from(lessonSettings);
  return (
    <PhoneticModelLoader language={language}>
      {(model) => (
        <Loader
          key={language.id}
          model={model}
          settings={lessonSettings}
          fallback={fallback}
        >
          {children}
        </Loader>
      )}
    </PhoneticModelLoader>
  );
}

function Loader({
  model,
  settings,
  children,
  fallback,
}: {
  readonly model: PhoneticModel;
  readonly settings: Settings;
  readonly children: (result: Lesson) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const result = useLoader(model, settings);
  if (result == null) {
    return fallback;
  } else {
    return children(result);
  }
}

function useLoader(model: PhoneticModel, settings: Settings): Lesson | null {
  const keyboard = useKeyboard();
  const [result, setResult] = useState<Lesson | null>(null);

  useEffect(() => {
    let didCancel = false;

    const load = async (): Promise<void> => {
      const { language } = KeyboardOptions.from(settings);
      const wordList = await loadWordList(language);
      if (!didCancel) {
        setResult(new GuidedLesson(settings, keyboard, model, wordList));
      }
    };

    load().catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [settings, keyboard, model]);

  return result;
}

function guidedSettings(settings: Settings): Settings {
  let nextSettings = settings;
  if (nextSettings.get(lessonProps.type) !== LessonType.GUIDED) {
    nextSettings = nextSettings.set(lessonProps.type, LessonType.GUIDED);
  }
  if (nextSettings.get(lessonProps.capitals) !== 0) {
    nextSettings = nextSettings.set(lessonProps.capitals, 0);
  }
  if (nextSettings.get(lessonProps.punctuators) !== 0) {
    nextSettings = nextSettings.set(lessonProps.punctuators, 0);
  }
  return nextSettings;
}
