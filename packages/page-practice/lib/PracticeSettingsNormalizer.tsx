import { KeyboardOptions, Language, Layout } from "@keybr/keyboard";
import { lessonProps, LessonType } from "@keybr/lesson";
import { LoadingProgress } from "@keybr/pages-shared";
import { type Settings, useSettings } from "@keybr/settings";
import { type ReactNode, useEffect } from "react";

export function normalizePracticeSettings(settings: Settings): Settings {
  let nextSettings = settings;
  const options = KeyboardOptions.from(nextSettings);

  if (options.language !== Language.KO || options.layout !== Layout.KO_KR) {
    nextSettings = KeyboardOptions.default().save(nextSettings);
  }

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

export function PracticeSettingsNormalizer({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const { settings, updateSettings } = useSettings();
  const normalizedSettings = normalizePracticeSettings(settings);
  const isNormalized = normalizedSettings === settings;

  useEffect(() => {
    if (!isNormalized) {
      updateSettings(normalizedSettings);
    }
  }, [isNormalized, normalizedSettings, updateSettings]);

  return isNormalized ? children : <LoadingProgress />;
}
