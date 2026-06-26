# Hangul Typing Trainer / 韩语打字训练器

## 中文

这是一个面向中国韩语学习者的开源韩语打字训练项目，主要基于
`keybr.com` 的自适应打字训练架构进行二次开发，并参考 `kanabr` 的
语言专项改造方式。

当前阶段是初步构建：

- 已把 `keybr.com` 源码导入为根项目代码基线。
- 已把两个参考仓库保留在 `references/` 下，作为本地对照资料。
- 暂未实现韩语二段式输入、Hangul 组合输入法或韩语课程生成逻辑。
- 当前重点是建立可构建的项目基线，并记录后续改造路径。

参考仓库：

- `references/keybr.com`：上游通用打字训练平台。
- `references/kanabr`：基于 keybr 的日语假名训练改造项目。

设计方向：

- 默认键盘布局使用韩国人常用的韩文二段式键盘。
- 学习分析也按二段式 jamo/键位进行，而不是按初声/中声/终声角色拆分。
- 练习文本最终应显示正常组合韩文，内部统计则面向实际按键与 jamo。
- 静态、本地优先部署是优先方向，后续可参考 `kanabr` 的 static-first 模式。

工作文档：

- `docs/code-structure-analysis.md`
- `docs/stage-01-initial-build.md`
- `docs/korean-input-design.md`

## English

This is an open-source Korean typing trainer for Chinese learners of Korean. It
is derived mainly from the adaptive typing architecture of `keybr.com`, with
`kanabr` used as a reference for language-specific adaptation.

Current phase: initial construction.

- The `keybr.com` source tree has been imported as the root code baseline.
- The two reference repositories remain under `references/` for local
  comparison.
- Korean dubeolsik input, Hangul composition, and Korean lesson generation have
  not been implemented yet.
- The immediate goal is to establish a buildable project baseline and document
  the future adaptation path.

Reference repositories:

- `references/keybr.com`: upstream general-purpose typing tutor platform.
- `references/kanabr`: Japanese kana trainer adapted from keybr.

Design direction:

- Use Korean dubeolsik as the default keyboard layout.
- Use dubeolsik jamo/key-based learning analysis, not initial/medial/final role
  analysis.
- Practice text should eventually display normal composed Hangul, while
  internal stats track practical key and jamo performance.
- Static, local-first deployment is preferred; `kanabr`'s static-first mode is a
  useful reference for that work.

Working notes:

- `docs/code-structure-analysis.md`
- `docs/stage-01-initial-build.md`
- `docs/korean-input-design.md`
