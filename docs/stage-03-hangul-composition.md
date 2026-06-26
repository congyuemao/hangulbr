# Stage 03 Hangul Composition / 阶段 03 韩文组合层

Date / 日期: 2026-06-27

## 中文

本阶段目标是参考 `kanabr` 的日语罗马字练习思路，把“显示字符”和“实际击键序列”分开：页面可以显示组合韩文音节，而内部输入与统计仍按韩国二段式 jamo/键位进行。

已经完成：

- 新增 Hangul 工具模块，支持组合韩文音节与二段式 jamo 之间的拆分/组合。
- 新增韩语输入组合层：在 `ko-kr` 布局下，用户输入多个 jamo，完整匹配当前目标音节后再提交组合音节。
- 结果统计仍展开为二段式 jamo 步骤，例如 `한` 统计为 `ㅎ/ㅏ/ㄴ`。
- 键盘提示后缀也展开为 jamo，因此虚拟键盘仍能指示下一步应该按哪个二段式键位。
- 临时韩语词表仍保存为 jamo，但改为合法音节拆分串；练习页显示时会组合成韩文。
- 修正 phonetic model 前缀索引，让 focused-letter 生成能使用包含该字母的合法前缀。

参考自 `kanabr` 的做法：

- `kanabr` 在日语罗马字模式中保留假名显示，输入层把多次 romaji 按键转换成假名事件。
- 本项目对应地保留/生成韩文显示，输入层把多次二段式 jamo 按键转换成一个 Hangul 音节事件。
- 两者都避免把“显示文本”直接等同于“物理按键序列”。

已验证：

- Hangul 拆分/组合测试通过。
- Hangul IME 输入事件测试通过。
- 韩语词表测试通过。
- phonetic model 集成测试通过。
- `npm run compile` 通过。
- `npm run build-dev` 通过。
- 本地 `http://localhost:3000/` 返回 200，练习文本 DOM 中已出现组合韩文样本。

当前限制：

- 还没有显示“当前已输入 jamo”的预编辑 helper，因此输入一个音节中间的 `ㅎㅏ` 暂时不会在文本区单独提示。
- 韩语词表和模型仍是合成数据，不是真实韩语高频词或教材词。
- 当前组合层是最小可用版本，复杂真实韩语语料、分级课程和中文说明还需要后续阶段继续补。

下一步建议：

- 增加一个轻量预编辑提示条，显示当前音节已输入的 jamo 和剩余 jamo。
- 替换合成词表，引入真实韩语高频词/TOPIK 初级词/教材词表。
- 增加韩语专用课程顺序：基础元音、基础辅音、收音、双辅音、复合元音。

## English

The goal of this stage is to follow the same separation used by `kanabr` for Japanese romaji practice: the visible character is not the same thing as the physical keystroke sequence. The page can display composed Hangul syllables, while input handling and stats remain based on Korean dubeolsik jamo/key units.

Completed:

- Added reusable Hangul utilities for decomposing composed syllables into dubeolsik jamo and composing valid jamo streams back into Hangul display text.
- Added a Korean composition input layer: in the `ko-kr` layout, several jamo keystrokes can complete one target Hangul syllable.
- Result stats are still expanded to jamo steps. For example, `한` is counted as `ㅎ/ㅏ/ㄴ`.
- Keyboard suffix hints are also expanded to jamo, so the virtual keyboard can still point to the next physical dubeolsik key.
- The temporary Korean word list still stores jamo, but it now uses valid syllable decompositions. The practice page composes it for display.
- Fixed phonetic model prefix indexing so focused-letter generation can use valid prefixes containing the focused letter.

Borrowed idea from `kanabr`:

- `kanabr` shows kana while its input layer converts multiple romaji keystrokes into kana events.
- This project shows Hangul while its input layer converts multiple dubeolsik jamo keystrokes into Hangul syllable events.
- Both avoid treating display text and physical input sequence as the same layer.

Verified:

- Hangul decomposition/composition tests passed.
- Hangul IME input-event tests passed.
- Korean word-list tests passed.
- Phonetic model integration tests passed.
- `npm run compile` passed.
- `npm run build-dev` passed.
- Local `http://localhost:3000/` returns 200, and the practice DOM now contains composed Hangul samples.

Current limitations:

- There is no preedit helper yet, so partial input inside one syllable, such as `ㅎㅏ`, is not shown separately in the text area.
- The Korean word list and model are still synthetic, not real Korean high-frequency or textbook vocabulary.
- This is the smallest useful composition layer; real corpora, staged lessons, and Chinese learner-facing copy remain future work.

Suggested next steps:

- Add a small preedit helper showing the jamo already typed and the remaining jamo for the current syllable.
- Replace synthetic data with real Korean high-frequency words, TOPIK beginner vocabulary, or textbook vocabulary.
- Add Korean-specific lesson stages: basic vowels, basic consonants, final consonants, tense consonants, and compound vowels.
