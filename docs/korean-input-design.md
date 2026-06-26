# Korean Input Design / 韩语输入设计

Date / 日期: 2026-06-27

## 中文

本项目默认使用韩国人最常用的韩文二段式键盘。此前讨论过三段式，但当前学习分析也确定按二段式进行。

### 布局原则

二段式把辅音主要放在左手区，元音主要放在右手区。训练界面应该直接展示韩文 jamo 标签，而不是要求学习者先通过罗马字输入。

基础键位：

```text
Q W E R T    Y U I O P
ㅂ ㅈ ㄷ ㄱ ㅅ    ㅛ ㅕ ㅑ ㅐ ㅔ

A S D F G    H J K L
ㅁ ㄴ ㅇ ㄹ ㅎ    ㅗ ㅓ ㅏ ㅣ

Z X C V B    N M
ㅋ ㅌ ㅊ ㅍ ㅠ    ㅜ ㅡ
```

Shift 键位：

```text
Shift+Q = ㅃ
Shift+W = ㅉ
Shift+E = ㄸ
Shift+R = ㄲ
Shift+T = ㅆ
Shift+O = ㅒ
Shift+P = ㅖ
```

### 学习分析原则

训练统计应以“二段式实际按键与 jamo”为核心，而不是以 Unicode 组合音节为核心。

推荐内部模型：

- 课程目标内部保存为 jamo/key stream。
- 展示层把 jamo stream 组合成正常韩文音节。
- 输入层把用户按键转换为 jamo event，并与目标 stream 对齐。
- 结果统计至少保留 key、jamo、手指区域和错误类型。
- 组合音节统计可以作为后续辅助视图，不作为自适应训练的第一指标。

### 面向中国韩语学习者的界面

初期界面应减少解释性文字，把重点放在键盘、当前目标、错误反馈和进度上。

建议：

- 键帽同时显示 Latin key 与 Hangul jamo。
- 当前目标高亮实际要按的键和 jamo。
- 练习文本显示正常组合韩文，避免长期展示拆散的 jamo 文本。
- 在设置中保留“显示 jamo 辅助”开关，帮助初学者过渡。
- 不把罗马字输入作为主路径；罗马字可以作为学习辅助，但不应替代二段式按键训练。

### 关键技术边界

keybr 原始统计大量围绕字符 code point 工作。韩语如果直接用 `가`, `나`, `안` 等组合音节作为训练字符，系统会倾向于按音节统计，这与二段式按键学习不一致。

因此韩语改造的关键不是简单新增一个 `ko` 语言，而是要建立一层清晰边界：

- lesson 生成：产生 jamo/key stream。
- display rendering：把 stream 组合为可读韩文。
- input handling：把键盘事件转换为 jamo event。
- result stats：按 key/jamo 更新学习状态。

这条边界应优先在 `packages/keybr-textinput`、`packages/keybr-textinput-events`、`packages/keybr-keyboard` 和 `packages/keybr-lesson` 附近设计。

## English

The project will use Korean dubeolsik, the most common Korean keyboard layout,
as the default layout. We discussed three-set input earlier, but the current
learning analysis is also based on dubeolsik.

### Layout Principles

Dubeolsik places most consonants on the left-hand side and most vowels on the
right-hand side. The training UI should show Hangul jamo labels directly instead
of asking learners to type through romanization first.

Base keys:

```text
Q W E R T    Y U I O P
ㅂ ㅈ ㄷ ㄱ ㅅ    ㅛ ㅕ ㅑ ㅐ ㅔ

A S D F G    H J K L
ㅁ ㄴ ㅇ ㄹ ㅎ    ㅗ ㅓ ㅏ ㅣ

Z X C V B    N M
ㅋ ㅌ ㅊ ㅍ ㅠ    ㅜ ㅡ
```

Shift keys:

```text
Shift+Q = ㅃ
Shift+W = ㅉ
Shift+E = ㄸ
Shift+R = ㄲ
Shift+T = ㅆ
Shift+O = ㅒ
Shift+P = ㅖ
```

### Learning Analysis

Training stats should be centered on real dubeolsik key presses and jamo, not on
Unicode precomposed syllables.

Recommended internal model:

- Store lesson targets internally as a jamo/key stream.
- Let the rendering layer compose that stream into normal Hangul syllables.
- Let the input layer convert user key presses into jamo events and align them
  with the target stream.
- Keep stats at least by key, jamo, finger zone, and error type.
- Syllable-level stats can be added later as a secondary view, but should not be
  the first adaptive-training signal.

### UI For Chinese Learners Of Korean

The first interface should minimize explanatory text and focus on the keyboard,
the current target, error feedback, and progress.

Suggested behavior:

- Keycaps show both the Latin key and the Hangul jamo.
- The current target highlights the actual key and jamo to press.
- Practice text is displayed as normal composed Hangul, so learners are not
  forced to read decomposed jamo text for long sessions.
- Settings can include a "show jamo helper" toggle for beginners.
- Romanized input should not be the main path. It can be a learning aid, but it
  should not replace dubeolsik key training.

### Technical Boundary

The original keybr statistics are heavily character-code-point based. If Korean
targets are stored directly as composed syllables such as `가`, `나`, or `안`,
the system will tend to learn syllables rather than dubeolsik keys, which is the
wrong signal for this project.

The key Korean adaptation is therefore not just adding a `ko` language. It needs
a clear boundary:

- lesson generation: produce a jamo/key stream.
- display rendering: compose the stream into readable Hangul.
- input handling: convert keyboard events into jamo events.
- result stats: update learning state by key and jamo.

This boundary should be designed first around `packages/keybr-textinput`,
`packages/keybr-textinput-events`, `packages/keybr-keyboard`, and
`packages/keybr-lesson`.
