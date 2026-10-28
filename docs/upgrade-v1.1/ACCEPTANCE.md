# v1.1 逐项验收 · 待审候选

结论：工程精修与本机验证已完成；**G5合并门禁未关闭**。真实Android/HarmonyOS触控和性能、实物/色卡一致性没有证据，不能以桌面模拟代替。芯片探索为允许独立延期的P1。

| 项目 | 结果 | 实际证据与范围 |
|---|---|---|
| 原始规则/任务书/11附件、现有关键模块读取 | PASS | G0/G1与CHIP_EVIDENCE，附件保留私有 |
| 独立分支、冻结v1.0、保留M0–M4 | PASS | main基线af3bfea；feature/v1.1-material-fidelity |
| 31 ID/装配变换/拆解向量保护 | PASS | geometry-check与冻结M4逐项比对 |
| 10轮拆装/选中/透视/快速反向/重装 | PASS | browser-regression.json，最大坐标漂移0；浏览器内模拟交互 |
| 31部件树与档案对应 | PASS | 同上，31项实际点击 |
| 四色共用几何、中框截面/背盖/星环分层 | PASS | 20张最终截图+JSON；参数photo_inferred |
| 非相机裸机包络误差<1% | PASS | visual-metrics.json，宽.80%/长.10%/厚约0%；含键/端口 |
| 照片归一化关键点误差 | PASS（限照片估计） | 五中心点RMSE .0182机宽，不是实机测绘认证 |
| 摄影级实物/颜色/宝石与纤维一致性 | NOT_TESTED | 缺实物/色卡与实测BRDF；程序微纹理与色泽仍有可见差异 |
| 独立PBR族与颜色/法线/粗糙度通道 | PASS | 材料标准场景；确定性纹理/颜色空间代码检查 |
| 移除固定镜头亮片 | PASS | curved optics + PMREM；A/B特写；不认证真实光路 |
| 五环境/三质量档切换 | PASS | interaction-quality.json；高/低90秒性能未测 |
| 选中不透明其他部件/显式Xray | PASS | 实际材料opacity和状态对比 |
| OLED点亮/关闭 | PASS | 检查实际模型emissiveIntensity为0；恢复控制 |
| 20次变色+20次换机资源释放 | PASS | resources.json，无纹理持续增长；非长时内存压力认证 |
| 沉浸/面板恢复/10次视角中断 | PASS | 浏览器内检查，保留选择和拆装 |
| 390px布局与鼠标旋转/资料抽屉 | PASS（模拟视口） | mobile-390/details/interaction；无横向溢出；不等于真机触控 |
| 跨桌面/手机宽度的相机适配 | PASS | 断点切换时重新适配视距；移动截图为最终修正后 |
| WebGL失败仍可读事实/来源 | PASS（模拟失败） | no-webgl=1触发，8链接和完整事实仍可访问；非实际驱动故障实验 |
| PNG/JSON导出 | PASS | 实际下载；PNG含58830非透明像素、边角alpha0，JSON31部件 |
| 桌面1920×1080中画质90秒 | PASS（本机） | foreground-upgrade.json；GPU/Canvas/DPR/CPU/GPU分列 |
| 最小化自动化窗口对照 | PASS | G1原生窗口minimized，约1FPS，focus/visible仍可能报1 |
| 真手机30FPS/p95≤40ms与触控 | NOT_TESTED | HDC空列表；没有实际Android/HarmonyOS设备 |
| 低端GPU/长稳/实际上下文丢失恢复 | NOT_TESTED | 未执行，不以配置或模拟代替 |
| 独立芯片探索与返回状态恢复 | DEFERRED | C NOT_SHIPPED至v1.2，详见CHIP_EVIDENCE |
| 数值/图片版权分层 | PASS | 原始参考图未进入git/站点；无GHz/TSV等未确认数值混入官网事实 |
| Node/几何/静态构建 | PASS | 7项Node测试+几何/通道/法线检查+build；CI以PR当前SHA为准 |
| 合并/Pages v1.1发布 | DEFERRED | P0真实设备与实体一致性门禁未关闭；公开待审分支/PR，线上保留v1.0 |

浏览器验收与原生鼠标操作分别留证，均不能改写为真实触控或维修测绘验收。控制台出现过未定位来源的MutationObserver提示，未观察到应用初始化失败；验收脚本自身的语法错误已修正，最终测试输出为PASS。物理真实性与性能未知项不随CI通过而变为PASS。
