# G1 · 证据与性能基准

Done：16 个归一化关键点、误差区间及材料身份账本；90s无截图实际可见窗口静止/旋转/拆装采样；最小化自动化窗口对照；主线程阶段 trace 与原创 flame chart；统一相机 A/B 升级前截图。几何尚未改动。

## 测量结论

1920×1080，IAB Chromium、GPU/DPR/渲染分辨率见 JSON metadata。静止239.02、旋转239.98、拆装239.98 FPS；各阶段p95≈4.3ms、GPU p95≈2.2–2.33ms。页面焦点与可见覆盖率均1。该结论只覆盖这台机器与本次实际前台窗口，不外推到主流手机。

最小化 Chrome 对照为约1FPS，尽管页面focus/visibility也报1，CPU p95约2–2.6ms。原生窗口检查实际返回 minimized；恢复可见宿主窗口后可达240Hz。因此页面焦点不能独自证明正常前台状态。另一次标成background的IAB采样仍为240FPS、focus/visibility=1，不能算有效后台样本，保留为 mislabeled 原始证据。未改浏览器节流、安全或系统设置。

trace最多60000条，覆盖前约50秒；后续拆装的帧统计仍完整。flame chart是对应用阶段的手工埋点，不冒充Chrome DevTools完整CPU调用栈。采样中主要成本是render submission，均值约.50ms；无选中态的labels约.011ms，故不凭感觉重构交互热路径。GC接口不可用时为null；droppedFrames为相对中位帧周期的估计，不是系统合成器计数。

画质预算：low DPR≤1/纹理256/PMREM128、medium≤1.35/纹理512/PMREM256、high≤1.75/纹理1024/PMREM256；保持零后处理、透射默认关闭。先把开销投入几何曲面、独立微纹理和可控环境反射。

Not Done：没有真实Android/HarmonyOS触控与90秒测量。HDC list targets返回[Empty]；ADB二进制本机调用无有效设备输出。不能标真机PASS，G5不能据此合并。

Blockers：真机性能验收；四色完整实拍/材料光学实测缺失。照片推断继续带误差，模型内部继续 schematic。

Artifact：`docs/reference/EXTERIOR_CALIBRATION.md`、`calibration.json`、`REFERENCE_LEDGER.md`；`evidence/G1/*baseline.json`、`*-trace.json.gz`、`*-flame.svg`；`evidence/AB/v1.0-{back,side,camera}.png`。复现入口 `/tests/performance-benchmark/index.html` 与 `/tests/fidelity.html`；trace解压后可在Perfetto读取。

G1工程输入已建立，允许进入G2；实体真实性与真机门禁没有被该测量替代。
