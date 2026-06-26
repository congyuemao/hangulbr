# Stage 02 Dubeolsik Layout / 阶段 02 二段式布局

Date / 日期: 2026-06-27

## 中文

本阶段目标是先让项目从 keybr 的通用键盘体系中真正识别韩语二段式键盘，并在练习页显示韩文字母键帽。当前实现仍是“二段式 jamo/键位训练”的初版，不是完整韩文输入法。

已经完成：

- 新增韩语 `ko` 语言，脚本类型为 `hangul`，字母表使用韩语兼容字母 jamo。
- 新增韩国常用二段式键盘布局 `ko-kr`，名称为 `{KR} Dubeolsik`。
- 注册 `KOREAN_103` 与 `KOREAN_103_FULL` 几何布局，默认键盘改为 `ko` + `ko-kr` + `KOREAN_103`。
- 在布局数据中映射主要字母键：`QWERT` 对应 `ㅂㅈㄷㄱㅅ`，`ASDFG` 对应 `ㅁㄴㅇㄹㅎ`，`HJKL` 对应 `ㅗㅓㅏㅣ`，`ZXCVBNM` 对应 `ㅋㅌㅊㅍㅠㅜㅡ`。
- 支持 Shift 产生双辅音与复合元音键帽：`ㅃㅉㄸㄲㅆㅒㅖ`。
- 加入临时韩语词表与音系模型资产，使 keybr 的课程生成、词表加载和构建流程可以跑通。
- 修正 Windows 下 webpack manifest 使用反斜杠生成资产 URL 的问题，本地开发服务器首页已能正常返回 200。

已验证：

- `npm run compile`
- `npm run build-dev`
- 直接运行 keyboard、language、layout、settings 相关 Node 测试通过。
- 直接运行 words 与 phonetic model integration 测试通过。
- 本地 `http://localhost:3000/` 首页返回 200，页面 DOM 中已出现韩语 jamo 练习内容与韩文字母键序列。

当前限制：

- 练习文本现在显示的是 jamo 序列，不是组合后的完整韩文音节。
- 临时词表是确定性生成的 jamo 组合，不是真实韩语语料。
- 音系模型只是为了接通流程的初版模型，还没有基于真实韩语频率训练。
- 界面文案仍主要继承 keybr 英文内容，还没有面向中国韩语学习者本地化。

下一步建议：

- 设计 jamo 输入流到组合 Hangul 显示的边界：内部仍按二段式键位统计，外部练习文本可显示正常韩文。
- 引入真实韩语高频词、初级学习者词表或教材词表，替换临时 jamo 词表。
- 做专门的韩语练习设置页，明确展示“二段式键盘”“键位训练”“组合显示”等选项。

## English

The goal of this stage is to make the imported keybr baseline recognize Korean dubeolsik as a first-class keyboard layout and render Hangul keycap labels in the practice page. This is an initial jamo/key-based trainer, not a full Korean input method.

Completed:

- Added Korean `ko` as a language with the `hangul` script and compatibility jamo as the training alphabet.
- Added the common Korean dubeolsik keyboard layout `ko-kr`, named `{KR} Dubeolsik`.
- Registered `KOREAN_103` and `KOREAN_103_FULL` geometries, and changed the default keyboard to `ko` + `ko-kr` + `KOREAN_103`.
- Mapped the main letter keys: `QWERT` to `ㅂㅈㄷㄱㅅ`, `ASDFG` to `ㅁㄴㅇㄹㅎ`, `HJKL` to `ㅗㅓㅏㅣ`, and `ZXCVBNM` to `ㅋㅌㅊㅍㅠㅜㅡ`.
- Added Shift labels for tense consonants and compound vowels: `ㅃㅉㄸㄲㅆㅒㅖ`.
- Added temporary Korean word-list and phonetic-model assets so keybr lesson generation, asset loading, and builds can complete.
- Fixed Windows webpack manifest URL generation so asset paths use `/assets/...` instead of backslash paths. The local development server now returns 200 for the home page.

Verified:

- `npm run compile`
- `npm run build-dev`
- Direct Node tests for keyboard, language, layout, and settings passed.
- Direct Node tests for words and phonetic model integration passed.
- The local `http://localhost:3000/` page returns 200, and the DOM contains Korean jamo practice text and Hangul key sequences.

Current limitations:

- Practice text currently displays jamo sequences, not composed Hangul syllables.
- The temporary word list is deterministic jamo data, not a real Korean corpus.
- The phonetic model is only a flow-through model for now; it is not trained from real Korean frequencies.
- UI copy is still mostly inherited from keybr and has not been localized for Chinese learners of Korean.

Suggested next steps:

- Define the boundary between the internal jamo input stream and composed Hangul display: stats stay dubeolsik/key-based, while lesson text can become normal Korean.
- Replace the temporary jamo list with real Korean high-frequency words, learner vocabulary, or textbook-derived word lists.
- Add a Korean-focused settings surface that clearly exposes dubeolsik layout, key-based training, and composed-display options.
