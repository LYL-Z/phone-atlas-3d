---
name: Phone Atlas 3D
description: 深石墨工业工作台中的程序化手机结构探索。
colors:
  accent: "#c6e9a1"
  warning: "#dbc18b"
  bg: "#111716"
  panel-surface: "rgba(27, 35, 31, 0.95)"
  line: "#38413c"
  text: "#eef1e9"
  muted: "#b0bcb2"
  control: "#29312d"
  control-hover: "#3b473c"
typography:
  display:
    fontFamily: '"Manrope Atlas", "Microsoft YaHei", sans-serif'
  body:
    fontFamily: '"Segoe UI", "Microsoft YaHei", sans-serif'
    fontSize: "13px"
  label:
    fontFamily: '"Segoe UI", "Microsoft YaHei", sans-serif'
    fontSize: "12px"
rounded:
  badge: "4px"
  field: "6px"
  button: "7px"
  group: "8px"
  panel: "12px"
spacing:
  compact: "4px"
  small: "8px"
  control: "12px"
  inset: "16px"
  workspace: "24px"
  wide: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#192915"
    rounded: "{rounded.button}"
    padding: "9px 12px"
  button-secondary:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "9px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.control-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.button}"
  mode-active:
    backgroundColor: "{colors.accent}"
    textColor: "#1a281a"
    rounded: "{rounded.button}"
  search-field:
    backgroundColor: "#111a16"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
    padding: "9px 10px"
  confidence-schematic:
    backgroundColor: "#343126"
    textColor: "{colors.warning}"
    rounded: "{rounded.badge}"
    padding: "5px 7px"
  confidence-official:
    backgroundColor: "#2a3828"
    textColor: "{colors.accent}"
    rounded: "{rounded.badge}"
    padding: "5px 7px"
  panel:
    backgroundColor: "{colors.panel-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
---

# Design System: Phone Atlas 3D

## Overview

**Creative North Star: "深石墨工业产品工作台"**

手机模型占据视觉中心，资料与操作围绕模型排列。界面使用带绿调的石墨表面、细描边、紧凑字体和克制的状态色，形成可以持续操作与阅读的工作台。程序化几何和材质承担产品展示，界面不添加游戏 HUD 装饰。

官方规格与示意几何分开呈现：来源等级使用文字、颜色和详情说明共同表达。模型中的金属、玻璃、背板切纹属于展示材料，不构成实物测绘或光学真实性承诺。

**Key Characteristics:**

- 模型居中，侧栏提供部件与资料，底部承载可逆拆解。
- 浅绿标记选中、操作和链接；暖金提示示意及证据边界。
- 小屏使用抽屉与分行控件，保留核心探索路径。

## Colors

主色是低饱和的绿调石墨，状态色比背景明亮，避免大面积高亮竞争模型。

### Primary

- **浅绿指示色**（accent）：主播放按钮、选中模式、选中视角、链接、焦点环及进度。
- **暖金提示色**（warning）：示意几何可信度、内部布局警告及来源提示，不作为装饰性品牌色。

### Neutral

- **深石墨底色**（bg）：页面和三维工作区外围。
- **半透明工作面**（panel-surface）：左右资料面板。
- **结构线**（line）：顶栏、面板与分区边界。
- **近白正文**（text）与 **灰绿次文**（muted）：主内容与说明层级。
- **石墨控件**（control / control-hover）：通用操作与悬停反馈。

**The Evidence Color Rule.** 浅绿和暖金的来源提示必须带可读文字；官方功能参数不能替内部几何背书。

## Typography

**Display Font:** 自托管 Manrope，CSS 家族名为 Manrope Atlas；中文回退到 Microsoft YaHei。字体文件及 OFL 许可随项目提供。品牌、机型标题和详情标题采用此组字体。

**Body Font:** Segoe UI、Microsoft YaHei、sans-serif。界面正文、控件和中文说明使用系统字体覆盖。

### Hierarchy

- **展示标题：**机型标题字重（550）；手机（20px），常规桌面（24px），宽屏（32px）。桌面行高（1.25），字距（-0.025em）。
- **详情标题：**字重（500）、字号（21px）、行高（1.4）。
- **分区标题：**桌面多为（14–16px），手机面板标题（16px）。
- **正文：**基础（13px）；详情说明（12px），行高（1.85）；弹窗正文行高（1.9）。
- **操作与标签：**桌面紧凑操作通常（10–12px）；手机核心操作（12px），部件树条目（13px）。进度与参数使用等宽数字。

**The Reading Hierarchy Rule.** 用字号、间距和字重区分标题与资料；新增界面不延续已移除的品牌眉题。

## Layout

工作台采用全视口布局：桌面顶栏（76px），其下是弹性三维区和底部进度区；手机顶栏（62px）。页面本身不滚动，部件树、资料面板和弹窗独立滚动。

桌面左右面板浮在工作区，常规边距（24px），宽屏边距（32px）；宽屏部件树（260px）、详情（286px）。标题放在左面板右侧，模式控制位于模型上方，避免与侧栏占用相同区域。常见节奏来自前置间距表；紧凑控件内部常用（6–12px）。

响应断点为（760px）、（1100px）和（1600px）。不超过 760px 时，侧栏变成可关闭抽屉，左右各留（12px），顶部（104px），底部为操作保留（155px）。视角栏横跨底部，配色与抽屉按钮分层放置。播放控件另起一行；核心按钮高度通常（34–36px），色样（28px）。这些是当前实现值，不构成所有设备的可访问性认证。

## Elevation & Depth

深度来自三维模型、暗色表面的明度差、细描边与轻微环境阴影。资料面板使用背景模糊（14px）；弹窗背景模糊（6px），以遮罩隔开当前操作。

- **面板环境阴影：**（0 10px 30px #0002），轻微分离资料与三维区。
- **弹窗阴影：**（0 20px 100px #0008），配合深色遮罩。

**The Model First Rule.** 界面阴影负责层级，模型材质负责产品质感；不要用硬偏移阴影或霓虹发光抢占模型。

## Shapes

使用温和的小圆角：标签、字段、按钮、分组和面板按前置 rounded 表区分。面板采用单像素细边框；分隔线承担参数表与操作区组织。配色色样保持圆形，并通过外轮廓表达选中。图标为简洁线性 SVG，沿用 currentColor、圆端点和圆连接；不使用字符充当新增图标。

## Components

### Buttons

主操作采用浅绿填充与深色文字；次操作采用石墨填充；顶栏操作使用透明底与次文字。通用状态切换时长（0.16s）；禁用透明度（0.45）。键盘焦点采用浅绿轮廓（2px）与偏移（3px）。手机播放按钮可只显示图标，但保留可访问名称。

### Chips

可信度标签为小圆角紧凑容器。官方规格为绿色系；示意几何为暖金色系。标签文字明确说明“规格参数”或“几何可信度”，不能只靠颜色。

### Cards / Containers

资料容器采用半透明工作面、结构线和面板圆角，标题与内容分别留白。参数按行排列，名称居左、数值居右，数值允许换行。长详情可滚动，来源与示意说明留在内容流中。

### Inputs / Fields

搜索为深色凹入字段，包含内联 SVG 和占满剩余宽度的输入；手机输入字号（13px）。选择器采用暗色底、细边框和字段圆角。范围输入保持原生交互，以浅绿标示进度；搜索输入、选择器、链接和三维视口共享全局可见焦点规则。

### Navigation

模式与视角是紧凑分段按钮，选中项为浅绿。顶部保留操作引导与资料入口；手机将资料面板入口移到工作区下方。选择和展开状态同时更新相应的 ARIA 属性。

### Component Tree and Scene Labels

部件树按类别展开，条目选中时使用暗绿底与浅绿文字；可见性按钮与选择按钮分开。条目支持上下方向键、Home 和 End。三维选中标签用细引线连接对象，遮挡或出界时隐藏，避免把标签误连到前景部件。

## Do's and Don'ts

### Do:

- **Do** 让模型、资料与底部操作维持清楚的主次关系。
- **Do** 保留浅绿焦点、文字化状态及小屏核心操作。
- **Do** 在详情中把官方功能参数与示意几何可信度分开。
- **Do** 尊重减少动态效果偏好；状态反馈仍需清楚。

### Don't:

- **Don't** 添加游戏 HUD、霓虹装饰、硬偏移阴影或无内容作用的眉题。
- **Don't** 用系统字体替代拉丁展示字体，或用字符代替新增图标。
- **Don't** 把程序化纹理、镜片层次或截图表现写成实物测绘证据。
- **Don't** 将桌面缩小版直接塞入手机屏幕，导致控件遮挡。

