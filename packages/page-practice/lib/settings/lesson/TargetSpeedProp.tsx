import { Dir } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import {
  Description,
  Explainer,
  Field,
  FieldList,
  Icon,
  IconButton,
  Range,
  Value,
} from "@keybr/widget";
import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function TargetSpeedProp(): ReactNode {
  const { formatSpeed } = useFormatter();
  const { settings, updateSettings } = useSettings();
  const targetSpeed = settings.get(lessonProps.targetSpeed);
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="t_Target_typing_speed:"
            defaultMessage="Target typing speed:"
          />
        </Field>
        <Field>
          <Range
            size={16}
            min={lessonProps.targetSpeed.min}
            max={lessonProps.targetSpeed.max}
            step={1}
            value={targetSpeed}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.targetSpeed, value));
            }}
          />
        </Field>
        <Field>
          <Dir swap="icon">
            <IconButton
              icon={<Icon shape={mdiSkipPrevious} />}
              disabled={targetSpeed === lessonProps.targetSpeed.min}
              onClick={() => {
                updateSettings(
                  settings.set(
                    lessonProps.targetSpeed,
                    Math.ceil(targetSpeed / 5) * 5 - 5,
                  ),
                );
              }}
            />
            <IconButton
              icon={<Icon shape={mdiSkipNext} />}
              disabled={targetSpeed === lessonProps.targetSpeed.max}
              onClick={() => {
                updateSettings(
                  settings.set(
                    lessonProps.targetSpeed,
                    Math.floor(targetSpeed / 5) * 5 + 5,
                  ),
                );
              }}
            />
          </Dir>
        </Field>
        <Field>
          <Value value={formatSpeed(targetSpeed)} />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.targetSpeed.description"
            defaultMessage="The target speed is used to measure the confidence level and color of each jamo. The closer to the target speed, the greener. In guided mode a jamo is unlocked only when you pass the target speed threshold. When you unlock all jamo, you can increase the target speed and repeat the guided cycle with a higher threshold."
          />
        </Description>
      </Explainer>
    </>
  );
}
