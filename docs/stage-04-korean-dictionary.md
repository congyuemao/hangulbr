# Stage 04 Korean Dictionary / 阶段 04 韩语词典与真实词表

Date / 日期: 2026-06-27

## 中文

本阶段目标是把韩语练习文本从合成 jamo 串切换为真实韩语高频词，并参考 `kanabr` 的本地词表方式，为练习页增加鼠标悬浮释义。

已经完成：

- 新增 `scripts/build-korean-dictionary.mjs`，从公开仓库拉取韩语词表数据并生成项目内的静态词典。
- 生成 `packages/keybr-content-words/lib/data/dictionary-ko.json`，当前包含 5000 条韩语词条。
- 由同一批词条生成 `words-ko.json`，练习词优先来自真实韩语词典词，而不是临时合成数据。
- 由同一批词条重建 `model-ko.data`，让韩语课程的字母/键位统计也基于这批真实词。
- 新增 `korean-dictionary.ts`，提供本地词典查找与 tooltip 文本格式化。
- 扩展 `StyledTextSpan` / `Char`，允许文本片段携带 `title`，并在练习页渲染为浏览器原生悬浮提示。
- 韩语练习页显示组合 Hangul；内部输入、结果统计和键盘提示仍按二段式 jamo 展开。
- 从 `kanabr` 直接移植/对齐了 `Dictionary` 的 code point normalize 设计，为后续把显示层和输入层进一步分离做准备。

数据来源：

- 主词表来自 `vbvss199/Language-Learning-decks` 的 Korean deck，仓库声明为 MIT；其中词频相关来源需要保留 `wordfreq` 的 CC BY-SA 4.0 署名。
- 补充释义来自 `vocably/ko`，仓库为 AGPL-3.0；当前主要用作离线补充来源。
- 已调研韩国国立国语院 Korean Basic Dictionary Open API 和 우리말샘 API；它们更适合作为后续带 API key 的构建期增强来源，当前没有直接接入运行时 API。

参考自 `kanabr` 的做法：

- `kanabr` 没有在练习时实时调用词典 API，而是把语言数据提前做成本地 JSON，再由页面直接加载。
- 本项目沿用这个思路：构建期抓取/生成，运行时静态读取，避免练习时依赖外部网络。
- `kanabr` 的 Japanese word list 与 lesson loader 思路被用于韩语词表生成和课程输入源替换；`Dictionary` 的 normalize 版本已并入当前代码。

当前限制：

- 中文释义覆盖仍然很少，因为当前公开离线来源中中文翻译数量有限；大多数 tooltip 现在会显示英文释义、韩语定义和例句。
- tooltip 目前使用浏览器原生 `title`，足够验证功能，但还不是可复制、可固定的富文本词典卡片。
- 词表按高频/flashcard 可用性筛选为 5000 条，还没有按 TOPIK、教材章节或学习阶段分级。
- 官方词典 API 尚未接入；后续如果提供 API key，可以在构建期补全更高质量的中文释义。

下一步建议：

- 做一个自定义词典弹层，替代原生 `title`，支持中文/英文/韩文释义分区和例句复制。
- 增加 TOPIK 初级、常用动词、常用形容词、收音词等课程分组。
- 接入韩国国立国语院词典 API 作为可选构建步骤，补全中文释义和词性信息。
- 增加词条去重、词形归并和学习者难度标记。

## English

The goal of this stage is to replace synthetic Korean jamo practice data with real high-frequency Korean vocabulary, and to follow `kanabr`'s local-word-list approach for hoverable dictionary hints in the practice page.

Completed:

- Added `scripts/build-korean-dictionary.mjs`, which fetches public Korean vocabulary data and generates static project data.
- Generated `packages/keybr-content-words/lib/data/dictionary-ko.json` with 5000 Korean entries.
- Regenerated `words-ko.json` from the same entries, so Korean practice words now prefer real dictionary-backed words instead of temporary synthetic data.
- Rebuilt `model-ko.data` from the same entries, so Korean lesson statistics are trained from this vocabulary set.
- Added `korean-dictionary.ts` for local dictionary lookup and tooltip formatting.
- Extended `StyledTextSpan` / `Char` so rendered text spans can carry a `title`, which becomes a native browser hover tooltip in the practice page.
- Korean practice still displays composed Hangul, while input handling, result stats, and keyboard hints remain based on dubeolsik jamo.
- Ported/aligned `kanabr`'s normalized-code-point `Dictionary` design to prepare for deeper separation between display text and input units.

Data sources:

- The primary word list comes from the Korean deck in `vbvss199/Language-Learning-decks`, whose repository is MIT licensed; frequency-derived data keeps the upstream `wordfreq` CC BY-SA 4.0 attribution requirement in mind.
- Supplemental definitions come from `vocably/ko`, which is AGPL-3.0 and currently used as an offline enrichment source.
- The Korean Basic Dictionary Open API and the 우리말샘 API were reviewed; they are better suited for a future build-time enrichment step with an API key, and are not used as runtime APIs now.

Borrowed idea from `kanabr`:

- `kanabr` does not call a dictionary API during typing practice. It prebuilds local JSON language data and loads it directly in the page.
- This project follows the same model: fetch/generate at build time, read static data at runtime, and avoid external network dependency while practicing.
- The Japanese word-list and lesson-loader pattern informed the Korean word-source replacement; the normalized `Dictionary` implementation has been merged into the current code.

Current limitations:

- Chinese definition coverage is still sparse because the available offline sources contain only limited Chinese translations. Most tooltips currently show English definitions, Korean definitions, and examples.
- The hover UI currently uses the browser's native `title`; this is enough to validate the behavior, but it is not yet a copyable or pinnable rich dictionary card.
- The 5000-word list is selected by frequency/flashcard usefulness, not yet by TOPIK level, textbook chapter, or learner stage.
- Official dictionary APIs are not integrated yet. With an API key, a later build step can enrich the local dictionary with higher-quality Chinese definitions.

Suggested next steps:

- Build a custom dictionary popover instead of native `title`, with Chinese/English/Korean sections and copyable examples.
- Add course groups such as TOPIK beginner words, common verbs, common adjectives, and final-consonant-heavy words.
- Add an optional build-time Korean Basic Dictionary API enrichment step for Chinese definitions and part-of-speech data.
- Improve deduplication, lemma grouping, and learner difficulty labels.
