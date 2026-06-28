import { type GuidedLesson, lessonProps, LessonType } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { useSettings } from "@keybr/settings";
import { Tab, TabList } from "@keybr/widget";
import { type ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";
import { DailyGoalSettings } from "./lesson/DailyGoalSettings.tsx";
import { GuidedLessonSettings } from "./lesson/GuidedLessonSettings.tsx";
import { LessonPreview } from "./lesson/LessonPreview.tsx";

export function LessonSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const lessonType = settings.get(lessonProps.type);
  const capitals = settings.get(lessonProps.capitals);
  const punctuators = settings.get(lessonProps.punctuators);

  useEffect(() => {
    let nextSettings = settings;
    if (lessonType !== LessonType.GUIDED) {
      nextSettings = nextSettings.set(lessonProps.type, LessonType.GUIDED);
    }
    if (capitals !== 0) {
      nextSettings = nextSettings.set(lessonProps.capitals, 0);
    }
    if (punctuators !== 0) {
      nextSettings = nextSettings.set(lessonProps.punctuators, 0);
    }
    if (nextSettings !== settings) {
      updateSettings(nextSettings);
    }
  }, [capitals, lessonType, punctuators, settings, updateSettings]);

  return (
    <>
      <TabList selectedIndex={0} onSelect={() => {}}>
        {[
          <Tab
            key="guided"
            label={formatMessage({
              id: "t_Guided_lessons",
              defaultMessage: "Guided lessons",
            })}
          />,
        ]}
      </TabList>
      <LessonLoader>
        {(lesson) => (
          <>
            <GuidedLessonSettings lesson={lesson as GuidedLesson} />
            <LessonPreview lesson={lesson} />
            <DailyGoalSettings />
          </>
        )}
      </LessonLoader>
    </>
  );
}
