import { KeyLegendList, names } from "@keybr/lesson-ui";
import { Slide, Tour } from "@keybr/widget";
import { memo } from "react";
import { FormattedMessage } from "react-intl";
import { KeyDetailsChartDemo } from "./KeyDetailsChartDemo.tsx";

export const PracticeTour = memo(function PracticeTour({
  onClose,
}: {
  readonly onClose?: () => void;
}) {
  return (
    <Tour onClose={onClose}>
      <Slide size="large">
        <FormattedMessage
          id="m_tour01"
          defaultMessage={
            "<h1>Practice Korean typing</h1>" +
            "<p>Hangul Typing Trainer helps you practice Korean dubeolsik input. You read normal Hangul words, while the app tracks the underlying jamo and physical key timing.</p>" +
            "<p>This short tutorial explains how the practice screen works.</p>" +
            "<p>You can use the left and right arrow keys to navigate through these slides.</p>"
          }
        />
      </Slide>
      <Slide size="large">
        <FormattedMessage
          id="m_tour02"
          defaultMessage={
            "<p>The method is adaptive:</p>" +
            "<p>No fixed drill sequence. The lesson text changes as your local statistics change, so practice stays focused on your current weak spots.</p>" +
            "<p>The algorithm generates Korean practice words from the currently unlocked jamo set. The size of that set and the frequency of individual jamo are adjusted from your typing history.</p>"
          }
        />
      </Slide>
      <Slide size="large">
        <FormattedMessage
          id="m_tour03"
          defaultMessage={
            "<p>At first the trainer uses a small subset of frequent Korean jamo.</p>" +
            "<p>As you type each Hangul word, the application measures timing and accuracy for every jamo/key unit in that subset. The more familiar you become with a unit, the less time it takes to type it.</p>" +
            "<p>Once you become confident with the current subset, the algorithm expands it by adding more jamo.</p>"
          }
        />
      </Slide>
      <Slide size="large">
        <FormattedMessage
          id="m_tour04"
          defaultMessage={
            "<p>When the algorithm adds a new jamo to the current subset, that jamo appears more often in the lesson.</p>" +
            "<p>The algorithm can also rearrange frequencies to emphasize the units with the weakest time-to-type metric.</p>" +
            "<p>This means you spend more time on the Korean typing units that are least familiar.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.textInput}`} position="block-end">
        <FormattedMessage
          id="m_tour05"
          defaultMessage="<p>This is the text board. It displays Korean practice words as composed Hangul. The text changes for each new lesson and is generated from the current jamo subset.</p>"
        />
      </Slide>
      <Slide size="small" anchor={`#${names.keyboard}`} position="block-start">
        <FormattedMessage
          id="m_tour06"
          defaultMessage="<p>This is the virtual dubeolsik keyboard. It helps you connect each Hangul jamo to its physical key position. Use it as a reference, then return your attention to the Korean text.</p>"
        />
      </Slide>
      <Slide size="small" anchor={`#${names.speed}`} position="block-end">
        <FormattedMessage
          id="m_tour07"
          defaultMessage={
            "<p>This is the typing speed indicator and the difference from the average value. Your goal is to increase this metric, meaning higher values are better.</p>" +
            "<p>Typing speed is measured in either <em>Words per Minute (WPM)</em> or <em>Characters per Minute (CPM)</em>. WPM is standardized as five jamo or characters, so <em>10WPM</em> is equal to <em>50CPM</em>.</p>" +
            "<p>You can switch between the <em>WPM</em> and the <em>CPM</em> display modes on the Settings page.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.accuracy}`} position="block-end">
        <FormattedMessage
          id="m_tour08"
          defaultMessage={
            "<p>This is the accuracy indicator and the difference from the average value. Your goal is to increase this metric, meaning higher values are better.</p>" +
            "<p>Accuracy is computed as the percentage of typed units without errors. Many typos in the same position count as one error.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.score}`} position="block-end">
        <FormattedMessage
          id="m_tour09"
          defaultMessage={
            "<p>This is the typing score indicator in abstract points and the difference from the average value.</p>" +
            "<p>The score is calculated from your typing speed, error count, and the current size of the jamo set. The formula rewards speed and penalizes mistakes, so typing fast with many errors will not produce a strong score.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.keySet}`} position="block-end">
        <FormattedMessage
          id="m_tour10"
          defaultMessage="<p>This indicator shows the current subset of jamo used to generate the lessons, and your confidence level for every jamo in the subset:</p>"
        />
        <KeyLegendList />
      </Slide>
      <Slide size="small" anchor={`#${names.keySet}`} position="block-end">
        <FormattedMessage
          id="m_tour11"
          defaultMessage="<p>This indicator can also predict the remaining number of lessons needed to unlock a jamo, like in the example chart below. Visit it regularly to see how your learning is changing.</p>"
        />
        <KeyDetailsChartDemo />
      </Slide>
      <Slide size="small" anchor={`#${names.currentKey}`} position="block-end">
        <FormattedMessage
          id="m_tour12"
          defaultMessage={
            "<p>This indicator shows details about the focused jamo, which appears more often in the current lesson:</p>" +
            "<dl>" +
            "<dt>Best typing speed</dt>" +
            "<dd>Your best typing speed for this individual jamo.</dd>" +
            "<dt>Confidence level</dt>" +
            "<dd>A number from zero to one computed from your typing speed. It indicates your familiarity with this jamo. A jamo is considered fully learned when its confidence level reaches one.</dd>" +
            "<dt>Learning rate</dt>" +
            "<dd>How your typing speed is changing with each lesson.</dd>" +
            "</dl>"
          }
        />
      </Slide>
    </Tour>
  );
});
