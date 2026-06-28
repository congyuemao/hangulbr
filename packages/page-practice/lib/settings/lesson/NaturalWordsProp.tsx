import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Description,
  Explainer,
  Field,
  FieldList,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function NaturalWordsProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "t_Prefer_natural_words",
              defaultMessage: "Prefer natural words",
            })}
            checked={settings.get(lessonProps.guided.naturalWords)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.guided.naturalWords, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.naturalWords.description"
            defaultMessage="Use Korean dictionary words as much as possible, and fall back to generated practice items only when the active jamo set is still too small. Natural Korean words are usually easier to read, while generated items can cover more jamo combinations early in training."
          />
        </Description>
      </Explainer>
    </>
  );
}
