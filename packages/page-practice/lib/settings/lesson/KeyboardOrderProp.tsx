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

export function KeyboardOrderProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "setting.keyboardOrder.label",
              defaultMessage: "Sort jamo in the order of keyboard keys",
            })}
            checked={settings.get(lessonProps.guided.keyboardOrder)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.guided.keyboardOrder, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="setting.keyboardOrder.description"
            defaultMessage="Sort jamo so that home-row keys come first, then top-row keys, and finally the remaining keys. This can make early dubeolsik lessons focus on positions that are easier to reach."
          />
        </Description>
      </Explainer>
    </>
  );
}
