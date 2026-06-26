# Code Structure Analysis / 代码结构分析

Date / 日期: 2026-06-27

## 1. Current State / 当前状态

### 中文

当前根目录 `C:\Users\21161\Documents\Hangul` 已经进入初步构建阶段：

- 根目录已经导入 `keybr.com` 的完整源码，作为后续改造的代码基线。
- `references/keybr.com` 和 `references/kanabr` 保持为本地参考仓库。
- 参考仓库不纳入当前项目提交，`references/` 已写入 `.gitignore`。
- 当前尚未实现韩语二段式布局、Hangul 组合输入法、韩语课程生成或韩语统计图。
- 已开始把项目身份从 `keybr.com` 调整为 `hangul-typing-trainer`。

### English

The root workspace `C:\Users\21161\Documents\Hangul` has moved into the initial
construction phase:

- The full `keybr.com` source tree has been imported into the root as the code
  baseline for future adaptation.
- `references/keybr.com` and `references/kanabr` are kept as local reference
  repositories.
- Reference repositories are not tracked by this project; `references/` is
  ignored in `.gitignore`.
- Korean dubeolsik layout support, Hangul composition input, Korean lesson
  generation, and Korean-specific charts have not been implemented yet.
- The package identity has started moving from `keybr.com` to
  `hangul-typing-trainer`.

## 2. Reference Repositories / 参考仓库

### 中文

本地参考仓库：

- `references/keybr.com`
  - remote: `https://github.com/aradzie/keybr.com.git`
  - branch: `master`
  - inspected head: `541eb0a5 fix the errors in the last PR`
- `references/kanabr`
  - remote: `https://github.com/L-M-Sherlock/kanabr.git`
  - branch: `master`
  - inspected head: `9311d183 fix(copy): refine tour messaging`

`keybr.com` 是主要代码基线；`kanabr` 是语言专项改造参考。

### English

Local reference repositories:

- `references/keybr.com`
  - remote: `https://github.com/aradzie/keybr.com.git`
  - branch: `master`
  - inspected head: `541eb0a5 fix the errors in the last PR`
- `references/kanabr`
  - remote: `https://github.com/L-M-Sherlock/kanabr.git`
  - branch: `master`
  - inspected head: `9311d183 fix(copy): refine tour messaging`

`keybr.com` is the main code baseline; `kanabr` is the reference for
language-specific adaptation.

## 3. Relationship Between keybr.com And kanabr / 两个项目的关系

### 中文

`keybr.com` 是完整的通用打字训练平台。它提供：

- 自适应课程引擎
- 键盘布局系统
- 输入事件管线
- 按键统计与学习进度
- 图表和个人资料页
- 多语言、多键盘数据
- 服务器、账号、高分榜和多人模式等扩展功能

`kanabr` 保留了 keybr 的 monorepo 结构，并把产品收窄为日语假名训练。
它新增了罗马字输入转换层、假名相关设置、假名统计图和静态部署模式。

结构差异扫描结果：

- `kanabr` 新增文件：18
- 相对 keybr 删除文件：18
- 修改文件：286
- 未修改文件：2698

这说明 `kanabr` 的策略不是重写平台，而是在 keybr 之上增加窄范围的
语言/输入法层，并在设置、文案、统计和部署上做配套调整。韩语项目应
采用类似路线。

### English

`keybr.com` is the full general-purpose typing tutor platform. It provides:

- the adaptive lesson engine
- the keyboard layout system
- the input event pipeline
- key statistics and learning progress
- charts and profile pages
- multilingual and multi-layout data
- optional server, account, high-score, and multiplayer features

`kanabr` keeps the same keybr monorepo shape and narrows the product to Japanese
kana practice. It adds a romaji input transformer, kana-specific settings,
kana-oriented charts, and static deployment support.

Observed structural diff:

- files added by `kanabr`: 18
- files removed compared with keybr: 18
- changed files: 286
- unchanged files: 2698

This shows that `kanabr` did not rewrite the platform. It added a narrow
language/input layer on top of keybr and adjusted settings, copy, stats, and
deployment around that layer. The Korean project should follow the same pattern.

## 4. Shared Monorepo Shape / 共同 Monorepo 结构

### 中文

两个项目都使用：

- Node >= 22 风格的 ESM TypeScript
- npm workspaces: `packages/*`, `scripts`
- React 19
- webpack 构建
- `lage` 管理多包 compile/test/clean
- `react-intl` 管理界面文案
- `@fastr/*` 服务器栈
- 大量拆分细的内部 package

根目录常用脚本：

- `npm run compile`
- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run build-dev`
- `npm run watch`
- `npm run start`

`kanabr` 额外提供静态构建相关能力：

- `npm run build-vercel`
- `scripts/build-vercel-static.ts`
- `vercel.json`
- `packages/keybr-pages-browser/lib/static.ts`
- `packages/keybr-pages-browser/lib/StaticNotice.tsx`

对于面向学习者的韩语训练器，静态、本地优先部署很适合：没有账号也能
练习，进度可以先保存在浏览器本地。

### English

Both projects use:

- Node >= 22 style ESM TypeScript
- npm workspaces: `packages/*`, `scripts`
- React 19
- webpack
- `lage` for multi-package compile/test/clean orchestration
- `react-intl` for UI copy
- the `@fastr/*` server stack
- many small internal packages

Common root scripts:

- `npm run compile`
- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run build-dev`
- `npm run watch`
- `npm run start`

`kanabr` additionally provides static build support:

- `npm run build-vercel`
- `scripts/build-vercel-static.ts`
- `vercel.json`
- `packages/keybr-pages-browser/lib/static.ts`
- `packages/keybr-pages-browser/lib/StaticNotice.tsx`

For a learner-focused Korean typing trainer, a static and local-first deployment
model is a strong fit: users can practice without accounts, and progress can
initially live in browser storage.

## 5. Key Packages In keybr.com / keybr.com 关键包

### 中文

键盘核心：

- `packages/keybr-keyboard`
  - `lib/language.ts`：语言定义和 script 元数据
  - `lib/layout.ts`：布局注册表
  - `lib/load.ts`：把 `Layout`、`Geometry` 映射到实际键盘数据
  - `lib/keyboard.ts`：生成 key characters、key combos、shapes、zones
  - `lib/layout/*.ts`：生成后的布局字符映射
  - `lib/geometry/*.ts`：物理键盘几何形状

键盘生成：

- `packages/keybr-generators`
  - `lib/generate-layouts.ts`：从 CLDR、KLC 或自定义 keymap 生成布局
  - `layouts/*.json` / `*.klc`：自定义布局源文件
  - `cldr-keyboards-43.0`：CLDR 键盘数据

语言数据：

- `packages/keybr-content-words`
  - `lib/load.ts`：按 `Language` 动态加载词表
  - `lib/data/words-*.json`：生成后的常用词列表
- `packages/keybr-phonetic-model`
  - `assets/model-*.data`：生成后的语言模型
  - `lib/letter.ts`, `lib/filter.ts`, `lib/phoneticmodel.ts`：自适应模型基础
- `packages/keybr-phonetic-model-loader`
  - `lib/loader.ts`：运行时加载 `model-<language>.data`

课程引擎：

- `packages/keybr-lesson`
  - `lib/guided.ts`：自适应 guided lesson 生成
  - `lib/key.ts`：学习键的 confidence、include、focus 逻辑
  - `lib/settings.ts`：课程设置
  - `lib/text/*`：文本生成工具
  - `lib/dictionary.ts`：自然词过滤
- `packages/keybr-lesson-loader`
  - `lib/LessonLoader.tsx`：在键盘、设置、模型、词表加载后创建课程实例

输入与打字比较：

- `packages/keybr-textinput`
  - `lib/textinput.ts`：把输入事件与目标文本比较
  - `lib/stats.ts`：由输入步骤生成统计
  - `lib/chars.ts`：文本字符处理
- `packages/keybr-textinput-events`
  - `lib/inputhandler.ts`：浏览器 input/composition 事件适配
  - `lib/emulation.ts`：键盘布局模拟
  - `lib/events.ts`：键盘和输入事件标准化

练习页面：

- `packages/page-practice`
  - `lib/PracticePage.tsx`
  - `lib/practice/Controller.tsx`：把输入事件接入课程状态
  - `lib/practice/Presenter.tsx`：渲染练习界面
  - `lib/practice/state/lesson-state.ts`：维护当前文本和最终 Result
  - `lib/settings/KeyboardSettings.tsx`
  - `lib/settings/LessonSettings.tsx`

统计、资料页和图表：

- `packages/keybr-result`
- `packages/keybr-result-loader`
- `packages/keybr-result-userdata`
- `packages/page-profile`
- `packages/keybr-chart`

服务器和账号相关：

- `packages/server`
- `packages/keybr-pages-server`
- `packages/page-account`
- `packages/page-highscores`
- `packages/page-multiplayer`
- `packages/keybr-multiplayer-*`

### English

Keyboard core:

- `packages/keybr-keyboard`
  - `lib/language.ts`: language definitions and script metadata
  - `lib/layout.ts`: registered layouts
  - `lib/load.ts`: maps `Layout` and `Geometry` to concrete keyboard data
  - `lib/keyboard.ts`: builds key characters, key combos, shapes, and zones
  - `lib/layout/*.ts`: generated layout character maps
  - `lib/geometry/*.ts`: physical keyboard geometry maps

Keyboard generation:

- `packages/keybr-generators`
  - `lib/generate-layouts.ts`: generates layouts from CLDR, KLC, or custom
    keymaps
  - `layouts/*.json` / `*.klc`: custom layout source files
  - `cldr-keyboards-43.0`: CLDR keyboard data

Language data:

- `packages/keybr-content-words`
  - `lib/load.ts`: dynamically loads word lists by `Language`
  - `lib/data/words-*.json`: generated common-word lists
- `packages/keybr-phonetic-model`
  - `assets/model-*.data`: generated language models
  - `lib/letter.ts`, `lib/filter.ts`, `lib/phoneticmodel.ts`: adaptive model
    primitives
- `packages/keybr-phonetic-model-loader`
  - `lib/loader.ts`: runtime loader for `model-<language>.data`

Lesson engine:

- `packages/keybr-lesson`
  - `lib/guided.ts`: adaptive guided lesson generation
  - `lib/key.ts`: confidence, inclusion, and focus logic for lesson keys
  - `lib/settings.ts`: lesson settings
  - `lib/text/*`: text generation helpers
  - `lib/dictionary.ts`: natural-word filtering
- `packages/keybr-lesson-loader`
  - `lib/LessonLoader.tsx`: creates lesson instances after keyboard, settings,
    model, and word-list loading

Input and comparison:

- `packages/keybr-textinput`
  - `lib/textinput.ts`: compares input events against target text
  - `lib/stats.ts`: builds stats from input steps
  - `lib/chars.ts`: text character handling
- `packages/keybr-textinput-events`
  - `lib/inputhandler.ts`: browser input/composition event adapter
  - `lib/emulation.ts`: keyboard layout emulation
  - `lib/events.ts`: keyboard/input event normalization

Practice page:

- `packages/page-practice`
  - `lib/PracticePage.tsx`
  - `lib/practice/Controller.tsx`: wires input events into lesson state
  - `lib/practice/Presenter.tsx`: renders the practice UI
  - `lib/practice/state/lesson-state.ts`: stores current text and final Result
  - `lib/settings/KeyboardSettings.tsx`
  - `lib/settings/LessonSettings.tsx`

Stats, profile, and charts:

- `packages/keybr-result`
- `packages/keybr-result-loader`
- `packages/keybr-result-userdata`
- `packages/page-profile`
- `packages/keybr-chart`

Server and account-related areas:

- `packages/server`
- `packages/keybr-pages-server`
- `packages/page-account`
- `packages/page-highscores`
- `packages/page-multiplayer`
- `packages/keybr-multiplayer-*`

## 6. Korean Findings / 韩语相关发现

### 中文

keybr 已经有韩式键盘的物理几何：

- `packages/keybr-keyboard/lib/geometry.ts`
- `packages/keybr-keyboard/lib/geometry/korean_103.ts`
- `packages/keybr-keyboard/lib/geometry/korean_103_full.ts`

但 keybr 目前缺少：

- `Language.KO`
- `"hangul"` script 类型
- 韩文二段式布局注册
- 韩文二段式布局字符映射文件
- 韩语词表
- 韩语 phonetic model 资产
- Hangul 组合输入层

所以韩语改造不能只加一个 layout，需要补齐语言、布局、输入法、词表和
统计接入。

韩语二段式基础映射：

```text
Q  W  E  R  T    Y  U  I  O  P
ㅂ ㅈ ㄷ ㄱ ㅅ    ㅛ ㅕ ㅑ ㅐ ㅔ

A  S  D  F  G    H  J  K  L
ㅁ ㄴ ㅇ ㄹ ㅎ    ㅗ ㅓ ㅏ ㅣ

Z  X  C  V  B    N  M
ㅋ ㅌ ㅊ ㅍ ㅠ    ㅜ ㅡ
```

Shift 层：

```text
Shift+Q = ㅃ
Shift+W = ㅉ
Shift+E = ㄸ
Shift+R = ㄲ
Shift+T = ㅆ
Shift+O = ㅒ
Shift+P = ㅖ
```

复合元音和复合收音应由 Hangul 组合层处理，不应当作为独立物理键。

### English

keybr already has Korean physical keyboard geometry:

- `packages/keybr-keyboard/lib/geometry.ts`
- `packages/keybr-keyboard/lib/geometry/korean_103.ts`
- `packages/keybr-keyboard/lib/geometry/korean_103_full.ts`

But keybr currently lacks:

- `Language.KO`
- a `"hangul"` script type
- Korean dubeolsik layout registration
- a Korean dubeolsik layout character map
- a Korean word list
- Korean phonetic model assets
- a Hangul composition input layer

So the Korean adaptation is more than a layout toggle. It needs language,
layout, input-method, word-list, and stats integration.

Baseline Korean dubeolsik mapping:

```text
Q  W  E  R  T    Y  U  I  O  P
ㅂ ㅈ ㄷ ㄱ ㅅ    ㅛ ㅕ ㅑ ㅐ ㅔ

A  S  D  F  G    H  J  K  L
ㅁ ㄴ ㅇ ㄹ ㅎ    ㅗ ㅓ ㅏ ㅣ

Z  X  C  V  B    N  M
ㅋ ㅌ ㅊ ㅍ ㅠ    ㅜ ㅡ
```

Shift layer:

```text
Shift+Q = ㅃ
Shift+W = ㅉ
Shift+E = ㄸ
Shift+R = ㄲ
Shift+T = ㅆ
Shift+O = ㅒ
Shift+P = ㅖ
```

Composite vowels and final consonant clusters should be handled by the Hangul
composition layer, not as separate physical keys.

## 7. kanabr Adaptation Pattern / kanabr 的改造模式

### 中文

`kanabr` 新增文件中最值得参考的是：

- `packages/keybr-textinput-events/lib/romaji-ime.ts`
- `packages/keybr-textinput-events/lib/romaji-ime.test.ts`
- `packages/page-practice/lib/settings/lesson/RomajiHelperProp.tsx`
- `packages/page-practice/lib/settings/lesson/BalanceKanaProp.tsx`
- `packages/page-practice/lib/settings/lesson/KatakanaRatioProp.tsx`
- `packages/keybr-chart/lib/KanaFrequencyHeatmap.tsx`
- `packages/page-profile/lib/profile/KanaFrequencyHeatmapSection.tsx`
- `packages/page-profile/lib/profile/labels.ts`
- `packages/keybr-content-words/lib/data/words-ja-katakana.json`
- `packages/keybr-pages-browser/lib/static.ts`
- `scripts/build-vercel-static.ts`

关键接入点：

- `packages/keybr-keyboard/lib/language.ts`
- `packages/keybr-keyboard/lib/layout.ts`
- `packages/keybr-keyboard/lib/load.ts`
- `packages/keybr-lesson/lib/guided.ts`
- `packages/keybr-lesson/lib/settings.ts`
- `packages/keybr-lesson-loader/lib/LessonLoader.tsx`
- `packages/page-practice/lib/practice/Controller.tsx`
- `packages/page-practice/lib/practice/Presenter.tsx`
- `packages/page-practice/lib/practice/state/lesson-state.ts`
- `packages/page-practice/lib/settings/KeyboardSettings.tsx`
- `packages/page-practice/lib/settings/LessonSettings.tsx`
- `packages/page-profile/lib/ProfilePage.tsx`
- `packages/page-profile/lib/PublicProfilePage.tsx`

可复用的改造套路：

1. 在 `keybr-textinput-events` 中增加输入转换器。
2. 在 `page-practice/Controller.tsx` 中按特定 layout id 启用。
3. 尽量保留 keybr 的 `TextInput` 和 Result 管线。
4. 在 `LessonState` 中做必要的统计归一化。
5. 只在确有需要的地方增加语言专项设置和图表。

韩语对应组件不是 `RomajiIme`，而应该是 `HangulIme`。它需要把二段式
jamo 按键组合成韩文音节，同时让学习统计保留在 jamo/键位层面。

### English

The most relevant new files in `kanabr` are:

- `packages/keybr-textinput-events/lib/romaji-ime.ts`
- `packages/keybr-textinput-events/lib/romaji-ime.test.ts`
- `packages/page-practice/lib/settings/lesson/RomajiHelperProp.tsx`
- `packages/page-practice/lib/settings/lesson/BalanceKanaProp.tsx`
- `packages/page-practice/lib/settings/lesson/KatakanaRatioProp.tsx`
- `packages/keybr-chart/lib/KanaFrequencyHeatmap.tsx`
- `packages/page-profile/lib/profile/KanaFrequencyHeatmapSection.tsx`
- `packages/page-profile/lib/profile/labels.ts`
- `packages/keybr-content-words/lib/data/words-ja-katakana.json`
- `packages/keybr-pages-browser/lib/static.ts`
- `scripts/build-vercel-static.ts`

Critical integration points:

- `packages/keybr-keyboard/lib/language.ts`
- `packages/keybr-keyboard/lib/layout.ts`
- `packages/keybr-keyboard/lib/load.ts`
- `packages/keybr-lesson/lib/guided.ts`
- `packages/keybr-lesson/lib/settings.ts`
- `packages/keybr-lesson-loader/lib/LessonLoader.tsx`
- `packages/page-practice/lib/practice/Controller.tsx`
- `packages/page-practice/lib/practice/Presenter.tsx`
- `packages/page-practice/lib/practice/state/lesson-state.ts`
- `packages/page-practice/lib/settings/KeyboardSettings.tsx`
- `packages/page-practice/lib/settings/LessonSettings.tsx`
- `packages/page-profile/lib/ProfilePage.tsx`
- `packages/page-profile/lib/PublicProfilePage.tsx`

Reusable adaptation pattern:

1. Add an input transformer in `keybr-textinput-events`.
2. Enable it by layout id in `page-practice/Controller.tsx`.
3. Keep keybr's `TextInput` and Result pipeline mostly intact.
4. Normalize stats in `LessonState` where necessary.
5. Add language-specific settings and charts only where they are needed.

The Korean equivalent is not `RomajiIme`, but `HangulIme`. It needs to compose
Hangul syllables from dubeolsik jamo key input while keeping learning stats at
the jamo/key level.

## 8. Product Direction / 产品方向

### 中文

当前产品方向：

- 默认键盘布局：韩国人日常常用的韩文二段式。
- 学习分析单位：二段式 jamo/键位。
- 不按初声/中声/终声角色拆分统计。
- 目标用户：中国韩语学习者。
- 练习文本：最终显示正常组合韩文词句。
- 核心反馈：哪些 jamo 或物理键位慢、错得多。
- 部署方向：优先静态、本地保存进度，后续再考虑账号/同步。

### English

Current product direction:

- Default keyboard layout: Korean dubeolsik, the common everyday Korean layout.
- Learning analysis unit: dubeolsik jamo/key.
- Do not split stats by initial/medial/final role.
- Target users: Chinese learners of Korean.
- Practice text: eventually display normal composed Korean words and sentences.
- Core feedback: which jamo or physical key positions are slow or error-prone.
- Deployment direction: static-first with local progress storage first; accounts
  and syncing can come later.

## 9. Future Implementation Map / 后续实现路线

### 中文

后续编码大概率按这个顺序推进：

1. `packages/keybr-keyboard`
   - 添加 `Language.KO`
   - 添加 script 类型 `"hangul"`
   - 添加 `Layout.KO_DUBEOLSIK`
   - 添加或生成 `layout/ko_dubeolsik.ts`
   - 使用 `Geometry.KOREAN_103`，同时考虑 ANSI/ISO fallback
2. `packages/keybr-generators`
   - 若走生成路线，添加二段式 custom keymap 源文件
3. `packages/keybr-textinput-events`
   - 添加 `hangul-ime.ts`
   - 添加 jamo 输入、音节组合、Backspace、复合收音拆分、Shift jamo 测试
4. `packages/page-practice`
   - 对 `ko-dubeolsik` 启用 `HangulIme`
   - 必要时显示 composition/preedit 状态
   - 默认键盘设置切到韩语二段式
5. `packages/keybr-lesson`
   - 决定课程目标内部用 jamo 流还是组合音节
   - 如果统计按 jamo/键位，内部 jamo 流更干净
6. `packages/keybr-content-words` 与 `packages/keybr-phonetic-model`
   - 添加韩语词表
   - 生成韩语模型，可能需要基于 jamo 分解后的词表
7. `packages/keybr-chart` 与 `packages/page-profile`
   - 核心输入闭环跑通后，再增加 jamo/二段式热力图
8. 静态模式
   - 参考 `kanabr` 的 static-first 构建和本地数据导入导出

### English

Future implementation will likely proceed in this order:

1. `packages/keybr-keyboard`
   - add `Language.KO`
   - add script type `"hangul"`
   - add `Layout.KO_DUBEOLSIK`
   - add or generate `layout/ko_dubeolsik.ts`
   - use `Geometry.KOREAN_103`, with ANSI/ISO fallback considered
2. `packages/keybr-generators`
   - add a dubeolsik custom keymap source if generated layout output is
     preferred
3. `packages/keybr-textinput-events`
   - add `hangul-ime.ts`
   - add tests for jamo input, syllable composition, Backspace, final-cluster
     splitting, and Shift jamo
4. `packages/page-practice`
   - enable `HangulIme` for `ko-dubeolsik`
   - show composition/preedit state if useful
   - default keyboard settings to Korean dubeolsik
5. `packages/keybr-lesson`
   - decide whether lesson targets are stored as a jamo stream or composed
     syllables
   - if stats are jamo/key-based, an internal jamo stream is cleaner
6. `packages/keybr-content-words` and `packages/keybr-phonetic-model`
   - add Korean word lists
   - generate Korean model data, probably from jamo-decomposed words
7. `packages/keybr-chart` and `packages/page-profile`
   - add jamo/dubeolsik heatmaps after the core typing loop works
8. static mode
   - reuse `kanabr`'s static-first build and local data import/export pattern

## 10. Main Architecture Risk / 主要架构风险

### 中文

keybr 默认把输入事件直接与目标文本 code point 比较。如果韩语目标文本直接
存为组合音节，例如 `한`, 默认统计会自然落到整个音节上，而不是 `ㅎ`,
`ㅏ`, `ㄴ` 这些二段式输入单位上。这与“按二段式 jamo/键位分析”的方向冲突。

更干净的设计可能是：

- 课程内部目标使用逻辑 jamo 流。
- UI 层把 jamo 流渲染成正常组合韩文。
- `HangulIme` 输出 jamo 级逻辑输入事件。
- Result 统计保留在二段式 jamo/键位层面。

这是正式编码前最需要验证的架构决策。

### English

keybr normally compares input events directly against target text code points.
If Korean targets are stored as composed syllables such as `한`, default stats
will naturally land on whole syllables rather than dubeolsik input units such as
`ㅎ`, `ㅏ`, and `ㄴ`. That conflicts with the jamo/key-based learning direction.

A cleaner design may be:

- Store lesson targets internally as a logical jamo stream.
- Render that stream as normal composed Hangul in the UI.
- Let `HangulIme` emit jamo-level logical input events.
- Keep Result stats at the dubeolsik jamo/key level.

This is the most important architecture decision to validate before full
implementation.

## 11. License Note / 许可证说明

### 中文

两个参考仓库都包含 GNU Affero General Public License 文本。`keybr.com` 的
`package.json` 里写的是 `GPL-3`，但仓库 `LICENSE` 是 AGPL 文本；
`kanabr` 写的是 `AGPL-3.0-only`。本项目应保守按 AGPL 兼容路线处理：

- 保留上游署名。
- 保持派生项目开源。
- 后续发布前整理 NOTICE/ACKNOWLEDGEMENTS。

### English

Both reference repositories include the GNU Affero General Public License text.
`keybr.com` lists `GPL-3` in `package.json`, but the repository `LICENSE` file
contains AGPL text; `kanabr` lists `AGPL-3.0-only`. This project should take the
conservative AGPL-compatible path:

- Preserve upstream attribution.
- Keep the derived project open source.
- Prepare NOTICE/ACKNOWLEDGEMENTS before public release.
