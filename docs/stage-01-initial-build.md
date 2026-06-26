# Stage 01 Initial Build / 阶段 01 初步构建

Date / 日期: 2026-06-27

## 中文

本阶段目标是先建立一个可继续改造的本地代码基线，而不是立刻实现韩语输入训练功能。

已经完成：

- 将 `references/keybr.com` 的源码导入根目录，作为主要改造基线。
- 保留 `references/keybr.com` 与 `references/kanabr` 两个本地参考仓库，并通过 `.gitignore` 排除。
- 将根项目身份初步调整为 `hangul-typing-trainer`。
- 增加 `cross-env`，让 `build`、`build-dev`、`watch`、`start` 等脚本可在 Windows 环境运行。
- 修正 webpack 中按路径匹配资源与 knex 方言的规则，使其同时支持 `/` 与 `\`。
- 新增并整理项目专用双语说明文档。

已验证命令：

- `npm install`：成功。安装时出现 Node engine 警告与 npm audit 漏洞提示，暂未处理。
- `npm run compile`：成功。
- `npm run build-dev`：成功，server 与 browser 两个 webpack target 都能完成构建。

重要构建备注：

- `lage` 依赖有效的 git `HEAD` 来计算工作树文件，因此本地仓库创建了一个空的初始化提交。
- 当前生成物位于 `root/lib/` 与 `root/public/assets/`，这些目录已经在 `.gitignore` 中排除。
- 现阶段只保证 keybr 基线能在本地完成编译与开发构建；还没有启动或裁剪产品功能。

暂未实现：

- 韩语二段式键盘布局注册。
- Hangul 组合输入法或按键到 jamo 的输入转换层。
- 韩语课程、词表、语料或音系模型。
- 面向韩语学习者的统计图、设置项和界面文案。
- 静态、本地优先部署。

下一阶段建议：

- 先添加韩语二段式布局数据与可视化键盘标签。
- 再设计内部 jamo/key stream 与外部组合 Hangul 显示之间的转换边界。
- 参考 `kanabr` 的做法，把语言专项改造集中在输入层、设置层、统计层和静态部署层。

## English

The goal of this stage is to establish a local code baseline that can be safely
adapted later. It does not implement Korean typing features yet.

Completed:

- Imported the source tree from `references/keybr.com` into the root directory
  as the main adaptation baseline.
- Kept `references/keybr.com` and `references/kanabr` as local reference
  repositories and excluded them through `.gitignore`.
- Renamed the root project identity to `hangul-typing-trainer`.
- Added `cross-env` so `build`, `build-dev`, `watch`, and `start` scripts work
  in Windows shells.
- Fixed webpack path-matching rules for assets and knex dialects so they work
  with both `/` and `\`.
- Added and organized bilingual project documentation.

Verified commands:

- `npm install`: passed. It reported Node engine warnings and npm audit
  vulnerabilities; these are recorded but not handled in this stage.
- `npm run compile`: passed.
- `npm run build-dev`: passed. Both webpack targets, server and browser,
  completed successfully.

Important build notes:

- `lage` needs a valid git `HEAD` when it calculates workspace files, so the
  local repository now has an empty initialization commit.
- Generated output goes to `root/lib/` and `root/public/assets/`; both are
  ignored by `.gitignore`.
- This stage only proves that the imported keybr baseline can compile and build
  locally. Product features have not been started or removed yet.

Not implemented yet:

- Korean dubeolsik keyboard layout registration.
- Hangul composition or the key-to-jamo input transformation layer.
- Korean lessons, word lists, corpora, or phonetic models.
- Korean-learner-specific charts, settings, and UI copy.
- Static and local-first deployment.

Suggested next stage:

- Add Korean dubeolsik layout data and visual keyboard labels first.
- Then design the boundary between the internal jamo/key stream and the external
  composed Hangul display.
- Follow `kanabr` by keeping the language-specific adaptation focused around
  input, settings, stats, and static deployment.
