# 性能记录 · 2026-10-28 UTC

环境：Windows 10/11 UA、Chromium156、ANGLE NVIDIA GeForce RTX5090 Laptop GPU / D3D11；页面1920×1080，实际Canvas1920×862，DPR≈1。原始JSON记录具体值，不把页面尺寸冒充Canvas尺寸。中画质，三段各30秒，采样期间无截图。真实原生宿主窗口置于前台；focus与visible覆盖率均1。

| 场景 | v1.0 FPS | v1.1 FPS | v1.1 p95帧ms | 1% low FPS | CPU p95ms | GPU p95ms |
|---|---:|---:|---:|---:|---:|---:|
| 静止 | 239.02 | 239.18 | 4.3 | 173.96 | .6 | 2.48 |
| 旋转 | 239.98 | 239.98 | 4.3 | 230.55 | .6 | 2.85 |
| 拆装 | 239.98 | 239.87 | 4.3 | 224.72 | .7 | 2.04 |

本机中画质桌面目标60FPS/p95≤25ms：PASS。不是主流手机认证。v1.0约120 draw calls/221448 triangles；v1.1为97–98 calls/228060–228380 triangles。calls减少约18%，三角形增加约3%，CPU与GPU均在本机预算内，多轮预热/调度差异另见原始记录。不能把所有差异单独归因于preserveDrawingBuffer，因为同时修改了材料/几何/界面。

v1.1 `preserveDrawingBuffer=false`；PNG在导出事件内重绘。low/medium/high切换的DPR与资源验证通过，但90秒目标只对中画质执行，高/低90秒长样本NOT_TESTED。无SSAO或多通道透射。

## 异常帧率的解释边界

G1最小化Chrome对照约1FPS，GPU采样并不繁忙；页面仍报告focus/visible=1。原生窗口工具明确确认窗口minimized；恢复可见宿主窗口后约240FPS。故此前1FPS不足以证明GPU场景只有1FPS，也不能仅靠document.hasFocus判断前台状态。

IAB另一次标签写background但focus/visible=1且240FPS，保留在`foreground-repeat-mislabeled.json`，**不当作有效后台测量**。有效对照为原生最小化Chrome自动化窗口。没有禁用浏览器节流/安全设置。

trace为应用阶段手工埋点，最多60000事件（约前50秒），三段帧统计仍完整；压缩trace可解压交给Perfetto。G1 SVG flame chart不是DevTools完整CPU调用栈。GPU为disjoint timer抽样，不是每帧精密计时。GC接口不可用，记录null/false；droppedFrames是相对中位周期的估计，不是OS合成器丢帧计数。

## 资源与移动端

20次变色稳定在20 textures；20次交替换机稳定在典藏版20/测试设备10 textures，几何96/20，未持续累积。后续截面微调的最终典藏版几何97、纹理仍20；结构小改造成的常数变化不等于泄漏。JS heap受trace及GC影响，不能据此宣称长期内存泄漏测试通过。

390×844是桌面响应式模拟，横向overflow=0；不是物理手机。HDC list targets返回[Empty]，无可用实际Android/HarmonyOS设备。真实触控、手机30FPS/p95≤40ms与低端GPU长稳：**NOT_TESTED，阻止G5合并**。

复现：`npm start` → `/tests/performance-benchmark/index.html`；确认原生窗口未最小化、未被遮挡，再点击“开始90秒”，期间禁止截图/切页。保存JSON并审查metadata、焦点/可见覆盖和实际窗口状态。`/tests/fidelity.html`可运行资源/画质检查。证据在`evidence/G1/`与`evidence/G5/foreground-shipment.json`。

最终表以shipment记录为准；earlier upgrade/final两轮也保留，均约239FPS。基线相机视距46，升级默认沉浸38，所以性能表不构成严格同像素负载的因果A/B。最终sourceTree指纹在local-verification.json和shipment记录中对应。
