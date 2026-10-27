# 资料来源、证据边界与建模差异

核对日期：2026-10-27。下文区分用户任务书、附件说明、本轮网页读取、本轮图片观察与工程判断。第三方链接存在不代表已阅读全文或看过视频。

## 本轮直接读取的官方网页

| 来源 | 链接 | 实际核对范围 |
|---|---|---|
| 华为产品页 | https://consumer.huawei.com/cn/phones/mate90-pro-max/ | 产品介绍及典藏版外观参考 |
| 华为规格页 | https://consumer.huawei.com/cn/phones/mate90-pro-max/specs/ | 尺寸、典藏版235g、玄武昆仑玻璃、屏幕、处理器、内存、摄像头、电池、充电、系统与接口 |
| 华为购买指引 | https://consumer.huawei.com/cn/support/content/zh-cn16119533/ | 典藏版 SKU 与四色；不混入普通版内存、玻璃与重量 |
| 华为系列卖点 | https://consumer.huawei.com/cn/support/content/zh-cn16119534/ | 系列介绍；系列主张不能直接转换为特定内部几何 |
| 华为 Z10 规格页 | https://consumer.huawei.com/cn/accessories/xmage-z10-modular-camera/specs/ | 典藏版适配 H1 卡口，作为外接配件资料，未画成内置固定镜头 |

网站事实在 `src/devices/mate90ProMaxCollector.js` 中结构化存储，事实均包含 sourceUrl、sourceType、confidence、verifiedAt；每个三维部件另有几何可信度。所有内部几何保持 schematic，即使某条参数是 official。`verifiedAt` 为本轮归档日期，不表示第三方原视频已验证。

## 附件实际阅读范围

完整阅读了开发任务书、压缩包的 `phone_refs/SOURCES_AND_USAGE.md` 以及既有 `assets/reference/REFERENCE_INDEX.md`。压缩包实际 14 张图片（11 官方宣传素材、3 视频封面），既有参考目录实际 47 张图片，消息附带 6 张芯片图，共 67 张，均完成可视检查。尺寸、路径、SHA-256、编号见 `evidence/reference-manifest.json`。目录联系表仅供人工核对，未进入运行网站。

| 参考组 | 实际观察和使用 | 证据边界 |
|---|---|---|
| 官方四色背视、正背展示、KV | 机身轮廓、星环直径比例、镜头排列、背盖分区、字标位置 | 宣传渲染不是 CAD；图片光照不等于真实色度测量 |
| 官方横置正面、亮屏宣传 | 三处前置开孔、细黑边、屏幕贴合 | 网站屏幕为自制示意 UI，不分发官方系统截图 |
| 本地“典藏版外观图” | 顶/底/侧视及镜头、按键和接口相对位置 | 原支持页 https://consumer.huawei.com/cn/support/content/zh-cn16119818/ 本轮工具无法读取；原网页出处未重新认证 |
| 太平洋侧视、45°、上下边；现场特写 | 外框高度、按钮/接口轮廓、卡口与镜片视觉层次 | 图片中具体孔径、隐藏结构未测量；材质仍是近似 |
| 官方玄武结构宣传图 | 分层展示的交互参考 | 不是实机 PCB、VC、FPC 或真实装配图 |
| Z10 官方和媒体图片 | 区分外接配件与手机自身镜头 | 本版仅资料说明，未实现其装卸 |
| WekiHome 封面、低清帧 | 已查看可见器件和多机型对比场景 | 无法认证这些帧与典藏版全部匹配，不升级为 teardown_verified |
| 杨长顺主题封面、竖屏帧 | 查看其画面内容；发现索引与截图内容存在不符 | 二次转载、原视频与时间点未认证，不由此确定精确布局 |
| 目录中的 SoC 图与消息六张芯片图 | 分清功能块图、显微照、封装渲染、剖面示意 | 频率、缓存、晶粒层次和 TSV 数量未独立核实，不纳入官方事实，不据图伪造三维芯片透视 |

## 实际遇到的来源冲突

1. `REFERENCE_INDEX.md` 声称素材总数61张；当前该目录实际47张。压缩包另有14张。本次按实际文件清单计数，不把索引中缺失文件算作已读。
2. 既有索引将一批拆机帧归为 `teardown_verified`，压缩包说明明确警告封面合成、二次传播以及 Pro Max / RS 不能直接互换。本轮 Bilibili 原视频访问均返回412，未能逐帧独立核对，所以全部内部布局采取 schematic。
3. `teardown_ysl_t0842s.jpg` 的画面可见外接镜头特写，与索引“电池仓与排线”的描述不符；不据此确定排线位置。部分 `wk_*.jpg` 很暗，不能据其推断螺丝精确位置。
4. 两份说明对 WekiHome 发布日期、杨长顺转载链接的描述并不一致；本轮不把这些日期或作者认证写成已核实事实。
5. 消息芯片图标注 CPU/GPU 频率、LPDDR6、缓存等；官方规格页只能确认“麒麟9050 Pro”。这些额外细节不进入本版参数表。

尝试读取但未成功的视频链接：

- https://www.bilibili.com/video/BV1rRpy6XEDF/ — HTTP 412
- https://www.bilibili.com/video/BV13Aa66LEPx/ — HTTP 412
- https://www.bilibili.com/video/BV1heam6TExz/ — HTTP 412

## 真实参数与示意几何

| 项目 | 参数可信度 | 几何处理 |
|---|---|---|
| 机身164.5×78.7×8.15mm、约235g | official | 总体比例固定；圆角、截面和缝隙 inferred |
| 四色、星环、背盖分区、三前置开孔 | 官方图参考 | inferred，按图比例近似，无光谱/三维扫描 |
| 玄武昆仑玻璃、双层OLED、分辨率/刷新率 | official | 面板结构厚度与层间胶层 schematic |
| 主摄5000万 F1.4–F4.0 / 超广角4000万 F2.2 / 长焦2亿 F2.6 / 红枫 / 前摄 | official | 外露位置按图 inferred；镜片层数、光阑、传感器封装与潜望结构 schematic |
| 麒麟9050 Pro、16GB、512GB/1TB | official | 独立封装仅为科普。实际 RAM 堆叠/分布、PCB 位置不作主张 |
| 6800mAh典型/6615mAh额定、100W/50W上限 | official | 电池外形、线圈匝数和连接端 schematic；充电功率是上限而非恒定值 |
| PCB、屏蔽、供电/射频、VC、导热膜、扬声器腔体、振动单元、子板、天线、FPC、螺丝 | 未获得精确典藏版测绘 | 全部 schematic；不制造虚假芯片型号或 PCB 随机走线 |

## 当前外观与工程差异

- 总体包络按官方尺寸；镜头岛半径、凸起、倒角、玻璃层厚度是图片近似，未测绘。
- 晶格纹理用程序化 Canvas 颜色/凹凸图近似。真实玻纤与宝石的各向异性、微反射和镜头涂层不能完整重现；不得称为照片级复刻。
- 长焦的矩形表面只用于辨识，未宣称真实棱镜与光路测量。保护玻璃组件以边缘环表现，独立选择时可见的完整实体较少。
- 演示拆解沿 Z 分层并适当侧移，属于可视化编排，不是维修拆机步骤。没有机械接触/软排线有限元或连续碰撞求解。
- 部分层在特定视角会相互遮挡；可旋转、隐藏分组或对焦查看。10轮零漂移不等于逐三角形无穿透证明。

## 版权、分发和隐私

用户提供图片仅作本地个人学习与人工比对，不能由存在于附件推导出再分发授权。运行网站仅加载自制程序化纹理及本地 Three.js。交付源码包排除 `assets/reference`、`reference-input` 和联系表等第三方图片。项目没有遥测、摄像头/麦克风、帐号或远程数据存储；localStorage 仅记录引导是否看过。

Three.js 使用 MIT 许可，见 `vendor/THREE-LICENSE.txt`。华为、HUAWEI、XMAGE 等商标归其权利人。本项目为非官方科普演示。

界面展示标题另自托管 Manrope 可变字体，来自 Google Fonts 项目的 ofl/manrope；原始字体与 SIL Open Font License 1.1 一并位于 vendor/fonts。运行时无需字体外链。下载来源：https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/Manrope%5Bwght%5D.ttf ，许可：https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt 。本轮原始文件下载成功；GitHub 网页工具读取受限，许可按本地下载原文核对。
