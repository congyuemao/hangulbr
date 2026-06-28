import { keyboardProps, loadKeyboard } from "@keybr/keyboard";
import { KeyLayer, VirtualKeyboard, ZonesLayer } from "@keybr/keyboard-ui";
import { KeyLegendList } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import { singleLine, toTextDisplaySettings } from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { Article, Figure } from "@keybr/widget";
import { FormattedMessage } from "react-intl";
import { alphabet } from "./hangul.ts";
import { ExampleLink } from "./ExampleLink.tsx";
import { KeySetIllustration } from "./figures.tsx";
import * as styles from "./HelpApp.module.less";

export function HelpPage() {
  const { settings } = useSettings();
  const keyboard = loadKeyboard(settings.get(keyboardProps.layout));
  const textDisplaySettings = toTextDisplaySettings(settings);

  return (
    <Article>
      <FormattedMessage
        id="help.section1"
        defaultMessage={
          "<h1>Practice Korean typing</h1>" +
          "<h2>Korean dubeolsik practice</h2>" +
          "<p>Hangul Typing Trainer helps you practice Korean words on the common dubeolsik layout. Lessons display composed Hangul syllables, while input and statistics are tracked by practical jamo and key positions.</p>"
        }
      />

      <FormattedMessage
        id="help.section2"
        defaultMessage={
          "<h2>The teaching method</h2>" +
          "<p>The trainer uses local typing statistics to create lessons that match your current Korean typing level. It repeats the following cycle:</p>" +
          "<ol>" +
          "<li>The algorithm selects Korean practice words from the jamo set currently unlocked for you.</li>" +
          "<li>You type the displayed Hangul words with dubeolsik input, trying to make as few mistakes as possible.</li>" +
          "<li>As you type, the trainer records timing and accuracy for each jamo/key unit. Those statistics are then used to generate the next lesson.</li>" +
          "</ol>" +
          "<p>At each stage you practice the provided Korean words, and the algorithm adjusts the next lesson.</p>"
        }
      />

      <FormattedMessage
        id="help.section3"
        defaultMessage={
          "<h2>The Korean lesson generator</h2>" +
          "<p>Guided lessons use Korean vocabulary instead of non-Korean word drills. The page shows normal Hangul such as <em>학교</em> or <em>사람</em>, while the learning model expands those syllables into dubeolsik jamo for timing and accuracy.</p>" +
          "<p>The active jamo set is selected using the following rules.</p>"
        }
      />

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>1</h3>
        <h3>
          <FormattedMessage
            id="help.rule1.title"
            defaultMessage="The algorithm starts with initial jamo"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration
            confidences={[null, null, null, null, null, null]}
          />
        </div>

        <div className={styles.example}>
          <StaticText
            settings={textDisplaySettings}
            lines={singleLine("아 이 아니 나 나라 아이 이야기")}
          />
        </div>

        <FormattedMessage
          id="help.rule1.body"
          defaultMessage="<p>When you start practicing for the first time, the trainer has no timing data yet. It begins with a small set of frequent Korean jamo such as <em>ㅇ</em>, <em>ㄴ</em>, <em>ㅏ</em>, <em>ㄱ</em>, <em>ㅣ</em>, and <em>ㄹ</em>. Unknown jamo statistics are shown in gray.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>2</h3>
        <h3>
          <FormattedMessage
            id="help.rule2.title"
            defaultMessage="You learn the initial jamo"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration confidences={[0.9, 0.6, 0.7, 0.4, 0.5, 0.5]} />
        </div>

        <div className={styles.example}>
          <StaticText
            settings={textDisplaySettings}
            lines={singleLine("나라 나이 아기 여기 길 이야기")}
          />
        </div>

        <FormattedMessage
          id="help.rule2.body"
          defaultMessage="<p>As you type the generated Korean words, the trainer collects timing statistics. Indicators move from red to green as your speed approaches the target. The highlighted jamo has the weakest metric, so the current lesson includes it more often.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>3</h3>
        <h3>
          <FormattedMessage
            id="help.rule3.title"
            defaultMessage="The algorithm adds more jamo"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration confidences={[1, 1, 1, 1, 1, 1, null]} />
        </div>

        <div className={styles.example}>
          <StaticText
            settings={textDisplaySettings}
            lines={singleLine("우리 이름 마음 사람 오래")}
          />
        </div>

        <FormattedMessage
          id="help.rule3.body"
          defaultMessage="<p>When your speed improves and the current jamo become confident, a new jamo is added to the set. Lessons are generated from the expanded Korean word pool, and the new jamo appears often until enough data is collected.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>4</h3>
        <h3>
          <FormattedMessage
            id="help.rule4.title"
            defaultMessage="You learn additional jamo"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration confidences={[1, 0.8, 0.9, 0.7, 0.6, 0.7, 0.3]} />
        </div>

        <div className={styles.example}>
          <StaticText
            settings={textDisplaySettings}
            lines={singleLine("학교 친구 공부 시간 한국")}
          />
        </div>

        <FormattedMessage
          id="help.rule4.body"
          defaultMessage="<p>Your goal is to bring the focused jamo up to the target speed. Previous jamo may slow down as words become more complex; that is expected. The cycle continues as the trainer unlocks more of the Korean typing set.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>5</h3>
        <h3>
          <FormattedMessage
            id="help.rule5.title"
            defaultMessage="The cycle repeats"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration
            confidences={Object.keys(alphabet).map(() => 1)}
          />
        </div>

        <div className={styles.example}>
          <StaticText
            settings={textDisplaySettings}
            lines={singleLine("한국어 연습 단어 문장 입력 속도 정확도")}
          />
        </div>

        <FormattedMessage
          id="help.rule5.body"
          defaultMessage="<p>With enough practice the whole Korean jamo set becomes available. You can keep practicing with richer words, raise the target speed, or reset statistics and repeat the guided cycle.</p>"
        />
      </section>

      <FormattedMessage
        id="help.section4"
        defaultMessage="<p>The precise meaning of each jamo indicator color is given in the following legend.</p>"
      />

      <Figure>
        <Figure.Caption>
          <FormattedMessage
            id="help.indicators.caption"
            defaultMessage="Jamo indicator color coding."
          />
        </Figure.Caption>
        <KeyLegendList />
      </Figure>

      <FormattedMessage
        id="help.section5"
        defaultMessage={
          "<h2>Using the dubeolsik keyboard</h2>" +
          "<p>The virtual keyboard shows the Korean dubeolsik layout. Use it to connect Hangul jamo with physical key positions, then return your attention to the displayed Korean words.</p>"
        }
      />

      <Figure>
        <Figure.Caption>
          <FormattedMessage
            id="help.keyboardZones.caption"
            defaultMessage="Keyboard zones for the Korean dubeolsik layout."
          />
        </Figure.Caption>
        <VirtualKeyboard keyboard={keyboard}>
          <KeyLayer showColors={true} />
          <ZonesLayer />
        </VirtualKeyboard>
      </Figure>

      <FormattedMessage
        id="help.section6"
        defaultMessage={
          "<h2>The effectiveness of adaptive practice</h2>" +
          "<p>The following example profiles illustrate how speed and accuracy can change over time when lessons keep focusing on the slowest practice units.</p>"
        }
      />

      <ul>
        <li>
          <FormattedMessage
            id="help.example1"
            defaultMessage="<a>Example 1</a>, a steady speed increase after 4 hours 20 minutes of Korean practice across 15 days."
            values={{
              a: (chunks) => <ExampleLink index={1}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example2"
            defaultMessage="<a>Example 2</a>, a faster early jump after 2 hours and 20 minutes of focused dubeolsik practice across 12 days."
            values={{
              a: (chunks) => <ExampleLink index={2}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example3"
            defaultMessage="<a>Example 3</a>, accuracy stabilizing while the active Korean jamo set expands over 11 days."
            values={{
              a: (chunks) => <ExampleLink index={3}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example4"
            defaultMessage="<a>Example 4</a>, speed staying mostly flat while accuracy improves after repeated lessons."
            values={{
              a: (chunks) => <ExampleLink index={4}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example5"
            defaultMessage="<a>Example 5</a>, slower but persistent progress after about 10 hours of Korean typing practice."
            values={{
              a: (chunks) => <ExampleLink index={5}>{chunks}</ExampleLink>,
            }}
          />
        </li>
      </ul>
    </Article>
  );
}
